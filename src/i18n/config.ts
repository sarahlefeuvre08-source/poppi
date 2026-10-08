import { en } from "@/i18n/en";
import { fr } from "@/i18n/fr";
import type { Locale, TranslationDictionary, TranslationKey, TranslationValue, TranslationVariables } from "@/i18n/types";

export const defaultLocale: Locale = "en";
export const supportedLocales = ["en", "fr"] as const;

function interpolate(template: string, variables: TranslationVariables = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in variables ? String(variables[key]) : match,
  );
}

export function translate(locale: Locale, key: TranslationKey, variables: TranslationVariables = {}) {
  const dictionary: TranslationDictionary = locale === "fr" ? fr : en;
  const localized = dictionary[key];
  const value: TranslationValue = localized ?? en[key];
  const template =
    typeof value === "string"
      ? value
      : new Intl.PluralRules(locale).select(Number(variables.count)) === "one"
        ? value.one
        : value.other;

  return interpolate(template, variables);
}
