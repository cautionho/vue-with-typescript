import { namespace } from 'vuex-class'

namespace Interface {
  export type ReasonDrop = {
    Id: number
    Reason: string
  }
}

/* 售后单 */
namespace Interface {
  export class IssueItems {
    SkuId: number = 0
    SkuCode: string = "" 
    SkuName?: string = "" 
    ReasonType: number = 0 
    IssueCount: number = 0 
    Quantity?: number = 0 
    DefaultImage?: string = "" 
    DetailId: string = ""
  }

  export class ResendItems { 
    SkuId: number = 0 
    SkuCode: string = "" 
    SkuName?: string = "" 
    ReSendCount: number = 0 
    DefaultImage?: string = ""
  }

  export class AfterSalesAddress {
    BuyerFullName: string = ""
    BuyerState: string = ""
    BuyerCity: string = ""
    BuyerStreet1: string = ""
    BuyerStreet2: string = ""
    BuyerZipCode: string = ""
    BuyerPhone: string = ""
    constructor(Opts?: AfterSalesInfo ){
      for(let Item in Opts){
        if(this.hasOwnProperty(Item)){
          (this as any)[Item] = (Opts as any)[Item]
        }
      }
    }
  }

  export type AfterSalesHistory = {
    Id: number
    Operator: string
    OperateTime: string
    OperateLog: string
  }

  export class AfterSalesSearch {
    Platform: number = 0
    StoreId: number = 0
    Status: number = 2
    ProcessType: number[] = []
    ReasonType: number = 0
    CustomerId: number = 0
    SupervisorId: number = 0
    KeyWord: string = ""
    DataField: string = ""
    AddTimeStart: string = ""
    AddTimeEnd: string = ""
    DownloadTimeStart: string = ""
    DownloadTimeEnd: string = ""
    TimeHorizon: string = "shiporder:new"
  }

  export class AfterSalesList {
    AfterSalerId: number = 0
    AfterSaleCode: string = ""
    OriginalShipOrderCode: string = ""
    Platform: number = 0
    StoreName: string = ""
    ProcessType: number = 0
    CustomerId: number = 0
    CustomerName: string = ""
    SupervisorId: number = 0
    SupervisorName: string = ""
    Status: number = 0
    Created: string = ""
  }

  export class AfterSalesInfo extends AfterSalesAddress {
    AfterSalerId: number = 0
    ShipOrderCode: string = ""
    PayAmount: number = 0
    Currency: string = ""
    RefundedAmount: number = 0
    SupervisorId: number = 0
    ReasonType: number = 0
    ProcessType: number = 0
    TransactionId: string = ""
    Remark: string = ""
    DiffAmount: number = 0
    FullRefundAmt: number = 0
    TransactionDetails: AfterSalesTransactionDetails[] = []
    ImageUrl: string[] = []
    constructor(){
      super()
    }
  }

  export class AfterSalesTransactionDetails {
    AfterSaleorderTransactionId: number = 0
    AfterSaleId: number = 0
    PaypalTransactionId: string  = ""
    PayAmount: number = 0
    ReAmount: number = 0
    RetiredAmount: number = 0
    Currency: string = ""
    SkuInfo: AfterSalesSkuInfo[] = []
    Num: number

    constructor(Opts: AfterSalesTransactionDetails){
      for(let Item in Opts){
        if(this.hasOwnProperty(Item)){
          (this as any)[Item] = (Opts as any)[Item]
        }
      }
    }
  }

  export class AfterSalesSkuInfo {
    SkuId: number = 0
    SkuCode: string = ""
    SkuName: string = ""
    ItemId: string = ""
    Quantity: number = 0
    constructor(Opts: AfterSalesSkuInfo){
      for(let Item in Opts){
        if(this.hasOwnProperty(Item)){
          (this as any)[Item] = (Opts as any)[Item]
        }
      }
    }
  }

  export class ReviewAfterSales {
    Id: number[] = []
    Remark: string = ""
  }

  export class AfterSalesOrderExport {
    AfterSaleOrderType: number[] = []
    StatrTime: string = ''
    EndTime: string = ''
    AfterSaleOrderStatus: number[] = []
    Platform: number = 0
    TimeRange: string[] = []
  }

