<template>
	<Modal :title="Title" v-model="OpenApplyModal" :mask-closable="false" :width="1200" @on-cancel="EmitPurchase(false)">
    <Table class="" size="small" :highlight-row="true" :columns="ApplyFinanceCol" :data="FinanceData" border stripe height="500"></Table>
    <div class="P-TA-R P-MT-10" v-if="FinanceModule === 1 ||FinanceModule === 3"><Button type="primary" @click="AddRow">添加一行</Button></div>
    <footer slot="footer">
      <Button type="primary" @click="ValidateCheckPON(true)">提交</Button>
      <Button type="primary" v-if="FinanceModule" @click="ValidateCheckPON(false)">{{[2,4].includes(FinanceModule) ? '修改' : '添加'}}</Button>
      <Button @click="EmitPurchase(false)">取消</Button>
    </footer>
	</Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
import FInterface from '@/assets/Interface/Finance';
@Component({
  name: 'ApplyFinanceOrder'
})
export default class ApplyFinanceOrder extends Vue {
  @Prop() DropFinanceList: PInterface.KV[] //财务下拉
  @Prop() CurrentPon: number  //4-付款 5-退款

  @Emit() private EmitPurchase(val: boolean){
    this.FinanceData = [];
    this.OpenApplyModal = false;
  }

  private TriggerModal(SelectedData: Interface.PurchaseOrd[] | FInterface.ApplyFinanceList[], FinanceModule: number): void{
    if(FinanceModule === undefined){
      if(this.CurrentPon === 4 && !((SelectedData as Interface.PurchaseOrd[]).every( (Item) => { return Item.Status==9 && Item.PayStatus==1 }))){
        this.$UI.Tips.Floating('warning', `请选择状态为待付款且未申请付款的采购单进行操作`);
        return;
      }

		  if(this.CurrentPon === 5 && !((SelectedData as Interface.PurchaseOrd[]).every( (Item) => { return (Item.Status==4 || Item.Status==5 || Item.Status==6 || Item.Status==7 || Item.Status==9) && Item.RefundStatus==1 }))){
        this.$UI.Tips.Floating('warning', `请选择状态为待付款、待发货、待签收、待入库或部分入库且未申请退款的采购单进行操作`);
        return;
      }
    }
    this.$nextTick(()=>{
      this.SelectedData = SelectedData;
      this.FinanceModule = FinanceModule;
      this.Title = this.FinanceModule == 1 ? '添加付款单' : this.FinanceModule == 2 ? '编辑付款单' : this.FinanceModule == 3 ? '添加退款单' : this.FinanceModule == 4 ? '编辑退款单' : this.CurrentPon == 4 ? '申请付款' : this.CurrentPon == 5 ? '申请退款': ""
      
      this.TestingCol();
      this.ParseData();
      this.OpenApplyModal = true;
    })
  }

  get FinanceDropList(){
    return this.DropFinanceList;
  }

  private TestingCol(){
    if(this.ApplyFinanceCol.length === 8 && (this.FinanceModule === 1 || this.FinanceModule === 3)){
      this.ApplyFinanceCol.push(
        { title: '操作', width: 100, render: (h: any, Params: any): string => {
          return h('Button', {
            props: {
              type: 'error',
              size: 'small'
            },
            on: {
              click: () => {
                this.DeleteRow()
              }
            }
          }, '删除')
        }
      })
    }else if(this.ApplyFinanceCol.length> 8){
      this.ApplyFinanceCol.pop();
    }
  }

