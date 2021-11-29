<template>
  <div class="home-container">
    <about-block></about-block>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import aboutBlock from '../components/about-block.vue';
// import bgPattern from './assets/img/bg-pattern.png';

export default defineComponent({
  name: 'home',
  components: {
    aboutBlock
  },
  setup() {

  }
})
</script>

<style lang="less" scoped>
.home-container {
  position: relative;
  min-height: 100vh;
  background-image: url('../assets/img/bg-pattern.png');
  background-repeat: repeat;
}
</style>