import {namespace} from 'vuex-class'

namespace Interface {
  export class CustomRulesSearch {
    SearchKey: string = ''
    IsEnable: boolean | '' = ''
    SelectedValue: string = ''
    RuleType: number = 0
  }

  export class CustomRulesCondition {
    RuleId: number = 0
    ConditionId: number = 0
    ConditionName: string = ''
    ConditionMatchType: number = 0
    ConditionValue: string | boolean | number = ''
    ConditionValueText: string = ''
  }

  export class CustomRulesConditionList {
    ConditionId: number = 0
    ConditionName: string = ''
    ClickString: string = ''
    ConditionMatchType: number = 0
    ConditionMatchField: string = ''
  }

  export class CustomRulesList {
    Id: number = 0
    Priority: number = 0
    RuleName: string = ''
    SelectedValue: number = 0
    RuleType: number = 0
    IsEnable: boolean = true
    CreateTime: string = ''
    Conditions: CustomRulesCondition[] = []
  }

  export class CustomRulesSort {
    Id: number | string = 0
    Priority: number | string = 0
  }
}

//库存管理
namespace Interface {
  export class InventoryManageSearch {
    SearchKey: string = ''
    SearchKeyType: string | number = ''
    WarehouseId: string | number = ''
  }

  export class InventoryManageList {
    DefaultImage: string = ''
    Id: number
    LastOperateTime: string
    LastOperator: string
    LocationCode: string = ''
    PurchasePrice: string
    PurchasingQuantity: number
    Quantity: number
    ShippingQuantity: number
    SkuCode: string = ''
    SkuName: string = ''
    WaitPickQuantity: number
    WaitingShipedQuantity: number
    WarehouseId: number
    WarehouseName: string
  }

  //打印货架条码
  export class GenerationForm {
    GenerationId: number = 1
  }

  export class GenerationManual {
    LocationCode: string = ''
    PrintNum: number = 1
  }

  export class GenerationAutomatic {
    Warehouse: string | number = ''
    NumeralId: string = '01'
    MinFrame: string = ''
    MaxFrame: string = ''
    MinBitNumber: string = '01'
    MaxBitNumber: string = '01'
    PrintNum: number = 1
  }

  //打印SKU标签操作
  export class SkuLabel {
    SkuId: string = ''
    SkuCode: string = ''
    WarehouseId: string | number = ''
  }

  //批量打印sku操作
  export class SkuInventory {
    SkuCode: string = ''
    SkuId: number
    WarehouseId: number
  }

  //导出库存操作
  export class ExportInventory {
    AttributeIds: number[] = []
    EndQuantity: number | string = ''
    InventoryType: number | string = ''
    PurchaserIds: number[] = []
    SkuStatus: number[] = []
    StartQuantity: number | string = ''
    WareHouseId: number | string = ''
  }

  //盘点操作
  export class InventoryForm {
    Id: number | string = ''
    WarehouseId: number | '' = ''
    SkuCode: string = ''
    SkuName: string = ''
    LocationCode: string = ''
    WaitingShipedQuantity: string = ''
    WaitPickQuantity: string = ''
    Quantity: string = ''
    OriQuantity: string = ''
    NowQuantity: string = ''
  }

  export class PostCheckOut {
    InventoryId: number = 0
    Quantity: number = 0
  }
}

// 黑名单
namespace Interface {
  export class BlacklistSearchGroup {
    Platform: number | '' = ''
    IsEnable: boolean | '' = ''
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
  }

  export class BlacklistTable {
    Id: number = 0
    Platform: number
    BuyerUserId: string
    BuyerEmail: string
    BuyerPhone: string
    Remark: string
    IsEnable: boolean | '' = ''
    CreateTime: string = ''
  }
}


// 拣货批次规则
namespace Interface {
  export class PickBatchRuleSearch {
    RuleName: string = ''
    IsEnable: number | '' = ''
  }

