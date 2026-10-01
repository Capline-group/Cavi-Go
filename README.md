# Cavi Go · Capline Group

Firebase project `cavi-go` and Web app were created in caplinegroup.tj@gmail.com on 2026-10-01 UTC. This source is an **initial implementation, not the completed master prompt**. No Cavi Go site deployment has been performed.

## Implemented source
React/TypeScript responsive Tajik/Russian/Uzbek interface; Firebase email/password registration/sign-in; public published jobs and approved technician lists; server-owned pending job submission; duplicate-safe job application transaction; pending driver application; admin job moderation API with audit. Firebase public Web config from new Cavi Go app. Map URL uses https://capline-group-maps.web.app/.

Taxi shows existing Cavi Maps, manual coordinates and optional foreground geolocation. Real order submission is deliberately disabled. It is not a routing/GPS integration yet. No fake driver, price, OTP, payment or success state.

## Run
Node 22: `npm ci`, `npm run build`, `npm test`. Run `npm ci --prefix functions`. Frontend `npm run dev`.

## Deploy prerequisites
1. Source repository is `Capline-group/Cavi-Go`, Private by owner request. Website deployment is on hold. The GitHub connector currently has no installation access to this private repository; initial upload uses the owner-authenticated GitHub UI.
2. Firebase email/password provider, Firestore database and App Check web registration must be configured. Register actual Hosting domains in Auth authorized domains. App Check is enforced by the backend; frontend activation remains to be configured with a reCAPTCHA Enterprise site key, not a secret.
3. Cloud Functions and Cloud Storage production require billing. Project currently uses Spark. Do not upgrade without owner authorizing billing. Use budget alerts / supported spend controls and maxInstances; quotas are not unlimited free service.
4. From owner-authenticated terminal: `npx firebase-tools hosting:sites:create cavi-go --project cavi-go` (only if absent), `npm run build`, `npx firebase-tools deploy --only hosting --project cavi-go`. This publishes frontend only. Backend: provision Firestore and authorized billing/App Check, then deploy functions/firestore rules/indexes separately. Never deploy relaxed rules.
5. Bootstrap first admin using owner-controlled ADC and `functions/bootstrap-admin.mjs UID`. Never commit service account keys. Admin UI remains pending.

## Explicit remaining scope
SMS +992 delivery; all service order/offer/upload/completion workflows; private files/CV/chat; employer applications management UI; dispatch/offers/reservations/PIN; RTDB GPS/presence and assigned-party rules; secure full Maps postMessage bridge and private markers; routing backend and fare server; taxi payment confirmations; reviews/reports; organization memberships; admin UI/settings/provider approval; FCM; full PWA offline experience; pagination beyond first page; idempotency for job publication; App Check initialization; emulator rules/concurrency/E2E tests and actual devices; native background driver app.

The pure domain tests cover validation, integer money, allowed ride transitions and independent payment status only. They do not prove deployed backend, assignment races or rules. RTDB/Storage are deny-all until proper participant isolation and tests are implemented. Firestore is server-write-only and private records are restricted; no universal demo/admin access exists.

Master requirements included at `MASTER_REQUIREMENTS.txt` for continued implementation. Never interpret this initial package as production-ready taxi software.
