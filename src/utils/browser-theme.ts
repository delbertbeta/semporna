export const HOME_THEME_COLOR = '#f5f3f0';

export const ALBUM_MODAL_THEME_COLOR = '#212121';

export const THEME_COLOR_META_NAME = 'theme-color';

export const VIEWPORT_META_NAME = 'viewport';

type MetaElementLike = {
  content: string;
  name?: string;
  setAttribute?: (name: string, value: string) => void;
};

type DocumentLike = {
  head?: {
    appendChild: (node: unknown) => unknown;
  };
  querySelector: (selector: string) => unknown;
  createElement: (tagName: string) => unknown;
};

const asMetaElement = (element: unknown) => element as MetaElementLike | null;

const escapeAttributeValue = (value: string) => value.replace(/"/g, '\\"');

const getMetaSelector = (name: string) =>
  `meta[name="${escapeAttributeValue(name)}"]`;

export const ensureMetaElement = (
  doc: DocumentLike,
  name: string
) => {
  const selector = getMetaSelector(name);
  const existingMeta = asMetaElement(doc.querySelector(selector));

  if (existingMeta) {
    return existingMeta;
  }

  const meta = asMetaElement(doc.createElement('meta'));

  if (!meta) {
    throw new Error(`Unable to create meta element for "${name}"`);
  }

  meta.setAttribute?.('name', name);

  if (doc.head) {
    doc.head.appendChild(meta);
  }

  return meta;
};

export const setMetaContent = (
  doc: DocumentLike,
  name: string,
  content: string
) => {
  const meta = ensureMetaElement(doc, name);
  meta.content = content;
  meta.setAttribute?.('content', content);
  return meta;
};

export const ensureViewportFitCoverContent = (content: string) => {
  const normalized = content.trim();

  if (!normalized) {
    return 'width=device-width, initial-scale=1, viewport-fit=cover';
  }

  if (/viewport-fit\s*=\s*cover/i.test(normalized)) {
    return normalized;
  }

  return `${normalized}, viewport-fit=cover`;
};

export const ensureViewportFitCover = (doc: DocumentLike) => {
  const meta = ensureMetaElement(doc, VIEWPORT_META_NAME);
  const content = ensureViewportFitCoverContent(meta.content || '');
  meta.content = content;
  meta.setAttribute?.('content', content);
  return meta;
};

type ThemeLayer = {
  id: number;
  active: boolean;
  color: string;
};

let nextThemeLayerId = 0;
const themeLayers: ThemeLayer[] = [];

const getActiveThemeColor = () => {
  for (let index = themeLayers.length - 1; index >= 0; index -= 1) {
    if (themeLayers[index].active) {
      return themeLayers[index].color;
    }
  }

  return HOME_THEME_COLOR;
};

export const syncDocumentThemeColor = (doc: DocumentLike) => {
  setMetaContent(doc, THEME_COLOR_META_NAME, getActiveThemeColor());
};

export const createThemeColorLayer = () => {
  const id = nextThemeLayerId;
  nextThemeLayerId += 1;
  themeLayers.push({
    id,
    active: false,
    color: HOME_THEME_COLOR,
  });
  return id;
};

export const updateThemeColorLayer = (
  doc: DocumentLike,
  id: number,
  color: string,
  active: boolean
) => {
  const layer = themeLayers.find((item) => item.id === id);

  if (!layer) {
    return;
  }

  layer.color = color;
  layer.active = active;
  syncDocumentThemeColor(doc);
};

export const removeThemeColorLayer = (
  doc: DocumentLike,
  id: number
) => {
  const layerIndex = themeLayers.findIndex((item) => item.id === id);

  if (layerIndex === -1) {
    return;
  }

  themeLayers.splice(layerIndex, 1);
  syncDocumentThemeColor(doc);
};

export const initializeBrowserTheme = (doc: DocumentLike) => {
  ensureViewportFitCover(doc);
  syncDocumentThemeColor(doc);
};
