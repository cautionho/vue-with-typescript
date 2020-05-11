<!-- 分拣打包 -->
<template>
  <Row>
    <Col span="24">
      <span>匹配产品：</span>
      <Input ref="BatchCodeIpt" class="P-W-300" size="large" v-model.trim="PackForm.BatchCode" placeholder="请扫描/输入批次号，输入完成请按回车键" @on-enter="TriggerLoadBatch" />
      <Input ref="SkuCodeIpt" class="P-W-300 P-ML-10" size="large" :disabled="!Packing" v-model.trim="PackForm.SkuCode" placeholder="请扫描/输入SKU编号，输入完成请按回车键" @on-enter="TriggerMatchOrder" />
      <span class="P-ML-20">扫描数量：</span>
      <InputNumber ref="QtyIpt" class="P-W-200 P-ML-10" size="large" :min="1" v-model="PackForm.Quantity" placeholder="请输入数量" />
      <Button class="P-ML-10" size="large" type="primary" :disabled="!Packing" @click="TriggerMatchOrder">匹配订单</Button>
      <Button class="P-ML-10" size="large" type="success" :disabled="!Packing" @click="ValidateCompleteBatch">完成批次</Button>
      <Button class="P-ML-10" size="large" type="primary" @click="TriggerRePrint">重打面单</Button>
    </Col>
    <Row class="Batch-Info">
      <Col class="Sku" span="14">
        <div class="Sku-Info">
          <h1>{{PackingOrder.BoxNum}}</h1>
          <p>{{PackingSku.SkuCode}}</p>
          <p>{{PackingSku.SkuName}}</p>
        </div>
        <div class="Sku-Qty" v-show="PackingOrder.OrderId">
          <p>需求数：{{PackingSku.Quantity}}</p>
          <p>已扫数：{{PackingSku.ScanQty}}</p>
        </div>
        <div class="Boxs">
          <!-- 包含状态：0-明细未扫描 1-已扫描任意明细 2-全部明细已扫描 3-拦截订单 -->
          <span v-for="(Item,Index) in ShipOrders" :key="Index" :style="{background: $Enums.Warehouse.PackBoxStatus[Item.OrderStatus]}" @click="TriggerItemModal(Index)" >{{Item.BoxNum}}</span>
        </div>
      </Col>
      <Col class="Sku-Img" span="10" v-show="PackingOrder.OrderId">
        <section :style="{'background-image':`url(${$Server.File}/${PackingSku.DefaultImage})`}"></section>
      </Col>
    </Row>
    <Modal v-model="HoldUpModal" title="已拦截订单" :width="900" @on-cancel="CancelHoldUpModal">
       <p class="P-Text-Error P-FZ-14 P-FW-Bold">
        <Icon type="md-alert" class="P-Text-Error" size="16" />
        订单[{{HoldUpOrder.OrderCode}}]为拦截订单，无法进行打包。请将货品归还到货架上。
      </p>
      <Table v-if="HoldUpModal" class="P-MT-10" size="small" :columns="Cols" :data="NoPackShipOrders" :span-method="HandleShipOrdersSpan" height="400" border ></Table>
      <footer slot="footer">
        <Button type="primary" @click="CancelHoldUpModal">确定</Button>
      </footer>
    </Modal>
    <Modal v-model="ItemModal" title="订单明细" :width="900" @on-cancel="CancelHoldUpModal">
      <Table v-if="ItemModal" size="small" :columns="Cols" :data="NoPackShipOrders" :span-method="HandleShipOrdersSpan" height="400" border ></Table>
      <footer slot="footer">
        <Button type="primary" @click="CancelHoldUpModal">确定</Button>
      </footer>
    </Modal>
    <Modal v-model="RePrintModal" title="重打面单" :width="900" @on-cancel="CancelRePrintModal">
      <Table size="small" :columns="HistoryPrintCols" :data="RePrintShipOrders" :span-method="HandleRePrintSpan" height="400" border></Table>
      <footer slot="footer">
        <Button @click="CancelRePrintModal">返回</Button>
      </footer>
    </Modal>
    <Modal v-model="ShipOrderModal" title="完成批次" :width="900" @on-cancel="CancelShipOrderModal">
      <p class="P-Text-Error P-FZ-14 P-FW-Bold">
        <Icon type="md-help-circle" class="P-Text-Error" size="16" />
        批次[{{PackForm.BatchCode}}]仍有订单未打包，操作完成批次将对以下订单进行还货，是否确认完成批次
      </p>
      <Table v-if="ShipOrderModal" class="P-MT-10" size="small" :columns="Cols" :data="NoPackShipOrders" :span-method="HandleShipOrdersSpan" height="400" border ></Table>
      <footer slot="footer">
        <Button type="primary" @click="CompleteBatch(false)">确定</Button>
        <Button @click="CancelShipOrderModal">返回</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder'
