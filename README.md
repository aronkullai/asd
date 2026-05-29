# PromoGuard

Trust-first casino rating and promo code site built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and a scheduled promo researcher.

## Run locally

```bash
npm install
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`.

## Database

Copy `.env.example` to `.env` and set `DATABASE_URL` to a real PostgreSQL connection string.

```bash
npm run prisma:migrate
npm run prisma:seed
```

The Prisma schema defines:

- `Casino`
- `PromoCode`
- `Review`
- `TrustpilotMeta`
- `PromoCodeChange`

## Where to edit partner links and promo codes

Edit `config/affiliateConfig.ts`.

Each entry uses the same `slug` as `/casinos/[slug]`.

```ts
{
  name: "Stake",
  slug: "stake",
  affiliateLink: "PASTE_YOUR_REAL_PARTNER_LINK_HERE",
  affiliatePromoCodes: [
    {
      code: "PASTE_YOUR_REAL_CODE_HERE",
      label: "Welcome Bonus",
      description: "Add the real benefit summary here",
      conditions: "Add wagering, minimum deposit, country limits, and expiry",
      priority: 100
    }
  ]
}
```

If you do not have a promo code for a casino, leave `affiliatePromoCodes` undefined or as `[]`. The UI will hide promo-code blocks instead of showing placeholders.

Every outbound offer button uses only `affiliateLink` from `config/affiliateConfig.ts`. You can paste links with or without `https://`; the UI normalizes them before opening. External promo sources can add codes, but they never change partner links.

## Where to edit casino review data

Edit `lib/casino-data.ts`.

Casino icons are configured in each casino object:

```ts
logoText: "ST",
logoIcon: {
  imageSrc: "/casino-icons/stake.png",
  imageAlt: "Stake logo",
  symbol: "bolt",
  gradient: ["#07111f", "#12243a", "#1f9d7a"],
  accent: "#9cf6cf"
}
```

Put PNG/JPG/WebP files in `public/casino-icons/`. The public URL is the same path without `public`, for example:

- file: `public/casino-icons/stake.png`
- config: `imageSrc: "/casino-icons/stake.png"`

If an image is missing or fails to load, PromoGuard falls back to the generated icon using `logoText`, `symbol`, `gradient`, and `accent`.

Available `symbol` values are `bolt`, `rain`, `gem`, `snow`, `shield`, `dice`, `coins`, and `crown`.

Important placeholder fields:

- `trustpilot.score`
- `trustpilot.reviewCount`
- `trustpilot.profileUrl`
- `fetchMetadata.sourceUrl`

Do not put partner tracking URLs or owned promo codes in `lib/casino-data.ts`; keep them in `config/affiliateConfig.ts`.

## Promo researcher

Configuration lives in `config/researcherConfig.ts`.

The active source is `PublicPromoPage`. It scans approved source URLs, extracts likely promo codes from nearby "promo code", "bonus code", "coupon code", and offer text, then stores the findings in the database with source/history records.

You can configure source URLs in `config/researcherConfig.ts`:

```ts
{ slug: "stake", enabledSources: ["PublicPromoPage"], sourceUrls: ["https://example.com/stake-codes"] }
```

Or with env vars:

```bash
PROMO_SOURCE_URLS_STAKE="https://example.com/stake-codes,https://example.com/stake-bonuses"
```

The admin page also supports one-off scans: paste source URLs into `/admin/promos` and click "Scan for codes".

Run once:

```bash
npm run researcher:once
```

Run for one casino:

```bash
npm run researcher:once stake
```

Run scheduled:

```bash
npm run researcher
```

Change the interval with `PROMO_RESEARCHER_INTERVAL_MINUTES` in `.env` or edit `config/researcherConfig.ts`.

Default:

```text
30 minutes
```

Manual admin refresh endpoint:

```text
POST /api/admin/research/promos
```

The researcher is provider-based. Add approved sources under `lib/promo-sources/` and register them in `lib/promo-sources/index.ts`.

Current placeholder providers:

- `MockSourceA`
- `MockSourceB`

Each provider implements `ExternalPromoSource.fetchCodesForCasino`. Replace the mocked logic with an approved partner API, affiliate dashboard export, RSS feed, or manual source. Do not implement aggressive scraping.

External researcher codes are stored with `isAffiliateOwned: false`. Promo pages combine:

- Affiliate codes from `config/affiliateConfig.ts`, shown first and marked as PromoGuard recommended.
- External codes from the database or `lib/external-promo-data.ts`, shown below as public third-party codes.

The merged list is ranked with affiliate-owned codes first, then by `priority`, then by last updated time. External code sources never provide or override referral URLs.

## Trustpilot integration

Trustpilot config lives in `config/trustpilotConfig.ts`.

Add your server-side credentials to `.env`:

```bash
TRUSTPILOT_API_KEY="PASTE_TRUSTPILOT_API_KEY_HERE"
TRUSTPILOT_API_SECRET="PASTE_TRUSTPILOT_API_SECRET_HERE"
TRUSTPILOT_CACHE_HOURS="6"
```

For each casino, paste either:

- `businessUnitId` if you know the Trustpilot Business Unit ID.
- `domain` if the server should resolve the Business Unit ID with Trustpilot's Business Units find endpoint.
- `profileUrl` as a fallback link when API data is unavailable.

Trustpilot code lives in `lib/trustpilot.ts`.

Implemented helpers:

- `getTrustpilotOAuthAccessToken()` for the server-only client credentials flow.
- `resolveBusinessUnitIdFromDomain(domain)`.
- `getBusinessUnitSummary(businessUnitId)`.
- `getLatestReviews(businessUnitId, options)`.
- `getCachedBusinessUnitSummary(slug)`.
- `getCachedLatestReviews(slug, limit)`.

The UI hides Trustpilot blocks gracefully when credentials or Business Unit IDs are missing. API keys and secrets are never sent to browser code.

## Production notes

- Protect `/admin/promos` and `/api/admin/promos/refresh` with real authentication.
- Replace legal placeholder pages with jurisdiction-specific legal text.
- Verify licenses, Trustpilot profile URLs, promo terms, and responsible gambling links before launch.
- Add real email delivery or database logging to `/api/contact`.
