
UPDATE public.users 
SET 
  role = 'hq_admin',
  status = 'approved',
  approved_by = id,  -- Self-approved for first admin
  approved_at = NOW(),
  updated_at = NOW()
WHERE email = 'admin@defenseapp.com';  -- Change this to match your registration email

-- Verify the admin was created
SELECT 
  id,
  email,
  name,
  role,
  status,
  approved_at,
  created_at
FROM public.users 
WHERE email = 'admin@defenseapp.com';  -- Change this to match your registration email

-- Log the admin creation
INSERT INTO public.audit_logs (user_id, action, resource_type, metadata)
SELECT 
  id,
  'admin_created',
  'user',
  jsonb_build_object(
    'email', email,
    'role', role,
    'created_by', 'system_setup',
    'timestamp', NOW()
  )
FROM public.users 
WHERE email = 'admin@defenseapp.com';  -- Change this to match your registration email

-- Success message
SELECT 'Admin Creation' as status, 
       'HQ Admin account created successfully' as message,
       'You can now login with your admin email to approve other users' as next_step;