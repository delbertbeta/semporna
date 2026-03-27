export function getVirtualWindowConfig(maxRenderedSlides: number) {
  const clampedMaxRenderedSlides = Math.max(1, Math.floor(maxRenderedSlides));
  const surroundingSlides = clampedMaxRenderedSlides - 1;

  return {
    addSlidesBefore: Math.floor(surroundingSlides / 2),
    addSlidesAfter: Math.ceil(surroundingSlides / 2),
  };
}
