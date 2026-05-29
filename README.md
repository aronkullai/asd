# PromoGuard

PromoGuard is a Next.js casino comparison, review, and promo-code site. It is built to look legitimate, stay compliant, and keep affiliate links separate from promo-code sourcing.

The business model is simple: users compare casinos, read trust and bonus information, copy verified promo codes, and register through configured partner links. PromoGuard may earn a commission from those outbound links, but promo codes should come from real external bonus sources, partner APIs, or manual admin entry.

## Tech Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Prisma ORM
- Postgres
- Vercel deployment
- Email/password auth with HTTP-only session cookies

## Important Rules

- Do not invent promo codes.
- Do not add fake no-deposit bonuses.
- Do not use PromoGuard affiliate links as promo-code sources.
- Only show promo codes that are active, verified, and inside their valid date range.
- Keep source-site IDs hidden from users.
- Always disclose that outbound casino links may be partner links.
- Do not tell users to use VPNs to bypass casino country restrictions, KYC, or local gambling law.
- Keep `.env` files local. Never commit secrets.

## Local Setup

Install dependencies:

```bash
npm install
```

Create or update your existing `.env` file. Do not overwrite a working one.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_PASSWORD_PEPPER="long-random-secret"
AUTH_BCRYPT_ROUNDS="12"
PROMO_RESEARCHER_INTERVAL_HOURS="12"

NEXT_PUBLIC_DISCORD_URL=""
NEXT_PUBLIC_TELEGRAM_URL=""
NEXT_PUBLIC_X_URL=""
NEXT_PUBLIC_NORDVPN_AFFILIATE_URL=""

TRUSTPILOT_API_KEY=""
TRUSTPILOT_API_SECRET=""
TRUSTPILOT_BUSINESS_UNITS_JSON=""

PROMO_API_BASE_URL=""
PROMO_API_KEY=""
PROMO_API_AUTH_TOKEN=""
```

Generate Prisma and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Seed casinos and curated promo data:

```bash
npm run prisma:seed
```

Run the app locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run lint
npm run vercel-build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run researcher:once
npm run researcher
```

`npm run vercel-build` runs:

```bash
prisma generate && prisma migrate deploy && next build
```

On Windows, stop any running Next.js dev server before `prisma generate` or `vercel-build` if Prisma reports an `EPERM` DLL rename error.

## Project Structure

```text
app/                         Next.js routes and API routes
components/                  Shared UI components
config/                      Editable business configuration
lib/                         Data services, auth, researcher logic
prisma/                      Schema, migrations, seed script
public/icons/casinos/        Light and dark casino icons
public/icons/social/         Social icons and NordVPN logo
scripts/                     Researcher runner scripts
```

## Environment Variables

Core:

- `DATABASE_URL`: Postgres connection string.
- `AUTH_PASSWORD_PEPPER`: extra password hashing secret.
- `AUTH_BCRYPT_ROUNDS`: bcrypt cost, default should be around `12`.
- `PROMO_RESEARCHER_INTERVAL_HOURS`: researcher schedule, currently expected to be `12`.

Social links:

- `NEXT_PUBLIC_DISCORD_URL`
- `NEXT_PUBLIC_TELEGRAM_URL`
- `NEXT_PUBLIC_X_URL`

NordVPN:

- `NEXT_PUBLIC_NORDVPN_AFFILIATE_URL`: public affiliate URL used by the NordVPN card.
- `NORDVPN_AFFILIATE_URL`: server-side fallback if needed.

Trustpilot:

- `TRUSTPILOT_API_KEY`
- `TRUSTPILOT_API_SECRET`
- `TRUSTPILOT_BUSINESS_UNITS_JSON`

Promo API:

- `PROMO_API_BASE_URL`
- `PROMO_API_KEY`
- `PROMO_API_AUTH_TOKEN`

## Casinos

Static casino profile data lives in:

```text
lib/casino-data.ts
```

Affiliate URLs live in:

```text
config/affiliateConfig.ts
```

Admin-editable casino trust fields are stored in Postgres and can be edited at:

```text
/admin/casinos
```

Casino trust fields include:

- regulator
- license information
- area regulations and restricted markets
- payout summary
- support quality
- support channels
- safety features

After editing static casino data, run:

```bash
npm run prisma:seed
```

## Casino Icons

Casino icons are theme-aware and live in:

```text
public/icons/casinos/light
public/icons/casinos/dark
```

Naming convention:

```text
light/l_stake.png
dark/d_stake.png
light/l_gamdom.png
dark/d_gamdom.png
```

The component that resolves icons is:

```text
components/CasinoIcon.tsx
```

If you add a new casino, add matching light and dark PNG files. If the slug does not map cleanly to the filename, update `iconFileBySlug` in `components/CasinoIcon.tsx`.

## Social Icons

Social icons live in:

```text
public/icons/social
```

Current files:

```text
l_discord.png
d_discord.png
l_telegram.png
d_telegram.png
l_x.png
d_x.png
l_nordvpn.png
d_nordvpn.png
```

Rendering is handled by:

```text
components/SocialLinks.tsx
```

Social icons appear in:

- desktop header when URLs are configured
- mobile menu
- home page trust section
- about page
- contact page
- footer

If a social URL is not configured, visible community sections show the icon as inactive instead of linking to a fake URL.

