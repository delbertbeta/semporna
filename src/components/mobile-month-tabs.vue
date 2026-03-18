<!-- src/components/mobile-month-tabs.vue -->
<template>
  <div class="mobile-month-tabs" ref="tabsRef">
    <div
      v-for="item in tabList"
      :key="`${item.year}-${item.month}`"
      class="month-tab"
      :class="{ active: activeYear === item.year && activeMonth === item.month }"
      @click="handleTabClick(item.year, item.month)"
    >
      {{ item.year }}/{{ String(item.month).padStart(2, '0') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useAlbumStore } from '@/store/album';

const albumStore = useAlbumStore();
const { albums, activeYear, activeMonth } = storeToRefs(albumStore);
const { setActiveDate } = albumStore;

const tabsRef = ref<HTMLElement | null>(null);

// 生成扁平化 year/month 列表，按时间倒序
const tabList = computed(() => {
  const result: { year: number; month: number }[] = [];
  const yearMap: Record<number, Set<number>> = {};
  albums.value.forEach((album) => {
    const date = new Date(album.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (!yearMap[year]) yearMap[year] = new Set();
    yearMap[year].add(month);
  });
  Object.keys(yearMap)
    .map(Number)
    .sort((a, b) => b - a)
    .forEach((year) => {
      Array.from(yearMap[year])
        .sort((a, b) => a - b)
        .forEach((month) => result.push({ year, month }));
    });
  return result;
});

const handleTabClick = (year: number, month: number) => {
  setActiveDate(year, month);
  scrollToImage(year, month);
};

const scrollToImage = (year: number, month: number) => {
  const target = document.querySelector(
    `.image-box[data-year='${year}'][data-month='${month}']`
  ) as HTMLElement;
  if (target) {
    const tabHeight = tabsRef.value?.offsetHeight || 36;
    const bannerHeight = window.innerWidth * 0.55;
    const offset = bannerHeight + tabHeight;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  }
};

// 激活月份变化时，将其滚动到 Tab 栏中央
watch([activeYear, activeMonth], async () => {
  await nextTick();
  const activeTab = tabsRef.value?.querySelector('.month-tab.active') as HTMLElement;
  if (activeTab) {
    activeTab.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  }
});
</script>

<style lang="less" scoped>
.mobile-month-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 36px;
  display: flex;
  align-items: center;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  background: rgba(245, 243, 240, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 12px;
  gap: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.month-tab {
  flex-shrink: 0;
  scroll-snap-align: center;
  font-size: 13px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  padding-bottom: 2px;
  white-space: nowrap;
  transition: color 0.2s ease;

  &.active {
    color: #121315;
    border-bottom: 2px solid #121315;
  }
}
</style>
