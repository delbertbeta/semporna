<template>
  <div class="toolbar-container">
    <div class="button">
      <ArrowsPointingOutIcon class="size-5" />
    </div>
    <Popover v-slot="{ open }">
      <!-- Use the `open` state to conditionally change the direction of the chevron icon. -->
      <PopoverButton class="outline-none">
        <div class="button" :class="{ 'active': open }">
          <ExclamationCircleIcon class=" size-5" />
        </div>
      </PopoverButton>
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
        <PopoverPanel class="absolute left-1/2 z-10 mt-3 -translate-x-3/4 p-4 w-80 rounded-lg bg-white-transparent-1">
          <div class="rounded-lg bg-white w-full overflow-hidden">
            <div class="text-text-main bg-green-transparent-1 h-7 px-3 font-bold w-full leading-7">2021/11/21 13:53
            </div>
            <div class="flex flex-row items-start py-2 px-3">
              <ViewfinderCircleIcon class="size-4 mt-0.5" />
              <div class="flex flex-col font-medium ms-2 text-sm">
                <div>Nikon D3200</div>
                <div>SIGMA 18-125mm F3.8-5.6-DC OS HSM</div>
              </div>
            </div>
            <div class="bg-divider h-px mx-3" />
            <div class="flex font-medium mt-1 mb-2 mx-3 text-sm">
              <div class="photo-params-item after:bg-divider">ƒ 1.8</div>
              <div class="photo-params-item after:bg-divider">26mm</div>
              <div class="photo-params-item after:bg-divider">ISO 3600</div>
              <div class="photo-params-item after:bg-divider">+1 ev</div>
              <div class="photo-params-item after:bg-divider">1/12000s</div>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
    <div class="button">
      <HeartIcon class="size-5" />
      23
    </div>
  </div>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ArrowsPointingOutIcon, ExclamationCircleIcon, HeartIcon, ViewfinderCircleIcon } from '@heroicons/vue/24/outline';
</script>

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
  padding: 6px;
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

.photo-params-item {
  flex-grow: 1;
  text-align: center;
  position: relative;

  &:first-of-type {
    text-align: left;
  }

  &:not(:last-of-type)::after {
    content: '';
    position: absolute;
    height: 70%;
    width: 1px;
    right: 0;
    top: 15%;
    opacity: 0.6;
  }

  &:last-of-type {
    text-align: right;
  }
}
</style>
