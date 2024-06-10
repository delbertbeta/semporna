<template>
  <div class="image-box fade-in">
    <img class="image" :src="item.url" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ item: { url: string } }>();

</script>

<style lang="less">
.image-box {
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  padding: 20px 20px 56px 20px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 64px rgba(0, 0, 0, 0.06);
  background-color: rgba(241, 241, 241);
  transform: translateY(0);
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 6px 10px 64px rgba(0, 0, 0, 0.14);
    transform: translateY(-8px);
  }
}

.image {
  display: block;
  height: auto;
  width: 100%;
  max-height: 600px;
  object-fit: cover;
}
</style>
