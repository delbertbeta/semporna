# Album Route Sync Design

**Goal:** Make the album modal URL-addressable so opening an album pushes a route, photo changes replace the route, refreshing restores the open album and active photo, and browser back/forward closes or reopens the modal correctly.

## URL Shape

- Album modal closed: `/`
- Album modal open: `/albums/:albumId?photo=:photoId`

`photo` is optional at navigation time, but the app should normalize it to a concrete photo after album detail loads.

## Source of Truth

The Vue Router location becomes the external source of truth for whether the album modal is open and which album/photo it should show.

- Presence of `route.params.albumId` means the modal should be open.
- `route.query.photo` selects the current photo inside that album.
- Local component state remains responsible only for UI details such as loading, expanded mobile panel state, current zoom/loading state, and fullscreen image viewer state.

The existing app store remains as a navigation helper boundary so call sites can still open or close the modal through a single API, but it should no longer own duplicated modal visibility state.

## Navigation Behavior

- Opening an album from gallery or banner uses `router.push` to `/albums/:albumId`.
- If the caller already knows a photo id, include `?photo=...`; otherwise let the modal normalize to the first photo after detail loads.
- Changing the current photo inside the modal uses `router.replace` to update `?photo=...` without creating a history entry per slide.
- Closing the modal should prefer browser history semantics:
  - If the current route is an album route and browser history can return to a previous in-app page, close via `router.back()`.
  - If the user landed directly on an album deep link and there is no meaningful in-app previous entry, close via `router.push('/')`.

## Refresh and Deep Links

On page load or refresh:

- Visiting `/albums/:albumId?photo=:photoId` should render `Home.vue`, open the album modal, fetch the album detail, and move the slider to the requested photo.
- If `photo` is missing, the modal should default to the first photo and `replace` the URL so the route becomes canonical.
- If `photo` does not exist in the loaded album, the modal should fall back to the first photo and `replace` the URL to that valid id.
- If the album request fails or the album payload is missing, the app should close the modal by navigating back to `/`.

## Component Responsibilities

### `src/router/index.ts`

- Add a second route definition for `/albums/:albumId`.
- Keep both `/` and `/albums/:albumId` rendering `Home.vue` so the page layout stays stable and the modal overlays the same screen.

### `src/store/index.ts`

- Replace modal visibility state with router-backed helpers:
  - `openAlbumModal(item, photoId?)`
  - `replaceAlbumPhoto(albumId, photoId)`
  - `closeAlbumModal()`
- Keep `isAnyModalOpen` as a computed value derived from the current route so existing consumers such as the home banner can pause autoplay.

### `src/components/album-modal.vue`

- Derive modal visibility from the active route.
- Watch route `albumId` and fetch album detail whenever it changes.
- After album detail resolves, select the route photo if present; otherwise select the first photo and normalize the URL with `replace`.
- On slide changes, update `currentPhoto` and call the store/router helper to `replace` the `photo` query if it changed.
- On close, call the router-backed close helper.
- Guard against replace loops by only updating the URL when the target photo differs from the current route query.

### `src/components/album-modal-slider.vue`

- Add a controlled input for the target photo id from the route.
- Once the swiper instance and album photos are available, slide to the matching photo without animation churn.
- Continue emitting `slideChange` for user-driven changes so `album-modal.vue` can update URL and UI state.

### Open Triggers

- Update `src/components/image-item.vue` and `src/components/full-screen-banner.vue` to call the new route-backed store helper only.

## Error Handling

- Invalid `photo` query: fall back to first photo and `replace` URL.
- Invalid or missing `albumId`: modal remains closed because the route is `/`.
- Album fetch failure: log error, clear local album detail state, navigate to `/`.

## Testing and Verification

Because the repo does not currently include a test runner, extract the route normalization logic into a small pure helper module and cover it with a minimal Node-based assertion script under `src/tests`. Then verify integration with:

- targeted helper test script
- `npm run lint`
- `npm run build`

