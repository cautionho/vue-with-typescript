
namespace Public {
  export enum Enable { 已启用 = 1, 已禁用 = 0 }
  export enum Sex { 男 = 1, 女 }
  export enum Review { 通过 = 1, 不通过 }
  export enum Review2 { 通过 = 1, 退回修改, 不通过 }
  export enum Review3 { 通过 = 1, 不通过, 退回修改 }
  export enum Inventory { 可用库存 = 1, 在途库存 }
  export enum Lang { 英文 = 1, 中文 }
  export enum YesNo { 是 = 1, 否 = 0 }
}

namespace User {
  export enum SearchType { 用户名称 = 1, 用户编号, 电话号码, 邮箱 }
  export enum Status { 待录入 = 1, 待核实, 试用期, 已转正, 已离职 }
  export enum DocStatus { 待录入 = 1, 待核实, 待审核, 已归档 }
  export enum MaritalStatus { 未婚 = 1, 已婚未育, 已婚已育, 离异, 丧偶 }
  export enum AccountNature { 本地农村 = 1, 本地城镇, 外地农村, 外地城镇 }
  export enum EmployeeSearchType { 名字 = 1, 编号, 电话, 邮箱 }
  export enum Nation { 汉族 = 1, 壮族, 回族, 满族, 维吾尔族, 苗族, 彝族, 土家族, 藏族, 蒙古族, 侗族, 布依族, 瑶族, 白族, 朝鲜族, 哈尼族, 黎族, 哈萨克族, 傣族, 畲族, 傈僳族, 东乡族, 仡佬族, 拉祜族, 佤族, 水族, 纳西族, 羌族, 土族, 仫佬族, 锡伯族, 柯尔克孜族, 景颇族, 达斡尔族, 撒拉族, 布朗族, 毛南族, 塔吉克族, 普米族, 阿昌族, 怒族, 鄂温克族, 京族, 基诺族, 德昂族, 保安族, 俄罗斯族, 裕固族, 乌孜别克族, 门巴族, 鄂伦春族, 独龙族, 赫哲族, 高山族, 珞巴族, 塔塔尔族, 其他 }
}

namespace Purchase {
	export enum SupplySearchType { 名称 = 1, 联系人, 电话, 邮箱 }
	export enum BillType { 货到付款 = 1, 款到发货, 月结, 订单尾款 }
	export enum PayType { 银行转账 = 1, 支付宝, PayPal, 现金 }
	export enum ApplyStatus { 新建 = 1, 待审核, 已完成, 已取消 }
	export enum ApplySearchType { SKU编号 = 1, 品名, 采购单号 }
	export enum SourceType { 销售申请 = 1, 采购换货, 采购建议 }
	export enum OrderStatus { 新建 = 1, 待采购审核, 待销售确认, 待总经理审核 = 10, 待付款 = 9, 待发货 = 4, 待签收, 待入库, 部分入库, 已完成, 已终止 = -1 }
	export enum OrderSearchType { 采购单号 = 1, SKU编号, 品名, 平台单号 }
	export enum OrderCompleteStatus { 两天未下单 = 1, 五天内未完成, 十五天内未完成 }
	export enum FinanceApplyStatus { 未申请 = 1, 已申请 }
	export enum ArrivalSearchType { PAO单号 = 1, 快递单号, SKU编号, 产品名称, 采购单号 }
	export enum ArrivalStatus { 待签收 = 1, 待质检, 待入库, 部分入库, 已完成 }
	export enum ExceptionStatus { 待处理 = 1, 待退货, 已退货 }
	export enum ExceptionHandleType { 保留 = 1, 退货, 换货 }
	export enum SuggestSearchType { SKU编号 = 1, SKU名称 }
	export enum ProcessComplete { 已完成 = 1, 未完成 = 0 }
	export enum PaymentDays { '7天' = 1, '15天' = 2, '30天' = 3, '60天' = 4, '90天' = 5, '180天' = 6, '365天' = 7 }
	export enum MsgType { 系统通知 = 1, 系统升级}
	export enum IsReissue { 可补发 = 1, 不可补发 = 0}
	export enum ProposalType { SKU编号 = 1, 产品名称 }
  export enum PurchaseState {  待采购 = 0, 已采购 = 1 }
}

