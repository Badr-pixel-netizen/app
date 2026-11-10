"use client";
/**
 * سينما سلمية (Salamiyah Cinema) Shared UI Kit (src/components/ui/Kit.tsx)
 * Delivered by Badr (Stage 1) — Used across Badr and Hassan's screens.
 * Styled with the official #FDB813 (Cinema Amber) & #0F0F0F (Cinema Dark) architectural Kufic identity:
 * - Sharp architectural edges (rounded-[2px]) instead of rounded pills
 * - Primary CTA: solid #FDB813 with #0F0F0F bold text, #FFC940 hover, and hard geometric offset shadow
 * - Secondary / Outline: 1.5px solid #FDB813 border, fills with #FDB813 and #0F0F0F text on hover
 * - Inputs: #141414 dark surface, #2E2E2E border transitioning to #FDB813 with amber glow
 * - Cards: layered dark charcoal gradient (#1E1E1E to #141414) with 1px solid #2A2A2A border
 */

import React, { useEffect, useId } from 'react';
import clsx from 'clsx';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// 1. Button
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-[2px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDB813] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer';

    const variants = {
      primary: 'cinema-btn-primary',
      gold: 'cinema-btn-primary',
      secondary:
        'bg-[#EBE3D0] text-[#0F0F0F] font-bold border border-[#0F0F0F]/20 hover:border-[#FDB813] dark:bg-[#222222] dark:text-white dark:border-[#2E2E2E] dark:hover:border-[#FDB813] dark:hover:text-[#FDB813]',
      outline: 'cinema-btn-outline',
      ghost:
        'text-[#0F0F0F] dark:text-[#A3A3A3] font-bold hover:text-[#0F0F0F] hover:bg-[#FDB813]/15 dark:hover:text-[#FDB813] dark:hover:bg-[#FDB813]/10',
      danger:
        'bg-red-600 text-white font-bold border border-red-500 hover:bg-red-500 active:bg-red-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs min-h-[36px]',
      md: 'px-4 py-2.5 text-sm min-h-[42px]',
      lg: 'px-6 py-3 text-base min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// 2. Input
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full text-start">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold text-[#0F0F0F] dark:text-white mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            'w-full px-3.5 py-2.5 text-sm cinema-input',
            error && '!border-red-500 focus:!ring-red-500/30',
            className
          )}
          {...props}
        />
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#525252] dark:text-[#A3A3A3]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

// 3. Select
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full text-start">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-bold text-[#0F0F0F] dark:text-white mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            'w-full px-3.5 py-2.5 text-sm cinema-input',
            error && '!border-red-500 focus:!ring-red-500/30',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

