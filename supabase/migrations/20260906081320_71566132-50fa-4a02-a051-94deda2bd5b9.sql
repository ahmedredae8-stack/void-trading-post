REVOKE EXECUTE ON FUNCTION public.is_tribe_leader(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_tribe_leader(uuid) TO authenticated, service_role;