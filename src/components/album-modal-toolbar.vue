<template>
  <div class="toolbar-container">
    <div class="button">
      <svg-icon
        name="full-screen"
        class="button-svg"
        :height="16"
        :width="16"
      />
    </div>
    <div class="button">
      <svg-icon name="info" class="button-svg" :height="16" :width="16" />
    </div>
    <div class="button">
      <svg-icon name="like" class="button-svg" :height="16" :width="16" />
      23
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "../assets/less/variant.less";

.toolbar-container {
  position: absolute;
  right: 24px;
  top: 24px;
  display: flex;
  gap: 16px;
}

.button {
  padding: 8px;
  height: 32px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-weight: bold;

  background-color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  border-radius: 6px;
  backdrop-filter: blur(6px);
  color: @ui-color-divider;

  &:hover,
  &.active {
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>
