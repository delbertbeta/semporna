<template>
  <div class="map-container">
    <div class="map-title flex-vertical-center">深圳来福士广场</div>
    <div id="map-block" class="map-block"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AMapJS from 'amap-js';
const MAP_KEY = 'db2d08f8573060be706f348bb38dc069';

export default defineComponent({
  name: "map-block",
  mounted() {
    this.createMap();
  },
  methods: {
    async createMap() {
      const loader = new AMapJS.AMapLoader({
        "key": MAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": ['AMap.OverView'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        security: { serviceHost: 'http://10.89.28.116:8080/_AMapService' }
      });
      await loader.load();
      const { AMap } = loader;
      const map = new AMap.Map('map-block', {
        zoom: 15,
        center: new AMap.LngLat(113.925738,22.511778)
      });

      // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
      map.addControl(new AMap.OverView({
        isOpen: true,
        width: '70',
        height: '70',
      }));

      // 创建一个 Marker 实例：
      const marker = new AMap.Marker({
        position: new AMap.LngLat(113.925738,22.511778),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '北京'
      });

      // 将创建的点标记添加到已有的地图实例：
      map.add(marker);
    }
  }
});
</script>

<style lang="less" scoped>
.map-container {
  position: relative;
  width: 300px;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;

  .map-title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgba(97, 138, 84, 0.2);
    z-index: 1;
    padding-left: 12px;
    font-size: 14px;
  }

  .map-block {
    width: 100%;
    height: 100%;
  }
}
</style>