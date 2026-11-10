/**
 * سينما سلمية (Salamiyah Cinema) Shared ContentDetails & SessionList (src/components/content/ContentDetails.tsx)
 * Delivered by Badr (Stage 1 to 2)
 * - Bilingual UI labels via `useLanguage()` (Arabic `ar` RTL ↔ English `en` LTR)
 * - Logical directional properties so arrows, borders, and grids automatically flip in RTL vs LTR
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Play,
  Ticket,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  formatDamascusTime,
  formatDuration,
  formatMoney,
  getEventTypeLabel,
  getSessionAvailabilityState,
  getYouTubeEmbedUrl,
  groupSessionsByDamascusDay,
} from '../../lib/format';
import { SessionItem } from '../../lib/types';
import { Badge, Button, Card, EmptyState, Modal } from '../ui/Kit';

export interface ContentDetailsProps {
  kind: 'movie' | 'event';
  title: string;
  description: string | null;
  durationMinutes: number;
  posterUrl: string | null;
  trailerUrl?: string | null;
  categoryLabel: string;
  language?: string | null;
  ageRating: string | null;
  sessions: SessionItem[];
  onBack: () => void;
  onBookSession: (session: SessionItem) => void;
}

export function ContentDetails({
  kind,
  title,
  description,
  durationMinutes,
  posterUrl,
  trailerUrl,
  categoryLabel,
  language,
  ageRating,
  sessions,
  onBack,
  onBookSession,
}: ContentDetailsProps) {
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { lang, isRTL, t } = useLanguage();

  const dayGroups = useMemo(
    () => groupSessionsByDamascusDay(sessions, new Date(), lang),
    [sessions, lang]
  );

  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    () => dayGroups[0]?.dateKey || ''
  );

  const activeGroup =
    dayGroups.find((g) => g.dateKey === selectedDateKey) || dayGroups[0];

  const youtubeEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(trailerUrl),
    [trailerUrl]
  );

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-10">
      {/* Back navigation */}
      <div className="text-start">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#525252] dark:text-[#A3A3A3] hover:text-[#0F0F0F] dark:hover:text-[#FDB813] transition-colors cursor-pointer"
        >
          <BackIcon className="w-4 h-4 text-[#FDB813]" />
          <span>{t('details.backToCatalog')}</span>
        </button>
      </div>

      {/* Hero / Content Details Split */}
      <Card className="overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Poster Column */}
          <div className="lg:col-span-4">
            <div className="aspect-[3/4] w-full max-w-sm mx-auto rounded-[2px] overflow-hidden bg-[#0F0F0F] border-2 border-[#0F0F0F] dark:border-[#FDB813]">
              {posterUrl && !imgError ? (
                <img
                  src={posterUrl}
                  alt={title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1E1E1E] to-[#0F0F0F]">
                  <Film className="w-12 h-12 text-[#FDB813] mb-3" />
                  <span className="text-lg font-extrabold text-white">
                    {title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6 text-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-extrabold">
                <Badge variant="amber">
                  {kind === 'movie'
                    ? t('details.kindMovie')
                    : t('details.kindEvent')}
                </Badge>
                <span className="text-[#0F0F0F] dark:text-[#FDB813]">
                  {kind === 'event'
                    ? getEventTypeLabel(categoryLabel, lang)
                    : categoryLabel}
                </span>
                <span aria-hidden="true" className="text-[#A3A3A3]">
                  ·
                </span>
                <span className="text-[#525252] dark:text-[#A3A3A3]">
                  {t('details.ageRating')} {ageRating || 'G'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F0F0F] dark:text-white leading-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#525252] dark:text-[#A3A3A3]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FDB813]" />
                  <span>
                    {t('details.duration')}{' '}
                    {formatDuration(durationMinutes, lang)}
                  </span>
                </span>
                {language && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      {t('details.language')} {language}
                    </span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{t('brand.hall')}</span>
              </div>

              <p className="text-base text-[#222222] dark:text-[#D4D4D4] leading-relaxed max-w-3xl pt-2">
                {description || t('details.noDescription')}
              </p>
            </div>

            {/* Trailer & Quick Scroll to Sessions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#0F0F0F]/15 dark:border-[#2E2E2E]">
              {trailerUrl &&
                (youtubeEmbedUrl ? (
                  <Button
                    variant="outline"
                    onClick={() => setTrailerModalOpen(true)}
                  >
                    <Play className="w-4 h-4" />
                    <span>{t('details.watchTrailer')}</span>
                  </Button>
                ) : (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-[2px] cinema-btn-outline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t('details.watchTrailerExt')}</span>
                  </a>
                ))}

              <a
                href="#available-sessions"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-[2px] cinema-btn-primary"
              >
                <Ticket className="w-4 h-4" />
                <span>
                  {t('details.viewSessions')} ({sessions.length})
                </span>
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Sessions Section with Day Tabs */}
      <section id="available-sessions" className="space-y-6 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F0F0F] dark:text-white flex items-center gap-2.5 font-cinema-heading">
              <Calendar className="w-5 h-5 text-[#FDB813]" />
              <span>{t('details.sessionsHeading')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">
              {t('details.sessionsSubheading')}
            </p>
          </div>
        </div>

        {dayGroups.length === 0 ? (
          <EmptyState
            title={t('details.noSessionsTitle')}
            description={t('details.noSessionsDesc')}
          />
        ) : (
          <div className="space-y-6">
            {/* Day Tabs */}
            <div
              role="tablist"
              aria-label={t('details.sessionsHeading')}
              className="flex items-center gap-2 overflow-x-auto pb-2"
            >
              {dayGroups.map((group) => {
                const isSelected = activeGroup?.dateKey === group.dateKey;
                return (
                  <button
                    key={group.dateKey}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => setSelectedDateKey(group.dateKey)}
                    className={`px-4 py-2.5 rounded-[2px] border text-start transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FDB813] border-[#0F0F0F] dark:border-[#FDB813] text-[#0F0F0F] font-extrabold shadow-xs'
                        : 'bg-[#FFFDF7] dark:bg-[#141414] border-[#0F0F0F]/30 dark:border-[#2E2E2E] text-[#0F0F0F] dark:text-[#A3A3A3] hover:border-[#FDB813] dark:hover:text-[#FDB813]'
                    }`}
                  >
                    <span className="block text-sm font-extrabold">
                      {group.shortTitle}
                    </span>
                    <span
                      className={`block text-xs mt-0.5 ${
                        isSelected
                          ? 'text-[#0F0F0F]/80 font-bold'
                          : 'text-[#525252] dark:text-[#A3A3A3]'
                      }`}
                    >
                      {group.fullDate}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sessions List for Selected Day */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGroup?.sessions.map((session) => {
                const availability = getSessionAvailabilityState(session, lang);
                return (
                  <Card
                    key={session.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 text-start">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-extrabold font-mono-tabular text-[#0F0F0F] dark:text-white">
                          {formatDamascusTime(session.startsAt, lang)}
                        </span>
                        <Badge variant={availability.badgeTone}>
                          {availability.badgeText}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#525252] dark:text-[#A3A3A3]">
                        <span>{t('details.ticketPrice')}</span>
                        <span className="font-mono-tabular font-extrabold text-[#0F0F0F] dark:text-[#FDB813]">
                          {formatMoney(session.ticketPrice, 'SYP', lang)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{t('details.mainHall')}</span>
                      </div>

                      {availability.disabledReason && (
                        <p className="text-xs font-bold text-red-600 dark:text-red-400">
                          {availability.disabledReason}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Button
                        variant={availability.canBook ? 'primary' : 'outline'}
                        disabled={!availability.canBook}
                        onClick={() => onBookSession(session)}
                        className="w-full sm:w-auto"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>{t('details.bookSeats')}</span>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* YouTube Trailer Modal */}
      <Modal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={`${t('details.trailerModalTitle')} — ${title}`}
        size="lg"
      >
        {youtubeEmbedUrl && (
          <div className="aspect-video w-full rounded-[2px] overflow-hidden bg-black border border-[#2E2E2E]">
            <iframe
              src={youtubeEmbedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
