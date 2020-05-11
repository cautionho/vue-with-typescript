import {GetterTree, MutationTree, ActionTree} from 'vuex'
import {State} from 'vuex-class'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/Sales'

interface State {
  BASE: Interface.SiteAndClassify // 站点分类组件的表单数据
  OTHER: Interface.SiteOther[] // 站点分类特性信息
  TEMPL: Interface.AllTempPublishRelated // 全部模板信息
  FEATURES: Interface.SiteFeatures // 刊登类目特性
}

const state: State = {
  BASE: new Interface.SiteAndClassify(),
  OTHER: [],
  TEMPL: new Interface.AllTempPublishRelated(),
  FEATURES: new Interface.SiteFeatures(),
}

const getters: GetterTree<State, any> = {
  BASE: (state: State) => state.BASE,
  OTHER: (state: State) => state.OTHER,
  TEMPL: (state: State) => state.TEMPL,
  FEATURES: (state: State) => state.FEATURES
}

const mutations: MutationTree<State> = {
  UPDATE_BASE(state: State, Data: Interface.SiteAndClassify) {
    state.BASE = Data;
  },
  UPDATE_OTHER(state: State, Data: Interface.SiteOther[]) {
    state.OTHER = Data;
  },
  UPDATE_TEMPL(state: State, Data: Interface.AllTempPublishRelated) {
    state.TEMPL = Data;
  },
  UPDATE_FEATURES(state: State, Data: Interface.SiteFeatures) {
    state.FEATURES = Data;
  },
}

const actions: ActionTree<Interface.SiteOther, any> = {
  // UPDATE_SYNC({commit, state: State}, Data: PInterface.KV) {
  //   commit(`UPDATE_${Data.Key}`, Data.Value);
  // }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};