# ⚡ Resolve Home (Monorepo)

**Premium Electrical & Plumbing Services Platform**

Resolve Home is a modern, high-fidelity platform designed to streamline the booking and management of essential home services. Built as a **Turborepo Monorepo**, it maintains a unified design system and shared API logic across its multiple interfaces.

---

## 🛠️ Technology Stack

- **Monorepo Engine:** [Turborepo](https://turbo.build)
- **Framework:** [Next.js 15+](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **Animations:** [Framer Motion](https://framer.com/motion) + [tw-animate-css](https://github.com/thefubuki/tw-animate-css)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs) + [TanStack Query v5](https://tanstack.com/query)
- **API Client:** Shared [Axios](https://axios-http.com) package with custom interceptors
- **Forms:** [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)

---

## 📦 Workspace Architecture

This project is organized into shared packages and independent applications:

### Applications (`apps/`)
- **`apps/platform`**: The main customer-facing booking and dashboard application.
- **`apps/admin`**: The administrative control panel for managing users, bookings, and financial statistics.

### Shared Packages (`packages/`)
- **`packages/ui`**: Centralized design system containing all Shadcn UI components and the `cn` utility.
- **`packages/api`**: Shared logic including the `apiClient`, `ENDPOINTS` registry, and generated types.

---

## 🔌 Backend & API Integration

This project follows a **Spec-First** approach for backend integration to ensure 100% type safety.

### 🏗️ Type Generation
We use `openapi-typescript` to generate live types from our backend schema.

```bash
# Update shared types from the latest openapi.json
npm run generate-api
```
*Generated types live in `packages/api/src/api.d.ts`.*

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- npm

### 2. Installation
```bash
git clone <repo-url>
cd resolve-home
npm install
```

### 3. Run Development Servers
You can run all applications simultaneously or pick a specific one:

```bash
# Run all (Platform + Admin)
npm run dev

# Run only Platform
npm run dev --workspace=platform

# Run only Admin
npm run dev --workspace=admin
```

---

## 📂 Internal Directory Structure (Platform)

Within `apps/platform/src`:
- `app/`: Next.js App Router (Routes & Layouts)
- `features/`: Feature-sliced components and hooks (e.g., `landing`, `booking`)
- `components/`: App-specific shared components
- `store/`: Global Zustand stores

---

## 🎨 Design System
The design follows a premium "Glassmorphism" and "Dark Mode" aesthetic with:
- Custom color palettes (Harmonious HSL values)
- Sticky stacking card animations in the Service Grid
- Fluid responsive layouts for all screen sizes

---

## 📖 Guidelines for Developers
For a deep dive into implementation rules, state boundaries, and coding standards, refer to [**AGENTS.md**](./AGENTS.md).
