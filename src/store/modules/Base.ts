import { GetterTree, MutationTree, ActionTree } from 'vuex'
import PInterface from '@/assets/Interface/Public'
import Request from '@/assets/Global/Request'
import Server from '@/assets/Config/Server'
import Api from '@/assets/Config/Api'

interface State {
  COUNTRY_DROP: PInterface.CountryEntity[]
  CURRENCY_DROP: PInterface.KV[]
  PROVINCES_TREE: PInterface.KV[]
  PROVINCE_DROP: PInterface.KV[]
}

const state: State = {
  COUNTRY_DROP: [],
  CURRENCY_DROP: [],
  PROVINCES_TREE: [],
  PROVINCE_DROP: []
}

const getters: GetterTree<State, any> = {
  COUNTRY_DROP: (state: State) => state.COUNTRY_DROP,
  CURRENCY_DROP: (state: State) => state.CURRENCY_DROP,
  PROVINCES_TREE: (state: State) => state.PROVINCES_TREE,
  PROVINCE_DROP: (state: State) => state.PROVINCE_DROP
}

const mutations: MutationTree<State> = {
  /**国家 */
  UPDATE_BASE_INFO_COUNTRY(state: State, Data: any) {
    Request.Post({
      Server: Server.Settings,
      Api: {
        Address: Api.CountryList,
        Login: false
      },
      Data: Data,
      Callback: (res: PInterface.Res) => {
        if (res.IsSuccess) {
          state.COUNTRY_DROP.push(...res.Data.DropList);
        }
      }
    })
  },
  /**币种 */
  UPDATE_BASE_INFO_CURRENCY(state: State, Data: any) {
    Request.Post({
      Server: Server.Settings,
      Api: {
        Address: Api.ERDropList,
        Login: false
      },
      Data: Data,
      Callback: (res: PInterface.Res) => {
        if (res.IsSuccess) {
          state.CURRENCY_DROP.push(...res.Data.DropList)
        }
      }
    })
  },
  /**省市区树 */
  UPDATE_BASE_INFO_PROVINCES(state: State, Data: any) {
    Request.Post({
      Server: Server.Settings,
      Api: {
        Address: Api.ProvincialAreasGetTree,
        Login: false
      },
      Data: Data,
      Callback: (res: PInterface.Res) => {
        if (res.IsSuccess) {
          state.PROVINCES_TREE.push(...res.Data.Tree)
        }
      }
    })
  },
  /**省份 */
  UPDATE_BASE_INFO_PROVINCE(state: State, Data: any) {
    Request.Post({
      Server: Server.Settings,
      Api: {
        Address: Api.ProvincesDropList,
        Login: false
      },
      Data: Data,
      Callback: (res: PInterface.Res) => {
        if (res.IsSuccess) {
          state.PROVINCE_DROP.push(...res.Data.DropList)
        }
      }
    })
  }
}

const actions: ActionTree<State, any> = {
  UPDATE_BASE_INFO({ commit, state: State }, Str: string, Data: any = ''): void {
    commit(`UPDATE_BASE_INFO_${Str}`, Data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};    