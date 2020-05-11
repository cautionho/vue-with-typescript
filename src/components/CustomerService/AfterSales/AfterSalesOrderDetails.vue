<template>
  <Modal v-model="ViewModal" :title="ModalTitle" @on-cancel="CancelModal" :width="1000" class="Container-Tabs">
    <Tabs type="card" :value="AfterSalesDetailsTabs" name="AfterSalesDetailsTab" @on-click="ChangeTabs">
        <TabPane label="基本信息" name="Base" tab="AfterSalesDetailsTab" :index="1">
          <Form inline :label-width="100" onsubmit="rerurn false;" v-if="ViewModal">
            <FormItem class="P-W-49-Percent P-MB-10" label="编号：">
              {{AfterSalesOrderDetails.OrderInfo.AfterSaleCode}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="发货单号：">
              <a @click="EmitShipOrderDetails(AfterSalesOrderDetails.OrderInfo.OriginalShipOrderCode)">{{AfterSalesOrderDetails.OrderInfo.OriginalShipOrderCode}}</a>
            </FormItem> 
            <FormItem class="P-W-49-Percent P-MB-10" label="店铺：">
              {{AfterSalesOrderDetails.OrderInfo.StoreName}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="原因：">
              {{AfterSalesOrderDetails.OrderInfo.Reason}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="客服：">
              {{AfterSalesOrderDetails.OrderInfo.CustomerName}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="客服主管：">
              {{AfterSalesOrderDetails.OrderInfo.SupervisorName}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="订单金额：">
              {{AfterSalesOrderDetails.OrderInfo.OriginalPayment}} {{AfterSalesOrderDetails.OrderInfo.Currency}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="退/补差价金额：">
              {{AfterSalesOrderDetails.OrderInfo.RefundOrDiffAmount}} {{AfterSalesOrderDetails.OrderInfo.Currency}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="处理方式：">
              {{ AfterSalesOrderDetails.OrderInfo ? $Enums.CustomerService.ProcessType[AfterSalesOrderDetails.OrderInfo.ProcessType] : '-'}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="申请时间：">
              {{$UI.Render.Date(AfterSalesOrderDetails.OrderInfo.Created, true)}}
            </FormItem>
            <FormItem class="P-W-100-Percent P-MB-10" label="备注：">
              <Tooltip class="P-LINE-1" :content="AfterSalesOrderDetails.OrderInfo.Remark">{{AfterSalesOrderDetails.OrderInfo.Remark}}</Tooltip>
            </FormItem>
            <Table :span-method="HandleSpan" :columns="GetTransitionsCol()" :data="TransitionDetails" size="small" stripe v-if="AfterSalesOrderDetails.TransactionDetails.length" :height="240"></Table>
            <FormItem class="P-W-100-Percent P-MB-0 P-MT-10" label="审核备注：" v-if="IsReview">
              <Input type="textarea" :autosize="{minRows: 4,maxRows: 4}" placeholder="审核备注" v-model="Remark"></Input>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="问题货品" name="Issue" tab="AfterSalesDetailsTab" :index="2">
          <Table :columns="IssueItemsCol" :data="AfterSalesOrderDetails.IssueDetails" :height="500" size="small" stripe></Table>
        </TabPane>
        <TabPane label="重发货品" name="Resend" tab="AfterSalesDetailsTab" :index="3" v-if="AfterSalesOrderDetails.OrderInfo && AfterSalesOrderDetails.OrderInfo.ProcessType < 3">
          <Table :columns="ResendItemsCol" :data="AfterSalesOrderDetails.ReSendDetails" :height="330" size="small" stripe></Table>
          <Form inline :label-width="100" onsubmit="rerurn false;">
            <FormItem class="P-W-49-Percent P-MB-10" label="收件人：">
              {{GetAddressValue('BuyerFullName')}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="省/州：">
              {{GetAddressValue('BuyerState')}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="城市：">
              {{GetAddressValue('BuyerCity')}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="地址1：">
              {{GetAddressValue('BuyerStreet1')}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="地址2：">
              {{GetAddressValue('BuyerStreet2')}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="邮编：">
              {{GetAddressValue('BuyerZipCode')}}
            </FormItem>
            <FormItem class="P-W-49-Percent P-MB-10" label="电话：">
              {{GetAddressValue('BuyerPhone')}}
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="操作记录" name="History" tab="AfterSalesDetailsTab" :index="4">
          <Table :columns="HistoryCol" :data="AfterSalesOrderDetails.Hisotrys" :height="500"  size="small" stripe></Table>
        </TabPane>
    </Tabs>
    <footer slot="footer">
      <Button v-if="IsReview" type="primary" @click="PostReview(1)">通过</Button>
      <Button v-if="IsReview" type="primary" @click="PostReview(2)">退回修改</Button>
      <Button v-if="IsReview" type="error" @click="PostReview(3)">不通过</Button>
      <Button @click="CancelModal">返回</Button>
    </footer>
    <BigPic ref="BigPic" />
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'AfterSalesOrderDetails',
  components: {
    BigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})

export default class AfterSalesOrderDetails extends Vue {
  @Emit() private EmitShipOrderDetails(Code: string): void {}
  @Emit() private EmitOperateSuccess(): void {}

  private Trigger(D: Interface.AfterSalesList & number, IsReview: boolean = false): void {
    this.$set(this, 'AfterSalesDetailsTabs', 'Base');
    this.$set(this, 'IsReview', IsReview);
    this.$set(this, 'ModalTitle', IsReview ? '审核售后单' : '售后单详情');
    if(typeof D === 'number'){
      this.GetAfterSalesOrderDetails(D);
    }else{
      this.GetAfterSalesOrderDetails(D.AfterSalerId);
    }
  }

  private GetAfterSalesOrderDetails(Id: number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleDetail,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'AfterSalesOrderDetails', Res.Data.Data);
          const Start: string = this.AfterSalesOrderDetails.OrderInfo.OriginalShipOrderCode.slice(0,1);
          this.$set(this, 'Platform', Start === 'E' ? 1 : Start === 'L' ? 5 : Start === 'R' ? 17 : 0)
          this.$set(this, 'TransitionDetails', this.GetTransitionDatas());
          this.$set(this, 'ViewModal', true);
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* 处理数据 */
  private GetTransitionDatas(): (Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo)[] {
    let Datas: (Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo)[] = []
    this.AfterSalesOrderDetails.TransactionDetails.forEach((Item: Interface.AfterSalesTransactionDetails, Index: number): void => {
      Item['Num'] = (Index++)
      let BItem = JSON.parse(JSON.stringify(Item))
      for(let Sku of Item.SkuInfo){
        /* 整理明细 */
        delete BItem.SkuInfo;
        const N:Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo = Object.assign(Sku, BItem, { Span: Item.SkuInfo.length, Num: (Index++) })
        Datas.push(N);
      }
    })
    return Datas
  }

  /* 处理地址数据展示 */
  private GetAddressValue(K: string): string {
    return this.AfterSalesOrderDetails.ReSendDetails.length ? (this.AfterSalesOrderDetails.ReSendDetails[0] as any).Address[K] : '-'; 
  }

  /* 处理合并行、合并列 */
  private HandleSpan({ row, column, rowIndex, columnIndex }:any): any {
    if(columnIndex === 0){
      if(rowIndex === 0){
        return { rowspan: row.Span, colspan: 1 }
      }else {
        if(row.Num !== this.TransitionDetails[rowIndex - 1].Num){
          return { rowspan: row.Span, colspan: 1 }
        }else{
          return { rowspan:0, colspan:0 }
        }
      }
    }else{
      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }

  private GetTransitionsCol(): PInterface.TableCol[] {
    return this[`TransitionDetailsCol${this.Platform}`]
  }

  private ChangeTabs(N: string): void {
    this.$set(this, 'AfterSalesDetailsTabs', N);
  }

  private PostReview(T: number): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否确认执行${T === 1 ? '审核通过' : T === 2 ? '退回修改' : '审核不通过'}操作`,
      Enter: false,
      Callback: (B:boolean): void =>{
        if(B){
          const Api = T === 1 ? this.$Api.AfterSalePass : T === 2 ? this.$Api.AfterSaleReturnToModify : this.$Api.AfterSaleNoPass
          this.$UI.Loading.Show()
          this.$Request.Post({
            Server: this.$Server.CustomerService,
            Api: {
              Address: Api,
              Login: true
            },
            Data: {
              Id: [this.AfterSalesOrderDetails.OrderInfo.AfterSalerId],
              Remark: this.Remark
            },
            Callback: (Res: PInterface.Res): void => {
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '审核成功')
                this.EmitOperateSuccess()
                this.CancelModal()
              }else{
                this.$UI.Loading.Hide()
                this.$Request.Error(Res)
              }
            }
          })
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'Remark', "");
    this.$set(this, 'TransitionDetails', [])
    this.$set(this, 'ViewModal', false);
  }

  private ViewModal: boolean = false
  private ModalTitle: string = '售后单详情'
  private AfterSalesDetailsTabs: string = 'Base'
  private IsReview: boolean = false
  private Remark: string = ""

  private AfterSalesOrderDetails: Interface.AfterSalesDetails = new Interface.AfterSalesDetails()
  private TransitionDetails: (Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo)[] = []

  private Platform: number = 1
  /* eBay、Walmart、Allegro有 */
  private TransitionDetailsCol1: PInterface.TableCol[] = [{
    title: '交易号',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: 'ItemId',
    key: 'ItemId',
    width: 120
  }, {
    title: '数量',
    key: 'Quantity',
    width: 100
  }, {
    title: '交易金额',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.ReAmount} ${Params.row.Currency}`)
    }
  }]
  private TransitionDetailsCol5: PInterface.TableCol[] = [{
    title: 'LineNumber',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: '数量',
    width:100,
    key: 'Quantity'
  }, {
    title: '交易金额',
    key: 'PayAmount',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    key: 'PayAmount',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.ReAmount} ${Params.row.Currency}`)
    }
  }]
  private TransitionDetailsCol17: PInterface.TableCol[] = [{
    title: 'LineItems ID',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: '数量',
    width:100,
    key: 'Quantity'
  }, {
    title: '交易金额',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.ReAmount} ${Params.row.Currency}`)
    }
  }]

  private IssueItemsCol: PInterface.TableCol[] = [{
    title: '图片', width: 80, align: 'center',
    render: (h: any, Params: any): string => {
      return h('div', {
        class: 'P-List-Img',
        on: {
          click: () => { (this as any).$refs.BigPic.Trigger(`${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage}`) }
        },
        style: {
          backgroundImage: `url(${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage})`
        }
      })
    }
  }, {
    title: 'SKU编号',
    width: 130,
    key: 'SkuCode'
  }, {
    title: 'SKU名称',
    render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
      },Params.row.SkuName)
    }
  },{
    title: '购买数量',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', Params.row.Quantity || Params.row.BuyCount)
    }
  }, {
    title: '原因',
    width: 120,
    key: 'Reason'
  }, {
    title: '重发/问题数量',
    width: 120,
    key: 'IssueCount'
  }]

  private ResendItemsCol: PInterface.TableCol[] = [{
    title: '图片', width: 80, align: 'center',
    render: (h: any, Params: any): string => {
      return h('div', {
        class: 'P-List-Img',
        on: {
          click: () => { (this as any).$refs.BigPic.Trigger(`${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage}`) }
        },
        style: {
          backgroundImage: `url(${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage})`
        }
      })
    }
  }, {
    title: 'SKU编号',
    width: 130,
    key: 'SkuCode'
  }, {
    title: 'SKU名称',
    render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
      },Params.row.SkuName)
    }
  }, {
    title: '重发数量',
    width: 120,
    key: 'ReSendCount'
  }]

  private HistoryCol: PInterface.TableCol[] = [{
    title: '编号',
    key: 'Id',
    width: 80
  }, {
    title: '操作人',
    key: 'Operator',
    width: 120
  }, {
    title: '操作记录',
    render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.OperateLog
        },
        class: 'P-LINE-1'
      }, Params.row.OperateLog)
    }
  }, {
    title: '操作时间',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.OperateTime, true))
    }
  }]
}
</script>
<style lang="less" scoped>

</style>