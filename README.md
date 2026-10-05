# JK Interior — Mumbai Turnkey Interior Architecture & Design Atelier

Established by master craftsman Kishorilal Sharma in Mumbai, JK Interior delivers turnkey residential sanctuaries, penthouses, and bespoke commercial spaces with in-house workshop joinery and zero subcontracting.

## Development & Database Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` based on `.env.example`:

```bash
DATABASE_URL="<connection string from your PostgreSQL provider>"
PEXELS_API_KEY=""

# Cloudinary Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email Notifications
EMAIL_API_KEY=""
EMAIL_FROM=""
LEADS_NOTIFICATION_EMAIL=""
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin Authentication
ADMIN_SESSION_SECRET=""
PORT=3000
```

Keep `.env` and `.env.local` private. Use the connection string from the project's existing PostgreSQL provider; do not create another database if one is already configured. The application can start without a database, but database-backed features will be unavailable.

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Run Database Migration

```bash
npm run db:migrate
```

If Prisma reports drift or requests a database reset, stop and inspect the database before proceeding. Never run `prisma migrate reset` against client data.

### 5. Seed Development Database

```bash
npm run db:seed
```

Seeds:

- Studio identity settings (JK Interior, Kishorilal Sharma, Mumbai), without contact details
- Six Confirmed Architectural Services
- Existing settings and service records are preserved on reseed
- _No projects, testimonials, or leads are created._

### 6. Run Application

```bash
npm run dev
```

---

## Admin CMS & Authentication (Phase 4)

- **Portal URL**: Access via `/#admin` or `/admin` (or the "Studio CMS" link in the footer).
- **Protected Sections**:
  - Dashboard: Real-time project counts, new consultation inquiries, services, testimonials
  - Projects: Multi-section form, drag/drop Cloudinary upload, cover selector, gallery reordering, draft/published toggle, concept safety guards
  - Services: The 6 confirmed turnkey disciplines
  - Leads: Consultation pipeline (`NEW`, `CONTACTED`, `QUALIFIED`, `SITE_VISIT`, `PROPOSAL`, `WON`, `CLOSED`), quick Call/WhatsApp/Email actions, admin-only internal notes
  - Testimonials: Verified client endorsements
  - Media Library: Filter by source (`JK Interior`, `Inspiration`, `Concept`) with metadata
  - Site Settings: Centralized branding, WhatsApp desk, contact details, and SEO metadata

---

## Cloudinary Media Integration (Phase 5)

1. Sign up at [Cloudinary](https://cloudinary.com/).
2. In the Cloudinary Dashboard, obtain your **Cloud Name**, **API Key**, and **API Secret**.
3. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`.
4. Signed upload endpoint: `/api/sign-cloudinary-params` authenticates the admin session server-side before generating signatures.
5. Assets are structured in `jk-interior/projects/[slug]/` and `jk-interior/media/`.

---

## Lead Management, Email & WhatsApp (Phase 6)

- **Consultation Form**: Server-side Zod validation at `POST /api/leads`.
- **Anti-Spam**: Invisible honeypot trap, duplicate click throttling, and sanitized phone/email normalization.
- **WhatsApp Concierge**: Auto-generates click-to-chat links pre-filled with client name, property type, and precinct.
- **Email Notifications**: Automatically dispatches studio notification to `LEADS_NOTIFICATION_EMAIL` and client confirmation email. Email transport failure safely falls back without deleting the lead.

---

## SEO, Search Engine Indexing & Analytics (Phase 7)

- **Dynamic Meta Titles & Descriptions**: Follows strict architectural editorial patterns for all public routes (`/`, `/projects`, `/services`, `/studio`, `/process`, `/contact`, `/inspiration`).
- **Dynamic Production Sitemap**: Available at `/sitemap.xml`, dynamically compiling published projects (`status = PUBLISHED AND isConcept = false`) and published services while strictly excluding all admin routes.
- **Robots Directives**: Available at `/robots.txt`, allowing public routes while disallowing `/admin`, `/admin/*`, and `/api/admin/*`.
- **Structured Data (JSON-LD)**: Injected `HomeAndConstructionBusiness` / `LocalBusiness` schema with Kishorilal Sharma as founder, Mumbai geo-coordinates, and `BreadcrumbList`.
- **Privacy-Conscious Analytics**: Configurable via `VITE_GA_MEASUREMENT_ID`. Strips PII (phone, email, lead messages) and tracks non-sensitive milestones (`page_view`, `project_view`, `service_view`, `consultation_form_completed`, `whatsapp_clicked`).

---

## Architectural Animation & Micro-Interactions (Phase 8)

- **Design Constitution**: Subtle, architectural, and editorial. Zero flashy gaming effects or Three.js.
- **Hero Staggered Reveal**: High-priority LCP image preloading, eyebrow fade, upward title reveal, and button hover micro-interactions.
- **Hover Micro-interactions**: Controlled ~1.03 scale on images, arrow translations, and gold accent line reveals.
- **Full Reduced-Motion Compliance**: Enforces `@media (prefers-reduced-motion: reduce)` to disable non-essential motion for accessibility.