  //表格内数据填充到提交数据
  private SetTabInput(val: string|number, idx: number, key:string): void{
    (this.FinanceData[idx] as any)[key] = val
    if(key === 'GoodsAmount' || key === 'ShippingAmount'){
      if(this.CurrentPon === 4){
        (this.FinanceData[idx] as Interface.ApplyFinanceData)['PayAmount'] = Number(((this.FinanceData[idx] as Interface.ApplyFinanceData)['GoodsAmount'] + (this.FinanceData[idx] as Interface.ApplyFinanceData)['ShippingAmount']).toFixed(2))
      }else{
        (this.FinanceData[idx] as Interface.ApplyFinanceData)['RefundAmount'] = Number(((this.FinanceData[idx] as Interface.ApplyFinanceData)['GoodsAmount'] + (this.FinanceData[idx] as Interface.ApplyFinanceData)['ShippingAmount']).toFixed(2))
      }
    }

    if(key === 'Operator'){
      (this.FinanceData[idx] as Interface.ApplyFinanceData)['OperatorName'] = ""
    }
  }

  private ParseData():void{
    this.SelectedData.forEach( (item:Interface.PurchaseOrd | FInterface.ApplyFinanceList) => {
      let Obj: Interface.ApplyFinanceData = new Interface.ApplyFinanceData()
      
      Obj["ShippingAmount"] = !this.FinanceModule ? (item as Interface.PurchaseOrd).ShippingCost : (item as FInterface.ApplyFinanceList).ShippingAmount
      Obj["SourceCode"] = !this.FinanceModule ? (item as Interface.PurchaseOrd).PurchaseCode : (item as FInterface.ApplyFinanceList).SourceCode
      Obj["GoodsAmount"] = !this.FinanceModule ? (item as Interface.PurchaseOrd).TotalPrice : (item as FInterface.ApplyFinanceList).GoodsAmount 
      Obj["OperatorName"] = ""
      Obj["CreateTime"] = this.$UI.Render.NewDate(new Date())
      Obj["Creator"] = JSON.parse(this.$Cookie.Get('frler_user')).UserId
      Obj["CreatorName"] = JSON.parse(this.$Cookie.Get('frler_user')).UserName,
      Obj["OperateTime"] = this.$UI.Render.NewDate(new Date())
      Obj["GoodsCurrency"] = "CNY"
      Obj["ShippingCurrency"] = "CNY"
      Obj["Operator"] = 308

      if(this.CurrentPon === 4){
        if(this.FinanceModule){
          Obj["Id"] = item.Id;
          Obj["PayAmount"] = Number((item as FInterface.ApplyFinanceList).PayAmount);
          Obj["PayType"] = (item as FInterface.ApplyFinanceList).PayType as number;
          Obj["Remark"] = (item as FInterface.ApplyFinanceList).Remark;
          Obj["PlatformOrderId"] = (item as FInterface.ApplyFinanceList).PlatformOrderId;
          Obj["PayCode"] = (item as FInterface.ApplyFinanceList).PayCode;
          Obj["Operator"] = (item as FInterface.ApplyFinanceList).Operator ? (item as FInterface.ApplyFinanceList).Operator : 308;
          Obj["OperatorName"] = (item as FInterface.ApplyFinanceList).OperatorName ? (item as FInterface.ApplyFinanceList).OperatorName : "";
          Obj["Status"] = 1
        }else{
          Obj["PayAmount"] = Number((item as Interface.PurchaseOrd).TotalPrice) + Number((item as Interface.PurchaseOrd).ShippingCost);
          Obj["PayType"] = 1;
          Obj["PayCode"] = "";
        }
        Obj["PayCurrency"] = "CNY";
        
      }else{
        if(this.FinanceModule){
          Obj["Id"] = item.Id;
          Obj["RefundAmount"] = Number((item as FInterface.ApplyFinanceList).RefundAmount);
          Obj["RefundType"] = (item as FInterface.ApplyFinanceList).RefundType as number;
          Obj["Remark"] = (item as FInterface.ApplyFinanceList).Remark;
          Obj["PlatformOrderId"] = (item as FInterface.ApplyFinanceList).PlatformOrderId;
          Obj["RefundCode"] = (item as FInterface.ApplyFinanceList).PayCode;
          Obj["Operator"] = (item as FInterface.ApplyFinanceList).Operator ? (item as FInterface.ApplyFinanceList).Operator : 308;
          Obj["OperatorName"] = (item as FInterface.ApplyFinanceList).OperatorName ? (item as FInterface.ApplyFinanceList).OperatorName : "";
          Obj["Status"] = 1
        }else{
          Obj["RefundAmount"] = Number((item as Interface.PurchaseOrd).TotalPrice) + Number((item as Interface.PurchaseOrd).ShippingCost);
          Obj["RefundType"] = 1;
          Obj["RefundCode"] = "";
        }
        Obj["RefundCurrency"] = "CNY";
      }
      
      this.FinanceData.push(Obj)
    })
  }

