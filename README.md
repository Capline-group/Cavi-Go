# Cavi Go · Capline Group

Source: public `Capline-group/Cavi-Go`, as requested by the owner. Firebase project and Web app: `cavi-go`, owned by `caplinegroup.tj@gmail.com`. The owner deployed the initial frontend at https://cavi-go.web.app/ on 2026-10-01 UTC. Version 0.2.0 below is a source update; it is not yet deployed.

## Current interface

Responsive Tajik/Russian/Uzbek interface based on the supplied green/white references: Home, Taxi, Masters, Work, Delivery, Fuel and Profile. Reference names, ratings, balances, prices, restaurants, drivers and arrival times are not seeded as real data.

- Home links to all five service areas and partner applications. No fabricated active trip.
- Work and Masters read published/approved Firestore records, with search, category filters, sorting and detail dialogs. Lists can request additional records up to 100. Search and sorting operate on the loaded records, not the complete database. Failure and empty states are separate.
- Taxi renders Cavi Maps directly, without the full Maps app menus. Actual public places can be searched or selected on the map; pickup/destination markers, place details and optional foreground location are available. Mode/class controls prepare the screen only: quotes, road routing and real trip submission are not enabled.
- Fuel displays actual `amenity=fuel` places from the existing Cavi Maps OpenStreetMap dataset, with search, a 24/7 tag filter and selection on the map. Prices, distance and travel times are not fabricated; hours are source tags and may be outdated. The visible list is limited to 40 matching stations, ordered by proximity to the default Dushanbe centre.
- Delivery has category/search controls and an explicit pre-launch state; no partner catalogue or order submission exists yet.
- Profile exposes sign-in/registration, name editing, own job applications, language, payment information, address information, password reset and support/about dialogs. Saved addresses, push notifications, promo codes and balances are not implemented.

The map engine loads only on map pages. Public map assets are fetched from https://sultonmusic.github.io/cavi-maps/; the existing Maps frontend URL is https://capline-group-maps.web.app/. Location selections remain in component memory. Foreground GPS is requested only by pressing the location button. Hashed Hosting assets have long-lived cache headers; the entry HTML is revalidated.

## Backend source and validation

Firebase email/password client integration; server-owned pending job submission; duplicate-safe job applications; pending driver/technician applications; admin job moderation with audit. Technician specialization is retained in its application. No demo admin or universal private-data read exists. Callable functions enforce App Check. Firestore rules restrict private records and deny client writes; Storage and RTDB remain deny-all pending complete participant isolation.

`npm run build` type-checks and builds the frontend. `npm test` runs five pure-domain checks for validation, integer money, ride transition constraints and independent payment status. These checks do not validate deployed rules, dispatch concurrency, map rendering, Firebase setup or an end-to-end order.

## Run and publish frontend

Use Node 22 or newer supported by the dependencies:

```sh
npm ci
npm run build
npm test
npx --yes firebase-tools deploy --only hosting --project cavi-go --account caplinegroup.tj@gmail.com
```

The Hosting site already exists; do not recreate it. Publish Hosting only until the backend prerequisites are complete. Never commit Firebase login caches, tokens, service account keys, private user records, `.env` files or build output.

## Production work remaining

Firebase Auth providers/authorized domains, Firestore provisioning, App Check web initialization and production backend deployment still require verification/configuration. Cloud Functions and Storage production require owner-authorized billing; the project was created on Spark. Do not upgrade silently.

The full master prompt is in `MASTER_REQUIREMENTS.txt`. Remaining work includes +992 SMS delivery verification; service orders/offers/uploads/completion; employer management; secure files/CV/chat; dispatch/reservations/PIN; assigned-party GPS/presence rules; road routing and server fares; payment confirmations; reviews/reports; organizations; admin UI and provider approvals; FCM; offline PWA; database-wide pagination/search; emulator/rules/concurrency/E2E/device tests and a native background driver app. This frontend is not a production-ready taxi platform.
