# Resolve Home Frontend Design Spec

## Overview
This document outlines the initial frontend architecture and folder structure for the `resolve-home` project, a home service booking platform.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** 
  - Server State: TanStack Query (React Query)
  - Global Client State: Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** React Icons (as per user preference)
- **API Communication:** Axios

## Architecture: Feature-Based Structure
The project will follow a feature-based organization to group related logic, components, and types together, improving maintainability as the application grows.

### Folder Structure
```
resolve-home/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (public)/        # Public routes (Home, Services, Plans)
│   │   ├── (auth)/          # Authentication routes (Login, Register)
│   │   ├── (dashboard)/     # User dashboard routes
│   │   └── (admin)/         # Admin dashboard routes
│   ├── components/          # Shared components
│   │   ├── ui/              # Shadcn UI base components
│   │   ├── forms/           # Shared form elements
│   │   ├── booking/         # Shared booking-related components
│   │   └── maps/            # Shared map-related components
│   ├── features/            # Feature-specific logic
│   │   ├── auth/            # Auth feature: components, hooks, api, types
│   │   ├── booking/         # Booking wizard feature
│   │   ├── membership/      # Membership management feature
│   │   └── tracking/        # Real-time engineer tracking feature
│   ├── hooks/               # Shared hooks
│   ├── lib/                 # Utilities and third-party configs
│   │   ├── api/             # API clients and endpoints
│   │   ├── utils.ts         # Utility functions
│   │   └── constants.ts     # Global constants
│   ├── store/               # Global state (Zustand)
│   └── styles/              # Global styles
```

## Implementation Plan
1. Initialize Next.js project.
2. Setup Tailwind CSS and Shadcn UI.
3. Create the feature-based folder structure.
4. Install core dependencies (`zustand`, `@tanstack/react-query`, `react-hook-form`, `zod`, `axios`, `lucide-react`, `react-icons`).
5. Configure a basic Axios instance and React Query provider.