  private AddRow(): void{
    let Obj:Interface.ApplyFinanceData = new Interface.ApplyFinanceData()
    Obj["CreateTime"] = this.$UI.Render.NewDate(new Date())
    Obj["Creator"] = JSON.parse(this.$Cookie.Get('frler_user')).UserId
    Obj["CreatorName"] = JSON.parse(this.$Cookie.Get('frler_user')).UserName,
    Obj["OperateTime"] = this.$UI.Render.NewDate(new Date())
    Obj["Operator"] = 308
    Obj["GoodsCurrency"] = "CNY"
    Obj["ShippingCurrency"] = "CNY"
    if(this.CurrentPon === 4){
      Obj["PayCurrency"] = "CNY"
      Obj["PayType"] = 0
      Obj["PayCode"] = ""
      Obj["PayAmount"] = 0
    }else{
      Obj["RefundCurrency"] = "CNY"
      Obj["RefundType"] = 0
      Obj["RefundCode"] = ""
      Obj["RefundAmount"] = 0
    }
    this.FinanceData.push(Obj)
  }

  private ValidateCheckPON(IsSubmit: boolean):void{
    if(this.FinanceData.length < 1){
      this.$UI.Tips.Floating('warning', `请添加数据`);
      return
    }
    let Flag: boolean = true
    try{
      this.FinanceData.forEach( (item, index) =>{
        if((this.CurrentPon === 4 && item.PayType === 0) || ( this.CurrentPon === 5 && item.RefundType === 0)){
          this.$UI.Tips.Floating('warning', `请选择第[${index+1}]项的费用类型`);
          Flag = false;
          throw new Error("break")
        }
        if(!item.SourceCode){
          this.$UI.Tips.Floating('warning', `请输入第[${index+1}]项的来源单据`);
          Flag = false;
          throw new Error("break")
        }
        if((this.CurrentPon === 4 && item.PayAmount === 0) || ( this.CurrentPon === 5 && item.RefundAmount === 0)){
          this.$UI.Tips.Floating('warning', `请输入第[${index+1}]项的总金额`);
          Flag = false;
          throw new Error("break")
        }
        if(item.Operator === 0){
          this.$UI.Tips.Floating('warning', `请选择第[${index+1}]项的经办人`);
          Flag = false;
          throw new Error("break")
        }
      })
    } catch(E){
      if(E.message !== 'break') throw E
    }
    

    if(Flag){
      this.CheckPON(IsSubmit)
    }
  }

