import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { NameGate } from "@/components/NameGate";
import { usePlayer } from "@/hooks/usePlayer";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "دخول القبطان — خليج الجزيرة" },
      {
        name: "description",
        content: "سجّل دخولك باسم قبطان وكلمة مرور للانضمام إلى دردشة خليج الجزيرة وقائمة الأصدقاء.",
      },
      { property: "og:title", content: "دخول القبطان — خليج الجزيرة" },
      {
        property: "og:description",
        content: "أنشئ حساب قبطانك وابدأ الإبحار في خليج الجزيرة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { player, loading, setPlayer } = usePlayer();
  const navigate = useNavigate();

  if (!loading && player) {
    void navigate({ to: "/", replace: true });
  }

  return (
    <main className="relative min-h-[100svh] bg-[oklch(0.17_0.04_250)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(60%_45%_at_80%_0%,color-mix(in_oklab,var(--sea-light)_28%,transparent),transparent),radial-gradient(50%_40%_at_10%_100%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent)]" />
      <div className="relative">
        {loading ? (
          <div className="flex min-h-[100svh] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[var(--gold)]" />
          </div>
        ) : (
          <NameGate onReady={(p) => { setPlayer(p); void navigate({ to: "/", replace: true }); }} />
        )}
      </div>
    </main>
  );
}