  export class CreateAfterSalesOrder {
    AfterSalerId: number = 0
    OriginalShipOrderCode: string = ""
    ProcessType: number = 0
    ReasonType: number = 0
    Remark?: string = ""
    CustomerId?: number = 0
    SupervisorId: number = 0
    ImageUrl: string[] = []
    IsSubmitAudit: boolean = false
    ReSendAddress?: AfterSalesAddress
    ReSendItems?: ResendItems[]
    DiffAndSendAddress?: AfterSalesAddress
    DiffAmount?: number
    IssueItems?: IssueItems[]
    constructor(Options?: CreateAfterSalesOrder) {
      for(let Item in Options){
        (this as any)[Item] = (Options as any)[Item];
      }
    }
  }

  export class AfterSalesDetails {
    OrderInfo: AfterSalesList = new AfterSalesList()
    IssueDetails: IssueItems[] = []
    ReSendDetails: ResendItems[] = []
    Hisotrys: AfterSalesHistory[] = []
    Images: string[] = []
    TransactionDetails: AfterSalesTransactionDetails[] = []
  }

  export type WalmartAfterSalesItem = {
    Id: number
    LineNumber: number
    SkuCode: string
    ProductPrice: number
    Quantity: number
  }
}

/* 站内信模板 */
namespace Interface {
  export class SeatchMailTpl {
    Title: string = ''
    CreateUserName: string = ''
    TemplateTypeId: number = 0
  }

  export class TplTypeList {
    TemplateTypeId: number
    TemplateTypeName: string
  }

  export type TplList = {
    TemplateId: number
    TemplateTitle: string
    TemplateTypeId: number
    TemplateTypeName: string
    Content: string
    CreateUserName: string
    Created: string
  }
}

/* 站内信 */
namespace Interface {
  export type MailAccountTree = {
    Id: number
    StoreId: number
    Name: string
    ParentId: number
    Childs:MailAccountTree[]
    UntreatedMessageNum: number
  }

  export class SearchMailList {
    IsProcess: number | boolean = 0
    KeyWord: string = ""
    BoxId: number = 0
    FieldName: string = ""
    StoreId: number = 0
  }

  export class MailList {
    MainMessageId: number
    BuyerId: string
    BuyerSendTime: string
    ChatSubject: string
    HighPriority: boolean
    IsRemark: boolean
    MergeMessageNum: number
    LastCustomerName: string
    Active?: boolean
  }

  export type MailShipOrderList = {
    ShipOrderCode: string
    TargetCountry: string
    Amount: number
    Currency: string
    ShipOrderStatus: number | string
    Evaluate: string
    TrackingNumber: string
    IsCase: boolean
    BuyerId: string
    ShippingCarrier: string
    ShipedTime: string
    PaidTime: string
    BuyerStreet1: string
    BuyerStreet2: string
    BuyerCity: string
    BuyerState: string
    BuyerCountry: string
    BuyerZipCode: string
    _expanded?: boolean
  }

  export type MailRemarkList = {
    RemarkId: number
    CustomerId: number
    CustomerName: string
    Content: string
    _expanded?: boolean
  }

  export type MailChatList = {
    MainMessageId: number
    MessageId: number
    BuyerId: number
    SellerId: string
    CustomerName: string
    ChatSubject: string
    ChatContent: string
    Images: string[]
    ChatTime: string
    IsFromCustomer: boolean
  }

  export type AutoMessageList = {
    Id: number
    Content: string
    Created: string
    BuyerId: string
  }

  export class MailDetails {
    ShipOrders: MailShipOrderList[] = []
    Remarks: MailRemarkList[] = []
    Chats: MailChatList[] = []
    AutoMessages: AutoMessageList[] = []
  }

  export class SearchMailTpl {
    TemplateTypeId: number
    constructor(Opts: SearchMailTpl){
      for(let Item in Opts){
        (this as any)[Item] = (Opts as any)[Item]
      }
    }
  }

  export class MailFolder {
    StoreId?: number
    FolderName?: string
    BoxId: number
    constructor(P1: number = 0, P2: string = "", P3: number = 0) {
      this.StoreId = P1
      this.FolderName = P2
      this.BoxId = P3
    }
  }

