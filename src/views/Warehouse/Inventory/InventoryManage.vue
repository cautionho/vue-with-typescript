<!-- 库存管理 -->
<template>
  <Row class="InventoryManage">
    <Col span="24">
      <Form :ref="'SearchForm'" :model="SearchForm" inline onsubmit="return false">
        <FormItem class="P-MB-10">
          <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
          <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" @on-change="OnClearSelect('WarehouseId')" v-model="SearchForm.WarehouseId" filterable clearable>
						<Option v-for="(Item, Index) in DropWarehouseList" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select> -->
        </FormItem>
        <FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词"  v-model="SearchForm.SearchKeyType" :options="DropSearchType" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchKeyType')" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(Item,Index) in DropSearchType" :value="$Enums.Warehouse.InventoryManageType[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
        <FormItem class="P-ML-10 P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
    </Col>
    <Col span="24" class="P-MB-10">
      <PrintShelvesBarcode ref="PrintShelvesBarcode" />
      <PrintSkuLabel ref="PrintSkuLabel" :WarehouseList="DropWarehouseList"/>
      <BatchPrintSkuLabel ref="BatchPrintSkuLabel" @change-modal="OpenBatchPrintModal"/>
      <ExportInventory v-if="Powers.ExportInventory" :WarehouseDropList="DropWarehouseList" ref="ExportInventory"/>
      <InventorySku ref="InventorySku" :WarehouseList="DropWarehouseList" @change-modal="HandleRes"/>
    </Col>
    <Col span="24" class="P-MB-10">
      <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="InventoryTable"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>
    <ShowBigPic ref="ShowBigPic"/>
	</Row>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: "InventoryManage",
	components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    PrintShelvesBarcode: () => import('@/components/Warehouse/Inventory/PrintShelvesBarcode.vue'),
    PrintSkuLabel: () => import('@/components/Warehouse/Inventory/PrintSkuLabel.vue'),
    BatchPrintSkuLabel: () => import('@/components/Warehouse/Inventory/BatchPrintSkuLabel.vue'),
    ExportInventory: () => import('@/components/Warehouse/Inventory/ExportInventory.vue'),
    InventorySku: () => import('@/components/Warehouse/Inventory/InventorySku.vue')
	}
})
export default class InventoryManage extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportInventory']))
    this.GetWarehouseList()
  }

  //仓库下拉
  private GetWarehouseList(){
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.DropWarehouseList = Res.Data.DropList;
          this.GetList()
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(s: string):void{
    if( (this as any).SearchForm[s] == undefined ){
      this.$set(this.SearchForm, s, '');
    }
  }

  //获取列表
  private GetList(): void{
    this.CancelSelect();
    this.$set(this, 'List', [])
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.InventoryGetList,
				Login: true
			},
			Data: { Conditions: this.SearchForm, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
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

  //获取列表复选框选中的数据
  private GetSelected(data: Interface.InventoryManageList[] ): void{
    this.$set(this, 'Selected', data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["InventoryTable"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	//搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.InventoryManageSearch())
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
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['ExportInventory'].includes(Item)){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }	

  // 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.ShowBigPic.Trigger(Url);
  }
  
  
  private HandleRes(Val: boolean){
    if(Val){
      this.GetList();
    }
  }

  //批量打印回调操作
  private OpenBatchPrintModal(IsOpen: boolean): void{
    if(IsOpen){
      (this as any).$refs.BatchPrintSkuLabel.TriggerModal(this.Selected);
    }
  }
  
  private Powers: PInterface.Power = {}; // 权限
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private DropSearchType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.InventoryManageType);  //关键词下拉
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.InventoryManageSearch = new Interface.InventoryManageSearch(); //搜索数据
  private List: Interface.InventoryManageList[] = []; //列表数据
  private Selected: Interface.InventoryManageList[] = []; //列表选中数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '图片', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.DefaultImage)
            }
          }
        })
      }
    },
    { title: 'SKU编号/产品名', width: 140, render: (h: any, params: any): string => {
			return h('div', [
        h('p', params.row.SkuCode),
				h('Tooltip', {
					props: {
						'content': params.row.SkuName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: ' P-LINE-1' }, params.row.SkuName)
				])
      ])
		}  },
    { title: '最新采购价', key: 'PurchasePrice' },
    { title: '仓库', key: 'WarehouseName' },
    { title: '货架号', render: (h: any, params: any): string => h('span', params.row.LocationCode === "" ? '-' : params.row.LocationCode) },
    { title: '可用库存', key: 'Quantity' },
    { title: '在途库存', key: 'PurchasingQuantity' },
    { title: '调拨中库存', key: 'ShippingQuantity' },
    { title: '待拣货库存', key: 'WaitPickQuantity' },
    { title: '等待发货库存', key: 'WaitingShipedQuantity' },
    { title: '操作人', key: 'LastOperator' },
    { title: '操作时间', width: 160, render: (h: any, params: any): string => h('span', this.$UI.Render.Date(params.row.LastOperateTime, true)) }
  ]
}
</script>
<style lang="less" scoped>
</style>