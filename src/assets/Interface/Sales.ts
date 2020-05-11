import PInterface from '@/assets/Interface/Public';

namespace Interface {
  export class StoreSearch {
    IsEnable: boolean | string = ''
    IsUseApi?: boolean | string = ''
    PaypalAccountId?: string = ''
    SiteCode?: string = ''
    LazadaSiteType?: string | number = ''
    SearchKeyType: string | number = ''
    SearchKey: string = ''
  }

  export class StoreList {
    Id: number
    StoreName: string
    StoreUrl?: string
    Alias: string
    Expiration?: string
    LastOrderSysncTime?: string
    PaypalAccountId?: number
    PaypalAccoutnName?: string
    IsEnable: boolean
    IsUseApi?: boolean
    CreateTime: string
    JumpAddr?: string
    LoginIp?: string
    Password?: string
    InvoiceCurrency?: string
    SiteName?: string
    Site?: string
    SiteType?: number
    LazadaSiteType?: number
    AccountName?: string
    CustomerCode?: string
  }

  export class EbayStore {
    Id: number = 0
    StoreName: string = ''
    StoreUrl: string = ''
    Alias: string = ''
    Expiration: string = ''
    LastOrderSysncTime: string = ''
    PaypalAccountId: number = 0
    PaypalAccoutnName: string = ''
    IsEnable: boolean | string = false
    CreateTime: string = ''
    IsUseApi: boolean | string = ''
    JumpAddr: string[] | string = []
    LoginIp: string = ''
    Password: string = ''
    InvoiceCurrency: string = ''
  }

  export class WishStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    IsUseApi: string | boolean = ''
    CreateTime: string = ''
    Expiration: string = ''
    IsEnable: string | boolean = ''
    LastOrderSysncTime: string = ''
  }

  export class AmazonStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    SiteCode: string[] = []
    SiteName: string = ''
    SellerId: string = ''
    MWSAuthToken: string = ''
  }

  export class ShopeeStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    ShopId: string = ''
    Site: number = 0
  }

  export class WalmartStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    ClientId: string = ''
    ClientSecret: string = ''
  }

  export class CdiscountStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    ApiLogin: string = ''
    ApiPassword: string = ''

  }

  export class JoomStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    ClientId: string = ''
    ClientSecret: string = ''
    WarehouseId: string = ''
  }

  export class FyndiqStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    MerchantId: string = ''
    Token: string = ''
  }

  export class TophatterStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    AccessToken: string = ''
  }

  export class FactoryMarketStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    ClientId: string = ''
    ClientSecret: string = ''
  }

  export class VovaStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    Token: string = ''
    PlatformId: string = ''
  }

  export class MyMallStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    UserName: string = ''
    Passwords: string = ''
    ClientId: string = ''
    ClientSecret: string = ''
  }

  export class JumiaStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    UserId: string = ''
    APIKey: string = ''
    SiteType: string = ''
  }

  export class AllegroStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    ClientId: string = ''
    ClientSecret: string = ''
  }

  export class LazadaStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    LazadaSiteType: string = ''
  }

  export class GrouponStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    SupplierId: string = ''
    Token: string = ''
  }

  export class RealDeStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    ClientId: string = ''
    ClientSecret: string = ''
  }

  export class RakutenStore{
    Id: number = 0
    Alias: string = ''
    Key: string = ''
    StoreName: string = ''
  }

  export class NeweggStore{
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    SellerId: string = ''
    SecretKey: string = ''
  }

  export class OtherStore {
    Id: number = 0
    StoreName: string = ''
    Alias: string = ''
    CommissionRate: string = ''
  }

  export class AllStore {
    '1': EbayStore = new EbayStore()
    '2': WishStore = new WishStore()
    '3': AmazonStore = new AmazonStore()
    '4': ShopeeStore = new ShopeeStore()
    '5': WalmartStore = new WalmartStore()
    '6': CdiscountStore = new CdiscountStore()
    '8': JoomStore = new JoomStore()
    '9': FyndiqStore = new FyndiqStore()
    '11': TophatterStore = new TophatterStore()
    '12': FactoryMarketStore = new FactoryMarketStore()
    '13': VovaStore = new VovaStore()
    '14': MyMallStore = new MyMallStore()
    '16': JumiaStore = new JumiaStore()
    '17': AllegroStore = new AllegroStore()
    '18': LazadaStore = new LazadaStore()
    '19': GrouponStore = new GrouponStore()
    '20': RealDeStore = new RealDeStore()
    '21': RakutenStore = new RakutenStore()
    '22': NeweggStore = new NeweggStore()
    '99': OtherStore = new OtherStore()
  }

  export class RedisDB {
    DbNum: string = ''
    StoreId: number = 0
  }

  export class AllegroLocation {
    StoreId: number = 0
    Country: string = ''
    City: string = ''
    ZipCode: string = ''
  }
}

