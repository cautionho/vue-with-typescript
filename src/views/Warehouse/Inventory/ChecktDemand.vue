<!--仓储 - 盘点需求-->
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
          <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="StatusDrop" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.ChecktDemandStatus[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
          <span class="P-ML-10 P-Inline-Block">创建时间：</span>
          <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="开始时间"></DatePicker>
          <span class="P-ML-5 P-Inline-Block">-</span>
          <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="结束时间"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
            <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.ChecktDemandKeyType[Item]" :key="Index">{{Item}}</Option>
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
			<Button type="primary" v-if="Powers.ExportReportRecord" @click="SearchList('Export')" class="P-MR-10 P-MB-10">导出数据</Button>
			<Button type="primary" v-if="Powers.SetCheckDemandStatus" @click="ValidData" class="P-MR-10 P-MB-10">批量忽略</Button>
		</Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="ChecktDemandTb"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <Col span="0">
      <OutStockOrder ref="OutStockOrder" @handle-res="HandleRes" />
      <InventorySku ref="InventorySku" :WarehouseList="DropWarehouseList"  @change-modal="ChangeInventory"/>
    </Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'ChecktDemand',
  components: {
    OutStockOrder: () => import('@/components/Warehouse/Inventory/OutStockOrder.vue'),
    InventorySku: () => import('@/components/Warehouse/Inventory/InventorySku.vue')
  }
})
export default class ChecktDemand extends Vue {
	private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['SetCheckDemandStatus', 'ExportReportRecord']))
    this.SetOperateDrop()
    this.GetWarehouseList()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
    let Drops: PInterface.KV[] = [];
		this.Powers.SetCheckDemandStatus ? Drops.push({ Key: '查看相关订单', Value: 1 },{ Key: '忽略', Value: 2 },{ Key: '盘点', Value: 3 }) : null;
    this.OperateDrop.push(...Drops);
    this.$set(this.SearchForm, 'Status', 1);
		this.GetList();
	}
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	//获取列表复选框选中的数据
  private GetSelected(Data: Interface.ChecktDemandList[] ): void{
    this.$set(this, 'Selected', Data)
  }

  //取消全选
  private CancelSelect():void {
    (this.$refs["ChecktDemandTb"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	//获取列表
  private GetList(): void{
    this.CancelSelect();
    this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'List', [])
    let PostData = JSON.parse(JSON.stringify(this.SearchForm))
    PostData.StartTime = this.$UI["Render"].NewDate(PostData.StartTime, true)
    PostData.EndTime = this.$UI["Render"].NewDate(PostData.EndTime, true)

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.CheckOutDemandGetList,
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
  private SearchList(Type?:string): void{
    let SearchForm: any = JSON.parse(JSON.stringify(this.SearchForm));
    const StartStamp = new Date(this.SearchForm.StartTime).getTime();
    const EndStamp = new Date(this.SearchForm.EndTime).getTime();
    if ((SearchForm.StartTime === "" && SearchForm.EndTime !== "") || (SearchForm.StartTime !== "" && SearchForm.EndTime === "")) {
      this.$UI.Tips.Floating('warning', '开始时间和结束时间必须同时填写')
      return
    }

    if(StartStamp > EndStamp){
      this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
      return;
    }

    if ((EndStamp - StartStamp) / 86400000 > 31) {
      this.$UI.Tips.Floating('warning', '时间区间不能超过31天')
      return;
    }

    if(Type === 'Export'){
      if (SearchForm.StartTime === "") {
        this.$UI.Tips.Floating('warning', '请选择开始时间')
        return
      }
      this.ExportData();
      return;
    }

		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.ChecktDemandSearch())
    this.$set(this.SearchForm, 'Status', 1);
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

  private ValidData(): void{
    if (this.Selected.length < 1) {
      this.$UI.Tips.Floating('warning', '请选择记录后再进行操作');
      return;
    }
    if (this.Selected.some((Item) => Item.Status != 2)) {
      this.$UI.Tips.Floating('warning', '请选择待盘点的记录进行操作');
      this.CancelSelect();
      return;
    }
    this.ConfirmCheckOut()
  }

  //val -- 1-查看相关 2-忽略 3-盘点；   Index--选中数据索引值
	private OperateGroup(Val: number, Index: number): void{
    this.$set(this, 'AccurateSearch', false);
    this.CancelSelect();

		switch(Val){
			case 1:
        (this.$refs.OutStockOrder as any).TriggerModal(this.List[Index].Id);
				break;
			case 2:
        this.CancelSelect();
        this.$set(this, 'Selected', [JSON.parse(JSON.stringify(this.List[Index]))])
        this.ConfirmCheckOut(Index)
			break;
			case 3:
				(this as any).$refs.InventorySku.TriggerModal(JSON.parse(JSON.stringify(this.List[Index])));
      break;
		}
  }

  private ConfirmCheckOut(Index?:number): void{
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否确认选择的盘点需求库存无误可忽略不盘点？`,
      Callback: (Res: boolean):void => {
        if (Res) {
          this.CheckOutDemandStatus(4, Index);
        }
      }
    })
  }

  //仓库下拉
  private GetWarehouseList(){
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: {IsEnable: true, Type: [1, 2, 3, 4, 5]},
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.DropWarehouseList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }
  
  //忽略请求
  private CheckOutDemandStatus(S: number, Idx?:number):void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.CheckOutDemandSetStatus,
				Login: true
			},
			Data: { Status: S, Id: Idx !== undefined ? this.List[Idx].Id : this.Selected.map(Item => Item.Id).join(',') },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${S === 4 ? '忽略成功' : '盘点成功'}`);
          this.GetList();
				} else {
					this.$Request.Error(Res);
				  this.$UI.Loading.Hide();
				}
			}
		})
  }

  //导出
  private ExportData():void{
    let SearchForm: any = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.SearchKeyType = SearchForm.SearchKeyType === "" ? 0 : SearchForm.SearchKeyType;
    SearchForm.StartTime = this.$UI["Render"].NewDate(SearchForm.StartTime, true)
    SearchForm.EndTime = this.$UI["Render"].NewDate(SearchForm.EndTime, true)

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Report,
			Api: {
				Address: this.$Api.ExportReportRecordAdd,
				Login: true
			},
			Data: { ReportType: 41, SearchSerialize: JSON.stringify(SearchForm) },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出盘点需求记录成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据;`,
            Callback: (Res: boolean):void => {}
          })
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  //控制列表操作列下拉按钮显示隐藏  1-查看相关 2-忽略 3-盘点
	private ControlOpera(OpeIndex:number, RowData: Interface.ChecktDemandList): string{
    switch (OpeIndex) {
      case 1:
        return RowData.Status === 1 ? 'inline-block' : 'none';
        break;
      case 2: 
      case 3: 
        return RowData.Status === 2 ? 'inline-block' : 'none';
        break;
      default: return 'inline-block';
    }
  }

  private HandleRes(B: boolean){
    if(B){
      this.GetList();
    }
  }

  private ChangeInventory(Type: number){
    if(Type === 99){
      this.CheckOutDemandStatus(3)
    }
  }
  
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ChecktDemandStatus); //状态下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ChecktDemandKeyType);  //关键词下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private Powers: PInterface.Power = {}; // 权限
	private SearchForm : Interface.ChecktDemandSearch = new Interface.ChecktDemandSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
	private List: Interface.ChecktDemandList[] = []; //列表数据
	private Selected: Interface.ChecktDemandList[] = []; //复选框勾选数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '货架号', key: 'LocationCode', width: 100 },
		{ title: 'SKU编号', key: 'SkuCode' },
		{ title: '产品名', key: 'SkuName', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
      }, Params.row.SkuName)
    } },
		{ title: '仓库', key: 'WarehouseName' },
		{ title: '可用库存', key: 'Quantity', width: 110 },
		{ title: '状态', key: 'Status', width: 90, render: (h: any, Params: any): string => h('span', this.$Enums.Warehouse.ChecktDemandStatus[Params.row.Status]) },
    { title: '创建时间', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.CreateTime, true)) },
    { title: '盘点时间', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.CheckTime, true)) },
		{ title: '操作人', width: 120, render: (h: any, Params: any): string => h('span', Params.row.Operator === "" ? '-' : Params.row.Operator) },
    { title: '操作', width: 140, render: (h: any, Params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV, Index: number )=>{
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            class: Item.Value == 2 ? 'P-MR-5' : '',
            style: { display: this.ControlOpera(Number(Item.Value), Params.row) },
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), Params.row._index)
              }
            }
          }, Item.Key )
        }))
      }
    }
	]
}

</script>
<style lang="less"></style>
