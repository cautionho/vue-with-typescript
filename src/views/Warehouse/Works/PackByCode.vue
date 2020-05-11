<!-- 单号打包 -->
<template>
  <Row>
    <Col span="24">
      <Input ref="Ipt" type="text" v-model.trim="OrderCode" size="large" placeholder="输入/扫描订单编号" class="P-W-400" autofocus @on-enter="TriggerLoadOrder" />
      <Button type="primary" size="large" class="P-ML-10 P-W-200" @click="TriggerLoadOrder">加载订单信息</Button>
      <Button type="success" size="large" class="P-ML-10 P-W-200" @click="TriggerLoadOrder">打包{{CountDown ? `(${CountDown})` : ''}}</Button>
    </Col>
    <Col span="24" v-if="CountDown">
      <h2 class="P-Text-Info P-MT-20 Pack-Title">订单信息</h2>
      <Row>
        <Col span="9" offset="1" class="P-MT-20 Pack-Label-Item">
          <b>收件人：</b>
          <span>{{ShipOrderAddress.BuyerFullName}}</span>
        </Col>
        <Col span="14" class="P-MT-20 Pack-Label-Item">
          <b>国家：</b>
          <span>{{ShipOrderAddress.BuyerFullName}}</span>
        </Col>
        <Col span="9" offset="1" class="P-MT-20 Pack-Label-Item">
          <b>发货仓：</b>
          <span>{{ShipOrderBase.WarehouseName}}</span>
        </Col>
        <Col span="14" class="P-MT-20 Pack-Label-Item">
          <b>地址：</b>
          <span>{{`${ShipOrderAddress.BuyerStreet1},${ShipOrderAddress.BuyerStreet2 ? '' : (ShipOrderAddress.BuyerStreet2 + ',')}${ShipOrderAddress.BuyerCity},${ShipOrderAddress.BuyerState},${ShipOrderAddress.BuyerZipCode}`}}</span>
        </Col>
        <Col span="9" offset="1" class="P-MT-20 Pack-Label-Item">
          <b>物流渠道：</b>
          <span>{{ShipOrderBase.MethodName}}</span>
        </Col>
        <Col span="14" class="P-MT-20 Pack-Label-Item">
          <b>操作备注：</b>
          <span>{{ShipOrderBase.Remark}}</span>
        </Col>
      </Row>
    </Col>
    <Col span="24" v-if="CountDown">
      <h2 class="P-Text-Info P-MT-20 Pack-Title">订单明细</h2>
      <Table class="P-MT-20" size="large" :columns="Cols" :data="ShipOrderItems" :height="CalculateHeight()" stripe></Table>
    </Col>
    <Modal v-model="HoldUpModal" title="已拦截订单" :width="900" @on-cancel="CancelHoldUpModal">
      <p class="P-Text-Error P-FZ-14 P-FW-Bold">
        <Icon type="md-alert" class="P-Text-Error" size="16" />
        订单[{{OrderCode}}]为拦截订单，无法进行打包。请将订单的货品归还到货架上。
      </p>
      <Table class="P-MT-10" size="small" :columns="Cols" :data="ShipOrderItems" height="400" stripe></Table>
      <footer slot="footer">
        <Button type="primary" @click="CancelHoldUpModal">确定</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'
import PrintInterface from '@/assets/Interface/Print'
import {PrintPackLabel, ChangeOrderStaus} from './PrintPackLabel'

@Component({
  name: 'PackByCode'
})

export default class PackByCode extends Vue {
  private mounted(): void {
    this.FocusIpt()
  }

  /* 焦点 */
  private FocusIpt(): void {
    this.$set(this, 'OrderCode', '');
    (this as any).$refs.Ipt.focus();
  }

  /* 失焦 */
  private BlurIpt(): void {
    (this as any).$refs.Ipt.blur()
  }

  private CalculateHeight(): number {
    return this.$UI.FullHeight() - 400
  }

  /* 触发加载订单信息 */
  private TriggerLoadOrder(): void {
    this.BlurIpt()
    if(!this.OrderCode){
      this.$UI.Tips.Floating('warning', '请输入/扫描订单编号');
      this.FocusIpt()
      return
    }
    /* 正在倒数，直接调用打包 */
    if(this.CountDown){
      this.PostPack()
      return
    }
    if(this.OrderCode === this.ShipOrderBase.OrderCode){
      this.$UI.Tips.Floating('warning', `订单[${this.OrderCode}]正在进行打包，请勿重复扫描`);
      this.FocusIpt()
      return
    }
    this.GetOrderInfo();
  }

