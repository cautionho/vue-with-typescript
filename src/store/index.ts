import Vue from 'vue';
import Vuex from 'vuex';
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import Base from './modules/Base';
import ShipOrder from './modules/ShipOrder';
import CustomerService from './modules/CustomerService'
import EbayPublish from './modules/EbayPublish'

Vue.use(Vuex);

interface State {

}

const state: State = {

}

const getters:GetterTree<State,any> = {

}

const mutations = {

}

const actions = {

}


export default new Vuex.Store({
	state: state,
	getters: getters,
	mutations: mutations,
  actions: actions,
  modules:{
    Base,
    ShipOrder,
    CustomerService,
    EbayPublish
  }
});
