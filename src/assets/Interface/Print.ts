namespace Interface {
  export class PrintData {
    From: Interface.PrintFrom
    Return: Interface.PrintFrom
    Item: Interface.PrintItem[]
    To: Interface.PrintTo
    IsAutoRegistry: boolean
    LabelUrl: string
    LatticeMouth: number
    LogisticsExt: any
    MethodApiType: number
    MethodCode: string
    MethodId: number
    OrderCode: string
    Remark: string
    ThirdPartyCode: string
    TrackingNumber: string
  }

  export class PrintItem {
    Amount: number
    HSCode: string
    ItemId: string
    Quantity: number
    SkuCode: string
    Title: string
    TitleEn: string
    Weight: number
  }

  export class PrintFrom {
    City: string
    Country: Interface.Country
    Phone: string
    SateOrProvince: string
    SendUserName: string
    Street1: string
    Street2: string
    ZipCode: string
  }

  export class Country{
    CountryCode: string
    CountryName: string
    CountryNameCn: string
  }

  export class PrintTo{
    BuyerCity: string
    BuyerCountry: string
    BuyerFullName: string
    BuyerPhone: string
    BuyerState: string
    BuyerStreet1: string
    BuyerStreet2: string
    BuyerZipCode: string
    Country: Interface.Country
    OrderCode: string
    OrderId: number
  }

  export class LocalData{
    PrintDate:string
    ToAddress:string
    ReturnAddress: string
    FromAddress: string
    totalQty: number
    totalWeight: number
    totalValue: number
  }

  export class PmsPrintData{
    Items: Interface.PmsItem[]
    MethodCode: string
    NncCode: string
    OrderCode: string
    PickCode: string
    PmsCode: string
  }

  export class PmsItem{
    SkuCode: string
    SkuName: string
    Quantity: number
    InventoryQuantity: number
    LocationCode: string
  }
}

export default Interface