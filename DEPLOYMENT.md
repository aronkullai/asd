# Deploy PromoGuard to promoguard.bet

The easiest production setup is Vercel for the Next.js app and a hosted PostgreSQL database for Prisma.

## 1. Create a production database

Use any hosted PostgreSQL provider, such as Neon, Supabase, Prisma Postgres, Vercel Postgres, or Railway.

Copy the production pooled connection string. It should look like:

```text
postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
```

## 2. Deploy the app on Vercel

1. Push this project to GitHub.
2. In Vercel, import the GitHub repository.
3. Add this environment variable in Vercel:

```text
DATABASE_URL=your-production-postgres-url
```

The repo includes `vercel.json`, so Vercel runs:

```bash
npm run vercel-build
```

That command generates Prisma Client, applies migrations, and builds Next.js.

## 3. Add promoguard.bet

In the Vercel project:

1. Open Settings -> Domains.
2. Add `promoguard.bet`.
3. Add `www.promoguard.bet` too.

At your domain registrar, set DNS records:

```text
Type: A
Name: @
Value: 76.76.21.21
```

```text
Type: CNAME
Name: www
Value: cname.vercel-dns-0.com
```

Then return to Vercel and verify the domain.

## 4. Seed and scan

After the first successful deploy, seed initial casino rows if needed:

```bash
npm run prisma:seed
```

For promo finding, open:

```text
https://promoguard.bet/admin/promos
```

Paste approved promo-source URLs per casino and click `Scan for codes`.

## 5. Before public launch

- Add authentication to `/admin/promos`.
- Replace placeholder Trustpilot/license fields.
- Add real casino PNG/JPG logos in `public/casino-icons`.
- Confirm gambling affiliate and advertising compliance for the countries you target.
