ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS avatar_index integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS players_username_norm_key ON public.players (username_norm) WHERE username_norm IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.tribes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  emblem text NOT NULL DEFAULT 'skull',
  motto text NOT NULL DEFAULT '',
  score integer NOT NULL DEFAULT 0,
  owner_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tribes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tribes TO authenticated;
GRANT ALL ON public.tribes TO service_role;
ALTER TABLE public.tribes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tribes readable" ON public.tribes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "tribes insert own" ON public.tribes FOR INSERT TO authenticated WITH CHECK (public.owns_player(owner_id));
CREATE POLICY "tribes update own" ON public.tribes FOR UPDATE TO authenticated USING (public.owns_player(owner_id)) WITH CHECK (public.owns_player(owner_id));
CREATE POLICY "tribes delete own" ON public.tribes FOR DELETE TO authenticated USING (public.owns_player(owner_id));

CREATE TABLE IF NOT EXISTS public.tribe_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tribe_id uuid NOT NULL REFERENCES public.tribes(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  rank text NOT NULL DEFAULT 'member',
  contribution integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (player_id)
);

GRANT SELECT ON public.tribe_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tribe_members TO authenticated;
GRANT ALL ON public.tribe_members TO service_role;
ALTER TABLE public.tribe_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_tribe_leader(_tribe_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tribes t
    WHERE t.id = _tribe_id AND public.owns_player(t.owner_id)
  );
$$;

CREATE POLICY "tribe members readable" ON public.tribe_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "tribe members join self" ON public.tribe_members FOR INSERT TO authenticated WITH CHECK (public.owns_player(player_id));
CREATE POLICY "tribe members update" ON public.tribe_members FOR UPDATE TO authenticated USING (public.owns_player(player_id) OR public.is_tribe_leader(tribe_id)) WITH CHECK (public.owns_player(player_id) OR public.is_tribe_leader(tribe_id));
CREATE POLICY "tribe members leave" ON public.tribe_members FOR DELETE TO authenticated USING (public.owns_player(player_id) OR public.is_tribe_leader(tribe_id));