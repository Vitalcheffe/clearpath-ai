# Task 4 - Database Setup & API Routes

## Summary
Successfully completed all 4 steps of the task: database setup, seeding, API route fixes, and classify route update.

## What Was Done

### Step 1: Database Setup
- Verified `.env` has proper `DATABASE_URL=file:/home/z/my-project/db/custom.db`
- Ran `npx prisma generate` — Prisma Client v6.19.2 generated successfully
- Ran `npx prisma db push` — Database synced with schema
- Tested connection — works, confirmed existing tables

### Step 2: Database Seeding
- Added `Resource` model to `prisma/schema.prisma` with fields: id, name, category, description, phone, address, hours, eligibility, services, languages, lastVerified, url, createdAt
- Ran `npx prisma db push` to create the Resource table
- Created `prisma/seed.ts` with:
  - **Demo User**: Alex Korane (alex@example.com, demo1234, username: alexkorane, plan: free)
  - **48 Community Resources** across 8 categories (6 each):
    - Housing Assistance (6): Emergency Rental Assistance, Section 8, Homeless Shelters, Foundation Communities, Travis County Emergency Housing, Caritas of Austin
    - Food Assistance (6): SNAP, Central Texas Food Bank, WIC, Austin ISD School Meals, Meals on Wheels, St. John Food Pantry
    - Mental Health (6): Community Counseling, 988 Lifeline, Integral Care, NAMI, Crisis Text Line, Austin State Hospital
    - Employment Services (6): Workforce Solutions, Job Corps, Goodwill, TWC, American YouthWorks, SkillsFund
    - Legal Aid (6): Legal Aid Society, American Gateways, Texas Legal Services, Law Library, Family Violence Prevention, Disability Rights Texas
    - Healthcare (6): CommUnityCare, Medicaid, Patient Assistance Programs, Planned Parenthood, Volunteer Healthcare Clinic, Maplewood Dental
    - Substance Abuse (6): SAMHSA, Austin Recovery, Cenikor, AA Austin, NA Austin, Sobering Center
    - Senior Services (6): Meals on Wheels, Medicare Counseling, Senior Activity Centers, AARP, Area Agency on Aging, Family Eldercare
  - **5 Demo Conversations** with messages:
    1. "Lost job and can't pay rent" — Housing 78%, Food 85%, Employment 71% (4 messages)
    2. "Mental health support needed" — Mental Health 91% (2 messages)
    3. "Can't afford medication" — Healthcare 68% (2 messages)
    4. "Veteran housing assistance" — Housing 88% (2 messages)
    5. "Crisis: Domestic Violence" — Crisis 99% (4 messages)
  - **3 Saved Resources** for the demo user
  - **Default UserSettings** for the demo user
- Added `prisma.seed` config to `package.json`
- Ran `npx tsx prisma/seed.ts` — All data seeded successfully

### Step 3: Fix API Routes
- All API routes already used Prisma (`import { db } from "@/lib/db"`) — no mock data found
- Added **GET handler** to `/api/conversations/[id]/route.ts` (was only DELETE before)
  - Returns conversation with all messages, parsing JSON fields (resources, alternatives)
- Created **`/api/community-resources/route.ts`** — new endpoint for Resource model
  - GET: list resources with optional category filter and search
  - Returns resources and distinct categories

### Step 4: Update Classify Route
- Rewrote `/api/classify/route.ts` to save conversations to database:
  - Uses `getServerSession(authOptions)` to get authenticated user
  - **Crisis path**: Creates conversation with isCrisis=true, saves user message and AI response
  - **Normal path**: Creates conversation with top category, saves user message and AI response with metadata
  - Links to user account if authenticated, sets `isGuest=true` and `userId=null` for guests
  - Returns `conversationId` in response so frontend can reference the saved conversation
  - Added crisis keywords: "hits me", "beats me", "husband hits", "wife hits", "partner hits"
  - Added category color mapping for consistent UI display

## Verification
- `bun run lint` — passes with no errors
- `npx next build` — builds successfully (34 pages, all API routes registered)
- Database test: All seed data verified
  - Demo user with correct credentials (bcrypt password verified)
  - 5 conversations with correct message counts and metadata
  - 48 resources across 8 categories
  - 3 saved resources
  - User settings exist
- Dev server was running and serving requests correctly
