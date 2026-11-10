/**
 * سينما سلمية (Salamiyah Cinema) Admin Content & Settings Pages (src/pages/AdminPages.tsx)
 * Delivered by Badr (Stage 2)
 * - Full Bilingual (AR RTL ↔ EN LTR) adaptation via `useLanguage()`
 * - Dynamic DB payloads (movie/event titles, customer names) remain untouched
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Archive,
  Edit3,
  Eye,
  EyeOff,
  Film,
  Plus,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { apiFetch } from '../../lib/client-api';
import {
  formatDuration,
  formatMoney,
  formatSessionDate,
  getEventTypeLabel,
} from '../../lib/format';
import {
  AdminSettings,
  EventItem,
  LatestReservationSummary,
  Movie,
  PaginatedResponse,
  ReservationStatus,
  StatsOverview,
  UpcomingSessionStat,
} from '../../lib/types';
import {
  SettingsFormValues,
  mapValidationErrorsToFields,
  settingsFormSchema,
} from '../../lib/validation';
import { ContentForm, StatCard } from '../admin/AdminComponents';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  ErrorState,
  Input,
  Modal,
  Pagination,
  Skeleton,
} from '../ui/Kit';
import { useToast } from '../ui/Toast';

// 1. /admin Dashboard Overview Page
export function AdminDashboardPage() {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<StatsOverview>('/admin/stats/overview');
      setStats(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ui.errorTitle'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    document.title = `${t('admin.nav.dashboard')} — ${t('brand.name')}`;
    loadStats();
  }, [loadStats, t]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <ErrorState
        message={error || t('ui.errorTitle')}
        onRetry={loadStats}
      />
    );
  }

  const upcomingColumns: DataTableColumn<UpcomingSessionStat>[] = [
    {
      key: 'title',
      header: t('admin.col.show'),
      render: (row) => (
        <span className="font-extrabold text-[#0F0F0F] dark:text-white">
          {row.title}
        </span>
      ),
    },
    {
      key: 'startsAt',
      header: t('admin.col.damascusTime'),
      render: (row) => (
        <span className="font-mono-tabular text-xs text-[#525252] dark:text-[#A3A3A3]">
          {formatSessionDate(row.startsAt, new Date(), lang)}
        </span>
      ),
    },
    {
      key: 'seats',
      header: t('admin.col.seatsBookedTotal'),
      align: 'center',
      render: (row) => (
        <span className="font-mono-tabular text-xs font-bold">
          {row.bookedSeats} / {row.totalSeats}{' '}
          {row.heldSeats > 0 && (
            <span className="text-[#FDB813]">
              ({row.heldSeats} {lang === 'en' ? 'held' : 'قيد الحجز'})
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'occupancy',
      header: t('admin.col.occupancy'),
      render: (row) => {
        const pct = Math.min(100, Math.max(0, row.occupancyPct));
        const barColor =
          pct >= 90
            ? 'bg-red-500'
            : pct >= 60
              ? 'bg-[#FDB813]'
              : 'bg-emerald-500';
        return (
          <div className="flex items-center gap-3 min-w-[150px]">
            <div className="flex-1 h-2.5 rounded-[2px] bg-[#E5DEC9] dark:bg-[#0F0F0F] border border-[#0F0F0F]/20 dark:border-[#2E2E2E] overflow-hidden">
              <div
                className={`h-full ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono-tabular text-xs font-extrabold w-10 text-end">
              {pct}%
            </span>
          </div>
        );
      },
    },
  ];

  const reservationStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return <Badge variant="success">{t('status.confirmed')}</Badge>;
      case ReservationStatus.PENDING:
        return <Badge variant="amber">{t('status.pending')}</Badge>;
      case ReservationStatus.CANCELLED:
        return <Badge variant="danger">{t('status.cancelled')}</Badge>;
      case ReservationStatus.EXPIRED:
        return <Badge variant="neutral">{t('status.expired')}</Badge>;
    }
  };

  const latestReservationsColumns: DataTableColumn<LatestReservationSummary>[] = [
    {
      key: 'code',
      header: t('admin.col.resCode'),
      render: (row) => (
        <span className="font-mono-tabular font-extrabold text-[#0F0F0F] dark:text-[#FDB813]">
          {row.reservationCode}
        </span>
      ),
    },
    {
      key: 'customer',
      header: t('admin.col.customer'),
      render: (row) => (
        <div>
          <p className="font-bold text-[#0F0F0F] dark:text-white">
            {row.customerName}
          </p>
          <p className="text-xs text-[#525252] dark:text-[#A3A3A3] font-mono-tabular">
            {row.customerEmail}
          </p>
        </div>
      ),
    },
    {
      key: 'session',
      header: t('admin.col.show'),
      render: (row) => (
        <div>
          <p className="font-bold text-[#0F0F0F] dark:text-white line-clamp-1">
            {row.sessionTitle}
          </p>
          <p className="text-xs text-[#525252] dark:text-[#A3A3A3] font-mono-tabular">
            {row.seatsCount} {lang === 'en' ? 'seats' : 'مقاعد'}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('admin.col.status'),
      render: (row) => reservationStatusBadge(row.status),
    },
    {
      key: 'amount',
      header: t('admin.col.amount'),
      align: 'end',
      render: (row) => (
        <span className="font-mono-tabular font-extrabold text-[#0F0F0F] dark:text-[#FDB813]">
          {formatMoney(row.totalAmount, row.currency, lang)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 text-start">
      <div>
        <span
          className="text-[11px] font-cinzel-label text-[#0F0F0F] dark:text-[#FDB813]"
          dir="ltr"
        >
          {t('admin.statsOverline')}
        </span>
        <h1 className="text-2xl font-extrabold text-[#0F0F0F] dark:text-white mt-0.5 font-cinema-heading">
          {t('admin.statsHeading')}
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">
          {t('admin.statsSubheading')}
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('admin.kpi.totalReservations')}
          value={stats.totals.reservations}
          subtext={t('admin.kpi.last30Days')}
        />
        <StatCard
          label={t('admin.kpi.confirmed')}
          value={stats.totals.confirmed}
          subtext={t('admin.kpi.activeQr')}
          tone="success"
        />
        <StatCard
          label={t('admin.kpi.cancelledExpired')}
          value={stats.totals.cancelled + stats.totals.expired}
          subtext={
            lang === 'en'
              ? `${stats.totals.cancelled} cancelled · ${stats.totals.expired} expired`
              : `${stats.totals.cancelled} ملغاة · ${stats.totals.expired} منتهية`
          }
          tone="warning"
        />
        <StatCard
          label={t('admin.kpi.expectedRevenue')}
          value={formatMoney(stats.totals.revenue, 'SYP', lang)}
          subtext={t('admin.kpi.confirmedOnly')}
          tone="gold"
        />
      </div>

      {/* Upcoming Sessions with Occupancy Bar */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0F0F0F] dark:text-white">
          {t('admin.upcomingHeading')}
        </h2>
        <DataTable
          columns={upcomingColumns}
          data={stats.upcomingSessions}
          keyExtractor={(r) => r.id}
        />
      </section>

      {/* Latest Reservations Table */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#0F0F0F] dark:text-white">
          {t('admin.latestReservationsHeading')}
        </h2>
        <DataTable
          columns={latestReservationsColumns}
          data={stats.latestReservations}
          keyExtractor={(r) => r.id}
        />
      </section>
    </div>
  );
}