  export class MoveMail {
    BoxId: number
    MainMessageId: number[]
  }

  export class MailRemark {
    RemarkContent: string = ""
    MainMessageId: number = 0
  }

  export class SendMail {
    ShipOrderCode?: string 
    ShipOrderCodes?: string[] 
    Content: string = ''
    Images: string[] = []
    ItemId?: string
  }
}

/* 纠纷 - 取消交易 */
namespace Interface {
  export class SearchCancellation {
    StoreId: number = 0
    ProcessStatus: string = "Wait"
    KeyWord: string = ""
    FieldName: string = ""
  }

  export type CancellationList = {
    Id: number
    CancelId: string
    ShipOrderCode: string
    StoreName: string
    BuyerId: string
    Reason: string
    OrderStatus: string
    ProcessStatus: number
    Created: string
    Updated: string
    OrderRemarks: any[]
  }

  export type CancellationChat = {
    ChatTitle: string
    Created: string
  }

  export class CancellationInfo {
    CancelId: string = ""
    StoreName: string = ""
    BuyerId: string = ""
    Reason: string = ""
    OrderStatus: string = ""
    CustomerName: string = ""
    Created: string = ""
    Updated: string = ""
    Chats: CancellationChat[] = []
  }

  export class HandleCancellation {
    IsAgree: number = 1
    InterceptOrCancel?: boolean = false
    CancelId: number | string = ""
    SendTime?: string = ""
    TrackingNum?: string = ""
  }
}

/* 纠纷 - 未收到货 */
namespace Interface {
  export class SearchNotReceivedGoods {
    StoreId: number = 0
    ProcessStatus: string = 'Wait'
    KeyWord: string = ""
    FieldName: string = ""
    StartCreatedTime: string = ""
    EndCreatedTime: string = ""
  }

  export type NotReceiveGoodsList = {
    Id: number
    NotReceiveId: string
    ShipOrderCode: string
    StoreName: string
    BuyerId: string
    BuyerExpect: string
    OrderStatus: string
    ProcessStatus: number
    Created: string
    LatestResponseDate: string
    OrderRemarks: any[]
  } 

  export type NotReceivedGoodsChat = {
    Title: string
    Content: string
    CustomerName: string
    ChatSponsor: string
    Created: string
  }

  export class NotReceivedGoodsInfo {
    NotReceiveId: string = ""
    StoreName: string = ""
    BuyerId: string = ""
    BuyerExpect: string = ""
    OrderStatus: string =""
    Created: string = ""
    LatestResponseDate: string = ""
    IsSelectNoRefund: boolean = false
    Chats: NotReceivedGoodsChat[] = []
  }

  export class HandleNotReceivedGoods{
    NotReceiveId: number | string = ""
    Content: string = ""
    TypeReason?: string = ""
    MethodName?: string = ""
    SendTime?: string = ""
    TrackingNum?: string = ""
  }

  export class HandleNotRefund {
    NotReceiveId: string
    IsSelectNoRefund: boolean
    constructor(Id: string = "", NotRefund: boolean = false){
      this.NotReceiveId = Id
      this.IsSelectNoRefund = NotRefund
    }
  }
}

/* 退款退货 */
namespace Interface {
  export class SearchRefund {
    StartCreatedTime: string = ""
    EndCreatedTime: string = ""
    EbayStatus: string = ""
    StoreId: number = 0
    ProcessStatus: string = "Wait"
    KeyWord: string = ""
    FieldName: string = ""
    ReturnReason: string = ""
  }

  export type RefundList = {
    Id: number
    ReturnId: string
    ShipOrderCode: string
    StoreName: string
    BuyerId: string
    BuyerExpect: string
    OrderStatus: string
    ProcessStatus: number
    Created: string
    LatestResponseDate: string
    Reason: string
    OrderRemarks?: any[]
  }
  
  export type RefundChat = {
    Title: string 
    Content: string 
    CustomerName: string 
    ChatSponsor: string 
    Created: string 
    Images: string 
  }

