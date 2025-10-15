-- BLOCK 4: Performance Indexes
-- Run this after Block 3 in Supabase SQL Editor

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

-- Success message
SELECT 'Block 4 Complete' as status, 'All performance indexes created successfully' as message;