/**
 * سينما سلمية (Salamiyah Cinema) Public Customer Pages & Auth Screens (src/pages/PublicPages.tsx)
 * Delivered by Badr (Stages 1 & 2)
 * - Bilingual UI support (Arabic `ar` RTL ↔ English `en` LTR) via `useLanguage()`
 * - Dynamic DB payloads (movie/event titles, descriptions, user names) remain untouched
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Film,
  KeyRound,
  Search,
  Sparkles,
  Ticket,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../store/auth';
import { useLanguage } from '../../context/LanguageContext';
import { apiFetch } from '../../lib/client-api';
import {
  formatDuration,
  formatSessionDate,
} from '../../lib/format';
import {
  ApiError,
  EventItem,
  EventType,
  Movie,
  PaginatedResponse,
  UserRole,
} from '../../lib/types';
import {
  LoginFormValues,
  RegisterFormValues,
  loginSchema,
  mapValidationErrorsToFields,
  registerSchema,
} from '../../lib/validation';
import { EventCard, MovieCard } from '../content/Cards';
import { ContentDetails } from '../content/ContentDetails';
import { SALAMIYAH_LOGO_URL } from '../layout/Navbar';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Skeleton,
} from '../ui/Kit';
import { useToast } from '../ui/Toast';

// 1. Home Page
export function HomePage({
  initialQuery = '',
  onNavigate,
}: {
  initialQuery?: string;
  onNavigate: (path: string) => void;
}) {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qParam = searchQuery.trim()
        ? `?search=${encodeURIComponent(searchQuery.trim())}`
        : '';
      const eventQueryParts: string[] = [];
      if (searchQuery.trim()) {
        eventQueryParts.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }
      if (selectedEventType !== 'ALL') {
        eventQueryParts.push(`type=${encodeURIComponent(selectedEventType)}`);
      }
      const evtParam =
        eventQueryParts.length > 0 ? `?${eventQueryParts.join('&')}` : '';

      const [moviesRes, eventsRes] = await Promise.all([
        apiFetch<PaginatedResponse<Movie>>(`/movies${qParam}`),
        apiFetch<PaginatedResponse<EventItem>>(`/events${evtParam}`),
      ]);
      setMovies(moviesRes.items);
      setEvents(eventsRes.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('ui.errorTitle')
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedEventType, t]);

  useEffect(() => {
    document.title =
      lang === 'en'
        ? 'Salamiyah Cinema — سينما سلمية | Movies & Live Events'
        : 'سينما سلمية — SALAMIYAH CINEMA | الأفلام والفعاليات';
    loadCatalog();
  }, [loadCatalog, lang]);

  // Featured movie is the movie with the nearest upcoming session
  const featuredMovie = useMemo(
    () => movies.find((m) => m.nextSession) || movies[0] || null,
    [movies]
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-7 overflow-x-hidden">
      {/* Featured Movie Hero */}
      {loading && !featuredMovie ? (
        <Skeleton className="h-60 w-full rounded-[2px]" />
      ) : featuredMovie ? (
        <section
          aria-label={t('home.heroBadge')}
          className="relative rounded-[2px] overflow-hidden border-2 border-[#0F0F0F] dark:border-[#FDB813] bg-[#141414] text-white shadow-xl"
        >
          <div className="h-1.5 w-full clapper-bar" />
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between space-y-4 text-start z-10">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-extrabold">
                  <Badge variant="amber">{t('home.heroBadge')}</Badge>
                  <span className="text-[#FDB813]">
                    {featuredMovie.genre || t('details.kindMovie')}
                  </span>
                  <span aria-hidden="true" className="text-[#A3A3A3]">
                    ·
                  </span>
                  <span className="text-[#A3A3A3]">
                    {t('home.ratingLabel')} {featuredMovie.ageRating || 'G'}
                  </span>
                  <span
                    className="hidden sm:inline-block text-[10px] font-cinzel-label text-[#FDB813] ms-auto"
                    dir="ltr"
                  >
                    {t('home.heroHall')}
                  </span>
                </div>

                <h1
                  className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white"
                  style={{ textWrap: 'balance' }}
                >
                  {featuredMovie.title}
                </h1>

                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-2xl line-clamp-2">
                  {featuredMovie.description}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate(`/movies/${featuredMovie.id}`)}
                >
                  <Ticket className="w-4 h-4" />
                  <span>{t('home.bookNow')}</span>
                </Button>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#A3A3A3]">
                  <span className="inline-flex items-center gap-1.5 text-white font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#FDB813]" />
                    {formatDuration(featuredMovie.durationMinutes, lang)}
                  </span>
                  {featuredMovie.nextSession && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular font-bold text-[#FDB813]">
                        {t('home.nextSession')}{' '}
                        {formatSessionDate(
                          featuredMovie.nextSession.startsAt,
                          new Date(),
                          lang
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-48 sm:h-56 lg:h-auto lg:max-h-[260px] bg-[#0F0F0F]">
              {featuredMovie.posterUrl && (
                <img
                  src={featuredMovie.posterUrl}
                  alt={featuredMovie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
            </div>
          </div>
        </section>
      ) : null}

      {/* Search & Event Category Filter Bar */}
      <section
        aria-label={t('home.searchPlaceholder')}
        className="cinema-card p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              {t('home.searchPlaceholder')}
            </label>
            <Search className="w-4 h-4 text-[#FDB813] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="w-full ps-10 pe-4 py-2.5 text-sm cinema-input"
            />
          </div>

          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              {t('home.clearSearch')}
            </Button>
          )}
        </div>

        {/* Interactive Event Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-extrabold text-[#525252] dark:text-[#A3A3A3] shrink-0 me-1">
            {t('home.filterEvents')}
          </span>
          {[
            { value: 'ALL', label: t('home.filter.all') },
            { value: EventType.COMEDY, label: t('home.filter.comedy') },
            { value: EventType.CULTURAL, label: t('home.filter.cultural') },
            { value: EventType.FESTIVAL, label: t('home.filter.festival') },
            { value: EventType.LECTURE, label: t('home.filter.lecture') },
          ].map((tab) => {
            const active = selectedEventType === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedEventType(tab.value)}
                className={`px-3.5 py-1.5 rounded-[2px] text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                  active
                    ? 'bg-[#FDB813] text-[#0F0F0F] border-[#0F0F0F] dark:border-[#FDB813] font-extrabold'
                    : 'bg-[#FFFDF7] dark:bg-[#141414] text-[#525252] dark:text-[#A3A3A3] border-[#0F0F0F]/20 dark:border-[#2E2E2E] font-bold hover:border-[#FDB813] hover:text-[#0F0F0F] dark:hover:text-[#FDB813]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {error ? (
        <ErrorState message={error} onRetry={loadCatalog} />
      ) : (
        <>
          {/* Section 1: Now Showing Movies Grid */}
          <section id="movies" className="space-y-5 text-start">
            <div className="flex items-center justify-between border-b border-[#0F0F0F]/15 dark:border-[#2E2E2E] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-cinzel-label text-[#0F0F0F] dark:text-[#FDB813]"
                    dir="ltr"
                  >
                    {t('home.moviesOverline')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F0F0F] dark:text-white flex items-center gap-2.5 mt-0.5 font-cinema-heading">
                  <Film className="w-5 h-5 text-[#FDB813]" />
                  <span>{t('home.moviesHeading')}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] mt-0.5">
                  {t('home.moviesSubheading')}
                </p>
              </div>
              <Badge variant="amber">
                {movies.length} {t('home.moviesCountSuffix')}
              </Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-96 w-full" />
                ))}
              </div>
            ) : movies.length === 0 ? (
              <EmptyState
                title={t('home.noMoviesTitle')}
                description={t('home.noMoviesDesc')}
                actionLabel={
                  searchQuery ? t('home.showAllMovies') : undefined
                }
                onAction={searchQuery ? () => setSearchQuery('') : undefined}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={(id) => onNavigate(`/movies/${id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Section 2: Events Grid */}
          <section id="events" className="space-y-5 text-start pt-4">
            <div className="flex items-center justify-between border-b border-[#0F0F0F]/15 dark:border-[#2E2E2E] pb-3">
              <div>
                <span
                  className="text-[11px] font-cinzel-label text-[#0F0F0F] dark:text-[#FDB813]"
                  dir="ltr"
                >
                  {t('home.eventsOverline')}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F0F0F] dark:text-white flex items-center gap-2.5 mt-0.5 font-cinema-heading">
                  <Sparkles className="w-5 h-5 text-[#FDB813]" />
                  <span>{t('home.eventsHeading')}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] mt-0.5">
                  {t('home.eventsSubheading')}
                </p>
              </div>
              <Badge variant="amber">
                {events.length} {t('home.eventsCountSuffix')}
              </Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-96 w-full" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <EmptyState
                title={t('home.noEventsTitle')}
                description={t('home.noEventsDesc')}
                actionLabel={t('home. filterReset')}
                onAction={() => {
                  setSearchQuery('');
                  setSelectedEventType('ALL');
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <EventCard
                    key={evt.id}
                    eventItem={evt}
                    onSelect={(id) => onNavigate(`/events/${id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

// 2. Movie & Event Detail Page
export function ContentDetailPage({
  kind,
  id,
  onNavigate,
}: {
  kind: 'movie' | 'event';
  id: string;
  onNavigate: (path: string) => void;
}) {
  const { lang, t } = useLanguage();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [eventItem, setEventItem] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    setError(null);
    try {
      if (kind === 'movie') {
        const res = await apiFetch<Movie>(`/movies/${id}`);
        setMovie(res);
        document.title = `${res.title} — ${t('brand.name')}`;
      } else {
        const res = await apiFetch<EventItem>(`/events/${id}`);
        setEventItem(res);
        document.title = `${res.title} — ${t('brand.name')}`;
      }
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(err instanceof Error ? err.message : t('ui.errorTitle'));
      }
    } finally {
      setLoading(false);
    }
  }, [kind, id, t]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (notFound) {
    return (
      <NotFound404Page
        title={
          lang === 'en'
            ? 'The requested show was not found or has been archived'
            : kind === 'movie'
              ? 'الفيلم المطلوب غير موجود أو تم أرشفته'
              : 'الفعالية المطلوبة غير موجودة أو تم أرشفتها'
        }
        onNavigate={onNavigate}
      />
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState message={error} onRetry={fetchDetails} />
      </div>
    );
  }

  if (kind === 'movie' && movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentDetails
          kind="movie"
          title={movie.title}
          description={movie.description}
          durationMinutes={movie.durationMinutes}
          posterUrl={movie.posterUrl}
          trailerUrl={movie.trailerUrl}
          categoryLabel={movie.genre || 'Cinema'}
          language={movie.language}
          ageRating={movie.ageRating}
          sessions={movie.sessions || []}
          onBack={() => onNavigate('/')}
          onBookSession={(session) => onNavigate(`/booking/${session.id}`)}
        />
      </div>
    );
  }

  if (kind === 'event' && eventItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentDetails
          kind="event"
          title={eventItem.title}
          description={eventItem.description}
          durationMinutes={eventItem.durationMinutes}
          posterUrl={eventItem.posterUrl}
          trailerUrl={eventItem.trailerUrl}
          categoryLabel={eventItem.type}
          ageRating={eventItem.ageRestriction}
          sessions={eventItem.sessions || []}
          onBack={() => onNavigate('/')}
          onBookSession={(session) => onNavigate(`/booking/${session.id}`)}
        />
      </div>
    );
  }

  return null;
}

