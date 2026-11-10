/**
 * CinemaHub Formatting & Damascus Timezone Utilities (src/lib/format.ts)
 * All dates from the API are UTC ISO strings and displayed in Asia/Damascus
 * with full bilingual support (Arabic `ar` RTL and English `en` LTR).
 */

import { EventType, SessionItem } from './types';
import type { Language } from '../i18n/dictionary';

export const DAMASCUS_TZ = 'Asia/Damascus';

/**
 * Formats a UTC ISO string into a readable date + time in Asia/Damascus.
 * Detects "اليوم" / "Today" and "غداً" / "Tomorrow" relative to Damascus calendar date.
 */
export function formatSessionDate(
  isoString: string,
  referenceNow: Date = new Date(),
  lang: Language = 'ar'
): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return lang === 'en' ? 'Invalid date' : 'تاريخ غير صالح';
  }

  const dayKey = getDamascusDateKey(date);
  const todayKey = getDamascusDateKey(referenceNow);

  const tomorrowDate = new Date(referenceNow.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowKey = getDamascusDateKey(tomorrowDate);

  const timeFormatted = formatDamascusTime(date, lang);

  if (dayKey === todayKey) {
    return lang === 'en' ? `Today ${timeFormatted}` : `اليوم ${timeFormatted}`;
  }
  if (dayKey === tomorrowKey) {
    return lang === 'en' ? `Tomorrow ${timeFormatted}` : `غداً ${timeFormatted}`;
  }

  const locale = lang === 'en' ? 'en-US' : 'ar-SY';
  const dateFormatted = new Intl.DateTimeFormat(locale, {
    timeZone: DAMASCUS_TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);

  return `${dateFormatted} · ${timeFormatted}`;
}

/**
 * Returns YYYY-MM-DD in Asia/Damascus timezone for reliable day grouping.
 */
export function getDamascusDateKey(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return 'invalid';

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: DAMASCUS_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((p) => p.type === 'year')?.value ?? '0000';
  const month = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${year}-${month}-${day}`;
}

/**
 * Formats time in Asia/Damascus with Arabic AM/PM (ص / م) or English AM/PM.
 */
export function formatDamascusTime(
  dateInput: Date | string,
  lang: Language = 'ar'
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '';

  const locale = lang === 'en' ? 'en-US' : 'ar-SY';
  return new Intl.DateTimeFormat(locale, {
    timeZone: DAMASCUS_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formats a Damascus day tab label (e.g., "اليوم · الإثنين 9 تشرين الثاني" or "Today · Monday, Nov 9").
 */
export function formatDamascusDayTab(
  dateKey: string,
  referenceNow: Date = new Date(),
  lang: Language = 'ar'
): { shortTitle: string; fullDate: string } {
  const [y, m, d] = dateKey.split('-').map(Number);
  // Construct noon UTC on that date so Damascus (+3) is guaranteed to be on the same calendar date
  const sampleDate = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));

  const todayKey = getDamascusDateKey(referenceNow);
  const tomorrowKey = getDamascusDateKey(
    new Date(referenceNow.getTime() + 24 * 60 * 60 * 1000)
  );

  const locale = lang === 'en' ? 'en-US' : 'ar-SY';
  const weekday = new Intl.DateTimeFormat(locale, {
    timeZone: DAMASCUS_TZ,
    weekday: 'long',
  }).format(sampleDate);

  const dayMonth = new Intl.DateTimeFormat(locale, {
    timeZone: DAMASCUS_TZ,
    day: 'numeric',
    month: 'short',
  }).format(sampleDate);

  if (dateKey === todayKey) {
    return {
      shortTitle: lang === 'en' ? 'Today' : 'اليوم',
      fullDate: `${weekday} ${dayMonth}`,
    };
  }
  if (dateKey === tomorrowKey) {
    return {
      shortTitle: lang === 'en' ? 'Tomorrow' : 'غداً',
      fullDate: `${weekday} ${dayMonth}`,
    };
  }
  return { shortTitle: weekday, fullDate: dayMonth };
}

/**
 * Groups an array of SessionItem by their calendar day in Asia/Damascus.
 */
export function groupSessionsByDamascusDay(
  sessions: SessionItem[],
  referenceNow: Date = new Date(),
  lang: Language = 'ar'
): Array<{
  dateKey: string;
  shortTitle: string;
  fullDate: string;
  sessions: SessionItem[];
}> {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  const groupsMap = new Map<string, SessionItem[]>();
  for (const s of sorted) {
    const key = getDamascusDateKey(s.startsAt);
    const existing = groupsMap.get(key) || [];
    existing.push(s);
    groupsMap.set(key, existing);
  }

  return Array.from(groupsMap.entries()).map(([dateKey, daySessions]) => {
    const { shortTitle, fullDate } = formatDamascusDayTab(
      dateKey,
      referenceNow,
      lang
    );
    return {
      dateKey,
      shortTitle,
      fullDate,
      sessions: daySessions,
    };
  });
}

/**
 * Formats decimal string money values ("15000.00") into clean SYP display.
 */
export function formatMoney(
  amountStr: string | number,
  currency: string = 'SYP',
  lang: Language = 'ar'
): string {
  const num =
    typeof amountStr === 'number' ? amountStr : Number.parseFloat(amountStr);
  const unit = currency === 'SYP' ? (lang === 'en' ? 'SYP' : 'ل.س') : currency;
  if (Number.isNaN(num)) return `0 ${unit}`;

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);

  return `${formatted} ${unit}`;
}

/**
 * Formats duration in minutes into Arabic or English hours & minutes.
 */
export function formatDuration(minutes: number, lang: Language = 'ar'): string {
  if (!minutes || minutes <= 0) return lang === 'en' ? '0m' : '0 د';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (lang === 'en') {
    if (hrs === 0) return `${mins} min`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  }
  if (hrs === 0) return `${mins} دقيقة`;
  if (mins === 0) return `${hrs} س`;
  return `${hrs} س و ${mins} د`;
}

/**
 * Maps EventType enum to localized label.
 */
export function getEventTypeLabel(
  type: EventType | string,
  lang: Language = 'ar'
): string {
  if (lang === 'en') {
    const enMap: Record<string, string> = {
      COMEDY: 'Comedy & Stand-up',
      CULTURAL: 'Cultural Night',
      FESTIVAL: 'Film Festival',
      LECTURE: 'Talk & Lecture',
      CONFERENCE: 'Conference',
      SPECIAL_SCREENING: 'Special Screening',
      OTHER: 'Special Event',
    };
    return enMap[type] || type;
  }

  const arMap: Record<string, string> = {
    COMEDY: 'كوميديا وستاند أب',
    CULTURAL: 'أمسية ثقافية',
    FESTIVAL: 'مهرجان سينمائي',
    LECTURE: 'ندوة ومحاضرة',
    CONFERENCE: 'مؤتمر',
    SPECIAL_SCREENING: 'عرض خاص',
    OTHER: 'فعالية متنوعة',
  };
  return arMap[type] || type;
}

/**
 * Extracts a clean YouTube embed URL if the link is from YouTube, or returns null if external.
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}?autoplay=1` : null;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
      }
    }
    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Computes seat availability status badge & booking button state for a session.
 */
