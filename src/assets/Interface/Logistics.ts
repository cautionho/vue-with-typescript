import { namespace } from 'vuex-class'

//客户管理
namespace Interface {
  export class CustomerManageSearch {
    Province: number = 0
    City: number = 0
    Area: number = 0
    IsEnable: boolean | '' = ''
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    Status: number | '' = 0
  }

  export class CustomerManageList {
    Area: number
    AreaName: string
    Balance: number
    City: number
    CityName: string
    Company: string
    Contact: string
    CreateTime: string
    CreditsBalance: number | '' = ''
    CustomerCode: string = ''
    Email: string
    Id: number
    IsEnable: boolean
    Phone: string
    Province: number
    ProvinceName: string
    Remark: string
    Status: number
    Street: string
    ZipCode: string
  }

  //调整额度
  export class UpdCredForm {
    CustomerId: number = 0
    NewCreditsBalance: number | string = ''
  }

  //充值
  export class RechargeForm {
    Amount: string | number = ''
    CustomerCode: string = ''
    Remark: string = ''
  }

  export class CustomerInfo {
    Area: number | string = ''
    AreaName: string = ''
    Balance: number = 0
    City: number | string = ''
    CityName: string = ''
    Company: string = ''
    Contact: string = ''
    CreateTime: string = ''
    CreditsBalance: number = 0
    CustomerCode: string = ''
    Email: string = ''
    Id: number = 0
    IsEnable: boolean | '' = ''
    Phone: string = ''
    Province: number | string = ''
    ProvinceName: string = ''
    Remark: string = ''
    Status: number | '' = ''
    Street: string = ''
    ZipCode: string = ''
  }

  export class DiscountInfo {
    AdditionalFeeDiscount: number = 1
    CustomerCode: string = ''
    CustomerId: number = 0
    FeeDiscount: number = 1
    MethodName: string = ''
    ProcessingDiscount: number = 1
    RegistryDiscount: number = 1
    ShippingMethodId: number = 0
  }

  export class ModifyCustomer {
    Customer: Interface.CustomerInfo = new Interface.CustomerInfo()
    Discount: Interface.DiscountInfo[] = []
  }
}

//地址管理
namespace Interface{
  export class AddressManageSearch{
    CountryCode: string = ""
    IsEnable: number | "" = ""
    SearchKey: string = ""
    SearchKeyType: number = 0
  }
  
  export class AddressManageList{
    AddressAlias: string = ""
    City: string = ""
    Company: string = ""
    Contact: string = ""
    CountryCode: string = ""
    CountryName: string
    District: string = ""
    Email: string = ""
    Id: number = 0
    IsEnable: boolean
    Mobile: string = ""
    State: string = ""
    Street1: string = ""
    Street2: string = ""
    TelPhone: string = ""
    ZipCode: string = ""
  }
}

// 交易流水
namespace Interface {
  export class TransactionRecordSearchGroup {
    CountryCode: string = ''
    EndTime: string = ''
    MethodId: number | '' = ''
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    StartTime: string = ''
    TransactionType: number | '' = ''
    WarehourseId: number | '' = ''
  }

  export class TransactionRecordTable {
    CountryCode: string
    CountryNameCn: string
    CustomerBalance: number
    CustomerCode: string
    Id: number
    MethodApiCode: string
    MethodName: string
    OperateTime: string
    Operator: string
    OrderCode: string
    Remark: string
    TrackingNumber: string
    TransactionAmount: number
    TransactionCost: number
    TransactionType: number
    WarehouseName: string
    Weight: number
  }
}

//运费预计算
namespace Interface{
  export class ShippingCostCaculateSearch {
    CountryCode: string = ""
    Height: string = ""
    Length: string = ""
    Weight: string = ""
    Width: string = ""
    ZipCode: string = ""
    MethodId: number = 0
  }

  export class ShippingCostCaculateList{
    Currency: string
    Fee: number
    IsRegistry: true
    MethodCode: string
    MethodId: number
    MethodName: string
    Remark: string
    UndiscountedTotalFee: number
  }
}

//授权
namespace Interface{
  export class AuthorizeSearch{
    IsEnable: number | "" = ""
    SearchKey: string = ""
    SearchKeyType: number = 0
  }

  export class AuthorizeData{
    AccountName: string = ""
    Alias: string = ""
    Id: number = 0
  }
}

//虚拟渠道
namespace Interface{
  export class VirtualChannelSearch{
    IsEnable: number | "" = ""
    SearchKey: string = ""
    ShippingMethodId: number = 0
    WarehouseId: number = 0
  }

  export class ChannelList{
    ShipMethodId: number
    ShipMethodName: string
  }

  export class VirtualChannelList{
    BindShipMethods: Interface.ChannelList[] = []
    CreateTime: string
    Id: number = 0
    IsEnable: boolean
    Remark: string = ""
    VirtualChannelName: string = ""
    WarehouseId: number | "" = ""
    WarehouseName: string = ""
  }
}

//trackmoce物流跟踪
namespace Interface{
  export class TrackingmoreSearch{
    BeginTime: string = ""
    CountryCode: string = ""
    EndTime: string = ""
    PackageStatus: number = 0
    Platform: number = 0
    SearchCompareType: number = 0
    SearchKey: string = ""
    SearchKeyType: number =0
    SearchTimeLimitType: number = 0
    SearchTimeType: number = 0
    ShippingMethodId: number | "" = ""
    StoreId: number | "" = ""
    TimeLimitValue: number = 0
    WarehouseId: number = 0
  }

  export class TrackingmoreList{
    CountryName: string
    Id: number
    ItemReceived: string
    ItemTimeLength: number
    LogisticsInfo: string
    OrderCode: string
    PackageStatus: number
    PlatformId: number
    ShipedTime: string
    ShippingMethodName: string
    StayTimeLength: number
    StoreName: string
    TrackingNum: string
    UpdateTime: string
    WarehouseName: string
  }

  export class TrackmoreDetail{
    Record: string
    StatusDescription: string
    UpdateTime: string
  }

  export class ExportData{
    BeginTime: string = ""
    CountryCode: string = ""
    EndTime: string = ""
    PackageStatus: number = 0
    Platform: number = 0
    SearchTimeType: string = '1'
    ShippingMethodId: number = 0
    StoreId: number | "" = 0
    WarehouseId: number = 0
  }
}

export default Interface