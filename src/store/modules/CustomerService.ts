import { Vue } from 'vue-property-decorator';
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import UI from '@/assets/Global/UI'
import Request from '@/assets/Global/Request'
import Server from '@/assets/Config/Server'
import Api from '@/assets/Config/Api'
import Utils from '@/assets/Global/Utils'
import { State } from 'vuex-class'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService';

interface State {
  DISPUTED_ID: number
  CANCELLATION_INFO: Interface.CancellationInfo
  NOTRECEIVEDGOODS_INFO: Interface.NotReceivedGoodsInfo
  REFUND_INFO: Interface.RefundInfo
  CASE_INFO: Interface.CaseInfo
  WISH_TICKET_INFO: Interface.WishTicketInfo
  SHOPEE_RETURN_INFO: Interface.ShopeeReturnRefundInfo
  SHOPEE_CANCELLATION_INFO: Interface.ShopeeCancellationInfo
  ALLEGRO_ORDER_INFO: Interface.AllegroOrderDisputeInfo
  [Key: string]: any
}

/* 需要初始值 */
const state: State = {
  DISPUTED_ID: 0,
  CANCELLATION_INFO: new Interface.CancellationInfo(),
  NOTRECEIVEDGOODS_INFO: new Interface.NotReceivedGoodsInfo(),
  REFUND_INFO: new Interface.RefundInfo(),
  CASE_INFO: new Interface.CaseInfo(),
  WISH_TICKET_INFO: new Interface.WishTicketInfo(),
  SHOPEE_RETURN_INFO: new Interface.ShopeeReturnRefundInfo(),
  SHOPEE_CANCELLATION_INFO: new Interface.ShopeeCancellationInfo(),
  ALLEGRO_ORDER_INFO: new Interface.AllegroOrderDisputeInfo()
}

const getters: GetterTree<State, any> = {
  DISPUTED_ID: (State: State) => State.DISPUTED_ID,
  CANCELLATION_INFO: (State: State) => State.CANCELLATION_INFO,
  NOTRECEIVEDGOODS_INFO: (State: State) => State.NOTRECEIVEDGOODS_INFO,
  REFUND_INFO: (State: State) => State.REFUND_INFO,
  CASE_INFO: (State: State) => State.CASE_INFO,
  WISH_TICKET_INFO: (State: State) => State.WISH_TICKET_INFO,
  SHOPEE_RETURN_INFO: (State: State) => State.SHOPEE_RETURN_INFO,
  SHOPEE_CANCELLATION_INFO:  (State: State) => State.SHOPEE_CANCELLATION_INFO,
  ALLEGRO_ORDER_INFO: (State: State) => State.ALLEGRO_ORDER_INFO
}


const mutations: MutationTree<State> = {
  UPDATE_CANCELLATION(State: State, Data: number) {
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.CancelDetail,
        Login: true
      },
      Data: State.DISPUTED_ID,
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          State.CANCELLATION_INFO = Res.Data.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  UPDATE_NOTRECEIVEDGOODS(State: State, Data: number){
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.GetNotReceiveGoodsDetail,
        Login: true
      },
      Data: State.DISPUTED_ID,
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          State.NOTRECEIVEDGOODS_INFO = Res.Data.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  UPDATE_REFUND(State: State, Data: number){
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.ReturnDetail,
        Login: true
      },
      Data: State.DISPUTED_ID,
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          Res.Data.Data.AvailableOptionsList = Res.Data.Data.AvailableOptionsList.reverse();
          State.REFUND_INFO = Res.Data.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  UPDATE_CASE(State: State, Data: number){
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.GetCaseDetail,
        Login: true
      },
      Data: State.DISPUTED_ID,
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          State.CASE_INFO = Res.Data.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  UPDATE_WISH_TICKET(State: State, Data: number) {
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.WishTicketOrderDetai,
        Login: true
      },
      Data: State.DISPUTED_ID,
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          State.WISH_TICKET_INFO = Res.Data.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  UPDATE_SHOPEE_RETURN(State: State, Data: number) {
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.ShopeeReturnDetail,
        Login: true
      },
      Data: {
        ReturnId: State.DISPUTED_ID,
        ReturnSn: ""
      },
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          State.SHOPEE_RETURN_INFO = Res.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  UPDATE_SHOPEE_CANCELLATION(State: State, Data: number){
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.ShopeeCancellationDetail,
        Login: true
      },
      Data: {
        CancellationId: State.DISPUTED_ID,
        OrderSn: ""
      },
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          State.SHOPEE_CANCELLATION_INFO = Res.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  UPDATE_ALLEGRO_ORDER(State: State, Data: number){
    if(Data){
      State.DISPUTED_ID = Data;
    }
    UI.Loading.Show()
    Request.Post({
      Server: Server.CustomerService,
      Api: {
        Address: Api.AllegroDisputesOrderDetail,
        Login: true
      },
      Data: State.DISPUTED_ID,
      Callback(Res: PInterface.Res): void {
        UI.Loading.Hide()
        if (Res.IsSuccess) {
          State.ALLEGRO_ORDER_INFO = Res.Data.Data
        } else {
          UI.Loading.Hide()
          Request.Error(Res);
        }
      }
    })
  },
  CLEAR_DISPUTED_ASYNC(State: State, Key: string = ''){
    if(Key){
      switch(Key){
        case 'CANCELLATION':
          State.CANCELLATION_INFO = new Interface.CancellationInfo();
          break
        case 'NOTRECEIVEDGOODS':
          State.NOTRECEIVEDGOODS_INFO = new Interface.NotReceivedGoodsInfo();
          break
        case 'REFUND':
          State.REFUND_INFO = new Interface.RefundInfo()
          break
        case 'CASE':
          State.CASE_INFO = new Interface.CaseInfo()
          break
        case 'WISH_TICKET':
          State.WISH_TICKET_INFO = new Interface.WishTicketInfo()
          break
        case 'SHOPEE_RETURN':
          State.SHOPEE_RETURN_INFO = new Interface.ShopeeReturnRefundInfo()
          break
        case 'SHOPEE_CANCELLATION':
          State.SHOPEE_CANCELLATION_INFO = new Interface.ShopeeCancellationInfo()
          break
        case 'ALLEGRO_ORDER':
          State.ALLEGRO_ORDER_INFO = new Interface.AllegroOrderDisputeInfo()
          break
      }
    }else{
      State.CANCELLATION_INFO = new Interface.CancellationInfo();
      State.NOTRECEIVEDGOODS_INFO = new Interface.NotReceivedGoodsInfo();
      State.REFUND_INFO = new Interface.RefundInfo()
      State.CASE_INFO = new Interface.CaseInfo()
      State.WISH_TICKET_INFO = new Interface.WishTicketInfo()
      State.SHOPEE_RETURN_INFO = new Interface.ShopeeReturnRefundInfo()
      State.SHOPEE_CANCELLATION_INFO = new Interface.ShopeeCancellationInfo()
      State.ALLEGRO_ORDER_INFO = new Interface.AllegroOrderDisputeInfo()
      State.DISPUTED_ID = 0
    }
  }
}

const actions: ActionTree<State, any> = {
  UPDATE_DISPUTED({ commit, state: State }, Data: {Type: string, Id: number}) {
    commit(`UPDATE_${Data.Type}`, Data.Id)
  },

  CLEAR_DISPUTED_ASYNC({commit}, Key: string = '') {
    commit('CLEAR_DISPUTED_ASYNC', Key);
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};        