# Bogd Automall

Production vehicle dealership platform for Bogd Automall.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui +
Supabase (PostgreSQL, Auth, Storage) + Vercel.

## Project status

This is the **Phase 1 scaffold**: folder structure, base UI components, and
placeholder pages for every core route. No real data, auth, or design yet —
those come in later phases.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open http://localhost:3000 in your browser.

## Folder structure

```
src/
  app/                  Routes (App Router)
    page.tsx            Home
    inventory/          Inventory listing + [id] vehicle detail
    about/
    contact/
    privacy/
    terms/
    admin/
      login/
      dashboard/
    not-found.tsx       Custom 404
  components/
    ui/                 shadcn/ui base components (Button, Card, Input...)
  lib/
    utils.ts            cn() class-merging helper
public/
  logo/                 Put your logo files here (see logo/README.md)
  images/vehicles/      Vehicle images (if not using Supabase Storage directly)
```

## Roadmap (six-phase plan)

1. Account & infrastructure setup (Gmail, GitHub, Supabase, Vercel) — done
2. Project scaffolding — you are here
3. Database design (Supabase schema)
4. Core public site (Home, Inventory, Vehicle Detail, About, Contact)
5. Admin panel (auth, vehicle CRUD, uploads)
6. SEO / performance / security hardening + deployment
