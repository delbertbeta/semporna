import test from 'node:test';
import assert from 'node:assert/strict';

import { shouldEnableImageItemHover } from '../utils/image-item-hover.ts';

test('disables image item hover on mobile', () => {
  assert.equal(shouldEnableImageItemHover(true), false);
});

test('keeps image item hover enabled on desktop', () => {
  assert.equal(shouldEnableImageItemHover(false), true);
});
