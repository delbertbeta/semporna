# Semporna 移动端改造实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Semporna 照片画廊实现完整的移动端（≤768px）适配，覆盖首页布局、抽屉导航、相册 Modal 三个核心模块。

**Architecture:** 桌面端布局不变，使用 CSS media query 处理样式差异、`useBreakpoints`（VueUse）+ `v-if` 处理结构差异。新建 `useScrollOffset.ts` composable 统一滚动偏移量计算，避免各组件重复判断断点。移动端相册 Modal 完全独立于桌面端，使用 `mobile-modal-wrapper.vue` 包装，支持沉浸/展开两态切换。

**Tech Stack:** Vue 3 Composition API, TypeScript, Less, `@vueuse/core`（`useBreakpoints`, `useSwipe`）, `@headlessui/vue`（Popover），Swiper Vue

---

## 文件清单

### 新建文件
- `src/composables/useScrollOffset.ts` — 计算移动端/桌面端滚动偏移量，同时导出 `isMobile`
- `src/components/sidebar-content.vue` — 侧边栏内容（Logo + 标题 + `<timeline-block />`），无定位样式
- `src/components/mobile-drawer.vue` — 移动端左滑抽屉，包装 `<sidebar-content />`
- `src/components/mobile-month-tabs.vue` — 移动端粘性月份 Tab 栏
- `src/components/mobile-modal-wrapper.vue` — 移动端全屏 slide-up Modal 容器

### 修改文件
- `src/store/index.ts` — 新增 `mobileDrawerOpen` 状态和 `toggleMobileDrawer` action
- `src/components/about-block.vue` — 内部改用 `<sidebar-content />`，移动端隐藏整个组件
- `src/components/full-screen-banner.vue` — 移动端高度 `55vw`、汉堡按钮、隐藏箭头、开启触控滑动
- `src/components/image-gallery.vue` — 插入 `<mobile-month-tabs />`，移动端改为监听 `window` scroll
- `src/components/image-list.vue` — 移动端 masonry 参数（`column-width: 160px`，`gap: 4px`，`padding: 6px`，`margin-left: 0`）
- `src/components/timeline-block.vue` — 修复移动端 `scrollToImage` 偏移量计算
- `src/components/album-modal-slider.vue` — 新增 `cover` prop，控制 `object-fit`
- `src/components/album-modal.vue` — 移动端用 `<mobile-modal-wrapper>`，含沉浸/展开视图

---

## Task 1: 创建 `useScrollOffset` composable

**Files:**
- Create: `src/composables/useScrollOffset.ts`

- [ ] **Step 1: 创建文件**

```typescript
// src/composables/useScrollOffset.ts
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
```

- [ ] **Step 2: 验证文件编译无报错**

```bash
cd /home/delbertbeta/projects/semporna && npm run build 2>&1 | tail -20
```

预期：Build 成功，无 TypeScript 报错。

- [ ] **Step 3: Commit**

```bash
git add src/composables/useScrollOffset.ts
git commit -m "feat: add useScrollOffset composable for mobile/desktop scroll offset"
```

---

## Task 2: 新增 `mobileDrawerOpen` 到 app store

**Files:**
- Modify: `src/store/index.ts`

- [ ] **Step 1: 读取现有 store**

查看 `src/store/index.ts` 当前内容，了解状态结构。

- [ ] **Step 2: 新增 `mobileDrawerOpen` 状态**

在 `useAppStore` 中新增：
```typescript
const mobileDrawerOpen = ref(false);

const toggleMobileDrawer = () => {
  mobileDrawerOpen.value = !mobileDrawerOpen.value;
};

const closeMobileDrawer = () => {
  mobileDrawerOpen.value = false;
};
```

在 `return` 中导出 `mobileDrawerOpen`、`toggleMobileDrawer`、`closeMobileDrawer`。

- [ ] **Step 3: 验证构建**

```bash
npm run build 2>&1 | tail -10
```

预期：无报错。

- [ ] **Step 4: Commit**

```bash
git add src/store/index.ts
git commit -m "feat: add mobileDrawerOpen state to app store"
```

---

## Task 3: 提取 `sidebar-content.vue`，修改 `about-block.vue`

**Files:**
- Create: `src/components/sidebar-content.vue`
- Modify: `src/components/about-block.vue`

**目标**：将 `about-block.vue` 中的内容区（Logo + 标题 + `<timeline-block />`）提取到独立组件。`about-block.vue` 外壳（定位、背景）保持不变，视觉无任何变化。

- [ ] **Step 1: 创建 `sidebar-content.vue`**

