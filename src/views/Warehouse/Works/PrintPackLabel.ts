import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'
import PrintInterface from '@/assets/Interface/Print'
import Request from '@/assets/Global/Request'
import Api from '@/assets/Config/Api'
import UI from '@/assets/Global/UI'
import { Warehouse } from '@/assets/Config/Server'
import {MailPrint, PmsPrint} from '@/assets/Global/Print'

export const PrintLabel = function(Data: PrintInterface.PmsPrintData | PrintInterface.PrintData): Promise<boolean>{
  return new Promise(( Resolve: (Val: boolean) => void ) => {
    Data.hasOwnProperty('MethodApiType') ? MailPrint([Data as PrintInterface.PrintData], 'Pack') : PmsPrint([Data as PrintInterface.PmsPrintData])
    Resolve(true)
  })
}

export const PrintPackLabel = function(Data: Interface.ShipOrderBase): Promise<PrintInterface.PrintData[] | PrintInterface.PmsPrintData[]> {
  /* 区分正常面单和PMS面单 */
  return new Promise(async ( Resolve: (Val: PrintInterface.PrintData[] | PrintInterface.PmsPrintData[]) => void ) => {
    if(!Data.IsAutoRegistry){
      await SetTrackNumber(Data)
    }
    Request.Post({
      Server: Warehouse,
      Api: {
        Address: Data.ApiType === 6 ? Api.ShipOrderPrintPms : Api.ShipOrderGetPrintData,
        Login: true
      },
      Data: {
        OrderCode: [],
        OrderId: [Data.Id]
      },
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          Data.ApiType === 6 ? PmsPrint(Res.Data.Data) : MailPrint(Res.Data.Data, 'Pack');
        }
        Resolve(Res.IsSuccess ? Res.Data.Data : [])
      }
    })
  })
}

function SetTrackNumber(Data: Interface.ShipOrderBase): Promise<boolean> {
  return new Promise(( Resolve:(Val: boolean)=>void ) => {
    Request.Post({
      Server: Warehouse,
      Api: {
        Address: Api.SetTrackNumber,
        Login: true
      },
      Data: {
        OrderId: [Data.Id],
        TrackNumber:  Data.OrderCode
      },
      Callback: (Res: PInterface.Res): void => {
        Resolve(true)
      }
    })
  })
}

export const ChangeOrderStaus = function(Data: Interface.ChangeShipOrderStatus): Promise<boolean> {
  return new Promise(( Resolve: (Val: boolean) => void ) => {
    UI.Loading.Show()
    Request.Post({
      Server: Warehouse,
      Api: {
        Address: Api.ShipOrderChangeStatus,
        Login: true
      },
      Data: Data,
      Callback: (Res: PInterface.Res): void => {
        UI.Loading.Hide()
        if(!Res.IsSuccess){
          Request.Error(Res, () => {
            Resolve(false)
          })
        }else{
          Resolve(true)
        }
      }
    })
  })
}

