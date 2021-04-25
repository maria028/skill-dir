import {getStore, setStore} from '@/util/store'
import {getResidential} from "../../api/mobile/mobile";

const mobile = {
  state: {
    ResidentialInfo: getStore({name: 'ResidentialInfo'}) || [],
    ReleaseRecordDesc: getStore({name: 'ReleaseRecordDesc'}) || {},
    RegistrationInfo: getStore({name: 'RegistrationInfo'}) || {},
    ChooseUnityInfo: getStore({name: 'ChooseUnityInfo'}) || {},
    queryParam: getStore({name: 'queryParam'}) || null,
  },
  actions: {
    getResidential({commit}) {
      return new Promise((resolve) => {
        getResidential().then(res => {
          const data = res.data.data;
          commit('SET_RESIDENTIAL', data);
          resolve();
        })
      })
    },
    saveReleaseRecordDesc({commit}, desc) {
      return new Promise((resolve) => {
        commit('SET_ReleaseRecordDesc', desc);
        resolve();
      })
    },
    saveRegistration({commit}, info) {//保存注册信息
      return new Promise((resolve) => {
        commit('SET_saveRegistration', info);
        resolve();
      });
    },
    saveChooseUnity({commit}, info) {//保存选择的单元信息
      return new Promise((resolve) => {
        commit('SET_ChooseUnity', info);
        resolve();
      });
    }, emptyRegistration({commit}) {
      return new Promise((resolve) => {
        commit('SET_saveRegistration', {});
        commit('SET_ChooseUnity', {});
        resolve();
      });
    }

  },
  mutations: {
    SET_RESIDENTIAL: (state, ResidentialInfo) => {
      state.ResidentialInfo = ResidentialInfo;
      setStore({name: 'ResidentialInfo', content: state.ResidentialInfo})
    }, SET_ReleaseRecordDesc: (state, ReleaseRecordDesc) => {
      state.ReleaseRecordDesc = ReleaseRecordDesc;
      setStore({name: 'ReleaseRecordDesc', content: state.ReleaseRecordDesc})
    }, SET_saveRegistration: (state, RegistrationInfo) => {
      state.RegistrationInfo = RegistrationInfo;
      setStore({name: 'RegistrationInfo', content: state.RegistrationInfo})
    }, SET_ChooseUnity: (state, Info) => {
      state.ChooseUnityInfo = Info;
      setStore({name: 'ChooseUnityInfo', content: state.ChooseUnityInfo})
    },
    SET_RECORD_QUERY_PARAM(state, param) {
      state.queryParam = param;
      setStore({name: 'queryParam', content: state.queryParam})
    }
  }
};
export default mobile
