<!-- 单品打包 -->
<template>
  <Row>
    <Col span="24">
      <span>匹配产品：</span>
      <Input ref="BatchCodeIpt" class="P-W-300" size="large" v-model.trim="PackForm.BatchCode" placeholder="请扫描/输入批次号，输入完成请按回车键" @on-enter="TriggerLoadBatch" />
      <Input ref="SkuCodeIpt" class="P-W-300 P-ML-10" size="large" :disabled="!Packing" v-model.trim="PackForm.SkuCode" placeholder="请扫描/输入SKU编号，输入完成请按回车键" @on-enter="TriggerMatchOrder" />
      <span class="P-ML-20">扫描数量：</span>
      <InputNumber ref="QtyIpt" class="P-W-200 P-ML-10" size="large" :min="1" v-model="PackForm.Quantity" placeholder="请输入数量" />
      <Button class="P-ML-10" size="large" type="primary" :disabled="!Packing" @click="TriggerMatchOrder">匹配订单</Button>
      <Button class="P-ML-10" size="large" type="success" :disabled="!Packing" @click="PostPack" >打包{{CountDown ? `(${CountDown})` : ''}}</Button>
      <Button class="P-ML-10" size="large" type="success" :disabled="!Packing" @click="ValidateCompleteBatch">完成批次</Button>
      <Button class="P-ML-10" size="large" type="primary" @click="ResetCode">清除编号</Button>
      <Button class="P-ML-10" size="large" type="primary" @click="TriggerRePrint">重打面单</Button>
    </Col>
    <Col class="P-MT-20 Pack-Img" span="10" v-if="PackingOrder.Item.length">
      <section :style="{'background-image':`url(${$Server.File}/${PackingOrder.Item[0].DefaultImage})`}"></section>
    </Col>
    <Col class="P-MT-20 Pack-Sku" span="14" v-if="PackingOrder.Item.length">
      <h1 class="P-MB-20">
        SKU编号：{{PackingOrder.Item[0].SkuCode}}
      </h1>
      <h1 class="P-MB-20">
        SKU名称：{{PackingOrder.Item[0].SkuName}}
      </h1>
      <h1 class="P-MB-20">
        已扫数量：<span class="P-Text-Error" v-if="PackingOrder.Item.length">{{PackingOrder.Item[0].ScanQty}}</span>
      </h1>
    </Col>
    <Modal v-model="HoldUpModal" title="已拦截订单" :width="900" @on-cancel="CancelHoldUpModal">
      <p class="P-Text-Error P-FZ-14 P-FW-Bold">
        <Icon type="md-alert" class="P-Text-Error" size="16" />
        订单[{{HoldUpOrder.OrderCode}}]为拦截订单，无法进行打包。请将货品[{{HoldUpOrder.Item.length ? HoldUpOrder.Item[0].SkuCode : ''}}]归还到货架上。
      </p>
      <Table v-if="HoldUpOrder.Item.length" class="P-MT-10" size="small" :columns="Cols" :data="[HoldUpOrder]" height="400" stripe></Table>
      <footer slot="footer">
        <Button type="primary" @click="CancelHoldUpModal">确定</Button>
      </footer>
    </Modal>
    <Modal v-model="RePrintModal" title="重打面单" :width="900" @on-cancel="CancelRePrintModal">
      <Table size="small" :columns="HistoryPrintCols" :data="HistoryPrintData" height="400" stripe></Table>
      <footer slot="footer">
        <Button @click="CancelRePrintModal">返回</Button>
      </footer>
    </Modal>
    <Modal v-model="ShipOrderModal" title="完成批次" :width="900" @on-cancel="CancelShipOrderModal">
      <p class="P-Text-Error P-FZ-14 P-FW-Bold">
        <Icon type="md-help-circle" class="P-Text-Error" size="16" />
        批次[{{PackForm.BatchCode}}]仍有订单未打包，操作完成批次将对以下订单进行还货，是否确认完成批次
      </p>
      <Table class="P-MT-10" size="small" :columns="Cols" :data="ShipOrders" height="400" stripe></Table>
      <footer slot="footer">
        <Button type="primary" @click="CompleteBatch(false)">确定</Button>
        <Button @click="CancelShipOrderModal">返回</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder'
