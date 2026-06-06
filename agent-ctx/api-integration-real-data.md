# Task: Replace mock data in Dashboard and History pages with real API calls

## Summary of Changes

### API Routes Updated

#### 1. `/api/user/stats/route.ts`
- Added `streak` field to response — calculates consecutive days with conversations ending today or yesterday
- Added `conversations`, `resourcesFound` as aliases for quick access (matching the task spec format)
- Response now includes both simple format (`conversations`, `resourcesFound`, `avgConfidence`, `streak`) and extended format (`totalConversations`, `totalResources`, `crisisCount`, `categoryBreakdown`, `weeklyActivity`, `monthlyTrend`)

#### 2. `/api/conversations/route.ts`
- Added query parameter support: `search`, `category`, `skip`, `take`
- `search` param filters conversations by title, preview, or category (case-insensitive contains)
- `category` param filters by exact category match
- `skip` and `take` params enable server-side pagination
- Response now wrapped in `{ conversations: [...], total: number }` format for pagination support
- Backward compatible: if no search/category/pagination params, returns all conversations

### Dashboard Page (`/dashboard/page.tsx`)

1. **User greeting**: Already uses `useAuth()` which wraps `useSession()` — `userName = user?.name || 'there'` 
2. **Stats cards**: Now uses `streak` from API instead of hardcoded `'7'`
3. **Day streak badge**: Updated from hardcoded "7-day streak" to use `statsData.streak` from API
4. **Conversations API**: Updated to handle wrapped `{ conversations: [...] }` response format
5. **Error state**: Added error display with retry button when API calls fail
6. **Stats row**: Hidden when there's an error, shown when data loads successfully
7. **StatsData interface**: Extended to include `conversations`, `resourcesFound`, `streak` fields

### History Page (`/history/page.tsx`)

1. **Search**: Now uses debounced API calls (300ms debounce) instead of client-side filtering
2. **Category filters**: Now sends `category` param to API instead of client-side filtering
3. **Confidence filter**: Remains client-side (as specified in task)
4. **Pagination**: Now uses server-side pagination with `skip`/`take` params, 20 items per page
5. **API response**: Updated to handle wrapped `{ conversations: [...], total: number }` format
6. **Error state**: Added error display with retry button
7. **Delete**: After delete, refetches from API to keep pagination in sync
8. **Page numbers**: Smart pagination showing max 7 page numbers around current page
9. **Empty state**: Only shows "no conversations" when no search/filter is active and API returns empty
10. **Stats summary**: Uses `totalCount` from API for total conversations count
11. **Added `useRef`**: For debounce timer management

### No Visual Changes
- All CSS, animations, colors, and layout remain exactly the same
- Only the data source changed from hardcoded/client-side to real API calls

### Files Modified
- `src/app/api/user/stats/route.ts` — Added streak, simplified response format
- `src/app/api/conversations/route.ts` — Added search/category/pagination params, wrapped response
- `src/app/dashboard/page.tsx` — Uses streak from API, error state, unwraps conversations
- `src/app/history/page.tsx` — Debounced search, API-side filtering, server pagination, error state