  private CheckPON(IsSubmit: boolean):void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: this.FinanceModule === 2 ? this.$Api.PayOrderModify : this.FinanceModule === 4 ? this.$Api.RefundOrderModify : this.CurrentPon === 4 ? this.$Api.PayOrderCreate : this.$Api.RefundOrderCreate,
				Login: true
			},
			Data: {Data: [2,4].includes(this.FinanceModule) ? this.FinanceData[0] : this.FinanceData, IsSubmit: IsSubmit},
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.$UI.Tips.Floating('success', `${this.FinanceModule == 1 ? '添加付款单' : this.FinanceModule == 2 ? '编辑付款单' : this.FinanceModule == 3 ? '添加退款单' : this.FinanceModule == 4 ? '编辑退款单' : this.CurrentPon === 4 ? '申请付款' : this.CurrentPon === 5 ? '申请退款' : ""}成功`);
          this.EmitPurchase(true)
				} else {
					this.$Request.Error(res);
				  this.$UI.Loading.Hide();
				}
			}
		})
  }

  private SetInput(h: any, Params: any){
    return !this.FinanceModule ? h('span', Params.row.GoodsAmount) : h('InputNumber', {
      props: {
        placeholder: '请输入货品金额',
        value: Params.row.GoodsAmount,
        min: 0
      },
      on: {
        'on-change': (name: number) => {
          this.SetTabInput(name, Params.index, 'GoodsAmount')
        }
      }
    })
  }

  private FinanceModule: number = 0
  private SelectedData: Interface.PurchaseOrd[] | FInterface.ApplyFinanceList[] = []
  private Title: string = ""; //模态框标题
  private PayTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Finance.PayType)
  private RefundTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Finance.RefundType)
  private FinanceData: Interface.ApplyFinanceData[] = []  //提交数据
  private OpenApplyModal: boolean = false;  //模态框
  private ApplyFinanceCol: PInterface.TableCol[] = [
    { renderHeader:(h: any, Params: any): string =>{
      return h('div', {
        class: 'P-Required'
      }, '费用类型')
    }, render: (h: any, Params: any): string => {
      let DropList = this.CurrentPon === 4 ? this.PayTypeList : this.RefundTypeList;
      return h('Select', {
        props: {
          placeholder: '请选择费用类型',
          value: this.CurrentPon === 4 ? Params.row.PayType : Params.row.RefundType,
          options: DropList,
          onChange: (Val: number ) => {
            this.SetTabInput(Val, Params.index, this.CurrentPon === 4 ? 'PayType' : 'RefundType')
          }
        }
      })
      }
    },
    { renderHeader:(h: any, Params: any): string =>{
      return h('div', {
        class: 'P-Required'
      }, '来源单据')
    }, render: (h: any, Params: any): string => 
			h('Input', {
        props: {
          placeholder: '请输入来源单据',
          value: Params.row.SourceCode
        },
        on: {
          'on-change': (name: any) => {
            this.SetTabInput(name.target.value, Params.index, 'SourceCode')
          }
        }
      })
    },
    { title: '货品金额（CNY）', key: 'PurchaserName', render: (h: any, Params: any): string => {
      return this.SetInput(h, Params)
			
    } },
    { title: '运费（CNY）', key: 'PurchaserName', render: (h: any, Params: any): string => 
      h('InputNumber', {
        props: {
          placeholder: '请输入运费',
          value: Params.row.ShippingAmount,
          min: 0
        },
        on: {
          'on-change': (name: number) => {
            this.SetTabInput(name, Params.index, 'ShippingAmount')
          }
        }
      })
    },
    { renderHeader:(h: any, Params: any): string =>{
      return h('div', {
        class: 'P-Required'
      }, '总金额')
    }, render: (h: any, Params: any): string => {
			return h('span', '￥'+ (Params.row.GoodsAmount + Params.row.ShippingAmount).toFixed(2) )
    } },
    { renderHeader:(h: any, Params: any): string =>{
      return h('div', {
        class: 'P-Required'
      }, '经办人')
    }, render: (h: any, Params: any): string => {
      return h('Select', {
        props: {
          placeholder: '请选择经办人',
          value: Params.row.Operator,
          options: this.FinanceDropList,
          onChange: (Val: number ) => {
            this.SetTabInput(Val, Params.index, 'Operator')
          }
        }
      })
    }},
    { title: '平台单号', key: 'PurchaserName', render: (h: any, Params: any): string => 
      h('Input', {
        props: {
          placeholder: '请输入平台单号',
          value: Params.row.PlatformOrderId
        },
        on: {
          'on-change': (name: any) => {
            this.SetTabInput(name.target.value, Params.index, 'PlatformOrderId')
          }
        }
      })
    },
    { title: '备注', key: 'PurchaserName', render: (h: any, Params: any): string => 
    h('Input', {
        props: {
          placeholder: '请输入备注',
          value: Params.row.Remark
        },
        on: {
          'on-change': (name: any) => {
            this.SetTabInput(name.target.value, Params.index, 'Remark')
          }
        }
      }) 
    }
  ]
}

</script>
<style lang="less"></style>
