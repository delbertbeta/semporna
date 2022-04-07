import AMapJS from 'amap-js';
const MAP_KEY = 'db2d08f8573060be706f348bb38dc069';

const loader = new AMapJS.AMapLoader({
  "key": MAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
  "version": "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  "plugins": ['AMap.OverView'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  security: { serviceHost: 'http://10.89.28.116:8080/_AMapService' }
});

loader.load();
const { AMap } = loader;

export default AMap;