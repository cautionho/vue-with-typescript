import { Vue } from 'vue-property-decorator';
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import UI from '@/assets/Global/UI'
import Request from '@/assets/Global/Request'
import Server from '@/assets/Config/Server'
import Api from '@/assets/Config/Api'
import Utils from '@/assets/Global/Utils'
import { State } from 'vuex-class'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

interface State {
  ORDER_PARAMS: Interface.InfoParams,
  SHIP_ORDER_INFO: Interface.ShipOrderBase
  SHIP_ORDER_ADDRESS: PInterface.ShipToAddress
  SHIP_ORDER_ITEMS: Interface.ShipOrderItem[]
  SHIP_ORDER_HISTORY: Interface.ShipOrderHistory[]
  SHIP_ORDER_REMARK: Interface.ShipOrderRemark[]
  SHIP_ORDER_POWERS: PInterface.Power
  [Key: string]: any
}

const state: State = {
  ORDER_PARAMS: new Interface.InfoParams(),
  SHIP_ORDER_INFO: new Interface.ShipOrderBase(),
  SHIP_ORDER_ADDRESS: new PInterface.ShipToAddress(),
  SHIP_ORDER_ITEMS: [],
  SHIP_ORDER_HISTORY: [],
  SHIP_ORDER_REMARK: [],
  SHIP_ORDER_POWERS: {}
}

const getters: GetterTree<State, any> = {
  ORDER_PARAMS: (state: State) => state.ORDER_PARAMS,
  SHIP_ORDER_INFO: (state: State) => state.SHIP_ORDER_INFO,
  SHIP_ORDER_ADDRESS: (state: State) => state.SHIP_ORDER_ADDRESS,
  SHIP_ORDER_ITEMS: (state: State) => state.SHIP_ORDER_ITEMS,
  SHIP_ORDER_HISTORY: (state: State) => state.SHIP_ORDER_HISTORY,
  SHIP_ORDER_REMARK: (state: State) => state.SHIP_ORDER_REMARK,
  SHIP_ORDER_POWERS: (state: State) => state.SHIP_ORDER_POWERS
}

const mutations: MutationTree<State> = {
  UPDATE_SHIP_ORDER_POWERS(state: State, Data: any) {
    state.SHIP_ORDER_POWERS = (Utils as any).GetUserResource.call(Data.VM, Data.Powers);
  },
  UPDATE_STATE(state: State, Data: State) {
    for (const key in Data) {
      if (!Data.hasOwnProperty(key)) { return }
      state[key] = Data[key]
    }
  },
  UPDATE_SHIP_ORDER_INFO(state: State, Data: Interface.InfoParams) {
    UI.Loading.Show()
    Request.Post({
      Server: Server.Warehouse,
      Api: {
        Address: Api.GetShipOrderInfo,
        Login: true
      },
      Data: Data,
      Callback(res: PInterface.Res): void {
        if (res.IsSuccess) {
          state.SHIP_ORDER_INFO = res.Data.ShipOrder ? res.Data.ShipOrder : new Interface.ShipOrderBase();
          state.SHIP_ORDER_ADDRESS = res.Data.Address ? res.Data.Address : new PInterface.ShipToAddress();
          state.SHIP_ORDER_ITEMS = []
          state.SHIP_ORDER_HISTORY = []
          state.SHIP_ORDER_ITEMS.push(...res.Data.Items);
          state.SHIP_ORDER_HISTORY.push(...res.Data.History);
          mutations.UPDATE_SHIP_ORDER_REMARK(state, res.Data.ShipOrder.Id);
        } else {
          UI.Loading.Hide()
          Request.Error(res);
        }
      }
    })
  },
  UPDATE_SHIP_ORDER_HISTORY(state: State, Data: Interface.InfoParams) {

  },
  UPDATE_SHIP_ORDER_REMARK(state: State, Id: number) {
    UI.Loading.Show();
    Request.Post({
      Server: Server.Warehouse,
      Api: {
        Address: Api.ShipOrderGetRemarks,
        Login: true
      },
      Data: Id,
      Callback: (res: PInterface.Res) => {
        UI.Loading.Hide();
        if (res.IsSuccess) {
          state.SHIP_ORDER_REMARK = [];
          state.SHIP_ORDER_REMARK.push(...res.Data.Data);
        }
      }
    })
  }
}

const actions: ActionTree<State, any> = {
  UPDATE_STATE_ASYN({ commit, state: State }, Data: State) {
    commit('UPDATE_STATE', Data)
  },
  UPDATE_SHIP_ORDER_POWERS({ commit, state: State }, Data: any) {
    if (!Object.keys(state.SHIP_ORDER_POWERS).length) {
      commit('UPDATE_SHIP_ORDER_POWERS', Data)
    }
  },
  UPDATE_SHIP_ORDER_INFO({ commit, state: State }, Data?: Interface.InfoParams) {
    if (Data) {
      commit('UPDATE_STATE', { ORDER_PARAMS: Data })
    }
    commit('UPDATE_SHIP_ORDER_INFO', Data ? Data : state.ORDER_PARAMS);
  },
  UPDATE_SHIP_ORDER_HISTORY({ commit, state: State }, Data: Interface.InfoParams) {
    commit('UPDATE_SHIP_ORDER_HISTORY', Data)
  },
  UPDATE_SHIP_ORDER_REMARK({ commit, state: State }, Data: number = state.SHIP_ORDER_INFO.Id) {
    commit('UPDATE_SHIP_ORDER_REMARK', Data)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};        