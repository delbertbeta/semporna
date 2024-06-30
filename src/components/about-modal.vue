<template>
  <modal @close="handleCloseModal" :visible="showAboutModal" size="middle">
    <div class="about-modal">
      <div class="title">关于这里</div>
      <div class="desc">透明的培养仓中，她浸没在冰冷的人工羊水里，包覆于洁白的卵中。
        容器摇晃，她漂浮着，凭借本能摸索到冰冷柔软的边缘。她紧紧贴着仓壁，蜷缩在角落，仿佛那样能使身体感受到更多温暖。

        她听见巨物坠落，金属碰撞，急匆匆的脚步声不时响起，培养仓开始摇晃…
        「战士们，该醒了……」
        「为了，女皇陛下……」
        一双机械手将她抱起，刺眼的光撕裂了世界。她忘记了哭泣。
        「为自己的诞生感到荣耀……」
        「为了，女皇陛下……」
        她睁开眼，却看不见说话的人。
        她起身，穿过厚厚的帷幕，朝着宫殿深处前进。
        「接受你们的荣耀，你们的命运……」
        「为了，女皇陛下……」
        整齐的脚步声回荡在空旷的宫殿中。

        她路过荒寂的巨大花园，途径庞大的虫类尸骸，穿过一个又一个孵育装置…最后，她走进了辉煌的议事厅，一个面目模糊的女人坐在王座上，疲惫地垂着手。

        「别抬头。」
        有人走到她身边，轻轻地说。那人身上有一个号牌，AR-26702——那是什么？
        她看向自己，AR-26710。
        「过来…我的孩子……」
        一个幽远的声音自她脑海深处传来，一股莫名的狂热淹没了她的心绪。
        她走到女皇跟前，跪下亲吻女皇的指尖。

        女皇的手冷得如同坚冰，让她在狂热之中短暂感到一丝茫然。
        「尽情燃烧吧，为了格拉默的未来……」
        「为了，女皇陛下……」</div>
      <div class="signature">Semporna Powered by delbertbeta & shyrii</div>
      <div class="footer">已阅</div>
    </div>
  </modal>
</template>

<script setup lang="ts">
import { useAppStore } from '../store';
import { storeToRefs } from 'pinia';
import Modal from './modal.vue';

const store = useAppStore();
const { closeAboutModal } = store;
const { showAboutModal } = storeToRefs(store);

const handleCloseModal = () => {
  closeAboutModal();
}
</script>

<style scoped lang="less">
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
</style>