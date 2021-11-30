<template>
  <i :class="['svg-icon', hoverFill ? 'hover' : '']" :style="iconStyles">
    <svg :style="{ fill: fill }" :viewBox="iconViewBox">
      <use :xlink:href="`#${iconId}`"></use>
    </svg>
  </i>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'svg-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 16,
    },
    height: {
      type: Number,
      default: 16,
    },
    fill: {
      type: String,
      default: '',
    },
    hoverFill: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconStyles() {
      return {
        fill: this.hoverFill || null,
        width: `${this.width}px` || null,
        height: `${this.height}px` || null,
      };
    },
    icon() {
      return require(`../../assets/img/svg-icons/${this.name}.svg`).default;
    },
    iconId() {
      return this.icon.id;
    },
    iconViewBox() {
      return this.icon.viewBox;
    }

  }
})
</script>

<style lang="less" scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;

  > svg {
    transition: fill ease 0.1s;
    vertical-align: top;
  }

  &.hover:hover > svg {
    fill: inherit !important;
  }
}
</style>
