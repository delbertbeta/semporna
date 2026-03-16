# Semporna 移动端设计规范

**日期**: 2026-03-16
**状态**: 已确认，待实现

---

## 概述

Semporna 是一个 Vue 3 照片画廊应用。本文档描述其移动端适配方案，目标是在小屏设备上保留桌面端的核心体验（全屏 Banner、时间轴导航、瀑布流画廊、相册 Modal），同时针对触控操作和窄屏进行重新设计。

断点：`≤ 768px` 启用移动端布局，`> 768px` 保持桌面端布局不变。

---

## 一、首页布局

### 1.1 滚动容器与整体结构变化

**桌面端**：`.scroll-wrapper` 高度为 `100%`，`overflow-y: auto`；`full-screen-banner` 高度也为 `100%`，占满整个视口。

**移动端**：`.scroll-wrapper` 高度改为 `auto`（不再撑满视口），转而成为正常文档流容器，`overflow-y: unset`（交由 `body` 或更外层容器滚动）。Banner 给定固定高度而非 `100%`，以下内容正常向下堆叠。具体结构变化：

```
.scroll-wrapper（移动端，layout: block / flow）
  ├── full-screen-banner（高度 55vw，约 214px on 390px 屏）
  ├── mobile-month-tabs（新组件，sticky top:0，高度 36px）
  └── image-list（瀑布流，正常流）
```

### 1.2 全屏 Banner（顶部）

- 高度：`55vw`，宽度 `100%`
- 汉堡按钮（☰）在 Banner 左上角：`28×28px`，`rgba(0,0,0,0.45)` 半透明背景，`backdrop-filter: blur(8px)`，`border-radius: 6px`
- 右下角保留自动播放进度点（小圆点/胶囊）
- 底部左侧显示当前相册日期（`YYYY/MM` 格式）
- 左右箭头按钮**在移动端隐藏**，改为触控滑动；需将 Swiper 的 `:simulate-touch="false"` 改为 `:simulate-touch="true"`（或移动端时动态设为 true）

### 1.3 粘性月份 Tab 栏（新组件：`mobile-month-tabs.vue`）

**这是一个新组件**，不修改现有 `timeline-block.vue`。

- DOM 位置：在 `image-gallery.vue` 中，位于 `<full-screen-banner />` 和 `<image-list />` 之间（仅在移动端渲染）
- 数据来源：读取同一 Pinia store（`useAlbumStore`）中的 `activeYear`、`activeMonth`、`albums`，与 `timeline-block.vue` 共享同一数据源，无需额外状态
- 样式：`position: sticky; top: 0; z-index: 10`；`background: rgba(245,243,240,0.92)`；`backdrop-filter: blur(16px)`；底部 `1px solid rgba(0,0,0,0.06)`；高度 `36px`
- 月份横向排列：`display: flex; overflow-x: auto; scroll-snap-type: x mandatory`，隐藏滚动条（`scrollbar-width: none`）
- 当前激活月份：深色文字 `#121315` + 底部 `2px solid #121315` 下划线，其余低透明度（`rgba(0,0,0,0.35)`）
- 滚动画廊时激活月份**自动居中**：`scrollIntoView({ inline: 'center', behavior: 'smooth' })`
- 点击月份：调用 `store.setActiveDate(year, month)` 并跳转到对应位置
- 若当年只有一个月，仍正常渲染（无特殊处理）

### 1.4 滚动事件监听与偏移量（移动端修正）

移动端 `.scroll-wrapper` 不再是滚动容器，**滚动事件不会在其上触发**。需要以下两处修改：

**① 事件监听迁移（`image-gallery.vue`）**

- 桌面端：`@scroll="handleScroll"` 挂在 `.scroll-wrapper` 上
- 移动端：改为在 `onMounted` 中监听 `window`（`window.addEventListener('scroll', handleScroll)`），并在 `onUnmounted` 中移除
- `handleScroll` 内部 `document.querySelector('.scroll-wrapper')` 的 `scrollTop` 读取，移动端改为 `window.scrollY`

**② scroll-to-image 目标修正（`timeline-block.vue`）**

- 桌面端：`scrollWrapper.scrollTo({ top: target.offsetTop - 80 })`
- 移动端：改为 `window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - scrollOffset, behavior: 'smooth' })`
- 注意：不能用 `target.offsetTop`，因为 `offsetTop` 相对于最近定位祖先而非文档根节点，masonry 列内的元素会给出错误值；用 `getBoundingClientRect().top + window.scrollY` 得到相对文档的绝对 Y 坐标

**③ active image 检测阈值修正（`image-gallery.vue`）**

- 桌面端：`rect.top > 120`
- 移动端：改为 `rect.top > scrollOffset`，其中 `scrollOffset` = Banner 高度（`55vw`）+ Tab 栏高度（`36px`），通过 `ref` 动态获取

**实现建议**：将 `scrollOffset` 封装为 composable（`useScrollOffset.ts`），`image-gallery.vue` 和 `timeline-block.vue` 各自调用同一 composable，避免 provide/inject 在 `timeline-block.vue` 处于抽屉上下文时 inject 失败（抽屉中 `image-gallery.vue` 不是祖先节点）。composable 内部使用 `useBreakpoints` 判断移动端，返回计算后的偏移值。

