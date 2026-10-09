# JK Interior

JK Interior is a public interior design website with a Vite/React frontend, an Express API, a Prisma/PostgreSQL data layer, and an admin portal.

## Local setup

Use Node.js 20.19+ or 22.12+ and npm. `package-lock.json` is authoritative; install with `npm ci`.

```bash
npm ci
Copy-Item .env.example .env
npm run db:generate
npm run dev
```

The application uses the `PORT` value (3000 by default). Database-backed features need a valid `DATABASE_URL`. Without it, the server may start, but admin login, projects, settings, and lead storage are not operational.

## Environment variables

Copy `.env.example` to `.env` for local work. The example contains empty placeholders only. Never commit `.env`, `.env.local`, or deployment credentials. Variables prefixed `VITE_` are public browser configuration; never put secrets in them.

- `DATABASE_URL`: PostgreSQL connection string; required for database-backed features.
- `ADMIN_SESSION_SECRET`: server-only value used by the current password hash compatibility check.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: optional signed media uploads; the API secret must remain server-only.
- `EMAIL_API_KEY`, `EMAIL_FROM`, `LEADS_NOTIFICATION_EMAIL`: optional lead notification delivery.
- `PEXELS_API_KEY`: optional server-side inspiration provider.
- `SITE_URL`: optional canonical absolute origin for generated links; otherwise the request host is used.
- `VITE_GA_MEASUREMENT_ID`: optional public analytics identifier. Analytics events must never include customer details.
- `PORT`, `DISABLE_HMR`: local/server runtime options.

Set real staging and production values in the hosting provider's secret manager. Do not put production credentials in source control or README files.

## Commands

- `npm ci`: install the locked npm dependency tree.
- `npm run dev`: run the Express server with Vite middleware.
- `npm run lint`: TypeScript check (`tsc --noEmit`).
- `npm test`: run the Node test suite for lead validation and project publication rules.
- `npm run build`: create the production Vite client bundle.
- `npm start`: run the server in production mode; build first.
- `npm run db:generate`: generate the Prisma client.
- `npm run db:migrate`: create/apply a development migration.
- `npm run db:deploy`: apply reviewed migrations in deployment environments.
- `npm run db:seed`: seed initial settings and confirmed service records; it does not create projects, testimonials, or leads.

The current focused tests do not cover database integration, authentication, authorization, Cloudinary, email delivery, or browser workflows. Do not treat a passing build or this small suite as production readiness.

## Database workflow

Prisma schema and committed migrations are under `prisma/`. In development, update the schema and create a migration with `npm run db:migrate`; review the generated SQL and test it against a non-production database. Deploy reviewed migrations with `npm run db:deploy`. Never run `prisma migrate reset` against client data or use `db push` as the production deployment workflow. No live database was validated as part of this repository pass.

Production PostgreSQL must have automated backups, point-in-time recovery where supported, and tested restoration. No backup provider or restore procedure is configured in this repository.

## Public content and admin

The admin portal is under `/admin` (also available from `/#admin`). Configure verified contact details in Site Settings; public call and WhatsApp actions stay hidden when values are empty. Published portfolio queries exclude concept records and only return project images marked `JK_INTERIOR` and not concept imagery. Add verified project content and photographs before publishing. Inspiration imagery is separate from the project portfolio.

## Production status

**Not production-ready yet.** The local build and TypeScript check can pass without proving database connectivity, authentication security, integration configuration, or successful lead delivery. Before launch, address and verify at least:

- Admin passwords currently accept a plain-text comparison fallback; sessions are stored in process memory and are not durable across restarts or multiple instances.
- `ADMIN` and `EDITOR` roles are stored but server endpoints do not enforce separate permissions.
- Cloudinary uploads have a signed folder allowlist and image-format allowlist plus browser-side MIME/size checks; server-verified file size, metadata, and project association are not enforced end to end.
- Public lead and login throttling is process-local and is not suitable as the only control for a multi-instance deployment.
- Configure and verify a production database, strong server secrets, Cloudinary, email delivery, HTTPS, domain, backups, and restore tests.
- Add automated tests for lead validation/storage, public project filtering, admin authorization, uploads, settings, and API failures.
- Review the remaining unsupported claims and real client content before publication; no verified testimonials are supplied in this repository.

Do not publish until these risks are resolved and staging workflows have been tested end to end.