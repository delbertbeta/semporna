<template>
  <transition name="modal-fade" appear>
    <div class="modal-container" v-if="isShow">
      <div class="modal-mask" @click="$emit('close')"></div>
      <div class="modal-wrapper">
        <div class="card-box" :style="{ width: `${width}px`, height: `${height}px`}">
          <div class="font-box">
            <slot></slot>
          </div>
          <div class="back-box"></div>
        </div>
      </div>
    </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 1264,
    },
    height: {
      type: Number,
      default: 700,
    }
  },
  methods: {
    // handleMask() {
    //   this.$emit('close');
    // }
  }
})
</script>

<style lang="less" scoped>
.modal-container {
  min-width: 1500px;
  .modal-wrapper {
    position: fixed;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;

    .card-box {
      position: relative;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.11);

      .font-box {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.11);
        z-index: 101;
      }

      .back-box {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.11);
        transform: rotate(3deg);
      }
    }
  }

  .modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(223, 223, 223, 0.85);
    z-index: 2;
  }
}
@keyframes modal-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>