  export class PickBatchRuleList {
    Id: number
    IsEnable: boolean
    Priority: number
    RuleName: string
  }

  export class PickBatchRuleSortForm {
    Id: number = 0
    Priority: number | '' = ''
  }

  export class ModifyRuleDetail {
    Area: number[] | any = []
    Country: string = ''
    EndTime: string = ''
    Id: number = 0
    ItemType: number | string = ""
    PlatformId: number = 0
    Quantity: number | '' = ''
    RuleName: string = ''
    ShippingMethodId: number[] | any = []
    StartTime: string = ''
    StoreId: number | '' = ''
    TimeType: number | '' = ''
    WarehouseId: number = 0
  }
}
// 拣货批次
namespace Interface {
  export class PickBatchSearchgroup {
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    Status: number | '' = 1
    LabelSize: number | '' = ''
  }

  export class PickBatchTable {
    Id: number
    BatchCode: string
    Status: number
    WarehouseId: number
    WarehouseName: string
    CreateUser: string
    Printer: string
    CreateTime: string
    PrinteTime: string
    OrderCount: number
    SkuCount: number
    LabelSize: number
  }

  export class PickBatchGetDetail {
    constructor(
      public BatchId: number = 0,
      public BatchCode: string = ''
    ) {
    }
  }

  export class PickBatchOrderTableDetail {
    Id: number
    SkuId: number
    SkuCode: string
    SkuName: string
    DefaultImage: string
    Quantity: number
    PickedQuantity: number
    ItemId: string
    PaoCode: string
    PaoId: number
    GrossWeight: number
    ScanQty?: number = 0 // 打包使用，扫描数量
  }

  export class PickBatchOrderTable {
    BatchId: number
    BatchCode: string
    OrderId: number
    OrderCode: string
    OrderStatus: number
    IsExceptioin: boolean
    PlatformOrderTime: string
    BoxNum: string
    IsHoldUp: boolean
    HoldUpRemark: string
    Item: PickBatchOrderTableDetail[] = []
  }

  export class PickBatchDetailTable {
    Id: number
    BatchId: number
    BatchCode: string
    SkuId: number
    SkuCode: string
    SkuName: string
    PrinteTime: string
    LocationCode: string
    InventoryAmout: number
    Quantity: number
    PickedQuantity: number
    IsCompleted: boolean
    Picker: string
    PickedTime: string
  }

  export class PickBatchPrint {
    PrintType: number | '' = 1
    PrintBoxType: number | '' = 1
    PrintBoxCode: number = 0
  }

  export class PickBatchGetA4Detail {
    constructor(
      private BatchId: number[] = [],
      private BatchCode: string[] = []
    ) {
    }
  }

  export class PickBatchA4Detail {
    Key: string
    Value: PickBatchA4DetailItem[]
  }

  export class PickBatchA4DetailItem {
    Id: number
    BatchId: number
    BatchCode: string
    SkuId: number
    SkuCode: string
    SkuName: string
    PrinteTime: string
    LocationCode: string
    InventoryAmout: number
    Quantity: number
    PickedQuantity: number
    IsCompleted: boolean
    Picker: string
    PickedTime: string
  }

  export class PickBatchFinish {
    constructor(
      private OrderId: number[] = [],
      private BatchId: number[] = [],
      private IsAuto: boolean = false
    ) {
    }

  }
}

// 海外多仓规则
namespace Interface {
  // 产品设置 列表
  export class ProductAboadWareList {
    WarehouseId: number = 0
    WarehouseName: string = ''
    Sequence: number = 0
    ThresholdValue: number = 0
    IsEnable: boolean = false
  }

  // 备货设置 列表
  export class StockUpAboadWareList {
    Id: number = 0
    Sequence: number = 0
    WarehouseId: number = 0
    WarehouseName: string = ''
    SaleSlowQty: number = 0
    SaleHighQty: number = 0
    StockupDays: number = 0
    IsEnable: boolean = false
  }

