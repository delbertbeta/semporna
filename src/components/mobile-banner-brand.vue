<template>
  <div class="mobile-banner-brand">
    <img
      class="mobile-banner-brand-logo"
      src="../assets/img/logo.png"
      alt="Delbert & Shyrii logo"
    />
    <div class="mobile-banner-brand-text">Delbert &amp; Shyrii</div>
  </div>
</template>

<style lang="less" scoped>
.mobile-banner-brand {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 24;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-top: max(8px, env(safe-area-inset-top));
  padding-bottom: 10px;
  background: rgba(245, 243, 240, 0.82);
  backdrop-filter: blur(14px);
}

.mobile-banner-brand-logo {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
}

.mobile-banner-brand-text {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}
</style>
