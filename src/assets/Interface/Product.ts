import { namespace } from 'vuex-class'

// 品牌管理
namespace Interface {
  export class BrandManageList {
    Id: number = 0
    BrandName: string = ""
    BrandLogo: string = ""
    BrandUrl:string = ""
    Remark: string = ""
    CreateTime: string | Date = ""
  }

  export class BrandManageSearch {
    SearchKey: string = ""
  }
}

// 品类管理
namespace Interface {
  export class ProductCagtegoryList {
    Id: number = 0
    CategoryName: string = ""
    CategoryCode: string = ""
    ParentId: number = 0
    PurchaseUserId: number = 0
    PurchaseUserName:string = ""
    IsEnable: boolean
    CreateTime: string = ""
  }

  export class ProductCagtegorySearch {
    IsEnable: boolean | "" = ""
    SearchKey: string = ""
    SearchKeyType: number | "" = ""
    ParentId: number = 0
  }
}
// 特性标签
namespace Interface {
  export class ProLabelList {
    Id: number = 0
    IsEnable: boolean = true
    Name: string
    OperateTime: string
    Operator: null = null
    OperatorId: number
  }

  export class ProLabelSearch {
    IsEnable: number | string = ""
    SearchKey: string = ""
  }
}

// 申报敏感词
namespace Interface {
  export class SensitiveWordSearch {
    IsEnable: boolean | "" = ""
    KeyWord: string = ""
    SearchKeyType: number | "" = ""
    Type: number = 0
  }

  export class SensitiveWordList {
    Id: number = -1
    Type: number = 0
    KeyWord: string = ""
    IsEnable: boolean
  }

}

// 新品开发
namespace Interface {
  // 列表
  export class ProductDevList {
    Id: number = 0
    ImageUrl: string = ""
    ProductName: string = ""
    Platfrom: number = 0
    SaleKeyWord: string = ""
    Weight: number = 0
    SupplyName: string = ""
    PurchasePrice: number = 0
    PPCurrencyCode: string = ""
    PurchaseUrl: string = ""
    MatchPrice: number = 0
    MPCurrencyCode: string = ""
    MatchUrl: string = ""
    SalePrice: number = 0
    SPCurrencyCode: string = ""
    Operator: string = ""
    OperateTime: string = ""
    SkuCode: string = ""
    Remark: string = ""
    Status: number = 0
    PropertyList: ProductDevPropertyList[]
  }

  // 列表
  export class ProductDevPropertyList {
    ProductId: number = 0
    PropertyName: string = ""
    PropertyCount: number = 0
  }

  // 新品开发搜索
  export class ProductDevSearch {
    Status: number = 0
    Attribute: string | number[]= ""
    CategoryId: number = 0
    Platfrom: number = 0
    DevUserId: number = 0
    DevManager: number = 0
    SaleManager: number = 0
    DevBeginDate: string = ""
    DevEndDate: string = ""
    SearchType: number = 0
    SearchKey: string = ""
  }

  // 新品开发详情
  export class ProductDevDetails {
    Id: number = 0
    ImageUrl: string = ""
    ProductName: string = ""
    Platfrom: number = 0
    SaleKeyWord: string = ""
    Weight: number = 0
    CategoryId: number | number[] | string[] = []
    CategoryName: string = ""
    CategoryNum: string = ""
    SalePrice: number = 0
    SPCurrencyCode: string = ""
    GrossProfit: number = 0
    DevManager: number = 0
    DevMangerName: string = ""
    SaleManager: number = 0
    SaleManagerName: string = ""
    Creator: number = 0
    CreatorName: string = ""
    CreateTime: string = ""
    CompleteTime: string = ""
    Remark: string = ""
    Status: number = 0
    Attribute: number[] = []
    AttributeName: string = ""
  }

  // 特性标签
  export class ProductAttribute{
    ProductId: number = 0
    AttributeId: number = 0
    AttributeName: string = ""
  }

