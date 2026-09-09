import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Moon, Sun } from "lucide-react";

import { IntroLoader } from "@/components/IntroLoader";
import { BackgroundShop } from "@/components/BackgroundShop";
import { TopHud } from "@/components/TopHud";
import { DailyReward } from "@/components/DailyReward";
import { QuestBoard } from "@/components/QuestBoard";
import { usePlayer } from "@/hooks/usePlayer";
import { saveThemeToAccount } from "@/lib/player";
import { isMuted, playSfx, setMuted, startAmbient, stopAllSounds } from "@/lib/sound";
import {
  currentPhase,
  defaultTheme,
  getScene,
  getTheme,
  hotspots,
  loadThemeId,
  msUntilNextPhase,
  phaseLabel,
  saveThemeId,
} from "@/lib/themes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "خليج الجزيرة — Island Bay" },
      {
        name: "description",
        content:
          "خليج حي بخلفيات فيديو متحركة ودورة نهار وليل كل ٦ ساعات، مع سوق السمك ومصنع السفن.",
      },
      { property: "og:title", content: "خليج الجزيرة — Island Bay" },
      {
        property: "og:description",
        content:
          "خليج حي بخلفيات فيديو متحركة ودورة نهار وليل كل ٦ ساعات، مع سوق السمك ومصنع السفن.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const actions = [
  { key: "house", src: "/img/house.png", label: "القرية" },
  { key: "stats", src: "/img/stats.png", label: "الإحصائيات" },
  { key: "chest", src: "/img/chest.png", label: "المخزن" },
  { key: "shop", src: "/img/shop.png", label: "المتجر" },
  { key: "quest", src: "/img/quest.png", label: "المهام" },
  { key: "skull", src: "/img/skull.png", label: "المعركة" },
  { key: "friends", src: "/img/friends.png", label: "الأصدقاء" },
];

function Index() {
  const navigate = useNavigate();
  const { player } = usePlayer();
  const [sound, setSound] = useState(true);
  const [intro, setIntro] = useState(true);
  const [themeId, setThemeId] = useState(defaultTheme.id);
  const [shopOpen, setShopOpen] = useState(false);
  const [questsOpen, setQuestsOpen] = useState(false);
  const [phase, setPhase] = useState(currentPhase());

  const theme = getTheme(themeId);
  const scene = getScene(theme, phase);

  useEffect(() => setThemeId(loadThemeId()), []);

  // Flip the world between day and night every six hours.
  useEffect(() => {
    const t = window.setTimeout(() => setPhase(currentPhase()), msUntilNextPhase() + 500);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (player?.theme_id) {
      setThemeId(player.theme_id);
      saveThemeId(player.theme_id);
    }
  }, [player?.theme_id]);

  const selectTheme = (id: string) => {
    setThemeId(id);
    saveThemeId(id);
    if (player) void saveThemeToAccount(player.id, id);
    setShopOpen(false);
  };

  const finishIntro = useCallback(() => setIntro(false), []);

  useEffect(() => {
    if (intro) return;
    const unlock = () => startAmbient();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    startAmbient();
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [intro]);

  useEffect(() => stopAllSounds, []);

  const toggleSound = () => {
    const next = isMuted();
    setMuted(!next);
    setSound(next);
    if (next) startAmbient();
  };

  return (
    <main className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[oklch(0.15_0.04_250)]">
      {/* Living scene: a looping video shot of the bay, cropped to always cover */}
      <div className="scene-stage">
        <video
          key={scene.video}
          className="scene-video"
          src={scene.video}
          poster={scene.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        {hotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            aria-label={h.label}
            className="hotspot"
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
            onPointerEnter={() => playSfx("hover", 0.3)}
            onClick={() => {
              playSfx("click", 0.75);
              void navigate({ to: h.to });
            }}
          >
            <span className="hotspot-ring" />
          </button>
        ))}
      </div>


      {/* Top HUD */}
      <div className="absolute inset-x-0 top-0 z-10 px-1 pt-[max(0.35rem,env(safe-area-inset-top))]">
        <TopHud name={player?.name ?? "قبطان"} />
      </div>

      {/* Controls */}
      <div className="absolute left-3 top-[max(4.5rem,calc(env(safe-area-inset-top)+4.2rem))] z-10 flex flex-col items-center gap-2">
        <Link
          to="/chat"
          aria-label="الدردشة"
          onClick={() => playSfx("click", 0.6)}
          className="ctl-btn"
        >
          <MessageCircle className="h-5 w-5" />
        </Link>
        <button type="button" onClick={toggleSound} aria-label={sound ? "كتم الصوت" : "تشغيل الصوت"} className="ctl-btn">
          <img src={sound ? "/img/sound-on.png" : "/img/sound-off.png"} alt="" className="h-6 w-6 object-contain" />
        </button>
        <span className="phase-chip">
          {phase === "day" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          {phaseLabel(phase)}
        </span>
      </div>

      {/* Bottom toolbar */}
      <nav className="absolute inset-x-0 bottom-0 z-10 dock px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <ul className="mx-auto flex max-w-3xl items-end justify-between gap-1 sm:gap-2">
          {actions.map((a, i) => (
            <li key={a.key} className="flex-1">
              <button
                type="button"
                aria-label={a.label}
                className="dock-btn"
                style={{ animationDelay: `${i * 0.25}s` }}
                onPointerEnter={() => playSfx("hover", 0.35)}
                onClick={() => {
                  playSfx("click", 0.75);
                  if (a.key === "shop") setShopOpen(true);
                  else if (a.key === "quest") setQuestsOpen(true);
                  else if (a.key === "chest") void navigate({ to: "/shipyard" });
                  else if (a.key === "stats") void navigate({ to: "/fish-market" });
                  else if (a.key === "friends") void navigate({ to: "/friends" });
                }}
              >
                <img src={a.src} alt="" className="h-full w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {shopOpen && <BackgroundShop activeId={themeId} onSelect={selectTheme} onClose={() => setShopOpen(false)} />}

      {questsOpen && (
        <div className="daily-overlay" role="dialog" aria-label="المهام اليومية">
          <div className="w-full max-w-md">
            <QuestBoard />
            <button
              type="button"
              onClick={() => {
                playSfx("click", 0.6);
                setQuestsOpen(false);
              }}
              className="daily-claim"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {!intro && <DailyReward />}

      {intro && <IntroLoader onDone={finishIntro} />}
    </main>
  );
}
