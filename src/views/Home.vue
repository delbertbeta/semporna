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
  setup() {

  }
})
</script>

<style lang="less" scoped>
.home-container {
  padding: 100px 0 88px 254px;
  position: relative;
  background-image: url('../assets/img/bg-pattern.png');
  background-repeat: repeat;
}
</style>