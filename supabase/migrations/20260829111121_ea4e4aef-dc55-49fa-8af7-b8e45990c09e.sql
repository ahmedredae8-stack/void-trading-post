
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS username_norm text;

CREATE UNIQUE INDEX IF NOT EXISTS players_user_id_key ON public.players(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS players_username_norm_key ON public.players(username_norm);

GRANT SELECT, INSERT, UPDATE ON public.players TO authenticated;
GRANT SELECT ON public.players TO anon;
GRANT ALL ON public.players TO service_role;

CREATE OR REPLACE FUNCTION public.owns_player(_player_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.players p WHERE p.id = _player_id AND p.user_id = auth.uid())
$$;

DROP POLICY IF EXISTS "players insert" ON public.players;
DROP POLICY IF EXISTS "players update" ON public.players;
CREATE POLICY "players insert own" ON public.players FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "players update own" ON public.players FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "messages insert" ON public.messages;
CREATE POLICY "messages insert own" ON public.messages FOR INSERT TO authenticated WITH CHECK (public.owns_player(sender_id));
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT SELECT ON public.messages TO anon;
GRANT ALL ON public.messages TO service_role;

DROP POLICY IF EXISTS "friendships insert" ON public.friendships;
DROP POLICY IF EXISTS "friendships update" ON public.friendships;
DROP POLICY IF EXISTS "friendships delete" ON public.friendships;
CREATE POLICY "friendships insert own" ON public.friendships FOR INSERT TO authenticated WITH CHECK (public.owns_player(requester_id));
CREATE POLICY "friendships update mine" ON public.friendships FOR UPDATE TO authenticated USING (public.owns_player(requester_id) OR public.owns_player(addressee_id)) WITH CHECK (public.owns_player(requester_id) OR public.owns_player(addressee_id));
CREATE POLICY "friendships delete mine" ON public.friendships FOR DELETE TO authenticated USING (public.owns_player(requester_id) OR public.owns_player(addressee_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friendships TO authenticated;
GRANT SELECT ON public.friendships TO anon;
GRANT ALL ON public.friendships TO service_role;