namespace Product {
  export enum NewStatus { 新建 = 1, 待审核, 已完成, 已终止 }
  export enum NewSearchType { 产品名称 = 1, 关键字, 开发序号 }
  export enum SkuSearchType { SKU编号, 产品名称, 英文名, 海关编码, 申报中文, 申报英文 }
  export enum Bind { 捆绑 = 1, 普通 = 0 }
  export enum Type { SPU = 1, SKU }
  export enum PhotoStatus { 新建 = 1, 待处理, 已上传, 已完成 }
  export enum SortType { 按编号从大到小 = 1, 按期望时间从旧到新, 按照申请时间从旧到新 }
  export enum TimeType { 申请时间 = 1, 期望时间 }
  export enum OverseaStatus { 上传失败 = 1, 待维护, 维护完成, 退回, 验证中, 已发布, 待审核, 不通过 }
  export enum OverseaSearchType { SKU编号 = 1, 产品名称, 申报英文名 }
  export enum OverseaActive { 有效 = 1, 无效 = 0 }
	export enum RequirementsType { SKU编号 = 1, 产品名, 编号  }
  export enum SkuMap { SKU编号 = 1, 产品名, SKU别名 }
  export enum SkuIsBind { 捆绑SKU = 1, 普通SKU }
}

namespace Setting {
  export enum WarehouseStatus { 发货仓 = 1, 样品仓, 采购仓, 中转仓, 备货仓 }
  export enum ResourcesType { 菜单名称 = 1, 元素ID }
  export enum IsTrue { 是 = 1, 否 = 0 }
}


namespace Finance {
  export enum PayType { 采购付款 = 1 }
  export enum RefundType { 采购退款 = 1, 订单退款 }
  export enum PayManageKeyType { 付款单号 = 1, 来源单据, 平台单号, 备注 }
  export enum RefundManageKeyType { 退款单号 = 1, 来源单据, 平台单号, 备注 }
  export enum PayManageTimeType { 创建时间=1, 最后操作时间 }
}

namespace Sales {
  export enum Platform { 'eBay' = 1, 'Wish', 'Amazon', 'Shopee', 'Walmart', 'Cdiscount', '速卖通', 'Joom', 'Fyndiq', 'Topbuy', 'Tophatter', 'FactoryMarket', 'Vova', 'Mymall', 'Jumia' = 16, 'Allegro', 'Lazada', 'Groupon', 'Real.de', 'Rakuten', 'Newegg', '其他' = 99 }
  export enum StoreSearchType { 账号 = 1, 别名 }
  export enum ShopeeSiteType { SG = 1, TH, ID, PH, TW, VN, MY }
  export enum JumiaSiteType { NG = 1, EG, KE, CI, ZA, GH, UG, SN, MA }
  export enum LazadaSiteType { SG = 1, ID, PH, VN, MY, TH }
  export enum ReviseType { 暂停销售 = 1, 恢复销售 }
  export enum ReviseStatus { 执行中 = 1, 执行失败, 执行成功, 设置忽略 }
  export enum ReviseSearchType { '系统SKU' = 1, 'Listing SKU' = 2, 'ItemId' = 3 }
  export enum UploadStatus { 待上传 = 1, 成功, 失败 }
  export enum UploadSearchType { 'offer id' = 1, SKU编号, SKU名称, 操作人 }
  export enum ItemIdLink { 'http://www.ebay.com/itm/'= 1, 'http://www.wish.com/c/', 'https://www.joom.com/en/products/' = 8, 'https://www.real.de/product/' = 20 }
  export enum TempType{ 物流设置=1, 屏蔽目的地, 商品所在地, 退货设置, 买家限制, 收款选项}
  export enum CountryBox { 美洲=1,亚洲,澳大利亚,墨西哥,德国,欧洲,英国,日本,巴西,俄罗斯,中国,法国}
  export enum CustomStoreKeyType { 分类名称=1, 分类ID }
  export enum CustomStoreLogKeyType { 添加=1, 删除, 移动, 修改, 确认 }
  export enum CustomStoreLogStatus { 确认中=1, 成功, 失败 }
  export enum EBayPublishListListing { 新建=1, 待上架, 上架中, 上架成功, 上架失败}
  export enum EBayPublishListVerify { 未验证=1, 验证中, 验证成功, 验证失败 }
  export enum EBayPublishListKeyType { 编号=1, 系统SKU编号, 上架SKU编号, 标题}
  export enum EBayPublishListType { 立即上架=0, 定时上架 }
}