  /* 获取订单信息 */
  private GetOrderInfo(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.GetShipOrderInfo,
        Login: true
      },
      Data: { OrderCode: this.OrderCode, OrderId: 0 },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
           this.ValidateOrderInfo(Res.Data)
        }else{
          this.$Request.Error(Res, () => {
            this.FocusIpt();
          })
        }
      }
    })
  }

  /* 验证加载的订单是否符合打包 */
  private ValidateOrderInfo(Data: Interface.ShipOrderInfo): void {
    if(Data.ShipOrder.Status !== 4){
      this.$UI.Tips.Floating('warning', `订单[${this.OrderCode}]状态不为已拣货，无法进行打包`)
      this.FocusIpt()
      return
    }
    if(Data.ShipOrder.IsException){
      this.$UI.Tips.Floating('warning', `订单[${this.OrderCode}]状态为异常订单，无法进行打包`)
      this.FocusIpt()
      return
    }

    this.$set(this, 'ShipOrderBase', Data.ShipOrder)
    this.$set(this, 'ShipOrderItems', Data.Items)
    this.$set(this, 'ShipOrderAddress', Data.Address)
    
    if(Data.ShipOrder.IsHoldUp){
      this.HoldUpModal = true;
      const ChangeStatusData: Interface.ChangeShipOrderStatus = {
        OrderId: [Data.ShipOrder.Id],
        Targetstatus: 8,
        Remark: Data.ShipOrder.Remark
      }
      /* 变更状态 */
      ChangeOrderStaus(ChangeStatusData).then((Res: boolean) => { this.ResetAll() })
    }else {
      this.CountDown = 3
      this.CountDownTimer = setTimeout(this.CountDownPack, 1000)
    }
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

  private PostPack(): void {
    clearTimeout(this.CountDownTimer)
    this.CountDown = 0
    this.$UI.Loading.Show()
    let PostData: Interface.PackOrder = {
      OrderId: [this.ShipOrderBase.Id],
      Weight: 0,
      PaoId:""
    }
    for(let { Sku, Quantity } of this.ShipOrderItems){
      PostData.Weight += Sku.GrossWeight/1000 * Quantity
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
          PrintPackLabel(this.ShipOrderBase).then((Res: PrintInterface.PrintData[] | PrintInterface.PmsPrintData[])=>{
            this.$UI.Loading.Hide()
            this.$UI.Tips.Floating('success', `订单[${this.OrderCode}]打包成功，${ Res.length ? '面单已打印' : '面单打印失败，请到已打包订单进行重打面单'}`);
            this.ResetAll();
          })
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res, this.ResetAll)
        }
      }
    })
  }

  /* 关闭拦截模态框 */
  private CancelHoldUpModal(): void {
    this.HoldUpModal = false;
    this.ResetAll();
  }

  /* 重置所有 */
  private ResetAll(): void {
    this.CountDown = 0;
    this.$set(this, 'ShipOrderBase', new Interface.ShipOrderBase())
    this.$set(this, 'ShipOrderAddress', new PInterface.ShipToAddress())
    this.$set(this, 'ShipOrderItems', [])
    this.FocusIpt();
  }

  private OrderCode: string = ''

  private HoldUpModal: boolean = false
  private CountDown: number = 0 // 是否开水倒数
  private CountDownTimer: number = 0

  private ShipOrderBase: Interface.ShipOrderBase = new Interface.ShipOrderBase()
  private ShipOrderItems: Interface.ShipOrderItem[] = []
  private ShipOrderAddress: PInterface.ShipToAddress = new PInterface.ShipToAddress()

  private Cols: PInterface.TableCol[] = [{
    title: 'SKU编号',
    key:'SkuCode'
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h:any, Params: any): string => {
      return h('p', Params.row.Sku.SkuName)
    }
  }, {
    title: '数量',
    key: 'Quantity'
  }]
}
</script>

<style lang="less" scoped>

.Pack-Title{
  text-indent: 1em;
  border-left: 4px solid red;
}

.Pack-Label-Item{
  font-size: 14px;
  &>b{
    width: 200px;
    display: inline-block;
    text-align: right;
  }
}

</style>