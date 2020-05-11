<template>
<Row>
  <Form :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="100">
    <Checkbox v-model="REFUND_INFO.IsSelectNoRefund" @on-change="PostSelectNotRefund"> 买家升级后，系统不自动退款</Checkbox>
    <FormItem label="操作：" class="P-MB-10">
      <RadioGroup v-model="HandleType">
        <Radio v-for="(Item, Index) in REFUND_INFO.AvailableOptionsList" v-show="$Enums.CustomerService.HandleRefundType[Item]" :key="Index" :label="Item">
          <span>{{$Enums.CustomerService.HandleRefundType[Item]}} </span>
        </Radio>
        <Radio label="RESEND">
          <span>重发</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <Col span="24" v-if="HandleType.includes('REFUND')">
      <FormItem :label="SHIP_ORDER_INFO.Id ? '金额：' : ''" :rules="{ required: HandleType === 'SELLER_OFFER_PARTIAL_REFUND', message: '请输入金额', type: 'number', pattern: $Pattern.PositiveNotZero, trigger: 'change' }" prop="Amount">
        <h3 class="P-Text-Error" v-if="!SHIP_ORDER_INFO.Id">
          无订单数据，无法操作此项！  
        </h3>
        <Col v-else-if="HandleType === 'SELLER_OFFER_PARTIAL_REFUND'">
          <InputNumber class="P-W-400"  v-model="HandleForm.Amount" :min="0" :max="SHIP_ORDER_INFO.PayPrice"></InputNumber>
          {{SHIP_ORDER_INFO.PayCurrency}}
        </Col>
        <span v-else>{{SHIP_ORDER_INFO.PayPrice}} {{SHIP_ORDER_INFO.PayCurrency}}</span>
      </FormItem>
    </Col>
    <Col v-if="HandleType === 'SELLER_ESCALATE'">
      <FormItem label="原因：" :rules="{required: HandleType === 'SELLER_ESCALATE', message: '请选择原因', trigger: 'change', type: 'number'}" prop="TypeReason">
         <Select placeholder="原因" v-model="HandleForm.TypeReason" :options="InquiryReasonList" />
        <!-- <Select placeholder="原因" v-model="HandleForm.TypeReason" clearable filterable>
          <Option v-for="(Item, Index) in InquiryReasonList" :key="Index" :value="$Enums.CustomerService.InquiryReasonList[Item]">{{Item}}</Option>
        </Select> -->
      </FormItem>
    </Col>
    <Col span="24" v-if="HandleType !== 'RESEND'">
      <FormItem label="模板类型：" class="P-MB-10">
        <Select placeholder="模板类型" v-model="TplType" :onChange="GetTemplateListLoading" :options="TemplateTypeDrop" />
        <!-- <Select placeholder="模板类型" v-model="TplType" clearable filterable @on-change="GetTemplateListLoading">
          <Option v-for="(Item, Index) in TemplateTypeDrop" :key="Index" :value="Item.TemplateTypeId">{{Item.TemplateTypeName}}</Option>
        </Select> -->
      </FormItem>
      <FormItem label="模板：" class="P-MB-10">
        <div class="Tpl-Container">
          <a class="P-MR-5" v-for="(Item, Index) in TemplateList" :key="Index" @click="RenderContent(Item)" >{{`(${Index+1}) ${Item.TemplateTitle}`}}</a>
        </div>
      </FormItem>
      <FormItem label="消息：" :rules="{required: HandleType === 'SELLER_SEND_MESSAGE', message: '请输入消息'}" prop="Content">
        <Input placeholder="消息" type="textarea" :autosize="{minRows:6, maxRows:6}" v-model="HandleForm.Content"></Input>
      </FormItem>
    </Col>
    <Col span="24" v-else>
    <FormItem class="P-MB-0">
      <Button type="primary" @click="TriggerAfterSalesOrder">添加售后单</Button>
    </FormItem>
    </Col>
  </Form>
  <ModifyAfterSalesOrder ref="ModifyAfterSalesOrder" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'HandleRefund',
  components: {
    ModifyAfterSalesOrder: () => import('@/components/CustomerService/AfterSales/ModifyAfterSalesOrder.vue')
  }
})

