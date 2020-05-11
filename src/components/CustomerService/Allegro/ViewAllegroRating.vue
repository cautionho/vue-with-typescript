<template>
  <Col>
    <Modal v-model="IsShowModal" title="评价详情" @on-cancel="ClearModal(false)" :mask-closable="false" :width="680">
      <Tabs type="card" name="ViewAllegroRating" :value="CurrentPane" @on-click="ChangePane">
        <TabPane label="基本信息" name="Info" tab="ViewAllegroRating">
          <Form onsubmit="return false" :label-width="80" inline>
            <Form-item label="发货单号：" class="P-W-300">
              <span>{{ FormMsg.ShipOrderCode }}</span>
            </Form-item>
            <Form-item label="店铺：" class="P-W-300">
              <span>{{ FormMsg.StoreName }}</span>
            </Form-item>
            <Form-item label="买家ID：" class="P-W-300">
              <span>{{ FormMsg.BuyerId }}</span>
            </Form-item>
            <Form-item label="评价时间：" class="P-W-300">
              <span>{{ $UI.Render.Date(FormMsg.EvaluateTime, true) }}</span>
            </Form-item>
            <Form-item label="评价类型：" class="P-W-300">
              <span>{{ FormMsg.EvaluateType === "" ? "" : TypeDrop.find( Item => Item.Value === (FormMsg.EvaluateType ? 1 : 0)).Key }}</span>
            </Form-item>
            <Form-item label="是否回复：" class="P-W-300">
              <span>{{ FormMsg.IsReply ? '是' : '否'}}</span>
            </Form-item>
            <Form-item label="状态：" class="P-W-100-Percent">
              <span>{{ FormMsg.State  === "" ? "" : StateDrop.find( Item => Item.Value === FormMsg.State ).Key }}</span>
            </Form-item>
            <Form-item label="评价内容：" class="P-W-100-Percent">
              <span>{{ FormMsg.EvaluateContent === "" ? '-' : FormMsg.EvaluateContent }}</span>
            </Form-item>
          </Form>
        </TabPane>
        <TabPane label="操作记录" name="History" tab="ViewAllegroRating">
          <Table class="P-MT-10" size="small" :highlight-row="true" :columns="HistoryCol" :data="HistoryData" border stripe height="300"></Table>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button @click="ClearModal">返回</Button>
      </div>
    </Modal>
  </Col>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/CustomerService"

  @Component({
    name: "ViewAllegroRating"
  })
  export default class ViewAllegroRating extends Vue {
    private ClearModal(): void {
      this.IsShowModal = false;
      this.FormMsg = new Interface.AllegroRatingList();
      this.HistoryData = []
      this.CurrentPane = 'Info';
    }

    private TriggerModal(Select: Interface.AllegroRatingList): void{
      this.CurrId = Select.Id
      this.GetDetail()
      this.IsShowModal = true;
    }

    private ChangePane(Val: string) {
      this.CurrentPane = Val;
      if(Val === 'History' && this.HistoryData.length < 1){
        this.GetHistory()
      }
    }

    private GetDetail(): void{
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.CustomerService,
        Api: {
          Address: this.$Api.AllegroRatingsDetail,
          Login: true
        },
        Data: this.CurrId,
        Callback: (Res: PInterface.Res): void => {
          if(Res.IsSuccess){
            this.FormMsg = Res.Data.Data;
          }else{
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private GetHistory(): void{
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.CustomerService,
        Api: {
          Address: this.$Api.AllegroRatingsHistory,
          Login: true
        },
        Data: this.CurrId,
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

    private CurrId: number = 0
    private FormMsg: Interface.AllegroRatingList = new Interface.AllegroRatingList()
    private CurrentPane:string = 'Info' //当前标签页
    private IsShowModal: boolean = false
    private StateDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AllegroRatingState)
    private TypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AllegroRatingType)
    private HistoryData: Interface.AllegroRatingHistory[] = []  //操作历史数据
    private HistoryCol: PInterface.TableCol[] = [
    { title: '编号', key: 'Id', width: 90},
    { title: '操作者', key: 'OperateUserName', width: 120},
    { title: '操作时间', key: '', width: 160, render: (h: any, params: any): string => h('div', this.$UI.Render.Date(params.row.OperateTime, true)) },
    { title: '操作记录', key: 'OperateContent', render: (h: any, params: any): string => {
			return h('div', [
				h('Tooltip', {
					props: {
						'content': params.row.OperateContent,
						'maxWidth': 500
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: 'P-LINE-1' }, params.row.OperateContent === "" ? '-' : params.row.OperateContent)
				])
			])
		} }
  ]
  }

</script>
<style lang="less"></style>
