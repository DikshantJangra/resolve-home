/**
 * Centralized API endpoint registry for Resolve Home.
 *
 * Source of truth: docs/API.md | docs/openapi.json
 * Backend: https://resolvhome.onrender.com
 *
 * Convention: paths are relative to NEXT_PUBLIC_API_URL (base URL already includes no trailing /api).
 * The apiClient baseURL = NEXT_PUBLIC_API_URL (e.g. https://resolvhome.onrender.com)
 */

export const ENDPOINTS = {
  // ─── Authentication ──────────────────────────────────────────────────────
  AUTH: {
    REGISTER:        '/api/signup-with-role',
    SIGN_IN_EMAIL:   '/api/auth/sign-in/email',
    SIGN_IN_SOCIAL:  '/api/auth/sign-in/social',
    VERIFY_EMAIL:    '/api/auth/verify-email',
    FORGET_PASSWORD: '/api/auth/forget-password',
    RESET_PASSWORD:           '/api/auth/reset-password',
    SEND_VERIFICATION_EMAIL:  '/api/auth/send-verification-email',
    SIGN_OUT:                 '/api/auth/sign-out',
    GET_SESSION:              '/api/auth/get-session',
  },

  // ─── Categories (public/shared) ───────────────────────────────────────────
  CATEGORIES: {
    LIST: '/api/categories',
  },

  // ─── User ─────────────────────────────────────────────────────────────────
  USER: {
    PROFILE:  '/api/user/profile',
    PASSWORD: '/api/user/password',
  },

  // ─── Services (public) ───────────────────────────────────────────────────
  SERVICES: {
    BASE:        '/api/services',
    BY_ID:       (id: string) => `/api/services/${id}`,
    BY_CATEGORY: (categoryId: string) => `/api/categories/${categoryId}/services`,
  },

  // ─── Bookings ─────────────────────────────────────────────────────────────
  BOOKINGS: {
    BASE:                '/api/bookings',
    AVAILABLE_ENGINEERS: '/api/bookings/available-engineers',
    BY_ID:               (id: string) => `/api/bookings/${id}`,
    SELECT_ENGINEER:     (id: string) => `/api/bookings/${id}/select-engineer`,
    REVIEW:              (id: string) => `/api/bookings/${id}/review`,
    CANCEL:              (id: string) => `/api/bookings/${id}/cancel`,
  },

  // ─── Engineer Bookings ────────────────────────────────────────────────────
  ENGINEER_BOOKINGS: {
    BASE:   '/api/engineer/bookings',
    BY_ID:  (id: string) => `/api/engineer/bookings/${id}`,
    ACCEPT: (id: string) => `/api/engineer/bookings/${id}/accept`,
    REJECT: (id: string) => `/api/engineer/bookings/${id}/reject`,
  },

  // ─── Wallet ───────────────────────────────────────────────────────────────
  WALLET: {
    BASE:               '/api/wallet',
    BALANCE:            '/api/wallet/balance',
    STATISTICS:         '/api/wallet/statistics',
    TRANSACTIONS:       '/api/wallet/transactions',
    DEPOSIT_INITIALIZE: '/api/wallet/deposit/initialize',
    DEPOSIT_VERIFY:     (ref: string) => `/api/wallet/deposit/verify/${ref}`,
    BANKS: {
      LIST:   '/api/wallet/banks',
      BASE:   '/api/wallet/banks',
      DELETE: (id: string) => `/api/wallet/banks/${id}`,
    },
    WITHDRAW:           '/api/wallet/withdraw',
  },

  // ─── Quotations ────────────────────────────────────────────────────────────
  QUOTATIONS: {
    BASE:       '/api/quotations',
    BY_BOOKING: (bookingId: string) => `/api/quotations/booking/${bookingId}`,
    APPROVE:    (id: string) => `/api/quotations/${id}/approve`,
    REJECT:     (id: string) => `/api/quotations/${id}/reject`,
    REVISE:     (id: string) => `/api/quotations/${id}/revise`,
  },

  // ─── Chats ────────────────────────────────────────────────────────────────
  CHATS: {
    BASE:     '/api/chats',
    MESSAGES: (chatId: string) => `/api/chats/${chatId}/messages`,
    READ:     (chatId: string) => `/api/chats/${chatId}/read`,
  },

  // ─── File Upload ──────────────────────────────────────────────────────────
  UPLOAD: {
    CONFIG: '/api/upload/config',
    BASE:   '/api/upload',
  },

  // ─── Admin — Users ────────────────────────────────────────────────────────
  ADMIN_USERS: {
    BASE:   '/api/admin/users',
    STATS:  '/api/admin/users/stats',
    BY_ID:  (id: string) => `/api/admin/users/${id}`,
    BAN:    (id: string) => `/api/admin/users/${id}/ban`,
  },

  // ─── Admin — Categories ───────────────────────────────────────────────────
  ADMIN_CATEGORIES: {
    BASE:  '/api/admin/categories',
    BY_ID: (id: string) => `/api/admin/categories/${id}`,
  },

  // ─── Admin — Services ─────────────────────────────────────────────────────
  ADMIN_SERVICES: {
    BASE:  '/api/admin/services',
    BY_ID: (id: string) => `/api/admin/services/${id}`,
  },

  // ─── Admin — Engineers ────────────────────────────────────────────────────
  ADMIN_ENGINEERS: {
    BASE:  '/api/admin/engineers',
    STATS: '/api/admin/engineers/stats',
    BY_ID: (id: string) => `/api/admin/engineers/${id}`,
  },

  // ─── Admin — Bookings ─────────────────────────────────────────────────────
  ADMIN_BOOKINGS: {
    BASE:      '/api/admin/bookings',
    STATS:     '/api/admin/bookings/stats',
    BY_ID:     (id: string) => `/api/admin/bookings/${id}`,
    STATUS:    (id: string) => `/api/admin/bookings/${id}/status`,
    ENGINEERS: (id: string) => `/api/admin/bookings/${id}/engineers`,
  },

  // ─── Admin — Stats (General) ──────────────────────────────────────────────
  ADMIN_STATS: {
    BASE: '/api/admin/stats',
  },

  // ─── Complaints ────────────────────────────────────────────────────────────
  COMPLAINTS: {
    BASE:  '/api/complaints',
    BY_ID: (id: string) => `/api/complaints/${id}`,
  },

  // ─── Admin — Complaints ────────────────────────────────────────────────────
  ADMIN_COMPLAINTS: {
    BASE:    '/api/admin/complaints',
    STATS:   '/api/admin/complaints/stats',
    BY_ID:   (id: string) => `/api/admin/complaints/${id}`,
    RESPOND: (id: string) => `/api/admin/complaints/${id}/respond`,
  },
} as const
