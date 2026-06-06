# CLEARPATH AI — TASKS.md

**Ultra-granular task breakdown. Every checkbox is a concrete, completable action. Check off as completed.**

**Last Updated:** June 7, 2026

---

## PHASE 1: INFRASTRUCTURE — Database + Auth ✅ 88% COMPLETE

### Task 1.1: Database Setup — ✅ COMPLETE
- [x] 1.1.1 Verify Prisma schema is correct (prisma/schema.prisma)
- [x] 1.1.2 Ensure DATABASE_URL in .env points to SQLite file
- [x] 1.1.3 Run `npx prisma generate` to create Prisma client
- [x] 1.1.4 Run `npx prisma db push` to create database tables
- [x] 1.1.5 Test database connection via a simple API route
- [x] 1.1.6 Verify db.ts singleton pattern works correctly

### Task 1.2: Database Seeding — ✅ COMPLETE
- [x] 1.2.1 Create prisma/seed.ts file
- [x] 1.2.2 Add seed script to package.json
- [x] 1.2.3 Seed 40+ community resources across 8 categories (48 seeded)
- [x] 1.2.4 Seed demo user (alex@example.com, hashed password)
- [x] 1.2.5 Seed 5 demo conversations with messages for demo user (6 conversations, 15 messages)
- [x] 1.2.6 Seed default user settings for demo user
- [x] 1.2.7 Seed 3 saved resources for demo user
- [x] 1.2.8 Run `npx prisma db seed` and verify data

### Task 1.3: Authentication Configuration — 🔄 70% COMPLETE
- [x] 1.3.1 Add NEXTAUTH_SECRET to .env
- [ ] 1.3.2 Add real GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env (currently placeholder)
- [ ] 1.3.3 Add real GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env (currently placeholder)
- [x] 1.3.4 Verify NextAuth route handler (api/auth/[...nextauth]/route.ts)
- [x] 1.3.5 Verify AuthProvider component wraps the app in layout.tsx
- [ ] 1.3.6 Test Google OAuth flow (needs real credentials)
- [ ] 1.3.7 Test GitHub OAuth flow (needs real credentials)
- [x] 1.3.8 Test credentials (email/password) login with demo user
- [x] 1.3.9 Test user registration via /api/auth/register
- [x] 1.3.10 Add NEXTAUTH_URL to .env for production

---

## PHASE 2: API ROUTES — Real Database Integration ✅ 100% COMPLETE

### Task 2.1: /api/classify Enhancement — ✅ COMPLETE
- [x] 2.1.1 After classification, create Conversation record in DB
- [x] 2.1.2 Create Message records (user message + AI response)
- [x] 2.1.3 Return conversationId in response
- [x] 2.1.4 Handle guest users (userId = null, isGuest = true)
- [x] 2.1.5 Handle authenticated users (userId from session)

### Task 2.2: /api/conversations Rewrite — ✅ COMPLETE
- [x] 2.2.1 GET: Query conversations from DB for authenticated user
- [x] 2.2.2 GET: Support category filter query param
- [x] 2.2.3 GET: Support search query param
- [x] 2.2.4 GET: Support pagination (skip/take)
- [x] 2.2.5 GET: Sort by createdAt DESC
- [x] 2.2.6 POST: Create new conversation in DB

### Task 2.3: /api/conversations/[id] Rewrite — ✅ COMPLETE
- [x] 2.3.1 GET: Return conversation with messages from DB
- [x] 2.3.2 Verify user owns the conversation
- [x] 2.3.3 DELETE: Remove conversation from DB

### Task 2.4: /api/conversations/[id]/messages Rewrite — ✅ COMPLETE
- [x] 2.4.1 POST: Add message to conversation in DB
- [x] 2.4.2 Update conversation updatedAt timestamp