  export class AboadWareSearch {
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    IsEnable: boolean | '' = ''
  }

  export class ModifyProductRulesForm {
    Id: number = 0
    WarehouseId: number | '' = ''
    ThresholdValue: number = 0
  }

  // 备货规则
  export class ModifyStockUpForm {
    Id: number = 0
    WarehouseId: number | '' = ''
    SaleSlowQty: number = 0
    SaleHighQty: number = 0
    StockupDays: number = 0
  }
}
// 库存流水
namespace Interface {
  export class InventoryLogSearchGroup {
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    LogType: number | '' = ''
    WarehouseId: number | '' = ''
    StartTime: string = ''
    EndTime: string = ''
  }

  export class InventoryLogTable {
    Id: number
    InvertoryId: number
    SkuCode: string
    SkuName: string
    DefaultImage: string
    WarehouseName: string
    LocationCode: string
    OrderCode: string
    Operator: string
    OperateTime: string
    LogType: string
    OldQuantity: number
    NewQuantity: number
    OldPurchasingQuantity: number
    NewPurchasingQuantity: number
    OldShippingQuantity: number
    NewShippingQuantity: number
    OldWaitPickQuantity: number
    NewWaitPickQuantity: number
    OldWaitShipedQuantity: number
    NewWaitShipedQuantity: number
    Remark: string
  }

  export class ExportReportRecord {
    constructor(
      private ReportType: number,
      private SearchSerialize: string
    ) {
    }
  }
}

// 库存盘亏盘盈
namespace Interface {
  export class InventoryCheckRecordSearch {
    WarehouseId: number = 50
    StartTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime())
    EndTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    SearchKeyType: string = ''
    SearchKey: string = ''
  }

  export class InventoryCheckRecordList {
    Id: number = 0
    SkuCode: string = ''
    SkuName: string = ''
    DefaultImage: string = ''
    WarehouseName: string = ''
    LocationCode: string = ''
    OldQuantity: number = 0
    NewQuantity: number = 0
    CheckQuantity: number = 0
    AvgPrice: number = 0
    Amount: number = 0
    Operator: string = ''
    OperateTime: string = ''
  }

  export class InventoryExportForm {
    WarehouseId: number = 0
    StartTime: string = ''
    EndTime: string = ''
  }
}

// 调拨需求
namespace Interface {
  export class TransferDemandSearch {
    OriginWarehouseId: number | string = ''
    SearchKey: string = ''
    SearchKeyType: number | string = ''
    TargetWarehouseId: number | string = ''
    TransferRequireStatus: number | string = ''
  }

  export class TransferDemandList {
    CreatedTime: string
    Id: number
    OriginWarehouse: string
    OriginWarehouseId: number
    Quantity: number
    Remark: string
    SkuCode: string
    SkuName: string
    TargetWarehouse: string
    TargetWarehouseId: number
    TransferRequireBatchCode: string
    TransferRequireCode: string
    TransferRequireStatus: number
  }

  //调拨需求详情
  export class TransferDemandHistory {
    Operater: string
    OperatedTime: string
    Note: string
  }

  export class TransferDemandDetail {
    CreatedTime: string = ''
    Historys: Interface.TransferDemandHistory[] = []
    Id: number = 0
    OriginWarehouse: string = ''
    Quantity: number = 0
    Remark: string = ''
    SkuCode: string = ''
    SkuName: string = ''
    TargetWarehouse: string = ''
    TransferRequireBatchCode: string = ''
    TransferRequireCode: string = ''
    TransferRequireStatus: number = 0
  }

  export class ProductInfoTb {
    Id: number
    SkuCode: string
    SkuName: string
    Quantity: number
  }
}

// 补货需求
namespace Interface {
  export class ReplenishDemandSearchGroup {
    tWarehouseId: number | '' = ''
    sWarehouseId: number | '' = ''
    SearchKeyType: number | '' = ''
    srStatus: number | '' = ''
    SearchKey: string = ''
  }

