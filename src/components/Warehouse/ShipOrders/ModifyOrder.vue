<template>
  <Row class="P-Inline-Block">
    <Modal v-model="ModifyOrderModal" title="编辑订单" :width="1200" @on-cancel="CancelModal" class="Container-Tabs">
      <Form :model="OrderInfo" ref="OrderInfo" :rules="OrderRules" inline :label-width="100" onsubmit="return false;" v-if="ModifyOrderModal">
      <Tabs type="card" name="ModifyOrderTabs" :value="AcTab" @on-click="ChangeTabs">
        <TabPane label="基本信息" tab="ModifyOrderTabs" name="Base">
          <FormItem class="P-W-49-Percent P-MR-0" label="订单号：" prop="ShipOrder.PlatformOrderId">
            <Input placeholder="订单号" v-model="OrderInfo.ShipOrder.PlatformOrderId" v-if="!OrderInfo.ShipOrder.Id"></Input>
            <span v-else>{{OrderInfo.ShipOrder.PlatformOrderId}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="国家：" prop="Address.Country.CountryCode">
            <Select placeholder="国家" v-model="OrderInfo.Address.Country.CountryCode" :options="COUNTRY_DROP" optionValKey="CountryCode" optionKey="CountryNameCn" v-if="!OnlyModifyAddress && !OnlyRemark" transfer/>
            <!-- <Select placeholder="国家" v-model="OrderInfo.Address.Country.CountryCode" clearable filterable v-if="!OnlyModifyAddress && !OnlyRemark"> 
              <Option v-for="(Item,Index) in COUNTRY_DROP" :value="Item.CountryCode" :key="Index">{{Item.CountryNameCn}}</Option>
            </Select> -->
            <span v-else>{{OrderInfo.Address.Country.CountryNameCn}}({{OrderInfo.Address.Country.CountryCode}})</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="地址2：" prop="Address.BuyerStreet2">
            <Input placeholder="地址2" v-model="OrderInfo.Address.BuyerStreet2" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.Address.BuyerStreet2}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="地址1：" prop="Address.BuyerStreet1">
            <Input placeholder="地址1" v-model="OrderInfo.Address.BuyerStreet1" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.Address.BuyerStreet1}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="城市：" prop="Address.BuyerCity">
            <Input placeholder="城市" v-model="OrderInfo.Address.BuyerCity" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.Address.BuyerCity}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="省/州：" prop="Address.BuyerState">
            <Input placeholder="省/州" v-model="OrderInfo.Address.BuyerState" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.Address.BuyerState}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="邮编：" prop="Address.BuyerZipCode">
            <Input placeholder="邮编" v-model="OrderInfo.Address.BuyerZipCode" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.Address.BuyerZipCode}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="收件人：" prop="Address.BuyerFullName">
            <Input placeholder="收件人" v-model="OrderInfo.Address.BuyerFullName" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.Address.BuyerFullName}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="买家ID：" prop="ShipOrder.BuyerUserId" >
            <Input placeholder="买家ID" v-model="OrderInfo.ShipOrder.BuyerUserId" v-if="!OnlyModifyAddress && !OnlyRemark"></Input>
            <span v-else>{{OrderInfo.ShipOrder.BuyerUserId}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="电话：" prop="Address.BuyerPhone">
            <Input placeholder="电话" v-model="OrderInfo.Address.BuyerPhone" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.Address.BuyerPhone}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="付款金额：" prop="ShipOrder.TotalPrice">
            <Input placeholder="付款金额" prefix="logo-usd" v-model="OrderInfo.ShipOrder.TotalPrice" v-if="!OnlyModifyAddress && !OnlyRemark"></Input>
            <span v-else>{{OrderInfo.ShipOrder.TotalPrice}} USD</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="卖家店铺：" prop="ShipOrder.StoreId">
            <Select placeholder="卖家店铺" v-model="OrderInfo.ShipOrder.StoreId" :options="StoreDrop" v-if="!OnlyModifyAddress && !OnlyRemark" transfer/>
            <!-- <Select placeholder="卖家店铺" v-model="OrderInfo.ShipOrder.StoreId" clearable filterable v-if="!OnlyModifyAddress && !OnlyRemark">
              <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
            </Select> -->
            <span v-else>{{OrderInfo.ShipOrder.StoreName}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="买家Email：" prop="ShipOrder.BuyerEmail">
            <Input placeholder="买家Email" v-model="OrderInfo.ShipOrder.BuyerEmail" v-if="!OnlyRemark"></Input>
            <span v-else>{{OrderInfo.ShipOrder.BuyerEmail}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="交易号：" prop="ShipOrder.TransationId">
            <Input placeholder="交易号" v-model="OrderInfo.ShipOrder.TransationId" v-if="!OnlyModifyAddress && !OnlyRemark"></Input>
            <span v-else>{{OrderInfo.ShipOrder.TransationId}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="付款时间：" prop="ShipOrder.PaidTime">
            <DatePicker type="datetime" placeholder="付款时间" v-model="OrderInfo.ShipOrder.PaidTime" class="P-W-100-Percent"  v-if="!OnlyModifyAddress && !OnlyRemark"></DatePicker>
            <span v-else>{{$UI.Render.Date(OrderInfo.ShipOrder.PaidTime, true)}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="下单时间：" prop="ShipOrder.PlatOrderTime">
            <DatePicker type="datetime" placeholder="下单时间" v-model="OrderInfo.ShipOrder.PlatOrderTime" class="P-W-100-Percent" v-if="!OnlyModifyAddress && !OnlyRemark"></DatePicker>
            <span v-else>{{$UI.Render.Date(OrderInfo.ShipOrder.PlatOrderTime, true)}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="发货仓：" prop="ShipOrder.ShipWarehouseId">
            <Select placeholder="发货仓" v-model="OrderInfo.ShipOrder.ShipWarehouseId" :options="WarehouseDrop" :onChange="ChangeWarehouse"  v-if="!OnlyModifyAddress && !OnlyRemark" transfer/>
            <!-- <Select placeholder="发货仓" v-model="OrderInfo.ShipOrder.ShipWarehouseId" clearable filterable @on-change="ChangeWarehouse"  v-if="!OnlyModifyAddress && !OnlyRemark">
              <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
            </Select> -->
            <span v-else>{{OrderInfo.ShipOrder.ShipWarehouseName}}</span>
          </FormItem>
          <FormItem class="P-W-49-Percent P-MR-0" label="物流渠道：" prop="ShipOrder.ShippingMethodId">
            <Select placeholder="物流渠道" v-model="OrderInfo.ShipOrder.ShippingMethodId" ref="MethodDrop" :options="MethodDrop" optionValKey="Id" optionKey="Name" v-if="!OnlyModifyAddress && !OnlyRemark" transfer/>
            <!-- <Select placeholder="物流渠道" v-model="OrderInfo.ShipOrder.ShippingMethodId" ref="MethodDrop" clearable filterable v-if="!OnlyModifyAddress && !OnlyRemark">
              <Option v-for="(Item,Index) in MethodDrop" :value="Item.Id" :key="Index">{{Item.Name}}</Option>
            </Select> -->
            <span v-else>{{OrderInfo.ShipOrder.ShippingMethodName}}</span>
          </FormItem>
          <FormItem class="P-W-100-Percent P-MR-0" label="备注：" prop="ShipOrder.Remark">
            <Input type="textarea" :autosize="{minRows:4,maxRows:4}" placeholder="备注" v-model="OrderInfo.ShipOrder.Remark"></Input>
          </FormItem>
        </TabPane>
        <TabPane label="订单明细" tab="ModifyOrderTabs" name="Items">
          <Table :columns="ItemCols" :data="OrderInfo.Items" size="small" :height="600" stripe borderless></Table>
          <Col span="24" class="P-TA-R P-MT-10" v-if="IsModifyItems">
            <Button type="primary" @click="TriggerEnableSku">添加SKU</Button>
          </Col>
        </TabPane>
      </Tabs>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="ValidateModify">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
    <EnableSku ref="EnableSku" @handle-res-msg="HandleSelectSku" />
  </Row>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
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
  @Prop(Number) private Platform:number
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  @Action private 'Base/UPDATE_BASE_INFO':any;
  @Action private 'ShipOrder/UPDATE_SHIP_ORDER_INFO':any;
  @Getter private 'Base/COUNTRY_DROP':PInterface.CountryEntity[]
  @Getter private 'ShipOrder/SHIP_ORDER_INFO': Interface.ShipOrderBase
  @Getter private 'ShipOrder/SHIP_ORDER_ADDRESS': PInterface.ShipToAddress
  @Getter private 'ShipOrder/SHIP_ORDER_ITEMS': Interface.ShipOrderItem[]
  get COUNTRY_DROP(){
    return this['Base/COUNTRY_DROP']
  }
  get SHIP_ORDER_INFO(){
    return this['ShipOrder/SHIP_ORDER_INFO']
  }
  get SHIP_ORDER_ADDRESS(){
    return this['ShipOrder/SHIP_ORDER_ADDRESS']
  }
  get SHIP_ORDER_ITEMS(){
    return this['ShipOrder/SHIP_ORDER_ITEMS']
  }

  @Watch('SHIP_ORDER_INFO')
  private WatchInfo(Val:Interface.ShipOrderBase):void  {
    this.OrderInfo.ShipOrder = JSON.parse(JSON.stringify(Val))
    if(this.ModifyOrderModal){
      this.GetDropListSync();
      this.SetEnableModify();
    }
  }
  @Watch('SHIP_ORDER_ADDRESS')
  private WatchAddress(Val:PInterface.ShipToAddress):void  {
    this.OrderInfo.Address = JSON.parse(JSON.stringify(Val))
  }
  @Watch('SHIP_ORDER_ITEMS')
  private WatchItems(Val:Interface.ShipOrderItem[]):void  {
    this.OriItem = JSON.parse(JSON.stringify(Val))[0];
    this.OrderInfo.Items.push(...JSON.parse(JSON.stringify(Val)))
  }

  private mounted():void {
    if(!this.COUNTRY_DROP.length){
      this['Base/UPDATE_BASE_INFO']('COUNTRY','');
    }
  }

  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (!Res.IsSuccess) this.$Request.Error(Res);
          resolve( Res.Data.DropList || [] )
		  	}
	  	})
    })
  }

  private async GetDropListSync():Promise<void> {
    this.$set(this,'StoreDrop',await this.GetDropList<string,PInterface.KV[]>(this.$Server.Sales, this.$Api.Sales[String(this.OrderInfo.ShipOrder.Platform)].StoreDrop,''))
    this.$set(this,'WarehouseDrop',await this.GetDropList<boolean,PInterface.KV[]>(this.$Server.Settings,this.$Api.GetWarehouseDropList,true))
  }

  /* 设置可编辑项
    不可编辑除地址外的基础信息：状态为2/3/4且异常  
    可编辑明细：1/7/8/9
    仅编辑备注
  */
  private SetEnableModify():void {
    const Status = this.OrderInfo.ShipOrder.Status, IsException = this.OrderInfo.ShipOrder.IsException as boolean
    this.OnlyModifyAddress = ([2,3,4].includes(Status) && IsException) || [8,9].includes(Status) || (Status === 7 && IsException)
    this.IsModifyItems = [1,7,8,9].includes(Status)
    this.OnlyRemark = Status === 7 && !IsException
    this.SetOperateCol()
  }

  private SetOperateCol(): void {
    if(!this.IsModifyItems){
      this.ItemCols.pop()
    }else if(this.ItemCols[this.ItemCols.length - 1].title !== '操作'){
      this.ItemCols.push({
        title:'操作',
        width:80,
        align:'center',
        render:(h:any,Params:any):string => {
          return h('Button',{props:{size:'small',type:'error'},on:{click:()=>{ this.DelItem(Params.row._index) }}},'删除')
        }
      })
    }
  }

  private RenderItemQty(h:any,Params:any):string {
    if(!this.IsModifyItems){
      return h('span', Params.row.Quantity)
    }else{
      return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入数量", value: (Params as any).row.Quantity }, on:{ input:(Val:string)=>{ this.ChangeVal('Quantity', (Params as any).row._index, Val); } } })
    }
  }

  private ChangeTabs(N:string):void {
    this.$set(this,'AcTab',N)
  }

  private Validate(P:Interface.ShipOrderList[]):void {
    this.$set(this,'ModifyOrderModal',true)
    this['ShipOrder/UPDATE_SHIP_ORDER_INFO']({OrderId:P[0].ShipOrder.Id,OrderCode:""})
  }

  private ChangeWarehouse(Val:number):void {
    if(Val){
      this.GetDropList<number,PInterface.IdName[]>(this.$Server.Logistics, this.$Api.ChannelDropList,Val).then((Res:PInterface.IdName[])=>{
        this.$set(this,'MethodDrop',Res)
      })
    }else{
      this.OrderInfo.ShipOrder.ShipWarehouseId = 0;
      this.OrderInfo.ShipOrder.ShippingMethodId = 0;
      // (this as any).$refs.MethodDrop.clearSingleSelect();
      this.$set(this,'MethodDrop',[])
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
        D.PlatformOrderId = this.OriItem.PlatformOrderId;
        D.PlatformTransactionId = this.OriItem.PlatformTransactionId;
        D.PaypalTransactionId = this.OriItem.PaypalTransactionId;
        D.ItemId = this.OriItem.ItemId;
        D.IsNew = true;
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

  private ValidateModify():void {
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
        Address:this.$Api.ShipOrderModify,
        Login:true
      },
      Data: PostData,
      Callback: (Res:PInterface.Res):void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success','编辑发货订单成功');
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
    this.$set(this,'ModifyOrderModal',false);
    this.$set(this,'AcTab','Base');
    this.$set(this,'OrderInfo',new Interface.ShipOrderInfo());
    (this as any).$refs.OrderInfo.resetFields();
  }

  private ModifyOrderModal:boolean = false
  private AcTab:string = 'Base'
  private OnlyModifyAddress: boolean = false
  private IsModifyItems: boolean = true
  private OnlyRemark: boolean = false

  private StoreDrop:PInterface.KV[] = []
  private WarehouseDrop:PInterface.KV[] = []
  private MethodDrop:PInterface.IdName[] = []
  private OrderInfo:Interface.ShipOrderInfo = new Interface.ShipOrderInfo()
  private OriItem:Interface.ShipOrderItem = new Interface.ShipOrderItem() // 存放第一个明细，因为后续新增的明细的平台单号，平台交易号，paypal交易号需要从此处获取

  private OrderRules:any = {
    'ShipOrder.PlatformOrderId': [{required:true, message:'请输入订单号'}],
    'Address.Country.CountryCode':[{required:true, message:'请选择国家', trigger:'change'}],
    'Address.BuyerStreet1': [{required:true, message:'请输入地址1'}],
    'Address.BuyerCity': [{required:true, message:'请输入城市'}],
    'Address.BuyerZipCode':[{required:true, message:'请输入邮编'}],
    'Address.BuyerFullName':[{required:true, message:'请输入收件人'}],
    'Address.BuyerPhone':[{required:true, message:'请输入电话'},{ pattern: /^[\\+]{0,1}([A-Za-z\d\-\(\)\s\*#]+)$/, message: '电话号码格式不正确' }],
    'ShipOrder.TotalPrice':[{required:true, message:'请输入付款金额'},{pattern:/^[+]{0,1}([1-9]{0,1}[0-9]+)$|^[+]{0,1}(\d+\.\d+)$/, message:'请输入正确格式的付款金额'}],
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
      if(Params.row.IsNew){
        return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入ItemId", value: (Params as any).row.ItemId }, on:{ input:(Val:string)=>{ this.ChangeVal('ItemId', (Params as any).row._index, Val); } } })
      }else{
        return h('Tooltip',{ class:' P-LINE-1',props:{content:Params.row.ItemId || '-'} } ,Params.row.ItemId || '-')
      }
    }
  },{
    title:'平台单号',
    render:(h:any,Params:any):string => {
      if(Params.row.IsNew){
        return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入平台单号", value: (Params as any).row.PlatformOrderId }, on:{ input:(Val:string)=>{ this.ChangeVal('PlatformOrderId', (Params as any).row._index, Val); } } })
      }else{
        return h('Tooltip',{ class:' P-LINE-1',props:{content:Params.row.PlatformOrderId || '-'} } ,Params.row.PlatformOrderId || '-')
      } 
    }
  },{
    title:'平台交易号',
    render:(h:any,Params:any):string => {
      if(Params.row.IsNew){
        return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入平台交易号", value: (Params as any).row.PlatformTransactionId }, on:{ input:(Val:string)=>{ this.ChangeVal('PlatformTransactionId', (Params as any).row._index, Val); } } })
      }else{
        return h('Tooltip',{ class:' P-LINE-1',props:{content:Params.row.PlatformTransactionId || '-'} } ,Params.row.PlatformTransactionId || '-')
      }
    }
  },{
    title:'Paypal交易号',
    render:(h:any,Params:any):string => {
      if(Params.row.IsNew){
      return h('Input',{class:'P-W-100-Percent', attrs:{ placeholder:"请输入Paypal交易号", value: (Params as any).row.PaypalTransactionId }, on:{ input:(Val:string)=>{ this.ChangeVal('PaypalTransactionId', (Params as any).row._index, Val); } } })
      }else{
        return h('Tooltip',{ class:' P-LINE-1',props:{content:Params.row.PaypalTransactionId || '-'} } ,Params.row.PaypalTransactionId || '-')
      }
    }
  },{
    title:'数量',
    render: this.RenderItemQty
  }, {
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

</style>