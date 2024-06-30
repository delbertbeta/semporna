<template>
  <div class="home-container">
    <about-block></about-block>
    <image-gallery></image-gallery>
    <about-modal />
    <album-modal />
  </div>
</template>

<script setup lang="ts">
import AboutBlock from '../components/about-block.vue';
import ImageGallery from '../components/image-gallery.vue';
import AboutModal from '../components/about-modal.vue';
import AlbumModal from '../components/album-modal.vue';
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