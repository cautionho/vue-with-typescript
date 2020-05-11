<template>
	<Row>
		<Col span="24">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<FormItem class="P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Col>
		<Col span="24">
			<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Setting';
@Component({
	name: 'StateControl'
})

export default class StateControl extends Vue {
	private mounted() {
		this.ResetList();
	}

	//获取列表数据
	private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.GetCountryPageData,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: this.SearchForm },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
					this.$set(this, 'List', Res.Data.PageModel.Items);
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}
	
	//搜索
	private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', { PageIndex: 1, PageSize: 20, TotalItems: 0 });
		this.$set(this, 'SearchForm', { SearchKey: "" })
		this.GetList();
	}

	//切换列表条数
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}

	//切换页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
	}

	//获取列表高度
	private CalculateTbHeight(): number {
		return window.innerHeight - 210;
	}	
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private SearchForm: Interface.StateSearch = new Interface.StateSearch()
	private List: Interface.CountriesCode[] = []
	private Cols: PInterface.TableCol[] = [
		{ title: '国家名称（英）', key: 'CountryName' },
		{ title: '国家名称（中）', key: 'CountryNameCn' },
		{ title: '国家简码', key: 'CountryCode' }
	]
}

</script>
<style>
</style>
