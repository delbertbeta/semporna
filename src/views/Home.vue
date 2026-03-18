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