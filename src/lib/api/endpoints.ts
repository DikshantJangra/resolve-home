export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  BOOKINGS: {
    BASE: '/bookings',
    GET_BY_ID: (id: string) => `/bookings/${id}`,
  },
  SERVICES: {
    BASE: '/services',
  },
  MEMBERSHIPS: {
    BASE: '/memberships',
  },
} as const
