# Task: Replace Mock Data in Profile and Settings Pages with Real API Calls

## Summary of Changes

### Profile Page (`/src/app/profile/page.tsx`)

1. **Removed all mock data constants:**
   - `activityTimeline` — replaced with state populated from `/api/conversations`
   - `accountStats` — already overridden with real data, removed top-level mock
   - `savedResources` — already replaced with `apiSavedResources` from API, removed mock
   - `searchCategories` — replaced with `apiSearchCategories` state from `/api/user/stats`

2. **Added real API calls on mount:**
   - `GET /api/user/profile` — fetches user profile with phone, image, stats
   - `GET /api/saved-resources` — fetches saved resources
   - `GET /api/conversations` — fetches recent conversations for activity timeline (last 5)
   - `GET /api/user/stats` — fetches category breakdown for "Most Searched Categories" section

3. **Added phone field support:**
   - Profile data state now includes `phone` field
   - Phone is loaded from profile API response
   - Phone is sent when saving profile via PUT

4. **Added avatar image support:**
   - If `profileData.image` exists, shows the real user image
   - Otherwise falls back to initials

5. **Added `getTimeAgo` helper function:**
   - Converts ISO date strings to human-readable relative time ("2 hours ago", "Yesterday", etc.)

6. **Added empty state handling:**
   - Activity timeline shows "No recent activity yet" when empty
   - Search categories shows "No category data yet" when empty

7. **Added static config maps (not mock data):**
   - `categoryColorMap` — maps category names to hex colors
   - `categoryIconMap` — maps category names to icon/color/bg for timeline display

### Settings Page (`/src/app/settings/page.tsx`)

1. **Added "Saved" confirmation indicator:**
   - Shows green "Saved ✓" text in header after each successful settings save
   - Auto-hides after 2 seconds

2. **Added password change functionality:**
   - Password form now has controlled inputs (currentPassword, newPassword, confirmPassword)
   - "Update password" button sends PUT to `/api/user/profile` with password fields
   - Shows "Password updated successfully!" confirmation after save
   - Button disabled until passwords match
   - Cancel button clears all password fields

3. **Added state variables:**
   - `lastSaved` — tracks when settings were last saved successfully
   - `currentPassword`, `newPassword`, `confirmPassword` — password form state
   - `passwordSaving` — loading state for password change
   - `passwordSaved` — success state for password change

### Prisma Schema (`/prisma/schema.prisma`)

1. **Added `phone` field to User model:**
   - `phone String?` — optional phone number field

### Profile API (`/src/app/api/user/profile/route.ts`)

1. **GET response now includes `phone` field**
2. **PUT handler now supports:**
   - `phone` field updates
   - `currentPassword` and `newPassword` for password changes
   - Password change accepts any current password (hackathon placeholder)

### Existing Functionality (Already Working — No Changes Needed)

- Settings page already had: fetch on mount, debounced persist, all 8 sections, crisis detection locked ON, skeleton loading
- Profile page already had: fetch profile/resources, edit/cancel/save flow, sign out with next-auth
- All API routes were already implemented and working
