<template>
	<Row class="P-Inline-Block">
    <Col span="24">
		<Modal title="查看相关订单" v-model="IsShowModal" :mask-closable="false" width="700" @on-cancel="HandleRes(false)">
			<Button @click="SetOutStock" type="primary" class="P-MB-10">设置订单缺货</Button>
			<Table :columns="TbCol" :data="TbData" size="small" stripe height="300"></Table>
			<footer slot="footer" class="P-TA-R"> </footer>
		</Modal>
		<ShipOrderDetails ref="ShipOrderDetails" @emit-operate-success="EmitOperateSuccess"></ShipOrderDetails>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
	name: 'OutStockOrder',
	components: {
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
  }
})
export default class OutStockOrder extends Vue {
  @Emit() HandleRes(B: boolean): void{
    this.IsShowModal = false;
    this.TbData = [];
  }

  private TriggerModal(Id: number): void{
    this.CurrId = Id;
    this.GetOutStockOrder();
    this.IsShowModal = true;
  }

  private GetOutStockOrder():void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.CheckOutGetOutStockOrder,
				Login: true
			},
			Data: this.CurrId,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.TbData = Res.Data.Data;
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private SetOutStock(): void{
    if(this.TbData.length < 1){
      this.$UI.Tips.Floating('warning', `没有相关订单，无法进行操作。请检查！`);
      return;
    }
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否将所有订单都设置为缺货？`,
      Callback: (Res: boolean):void => {
        if (Res) {
          this.ChangeOrderStatus();
        }
      }
    })
  }

  private ChangeOrderStatus(): void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.ShipOrderChangeStatus,
				Login: true
			},
			Data: {OrderId: this.TbData.map((Item) => Item.OrderId), TargetStatus: 7, Remark: ''},
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.CheckOutDemandStatus()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private CheckOutDemandStatus():void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.CheckOutDemandSetStatus,
				Login: true
			},
			Data: { Status: 2, Id: this.CurrId },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `设置订单缺货成功`);
          this.HandleRes(true)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}
	
	private EmitOperateSuccess(): void{
		console.log(123)
	}

  private TbData: Interface.ChecktDemandDetail[] = []; 
  private CurrId: number = 0;
  private IsShowModal: boolean = false;
  private TbCol: PInterface.TableCol[] = [
    { title: '发货单号', key: 'OrderCode', render: (h: any, Params: any): string => {
			return h('p',{
				class: "P-Pointer P-Text-Info",
				on: {
					click: () => {
						(this as any).$refs.ShipOrderDetails.Validate({ OrderId: Params.row.OrderId, OrderCode: "" });
					}
				}
			}, Params.row.OrderCode)
		} },
    { title: '状态', key: 'Status', render: (h: any, Params: any): string => h('span', this.$Utils.GetEnumArr(this.$Enums.Warehouse.ShipOrderStatus)[Params.row.Status-1]) },
    { title: '下单时间', key: 'PlatOrderTime', render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.PlatOrderTime, true)) },
  ]
}

</script>
<style lang="less"></style>
