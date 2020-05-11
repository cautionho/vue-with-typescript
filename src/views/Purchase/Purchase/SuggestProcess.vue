<template>
	<Row>
		<Col span="24">
			<Row class="P-Search-Group">
				<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
					<Dropdown trigger="custom" :visible="AccurateSearch">
						<Button type="primary" @click="TriggerSearch">
							精准搜索
							<Icon type="ios-arrow-down"></Icon>
						</Button>
						<Col span="24" slot="list" class="P-PL-10 P-PB-10 P-PR-10">
            <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
            <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="采购员" v-model="SearchForm.Purchaser" :options="DropPurchaserList" />
            <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="完成情况" v-model="SearchForm.IsComplete" :options="ProcessCompleteDrop" />
							<!-- <Select class="P-W-200 P-ML-10 P-MT-10" placeholder="仓库" @on-change="OnClearSelect('WarehouseId')" v-model="SearchForm.WarehouseId" filterable clearable>
								<Option v-for="(item,index) in DropWarehouseList" :value="item.Value" :key="index">{{ item.Key }}</Option>
							</Select>
							<Select class="P-W-200 P-ML-10 P-MT-10" placeholder="采购员" @on-change="OnClearSelect('Purchaser')" v-model="SearchForm.Purchaser" filterable clearable>
								<Option v-for="(item,index) in DropPurchaserList" :value="item.Value" :key="index">{{ item.Key }}</Option>
							</Select>
							<Select class="P-W-200 P-ML-10 P-MT-10" placeholder="完成情况" @on-change="OnClearSelect('IsComplete')" v-model="SearchForm.IsComplete" filterable clearable>
								<Option v-for="(item,index) in ProcessCompleteDrop" :value="$Enums.Purchase.ProcessComplete[item]" :key="index">{{ item }}</Option>
							</Select> -->
						</Col>
					</Dropdown>
					<FormItem class="P-MB-10 P-ML-10">
						<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
            <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchType" :options="SearchKeyTypeDrop" />
							<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchType')" v-model="SearchForm.SearchType" filterable clearable>
								<Option v-for="(item,index) in SearchKeyTypeDrop" :value="$Enums.Purchase.SuggestSearchType[item]" :key="index">{{item}}</Option>
							</Select> -->
							<Button slot="append" type="primary" @click="SearchList">搜索</Button>
						</Input>
					</FormItem>
					<FormItem class="P-ML-10 P-MB-10">
						<Button type="warning" @click="ResetList">重置</Button>
					</FormItem>
				</Form>
			</Row>
		</Col>
		<Col span="24">
			<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
			<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
		<!-- 放大图片 -->
    <ShowBigPic :ShowBigPic="ShowBigPicModal" :BigPicSrc="BigPicSrc" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
	name: 'SuggestProcess',
	components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
	}
})
export default class SuggestProcess extends Vue {
	private mounted() :void {
		this.GetPoints()
  }

  //获取权限
  private async GetPoints(): Promise<void> {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ViewSuggestProcess']))
    this.$set(this, 'DropWarehouseList', await this.GetDropList<boolean, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true ))
    this.$set(this, 'DropPurchaserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '采购员' ))
    this.GetList();
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(s: string):void{
    if( (this as any).SearchForm[s] == undefined ){
      this.$set(this.SearchForm, s, '');
    }
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	 // 获取 仓库 / 采购员 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (!Res.IsSuccess) this.$Request.Error(Res);
          resolve( Res.Data.DropList || [] )
		  	}
	  	})
    })
  }

	//获取列表
  private GetList(): void{
		this.$set(this, 'AccurateSearch', false);
    
		this.$set(this, 'List', [])
		let PostData = JSON.parse(JSON.stringify(this.SearchForm));
		PostData.IsComplete = PostData.IsComplete === 1 ? true : PostData.IsComplete === 0 ? false : "";
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GeSuggestProcess,
				Login: true
			},
			Data: { Conditions: PostData, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
          this.$set(this, 'List', Res.Data.PageModel.Items)
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
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.SuggestProcessSearch())
		this.GetList();
	}
	
	//切换列表条数
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}
	
	//切换列表页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
	}
	
	//获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		return (window.innerHeight - Flag);
	}
	// 打开大图
  private ShowPic(Url: string): void {
    this.ShowBigPicModal = true;
    this.BigPicSrc = Url;
  }

  private DropPurchaserList: PInterface.KV[] = [] //采购员下拉
  private DropWarehouseList: PInterface.KV[] = [];	//仓库数据
  private ProcessCompleteDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ProcessComplete); // 完成情况
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.SuggestSearchType);  //关键字下拉

	private ShowBigPicModal: boolean = false;  // 控制大图Modal
	private BigPicSrc: string = ""; // 控制大图Url
	
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
  private Powers: PInterface.Power = {}; // 权限
	private SearchForm : Interface.SuggestProcessSearch = new Interface.SuggestProcessSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private List: Interface.SuggestProcessList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + params.row.SkuImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.SkuImage)
            }
          }
        })
      }
    },
		{ title: 'SKU编号', key: 'SkuCode', width: 160 },
		{ title: '产品名', key: 'SkuName', width: 300 },
		{ title: '仓库', key: 'WareHouseName' },
		{ title: '采购员', key: 'PurchaserName' },
		{ title: '采购建议数', key: 'SuggestQty' },
		{ title: '今日下单数', key: 'TodayBookOrderQty', width: 160 }
  ]
}

</script>
<style lang="less">
</style>
