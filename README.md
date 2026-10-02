# Cavi Go · Capline Group

Public repository `Capline-group/Cavi-Go`, as requested by the owner. Firebase project/site: `cavi-go`; owner: `caplinegroup.tj@gmail.com`. This source release adds the admin portal and automatic orders; it still requires Firebase setup and deployment before these features work on the live site.

## Customer, partner and admin

The existing green/white mobile design, five optimized service artworks, 4×2 home grid and Cavi Maps are retained. Languages: Tajik, Russian, Uzbek. Initial city: Dushanbe; currency: TJS.

- `/`: taxi, masters, work, delivery, fuel and profile. Customers request taxi/master/address-to-address delivery work through the map, view active orders and recent history, confirm the offered price and meeting the provider, cancel before work starts, report payment and file a complaint.
- `/driver`: driver/technician application status, matching open-order queue, acceptance, active order actions and history.
- `/admin`: protected dashboard, orders, users, partner applications, drivers, technicians, jobs, complaints, organizations, cities, categories, tariffs, settings and immutable audit.

Orders do not require per-order admin approval. The first approved matching provider who accepts receives the order atomically. Another provider cannot claim the same order, hold a second active order or read the private customer address/contact before assignment. The customer sees assignment and status changes while the page is open. Admin approves partner onboarding, moderates reports and controls intake.

Cash or direct transfer is recorded through independent customer/provider acknowledgements. Prices are proposed by the provider and confirmed by the customer; tariffs are informational. Fuel uses actual OpenStreetMap station data without fabricated prices, routes or arrival times. The delivery catalogue remains unavailable; address-to-address delivery is supported through the map.

## Run and verify

Node 22+. Java 17 for the tested local rules-emulator CLI; the current Firebase CLI may require Java 21 for its emulator.

```sh
npm ci
npm test
npm run test:rules
npm run build
npm run dev:local
```

9 domain tests and 22 Firestore emulator tests cover private access, provider matching, first-accept concurrency, active locks, status transitions, customer consent, fare changes, cancellation, independent payment reports, complaints, audited moderation and job/master flows. Three entry points build successfully. Production provisioning, browser/device QA and a real customer/provider order remain to be verified. Existing Firebase/map chunks still trigger Vite's bundle-size warning.

## Spark deployment

Read [docs/SPARK_SETUP.md](docs/SPARK_SETUP.md) for owner Auth/admin setup, missing defaults, quotas and launch steps. Default `firebase.json` and explicit `firebase.spark.json` deploy **Hosting and Firestore only**. The previous paid-backend config is retained in `firebase.legacy.json`; the Spark client does not call Cloud Functions.

After owner setup and review:

```sh
npm run build
npm run deploy:spark
```

The setup script grants only the verified owner app account's UID. Defaults create order intake disabled; the admin enables services after verification. Never commit credentials, login tokens, service keys, private records, `.env` files or build output. Firebase's public Web config is not an admin credential; Security Rules protect the data.

Spark has finite free quotas. SMS OTP, background GPS/push, server-calculated route fares, merchant catalogues, bank settlement, uploads/CVs, reviews, scheduled timeout/refund and native background operation are not implemented. Map assets remain at `https://sultonmusic.github.io/cavi-maps/`; location is requested by the foreground map button. The complete product requirements remain in `MASTER_REQUIREMENTS.txt`.
