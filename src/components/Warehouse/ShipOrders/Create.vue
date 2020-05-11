<template>
  <Col class="Create-Order">
    <Button type="primary" @click="Trigger">添加订单</Button>
    <Modal v-model="CreateModal" title="添加订单" :width="1200" @on-cancel="CancelModal" class="Container-Tabs">
      <Form :model="OrderInfo" ref="OrderInfo" :rules="OrderRules" inline :label-width="100" onsubmit="return false;" v-if="CreateModal">
      <Tabs type="card" name="CreateOrderTabs" :value="AcTab" @on-click="ChangeTabs" :animated="false">
        <TabPane label="基本信息" tab="CreateOrderTabs" name="Base" >
          <FormItem class="P-W-49-Percent P-MR-0" label="订单号：" prop="ShipOrder.PlatformOrderId">
            <Input placeholder="订单号" v-model="OrderInfo.ShipOrder.PlatformOrderId"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="国家：" prop="Address.Country.CountryCode">
            <Select placeholder="国家" v-model="OrderInfo.Address.Country.CountryCode" :options="COUNTRY_DROP" optionValKey="CountryCode" optionKey="CountryNameCn" transfer/>
            <!-- <Select placeholder="国家" v-model="OrderInfo.Address.Country.CountryCode" clearable filterable >
              <Option v-for="(Item,Index) in COUNTRY_DROP" :value="Item.CountryCode" :key="Index">{{Item.CountryNameCn}}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="地址2：" prop="Address.BuyerStreet2">
            <Input placeholder="地址2" v-model="OrderInfo.Address.BuyerStreet2"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="地址1：" prop="Address.BuyerStreet1">
            <Input placeholder="地址1" v-model="OrderInfo.Address.BuyerStreet1"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="城市：" prop="Address.BuyerCity">
            <Input placeholder="城市" v-model="OrderInfo.Address.BuyerCity"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="省/州：" prop="Address.BuyerState">
            <Input placeholder="省/州" v-model="OrderInfo.Address.BuyerState"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="邮编：" prop="Address.BuyerZipCode">
            <Input placeholder="邮编" v-model="OrderInfo.Address.BuyerZipCode"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="收件人：" prop="Address.BuyerFullName">
            <Input placeholder="收件人" v-model="OrderInfo.Address.BuyerFullName"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="买家ID：" prop="ShipOrder.BuyerUserId">
            <Input placeholder="买家ID" v-model="OrderInfo.ShipOrder.BuyerUserId"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="电话：" prop="Address.BuyerPhone">
            <Input placeholder="电话" v-model="OrderInfo.Address.BuyerPhone"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="付款金额：" prop="ShipOrder.PayPrice">
            <Input placeholder="付款金额" prefix="logo-usd" v-model="OrderInfo.ShipOrder.PayPrice">
            </Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="卖家店铺：" prop="ShipOrder.StoreId">
            <Select placeholder="卖家店铺" v-model="OrderInfo.ShipOrder.StoreId" :options="StoreDrop" transfer />
            <!-- <Select placeholder="卖家店铺" v-model="OrderInfo.ShipOrder.StoreId" clearable filterable>
              <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="买家Email：" prop="ShipOrder.BuyerEmail">
            <Input placeholder="买家Email" v-model="OrderInfo.ShipOrder.BuyerEmail"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="交易号：" prop="ShipOrder.TransationId">
            <Input placeholder="交易号" v-model="OrderInfo.ShipOrder.TransationId"></Input>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="付款时间：" prop="ShipOrder.PaidTime">
            <DatePicker type="datetime" placeholder="付款时间" v-model="OrderInfo.ShipOrder.PaidTime" class="P-W-100-Percent"></DatePicker>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="下单时间：" prop="ShipOrder.PlatOrderTime">
            <DatePicker type="datetime" placeholder="下单时间" v-model="OrderInfo.ShipOrder.PlatOrderTime" class="P-W-100-Percent"></DatePicker>
          </FormItem>
          <FormItem class="P-W-100-Percent P-MR-0" label="备注：" prop="ShipOrder.Remark">
            <Input type="textarea" :autosize="{minRows:4,maxRows:4}" placeholder="备注" v-model="OrderInfo.ShipOrder.Remark"></Input>
          </FormItem>
        </TabPane>
        <TabPane label="订单明细" tab="CreateOrderTabs" name="Items">
          <Table :columns="ItemCols" :data="OrderInfo.Items" size="small" :height="519" stripe borderless></Table>
          <Col span="24" class="P-TA-R P-MT-10">
            <Button type="primary" @click="TriggerEnableSku">添加SKU</Button>
          </Col>
        </TabPane>
      </Tabs>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
    <EnableSku ref="EnableSku" v-if="CreateModal" @handle-res-msg="HandleSelectSku" />
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "ShipOrderCreate",
  components:{
    EnableSku: () => import('@/components/Public/EnableSku.vue')
  }
})
export default class ShipOrderCreate extends Vue {
  @Prop(String) private Page: string
  @Emit() EmitOperateSuccess():void {}

