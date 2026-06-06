# CLEARPATH AI — TASKS.md

**Ultra-granular task breakdown. Every checkbox is a concrete, completable action. Check off as completed.**

---

## PHASE 1: INFRASTRUCTURE — Database + Auth

### Task 1.1: Database Setup
- [ ] 1.1.1 Verify Prisma schema is correct (prisma/schema.prisma)
- [ ] 1.1.2 Ensure DATABASE_URL in .env points to SQLite file
- [ ] 1.1.3 Run `npx prisma generate` to create Prisma client
- [ ] 1.1.4 Run `npx prisma db push` to create database tables
- [ ] 1.1.5 Test database connection via a simple API route
- [ ] 1.1.6 Verify db.ts singleton pattern works correctly

### Task 1.2: Database Seeding
- [ ] 1.2.1 Create prisma/seed.ts file
- [ ] 1.2.2 Add seed script to package.json
- [ ] 1.2.3 Seed 40+ community resources across 8 categories
- [ ] 1.2.4 Seed demo user (alex@example.com, hashed password)
- [ ] 1.2.5 Seed 5 demo conversations with messages for demo user
- [ ] 1.2.6 Seed default user settings for demo user
- [ ] 1.2.7 Seed 3 saved resources for demo user
- [ ] 1.2.8 Run `npx prisma db seed` and verify data

### Task 1.3: Authentication Configuration
- [ ] 1.3.1 Add NEXTAUTH_SECRET to .env (generate a real secret)
- [ ] 1.3.2 Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
- [ ] 1.3.3 Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env
- [ ] 1.3.4 Verify NextAuth route handler (api/auth/[...nextauth]/route.ts)
- [ ] 1.3.5 Verify AuthProvider component wraps the app in layout.tsx
- [ ] 1.3.6 Test Google OAuth flow (even with placeholder credentials)
- [ ] 1.3.7 Test GitHub OAuth flow
- [ ] 1.3.8 Test credentials (email/password) login with demo user
- [ ] 1.3.9 Test user registration via /api/auth/register
- [ ] 1.3.10 Add NEXTAUTH_URL to .env for production

---

## PHASE 2: API ROUTES — Real Database Integration

### Task 2.1: /api/classify Enhancement
- [ ] 2.1.1 After classification, create Conversation record in DB
- [ ] 2.1.2 Create Message records (user message + AI response)
- [ ] 2.1.3 Return conversationId in response
- [ ] 2.1.4 Handle guest users (userId = null, isGuest = true)
- [ ] 2.1.5 Handle authenticated users (userId from session)

### Task 2.2: /api/conversations Rewrite
- [ ] 2.2.1 GET: Query conversations from DB for authenticated user
- [ ] 2.2.2 GET: Support category filter query param
- [ ] 2.2.3 GET: Support search query param
- [ ] 2.2.4 GET: Support pagination (skip/take)
- [ ] 2.2.5 GET: Sort by createdAt DESC
- [ ] 2.2.6 POST: Create new conversation in DB

### Task 2.3: /api/conversations/[id] Rewrite
- [ ] 2.3.1 GET: Return conversation with messages from DB
- [ ] 2.3.2 Verify user owns the conversation
- [ ] 2.3.3 DELETE: Remove conversation from DB

### Task 2.4: /api/conversations/[id]/messages Rewrite
- [ ] 2.4.1 POST: Add message to conversation in DB
- [ ] 2.4.2 Update conversation updatedAt timestamp

### Task 2.5: /api/user/profile Rewrite
- [ ] 2.5.1 GET: Return user profile from DB (requires auth)
- [ ] 2.5.2 PUT: Update user profile in DB (name, email, phone, location, language)
- [ ] 2.5.3 Handle unauthenticated requests (401)

### Task 2.6: /api/user/settings Rewrite
- [ ] 2.6.1 GET: Return user settings from DB (requires auth)
- [ ] 2.6.2 PUT: Update user settings in DB
- [ ] 2.6.3 Create default settings if none exist
- [ ] 2.6.4 Handle unauthenticated requests (401)

