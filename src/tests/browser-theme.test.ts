import test from 'node:test';
import assert from 'node:assert/strict';

// @ts-ignore Node test runner resolves the source TypeScript file directly here.
import {
  ALBUM_MODAL_THEME_COLOR,
  HOME_THEME_COLOR,
  THEME_COLOR_META_NAME,
  VIEWPORT_META_NAME,
  createThemeColorLayer,
  ensureViewportFitCoverContent,
  initializeBrowserTheme,
  removeThemeColorLayer,
  updateThemeColorLayer,
} from '../utils/browser-theme.ts';

type MetaRecord = {
  name: string;
  content: string;
  setAttribute: (key: string, value: string) => void;
};

const createDocumentStub = () => {
  const metas = new Map<string, MetaRecord>();

  return {
    head: {
      appendChild(node: MetaRecord) {
        metas.set(node.name, node);
      },
    },
    querySelector(selector: string) {
      const match = selector.match(/^meta\[name="(.+)"\]$/);
      return match ? metas.get(match[1]) || null : null;
    },
    createElement() {
      return {
        name: '',
        content: '',
        setAttribute(key: string, value: string) {
          if (key === 'name') {
            this.name = value;
          }

          if (key === 'content') {
            this.content = value;
          }
        },
      };
    },
    getMeta(name: string) {
      return metas.get(name) || null;
    },
  };
};

test('initializes viewport-fit cover and default theme color metas', () => {
  const documentStub = createDocumentStub();

  initializeBrowserTheme(documentStub);

  assert.equal(
    documentStub.getMeta(THEME_COLOR_META_NAME)?.content,
    HOME_THEME_COLOR
  );
  assert.equal(
    documentStub.getMeta(VIEWPORT_META_NAME)?.content,
    'width=device-width, initial-scale=1, viewport-fit=cover'
  );
});

test('preserves viewport config while appending viewport-fit cover', () => {
  assert.equal(
    ensureViewportFitCoverContent('width=device-width, initial-scale=1'),
    'width=device-width, initial-scale=1, viewport-fit=cover'
  );
  assert.equal(
    ensureViewportFitCoverContent(
      'width=device-width, initial-scale=1, viewport-fit=cover'
    ),
    'width=device-width, initial-scale=1, viewport-fit=cover'
  );
});

test('last active theme layer wins and fallback restores home color', () => {
  const documentStub = createDocumentStub();
  initializeBrowserTheme(documentStub);

  const homeLayer = createThemeColorLayer();
  updateThemeColorLayer(documentStub, homeLayer, HOME_THEME_COLOR, true);
  assert.equal(
    documentStub.getMeta(THEME_COLOR_META_NAME)?.content,
    HOME_THEME_COLOR
  );

  const modalLayer = createThemeColorLayer();
  updateThemeColorLayer(documentStub, modalLayer, ALBUM_MODAL_THEME_COLOR, true);
  assert.equal(
    documentStub.getMeta(THEME_COLOR_META_NAME)?.content,
    ALBUM_MODAL_THEME_COLOR
  );

  removeThemeColorLayer(documentStub, modalLayer);
  assert.equal(
    documentStub.getMeta(THEME_COLOR_META_NAME)?.content,
    HOME_THEME_COLOR
  );

  removeThemeColorLayer(documentStub, homeLayer);
  assert.equal(
    documentStub.getMeta(THEME_COLOR_META_NAME)?.content,
    HOME_THEME_COLOR
  );
});
