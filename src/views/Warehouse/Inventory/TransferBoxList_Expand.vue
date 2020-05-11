<!-- 调拨箱列表 -->
<template>
  <Row>
    <Col span="24">
    <Table class="P-MT-10" size="small" :highlight-row="true" :columns="ItemCol" :data="ItemData" border stripe :height="ItemData.length > 5 ? 400 : 0"></Table>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'TransferBoxList_Expand',
})
export default class TransferBoxList_Expand extends Vue {
  @Prop() Row: Interface.TransferBoxList
  @Prop() Data?: Interface.TransferInBoxItem[]

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
				Address: this.$Api.TransferInBoxSkuDetail,
				Login: true
			},
			Data: this.Row.Id,
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

  private ItemData: Interface.TransferInBoxItem[] = []
  private ItemCol: PInterface.TableCol[] = [
    { title: 'SKU编号', key: 'SkuCode' },
    { title: '产品名', key: 'SkuName' },
    { title: '调拨数量', key: 'TransferInQty' },
    { title: '实际入库数量', key: 'ActualInQty' }
  ]
}
</script>