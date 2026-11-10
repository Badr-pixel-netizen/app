'use client';

/**
 * سينما سلمية (Salamiyah Cinema) Bilingual Language Context (src/context/LanguageContext.tsx)
 * - Manages `lang: "ar" | "en"` state via React 19 createContext() and useContext()
 * - Persists user choice in `localStorage.getItem("cinema_lang")` and `cinema_lang` cookie via `setLanguageCookie`
 * - Dynamically updates `document.documentElement.lang = lang` and `document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"`
 * - Switches primary typography between Arabic Kufic (`Cairo`) in `ar` and `Cinzel` / `Plus Jakarta Sans` in `en`
 * - Exposes strongly-typed `t(key)` helper for Client Components while keeping dynamic DB payloads untouched
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Language,
  TranslationKey,
  translate,
} from '../i18n/dictionary';
import { setLanguageCookie } from '../actions/language';

const LANG_STORAGE_KEY = 'cinema_lang';

interface LanguageContextValue {
  lang: Language;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  setLang: (nextLang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  initialLang = 'ar',
}: {
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const fromStorage = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (fromStorage === 'ar' || fromStorage === 'en') {
        return fromStorage;
      }
    }
    return initialLang;
  });

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';
  const isRTL = lang === 'ar';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    root.setAttribute('data-lang', lang);

    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }

    // Persist in `cinema_lang` cookie via lightweight Server Action / Cookie helper
    void setLanguageCookie(lang);
  }, [lang, dir]);

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang === 'en' ? 'en' : 'ar');
  }, []);

  const toggleLanguage = useCallback(() => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translate(lang, key),
    [lang]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir,
      isRTL,
      setLang,
      toggleLanguage,
      t,
    }),
    [lang, dir, isRTL, setLang, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}