### Task 2.7: /api/user/stats Rewrite
- [ ] 2.7.1 GET: Calculate real stats from DB
- [ ] 2.7.2 Total conversations count
- [ ] 2.7.3 Total resources found count
- [ ] 2.7.4 Average confidence score
- [ ] 2.7.5 Day streak calculation

### Task 2.8: /api/saved-resources Rewrite
- [ ] 2.8.1 GET: Return saved resources for authenticated user
- [ ] 2.8.2 POST: Save a new resource
- [ ] 2.8.3 DELETE /api/saved-resources/[id]: Remove saved resource

### Task 2.9: /api/auth/register Rewrite
- [ ] 2.9.1 Validate input (email, password, name)
- [ ] 2.9.2 Check if email already exists
- [ ] 2.9.3 Hash password with bcrypt
- [ ] 2.9.4 Create user in DB
- [ ] 2.9.5 Create default UserSettings
- [ ] 2.9.6 Return success response

### Task 2.10: /api/auth/forgot-password
- [ ] 2.10.1 Accept email input
- [ ] 2.10.2 Return success message (placeholder for hackathon)

---

## PHASE 3: PAGES — Replace Mock Data

### Task 3.1: Landing Page (/) — page.tsx
- [ ] 3.1.1 Verify "Get Started" links to /app (or /login if not authenticated)
- [ ] 3.1.2 Verify all navigation links work
- [ ] 3.1.3 Verify footer links work

### Task 3.2: Login Page (/login) — ⭐ CRITICAL
- [ ] 3.2.1 Google button triggers signIn('google')
- [ ] 3.2.2 GitHub button triggers signIn('github')
- [ ] 3.2.3 Email/password form calls signIn('credentials', {...})
- [ ] 3.2.4 Error state displays correctly
- [ ] 3.2.5 Loading state during authentication
- [ ] 3.2.6 Redirect to /dashboard on success
- [ ] 3.2.7 "Don't have an account?" links to /signup

### Task 3.3: Signup Page (/signup) — ⭐ CRITICAL
- [ ] 3.3.1 Form submits to /api/auth/register
- [ ] 3.3.2 Validates email format
- [ ] 3.3.3 Validates password length
- [ ] 3.3.4 Shows error if email already taken
- [ ] 3.3.5 Redirect to /dashboard on success
- [ ] 3.3.6 "Already have an account?" links to /login

### Task 3.4: Chat/App Page (/app) — ⭐⭐⭐ MOST CRITICAL
- [ ] 3.4.1 Replace mock message handling with real /api/classify API call
- [ ] 3.4.2 User message sent to POST /api/classify with { text }
- [ ] 3.4.3 Crisis response displayed as overlay when isCrisis === true
- [ ] 3.4.4 Classification results displayed with real confidence scores
- [ ] 3.4.5 Clarification flow works when needsClarification === true
- [ ] 3.4.6 Second-pass classification after clarification answer
- [ ] 3.4.7 Save conversation to database (create conversation + messages)
- [ ] 3.4.8 Load previous conversation if conversationId in URL params
- [ ] 3.4.9 "Talk to a Navigator" button always visible
- [ ] 3.4.10 Loading state while waiting for API response
- [ ] 3.4.11 Error state if API fails
- [ ] 3.4.12 Guest mode works (no auth required to use classify)

### Task 3.5: Dashboard (/dashboard)
- [ ] 3.5.1 Fetch user stats from /api/user/stats
- [ ] 3.5.2 Fetch recent conversations from /api/conversations
- [ ] 3.5.3 Replace hardcoded greeting with real user name
- [ ] 3.5.4 Replace hardcoded stats with real data
- [ ] 3.5.5 Replace mock recent conversations with real data
- [ ] 3.5.6 Loading states for all data fetches
- [ ] 3.5.7 Empty states when no data