```vue
<!-- src/components/sidebar-content.vue -->
<template>
  <div class="sidebar-content">
    <div class="logo-box">
      <img class="logo" src="../assets/img/logo.png" />
      <div class="desc">
        <div class="top-text">All about</div>
        <div class="bottom-text">Delbert &amp; Shyrii</div>
      </div>
    </div>
    <timeline-block />
  </div>
</template>

<script setup lang="ts">
import TimelineBlock from './timeline-block.vue';
</script>

<style lang="less" scoped>
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.logo-box {
  display: flex;
  align-items: center;

  .logo {
    width: 80px;
    height: 80px;
    margin-right: 24px;

    // 移动端：缩小为圆形，适配抽屉窄空间
    @media (max-width: 768px) {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 16px;
    }
  }

  .desc {
    font-weight: bold;

    .top-text {
      font-size: 36px;
      font-weight: 700;

      @media (max-width: 768px) {
        font-size: 24px;
      }
    }

    .bottom-text {
      font-size: 20px;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }
  }
}
</style>
```

- [ ] **Step 2: 修改 `about-block.vue` 使用 `sidebar-content`**

将模板内容替换为：
```vue
<template>
  <div class="about-block" :class="{ 'no-blur': isAnyModalOpen }">
    <sidebar-content />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';
import SidebarContent from './sidebar-content.vue';

const store = useAppStore();
const { isAnyModalOpen } = storeToRefs(store);
</script>
```

保留 `about-block.vue` 中原有的 `<style>` 部分（`.about-block` 定位、背景渐变等），删除 `.logo-box` 相关样式（已移到 `sidebar-content.vue`）。

移动端需隐藏 `about-block`，在样式中添加：
```less
@media (max-width: 768px) {
  .about-block {
    display: none;
  }
}
```

- [ ] **Step 3: 启动开发服务器，桌面端视觉验证**

```bash
npm start
```

打开浏览器 `http://localhost:3001`，确认桌面端（>768px）布局与之前完全一致：左侧有侧边栏、Logo、时间轴、点击月份跳转正常。

- [ ] **Step 4: Commit**

```bash
git add src/components/sidebar-content.vue src/components/about-block.vue
git commit -m "refactor: extract sidebar-content from about-block for mobile reuse"
```

---

## Task 4: 创建 `mobile-drawer.vue`

**Files:**
- Create: `src/components/mobile-drawer.vue`

- [ ] **Step 1: 创建抽屉组件**

```vue
<!-- src/components/mobile-drawer.vue -->
<template>
  <teleport to="body">
    <!-- 遮罩 -->
    <transition name="mask-fade">
      <div
        v-if="isOpen"
        class="drawer-mask"
        @click="handleClose"
      />
    </transition>
    <!-- 抽屉面板 -->
    <transition name="drawer-slide">
      <div
        v-if="isOpen"
        ref="drawerRef"
        class="drawer-panel"
        :class="{ 'no-blur': isAnyModalOpen }"
      >
        <sidebar-content />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwipe, SwipeDirection } from '@vueuse/core';
import { useAppStore } from '@/store';
import SidebarContent from './sidebar-content.vue';

const store = useAppStore();
const { mobileDrawerOpen, isAnyModalOpen } = storeToRefs(store);
const { closeMobileDrawer } = store;

const drawerRef = ref<HTMLElement | null>(null);
const isOpen = mobileDrawerOpen;

const handleClose = () => {
  closeMobileDrawer();
};

// 向左滑动关闭抽屉（距离 > 40px 才触发，避免纵向滚动误触）
const { lengthX, direction: swipeDirection } = useSwipe(drawerRef, {
  threshold: 10,
  onSwipeEnd() {
    if (
      swipeDirection.value === SwipeDirection.LEFT &&
      Math.abs(lengthX.value) > 40
    ) {
      closeMobileDrawer();
    }
  },
});
</script>

<style lang="less" scoped>
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  z-index: 200;
}

.drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(80vw, 300px);
  z-index: 201;
  padding: 42px 32px;
  box-sizing: border-box;
  background: linear-gradient(90deg, #edecea 0%, rgba(237, 236, 234, 0.95) 100%);
  backdrop-filter: blur(32px);
  transition: backdrop-filter 0.3s ease;

  &.no-blur {
    backdrop-filter: none;
  }
}

.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.3s ease;
}
.mask-fade-enter-from,
.mask-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}
</style>
```

- [ ] **Step 2: 在 `Home.vue` 中引入 `mobile-drawer`**

在 `src/views/Home.vue` 中添加 `<mobile-drawer />`：

```vue
<template>
  <div class="home-container">
    <about-block></about-block>
    <image-gallery></image-gallery>
    <album-modal />
    <mobile-drawer />
  </div>
</template>

<script setup lang="ts">
import AboutBlock from '../components/about-block.vue';
import ImageGallery from '../components/image-gallery.vue';
import AlbumModal from '../components/album-modal.vue';
import MobileDrawer from '../components/mobile-drawer.vue';
</script>
```

- [ ] **Step 3: 移动端视觉验证**

在浏览器 DevTools 切换到 iPhone 视口（375×667）。此时左侧侧边栏已隐藏（Task 3 中添加的 `display: none`）。抽屉暂时无法通过 UI 打开（汉堡按钮在下个 Task），可在浏览器控制台手动调用：