export default class HandleRefund extends Vue {
  @Getter private 'CustomerService/REFUND_INFO': Interface.RefundInfo
  get REFUND_INFO(){
    return this['CustomerService/REFUND_INFO']
  }

  @Getter private 'ShipOrder/SHIP_ORDER_INFO': ShipOrder.ShipOrderBase
  get SHIP_ORDER_INFO(){
    return this['ShipOrder/SHIP_ORDER_INFO'];
  }

  @Getter private 'ShipOrder/SHIP_ORDER_ADDRESS': PInterface.ShipToAddress
  get SHIP_ORDER_ADDRESS(){
    return this['ShipOrder/SHIP_ORDER_ADDRESS'];
  }

  @Emit() private EmitHandleSuccess(): void {}
  @Emit() private EmitCancelModal(): void {}

  @Watch('HandleType')
  WatchHandleType(V: string): void {
    (this as any).$refs.HandleForm.resetFields();
  }

  private mounted(): void {
    if(!this.TemplateTypeDrop.length) {
      this.GetTemplateTypeDrop()
    }
  }

  private GetTemplateTypeDrop(): void {
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetTemplateTypeTree,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$set(this, 'TemplateTypeDrop', Res.Data.Data)
          this.GetTemplateList()
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetTemplateList(IsLoading: boolean = false): void {
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetTemplateList,
        Login: true
      },
      Data: {
        PageIndex: 1,
        PageSize: 500,
        Conditions: new Interface.SearchMailTpl({TemplateTypeId: this.TplType})
      },
      Callback: (Res: PInterface.Res): void => {
        if(IsLoading){
           this.$UI.Loading.Hide();
        }
        if(Res.IsSuccess){
          this.$set(this, 'TemplateList', Res.Data.PageModel.Items)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetTemplateListLoading(): void {
    this.$UI.Loading.Show()
    this.GetTemplateList(true)
  }

  private RenderContent(Tpl: Interface.TplList): void {
    let Ctn = Tpl.Content;
    if(this.SHIP_ORDER_INFO.Id){
      let ShipedTime = this.$UI.Render.Date(this.SHIP_ORDER_INFO.ShipedTime, true), PaidTime = this.$UI.Render.Date(this.SHIP_ORDER_INFO.PaidTime, true); 
      Ctn = Ctn.replace(/\[BuyerId\]/g, this.SHIP_ORDER_INFO.BuyerUserId);
      Ctn = Ctn.replace(/\[TrackingNumber\]/g, this.SHIP_ORDER_INFO.TrackingNumber || '[TrackingNumber]');
      Ctn = Ctn.replace(/\[ShippingCarrier\]/g, this.SHIP_ORDER_INFO.ShippingService);
      Ctn = Ctn.replace(/\[ShipedTime\]/g, ShipedTime === '-' ? '[ShipedTime]' : ShipedTime);
      Ctn = Ctn.replace(/\[PaidTime\]/g, PaidTime === '-' ? '[PaidTime]' : PaidTime);
      Ctn = Ctn.replace(/\[ShipToAddress\]/g, `${this.SHIP_ORDER_ADDRESS.BuyerStreet2 ? (this.SHIP_ORDER_ADDRESS.BuyerStreet2 + ',') : ''}${this.SHIP_ORDER_ADDRESS.BuyerStreet1},${this.SHIP_ORDER_ADDRESS.BuyerCity},${this.SHIP_ORDER_ADDRESS.BuyerState},${this.SHIP_ORDER_ADDRESS.BuyerCountry},${this.SHIP_ORDER_ADDRESS.BuyerZipCode}`);
    }
    this.$set(this.HandleForm, 'Content', Ctn);
  }

  private Reset(): void {
    this.$set(this, 'HandleForm', new Interface.HandleRefund());
    (this as any).$refs.HandleForm.resetFields()
    this.$set(this, 'HandleType', 'SELLER_SEND_MESSAGE');
    this.$set(this, 'TplType', '')
  }

  private Validate(): void {
    if(this.HandleType === 'RESEND'){
      this.EmitCancelModal()
      return
    }
    if(this.HandleType.includes('REFUND') && !this.SHIP_ORDER_INFO.Id){
      this.$UI.Tips.Floating('warning', '未关联发货订单，无法操作此项')
      return;
    }
    (this as any).$refs.HandleForm.validate((Valid: boolean): void => {
      if(Valid){
        this.PostHandle();
      }
    })
  }

  private PostHandle(): void {
    let PostData: Interface.HandleRefund = JSON.parse(JSON.stringify(this.HandleForm)), UseApi: string = ''
    PostData.ReturnId = this.REFUND_INFO.ReturnId
    switch(this.HandleType){
      case 'SELLER_SEND_MESSAGE':
        delete PostData.TypeReason
        delete PostData.Amount
        delete PostData.Currency
        UseApi = this.$Api.ReturnReplyMessage
        break;
      case 'SELLER_ISSUE_REFUND':
        delete PostData.TypeReason
        PostData.Amount = this.SHIP_ORDER_INFO.PayPrice
        PostData.Currency = this.SHIP_ORDER_INFO.PayCurrency
        UseApi = this.$Api.ReturnFullRefund
        break;
      case 'SELLER_OFFER_PARTIAL_REFUND':
        if((PostData.Amount as number) <= 0){
           this.$UI.Tips.Floating('warning', '请输入退款金额')
          return
        }
        if((PostData.Amount as number) > this.SHIP_ORDER_INFO.PayPrice){
          this.$UI.Tips.Floating('warning', '退款金额不能大于订单金额')
          return
        }
        PostData.Currency = this.SHIP_ORDER_INFO.PayCurrency
        delete PostData.TypeReason
        UseApi = this.$Api.ReturnPartRefund
        break;
      case 'SELLER_DECLINE_REQUEST':
        delete PostData.TypeReason
        delete PostData.Amount
        delete PostData.Currency
        UseApi = this.$Api.ReturnRefuse
        break
      case 'SELLER_ESCALATE':
        delete PostData.Amount
        delete PostData.Currency
        UseApi = this.$Api.ReturnUpgradeCase
        break
    }
    if(UseApi){
      this.$UI.Loading.Show()
      this.$Request.Post({
        Server: this.$Server.CustomerService,
        Api: {
          Address: UseApi,
          Login: true
        },
        Data: PostData,
        Callback: (Res: PInterface.Res): void => {
          if(Res.IsSuccess){
            this.$UI.Tips.Floating('success', '处理成功')
            this.EmitHandleSuccess()
          }else{
            this.$UI.Loading.Hide();
            this.$Request.Error(Res);
          }
        }
      })
    }
  }

  private PostSelectNotRefund(V: boolean): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.ReSetSelectNoRefund,
        Login: true
      },
      Data: new Interface.RefundHandleNotRefund(this['REFUND_INFO'].ReturnId, V),
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', V ? '取消自动退款成功' : '设置自动退款成功')
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private TriggerAfterSalesOrder(): void {
    if(!this.SHIP_ORDER_INFO.OrderCode){
      this.$UI.Tips.Floating('warning', '不存在关联发货订单，无法添加售后单')
    }else {
      (this as any).$refs.ModifyAfterSalesOrder.TriggerCreate(this.SHIP_ORDER_INFO.OrderCode)
    }
  }

  private TemplateTypeDrop: Interface.TplTypeList[] = []
  private TemplateList: Interface.TplList[] = []
  private TplType: number = 0
  private InquiryReasonList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.InquiryReasonList)

  private HandleForm: Interface.HandleRefund = new Interface.HandleRefund()
  private HandleType: string = "SELLER_SEND_MESSAGE"

  private Carrier: any = { ShippingMethodId:0, Platform: 0, ShippingCarrier: "" }
}
</script>
<style lang="less" scoped>
.Tpl-Container {
  max-height:100px;
  overflow: auto;
}
</style>