export type Plan = 'FREE' | 'BASIC' | 'PRO';
export type Page = 'home' | 'devotional' | 'saved' | 'settings';
export type Theme = 'light' | 'dark' | 'system';

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
