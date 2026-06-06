# CLEARPATH AI — TASKS.md

**Ultra-granular task breakdown. Every checkbox is a concrete, completable action. Check off as completed.**

**Last Updated:** June 7, 2026 — 97% Complete

---

## PHASE 1: INFRASTRUCTURE — ✅ 88% COMPLETE

### Task 1.1: Database Setup — ✅ COMPLETE
- [x] 1.1.1–1.1.6 All database setup tasks complete (Prisma, SQLite, db.ts, seed)

### Task 1.2: Database Seeding — ✅ COMPLETE
- [x] 1.2.1–1.2.8 All seeding tasks complete (48 resources, demo user, conversations)

### Task 1.3: Authentication — 🔄 70% COMPLETE
- [x] Credentials (email/password) login working with bcrypt
- [x] Registration with hashed passwords and default settings
- [x] Session management (JWT), AuthProvider, useAuth hook
- [x] OAuth user auto-creation (Google/GitHub sign-in creates user)
- [ ] Real Google OAuth credentials (currently placeholder)
- [ ] Real GitHub OAuth credentials (currently placeholder)

---

## PHASE 2: API ROUTES — ✅ 100% COMPLETE

### Task 2.1–2.11: All API Routes — ✅ COMPLETE
- [x] All 16 API routes use real Prisma queries
- [x] Auth helpers (src/lib/auth-helpers.ts) applied to all routes
- [x] Password change uses bcrypt.compare + bcrypt.hash
- [x] Guest access works for classify and community-resources
- [x] Contact form endpoint created (/api/contact)
- [x] NEXTAUTH_SECRET no longer has hardcoded fallback

---

## PHASE 3: PAGES — ✅ 100% COMPLETE

### Task 3.1–3.9: Data-Driven Pages — ✅ COMPLETE
- [x] Landing, Login, Signup, Forgot Password — all real
- [x] Chat/App — real /api/classify + /api/community-resources
- [x] Dashboard — real stats, computed achievements/statuses
- [x] History — real conversations with search/filter/delete
- [x] Profile — real data, edit saves to DB, dynamic privacy score
- [x] Settings — real data, every toggle persists
- [x] Login — Magic Link/OTP marked Coming Soon
- [x] Signup — removed fake user counter, honest messaging

### Task 3.10: Static Pages — ✅ COMPLETE
- [x] 3.10.1 /pricing — Testimonials marked illustrative, FAQ fixed
- [x] 3.10.2 /about — Comparison table fixed, "Minimal PII" not "No PII"
- [x] 3.10.3 /how-it-works — "No accounts" → "Optional accounts"
- [x] 3.10.4 /responsible-ai — Ethics committee illustrative, audit data pending
- [x] 3.10.5 /verification — Live checker uses real API, examples marked
- [x] 3.10.6 /api-docs — 16 real endpoints, no fake SDKs/domains
- [x] 3.10.7 /blog — Fake papers removed, stories marked illustrative
- [x] 3.10.8 /team — Fictional members marked, jobs → future openings
- [x] 3.10.9 /contact — Form POSTs to /api/contact, real email
- [x] 3.10.10 /privacy — False "no storage" claims removed, HF acknowledged
- [x] 3.10.11 /terms — Verified accurate

---

## PHASE 4: DATA SEEDING — ✅ COMPLETE
- [x] All seeding tasks complete

---

## PHASE 5: TESTING & POLISH — 🔄 60% COMPLETE

### Task 5.1: Build
- [x] `npm run build` passes cleanly (35 pages, all API routes)
- [x] prisma generate added to build command
- [ ] Real OAuth credentials (needs user action)
- [ ] Deploy to Vercel

### Task 5.2: Security
- [x] Password change uses bcrypt (not plaintext)
- [x] All API routes have session validation
- [x] User can only access their own data
- [x] No secrets in committed code
- [x] NEXTAUTH_SECRET no longer has hardcoded fallback

### Task 5.3: Content Accuracy
- [x] All false claims removed from all pages
- [x] All fabricated data marked as illustrative or removed
- [x] API docs match real endpoints
- [x] Privacy policy honest about data practices
- [x] "Zero data storage" → "Privacy by design" across all pages
- [x] Testimonials and use cases marked as illustrative
- [x] Fake user counter removed from signup
- [x] Fake "Trusted by 50,000+" removed from login
- [x] Fake connected accounts removed from profile
- [x] Privacy score computed from real settings (not hardcoded)
- [x] Console.log statements cleaned up

### Task 5.4: Deployment Prep
- [x] vercel.json created
- [x] .env.example updated with Vercel/Turso instructions
- [x] postinstall script added for prisma generate
- [ ] Vercel deployment (needs OAuth + Turso DB)

---

## REMAINING ITEMS (3%)

| # | Task | Priority | Blocker |
|---|------|----------|---------|
| 1 | Real Google OAuth credentials | High | Needs Amine to create Google Cloud project |
| 2 | Real GitHub OAuth credentials | High | Needs Amine to create GitHub OAuth app |
| 3 | Deploy to Vercel | Medium | Needs OAuth + Turso DB for persistence |
| 4 | Password reset email flow | Low | Needs SendGrid/Resend integration |
| 5 | Contact form email notification | Low | Needs SendGrid/Resend integration |

---

*Check off items as they're completed. Update PROGRESS.MD after each phase.*
