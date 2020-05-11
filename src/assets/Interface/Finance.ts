
namespace Interface{
  export class PayManageSearch {
    Creator: number = 0
    EndTime: string = ""
    Operator: number = 0
    PayType?: number = 0
    RefundType?: number = 0
    SearchKey: string = ""
    SearchKeyType: number = 0
    StartTime: string = ""
    Status: number = 0
    TimeType: number = 0
  }

  export class ApplyFinanceList {
    CreateTime: string
    Creator: number
    CreatorName: string
    GoodsAmount: number = 0
    GoodsCurrency: string
    Id: number = 0
    OperateTime: string
    Operator: number = 0
    OperatorName: string
    PayAmount?: number = 0
    PayCode: string
    PayCurrency: string
    PayType?: number = 0
    PlatformOrderId: string
    Remark: string
    ShippingAmount: number = 0
    ShippingCurrency: string
    SourceCode: string
    Status: number = 0
    RefundAmount?: number = 0
    RefundType?: number = 0
    RefundCode?: string
    RefundCurrency?: string
  }

  export class LogData{
    Id: number
    OperateLog: string
    OperateTime: string
    Operator: string
    OrderCode: string
  }
}

namespace Interface{
  export class PayPalAccountSearch {
    IsEnable: boolean | "" = ""
    PaypalEmail: string = ""
  }
  export class PayPalAccountList{
    AccountBalance: string = ""
    BalanceCurrency: string = ""
    Id: number = 0
    IsEnable: boolean
    PaypalEmail: string = ""
  }
  export class PayPalAccountData{
    AccountBalance: string = ""
    ApiPassword: string = ""
    ApiSignature: string = ""
    ApiUserName: string = ""
    BalanceCurrency: string = "USD"
    Id: number = 0
    IsEnable: boolean = true
    PaypalEmail: string = ""
    Subject: string = ""
  }
}

export default Interface