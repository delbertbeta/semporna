import test from 'node:test';
import assert from 'node:assert/strict';

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