// listing更新记录分页提交参数
namespace Interface {
  export class ListingUpdateSearch {
    ErpSkuCode: string = ''
    ItemId: string = ''
    ListingSkuCode: string = ''
    PageIndex: number = 1
    PageSize: number = 20
    PlatformId: string | number = ''
    ReviseStatus: string | number = ''
    ReviseType: string | number = ''
    StoreId: string = ''
    UpdateTimeEnd: string = ''
    UpdateTimeStart: string = ''
    SearchKey: string = ''
    SearchType: string | number = ''
  }

  export class ListingUpdateList {
    ErpSkuCode: string
    Id: number
    ItemId: string
    ListingSkuCode: string
    PlatformId: number
    Remarks: string
    ReviseStatus: number
    ReviseType: number
    StoreName: string
    UpdateTime: string
  }
}

// 店铺授权
namespace Interface {
  export class OrganizationTree {
    Id: number = 0
    Name: string
    ParentId: number = 0
    Icon?: string
    PrincipalId: number
    ChildNodes: OrganizationTree[]
    title?: string
    expand?: boolean
    children: OrganizationTree[] = []
    label?: string
    value: string = '0'
  }

  export class OriginalTreeData {
    PlatformId: number = 0
    PlatformName: string = ''
    StoreId: number = 0
    StoreName: string = ''
    IsOwn: boolean
  }

  export class ShopAuthorizationTree {
    Value: number = 0
    Key: string
    parent: number = 0
    title: string
    checked?: boolean
    children: ShopAuthorizationTree[] = []
    value: string = '0'
  }

  export class SubmitPower {
    PlatformId: number = 0
    StoreId: number = 0
    IsChange: boolean
  }

  // 已选店铺
  export class SelectedShop {
    Platform: string
    Store: string[]
  }

  // 已选姓名
  export class SelectedUserName {
    UserName: string
    UserId: number
  }


  // 搜索框
  export class AuthorizationSearchForm {
    OrganizationId: number | '' = ''
    PositionId: number | '' = ''
    SearchType: string = ''
    SearchKey: string = ''
  }

  // 列表
  export class ShopAuthorizationList {
    Id: number = 0
    UserName: string = ''
    UserCode: string = ''
    Sex: number = 0
    Email: string = ''
    TelePhone: string = ''
    PositionName: string = ''
    OrganizationName: string = ''
    Status: number = 0
    CreateTime: string = ''
    MaritalStatus: number = 0
    ConfirmId: number = 0
    SReviewId: number = 0
    MReviewId: number = 0
  }
}

//allegro上传产品
namespace Interface {
  export class AllegroUploadProSearch {
    CategoryId: string | number = 0
    EndTime: string = ''
    SearchKey: string = ''
    SearchKeyType: string | number = ''
    StartTime: string = ''
    Status: string | number = ''
    StoreId: string | number = ''
  }

  //级联类目
  export class CascaderCategory {
    value: string
    label: number
    children: CascaderCategory[]
    loading: boolean
    arr: string[]
  }

  export class AllegroUploadProList {
    CategoryId: number
    CategoryName: string
    FailMessage: string
    Id: number
    Image: string
    OfferId: number
    OperatorId: number
    OperatorName: string
    OperatorTime: string
    SkuCode: string
    SkuId: number
    SkuName: string
    Status: number
    StoreName: string
  }
}

// eBay 刊登风格
namespace Interface {
  export class EBayStyleSearchGroup {
    IsEnable: number | '' = ''
    SearchKey: string = ''
  }

  export class EBayStyleTable {
    constructor(
      public Id: number = 0,
      public Title: string = '',
      public Description: string = '',
      public IsEnable: boolean = true
    ) {
    }
  }
}

// eBay 刊登新产品
namespace Interface {
  export class EnumKV {
    [Index: number]: string
  }

  // 站点分类
  export class SiteAndClassify {
    SiteId: number | '' = '' // 站点
    ListingType: number | '' = '' // 出售方式
    Currency: string = '' // 币种
    CrossBorderTrade: boolean | '' = ''// $其他站点可见
    CategoryId: string[] = [] // 刊登分类1
    SecondaryCategoryId: string[] = [] // 刊登分类2
    ProductID: string = '' // ProductID
    ProductType: number | '' = '' // 币种类型
    ConditionID: string = '' // 物品状况
    ConditionDescription: string = ''// 物品描述
    WriteCategoryId: number | '' = ''// 直接输入类目ID_A
    WriteSecondaryCategoryId: number | '' = ''
  }

