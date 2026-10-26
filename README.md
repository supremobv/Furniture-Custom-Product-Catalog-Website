# SORA - Furniture & Custom Product Catalog

A responsive furniture studio concept with an editorial ivory, olive, and natural wood palette. Built with React, TypeScript, Vinext, Cloudflare Workers, and D1.

## Features

- Eight concept pieces across Seating, Tables, Storage, and Cabinetry.
- Collection and category filters, text search, sorting, empty states, and a browser-local shortlist.
- Product gallery with full image and clearly labeled detail crop, sample dimensions, material and finish directions, quantity, and a live sample estimate.
- Material library, custom cabinetry section, process, FAQ, and photography credits.
- Seven-page downloadable PDF catalog in `public/catalogs/sora-collection.pdf`.
- Custom inquiry forms saved to D1, with server validation, required consent, product-specific material/finish checks, and server-calculated estimates.
- Private `/studio` inquiry inbox, status updates, and JSON export.
- Native modal focus containment, keyboard controls, mobile navigation, reduced-motion support.

## Local development

Requires Node 22.13+ and npm. Install with `node scripts/install-dependencies.mjs` from the installed Sites plugin, or `npm run install:ci` when using this project independently. Then run `npm run dev`. The normal build is `npm run build`; `npm start -- --port 8792` serves the built Worker.

On Windows, npm lifecycle commands can fail when a checkout path contains `&`. This checkout was mapped with `subst W: "C:\Users\primo\Desktop\Furniture & Custom Product Catalog Website"` and npm commands ran from `W:\`. Source synchronization must run from the original absolute path, not the substituted drive.

After the first build, apply each pending local migration once:

```text
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_gifted_stature.sql
```

Do not replay applied migrations. Hosted migrations are applied by the Sites publication workflow. Local test records are separate from the hosted database and excluded from Git.

## Access and inquiry behavior

The hosted Site is owner-private. The studio page and GET/PATCH inquiry APIs require ChatGPT identity and rely on that platform access boundary. **Before changing the Site to public, add a server-side administrator ID allowlist to the studio page and both inbox APIs.** Identity alone is not administrator authorization on a public Site.

POST inquiries validates same-origin requests, input sizes, quantity, consent, product, material, finish, budget, and timeline. An inquiry saves a brief; it does not place an order, take payment, or reserve stock. Email notifications, fulfillment, payment, and production workflows are not configured.

Shortlist selections are stored only in the visitor's browser; they are not account-synchronized. Material and finish selections describe preferences and do not recolor the stock image. Custom dimensions do not change the sample starting estimate; a maker must quote the actual scope.

## Catalog PDF

The static PDF is included and ready to download. To regenerate it from product data:

```text
node scripts/export-catalog-data.mjs
python scripts/build-catalog.py
```

The authoring script requires ReportLab, Pillow, and Windows Arial/Georgia fonts. The PDF does not need Python at runtime. Source data is derived from `app/catalog-data.ts`; temporary JSON and render outputs live in ignored `outputs/`.

## Content and imagery

SORA is a concept brand. All product names, dimensions, construction directions, prices, and collections are sample data, not verified inventory. Photos and a lounge-chair rendering are independent Pexels reference imagery; they do not prove manufacture by SORA. Exact sources and contributor credits are in `/credits` and in the PDF. Confirm actual engineering, materials, samples, pricing, tax, shipping, and installation with a maker before use as a live business catalog.

No external business contact, maker experience, customer review, availability, manufacturing result, or certification is claimed. Replace sample content and photography with approved real business information before public business use.

## Checks

`npx tsc --noEmit`, production build, `node scripts/test-catalog.mjs`, `node scripts/test-inquiries.mjs` against a running local preview, desktop/mobile browser review, and rendered PDF review.

No credentials, dependency directories, build outputs, local database files, or private inquiry exports are tracked. `.openai/hosting.json` retains the Sites deployment identity.
