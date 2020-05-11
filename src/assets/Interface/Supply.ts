namespace Interface {
	export class SupplierSearch {
		Province: number
		City: number
		Area: number
		Status: boolean | string
		SearchKeyType: number
		SearchKey: string
		IsPeriod: boolean | string
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
		Province: number = 0
		ProvinceName ? : string = ''
		City: number = 0
		CityName ? : string = ''
		Area: number = 0
		AreaName ? : string = ''
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
}

export default Interface;