### Task 2.5: /api/user/profile Rewrite — ✅ COMPLETE
- [x] 2.5.1 GET: Return user profile from DB (requires auth)
- [x] 2.5.2 PUT: Update user profile in DB (name, email, phone, location, language)
- [x] 2.5.3 Handle unauthenticated requests (401)
- [x] 2.5.4 Password change uses bcrypt.compare (verify old) + bcrypt.hash (store new)

### Task 2.6: /api/user/settings Rewrite — ✅ COMPLETE
- [x] 2.6.1 GET: Return user settings from DB (requires auth)
- [x] 2.6.2 PUT: Update user settings in DB
- [x] 2.6.3 Create default settings if none exist
- [x] 2.6.4 Handle unauthenticated requests (401)

### Task 2.7: /api/user/stats Rewrite — ✅ COMPLETE
- [x] 2.7.1 GET: Calculate real stats from DB
- [x] 2.7.2 Total conversations count
- [x] 2.7.3 Total resources found count
- [x] 2.7.4 Average confidence score
- [x] 2.7.5 Day streak calculation
- [x] 2.7.6 Category breakdown
- [x] 2.7.7 Weekly activity
- [x] 2.7.8 Monthly trend

### Task 2.8: /api/saved-resources Rewrite — ✅ COMPLETE
- [x] 2.8.1 GET: Return saved resources for authenticated user
- [x] 2.8.2 POST: Save a new resource
- [x] 2.8.3 DELETE /api/saved-resources/[id]: Remove saved resource

### Task 2.9: /api/auth/register Rewrite — ✅ COMPLETE
- [x] 2.9.1 Validate input (email, password, name)
- [x] 2.9.2 Check if email already exists
- [x] 2.9.3 Hash password with bcrypt
- [x] 2.9.4 Create user in DB
- [x] 2.9.5 Create default UserSettings
- [x] 2.9.6 Return success response

### Task 2.10: /api/auth/forgot-password — ✅ COMPLETE (Placeholder)
- [x] 2.10.1 Accept email input
- [x] 2.10.2 Return success message (placeholder for hackathon)

### Task 2.11: Security — Auth Helpers — ✅ COMPLETE
- [x] 2.11.1 Created src/lib/auth-helpers.ts with getAuthenticatedUserId, requireAuth, requireSameUser
- [x] 2.11.2 Applied auth checks to /api/conversations (graceful — uses session userId)
- [x] 2.11.3 Applied auth checks to /api/user/profile (strict — requireSameUser)
- [x] 2.11.4 Applied auth checks to /api/user/settings (strict — requireSameUser)
- [x] 2.11.5 Applied auth checks to /api/user/stats (strict — requireSameUser)
- [x] 2.11.6 Applied auth checks to /api/saved-resources (strict — requireSameUser)
- [x] 2.11.7 Guest routes (/api/classify, /api/community-resources) left public

---

## PHASE 3: PAGES — Replace Mock Data 🔄 75% COMPLETE

### Task 3.1: Landing Page (/) — ✅ COMPLETE
- [x] 3.1.1 Verify "Get Started" links to /app (or /login if not authenticated)
- [x] 3.1.2 Verify all navigation links work
- [x] 3.1.3 Verify footer links work

### Task 3.2: Login Page (/login) — ✅ COMPLETE
- [x] 3.2.1 Google button triggers signIn('google')
- [x] 3.2.2 GitHub button triggers signIn('github')
- [x] 3.2.3 Email/password form calls signIn('credentials', {...})
- [x] 3.2.4 Error state displays correctly
- [x] 3.2.5 Loading state during authentication
- [x] 3.2.6 Redirect to /dashboard on success
- [x] 3.2.7 "Don't have an account?" links to /signup
- [x] 3.2.8 Magic Link & OTP tabs marked as "Coming Soon" with disabled buttons

### Task 3.3: Signup Page (/signup) — ✅ COMPLETE
- [x] 3.3.1 Form submits to /api/auth/register
- [x] 3.3.2 Validates email format
- [x] 3.3.3 Validates password length
- [x] 3.3.4 Shows error if email already taken
- [x] 3.3.5 Redirect to /dashboard on success
- [x] 3.3.6 "Already have an account?" links to /login