  export class RefundInfo {
    ReturnId: string = ""
    StoreName: string = ""
    BuyerId: string = ""
    BuyerExpect: string = ""
    OrderStatus: string = ""
    Created: string = ""
    LatestResponseDate: string = ""
    Reason: string = ""
    AvailableOptionsList: string[] = []
    IsSelectNoRefund: boolean = false
    Chats: RefundChat[] = []
    Images: string[] = []
  }

  export class HandleRefund {
    ReturnId: number | string = ""
    Content: string = ""
    Amount?: number = 0
    Currency?: string = ''
    TypeReason?: number = 0
  }

  export class RefundHandleNotRefund{
    ReturnId: string
    IsSelectNoRefund: boolean
    constructor(Id: string = "", NotRefund: boolean = false){
      this.ReturnId = Id
      this.IsSelectNoRefund = NotRefund
    }
  }
}

// 升级纠纷
namespace Interface {
  export class SearchCase {
    StoreId: number = 0
    ProcessStatus: string = "Wait"
    KeyWord: string = ""
    FieldName: string = ""
    IsAppeal: number | boolean | "" = ""
  }
  export type CaseList = {
    Id: number
    CaseId: string
    ShipOrderCode: string
    StoreName: string
    BuyerId: string
    Reason: string
    OrderStatus: string
    ProcessStatus: number
    Created: string
    Updated: string
    SourceCode: string
    IsAppeal: boolean
    OrderRemarks: any[]
  }

  export type CaseChat = {
    Title: string
    Content: string
    CustomerName: string
    ChatSponsor: string
    Created: string
  }

  export class CaseInfo {
    CaseId: string = ""
    StoreName: string = ""
    BuyerId: string = ""
    Reason: string = ""
    OrderStatus: string = ""
    Created: string = ""
    Updated: string = ""
    IsAppeal: boolean = false
    SourceCode: string = ""
    AppealResult: string = ""
    Chats: CaseChat[] = []
  }
  export class HandleCase {
    CaseId: string = ""
    Content: string = ""
  }
}

/* Wish工单 */
namespace Interface {
  export class SearchWishTicket {
    StoreId: number = 0
    ProcessTypeId: number = 1
    KeyWord: string = ""
    DataField: string = ""
  }

  export type WishTicketChat = {
    CustomerName: string
    Message: string
    ImageUrls: string[]
    StrImageUrls: string
    Date: string
  }

  export class WishTicketInfo {
    Id: number = 0  
    TicketId: string = ""
    StoreName: string = ""
    ShipOrderCode: string = ""
    BuyerName: string = ""
    Label: string = ""
    CloseBy: string = ""
    Created: string = ""
    LastUpdateTime: string = ""
    Replies: WishTicketChat[] = []
  }

  export class HandleWishTicket {
    TicketId: string = ''
    Message: string = ''
  }
}

/* Shopee 退款退货 */
namespace Interface {
  export class SearchShopeeReturnRefund {
    StoreId: number = 0
    ProcessStatus: number = 1
    ShopeeStatus: string = ""
    StartTime: string = ""
    EndTime: string = ""
    SearchKeyType: number = 0
    SearchKey: string = ""
  }

  export class ShopeeReturnOrder {
    Id: number = 0
    ReturnSn: string = ''
    StoreName: string = ''
    ShipOrderCode: string = ''
    BuyerId: string = ''
    ShopeeStatus: string = ''
    ProcessStatus: number = 0
    RefundAmt: number = 0
    BeforeDiscountAmount: number = 0
    StartTime: string = ''
    LatestResponseDate: string = ''
    Reason: string = ''
    ReasonText: string = ''
    ReasonImages: string[] = []
    Currency: string = ''
    OrderRemarks: any = []
  }

  export type ShopeeReturnItem = {
    Id: number
    ReturnId: number
    SkuCode: string
    SkuName: string
    ItemId: string
    Quantity: number
    ItemPrice: number
    SkuImage: string
    Currency: string
  }

  export type ShopeeReturnHistory = {
    Id: number
    ProcessType: number
    Email: string
    Operator: string
    OperateTime: string
    Reason: string
    ReasonText: string
    ReasonImages: string[]
  }

