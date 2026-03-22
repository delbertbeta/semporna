<!-- src/components/mobile-month-tabs.vue -->
<template>
  <div class="mobile-month-tabs">
    <div class="year-tabs" ref="yearTabsRef">
      <div
        v-for="item in timelineData"
        :key="item.year"
        class="year-tab"
        :class="{ active: activeYear === item.year }"
        @click="toggleYear(item.year)"
      >
        {{ item.year }}
      </div>
    </div>

    <transition name="month-slide">
      <div
        v-if="activeTimelineItem"
        class="month-tabs"
        ref="monthTabsRef"
      >
        <div
          v-for="month in activeTimelineItem.months"
          :key="month"
          class="month-tab"
          :class="{ active: activeMonth === month }"
          @click="toggleMonth(activeTimelineItem.year, month)"
        >
          {{ month }} 月
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAlbumStore } from '@/store/album';
import { useScrollOffset } from '@/composables/useScrollOffset';

const albumStore = useAlbumStore();
const { albums, activeYear, activeMonth } = storeToRefs(albumStore);
const { setActiveDate } = albumStore;
const { scrollOffset } = useScrollOffset();

const yearTabsRef = ref<HTMLElement | null>(null);
const monthTabsRef = ref<HTMLElement | null>(null);

const timelineData = computed(() => {
  const yearMap: Record<number, Set<number>> = {};

  albums.value.forEach((album) => {
    const date = new Date(album.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (!yearMap[year]) {
      yearMap[year] = new Set();
    }

    yearMap[year].add(month);
  });

  return Object.keys(yearMap)
    .map((yearStr) => {
      const year = Number(yearStr);
      const months = Array.from(yearMap[year]).sort((a, b) => a - b);
      return { year, months };
    })
    .sort((a, b) => b.year - a.year);
});

const activeTimelineItem = computed(() =>
  timelineData.value.find((item) => item.year === activeYear.value) ?? null
);

watch(
  timelineData,
  (newTimelineData) => {
    if (newTimelineData.length > 0 && activeYear.value === null) {
      const latestYear = newTimelineData[0].year;
      const latestMonth = newTimelineData[0].months[0];
      setActiveDate(latestYear, latestMonth);
    }
  },
  { immediate: true }
);

const scrollToImage = (year: number, month: number) => {
  const target = document.querySelector(
    `.image-box[data-year='${year}'][data-month='${month}']`
  ) as HTMLElement | null;

  if (!target) return;

  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - scrollOffset.value,
    behavior: 'smooth',
  });
};

const toggleYear = (year: number) => {
  if (activeYear.value === year) return;

  const yearData = timelineData.value.find((item) => item.year === year);
  if (!yearData || yearData.months.length === 0) return;

  const month = yearData.months[0];
  setActiveDate(year, month);
  scrollToImage(year, month);
};

const toggleMonth = (year: number, month: number) => {
  setActiveDate(year, month);
  scrollToImage(year, month);
};

watch([activeYear, activeMonth], async () => {
  await nextTick();

  const activeYearTab = yearTabsRef.value?.querySelector(
    '.year-tab.active'
  ) as HTMLElement | null;
  const activeMonthTab = monthTabsRef.value?.querySelector(
    '.month-tab.active'
  ) as HTMLElement | null;

  activeYearTab?.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest',
  });

  activeMonthTab?.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest',
  });
});
</script>

<style lang="less" scoped>
.mobile-month-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(245, 243, 240, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.year-tabs,
.month-tabs {
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 0 12px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.year-tabs {
  height: 36px;
  gap: 16px;
}

.month-tabs {
  height: 32px;
  gap: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.year-tab,
.month-tab {
  flex-shrink: 0;
  cursor: pointer;
  white-space: nowrap;
  font-weight: bold;
  transition: color 0.2s ease;
}

.year-tab {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.35);

  &.active {
    color: #121315;
  }
}

.month-tab {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  padding-bottom: 2px;

  &.active {
    color: #121315;
    border-bottom: 2px solid #121315;
  }
}

.month-slide-enter-active,
.month-slide-leave-active {
  transition: all 0.25s ease;
}

.month-slide-enter-from,
.month-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.month-slide-enter-to,
.month-slide-leave-from {
  opacity: 1;
  max-height: 32px;
}
</style>
