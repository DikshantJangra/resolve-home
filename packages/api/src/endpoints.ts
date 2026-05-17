/**
 * Centralized API endpoint registry for Resolve Home.
 *
 * Source of truth: openapi.json (live: https://resolvhome.onrender.com/openapi.json)
 * Backend: https://resolvhome.onrender.com
 */

export const ENDPOINTS = {
  // ─── Authentication ──────────────────────────────────────────────────────
  AUTH: {
    REGISTER: '/api/signup-with-role',
    SIGN_IN_EMAIL: '/api/auth/sign-in/email',
    SIGN_IN_SOCIAL: '/api/auth/sign-in/social',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION_CODE: '/api/auth/resend-verification',
    FORGET_PASSWORD: '/api/auth/forget-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    SIGN_OUT: '/api/auth/sign-out',
    GET_SESSION: '/api/auth/get-session',
  },

  // ─── User ─────────────────────────────────────────────────────────────────
  USER: {
    PROFILE: '/api/user/profile',
    PASSWORD: '/api/user/password',
    BIO_ADDRESS: '/api/user/bio-address',
  },

  // ─── Notifications ────────────────────────────────────────────────────────
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    READ: (id: string) => `/api/notifications/${id}/read`,
    READ_ALL: '/api/notifications/read-all',
    SETTINGS: '/api/notifications/settings',
  },

  // ─── Categories (public) ──────────────────────────────────────────────────
  CATEGORIES: {
    LIST: '/api/categories',
  },

  // ─── Services (public) ───────────────────────────────────────────────────
  SERVICES: {
    BASE: '/api/services',
    BY_CATEGORY: (categoryId: string) => `/api/categories/${categoryId}/services`,
  },

  // ─── Bookings ─────────────────────────────────────────────────────────────
  BOOKINGS: {
    BASE: '/api/bookings',
    AVAILABLE_ENGINEERS: '/api/bookings/available-engineers',
    BY_ID: (id: string) => `/api/bookings/${id}`,
    SELECT_ENGINEER: (id: string) => `/api/bookings/${id}/select-engineer`,
    ACCEPT: (id: string) => `/api/bookings/${id}/accept`,
    REJECT: (id: string) => `/api/bookings/${id}/reject`,
    REVIEW: (id: string) => `/api/bookings/${id}/review`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
    ENGINEER_LOCATION: (id: string) => `/api/bookings/${id}/engineer-location`,
  },

  // ─── Engineer ─────────────────────────────────────────────────────────────
  ENGINEER: {
    COMPLETE_PROFILE: '/api/engineer/complete-profile',
    DASHBOARD: '/api/engineer/dashboard',
    LOCATION: '/api/engineer/location',
    BOOKINGS: '/api/engineer/bookings',
    MY_BOOKINGS: '/api/engineer/bookings',
    BOOKING_BY_ID: (id: string) => `/api/engineer/bookings/${id}`,
  },

  // ─── Wallet ───────────────────────────────────────────────────────────────
  WALLET: {
    BASE: '/api/wallet',
    BALANCE: '/api/wallet/balance',
    STATISTICS: '/api/wallet/statistics',
    TRANSACTIONS: '/api/wallet/transactions',
    TOP_UP: '/api/wallet/top-up',
    DEPOSIT_INITIALIZE: '/api/wallet/deposit/initialize',
    DEPOSIT_VERIFY: (ref: string) => `/api/wallet/deposit/verify/${ref}`,
    BANKS: '/api/wallet/banks',
    BANK_ACCOUNT: '/api/wallet/bank-account',
    WITHDRAW: '/api/wallet/withdraw',
  },

  // ─── Quotations ────────────────────────────────────────────────────────────
  QUOTATIONS: {
    BASE: '/api/quotations',
    BY_BOOKING: (bookingId: string) => `/api/quotations/booking/${bookingId}`,
    APPROVE: (id: string) => `/api/quotations/${id}/approve`,
    REJECT: (id: string) => `/api/quotations/${id}/reject`,
    REVISE: (id: string) => `/api/quotations/${id}/revise`,
  },

  // ─── Chats ────────────────────────────────────────────────────────────────
  CHATS: {
    BASE: '/api/chats',
    MESSAGES: (chatId: string) => `/api/chats/${chatId}/messages`,
    READ: (chatId: string) => `/api/chats/${chatId}/read`,
  },

  // ─── File Upload ──────────────────────────────────────────────────────────
  UPLOAD: {
    CONFIG: '/api/upload/config',
    BASE: '/api/upload',
  },

  // ─── Complaints ────────────────────────────────────────────────────────────
  COMPLAINTS: {
    BASE: '/api/complaints',
    BY_ID: (id: string) => `/api/complaints/${id}`,
  },

  // ─── Admin — Users ────────────────────────────────────────────────────────
  ADMIN_USERS: {
    BASE: '/api/admin/users',
    BY_ID: (id: string) => `/api/admin/users/${id}`,
    BAN: (id: string) => `/api/admin/users/${id}/ban`,
  },

  // ─── Admin — Categories ───────────────────────────────────────────────────
  ADMIN_CATEGORIES: {
    BASE: '/api/admin/categories',
    BY_ID: (id: string) => `/api/admin/categories/${id}`,
  },

  // ─── Admin — Services ─────────────────────────────────────────────────────
  ADMIN_SERVICES: {
    BASE: '/api/admin/services',
    BY_ID: (id: string) => `/api/admin/services/${id}`,
  },

  // ─── Admin — Engineers ────────────────────────────────────────────────────
  ADMIN_ENGINEERS: {
    PENDING: '/api/admin/engineers/pending',
    BY_ID: (id: string) => `/api/admin/engineers/${id}`,
    DELETE: (id: string) => `/api/admin/engineers/${id}`,
    APPROVE: (id: string) => `/api/admin/engineers/${id}/approve`,
    REJECT: (id: string) => `/api/admin/engineers/${id}/reject`,
    VERIFY_GUARANTOR: (id: string) => `/api/admin/engineers/${id}/verify-guarantor`,
  },

  // ─── Admin — Engineer Verification ─────────────────────────────────────────
  ADMIN_ENGINEER_VERIFICATIONS: {
    BASE: '/api/admin/engineer-verifications',
    PENDING: '/api/admin/engineer-verifications/pending',
    BY_ID: (id: string) => `/api/admin/engineer-verifications/${id}`,
    APPROVE: (id: string) => `/api/admin/engineers/${id}/approve`,
    REJECT: (id: string) => `/api/admin/engineers/${id}/reject`,
  },

  // ─── Subscriptions ────────────────────────────────────────────────────────
  SUBSCRIPTIONS: {
    MY: '/api/subscriptions/my',
    SUBSCRIBE: '/api/subscriptions/subscribe',
    VERIFY: (ref: string) => `/api/subscriptions/verify/${ref}`,
    CHANGE_PLAN: '/api/subscriptions/change-plan',
    CANCEL: '/api/subscriptions/cancel',
    AUTO_RENEW: '/api/subscriptions/auto-renew',
    HISTORY: '/api/subscriptions/history',
    ADMIN: '/api/admin/subscriptions',
  },

  // ─── Admin — Bookings ─────────────────────────────────────────────────────
  ADMIN_BOOKINGS: {
    BASE: '/api/admin/bookings',
    BY_ID: (id: string) => `/api/admin/bookings/${id}`,
    STATUS: (id: string) => `/api/admin/bookings/${id}/status`,
    ENGINEERS: (id: string) => `/api/admin/bookings/${id}/engineers`,
  },

  // ─── Admin — Complaints ────────────────────────────────────────────────────
  ADMIN_COMPLAINTS: {
    BASE: '/api/admin/complaints',
    RESPOND: (id: string) => `/api/admin/complaints/${id}/respond`,
  },

  // ─── Guarantor ────────────────────────────────────────────────────────────
  GUARANTOR: {
    VERIFY: (token: string) => `/api/guarantor/verify/${token}`,
    UPDATE: '/api/engineer/guarantor',
    RESEND: '/api/engineer/guarantor/resend',
  },
} as const
