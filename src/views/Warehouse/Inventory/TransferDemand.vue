<!--仓储 - 调拨需求-->
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
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.TransferRequireStatus" :options="StatusDrop" />
          <!-- <Select class="P-W-200" placeholder="筛选来源仓" @on-change="OnClearSelect('OriginWarehouseId')" v-model="SearchForm.OriginWarehouseId" filterable clearable>
						<Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选目标仓" @on-change="OnClearSelect('TargetWarehouseId')" v-model="SearchForm.TargetWarehouseId" filterable clearable>
						<Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select>
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('TransferRequireStatus')" v-model="SearchForm.TransferRequireStatus" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.TransferRequireStatus[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
					<Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.TransferRequireKeyType[Item]" :key="Index">{{Item}}</Option>
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
			<Button type="primary" v-if="Powers.CreateTransferRequireBatch" @click="OperateGroup(4)" class="P-MR-10 P-MB-10">生成调拨拣货批次</Button>
			<Button type="primary" v-if="Powers.SetInvalidTransferRequire" @click="OperateGroup(3)" class="P-MR-10 P-MB-10">作废</Button>
		</Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="TransferDemandTb"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <TransferDemandDetail ref="TransferDemandDetail" />
    <ModifyTransferDemand ref="ModifyTransferDemand" @modify-res="ModifyRes" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'TransferDemand',
  components: {
    TransferDemandDetail: () => import('@/components/Warehouse/Inventory/TransferDemandDetail.vue'),
    ModifyTransferDemand: () => import('@/components/Warehouse/Inventory/ModifyTransferDemand.vue'),
  }
})
export default class TransferDemand extends Vue {
	private mounted() :void {
    this.GetPoints()
    this.GetWarehouseDropList()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['SetInvalidTransferRequire', 'ModifyQuantity', 'CreateTransferRequireBatch']))
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
    let Drops: PInterface.KV[] = [];
		this.Powers.ModifyQuantity ? Drops.push({ Key: '编辑', Value: 2 }) : null;
    this.Powers.SetInvalidTransferRequire ? Drops.push({ Key: '作废', Value: 3 }) : null;
    Drops.push({ Key: '查看', Value: 1 });
    this.OperateDrop.push(...Drops);
    this.$set(this.SearchForm, 'TransferRequireStatus', 1);
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
  private GetSelected(Data: Interface.TransferDemandList[] ): void{
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
				Address: this.$Api.TransferRequireGetList,
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
    this.$set(this.SearchForm, 'TransferRequireStatus', 1);
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
			if(this.Powers[Item] && ['SetInvalidTransferRequire', 'CreateTransferRequireBatch'].includes(Item)){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }

  //作废
  private ValidateInvalid(Idx: number|undefined):void{
    if(Idx === undefined && this.Selected.length < 1){
      this.$UI.Tips.Floating('warning', `请选择新建状态的调拨需求进行作废操作`);
			return;
    }
    if(Idx === undefined && this.Selected.some(Item=>Item.TransferRequireStatus !== 1)){
      this.$UI.Tips.Floating('warning', `选择的调拨需求不全为新建状态，无法进行作废操作`);
			return;
    }
		
		
    this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content: `是否作废选中的调拨需求？`,
    	Enter:false,
    	Callback:(Bool:boolean):void=>{
    		if(Bool){
    			this.PostInvalid(Idx);
    		}
    	}
    })
  }

  private PostInvalid(Idx: number| undefined): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferRequireSetInvalid,
				Login: true
			},
			Data: Idx === undefined ? this.Selected.map(item=>item.Id) : [this.List[Idx].Id],
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `作废成功`);
          this.GetList();
				} else {
          this.$Request.Error(Res);
				}
			}
		})
  }

  //生成调拨拣货批次
  ValidateBatch(): void{
    let Warehouse = this.Selected[0].OriginWarehouse
    let TargetWarehouse = this.Selected[0].TargetWarehouse
    let Sku = []
    for(let I = 0, len = this.Selected.length; I < len; I++) {
      if(this.Selected[I].TransferRequireStatus > 1 || this.Selected[I].OriginWarehouse !== Warehouse || this.Selected[I].TargetWarehouse !== TargetWarehouse) {
        this.$UI.Tips.Floating('warning', '请选择新建状态、目的仓和来源仓一致且不包含相同SKU的调拨需求进行生成调拨拣货批次操作')
        return
      }
      Sku.push(this.Selected[I].SkuCode)
    }
    let OtherSku = Array.from(new Set([...Sku]))
    if(OtherSku.length < Sku.length) {
      this.$UI.Tips.Floating('warning', '请选择新建状态、目的仓和来源仓一致且不包含相同SKU的调拨需求进行生成调拨拣货批次操作')
      return
    }

    this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content: `是否对选中的需求进行生成调拨拣货批次？`,
    	Enter:false,
    	Callback:(Bool:boolean):void=>{
    		if(Bool){
    			this.PostBatch();
    		}
    	}
    })
  }

  private PostBatch(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferRequireCreateBatch,
				Login: true
			},
			Data: this.Selected.map(Item=>Item.Id),
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `生成调拨拣货批次成功`);
          this.GetList();
				} else {
          this.$Request.Error(Res);
				}
			}
		})
  }

  //val -- 1-查看 2-编辑 3-作废 4-生成调拨拣货批次；   Index--选中数据索引值
	private OperateGroup(Val: number, Index?: number): void{
		this.$set(this, 'AccurateSearch', false);
		if(Index !== undefined){
			this.CancelSelect();
		}else{
			if (this.Selected.length < 1) {
				this.$UI.Tips.Floating('warning', Val === 3 ? `请选择新建状态的调拨需求进行作废操作` : `请选择新建状态、目的仓和来源仓一致且不包含相同SKU的调拨需求进行生成调拨拣货批次操作`);
				return;
			}
		}

		switch(Val){
			case 1:
				(this.$refs["TransferDemandDetail"] as any).TriggerModal(JSON.parse(JSON.stringify(this.List[Index as number])))
				break;
			case 2:
				(this.$refs["ModifyTransferDemand"] as any).TriggerModal(JSON.parse(JSON.stringify(this.List[Index as number])))
			break;
			case 3:
				this.ValidateInvalid(Index)
      break;
      case 4:
        this.ValidateBatch()
      break;
		}
	}
  
  //控制列表操作列下拉按钮显示隐藏  2-编辑 3-作废
	private ControlOpera(OpeIndex:number, RowData: Interface.TransferDemandList): string{
    switch (OpeIndex) {
      case 2: 
      case 3: 
        return RowData.TransferRequireStatus === 1 ? 'inline-block' : 'none'; 
      break;
      default: return 'inline-block';
    }
  }
  
  private ModifyRes(Val: boolean){
    if(Val) this.GetList();
  }
  
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TransferRequireStatus); //状态下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TransferRequireKeyType);  //关键词下拉
  private OriginWarehouseDrop: PInterface.KV[] = []; //来源仓下拉
  private WarehouseDrop: PInterface.KV[] = []; //目标仓下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private Powers: PInterface.Power = {}; // 权限
	private SearchForm : Interface.TransferDemandSearch = new Interface.TransferDemandSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
	private List: Interface.TransferDemandList[] = []; //列表数据
	private Selected: Interface.TransferDemandList[] = []; //复选框勾选数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '编号', key: 'TransferRequireCode' },
		{ title: 'SKU编号', key: 'SkuCode' },
		{ title: '产品名', key: 'SkuName', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
      }, Params.row.SkuName)
    } },
		{ title: '数量', key: 'Quantity', width: 70 },
		{ title: '目标仓', key: 'TargetWarehouse' },
		{ title: '来源仓', key: 'OriginWarehouse' },
		{ title: '批次号', key: 'TransferRequireBatchCode' },
		{ title: '备注', key: 'Remark', render: (h: any, Params: any): string => {
      return Params.row.Remark !== "" ? h('Tooltip', {
        props: {
          content: Params.row.Remark
        },
        class: 'P-LINE-1'
      }, Params.row.Remark) : h('span', '-')
    }  },
		{ title: '状态', key: 'TransferRequireStatus', width: 90, render: (h: any, Params: any): string => h('span', this.$Enums.Warehouse.TransferRequireStatus[Params.row.TransferRequireStatus]) },
    { title: '创建时间', key: 'CreatedTime', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.CreatedTime, true)) },
    { title: '操作', width: 180, render: (h: any, Params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV, index: number )=>{
          return h('Button', {
            props: {
              type: (Item.Value === 2 && Params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            class: index !== 2 ? 'P-MR-5' : '',
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
