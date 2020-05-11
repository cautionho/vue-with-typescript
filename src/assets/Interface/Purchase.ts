import PInterface from './Public'

namespace Interface {
	export class SupplierSearch {
		Province: number = 0
		City: number = 0
		Area: number = 0
		Status: boolean | string = ""
		SearchKeyType: string|number = 0
		SearchKey: string = ""
		IsPeriod: boolean | string = ""
		LocationArea: number[]
	}
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
	export class SetPay {
		SupplyName: string = ""
		SupplyId: number = 0
		Period: number | string = ""
	}
	export class SendOpsMails {
		Title: string = ""
		MsgType: number | string = ""
		IsGlobalSend: number = 1
		IsSendEmail: number = 1
		Content: string = ""
		SupplyIds: number[]
		OperateId: number | string = ""
		OperateName: string = ""
	}
}

//入库员绩效、质检员绩效
namespace Interface {
	export class WarePerformanceSearch {
		BeginTime: string | number = ""
		EndTime: string | number = ""
		QaUserName: string = ""
		WareHouseId: number = 50
	}
	export class WarePerformance {
		Name: string
		Number: number
	}
}


//采购单管理
namespace Interface {
	//采购单列表搜索参数
	export class PurchaseOrdSearch {
		CompleteStatus: number = 0
		IsPmsOrder: boolean = false
		IsReissue: boolean | string | number = ""
		PayStatus: number = 0
		Purchaser: number = 0
		RefundStatus: number = 0
		SaleManager: number = 0
		SearchKey: string = ""
		SearchKeyType: number = 0
		SourceType: number = 0
		Status: number = 0
		SupplyId: number = 0
		WarehouseId: number = 0
	}
	//采购单列表返回数据
	export class PurchaseOrd {
		CreateTime: string
		CurrencyCode: string
		ExpectedTime: string
		Id: number = 0
		InStoragePrice: number
		IsPmsOrder: boolean
		ItemCount: number
		PayStatus: number
		PurchaseCode: string
		PurchaseManagerName: string
		PurchaserName: string
		RefundStatus: number
		Remark: string
		SaleManagerName: string
		ShippingCost: number
		SourceType: number
		Status: number
		SupplyName: string
		ThirdOrderCode: string
		TotalPrice: number
		WarehouseName: string
		Items?: Interface.PurchaseOrdItem
		RealPrice?: string | number
	}
	//采购单明细列表返回数据
	export class PurchaseAvgSaleQuantity {
		AvgSaleQuantity7: number
		AvgSaleQuantity15: number
		AvgSaleQuantity30: number
		AvgSaleQuantity45: number
		AvgSaleQuantity60: number
	}
	//采购单明细列表返回数据
	export class PurchaseInventory {
		Id: number
		LocationCode: string
		PurchasingQuantity: number
		Quantity: number
		ShippingQuantity: number
		WaitingShipedQuantity: number
	}
	//采购单明细列表返回数据
	export class PurchaseItem {
		ActualCost: number
		ArrivalQuantity: number
		AvgShippingCost: number
		CompleteTime: string
		CurrencyCode: string
		DefaultImage: string
		HCurrencyCode: string
		Id: number
		InStorageQuantity: number
		IsCompleted: boolean
		LCurrencyCode: string
		LastTimePrice: number
		LowestPrice: number
		PurchasePrice: number
		PurchaseQuantity: number
		SkuCode: string
		SkuName: string
		Remark?: string
		Delivery?: number
	}
	//采购单明细列表组合
	export class PurchaseOrdItem {
		AvgSaleQuantity: Interface.PurchaseAvgSaleQuantity
		Inventory: Interface.PurchaseInventory
		Item: Interface.PurchaseItem
	}
	//基本信息返回数据
	export class PurchaseDetail {
		CreateTime: string = ""
		ExpectedTime: string = ""
		Id: number = 0
		OrderCreateTime: string = ""
		PurchaseCode: string = ""
		PurchaseManager: string | number = ""
		PurchaseManagerName: string = ""
		PurchaserName: string = ""
		Remark: string = ""
		SaleManagerName: string = ""
		ShippingCost: number = 0
		SourceType: number = 0
		Status: number = 0
		SupplyId: number = 0
		SupplyName: string = ""
		ThirdOrderCode: string = ""
		WarehouseName: string = ""
	}
	//操作记录返回数据
	export class PurchaseOpeHistory {
		Id: number
		OperateLog: string
		OperateTime: string
		Operator: string
	}
	//到货单列表数据
	export class PurchaseOpeArrival {
		ArrivalQuantity: number
		CreateTime: string
		ExpressCode: string
		ExpressCompany: string
		Id: number
		InStorageQuantity: number
		NoPassQuantity: number
		OrderCode: string
		RefundQuantity: number
		SkuCode: string
		Status: number
	}
	//编辑传参数据
	export class PurchasePostModifyItem {
		Id: number
		PurchasePrice: number
		CurrencyCode: string
		PurchaseQuantity: number
	}
	//编辑传参数据
	export class PurchasePostModify {
		Id: number = 0
		SaleManager: number | string = 0
		PurchaseManager: number | string = 0
		SupplyId: number = 0
		ExpectedTime: string = ""
		ShippingCost: number = 0
		ThirdOrderCode: string = ""
		Remark: string = ""
		IsSbumit: boolean = false
		Item: Interface.PurchasePostModifyItem[] = []
	}
	//审核传参
	export class ReviewPostData {
		Id: number[] = []
		Status: number | string = 0
		Purchaser: number | string = ""
		Remark: string = ""
	}
	//申请付款传参
	export class ApplyFinanceData {
		CreateTime: string = ""
		Creator: number = 0
		CreatorName: string = ""
		GoodsAmount: number = 0
		GoodsCurrency: string = ""
		Id: number = 0
		OperateTime: string = ""
		Operator: number = 0
		OperatorName: string = ""
		PlatformOrderId: string = ""
		Remark: string = ""
		ShippingAmount: number = 0
		ShippingCurrency: string = ""
		SourceCode: string = ""
		Status: string|number = ""
		PayCurrency?: string
		PayType?: number
		PayCode?: string
		PayAmount?: number
		RefundType?: number
		RefundCode?: string
		RefundCurrency?: string
		RefundAmount?: number
	}
	
