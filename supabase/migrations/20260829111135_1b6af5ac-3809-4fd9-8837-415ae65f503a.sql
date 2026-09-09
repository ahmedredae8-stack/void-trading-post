
REVOKE EXECUTE ON FUNCTION public.owns_player(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_player(uuid) TO authenticated, service_role;
