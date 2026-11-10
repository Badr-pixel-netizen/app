/**
 * CinemaHub Form Validation Schemas & Server Error Mapping (src/lib/validation.ts)
 * Handles Zod schemas for Auth, Movie/Event ContentForm, Settings, Image Upload,
 * and maps NestJS 400 VALIDATION_FAILED message[] arrays to specific form fields.
 */

import { z } from 'zod';
import { ApiError, EventType } from './types';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'الاسم الكامل يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم الكامل لا يتجاوز 100 حرف'),
  email: z
    .string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل')
    .regex(/[A-Za-z]/, 'كلمة المرور يجب أن تحتوي على حرف واحد على الأقل')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const movieFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'عنوان الفيلم مطلوب')
    .max(255, 'العنوان لا يتجاوز 255 حرفاً'),
  description: z.string().trim().optional().or(z.literal('')),
  durationMinutes: z.coerce
    .number()
    .int('المدة يجب أن تكون رقماً صحيحاً')
    .min(1, 'المدة يجب أن تكون دقيقة واحدة على الأقل')
    .max(600, 'المدة لا تتجاوز 600 دقيقة'),
  posterUrl: z.string().trim().optional().or(z.literal('')),
  trailerUrl: z
    .string()
    .trim()
    .url('رابط الإعلان الترويجي يجب أن يكون رابطاً صحيحاً (http/https)')
    .optional()
    .or(z.literal('')),
  genre: z.string().trim().optional().or(z.literal('')),
  language: z.string().trim().optional().or(z.literal('')),
  ageRating: z.string().trim().optional().or(z.literal('')),
  isActive: z.boolean().default(false),
});

export type MovieFormValues = z.infer<typeof movieFormSchema>;

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'عنوان الفعالية مطلوب')
    .max(255, 'العنوان لا يتجاوز 255 حرفاً'),
  description: z.string().trim().optional().or(z.literal('')),
  type: z.nativeEnum(EventType, {
    message: 'يرجى اختيار نوع الفعالية',
  }),
  durationMinutes: z.coerce
    .number()
    .int('المدة يجب أن تكون رقماً صحيحاً')
    .min(1, 'المدة يجب أن تكون دقيقة واحدة على الأقل')
    .max(600, 'المدة لا تتجاوز 600 دقيقة'),
  posterUrl: z.string().trim().optional().or(z.literal('')),
  trailerUrl: z
    .string()
    .trim()
    .url('الرابط الترويجي يجب أن يكون رابطاً صحيحاً (http/https)')
    .optional()
    .or(z.literal('')),
  ageRestriction: z.string().trim().optional().or(z.literal('')),
  isActive: z.boolean().default(false),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const settingsFormSchema = z.object({
  holdDurationMinutes: z.coerce
    .number()
    .int()
    .min(1, 'مدة حجز المقعد المؤقت بين 1 و 60 دقيقة')
    .max(60, 'مدة حجز المقعد المؤقت بين 1 و 60 دقيقة'),
  maxSeatsPerReservation: z.coerce
    .number()
    .int()
    .min(1, 'الحد الأقصى للمقاعد لكل حجز بين 1 و 20 مقعداً')
    .max(20, 'الحد الأقصى للمقاعد لكل حجز بين 1 و 20 مقعداً'),
  cancelBeforeMinutes: z.coerce
    .number()
    .int()
    .min(0, 'نافذة الإلغاء قبل العرض بين 0 و 1440 دقيقة')
    .max(1440, 'نافذة الإلغاء قبل العرض بين 0 و 1440 دقيقة'),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

/**
 * Validates an uploaded image file on the client before sending POST /admin/uploads/image.
 */
export function validateImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'صيغة الصورة غير مدعومة. يرجى اختيار ملف بصيغة JPG أو PNG أو WEBP.',
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'حجم الصورة يتجاوز الحد المسموح (3 ميجابايت كحد أقصى).',
    };
  }
  return { valid: true };
}

/**
 * Maps a NestJS 400 VALIDATION_FAILED error (where rawMessage is string[])
 * to field-specific error messages so react-hook-form can highlight the exact inputs.
 */
export function mapValidationErrorsToFields(
  err: unknown,
  knownFields: string[]
): { fieldErrors: Record<string, string>; bannerError: string | null } {
  const fieldErrors: Record<string, string> = {};

  if (!(err instanceof ApiError)) {
    return {
      fieldErrors,
      bannerError: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
    };
  }

  if (err.code === 'EMAIL_TAKEN') {
    fieldErrors.email = 'البريد الإلكتروني مسجل مسبقاً لحساب آخر';
    return { fieldErrors, bannerError: null };
  }

  if (err.code === 'INVALID_CREDENTIALS') {
    return {
      fieldErrors,
      bannerError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    };
  }

  if (err.statusCode === 400 && Array.isArray(err.rawMessage)) {
    const unmatched: string[] = [];
    for (const msg of err.rawMessage) {
      const matchedField = knownFields.find(
        (field) =>
          msg.toLowerCase().startsWith(field.toLowerCase()) ||
          msg.toLowerCase().includes(field.toLowerCase())
      );
      if (matchedField) {
        fieldErrors[matchedField] = msg;
      } else {
        unmatched.push(msg);
      }
    }
    return {
      fieldErrors,
      bannerError: unmatched.length > 0 ? unmatched.join(' · ') : null,
    };
  }

  return {
    fieldErrors,
    bannerError: err.message || 'تعذر إتمام العملية، يرجى المحاولة مجدداً',
  };
}
