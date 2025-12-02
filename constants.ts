import { ArcanaType, Suit, TarotCardData } from './types';

// Helper to generate the 78 cards
const generateDeck = (): TarotCardData[] => {
  const deck: TarotCardData[] = [];
  let id = 0;

  // Major Arcana (CN & EN)
  const majors = [
    { cn: "愚人", en: "The Fool" },
    { cn: "魔术师", en: "The Magician" },
    { cn: "女祭司", en: "The High Priestess" },
    { cn: "皇后", en: "The Empress" },
    { cn: "皇帝", en: "The Emperor" },
    { cn: "教皇", en: "The Hierophant" },
    { cn: "恋人", en: "The Lovers" },
    { cn: "战车", en: "The Chariot" },
    { cn: "力量", en: "Strength" },
    { cn: "隐士", en: "The Hermit" },
    { cn: "命运之轮", en: "Wheel of Fortune" },
    { cn: "正义", en: "Justice" },
    { cn: "倒吊人", en: "The Hanged Man" },
    { cn: "死神", en: "Death" },
    { cn: "节制", en: "Temperance" },
    { cn: "恶魔", en: "The Devil" },
    { cn: "高塔", en: "The Tower" },
    { cn: "星星", en: "The Star" },
    { cn: "月亮", en: "The Moon" },
    { cn: "太阳", en: "The Sun" },
    { cn: "审判", en: "Judgement" },
    { cn: "世界", en: "The World" }
  ];

  majors.forEach((card, index) => {
    deck.push({
      id: id++,
      name: card.cn,
      englishName: card.en,
      suit: Suit.NONE,
      type: ArcanaType.MAJOR,
      number: index
    });
  });

  // Minor Arcana (CN & EN)
  const suits = [
    { type: Suit.WANDS, cn: "权杖", en: "Wands" },
    { type: Suit.CUPS, cn: "圣杯", en: "Cups" },
    { type: Suit.SWORDS, cn: "宝剑", en: "Swords" },
    { type: Suit.PENTACLES, cn: "星币", en: "Pentacles" }
  ];
  
  const ranks = [
    { cn: "一", en: "Ace" },
    { cn: "二", en: "Two" },
    { cn: "三", en: "Three" },
    { cn: "四", en: "Four" },
    { cn: "五", en: "Five" },
    { cn: "六", en: "Six" },
    { cn: "七", en: "Seven" },
    { cn: "八", en: "Eight" },
    { cn: "九", en: "Nine" },
    { cn: "十", en: "Ten" },
    { cn: "侍从", en: "Page" },
    { cn: "骑士", en: "Knight" },
    { cn: "皇后", en: "Queen" },
    { cn: "国王", en: "King" }
  ];

  suits.forEach(suitData => {
    ranks.forEach((rankData, index) => {
      deck.push({
        id: id++,
        name: `${suitData.cn}${rankData.cn}`, // e.g., 权杖一
        englishName: `${rankData.en} of ${suitData.en}`, // e.g., Ace of Wands
        suit: suitData.type,
        type: ArcanaType.MINOR,
        number: index + 1
      });
    });
  });

  return deck;
};

export const FULL_DECK = generateDeck();

export const SPREAD_POSITIONS = [
  { name: "过去 / 缘起", id: "past" },
  { name: "现在 / 现状", id: "present" },
  { name: "未来 / 结果", id: "future" }
];

// =========================================================================================
// ⚠️ GITHUB BLOB URL (Raw Mode)
// =========================================================================================
const GITHUB_ASSET_BASE = 'https://github.com/GeniusGni/GeniusTrot/blob/main/public/asset';

// We append ?raw=true to make the blob URL serve the actual image file
export const CARD_BACK_URL = `${GITHUB_ASSET_BASE}/card_back.jpg?raw=true`;

