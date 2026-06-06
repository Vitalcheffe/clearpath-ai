# Task 3-b: Wire up History page to real API

## Task ID: 3-b
## Agent: full-stack-developer

## Work Log:
- Read worklog.md to understand prior agents' work
- Read existing history/page.tsx (1110 lines with 15 hardcoded mock conversations)
- Read useAuth hook, API routes (/api/conversations, /api/conversations/[id]), Prisma schema
- Updated GET /api/conversations route to support `?userId=xxx` query param for filtering and include `topResource` from first AI message's resources
- Rewrote history/page.tsx with all required changes while preserving EXACT same visual design

## Changes Made:

### /src/app/api/conversations/route.ts
- Added `userId` query parameter support: `GET /api/conversations?userId=xxx`
- Added `topResource` extraction from first AI message's `resources` JSON field
- Preserved existing POST endpoint unchanged

### /src/app/history/page.tsx
1. **Removed hardcoded conversations array** (15 mock entries → 0)
2. **Added useAuth hook** from `@/hooks/use-auth` for authentication state
3. **Added API data fetching** with `useEffect` + `useCallback` calling `GET /api/conversations?userId=xxx`
4. **Added auth gate**: When not logged in, shows "Sign in to view your history" message with Link to `/login`
5. **Added ApiConversation interface** mapping API response → Conversation interface with:
   - `getDateGroup(createdAt)` → groups into "Today", "Yesterday", "This Week", "Earlier"
   - `formatTimestamp(createdAt)` → relative time strings ("Just now", "5 min ago", "Yesterday", "3 days ago", etc.)
6. **Added loading skeleton** (LoadingSkeleton component) shown while fetching data
7. **Wired up delete button** to call `DELETE /api/conversations/[id]` with:
   - Per-item delete with `handleDelete(id)`
   - Bulk delete with `handleDeleteSelected()`
   - Visual feedback: `deletingIds` state → red tint + Loader2 spinner
8. **Added empty state** for "no conversations yet" (different from "no search results")
9. **Computed stats from real data**: totalConversations, avgConfidence, mostSearchedCategory (dynamically computed from category counts), crisisCount, thisWeekCount
10. **Preserved all existing functionality**: search, filter by category, filter by confidence, pagination, bulk select, export button, confidence breakdown, quick tips, safety banner, footer
11. **Added new imports**: `useEffect`, `useCallback`, `Loader2`, `LogIn` from lucide-react; `useAuth` from hooks

## Lint: ✅ Passes cleanly (0 errors)
