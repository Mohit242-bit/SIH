-- BLOCK 2: Functions and Triggers
-- Run this after Block 1 in Supabase SQL Editor

-- Create function to log user actions (must be created first)
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

-- Create function to approve/reject users (depends on log_user_action)
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

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
SELECT 'Block 2 Complete' as status, 'All functions and triggers created successfully' as message;