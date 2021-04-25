import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import mobile from "./modules/mobile";
import monitor from "./modules/monitor";
import pay from "./modules/pay";
import getters from './getters'


Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags,
    mobile,
    monitor,
    pay
  },
  getters,
})

export default store
