/**
 * سينما سلمية (Salamiyah Cinema) MovieCard & EventCard Components (src/components/content/Cards.tsx)
 * Delivered by Badr (Stage 1)
 * - Bilingual UI labels via `useLanguage()` while keeping dynamic DB payloads untouched
 * - Logical directional properties (`start-3`, `end-3`, `text-start`) for seamless RTL / LTR layout
 */

import React, { useState } from 'react';
import { CalendarClock, Clock, Film, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatDuration,
  formatSessionDate,
  getEventTypeLabel,
} from '../../lib/format';
import { EventItem, Movie } from '../../lib/types';
import { Badge, Button, Card } from '../ui/Kit';

export function MovieCard({
  movie,
  onSelect,
}: {
  movie: Movie;
  onSelect: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const { lang, t } = useLanguage();

  return (
    <Card interactive className="group overflow-hidden flex flex-col">
      <div
        onClick={() => onSelect(movie.id)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#0F0F0F] cursor-pointer border-b border-[#0F0F0F]/15 dark:border-[#2A2A2A]"
      >
        {movie.posterUrl && !imgError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1E1E1E] to-[#0F0F0F]">
            <Film className="w-10 h-10 text-[#FDB813] mb-3" />
            <span className="text-base font-extrabold text-white">
              {movie.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/25 to-transparent pointer-events-none" />

        {/* Top-start solid #FDB813 badge with #0F0F0F text */}
        <div className="absolute top-3 start-3">
          <Badge variant="amber">{movie.ageRating || 'G'}</Badge>
        </div>

        <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-xs text-white font-bold">
          <span>{movie.genre || t('details.kindMovie')}</span>
          <span
            className="text-[10px] font-cinzel-label text-[#FDB813]"
            dir="ltr"
          >
            NOW SHOWING
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5 text-start">
          <h3 className="text-base font-extrabold text-[#0F0F0F] dark:text-white line-clamp-1">
            <a
              href={`/movies/${movie.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(movie.id);
              }}
              className="hover:text-[#FDB813] transition-colors"
            >
              {movie.title}
            </a>
          </h3>

          <div className="flex items-center gap-2 text-xs text-[#525252] dark:text-[#A3A3A3]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FDB813]" />
              {formatDuration(movie.durationMinutes, lang)}
            </span>
            {movie.language && (
              <>
                <span aria-hidden="true">·</span>
                <span>{movie.language}</span>
              </>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-[#0F0F0F]/10 dark:border-[#2E2E2E] flex items-center justify-between gap-2">
          <div className="text-xs text-start min-w-0">
            <span className="block text-[#525252] dark:text-[#A3A3A3]">
              {t('home.nextSession')}
            </span>
            <span className="font-bold text-[#0F0F0F] dark:text-[#FDB813] truncate block font-mono-tabular">
              {movie.nextSession
                ? formatSessionDate(
                    movie.nextSession.startsAt,
                    new Date(),
                    lang
                  )
                : t('home.soon')}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onSelect(movie.id)}
          >
            {t('home.detailsAndBook')}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function EventCard({
  eventItem,
  onSelect,
}: {
  eventItem: EventItem;
  onSelect: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const { lang, t } = useLanguage();

  return (
    <Card interactive className="group overflow-hidden flex flex-col">
      <div
        onClick={() => onSelect(eventItem.id)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#0F0F0F] cursor-pointer border-b border-[#0F0F0F]/15 dark:border-[#2A2A2A]"
      >
        {eventItem.posterUrl && !imgError ? (
          <img
            src={eventItem.posterUrl}
            alt={eventItem.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1E1E1E] to-[#0F0F0F]">
            <Sparkles className="w-10 h-10 text-[#FDB813] mb-3" />
            <span className="text-base font-extrabold text-white">
              {eventItem.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/25 to-transparent pointer-events-none" />

        <div className="absolute top-3 start-3">
          <Badge variant="amber">
            {getEventTypeLabel(eventItem.type, lang)}
          </Badge>
        </div>

        <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-xs text-white font-bold">
          <span>{eventItem.ageRestriction || 'All Ages'}</span>
          <span
            className="text-[10px] font-cinzel-label text-[#FDB813]"
            dir="ltr"
          >
            LIVE STAGE
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5 text-start">
          <h3 className="text-base font-extrabold text-[#0F0F0F] dark:text-white line-clamp-1">
            <a
              href={`/events/${eventItem.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(eventItem.id);
              }}
              className="hover:text-[#FDB813] transition-colors"
            >
              {eventItem.title}
            </a>
          </h3>

          <div className="flex items-center gap-2 text-xs text-[#525252] dark:text-[#A3A3A3]">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FDB813]" />
              {formatDuration(eventItem.durationMinutes, lang)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{getEventTypeLabel(eventItem.type, lang)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#0F0F0F]/10 dark:border-[#2E2E2E] flex items-center justify-between gap-2">
          <div className="text-xs text-start min-w-0">
            <span className="block text-[#525252] dark:text-[#A3A3A3]">
              {t('home.nextDate')}
            </span>
            <span className="font-bold text-[#0F0F0F] dark:text-[#FDB813] truncate block font-mono-tabular">
              {eventItem.nextSession
                ? formatSessionDate(
                    eventItem.nextSession.startsAt,
                    new Date(),
                    lang
                  )
                : t('home.soon')}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(eventItem.id)}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>{t('home.bookEventNow')}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
