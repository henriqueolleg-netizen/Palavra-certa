
export type Plan = 'FREE' | 'BASIC' | 'PRO';

export interface VerseResponse {
  verse: string;
  text: string;
  reflection: string;
}

export interface SavedVerse extends VerseResponse {
  savedAt: string;
}

export interface SearchHistoryItem {
  feeling: string;
  timestamp: string;
}
