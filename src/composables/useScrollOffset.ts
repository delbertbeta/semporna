import { computed } from 'vue';
import { useBreakpoints } from '@vueuse/core';

export function useScrollOffset() {
  const breakpoints = useBreakpoints({ mobile: 768 });
  const isMobile = breakpoints.smallerOrEqual('mobile');

  // 桌面端：80px（固定头部留白）
  // 移动端：Banner(55vw) + Tab栏(36px)
  const scrollOffset = computed(() => {
    if (!isMobile.value) return 80;
    return window.innerWidth * 0.55 + 36;
  });

  return { isMobile, scrollOffset };
}
