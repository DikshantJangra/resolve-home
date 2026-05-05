# ⚡ Resolve Home

**Premium Electrical & Plumbing Services Platform**

Resolve Home is a modern, high-fidelity platform designed to streamline the booking and management of essential home services. Built with a focus on speed, reliability, and visual excellence, it connects users with expert engineers for seamless home maintenance.

---

## 🛠️ Technology Stack

- **Core:** [Next.js 15](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **Animations:** [Framer Motion](https://framer.com/motion) + [tw-animate-css](https://github.com/thefubuki/tw-animate-css)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs) (UI/Form State) + [TanStack Query v5](https://tanstack.com/query) (Server State)
- **API Client:** [Axios](https://axios-http.com) with custom interceptors
- **Forms:** [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)

---

## 🔌 Backend & API Integration

This project follows a **Spec-First** approach for backend integration to ensure 100% type safety and a single source of truth.

### 📜 Documentation
- **[API Reference (Human Readable)](./docs/API.md)**: Categorized list of endpoints, request bodies, and responses.
- **[OpenAPI Spec (Raw)](./docs/openapi.json)**: The master JSON specification fetched from the production backend.

### 🏗️ Type Generation
We use `openapi-typescript` to generate live types from our backend schema. This prevents runtime API errors and ensures our frontend always matches the backend contract.

```bash
# Update local types from the latest openapi.json
npm run generate-api
```
*Generated types live in `src/types/api.d.ts`.*

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

### 3. Environment Setup
Create a `.env.local` file (refer to `.env.example`):
```env
NEXT_PUBLIC_API_URL=https://resolvhome.onrender.com
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

- `src/app/`: Next.js App Router (Routes & Layouts)
- `src/features/`: Feature-sliced components, hooks, and logic (e.g., `landing`, `booking`)
- `src/components/ui/`: Reusable Shadcn UI base components
- `src/lib/api/`: Centralized API client and [endpoint registry](./src/lib/api/endpoints.ts)
- `src/store/`: Global Zustand stores for persistent UI state
- `docs/`: Project documentation and API specifications

---

## 🎨 Design System
The design follows a premium "Glassmorphism" and "Dark Mode" aesthetic with:
- Custom color palettes (Harmonious HSL values)
- Sticky stacking card animations in the Service Grid
- Fluid responsive layouts for all screen sizes

---

## 📖 Guidelines for Developers
For a deep dive into implementation rules, state boundaries, and coding standards, refer to [**AGENTS.md**](./AGENTS.md).
