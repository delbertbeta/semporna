import test from 'node:test';
import assert from 'node:assert/strict';

import { getVirtualWindowConfig } from '../utils/swiper-virtual.ts';

test('caps album modal virtual slide window at four rendered slides', () => {
  assert.deepEqual(getVirtualWindowConfig(4), {
    addSlidesBefore: 1,
    addSlidesAfter: 2,
  });
});

test('keeps rendered slide count anchored around the active slide', () => {
  const config = getVirtualWindowConfig(3);

  assert.equal(config.addSlidesBefore + config.addSlidesAfter + 1, 3);
  assert.equal(config.addSlidesBefore, 1);
  assert.equal(config.addSlidesAfter, 1);
});