import WarehouseInterface from '@/assets/Interface/Warehouse'
import PrintInterface from '@/assets/Interface/Print'
import {PrintLabel, PrintPackLabel, ChangeOrderStaus} from './PrintPackLabel'

@Component({
  name: 'SowingPack'
})

export default class SowingPack extends Vue {
  private mounted(): void {
    this.FocusIpt('BatchCodeIpt')
  }

  private FocusIpt(Ref: string): void {
    (this as any).$refs[Ref].focus()
  }

  private BlurIpt(Ref: string): void {
    (this as any).$refs[Ref].blur()
  }

  /* 加载批次信息，获取待打包订单 */
  private TriggerLoadBatch(): void {
    if(!this.PackForm.BatchCode) return;
    this.BlurIpt('BatchCodeIpt')
    if(this.ShipOrders.length){
      if(this.PackForm.BatchCode !== this.ShipOrders[0].BatchCode){
        this.GetSpanShipOrderData(1)
        this.ShipOrderModal = true
      }else{
        this.FocusIpt('SkuCodeIpt')
      }
    }else{
      this.GetNoPackOrders()
    }
  }

  /* 获取批次未打包订单 */
  private GetNoPackOrders(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.BatchOrderGetNoPackOrderInfo,
        Login: true
      },
      Data: {
        BatchId: "",
        BatchCode: this.PackForm.BatchCode
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          if(!Res.Data.Data){
            this.$UI.Tips.Floating('waqrning', `批次[${this.PackForm.BatchCode}]不存在`)
            this.ResetAll();
            return
          }
          if(!Res.Data.Data.length){
            this.$UI.Tips.Floating('warning', `批次[${this.PackForm.BatchCode}]无待打包订单，请扫描其他批次号`)
            this.ResetAll();
            return
          }
          this.HistoryPrintData = []
          this.ShipOrders.push(...Res.Data.Data);
          this.Packing = true;
          this.$nextTick(()=>{this.FocusIpt('SkuCodeIpt')})
        }else{
          this.$Request.Error(Res, this.ResetAll)
        }
      }
    })
  }

  /* 获取订单基本信息 */
  private GetShipOrderBase(): Promise<Interface.ShipOrderBase> {
    return new Promise(( Resolve: (Val: Interface.ShipOrderBase) => void ) => {
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.GetBaseShipOrder,
          Login: true
        },
        Data: {
          OrderId: this.PackingOrder.OrderId,
          OrderCode: ""
        },
        Callback: (Res: PInterface.Res): void => {
          if(Res.IsSuccess){
            Resolve(Res.Data.Data)
          }else{
            Resolve(new Interface.ShipOrderBase())
          }
        }
      })
    })
  }

  /* 匹配订单 */
  private TriggerMatchOrder(): void {
    if(!this.PackForm.SkuCode) {
      this.FocusIpt('SkuCodeIpt'); return;
    }
    
    this.BlurIpt('SkuCodeIpt')
    let SkuCode = JSON.parse(JSON.stringify(this.PackForm.SkuCode)).split('-')
    SkuCode.pop()
    SkuCode = SkuCode.join('-')
    for(let Idx = 0, Len = this.ShipOrders.length; Idx < Len; Idx++){
      const Item = this.ShipOrders[Idx];
      for(let SkuIdx = 0, SkuLen = Item.Item.length; SkuIdx < SkuLen; SkuIdx++){
        const Sku = Item.Item[SkuIdx]
        if([this.PackForm.SkuCode, SkuCode].includes(Sku.SkuCode) &&  ((Sku.ScanQty || 0) + (this.PackForm.Quantity || 1)) <= Sku.Quantity){
          /* 拦截单 */
          if(Item.IsHoldUp){
            this.ShipOrders[Idx].OrderStatus = 3 
            this.HoldUpOrder = this.ShipOrders[Idx]
            this.HoldUpModal = true
            this.GetSpanShipOrderData(2)
            const ChangeStatusData: Interface.ChangeShipOrderStatus = {
              OrderId: [this.HoldUpOrder.OrderId],
              Targetstatus: 8,
              Remark: this.HoldUpOrder.HoldUpRemark
            }
            ChangeOrderStaus(ChangeStatusData)
          }else{
            this.ShipOrders[Idx].Item[SkuIdx].ScanQty = ((Sku.ScanQty || 0) + this.PackForm.Quantity || 1) | 0 // 取整
            this.PackingOrder = this.ShipOrders[Idx]
            this.PackingSku = this.ShipOrders[Idx].Item[SkuIdx]
            const IsComplete: boolean = this.ShipOrders[Idx].Item.every(SkuItem => SkuItem.ScanQty === SkuItem.Quantity)
            if(IsComplete){
              this.ShipOrders[Idx].OrderStatus = 2
              this.PostPack()
            }else{
              this.ShipOrders[Idx].OrderStatus = 1
              this.PackForm.SkuCode = ''
              this.FocusIpt('SkuCodeIpt')
            }
          }
          this.PackForm.Quantity = 1
          return;
        }
      }
    }

    this.$UI.Tips.Floating('warning', `批次${this.PackForm.BatchCode}中无法匹配明细SKU为[${this.PackForm.SkuCode}]的订单，请重新扫描SKU编号或检查扫描数量`)
    this.PackForm.Quantity = 1
    this.PackForm.SkuCode = ''
    this.FocusIpt('SkuCodeIpt')
  }

  /* 提交打包 */
  private PostPack(): void {
    this.$UI.Loading.Show()
    /* 先打印面单，再进行打包 */
    this.GetShipOrderBase().then((ShipOrderBase: Interface.ShipOrderBase) => {
      if(ShipOrderBase.Id){
        PrintPackLabel(ShipOrderBase).then((PrintData: (PrintInterface.PrintData | PrintInterface.PmsPrintData)[]) => {
          if(PrintData.length){
            let PostData: Interface.PackOrder = {
              OrderId: [this.PackingOrder.OrderId],
              Weight: 0,
              PaoId: ""
            }
            for(let { GrossWeight, Quantity } of this.PackingOrder.Item){
              PostData.Weight += (GrossWeight*Quantity)
            }
            PostData.Weight = parseFloat(PostData.Weight.toFixed(3))

            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.PackOrder,
                Login: true
              },
              Data: PostData,
              Callback: (Res: PInterface.Res): void => {
                if(Res.IsSuccess){
                  this.$UI.Tips.Floating('success', `订单[${this.PackingOrder.OrderCode}]打包成功，面单已打印`);
                  this.HistoryPrintData.unshift(...PrintData as (PrintInterface.PrintData | PrintInterface.PmsPrintData)[] )
                  this.CheckComplete() // 检查是否全部可以完成
                }else{
                  if(Res.ApiStatusCode){
                    this.$UI.Loading.Hide()
                    this.$Request.Error(Res);
                  }else{
                    this.PackFail('连接服务器失败')
                  }
                }
              }
            })
          }else{
            this.PackFail('面单打印失败')
          }
        })
      }else{
        this.PackFail('获取发货单信息失败')
      }
    })
  }

  /* 打包失败 */
  private PackFail(Ctn: string): void {
    this.$UI.Loading.Hide()
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `${Ctn}，导致订单[${this.PackingOrder.OrderCode}]打包失败，是否重试打包操作（若不重试/重试仍然失败，系统将对该订单进行还货）`,
      Callback: (Res: boolean) => {
        if(Res){
          this.PostPack()
        }else{
          this.ResetPackingOrder()
        }
      }
    })
  }

  /* 检查是否全部已完成 */
  private IsAllComplete(): boolean {
    return this.ShipOrders.every(Item => [2,3].includes(Item.OrderStatus))
  }

  /* 检查是否全部完成 */
  private CheckComplete(): void {
    if(this.IsAllComplete()){
      this.CompleteBatch(true)
    }else{
      this.$UI.Loading.Hide()
      this.PackForm.SkuCode = ''
      this.FocusIpt('SkuCodeIpt')
    }
  }

  /* 点击完成批次按钮 */
  private ValidateCompleteBatch(): void {
    if(this.IsAllComplete()){
      this.CompleteBatch(true)
    }else{
      this.GetSpanShipOrderData(1);
      this.ShipOrderModal = true
    }
  }

  /* 完成批次 */
  private CompleteBatch(IsAuto: boolean): void {
    if(!IsAuto){
      this.CancelShipOrderModal()
    }
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.BatchOrderReCreateBatchOrder,
        Login: true
      },
      Data: {
        OrderId: [],
        BatchId: [this.ShipOrders[0].BatchId],
        IsAuto: IsAuto
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', IsAuto ? `批次[${this.PackForm.BatchCode}]中所有订单均已打包，该批次已完成` : '完成批次成功')
          this.ResetAll()
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private TriggerItemModal(Idx: number): void {
    this.HoldUpOrder = this.ShipOrders[Idx];
    this.GetSpanShipOrderData(3)
    this.ItemModal = true
  }

  /* 3-订单明细 2-拦截 1-批次订单 */
  private GetSpanShipOrderData(Type: number = 1): void {
    let Datas: (WarehouseInterface.PickBatchOrderTable & WarehouseInterface.PickBatchOrderTableDetail)[] = []
    if(Type === 1){
      for(let Idx = 0, Len = this.ShipOrders.length; Idx < Len; Idx++){
        if(![2,3].includes(this.ShipOrders[Idx].OrderStatus)){
          for(const SkuItem of this.ShipOrders[Idx].Item){
            const ShipOrder = JSON.parse(JSON.stringify(this.ShipOrders[Idx]))
            Datas.push(Object.assign(ShipOrder, SkuItem))
          }
        }else{
          continue;
        }
      }
    }else if([2,3].includes(Type)){
      for(const SkuItem of this.HoldUpOrder.Item){
        const ShipOrder = JSON.parse(JSON.stringify(this.HoldUpOrder))
        Datas.push(Object.assign(ShipOrder, SkuItem))
      }
    }
    
    this.NoPackShipOrders = Datas;
  }

  /* 拦截订单、未打包订单合并列 */
  private HandleShipOrdersSpan({ row, column, rowIndex, columnIndex }: any): any {
    /* 第一列 第一行 */
    if(columnIndex === 0){
      if(rowIndex === 0){
        return {
          rowspan: row.Item.length,
          colspan: 1
        }
      }

      if(this.NoPackShipOrders[rowIndex].OrderCode === this.NoPackShipOrders[rowIndex-1].OrderCode){
        return {
          rowspan: 0,
          colspan: 0
        }
      }else {
        return {
          rowspan: row.Item.length,
          colspan: 1
        }
      }
    }
  }

  /* 关闭拦截、明细模态框 清空已扫订单信息 */
  private CancelHoldUpModal(): void {
    this.HoldUpModal = false
    this.ItemModal = false
    this.NoPackShipOrders = []
    this.$set(this, 'HoldUpOrder', new WarehouseInterface.PickBatchOrderTable())
    this.PackForm.SkuCode = ''
    this.FocusIpt('SkuCodeIpt')
    this.CheckComplete();
  }

  /* 关闭未打包订单模态框 */
  private CancelShipOrderModal(): void {
    this.ShipOrderModal = false
    this.NoPackShipOrders = []
    this.PackForm.BatchCode = this.ShipOrders[0].BatchCode
    this.PackForm.SkuCode = ''
    this.FocusIpt('SkuCodeIpt')
  }

  /* 重置正在打包的订单信息 */
  private ResetPackingOrder(): void {
    this.$set(this, 'PackingOrder', new WarehouseInterface.PickBatchOrderTable())
    this.$set(this, 'PackingSku', new WarehouseInterface.PickBatchOrderTableDetail())
    this.PackForm.SkuCode = ''
    this.FocusIpt('SkuCodeIpt')
  }

  /* 重置全部 */
  private ResetAll(): void {
    this.ShipOrders = []
    this.NoPackShipOrders = []
    this.RePrintShipOrders = []
    this.Packing = false
    this.HoldUpModal = false
    this.ShipOrderModal = false
    this.RePrintModal = false
    this.ItemModal = false
    this.ResetPackingOrder()
    this.$set(this, 'PackForm', new WarehouseInterface.PackForm())
    this.FocusIpt('BatchCodeIpt')
  }

  /* 重打面单信息 */
  private GetSpanRePrintData(): void {
    let Datas: ((PrintInterface.PrintData | PrintInterface.PmsPrintData) & (PrintInterface.PmsItem | PrintInterface.PrintItem))[] = []
    for(let Idx = 0, Len = this.HistoryPrintData.length; Idx < Len; Idx++){
      for(const SkuItem of ((this.HistoryPrintData[Idx] as PrintInterface.PrintData).Item) || ((this.HistoryPrintData[Idx] as PrintInterface.PmsPrintData).Items)){
        let ShipOrder = JSON.parse(JSON.stringify(this.HistoryPrintData[Idx]))
        Datas.push(Object.assign(ShipOrder, SkuItem))
      }
    }
    this.RePrintShipOrders = Datas;
  }

  /* 重打面单合并行合并列 */
  private HandleRePrintSpan({ row, column, rowIndex, columnIndex }: any): any {
    /* 第一列 第一行 */
    if(columnIndex === 0 || columnIndex === 2){
      if(rowIndex === 0){
        return {
          rowspan: row.Item.length,
          colspan: 1
        }
      }

      if(this.RePrintShipOrders[rowIndex].OrderCode === this.RePrintShipOrders[rowIndex-1].OrderCode){
        return {
          rowspan: 0,
          colspan: 0
        }
      }else {
        return {
          rowspan: row.Item.length,
          colspan: 1
        }
      }
    }
  }

  /* 打开重打面单 */
  private TriggerRePrint(): void {
    this.GetSpanRePrintData()
    this.RePrintModal = true
  }

  private CancelRePrintModal(): void {
    this.RePrintModal = false
    this.RePrintShipOrders = []
    this.PackForm.SkuCode = ''
    this.FocusIpt('SkuCodeIpt')
  }

  private PackForm: WarehouseInterface.PackForm = new WarehouseInterface.PackForm()
  private ShipOrders: WarehouseInterface.PickBatchOrderTable[] = []
  private NoPackShipOrders: (WarehouseInterface.PickBatchOrderTable & WarehouseInterface.PickBatchOrderTableDetail)[] = []

  private Packing: boolean = false
  private PackingOrder: WarehouseInterface.PickBatchOrderTable = new WarehouseInterface.PickBatchOrderTable()
  private PackingSku: WarehouseInterface.PickBatchOrderTableDetail = new WarehouseInterface.PickBatchOrderTableDetail()
  private HistoryPrintData: (PrintInterface.PrintData | PrintInterface.PmsPrintData)[] = []

  private HoldUpModal: boolean = false
  private HoldUpOrder: WarehouseInterface.PickBatchOrderTable = new WarehouseInterface.PickBatchOrderTable()

  private ItemModal: boolean = false

  private ShipOrderModal: boolean = false
  private RePrintShipOrders: ((PrintInterface.PrintData | PrintInterface.PmsPrintData) & (PrintInterface.PmsItem | PrintInterface.PrintItem))[] = []
  private Cols: PInterface.TableCol[] = [{
    title: '箱号',
    key: 'BoxNum',
    width: 135,
    render: (h: any, Params: any): string => {
      return h('h2', Params.row.BoxNum)
    }
  }, {
    title: 'SKU编号',
    key:'SkuCode',
    width: 135
  }, {
    title: 'SKU名称',
    key: 'SkuName'
  }, {
    title: '数量',
    key: 'Quantity',
    width: 135
  }]

  private RePrintModal: boolean = false
  private HistoryPrintCols: PInterface.TableCol[] = [{
    title: '发货单号',
    key: 'OrderCode'
  }, {
    title: 'SKU编号',
    key: 'SkuCode'
  }, {
    title: '操作',
    width: 120,
    align: 'center',
    render: (h: any, Params: any): string => {
      return h('Button', {
        props: {
          size: 'small',
          type: 'primary'
        },
        on: {
          click: () => {
            console.log(Params.row)
            PrintLabel(Params.row).then((Res: boolean) => {
              this.$UI.Tips.Floating('success', '重打面单成功')
            });
          }
        }
      },'重打面单')
    }
  }]
}
</script>
<style lang="less" scoped>
.Batch-Info{
  height: calc(100vh - 162px);
  clear: both;
  padding-top:10px;

  &>.Sku{
    height: 100%;

    &>.Sku-Info,&>.Boxs {
      height: 50%;
    }

    &>.Sku-Info{
      text-align: center;
      width:50%;
      display: inline-block;
      vertical-align: top;

      &>h1{
        font-size: 180px;
        margin: 0;
        padding:0;
      }

      &>p{
        font-size: 16px;
      }
    }

    &>.Sku-Qty{
      width: 50%;
      font-size: 42px;
      font-weight: 700;
      text-align: center;
      display: inline-block;
      padding-top: 70px;
    }

    &>.Boxs {
      overflow: auto;
      &>span {
        display: inline-block;
        width: 80px;
        height: 40px;
        border-radius: 2px;
        color: #FFF;
        line-height: 40px;
        text-align: center;
        margin-right: 6px;
        cursor: pointer;
        margin-bottom: 6px;
        transition: all .3s;
      }
    }
  }

  &>.Sku-Img{
    height: 100%;

    &>section{
      max-width: 100%;
      height: calc(100vh - 243px);
      background-repeat: no-repeat;
      background-size: contain;
      margin: 40px;
    }
  }
  
}
</style>