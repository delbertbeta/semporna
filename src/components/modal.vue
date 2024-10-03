<template>
  <transition
    name="modal"
    type="animation"
    :duration="{ enter: 450, leave: 400 }"
    @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave"
  >
    <div class="modal-container" v-if="visible">
      <div class="modal-mask" @click="$emit('close')"></div>
      <div class="modal-wrapper" :class="{ [`size-${size}`]: true }">
        <div class="card-block">
          <div class="front-box">
            <transition name="fade-in-out">
              <div class="loader-container" v-if="realLoading">
                <div class="loader" />
              </div>
            </transition>
            <slot></slot>
          </div>
          <transition name="rotate" type="animation">
            <div class="back-box" v-if="!realLoading" />
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean;
  size: 'small' | 'large' | 'middle';
  loading?: boolean;
}>();
defineEmits<{
  close: [];
}>();

const entered = ref(false);

const realLoading = computed(() => !entered.value || props.loading);

const handleAfterEnter = () => {
  entered.value = true;
};

const handleAfterLeave = () => {
  entered.value = false;
};
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

    &.size-small {
      height: 50%;
      width: 50%;
    }

    &.size-middle {
      height: 70%;
      width: 70%;
    }

    &.size-large {
      height: 80%;
      width: 80%;
    }

    .card-block {
      position: relative;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.11);
      height: 100%;
      width: 100%;

      .front-box {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.11);
        z-index: 101;
        border-radius: 4px;
        overflow: hidden;
      }

      .back-box {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f2f2;
        transform: rotate(3deg);
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.11);
        border-radius: 4px;
        overflow: hidden;
      }
    }
  }

  .modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(223, 223, 223, 0.6);
    z-index: 2;
    opacity: 1;
    backdrop-filter: blur(32px);
  }
}

.modal-enter-active,
.modal-leave-active {
  .modal-mask {
    transition: opacity 0.3s ease-in-out;
  }
}

.modal-enter-active {
  .card-block {
    animation: bounce-in 0.45s cubic-bezier(0.58, -0.01, 0.24, 1.3) both;
  }
}

.modal-leave-active {
  .card-block {
    animation: bounce-out 0.3s cubic-bezier(0.42, 0, 1, 0.31) both;
  }
}

.modal-enter-from,
.modal-leave-to {
  .modal-mask {
    opacity: 0;
  }
}

.fade-in-out-enter-to,
.fade-in-out-leave-from {
  opacity: 1;
}

.fade-in-out-enter-active,
.fade-in-out-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-in-out-enter-from,
.fade-in-out-leave-to {
  opacity: 0;
}

.rotate-enter-active {
  animation: rotate 0.3s ease-in-out both;
}

.rotate-leave-active {
  animation: rotate 0.3s ease-in-out both reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(60%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(20%);
  }
}

.loader-container {
  width: 100%;
  height: 100%;
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 65px;
  aspect-ratio: 1;
  position: relative;
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  border-radius: 50px;
  box-shadow: 0 0 0 3px inset #000;
  animation: l4 2.5s infinite;
}

.loader:after {
  animation-delay: -1.25s;
}

@keyframes l4 {
  0% {
    inset: 0 35px 35px 0;
  }

  12.5% {
    inset: 0 35px 0 0;
  }

  25% {
    inset: 35px 35px 0 0;
  }

  37.5% {
    inset: 35px 0 0 0;
  }

  50% {
    inset: 35px 0 0 35px;
  }

  62.5% {
    inset: 0 0 0 35px;
  }

  75% {
    inset: 0 0 35px 35px;
  }

  87.5% {
    inset: 0 0 35px 0;
  }

  100% {
    inset: 0 35px 35px 0;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(3deg);
  }
}
</style>