	//不等待余货/终止采购 传参
	export class PreventData {
		Id: number[] = []
		Remark: string = ""
	}
	//添加发货明细传参
	export class AddShipPonItem {
		ArrivalQuantity: number = 0
		Id: number = 0
		Remark: string = ""
	}
	//添加发货传参
	export class AddShipPonData {
		ExpressCode: string = ""
		ExpressCompany: string = ""
		Id: number = 0
		Item: Interface.AddShipPonItem[] = []
	}
	//导出采购单打印数据
	export class ExportPonData {
		Items: Interface.PurchaseOrdItem
		RealPrice: string | number = 0
	}
	// 导出采购单明细
	export class ExportPonDetailsForm {
		IsOps: boolean | '' = ''
		StartTime: string = ''
		EndTime: string = ''
		Status: number | '' = ''
	}
}


// 采购申请
namespace Interface {
	export class PurchaseApplySearch {
		WarehouseId: number | '' = ''
		Purchaser: string = ''
		Creator: number | '' = ''
		SaleManager: string = ''
		Status: number | '' = ''
		SearchKeyType: number | '' = ''
		SearchKey: string = ''
	}

	export class ModifyPurchaseApplySearch {
		WarehouseId: number | '' = ''
	}

	export class ModifyPurchaseApplyEdit {
		WarehouseId: number | '' = ''
		Quantity: number | '' = 0
		Remark: string | '' = ''
	}

	export class PurchaseApply {
		ApplySummary: ApplySummary = new ApplySummary()
		AvgSaleQuantity: AvgSaleQuantity = new AvgSaleQuantity()
		Inventory: Inventory = new Inventory()
	}

	// 采购申请
	export class ApplySummary {
		Id: number = 0
		SkuId?: number = 0
		SkuCode: string = ''
		SkuName?: string = ''
		DefaultImage?: string = ''
		ToWarehouseId: number = 0
		WarehouseName?: string = ''
		Status?: number = 0
		PurchaseQuantity: number = 0
		Creator?: number = 0
		CreatorName?: string = ''
		CreateTime?: string = ''
		Purchaser?: number = 0
		PurchaserName?: string = ''
		SaleManager?: number = 0
		SaleManagerName?: string = ''
		ReviewTime?: string = ''
		Remark?: string = ''
		PurchaseCode: string = ''
		PurchaseOrderId?: number = 0
		Quantity: number | string = 0
		PurchasingQuantity?: number = 0
		ShippingQuantity?: number = 0
		WaitingShipedQuantity?: number = 0
		LocationCode?: string = ''
	}

