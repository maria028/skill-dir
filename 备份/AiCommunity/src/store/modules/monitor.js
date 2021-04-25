import {getMonitor} from "../../api/system/monitor";
import {getStore, setStore} from "../../util/store";

const monitor = {
  state: {
    monitorInfo: getStore({name: 'monitorInfo'}) || {},
    MapInfo: getStore({name: 'MapInfo'}) || '',
    pointDataInfo: getStore({name: 'pointDataInfo'}) || {}
  },
  actions: {
    getMonitor({commit}, deviceNo) {
      return new Promise((resolve) => {
        getMonitor(deviceNo).then(res => {
          const data = res.data.data;
          commit('SET_MONITOR', data);
          resolve();
        })
      })
    },
    saveMapInfo({commit}, cityName) {
      return new Promise((resolve) => {
        commit('SET_MAP_INFO', cityName);
        resolve();
      })
    },
    savePoint({commit}, pointData) {
      return new Promise((resolve) => {
        commit('SET_POINT_DATA', pointData);
        resolve();
      })
    }
  }, mutations: {
    SET_MONITOR: (state, data) => {
      console.log(data)
      state.monitorInfo = data;
      setStore({name: 'monitorInfo', content: state.monitorInfo})
    },
    SET_MAP_INFO: (state, cityName) => {
      state.MapInfo = cityName;
      setStore({name: 'MapInfo', content: state.MapInfo});
    },
    SET_POINT_DATA: (state, pointDataInfo) => {
      state.pointDataInfo = pointDataInfo;
      setStore({name: 'pointDataInfo', content: state.pointDataInfo});
    }
  }

}
export default monitor
