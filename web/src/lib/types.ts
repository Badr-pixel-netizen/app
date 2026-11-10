/**
 * CinemaHub Shared API Contract Types (Appendix A–E)
 * Delivered by Badr (Stage 0) — Shared contract with Hassan & Backend Team
 */

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum SessionSeatStatus {
  AVAILABLE = 'AVAILABLE',
  HELD = 'HELD',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
}

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  VOID = 'VOID',
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum SeatType {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  ACCESSIBLE = 'ACCESSIBLE',
}

export enum EventType {
  COMEDY = 'COMEDY',
  CULTURAL = 'CULTURAL',
  FESTIVAL = 'FESTIVAL',
  LECTURE = 'LECTURE',
  CONFERENCE = 'CONFERENCE',
  SPECIAL_SCREENING = 'SPECIAL_SCREENING',
  OTHER = 'OTHER',
}

export type ErrorCode =
  | 'VALIDATION_FAILED'
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'EMAIL_TAKEN'
  | 'SEATS_UNAVAILABLE'
  | 'ACTIVE_HOLD_EXISTS'
  | 'HOLD_EXPIRED'
  | 'SESSION_NOT_BOOKABLE'
  | 'SESSION_OVERLAP'
  | 'SESSION_HAS_RESERVATIONS'
  | 'CANCEL_WINDOW_PASSED'
  | 'SEAT_HAS_RESERVATIONS'
  | 'MAX_SEATS_EXCEEDED'
  | 'INVALID_SEATS'
  | 'INTERNAL_ERROR';

export interface ApiErrorShape {
  statusCode: number;
  code: ErrorCode | string;
  message: string | string[];
  path: string;
  unavailableSeatIds?: string[];
  reservationId?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  statusCode: number;
  code: ErrorCode | string;
  rawMessage: string | string[];
  path: string;
  extras: Record<string, unknown>;

  constructor(payload: {
    statusCode: number;
    code: ErrorCode | string;
    message: string | string[];
    path?: string;
    extras?: Record<string, unknown>;
  }) {
    const formattedMsg = Array.isArray(payload.message)
      ? payload.message.join('، ')
      : payload.message;
    super(formattedMsg);
    this.name = 'ApiError';
    this.status = payload.statusCode;
    this.statusCode = payload.statusCode;
    this.code = payload.code;
    this.rawMessage = payload.message;
    this.path = payload.path || '';
    this.extras = payload.extras || {};
  }
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface NextSessionSummary {
  id: string;
  startsAt: string;
}

export interface SessionItem {
  id: string;
  startsAt: string;
  endsAt: string;
  ticketPrice: string;
  status: SessionStatus;
  isBookable: boolean;
  availableSeatsCount: number;
  reservationOpensAt?: string;
  reservationClosesAt?: string;
}

export interface SessionDetails extends SessionItem {
  content: {
    type: 'MOVIE' | 'EVENT';
    id: string;
    title: string;
    posterUrl: string | null;
    durationMinutes: number;
    ageRating?: string | null;
  };
}

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  posterUrl: string | null;
  trailerUrl: string | null;
  genre: string | null;
  language: string | null;
  ageRating: string | null;
  isActive: boolean;
  archivedAt?: string | null;
  nextSession: NextSessionSummary | null;
  sessions?: SessionItem[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  type: EventType;
  durationMinutes: number;
  posterUrl: string | null;
  trailerUrl?: string | null;
  ageRestriction: string | null;
  isActive: boolean;
  archivedAt?: string | null;
  nextSession: NextSessionSummary | null;
  sessions?: SessionItem[];
}

export interface Seat {
  seatId: string;
  label: string;
  rowLabel: string;
  seatNumber: number;
  gridRow: number;
  gridCol: number;
  seatType: SeatType;
  status: SessionSeatStatus;
  price: string;
}

export interface SeatSection {
  id: string;
  code: 'LEFT' | 'CENTER' | 'RIGHT' | 'UPPER';
  letter: 'B' | 'C' | 'D' | 'A';
  name: string;
  displayOrder: number;
  gridRows: number;
  gridCols: number;
  seats: Seat[];
}

export interface SeatMap {
  session: {
    id: string;
    startsAt: string;
    status: SessionStatus;
    ticketPrice: string;
    currency: string;
  };
  sections: SeatSection[];
}

export interface ReservationSeatItem {
  seatId: string;
  label: string;
  sectionName: string;
  price: string;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  status: TicketStatus;
  seatLabel: string;
  qrPayload?: string;
  qrDataUrl?: string;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  status: ReservationStatus;
  source: 'ONLINE' | 'BOX_OFFICE';
  totalAmount: string;
  currency: string;
  holdExpiresAt: string | null;
  confirmedAt: string | null;
  createdAt: string;
  session: {
    id: string;
    startsAt: string;
    endsAt: string;
    title: string;
    type: 'MOVIE' | 'EVENT';
    posterUrl: string | null;
  };
  seats: ReservationSeatItem[];
  tickets: Ticket[];
  user?: {
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export interface PublicSettings {
  holdDurationMinutes: number;
  maxSeatsPerReservation: number;
  currency: string;
}

export interface AdminSettings extends PublicSettings {
  cancelBeforeMinutes: number;
  sessionBufferMinutes?: number;
}

export interface UpcomingSessionStat {
  id: string;
  title: string;
  startsAt: string;
  totalSeats: number;
  bookedSeats: number;
  heldSeats: number;
  occupancyPct: number;
}

export interface LatestReservationSummary {
  id: string;
  reservationCode: string;
  customerName: string;
  customerEmail: string;
  sessionTitle: string;
  startsAt: string;
  status: ReservationStatus;
  totalAmount: string;
  currency: string;
  seatsCount: number;
  createdAt: string;
}

export interface StatsOverview {
  range: {
    from: string;
    to: string;
  };
  totals: {
    reservations: number;
    confirmed: number;
    cancelled: number;
    expired: number;
    revenue: string;
  };
  upcomingSessions: UpcomingSessionStat[];
  latestReservations: LatestReservationSummary[];
}

export interface CreateMoviePayload {
  title: string;
  description?: string;
  durationMinutes: number;
  posterUrl?: string;
  trailerUrl?: string;
  genre?: string;
  language?: string;
  ageRating?: string;
  isActive?: boolean;
}

export type UpdateMoviePayload = Partial<CreateMoviePayload>;

export interface CreateEventPayload {
  title: string;
  description?: string;
  type: EventType;
  durationMinutes: number;
  posterUrl?: string;
  trailerUrl?: string;
  ageRestriction?: string;
  isActive?: boolean;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;