// EXACT FILENAME MAPPING
// Maps the 'englishName' from our deck data to the specific filename provided by the user.
const CARD_FILENAME_MAPPING: Record<string, string> = {
  // Major Arcana
  "The Fool": "0_Major+Arcana+Tarot+Card.+Fool.jpg",
  "The Magician": "1_Major+Arcana+Tarot+Card.+Magician.jpg",
  "The High Priestess": "2_Major+Arcana+Tarot+Card.+High+Priestess.jpg",
  "The Empress": "3_Major+Arcana+Tarot+Card.+Empress.jpg",
  "The Emperor": "4_Major+Arcana+Tarot+card.+Emperor.jpg",
  "The Hierophant": "5_Major+Arcana+Tarot+Card.+Hierophant.jpg",
  "The Lovers": "6_Major+Arcana+Tarot+card.+Lovers.jpg",
  "The Chariot": "7_Major+Arcana+Tarot+card.+Chariot.jpg",
  "Justice": "8_Major+Arcana+Tarot+card.+Justice.jpg",
  "The Hermit": "9_Major+Arcana+Tarot+card.+Hermit.jpg",
  "Wheel of Fortune": "10_Major+Arcana+Tarot+Card.+Wheel+of+Fortune.jpg",
  "Strength": "11_Major+Arcana+Tarot+Card.+Strength.jpg",
  "The Hanged Man": "12_Major+Arcana+Tarot+Card.+The+Hanged+Man.jpg",
  "Death": "13_Major+Arcana+Tarot+Card.+Death.jpg",
  "Temperance": "14_Major+Arcana+Tarot+Card.+Temperance.jpg",
  "The Devil": "15_Major+Arcana+Tarot+Card.+Devil.jpg",
  "The Tower": "16_Major+Arcana+Tarot+Card.+Tower.jpg",
  "The Star": "17_Major+Arcana+Tarot+Card.+Star.jpg",
  "The Moon": "18_Major+Arcana+Tarot+Card.+Moon.jpg",
  "The Sun": "19_Major+Arcana+Tarot+Card.+Sun.jpg",
  "Judgement": "20_Major+Arcana+Tarot+Card.+Judgement.jpg",
  "The World": "21_Major+Arcana+Tarot+Card.+World.jpg",

  // Swords
  "Ace of Swords": "22_Minor+Arcana+Tarot+Card.+Ace+of+Swords.jpg",
  "King of Swords": "23_Minor+Arcana+Tarot+Card.+King+of+Swords.jpg",
  "Queen of Swords": "24_Minor+Arcana+Tarot+Card.+Queen+of+Swords.jpg",
  "Knight of Swords": "25_Minor+Arcana+Tarot+Card.+Knight+of+Swords.jpg",
  "Page of Swords": "26_Minor+Arcana+Tarot+Card.+Page+of+Swords.jpg",
  "Two of Swords": "27_Minor+Arcana+Tarot+Card.+Two+of+Swords.jpg",
  "Three of Swords": "28_Minor+Arcana+Tarot+Card.+Three+of+Swords.jpg",
  "Four of Swords": "29_Minor+Arcana+Tarot+Card.+Four+of+Swords.jpg",
  "Five of Swords": "30_Minor+Arcana+Tarot+Card.+Five+of+Swords.jpg",
  "Six of Swords": "31_Minor+Arcana+Tarot+Card.+Six+of+Swords.jpg",
  "Seven of Swords": "32_Minor+Arcana+Tarot+Card.+Seven+of+Swords.jpg",
  "Eight of Swords": "33_Minor+Arcana+Tarot+Card.+Eight+of+Swords.jpg",
  "Nine of Swords": "34_Minor+Arcana+Tarot+Card.+Nine+of+Swords.jpg",
  "Ten of Swords": "35_Minor+Arcana+Tarot+Card.+Ten+of+Swords.jpg",

  // Wands
  "Ten of Wands": "36_Minor+Arcana+Tarot+Card.+Ten+of+Wands.jpg",
  "Ace of Wands": "37_Minor+Arcana+Tarot+Card.+Ace+of+Wands.jpg",
  "King of Wands": "38_Minor+Arcana+Tarot+Card.+King+of+Wands.jpg",
  "Queen of Wands": "39_Minor+Arcana+Tarot+Card.+Queen+of+Wands.jpg",
  "Knight of Wands": "40_Minor+Arcana+Tarot+Card.+Knight+of+Wands.jpg",
  "Page of Wands": "41_Minor+Arcana+Tarot+Card.+Page+of+Wands.jpg",
  "Eight of Wands": "41a_Minor+Arcana+Tarot+Card.+Eight+of+Wands.jpg", 
  "Nine of Wands": "42_Minor+Arcana+Tarot+Card.+Nine+of+Wands.jpg",
  "Seven of Wands": "43_Minor+Arcana+Tarot+Card.+Seven+of+Wands.jpg",
  "Six of Wands": "44_Minor+Arcana+Tarot+Card.+Six+of+Wands.jpg",
  "Five of Wands": "45_Minor+Arcana+Tarot+Card.+Five+of+Wands.jpg",
  "Four of Wands": "46_Minor+Arcana+Tarot+Card.+Four+of+Wands.jpg",
  "Three of Wands": "47_Minor+Arcana+Tarot+Card.+Three+of+Wands.jpg",
  "Two of Wands": "48_Minor+Arcana+Tarot+Card.+Two+of+Wands.jpg",

  // Pentacles
  "Ace of Pentacles": "49_Minor+Arcana+Tarot+Card.+Ace+of+Pentacles.jpg",
  "King of Pentacles": "50_Minor+Arcana+Tarot+Card.+King+of+Pentacles.jpg",
  "Queen of Pentacles": "51_Minor+Arcana+Tarot+Card.+Queen+of+Pentacles.jpg",
  "Knight of Pentacles": "52_Minor+Arcana+Tarot+Card.+Knight+of+Pentacles.jpg",
  "Page of Pentacles": "53_Minor+Arcana+Tarot+Card.+Page+of+Pentacles.jpg",
  "Ten of Pentacles": "54_Minor+Arcana+Tarot+Card.+Ten+of+Pentacles.jpg",
  "Nine of Pentacles": "55_Minor+Arcana+Tarot+Card.+Nine+of+Pentacles.jpg",
  "Eight of Pentacles": "56_Minor+Arcana+Tarot+Card.+Eight+of+Pentacles.jpg",
  "Seven of Pentacles": "57_Minor+Arcana+Tarot+Card.+Seven+of+Pentacles.jpg",
  "Six of Pentacles": "58_Minor+Arcana+Tarot+Card.+Six+of+Pentacles.jpg",
  "Five of Pentacles": "59_Minor+Arcana+Tarot+Card.+Five+of+Pentacles.jpg",
  "Four of Pentacles": "60_Minor+Arcana+Tarot+Card.+Four+of+Pentacles.jpg",
  "Three of Pentacles": "61_Minor+Arcana+Tarot+Card.+Three+of+Pentacles.jpg",
  "Two of Pentacles": "62_Minor+Arcana+Tarot+Card.+Two+of+Pentacles.jpg",

  // Cups
  "Ace of Cups": "63_Minor+Arcana+Tarot+Card.+Ace+of+Cups.jpg",
  "Two of Cups": "64_Minor+Arcana+Tarot+Card.+Two+of+Cups.jpg",
  "Three of Cups": "65_Minor+Arcana+Tarot+Card.+Three+of+Cups.jpg",
  "Four of Cups": "66_Minor+Arcana+Tarot+Card.+Four+of+Cups.jpg",
  "Five of Cups": "67_Minor+Arcana+Tarot+Card.+Five+of+Cups.jpg",
  "Six of Cups": "68_Minor+Arcana+Tarot+Card.+Six+of+Cups.jpg",
  "Seven of Cups": "69_Minor+Arcana+Tarot+Card.+Seven+of+Cups.jpg",
  "Eight of Cups": "70_Minor+Arcana+Tarot+Card.+Eight+of+Cups.jpg",
  "Nine of Cups": "71_Minor+Arcana+Tarot+Card.+Nine+of+Cups.jpg",
  "Ten of Cups": "72_Minor+Arcana+Tarot+Card.+Ten+of+Cups.jpg",
  "Page of Cups": "73_Minor+Arcana+Tarot+Card.+Page+of+Cups.jpg",
  "Knight of Cups": "74_Minor+Arcana+Tarot+Card.+Knight+of+Cups.jpg",
  "Queen of Cups": "75_Minor+Arcana+Tarot+Card.+Queen+of+Cups.jpg",
  "King of Cups": "76_Minor+Arcana+Tarot+Card.+King+of+Cups.jpg"
};

export const getCardImageUrl = (card: TarotCardData): string => {
  const filename = CARD_FILENAME_MAPPING[card.englishName];
  if (!filename) {
    console.warn(`No image found for ${card.englishName}, using back.`);
    return CARD_BACK_URL;
  }
  return `${GITHUB_ASSET_BASE}/${filename}?raw=true`;
};

export const SYSTEM_INSTRUCTION = `You are a mystical and wise Tarot reader with centuries of experience.
Your role is to interpret the cards drawn by the seeker and provide profound guidance based on their positions (Past, Present, Future).

You should:
1. Acknowledge the question asked by the seeker with empathy.
2. Explain the meaning of each card in its specific position and orientation (Upright or Reversed).
3. Weave a narrative that connects the cards together to answer the question directly.
4. Maintain a tone that is enigmatic, poetic, yet supportive and empowering.
5. Use markdown formatting (bolding key terms) to structure your response clearly.
6. End with a short blessing or advice.`;
