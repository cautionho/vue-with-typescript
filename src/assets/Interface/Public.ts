/*公用*/
namespace PInterface {
	export class Res {
		IsSuccess: boolean
		Msg: string | null
		Data ? : any
		ApiStatusCode ? : number
	}

	export class KV {
		Key: string | number
		Value: string | number
  }
  
  export class Disabled {
    Disabled?: boolean
  }
  
  export class IdName{
    Id: string | number
    Name: string | number
  }

	export class AreaTree {
		Id?: number
		Name?: string
		ParentId?: number
		ChildNodes: AreaTree[]
		children: AreaTree[] = []
		label?: string
		value: string = "0"
		title?: string
	}

	export class Pager {
		TotalItems: number = 0
		PageSize: number = 20
		PageIndex: number = 1
		PageOpt: number[] = [20, 40, 60, 80, 100]
	}

}



// 框架
namespace PInterface {
	export class TableCol {
		type ? : string
		title ? : string
		key ? : string
		width ? : number
		minWidth ? : number
		maxWidth ? : number
		align ? : string
		className ? : string
		fixed ? : string
		ellipsis ? : boolean
		tooltip ? : boolean
		render ? (h: any, params: any) : any {}
		renderHeader ? (h: any, params: any) : any {}
		sortable ? : boolean | string
		children ? : any[]
    resizable ? : boolean
  }
  
  export class Tree {
    title: string
    expand?: boolean
    disabled?: boolean
    disableCheckbox?: boolean
    selected?: boolean
    checked?: boolean
    children?: Tree[]
    render?: (H:any, Node:any) => string
    value: string | number
    [key:string]: any
  }

  export class Cascader {
    value: number | string = ""
    label: string = ""
    children: Cascader[]
    [key: string]: any
  }
}

/*权限相关*/
namespace PInterface {
	export class User {
		UserCode ? : string
		UserName ? : string
		PositionId ? : number
		PositionName ? : string
		WarehouseId ? : number
		IsAdmin ? : boolean
		Status ? : number
		UserId ? : number
		Token ? : string
	}

	export class Resource {
		ActionUrl: string
		ElementId: string
		Id: number
		ParentId: number
		ResourceName: string
		ChildNods: Resource[] | null
	}

	export class Resources {
		Menu: Resource[]
		Point: Resource[]
	}

	export class Power {
		[Key: string]: boolean
	}

	export class Any {
		[Key: string]: any
	}
}

/*发货订单相关*/
namespace PInterface {
	export class Mail {
		OrderCode: string
		TrackingNumber: string
		LatticeMouth: number
		ThirdPartyCode: string
		MethodId: number
		MethodCode: string
		MethodApiType: number
		IsAutoRegistry: boolean
		Remark: string
		LabelUrl: string
		From: MailAddress
		To: ShipToAddress
		Return: MailAddress
		Item: ShipItems
		LogisticsExt: string
	}

	export class MailAddress {
		Country: CountryEntity
		SateOrProvince: string
		City: string
		Street1: string
		Stree2: string
		ZipCode: string
		SendUserName: string
		Phone: string
	}

	export class ShipToAddress {
		OrderId: number = 0
		OrderCode: string = ''
		BuyerFullName: string = ''
    Country: CountryEntity =  new CountryEntity()
    BuyerCountry?: string = ''
		BuyerState: string = ''
		BuyerCity: string = ''
		BuyerStreet1: string = ''
		BuyerStreet2: string = ''
		BuyerZipCode: string = ''
		BuyerPhone: string = ''
	}

	export class ShipItems {
		SkuCode: string
		Weight: number
		Title: string
		TitleEn: string
		Amount: number
		HSCode: string
		Quantity: number
		ItemId: string
	}

	export class CountryEntity {
		CountryCode: string = ''
		CountryName: string = ''
		CountryNameCn: string = ''
	}

