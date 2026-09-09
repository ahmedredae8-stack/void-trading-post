import valleyDayVid from "@/assets/scenes/valley-day.mp4.asset.json";
import valleyDayImg from "@/assets/scenes/valley-day.jpg.asset.json";
import valleyNightVid from "@/assets/scenes/valley-night.mp4.asset.json";
import valleyNightImg from "@/assets/scenes/valley-night.jpg.asset.json";
import snowDayVid from "@/assets/scenes/snow-day.mp4.asset.json";
import snowDayImg from "@/assets/scenes/snow-day.jpg.asset.json";
import snowNightVid from "@/assets/scenes/snow-night.mp4.asset.json";
import snowNightImg from "@/assets/scenes/snow-night.jpg.asset.json";
import parisDayVid from "@/assets/scenes/paris-day.mp4.asset.json";
import parisDayImg from "@/assets/scenes/paris-day.jpg.asset.json";
import parisNightVid from "@/assets/scenes/paris-night.mp4.asset.json";
import parisNightImg from "@/assets/scenes/paris-night.jpg.asset.json";

export type Phase = "day" | "night";

export type Scene = { video: string; poster: string };

export type Theme = {
  id: string;
  name: string;
  day: Scene;
  night: Scene;
};

export const themes: Theme[] = [
  {
    id: "valley",
    name: "وادي الأزهار",
    day: { video: valleyDayVid.url, poster: valleyDayImg.url },
    night: { video: valleyNightVid.url, poster: valleyNightImg.url },
  },
  {
    id: "snow",
    name: "الخليج الثلجي",
    day: { video: snowDayVid.url, poster: snowDayImg.url },
    night: { video: snowNightVid.url, poster: snowNightImg.url },
  },
  {
    id: "paris",
    name: "باريس",
    day: { video: parisDayVid.url, poster: parisDayImg.url },
    night: { video: parisNightVid.url, poster: parisNightImg.url },
  },
];

export const defaultTheme = themes[0]!;

/** Six hours of daylight, six hours of night — a 12h world cycle. */
export const PHASE_MS = 6 * 60 * 60 * 1000;

export function currentPhase(now: number = Date.now()): Phase {
  return Math.floor(now / PHASE_MS) % 2 === 0 ? "day" : "night";
}

/** Milliseconds left before the world flips between day and night. */
export function msUntilNextPhase(now: number = Date.now()): number {
  return PHASE_MS - (now % PHASE_MS);
}

export function phaseLabel(p: Phase) {
  return p === "day" ? "النهار" : "الليل";
}

export function getScene(theme: Theme, phase: Phase): Scene {
  return phase === "day" ? theme.day : theme.night;
}

const KEY = "bay:theme";

export function loadThemeId(): string {
  if (typeof window === "undefined") return defaultTheme.id;
  try {
    const saved = window.localStorage.getItem(KEY);
    return themes.some((t) => t.id === saved) ? saved! : defaultTheme.id;
  } catch {
    return defaultTheme.id;
  }
}

export function saveThemeId(id: string) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
}

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) ?? defaultTheme;
}

/** Fixed points of interest inside the scene artwork (all worlds share the composition).
 *  x/y = center in %, w/h = invisible tap-area size in % of the stage. */
export const hotspots = [
  { id: "fish", to: "/fish-market", label: "سوق السمك", x: 13, y: 44, w: 26, h: 20 },
  { id: "ship", to: "/shipyard", label: "مصنع السفن", x: 82, y: 37, w: 30, h: 22 },
] as const;

