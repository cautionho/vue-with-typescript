<template>
  <Col>
    <Modal v-model="IsShowModal" :title="Type === 1 ? '付款单详情' : '退款单详情'" @on-cancel="ClearModal(false)" :mask-closable="false" :width="880">
      <Form onsubmit="return false" :label-width="100" inline>
        <Form-item :label="Type === 1 ? '付款单号：' : '退款单号：'" class="P-W-400">
          <span>{{ Type === 1 ? FormMsg.PayCode : FormMsg.RefundCode }}</span>
        </Form-item>
        <Form-item label="来源单据：" class="P-W-400">
          <span>{{ FormMsg.SourceCode }}</span>
        </Form-item>
        <Form-item label="货品金额：" class="P-W-400">
          <span>{{ FormMsg.GoodsAmount }} CNY</span>
        </Form-item>
        <Form-item label="运费：" class="P-W-400">
          <span>{{ FormMsg.ShippingAmount }} CNY</span>
        </Form-item>
        <Form-item label="总金额：" class="P-W-400">
          <span>{{ FormMsg.GoodsAmount+ FormMsg.ShippingAmount}} CNY</span>
        </Form-item>
        <Form-item label="状态：" class="P-W-400">
          <span>{{ FormMsg.Status === 0 ? "-" : StatusDrop.find( Item => Item.Value === FormMsg.Status).Key }}</span>
        </Form-item>
        <Form-item label="创建人：" class="P-W-400">
          <span>{{ FormMsg.CreatorName }}</span>
        </Form-item>
        <Form-item label="经办人：" class="P-W-400">
          <span>{{ FormMsg.OperatorName }}</span>
        </Form-item>
        <Form-item label="创建时间：" class="P-W-400">
          <span>{{ $UI.Render.Date(FormMsg.CreateTime, true) }}</span>
        </Form-item>
        <Form-item label="最后更新时间：" class="P-W-400">
          <span>{{ $UI.Render.Date(FormMsg.OperateTime, true) }}</span>
        </Form-item>
        <Form-item label="平台单号：" class="P-W-100-Percent">
          <a v-if="FormMsg.PlatformOrderId !== ''" :href="'https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + FormMsg.PlatformOrderId" target="_blank">{{FormMsg.PlatformOrderId}}</a>
          <span v-else>-</span>
        </Form-item>
        <Form-item label="备注：" class="P-W-100-Percent">
          <span>{{ FormMsg.Remark === "" ? '-' : FormMsg.Remark }}</span>
        </Form-item>
      </Form>
      <Table class="P-MT-10" size="small" :highlight-row="true" :columns="HistoryCol" :data="HistoryData" border stripe height="250"></Table>
      <div slot="footer">
        <Button @click="ClearModal">返回</Button>
      </div>
    </Modal>
  </Col>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/Finance"

  @Component({
    name: "ViewTransactions"
  })
  export default class ViewTransactions extends Vue {
    private ClearModal(): void {
      this.IsShowModal = false;
      this.FormMsg = new Interface.ApplyFinanceList();
      this.HistoryData = []
    }

    private TriggerModal(Select: Interface.ApplyFinanceList, T:number): void{
      this.$set(this, 'FormMsg', Select)
      this.$set(this, 'Type', T)
      this.GetDetailLog()
      this.IsShowModal = true;
    }

    private GetDetailLog(): void{
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Finance,
        Api: {
          Address: this.$Api.PayOrderGetOrderLog,
          Login: true
        },
        Data: this.Type === 1 ? this.FormMsg.PayCode : this.FormMsg.RefundCode,
        Callback: (Res: PInterface.Res): void => {
          if(Res.IsSuccess){
            this.HistoryData = Res.Data.Data;
          }else{
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private Type: number = 0;
    private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.MaterielApplyStatus)
    private FormMsg: Interface.ApplyFinanceList = new Interface.ApplyFinanceList()
    private IsShowModal: boolean = false
    private HistoryData: Interface.LogData[] = []  //操作历史数据
    private HistoryCol: PInterface.TableCol[] = [
    { title: '编号', key: 'Id', width: 90},
    { title: '操作者', key: 'Operator', width: 120},
    { title: '操作时间', key: '', width: 160, render: (h: any, params: any): string => h('div', this.$UI.Render.Date(params.row.OperateTime, true)) },
    { title: '备注', key: 'OperateLog', render: (h: any, params: any): string => {
			return params.row.OperateLog === "" ? h('span', '-') : h('div', [
				h('Tooltip', {
					props: {
						'content': params.row.OperateLog,
						'maxWidth': 500
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: 'P-LINE-1' }, params.row.OperateLog)
				])
			])
		} }
  ]
  }

</script>
<style lang="less"></style>
