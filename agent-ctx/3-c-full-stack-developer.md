# Task 3-c: Make Settings and Profile pages real with API data persistence

## Task Summary
Modified Settings and Profile pages to use real data persistence via existing API routes and useAuth hook, while keeping the EXACT SAME visual design.

## Work Log

### Settings Page (`/src/app/settings/page.tsx`)
- Added imports: `useEffect`, `useCallback`, `useRef` from react; `useRouter` from next/navigation; `Loader2` from lucide-react; `useAuth` from @/hooks/use-auth
- Created `SettingsSkeleton` component with animate-pulse skeleton placeholders matching the settings layout
- Added auth check: redirect to `/login` if not authenticated
- Added `settingsLoading` state and fetch effect: on mount, calls `GET /api/user/settings?userId=xxx` to populate all 30+ settings fields
- Added `saving` state with "Saving..." indicator in header when persisting changes
- Created `persistSetting` callback that calls `PUT /api/user/settings` with `userId` + changed fields
- Created `debouncedPersist` for text/select fields (500ms debounce)
- Created 30+ wrapped setters (`updateLanguage`, `updateTheme`, `updateConfidenceThreshold`, etc.) that call both the local setState AND the persist function
- Replaced all inline `setXxx` calls in JSX with `updateXxx` calls
- All visual design, layout, animations remain identical — only data flow changed

### Profile Page (`/src/app/profile/page.tsx`)
- Added imports: `useEffect` from react; `useRouter` from next/navigation; `signOut` from next-auth/react; `Loader2` from lucide-react; `useAuth` from @/hooks/use-auth
- Created `ProfileSkeleton` component with animate-pulse skeleton placeholders matching the profile layout
- Added auth check: redirect to `/login` if not authenticated
- Added `profileLoading` state and fetch effect: on mount, calls both `GET /api/user/profile?userId=xxx` and `GET /api/saved-resources?userId=xxx` in parallel
- Profile data (name, email, location, language, plan, stats, createdAt) populated from API response
- Saved resources populated from API response with `categoryMeta` mapping for icons/colors
- Made `handleSave` async: calls `PUT /api/user/profile` with userId, name, email, location, language
- Replaced Link to `/login` for sign-out with button calling `authSignOut()` from useAuth hook
- Dynamic plan badge: shows "Pro" or "Free" based on API data
- Dynamic member since date: computed from `profileData.createdAt`
- Dynamic stats: shows real conversation count, resource count, avg confidence from API
- Saving state with Loader2 spinner on save button
- All visual design, layout, animations remain identical

### Lint Check
- `bun run lint` passes cleanly with no errors

## Files Modified
- `/home/z/my-project/src/app/settings/page.tsx` — Added API data fetching, persistence, auth guards, skeleton loading
- `/home/z/my-project/src/app/profile/page.tsx` — Added API data fetching, persistence, auth guards, skeleton loading, sign out

## API Routes Used (already existed)
- `GET /api/user/settings?userId=xxx` — Fetch all settings
- `PUT /api/user/settings` — Update any subset of settings
- `GET /api/user/profile?userId=xxx` — Fetch user profile with stats
- `PUT /api/user/profile` — Update user profile
- `GET /api/saved-resources?userId=xxx` — Fetch saved resources
