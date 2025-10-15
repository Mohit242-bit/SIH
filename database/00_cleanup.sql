-- Cleanup script to handle existing tables
-- Run this FIRST before running the other blocks

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_is_online;
DROP INDEX IF EXISTS idx_conversations_participants;
DROP INDEX IF EXISTS idx_conversations_created_at;
DROP INDEX IF EXISTS idx_messages_conversation_id;
DROP INDEX IF EXISTS idx_messages_sender_id;
DROP INDEX IF EXISTS idx_messages_created_at;
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_audit_logs_action;
DROP INDEX IF EXISTS idx_audit_logs_created_at;
DROP INDEX IF EXISTS idx_user_sessions_user_id;
DROP INDEX IF EXISTS idx_user_sessions_is_active;
DROP INDEX IF EXISTS idx_encryption_keys_user_id;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS log_user_action(UUID, TEXT, JSONB) CASCADE;

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS encryption_keys CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Clean up any existing RLS policies
-- (This will happen automatically when tables are dropped)

SELECT 'Cleanup completed successfully' as status;