import { CaptainAvatar, nameSeed } from "@/components/GameSprite";

type Props = {
  name: string;
  avatar?: number;
  coins?: number;
  gems?: number;
  pearls?: number;
  fishFound?: number;
  fishTotal?: number;
  onAvatarClick?: () => void;
};

/** Original pirate HUD: pure CSS frame so every value sits inside its own slot on any screen. */
export function TopHud({
  name,
  avatar,
  coins = 125680,
  gems = 2450,
  pearls = 1280,
  fishFound = 27,
  fishTotal = 40,
  onAvatarClick,
}: Props) {
  const seed = avatar ?? nameSeed(name);
  const fmt = (n: number) => (n >= 10000 ? `${Math.round(n / 1000)}K` : n.toLocaleString("en-US"));

  const values = [
    { key: "coin", icon: "/img/coin.png", text: fmt(coins) },
    { key: "gem", icon: "/img/gem.png", text: fmt(gems) },
    { key: "pearl", icon: "/img/fish-pearl.png", text: fmt(pearls) },
    { key: "fish", icon: "/img/fish-tuna.png", text: `${fishFound}/${fishTotal}` },
  ];

  return (
    <div className="hud-bar" dir="ltr">
      <button type="button" className="hud-player" onClick={onAvatarClick} aria-label="حساب القبطان">
        <span className="hud-avatar">
          <CaptainAvatar seed={seed} className="hud-avatar-art" />
        </span>
        <span className="hud-id">
          <span className="hud-name">{name}</span>
          <span className="hud-level">
            <i style={{ width: "62%" }} />
          </span>
        </span>
      </button>

      <div className="hud-values">
        {values.map((v) => (
          <div key={v.key} className="hud-slot">
            <img src={v.icon} alt="" className="hud-ico" draggable={false} />
            <span className="hud-num">{v.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
