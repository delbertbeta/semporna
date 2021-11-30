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
    <div class="about-text pointer" @click="showAboutModal = true">
      关于这里
      <svg-icon name="link" :width="18" :height="18" style="margin-left: 12px"></svg-icon>
    </div>

    <modal :isShow="showAboutModal" @close="showAboutModal = false">
      <div class="about-modal">
        <div class="title">关于这里</div>
        <div class="desc">{{ desc }}</div>
        <div class="signature">Inspired by Petar Zeman</div>
        <div class="footer pointer" @click="showAboutModal = false">已阅</div>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import modal from './modal.vue';

export default defineComponent({
  components: {
    modal,
  },
  data() {
    return {
      showAboutModal: false,
      desc: '滚滚长江东逝水，浪花淘尽英雄。是非成败转头空，青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢，古今多少事， 都付笑谈中。滚滚长江东逝水，浪花淘尽英雄。是非成败转头空，青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢，古今多少事， 都付笑谈中。滚滚长江东逝水，浪花淘尽英雄。是非成败转头空，青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢，古今多少事， 都付笑谈中。'
    }
  }
})
</script>


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
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
  }

  .about-modal {
    padding: 0 80px;
    color: #121315;

    .title {
      width: 174px;
      font-weight: 600;
      font-size: 42px;
      line-height: 65px;
      border-bottom: 1px solid #000000;
      margin: 90px 0 30px 0;
    }

    .desc {
      font-size: 18px;
      line-height: 48px;
      text-decoration: underline #999;
      text-underline-offset: 15px;
    }

    .signature {
      font-size: 18px;
      line-height: 48px;
    }

    .footer {
      position: absolute;
      bottom: 85px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: 600;
      font-size: 24px;
      line-height: 34px;
    }
  }
}
</style>