```javascript
// 在控制台测试抽屉
window.__pinia.state.value.app.mobileDrawerOpen = true
```

确认抽屉从左侧滑入，遮罩正确显示，点击遮罩关闭。

- [ ] **Step 4: Commit**

```bash
git add src/components/mobile-drawer.vue src/views/Home.vue
git commit -m "feat: add mobile-drawer component with slide-in animation and swipe-to-close"
```

---

## Task 5: 修改 `full-screen-banner.vue` 适配移动端

**Files:**
- Modify: `src/components/full-screen-banner.vue`

移动端改动：① 高度 `55vw`；② 左上角汉堡按钮；③ 隐藏左右箭头；④ 开启触控滑动；⑤ 移动端不显示 `scroll-down` 指示器。

- [ ] **Step 1: 在 script 中引入 store 的 toggleMobileDrawer 和 useScrollOffset**

```typescript
import { useAppStore } from '@/store';
import { useScrollOffset } from '@/composables/useScrollOffset';

const appStore = useAppStore();
const { toggleMobileDrawer } = appStore;
const { isMobile } = useScrollOffset();
```

- [ ] **Step 2: 修改 Swiper 的 simulate-touch 为动态绑定**

将 `:simulate-touch="false"` 改为 `:simulate-touch="isMobile"`。

- [ ] **Step 3: 在模板中添加汉堡按钮**

在 `<swiper>` 前（或 `full-screen-banner` 容器内首位）添加：

```vue
<button
  v-if="isMobile"
  class="hamburger-btn"
  @click="toggleMobileDrawer"
>
  <span class="hamburger-icon">&#9776;</span>
</button>
```

- [ ] **Step 4: 为箭头和 scroll-down 添加移动端隐藏样式**

在 `<style>` 中添加：
```less
@media (max-width: 768px) {
  .left-arrow,
  .right-arrow {
    display: none;
  }

  .scroll-down {
    display: none;
  }

  .full-screen-banner {
    height: 55vw;
  }

  // 移动端 swiper 位置：撑满整个 Banner
  .full-screen-banner-slider {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  // 移动端进度条放到 Banner 底部内侧
  .autoplay-progress {
    top: unset;
    bottom: 8px;
    right: 50%;
    transform: translateX(50%);
  }
}
```

- [ ] **Step 5: 为汉堡按钮添加样式**

```less
.hamburger-btn {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(8px);
    color: white;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }
}
```

- [ ] **Step 6: 修复移动端 Banner 日期显示**

桌面端 `.info-tag` 位于 `top: -64px`（相对于 slide item），且 `.full-screen-banner` 有 `overflow: hidden`，移动端会被裁切。需要为移动端单独覆盖 `.info-tag` 位置。

在 Task 5 的移动端媒体查询中补充：

```less
@media (max-width: 768px) {
  // 将日期标签移到 Banner 底部左侧
  .swiper-slide-active .info-tag {
    top: unset;
    bottom: 14px;
    left: 14px;
  }

  .info-tag {
    top: unset;
    bottom: 14px;
    left: 14px;
  }

  .into-year {
    font-size: 18px;
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }
}
```

- [ ] **Step 7: 移动端视觉验证**

在 DevTools iPhone 视口下确认：
- Banner 高度约为视口宽度的 55%
- 左上角有半透明汉堡按钮 ☰
- Banner 底部左侧显示当前相册 `YYYY/MM` 日期
- 点击汉堡按钮抽屉从左滑入
- 左右箭头消失
- 照片可以触控左右滑动切换

- [ ] **Step 8: Commit**

```bash
git add src/components/full-screen-banner.vue
git commit -m "feat: adapt full-screen-banner for mobile (height, hamburger btn, touch swipe, date label)"
```

---

## Task 6: 创建 `mobile-month-tabs.vue`

**Files:**
- Create: `src/components/mobile-month-tabs.vue`

- [ ] **Step 1: 创建粘性月份 Tab 组件**

```vue
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
```

---

## Task 7: 修改 `image-gallery.vue` 适配移动端

**Files:**
- Modify: `src/components/image-gallery.vue`

移动端改动：① 插入 `<mobile-month-tabs />`；② 改为监听 `window` scroll；③ 修复滚动检测阈值；④ `.scroll-wrapper` 移动端变为普通文档流容器。

- [ ] **Step 1: 引入依赖，修改 `<template>`**

将 `<full-screen-banner />` 和 `<image-list />` 之间插入移动端 Tab 栏：

```vue
<template>
  <div class="scroll-wrapper" @scroll="handleScroll">
    <full-screen-banner />
    <mobile-month-tabs v-if="isMobile" />
    <image-list />
  </div>
</template>
```

- [ ] **Step 2: 修改 `<script>` 中的滚动逻辑**

