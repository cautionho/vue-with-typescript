<template>
  <Form :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="100">
    <Col span="24" v-if="Disputed === 3" >
    <FormItem label="模板类型：">
      <Select placeholder="模板类型" v-model="TplType" :onChange="GetTemplateListLoading" :options="TemplateTypeDrop" optionValKey="TemplateTypeId" optionName="TemplateTypeName" />
      <!-- <Select placeholder="模板类型" v-model="TplType" clearable filterable @on-change="GetTemplateListLoading">
        <Option v-for="(Item, Index) in TemplateTypeDrop" :key="Index" :value="Item.TemplateTypeId">{{Item.TemplateTypeName}}</Option>
      </Select> -->
    </FormItem>
    <FormItem label="模板：" class="P-MB-10">
      <div class="Tpl-Container">
        <a class="P-MR-5" v-for="(Item, Index) in TemplateList" :key="Index" @click="RenderContent(Item)" >{{`(${Index+1}) ${Item.TemplateTitle}`}}</a>
      </div>
    </FormItem>
    <FormItem label="消息：" prop="Content">
      <Input placeholder="消息" type="textarea" :autosize="{minRows:6, maxRows:6}" v-model="HandleForm.Content"></Input>
    </FormItem>
    </Col>
    <Col span="24" v-else>
      <FormItem label="申诉备注："> 
        <Input placeholder="申诉备注" type="textarea" :autosize="{minRows: 6, maxRows:6}" v-model="HandleForm.Content"></Input>
      </FormItem>
    </Col>
   
  </Form>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'HandleCase',
  components: {
    ModifyAfterSalesOrder: () => import('@/components/CustomerService/AfterSales/ModifyAfterSalesOrder.vue')
  }
})

export default class HandleCase extends Vue {
  @Prop({type: Number, default: 0}) private Disputed: number

  @Getter private 'CustomerService/CASE_INFO': Interface.CaseInfo
  get CASE_INFO(){
    return this['CustomerService/CASE_INFO']
  }
  @Getter private 'ShipOrder/SHIP_ORDER_INFO': ShipOrder.ShipOrderBase
  get SHIP_ORDER_INFO(){
    return this['ShipOrder/SHIP_ORDER_INFO'];
  }

  @Emit() private EmitHandleSuccess(): void {}

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
    this.$set(this, 'HandleForm', new Interface.HandleCase())
    this.$set(this, 'TplType', "");
  }

  private Validate(): void {
    this.$UI.Loading.Show()
    let PostData: Interface.HandleCase = JSON.parse(JSON.stringify(this.HandleForm))
    PostData.CaseId = this.CASE_INFO.CaseId
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.Disputed === 3 ? this.$Api.CaseRefund : this.$Api.CaseAppeal,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', this.Disputed === 3 ? '退款成功' : '申诉成功')
          this.EmitHandleSuccess()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private TemplateTypeDrop: Interface.TplTypeList[] = []
  private TemplateList: Interface.TplList[] = []
  private TplType: number = 0

  private HandleForm: Interface.HandleCase = new Interface.HandleCase()
}
</script>
<style lang="less" scoped>
.Tpl-Container {
  max-height:100px;
  overflow: auto;
}
</style>