namespace Warehouse {
  export enum ShipOrderStatus { 待检查 = 1, 已确认, 待拣货, 已拣货, 已打包, 已发货, 缺货, 已拦截, 联系客户, 已归档, 取消=99 }
  export enum ItemType { 单品单件 = 1, 单品多件, 单品, 多品两件, 多品多件, 多品 }
  export enum ItemTypeSimple { 单品 = 3, 多品 = 6 }
  export enum TimeType { 下单时间 = 1, 付款时间, 发货时间 }
  export enum ShipOrderKeyType { 发货单号 = 1, 订单号, 批次号, SKU编号, 买家ID, 收件人, 电话, 交易号, 跟踪号, ItemId, 邮箱 }
  export enum ExportItemType { 单个明细 = 1, 多个明细 }
  export enum InventoryManageType { SKU编号 = 1, 产品名, 货架号 }
  export enum GenerationType { 手动输入 = 1, 自动生成 }
  export enum BuyerBlackKeyType { 买家ID = 1, 电话,   邮箱 }
  export enum PinckingBatchStatusType { 待拣货 = 1, 已打印, 部分拣货, 已完成 }
  export enum PinckingBatchLabelSize { '10*10' = 10, '10*15' = 15, '10*20' = 20}
  export enum PinckingBatchKeyType { '批次号' = 1, '订单号', 'SKU编号' }
  export enum DisputedType { 未收到货 = 1, 取消交易, 退货退款, 升级纠纷 }
  export enum SkuStatus { 待完善 = 1, 预售, 在售, 待清, 清完, 热售, 待暂停, 已暂停 }
  export enum InventoryLogType { 采购下单 = 1, 到货签收, 采购入库, 采购异常, 调拨入库, 拣货, 调拨出库, 发货, 还原打包, 盘点, 确认订单, 还货 = 15, 设置缺货 = 18, 分销出库 = 21, 退件入库 = 23, 采购调整, 初始化 = 99}

  export enum InventoryLogKeyType { SKU编号 = 1, 产品名, 货架号, 相关单据 }
  export enum TransferRequireKeyType { 编号 = 1, SKU编号, 产品名, 批次号 }
  export enum TransferRequireStatus { 新建 = 1, 待拣货, 已完成, 已作废}
  export enum TransferBatchKeyType { 批次号 = 1, 需求编号, SKU编号 }
  export enum TransferBatchStatus { 待拣货 = 1, 已打印, 已拣货, 部分装箱, 已装箱 }
  export enum PaperType { A4纸 = 1, 热敏纸 }
  export enum ReplenishDemandStatus { 待处理 = 0, 待出库, 已出库, 已入库, 已取消 }
  export enum ReplenishDemandKeyType { 需求编号 = 1, 创建人, SKU编号, 产品名}
  export enum TransferInBoxStatus { 待发货=1, 已发货, 已入库, 部分入库, 已作废 }
  export enum TransferInBoxType { 箱号=1, 第三方仓库单号, 物流公司, 快递单号, Sku编号 }
  export enum LogisticsCmpList { IB美国空运=1, 睿振行美国空运, 睿振行德国空运, 睿振行英国空运, 广州DHL, 广州UPS }
  export enum BeliveryBatchKeyType { 出库批次=1, 操作人, 发货单号 }
  export enum ChecktDemandKeyType { 货架号=1, SKU编号, 产品名 }
  export enum ChecktDemandStatus { 待确认=1, 待盘点, 已盘点, 已忽略 }
  export enum MaterielApplyStatus { 新建=1, 待审核, 已完成, 已终止}
  export enum MaterielApplyKeyType { 申请编号=1, SKU编号, 申请人 }
  export enum LogisticsReturnOrderStaus {待签收=1, 已签收, 已作废=99 }
  export enum LogisticsReturnOrderServiceStaus { 未处理=1, 已处理, 已忽略 }
  export enum LogisticsReturnOrderKeyType { 编号=1, 跟踪号, 发货单号 }
  export enum EncasementOutLibLogKeyType { 装箱批次号=1, 发货单号, 跟踪号 }
  export enum FirstShippingMethodType { UPS=1, FEDEX, DHL, 跨越, 中通, 其他}
  export enum OutLibLogDetailKeyType{ 发货单号=1, 跟踪号}
  export enum SortType { '美元金额：从高到低' = 1, '美元金额：从低到高' }