```typescript
import { onMounted, onUnmounted } from 'vue';
import { useScrollOffset } from '@/composables/useScrollOffset';
import MobileMonthTabs from './mobile-month-tabs.vue';

const { isMobile, scrollOffset } = useScrollOffset();

const handleScroll = throttle(() => {
  const imageItems = document.querySelectorAll(
    '.masonry-column:first-of-type .image-box'
  );
  let activeImage: Element | null = null;

  let low = 0;
  let high = imageItems.length - 1;
  let candidateIndex = -1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const rect = imageItems[mid].getBoundingClientRect();

    // 使用 scrollOffset 替代硬编码的 120
    if (rect.top > scrollOffset.value) {
      high = mid - 1;
    } else if (rect.top < 0) {
      low = mid + 1;
    } else {
      candidateIndex = mid;
      high = mid - 1;
    }
  }

  if (candidateIndex !== -1) {
    activeImage = imageItems[candidateIndex];
  }

  if (activeImage) {
    const year = activeImage.getAttribute('data-year');
    const month = activeImage.getAttribute('data-month');
    if (year && month) {
      store.setActiveDate(parseInt(year), parseInt(month));
    }
  }
}, 200);

// 响应式管理 window scroll 监听（支持窗口 resize 切换断点）
watch(
  isMobile,
  (mobile) => {
    if (mobile) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
```

注意：桌面端的 `@scroll="handleScroll"` 保留在 `.scroll-wrapper` 上，移动端 window 监听是附加的（因为移动端 `.scroll-wrapper` 不会触发 scroll，不会重复调用）。

- [ ] **Step 3: 修改 `.scroll-wrapper` 移动端样式**

```less
@media (max-width: 768px) {
  .scroll-wrapper {
    height: auto;
    overflow-y: unset;
  }
}
```

- [ ] **Step 4: 移动端验证**

DevTools iPhone 视口下，下拉滚动页面：
- Banner 下方紧跟 Tab 栏（高 36px，sticky 效果）
- 继续滚动时，Tab 栏吸顶
- 滚动到不同月份的图片时，Tab 栏激活项自动高亮并居中

- [ ] **Step 5: Commit**

```bash
git add src/components/image-gallery.vue src/components/mobile-month-tabs.vue
git commit -m "feat: integrate mobile-month-tabs and window scroll listener in image-gallery"
```

---

## Task 8: 修改 `image-list.vue` 适配移动端瀑布流

**Files:**
- Modify: `src/components/image-list.vue`

- [ ] **Step 1: 引入 `useScrollOffset` 并传入响应式 masonry 参数**

```vue
<template>
  <masonry-wall
    class="image-list-container"
    :items="albums"
    :column-width="isMobile ? 160 : 300"
    :min-columns="1"
    :max-columns="isMobile ? 2 : 5"
    :gap="isMobile ? 4 : 32"
  >
    <template #default="{ item, index }">
      <image-item :item="item" :key="index" />
    </template>
  </masonry-wall>
</template>

<script setup lang="ts">
import ImageItem from './image-item.vue';
import { useAlbumStore } from '@/store/album';
import { storeToRefs } from 'pinia';
import { useScrollOffset } from '@/composables/useScrollOffset';

const store = useAlbumStore();
const { albums } = storeToRefs(store);
const { isMobile } = useScrollOffset();
</script>
```

- [ ] **Step 2: 修改容器样式，移动端 margin/padding**

```less
.image-list-container {
  box-sizing: border-box;
  margin: 80px 160px 80px 520px;

  @media (max-width: 768px) {
    margin: 0;
    padding: 6px;
  }
}
```

- [ ] **Step 3: 移动端验证**

DevTools iPhone 视口下，确认瀑布流为 2 列，图片间距为 4px，左右 6px padding，没有桌面端的 520px 左偏移。

- [ ] **Step 4: Commit**

```bash
git add src/components/image-list.vue
git commit -m "feat: responsive masonry parameters for mobile (2-col, 4px gap)"
```

---

## Task 9: 修复 `timeline-block.vue` 移动端 scrollToImage

**Files:**
- Modify: `src/components/timeline-block.vue`

桌面端 `scrollToImage` 使用 `offsetTop` 对 masonry 内元素不准确（移动端尤甚），需改用 `getBoundingClientRect().top + window.scrollY`。

- [ ] **Step 1: 引入 `useScrollOffset`，修改 `scrollToImage` 函数**

```typescript
import { useScrollOffset } from '@/composables/useScrollOffset';

const { isMobile, scrollOffset } = useScrollOffset();

const scrollToImage = (year: number, month: number) => {
  const target = document.querySelector(
    `.image-box[data-year='${year}'][data-month='${month}']`
  ) as HTMLElement;

  if (!target) return;

  if (isMobile.value) {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - scrollOffset.value,
      behavior: 'smooth',
    });
  } else {
    const scrollWrapper = document.querySelector('.scroll-wrapper');
    if (scrollWrapper) {
      scrollWrapper.scrollTo({
        top: (target as HTMLElement).offsetTop - 80,
        behavior: 'smooth',
      });
    }
  }
};
```

同时，点击月份后关闭移动端抽屉，在 `toggleMonth` 中添加：

