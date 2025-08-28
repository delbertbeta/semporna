<template>
  <div class="timeline">
    <div v-for="item in timelineData" :key="item.year" class="timeline-year">
      <div
        class="timeline-item"
        :class="{ active: activeYear === item.year }"
        @click="toggleYear(item.year)"
      >
        {{ item.year }}
      </div>
      <transition name="slide-fade">
        <div
          v-if="activeYear === item.year"
          class="timeline-months"
          :style="{ '--month-count': item.months.length }"
          :ref="(el) => { if (activeYear === item.year) timelineMonthsRef = el as HTMLElement }"
        >
          <div
            v-for="month in item.months"
            :key="month"
            class="timeline-month-item"
            :class="{ active: activeMonth === month }"
            @click="toggleMonth(item.year, month)"
          >
            {{ month }} 月
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlbumStore } from '@/store/album';
import { computed, watch, nextTick, ref } from 'vue';
import { storeToRefs } from 'pinia';

const albumStore = useAlbumStore();
const { albums, activeYear, activeMonth } = storeToRefs(albumStore);
const { setActiveDate } = albumStore;

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
      const year = parseInt(yearStr, 10);
      const months = Array.from(yearMap[year]).sort((a, b) => a - b);
      return { year, months };
    })
    .sort((a, b) => b.year - a.year);
});

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

const timelineMonthsRef = ref<HTMLElement | null>(null);

watch([activeMonth, activeYear], async (newVal, oldVal) => {
  await nextTick();
  const [newMonth, newYear] = newVal;
  const [oldMonth, oldYear] = oldVal;

  const scrollActiveMonthIntoView = () => {
    const activeMonthEl = document.querySelector(
      '.timeline-month-item.active'
    ) as HTMLElement;
    if (activeMonthEl) {
      activeMonthEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  if (newYear !== oldYear) {
    // activeYear 变化，需要等待过渡结束
    if (timelineMonthsRef.value) {
      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName === 'max-height') {
          scrollActiveMonthIntoView();
          timelineMonthsRef.value?.removeEventListener(
            'transitionend',
            handleTransitionEnd
          );
        }
      };
      timelineMonthsRef.value.addEventListener(
        'transitionend',
        handleTransitionEnd
      );
    } else {
      // 如果没有 ref，可能是元素还没渲染，直接滚动（作为 fallback）
      scrollActiveMonthIntoView();
    }
  } else if (newMonth !== oldMonth) {
    // activeMonth 变化但 activeYear 没变，直接滚动
    scrollActiveMonthIntoView();
  }
});

const scrollToImage = (year: number, month: number) => {
  const scrollWrapper = document.querySelector('.scroll-wrapper');
  if (scrollWrapper) {
    const targetImage = document.querySelector(
      `.image-box[data-year='${year}'][data-month='${month}']`
    );
    if (targetImage) {
      scrollWrapper.scrollTo({
        top: (targetImage as HTMLElement).offsetTop - 80,
        behavior: 'smooth',
      });
    }
  }
};

const toggleYear = (year: number) => {
  if (activeYear.value !== year) {
    const yearData = timelineData.value.find((item) => item.year === year);
    if (yearData && yearData.months.length > 0) {
      const month = yearData.months[0];
      setActiveDate(year, month);
      scrollToImage(year, month);
    }
  }
};

const toggleMonth = (year: number, month: number) => {
  setActiveDate(year, month);
  scrollToImage(year, month);
};
</script>

<style lang="less" scoped>
.timeline {
  min-height: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.2);
  }
}

.timeline-year {
  overflow: hidden;
}

.timeline-item {
  font-size: 16px;
  margin-top: 8px;
  cursor: pointer;
  color: #a9a9a9;
  font-weight: bold;
  transition: color 0.3s ease-in-out;

  &.active {
    color: #121315;
  }
}

.timeline-months {
  padding-left: 20px;
  overflow: hidden;
}

.timeline-month-item {
  font-size: 14px;
  margin-top: 4px;
  color: #a9a9a9;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.3s ease-in-out;

  &.active {
    color: #121315;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
  max-height: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: calc(25px * var(--month-count));
}
</style>