  export enum PackBoxStatus { '#2d6c9e','#FF9933', '#00CC66', '#FF3333', '#ffde3b'  }
}

namespace Logistics {
  export enum CustomerManageType { 客户编号=1, 公司, 联系人, 电话, 邮箱 }
  export enum AddressSearchType { 地址别名=1, 手机, 联系人 }
  export enum TransactionRecordType { 扣费=1, 充值, 退回 }
  export enum TransactionRecordKeyType { 客户编号=1, 操作单号, 操作人, 跟踪号 }
  export enum AuthorizeSearchType { 账号 = 1, 别名, 客户编号 }
  export enum TrackingmoreStatus{ 查询中 = 1, 查询不到, 运输途中, 到达待取, 成功签收, 投递失败, 可能异常, 运货过久, 创建失败=99, 单号重复=4016 }
  export enum PackageStatusList{ 查询中 = 1, 查询不到, 运输途中, 到达待取, 成功签收, 投递失败, 可能异常, 运货过久, '待揽件，只有一条订单生成的信息', 完全无信息, 发货无信息, 超时无更新, 超时未签收, 超时未自提, 退回件, 海关扣留, 包裹破损, 未揽收被取消, 创建失败=99, 单号重复=4016 }
  export enum TrackingmoreTimeType { 下单时间 = 1, 付款时间, 发货时间, 更新时间 }
  export enum TrackingMoreTimeLimitType { 上网时效 = 1, 签收时效, 未签收时间 }
  export enum TrackingMoreCompareType { 大于=1, 小于等于 }
  export enum TrackingMoreType { 发货单号=1, 跟踪号, 订单号, 收件人 }
}