### 1.5 瀑布流画廊（移动端参数）

- `column-width: 160px`（自然产生 2 列，MasonryWall 按此宽度分配，无需强制 `max-columns`）
- `max-columns: 2`（保险起见仍设置）
- `gap: 4px`
- 容器 `padding: 6px`
- `margin-left: 0`（桌面端的 `520px` 偏移仅在桌面端生效）
- 图片圆角：`4px`

---

## 二、左侧抽屉导航

### 2.1 组件方案

`about-block.vue` 当前是桌面端侧边栏的硬编码实现（`position: absolute; width: 360px`），**不直接复用**。

采用方案：**提取内容组件 + 各端独立包装器**

1. 将 `about-block.vue` 中的内容（Logo + 标题 + `<timeline-block />`）提取到新的 `sidebar-content.vue` 组件（无任何定位/尺寸样式）
2. 桌面端：`about-block.vue` 保留现有定位样式，内部改为使用 `<sidebar-content />`
3. 移动端：新建 `mobile-drawer.vue`，通过 `v-if` 在移动端渲染，内部使用 `<sidebar-content />`

此方案对桌面端**无视觉影响**（`about-block.vue` 外壳不变），仅做内部重构。

`about-block.vue` 现有的 `isAnyModalOpen` / `.no-blur` 逻辑（打开 Modal 时关闭 backdrop-filter）保留在 `about-block.vue` 的外壳中，不迁移到 `sidebar-content.vue`。`mobile-drawer.vue` 同样需要实现相同逻辑：当 `isAnyModalOpen` 为 true 时，移除抽屉的 `backdrop-filter: blur(32px)`，防止性能问题。

### 2.2 抽屉内容

- `<sidebar-content />` 包含：Logo 图片（移动端缩小为 `36×36px`，圆形）、"All about" 标题、"Delbert & Shyrii" 副标题、`<timeline-block />`
- Logo 尺寸：移动端 `36×36px`（与桌面端 `80×80px` 有意区分，适应窄空间）
- `<timeline-block />` 功能不变，仍处理年月导航和滚动定位

### 2.3 抽屉样式与交互

- 宽度：`min(80vw, 300px)`
- 背景：`linear-gradient(90deg, #edecea 0%, rgba(237,236,234,0.95) 100%)`，`backdrop-filter: blur(32px)`
- 打开动画：`transform: translateX(-100%)` → `translateX(0)`，`transition: transform 0.3s ease`
- 触发方式：点击 Banner 左上角汉堡按钮
- 关闭方式：
  1. 点击右侧遮罩（`rgba(0,0,0,0.28)`）
  2. 从抽屉内向左滑动关闭：通过 `@vueuse/core` 的 `useSwipe` 实现；在 `onSwipeEnd` 回调中判断 `direction === SwipeDirection.LEFT && Math.abs(lengthX) > 40`（`lengthX` 为 VueUse 暴露的水平滑动距离，单位 px）；抽屉内时间轴的纵向滚动通过 `threshold` 设置最小识别距离（`threshold: 10`）并在 `SwipeDirection.LEFT` 时才触发关闭，垂直方向（UP/DOWN）不触发
- 点击月份后：跳转位置 + 关闭抽屉

---

## 三、相册 Modal（Story 风格）

### 3.1 组件方案

现有 `modal.vue` 包含 `min-width: 1500px` 和居中弹入动画，**不适用于移动端**。

采用方案：在 `album-modal.vue` 中通过断点判断渲染不同包装层：
- 桌面端（`> 768px`）：继续使用现有 `<modal>` 包装器
- 移动端（`≤ 768px`）：使用新的 `mobile-modal-wrapper.vue`（全屏，从底部 slide-up 弹出，`position: fixed; inset: 0`）

`album-modal.vue` 的条件渲染结构（template 层）：

```vue
<mobile-modal-wrapper v-if="isMobile" :visible="showAlbumModal" :loading="loading" @close="handleCloseModal">
  <div class="album-modal mobile">
    <!-- 移动端：沉浸/展开视图，无 full-screen-viewer -->
  </div>
</mobile-modal-wrapper>
<modal v-else :visible="showAlbumModal" :loading="loading" size="large" @close="handleCloseModal">
  <div class="album-modal">
    <!-- 桌面端现有内容，含 full-screen-viewer，保持不变 -->
  </div>
</modal>
```

`<full-screen-viewer>` 仅在桌面端 `<modal>` 分支内渲染，移动端不包含。

**`mobile-modal-wrapper.vue` props 接口**：
- `visible: boolean` — 控制显隐，配合 `v-if`
- `loading: boolean` — 加载中状态，显示 loading placeholder（与 `modal.vue` 中的 `loading` prop 行为一致）
- emit `close` — 关闭事件

enter/leave 动画：`translateY(100%)` → `translateY(0)`（slide-up），`transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)`。

**`album-modal-slider.vue` 的 `object-fit` 处理**：

