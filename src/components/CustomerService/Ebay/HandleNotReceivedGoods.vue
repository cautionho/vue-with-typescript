<template>
<Row>
  <Form :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="100">
    <Checkbox v-model="NOTRECEIVEDGOODS_INFO.IsSelectNoRefund" @on-change="PostSelectNotRefund"> 买家升级后，系统不自动退款</Checkbox>
    <FormItem label="操作：" class="P-MB-10">
      <RadioGroup v-model="HandleType">
        <Radio v-for="(Item, Index) in HandleTypeList" :key="Index" :label="Item.Value">
          <span>{{Item.Key}}</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <Col v-if="HandleType === 2">
      <FormItem label="承运商：" :rules="{required: HandleType === 2, message: '请输入承运商'}" prop="MethodName">
        <Input placeholder="承运商" v-model="HandleForm.MethodName"></Input>
      </FormItem>
      <FormItem label="发货时间：" :rules="{required: HandleType === 2, message: '请选择发货时间', type: 'date'}" prop="SendTime">
        <DatePicker class="P-W-100-Percent" type="date" placeholder="发货时间" v-model="HandleForm.SendTime"></DatePicker>
      </FormItem>
      <FormItem label="跟踪号：" :rules="{required: HandleType === 2, message: '请输入跟踪号'}" prop="TrackingNum">
        <Input placeholder="跟踪号" v-model="HandleForm.TrackingNum"></Input>
      </FormItem>
    </Col>
     <Col v-if="HandleType === 5">
      <FormItem label="原因：" :rules="{required: HandleType === 5, message: '请选择原因', trigger: 'change', type: 'number'}" prop="TypeReason">
        <Select placeholder="原因" v-model="HandleForm.TypeReason" :options="InquiryReasonList" />
        <!-- <Select placeholder="原因" v-model="HandleForm.TypeReason" clearable filterable>
          <Option v-for="(Item, Index) in InquiryReasonList" :key="Index" :value="$Enums.CustomerService.InquiryReasonList[Item]">{{Item}}</Option>
        </Select> -->
      </FormItem>
    </Col>
    <Col span="24" v-if="HandleType !== 4">
      <FormItem label="模板类型：" class="P-MB-10">
        <Select placeholder="模板类型" v-model="TplType" :onChange="GetTemplateListLoading" :options="TemplateTypeDrop" optionValKey="TemplateTypeId" optionKey="TemplateTypeName" />
        <!-- <Select placeholder="模板类型" v-model="TplType" clearable filterable @on-change="GetTemplateListLoading">
          <Option v-for="(Item, Index) in TemplateTypeDrop" :key="Index" :value="Item.TemplateTypeId">{{Item.TemplateTypeName}}</Option>
        </Select> -->
      </FormItem>
      <FormItem label="模板：" class="P-MB-10">
        <div class="Tpl-Container">
          <a class="P-MR-5" v-for="(Item, Index) in TemplateList" :key="Index" @click="RenderContent(Item)" >{{`(${Index+1}) ${Item.TemplateTitle}`}}</a>
        </div>
      </FormItem>
      <FormItem label="消息：" :rules="{required: HandleType < 3, message: '请输入消息'}" prop="Content">
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
  name: 'HandleNotReceivedGoods',
  components: {
    ModifyAfterSalesOrder: () => import('@/components/CustomerService/AfterSales/ModifyAfterSalesOrder.vue')
  }
})

export default class HandleNotReceivedGoods extends Vue {
  @Getter private 'CustomerService/NOTRECEIVEDGOODS_INFO': Interface.NotReceivedGoodsInfo
  get NOTRECEIVEDGOODS_INFO(){
    return this['CustomerService/NOTRECEIVEDGOODS_INFO']
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
  WatchHandleType(V: number): void {
    (this as any).$refs.HandleForm.resetFields();
    if(V === 2){
      if(this.SHIP_ORDER_INFO.Id){
        this.$set(this.HandleForm, 'TrackingNum', this.SHIP_ORDER_INFO.TrackingNumber || '');
        this.$set(this.HandleForm, 'SendTime', new Date(this.SHIP_ORDER_INFO.ShipedTime) || '');
      }
      if(!this.Carrier.ShippingMethodId){
        this.GetCarrier()
        return
      }
      this.$set(this.HandleForm, 'MethodName', this.Carrier.ShippingCarrier)
    }
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

  private GetCarrier(): void {
    if(!this.SHIP_ORDER_INFO.ShippingMethodId){
      return;
    }
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.GetCarrierList,
        Login: true
      },
      Data: this.SHIP_ORDER_INFO.ShippingMethodId,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          for(let Item of Res.Data.data){
            if(Item.Platform === this.SHIP_ORDER_INFO.Platform){
              this.$set(this, 'Carrier', Item)
              this.$set(this.HandleForm, 'MethodName', this.Carrier.ShippingCarrier)
            }
          }
        }else{
          this.$Request.Error(Res)
        }
      }
    })
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
    this.$set(this, 'HandleForm', new Interface.HandleNotReceivedGoods())
    ;(this as any).$refs.HandleForm.resetFields();
    this.$set(this, 'HandleType', 1);
    this.$set(this, 'TplType', "")
  }

  private Validate(): void {
    if(this.HandleType === 4){
      this.EmitCancelModal()
      return
    }
    (this as any).$refs.HandleForm.validate((Valid: boolean): void => {
      if(Valid){
        this.PostHandle();
      }
    })
  }

  private PostHandle(): void {
    let PostData: Interface.HandleNotReceivedGoods = JSON.parse(JSON.stringify(this.HandleForm)), UseApi: string = ''
    PostData.NotReceiveId = this.NOTRECEIVEDGOODS_INFO.NotReceiveId
    switch(this.HandleType){
      case 1:
        delete PostData.TypeReason
        delete PostData.MethodName
        delete PostData.SendTime
        delete PostData.TrackingNum
        UseApi = this.$Api.NRGReplyMessage
        break;
      case 2:
        delete PostData.TypeReason
        PostData.SendTime = this.$UI.Date.NewDate(PostData.SendTime);
        UseApi = this.$Api.GetShipMethod
        break;
      case 3:
        delete PostData.TypeReason
        delete PostData.MethodName
        delete PostData.SendTime
        delete PostData.TrackingNum
        UseApi = this.$Api.NRGFullRefund
        break;
      case 5:
        delete PostData.MethodName
        delete PostData.SendTime
        delete PostData.TrackingNum
        UseApi = this.$Api.NRGUpgradeCase
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
        Address: this.$Api.NRGSetSelectNoRefund,
        Login: true
      },
      Data: new Interface.HandleNotRefund(this['NOTRECEIVEDGOODS_INFO'].NotReceiveId, V),
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
      this.$UI.Tips.Floating('warning', '未关联发货订单，无法添加售后单')
    }else {
      (this as any).$refs.ModifyAfterSalesOrder.TriggerCreate(this.SHIP_ORDER_INFO.OrderCode)
    }
  }

  private TemplateTypeDrop: Interface.TplTypeList[] = []
  private TemplateList: Interface.TplList[] = []
  private TplType: number = 0
  private InquiryReasonList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.InquiryReasonList)

  private HandleTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.HadleNotReceivedGoodsType)
  private HandleForm: Interface.HandleNotReceivedGoods = new Interface.HandleNotReceivedGoods()
  private HandleType: number = 1

  private Carrier: any = { ShippingMethodId:0, Platform: 0, ShippingCarrier: "" }
}
</script>
<style lang="less" scoped>
.Tpl-Container {
  max-height:100px;
  overflow: auto;
}
</style>