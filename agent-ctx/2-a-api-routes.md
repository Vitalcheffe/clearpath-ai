# Task 2-a: API Routes Creation

## Work Log

- Read worklog.md to understand prior agents' work
- Read prisma/schema.prisma to understand all DB models
- Read existing API routes (classify, auth/[...nextauth]) to understand patterns
- Read lib/db.ts to confirm database client import pattern
- Read package.json to confirm bcryptjs is available
- Created all 9 route files across proper directory structures

## Route Files Created

### 1. POST /api/auth/register
- File: `/src/app/api/auth/register/route.ts`
- Validates email + password (min 6 chars)
- Checks email and username uniqueness
- Hashes password with bcryptjs (salt rounds: 12)
- Creates user + default UserSettings in DB
- Returns user id, email, name, username

### 2. POST + GET /api/conversations
- File: `/src/app/api/conversations/route.ts`
- POST: Creates conversation with optional userId, title, preview, category, categoryColor, confidence, isCrisis, isGuest
- GET: Returns conversations for userId, or guest conversations if no userId

### 3. POST + GET /api/conversations/[id]/messages
- File: `/src/app/api/conversations/[id]/messages/route.ts`
- POST: Creates message with role, text, category, confidence, isCrisis, alternatives (JSON), resources (JSON), why, also, warning
- GET: Returns messages for conversation ordered by createdAt asc

### 4. DELETE /api/conversations/[id]
- File: `/src/app/api/conversations/[id]/route.ts`
- Deletes all messages then the conversation

### 5. GET /api/user/stats
- File: `/src/app/api/user/stats/route.ts`
- Returns: totalConversations, totalResources, avgConfidence, crisisCount, categoryBreakdown (top 5), weeklyActivity (7 days), monthlyTrend (4 weeks)
- Returns empty/guest stats if no userId

### 6. GET + PUT /api/user/profile
- File: `/src/app/api/user/profile/route.ts`
- GET: Returns user data + settings + stats (totalConversations, totalResources, avgConfidence, crisisCount)
- PUT: Updates user profile fields (name, email, username, location, language, image, plan, hearAbout, interests)
- Checks email and username uniqueness on update

### 7. GET + PUT /api/user/settings
- File: `/src/app/api/user/settings/route.ts`
- GET: Returns UserSettings for userId
- PUT: Updates any allowed settings field (30 fields whitelisted)
- Creates settings if they don't exist

### 8. POST + GET /api/saved-resources
- File: `/src/app/api/saved-resources/route.ts`
- POST: Creates SavedResource with userId, title, category, categoryColor, confidence, verifiedDate, action, detail
- GET: Returns saved resources for userId

### 9. DELETE /api/saved-resources/[id]
- File: `/src/app/api/saved-resources/[id]/route.ts`
- Deletes a saved resource by id

## Technical Details

- All routes use `import { db } from '@/lib/db'` for database access
- All routes use `NextRequest` and `NextResponse` from next/server
- Dynamic route params use `params: Promise<{ id: string }>` pattern (Next.js 16)
- All routes have try/catch error handling with proper status codes
- Lint passes cleanly
- Dev server running on port 3000