namespace CustomerService {
  export enum AfterSalesStatus { 新建 = 1, 待审核, 已通过, 已终止, 退款失败 }
  export enum ProcessType { 重发= 1, 补差价并重发, 全额退款, 部分退款 }
  export enum AfterSalesSearchType { 编号 = 'afc', 发货单号 = 'soc', 买家ID = 'buyer' }
  export enum MailStatus { 未处理, 已处理 }
  export enum MailSearchType { 标题 = 't', 收件人 = 's', 发件人 = 'r', ItemId = '4' }
  export enum CancellationStatus { 待处理 = 'Wait', 已处理 = 'Processed', 已关闭 = 'Closed' }
  export enum CancellationSearchType { 编号 = 'cancelid', 发货单号 = 'shipordercode', 买家ID = 'buyerid' }
  export enum NotReceivedGoodsSearchType { 编号 = 'notreceiveid', 发货单号 = 'shipordercode', 买家ID = 'buyerid' }
  export enum RefundSearchType { 编号 = 'refundid', 发货单号 = 'shipordercode', 买家ID = 'buyerid', ItemId = 'ItemId' }
  export enum CaseSearchType { 编号 = 'caseid', 发货单号 = 'shipordercode', 买家ID = 'buyerid', 来源纠纷 = 'sourcecode' }
  export enum CancellationProcessStatus { 待处理 = 1, 已处理, 已关闭 }
  export enum RefundProcessStatus { 待处理 = 'Wait', 已处理 = 'Processed', 已关闭 = 'Closed', 已升级 = 'Escalated' }
  export enum HadleNotReceivedGoodsType { 回复 = 1, 提供物流信息, 全额退款, 重发或部分退款, 升级 }
  export enum InquiryReasonList { BUYER_TROUBLE = 1, TROUBLE_COMMUNICATION, SHIPPED_ITEM, OTHER }
  export enum HandleRefundType { SELLER_SEND_MESSAGE = '回复',  SELLER_ISSUE_REFUND = '全额退款', SELLER_OFFER_PARTIAL_REFUND = '部分退款', RESEND = '重发', SELLER_DECLINE_REQUEST = '拒绝',  SELLER_ESCALATE = '升级' }
  export enum RefundStatus { CLOSED = 1, ESCALATED, ITEM_DELIVERED, ITEM_SHIPPED, LESS_THAN_A_FULL_REFUND_ISSUED, PARTIAL_REFUND_DECLINED, PARTIAL_REFUND_FAILED, PARTIAL_REFUND_INITIATED, PARTIAL_REFUND_REQUESTED, READY_FOR_SHIPPING, REPLACED, REPLACEMENT_CLOSED, REPLACEMENT_DELIVERED, REPLACEMENT_LABEL_REQUESTED, REPLACEMENT_REQUESTED, REPLACEMENT_SHIPPED, REPLACEMENT_STARTED, REPLACEMENT_WAITING_FOR_RMA, RETURN_LABEL_REQUESTED, RETURN_REJECTED, RETURN_REQUESTED, RETURN_REQUESTED_TIMEOUT, UNKNOWN, WAITING_FOR_RETURN_LABEL, WAITING_FOR_RMA }
  export enum RefundReason { ARRIVED_DAMAGED = 1, ARRIVED_LATE, BUYER_CANCEL_ORDER, BUYER_NO_SHOW, BUYER_NOT_SCHEDULED, BUYER_REFUSED_TO_PICKUP, DEFECTIVE_ITEM, DIFFERENT_FROM_LISTING, EXPIRED_ITEM, FAKE_OR_COUNTERFEIT, FOUND_BETTER_PRICE, IN_STORE_RETURN, MISSING_PARTS, NO_LONGER_NEED_ITEM, NO_REASON, NOT_AS_DESCRIBED, ORDERED_ACCIDENTALLY, ORDERED_DIFFERENT_ITEM, ORDERED_WRONG_ITEM, OTHER, OUT_OF_STOCK, RETURNING_GIFT, VALET_DELIVERY_ISSUES, VALET_UNAVAILABLE, WRONG_SIZE }
  export enum AfterSalesType { AfterSaleOrderCode = '售后单', CancelOrderId = '取消交易', NotReceviedId = '未收到货', ReturnId = '退款退货', CaseId = '升级纠纷', TickerOrderId = 'Wish工单' , ReturnDetail = 'Return/Refund', CancellationDetail = 'Cancellation'  }
  export enum DisputedDetailsType { AfterSaleOrderCode = 'AfterSalesOrderDetails', CancelOrderId = 'CancellationDetails', NotReceviedId = 'NotReceivedGoodsDetails', ReturnId = 'RefundDetails', CaseId = 'CaseDetails', TickerOrderId = 'WishTicketDetails', ReturnDetail = 'ShopeeReturnRefundDetails', CancellationDetail = 'ShopeeCancellationDetails'}
  export enum CancelRequestReason { BUYER_CANCEL_OR_ADDRESS_ISSUE = 1, OUT_OF_STOCK_OR_CANNOT_FULFILL }
  export enum CancelShopeeBackReason { OUT_OF_STOCK = 1, CUSTOMER_REQUEST, UNDELIVERABLE_AREA, COD_NOT_SUPPORTED}
  export enum CancelBackReason { CUSTOMER_REQUESTED_SELLER_TO_CANCEL = 1, SELLER_CANCEL_OUT_OF_STOCK, SELLER_CANCEL_CUSTOMER_DUPLICATE_ORDER, SELLER_CANCEL_CUSTOMER_CHANGE_ORDER, SELLER_CANCEL_CUSTOMER_INCORRECT_ADDRESS, SELLER_CANCEL_FRAUD_STOP_SHIPMENT, SELLER_CANCEL_PRICING_ERROR }
  export enum WishTicketSearchType { 编号 = 'ticketid', 发货单号 = 'shipordercode', 买家ID = 'buyerid', 标签 = 'label' }
  export enum CustomerHandleProcess { 已联系 = 1, 未处理, 已忽略 }
  export enum LogisticsStatus { 已妥投 = 1, 到达待取, 异常, 投递失败, 延误, 头程退回, 尾程退件 }
  export enum ShopeeReturnReason { NON_RECEIPT = 'NON_RECEIPT', OTHER = 'OTHER', NOT_RECEIVED = 'NOT_RECEIVED', UNKNOWN = 'UNKNOWN' }
  export enum ShopeeReturnStatus { REQUESTED = 'REQUESTED', ACCEPTED = 'ACCEPTED', CANCELLED = 'CANCELLED', JUDGING = 'JUDGING', REFUND_PAID = 'REFUND_PAID', CLOSED = 'CLOSED', PROCESSING = 'PROCESSING', SELLER_DISPUTE = 'SELLER_DISPUTE' }
  export enum ShopeeReturnSearchType { 退款编号 = 1, 发货单号, 买家ID }
  export enum ShopeeCancellationStatus { READY_TO_SHIP = "READY_TO_SHIP", IN_CANCEL = "IN_CANCEL", CANCELLED = "CANCELLED", TO_RETURN = "TO_RETURN", COMPLETED = "COMPLETED" }
  export enum ShopeeCancellationSearchType { 平台单号 = 1, 发货单号, 买家ID }
  export enum AllegroOrderDisputeType { CLOSED = 1, ONGOING, UNRESOLVED }