```typescript
import { useAppStore } from '@/store';

const appStore = useAppStore();

const toggleMonth = (year: number, month: number) => {
  setActiveDate(year, month);
  scrollToImage(year, month);
  // 移动端：点击月份后关闭抽屉
  if (isMobile.value) {
    appStore.closeMobileDrawer();
  }
};
```

- [ ] **Step 2: 移动端验证**

打开抽屉，点击不同月份，确认：
- 页面滚动到对应月份的第一张图片
- Banner + Tab 栏高度的空间被正确计入，图片不被遮挡
- 抽屉自动关闭

- [ ] **Step 3: Commit**

```bash
git add src/components/timeline-block.vue
git commit -m "fix: correct scrollToImage offset on mobile using getBoundingClientRect"
```

---

## Task 10: 为 `album-modal-slider.vue` 添加 `cover` prop

**Files:**
- Modify: `src/components/album-modal-slider.vue`

- [ ] **Step 1: 添加 `cover` prop**

在 `defineProps` 中添加：
```typescript
const props = defineProps<{
  album: AlbumRes | null;
  cover?: boolean;
}>();
```

- [ ] **Step 2: 使用 `:simulate-touch` 动态绑定（移动端开启）**

引入 `useScrollOffset`：
```typescript
import { useScrollOffset } from '@/composables/useScrollOffset';
const { isMobile } = useScrollOffset();
```

将 `:simulate-touch="false"` 改为 `:simulate-touch="isMobile"`。

- [ ] **Step 3: 修改 img 样式**

将当前 `class="album-modal-img object-contain ..."` 改为动态绑定：
```vue
<img
  v-show="imageLoadedState[photo.id!]"
  @load="imageLoadedState[photo.id!] = true"
  :id="`image-id-${photo.id}`"
  class="album-modal-img max-h-full max-w-full h-full w-full"
  :class="props.cover ? 'object-cover' : 'object-contain'"
  :src="matchImageUrl(photo.image, 'higher', '1080p')"
/>
```

同时，在移动端隐藏 `album-modal-slider` 内的左右箭头（移动端用触控滑动）：

```less
// 在 album-modal-slider.vue 样式末尾添加
@media (max-width: 768px) {
  .left-arrow,
  .right-arrow {
    display: none;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/album-modal-slider.vue
git commit -m "feat: add cover prop and mobile touch to album-modal-slider"
```

---

## Task 11: 创建 `mobile-modal-wrapper.vue`

**Files:**
- Create: `src/components/mobile-modal-wrapper.vue`

- [ ] **Step 1: 创建全屏 slide-up 包装器**

```vue
<!-- src/components/mobile-modal-wrapper.vue -->
<template>
  <transition
    name="mobile-modal"
    :duration="{ enter: 400, leave: 350 }"
    @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave"
  >
    <div class="mobile-modal-container" v-if="visible">
      <loading-placeholder :loading="realLoading" />
      <slot></slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import LoadingPlaceholder from './loading-placeholder.vue';

const props = defineProps<{
  visible: boolean;
  loading?: boolean;
}>();

// 注意：wrapper 不持有 close 逻辑，关闭由 slot 内容中的按钮直接调用
// 父组件的 handleCloseModal，不需要 wrapper 转发 close emit

const entered = ref(false);
const realLoading = computed(() => !entered.value || props.loading);

const handleAfterEnter = () => {
  entered.value = true;
};

const handleAfterLeave = () => {
  entered.value = false;
};
</script>

<style lang="less" scoped>
.mobile-modal-container {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #212121;
  overflow: hidden;
}

.mobile-modal-enter-active {
  animation: slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1) both;
}

.mobile-modal-leave-active {
  animation: slide-down 0.35s cubic-bezier(0.32, 0.72, 0, 1) both;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mobile-modal-wrapper.vue
git commit -m "feat: add mobile-modal-wrapper full-screen slide-up container"
```

---

## Task 12: 更新 `album-modal.vue` 添加移动端 UI

**Files:**
- Modify: `src/components/album-modal.vue`

这是最复杂的 Task。实现移动端沉浸视图（默认）和展开视图（上滑后），包含进度条、顶部栏、peek 栏、信息面板。

- [ ] **Step 1: 引入依赖，添加移动端状态**

```typescript
import { ref, computed, watchEffect } from 'vue';
import { useScrollOffset } from '@/composables/useScrollOffset';
import { useSwipe, SwipeDirection } from '@vueuse/core';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { ExclamationCircleIcon, ViewfinderCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import MobileModalWrapper from './mobile-modal-wrapper.vue';

const { isMobile } = useScrollOffset();

// 移动端展开状态
const isExpanded = ref(false);

// peek 栏 / info panel 的 swipe ref
const peekRef = ref<HTMLElement | null>(null);
const infoPanelRef = ref<HTMLElement | null>(null);

// 向上滑动 peek 栏 → 展开
useSwipe(peekRef, {
  threshold: 10,
  onSwipeEnd(_, direction) {
    if (direction === SwipeDirection.UP) {
      isExpanded.value = true;
    }
  },
});

// 向下滑动 info panel 把手 → 收起
useSwipe(infoPanelRef, {
  threshold: 10,
  onSwipeEnd(_, direction) {
    if (direction === SwipeDirection.DOWN) {
      isExpanded.value = false;
    }
  },
});

// 关闭 modal 时重置状态
const handleCloseModal = () => {
  isExpanded.value = false;
  closeAlbumModal();
};
```

