export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444';

export const LANGUAGES = {
  uz: "O'zbek",
  en: "English",
  ru: "Русский",
} as const;

export type Language = keyof typeof LANGUAGES;

export const DEFAULT_LANGUAGE: Language = "uz";

