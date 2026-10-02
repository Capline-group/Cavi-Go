# Cavi Go: admin and automatic orders on Spark

Prepared 2026-10-02. Source and emulator verification are complete. This update requires **Firebase deployment**; a GitHub commit does not update the live site. No Firebase billing change has been made.

## What users receive

- `/admin`: authenticated, role-protected responsive admin portal; dashboard, order history, users, partner applications, driver and technician profiles, jobs, complaints, organizations, cities, categories, tariffs, settings and immutable audit.
- `/driver`: driver/technician sign-in, application status, matching open-order queue, first-accept assignment, active order, status actions and order history.
- Customer pages: map-based taxi, master and address-to-address delivery requests; active order and recent history; email verification; price acceptance; cancellation and complaints.
- Uzbek, Russian and Tajik labels. No invented users, trips, ratings or revenue.

Orders do not require admin approval or assignment. A provider is checked once during onboarding. Only an approved provider can see matching available offers and accept work. The first committed acceptance receives the order.

## Order lifecycle

`requested → accepted → arriving → arrived → in_progress → completed`

1. The customer creates a private order, coarse offer, active-customer lock and immutable event in one transaction.
2. An approved matching provider accepts an offer. The private order, offer, active-provider lock and event change atomically. A competing driver loses the race.
3. The customer sees assignment and later status changes through a Firestore listener while the page is open. Exact pickup/contact details are visible only to the assigned participants and admin. The open queue contains a coarse coordinate area, service/category and IDs.
4. The provider proposes a price in integer minor units (TJS × 100). The customer confirms the displayed price. If it changes before confirmation, the client asks for a fresh confirmation. The price cannot change after acceptance.
5. The customer confirms meeting the provider after arrival. Starting work requires both customer confirmations. Only the assigned provider advances the trip.
6. Completion or pre-start cancellation releases both active locks. Cash/direct-transfer reports require separate customer and provider acknowledgements. This is not a bank or payment-gateway receipt.

No Cloud Functions, Cloud Storage, SMS OTP, payment processor or paid Maps API is part of this flow. Foreground location is requested through the map's location button. No background GPS tracking, push/SMS notification, road route calculation, server-calculated fare, scheduled timeout/refund, merchant catalogue, uploads/CV storage or bank settlement is implemented. A tab closed or suspended cannot receive the foreground updates. Orders are initially configured for Dushanbe; creating another city record does not extend order coverage automatically.

## Run and verify locally

Node 22+, Java 17 for the tested local emulator CLI (13.35.1). The current Firebase CLI may require Java 21; it is used for production deployment separately.

```sh
npm ci
npm test
npm run test:rules
npm run build
npm run dev:local
```

The rules runner uses `demo-cavi-go` and runs compilation, emulator and tests in the same process environment. `CAVI_TEST_FIREBASE_CLI_VERSION` can select another exact CLI version. It does not require a production login or modify the real project.

To try the UI with Auth and Firestore emulators, start both with the demo project and launch Vite with `VITE_USE_EMULATORS=true`. Seed demo-only fixtures yourself. The production site cannot enable emulators using a query string. Admin layout-only inspection is available on localhost at `/admin.html?preview=1`; mutations and database reads are disabled in that mode. Browser visual and real-device QA are still outstanding because the local browser preview was blocked in this session.

Verification: 9 domain tests and 22 Firestore emulator tests passed. Checks cover unauthorized admin access/self-promotion, verified-email/service gates, atomic creation, filtered driver queues, simultaneous acceptance, private contacts, provider contact binding, active-order limits, lifecycle/consent/fare races, cancellations, blocked-account safety, independent payment reports, complaints, audited moderation, stale admin edits, job applications and technician dispatch. Production rules/index provisioning, Auth configuration and customer/driver end-to-end tests remain to be performed on the owner's project. The bundle builds successfully; existing Firebase/map bundles still trigger Vite's size warning.

## Owner setup without billing

1. Keep Firebase project `cavi-go` on **Spark**. Verify that Firestore's `(default)` database is provisioned, Email/Password sign-in is enabled and the deployed Hosting domains are authorized. Do not recreate the existing Hosting site. Inspect existing production data before replacing rules.
2. Register and verify the owner app account `caplinegroup.tj@gmail.com`. Obtain its UID from Firebase Auth.
3. Give this account `adminRoles/{UID}` with `role: "admin"` and `enabled: true` using the project's owner credentials. Client rules deny all role writes. The prepared owner setup script validates the exact project, email, verification state and UID; it creates missing defaults without replacing existing configuration. It grants only that owner account.
4. With owner Application Default Credentials already configured locally (never committed):

```sh
npm ci --prefix functions
GOOGLE_CLOUD_PROJECT=cavi-go node functions/setup-spark.mjs OWNER_UID
GOOGLE_CLOUD_PROJECT=cavi-go node functions/setup-spark.mjs OWNER_UID --apply
```

The first command only reviews the concrete intended setup. The `--apply` command grants the protected owner role, creates missing settings/city/categories and records an owner audit. Newly created defaults have order intake disabled. This script was syntax-checked but not run against production. Do not run the legacy `bootstrap-admin.mjs` for arbitrary accounts.

5. Review/deploy the Spark configuration with owner access. Ensure legacy server functions are not writing incompatible documents. The default `firebase.json` and explicit `firebase.spark.json` both use Hosting and Firestore only. The prior paid-backend configuration is preserved as `firebase.legacy.json`; do not use that file for the Spark release.

```sh
npm run build
npx --yes firebase-tools deploy --config firebase.spark.json --only firestore:rules,firestore:indexes --project cavi-go --account caplinegroup.tj@gmail.com
npx --yes firebase-tools deploy --config firebase.spark.json --only hosting --project cavi-go --account caplinegroup.tj@gmail.com
```

Wait for composite indexes to finish building before opening intake. Both commands explicitly omit Functions and Storage. If Firebase asks to enable billing, stop and inspect the project/database state instead of upgrading.

6. Sign in at `/admin`; review the Dushanbe city record, support contacts and services. Verify one real customer/approved-provider order end to end, then enable intake. Partner approval is onboarding; admin never approves individual service orders.
7. If App Check is configured, set the public `VITE_APPCHECK_SITE_KEY` before the production build and test enforced Firestore access. Rules remain required regardless of App Check. Do not activate enforcement before the web app is registered and verified.

Official references: https://firebase.google.com/pricing ; https://firebase.google.com/docs/firestore/manage-data/transactions ; https://firebase.google.com/docs/firestore/query-data/listen ; https://firebase.google.com/docs/firestore/security/rules-conditions . Spark has finite quotas (currently one GiB Firestore storage, 50,000 reads/day and 20,000 writes/day). Listeners, transactions and rules-dependent document reads consume quota. Intake may stop at the free limit; this is not an unlimited free dispatch service.

## Coordination and publication status

The customer UI session owns the base UI/map files. `scripts/integrate-spark.mjs` adds narrow integration points and refuses to write when expected anchors changed. It validates both customer files before touching either and retains the rest of the customer's layout. New admin/Spark files are separate.

The owner has requested that `Capline-group/Cavi-Go` remain **Public** and authorized publishing this source update. Repository visibility and security settings are unchanged. The integrated source preserves the latest customer design, optimized WebP service artwork and Cavi Maps.

Production Firebase configuration/deployment has not been performed by this source update. The owner must configure Auth, provision the default Firestore database, bootstrap their protected admin role, build indexes and verify an actual customer/provider order before opening intake. No billing change is required by the included Spark flow.
