import {
  createThemeColorLayer,
  removeThemeColorLayer,
  updateThemeColorLayer,
} from '@/utils/browser-theme';
import {
  computed,
  MaybeRefOrGetter,
  onMounted,
  onUnmounted,
  toValue,
  watchEffect,
} from 'vue';

export const useThemeColor = (
  color: MaybeRefOrGetter<string>,
  active: MaybeRefOrGetter<boolean> = true
) => {
  const isClient = typeof document !== 'undefined';
  const layerId = isClient ? createThemeColorLayer() : null;

  const resolvedColor = computed(() => toValue(color));
  const resolvedActive = computed(() => toValue(active));

  const syncThemeColor = () => {
    if (!isClient || layerId === null) {
      return;
    }

    updateThemeColorLayer(
      document,
      layerId,
      resolvedColor.value,
      resolvedActive.value
    );
  };

  onMounted(syncThemeColor);

  watchEffect(() => {
    syncThemeColor();
  });

  onUnmounted(() => {
    if (!isClient || layerId === null) {
      return;
    }

    removeThemeColorLayer(document, layerId);
  });
};