  // 站点类目信息
  export class SiteOther {
    CurrencyCodes: string[]
    DispatchTimes: number[]
    ReturnsWithin: string[]
    SiteCode: string
    SiteId: number | ''
    SiteName: string
    Taxs: PInterface.KV[]
  }

  // 刊登分类默认数据
  export class SiteCategoryDefault {
    CategoryID: string
    CategoryName: string
    CategoryParentID: string
    CategoryParentName: string
    CategoryLevel: number
    LeafCategory: boolean
    SiteId: number
    LastUpdateTime: string
  }

  // 刊登分类整合后的数据
  export class SiteCategory {
    constructor(
      public value: string = '',
      public label: string = '',
      public children: SiteCategory[] = [],
      public parentId: number = 0,
      public loading?: boolean
    ) {
    }
  }

  // 站点模板
  export class AllTempPublishRelated {
    BuyerRestrictionsData: Temp_BuyerRestrictionsData[] = []
    CollectionOptionsData: Temp_CollectionOptionsData[] = []
    DescriptionsData: EnumKV
    ExcludeData: Temp_ExcludeData[]
    ProductLocationData: Temp_ProductLocationData[]
    ReturnsSettingsData: Temp_ReturnsSettingsData[]
    ShippingData: Temp_ShippingData[]
  }

  export class Temp_BuyerRestrictionsData {
    EbayTempName: string
    FeedbackScore: number
    LimitAuctionFrequency: number
    SiteId: number
    TempId: number
    UnpaidFrequency: number
    ViolationPeriod: number
  }

  export class Temp_CollectionOptionsData {
    Description: string
    EbayTempName: string
    IsImmediatePayment: number
    PayPalEmail: string
    PayPalId: number
    PaymentMethod: string[]
    PaymentMethodIds: number[]
    SiteId: number
    TempId: number
  }

  export class Temp_ExcludeData {
    EbayCountryIds: number[]
    EbayTempName: string
    SiteId: number
    TempId: number
  }

  export class Temp_ProductLocationData {
    CountryCode: string
    EbayTempName: string
    PostCode: string
    ProductUrl: string
    SiteId: number
    TempId: number
  }

  export class Temp_ReturnsSettingsData {
    AcceptReturns: number
    Description: string
    EbayTempName: string
    FreightBurden: number
    IntAcceptReturns: number
    IntFreightBurden: number
    IntReturnMethod: number
    IntReturnPeriod: string
    ReturnMethod: number
    ReturnPeriod: string
    SiteId: number
    TempId: number
  }

  export class Temp_ShippingData {
    Id: number
    SiteId: number
    TempName: string
    TempType: number
  }

  // 站点基础信息
  export class SiteFeatures {
    CurrencyCodes: null
    FeaturesResult: Feature_FeaturesResult = new Feature_FeaturesResult()
    SpecificsResult: Feature_SpecificsResult[] = []
  }

  export class Feature_FeaturesResult {
    categoryFeatures: Feature_CategoryFeatures[] = []
    conditionValues: Feature_ConditionValues[] = []
    siteDefault: Feature_CategoryFeatures | null = null
  }

  export class Feature_CategoryFeatures {
    BestOfferAutoAcceptEnabled: boolean
    BestOfferAutoDeclineEnabled: boolean
    BestOfferCounterEnabled: boolean
    BestOfferEnabled: boolean
    EANEnabled: EnumKV[]
    ISBNEnabled: EnumKV[]
    UPCEnabled: EnumKV[]
    ListingDurations: Feature_ListingDurations[]
    PaymentMethod: EnumKV[]
  }

  export class Feature_ListingDurations {
    Duration: string[]
    DurationSet: string
  }

  export class Feature_ConditionValues {
    ConditionId: number
    ConditionName: string
  }

  export class Feature_SpecificsResult {
    AspectUsage: EnumKV
    Confidence: number
    Id: number
    IsMultiSelect: boolean
    IsRequired: boolean
    IsVariation: boolean
    IsVariationPicture: boolean
    MaxValue: number
    MaxValueLength: number
    MinValue: number
    ParentName: string
    ProductRequired: EnumKV
    SelectionMode: string
    SpecificName: string
    SpecificValueNames: Feature_SpecificValueNames[]
    UsageConstraint: EnumKV
    ValueFormat: string
    ValueType: string
    VariationPicture: EnumKV
    VariationSpecifics: EnumKV
  }

