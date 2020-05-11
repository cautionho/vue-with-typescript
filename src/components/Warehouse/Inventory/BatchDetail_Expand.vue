<template>
  <Row>
    <Col span="24">
    <Table class="P-MT-10" size="small" :highlight-row="true" :columns="ItemCol" :data="ItemData" border stripe :height="ItemData.length > 5 ? 400 : 0"></Table>
    </Col>
    <TransferDemandDetail ref="TransferDemandDetail" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'BatchDetail_Expand',
  components: {
    TransferDemandDetail: () => import('@/components/Warehouse/Inventory/TransferDemandDetail.vue')
  }
})
export default class BatchDetail_Expand extends Vue {
  @Prop() Row: Interface.TransferPickBatchDetail
  @Prop() Data?: Interface.TransferPickBatchItem[]

  private created(): void{
    if(this.Data == undefined){
      this.GetItems();
    }
  }

  private GetItems(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferBatchBoxDetail,
				Login: true
			},
			Data: this.Row.TransferRequireCode,
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
					this.ItemData = Res.Data.Data;
				} else {
          this.$Request.Error(Res);
				}
			}
		})
  }

  private ShowBoxDetail(Idx: number): void{
    (this.$refs["TransferDemandDetail"] as any).TriggerModal(this.ItemData[Idx], true)
  }

  private ItemData: Interface.TransferPickBatchItem[] = []
  private ItemCol: PInterface.TableCol[] = [
    { title: '调拨箱号', key: 'TransferBoxCode', render: (h: any, Params: any): string => {
      return h('p', {
        class: "P-Pointer P-Text-Info",
        on: {
					click: () => {
						this.ShowBoxDetail(Params.index)
					}
				}
      }, Params.row.TransferBoxCode) 
    }},
    { title: '装箱数量', key: 'InBoxQuantity' },
    { title: '装箱人', key: 'InBoxUserName' },
    { title: '装箱时间', key: 'InBoxTime', render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.InBoxTime, true)) }
  ]
}
</script>