  export class ReplenishDemandTable {
    ReplenishId: number
    ReplenishCode: string
    SkuCode: string
    SkuName: string
    Creator: string
    Num: number
    tWarehouseName: string
    sWarehouseName: string
    Remark: string
    srStatus: number
    CreateTime: string
  }

  export class ReplenishDemandModifyForm {
    constructor(public WarehouseId: number | '' = '', public Remark: string = '') {
    }
  }

  export class ReplenishDemandModifyTable {
    constructor(public ReplenishId: number, public SkuCode: string, public SkuName: string, public Num: number = 1) {
    }
  }

  export class ReplenishDemandPostAdd {
    constructor(public tWarehouseId: number, public Remark: string, public SkuId: number, public Num: number) {
    }
  }

  export class ReplenishDemandPostModify {
    constructor(public ReplenishId: number, public Num: number) {
    }
  }

  export class ReplenishDemandPrintDetail {
    ReplenishId: number
    ReplenishCode: string
    SkuCode: string
    Num: number
    Location: string
    Location2: string
    SkuName: string
    srStatus: number
  }

  export class PdaOutStoreDetial {
    ReplenishId: number
    ReplenishCode: string = ''
    SkuCode: string
    Num: number
    Location: string
    Location2: string = ''
    SkuName: string
    srStatus: number
  }

  export class OrderInStorage {
    constructor(
      public Id: number,
      public OrderCode: string,
      public InStorageQuantity: number,
      public LocationCode: string) {
    }
  }

  export class ReplenishDemandDetail {
    ReplenishId: number
    ReplenishCode: string
    SkuCode: string
    SkuName: string
    Creator: string
    Num: number
    tWarehouseName: string
    sWarehouseName: string
    Remark: string
    srStatus: number
    CreateTime: string
  }

  export class ReplenishHistory {
    Id: number
    Operator: string
    OperateTime: string
    OperateLog: string
  }
}


// 拣货员绩效
namespace Interface {
  export class PickerStatisticsList {
    Name: string = ''
    Number: number = 0
  }

  export class PickerStatisticsSearch {
    WareHouseId: number = 50
    PickBeginTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime())
    PickEndTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    PickUserName: string = ''
  }
}

// 物流时效
namespace Interface {
  export class LogisticsAgingSearchGroup {
    PlatformId: number | '' = ''
    StoreId: number | '' = ''
    ShippingMethodId: number[] = []
    BeginPayTime: string = ''
    EndPayTime: string = ''
  }

  export class LogisticsAgingTable {
    ColSpan: number = 0
    StoreName: string
    ShippingMethodName: string
    TotalOrderNum: number
    H24: number
    H481: number
    H482: number
    D5: number
    H24S: number
    H481S: number
    H482S: number
    D5S: number
  }
}

// 渠道出库汇总
namespace Interface {
  export class MethodShipedSearchGroup {
    WareHouseId: number | '' = 50
    ShipBeginTime: string = ''
    ShipEndTime: string = ''
    ShippingMethodId: number | '' = ''
    Country: string = ''
    Platform: number | '' = ''
    StoreId: number | '' = ''
  }

  export class MethodShipedTable {
    Index: number
    Name: string
    Number: number
  }
}

// 调拨拣货批次
namespace Interface {
  export class TransferPickBatchSearch {
    OriginWarehouseId: number | string = ''
    TargetWarehouseId: number | string = ''
    TransferPickingBatchStatus: number | string = ''
    SearchKeyType: number | string = ''
    SearchKey: string = ''
  }

  export class TransferPickBatchList {
    CreateUserName: string
    CreatedTime: string
    Id: number
    OriginWarehouseName: string
    PrintUserName: string
    RequireQuantity: number
    TargetWarehouseName: string
    TransferBatchCode: string
    TransferRequireStatus: number
  }

  //打印批次
  export class PrintBatchForm {
    PaperType: number = 1
  }

