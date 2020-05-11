import PInterface from './Public'

namespace Interface {
  export class InfoParams {
    constructor( public OrderId:number = 0, public OrderCode:string = ''){}
  }

  export class ShipOrderSearch {
    Platform?: number = 0
    StoreId?: number = 0
    ShipWarehouseId?: number = 0
    ShipMethodId?: number = 0
    Country?: string = ''
    Status?: number = 0
    Location?: number[] | string = []
    ItemType?: number = 0
    IsException?: boolean | string = ''
    TimeType?: number = 0
    StartTime?: string = ''
    EndTime?: string = ''
    SearchKeyType?: number = 0
    SearchKey?: string = ''
    SkuStatus?: string = ''
    RuleId: number = 0
    LogisticsStatus?: number = 0
    CustomerStatus?: number = 0

    constructor(Init?: ShipOrderSearch | any) {
      if (Init) {
        for (let item in Init) {
          (this as any)[item] = Init[item];
        }
      }
    }
  }

  export class ShipOrderList {
    ShipOrder: ShipOrderBase
    Address: PInterface.ShipToAddress
    Remark: ShipOrderRemark[]
  }

  export class ShipOrderInfo {
    ShipOrder: ShipOrderBase = new ShipOrderBase()
    Address: PInterface.ShipToAddress = new PInterface.ShipToAddress()
    Items: ShipOrderItem[] = []
    History: ShipOrderHistory[] = []
  }

  export class ShipOrderBase {
    Id: number = 0
    OrderCode: string = ''
    Status: number = 0
    PlatformOrderId: string = ''
    ShipWarehouseId: number = 0
    WarehouseName: string = ''
    ShippingMethodId: number = 0
    MethodName: string = ''
    ApiType: number = 0
    MethodApiCode: string = ''
    IsAutoRegistry: boolean | string = ''
    ShippingService: string = ''
    BatchNumber: string = ''
    ItemType: number = 0
    Platform: number = 0
    StoreId: number = 0
    StoreName: string = ''
    BuyerUserId: string = ''
    BuyerEmail: string = ''
    BuyerRemark: string = ''
    PayPrice: number = 0
    PayCurrency: string = ''
    ShippingCost: number = 0
    TotalPrice: number = 0
    TransationId: string = ''
    PlatOrderTime: string = ''
    CreateTime: string = ''
    PaidTime: string = ''
    DownLoadTime: string = ''
    UpPackedTime: string = ''
    ShipedTime: string = ''
    UpPackUserName: string = ''
    UpPackUser: number = 0
    ShipUser: number = 0
    ShipUserName: string = ''
    Weight: number = 0
    ShipFee: number = 0
    ShipFeeCurrency: string = ''
    TrackingNumber: string = ''
    AutoMatchRemark: string = ''
    Remark: string = ''
    IsSplit: boolean | string = ''
    IsMerge: boolean | string = ''
    IsApiDownLoad: boolean | string = ''
    IsHoldUp: boolean | string = ''
    IsReport: boolean | string = ''
    IsException: boolean | string = ''
    LabelUrl: string = ''
    Sku: ShipOrderBaseSku
    ShipOrderExt: string = ''
    LogisticsExt: string = ''
    AfterSaleOrderType: number = 0
    IsLockPack: boolean | string = ''
  }

  export class ShipOrderItem {
    Id: number = 0
    OrderId: number = 0
    OrderCode: string = ''
    SkuCode: string = ''
    Sku: ShipOrderItemSku = new ShipOrderItemSku()
    ItemId: string = ''
    Quantity: number = 0
    SalePrice: number = 0
    IsPicked: false
    PaoId: number = 0
    PaoCode: string = ''
    LocationCode: string = ''
    UsableQuantity: number = 0
    PurchasingQuantity: number = 0
    PlatformOrderId: string = ''
    PlatformTransactionId: string = ''
    PaypalTransactionId: string = ''
    PayAmount: number = 0
    PayCurrency: string = ''
    IsNew: boolean = false
  }

  export class ShipOrderHistory {
    Id: number
    OrderId: number
    OrderCode: string
    Operator: string
    OperateLog: string
    TargetStatus: string
    OperateTime: string
  }

  export class ShipOrderRemark {
    ShipOrderId?: number
    Id?: number
    OrderId?: number
    Content: string
    UserName: string
    Created: string
  }

  export interface ShipOrderBaseSku {
    SkuId: number
    SkuCode: string
    GrossWeight: number
  }

  export class ShipOrderItemSku {
    Id: number = 0
    SkuCode: string = ''
    SkuName: string = ''
    SkuNameEn?: string = ''
    DefaultImage: string = ''
    Length: number = 0
    Width: number = 0
    Height: number = 0
    GrossWeight: number = 0
    NetWeight: number = 0
    WeightRemark?: string = ''
    Pcs?: number = 0
    MainId: number | '' = ''
    HasProperty: boolean
    AvgPrice?: number = 0
  }

  export class ShipOrderExt {
    LazadaGC: boolean = false
    WishExpress: boolean = false
    WishEPC: boolean = false
    PremiumCarrier: boolean = false
    VovaIsCombinedOrder: boolean = false
  }

  export class ChangeShipOrderStatus {
    OrderId: number[] = []
    Remark: string = ''
    Targetstatus: number = 0
  }

  export class Remark {
    OrderId: number[] = []
    Remark: string = ''
  }

  export class Merge {
    TargetOrderId: number = 0
    SourceId: number[] = []
  }

  export class ExportShiped {
    ShipWarehouseId: string = ""
    Platform: number = 0
    StoreId: number = 0
    StartTime: string = ""
    EndTime: string = ""
    Country: string = ""
    ShipMethodId: number[] = []
    ExportType: number | "" = ""
  }

  export class ExportOrder {
    ExportType: number = 0
    WarehouseId: number = 50
  }

  export class CreateBatchInfo {
    PlatformId: number = 0
    StoreId: number = 0
    CountryCode: string = ''
    ShipWarehouseId: number | "" = ""
    ShipMethodId: number[] = []
    ItemType: number | "" = ""
    StorageFarm: number[] = []
    TimeType: number | "" = ""
    BeginTime: string = ''
    EndTime: string = ''
    OrderCount: number | "" = ""
  }

  export class ReplaceLable {
    TrackingNumber: string = ""
  }

  export class SetShippintMethod {
    OrderId: number[] = []
    MethodId: number = 0
  }

  export class SetWarehouse {
    OrderId: number[] = []
    WarehouseId: number = 0
  }

  export class SetTrackingNumber {
    OrderCode: string = ""
    TrackCode: string = ""
  }

  export class Split {
    OrderId: number | string = ""
    GrossWeight: number = 0
    Amount: number = 0
    ShipWarehouseId: number = 0
    ShippingMethodId: number = 0
    MethodDrop?: PInterface.IdName[] = [] // 存放渠道
    IsStockOut: boolean = false
    IsAuto?: boolean = false
    ItemList: SplitItem[] = []
  }

  export class SplitItem {
    SkuId: number = 0
    SkuCode: string = ""
    AvailableQty: number = 0
    SingleWeight: number = 0
    AllotQty: number = 0
    SkuName: string = ""
    SplitNum?: number = 0 // 下标
    _index?: number
  }

  export type PackOrder = {
    OrderId: number[]
    Weight: number
    PaoId: string
  }
}

export default Interface;