  export class ShopeeReturnRefundInfo {
    ReturnOrder: ShopeeReturnOrder = new ShopeeReturnOrder()
    ReturnItem: ShopeeReturnItem[] = []
    ReturnHistory: ShopeeReturnHistory[] = []
  }

  export class HandleShopeeReturnRefund {
    ReturnId: number = 0
    ProcessType: number = 1
    Email: string = ''
    Reason: string = ''
    ReasonText: string = ''
    ReasonImages: string[] = []
  }
}

/* Shopee取消交易 */
namespace Interface {
  export class ShopeeCancellationList {
    Id: number = 0
    OrderSn: string = ""
    ShipOrderCode: string = ""
    StoreName: string = ""
    BuyerId: string = ""
    ShopeeStatus: string = ""
    ProcessStatus: number = 0
    Reason: string = ""
    CreationTime: string = ""
    UpdateTime: string = ""
    CustomerName: string = ""
    OrderRemarks: any = []
  }

  export type ShopeeCancellationHistory = {
    Id: number
    CancellationId: number
    Operator: string
    OperateTime: string
    OperateLog: string
    ProcessType: number
  }

  export class ShopeeCancellationInfo {
    CancellationOrder: ShopeeCancellationList = new ShopeeCancellationList()
    CancellationHistory: ShopeeCancellationHistory[] = []
  }

  export class HandleShopeeCancellation {
    CancellationId: number = 0
    ProcessType: number = 1
  }
}

/* 售后Tab相关 */
namespace Interface {
  export class CancelRequest {
    ShipOrderId: number = 0
    OrderId: string = ""
    Reason: string = ""
  }

  export class ShopeeCancelBackOrder {
    ShipOrderCode: string = ""
    CancelReason: string = ""
  }

  export class CancelBackOrder {
    CancellingReason: number = 0
    Ids: number[] = []
  }
}

/* 邮箱账号管理 */
namespace Interface {
  export class SearchEmailAccount {
    IsEnable: boolean | "" = ""
    DataField: number = 0
    KeyWord: string = ""
  }

  export class EmailAccountInfo {
    Id: number = 0
    Name: string = ""
    Account: string = ""
    Password: string = ""  
    IsEnable: boolean = true
    Created: string = ""
    ReceiveHost: string = ""
    ReceiveHostPort: string = ""
    SendHost: string = ""
    SendHostPort: string = ""
    FolderName: string = ""
  }

  export class AuthorizeUser {
    Id: number = 0
    UserIds: number[] = []
  }

  export class BindStore {
    EmailAccountId: number
    Platform: number
    StoreId: number

    constructor(EmailId: number = 0, Platform: number = 0, StoreId: number = 0){
      this.EmailAccountId = EmailId
      this.Platform = Platform
      this.StoreId = StoreId
    }
  } 
}

/* 邮件管理 */
namespace Interface {
  export class EMailAccountTree {
    Name: string = ""
    Account: string = ""
    UnRead: number = 0
    AccountId: number = 0
  }

  export class SearchEmailList {
    AccountId: number = 0
    KeyWord: string = ""
    RecordType: number = 0
  }

  export class EmailList {
    Id: number = 0
    FromName: string = ""
    FromAccount: string = ""
    CustomerId: number = 0
    CustomerName: string = ""
    Title: string = ""
    RecordType: number = 0
    EmailTime: string = ""
    Created: string = ""
    Active: boolean = false
  }

  export class EmailDetails {
    Id: number = 0 
    FromName: string = ""
    FromAccount:string = ""
    ToAccounts: string = ""
    CCAccounts: string = ""
    Title: string = ""
    Content: string = ""
    EmailTime: string = ""
    Attachments: any[] = []
    ReplyTo: string = ""
  }

  export type EmailAttachments = {
    FileName: string
    FileSize: number | string
    DownloadUrl: string
  }

  export class WriteEmail {
    OldEmailRecordId?: number = 0
    ShipOrderCodes?: string[] =[]
    FromName: string = ""
    FromAccount: string = ""
    ToAccounts: string = ""
    CCAccounts: string = ""
    Title: string = ""
    Content: string = ""
    Attachments: EmailAttachments[] = []
  }
}

/* 邮件模板 */
namespace Interface {
  export type EmailTplType = {
    TypeId: number
    TypeName: string
  }

