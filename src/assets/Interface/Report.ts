import { namespace } from 'vuex-class'

// 拣货员绩效
namespace Interface {

  export class FifteenDayReportSearch {
    WareHouseId: number = 50
    StartTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).setTime(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 15))
    EndTime: string | Date= new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
  }

  export class FifteenDayReportExport {
    WareHouseId: number = 0
    StartTime: string | Date = ""
    EndTime: string | Date =  ""
  }
}

//采购员绩效
namespace Interface {
  export class PurStatisticsSearch{
    CurrentDate: string = ""
    PurchaserName: string = ""
  }

  export class PurStatisticsList{
    PerformanceAmt: number
    PurchaserName: string
    SkuSaleQuantity: number
    StockoutSkuQty: number
    StockoutSkus: number
  }

  export class PurStatisticsExport {
    PurchaserId: number|"" = ""
    StartTime: string | Date = ""
    EndTime: string | Date =  ""
  }
}

//退付款金额报表
namespace Interface {
  export class StateRefundSearch{
    BeginTime: string = ""
    EndTime: string = ""
    IsPayment: number | "" = ""
  }

  export class StateRefundData{
    CreateTime: string
    Currency: string
    OrderAmount: number
    OrderTotal: number
  }
}

//销售报表
namespace Interface {
  export class AverageSaleSearch{
    CategoryId: number = 0
    ReportDate: string|Date = ""
    SearchKey: string = ""
    SearchKeyType: number | "" = ""
    Status: string = ""
    WareHouseId: number | "" = ""
  }

  export class AverageSalesList{
    CreateTime: string
    Currency: string
    OrderAmount: number
    OrderTotal: number
  }
}

//昨日销量报表
namespace Interface {
  export class YesterdaySearch{
    CategoryId: number = 0
    Platform: number | "" = ""
    SearchKey: string = ""
    SearchKeyType: number | "" = ""
    SortBy: number | "" = ""
    StoreId: number | "" = ""
    WarehouseId: number | "" = ""
  }

  export class YesterdayList{
    AvgSaleQuantity7: number
    AvgSaleQuantity15: number
    AvgSaleQuantity30: number
    AvgSaleQuantity45: number
    AvgSaleQuantity60: number
    Developer: string
    SkuCode: string
    SkuCreateTime: string
    SkuImage: string
    SkuName: string
    Status: number
    WareHouseName: string
  }
}

//预算毛利报表
namespace Interface {
  export class GrossProfitSearch{
    CompareType: number | "" = ""
    CompareValue: number = 0
    Country: string = ""
    DataType: number | "" = ""
    EndTime: string|Date = ""
    ImportFreightType: number | "" = ""
    IsConfirm: boolean = false
    Platform: number | "" = ""
    SearchKey: string = ""
    SearchKeyType: number | "" = ""
    ShipMethodId: number | "" = ""
    ShipWarehouseId: number | "" = ""
    StartTime: string|Date = ""
    StoreId: number | "" = ""
  }

  export class GrossProfitList{
    Country: string
    ExchangeLoss: number
    FirstFreight: number
    OrderCost: number
    OrderFreight: number
    OrderTotal: number
    PaidTime: string
    PaypalServiceCharge: number
    PlatOrderTime: string
    Platform: number
    PlatformCommission: number
    Profit: number
    ProfitRate: number
    RefundAmount: number
    SecondFreight: number
    ShipMethodName: string
    ShipOrderCode: string
    ShipOrderId: number
    ShipWarehouseName: string
    ShipedTime: string
    StoreName: string
    TrackingNumber: string
    Weight: number
  }

  export class GrossProfitExport extends GrossProfitSearch{
    ExportType: number|"" = ""
    constructor(){
      super()
    }
  }

  export class GrossProfitExportForm{
    ExportType: number|"" = ""
  }

  export class HistoryData{
    OperateContent: string
    OperateTime: string
    OperateUserName: string
    ShipOrderCode: string
  }

  export class ImportTypeForm{
    ImportType: number| "" = ""
  }
}

//毛利汇总报表
namespace Interface{
  export class SumSalesProfitSearch {
    BeginTime: string|Date = ""
    EndTime: string|Date = ""
    Platform: number | "" = ""
    StoreId: number | "" = ""
    TimeType: number | "" = ""
  }

  export class SumSalesProfitData {
    Platform: number
    SalesAmount: number
    SalesProfit: number
    StoreId: number
    StoreName: string
    TimeZone: string
  }
}

//商品售出率
namespace Interface{
  export class GoodsSalesRateSearch {
    CategoryId: number = 0
    DevUserId: number|"" = ""
    InStorageTime: string|Date = ""
    PayTime:  string|Date = ""
    SkuStatus: number|"" = ""
    SoldRateEnd: string = ""
    SoldRateStart: string = ""
    WareHouseId: number|"" = ""
  }

  export class GoodsSalesRateList {
    DevUserName: string
    FirstInStorageTime: string
    ImageUrl: string
    InStorageQuantity: number
    SkuCode: string
    SkuCreateTime: string
    SkuName: string
    SkuStatus: number
    SoldQuantity: number
    SoldRate: number
  }
}

//eBay Invoice报表 
namespace Interface{
  export class EbayInvoiceSearch {
    EndTime: string = ""
    SearchKey: string = ""
    SearchKeyType: number|"" = ""
    StartTime: string = ""
    StoreId: number|"" = 0
  }

  export class EbayInvoiceList {
    Alias: string
    CostType: string
    Currency: string
    Description: string
    StoreName: string
    TotalPrice: number
  }
}

//订单销量报表 
namespace Interface{
  export class SalesOrdersSearch {
    BeginTime: string = ""
    EndTime: string = ""
    Platform: number|"" = ""
    StoreId: number | "" = ""
  }
  export class SaleOrdersList{
    CancelOrderAmount: number
    CancelOrderTotal: number
    OrderAmount: number
    OrderTotal: number
    Platform: number
    StoreId: number
    StoreName: string
  }
}

//订单销量报表 
namespace Interface{
  export class WishPbDataSearch {
    StartTime: string = ""
    StoreId: number = 0
  }

  export class WishPbDataList {
    Alias: string
    Cost: number
    StoreName: string
  }
}

//库存金额统计报表 
namespace Interface{
  export class InventAmtReportSearch{
    WarehouseId: number | "" = ""
    SearchKey: string = ""
    SearchKeyType: number | "" = ""
  }

  export class InventAmtReportList{
    Amount: number
    AvgPrice: number
    Image: string
    LocationCode: string
    PurchasingQuantity: number
    Quantity: number
    ShippingQuantity: number
    SkuCode: string
    SkuName: string
    WaitPickQuantity: number
    WaitingShipedQuantity: number
    WarehouseName: string
  }
}

//导出管理
namespace Interface{
  export class ExportManageSearch{
    ModuleId: number | "" = ""
    SearchKey: string = ""
    Status: number | "" = ""
  }

  export class ExportManageList{
    CreateTime: string
    Id: number
    ModuleName: string
    PathUrl: string
    ProcessTime: string
    Remark: string
    ReportName: string
    ReportType: number
    Status: number
    UserName: string
    UserRemark: string
  }
}

//货运退款率统计报表
namespace Interface{
  export class FreightRefundSearch{
    BeginTime: string = ""
    EndTime: string = ""
    ShippingMethodId: number | "" = ""
    StoreId: number | "" = ""
  }

  export class FreightRefundList{
    
  }
}


export default Interface;