- [ ] **Step 2: 修改模板，添加条件分支**

完整模板结构（保留桌面端分支不变，仅新增移动端分支）：

```vue
<template>
  <!-- 移动端 -->
  <mobile-modal-wrapper
    v-if="isMobile"
    :visible="showAlbumModal"
    :loading="loading"
    @close="handleCloseModal"
  >
    <div class="album-modal-mobile">
      <!-- 照片 Swiper（始终全屏，cover 模式） -->
      <div
        class="mobile-photo-area"
        :class="{ expanded: isExpanded }"
      >
        <album-modal-slider
          :album="albumDetail"
          :cover="true"
          @slideChange="handleSlideChange"
          @image-loading-state="handleImageLoadingState"
        />

        <!-- 顶部栏 -->
        <div class="mobile-top-bar">
          <span class="mobile-top-location">
            {{ currentPhoto?.image.exif.location || albumDetail?.mainArea }}
            <template v-if="currentPhoto?.image.exif.dateTime">
              · {{ new Date(currentPhoto.image.exif.dateTime).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }) }}
            </template>
          </span>
          <button class="mobile-close-btn" @click="handleCloseModal">
            <XMarkIcon class="size-4" />
          </button>
        </div>

        <!-- 进度条 -->
        <div class="mobile-progress-bar">
          <div
            v-for="(photo, idx) in albumDetail?.photos || []"
            :key="photo.id"
            class="mobile-progress-segment"
            :class="{
              viewed: idx < currentSlideIndexMobile,
              current: idx === currentSlideIndexMobile,
            }"
          />
        </div>

        <!-- 展开状态下的 ⓘ 按钮（浮于照片右上角） -->
        <Popover v-if="isExpanded" class="mobile-exif-popover-wrapper">
          <PopoverButton class="outline-none">
            <div class="mobile-exif-btn">
              <ExclamationCircleIcon class="size-4" />
            </div>
          </PopoverButton>
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
          >
            <PopoverPanel class="mobile-exif-panel">
              <!-- EXIF 内容（与桌面端一致） -->
              <div class="rounded-md bg-white w-full overflow-hidden">
                <div class="text-text-main bg-green-transparent-1 h-7 px-3 font-bold w-full leading-7">
                  {{ currentPhoto?.image.exif.dateTime ? new Date(currentPhoto.image.exif.dateTime).toLocaleString() : '未知拍摄时间' }}
                </div>
                <div class="flex flex-row items-start py-2 px-3">
                  <ViewfinderCircleIcon class="size-4 mt-0.5" />
                  <div class="flex flex-col font-medium ms-2 text-sm">
                    <div>{{ currentPhoto?.image.exif.model || '未知相机' }}</div>
                    <div>{{ currentPhoto?.image.exif.lens || '未知镜头' }}</div>
                  </div>
                </div>
                <div class="bg-divider h-px mx-3" />
                <div class="flex font-medium mt-1 mb-2 mx-3 text-sm gap-2">
                  <span>{{ currentPhoto?.image.exif.fNumber || 'ƒ -' }}</span>
                  <span>{{ currentPhoto?.image.exif.focalLength || '- mm' }}</span>
                  <span>{{ currentPhoto?.image.exif.iso || 'ISO -' }}</span>
                  <span>{{ currentPhoto?.image.exif.ev || '- ev' }}</span>
                  <span>{{ currentPhoto?.image.exif.exposureTime || '- s' }}</span>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </div>

      <!-- Peek 栏（沉浸状态时显示，展开后隐藏） -->
      <div
        v-if="!isExpanded"
        ref="peekRef"
        class="mobile-peek-strip"
        @click.self="isExpanded = true"
      >
        <div class="peek-handle" />
        <div class="peek-content">
          <span class="peek-title">
            {{ currentPhoto?.title || albumDetail?.mainArea }}
          </span>
          <Popover class="peek-exif-wrapper">
            <PopoverButton class="outline-none">
              <div class="mobile-exif-btn peek-exif-btn">
                <ExclamationCircleIcon class="size-4" />
              </div>
            </PopoverButton>
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-1 opacity-0"
            >
              <PopoverPanel class="mobile-exif-panel">
                <div class="rounded-md bg-white w-full overflow-hidden">
                  <div class="text-text-main bg-green-transparent-1 h-7 px-3 font-bold w-full leading-7">
                    {{ currentPhoto?.image.exif.dateTime ? new Date(currentPhoto.image.exif.dateTime).toLocaleString() : '未知拍摄时间' }}
                  </div>
                  <div class="flex flex-row items-start py-2 px-3">
                    <ViewfinderCircleIcon class="size-4 mt-0.5" />
                    <div class="flex flex-col font-medium ms-2 text-sm">
                      <div>{{ currentPhoto?.image.exif.model || '未知相机' }}</div>
                      <div>{{ currentPhoto?.image.exif.lens || '未知镜头' }}</div>
                    </div>
                  </div>
                  <div class="bg-divider h-px mx-3" />
                  <div class="flex font-medium mt-1 mb-2 mx-3 text-sm gap-2">
                    <span>{{ currentPhoto?.image.exif.fNumber || 'ƒ -' }}</span>
                    <span>{{ currentPhoto?.image.exif.focalLength || '- mm' }}</span>
                    <span>{{ currentPhoto?.image.exif.iso || 'ISO -' }}</span>
                    <span>{{ currentPhoto?.image.exif.ev || '- ev' }}</span>
                    <span>{{ currentPhoto?.image.exif.exposureTime || '- s' }}</span>
                  </div>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>
        </div>
      </div>

      <!-- 展开状态：信息面板 -->
      <transition name="info-slide">
        <div
          v-if="isExpanded"
          ref="infoPanelRef"
          class="mobile-info-panel"
        >
          <div class="peek-handle" @click="isExpanded = false" />
          <div class="mobile-info-scroll">
            <div class="mobile-stamp-row">
              <div class="mobile-stamp-circle" />
              <div class="mobile-stamp-text">
                <div class="mobile-stamp-from">From:</div>
                <div class="mobile-stamp-city">{{ albumDetail?.mainArea }}</div>
                <div class="mobile-stamp-sub">{{ albumDetail?.subArea }}</div>
              </div>
            </div>
            <div class="mobile-info-title">{{ currentPhoto?.title }}</div>
            <div class="mobile-info-desc">{{ currentPhoto?.description }}</div>
          </div>
        </div>
      </transition>
    </div>
  </mobile-modal-wrapper>

  <!-- 桌面端（原有代码不变） -->
  <modal
    v-else
    @close="handleCloseModal"
    :visible="showAlbumModal"
    :loading="loading"
    size="large"
  >
    <div class="album-modal">
      <div class="image-container">
        <album-modal-toolbar
          v-show="!isImageLoading"
          :photo="currentPhoto"
          @full-screen-click="handleFullScreenClick"
        />
        <album-modal-slider
          :album="albumDetail"
          @slideChange="handleSlideChange"
          @image-loading-state="handleImageLoadingState"
        />
      </div>
      <div class="info-container">
        <album-modal-info :photo="currentPhoto" :album="albumDetail" />
      </div>
      <full-screen-viewer @close="handleCloseViewer" :image="fullscreenImage" />
    </div>
  </modal>
</template>
```