  export class PrintBatchItems {
    LocationCode: string
    NeedPickQuantity: number
    SkuCode: string
    SkuName: string
    StockQuantity: number
  }

  export class PrintBatchData {
    Items: null | PrintBatchItems[]
    NeedPickQuantity: string
    TransferBatchCode: string
  }

  //调拨拣货批次详情
  export class TransferPickBatchDetail {
    Id: number
    InBoxQuantity: number
    LocationCode: string
    PickedQuantity: number
    RequireQuantity: number
    SkuCode: string
    SkuName: string
    TransferRequireCode: string
  }

  export class TransferPickBatchItem {
    Id: number
    InBoxQuantity: string
    InBoxTime: string
    InBoxUserName: string
    TransferBoxCode: string
  }

  //调拨箱详情
  export class TransferInBoxDetail {
    Created: string
    Historys: Interface.TransferDemandHistory[] = []
    Id: number
    LogisticsAmt: number
    LogisticsCmp: string
    OriginWarehouseId: number
    OriginWarehouseName: string
    SkuTotalNum: number
    SkuTypeNum: number
    Status: number
    StoreInCode: string
    TargetWarehouseId: number
    TargetWarehouseName: string
    TrackingNumber: string
    TransferBoxCode: string
  }

  export class TransferInBoxItem {
    ActualInQty: number
    SkuCode: string
    SkuName: string
    TransferInQty: number
  }
}

// 调拨箱列表
namespace Interface {
  export class TransferBoxListSearch {
    OriginWarehouseId: '' | number = ''
    SearchKey: string = ''
    SearchKeyType: '' | number = ''
    Status: '' | number = ''
    TargetWarehouseId: '' | number = ''
  }

  export class TransferBoxList {
    Created: string
    Id: number
    LogisticsCmp: string
    OriginWarehouseId: number
    OriginWarehouseName: string
    SkuTotalNum: number
    SkuTypeNum: number
    Status: number
    StoreInCode: string
    TargetWarehouseId: number
    TargetWarehouseName: string
    TrackingNumber: string
    TransferBoxCode: string
  }

  export class TransferBoxPrint {
    PackageNo: string
    SkuTotalNum: number
    SkuTypeNum: number
    StoreInCode: string
    TargetWarehouseCode: string
    TransferBoxCode: string
  }

  export class InputCharge {
    Id: number[] = []
    ChargeAmt: number = 0
  }

  export class TrackingInfo {
    Id: number[] = []
    LogisticsCmp: string = ''
    TrackingNumber: string = ''
  }
}


// 调拨装箱
namespace Interface {
  export class TransferBatchDeatil {
    SkuCode: string // Sku编号
    SkuName: string // 产品名称
    RequireQuantity: number//需求数量
    PickedQuantity: number//已拣数量
    InBoxQuantity: number//装箱数量
    LocationCode: string // 货架号
    LoadedToBox?: number
  }

  export class TransferBatch {
    Id: number
    TransferBatchCode: string // 批次号
    OriginWarehouseName: string // Y	来源仓
    TargetWarehouseName: string // Y	目标仓
    TransferPickingBatchStatus: number // 状态：1-待拣货；2-已打印；3-已拣货；4-部分装箱；5-已装箱；
    Details: TransferBatchDeatil[]
  }

  export class TransferBatchTableDetail {
    Count: number
    BacthCodeSkuInfo: {
      [Key: string]: number
    }
  }

  export class LoadedToBoxSku {
    [Key: string]: TransferBatchTableDetail
  }

  export class TransferBatchTable {
    OriginWarehouseName: string
    TargetWarehouseName: string
    LoadedToBoxSku: LoadedToBoxSku = new LoadedToBoxSku()
    SkuTypeNum: number
    SkuToBoxNum: number
  }

  export class FinishInBox {
    TransferBatchCode: string
    SkuCode: string
    InBoxQuantity: number
  }

