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
    RESET_PASSWORD:  '/api/auth/reset-password',
    SIGN_OUT:        '/api/auth/sign-out',
    GET_SESSION:     '/api/auth/get-session',
  },

  // ─── Categories (public/shared) ───────────────────────────────────────────
  CATEGORIES: {
    LIST: '/api/admin/categories',
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
    BY_ID: (id: string) => `/api/admin/engineers/${id}`,
  },

  // ─── Admin — Bookings ─────────────────────────────────────────────────────
  ADMIN_BOOKINGS: {
    BASE:      '/api/admin/bookings',
    BY_ID:     (id: string) => `/api/admin/bookings/${id}`,
    STATUS:    (id: string) => `/api/admin/bookings/${id}/status`,
    ENGINEERS: (id: string) => `/api/admin/bookings/${id}/engineers`,
  },
} as const