  export class Feature_SpecificValueNames {
    ChildName: string
    ChildSpecificValues: Feature_SpecificValueNames[]
    Id: number
    SpecificValue: string

    Key: string
    Value: string
  }

  // 产品细节
  export class ProductDetailTable {
    constructor(
      public SpecificValueNames: Feature_SpecificValueNames[], // 下拉数据
      public UsageConstraint: EnumKV | '',
      public SelectionMode: string,
      public SpecificName: string,
      public MaxValue: number,
      public ParentName: string,
      public IsCustomizeAttr: boolean, // 是否为自定义属性
      public IsCustomizeCheckbox: boolean | '', // 自定义填写属性
      public SelectedVal: string[][], // 选中的特性
      public CustomizeInput: string = '', // 当前行输入框
    ) {
    }
  }

  // 标题和价格
  export class TitleAndPrice {
    PlatformSkuCode: string = '' // 平台SKU
    SkuCode: string = '' // 系统SKU
    Title: string = '' // 标题
    SubTitle: string = '' // 副标题
    Quantity: number | '' = '' // 数量
    LotSize: number | '' = ''
    ListingDuration: string = '' // 上架时间
    StartPrice: number | '' = '' // 价格||拍卖底价
    UseBestOffer: number |'' = '' // Best Offer
    BestOfferAcceptPrice: number | '' = '' // 自动交易价格
    MinBestOfferPrice: number | '' = '' // 自动拒绝价格
    ReservePrice: number | '' = ''// 保底拍卖价
    BuyItNowPrice: number | '' = ''// 一口价
    SecondOffer: number | '' = ''
    VATPercent: number | '' = ''// VAT税率
  }

  export class DisableKeyList {
    Id: number
    Keywords: string
    Platform: number
    PlatformName: string
    UpdateTime: string
  }
}

// eBay 公共模板
namespace Interface {
  export class EBayTemplSearchGroup {
    SearchKey: string = ''
    SiteId: number | '' = ''
    TempType: number | '' = ''
  }

  export class EBayTemplTable {
    CreateTime: string
    Id: number
    Operator: string
    SiteId: number
    TempName: string
    TempType: number
  }

  export class EbayExcludeShippingLocationsDetail {
    Description: string
    DetailVersion: string
    Id: number
    Location: string
  }

  export class EbayExcludeShippingLocationsItem {
    Region: string
    Dtail: EbayExcludeShippingLocationsDetail[]
  }

  export class EbayExcludeShippingLocations {
    [Index: number]: EbayExcludeShippingLocationsItem[]
  }

  // 刊登 物流方式 模板
  export class EbayTempShippingResultModel {
    TempId: number // 模板主键ID
    EbayTempName: string // 模板名称
    SiteId: number // 站点
    DispatchTimeMax: number // 备货时间
    GlobalShipping: boolean // 加入全球运输计划
    SalesTaxState: string // Tax省州
    SalesTaxPercent: string // Tax百分比
    ShippingIncludedInTax: boolean // Tax运费加税
    LocalPickup: boolean // 当地取货
    ItemModels: EbayTempShippingItemResultModel[] // 物流明细
    ExcludeCountry: EbayTempExcludeCountryResultModel // 禁用目的地
    TempExcludeCountryId: number // 屏蔽目的地模板Id
  }

  // 刊登物流模板明细
  export class EbayTempShippingItemResultModel {
    ItemId: number // 物流明细id
    TempShippingId: number // 模板主键ID
    ShippingType: number // 运输方式：1-境内；2-境外
    ShippingService: string // 物流服务名称
    ShippingCost: number // 首件运费
    AdditionalCost: number // 续件运费
    IsFreeShipping: boolean // 是否免运费
    CountryIds: number[]// eBay地区名称（州或国家）
  }

  // 刊登 屏蔽目的 模板
  export class EbayTempExcludeCountryResultModel {
    TempId: number // 模板主键ID
    EbayTempName: string // 模板名称
    SiteId: number // 站点
    EbayCountryIds: number[] // Ebay国家Id
  }

  // 刊登 商品所在地 模板
  export class EbayTempProductLocationResultModel {
    TempId: number // 模板主键ID
    EbayTempName: string // 模板名称
    SiteId: number // 站点
    ProductUrl: string // 商品地址
    CountryCode: string // 国家二位简码
    PostCode: string // 邮编
  }