import WarehouseInterface from '@/assets/Interface/Warehouse'
import PrintInterface from '@/assets/Interface/Print'
import {PrintLabel, PrintPackLabel, ChangeOrderStaus} from './PrintPackLabel'

@Component({
  name: 'SingleItemPack'
})

export default class SingleItemPack extends Vue {
  private mounted(): void {
    this.FocusIpt('BatchCodeIpt')
  }

  private FocusIpt(Ref: string): void {
    (this as any).$refs[Ref].focus()
  }

  private BlurIpt(Ref: string): void {
    (this as any).$refs[Ref].blur()
  }

  private TriggerLoadBatch(): void {
    if(!this.PackForm.BatchCode) return;
    this.BlurIpt('BatchCodeIpt')
    if(this.ShipOrders.length){
      this.PackForm.BatchCode !== this.ShipOrders[0].BatchCode ? this.ShipOrderModal = true : this.FocusIpt('SkuCodeIpt')
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
          }
          if(!Res.Data.Data.length){
            this.$UI.Tips.Floating('warning', `批次[${this.PackForm.BatchCode}]无待打包订单，请扫描其他批次号`)
            this.ResetAll();
            return
          }
          this.HistoryPrintData = []
          this.ShipOrders.push(...Res.Data.Data);
          this.BatchId = this.ShipOrders[0].BatchId;
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

  /* 匹配订单
    1.查找SKU，按正常查找和去除末尾-后的数据查找；
    2.含有拦截标识订单，调用拦截API，拦截完成清空匹配订单信息；
    3.匹配订单时，需检查叠加数量后是否超出购买数量，若超出则匹配不成功；
    4.匹配成功后，检查叠加后的SKU数量是否已满足购买数量，若满足则自动打包，未满足则停留在界面并展示已扫的叠加数量，焦点回到SKU输入框；
    5.批次中所有订单打包成功，调用完成批次，自动完成时传true，手动点击完成批次传false；
  */
  private TriggerMatchOrder(): void {
    if(!this.PackForm.SkuCode) {
      this.FocusIpt('SkuCodeIpt'); return;
    }
    this.BlurIpt('SkuCodeIpt')
    let SkuCode = JSON.parse(JSON.stringify(this.PackForm.SkuCode)).split('-')
    SkuCode.pop()
    SkuCode = SkuCode.join('-')
    for(let Idx = 0, Len = this.ShipOrders.length; Idx < Len; Idx++){
      const Item = this.ShipOrders[Idx].Item[0]
      if([this.PackForm.SkuCode, SkuCode].includes(Item.SkuCode) && ((Item.ScanQty || 0) + this.PackForm.Quantity || 1) <= Item.Quantity){
        /* 拦截单 */
        if(this.ShipOrders[Idx].IsHoldUp) {
          this.HoldUpModal = true
          this.HoldUpOrder = this.ShipOrders[Idx]
          const ChangeStatusData: Interface.ChangeShipOrderStatus = {
            OrderId: [this.HoldUpOrder.OrderId],
            Targetstatus: 8,
            Remark: this.HoldUpOrder.HoldUpRemark
          }
          ChangeOrderStaus(ChangeStatusData).then((Res:boolean) => {
            this.ShipOrders.splice(Idx, 1)
            this.CheckComplete()
          })
          this.PackForm.Quantity = 1
        }else {
          this.ShipOrders[Idx].Item[0].ScanQty = ((Item.ScanQty || 0) + this.PackForm.Quantity || 1) | 0 // 取整
          this.PackingOrder = this.ShipOrders[Idx]
          if(this.PackingOrder.Item[0].Quantity === this.PackingOrder.Item[0].ScanQty){
            this.CountDown = 3;
            this.CountDownTimer = setTimeout(this.CountDownPack, 1000);
          }
        }
        return;
      }
    }
    this.$UI.Tips.Floating('warning', `批次${this.PackForm.BatchCode}中无法匹配明细SKU为[${this.PackForm.SkuCode}]的订单，请重新扫描SKU编号或检查扫描数量`)
    this.PackForm.SkuCode = ''
    this.FocusIpt('SkuCodeIpt')
  }

   /* 倒数 */
  private CountDownPack(): void {
    clearTimeout(this.CountDownTimer)
    this.CountDown--;
    if(!this.CountDown){
      this.PostPack();
    }else {
      this.CountDownTimer = setTimeout(this.CountDownPack, 1000)
    }
  }

  /* 提交打包 先获取订单基础信息 */
  private PostPack(): void {
    if(!this.PackingOrder.OrderId){
      this.PackForm.SkuCode ? this.TriggerMatchOrder() : this.FocusIpt('SkuCodeIpt');
      return;
    }
    clearTimeout(this.CountDownTimer)
    this.CountDown = 0
    this.$UI.Loading.Show()
    /* 先打印面单，再进行打包 */
    this.GetShipOrderBase().then((ShipOrderBase: Interface.ShipOrderBase) => {
      if(ShipOrderBase.Id){
        PrintPackLabel(ShipOrderBase).then((PrintData: PrintInterface.PrintData[] | PrintInterface.PmsPrintData[]) => {
          if(PrintData.length){
            let PostData: Interface.PackOrder = {
              OrderId: [this.PackingOrder.OrderId],
              Weight: parseFloat((this.PackingOrder.Item[0].GrossWeight * this.PackingOrder.Item[0].Quantity).toFixed(3)),
              PaoId: ""
            }
            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.PackOrder,
                Login: true
              },
              Data: PostData,
              Callback: (Res: PInterface.Res): void => {
                this.$UI.Loading.Hide()
                if(Res.IsSuccess){
                  this.$UI.Tips.Floating('success', `订单[${this.PackingOrder.OrderCode}]打包成功，面单已打印`);
                  this.HistoryPrintData.unshift(...PrintData as PrintInterface.PrintData[])
                  this.PackForm.Quantity = 1
                  this.DelPackingOrder()
                  this.ResetPackingOrder()
                }else{
                  this.$Request.Error(Res, this.ResetScan);
                }
              }
            })
          }else{
            this.$UI.Loading.Hide();
            this.$UI.Tips.Floating('warning', '面单打印失败，请重新扫描SKU');
            this.ResetScan();
          }
        })
      }else{
        this.$UI.Loading.Hide()
        this.$UI.Tips.Floating('warning', '获取发货单信息失败，请重新扫描SKU');
        this.ResetScan();
      }
    })
  }

  /* 触发完成批次按钮 */
  private ValidateCompleteBatch(): void {
    if(this.ShipOrders.length){
      this.ShipOrderModal = true
    }else if(this.Packing){
      this.CompleteBatch(true)
    }
  }

  /* 完成批次 */
  private CompleteBatch(IsAuto: boolean): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.BatchOrderReCreateBatchOrder,
        Login: true
      },
      Data: {
        OrderId: [],
        BatchId: [this.BatchId],
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

  /* 关闭拦截模态框 清空已扫订单信息 批次订单中去除该单 */
  private CancelHoldUpModal(): void {
    this.HoldUpModal = false
    this.$set(this, 'HoldUpOrder', new WarehouseInterface.PickBatchOrderTable())
    /* 剔除拦截单 */
    this.DelPackingOrder()
    /* 清空订单信息 */
    this.ResetPackingOrder()
  }

  /* 关闭未打包订单模态框 */
  private CancelShipOrderModal(): void {
    this.ShipOrderModal = false
    this.ResetCode();
  }
  
  /* 剔除正在打包的订单 */
  private DelPackingOrder(): void {
    this.ShipOrders = this.ShipOrders.filter((Item: WarehouseInterface.PickBatchOrderTable) => Item.OrderId !== this.PackingOrder.OrderId)
    if(!this.ShipOrders.length){
      this.CompleteBatch(true)
    }else{
      this.$UI.Loading.Hide()
    }
  }

  private CheckComplete(): void {
    if(!this.ShipOrders.length){
      this.CompleteBatch(true)
    }
  }

  /* 清空正在打包的订单信息 */
  private ResetPackingOrder(): void {
    this.$set(this, 'PackingOrder', new WarehouseInterface.PickBatchOrderTable())
    this.PackForm.SkuCode = ''
    this.FocusIpt('SkuCodeIpt')
  }

  /* 触发清除编号 */
  private ResetCode(): void {
    this.$set(this, 'PackingOrder', new WarehouseInterface.PickBatchOrderTable())
    if(this.Packing){
      this.PackForm.BatchCode = this.ShipOrders[0].BatchCode
      this.PackForm.SkuCode = ''
      this.FocusIpt('SkuCodeIpt')
    }else{
      this.$set(this, 'PackForm', new WarehouseInterface.PackForm())
      this.FocusIpt('BatchCodeIpt');
    }
  }

  /* 调用打包失败时还原扫描操作，聚焦到SKU编号重新扫描产品 */
  private ResetScan(): void {
    for(let Idx = 0, Len = this.ShipOrders.length; Idx < Len; Idx++) {
      if(this.ShipOrders[Idx].Item[0].SkuCode === this.PackingOrder.Item[0].SkuCode){
        (this.ShipOrders[Idx].Item[0].ScanQty as number) -= this.PackForm.Quantity
      }
    }
    this.ResetPackingOrder()
  }

  /* 重置所有 */
  private ResetAll(): void {
    this.CountDown = 0;
    this.BatchId = 0;
    this.ShipOrders = []
    this.Packing = false
    this.ResetCode();
  }

  /* 打开重打面单 */
  private TriggerRePrint(): void {
    this.RePrintModal = true
  }

  private CancelRePrintModal(): void {
    this.RePrintModal = false
    this.ResetCode()
  }

  private PackForm: WarehouseInterface.PackForm = new WarehouseInterface.PackForm()
  private BatchId: number = 0
  private ShipOrders: WarehouseInterface.PickBatchOrderTable[] = []

  private Packing: boolean = false
  private PackingOrder: WarehouseInterface.PickBatchOrderTable = new WarehouseInterface.PickBatchOrderTable()
  private CountDown: number = 0
  private CountDownTimer: any = null
  private HistoryPrintData: PrintInterface.PrintData[] = []

  private HoldUpModal: boolean = false
  private HoldUpOrder: WarehouseInterface.PickBatchOrderTable = new WarehouseInterface.PickBatchOrderTable()
  private Cols: PInterface.TableCol[] = [{
    title: '发货单号',
    key: 'OrderCode',
    width: 135
  }, {
    title: 'SKU编号',
    key:'SkuCode',
    width: 135,
    render: (h: any, Params: any): string => {
      return h('p', Params.row.Item[0].SkuCode)
    }
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h:any, Params: any): string => {
      return h('p', Params.row.Item[0].SkuName)
    }
  }, {
    title: '数量',
    key: 'Quantity',
    width: 135,
    render: (h: any, Params: any): string => {
      return h('p', Params.row.Item[0].Quantity)
    }
  }]
  
  private RePrintModal: boolean = false
  private HistoryPrintCols: PInterface.TableCol[] = [{
    title: '发货单号',
    key: 'OrderCode'
  }, {
    title: 'SKU编号',
    render: (h: any, Params: any):string => {
      return h('span', Params.row.Item[0].SkuCode)
    }
  }, {
    title: '操作',
    width: 100,
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

  private ShipOrderModal: boolean = false
  
}
</script>
<style lang="less" scoped>
.Pack-Img{
  &>section{
    max-width: 100%;
    height: calc(100vh - 182px);
    background-repeat: no-repeat;
    background-size: contain;
  }
}

.Pack-Sku {
  padding-left: 40px;
  display: flex;
  display: -webkit-flex;
  height: calc(100vh - 182px);
  flex-direction: column;
  justify-content: center;
}
</style>