## NordVPN Referral

The NordVPN referral component is:

```text
components/NordVpnReferral.tsx
```

It uses:

```text
public/icons/social/l_nordvpn.png
public/icons/social/d_nordvpn.png
```

Set this variable in Vercel to activate the referral CTA:

```bash
NEXT_PUBLIC_NORDVPN_AFFILIATE_URL="https://your-real-nordvpn-affiliate-url"
```

The copy intentionally says NordVPN is for safer everyday browsing. It must not be positioned as a way to bypass casino country rules, identity checks, or local gambling restrictions.

## Promo Codes

Promo codes must be real and verified.

Main files:

```text
config/curatedPromoCodes.ts
config/promoSourcesConfig.ts
config/promoApiConfig.ts
lib/promo-code-validation.ts
lib/promo-code-db.ts
lib/promoResearcher.ts
lib/promo-source-sync.ts
lib/promo-sources/
```

Admin pages:

```text
/admin/promos
/admin/promos/edit
```

Public pages:

```text
/promos
/casinos/[slug]/promos
```

Only promo codes matching all of these rules are shown publicly:

- `isVerified = true`
- `isActive = true`
- not expired
- valid date range, if dates are set

Promo cards show:

- code
- benefit title
- benefit description
- bonus type
- minimum deposit, if known
- wagering requirements, if known
- expiry, if known
- last checked timestamp

The backend stores source IDs for rechecking, but users should not see the external source site.

## Promo Researcher

Run one refresh:

```bash
npm run researcher:once
```

Run scheduled refreshes:

```bash
npm run researcher
```

Schedule config:

```text
config/researcherConfig.ts
```

The researcher should:

- run every 12 hours
- check existing codes
- update `lastCheckedAt`
- deactivate expired or removed codes
- avoid creating fake codes
- log changes for auditability

## Reviews and Trustpilot

Trustpilot integration:

```text
lib/trustpilot.ts
config/trustpilotConfig.ts
```

Manual review admin:

```text
/admin/reviews
```

Manual Trustpilot summary admin:

```text
/admin/reviews
```

User-facing review sections appear on:

```text
/casinos/[slug]
```

If Trustpilot API credentials are missing, the app falls back to manual database reviews and summary data. Do not scrape Trustpilot pages automatically.

## User Ratings

Logged-in users can rate casinos on casino detail pages. Data is stored in the `UserRating` model with one rating per user per casino.

Relevant files:

```text
components/UserRatingSection.tsx
app/api/casinos/[slug]/ratings/route.ts
lib/user-rating-service.ts
```

## Auth

Auth is email/password with hashed passwords and HTTP-only cookies.

Relevant files:

```text
lib/auth.ts
lib/rate-limit.ts
app/api/auth/register/route.ts
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
app/api/auth/me/route.ts
components/AuthProvider.tsx
components/AuthForm.tsx
app/account/page.tsx
```

Registration requires:

- email
- password
- confirm password
- 18+ and terms acceptance
- password strength rules

## Analytics Hooks

Affiliate and promo clicks are tracked through lightweight internal routes:

```text
lib/analytics.ts
app/api/analytics/track/route.ts
app/api/analytics/track-click/route.ts
```

Current behavior is intentionally simple so a real analytics vendor can be plugged in later.

## Admin Workflow

Before launch:

1. Add real affiliate links in `config/affiliateConfig.ts`.
2. Add or verify casino trust profiles in `/admin/casinos`.
3. Add real promo codes in `/admin/promos/edit`.
4. Mark promo codes verified only after checking the source.
5. Add Trustpilot/manual reviews in `/admin/reviews`.
6. Configure social URLs in Vercel.
7. Configure the NordVPN affiliate URL in Vercel.
8. Run `npm run lint`.
9. Run `npm run vercel-build`.
10. Deploy through Vercel.

## Deployment to Vercel

1. Push the repo to GitHub.
2. Connect the GitHub repository to Vercel.
3. Set environment variables in Vercel Project Settings.
4. Ensure Vercel has the same `DATABASE_URL` as production Postgres.
5. Use this build command:

```bash
npm run vercel-build
```

6. Deploy.

After deploy, check:

- `/`
- `/casinos`
- `/promos`
- `/login`
- `/register`
- `/admin/casinos`
- `/admin/promos`
- `/admin/reviews`

## Database and Migrations

Schema:

```text
prisma/schema.prisma
```

Migrations:

```text
prisma/migrations
```

Create a migration during development:

```bash
npx prisma migrate dev --name your_change_name
```

Apply migrations in production:

```bash
npx prisma migrate deploy
```

Never delete old migrations after production deployment.

## Content Safety Checklist

Before publishing a casino:

- Verify the affiliate URL.
- Verify license and regulator text from the live casino terms.
- Verify restricted countries and local-law wording.
- Verify support channels.
- Verify payout claims.
- Verify promo-code benefit and terms.
- Avoid guaranteed-win language.
- Include 18+ and responsible gambling reminders.

## Cleanup Notes

Generated or local-only files should stay out of the repo:

- `.next`
- `node_modules`
- `*.log`
- `*.tsbuildinfo`
- screenshots such as `promoguard-*.png`

The old `public/casino-icons` folder was replaced by the light/dark icon system in `public/icons/casinos`.