  export class TransferInBox {
    StoreInCode: string // Y	第三方仓库单号
    TransferBoxCode: string // Y	箱号
    SkuTypeNum: number //  Y	产品种类数
    SkuTotalNum: number //  Y	产品总数量
    TargetWarehouseCode: string // Y	目标仓弗睿代码（CN-由前端构造）
    SkuNumberOfSpecies: number //  Y	 SKU种类数
    PackageNo: string // Y	万邑通箱号
  }
}


// 国家出库汇总
namespace Interface {
  export class CountryOutSumSearch {
    Platform: number | '' = ''
    StoreId: number | '' = ''
    Country: string = ''
    WareHouseId: number = 50
    ShippingMethodId: number | '' = ''
    ShipBeginTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime())
    ShipEndTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
  }

  export class CountryOutSumList {
    Key: string
    Value: number
  }

  export class DropShippingMethodList {
    Id: number
    Name: string
  }

  export class DropCountryList {
    CountryCode: string
    CountryName: string
    CountryNameCn: string
  }
}

// 出库员绩效
namespace Interface {
  export class ShiperStatisticsSearch {
    WareHouseId: number | '' = ''
    ShipBeginTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime())
    ShipEndTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    ShipUserName: string = ''
  }

  export class ShiperStatisticsList {
    Name: string
    Number: number
  }
}

// 打包员绩效
namespace Interface {
  export class PackerStatisticsSearch {
    WareHouseId: number | '' = ''
    ItemType: number | '' = ''
    PackBeginTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime())
    PackEndTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    PackUserName: string = ''
  }

  export class PackerStatisticsList {
    Name: string
    Number: number
  }
}

// 缺货产品汇总
namespace Interface {
  export class OOSProductPoolSearch {
    Platform: number | '' = ''
    PurchaserId: number | '' = ''
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    ShipWarehouseId: number | '' = ''
    Stauts: number | '' = ''
  }

  export class OOSProductPoolList {
    DefaultImage: string
    OutOfStockQuantity: number
    Platform: number
    PurchaserName: ''
    PurchasingQuantity: number
    RelateId: string
    SkuCode: string
    SkuId: number
    SkuName: string
    SkuStatus: number
    WarehouseId: number
    WarehouseName: string
  }
}

//发货时效
namespace Interface {
  export class DeliveryAgingSearch {
    StartTime: string = ''
    EndTime: string = ''
  }

  export class DeliveryAgingList {
    NoShipQuantity: number
    QuantityF24H: number
    QuantityF36H: number
    QuantityF48H: number
    QuantityF72H: number
    QuantityFM72H: number
  }
}

//设置发货
namespace Interface {
  export class SetSendForm {
    TrackCode: string = ''
    MethodName: string | number = ''
    Weight: string = ''
  }

  export class SkuData {
    SkuId: number
    SkuCode: string
    GrossWeight: number
  }

  export class SetSendData {
    AfterSaleOrderType: number
    ApiType: number
    AutoMatchRemark: string
    BatchNumber: string
    BuyerEmail: string
    BuyerRemark: string
    BuyerUserId: string
    Country: null
    CreateTime: string
    DownLoadTime: string
    Id: number
    IsApiDownLoad: boolean
    IsAutoRegistry: boolean
    IsException: boolean
    IsHoldUp: boolean
    IsLockPack: boolean
    IsMerge: boolean
    IsReport: boolean
    IsSplit: boolean
    ItemType: number
    LabelUrl: string
    LogisticsExt: string
    MethodApiCode: string
    MethodName: string
    OrderCode: string
    PaidTime: string
    PayCurrency: string
    PayPrice: number
    PlatOrderTime: string
    Platform: number
    PlatformOrderId: string
    Remark: string
    ShipFee: number
    ShipFeeCurrency: string
    ShipOrderExt: string
    ShipUser: number
    ShipUserName: string
    ShipWarehouseId: number
    ShipedTime: string
    ShippingCost: number
    ShippingMethodId: number
    ShippingService: string
    Sku: Interface.SkuData
    Status: number
    StoreId: number
    StoreName: string
    TotalPrice: number
    TrackingNumber: string
    TransationId: string
    UpPackUser: number
    UpPackUserName: string
    UpPackedTime: string
    WarehouseName: string
    Weight: number
    NewTrackingNumber: number
    HoldUpName: string
    CountryCode?: string 
    CountryNameCn?: string 
  }