// 3. Login & Register Pages
export function AuthPage({
  mode,
  nextPath,
  onNavigate,
}: {
  mode: 'login' | 'register';
  nextPath?: string;
  onNavigate: (path: string) => void;
}) {
  const { login, register: registerUser } = useAuth();
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [bannerError, setBannerError] = useState<string | null>(null);

  const isLogin = mode === 'login';

  // Sanitize nextPath so it never points back to /login or /register
  const safeNextPath =
    nextPath &&
    !nextPath.startsWith('/login') &&
    !nextPath.startsWith('/register')
      ? nextPath
      : undefined;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues & RegisterFormValues>({
    resolver: zodResolver((isLogin ? loginSchema : registerSchema) as never),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  useEffect(() => {
    document.title = isLogin
      ? `${t('auth.loginTitle')} — ${t('brand.name')}`
      : `${t('auth.registerTitle')} — ${t('brand.name')}`;
    setBannerError(null);
  }, [isLogin, t]);

  const onSubmit = async (values: LoginFormValues & RegisterFormValues) => {
    setBannerError(null);
    try {
      if (isLogin) {
        const loggedUser = await login(values.email, values.password);
        toast({
          variant: 'success',
          title:
            lang === 'en'
              ? `Welcome back, ${loggedUser.fullName}`
              : `أهلاً بك في سينما سلمية، ${loggedUser.fullName}`,
        });
      } else {
        const createdUser = await registerUser({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phone: values.phone,
        });
        toast({
          variant: 'success',
          title:
            lang === 'en'
              ? `Account created, ${createdUser.fullName}`
              : `تم إنشاء حسابك بنجاح، ${createdUser.fullName}`,
        });
      }
      onNavigate(safeNextPath || '/');
    } catch (err) {
      const mapped = mapValidationErrorsToFields(err, [
        'fullName',
        'email',
        'password',
        'phone',
      ]);
      Object.entries(mapped.fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof RegisterFormValues, {
          type: 'server',
          message: msg,
        });
      });
      if (mapped.bannerError) {
        setBannerError(mapped.bannerError);
      }
    }
  };

  const fillDemoAccount = (role: UserRole) => {
    if (role === UserRole.ADMIN) {
      setValue('email', 'admin@cinemahub.sy');
      setValue('password', 'Admin123');
    } else {
      setValue('email', 'sara@example.com');
      setValue('password', 'Customer123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card className="overflow-hidden">
        <div className="h-1.5 w-full clapper-bar" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-start space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-[2px] bg-[#FDB813] text-[#0F0F0F] flex items-center justify-center">
                {isLogin ? (
                  <KeyRound className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
              </div>
              <img
                src={SALAMIYAH_LOGO_URL}
                alt={t('brand.name')}
                className="h-10 w-auto object-contain rounded-[2px] border border-[#0F0F0F] dark:border-[#FDB813]/50"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F0F0F] dark:text-white pt-1 font-cinema-heading">
              {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3]">
              {safeNextPath ? t('auth.loginRedirectHint') : t('auth.defaultHint')}
            </p>
          </div>

          {bannerError && (
            <div
              role="alert"
              className="p-3.5 rounded-[2px] border border-red-500/40 bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400 text-start"
            >
              {bannerError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {!isLogin && (
              <Input
                label={t('auth.fullName')}
                placeholder={t('auth.fullNamePlaceholder')}
                error={errors.fullName?.message}
                {...register('fullName')}
              />
            )}

            <Input
              label={t('auth.email')}
              type="email"
              dir="ltr"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label={t('auth.password')}
              type="password"
              dir="ltr"
              placeholder={isLogin ? '••••••••' : t('auth.passwordHint')}
              error={errors.password?.message}
              {...register('password')}
            />

            {!isLogin && (
              <Input
                label={t('auth.phone')}
                type="tel"
                dir="ltr"
                placeholder="+963 944 000 000"
                error={errors.phone?.message}
                {...register('phone')}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full mt-2"
            >
              {isLogin ? t('auth.submitLogin') : t('auth.submitRegister')}
            </Button>
          </form>

          {isLogin && (
            <div className="pt-4 border-t border-[#0F0F0F]/15 dark:border-[#2E2E2E] space-y-2.5 text-start">
              <span className="block text-xs font-bold text-[#525252] dark:text-[#A3A3A3]">
                {t('auth.demoAccounts')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoAccount(UserRole.CUSTOMER)}
                >
                  {t('auth.demoCustomer')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoAccount(UserRole.ADMIN)}
                >
                  {t('auth.demoAdmin')}
                </Button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#0F0F0F]/15 dark:border-[#2E2E2E] text-center text-xs text-[#525252] dark:text-[#A3A3A3]">
            {isLogin ? (
              <>
                {t('auth.noAccount')}{' '}
                <a
                  href={
                    safeNextPath
                      ? `/register?next=${encodeURIComponent(safeNextPath)}`
                      : '/register'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(
                      safeNextPath
                        ? `/register?next=${encodeURIComponent(safeNextPath)}`
                        : '/register'
                    );
                  }}
                  className="font-extrabold text-[#0F0F0F] dark:text-[#FDB813] hover:underline"
                >
                  {t('auth.createNewAccount')}
                </a>
              </>
            ) : (
              <>
                {t('auth.haveAccount')}{' '}
                <a
                  href={
                    safeNextPath
                      ? `/login?next=${encodeURIComponent(safeNextPath)}`
                      : '/login'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(
                      safeNextPath
                        ? `/login?next=${encodeURIComponent(safeNextPath)}`
                        : '/login'
                    );
                  }}
                  className="font-extrabold text-[#0F0F0F] dark:text-[#FDB813] hover:underline"
                >
                  {t('nav.login')}
                </a>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// 4. Not Found (404) View
export function NotFound404Page({
  title,
  onNavigate,
}: {
  title?: string;
  onNavigate: (path: string) => void;
}) {
  const { lang, t } = useLanguage();
  const displayTitle =
    title ||
    (lang === 'en'
      ? 'Requested Page Not Found (404)'
      : 'الصفحة المطلوبة غير موجودة (404)');

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <Card className="p-8 text-center space-y-5">
        <span className="text-xs font-mono-tabular font-extrabold text-[#FDB813]">
          HTTP 404 · NOT_FOUND
        </span>
        <h1 className="text-2xl font-extrabold text-[#0F0F0F] dark:text-white">
          {displayTitle}
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#A3A3A3]">
          {lang === 'en'
            ? 'Check the URL or return to the home page to browse currently showing movies and live events.'
            : 'تأكد من صحة الرابط أو عد إلى الصفحة الرئيسية لاستعراض الأفلام والفعاليات المتاحة في سينما سلمية.'}
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={() => onNavigate('/')}>
            {t('ui.backHome')}
          </Button>
        </div>
      </Card>
    </div>
  );
}