	// 平均销量
	export class AvgSaleQuantity {
		SkuId?: number = 0
		WarehouseId?: number = 0
		AvgSaleQuantity7: number = 0
		AvgSaleQuantity15: number = 0
		AvgSaleQuantity30: number = 0
		AvgSaleQuantity45: number = 0
		AvgSaleQuantity60: number = 0
	}

	// 库存
	export class Inventory {
		Id: number = 0
		LocationCode: string = ''
		Quantity: number = 0
		PurchasingQuantity: number = 0
		ShippingQuantity: number = 0
		WaitingShipedQuantity: number = 0
	}

	// 审核记录
	export class AuditHistory {
		Id: number = 0
		Operator: string = ''
		OperateTime: string = ''
		OperateLog: string = ''
	}

	// 采购单详情
	export class ApplyOrderInfo {
		Id: number = 0
		PurchaseCode: string = ''
		WarehouseName: string = ''
		SourceType: number = 0
		SupplyId: number = 0
		SupplyName: string = ''
		Status: number = 0
		PurchaserName: string = ''
		PurchaseManager: number = 0
		PurchaseManagerName: string = ''
		SaleManagerName: string = ''
		CreateTime: string = ''
		ExpectedTime: string = ''
		Remark: string = ''
		ThirdOrderCode: string = ''
		OrderCreateTime: string = ''
		ShippingCost: number = 0
	}

	// 添加采购申请列表
	export class GoodsData {
		ApplySummarX: PInterface.EnableSku | ApplySummary = new ApplySummary()
		AvgSaleQuantitX: AvgSaleQuantity = new AvgSaleQuantity()
		InventorX: Inventory | string = new Inventory()
	}

	export class ChangeStatusData {
		Id: number[] = []
		Remark: string = ''
		Status: number = 1
	}
}

// 到货单管理
namespace Interface {
	// 搜索
	export class PaoSearch {
		ExceptStatus: number | '' = ''
		Purchaser: number | '' = ''
		QAUser: number | '' = ''
		SearchKey: string = ''
		SearchKeyType: number | '' = ''
		Status: number | '' = ''
		WarehouseId: number | '' = ''
	}
	// 列表
	export class Pao {
		ArrvialQuantity: number = 0
		CreateTime: string = ''
		DefaultImage: string = ''
		ExceptHandeType: number = 0
		ExceptHandleTime: string = ''
		ExceptHandler: number = 0
		ExceptHandlerRemark: string = ""
		ExceptStatus: number | '' = ''
		ExpressCode: string = ""
		ExpressCompany: string = ""
		Id: number = 0
		InStorageQuantity: number = 0
		InStorageTime: string = ""
		IsNew: boolean = false
		LocationCode: string = ""
		NoPassQuantity: number = 0
		OperateTime: string = ""
		OrderCode: string = ""
		PurchaseCode: string = ""
		PurchaseQuantity: number = 0
		PurchaseTime: string = ""
		PurchaserName: string = ""
		QATime: string = ""
		QAUser: number | '' = ''
		RefundQuantity: number = 0
		RelateId: number | null = 0
		Remark: string = ""
		SignTime: string = ""
		SkuCode: string = ""
		SkuId: number = 0
		SkuName: string = ""
		Status: number | '' = ''
		StockUpWarehouseId: number = 0
		SupplyName: string = ""
		TrackCode: string = ""
		WaitInStorageQuantity: number = 0
		WarehouseName: string = ""
		ActualQuantity?: number = 0
	}
	// 提交 质检 表单
	export class QualityTestingForm {
		Id: number = 0
		NoPassQuantity: number = 0
		Remark: string = ""
		ImageUrl: string[] = []
		Length: number = 0
		Width: number = 0
		Height: number = 0
		GrossWeight:  number = 0
		NetWeight: number = 0
		PCS: number = 0
		WeightRemark:string = ""
		ActualQuantity:  number = 0
	}

	// 单个单号
	export class SingleCodeForm {
		Code: string = ""
	}