  export class PrintData {
    DeliveryTime: Date | string
    WareHouseName: string
    BatchCode: string
    ShipMethodName: string
    TotalShipOrder: number
    TotalWeight: number
  }
}

// 发货批次
namespace Interface {
  export class DeliveryBatchSearchGroup {
    WareHouseId: number | '' = ''  // 发货仓
    ShipMethodId: number | '' = ''  // 物流渠道
    BeginTime: string = '' // 起始时间
    EndTime: string = ''  //结束时间
    SearchKeyType: number | '' = '' // 关键字类型
    SearchKey: string = '' // 搜索关键字
  }

  export class DeliveryBatchTable {
    BatchId: number
    BatchCode: string
    WareHouseName: string
    ShipMethodName: string
    TotalShipOrder: number
    TotalWeight: number
    Operator: string
    Items: DeliveryBatchTableDetail[]
    DeliveryTime: string
  }

  export class DeliveryBatchTableDetail {
    ShipOrderCode: string
    OriginalOrderCode: string
    Country: string
    TrackingNum: string
    Weight: number
  }
}

// 盘点需求
namespace Interface {
  export class ChecktDemandSearch {
    EndTime: string = ''
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    StartTime: string = ''
    Status: number | '' = ''
  }

  export class ChecktDemandList {
    CheckTime: string
    CreateTime: string
    Id: number
    LocationCode: string
    Operator: string
    Quantity: number
    SkuCode: string
    SkuName: string
    Status: number
    WarehouseId: number
    WarehouseName: string
  }

  export class ChecktDemandDetail {
    OrderCode: string
    OrderId: number
    PlatOrderTime: string
    Status: number
  }
}

// 物料申请
namespace Interface {
  export class MaterielApplySearchGroup {
    WarehouseId: number | '' = ''
    SearchKeyType: number | '' = ''
    SearchKey: string = ''
    StartTime: string = ''
    EndTime: string = ''
    Status: number | ''
  }

  export class MaterielApplyTable {
    Id: number
    WarehouseId: number
    MaterialApplyCode: string
    ShipWarehouseName: string
    ProductSpeciesQuantity: number
    Status: number
    CreatedUserName: string
    CreatedTime: string
    Remark: string
    MaterialApplyItems: MaterielApplyDetail[] = []
  }

  export class MaterielApplyDetail {
    Id: number
    MaterialApplyId: number
    SkuId: number
    SkuCode: string
    Image: string
    SkuName: string
    Quantity: number
  }

  export class MaterielApplyModifyTable {
    constructor(
      public SkuId: number,
      public SkuCode: string,
      public SkuName: string,
      public DefaultImage: string,
      public Quantity: number = 1
    ) {
    }
  }

  export class MaterielApplyModify {
    Id: number
    Status: number
    WarehouseId: number
    Remark: string
    MaterialApplyItems: MaterielApplyModifyTable[]
  }

  export class MaterielApplyHistory {
    Number: number
    OperateUserName: string
    OperateTime: string
    Content: string
  }
}

// lazada发票打印
namespace Interface {
  export class LazadaPrintTable {
    OrderCode: string
    PlatformOrderId: number
    Country: string
    ShippingMethodName: string
    ItemType: number
    invoiceUrl: string
  }
}

// 物流退件工单
namespace Interface {
  export class LogisticsReturnOrderSearchGroup {
    ShippingMethodId: number | '' = ''
    Status: number | '' = 1
    StartTime: string = ''
    EndTime: string = ''
    SearchKeyType: number | '' = ''
    SearchKey: string = ''
    ProcessingStatus: number | '' = ''
  }

