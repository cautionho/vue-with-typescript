<template>
	<div>
	<Modal title="调拨拣货批次详情" v-model="isOpen" :mask-closable="false" width="1000" @on-cancel="closeModal">
		<Table :columns="col" size="small" :highlight-row="true" :height="400" :data="detail" stripe></Table>
		<div slot="footer">
			<Button type="default" style="margin-left: 8px" @click="closeModal">返回</Button>
		</div>
	</Modal>
	<TransferDemandDetail ref="TransferDemandDetail" />
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
import ExpandRow from './BatchDetail_Expand.vue';
@Component({
	name: 'TransferPickBatchDetail',
	components: {
		TransferDemandDetail: () => import('@/components/Warehouse/Inventory/TransferDemandDetail.vue')
	}
})
export default class TransferPickBatchDetail extends Vue {
	private closeModal(): void{
    this.isOpen = false;
	}

	private TriggerModal(SelectData:Interface.TransferPickBatchList): void{
		this.GetDetail(SelectData.TransferBatchCode);
		this.isOpen = true
	}

	private GetDetail(TransferBatchCode: string){
		this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferBatchDetail,
				Login: true
			},
			Data: TransferBatchCode,
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
					this.detail = Res.Data.Data;
				} else {
          this.$Request.Error(Res);
				}
			}
		})
	}

	private ShowTransferDemandDetail(Idx: number): void{
		(this.$refs["TransferDemandDetail"] as any).TriggerModal(this.detail[Idx])
	}
	
	private detail: Interface.TransferPickBatchDetail[] = [];	//详情列表数据
	private isOpen: boolean = false
	private col: PInterface.TableCol[] = [
		{ type: 'expand', width: 40, align: 'center', render: (h: any, params: any): string => {
				return h(ExpandRow, {
					props: {
						row: params.row
					}
				})
			}
		},
		{ title: '调拨需求', key: 'TransferRequireCode', render: (h: any, Params: any): string => {
			return h('p', {
        class: "P-Pointer P-Text-Info",
        on: {
					click: () => {
						this.ShowTransferDemandDetail(Params.index)
					}
				}
      }, Params.row.TransferRequireCode)
		} },
		{ title: 'sku编号', key: 'SkuCode' },
		{ title: '产品名', key: 'SkuName', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
      }, Params.row.SkuName)
    } },
		{ title: '货架号', key: 'LocationCode' },
		{ title: '需求数', key: 'RequireQuantity' },
		{ title: '已拣数', key: 'PickedQuantity' },
		{ title: '装箱数', key: 'InBoxQuantity' }
	]
}

</script>
<style lang="less"></style>
