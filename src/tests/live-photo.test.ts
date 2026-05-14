import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  canAutoplayLivePhoto,
  getLivePhotoReplayKey,
  hasLivePhoto,
} from '../utils/live-photo.ts';

test('hasLivePhoto only returns true when a video path exists', () => {
  assert.equal(hasLivePhoto(null), false);
  assert.equal(hasLivePhoto({ image: {} }), false);
  assert.equal(
    hasLivePhoto({
      image: {
        livePhoto: {
          videoPath: 'https://cdn.example.com/live.mp4',
          mime: 'video/mp4',
        },
      },
    }),
    true
  );
});

test('canAutoplayLivePhoto requires a live photo and enabled autoplay', () => {
  const livePhoto = {
    image: {
      livePhoto: {
        videoPath: 'https://cdn.example.com/live.mp4',
        mime: 'video/mp4',
      },
    },
  };

  assert.equal(canAutoplayLivePhoto(livePhoto, true), true);
  assert.equal(canAutoplayLivePhoto(livePhoto, false), false);
  assert.equal(canAutoplayLivePhoto({ image: {} }, true), false);
});

test('getLivePhotoReplayKey changes when play signal changes', () => {
  assert.equal(getLivePhotoReplayKey(5, 0), 'live-photo-5-0');
  assert.equal(getLivePhotoReplayKey(5, 1), 'live-photo-5-1');
});

test('keeps live photo hover menu reachable with visual spacing', () => {
  const toolbarSource = readFileSync(
    resolve(process.cwd(), 'src/components/album-modal-toolbar.vue'),
    'utf8'
  );

  assert.match(
    toolbarSource,
    /\.live-photo-control::after\s*{[^}]*\bheight:\s*8px;/s
  );
  assert.match(
    toolbarSource,
    /\.live-photo-menu\s*{[^}]*\btop:\s*calc\(100% \+ 8px\);/s
  );
});

test('keeps live photo button highlighted while hovering the menu', () => {
  const toolbarSource = readFileSync(
    resolve(process.cwd(), 'src/components/album-modal-toolbar.vue'),
    'utf8'
  );

  assert.match(
    toolbarSource,
    /\.live-photo-control:hover\s+\.button\s*{[^}]*background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.9\);/s
  );
});

test('animates live photo control visibility at the slider transition speed', () => {
  const toolbarSource = readFileSync(
    resolve(process.cwd(), 'src/components/album-modal-toolbar.vue'),
    'utf8'
  );

  assert.match(toolbarSource, /<transition name="live-photo-control">/);
  assert.match(
    toolbarSource,
    /\.live-photo-control-enter-active,[\s\S]*?\.live-photo-control-leave-active\s*{[^}]*720ms/s
  );
});
