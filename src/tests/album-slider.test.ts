import test from 'node:test';
import assert from 'node:assert/strict';

import { getAlbumSliderKey } from '../utils/album-slider.ts';

test('returns a stable empty key when album data is unavailable', () => {
  assert.equal(getAlbumSliderKey(null), 'album-empty');
});

test('includes album id and ordered photo ids in slider key', () => {
  assert.equal(
    getAlbumSliderKey({
      id: 18,
      photos: [{ id: 3 }, { id: 7 }, { id: 11 }],
    }),
    'album-18:3,7,11'
  );
});

test('changes key when photo ordering changes', () => {
  assert.notEqual(
    getAlbumSliderKey({
      id: 18,
      photos: [{ id: 3 }, { id: 7 }],
    }),
    getAlbumSliderKey({
      id: 18,
      photos: [{ id: 7 }, { id: 3 }],
    })
  );
});
