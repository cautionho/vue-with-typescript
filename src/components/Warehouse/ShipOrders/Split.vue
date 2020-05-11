<template>
  <div>
    <Button type="primary" @click="Trigger">拆分</Button>
  <Modal class="Split-Modal" v-model="SplitModal" title="拆分订单" :width="920" @on-cancel="CancelModal">
    <Row>
    <Col span="24">
      <!-- 原始单信息 -->
      <Form :model="ShipOrder" ref="ShipOrder" :rules="OriShipOrderRules" :label-width="100" inline onsubmit="return false;">
        <Table :columns="Cols" :data="ShipOrder.Items" size="small" stripe class="P-MB-10"></Table>
        <FormItem label="发货仓：" prop="ShipOrder.ShipWarehouseId" class="P-W-300">
          <Select placeholder="发货仓" v-model="ShipOrder.ShipOrder.ShipWarehouseId" :options="WarehouseDrop" :onChange="ChangeWarehouse.bind(this, 1)" />
          <!-- <Select placeholder="发货仓" v-model="ShipOrder.ShipOrder.ShipWarehouseId" filterable clearable label-in-value @on-change="ChangeWarehouse(1)">
            <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="物流渠道：" prop="ShipOrder.ShippingMethodId" class="P-W-300">
          <Select placeholder="物流渠道" v-model="ShipOrder.ShipOrder.ShippingMethodId" :options="MethodDrop" optionValKey="Id" optionKey="Name" />
          <!-- <Select placeholder="物流渠道" v-model="ShipOrder.ShipOrder.ShippingMethodId" filterable clearable>
            <Option v-for="(Item,Index) in MethodDrop" :value="Item.Id" :key="Index">{{ Item.Name }}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="限重：" prop="ShipOrder.ShipFee" class="P-W-200">
          <InputNumber :min="0" v-model="ShipOrder.ShipOrder.ShipFee" v-if="!SplitInfo.length"></InputNumber><span v-else>{{ShipOrder.ShipOrder.ShipFee}}</span> g
        </FormItem>
        <FormItem label="订单金额：" class="P-W-300">
          <span>{{ShipOrder.ShipOrder.PayPrice}} {{ShipOrder.ShipOrder.PayCurrency}}</span>
        </FormItem>
        <FormItem label="订单重量：" class="P-W-300">
          <span>{{ShipOrder.ShipOrder.Weight}} g</span>
        </FormItem>
        <FormItem label="" class="P-W-200">
          <Button type="primary" @click="AutoSplit">一键拆分</Button>
        </FormItem>
      </Form>
    </Col>
    <!-- 拆分单信息 -->
    <Col span="24" class="Split-Modules" v-for="(Item, Index) in SplitInfo" :key="Index">
      <h4 class="P-TA-C P-MB-10">拆分订单{{Index+1}}{{Index === 0 ? '（原始订单保留）' : '（新单）'}}</h4>
      <Form  :model="Item" :ref="`SplitInfo${Index}`" :rules="SplitRules" :label-width="100" inline onsubmit="return false;">
        <Table :columns="SplitCols" :data="Item.ItemList" size="small" stripe class="P-MB-10"></Table>
        <FormItem label="发货仓：" prop="ShipWarehouseId" class="P-W-300">
          <Select placeholder="发货仓" v-model="Item.ShipWarehouseId" :options="WarehouseDrop" :onChange="ChangeWarehouse.bind(this, 2, Index)" />
          <!-- <Select placeholder="发货仓" v-model="Item.ShipWarehouseId" filterable clearable label-in-value @on-change="ChangeWarehouse(2, Index)">
            <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="物流渠道：" prop="ShippingMethodId"  class="P-W-300">
          <Select placeholder="物流渠道" v-model="Item.ShippingMethodId"  :options="Item.MethodDrop" optionValKey="Id" optionKey="Name" />
          <!-- <Select placeholder="物流渠道" v-model="Item.ShippingMethodId" filterable clearable>
            <Option v-for="(Item,Index) in Item.MethodDrop" :value="Item.Id" :key="Index">{{ Item.Name }}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="限重：" class="P-W-200">
          {{ShipOrder.ShipOrder.ShipFee}} g
        </FormItem>
        <FormItem label="订单金额：" class="P-W-300">
          <InputNumber :min="0" v-model="Item.Amount"></InputNumber> {{ShipOrder.ShipOrder.PayCurrency}}
        </FormItem>
        <FormItem label="订单重量：" class="P-W-300" >
          <span>{{Item.GrossWeight}} g</span>
        </FormItem>
        <FormItem label="是否缺货：" class="P-W-200">
          <span>{{Item.IsStockOut ? '是' : '否'}}</span>
        </FormItem>
      </Form>
      <div class="P-TA-R" v-if="!Item.IsAuto">
        <Button type="error" @click="DelSplit(Index)">删除</Button>
      </div>
    </Col>
    <Col span="24" class="P-TA-R">
      <Button type="primary" @click="AddSplit">添加拆分订单</Button>
    </Col>
    </Row>
    <footer slot="footer">
      <Button type="primary" @click="ReCalculateAmount">重算订单金额</Button>
      <Button type="primary" @click="Post">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "SplitOrder"
})
export default class SplitOrder extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('SplitShipOrder');
  }

  private async Validate(D:Interface.ShipOrderList[]):Promise<void> {
    this.$set(this,'ShipOrder',D[0]);
    const F = await this.GetShipOrderItems();
    if(F){
      this.$set(this,'SplitModal',true);
      if(!this.WarehouseDrop.length){
      this.$set(this, 'WarehouseDrop', await this.GetDropList<boolean, PInterface.KV[]>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true))
      }
      this.$set(this, 'MethodDrop', await this.GetDropList<number, PInterface.IdName[]>(this.$Server.Logistics, this.$Api.ChannelDropList, this.ShipOrder.ShipOrder.ShipWarehouseId))
    }
  }

  /* 获取订单明细 */
  private GetShipOrderItems(): Promise<boolean> {
    return new Promise((Resolve:(Val: boolean)=>void) => {
      this.$UI.Loading.Show()
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.GetShipOrderInfo,
          Login: true
        },
        Data: {
          OrderId: this.ShipOrder.ShipOrder.Id,
          OrderCode: "",
          IsSplitSign: true
        },
        Callback: (Res:PInterface.Res):void => {
          this.$UI.Loading.Hide();
          if(Res.IsSuccess){
            if(!Res.Data.ShipOrder.Weight){
              for(let Item of Res.Data.Items){
                Res.Data.ShipOrder.Weight += Item.Sku.GrossWeight * Item.Quantity
              }
            }
            Res.Data.ShipOrder.Weight = Number(Res.Data.ShipOrder.Weight.toFixed(2))
            Res.Data.ShipOrder.ShipFee = 2000; // 替代限重字段使用，传参时需修改成正确字段名称
            this.$set(this, 'ShipOrder', Res.Data);
          }else{
            this.$Request.Error(Res)
          }
          Resolve(Res.IsSuccess);
        }
      })
    })
  }

  /* 获取下拉列表 */
  private GetDropList<T, S>(Server: string, Api: string, Data: T ): Promise<S> {
    return new Promise((Resolve:(Val:S)=>void)=>{
      this.$Request.Post({
        Server: Server,
        Api: {
          Address: Api
        },
        Data: Data,
        Callback: (Res:PInterface.Res):void => {
          if(!Res.IsSuccess){ this.$Request.Error(Res); }
          Resolve(Res.Data.DropList || [])
        }
      })
    })
  }

  /* Type: 1-原始单 2-拆分单  Idx：拆分单的下标 */
  private ChangeWarehouse(Type: number, Idx?: number):void {
    if(Type === 1) {
      this.ShipOrder.ShipOrder.ShippingMethodId = 0
      if(this.ShipOrder.ShipOrder.ShipWarehouseId){
        this.GetDropList<number, PInterface.IdName[]>(this.$Server.Logistics, this.$Api.ChannelDropList, this.ShipOrder.ShipOrder.ShipWarehouseId).then((Res: PInterface.IdName[]) => {
          this.$set(this, 'MethodDrop', Res)
        })
      }
    }else {
      this.SplitInfo[Idx as number].ShippingMethodId = 0
      if(this.SplitInfo[Idx as number].ShipWarehouseId) {
        this.GetDropList<number, PInterface.IdName[]>(this.$Server.Logistics, this.$Api.ChannelDropList, this.SplitInfo[Idx as number].ShipWarehouseId).then((Res: PInterface.IdName[]) => {
          this.$set(this.SplitInfo[Idx as number], 'MethodDrop', Res)
        })
      }
    }
  }

  /* 验证限重的最小值 */
  private ValidateMinLimit():boolean {
    let Ws:number[] = []
    for(let Item of this.ShipOrder.Items){
      Ws.push(Item.Sku.GrossWeight)
    }
    let Max = Math.max(...Ws)
    if(Max <= this.ShipOrder.ShipOrder.ShipFee){
      return true
    }else {
      this.$UI.Tips.Floating('warning', '限制重量必须大于单品重量')
      return false
    }
  }

  /* 一键拆分 */
  private AutoSplit():void {
    (this as any).$refs.ShipOrder.validate((Valid:boolean) => {
      if(Valid && this.ValidateMinLimit()){
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.GetWaitSplitOrderDetail,
            Login: true
          },
          Data: {
            OrderId: this.ShipOrder.ShipOrder.Id,
            ShipWarehouseId: this.ShipOrder.ShipOrder.ShipWarehouseId,
            ShippingMethodId: this.ShipOrder.ShipOrder.ShippingMethodId,
            LimitWeight: this.ShipOrder.ShipOrder.ShipFee
          },
          Callback: (Res: PInterface.Res):void => {
            this.$UI.Loading.Hide();
            if(Res.IsSuccess){
              /* 仓库和渠道默认与原单相同 */
              Res.Data.Data.forEach((Item:Interface.Split,Index:number) => {
                Item['MethodDrop'] = this.MethodDrop
                Item['IsAuto'] = true
                for(let Sku of Item.ItemList){
                  Sku['SplitNum'] = Index // 当前拆分订单下标
                }
              })
              this.$set(this, 'SplitInfo', Res.Data.Data);
            }else{
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  /* 添加拆分订单 */
  private AddSplit(): void {
    if(this.ValidateMinLimit()){
      let NewSplit: Interface.Split = new Interface.Split()
      NewSplit.OrderId = `${String(this.ShipOrder.ShipOrder.Id)}_${String(this.SplitInfo.length+1)}`
      NewSplit.ShipWarehouseId = this.ShipOrder.ShipOrder.ShipWarehouseId
      NewSplit.ShippingMethodId = this.ShipOrder.ShipOrder.ShippingMethodId
      NewSplit.MethodDrop = this.MethodDrop
      for(let Item of this.ShipOrder.Items){
        NewSplit.ItemList.push({
          SkuId: Item.Sku.Id,
          SkuCode: Item.SkuCode,
          AvailableQty: Item.UsableQuantity,
          SingleWeight: Item.Sku.GrossWeight,
          AllotQty: 0,
          SkuName: Item.Sku.SkuName,
          SplitNum: this.SplitInfo.length // 当前拆分订单下标
        })
      }
      this.SplitInfo.push(NewSplit);
    }
  }

  /* 删除拆分订单 */
  private DelSplit(Idx:number): void {
    this.SplitInfo.splice(Idx, 1);
  }

  /* 变更分配数量
    1.修改分配数量
    2.计算订单重量（需要判断限重）
    3.计算是否缺货
  */
  private ChangeAllotQty(Val:number, Data: Interface.SplitItem):void {
    this.SplitInfo[Data.SplitNum as number].ItemList[Data._index as number].AllotQty = Val;
    let GW = 0
    for(let Item of this.SplitInfo[Data.SplitNum as number].ItemList){
      GW += Item.AllotQty * Item.SingleWeight
    }
    this.SplitInfo[Data.SplitNum as number].GrossWeight = Number(GW.toFixed(2))

    // 计算缺货
    this.CalculateOutStock()
  }

  /* 计算缺货状态 */
  private CalculateOutStock():void {
    let SkuAllotQty:number[] = [];
    for(let Item of this.SplitInfo){
      let F = false // 不缺货
      Item.ItemList.forEach((Sku: Interface.SplitItem,Index:number) => {
        const MaxQty = this.ShipOrder.Items[Index].UsableQuantity; // 最大
        SkuAllotQty[Index] = SkuAllotQty[Index] ? SkuAllotQty[Index]+Sku.AllotQty : Sku.AllotQty
        if(Sku.AllotQty > 0 && SkuAllotQty[Index] > MaxQty){
          F = true
        }
      })
      Item.IsStockOut = F
    }
  }

  /* 重算订单金额 */
  private ReCalculateAmount():void {
    // [(拆分订单内SKU的采购平均价*拆分数量之和)/(原单内的SKU的采购平均价*原单数量之和)*原订单金额]（除最后一个拆分订单为[原始订单金额-其他拆分订单金额]，都保留3位小数）
    let OriTotal:number = 0, UseAvgPrice:boolean = true, NotLastTotal: number = 0
    for(let Item of this.ShipOrder.Items){
      OriTotal += Item.Quantity * (Item as any).Sku.AvgPrice;
    }
    UseAvgPrice = !!(OriTotal)
    this.SplitInfo.forEach((Item:Interface.Split,Index:number)=>{
      Item.Amount = 0;
      Item.ItemList.forEach((Sku:Interface.SplitItem, Idx:number) => {
        let SplitTotal:number = (Sku.AllotQty * (UseAvgPrice ? this.ShipOrder.Items[Idx].Sku.AvgPrice : (this.ShipOrder.Items[Idx] as any).PayAmount))
        Item.Amount += Number((UseAvgPrice ? ((SplitTotal / OriTotal) * this.ShipOrder.ShipOrder.PayPrice) : SplitTotal).toFixed(3))
      })
      if(Index < this.SplitInfo.length - 1){
        NotLastTotal += Item.Amount
      }else {
        Item.Amount = Number((this.ShipOrder.ShipOrder.PayPrice - NotLastTotal).toFixed(3))
      }
    })
  }

  /* 验证拆分单数量产品数量总和是否与原单一致  验证拆分订单总金额与原始订单支付金额是否一致 */
  private ValidateAllotQty(): boolean {
    let SplitQtys:number[] = [], SplitTotal: number | string = 0, Res: boolean = true;
    for(let Item of this.SplitInfo){
      Item.ItemList.forEach((Sku: Interface.SplitItem, Index: number) => {
        SplitQtys[Index] = SplitQtys[Index] ? SplitQtys[Index]+Sku.AllotQty : Sku.AllotQty
      })
      SplitTotal += Item.Amount
    }
    this.ShipOrder.Items.forEach((Item: Interface.ShipOrderItem, Index:number)=>{
      if(Item.Quantity !== SplitQtys[Index]){
        this.$UI.Tips.Floating('warning', '拆分订单的分配数量之和不等于原单明细数量')
        Res = false
        return false
      }
    })
    if(SplitTotal.toFixed(3) !== (this.ShipOrder.ShipOrder.PayPrice).toFixed(3)){
      this.$UI.Tips.Floating('warning', '拆分订单的金额之和不等于原单金额')
      Res = false
      return false
    }
    return Res
  }

  /* 整理数据 */
  private GetPostSplitData():Interface.Split {
    let D = JSON.parse(JSON.stringify(this.SplitInfo))
    for(let Item of D) {
      delete Item.MethodDrop
      delete Item.IsAuto
      for(let Sku of Item.ItemList){
        delete Sku.SplitNum
      }
    }
    return D;
  }
  
  /* 点击提交按钮，验证数据 */
  private Post():void {
    (this as any).$refs.ShipOrder.validate((Valid:boolean) => {
      if(Valid) {
        const SplitPro:Promise<boolean>[] = []
        this.SplitInfo.forEach((Item:Interface.Split,Index:number) => {
         SplitPro.push(new Promise((Resolve:(B:boolean)=>void) =>{
            (this as any).$refs[`SplitInfo${Index}`][0].validate((V:boolean)=>{
              Resolve(V || false)
            })
          }))
        })
        Promise.all(SplitPro).then((Res)=>{
          if(Res.every(Item => Item)){
            if(this.ValidateAllotQty()){
              this.PostSplit();
            } // 验证数量总和是否与原单一致
          } else {
            this.$UI.Tips.Floating('warning', '请完善拆分订单信息');
          }
        })
      }else {
        this.$UI.Tips.Floating('warning', '请完善原始订单信息');
      }
    })
  }

  /* 提交请求 */
  private PostSplit():void {
    this.$UI.Loading.Show()
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.CreatSplitOrder,
          Login: true
        },
        Data: this.GetPostSplitData(),
        Callback: (Res:PInterface.Res):void => {
          if(Res.IsSuccess){
            this.$UI.Tips.Floating('success', '拆分订单成功')
            this.EmitOperateSuccess()
            this.CancelModal()
          }else{
            this.$UI.Loading.Hide();
            this.$Request.Error(Res)
          }
        }
      })
  }

  /* 关闭模态框 */
  private CancelModal():void {
    this.$set(this,'SplitModal',false);
    this.$set(this, 'ShipOrder', new Interface.ShipOrderInfo())
    this.$set(this, 'SplitInfo', [])
    this.$set(this, 'MethodDrop', [])
  }

  private SplitModal:boolean = false
  private WarehouseDrop: PInterface.KV[] = []
  private MethodDrop: PInterface.IdName[] = []
  private ShipOrder: Interface.ShipOrderInfo = new Interface.ShipOrderInfo()
  private SplitInfo: Interface.Split[] = []

  private OriShipOrderRules:any = {
    'ShipOrder.ShipWarehouseId': [{required: true, message: '请选择发货仓', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择发货仓'}],
    'ShipOrder.ShippingMethodId': [{required: true, message: '请选择物流渠道', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择物流渠道'}],
    'ShipOrder.ShipFee': [{required: true, message: '请输入限重'}, {pattern: this.$Pattern.PositiveNotZeroInt, message:'请输入限重'}]
  }

  private SplitRules:any = {
    ShipWarehouseId: [{required: true, message: '请选择发货仓', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择发货仓'}],
    ShippingMethodId: [{required: true, message: '请选择物流渠道', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择物流渠道'}],
    Amount: [{required: true, message: '请输入金额'}]
  }

  private Cols:PInterface.TableCol[] = [{
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130
  }, {
    title: '产品名称',
    key: 'SkuName',
    render: (h:any, Params:any) => {
      return h('Tooltip', { class: 'P-LINE-1', props: { content: Params.row.Sku.SkuName } }, Params.row.Sku.SkuName)
    }
  }, {
    title: '可用库存',
    key: 'UsableQuantity',
    width: 100
  }, {
    title: '单品重量',
    width: 100,
    render: (h:any,Params:any):string => {
      return h('span', `${Params.row.Sku.GrossWeight}g`)
    }
  }, {
    title: '购买数量',
    key: 'Quantity',
    width: 100
  }]

  private SplitCols: PInterface.TableCol[] = [{
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130
  }, {
    title: '产品名称',
    key: 'SkuName',
    render: (h:any, Params:any):string => {
      return h('Tooltip', { class: 'P-LINE-1', props: { content: Params.row.SkuName } }, Params.row.SkuName)
    }
  }, {
    title: '可用库存',
    key: 'AvailableQty',
    width: 100
  }, {
    title: '单品重量',
    width: 100,
    render: (h:any,Params:any):string => {
      return h('span', `${Params.row.SingleWeight}g`)
    }
  }, {
    title: '分配数量',
    key: 'AllotQty',
    width: 100,
    render: (h:any, Params:any):string => {
      return h('InputNumber', { 
        attrs: { 
          value: Params.row.AllotQty, 
          min: 0 
        }, 
        on: {
          'on-change': (Val:number) => {
            console.log(Params)
            this.ChangeAllotQty(Val, Params.row);
          }
      } })
    }
  }]
}
</script>
<style lang="less">
.Split-Modal {
  & .ivu-modal-body{
    max-height: 600px;
    overflow: auto;
  }
}
.Split-Modules{
  padding: 10px;
  border: 2px solid #ccc;
  margin-bottom: 10px;
}
</style>