  // 刊登 退货设置 模板
  export class EbayTempReturnsSettingsResultModel {
    TempId: number // 模板Id
    EbayTempName: string // 模板名称
    SiteId: number // 站点
    AcceptReturns: number // 接受退货1-Returns Accepted, 2-No Returns Accepted
    ReturnMethod: number // 退货方式：1-Money Back, 2-Money Back Or Replacement
    ReturnPeriod: number // 接受退货期限：1-14, 2-30, 3-60
    FreightBurden: number // 退货运费承担: 1-Buyer, 2-Seller
    IntAcceptReturns: number // 国际接受退货：1-Returns Accepted, 2-No Returns Accepted
    IntReturnMethod: number // 国际退货方式：1-Money Back, 2-Money Back Or Replacement
    IntReturnPeriod: number // 国际接受退货期限：1-14, 2-30, 3-60
    IntFreightBurden: number // 国际退货运费承担: 1-Buyer, 2-Seller
    Description: string // 退货说明
  }

  // 刊登 买家限制 模板
  export class EbayTempBuyerRestrictionsResultModel {
    TempId: number // 主键ID
    EbayTempName: string // 模板名称
    SiteId: number // 站点
    UnpaidFrequency: number // 未付款次数
    ViolationPeriod: number // 违规时段:1-30天, 2-60天, 3-180天
    LimitAuctionFrequency: number // 限制拍卖次数
    FeedbackScore: number // 反馈分数
  }

  // 刊登 收款选项 模板
  export class EbayTempCollectionOptionResultModel {
    TempId: number // 主键ID
    EbayTempName: string // 模板名称
    SiteId: number // 站点
    PaymentMethod: string // 收款方式:1-American Express, 2-Paypal（保存收款方式的枚举，多选则”,”隔开）
    PayPalId: number // 收款paypal账号Id
    PayPalEmail: string // 收款paypal账号邮箱
    IsImmediatePayment: boolean // 要求买家立即付款
    Description: string // 付款说明
  }
}

// ebay 自定义分类
namespace Interface {
  export class EBayCustomClassSearchGroup {
    SearchKey: string = ''
    SearchKeyType: number | '' = ''
    StoreId: number | '' = ''
  }

  export class EBayCustomClassTable {
    CustomCategoryID: number
    CustomCategoryName: string
    CustomCategoryParentID: number
    CustomCategoryParentName: string
    EbayStoreId: number
    EbayStoreName: string
    Order: number
  }

  export class EBayCustomClassModify {
    constructor(
      public StoreId: number | '' = '',
      public DestinationParentCategoryID: number | '' = '',
      public CustomCategoryID: number = 0,
      public CustomCategoryName: string = '',
      public Order: number = 0,
    ) {
    }

    OperationType: number
  }

  export class EBayCustomClassLogSearchFrom {
    EndTime: string = ''
    OperationType: number | '' = ''
    SearchKey: string = ''
    StartTime: string = ''
    Status: number | '' = ''
    StoreId: number | '' = ''
    UserId: number | '' = ''
  }

  export class EBayCustomClassLogTable {
    CreateTime: string
    CustomCategoryID: number
    CustomCategoryName: string
    EbayStoreId: number
    EbayStoreName: string
    Id: number
    OperationType: number
    Remark: string
    Status: number
    UserId: number
    UserName: string
  }
}

// ebay 刊登列表
namespace Interface {
  export class EBayPublishListSearchGroup {
    StartTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime() - (86400000 * 30))
    EndTime: string | Date = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    ListingStatus: number | '' = ''
    VerifyStatus: number | '' = ''
    SiteId: number | '' = ''
    StoreId: number | '' = ''
    UserId: number | '' = ''
    SearchKeyType: number | '' = ''
    SearchKey: string = ''
  }

  export class EBayPublishListTable {
    CreateTime: string
    CreateUserName: string
    Currency: string
    ExpectedStartTime: string
    Id: number
    LastOperator: string
    ListingStatus: number
    ListingType: number
    Price: number
    ShelvesCategoryName: string
    SiteId: number
    Sku: string
    StoreCategoryName: string
    StoreName: string
    Title: string
    UpdateTime: string
    VerifyStatus: number
  }

  export class EBayPublishListHistoryTable {
    Id: number
    OperateLog: string
    OperateTime: string
    Operator: string
  }

  export class EBayPublishListShelves {
    Ids: number[] = []
    ExpectedStartTime: string = ''
    ListingType: number | '' = ''
  }

  export class EBayPublishListReason {
    ErrorCode: string
    ErrorLog: string
    ErrorTitle: string
    Id: number
  }
}

export default Interface