<template>
  <div class="image-gallery">
    <div 
      :id="`image-${index}`"
      v-for="(item, index) in images"
      :key="item.url"
      class="image-box fade-in"
      :style="{ width: imageBoxWidth, transform: `rotate(${Math.random()*(7)-3}deg)` }"
      @click="handleImage(item)"
    >
      <img class="image" :src="item.url" />
    </div>

    <modal :isShow="isShowModal" @close="isShowModal = false">
      <div class="image-preview-modal">
        <div class="left-block">
          <img class="image fade-in" :src="currentImage.url" />
        </div>
        <div class="right-block"></div>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { images } from '../mockData/testData';
import modal from './modal.vue';

export default defineComponent({
  name: 'image-gallery',
  components: {
    modal
  },
  data() {
    return {
      imageBoxWidth: 0,
      images,
      isShowModal: false,
      currentImage: {},
    }
  },
  mounted() {
    const imageBoxHeight:any = document.getElementById('image-0')?.clientHeight;
    this.imageBoxWidth = 0.9 * imageBoxHeight;
  },
  methods: {
    handleImage(item: Object) {
      this.isShowModal = true;
      this.currentImage = item;
    }
  }
})
</script>

<style lang="less" scoped>
.image-gallery {
  box-sizing: border-box;
  padding: 50px 0 50px 300px;
  height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  overflow-x: auto;

  .image-box {
    display: inline-block;
    height: calc(50% - 30px);
    background-color: #F9F9F9;
    border-radius: 4px;
    padding: 30px;
    box-sizing: border-box;
    margin-bottom: 30px;
    margin-right: 70px;
    transform: rotate(3deg);
  }
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
// 隐藏横向滚动条
.image-gallery::-webkit-scrollbar {
  width: 0 !important
}

.image-preview-modal {
  .left-block {
    display: inline-block;
    width: 67%;
    height: 100%;
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