- [ ] **Step 3: 新增 `currentSlideIndexMobile` 响应式变量**

`album-modal-slider` 的 `@slideChange` 只返回 photo 对象，不返回 index。修改 `handleSlideChange` 中同时更新 index：

```typescript
const currentSlideIndexMobile = ref(0);

const handleSlideChange = (photo: AlbumRes['photos'][0]) => {
  currentPhoto.value = photo;
  const idx = albumDetail.value?.photos?.findIndex(p => p.id === photo.id);
  if (idx !== undefined && idx >= 0) {
    currentSlideIndexMobile.value = idx;
  }
};

// modal 打开时重置；albumDetail 加载完成后初始化 currentPhoto 为第一张
watchEffect(() => {
  if (currentAlbumItem.value?.id) {
    fetchAlbumDetail(currentAlbumItem.value.id);
    currentSlideIndexMobile.value = 0;
    isExpanded.value = false;
  }
});

// 数据加载完成后初始化 currentPhoto（避免首次打开 peek 栏为空）
watch(albumDetail, (detail) => {
  if (detail?.photos?.length && !currentPhoto.value) {
    currentPhoto.value = detail.photos[0];
  }
});
```

- [ ] **Step 4: 添加移动端样式**

```less
@safe-area-bottom: env(safe-area-inset-bottom, 0px);

.album-modal-mobile {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-photo-area {
  flex-grow: 1;
  position: relative;
  transition: flex-grow 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  background: #212121;

  &.expanded {
    flex-grow: 0;
    flex-basis: max(200px, 28vh);
    flex-shrink: 0;
  }
}

.mobile-top-bar {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-top-location {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

.mobile-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mobile-progress-bar {
  position: absolute;
  top: 48px;
  left: 14px;
  right: 14px;
  z-index: 10;
  display: flex;
  gap: 4px;
}

.mobile-progress-segment {
  flex: 1;
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.24);
  min-width: 6px;

  &.viewed {
    background: rgba(255, 255, 255, 1);
  }

  &.current {
    background: rgba(255, 255, 255, 0.65);
  }
}

.mobile-exif-popover-wrapper {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
}

.mobile-exif-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mobile-exif-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: min(320px, 90vw);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.mobile-peek-strip {
  flex-shrink: 0;
  height: calc(60px + @safe-area-bottom);
  padding-bottom: @safe-area-bottom;
  background: rgba(245, 243, 240, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 14px 14px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
  box-sizing: border-box;
}

.peek-handle {
  width: 28px;
  height: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.12);
  margin-bottom: 8px;
  flex-shrink: 0;
  cursor: pointer;
}

.peek-content {
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.peek-title {
  font-size: 14px;
  font-weight: bold;
  color: #121315;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 12px;
}

.peek-exif-wrapper {
  position: relative;
  flex-shrink: 0;
}

.peek-exif-btn {
  background: rgba(0, 0, 0, 0.07);
  color: #121315;
}

.mobile-info-panel {
  flex-shrink: 0;
  flex-grow: 1;
  background: rgba(245, 243, 240, 0.98);
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  align-items: center;
}

.mobile-info-scroll {
  width: 100%;
  overflow-y: auto;
  padding: 16px 24px calc(24px + @safe-area-bottom);
  box-sizing: border-box;
}

.mobile-stamp-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.mobile-stamp-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #c0392b;
  flex-shrink: 0;
}

.mobile-stamp-from {
  font-size: 12px;
  color: #618a54;
  font-weight: bold;
}

.mobile-stamp-city {
  font-size: 14px;
  font-weight: bold;
  color: #2b4e20;
  margin-top: 2px;
}

.mobile-stamp-sub {
  font-size: 13px;
  font-weight: bold;
  color: #2b4e20;
  margin-top: 2px;
}

.mobile-info-title {
  font-size: 16px;
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-thickness: 1px;
  margin-bottom: 16px;
  color: #121315;
}

.mobile-info-desc {
  font-size: 13px;
  line-height: 2.2;
  text-decoration: underline #999;
  text-underline-offset: 6px;
  color: #333;
}

.info-slide-enter-active,
.info-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.info-slide-enter-from,
.info-slide-leave-to {
  transform: translateY(100%);
}
```

