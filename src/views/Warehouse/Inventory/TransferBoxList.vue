<!--仓储 - 调拨箱列表-->
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
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="StatusDrop" />
          <!-- <Select class="P-W-200" placeholder="筛选来源仓" @on-change="OnClearSelect('OriginWarehouseId')" v-model="SearchForm.OriginWarehouseId" filterable clearable>
						<Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选目标仓" @on-change="OnClearSelect('TargetWarehouseId')" v-model="SearchForm.TargetWarehouseId" filterable clearable>
						<Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select>
					<Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
						<Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.TransferInBoxStatus[Item]" :key="Index">{{Item}}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
					<Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
            <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100" placeholder="搜索关键词" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.TransferInBoxType[Item]" :key="Index">{{Item}}</Option>
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
			<Button type="primary" v-if="Powers.PrintBoxNumber" @click="OperateGroup(2)" class="P-MR-10 P-MB-10 ">打印箱号</Button>
			<TrackingNumber ref="TrackingNumber" v-if="Powers.ScanTrackingInfo" :SelectData="Selected" @clear-modal="OperateRes"/>
			<TransferInBoxCharge ref="TransferInBoxCharge" v-if="Powers.ScanFee" :SelectData="Selected" @clear-modal="OperateRes"/>
		</Col>
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="TransferDemandTb"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <TransferDemandDetail ref="TransferDemandDetail" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
import ExpandRow from './TransferBoxList_Expand.vue';
import GetLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: 'TransferBoxList',
  components: {
    TransferDemandDetail: () => import('@/components/Warehouse/Inventory/TransferDemandDetail.vue'),
		TransferInBoxCharge: () => import('@/components/Warehouse/Inventory/TransferInBoxCharge.vue'),
		TrackingNumber: () => import('@/components/Warehouse/Inventory/TrackingNumber.vue'),
  }
})
export default class TransferBoxList extends Vue {
	private mounted() :void {
    this.GetPoints()
    this.GetWarehouseDropList()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['PrintBoxNumber', 'ScanTrackingInfo', 'ScanFee']))
    this.$set(this.SearchForm, 'Status', 1);
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
  private GetSelected(Data: Interface.TransferBoxList[] ): void{
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
				Address: this.$Api.TransferInBoxList,
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
    this.$set(this, 'SearchForm', new Interface.TransferBoxListSearch())
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


  private PostInvalid(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferRequireSetInvalid,
				Login: true
			},
			Data: this.Selected.map(item=>item.Id),
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

  //Index--选中数据索引值
	private OperateGroup(Val: number, Index?: number): void{
		this.$set(this, 'AccurateSearch', false);
		
		if(Index !== undefined){	//查看
			this.CancelSelect();
			(this.$refs["TransferDemandDetail"] as any).TriggerModal(JSON.parse(JSON.stringify(this.List[Index])), true)
		}else{
			// 打印箱号
			if (this.Selected.length < 1) {
				this.$UI.Tips.Floating('warning', '请先选择列表上的调拨箱再进行操作');
				return;
			}
			this.GetBoxPrintData()
		}
	}

	//打印箱号
	private GetBoxPrintData(): void{
		this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferInBoxPrint,
				Login: true
			},
			Data: this.Selected.map(Item=>Item.Id),
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.PrintBoxOrder(Res.Data.Data)
				} else {
          this.$Request.Error(Res);
				}
			}
		})
	}

	private PrintBoxOrder(Data: Interface.TransferBoxPrint[]){
		let CurrentData: Interface.TransferBoxPrint = Data[0]
		let Code = ""
		if(CurrentData.SkuTypeNum === 1) {
			if(CurrentData.SkuTotalNum === 1) {
				Code = 'A+'
			} else {
				Code = 'A'
			}
		} else if(CurrentData.SkuTypeNum > 1 && CurrentData.SkuTypeNum < 6) {
			Code = 'B'
		} else {
			Code = 'C'
		}

		let LODOP = GetLodop();

		LODOP.PRINT_INITA("0mm","0mm","100.01mm","100.01mm","装箱单");
		LODOP.SET_PRINT_PAGESIZE(1,1000,1000,"装箱单");

		LODOP.ADD_PRINT_TEXT("5.29mm","3.18mm","59mm","10.58mm", CurrentData.StoreInCode);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",15);

		LODOP.ADD_PRINT_TEXT("5.29mm","75.44mm","59mm","10.58mm", `${CurrentData.SkuTypeNum}-`);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",26);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);

		LODOP.ADD_PRINT_TEXT("27.52mm","14.82mm","59mm","10.58mm", `CN - ${CurrentData.TargetWarehouseCode}`);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",15);

		LODOP.ADD_PRINT_TEXT("22.49mm","62.44mm","45mm","24.34mm", Code);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
		LODOP.SET_PRINT_STYLEA(0,"FontSize",70);
		LODOP.SET_PRINT_STYLEA(0,"Bold",1);

		LODOP.ADD_PRINT_BARCODE("60.76mm","10.58mm","78.58mm","14.02mm","128Auto",CurrentData.TransferBoxCode);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",8);
		LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);

		LODOP.ADD_PRINT_TEXT("76.9mm","9.79mm","78.05mm","6.35mm",CurrentData.TransferBoxCode);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑", 12);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

		LODOP.ADD_PRINT_TEXT("83.9mm","1.00mm","90.05mm","6.35mm",CurrentData.PackageNo);
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑", 12);
		LODOP.SET_PRINT_STYLEA(0,"FontSize", 18);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

		LODOP.ADD_PRINT_TEXT("92.9mm","45.44mm","78.05mm","10.58mm",'Made in China');
		LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑", 12);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);

		LODOP.PRINT();

		if(Data.length > 1){
			Data.splice(0,1)
			this.PrintBoxOrder(Data)
		}else{
			this.$UI.Tips.Floating('success', '打印箱号成功')
			this.CancelSelect()
		}
	}

	//
	private OperateRes(B: boolean): void{
		this.CancelSelect()
		if(B){
			this.GetList();
		}
	}
  
  private HandleRes(Val: boolean){
    if(Val) this.GetList();
  }
  
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TransferInBoxStatus); //状态下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TransferInBoxType);  //关键词下拉
  private OriginWarehouseDrop: PInterface.KV[] = []; //来源仓下拉
  private WarehouseDrop: PInterface.KV[] = []; //目标仓下拉
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
	private Powers: PInterface.Power = {}; // 权限
	private SearchForm : Interface.TransferBoxListSearch = new Interface.TransferBoxListSearch();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private List: Interface.TransferBoxList[] = []; //列表数据
	private Selected: Interface.TransferBoxList[] = []; //复选框勾选数据
	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
		{ type: 'expand', width: 40, render: (h: any, params: any): string => {
				return h(ExpandRow, {
					props: {
						row: params.row
					}
				})
			}
		},
		{ title: '箱号', key: 'TransferBoxCode', render: (h: any, Params: any): string => {
			return h('p',{
				class: "P-Pointer P-Text-Info",
				on: {
					click: () => {
						this.OperateGroup(1, Params.index)
					}
				}
			}, Params.row.TransferBoxCode)
		} },
    { title: '目标仓', key: 'TargetWarehouseName' },
    { title: '来源仓', key: 'OriginWarehouseName' },
		{ title: '产品种类数', key: 'SkuTypeNum' },
		{ title: '产品总数量', key: 'SkuTotalNum' },
		{ title: '第三方仓库单号', key: 'StoreInCode' },
    { title: '状态', key: 'Status', render: (h: any, Params: any): string => h('span', this.$Enums.Warehouse.TransferInBoxStatus[Params.row.Status]) },
		{ title: '物流公司', key: 'LogisticsCmp', render: (h: any, Params: any): string => {
      return Params.row.LogisticsCmp !== "" ? h('Tooltip', {
        props: {
          content: Params.row.LogisticsCmp
        },
        class: 'P-LINE-1'
      }, Params.row.LogisticsCmp) : h('span', '-')
    } },
    { title: '快递单号', key: 'TrackingNumber', render: (h: any, Params: any): string => {
      return Params.row.TrackingNumber !== "" ? h('Tooltip', {
        props: {
          content: Params.row.TrackingNumber
        },
        class: 'P-LINE-1'
      }, Params.row.TrackingNumber) : h('span', '-')
    } },
    { title: '创建时间', key: 'Created', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.Created, true)) },
    { title: '操作', width: 100, render: (h: any, Params: any): string => {
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.OperateGroup(1, Params.index)
              }
            }
          }, '查看' )
      }
    }
	]
}

</script>
<style lang="less"></style>
