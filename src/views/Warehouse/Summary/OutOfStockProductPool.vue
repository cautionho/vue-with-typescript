<!--销售 - 缺货产品汇总-->
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
					<Col span="24" slot="list" class="P-P-10">
					<Select class="P-W-200 P-ML-10" placeholder="筛选平台" v-model="SearchForm.Platform" :options="PlatformDrop" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选仓库" v-model="SearchForm.ShipWarehouseId" :options="WarehouseDrop" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Stauts" :options="StatusDrop" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选采购员" v-model="SearchForm.PurchaserId" :options="PurchaserDrop" />
          <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选平台" v-model="SearchForm.Platform" filterable clearable>
            <Option v-for="(Item,Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="$Enums.Sales.Platform[Item]">{{ Item }}</Option>
          </Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" @on-change="OnClearSelect('ShipWarehouseId')" v-model="SearchForm.ShipWarehouseId" filterable clearable>
						<Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select>
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('Stauts')" v-model="SearchForm.Stauts" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.SkuStatus[Item]" :key="Index">{{Item}}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选采购员" @on-change="OnClearSelect('PurchaserId')" v-model="SearchForm.PurchaserId" filterable clearable>
            <Option v-for="(Item,Index) in PurchaserDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
					<Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Purchase.ProposalType[Item]" :key="Index">{{Item}}</Option>
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
			<Button type="primary" v-if="Powers.ExportOosSku" class="P-MR-10 P-MB-10" @click="NPostExport">导出缺货产品</Button>
		</Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="ProductPoolTb"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <ShowBigPic ref="ShowBigPic" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'OutOfStockProductPool',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
  }
})
export default class OutOfStockProductPool extends Vue {
	private mounted() :void {
    this.GetWarehouseDropList()
    this.GetPurchaserList()
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportOosSku']))
    this.$set(this.SearchForm, 'ShipWarehouseId', 50)
    this.GetList();
  }
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  //获取采购员下拉
  private GetPurchaserList(){
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetUserDropList,
				Login: false
			},
			Data: "采购员",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.PurchaserDrop = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
        }
			}
		})
  }

  //仓库下拉
  private GetWarehouseDropList(){
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.GetWarehouseDropList,
				Login: false
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.WarehouseDrop = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
        }
			}
		})
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	//获取列表
  private GetList(): void{
		this.$set(this, 'List', [])
		let PostData = JSON.parse(JSON.stringify(this.SearchForm))
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.StatisticsOutOfStockSkus,
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
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.OOSProductPoolSearch())
    this.$set(this.SearchForm, 'ShipWarehouseId', 50)
		this.GetList();
	}
	
	//切换列表条数
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
	}
	
	//切换列表页码
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex',N);
		this.GetList();
	}
	
	//获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }

  //导出
  private NPostExport(): void{
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认执行导出缺货产品操作',
      Callback: (B: boolean): void => {
        if(B){
          this.PostExport()
        }
      }
    })
  }

  private PostExport(): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.OutOfStockSkusExport,
				Login: false
			},
			Data: JSON.parse(JSON.stringify(this.SearchForm)),
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
					this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出缺货产品汇总任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
            Callback: (B:boolean):void =>{}
          })
				} else {
					this.$Request.Error(Res);
        }
			}
		})
  }
  
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); //状态下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ProposalType);  //关键词下拉
  private PlatformDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform)
  private WarehouseDrop: PInterface.KV[] = []; //目标仓下拉
  private PurchaserDrop: PInterface.KV[] = []; //采购员下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private Powers: PInterface.Power = {}; // 权限
	private SearchForm : Interface.OOSProductPoolSearch = new Interface.OOSProductPoolSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private List: Interface.OOSProductPoolList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '图片', key: 'DefaultImage', width: 80, render: (h, Params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + Params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.DefaultImage)
            }
          }
        })
      }
    },
		{ title: 'SKU编号/产品名', render: (h: any, Params: any): string => {
      return h('div', { class: "P-MT-5 P-MB-5" }, [
        h('p', Params.row.SkuCode === "" ? '-' : Params.row.SkuCode),
				h('Tooltip', {
					props: {
						'content': Params.row.SkuName,
						'maxWidth': 300
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, Params.row.SkuName === "" ? '-' : Params.row.SkuName)
				])
			])
    } },
		{ title: '仓库', key: 'WarehouseName' },
		{ title: '在途库存', key: 'PurchasingQuantity' },
		{ title: '缺货数量', key: 'OutOfStockQuantity' },
		{ title: '采购员', key: 'PurchaserName', render: (h: any, Params: any): string => h('p', Params.row.PurchaserName === "" ? '-' : Params.row.PurchaserName) },
    { title: '状态', key: 'SkuStatus', width: 120, render: (h: any, Params: any): string => {
			  return h('Tag', {
          props: { color: Params.row.SkuStatus == 3 ? 'success' : Params.row.SkuStatus == 6 ? 'error' : 'primary' }
        }, this.$Enums.Warehouse.SkuStatus[Params.row.SkuStatus] )
      }
    }   
	]
}

</script>
<style lang="less"></style>
