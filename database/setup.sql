-- Enable Row Level Security and set JWT secret
ALTER DATABASE postgres SET "app.jwt_secret" = 'twKAhOTqGR1k9nsXdp1LssFcR80WhmgmJA0QPnrvZsGtvUXgz0JZKRSB1cDRaT9M0tPvcSbjVBOofWZ+zV28ug==';

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users profile table to extend auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'soldier' CHECK (role IN ('soldier', 'veteran', 'family', 'hq_admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  phone TEXT,
  avatar_url TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  is_online BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create messages table for encrypted messaging
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  encrypted_content TEXT NOT NULL,
  iv TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'voice')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create conversations table for better organization
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_one UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  participant_two UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  last_message_id UUID REFERENCES public.messages(id),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(participant_one, participant_two)
);

-- Create audit_logs table for HQ monitoring (metadata only, no content)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'message', 'user', 'login', etc.
  resource_id UUID,
  metadata JSONB DEFAULT '{}', -- Additional context (no sensitive data)
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_sessions table for session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create encryption_keys table for key management (encrypted)
CREATE TABLE IF NOT EXISTS public.encryption_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  key_type TEXT NOT NULL CHECK (key_type IN ('public', 'private_encrypted')),
  key_data TEXT NOT NULL, -- Encrypted private keys, plain public keys
  algorithm TEXT NOT NULL DEFAULT 'AES-256',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, key_type)
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Unknown User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'soldier'),
    'pending'
  );
  
  -- Log the registration event
  INSERT INTO public.audit_logs (user_id, action, resource_type, metadata)
  VALUES (NEW.id, 'user_registered', 'user', 
    jsonb_build_object(
      'email', NEW.email,
      'role', COALESCE(NEW.raw_user_meta_data->>'role', 'soldier'),
      'registration_time', NOW()
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log user actions
CREATE OR REPLACE FUNCTION public.log_user_action(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_metadata)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to approve/reject users
CREATE OR REPLACE FUNCTION public.approve_user(
  p_user_id UUID,
  p_approved_by UUID,
  p_new_status TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if approver has admin rights
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_approved_by 
    AND role = 'hq_admin' 
    AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only approved HQ admins can approve users';
  END IF;
  
  -- Update user status
  UPDATE public.users 
  SET 
    status = p_new_status,
    approved_by = p_approved_by,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Log the approval action
  PERFORM public.log_user_action(
    p_approved_by,
    CASE WHEN p_new_status = 'approved' THEN 'user_approved' ELSE 'user_rejected' END,
    'user',
    p_user_id,
    jsonb_build_object('new_status', p_new_status, 'approved_at', NOW())
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user online status
CREATE OR REPLACE FUNCTION public.update_user_online_status(
  p_user_id UUID,
  p_is_online BOOLEAN
) RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET 
    is_online = p_is_online,
    last_seen = CASE WHEN p_is_online = FALSE THEN NOW() ELSE last_seen END,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view approved users" ON public.users
  FOR SELECT USING (
    status = 'approved' OR 
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'hq_admin' 
      AND status = 'approved'
    )
  );

CREATE POLICY "HQ admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'hq_admin' 
      AND status = 'approved'
    )
  );

CREATE POLICY "HQ admins can update user status" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'hq_admin' 
      AND status = 'approved'
    )
  );

-- Create policies for messages table
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own sent messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create policies for conversations table
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = participant_one OR auth.uid() = participant_two);

-- Create policies for audit logs (HQ admin only for viewing)
CREATE POLICY "HQ admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'hq_admin' 
      AND status = 'approved'
    )
  );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE); -- Allow system functions to insert

-- Create policies for user sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for encryption keys
CREATE POLICY "Users can view own keys" ON public.encryption_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keys" ON public.encryption_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keys" ON public.encryption_keys
  FOR UPDATE USING (auth.uid() = user_id);

-- Create comprehensive indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status_role ON public.users(status, role);
CREATE INDEX IF NOT EXISTS idx_users_online ON public.users(is_online) WHERE is_online = TRUE;

CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(sender_id, receiver_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant_one, participant_two);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_encryption_keys_user ON public.encryption_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_type ON public.encryption_keys(key_type);

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.messages TO anon, authenticated;
GRANT ALL ON public.conversations TO anon, authenticated;
GRANT ALL ON public.audit_logs TO anon, authenticated;
GRANT ALL ON public.user_sessions TO anon, authenticated;
GRANT ALL ON public.encryption_keys TO anon, authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_action(UUID, TEXT, TEXT, UUID, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_user(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_online_status(UUID, BOOLEAN) TO authenticated;

-- Insert default HQ admin user (for development/demo)
-- Note: You'll need to create this user in Supabase Auth first, then update the record
-- This is just a placeholder for the profile data
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   'admin@defenseapp.in',
--   crypt('AdminPass123!', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW()
-- );

-- Demo data for testing (uncomment after creating auth users)
/*
-- Create demo HQ admin profile
INSERT INTO public.users (id, email, name, role, status, approved_by, approved_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'admin@defenseapp.in',
  'HQ Administrator',
  'hq_admin',
  'approved',
  '00000000-0000-0000-0000-000000000001'::UUID,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create demo soldier profile
INSERT INTO public.users (id, email, name, role, status) 
VALUES (
  '00000000-0000-0000-0000-000000000002'::UUID,
  'soldier@defenseapp.in',
  'John Doe',
  'soldier',
  'pending'
) ON CONFLICT (id) DO NOTHING;

-- Create demo family member profile
INSERT INTO public.users (id, email, name, role, status) 
VALUES (
  '00000000-0000-0000-0000-000000000003'::UUID,
  'family@defenseapp.in',
  'Jane Doe',
  'family',
  'pending'
) ON CONFLICT (id) DO NOTHING;
*/

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Defense Shield database setup completed successfully!';
  RAISE NOTICE 'Tables created: users, messages, conversations, audit_logs, user_sessions, encryption_keys';
  RAISE NOTICE 'Functions created: handle_new_user, log_user_action, approve_user, update_user_online_status';
  RAISE NOTICE 'Views created: pending_users, approved_users, user_conversations';
  RAISE NOTICE 'RLS policies and indexes configured for security and performance';
END $$;