  // 利润率 利润 预售价表格
  export class ProfitData {
    GrossProfit:  number = 0 //利润率
    Profits:  number = 0 //利润
    CurrencyCode:  string = "CNY" //利润币种
    SalePrice:  number = 0 //预售价
    SPCurrencyCode:  string = "USD" //预售价币种
  }

  // 供应商信息
  export class ProductSupplyInfo {
    Id: number = 0
    ProductId: number = 0
    SupplyId: number = 0
    SupplyName: string = ""
    PurchasePrice: number = 0
    CurrencyCode: string = "CNY"
    PurchaseUrl: string = ""
    IsDefault: boolean = true
  }

  // 供应商模型
  export class Supplier {
		Id: number = 0
		SupplyName: string = ''
		Contact: string = ''
		Phone: string = ''
		Email: string = ''
		QQNum: string = ''
		AliNum: string = ''
		Url: string = ''
		Province: number | string = ""
		ProvinceName?: string = ''
		City: number | string = ''
		CityName?: string = ''
		Area: number | string = ''
		AreaName?: string = ''
		Street: string = ''
		ZipCode: string = ''
		BillType: number = 0
		PayType: number = 0
		BankName: string = ''
		BankAccount: string = ''
		BankNumber: string = ''
		Remark: string = ''
		IsEnable: boolean = true
		OperatorId: number = 0
		OperateTime: string = ''
		AccountPeriod: number = 0
	}
  
  // 竞品信息
  export class ProductMatch{
    Id: number = 0
    ProductId: number = 0
    SalePrice: number = 0
    CurrencyCode: string = ""
    SaleUrl: string = ""
    IsDefault: boolean = true
  }

  // 新品属性
  export class ProductProperty {
    Id: number = 0
    ProductId: number = 0
    PropertyName: string = ""
    PropertyValue: PropertyValue[] = [new PropertyValue()]
  }

  // 属性信息 
  export class PropertyValue {
    Id: number = 0
    PropertyId: number = 0
    PropertValue: string = ""
  }

  // 编辑 新品开发
  export class ModifyProductDev {
    Product: ProductDevDetails
    Supply: ProductSupplyInfo[]
    Match: ProductMatch[]
    Property: ProductProperty[]
    Attribute: ProductAttribute[]
    IsToReview: boolean = false
  }

  // 审核记录
  export class ReviewList {
    Id: number = 0
    Operator: string = ""
    OperateType: number = 0
    OperateTime: string = ""
    Remark: string = ""
  }

  export class ChangeStatusData {
		Id: number[] = []
		Remark: string = ''
		ReviewType: number = 1
	}
}

// SKU别名
namespace Interface {
  export class SkuMapSearch {
    SearchKeyType: number | "" = "" 
    SearchKey: string = ""
  }

  export class SkuMapList {
    SkuId: number = 0
    SkuCode: string = ""
    SkuName: string = ""
    SkuNameEn: string = ""
    MapCode: string = ""
    MainId: number | "" = ""
    HasProperty: boolean = false
  }

  export class ModifySkuMap {
    SkuId: number = 0
    SkuCode: string = ""
    MapCode: string | string[] = ""
  }
}

// SKU管理
namespace Interface {
  export class SkuManageList {
    Id: number
    SkuCode: string
    HasProperty: boolean
    DefaultImage: string
    SkuName: string
    Platform: number
    BrandName: string
    CategoryName: string
    Attribute: string
    DevUserName: string
    Purchaser: string
    SaleManager: string
    DefaultSupply: DefaultSupply
    CreateTime: string
    Status: number
    Length: number
    Width: number
    Height: number
    GrossWeight: number
    NetWeight: number
    MainId: number
  }

  export class DefaultSupply {
    SupplyId: number
    PurchasePrice: number
    CurrencyCode: string
    SupplyName: string
  }

  export class SkuManageSearch {
    SearchKey: string = ""
    Platfrom: number | "" = ""
    Attribute: string | number[] = []
    DevUserId: number | "" = ""
    Purchaser: number | "" = ""
    SaleManager: number | "" = ""
    DevManager: number | "" = ""
    Status: number | "" = ""
    BrandId: number | "" = ""
    SearchType: number | "" = ""
    CategoryId: number | "" = ""
    MainId: number | "" = ""
    IsBindSku: number | "" = "" 
  }
  
