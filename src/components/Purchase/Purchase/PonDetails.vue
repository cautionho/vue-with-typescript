<template>
	<Row class="Container-Tabs">
		<Tabs name="PonDetail" type="card" :closable="false" :value="ActiveTab" @on-click="ChangeTabs">
			<TabPane label="基本信息" name="Base" tab="PonDetail">
				<PonBaseInfo :DetailInfoMsg="DetailInfoMsg" />
				<Form :label-width="100" ref="ReviewForm" :model="ReviewForm" v-if="CurrOperatPon">
					<FormItem label="更换采购员：" v-if="CurrOperatPon === 1">
            <Select placeholder="请选择采购员" :onChange="OnClearSelect.bind(this, 'Purchaser')" v-model="ReviewForm.Purchaser" :options="PurchaserList" transfer/>
						<!-- <Select placeholder="请选择采购员" filterable clearable @on-change="OnClearSelect('Purchaser')" v-model="ReviewForm.Purchaser">
							<Option v-for="(item,index) in PurchaserList" :value="item.Value" :key="index">{{ item.Key }}</Option>
						</Select> -->
					</FormItem>
					<FormItem label="备注：">
						<Input placeholder="请输入备注" type="textarea" v-model="ReviewForm.Remark" :autosize="{minRows:4,maxRows:4}" ></Input>
					</FormItem>
				</Form>
			</TabPane>
			<TabPane label="采购明细" name="Item" tab="PonDetail">
				<PurchaseItem :Data="DetailItemMsg"></PurchaseItem>
			</TabPane>
			<TabPane label="操作记录" name="History" tab="PonDetail">
				<Table class="P-MT-10" size="small" :highlight-row="true" :columns="PurchaseHistoryCol" :data="PurchaseHistoryData" border stripe height="400"></Table>
			</TabPane>
			<TabPane label="到货单记录" name="Arrival" tab="PonDetail" v-if="Controller">
				<Table class="P-MT-10" size="small" :highlight-row="true" :columns="PurchaseArrivalCol" :data="PurchaseArrivalData" border stripe height="400"></Table>
			</TabPane>
		</Tabs>  
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Purchase';
import PInterface from '@/assets/Interface/Public';
@Component({
  name: 'PonDetails',
  components: {
    PonBaseInfo: () => import('./PonBaseInfo.vue'),
    PurchaseItem: () => import('@/views/Purchase/Purchase/PurchaseOrder_Expand.vue')
  }
})
export default class PonDetails extends Vue {
	@Prop() DetailsModal: boolean
	@Prop() IsBatch: boolean
	@Prop() PonPurchaseOrd: string	//兼容采购单号打开请求数据参数
	@Prop() CurrOperatPon: number	//控制输入框显示隐藏(审核用)	1-采购主管审核 2-销售主管审核 3-总经理审核
	@Prop() PurchaserList: PInterface.KV[]	//采购员下拉
	@Prop() HideArrival: boolean	//隐藏到货单记录

  @Emit() EmitPurchase(R: boolean): void{
    
  }

  // @Watch('DetailsModal')
  // private TriggerChangeDetailModal(v: boolean):void{
  //   if(v){
	// 		this.Controller = !this.HideArrival
	// 		this.$set(this, 'ActiveTab', 'Base')
	// 		if(!this.PonPurchaseOrd){
	// 			this.SelecData = JSON.parse(JSON.stringify(this.SelectedData[0]))
	// 		}
	// 			console.log(this.PonPurchaseOrd)
	// 		if(!this.IsBatch){
	// 			this.GetDetailInfo()
	// 		}
	// 		if(this.CurrOperatPon){
	// 			this.$set(this, 'ReviewForm', new Interface.ReviewPostData())
	// 		}
  //   }
	// }

	private TriggerModal(SelectedData: Interface.PurchaseOrd[]): void{
		console.log(this.PonPurchaseOrd)
		this.Controller = !this.HideArrival
			this.$set(this, 'ActiveTab', 'Base')
			if(!this.PonPurchaseOrd){
				this.SelecData = JSON.parse(JSON.stringify(SelectedData[0]))
			}
			if(!this.IsBatch){
				this.GetDetailInfo()
			}
			if(this.CurrOperatPon){
				this.$set(this, 'ReviewForm', new Interface.ReviewPostData())
			}
	}
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(s: string):void{
    if( (this as any).ReviewForm[s] == undefined ){
      this.$set(this.ReviewForm, s, '');
    }
  }

