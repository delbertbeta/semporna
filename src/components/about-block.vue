<template>
  <div class="about-block">
    <div class="logo-box">
      <img class="logo" src="../assets/img/logo.png"/>
      <div class="desc">
        <div class="top-text">All about</div>
        <div class="bottom-text">Delbert &amp; Shyrii</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="about-text pointer">关于这里</div>
  </div>
</template>

<style lang="less" scoped>
.about-block {
  position: absolute;
  box-sizing: border-box;
  width: 520px;
  height: calc(100vh - 24px);
  padding: 48px 62px 48px 48px;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #EDECEA 0%, rgba(237, 236, 234, 0.9) 100%);
  z-index: 1;

  .logo-box {
    display: flex;
    align-items: center;
    .logo {
      width: 140px;
      height: 140px;
      margin-right: 32px;
    }

    .desc {
      font-weight: bold;
      .top-text {
        font-family: 'Quicksand';
        font-size: 54px;
        line-height: 70px;
      }
      .bottom-text {
        font-size: 26px;
        line-height: 34px;
      }
    }
  }

  .line {
    width: 260px;
    border: 1px solid #757C8A;
    margin: 24px 0;
  }

  .about-text {
    font-size: 24px;
    font-weight: 500;
  }

}
</style>