  // SKU详情
  export class SkuDetails {
    SkuInformation: SkuInformation = new SkuInformation()
    SkuAttribute:number[] | SkuAttribute[] = []
    SkuImages: SkuImages[] = []
    SkuDeclare: SkuDeclare = new SkuDeclare()
    SkuBind: SkuBind[] = []
  }
  
  // SKU信息
  export class SkuInformation {
    Id: number = 0
    SkuCode: string = ""
    SkuName: string = ""
    SkuNameEn: string = ""
    SaleKeyWords: string = ""
    Status: number = 0
    IsNew: boolean = false
    BrandId: number = 0
    BrandName: string = ""
    CategoryId: number | number[] | string[] = []
    CategoryName: string = ""
    DefaultImage: string = ""
    Platform: number = 0
    DevManager: number = 0
    DevManagerName: string = ""
    SaleManager: number = 0
    SaleManagerName: string = ""
    Purchaser: number = 0
    PurchaserName: string = ""
    DevUserId: number = 0
    DevUserName: string = ""
    DevTime: string = ""
    Length: number = 0
    Width: number = 0
    Height: number = 0
    GrossWeight: number = 0
    NetWeight: number = 0
    WeightRemark: string = ""
    Pcs: number = 0
    MainId: number = 0
    HasProperty: boolean = false
    Remark: string = ""
    Description: string = ""
    Sizes: string = ""
    CreateTime: string = ""
  }

  // 特性标签
  export class SkuAttribute {
    SkuId: number
    AttributeId: number = 0
    AttributeName: string = ""
  }

  // 上架图片
  export class SkuImages {
    Id: number | "" = ""
    SkuId: number = 0
    ImageUrl: string = ""
    ImageName: string = ""
    Folder: string = ""
    SortId: number = 0
  }

  // 申报信息
  export class SkuDeclare {
    SkuId: number = 0
    DeclareName: string = ""
    DeclareNameCN: string = ""
    DeclareCode: string = ""
    DeclareAmout: number = 0
  }

  // 捆绑SKU
  export class SkuBind {
    SkuId: number = 0
    SkuCode: string = ""
    SkuName: string = ""
    DefaultImage: string = ""
    Quantity: number = 0
  }
  
  // SKU变体
  export class SkuProperty{
    Id: number = 0
    SkuCode: string = ""
    SkuName: string = ""
    SkuNameEn: string = ""
    DefaultImage: string = ""
    Length: number = 0
    Width: number = 0
    Height: number = 0
    GrossWeight: number = 0
    NetWeight: number = 0
    WeightRemark: string = ""
    Pcs: number = 0
    MainId: number = 0
    HasProperty: boolean = false
  }

  // 设置状态
  export class SettingMsg {
    SettingValue: number | "" = "" 
    ArrayValue: number[] = []
  }

  export class ImportSkuForm {
    IsBindSku: string = "0"
  }

  export class SkuSaleVolume {
    7: number = 0
    15: number = 0
    30: number = 0
    45: number = 0
    60: number = 0
  }
}

// 作图需求
namespace Interface {
  export class DrawingRequirementsList {
    Id: number = 0
    SkuId: number = 0
    SkuCode: string = ""
    SkuName: string = ""
    CreateUserName: string = ""
    OperateUserName: string = ""
    CreateTime: string | Date = ""
    ExpectTime: string | Date = ""
    Description: string = ""
    ProcessStatus: number = 0
  }

  export class DrawingRequirementsSearch {
    ProcessStatus: number | "" = 2
    CreateUserId: number | "" = ""
    OperateUserId: number | "" = ""
    OrderByType: number | "" = 1
    SearchKeyType: number | "" = ""
    SearchKey: ""
    CategoryId: number[] = []
    TimeType: number | "" = ""
    StartTime: string | Date = ""
    EndTime: string | Date = ""
  }

