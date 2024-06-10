<template>
  <div class="home-container">
    <about-block></about-block>
    <image-gallery></image-gallery>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import aboutBlock from '../components/about-block.vue';
import imageGallery from '../components/image-gallery.vue';

export default defineComponent({
  name: 'home',
  components: {
    aboutBlock,
    imageGallery
  },
})
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  position: relative;

  &:before {
    content: ' ';
    display: block;
    position: absolute;
    z-index: -1;
    height: 100%;
    left: 0;
    width: 100%;
    top: 0;
    background-image: url('../assets/img/bg-pattern.png');
    background-repeat: repeat;
    opacity: 0.32;
  }
}
</style>