- [ ] **Step 5: 移动端完整验证**

DevTools iPhone 视口下：
1. 点击首页画廊中的图片，Modal 从底部滑入
2. 顶部栏显示地点和时间，右上角有关闭按钮
3. 进度条显示正确段数
4. 底部 peek 栏显示照片标题，右侧 ⓘ 按钮点击弹出 EXIF 气泡
5. 向上滑动 peek 栏（或点击非按钮区域），信息面板从下滑入
6. 展开状态下照片区域压缩至 `max(200px, 28vh)`，信息面板显示邮戳、标题、描述
7. 向下滑动把手，信息面板收起，回到沉浸视图
8. 左右滑动切换照片，进度条状态更新
9. 点击关闭按钮，Modal 向下滑出
10. 切回桌面端视口（>768px），确认桌面端 Modal 功能完全不受影响

- [ ] **Step 6: Commit**

```bash
git add src/components/album-modal.vue
git commit -m "feat: mobile album modal with immersive and expanded views"
```

---

## Task 13: 整体验证与收尾

- [ ] **Step 1: 桌面端回归测试**

浏览器宽度 > 768px，全流程验证：
- 左侧侧边栏显示正常（Logo、时间轴、年份/月份点击）
- Banner 全高，左右箭头可用，自动轮播
- 瀑布流 margin/column 参数正确
- 点击图片开启桌面端 Modal（侧边信息栏、全屏查看按钮、EXIF 气泡）

- [ ] **Step 2: 移动端全流程测试**

DevTools iPhone 14（390×844，devicePixelRatio 3）视口：
- 无左侧侧边栏
- Banner 高度约 55vw，左上角汉堡按钮 ☰
- 点击汉堡 → 抽屉滑入 → 含 Logo + 时间轴
- 点击月份 → 跳到对应位置 + 抽屉关闭
- Banner 下方 sticky Tab 栏，正确跟随滚动
- 滚动时 Tab 激活项自动居中高亮
- 瀑布流 2 列，4px 间距
- 点击图片 → 移动端 Modal 从底部进入
- 所有交互（滑动切换照片、上滑展开信息、下滑收起、ⓘ 弹出）正常

- [ ] **Step 3: 生产构建验证**

```bash
npm run build 2>&1 | tail -20
```

预期：Build 成功，无 TypeScript 报错，无 ESLint 报错。

- [ ] **Step 4: Final Commit**

如果前面各 Task 已单独 commit，此步仅收尾任何漏提交的文件：
```bash
git status
# 确认只有预期文件，逐一 git add 后提交
```

---

## 参考文档

- 设计规范：`docs/superpowers/specs/2026-03-16-mobile-design.md`
- VueUse `useBreakpoints`：https://vueuse.org/core/useBreakpoints/
- VueUse `useSwipe`：https://vueuse.org/core/useSwipe/