  export class DrawingRequirementsModify {
    Id: number = 0
    SpuCodes: string[] = []
    SkuCodes: string[] = []
    OperateUserId: 343
    ExpectTime: string | Date = ""
    Description: string = ""
    IsToArtist: boolean = false
  }

  // 主Spu
  export class MainSpu {
    Id: number = 0
    Name: string = ""
    SkuList: SkuManageList[] | object[] = []
  }

  export class DrawingRequirementsDetail {
    Id: number = 0
    CreateUserName: string = ""
    CreateTime: string | Date = ""
    OperateUserName: string = ""
    OperateUserId: number | "" = ""
    ExpectTime: string | Date = ""
    ProcessStatus: 3
    SpuList: SpuSkuList[] = []
    SkuList: SpuSkuList[] = []
    Description: string = ""
    Images: string[] = []
    ProcessHistorys: ProcessHistorys[] = []
  }

  export class SpuSkuList {
    SkuId: number = 0
    SkuCode: string = ""
    Image: string = ""
    SkuName: string = ""
    ParentSkuId: number = 0
  }

  // 审核记录
  export class ProcessHistorys {
    Id: number = 0
    AuditorName: string = ""
    AuditTime: string = ""
    OperateLog: string = ""
  }

  // 提交美工处理 审核 需求退回修改
  export class ToAristProcessForm {
    PhotoProcessRequestIds: number[] = []
    ChangeArtistId: number = 0
    IsPass: boolean = true
    Remark: string = ""
    File: ""
  }
  

  // 更换美工
  export class ChangeArtistForm {
    Id: number[] = []
    OperateUserId: number = 0
  }
  

}

//拍摄需求
namespace Interface{
  export class PhotoRequestSearch{
    Operator: number = 0
    SaleUserId: number = 0
    SearchKey: string
    SearchKeyType: number = 0
    Status: number = 0
  }

  export class PhotoRequestList{
    CreateTime: string = ""
    Creator: number
    CreatorName: string = ""
    DemoUrl: string = ""
    Id: number
    IsToHandle: false
    OperateTime: string = ""
    Operator: number
    OperatorName: string = ""
    Remark: string = ""
    SkuCode: string = ""
    SkuId: number
    SkuName: string = ""
    Status: number
    SkuImage: string[] = []
  }

  export class GetSkuImagesData{
    Folder: string
    Id: number
    ImageName: string
    ImageUrl: string
    SkuId: number
    SortId: number
  }

  export class PhotoRequestHistory{
    Id: number
    OperateLog: string
    OperateTime: string
    Operator: string
  }

  export class PhotoRequestMsg{
    Id: number = 0
    SkuCode: string = ""
    SkuId: number = 0
    DemoUrl: string = ""
    Operator: number|"" = ""
    Remark: string = ""
    IsToHandle: boolean
  }
}


//海外仓产品管理
namespace Interface{
  export class OverseasWareManageSearch{
    CategoryId: number = 0
    CountryCode: string = ""
    IsActive: string | number = ""
    IsEnable: string | number = ""
    SearchKey: string = ""
    SearchKeyType: number = 0
    Status: number = 0
  }

  export class OverseasWareManageList{
    CategoryId: number
    CategoryName: string
    CountryCode: string
    CountryNameCn: string
    DefaultImage: string
    Id: number
    IsActive: boolean
    IsEnable: boolean
    OverseaSkuCode: string
    OverseaSkuName: string
    Remark: string
    Status: number
  }

  export class OverseasWareManageExport extends OverseasWareManageSearch{
    Ids: number[] = []
    constructor(){
      super()
    }
  }

  export class OverseasWareManageDetail{
    CountryCode: string = ""
    CountryNameCn: string = ""
    DeclareName: string = ""
    DeclareUrl: string = ""
    DefaultImage: string = ""
    ExportDeclareAmout: number = 0
    GrossWeight: number = 0
    Height: number = 0
    Id: number = 0
    ImportDeclareAmout: number = 0
    IsBattery: boolean
    Length: number = 0
    OverseaSkuCode: string = ""
    OverseaSkuName: string = ""
    Remark: string = ""
    Width: number = 0
  }
}

export default Interface
