/**
 * سينما سلمية (Salamiyah Cinema) Admin Components (src/components/admin/AdminComponents.tsx)
 * Delivered by Badr (Stage 2)
 * Implements the exact Sidebar & Admin specification with Bilingual (AR RTL ↔ EN LTR) adaptation:
 * - Logical directional properties (`border-s-4`, `border-e`, `text-start`) so the 4px indicator bar
 *   and Sidebar drawer automatically flip sides in RTL vs LTR.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BarChart3,
  Calendar,
  Film,
  Grid,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldAlert,
  Sparkles,
  Ticket,
  Upload,
  X,
} from 'lucide-react';
import { useAuth } from '../../store/auth';
import { useLanguage } from '../../context/LanguageContext';
import type { TranslationKey } from '../../i18n/dictionary';
import { apiFetch } from '../../lib/client-api';
import { getEventTypeLabel } from '../../lib/format';
import {
  EventItem,
  EventType,
  Movie,
  UserRole,
} from '../../lib/types';
import {
  EventFormValues,
  MovieFormValues,
  eventFormSchema,
  mapValidationErrorsToFields,
  movieFormSchema,
  validateImageFile,
} from '../../lib/validation';
import { Button, Card, Input, Select, Textarea } from '../ui/Kit';
import { useToast } from '../ui/Toast';

// 1. StatCard
export function StatCard({
  label,
  value,
  subtext,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  subtext?: string;
  tone?: 'default' | 'success' | 'warning' | 'gold';
}) {
  const toneColors = {
    default: 'text-[#0F0F0F] dark:text-white',
    success: 'text-emerald-700 dark:text-emerald-400',
    warning: 'text-amber-700 dark:text-[#FFC940]',
    gold: 'text-[#0F0F0F] dark:text-[#FDB813]',
  };

  return (
    <Card className="p-5 text-start flex flex-col justify-between space-y-2 border-s-4 border-s-[#FDB813]">
      <span className="text-xs font-bold text-[#525252] dark:text-[#A3A3A3]">
        {label}
      </span>
      <span
        className={`text-xl sm:text-2xl font-extrabold font-mono-tabular whitespace-nowrap ${toneColors[tone]}`}
      >
        {value}
      </span>
      {subtext && (
        <span className="text-xs text-[#525252] dark:text-[#A3A3A3]">
          {subtext}
        </span>
      )}
    </Card>
  );
}

// 2. Admin Guard (403 Forbidden View)
export function Forbidden403View({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const { user, quickSwitchRole } = useAuth();
  const { lang, t } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="max-w-xl mx-auto my-16 px-4">
      <Card className="p-8 text-center space-y-5 border-red-500/40">
        <div className="w-14 h-14 rounded-[2px] bg-red-500/15 text-red-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono-tabular font-extrabold text-red-500">
            HTTP 403 · FORBIDDEN
          </span>
          <h1 className="text-2xl font-extrabold text-[#0F0F0F] dark:text-white">
            {lang === 'en'
              ? 'Access Denied — Admin Authorization Required'
              : 'غير مصرح لك بالوصول إلى لوحة إدارة سينما سلمية'}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A3A3A3] leading-relaxed">
            {lang === 'en' ? (
              <>
                This section is restricted to system administrators (
                <code className="font-mono">ADMIN</code>). Your current session
                role is{' '}
                <code className="font-mono font-bold text-[#FDB813]">
                  {user?.role || 'CUSTOMER'}
                </code>
                .
              </>
            ) : (
              <>
                هذه الصفحة مخصصة لمديري النظام فقط (
                <code className="font-mono">ADMIN</code>). حسابك الحالي مسجل
                بصلاحية{' '}
                <code className="font-mono font-bold text-[#FDB813]">
                  {user?.role || 'CUSTOMER'}
                </code>
                .
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => onNavigate('/')}>
            {t('ui.backHome')}
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              await quickSwitchRole(UserRole.ADMIN);
              toast({
                variant: 'success',
                title:
                  lang === 'en'
                    ? 'Switched to Admin account (ADMIN)'
                    : 'تم التبديل إلى حساب المدير (ADMIN)',
              });
            }}
          >
            {lang === 'en'
              ? 'Quick Switch to Admin (Test Mode)'
              : 'التبديل السريع إلى حساب مدير (للاختبار)'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// 3. AdminSidebar & Shell
const ADMIN_NAV_ITEMS: Array<{
  path: string;
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
  owner: 'Badr';
}> = [
  {
    path: '/admin',
    labelKey: 'admin.nav.dashboard',
    icon: LayoutDashboard,
    owner: 'Badr',
  },
  {
    path: '/admin/movies',
    labelKey: 'admin.nav.movies',
    icon: Film,
    owner: 'Badr',
  },
  {
    path: '/admin/events',
    labelKey: 'admin.nav.events',
    icon: Sparkles,
    owner: 'Badr',
  },
  {
    path: '/admin/settings',
    labelKey: 'admin.nav.settings',
    icon: Settings,
    owner: 'Badr',
  },
];

export function AdminShell({
  currentPath,
  onNavigate,
  children,
}: {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // AdminGuard: verify role === ADMIN
  if (!user || user.role !== UserRole.ADMIN) {
    return <Forbidden403View onNavigate={onNavigate} />;
  }

  const renderLinks = () => (
    <nav aria-label={t('admin.brandTitle')} className="space-y-1.5">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/admin'
            ? currentPath === '/admin'
            : currentPath.startsWith(item.path);

        return (
          <a
            key={item.path}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              setDrawerOpen(false);
              onNavigate(item.path);
            }}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-[2px] text-sm transition-colors ${
              isActive
                ? 'bg-[#FDB813] text-[#0F0F0F] font-extrabold border-s-4 border-[#0F0F0F] dark:border-white'
                : 'text-[#525252] dark:text-[#A3A3A3] font-bold hover:text-[#0F0F0F] dark:hover:text-[#FDB813] hover:bg-[#FDB813]/[0.12] dark:hover:bg-[#FDB813]/[0.08]'
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#0F0F0F]' : ''
                }`}
              />
              <span>{t(item.labelKey)}</span>
            </span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile Drawer Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-[#0F0F0F]/15 dark:border-[#262626]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#FDB813]" />
          <span className="font-extrabold text-[#0F0F0F] dark:text-white">
            {t('admin.mobileHeader')}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          aria-label={t('admin.openMenu')}
        >
          <Menu className="w-4 h-4" />
          <span>{t('admin.openMenu')}</span>
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-xs flex"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="w-72 max-w-[85vw] bg-[#FFF8E7] dark:bg-[#141414] h-full p-5 space-y-6 border-e border-[#0F0F0F] dark:border-[#262626]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#0F0F0F]/15 dark:border-[#262626]">
              <span className="font-extrabold text-base text-[#0F0F0F] dark:text-[#FDB813]">
                {t('admin.brandTitle')}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t('ui.cancel')}
                className="p-1.5 rounded-[2px] text-[#A3A3A3] hover:text-[#FDB813]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderLinks()}
          </aside>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar: Dark charcoal surface (#141414) separated by #262626 border */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <div className="rounded-[2px] bg-[#FFF8E7] dark:bg-[#141414] border border-[#0F0F0F] dark:border-[#262626] p-4 space-y-4">
            <div className="px-2 pt-1 pb-3 border-b border-[#0F0F0F]/15 dark:border-[#262626] text-start">
              <p className="text-xs font-extrabold text-[#0F0F0F] dark:text-[#FDB813]">
                {t('admin.brandTitle')}
              </p>
              <p
                className="text-[10px] font-cinzel-label text-[#525252] dark:text-[#A3A3A3] mt-0.5"
                dir="ltr"
              >
                {t('admin.brandSub')}
              </p>
              <p className="text-sm font-bold text-[#0F0F0F] dark:text-white truncate mt-1.5">
                {user.fullName}
              </p>
            </div>
            {renderLinks()}
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div className="lg:col-span-9 min-w-0">{children}</div>
      </div>
    </div>
  );
}

