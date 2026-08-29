# HF Nexus Academy

A premium online Islamic education platform offering live classes in Quran, Hadith, Fiqh, Arabic, and classical Islamic sciences, serving students across 17+ countries.


---

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your real values
npx prisma db push
npm run db:seed
npm run dev
```


---

## Folder Structure

```
hf-nexus-academy/
├── prisma/
│   ├── schema.prisma          # Full data model (14+ models)
│   └── seed.ts                # Seeds admin, 3 teachers, 20 courses, 3 blog posts
├── src/
│   ├── app/
│   │   ├── login/ register/ forgot-password/ reset-password/ verify-email/
│   │   ├── student/           # Student portal (protected, role=STUDENT)
│   │   ├── teacher/           # Teacher portal (protected, role=TEACHER|ADMIN)
│   │   ├── admin/             # Admin portal (protected, role=ADMIN)
│   │   ├── api/
│   │   │   ├── auth/          # Register, verify, password reset, NextAuth handler
│   │   │   ├── student/       # Student-facing mutations (notes, profile, submissions)
│   │   │   ├── teacher/       # Teacher-facing mutations (lessons, assignments, grading)
│   │   │   ├── admin/         # Admin-facing mutations (CRUD for every resource)
│   │   ├── robots.ts          # Generated robots.txt (blocks portals from indexing)
│   │   ├── sitemap.ts         # Generated sitemap.xml (all public + dynamic pages)
│   │   └── manifest.ts        # PWA manifest
│   ├── components/
│   │   ├── ui/                # Design-system primitives (Button, Card, Dialog, etc.)
│   │   ├── layout/             # Navbar, Footer, WhatsApp button, Auth shell
│   │   ├── home/               # Home page sections
│   │   ├── forms/               # Auth and lead-capture forms
│   │   └── portal/
│   │       ├── shared/          # Sidebar, stat cards, empty states (used by all 3 portals)
│   │       ├── student/          # Student-portal-specific client components
│   │       ├── teacher/          # Teacher-portal-specific client components
│   │       └── admin/            # Admin-portal-specific client components
│   ├── lib/
│   │   ├── auth.ts              # NextAuth v5 configuration
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── email.ts             # Resend-based transactional email
│   │   ├── courses-data.ts / teachers-data.ts   # Static marketing-page content
│   │   └── data/
│   │       ├── student.ts       # Server-side queries for the student portal
│   │       ├── teacher.ts       # Server-side queries for the teacher portal
│   │       └── admin.ts         # Server-side queries for the admin portal
│   └── middleware.ts            # Route-level RBAC enforcement
├── .env.example                 # Every required environment variable, documented
├── DEPLOYMENT.md                 # Full deployment + third-party service setup guide
└── package.json
```

---

## Design System

- **Colors**: deep ink-navy (`#0A1628`), antique gold (`#C9A961`), warm paper cream (`#FAF8F3`) — defined as Tailwind tokens in `tailwind.config.ts`.
- **Type**: Fraunces (display/headings), Inter (body), JetBrains Mono (numerals/stats).
- **Signature motif**: a "sanad chain" (chain of knowledge transmission) visual device used in the hero illustration and the student-journey section, referencing the Islamic scholarly tradition of verified knowledge transmission.

## Roles & Access

| Role | Portal | Key capabilities |
|---|---|---|
| `TEACHER` | `/teacher` | Manage students, upload lessons, create/grade assignments, mark attendance, send notifications |
| `ADMIN` | `/admin` | Full CRUD on students, teachers, courses, payments, testimonials, blog, announcements, analytics |

Enforced via NextAuth JWT role claims, `middleware.ts` route matching, and per-route ownership checks in API handlers.