// 4. Textarea
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const areaId = id || generatedId;
    const errorId = `${areaId}-error`;

    return (
      <div className="w-full text-start">
        {label && (
          <label
            htmlFor={areaId}
            className="block text-sm font-bold text-[#0F0F0F] dark:text-white mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            'w-full px-3.5 py-2.5 text-sm cinema-input',
            error && '!border-red-500 focus:!ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// 5. Card
export function Card({
  className,
  interactive = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={clsx(
        'cinema-card text-[#0F0F0F] dark:text-white',
        interactive && 'cinema-card-interactive',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// 6. Badge (Architectural sharp 2px badges; solid #FDB813 with #0F0F0F text for primary tags)
export function Badge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: 'amber' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple';
  children: React.ReactNode;
  className?: string;
}) {
  const styles = {
    amber: 'bg-[#FDB813] text-[#0F0F0F] border-[#FDB813] font-extrabold',
    purple: 'bg-[#FDB813] text-[#0F0F0F] border-[#FDB813] font-extrabold',
    warning:
      'bg-[#FDB813]/20 text-[#0F0F0F] dark:text-[#FDB813] border-[#FDB813]/60 font-bold',
    success:
      'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-bold',
    danger:
      'bg-red-500/15 text-red-800 dark:text-red-300 border-red-500/40 font-bold',
    neutral:
      'bg-[#222222]/10 dark:bg-[#222222] text-[#525252] dark:text-[#A3A3A3] border-[#2E2E2E] font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-xs uppercase tracking-wider border whitespace-nowrap shrink-0',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// 7. Modal
export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={clsx(
          'w-full rounded-[2px] border-2 border-[#0F0F0F] dark:border-[#FDB813] bg-[#FFFDF7] dark:bg-[#141414] text-[#0F0F0F] dark:text-white shadow-2xl overflow-hidden my-8',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full clapper-bar" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0F0F0F]/15 dark:border-[#2E2E2E] bg-[#FFF8E7] dark:bg-[#181818]">
          <h2 className="text-lg font-extrabold text-start">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('ui.cancel')}
            className="p-1.5 rounded-[2px] text-[#525252] hover:text-[#0F0F0F] dark:text-[#A3A3A3] dark:hover:text-[#FDB813] focus-visible:outline-2 focus-visible:outline-[#FDB813] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-start max-h-[82vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// 8. ConfirmDialog
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        <p className="text-sm text-[#525252] dark:text-[#A3A3A3] leading-relaxed">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel || t('ui.cancel')}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel || t('ui.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// 9. Skeleton
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'animate-pulse rounded-[2px] bg-[#E5DEC9] dark:bg-[#222222]',
        className
      )}
    />
  );
}

// 10. EmptyState
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-[2px] border border-dashed border-[#0F0F0F]/30 dark:border-[#2E2E2E] bg-[#FFF8E7]/60 dark:bg-[#141414]">
      <div className="w-12 h-12 rounded-[2px] bg-[#FDB813] text-[#0F0F0F] flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-extrabold text-[#0F0F0F] dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#525252] dark:text-[#A3A3A3] max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

// 11. ErrorState
export function ErrorState({
  title,
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-[2px] border border-red-500/40 bg-red-500/5"
    >
      <div className="w-12 h-12 rounded-[2px] bg-red-500/15 text-red-500 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-extrabold text-[#0F0F0F] dark:text-white">
        {title || t('ui.errorTitle')}
      </h3>
      <p className="mt-1.5 text-sm text-[#525252] dark:text-[#A3A3A3] max-w-md">
        {message}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t('ui.retry')}
          </Button>
        </div>
      )}
    </div>
  );
}

// 12. Pagination
export function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  total: number;
  limit: number;
  onPageChange: (nextPage: number) => void;
}) {
  const { t, isRTL } = useLanguage();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#0F0F0F]/15 dark:border-[#2E2E2E]">
      <span className="text-xs text-[#525252] dark:text-[#A3A3A3]">
        {t('ui.page')}{' '}
        <span className="font-mono-tabular font-bold text-[#0F0F0F] dark:text-[#FDB813]">
          {page}
        </span>{' '}
        {t('ui.of')}{' '}
        <span className="font-mono-tabular font-bold text-[#0F0F0F] dark:text-[#FDB813]">
          {totalPages}
        </span>{' '}
        ({t('ui.total')}: <span className="font-mono-tabular">{total}</span>)
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label={t('ui.prevPage')}
        >
          <PrevIcon className="w-4 h-4" />
          {t('ui.prevPage')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label={t('ui.nextPage')}
        >
          {t('ui.nextPage')}
          <NextIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// 13. DataTable
export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: 'start' | 'end' | 'center';
  render: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyTitle,
  emptyDescription,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3, 4].map((n) => (
          <Skeleton key={n} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || t('ui.emptyTitle')}
        description={emptyDescription || t('ui.emptyDesc')}
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[2px] border border-[#0F0F0F] dark:border-[#2E2E2E]">
      <table className="w-full text-sm text-start border-collapse">
        <thead>
          <tr className="border-b-2 border-[#FDB813] bg-[#FFF8E7] dark:bg-[#141414] text-[#0F0F0F] dark:text-[#FDB813]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'py-3.5 px-4 font-extrabold whitespace-nowrap',
                  col.align === 'end'
                    ? 'text-end'
                    : col.align === 'center'
                      ? 'text-center'
                      : 'text-start'
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0F0F0F]/10 dark:divide-[#262626] bg-[#FFFDF7] dark:bg-[#181818]">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="hover:bg-[#FDB813]/10 dark:hover:bg-[#FDB813]/[0.06] transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={clsx(
                    'py-3.5 px-4 align-middle',
                    col.align === 'end'
                      ? 'text-end'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-start'
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