  export class LogisticsReturnOrderTable {
    Id: number
    ReturnLogisticsCode: string
    ShippingMethodId: number
    ShippingMethodName: string
    Status: number
    ShipOrderCount: number
    CreateTime: string
    UpdateTime: string
    ProcessingStatus: number
  }

  export class LogisticsReturnOrderModifyTable {
    Id: number
    ReturnLogisticsCode: string
    ShippingMethodId: number
    ShippingMethodName: string
    ShipOrderCode: string
    TrackingNumber: string
    PlatOrderTime: string
    ScannedReceiptTime: string
    ReturnReason: string
    IsNewly: boolean
  }

  export class LogisticsReturnOrderModifySubInfo {
    constructor(
      public Id: number,
      public ReturnLogisticsCode: string,
      public ShippingMethodId: number,
      public Status: number,
      public ShipOrderCount: number,
      public CreateTime: string,
      public UpdateTime: string
    ) {
    }
  }

  export class LogisticsReturnOrderModifySubItem {
    constructor(
      public Id: number = 0,
      public ReturnLogisticsCode: string = '',
      public Number: number = 0,
      public ShippingMethodId: number = 0,
      public ShippingMethodName: string = '',
      public ShipOrderCode: string = '',
      public TrackingNumber: string = '',
      public PlatOrderTime: string = '',
      public ReturnReason: string = '',
      public ScannedReceiptTime: string = ''
    ) {
    }
  }

  export class LogisticsReturnOrderDetail {
    ReturnLogisticsInfo: LogisticsReturnOrderTable
    ReturnLogisticsItemResultModel: LogisticsReturnOrderModifySubItem[]
  }

  export class SkuPutWarehouseSearchGroup {
    public WarehouseId: number | '' = ''
    public SkuCode: string = ''
    public SkuCount: number | '' = 1
    public LocationCode: string = ''
    public SkuName: string = ''
  }

  export class SkuInventoryDetail {
    Id: number
    SkuId: number
    SkuCode: string
    SkuName: string
    LocationCode: string
    Quantity: number
    PurchasingQuantity: number
    ShipingQuantity: number
    WaitingShipedQuantity: number
    WaitPickQuantity: number
  }
}

// 装箱出库
namespace Interface {

}

// 装箱出库有记录
namespace Interface {
  export class OutLibLogSearchGroup {
    StartTime: string = ''
    EndTime: string = ''
    FirstShippingMethodType: number | '' = ''
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    ShippingMethodId: number | '' = ''
  }

  export class OutLibLogTable {
    BoxCode: string
    BoxId: number
    BoxOperator: string
    CreateTime: string
    FirstShipOrderCode: string
    FirstShippingMethodType: number
    GrossWeight: number
    OperateTime: string
    ShippingMethodId: number
    ShippingMethodName: string
    TotalBoxCapacity: number
    TotalWeight: number
  }

  export class OutLibLogFirstShipping {
    constructor(
      public BoxCodes: string[] = [],
      public FirstShippingMethodType: number | '' = '',
      public FirstShipOrderCode: string = '',
    ) {
    }
  }

  export class OutLibLogDetailSearchGroup {
    constructor(
      public BoxCode: string = '',
      public Id: number = 0
    ) {
    }

    SearchKey: string = ''
    SearchKeyType: number | '' = ''
  }

  export class OutLibLogDetailTable {
    BoxCode: string
    CountryCode: Interface.DropCountryList
    FirstShipOrderCode: string
    FirstShippingMethodType: number
    GrossWeight: number
    OrderCode: string
    ShippingMethodId: number
    ShippingMethodName: string
    TrackingNumber: string
    UpdateTime: string
    Weight: number
  }
}

namespace Interface {
  export class PackForm {
    BatchCode: string = ''
    SkuCode: string = ''
    Quantity: number = 1
  }
}

export default Interface;