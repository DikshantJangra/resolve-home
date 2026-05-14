# Backend Handover - Resolve Home (Admin & Platform)

This document provides a detailed technical guide for the backend developer to ensure seamless integration with the existing frontend verification infrastructure.

## Recent Critical Fixes and Architecture

### 1. ID Identification (UUID vs. MongoDB ObjectId)
The frontend uses a tiered ID extraction logic to handle inconsistencies between the platform and admin applications.
- **Current State:** Admin endpoints (like `/approve`) currently fail if sent a MongoDB `_id`. They successfully process the UUID `id`.
- **Recommended Action:** Standardize the backend to accept either ID type in the route parameters OR ensure that the `id` returned in the response objects (`user`, `engineerProfile`) always matches the one required for subsequent `PUT/POST` actions.
- **Affected Endpoints:** All `/api/admin/engineers/{id}/*` routes.

### 2. Authorization Header Persistence
The `apiClient` in `packages/api/src/client.ts` has been fixed to ensure the `Authorization: Bearer <token>` header is attached to all requests containing `/api/`.
- **Note:** Ensure your middleware correctly extracts the token even when requests are forwarded through a proxy (the frontend uses a Next.js proxy at `localhost:3000/api/*`).

---

## Technical Specifications for Verification

### 1. Professional Access Control (The Gate)
Professionals are blocked by a "Setup Wizard" overlay until they are verified.
- **Required Backend Updates:** When an admin approves an engineer, the backend must update:
  - `userProfile.user.isVerified` to `true`.
  - `userProfile.engineerProfile.verificationStatus` to `'approved'`.
  - `userProfile.engineerProfile.isVerified` to `true`.
- **Frontend Check:** The dashboard uses the following exhaustive check:
  ```typescript
  const isVerified = !!(
    user.isVerified || 
    user.status === 'verified' || 
    engineerProfile.verificationStatus === 'approved' ||
    engineerProfile.isVerified
  );
  ```

### 2. Guarantor Verification Workflow
This is an automated flow triggered when a professional finishes their setup.
- **Flow:** Professional submits setup -> Backend sends automated email to guarantor -> Guarantor clicks link -> Backend updates verification status.
- **Data Object Requirement:** The `engineerProfile` should contain a `guarantorVerification` object:
  ```json
  "guarantorVerification": {
    "verified": boolean,
    "verifiedAt": "ISO Date String"
  }
  ```
- **Resend Logic:** The frontend calls `POST /api/guarantor/resend-verification`. The backend should regenerate the token and resend the email to the currently saved guarantor email.

### 3. Handling Empty/Null Data
The frontend has been patched to ignore literal strings like `"null"` or `"undefined"` that were previously being saved into document URL fields.
- **Instruction:** Please ensure that empty fields are either omitted from the JSON response or returned as a primitive `null`. Avoid saving/returning the string `"null"`.

---

## Frontend Architecture & Scalability

The project is built as a **Turborepo Monorepo**, designed for high scalability and code reuse across the `platform` and `admin` applications.

### 1. Project Structure
- **`apps/platform`**: The main customer and professional application.
- **`apps/admin`**: The administrative control panel.
- **`packages/ui`**: A shared library of React components (built on Radix UI and Tailwind CSS v4). Use this for any UI updates to maintain visual consistency.
- **`packages/api`**: The central source of truth for all backend communication.

### 2. State Management Strategy
We follow a strict separation of concerns for state:
- **Server State (React Query):** All data fetched from the backend is managed by **TanStack Query**. 
  - Hooks are centralized in `apps/*/src/hooks/api-hooks.ts`.
  - **Rule:** Do not store API data in local `useState` or Zustand if it can be managed by a query cache.
- **Global UI State (Zustand):** Used for non-persistent UI states like multi-step forms (e.g., `professional-setup-store.ts`).

---

## API Synchronization (The Shared Package)

The monorepo uses a shared API package at `packages/api`.
- **Endpoints:** All frontend routes are defined in `packages/api/src/endpoints.ts`. If you change a route on the backend, you MUST update it here to reflect across both applications.
- **Type Generation:** 
  1. Update your backend OpenAPI/Swagger spec.
  2. Sync the `apps/platform/openapi.json` file.
  3. Run `npm run generate-api` from the root directory to refresh `packages/api/src/api.d.ts`.

---

## Summary of Action Items for Backend
1. Ensure `/api/admin/engineers/{id}/approve` correctly updates all three status flags mentioned in the Access Control section.
2. Implement the `POST /api/guarantor/resend-verification` endpoint.
3. Validate that the guarantor verification email link correctly updates the `guarantorVerification.verified` flag.
4. Clean up existing database entries where document URLs are saved as the string `"null"`.

---
**Handover Date:** May 14, 2026
**Frontend State:** Build Stable (Next.js 15+ App Router)

<!-- Handover Complete -->
