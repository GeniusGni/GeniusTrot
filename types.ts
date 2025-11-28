export enum ArcanaType {
  MAJOR = 'Major Arcana',
  MINOR = 'Minor Arcana'
}

export enum Suit {
  WANDS = 'Wands',
  CUPS = 'Cups',
  SWORDS = 'Swords',
  PENTACLES = 'Pentacles',
  NONE = 'None' // For Major Arcana
}

export interface TarotCardData {
  id: number;
  name: string;
  englishName: string; // Added for file mapping
  suit: Suit;
  type: ArcanaType;
  number: number; // 0-21 for Major, 1-14 for Minor
}

export interface DrawnCard extends TarotCardData {
  isReversed: boolean;
  positionName: string; // e.g., "Past", "Present", "Future"
}

export interface AppState {
  step: 'intro' | 'input' | 'selecting' | 'revealing' | 'reading';
  question: string;
  selectedIndices: number[]; // Indices of cards selected from the full deck
  drawnCards: DrawnCard[];
  interpretation: string;
  isStreaming: boolean;
  cardBackUrl: string | null;
}