# Album Route Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make album modal state route-driven so open uses push, photo changes use replace, refresh restores the same album/photo, and browser back/forward reopens or closes the modal correctly.

**Architecture:** Vue Router becomes the single external source of truth for album modal navigation. A small route helper normalizes album/photo selection, the app store becomes a router helper layer, and `album-modal.vue` synchronizes route params, fetched album detail, and Swiper state.

**Tech Stack:** Vue 3, Pinia, Vue Router 4, Swiper, TypeScript, Node assert for minimal helper tests

---

### Task 1: Add route normalization helper and test

**Files:**
- Create: `src/utils/album-route.ts`
- Create: `src/tests/album-route.test.mjs`

- [ ] **Step 1: Write the failing test**

Create assertions for:
- missing `photo` falls back to first photo id
- invalid `photo` falls back to first photo id
- valid `photo` is preserved
- empty photo list returns no normalized photo id

- [ ] **Step 2: Run test to verify it fails**

Run: `node src/tests/album-route.test.mjs`
Expected: FAIL because `src/utils/album-route.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Export pure helpers that:
- build album route locations
- normalize a requested photo id against a photo id list
- compare current query photo with a normalized target

- [ ] **Step 4: Run test to verify it passes**

Run: `node src/tests/album-route.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/album-route.ts src/tests/album-route.test.mjs
git commit -m "test: add album route normalization helper"
```

### Task 2: Add album route and router-backed store helpers

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/store/index.ts`

- [ ] **Step 1: Write the failing test**

Extend `src/tests/album-route.test.mjs` with route location assertions for:
- album open path
- photo query inclusion
- close path fallback

- [ ] **Step 2: Run test to verify it fails**

Run: `node src/tests/album-route.test.mjs`
Expected: FAIL because route builder helpers are incomplete.

- [ ] **Step 3: Write minimal implementation**

- Add `/albums/:albumId` route pointing to `Home.vue`
- Refactor app store APIs to drive navigation through the router
- Derive `isAnyModalOpen` from the current route

- [ ] **Step 4: Run test to verify it passes**

Run: `node src/tests/album-route.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/router/index.ts src/store/index.ts src/utils/album-route.ts src/tests/album-route.test.mjs
git commit -m "feat: add album modal route helpers"
```

### Task 3: Sync album modal with route params and photo query

**Files:**
- Modify: `src/components/album-modal.vue`

- [ ] **Step 1: Write the failing test**

Document the expected manual checks inside the helper test file comments:
- route album id opens modal
- missing photo query normalizes to first photo
- invalid photo query normalizes to first photo

- [ ] **Step 2: Run test to verify it fails**

Run: `node src/tests/album-route.test.mjs`
Expected: FAIL if modal normalization helper is not yet wired for all cases.

- [ ] **Step 3: Write minimal implementation**

- Drive visibility from `useRoute()`
- Fetch album detail from route `albumId`
- Select route photo when data arrives
- `replace` URL when canonical photo differs
- Close to previous route or `/`

- [ ] **Step 4: Run verification**

Run:
- `node src/tests/album-route.test.mjs`
- `npm run build`

Expected:
- helper test PASS
- build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/album-modal.vue
git commit -m "feat: sync album modal state with route"
```

### Task 4: Make Swiper and entry points route-aware

**Files:**
- Modify: `src/components/album-modal-slider.vue`
- Modify: `src/components/image-item.vue`
- Modify: `src/components/full-screen-banner.vue`

- [ ] **Step 1: Write the failing test**

Add a helper assertion ensuring route updates use replace semantics for photo-only changes.

- [ ] **Step 2: Run test to verify it fails**

Run: `node src/tests/album-route.test.mjs`
Expected: FAIL until helper semantics are finalized.

- [ ] **Step 3: Write minimal implementation**

- Add route-driven target photo support to the slider
- Update open triggers to call router-backed store helpers
- Keep Swiper `slideChange` emitting current photo to the parent

- [ ] **Step 4: Run verification**

Run:
- `node src/tests/album-route.test.mjs`
- `npm run lint`
- `npm run build`

Expected:
- helper test PASS
- lint succeeds
- build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/album-modal-slider.vue src/components/image-item.vue src/components/full-screen-banner.vue
git commit -m "feat: sync album slider and entry points with route"
```
