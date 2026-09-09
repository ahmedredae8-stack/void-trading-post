export type Rarity = "common" | "rare" | "epic" | "legendary";

export type Ship = {
  id: string;
  name: string;
  img: string;
  price: number;
  currency: "coin" | "gem";
  rarity: Rarity;
  level: number;
  /** 1..10 */
  speed: number;
  cargo: number;
  crew: number;
  desc: string;
};

export const rarityLabel: Record<Rarity, string> = {
  common: "عادية",
  rare: "نادرة",
  epic: "ملحمية",
  legendary: "أسطورية",
};

export const ships: Ship[] = [
  {
    id: "skiff",
    name: "قارب الصياد",
    img: "/img/ship-1.png",
    price: 450,
    currency: "coin",
    rarity: "common",
    level: 1,
    speed: 2,
    cargo: 2,
    crew: 1,
    desc: "بداية كل قبطان — خفيف وسريع الإصلاح.",
  },
  {
    id: "trawler",
    name: "سفينة الجرّ الحمراء",
    img: "/img/ship-2.png",
    price: 3500,
    currency: "coin",
    rarity: "common",
    level: 3,
    speed: 4,
    cargo: 4,
    crew: 3,
    desc: "شِباك أوسع وصيد مضاعف في المياه الضحلة.",
  },
  {
    id: "cruiser",
    name: "الطرّاد البحري",
    img: "/img/ship-3.png",
    price: 10000,
    currency: "coin",
    rarity: "rare",
    level: 6,
    speed: 6,
    cargo: 6,
    crew: 5,
    desc: "رادار يكشف أسراب السمك النادرة قبل غيرك.",
  },
  {
    id: "yacht",
    name: "اليخت الملكي",
    img: "/img/ship-4.png",
    price: 50000,
    currency: "coin",
    rarity: "epic",
    level: 10,
    speed: 8,
    cargo: 8,
    crew: 8,
    desc: "رفاهية وسرعة — يفتح موانئ المدن الكبرى.",
  },
  {
    id: "galleon",
    name: "غاليون القراصنة",
    img: "/img/ship-5.png",
    price: 120,
    currency: "gem",
    rarity: "epic",
    level: 14,
    speed: 7,
    cargo: 9,
    crew: 12,
    desc: "مدافع جانبية ومخزن ضخم لغنائم المعارك.",
  },
  {
    id: "flagship",
    name: "سفينة العرش الذهبية",
    img: "/img/ship-6.png",
    price: 950,
    currency: "gem",
    rarity: "legendary",
    level: 20,
    speed: 10,
    cargo: 10,
    crew: 20,
    desc: "أسطورة الخليج — لا تُقهر في المياه المفتوحة.",
  },
];

export function fmt(n: number) {
  return n.toLocaleString("en-US");
}
