'use client';

/**
 * سينما سلمية (Salamiyah Cinema) Architectural Language Toggle (src/components/ui/LanguageToggle.tsx)
 * - Placed inside the top Navbar / AccountBar right next to the Dark/Light Theme toggle.
 * - Sharp architectural segmented toggle button (`rounded-[2px]`, `border border-[#2E2E2E] dark:bg-[#141414]`)
 *   displaying both `عربي` (in bold Cairo) and `EN` (in Cinzel bold tracking) side by side.
 * - Active State: Solid `#FDB813` (Cinema Amber) background with `#0F0F0F` (Cinema Black) bold text.
 * - Inactive / Hover State: Muted text (`#A3A3A3`) transitioning to `#FDB813` text with a subtle
 *   `rgba(253, 184, 19, 0.1)` background tint on hover.
 */

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t('nav.lang.switch')}
      className={`inline-flex items-center rounded-[2px] border border-[#0F0F0F] dark:border-[#2E2E2E] bg-[#FFF8E7] dark:bg-[#141414] p-0.5 shrink-0 select-none ${className}`}
      dir="ltr"
    >
      <button
        type="button"
        onClick={() => setLang('ar')}
        aria-pressed={lang === 'ar'}
        title="العربية (RTL)"
        className={`px-2 sm:px-2.5 py-1 rounded-[2px] text-xs leading-none transition-all duration-150 cursor-pointer font-cairo ${
          lang === 'ar'
            ? 'bg-[#FDB813] text-[#0F0F0F] font-extrabold shadow-2xs'
            : 'text-[#525252] dark:text-[#A3A3A3] font-bold hover:text-[#0F0F0F] dark:hover:text-[#FDB813] hover:bg-[#FDB813]/10'
        }`}
      >
        عربي
      </button>

      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        title="English (LTR)"
        className={`px-2 sm:px-2.5 py-1 rounded-[2px] text-[11px] leading-none transition-all duration-150 cursor-pointer font-cinzel tracking-[0.18em] uppercase ${
          lang === 'en'
            ? 'bg-[#FDB813] text-[#0F0F0F] font-extrabold shadow-2xs'
            : 'text-[#525252] dark:text-[#A3A3A3] font-bold hover:text-[#0F0F0F] dark:hover:text-[#FDB813] hover:bg-[#FDB813]/10'
        }`}
      >
        EN
      </button>
    </div>
  );
}
