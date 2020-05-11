<!--采购员绩效-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
        <DatePicker class="P-W-200" v-model="SearchForm.CurrentDate" type="date" placeholder="筛选日期"></DatePicker>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="采购员名称" class="P-W-300" v-model="SearchForm.PurchaserName" @on-enter="GetList">
					<Button slot="append" type="primary" @click="GetList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
    <Col span="24">
			<ExportPurchaserStatistics ref="ExportPurchaserStatistics" v-if="Powers.ExportPurchaserStatistics" />
    </Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
	name: 'PurchaserStatistics',
	components:{
		ExportPurchaserStatistics: () => import('@/components/Report/Purchase/ExportPurchaserStatistics.vue')
	}
})
export default class PurchaserStatistics extends Vue {
	private mounted() :void {
    this.GetPoints()
    this.$set(this.SearchForm, 'CurrentDate', new Date(new Date(new Date().toLocaleDateString()).getTime()));
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportPurchaserStatistics']))
    this.GetList()
  }

	//获取列表
  private GetList(): void{
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.CurrentDate = this.$UI["Render"].NewDate(SearchGroup.CurrentDate, true)
    
		this.$set(this, 'List', [])
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GetPurchaserPerformanceList,
				Login: true
			},
			Data: {Conditions: SearchGroup, PageIndex: 1, PageSize: 9999 },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this, 'List', Res.Data.PageModel.Items)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
	
	//重置
	private ResetList(): void{
    this.$set(this, 'SearchForm', new Interface.PurStatisticsSearch())
    this.$set(this.SearchForm, 'CurrentDate', new Date(new Date(new Date().toLocaleDateString()).getTime()))
		this.GetList();
	}
	
	//获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = this.Powers.ExportPurchaserStatistics ? 255 : 210;
		return (window.innerHeight - Flag);
	}
  
  private Powers: PInterface.Power = {} // 权限
	private SearchForm : Interface.PurStatisticsSearch = new Interface.PurStatisticsSearch()  //筛选数据
	private List: Interface.PurStatisticsList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '采购员', key: 'PurchaserName' },
		{ title: '负责SKU数量', key: 'SkuSaleQuantity' },
		{ title: '缺货数量', key: 'StockoutSkuQty' },
		{ title: '绩效金额', key: 'PerformanceAmt' },
	]
}

</script>
<style lang="less"></style>