	//  SKU详细信息
	export class SkuInfo {
		Id: number = 0
		SkuCode: string = ""
		SkuName: string = ""
		SkuNameEn: string = ""
		SaleKeyWords: string = ""
		Status: number = 0
		IsNew: false
		BrandId: number = 0
		BrandName: string = ""
		CategoryId: number = 0
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
		DevTime:string = ""
		Length: number = 0
		Width: number = 0
		Height: number = 0
		GrossWeight: number = 0
		NetWeight: number = 0
		WeightRemark: ""
		Pcs: number = 0
		MainId: number = 0
		HasProperty: false
		Remark: string = ""
		Description: string = ""
		Sizes: string = ""
		CreateTime: string = ""
	}

	// 修改物流信息
	export class ExpressInfoForm {
		ExpressCompany: string = ""
		ExpressCode: string = ""
		OtherExpressCompany: string = ""
	}

	// 扫描签收
	export class ExpressCodeForm{
		ExpressCode: string = ""
	}

	// 打印SKU标签信息
	export class PrintSku {
		SkuCode:  string = ""
		SkuName:  string = ""
		ArrivalQuantity: number = 0
		BarCode:  string = ""
		LocationCode: string = ""
		PaoOrderCode: string = ""
	}

	// 入库 提交
	export class InStorageForm {
		Id: number = 0
		OrderCode: string = ""
		InStorageQuantity: number = 0
		LocationCode: string = ""
		InStorageQuantity2: number = 0
		LocationCode2: string = ""
		SkuName: string = ""
	}

	//导出入库记录
	export class ExportForm {
		InStorageTime: string | Date = ""
		WarehouseId: number = 0
	}

	// 退换货记录
	export class RefundRecord {
		TrackCode: string = ""
		RefundQuantity: number = 0
		OperateTime: string | Date = ""
	}

	// 入库记录
	export class InStorageRecord {
		InStorageQuantity: number = 0
		LocationCode: string = ""
		InStorageTime: string | Date = ""
	}
}

//国内仓采购建议
namespace Interface {
	//列表搜索参数
	export class ProposalSearch {
		WarehouseId: string|number = 0
		Purchaser: string|number = 0
		SupplyId: string|number = 0
		SearchKeyType: string|number = 0
		SearchKey: string = ""
		PurchaseState: string|boolean = ""
		InventorySearchKeyType: string|number = 0
		InventoryStart: string|number = ""
		InventoryEnd: string|number = ""
		StartCanSellDay: string|number = ""
		EndCanSellDay: string|number = ""
	}
	//分页列表
	export class ProposalList {
		AttributesIds: number[] = []
		BuyQuantity: number
		DayOfSaleAvgQty: number
		DaysToSell: number
		FS_SuggestQty: number
		LastUpdateTime: string
		OS_SuggestQty: number
		PurchaseOrderCodes: string
		PurchasePrice: number
		PurchaseState: boolean
		PurchaserName: string
		PurchasingQuantity: number
		Quantity: number
		SkuCode: string
		SkuId: number
		SkuImage: string
		SkuName: string
		SuggestQty: number
		SupplyId: number
		SupplyName: string
		WareHouseId: number
		WareHouseName: string
	}
	//生成采购单
	export class PostGenerateOrd {
		SkuCode: string = ""
		SkuId: string | number = ""
		WarehouseId: string | number = ""
		Quantity: string | number = ""
		PurchasePrice: string | number = ""
		Remark: string | number = ""
	}
	//详情报表数据展示
	export class DetailReportData {
		Sixty: number = 0
		FortyFive: number = 0
		Thirty: number = 0
		Fifteen: number = 0
		Seven: number = 0
	}
}

// 采购进度
namespace Interface {
	// 搜索参数
	export class SuggestProcessSearch {
		WarehouseId: number | "" = ""
		Purchaser: number | "" = ""
		IsComplete: number = 0
		SearchKeyType: number | "" = ""
		SearchKey: string = ""
	}

	// 列表
	export class SuggestProcessList {
		SkuImage: string = ""
		SkuCode: string = ""
		SkuName: string = ""
		SkuId: number = 0
		WareHouseId: number = 0
		WareHouseName: string = ""
		PurchaserName: string = ""
		SuggestQty: number = 0
		TodayBookOrderQty: number = 0
	}
}

export default Interface;