桌面端当前使用 `object-fit: contain`（黑色背景，图片保持比例不裁切）。移动端沉浸视图需要 `object-fit: cover`（全屏填充）。

处理方式：在 `album-modal-slider.vue` 中通过 prop `cover: boolean`（默认 `false`）控制 `object-fit`，移动端时由 `album-modal.vue` 传入 `:cover="isMobile"`。这是对 `album-modal-slider.vue` 唯一的修改，内部逻辑不变。

### 3.2 沉浸视图（默认状态）

- **照片 Swiper**：`width: 100%; height: 100%; object-fit: cover`（`album-modal-slider.vue` 适配全屏）
- **左右滑动**切换照片（`swiper` 现有实现，`simulate-touch` 改为 `true`）
- **顶部栏**（`position: absolute; top: 14px; left: 14px; right: 14px`）：
  - 左侧：`地点 · YYYY/MM`（11px，白色，`letterSpacing: 0.5px`）
  - 右侧：关闭按钮（圆形 `28×28px`，`rgba(255,255,255,0.15)` 背景）
- **进度条**（顶部栏下方 `top: 48px`，`left: 14px; right: 14px`）：
  - N 段均等横线，每段间距 `4px`，高度 `2px`，`border-radius: 1px`
  - 已看：`#FFFFFF`；当前：`rgba(255,255,255,0.65)`；未看：`rgba(255,255,255,0.24)`
  - 段数 = 相册照片总数；若照片超过 20 张，段宽最小 `6px`（防止过窄）
- **底部 peek 栏**（`position: absolute; bottom: 0`，高度 `60px + safe-area-inset-bottom`）：
  - `border-radius: 14px 14px 0 0`；背景 `rgba(245,243,240,0.95)`；`backdrop-filter: blur(16px)`
  - 顶部居中拖动把手（`28×3px`，`rgba(0,0,0,0.12)`）
  - 左侧：`地点名 / 照片标题`（溢出截断，`text-overflow: ellipsis`）
  - 右侧：ⓘ 按钮（`28×28px`，`border-radius: 6px`，`rgba(0,0,0,0.07)` 背景）
  - iOS 安全区：`padding-bottom: env(safe-area-inset-bottom)` 追加在 peek 栏底部

### 3.3 展开视图（上滑后）

触发方式：向上滑动 peek 栏，或点击 peek 栏区域（非按钮部分）。

- 照片区域高度压缩至 `max(200px, 28vh)`，剩余空间由信息面板占据
- 信息面板从底部平滑上滑，`transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)`
- 信息面板顶部保留 peek 栏的拖动把手（下滑收起）

**信息面板内容**（参考桌面端 `album-modal-info.vue`，内容一致，布局重排）：
- 邮戳区域（`stampRow`）：圆形邮戳图标（`44×44px`，红色 `#C0392B` 边框）+ "From:" + 城市 + 地区
- 照片标题（16px，加粗，带 `text-decoration: underline`，`underline-offset: 6px`）
- 照片描述（13px，`line-height: 2.2`，带 `text-decoration: underline` 装饰，可纵向滚动）

**ⓘ 按钮在展开视图中的位置**：照片区域右上角（`position: absolute; top: 14px; right: 14px`，`28×28px`，`rgba(255,255,255,0.15)` 背景），功能与 peek 栏中的 ⓘ 完全相同（弹出 EXIF 气泡）。展开状态下 peek 栏不再显示，ⓘ 由照片区悬浮按钮承担。

### 3.4 EXIF 气泡

- 点击 ⓘ 按钮弹出 `Popover`（复用 `album-modal-toolbar.vue` 中现有实现）
- 气泡内容：拍摄时间、相机型号、镜头、ƒ 值、焦距、ISO、曝光时间、EV
- 气泡位置：从 ⓘ 按钮向上弹出（`translate-y` 动画），宽度 `min(320px, 90vw)`
- **无全屏查看按钮**：`ArrowsPointingOutIcon` 和 `full-screen-viewer.vue` 在移动端不渲染

---

## 四、响应式断点策略

- `≤ 768px`：移动端布局
- `> 768px`：桌面端布局不变

实现方式：
- **CSS 样式差异**（Banner 高度、margin、padding、圆角、font-size 等）优先用 media query 控制
- **结构差异**（抽屉 vs 侧边栏、移动 modal wrapper vs desktop modal）用 `useBreakpoints`（VueUse）+ `v-if` 条件渲染
- `isMobile` 状态通过 `provide/inject` 或直接在各组件内 `useBreakpoints()` 获取，不通过 Pinia 传递

---

## 五、不做的事（范围外）

- 不修改桌面端任何视觉输出（`about-block.vue` 外壳不变，桌面端 `modal.vue` 不变）
- 不修改 `about-modal.vue`（该组件已在 commit `45f9489` 中移除相关功能，移动端不涉及）
- 不添加地图组件的移动端版本（`map-block.vue` 暂不涉及）
- 不实现 PWA / 离线缓存
- 移动端不启用全屏查看器（`full-screen-viewer.vue`）