  @Action private 'Base/UPDATE_BASE_INFO':any;
  @Getter private 'Base/COUNTRY_DROP':PInterface.CountryEntity[]
  get COUNTRY_DROP(){
    return this['Base/COUNTRY_DROP']
  }

  private GetStoreDrop():void {
    // console.log()
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api:{
        Address: this.$Api.Sales[String(this.$Enums.Sales.Platform[this.Page])].StoreDrop,
        Login:false
      },
      Data:"",
      Callback:(Res:PInterface.Res):void => {
        if(Res.IsSuccess){
          this.StoreDrop.push(...Res.Data.DropList);
        }
      }
    })
  }

  private ChangeTabs(N:string):void {
    this.$set(this,'AcTab',N)
  }

  private Trigger():void{
    this.$set(this,'CreateModal',true);
    if(!this.COUNTRY_DROP.length){
      this['Base/UPDATE_BASE_INFO']('COUNTRY','');
    }
    if(!this.StoreDrop.length){
      this.GetStoreDrop();
    }
  }

  private TriggerEnableSku():void {
    (this.$refs['EnableSku'] as Vue).Trigger(false);
  }
  
  private HandleSelectSku(Data:PInterface.EnableSku[]):void {
    /* 去重 */
    for(let Item of Data){
      let F = true
      for(let Ori of this.OrderInfo.Items){
        if(Item.Id === Ori.Sku.Id){
          F = false
        }
      }
      if(F){
        let D = new Interface.ShipOrderItem();
        D.Sku = Item as Interface.ShipOrderItemSku
        D.SkuCode = Item.SkuCode
        D.Quantity = 1
        this.OrderInfo.Items.push(D);
      }
    }
  }

  private ChangeVal(K:string,Idx:number,V:string|number):void {
    (this.OrderInfo as any).Items[Idx][K] = V;
  }
  
  private DelItem(Idx:number):void {
    (this.OrderInfo as any).Items.splice(Idx,1);
  }

  private Validate():void {
    (this as any).$refs.OrderInfo.validate((Valid:boolean)=>{
      if(Valid){
        if(this.OrderInfo.Items.length < 1){
          this.$UI.Tips.Floating('warning','请补充订单明细')
          return;
        }
        for(let Item of this.OrderInfo.Items){
          if( !(new this.$Validate.PositiveInt().Valid(Item.Quantity)) || Item.Quantity < 1){
            this.$UI.Tips.Floating('warning','订单明细数量必须是大于0的整数');
            return;
          }
        };
        (this.OrderInfo as any).ShipOrder.Platform = this.Platform;
        this.PostOrderInfo();
      }
    })
  }

  private PostOrderInfo():void {
    this.$UI.Loading.Show();
    let PostData = JSON.parse(JSON.stringify(this.OrderInfo))
    PostData.ShipOrder.PlatOrderTime = this.$UI.Render.NewDate(PostData.ShipOrder.PlatOrderTime,true);
    PostData.ShipOrder.PaidTime = this.$UI.Render.NewDate(PostData.ShipOrder.PaidTime,true);
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api:{
        Address:this.$Api.ShipOrderCreate,
        Login:true
      },
      Data: PostData,
      Callback: (Res:PInterface.Res):void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success','添加发货订单成功');
          this.CancelModal();
          this.EmitOperateSuccess();
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal():void {
    this.$set(this,'CreateModal',false);
    this.$set(this,'AcTab','Base');
    this.$set(this,'OrderInfo',new Interface.ShipOrderInfo());
    (this as any).$refs.OrderInfo.resetFields();
  }

  private CreateModal:boolean = false
  private AcTab:string = 'Base'
  private StoreDrop:PInterface.KV[] = []
  private OrderInfo:Interface.ShipOrderInfo = new Interface.ShipOrderInfo()

  private OrderRules:any = {
    'ShipOrder.PlatformOrderId': [{required:true, message:'请输入订单号'}],
    'Address.Country.CountryCode':[{required:true, message:'请选择国家', trigger:'change'}],
    'Address.BuyerStreet1': [{required:true, message:'请输入地址1'}],
    'Address.BuyerCity': [{required:true, message:'请输入城市'}],
    'Address.BuyerZipCode':[{required:true, message:'请输入邮编'}],
    'Address.BuyerFullName':[{required:true, message:'请输入收件人'}],
    'Address.BuyerPhone':[{required:true, message:'请输入电话'},{ pattern: /^[\\+]{0,1}([A-Za-z\d\-\(\)\s\*#]+)$/, message: '电话号码格式不正确' }],
    'ShipOrder.PayPrice':[{required:true, message:'请输入付款金额'},{pattern:/^[+]{0,1}([1-9]{0,1}[0-9]+)$|^[+]{0,1}(\d+\.\d+)$/, message:'请输入正确格式的付款金额'}],
    'ShipOrder.PaidTime': [{required:true, message:'请选择付款时间'}],
    'ShipOrder.PlatOrderTime': [{required:true, message:'请选择下单时间'}]
  }

  private ItemCols:PInterface.TableCol[] = [{
    title: 'SKU编号',
    key:'SkuCode'
  },{
    title:'SKU名称',
    key:'SkuName',
    render:(h:any,Params:any):string => {
      return h('Tooltip',{class:'P-LINE-1',props:{content:(Params as any).row.Sku.SkuName}},(Params as any).row.Sku.SkuName)
    }
  },{
    title:'ItemId',
    render:(h:any,Params:any):string => {
      return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入ItemId", value: (Params as any).row.ItemId }, on:{ input:(Val:string)=>{ this.ChangeVal('ItemId', (Params as any).row._index, Val); } } })
    }
  },{
    title:'平台单号',
    render:(h:any,Params:any):string => {
      return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入平台单号", value: (Params as any).row.PlatformOrderId }, on:{ input:(Val:string)=>{ this.ChangeVal('PlatformOrderId', (Params as any).row._index, Val); } } })
    }
  },{
    title:'平台交易号',
    render:(h:any,Params:any):string => {
      return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入平台交易号", value: (Params as any).row.PlatformTransactionId }, on:{ input:(Val:string)=>{ this.ChangeVal('PlatformTransactionId', (Params as any).row._index, Val); } } })
    }
  },{
    title:'Paypal交易号',
    render:(h:any,Params:any):string => {
      return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入Paypal交易号", value: (Params as any).row.PaypalTransactionId }, on:{ input:(Val:string)=>{ this.ChangeVal('PaypalTransactionId', (Params as any).row._index, Val); } } })
    }
  },{
    title:'数量',
    render:(h:any,Params:any):string => {
      return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入数量", value: (Params as any).row.Quantity }, on:{ input:(Val:string)=>{ this.ChangeVal('Quantity', (Params as any).row._index, Val); } } })
    }
  },{
    title:'操作',
    width:80,
    align:'center',
    render:(h:any,Params:any):string => {
      return h('Button',{props:{size:'small',type:'error'},on:{click:()=>{ this.DelItem(Params.row._index) }}},'删除')
    }
  }]
}
</script>
<style lang="less" >
.Create-Order{
  & .ivu-input-group-append{
    background:#FFF;
  }
}
</style>