// 4. Unified ContentForm (kind: "movie" | "event")
export function ContentForm({
  kind,
  initialMovie,
  initialEvent,
  onSuccess,
  onCancel,
}: {
  kind: 'movie' | 'event';
  initialMovie?: Movie | null;
  initialEvent?: EventItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const { lang, t } = useLanguage();
  const isEdit = Boolean(kind === 'movie' ? initialMovie : initialEvent);

  const [posterPreview, setPosterPreview] = useState<string>(
    (kind === 'movie' ? initialMovie?.posterUrl : initialEvent?.posterUrl) || ''
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const schema = kind === 'movie' ? movieFormSchema : eventFormSchema;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormValues & EventFormValues>({
    resolver: zodResolver(schema as never),
    defaultValues:
      kind === 'movie'
        ? {
            title: initialMovie?.title || '',
            description: initialMovie?.description || '',
            durationMinutes: initialMovie?.durationMinutes || 120,
            posterUrl: initialMovie?.posterUrl || '',
            trailerUrl: initialMovie?.trailerUrl || '',
            genre: initialMovie?.genre || 'دراما',
            language: initialMovie?.language || 'العربية',
            ageRating: initialMovie?.ageRating || '+12',
            isActive: initialMovie?.isActive ?? true,
          }
        : {
            title: initialEvent?.title || '',
            description: initialEvent?.description || '',
            type: initialEvent?.type || EventType.COMEDY,
            durationMinutes: initialEvent?.durationMinutes || 120,
            posterUrl: initialEvent?.posterUrl || '',
            trailerUrl: initialEvent?.trailerUrl || '',
            ageRestriction: initialEvent?.ageRestriction || 'جميع الأعمار',
            isActive: initialEvent?.isActive ?? true,
          },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const check = validateImageFile(file);
    if (!check.valid) {
      setUploadError(check.error || 'ملف غير صالح');
      return;
    }

    // Instant client preview
    const localPreview = URL.createObjectURL(file);
    setPosterPreview(localPreview);

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiFetch<{ url: string }>('/admin/uploads/image', {
        method: 'POST',
        body: formData,
      });
      setValue('posterUrl', res.url, { shouldValidate: true });
      setPosterPreview(res.url);
      toast({
        variant: 'success',
        title:
          lang === 'en'
            ? 'Poster image uploaded successfully'
            : 'تم رفع الصورة بنجاح',
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'فشل رفع الصورة إلى الخادم'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: MovieFormValues & EventFormValues) => {
    setBannerError(null);
    try {
      if (kind === 'movie') {
        const endpoint = initialMovie
          ? `/admin/movies/${initialMovie.id}`
          : '/admin/movies';
        const method = initialMovie ? 'PATCH' : 'POST';
        await apiFetch(endpoint, {
          method,
          body: {
            title: values.title,
            description: values.description || undefined,
            durationMinutes: Number(values.durationMinutes),
            posterUrl: values.posterUrl || undefined,
            trailerUrl: values.trailerUrl || undefined,
            genre: values.genre || undefined,
            language: values.language || undefined,
            ageRating: values.ageRating || undefined,
            isActive: Boolean(values.isActive),
          },
        });
      } else {
        const endpoint = initialEvent
          ? `/admin/events/${initialEvent.id}`
          : '/admin/events';
        const method = initialEvent ? 'PATCH' : 'POST';
        await apiFetch(endpoint, {
          method,
          body: {
            title: values.title,
            description: values.description || undefined,
            type: values.type,
            durationMinutes: Number(values.durationMinutes),
            posterUrl: values.posterUrl || undefined,
            trailerUrl: values.trailerUrl || undefined,
            ageRestriction: values.ageRestriction || undefined,
            isActive: Boolean(values.isActive),
          },
        });
      }

      toast({
        variant: 'success',
        title: isEdit
          ? lang === 'en'
            ? 'Changes saved successfully'
            : 'تم حفظ التعديلات بنجاح'
          : kind === 'movie'
            ? lang === 'en'
              ? 'Movie created successfully'
              : 'تمت إضافة الفيلم بنجاح'
            : lang === 'en'
              ? 'Event created successfully'
              : 'تمت إضافة الفعالية بنجاح',
      });
      onSuccess();
    } catch (err) {
      const mapped = mapValidationErrorsToFields(err, [
        'title',
        'description',
        'durationMinutes',
        'posterUrl',
        'trailerUrl',
        'genre',
        'language',
        'ageRating',
        'type',
        'ageRestriction',
      ]);
      Object.entries(mapped.fieldErrors).forEach(([field, msg]) => {
        setError(field as keyof MovieFormValues, {
          type: 'server',
          message: msg,
        });
      });
      if (mapped.bannerError) {
        setBannerError(mapped.bannerError);
      }
      toast({
        variant: 'error',
        title: lang === 'en' ? 'Failed to save record' : 'تعذر حفظ البيانات',
        description: mapped.bannerError || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {bannerError && (
        <div
          role="alert"
          className="p-3.5 rounded-[2px] border border-red-500/40 bg-red-500/10 text-xs font-bold text-red-500"
        >
          {bannerError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label={
              lang === 'en'
                ? kind === 'movie'
                  ? 'Movie Title *'
                  : 'Event Title *'
                : kind === 'movie'
                  ? 'عنوان الفيلم *'
                  : 'عنوان الفعالية *'
            }
            placeholder={
              kind === 'movie'
                ? 'مثال: رسائل من دمشق'
                : 'مثال: أمسية الكوميديا الارتجالية'
            }
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <Input
          label={
            lang === 'en'
              ? 'Duration (Minutes 1 - 600) *'
              : 'المدة الزمنية (بالدقائق 1 - 600) *'
          }
          type="number"
          min={1}
          max={600}
          error={errors.durationMinutes?.message}
          {...register('durationMinutes')}
        />

        {kind === 'movie' ? (
          <>
            <Input
              label={lang === 'en' ? 'Genre' : 'التصنيف الفني (Genre)'}
              placeholder="مثال: دراما · تشويق"
              error={errors.genre?.message}
              {...register('genre')}
            />
            <Input
              label={lang === 'en' ? 'Language' : 'اللغة'}
              placeholder="مثال: العربية"
              error={errors.language?.message}
              {...register('language')}
            />
            <Input
              label={lang === 'en' ? 'Age Rating' : 'التصنيف العمري (Age Rating)'}
              placeholder="مثال: +12 أو عائلي"
              error={errors.ageRating?.message}
              {...register('ageRating')}
            />
          </>
        ) : (
          <>
            <Select
              label={lang === 'en' ? 'Event Category *' : 'نوع الفعالية *'}
              error={errors.type?.message}
              options={Object.values(EventType).map((evType) => ({
                value: evType,
                label: getEventTypeLabel(evType, lang),
              }))}
              {...register('type')}
            />
            <div className="sm:col-span-2">
              <Input
                label={
                  lang === 'en'
                    ? 'Age Restriction'
                    : 'الفئة العمرية المسموحة (Age Restriction)'
                }
                placeholder="مثال: +16 أو جميع الأعمار"
                error={errors.ageRestriction?.message}
                {...register('ageRestriction')}
              />
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <Input
            label={
              lang === 'en'
                ? 'Trailer URL (YouTube or External)'
                : 'رابط الإعلان الترويجي (YouTube أو رابط خارجي)'
            }
            placeholder="https://www.youtube.com/watch?v=..."
            dir="ltr"
            error={errors.trailerUrl?.message}
            {...register('trailerUrl')}
          />
        </div>

        <div className="sm:col-span-2">
          <Textarea
            label={lang === 'en' ? 'Synopsis / Description' : 'الوصف التفصيلي'}
            placeholder="اكتب نبذة مشوقة عن القصة أو تفاصيل الفعالية..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </div>

      {/* Poster Upload Section with Instant Preview & Validation */}
      <div className="p-4 rounded-[2px] border border-[#0F0F0F]/25 dark:border-[#2E2E2E] bg-[#FFF8E7] dark:bg-[#141414] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label
              htmlFor="poster-upload-input"
              className="block text-sm font-bold text-[#0F0F0F] dark:text-white"
            >
              {lang === 'en'
                ? 'Poster Image'
                : 'صورة الملصق (Poster Image)'}
            </label>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-0.5">
              {lang === 'en'
                ? 'Allowed formats: JPG, PNG, WEBP · Max size: 3MB'
                : 'الصيغ المسموحة: JPG, PNG, WEBP · الحد الأقصى للحجم: 3MB'}
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[2px] cinema-btn-outline text-xs cursor-pointer shrink-0">
            <Upload className="w-4 h-4" />
            <span>
              {uploadingImage
                ? lang === 'en'
                  ? 'Uploading...'
                  : 'جاري الرفع...'
                : lang === 'en'
                  ? 'Choose Image File'
                  : 'اختيار صورة من الجهاز'}
            </span>
            <input
              id="poster-upload-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>

        {uploadError && (
          <p role="alert" className="text-xs font-bold text-red-500">
            {uploadError}
          </p>
        )}

        {posterPreview && (
          <div className="flex items-center gap-4 pt-2">
            <img
              src={posterPreview}
              alt="Poster Preview"
              className="w-16 h-22 object-cover rounded-[2px] border border-[#FDB813]"
            />
            <div className="text-xs text-[#525252] dark:text-[#A3A3A3]">
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? 'Poster ready' : 'الملصق جاهز للعرض'}
              </p>
              <p className="mt-0.5">
                {lang === 'en'
                  ? 'Image URL will be saved automatically with the record.'
                  : 'سيتم حفظ رابط الصورة تلقائياً مع السجل عند الحفظ.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Publish Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-[2px] accent-[#FDB813]"
          {...register('isActive')}
        />
        <span className="text-sm font-bold text-[#0F0F0F] dark:text-white">
          {lang === 'en'
            ? 'Publish immediately to public catalog (Published)'
            : 'نشر مباشرة على الصفحة الرئيسية للجمهور (Published)'}
        </span>
      </label>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0F0F0F]/15 dark:border-[#2E2E2E]">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('ui.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting || uploadingImage}
        >
          {isEdit ? t('ui.saveChanges') : t('ui.addAndSave')}
        </Button>
      </div>
    </form>
  );
}