  export enum EmailAccountSearchType { 名称 = 1, 邮箱 }

  export enum AllegroRatingType {  'do not recommend（不推荐）'=0, 'recommend（推荐）'=1 }
  export enum AllegroRatingState { 待处理 = 1, 已联系, 已发请求, 已删除评价, 修改请求过期 }
  export enum AllegroRatingSearchType { 发货单号 = 1, 买家ID }
}

namespace Report {
  export enum PaymentType { 付款单 = 1, 退款单 = 0 }
  export enum SkuSortBy { SKU创建时间由新到旧 = 1, SKU销量由高到低 }
  export enum YesterdaySearchType { SKU编号 = 1, SKU名称, 开发员 }
  export enum GrossProfitType { 发货单号 = 1, 平台单号, SKU编号, ItemId, 买家ID, 跟踪号 }
  export enum DataType { 毛利 = 1, 毛利率 }
  export enum CompareType { 大于 = 1, 等于, 小于 }
  export enum ImportFreightType { 已导入头程运费 = 1, 已导入尾程运费, 未导入运费 }
  export enum ExportType { 发货单毛利报表 = 1, 发货单毛利报表附加SKU }
  export enum ImportType { 头程运费 = 1, 尾程运费, 头尾程运费, 完整运费 }
  export enum TimeType { 年份 = 1, 季度, 月份 }
  export enum InvoiceType { 费用类型 = 1, 费用说明 }
  export enum ModuleType { 配置 = 1, 人事, 采购, 产品, 销售, 仓储, 物流, 客服, 财务, 报表 }
  export enum ExportStatus { 未开始 = 1, 执行中, 导出成功, 导出失败 }
}
  

export default {
  Public: Public,
  User: User,
  Purchase: Purchase,
  Product: Product,
  Setting: Setting,
  Finance: Finance,
  Sales: Sales,
  Warehouse: Warehouse,
  Logistics: Logistics,
  CustomerService: CustomerService,
  Report: Report
}
