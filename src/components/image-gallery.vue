<template>
  <div class="scroll-wrapper">
    <full-screen-banner />
    <div class="image-gallery">
      <div :id="`image-${index}`" v-for="(item, index) in images" :key="item.url" class="image-box fade-in"
        :style="{ transform: `rotate(${Math.random() * 6 - 3}deg)` }" @click="handleImage(item)">
        <img class="image" :src="item.url" />
      </div>

      <modal :isShow="showImageModal" @close="showImageModal = false">
        <div class="image-preview-modal">
          <div class="left-block">
            <img class="image fade-in" :src="currentImage.url" />
            <div class="operation-bar">
              <div class="operation-box operation-box-mr">
                <svg-icon name="full-screen" :width="16" :height="16"></svg-icon>
              </div>
              <info-popover class="operation-box-mr"></info-popover>
              <div class="operation-box">
                <svg-icon name="unlike" :width="16" :height="16"></svg-icon>
              </div>
            </div>
          </div>
          <div class="right-block"></div>
        </div>
      </modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { images } from '../mockData/testData';
import modal from './modal.vue';
import infoPopover from './info-popover.vue';
import FullScreenBanner from './full-screen-banner.vue';

export default defineComponent({
  name: 'image-gallery',
  components: {
    modal,
    infoPopover,
    FullScreenBanner,
  },
  data() {
    return {
      images,
      imageBoxWidth: 0,
      showImageModal: false,
      currentImage: {},
    }
  },
  mounted() {
    if (this.images.length > 0) {
      const imageBoxHeight: any = document.getElementById('image-0')?.clientHeight;
      this.imageBoxWidth = 0.9 * imageBoxHeight;
    }
  },
  methods: {
    handleImage(item: Object) {
      this.showImageModal = true;
      this.currentImage = item;
    }
  }
})
</script>

<style lang="less">
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.image-gallery {
  box-sizing: border-box;
  height: 100%;
  padding: 80px 80px 80px 440px;
  display: grid;
  grid-auto-columns: auto;
  grid-template-rows: 1fr 1fr;
  grid-auto-flow: column;
  grid-row-gap: 8%;
  grid-column-gap: 5vw;

  .image-box {
    cursor: pointer;
    position: relative;
    aspect-ratio: 350 / 380;
    height: 100%;
    background-color: #F9F9F9;
    border-radius: 4px;
    box-sizing: border-box;
  }
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  padding: 24px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  object-fit: cover;
}

.image-preview-modal {
  .left-block {
    position: relative;
    display: inline-block;
    width: 67%;
    height: 100%;

    .operation-bar {
      position: absolute;
      top: 25px;
      right: 25px;
      display: flex;

      .operation-box {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.55);
        border-radius: 6px;
        filter: drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.55));
        cursor: pointer;
      }

      .operation-box:hover {
        background-color: rgba(255, 255, 255, 0.75);
      }

      .operation-box-mr {
        margin-right: 17px;
      }
    }
  }

  .right-block {
    display: inline-block;
    width: 33%;
    height: 100%;
  }
}

.fade-in {
  animation: fade-in 1s ease-in 0s backwards;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    visibility: hidden;
  }

  100% {
    opacity: 1;
    visibility: visible;
  }
}
</style>