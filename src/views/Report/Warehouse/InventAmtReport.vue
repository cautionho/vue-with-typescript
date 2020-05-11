<!--库存金额统计报表-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
        <Select class="P-W-200 P-MB-10" placeholder="筛选仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
        <!-- <Select class="P-W-200 P-MB-10" placeholder="筛选仓库" @on-change="OnClearSelect('WarehouseId')" v-model="SearchForm.WarehouseId" filterable clearable>
          <Option v-for="Item in DropWarehouseList" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
        </Select> -->
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
           <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.InventoryManageType[Item]" :key="Index">{{Item}}</Option>
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
      <Button type="primary" @click="GetList(1)" class="P-MB-10 P-MR-10 P-Inline-Block" v-if="Powers.ExportAmtList">导出数据</Button>
      <span class="P-MB-10 P-Float-Right P-Text-Info P-FW-Bold" style="font-size: 18px;">当前库存总金额为 {{ TotalAmout }} 元</span>
    </Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
    <Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <ShowBigPic ref="ShowBigPic" />
    <SkuDetail ref="SkuDetail" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
	name: 'InventAmtReport',
	components:{
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue')
	}
})
export default class InventAmtReport extends Vue {
	private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportAmtList']))
    this.$set(this.SearchForm, 'WarehouseId', 50);
    this.GetWarehouseList()
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  //仓库下拉
  private GetWarehouseList(){
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.DropWarehouseList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
        this.GetList();
      }
    })
  }

  private SearchList():void{
    this.$set(this.Pager, 'PageIndex', 1);
    this.GetList();
  }

	//获取列表
  private GetList(N?:number): void{
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.SearchKeyType = SearchGroup.SearchKeyType === "" ? 0 : Number(SearchGroup.SearchKeyType)
    if(!N){
      this.$set(this, 'List', [])
    }
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: N === 1 ? this.$Api.ExportInventoryAmount : this.$Api.GetInventoryAmountList,
				Login: true
      },
			Data: N ? SearchGroup : { Conditions: SearchGroup, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if(N){
            this.$UI.Tips.Modal({
              Type: 'success',
              Content: `创建导出库存金额统计报表任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
              Callback: (Res: boolean):void => { 
              }
            });
          }else{
            this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
            this.List.push(...Res.Data.PageModel.Items[0].Item)
            this.TotalAmout = Res.Data.PageModel.Items[0].TotalAmount
          }
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
	
	//重置
	private ResetList(): void{
    this.$set(this, 'SearchForm', new Interface.InventAmtReportSearch());
    this.$set(this.SearchForm, 'WarehouseId', 50);
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
		return (window.innerHeight - 210);
  }

  // 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.ShowBigPic.Trigger(Url);
	}
  
  private TotalAmout: number = 0; //总金额
  private Powers: PInterface.Power = {} // 权限
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private SearchForm : Interface.InventAmtReportSearch = new Interface.InventAmtReportSearch()  //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.InventoryManageType);  //关键词下拉
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.InventAmtReportList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '图片', key: 'Image', width: 80, align: 'center', render: (h, Params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + Params.row.Image + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.Image)
            }
          }
        })
      }
    },
    { title: 'SKU编号/SKU名称', width: 200, render: (h: any, Params: any): string => {
      return h('div', { class: "P-MT-5 P-MB-5" }, [
        h('p', {
					class: 'P-Pointer',
					on: {
						click: ()=> {
							(this.$refs['SkuDetail'] as any).Trigger(Params.row.SkuCode);
						}
					}
				}, Params.row.SkuCode === "" ? '-' : Params.row.SkuCode),
        h('Tooltip', {
					props: {
						'content': Params.row.SkuName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, Params.row.SkuName === "" ? '-' : Params.row.SkuName)
				])
			])
    }},
    { title: '仓库', width: 150, key: 'WarehouseName' },
    { title: '货架号', key: 'LocationCode' },
    { title: '可用库存', key: 'Quantity' },
    { title: '在途库存', key: 'PurchasingQuantity' },
    { title: '调拨中库存', key: 'ShippingQuantity' },
    { title: '待拣货库存', key: 'WaitPickQuantity' },
    { title: '待发货库存', key: 'WaitingShipedQuantity' },
    { title: '平均采购价(CNY)', width: 150, key: 'AvgPrice' },
    { title: '库存金额(CNY)', width: 150, key: 'Amount' }
	]
}

</script>
<style lang="less"></style>

