import type { en } from "@/i18n/en";

export type Locale = "en" | "fr";
export type PluralTranslation = { one: string; other: string };
export type TranslationValue = string | PluralTranslation;
export type TranslationKey = keyof typeof en;
export type TranslationVariables = Record<string, string | number>;
export type TranslationDictionary = Partial<Record<TranslationKey, TranslationValue>>;
