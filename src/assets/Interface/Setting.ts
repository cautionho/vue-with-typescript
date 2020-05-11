import PInterface from './Public'

namespace Interface {
	export class StateSearch {
		SearchKey: string = ""
	}
	
	export class CountriesCode {
		CountryCode: string
		CountryName: string
		CountryNameCn: string
	}

	export class CurrencyRate {
		Id: number
		Rate:number
		CurrencyCode: string
		CurrencyName: string
	}
}

// 仓库管理
namespace Interface {
	export class Warehouse {
		Id: number = 0
		Name: string = ""
		Type: number | string = ""
		FrCode: string = ""
		ThirdCode: string = ""
		CurrencyCode: string = ""
		CountryCode: string = ""
		Address: string = ""
		ZipCode: string = ""
		Contacts: string = ""
		TelePhone: string = ""
		IsEnable: boolean | string = ""
		RelateId?: string = ""
	}

	export class WarehouseDrop{
		CountryList: PInterface.KV[]
		ERDropList: PInterface.KV[]
		WareTypeList: PInterface.KV[]
	}
}

// 待办事项
namespace Interface {
	export class BackLog{
		Id: number = 0
		CategoryId: string = ""
		ItemName: string = ""
		HrefUrl: string = ""
		RequestUrl: string = ""
		Unit: string = ""
	}

	export class ToDoTree {
		Id: number
		CategoryName: string
		ChildNods: BackLog[]
	}

	export class CategoryMsg{
		Id?: number = 0
		CategoryName?: string = ""
	}
}

//资源菜单
namespace Interface {
	export class Resources{
		ActionUrl: string
		ChildNods: Resources[]
		ElementId: string
		Id: number
		ResourceName: string
		ParentId: number = 0
		title?: string
		expand?: boolean
		children: Resources[] = []
		label?: string
		value: string = "0"
	}

	export class SearchResources{
		ParentId: number = 0
		SearchType: number = 0
		SearchKey: string = ""
	}

	export class ResourcesChild{
		Id: number = 0
		ResourceName: string = ""
		ActionUrl: string = ""
		ParentId: number = 0
		SortId: number = 0
		IncludeAction: string = ""
		ElementId: string = ""
		IsPoint: boolean | string | number = ""
		IsEnable: boolean = true
	}
}

//控制面板
namespace Interface {
	export class ControlReportData{
		AmountCount: number
		OrderCount: number
		ReportDate: string
	}

	export class ControlStoreSearchData{
		Platform: number | "" = ""
		StoreId: number | "" = ""
	}
	export class ControlStoreData{
		Alias: string
		AmountCount: number
		OrderCount: number
		StoreId: number
		StoreName: string
	}
	export class ControlStoreList{
		Key: number
		Value: Interface.ControlStoreData[]
	}

	export class BackLogReqData{
		NeedAuditDemandAmount: number
		NeedProcessDemandAmount: number
		NewDemandAmount: number
	}

	export class BackLogItem{
		CategoryId: number
		HrefUrl: string
		Id: number
		ItemName: string
		RequestUrl: string
		Unit: string
		RequestData: Interface.BackLogReqData | number | undefined
	}

	export class BackLogData{
		CategoryName: string
		ChildNods: Interface.BackLogItem[]
		Id: number
	}

	export class BackLogTemporary{
		Base: Interface.BackLogItem
		Item: number
		Index: number
	}

	export class ControlCountryCode{
		CountryCode: string
		CountryName: string
		CountryNameCn: string
	}
}

export default Interface