<template>
  <div class="info-popover-container">
    <div class="operation-box">
      <svg-icon name="info" :width="16" :height="16"></svg-icon>
    </div>
    <div class="popover-block fixed-bottom">
      <map-block></map-block>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import mapBlock from './map-block.vue'

export default defineComponent({
  components: {
    mapBlock,
  },
  setup() {
    
  },
})
</script>

<style lang="less" scoped>
.info-popover-container {
  display: inline-block;
  position: relative;

  &:hover {
    .popover-block {
      display: block;
    }
  }

  .popover-block {
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: 332px;
    height: 323px;
    padding: 20px 15px;
    background-color: #F0F0EC;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(16px);
    border-radius: 8px;

    &.show {
      display: block;
    }

    &::before {
      content: '';
      transform: rotate(45deg);
      display: block;
      position: absolute;
      font-size: 0;
      width: 10px;
      height: 10px;
      background: #F0F0EC;
    }
  }

  .fixed-bottom {
    right: -50px;
    margin-top: 15px;

    &::before {
      right: 60px;
      margin-left: -5px;
      top: -5px;
    }
  }
}
</style>