export function getSessionAvailabilityState(
  session: SessionItem,
  lang: Language = 'ar'
): {
  badgeText: string;
  badgeTone: 'success' | 'warning' | 'danger' | 'neutral';
  canBook: boolean;
  disabledReason: string | null;
} {
  if (session.status === 'CANCELLED') {
    return {
      badgeText: lang === 'en' ? 'Cancelled' : 'ملغى',
      badgeTone: 'danger',
      canBook: false,
      disabledReason:
        lang === 'en'
          ? 'This session has been cancelled'
          : 'تم إلغاء هذا العرض',
    };
  }
  if (session.status === 'COMPLETED') {
    return {
      badgeText: lang === 'en' ? 'Completed' : 'انتهى العرض',
      badgeTone: 'neutral',
      canBook: false,
      disabledReason:
        lang === 'en' ? 'This session has ended' : 'انتهى وقت هذا العرض',
    };
  }
  if (session.availableSeatsCount <= 0) {
    return {
      badgeText: lang === 'en' ? 'Sold Out' : 'نفدت المقاعد',
      badgeTone: 'danger',
      canBook: false,
      disabledReason:
        lang === 'en'
          ? 'All seats for this session are sold out'
          : 'نفدت جميع المقاعد المتاحة لهذا العرض',
    };
  }
  if (!session.isBookable) {
    return {
      badgeText:
        lang === 'en'
          ? `${session.availableSeatsCount} Seats Left`
          : `${session.availableSeatsCount} مقعد متاح`,
      badgeTone: 'neutral',
      canBook: false,
      disabledReason:
        lang === 'en'
          ? 'Booking is currently closed (outside booking window)'
          : 'الحجز مغلق حالياً (خارج نافذة الحجز أو بدأ العرض)',
    };
  }
  if (session.availableSeatsCount < 10) {
    return {
      badgeText:
        lang === 'en'
          ? `Last Seats (${session.availableSeatsCount})`
          : `آخر المقاعد (${session.availableSeatsCount})`,
      badgeTone: 'warning',
      canBook: true,
      disabledReason: null,
    };
  }
  return {
    badgeText:
      lang === 'en'
        ? `${session.availableSeatsCount} Seats Available`
        : `${session.availableSeatsCount} مقعد متاح`,
    badgeTone: 'success',
    canBook: true,
    disabledReason: null,
  };
}
