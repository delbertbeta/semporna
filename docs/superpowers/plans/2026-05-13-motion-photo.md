# Motion Photo Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Android-style single-file Motion Photo extraction on upload and LIVE Photo preview playback in the album modal.

**Architecture:** The backend extracts embedded motion video bytes from JPG/HEIC files using XMP metadata and stores the resulting video as a separate S3 object referenced by `images.livePhoto`. The frontend treats `image.livePhoto.videoPath` as the only signal for showing a LIVE Photo replay control and overlay video.

**Tech Stack:** Express, Sequelize, S3 SDK, file-type, node:test, Vue 3, Headless UI, Heroicons, Rsbuild.

---

### Task 1: Backend Motion Photo Parsing

**Files:**
- Create: `../brando-node/src/routes/api/v1/images/motion-photo.ts`
- Test: `../brando-node/tests/motion-photo.test.ts`

- [ ] Write tests for non-motion files, modern XMP container `Item:Length`, legacy `MicroVideoOffset`, and invalid offsets.
- [ ] Run `pnpm test` equivalent for node:test files and verify the new tests fail because the parser does not exist.
- [ ] Implement `parseMotionPhotoFromBuffer(buffer, fileExt)` returning extracted video metadata and bytes.
- [ ] Run the parser tests and verify they pass.

### Task 2: Backend Storage and API Field

**Files:**
- Modify: `../brando-node/src/typings/images.ts`
- Modify: `../brando-node/src/db/models/image.ts`
- Modify: `../brando-node/src/routes/api/v1/images/utils.ts`
- Modify: `../brando-node/src/routes/api/v1/images/index.ts`
- Test: `../brando-node/tests/images-utils.test.ts`

- [ ] Add `ImageModel.livePhoto` typing and Sequelize JSON field.
- [ ] Add a generic `uploadBuffer` helper and keep `uploadImage` as a file-path wrapper.
- [ ] In upload route, read the original file buffer once, parse Motion Photo metadata, upload video bytes to `live-photos/<imageId>.<ext>`, and store `livePhoto`.
- [ ] Extend serialization tests so `processImageObj` converts `livePhoto.videoPath` to a CDN URL.
- [ ] Run backend tests and build.

### Task 3: Frontend Types and Playback State

**Files:**
- Modify: `src/typings/index.ts`
- Create: `src/utils/live-photo.ts`
- Test: `src/tests/live-photo.test.ts`

- [ ] Add optional `ImageModel.livePhoto`.
- [ ] Add helper functions for detecting a live photo, deciding whether autoplay should run, and producing a replay key.
- [ ] Run the frontend node:test suite and verify the new tests fail before implementation.
- [ ] Implement the helpers.
- [ ] Run the frontend tests and verify they pass.

### Task 4: Frontend Toolbar and Preview

**Files:**
- Create: `src/assets/img/svg-icons/live-photo.svg`
- Create: `src/components/live-photo-preview.vue`
- Modify: `src/components/album-modal-toolbar.vue`
- Modify: `src/components/album-modal-slider.vue`
- Modify: `src/components/album-modal.vue`

- [ ] Add the LIVE Photo icon asset.
- [ ] Add `live-photo-preview.vue` with a native video overlay controlled by `playSignal`, `muted`, and `autoplay`.
- [ ] Add toolbar LIVE Photo button and hover menu with mute/autoplay switches.
- [ ] Thread playback state through `album-modal.vue` into `album-modal-slider.vue`.
- [ ] Run frontend tests and production build.

### Task 5: Final Verification

- [ ] Run backend tests.
- [ ] Run backend build.
- [ ] Run frontend tests.
- [ ] Run frontend build.
- [ ] Review `git diff` in both repositories for accidental unrelated changes.