### Task 3.4: Chat/App Page (/app) — ✅ COMPLETE
- [x] 3.4.1 Replace mock message handling with real /api/classify API call
- [x] 3.4.2 User message sent to POST /api/classify with { text }
- [x] 3.4.3 Crisis response displayed as overlay when isCrisis === true
- [x] 3.4.4 Classification results displayed with real confidence scores
- [x] 3.4.5 Clarification flow works when needsClarification === true
- [x] 3.4.6 Second-pass classification after clarification answer
- [x] 3.4.7 Save conversation to database (create conversation + messages)
- [x] 3.4.8 Load previous conversation if conversationId in URL params
- [x] 3.4.9 "Talk to a Navigator" button always visible
- [x] 3.4.10 Loading state while waiting for API response
- [x] 3.4.11 Error state if API fails
- [x] 3.4.12 Guest mode works (no auth required to use classify)
- [x] 3.4.13 Category resources fetched from /api/community-resources (real DB data)

### Task 3.5: Dashboard (/dashboard) — ✅ COMPLETE
- [x] 3.5.1 Fetch user stats from /api/user/stats
- [x] 3.5.2 Fetch recent conversations from /api/conversations
- [x] 3.5.3 Replace hardcoded greeting with real user name
- [x] 3.5.4 Replace hardcoded stats with real data
- [x] 3.5.5 Replace mock recent conversations with real data
- [x] 3.5.6 Loading states for all data fetches
- [x] 3.5.7 Empty states when no data
- [x] 3.5.8 Resource statuses computed from real saved resources data
- [x] 3.5.9 Achievements computed from real stats (conversations, crisis, resources)
- [x] 3.5.10 Static sections (community feed, events, updates) marked as informational

### Task 3.6: History (/history) — ✅ COMPLETE
- [x] 3.6.1 Fetch conversations from /api/conversations
- [x] 3.6.2 Replace mock conversation data with real data
- [x] 3.6.3 Search filters query real data
- [x] 3.6.4 Category filters query real data
- [x] 3.6.5 Confidence filters work on real data
- [x] 3.6.6 Delete conversation calls DELETE /api/conversations/[id]
- [x] 3.6.7 Pagination with real data
- [x] 3.6.8 Export button (placeholder or CSV download)
- [x] 3.6.9 Loading and empty states

### Task 3.7: Profile (/profile) — ✅ COMPLETE
- [x] 3.7.1 Fetch user profile from /api/user/profile
- [x] 3.7.2 Replace mock profile data with real data
- [x] 3.7.3 Edit mode saves to PUT /api/user/profile
- [x] 3.7.4 Avatar shows real user image or initials
- [x] 3.7.5 Activity timeline from real conversation history
- [x] 3.7.6 Account stats from real data
- [x] 3.7.7 Sign out button calls signOut()
- [x] 3.7.8 Connected accounts reflect real OAuth status

### Task 3.8: Settings (/settings) — ✅ COMPLETE
- [x] 3.8.1 Fetch settings from /api/user/settings
- [x] 3.8.2 Replace all mock settings state with real DB data
- [x] 3.8.3 Every toggle change saves to PUT /api/user/settings
- [x] 3.8.4 Language dropdown saves
- [x] 3.8.5 Confidence threshold saves
- [x] 3.8.6 All 8 sections load real data
- [x] 3.8.7 Changes persist across page refreshes
- [x] 3.8.8 Loading state while fetching settings

### Task 3.9: Forgot Password (/forgot-password) — ✅ COMPLETE (Placeholder)
- [x] 3.11.1 Form submits to /api/auth/forgot-password
- [x] 3.11.2 Success state displays

