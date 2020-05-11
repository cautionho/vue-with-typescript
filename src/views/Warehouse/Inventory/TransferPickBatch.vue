<!--销售 - 调拨拣货批次-->
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
					<Select class="P-W-200" placeholder="筛选来源仓" v-model="SearchForm.OriginWarehouseId" :options="WarehouseDrop" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选目标仓" v-model="SearchForm.TargetWarehouseId" :options="WarehouseDrop" />
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.TransferPickingBatchStatus" :options="StatusDrop" />
          <!-- <Select class="P-W-200" placeholder="筛选来源仓" @on-change="OnClearSelect('OriginWarehouseId')" v-model="SearchForm.OriginWarehouseId" filterable clearable>
						<Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选目标仓" @on-change="OnClearSelect('TargetWarehouseId')" v-model="SearchForm.TargetWarehouseId" filterable clearable>
						<Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select>
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('TransferPickingBatchStatus')" v-model="SearchForm.TransferPickingBatchStatus" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.TransferBatchStatus[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
					<Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.TransferBatchKeyType[Item]" :key="Index">{{Item}}</Option>
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
			<PrintTransferBatch ref="PrintTransferBatch" :SelectedData="Selected" v-if="Powers.PrintTransferRequire" @change-print-modal="ChangePrintModal" />
			<Button type="primary" v-if="Powers.ForceComplete" @click="OperateGroup(2)" class="P-MR-10 P-MB-10">强制完成批次</Button>
			<Button type="primary" v-if="Powers.BatchReturn" @click="OperateGroup(3)" class="P-MR-10 P-MB-10">批次还贷</Button>
		</Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="TransferDemandTb"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <TransferPickBatchDetail ref="TransferPickBatchDetail" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
