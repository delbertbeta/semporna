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
        >
          <div
            v-for="month in item.months"
            :key="month"
            class="timeline-month-item"
            :class="{ active: activeMonth === month }"
            @click="toggleMonth(month)"
          >
            {{ month }} 月
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const timelineData = ref([
  { year: 2024, months: [3, 5] },
  { year: 2023, months: [6] },
  { year: 2022, months: [1, 8, 12] },
]);

const activeYear = ref<null | number>(timelineData.value[0].year);
const activeMonth = ref<null | number>(timelineData.value[0].months[0]);

const toggleYear = (year: number) => {
  if (activeYear.value === year) {
    activeYear.value = null;
    activeMonth.value = null;
  } else {
    activeYear.value = year;
    const yearData = timelineData.value.find((item) => item.year === year);
    if (yearData && yearData.months.length > 0) {
      activeMonth.value = yearData.months[0];
    } else {
      activeMonth.value = null;
    }
  }
};

const toggleMonth = (month: number) => {
  activeMonth.value = month;
};
</script>

<style lang="less" scoped>
.timeline {
  position: absolute;
  left: 42px;
  bottom: 42px;
}

.timeline-item {
  font-size: 16px;
  margin-top: 8px;
  cursor: pointer;
  color: #a9a9a9;
  font-weight: bold;

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
