-- BLOCK 5: Permissions and Views
-- Run this after Block 4 in Supabase SQL Editor

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

-- Create views for common queries
CREATE OR REPLACE VIEW public.pending_users AS
SELECT 
  id, email, name, role, created_at
FROM public.users 
WHERE status = 'pending'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.approved_users AS
SELECT 
  id, email, name, role, is_online, last_seen, created_at
FROM public.users 
WHERE status = 'approved'
ORDER BY name;

CREATE OR REPLACE VIEW public.user_conversations AS
SELECT 
  c.id,
  c.participant_one,
  c.participant_two,
  c.last_message_at,
  u1.name as participant_one_name,
  u1.is_online as participant_one_online,
  u2.name as participant_two_name,
  u2.is_online as participant_two_online,
  m.encrypted_content as last_message_content,
  m.status as last_message_status
FROM public.conversations c
LEFT JOIN public.users u1 ON c.participant_one = u1.id
LEFT JOIN public.users u2 ON c.participant_two = u2.id
LEFT JOIN public.messages m ON c.last_message_id = m.id
ORDER BY c.last_message_at DESC NULLS LAST;

-- Final success message
DO $$
BEGIN
  RAISE NOTICE 'Defense Shield database setup completed successfully!';
  RAISE NOTICE 'Tables created: users, messages, conversations, audit_logs, user_sessions, encryption_keys';
  RAISE NOTICE 'Functions created: handle_new_user, log_user_action, approve_user, update_user_online_status';
  RAISE NOTICE 'Views created: pending_users, approved_users, user_conversations';
  RAISE NOTICE 'RLS policies and indexes configured for security and performance';
END $$;

-- Success message
SELECT 'Block 5 Complete' as status, 'Database setup completed successfully!' as message;