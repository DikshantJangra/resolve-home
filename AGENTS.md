# Resolve Home - Universal Agent Guidelines

This document provides foundational context for any agent working on the `resolve-home` repository. Adhere to these standards to maintain system integrity and consistency.

## Tech Stack & Architecture

- **Framework:** Next.js 14+ (App Router).
- **Styling:** Tailwind CSS v4 + Shadcn UI.
- **State Management:**
  - **Server State:** TanStack Query (React Query) - *Primary source of truth for remote data.*
  - **Global Client State:** Zustand - *Used for UI state, multi-step forms, and session-specific data.*
- **Forms:** React Hook Form + Zod for validation.
- **API:** Axios with interceptors for auth and error normalization.

## Folder Structure (Feature-Based)

- `src/app/`: Route groups for `(public)`, `(auth)`, `(dashboard)`, and `(admin)`. Each group has its own specialized layout.
- `src/features/`: Contains feature-specific components, hooks, api calls, and types (e.g., `features/booking`).
- `src/components/ui/`: Base Shadcn UI components.
- `src/lib/api/`: Centralized API client and endpoints configuration.
- `src/store/`: Global Zustand stores.

## Key Conventions

### 1. API Communication
- Always use the centralized `apiClient` from `src/lib/api/client.ts`.
- Reference endpoints from `src/lib/api/endpoints.ts`.
- Global error handling is integrated into the interceptors (using Sonner toasts).

### 2. State Management Boundaries
- **NEVER** store data in Zustand that should be managed by React Query (e.g., user profile fetched from DB).
- Use Zustand for data that needs to persist across routes but isn't saved to the DB yet (e.g., current progress in the booking wizard).

### 3. Styling Standards
- Use Tailwind CSS utility classes.
- Prefer Shadcn UI components for complex UI elements.
- **Strict Rule:** Avoid colored shadow effects on buttons (e.g., `shadow-[#f58518]/20`). Keep buttons clean or use neutral shadows.

### 4. Authentication
- Tokens are stored in `localStorage` as `auth_token`.
- The `apiClient` automatically attaches the token to outgoing requests.
- Handle 401/403 errors globally via the response interceptor.

## Implementation Roadmap

1. **Auth System:** Implementation of Login/Register features.
2. **Booking Wizard:** Multi-step form using `useBookingStore`.
3. **Membership Management:** Subscription flows and plan upgrades.
4. **Engineer Tracking:** Real-time tracking using Map components and WebSockets/Polling.
