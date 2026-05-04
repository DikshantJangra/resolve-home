# Resolve Home Frontend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a robust Next.js frontend with a feature-based folder structure, Shadcn UI, and core state management libraries.

**Architecture:** Feature-based folder structure under `src/` to group related logic, components, and types. Uses Next.js App Router for routing.

**Tech Stack:** Next.js (Latest), TypeScript, Tailwind CSS, Shadcn UI, Zustand, TanStack Query, React Hook Form, Zod, Axios, React Icons.

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `resolve-home/*` (Project root)

- [ ] **Step 1: Run create-next-app**

Run: `npx create-next-app@latest resolve-home --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git`
Expected: Success message and a new `resolve-home` directory with standard Next.js files.

- [ ] **Step 2: Cleanup default files**

Remove `src/app/page.tsx` and `src/app/globals.css` default content to start fresh.

- [ ] **Step 3: Verify installation**

Run: `npm run dev` (inside `resolve-home`)
Expected: Server starts on port 3000.

---

### Task 2: Initialize Shadcn UI

**Files:**
- Modify: `components.json`, `tailwind.config.ts`, `src/app/globals.css`

- [ ] **Step 1: Run shadcn-ui init**

Run: `npx shadcn-ui@latest init`
Expected: Follow prompts (Style: Default, Color: Slate, CSS Variables: Yes).

- [ ] **Step 2: Install common components**

Run: `npx shadcn-ui@latest add button card input label toast`
Expected: Components added to `src/components/ui`.

---

### Task 3: Scaffold Feature-Based Folder Structure

**Files:**
- Create: Directories under `src/`

- [ ] **Step 1: Create directory structure**

Run:
```bash
mkdir -p src/app/\(public\) src/app/\(auth\) src/app/\(dashboard\) src/app/\(admin\)
mkdir -p src/components/forms src/components/booking src/components/maps
mkdir -p src/features/auth src/features/booking src/features/membership src/features/tracking
mkdir -p src/hooks src/lib/api src/store src/styles
```

- [ ] **Step 2: Create placeholder files**

Create `src/lib/utils.ts` (if not already there), `src/lib/constants.ts`, and `src/lib/api/client.ts`.

---

### Task 4: Install Core Dependencies

- [ ] **Step 1: Install libraries**

Run: `npm install zustand @tanstack/react-query axios react-hook-form @hookform/resolvers zod lucide-react react-icons`
Expected: `package.json` updated with these dependencies.

---

### Task 5: Configure Base Providers and API Client

**Files:**
- Create: `src/components/providers/query-provider.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/lib/api/client.ts`

- [ ] **Step 1: Set up React Query Provider**

```typescript
// src/components/providers/query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

- [ ] **Step 2: Wrap Root Layout**

Include `QueryProvider` and Shadcn `Toaster` in `src/app/layout.tsx`.

- [ ] **Step 3: Initialize Axios Client**

```typescript
// src/lib/api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
```
