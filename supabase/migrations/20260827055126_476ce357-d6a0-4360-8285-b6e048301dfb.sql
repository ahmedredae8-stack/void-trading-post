CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 20),
  theme_id text NOT NULL DEFAULT 'bay',
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX players_name_lower_idx ON public.players (lower(name));

CREATE TABLE public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (requester_id <> addressee_id),
  UNIQUE (requester_id, addressee_id)
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.players(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_room_idx ON public.messages (recipient_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.players TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friendships TO anon, authenticated;
GRANT SELECT, INSERT ON public.messages TO anon, authenticated;
GRANT ALL ON public.players, public.friendships, public.messages TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "players readable" ON public.players FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "players insert" ON public.players FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "players update" ON public.players FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "friendships readable" ON public.friendships FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "friendships insert" ON public.friendships FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "friendships update" ON public.friendships FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "friendships delete" ON public.friendships FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "messages readable" ON public.messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "messages insert" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;