// src/composables/useScrollOffset.ts
import { computed } from 'vue';
import { useBreakpoints, useWindowSize } from '@vueuse/core';

export function useScrollOffset() {
  const breakpoints = useBreakpoints({ mobile: 768 });
  const isMobile = breakpoints.smallerOrEqual('mobile');
  const { width } = useWindowSize();

  // 桌面端：80px（固定头部留白）
  // 移动端：Banner(55vw) + Tab栏(36px)
  const scrollOffset = computed(() => {
    if (!isMobile.value) return 80;
    return width.value * 0.55 + 36;
  });

  return { isMobile, scrollOffset };
}