  private ChangeTabs(val:string){
		this.ActiveTab = val;
    if(val === 'Item'){
      this.GetPurchaseItems()
    }else if(val === 'History'){
      this.GetHistoryItem()
    }else if(val === 'Arrival'){
      this.GetArrivalItem()
    }
  }

  private GetDetailInfo():void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderGetByCode,
				Login: true
			},
			Data: this.PonPurchaseOrd ? this.PonPurchaseOrd : this.SelecData.PurchaseCode,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.DetailInfoMsg = res.Data.Data;
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private GetPurchaseItems():void {
    this.$UI.Loading.Show();
		this.$set(this, 'DetailItemMsg', []);
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderGetItem,
				Login: true
			},
			Data: this.DetailInfoMsg.Id,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.DetailItemMsg.push(...res.Data.Data);
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private GetHistoryItem():void {
    this.$UI.Loading.Show();
		this.$set(this, 'PurchaseHistoryData', []);
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderHistory,
				Login: true
			},
			Data: this.DetailInfoMsg.PurchaseCode,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.PurchaseHistoryData.push(...res.Data.Data);
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private GetArrivalItem():void {
    this.$UI.Loading.Show();
		this.$set(this, 'PurchaseArrivalData', []);
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseArrivalOrder,
				Login: true
			},
			Data: {PurchaseOrderId: this.DetailInfoMsg.Id, PurchaseOrderItemId: 0},
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.PurchaseArrivalData.push(...res.Data.Data);
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

	private SelectedData: Interface.PurchaseOrd[] = []
	private Controller: boolean = false;
  private DetailInfoMsg: Interface.PurchaseDetail = new Interface.PurchaseDetail()  //基本信息
  private DetailItemMsg: Interface.PurchaseOrdItem[] = [] //采购明细数据
  private PurchaseHistoryData: Interface.PurchaseOpeHistory[] = []  //操作历史数据
  private PurchaseArrivalData:Interface.PurchaseOpeArrival[] = [] //到货单数据
  private SelecData: Interface.PurchaseOrd = new Interface.PurchaseOrd()  //当前选中数据
	private ActiveTab: string = 'Base'  //tab索引值
	
	/* 审核 */
	private ReviewForm:Interface.ReviewPostData = new Interface.ReviewPostData()	//审核提交数据
  private PurchaseHistoryCol: PInterface.TableCol[] = [
    { title: '编号', key: 'Id', width: 100},
    { title: '操作者', key: 'Operator', width: 120},
    { title: '操作记录', key: 'OperateLog', render: (h: any, params: any): string => {
			return h('div', [
				h('Tooltip', {
					props: {
						'content': params.row.OperateLog,
						'maxWidth': 500
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: 'P-LINE-1' }, params.row.OperateLog === "" ? '-' : params.row.OperateLog)
				])
			])
		} },
    { title: '操作时间', key: '', width: 160, render: (h: any, params: any): string => h('div', this.$UI.Render.Date(params.row.OperateTime, true)) },
  ]
  private PurchaseArrivalCol: PInterface.TableCol[] = [
    { title: '到货单号', key: 'OrderCode' },
    { title: 'SKU编号', key: 'SkuCode' },
    { title: '物流公司/快递单号', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '物'),
					h('span', { }, params.row.ExpressCompany)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '快'),
					h('span', { }, params.row.ExpressCode)
				]),
			])
    } },
    { title: '到货数量/已入库', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', {
        class: 'P-MT-5 P-MB-5'
      }, [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '到'),
					h('span', { }, params.row.ArrivalQuantity)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '已'),
					h('span', { }, params.row.InStorageQuantity)
				]),
			])
    } },
    { title: '异常数量/退货数量', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '异'),
					h('span', { }, params.row.NoPassQuantity)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '退'),
					h('span', { }, params.row.RefundQuantity)
				]),
			])
    } },
    { title: '状态', key: '', width: 160, render: (h: any, params: any): string => h('div', this.$Enums.Purchase.ArrivalStatus[params.row.Status]) },
    { title: '创建时间', key: '', width: 160, render: (h: any, params: any): string => h('div', this.$UI.Render.Date(params.row.CreateTime, true)) },
  ] 
}

</script>
<style lang="less"></style>