### Task 3.6: History (/history)
- [ ] 3.6.1 Fetch conversations from /api/conversations
- [ ] 3.6.2 Replace mock conversation data with real data
- [ ] 3.6.3 Search filters query real data
- [ ] 3.6.4 Category filters query real data
- [ ] 3.6.5 Confidence filters work on real data
- [ ] 3.6.6 Delete conversation calls DELETE /api/conversations/[id]
- [ ] 3.6.7 Pagination with real data
- [ ] 3.6.8 Export button (placeholder or CSV download)
- [ ] 3.6.9 Loading and empty states

### Task 3.7: Profile (/profile)
- [ ] 3.7.1 Fetch user profile from /api/user/profile
- [ ] 3.7.2 Replace mock profile data with real data
- [ ] 3.7.3 Edit mode saves to PUT /api/user/profile
- [ ] 3.7.4 Avatar shows real user image or initials
- [ ] 3.7.5 Activity timeline from real conversation history
- [ ] 3.7.6 Account stats from real data
- [ ] 3.7.7 Sign out button calls signOut()
- [ ] 3.7.8 Connected accounts reflect real OAuth status

### Task 3.8: Settings (/settings)
- [ ] 3.8.1 Fetch settings from /api/user/settings
- [ ] 3.8.2 Replace all mock settings state with real DB data
- [ ] 3.8.3 Every toggle change saves to PUT /api/user/settings
- [ ] 3.8.4 Language dropdown saves
- [ ] 3.8.5 Confidence threshold saves
- [ ] 3.8.6 All 8 sections load real data
- [ ] 3.8.7 Changes persist across page refreshes
- [ ] 3.8.8 Loading state while fetching settings

### Task 3.9: Pricing (/pricing)
- [ ] 3.9.1 Verify plan info matches actual app capabilities
- [ ] 3.9.2 "Upgrade to Pro" button functional (placeholder OK for hackathon)
- [ ] 3.9.3 FAQ content accurate

### Task 3.10: Static Pages (About, How-It-Works, Responsible-AI, etc.)
- [ ] 3.10.1 /about — Verify content accurate, links work
- [ ] 3.10.2 /how-it-works — Verify 6-layer explanation matches implementation
- [ ] 3.10.3 /responsible-ai — Verify all claims demonstrable
- [ ] 3.10.4 /verification — Verify information accurate
- [ ] 3.10.5 /api-docs — Update to match real API endpoints
- [ ] 3.10.6 /blog — Add real blog content or "Coming Soon" states
- [ ] 3.10.7 /team — Verify team info (Amine, Harshit)
- [ ] 3.10.8 /contact — Form submission works (even if just logs)
- [ ] 3.10.9 /privacy — Verify "no data stored" claims are true
- [ ] 3.10.10 /terms — Verify last updated date

### Task 3.11: Forgot Password (/forgot-password)
- [ ] 3.11.1 Form submits to /api/auth/forgot-password
- [ ] 3.11.2 Success state displays

---

## PHASE 4: DATA SEEDING — Real Community Resources

### Task 4.1: Community Resources Data
- [ ] 4.1.1 Housing Assistance: 5+ resources (rent assistance, shelters, Section 8, etc.)
- [ ] 4.1.2 Food Assistance: 5+ resources (SNAP, food banks, WIC, school meals, etc.)
- [ ] 4.1.3 Mental Health: 5+ resources (counseling, crisis lines, support groups, etc.)
- [ ] 4.1.4 Employment Services: 5+ resources (job centers, training, career counseling, etc.)
- [ ] 4.1.5 Legal Aid: 5+ resources (legal aid societies, immigration help, etc.)
- [ ] 4.1.6 Healthcare: 5+ resources (community clinics, Medicaid, prescription help, etc.)
- [ ] 4.1.7 Substance Abuse: 5+ resources (SAMHSA, rehab, detox, etc.)
- [ ] 4.1.8 Senior Services: 5+ resources (Meals on Wheels, Medicare, etc.)