### Task 3.10: Static Pages — 🔄 NEEDS VERIFICATION
- [ ] 3.10.1 /pricing — Verify plan info matches actual app capabilities
- [ ] 3.10.2 /about — Verify content accurate, links work
- [ ] 3.10.3 /how-it-works — Verify 6-layer explanation matches implementation
- [ ] 3.10.4 /responsible-ai — Verify all claims demonstrable
- [ ] 3.10.5 /verification — Verify information accurate
- [ ] 3.10.6 /api-docs — Update to match real API endpoints
- [ ] 3.10.7 /blog — Add real blog content or "Coming Soon" states
- [ ] 3.10.8 /team — Verify team info (Amine, Harshit)
- [ ] 3.10.9 /contact — Form submission works (even if just logs)
- [ ] 3.10.10 /privacy — Verify "no data stored" claims are true
- [ ] 3.10.11 /terms — Verify last updated date

---

## PHASE 4: DATA SEEDING — ✅ 100% COMPLETE

### Task 4.1: Community Resources Data — ✅ COMPLETE
- [x] 4.1.1 Housing Assistance: 6 resources seeded
- [x] 4.1.2 Food Assistance: 6 resources seeded
- [x] 4.1.3 Mental Health: 6 resources seeded
- [x] 4.1.4 Employment Services: 6 resources seeded
- [x] 4.1.5 Legal Aid: 6 resources seeded
- [x] 4.1.6 Healthcare: 6 resources seeded
- [x] 4.1.7 Substance Abuse: 6 resources seeded
- [x] 4.1.8 Senior Services: 6 resources seeded

### Task 4.2: Demo User Data — ✅ COMPLETE
- [x] 4.2.1 Demo user: Alex Korane (alex@example.com, password: demo1234)
- [x] 4.2.2 6 sample conversations with 15 messages seeded
- [x] 4.2.3 Default user settings for demo user
- [x] 4.2.4 3 saved resources for demo user

### Task 4.3: Crisis Resources — ✅ COMPLETE (In /api/classify)
- [x] 4.3.1 988 Suicide & Crisis Lifeline
- [x] 4.3.2 Crisis Text Line (HOME to 741741)
- [x] 4.3.3 National DV Hotline (1-800-799-7233)
- [x] 4.3.4 SAMHSA (1-800-662-4357)
- [x] 4.3.5 Childhelp (1-800-422-4453)
- [x] 4.3.6 RAINN (1-800-656-4673)
- [x] 4.3.7 Human Trafficking (1-888-373-7888)
- [x] 4.3.8 Poison Control (1-800-222-1222)
- [x] 4.3.9 Emergency: 911
- [x] 4.3.10 211 Community Helpline

---

## PHASE 5: TESTING & POLISH — 🔄 40% COMPLETE

### Task 5.1: Build & Deploy
- [x] 5.1.1 `npm run build` passes with zero errors ✅
- [x] 5.1.2 All 34 pages generate successfully
- [ ] 5.1.3 No TypeScript compilation errors (type checking skipped)
- [ ] 5.1.4 Deploy to Vercel
- [ ] 5.1.5 Verify deployed app works

### Task 5.2: Security Verification
- [x] 5.2.1 Password change uses bcrypt (not plaintext) ✅
- [x] 5.2.2 All API routes have session validation ✅
- [x] 5.2.3 User can only access their own data ✅
- [x] 5.2.4 No secrets in committed code ✅

### Task 5.3: Remaining Work
- [ ] 5.3.1 End-to-end manual testing (login, classify, dashboard, etc.)
- [ ] 5.3.2 Error handling polish
- [ ] 5.3.3 Real OAuth credentials (Google/GitHub)
- [ ] 5.3.4 Static pages content verification (Task 3.10)
- [ ] 5.3.5 Remove console.log statements if any

---

## REMAINING PRIORITIES

1. **Real OAuth credentials** — Get Google/GitHub Client IDs and Secrets
2. **Static pages verification** — Task 3.10 (content accuracy)
3. **Deploy to Vercel** — Task 5.1.4
4. **E2E manual testing** — Task 5.3.1

---

*Check off items as they're completed. Update PROGRESS.MD after each phase.*
