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

// Relative path to the asset folder (served from public root, accessible relatively)
export const CARD_BACK_URL = 'asset/card_back.jpg';

// Helper to get Local Image URLs based on the specific naming convention
// Example: asset/3_Major+Arcana+Tarot+Card.+Empress.jpg
export const getCardImageUrl = (card: TarotCardData): string => {
  const assetsPath = 'asset'; // Relative path
  
  // 1. Format the Type (Replace spaces with +)
  // "Major Arcana" -> "Major+Arcana"
  const typeStr = card.type.replace(/ /g, '+');

  // 2. Format the Name
  // For Major Arcana, based on the user's example "Empress" instead of "The Empress",
  // we strip "The ".
  let nameStr = card.englishName;
  
  if (card.type === ArcanaType.MAJOR) {
    nameStr = nameStr.replace(/^The\s+/, '');
  }

  // Replace all remaining spaces with +
  // "Ace of Wands" -> "Ace+of+Wands"
  nameStr = nameStr.replace(/ /g, '+');

  // 3. Construct filename
  // Format: [ID]_[Type]+Tarot+Card.+[Name].jpg
  // Matches: 3_Major+Arcana+Tarot+Card.+Empress.jpg
  const rawFilename = `${card.id}_${typeStr}+Tarot+Card.+${nameStr}.jpg`;

  // 4. Return relative path WITHOUT encoding (Literal + characters)
  return `${assetsPath}/${rawFilename}`;
};

export const SYSTEM_INSTRUCTION = `
Role: You are a mystical, wise, and empathetic Tarot Reader. 
You are performing a reading using the "Sacred Triangle" spread (Past, Present, Future).

Guidelines:
1.  **Strict Markdown Output:** You must follow the exact structure provided below.
2.  **No Fatalism:** Do not predict death, medical diagnoses, or unavoidable doom. Frame everything as guidance and potential energy.
3.  **Empowerment:** Focus on what the user can do or understand to navigate their situation.
4.  **Tone:** Mysterious, elegant, philosophical, yet clear and actionable.
5.  **Language:** Simplified Chinese (as requested in the prompt).

Output Format (Strictly adhere to this):

🔮 占卜问题： [Repeat Question] 🃏 使用牌阵： 圣三角牌阵

🎴 抽牌结果：

[Position Name]： [Card Name] ([正位/逆位])
牌面描述：[Brief visual description of the standard Rider-Waite imagery for this card]

[Position Name]： [Card Name] ([正位/逆位])
牌面描述：[Brief visual description]

[Position Name]： [Card Name] ([正位/逆位])
牌面描述：[Brief visual description]

✨ 深度解读：

[Card 1 Name]分析： [Deep analysis connecting the card to the question and its position]

[Card 2 Name]分析： [Deep analysis connecting the card to the question and its position]

[Card 3 Name]分析： [Deep analysis connecting the card to the question and its position]

[整体关联]： [Synthesize the reading. How do the cards interact? Are there elemental balances? Major Arcana dominance?]

💡 最终指引： [A profound, philosophical, yet actionable piece of advice]
`;