import Index from '../../Index.vue';
@Component({
  name: 'TransferPickBatch',
  components: {
    PrintTransferBatch: () => import('@/components/Warehouse/Inventory/PrintTransferBatch.vue'),
    TransferPickBatchDetail: () => import('@/components/Warehouse/Inventory/TransferPickBatchDetail.vue')
  }
})
export default class TransferPickBatch extends Vue {
	private mounted() :void {
    this.GetPoints()
    this.GetWarehouseDropList()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['PrintTransferRequire', 'ForceComplete', 'BatchReturn']))
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
    let Drops: PInterface.KV[] = [];
		this.Powers.ForceComplete ? Drops.push({ Key: '强制完成批次', Value: 2 }) : null;
		this.Powers.BatchReturn ? Drops.push({ Key: '批次还货', Value: 3 }) : null;
		Drops.push({ Key: '查看', Value: 1 })
    this.OperateDrop.push(...Drops);
    this.$set(this.SearchForm, 'TransferPickingBatchStatus', 1);
		this.GetList();
	}
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  private GetWarehouseDropList(){
    this.$UI.Loading.Show();
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
        this.$UI.Loading.Hide();
			}
		})
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	//获取列表复选框选中的数据
  private GetSelected(Data: Interface.TransferPickBatchList[] ): void{
    this.$set(this, 'Selected', Data)
  }

  //取消全选
  private CancelSelect():void {
    (this.$refs["TransferDemandTb"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	//获取列表
  private GetList(): void{
		this.CancelSelect();
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'List', [])
		let PostData = JSON.parse(JSON.stringify(this.SearchForm))
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferBatchGetList,
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
    this.$set(this, 'SearchForm', new Interface.TransferDemandSearch())
    this.$set(this.SearchForm, 'TransferPickingBatchStatus', 1);
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

  //强制完成批次/批次还贷 确认操作
  ValidateConfirm(Type: number, Idx: number|undefined ): void{
    this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content: `是否对选中的批次进行${Type === 2 ? '强制完成批次' : '批次还货'}操作？`,
    	Enter:false,
    	Callback:(Bool:boolean):void=>{
    		if(Bool){
    			this.PostOpe(Type, Idx );
    		}
    	}
    })
  }
  private PostOpe(Type: number, Idx: number|undefined): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: Type === 2 ? this.$Api.TransferBatchForceComplete : this.$Api.TransferBatchBatchReturn,
				Login: true
			},
			Data: Idx === undefined ? this.Selected.map(Item=>Item.TransferBatchCode) : [this.List[Idx].TransferBatchCode],
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${Type === 2 ? '强制完成批次' : '批次还货'}成功`);
          this.GetList();
				} else {
          this.$Request.Error(Res);
        	this.$UI.Loading.Hide();
				}
			}
		})
	}

  //val -- 1-查看 2-强制完成批次 3-批次还贷   Index--选中数据索引值
	private OperateGroup(Val: number, Index?: number): void{
		const Tip: string = `请选择状态为${Val === 2 ? '待拣货或已打印' : '已拣货或部分装箱'}的批次进行操作`;
		this.$set(this, 'AccurateSearch', false);
		if(Index !== undefined ){
			this.CancelSelect();
		}
	
		switch(Val){
			case 1:
				(this.$refs["TransferPickBatchDetail"] as any).TriggerModal(JSON.parse(JSON.stringify(this.List[Index as number])))
				break;
			case 2:
				if(Index === undefined && (this.Selected.some(Item=> Item.TransferRequireStatus>2) || this.Selected.length < 1) ){
					this.$UI.Tips.Floating('warning', Tip)
					return;
				}
				this.ValidateConfirm(Val, Index)
			case 3:
				if(Index === undefined && (this.Selected.some(Item=> (Item.TransferRequireStatus !== 3 && Item.TransferRequireStatus !== 4)) || this.Selected.length < 1) ){
					this.$UI.Tips.Floating('warning', Tip)
					return;
				}
				this.ValidateConfirm(Val, Index)
			break;
		}
	}
  
  //控制列表操作列下拉按钮显示隐藏  2-强制完成批次 3-批次还货
	private ControlOpera(OpeIndex:number, RowData: Interface.TransferPickBatchList): string{
    switch (OpeIndex) {
			case 2: 
				return RowData.TransferRequireStatus < 3 ? 'block' : 'none'; 
      case 3: 
        return RowData.TransferRequireStatus === 3 || RowData.TransferRequireStatus === 4 ? 'block' : 'none'; 
      break;
      default: return 'block';
    }
	}
	

	private ChangePrintModal(Val: boolean){
		if(Val){
			this.GetList()
		}
	}
  
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TransferBatchStatus); //状态下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TransferBatchKeyType);  //关键词下拉
  private OriginWarehouseDrop: PInterface.KV[] = []; //来源仓下拉
  private WarehouseDrop: PInterface.KV[] = []; //目标仓下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private Powers: PInterface.Power = {}; // 权限
	private SearchForm : Interface.TransferPickBatchSearch = new Interface.TransferPickBatchSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
	private List: Interface.TransferPickBatchList[] = []; //列表数据
	private Selected: Interface.TransferPickBatchList[] = []; //复选框勾选数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '批次号', key: 'TransferBatchCode', render: (h: any, Params: any): string => {
			return h('p',{
				class: "P-Pointer P-Text-Info",
				on: {
					click: () => {
						this.OperateGroup(1, Params.row._index)
					}
				}
			}, Params.row.TransferBatchCode)
		} },
		{ title: '调拨需求数', key: 'RequireQuantity' },
		{ title: '来源仓', key: 'OriginWarehouseName' },
		{ title: '目标仓', key: 'TargetWarehouseName' },
		{ title: '创建人', key: 'CreateUserName' },
		{ title: '打印人', key: 'PrintUserName', render: (h: any, Params: any): string => h('span', Params.row.PrintUserName === "" ? '-' : Params.row.PrintUserName) },
		{ title: '状态', key: 'TransferPickingBatchStatus', width: 90, render: (h: any, Params: any): string => {return h('span', this.$Enums.Warehouse.TransferBatchStatus[Params.row.TransferRequireStatus]) }},
    { title: '生成时间', key: 'CreatedTime', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.CreatedTime, true)) },
    { title: '操作', width: 120, render: (h: any, Params: any): string => {
        return h('Dropdown',{
					on: {
						'on-click': (Name: any) => {
							this.OperateGroup(Name, Params.row._index)
						}
					}
				}, [
					h('a', [
						h('span', { class: 'P-MR-5' }, '操作'),
						h('Icon', { props: { type: 'ios-arrow-down' } })
					]),
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((Item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: Item.Value
							},
							class: "P-TA-C",
							style: { display: this.ControlOpera(Number(Item.Value), Params.row) },
						}, Item.Key);
					}))
				])
      }
    }
	]
}

</script>
<style lang="less"></style>