### Task 4.2: Demo User Data
- [ ] 4.2.1 Demo user: Alex Korane (alex@example.com, password: demo1234)
- [ ] 4.2.2 5 sample conversations:
  - [ ] "I lost my job and can't pay rent" (multi-need, Housing 78%, Food 85%)
  - [ ] "I need help with my mental health" (Mental Health 91%)
  - [ ] "I can't afford my medication" (Healthcare 68%, low confidence → clarification)
  - [ ] "I'm a veteran and need housing" (Veteran/Housing 88%)
  - [ ] "My husband hits me" (Crisis → DV resources)
- [ ] 4.2.3 Default user settings for demo user
- [ ] 4.2.4 3 saved resources for demo user

### Task 4.3: Crisis Resources
- [ ] 4.3.1 988 Suicide & Crisis Lifeline — verified
- [ ] 4.3.2 Crisis Text Line (HOME to 741741) — verified
- [ ] 4.3.3 National DV Hotline (1-800-799-7233) — verified
- [ ] 4.3.4 SAMHSA (1-800-662-4357) — verified
- [ ] 4.3.5 Childhelp (1-800-422-4453) — verified
- [ ] 4.3.6 RAINN (1-800-656-4673) — verified
- [ ] 4.3.7 Human Trafficking (1-888-373-7888) — verified
- [ ] 4.3.8 Poison Control (1-800-222-1222) — verified
- [ ] 4.3.9 Emergency: 911 — verified
- [ ] 4.3.10 211 Community Helpline — verified

---

## PHASE 5: TESTING & POLISH

### Task 5.1: End-to-End Testing
- [ ] 5.1.1 Full signup flow (email/password)
- [ ] 5.1.2 Full login flow (email/password)
- [ ] 5.1.3 Google OAuth flow (if credentials available)
- [ ] 5.1.4 GitHub OAuth flow (if credentials available)
- [ ] 5.1.5 Classification: normal query → results displayed
- [ ] 5.1.6 Classification: crisis query → crisis overlay
- [ ] 5.1.7 Classification: low confidence → clarification
- [ ] 5.1.8 Dashboard loads real data
- [ ] 5.1.9 History loads real conversations
- [ ] 5.1.10 Profile edits persist
- [ ] 5.1.11 Settings changes persist

### Task 5.2: Error Handling
- [ ] 5.2.1 API errors show user-friendly messages
- [ ] 5.2.2 404 page renders correctly
- [ ] 5.2.3 Loading spinners on all async operations
- [ ] 5.2.4 Empty states when no data
- [ ] 5.2.5 Network error handling
- [ ] 5.2.6 Session expiry handling

### Task 5.3: Build & Deploy
- [ ] 5.3.1 `npm run build` passes with zero errors
- [ ] 5.3.2 No TypeScript compilation errors
- [ ] 5.3.3 No console.log statements in production code
- [ ] 5.3.4 All environment variables documented in .env.example
- [ ] 5.3.5 Deploy to Vercel
- [ ] 5.3.6 Verify deployed app works

---

## PRIORITY ORDER (What to do first)

1. **Task 1.1** — Database setup (foundation for everything)
2. **Task 1.2** — Database seeding (data to work with)
3. **Task 1.3** — Auth configuration (login/signup must work)
4. **Task 2.1** — /api/classify enhancement (save to DB)
5. **Task 2.2–2.10** — All other API routes (real DB queries)
6. **Task 3.2–3.4** — Login, Signup, Chat pages (most critical pages)
7. **Task 3.5–3.8** — Dashboard, History, Profile, Settings (data-driven pages)
8. **Task 3.9–3.11** — Remaining pages (polish)
9. **Task 4.1–4.3** — Data seeding verification
10. **Task 5.1–5.3** — Testing & deployment

---

*Check off items as they're completed. Update PROGRESS.MD after each phase.*
