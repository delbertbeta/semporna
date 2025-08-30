<template>
  <transition name="fade-in-out">
    <div class="loader-container" :data-theme="theme" v-if="loading">
      <div class="loader" />
    </div>
  </transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean;
    theme?: 'white' | 'black';
  }>(),
  {
    theme: 'white',
  }
);
</script>

<style lang="less" scoped>
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

.loader-container {
  --bg-color: #fff;
  --loader-shadow-color: #000;

  &[data-theme='black'] {
    --bg-color: #212121;
    --loader-shadow-color: #ccc;
  }

  width: 100%;
  height: 100%;
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--bg-color);

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
  box-shadow: 0 0 0 3px inset var(--loader-shadow-color);
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
</style>