	// export class Sku{
	// 	SkuId: number
	// 	SkuCode: string
	// 	GrossWeight: number
	// }
	//
	// export class ShipOrderByTrackCode{
	// 	Id: number
	// 	OrderCode: string
	// 	Status: number
	// 	PlatformOrderId: string
	// 	ShipWarehouseId: number
	// 	WarehouseName: string
	// 	ShippingMethodId: number
	// 	MethodName: string
	// 	ApiType: number
	// 	MethodApiCode: string
	// 	IsAutoRegistry: boolean
	// 	ShippingService: string
	// 	BatchNumber: string
	// 	ItemType: number
	// 	Platform: number
	// 	StoreId: number
	// 	StoreName: string
	// 	BuyerUserId: string
	// 	BuyerEmail: string
	// 	BuyerRemark: string
	// 	PayPrice: number
	// 	PayCurrency: string
	// 	ShippingCost: number
	// 	TotalPrice: number
	// 	TransationId: string
	// 	PlatOrderTime: string
	// 	CreateTime: string
	// 	PaidTime: string
	// 	DownLoadTime: string
	// 	UpPackedTime: string
	// 	ShipedTime: string
	// 	UpPackUserName: string
	// 	UpPackUser: number
	// 	ShipUser: number
	// 	ShipUserName: string
	// 	Weight: number
	// 	ShipFee: number
	// 	ShipFeeCurrency: string
	// 	TrackingNumber: string
	// 	AutoMatchRemark: string
	// 	Remark: string
	// 	IsSplit: boolean
	// 	IsMerge: boolean
	// 	IsApiDownLoad: boolean
	// 	IsHoldUp: boolean
	// 	IsReport: boolean
	// 	IsException: boolean
	// 	LabelUrl: string
	// 	Sku: Sku
	// 	ShipOrderExt: string
	// 	LogisticsExt: string
	// 	AfterSaleOrderType: number
	// 	IsLockPack: boolean
	// 	Country: CountryEntity
	// }
}

// 启禁用相关
namespace PInterface {
	export class ChangeStatus {
		Server: string
		Api: string
		// Params: PInterface.PostChange
		IdKey: string
		StatusKey: string
		TipsKey: string
		ToTarget: boolean
	}

	export class PostChange {
		WarehouseId?: number[] = []
		Id?: number[] = []
		IsEnable ? : boolean
		Status ? : boolean
	}
}

// 可用Sku
namespace PInterface {
	export class EnableSkuSearch {
		SearchKey: string = ""
		Platfrom: number | "" = ""
		Attribute: string = ""
		DevUserId: number | "" = ""
		Purchaser: number | "" = ""
		SaleManager: string = ""
		DevManager: number | "" = ""
		Status: number | "" = ""
		BrandId: number | "" = ""
		SearchType: number | "" = ""
		MainId: number | "" = ""
	}

	export class EnableSku {
		Id: number = 0
		SkuCode: string = ""
		HasProperty: boolean
		DefaultImage: string = ""
		SkuName: string = ""
		Platform: number | "" = ""
		BrandName: string = ""
		CategoryName: string = ""
		Attribute: string = ""
		DevUserName: string = ""
		Purchaser: number | "" = ""
		SaleManager: string = ""
		DefaultSupply: DefaultSupply =  new DefaultSupply()
		CreateTime: string = ""
		Status: number = 0
		Length: number = 0
		Width: number = 0
		Height: number = 0
		GrossWeight: number = 0
		NetWeight: number = 0
		MainId: number | string = ""
		Remark?: string
		Quantity: number | string
	}

	export class DefaultSupply {
		SupplyId: number | "" = ""
		PurchasePrice:  number = 0
		CurrencyCode: string | null
		SupplyName: string | null
	}
}

// 可用Spu
namespace PInterface {
	export class EnableSpuSearch {
		SearchKey: string = ""
		Platfrom: number | "" = ""
		Attribute: string = ""
		DevUserId: number | "" = ""
		Purchaser: number | "" = ""
		SaleManager: string = ""
		DevManager: number | "" = ""
		Status: number | "" = ""
		BrandId: number | "" = ""
		SearchType: number | "" = ""
		MainId: number | "" = ""
		CategoryId: number | "" = ""
		IsBindSku: number | "" = ""
		PropertyType: number = 1
	}
}

//类目树
namespace PInterface {
	export class ProductCagtegoryTree{
    Id: number = 0
    Name: string
		ParentId: number = 0
    Icon?: string
    PrincipalId: number
    ChildNodes: ProductCagtegoryTree[]
    title?: string
		expand?: boolean
		children: ProductCagtegoryTree[] = []
		label?: string
		value: string = "0"
  }
}

export default PInterface