  export type EmailTplDrop = {
    Title: string
    Content: string
  }

  export class MailTplTypeInfo {
    Id: number = 0
    TemplateName: string = ''

    constructor(Id: number = 0, TplName: string = ''){
      this.Id = Id
      this.TemplateName = TplName
    }
  }

  export class MailTplInfo {
    Title: string = ''
    TypeId: number = 0
    Content: string = ''
    Id: number = 0

    constructor(Title: string = '', TypeId: number = 0, Content: string = '', Id: number = 0){
      this.Title = Title
      this.TypeId = TypeId
      this.Content = Content
      this.Id = Id
    }
  }

  export class SearchEmailTpl {
    TypeId: number = 0
    KeyWord: string = ""
  }

  export class EmailTpl {
    Id: number = 0
    Title: string = ""
    TypeId: number = 0
    Content: string = ""
    TypeName:  string =""
    CreateUser:  string =""
    Created: string = ""
  }
}

/* 物流异常订单 */
namespace Interface {
  export class LogisticsExcaption {
    Id: number = 0
    OrderCode: string = ""
    PlatformOrderId: string = ""
    Platform: number = 0
    WarehouseName: string = ""
    StoreName: string = ""
    BuyerId: string = ""
    ShipMethodName: string = ""
    Country: string = ""
    TrackingNumber: string = ""
    LogisticsStatus: number = 0
    LogisticsInfo: string = ""
    LogisticsAnomalyReason: string = ""
    CustomerStatus: number = 0
    OrderTime: string = ""
    PayTime: string = ""
    ShipTime: string = ""
    CreatedTime: string = ""
    Remark: string = ""
  }

  export class ChangeCustomerStatus {
    ids: number[] = []
    customerStatus: number = 0
  }

  export class AddRemarkBatch { 
    orderCodes: string[] = []
    content: string = ""
  }
}

//allegro订单纠纷
namespace Interface {
  export class AllegroOrderDisputeSearch {
    DisputeType: number = 0
    EndTime: string = ""
    ProcessStatus: number = 1
    SearchKey: string = ""
    SearchKeyType: number = 0
    StartTime: string = ""
    StoreId: number = 0
  }

  export class AllegroOrderDisputeList {
    BuyerId: string
    Chats: null
    CreationTime: string
    DisputeContent: string
    DisputeId: string
    DisputeType: number
    Id: number
    PlatformOrderCode: string
    ProcessStatus: number
    ShipOrderCode: string
    StoreName: string
    Title: null
    UpdateTime: string
  }

  export class AllegroOrderDisputeChats{
    ChatSponsor: string
    Content: string
    Created: string
    Enclosure: string
    Title: string
  }

  export class AllegroOrderDisputeInfo{
    BuyerId: string
    Chats: Interface.AllegroOrderDisputeChats[]
    CreationTime: string
    DisputeContent: string
    DisputeId: string
    DisputeType: number
    Id: number
    PlatformOrderCode: string
    ProcessStatus: number
    ShipOrderCode: string
    StoreName: string
    Title: null
    UpdateTime: string
  }

  export class HandleAllegroOrder{
    Id: number = 0
    OperationType: number|string = "1"
    Content: string = ""
    Enclosure: string = ""
  }
}

namespace Interface{
  export class AllegroRatingSearch{
    EndTime: string = ""
    IsReply: boolean | "" = ""
    SearchKey: string = ""
    SearchKeyType: number = 0
    StartTime: string = ""
    State: number = 1
    StoreId: number = 0
    Type: boolean | "" = ""
  }
  
  export class AllegroRatingList{
    BuyerId: string = ""
    EvaluateContent: string = ""
    EvaluateTime: string = ""
    EvaluateType: boolean | ""  = ""
    Id: number
    IsReply: boolean
    Remark: string = ""
    ShipOrderCode: string = ""
    ShipOrderCodeList: null
    State: number | ""  = ""
    StoreId: number | ""  = ""
    StoreName: string = ""
  }
  
  export class AllegroRatingHistory{
    Id: number
    OperateContent: string
    OperateTime: string
    OperateUserName: string
  }
}

export default Interface