// 2. /admin/movies & /admin/events Management Page
export function AdminContentPage({ kind }: { kind: 'movie' | 'event' }) {
  const { toast } = useToast();
  const { lang, t } = useLanguage();
  const isMovie = kind === 'movie';

  const [items, setItems] = useState<Array<Movie | EventItem>>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 8;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  >('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for Create / Edit ContentForm
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Movie | EventItem | null>(null);

  // ConfirmDialog state for Soft Archive
  const [archiveTarget, setArchiveTarget] = useState<Movie | EventItem | null>(
    null
  );
  const [archiving, setArchiving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const basePath = isMovie ? '/admin/movies' : '/admin/events';
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: statusFilter,
      });
      if (search.trim()) {
        query.set('search', search.trim());
      }
      const res = await apiFetch<PaginatedResponse<Movie | EventItem>>(
        `${basePath}?${query.toString()}`
      );
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ui.errorTitle'));
    } finally {
      setLoading(false);
    }
  }, [isMovie, page, limit, statusFilter, search, t]);

  useEffect(() => {
    document.title = isMovie
      ? `${t('admin.nav.movies')} — ${t('brand.name')}`
      : `${t('admin.nav.events')} — ${t('brand.name')}`;
    loadItems();
  }, [isMovie, loadItems, t]);

  // Optimistic Publish / Unpublish Toggle
  const handleTogglePublish = async (item: Movie | EventItem) => {
    const nextState = !item.isActive;
    const prevItems = [...items];

    // Optimistic UI update
    setItems((curr) =>
      curr.map((row) =>
        row.id === item.id
          ? { ...row, isActive: nextState, archivedAt: nextState ? null : row.archivedAt }
          : row
      )
    );

    try {
      const basePath = isMovie ? '/admin/movies' : '/admin/events';
      await apiFetch(`${basePath}/${item.id}`, {
        method: 'PATCH',
        body: { isActive: nextState },
      });
      toast({
        variant: 'success',
        title: nextState
          ? lang === 'en'
            ? `Published "${item.title}" to public catalog`
            : `تم نشر "${item.title}" على الصفحة الرئيسية`
          : lang === 'en'
            ? `Moved "${item.title}" to Draft`
            : `تم تحويل "${item.title}" إلى مسودة غير منشورة`,
      });
    } catch (err) {
      setItems(prevItems);
      toast({
        variant: 'error',
        title:
          lang === 'en'
            ? 'Failed to update publication status'
            : 'تعذر تحديث حالة النشر',
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  // Soft Archive Handler (DELETE /admin/movies/:id or /admin/events/:id)
  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      const basePath = isMovie ? '/admin/movies' : '/admin/events';
      await apiFetch(`${basePath}/${archiveTarget.id}`, {
        method: 'DELETE',
      });
      toast({
        variant: 'info',
        title:
          lang === 'en'
            ? `Archived "${archiveTarget.title}"`
            : `تم أرشفة "${archiveTarget.title}" وإخفاؤه من العرض العام`,
      });
      setArchiveTarget(null);
      loadItems();
    } catch (err) {
      toast({
        variant: 'error',
        title: lang === 'en' ? 'Failed to archive record' : 'فشل أرشفة السجل',
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setArchiving(false);
    }
  };

  const renderStatusBadge = (item: Movie | EventItem) => {
    if (item.archivedAt) {
      return <Badge variant="danger">{t('admin.badge.archived')}</Badge>;
    }
    if (item.isActive) {
      return <Badge variant="amber">{t('admin.badge.published')}</Badge>;
    }
    return <Badge variant="neutral">{t('admin.badge.draft')}</Badge>;
  };

  const columns: DataTableColumn<Movie | EventItem>[] = [
    {
      key: 'title',
      header: t('admin.col.show'),
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.posterUrl && (
            <img
              src={item.posterUrl}
              alt={item.title}
              className="w-10 h-14 object-cover rounded-[2px] border border-[#0F0F0F] dark:border-[#FDB813]/60 shrink-0"
            />
          )}
          <div>
            <p className="font-extrabold text-[#0F0F0F] dark:text-white">
              {item.title}
            </p>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-0.5">
              {isMovie
                ? (item as Movie).genre || t('details.kindMovie')
                : getEventTypeLabel((item as EventItem).type, lang)}{' '}
              · {formatDuration(item.durationMinutes, lang)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('admin.col.status'),
      render: (item) => renderStatusBadge(item),
    },
    {
      key: 'actions',
      header: t('admin.col.actions'),
      align: 'end',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTogglePublish(item)}
            title={
              item.isActive
                ? t('admin.action.unpublish')
                : t('admin.action.publish')
            }
          >
            {item.isActive ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>{t('admin.action.unpublish')}</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{t('admin.action.publish')}</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditingItem(item);
              setFormModalOpen(true);
            }}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('admin.action.edit')}</span>
          </Button>

          {!item.archivedAt && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setArchiveTarget(item)}
              className="text-red-500 hover:text-red-400"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{t('admin.action.archive')}</span>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F0F0F] dark:text-white flex items-center gap-2.5 font-cinema-heading">
            {isMovie ? (
              <Film className="w-6 h-6 text-[#FDB813]" />
            ) : (
              <Sparkles className="w-6 h-6 text-[#FDB813]" />
            )}
            <span>
              {isMovie ? t('admin.moviesHeading') : t('admin.eventsHeading')}
            </span>
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">
            {t('admin.contentSubheading')}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingItem(null);
            setFormModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>{isMovie ? t('admin.addMovie') : t('admin.addEvent')}</span>
        </Button>
      </div>

      {/* Search & Status Filter Toolbar */}
      <Card className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#FDB813] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={
              isMovie
                ? t('admin.searchMoviePlaceholder')
                : t('admin.searchEventPlaceholder')
            }
            className="w-full ps-10 pe-4 py-2 text-sm cinema-input"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { value: 'ALL', label: t('admin.status.all') },
              { value: 'PUBLISHED', label: t('admin.status.published') },
              { value: 'DRAFT', label: t('admin.status.draft') },
              { value: 'ARCHIVED', label: t('admin.status.archived') },
            ] as const
          ).map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => {
                setStatusFilter(st.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-[2px] text-xs transition-colors cursor-pointer border ${
                statusFilter === st.value
                  ? 'bg-[#FDB813] text-[#0F0F0F] border-[#0F0F0F] dark:border-[#FDB813] font-extrabold'
                  : 'bg-[#FFFDF7] dark:bg-[#141414] text-[#525252] dark:text-[#A3A3A3] border-[#0F0F0F]/20 dark:border-[#2E2E2E] font-bold hover:border-[#FDB813]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </Card>

      {error ? (
        <ErrorState message={error} onRetry={loadItems} />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            keyExtractor={(r) => r.id}
          />
          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Create / Edit ContentForm Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={
          editingItem
            ? `${t('admin.action.edit')}: ${editingItem.title}`
            : isMovie
              ? t('admin.addMovie')
              : t('admin.addEvent')
        }
        size="lg"
      >
        <ContentForm
          kind={kind}
          initialMovie={isMovie ? (editingItem as Movie | null) : null}
          initialEvent={!isMovie ? (editingItem as EventItem | null) : null}
          onCancel={() => setFormModalOpen(false)}
          onSuccess={() => {
            setFormModalOpen(false);
            loadItems();
          }}
        />
      </Modal>

      {/* Soft Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleConfirmArchive}
        loading={archiving}
        title={t('admin.archiveConfirmTitle')}
        message={
          lang === 'en'
            ? `Are you sure you want to archive "${archiveTarget?.title || ''}"? It will be hidden from the public catalog while preserving historical booking records.`
            : `هل أنت متأكد من أرشفة "${archiveTarget?.title || ''}"؟ سيتم إخفاؤه من الصفحة الرئيسية للجمهور مع الاحتفاظ بسجلاته التاريخية.`
        }
        confirmLabel={t('admin.archiveConfirmBtn')}
      />
    </div>
  );
}

// 3. /admin/settings Page
export function AdminSettingsPage() {
  const { toast } = useToast();
  const { lang, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema as never),
    defaultValues: {
      holdDurationMinutes: 10,
      maxSeatsPerReservation: 8,
      cancelBeforeMinutes: 60,
    },
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<AdminSettings>('/admin/settings');
      reset({
        holdDurationMinutes: res.holdDurationMinutes,
        maxSeatsPerReservation: res.maxSeatsPerReservation,
        cancelBeforeMinutes: res.cancelBeforeMinutes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ui.errorTitle'));
    } finally {
      setLoading(false);
    }
  }, [reset, t]);

  useEffect(() => {
    document.title = `${t('admin.nav.settings')} — ${t('brand.name')}`;
    loadSettings();
  }, [loadSettings, t]);

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      await apiFetch<AdminSettings>('/admin/settings', {
        method: 'PATCH',
        body: {
          holdDurationMinutes: Number(values.holdDurationMinutes),
          maxSeatsPerReservation: Number(values.maxSeatsPerReservation),
          cancelBeforeMinutes: Number(values.cancelBeforeMinutes),
        },
      });
      toast({
        variant: 'success',
        title:
          lang === 'en'
            ? 'Booking settings saved and logged to audit trail'
            : 'تم حفظ إعدادات الحجز وتوثيقها في سجل التدقيق بنجاح',
      });
    } catch (err) {
      const mapped = mapValidationErrorsToFields(err, [
        'holdDurationMinutes',
        'maxSeatsPerReservation',
        'cancelBeforeMinutes',
      ]);
      Object.entries(mapped.fieldErrors).forEach(([field, msg]) => {
        setFieldError(field as keyof SettingsFormValues, {
          type: 'server',
          message: msg,
        });
      });
      toast({
        variant: 'error',
        title:
          lang === 'en' ? 'Failed to update settings' : 'فشل تحديث الإعدادات',
        description: mapped.bannerError || undefined,
      });
    }
  };

  if (loading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadSettings} />;
  }

  return (
    <div className="max-w-2xl space-y-6 text-start">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F0F0F] dark:text-white flex items-center gap-2.5 font-cinema-heading">
          <Settings className="w-6 h-6 text-[#FDB813]" />
          <span>{t('admin.settingsHeading')}</span>
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">
          {t('admin.settingsSubheading')}
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label={t('admin.settings.holdDuration')}
            type="number"
            min={1}
            max={60}
            helperText={t('admin.settings.holdDurationHint')}
            error={errors.holdDurationMinutes?.message}
            {...register('holdDurationMinutes')}
          />

          <Input
            label={t('admin.settings.maxSeats')}
            type="number"
            min={1}
            max={20}
            helperText={t('admin.settings.maxSeatsHint')}
            error={errors.maxSeatsPerReservation?.message}
            {...register('maxSeatsPerReservation')}
          />

          <Input
            label={t('admin.settings.cancelWindow')}
            type="number"
            min={0}
            max={1440}
            helperText={t('admin.settings.cancelWindowHint')}
            error={errors.cancelBeforeMinutes?.message}
            {...register('cancelBeforeMinutes')}
          />

          <div className="pt-4 border-t border-[#0F0F0F]/15 dark:border-[#2E2E2E] flex items-center justify-between">
            <span className="text-xs text-[#525252] dark:text-[#A3A3A3]">
              {t('admin.settings.currencyNote')}{' '}
              <strong className="font-mono-tabular text-[#0F0F0F] dark:text-[#FDB813]">
                SYP (ل.س)
              </strong>
            </span>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {t('admin.settings.saveBtn')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}



