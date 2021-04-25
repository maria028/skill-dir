import {getStore, removeStore, setStore} from '@/util/store'
import website from '@/config/website'

const  pay ={
  state:{productInfo:getStore({name: 'productInfo'}) || {},
          wxOrAliInfo:getStore({name:'wxOrAliInfo'}) || {},
          healthyInfo:getStore({name:'healthyInfo'}) || {},
          chargePort:getStore({name:'chargePort'}) || {},
    chooseMoneyInfo:getStore({name:'chooseMoneyInfo'}) || {}
  },
  actions: {
    saveShjProduct({commit},productInfo) {
      return new Promise((resolve) => {
        commit('SET_ShjProduct', productInfo);
        resolve();
      });
    },
    saveWxOrAliInfo({commit},info){
      return new Promise((resolve) => {
        commit('SET_WXORALIINFO', info);
        resolve();
      });
    },
    saveHealthyInfo({commit},info){
      return new Promise((resolve) => {
        commit('SET_HEALTHY_INFO', info);
        resolve();
      });
    },
    chooseChargePort({commit},info){
      return new Promise((resolve) => {
        commit('SET_CHARGE_PORT', info);
        resolve();
      });
    },
    saveChooseMoney({commit},info){
      return new Promise((resolve) => {
        commit('SET_CHOOSE_MONEY', info);
        resolve();
      });
    },
    clearPayInfo({commit}){
      return new Promise((resolve) => {
        commit('SET_HEALTHY_INFO', {});
        commit('SET_WXORALIINFO', {});
        commit('SET_ShjProduct', {});
        commit('SET_CHARGE_PORT', {});
        resolve();
      });
    },clearChargePort({commit}){
      return new Promise((resolve) => {
        commit('SET_CHARGE_PORT', {});
        commit('SET_CHOOSE_MONEY', {});
        resolve();
      });
    }
  },
  mutations: {
    SET_ShjProduct(state,productInfo) {
      state.productInfo = productInfo;
      setStore({name: 'productInfo', content: state.productInfo})
    },
    SET_WXORALIINFO(state,info){
      state.wxOrAliInfo = info;
      setStore({name: 'wxOrAliInfo', content: state.wxOrAliInfo})
    },SET_HEALTHY_INFO(state,info){
      state.healthyInfo = info;
      setStore({name: 'healthyInfo', content: state.healthyInfo})
    },SET_CHARGE_PORT(state,info){
      state.chargePort = info;
      setStore({name: 'chargePort', content: state.chargePort})
    },SET_CHOOSE_MONEY(state,info){
      state.chooseMoneyInfo = info;
      setStore({name: 'chooseMoneyInfo', content: state.chooseMoneyInfo})
    }
  }

}
export default pay
