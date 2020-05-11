<template>
  <Modal v-model="EnableSupplierModal" :title="Title" :mask-closable="false" :width="1200" @on-cancel="CancelSupplier">
    <Row>
		<Col span="24">
      <Row class="P-Search-Group">
        <Form inline ref="SearchFilter" v-model="SearchFilter">
          <FormItem class="P-MB-10">
            <Select class="P-W-200 P-ML-10" placeholder="筛选省份" v-model="SearchFilter.Province" :options="AddCityList" optionValKey="Id" optionKey="Name" />
            <Select class="P-W-200 P-ML-10" placeholder="筛选城市" v-model="SearchFilter.City" :options="CList" optionValKey="Id" optionKey="Name" />
            <Select class="P-W-200 P-ML-10" placeholder="筛选区域" v-model="SearchFilter.Area" :options="AList" optionValKey="Id" optionKey="Name" />
            <!-- <Cascader class="P-W-200 P-ML-10 P-Inline-Block" placeholder="筛选地区" @on-change="PickCity" :data="AddCityList" change-on-select filterable clearable v-model="SearchFilter.LocationArea"></Cascader> -->
          </FormItem>
          <FormItem class="P-ML-10 P-MB-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.SearchKey">
            <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :onChange="OnClearSelect.bind(this, 'SearchKeyType')" v-model="SearchFilter.SearchKeyType" :options="SearchKeyTypeDrop" />
            <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchKeyType')" v-model="SearchFilter.SearchKeyType" filterable clearable>
              <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Purchase.SupplySearchType[Item]" :key="Index">{{Item}}</Option>
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
    <Table :columns="TableCols" :data="AddSupplierList" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="SelectedData" ref="Supplier"></Table>
    </Col>
    <Col span="24" class="P-MT-10">
    <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>
    </Row>
    <footer slot="footer">
      <Button v-if="IsMultiSelect" type="primary" @click="SelectedSupplierModal()">提交</Button>
      <Button @click="CancelSupplier">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Watch, Vue, Prop, Emit } from 'vue-property-decorator';
/*interface start*/
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Purchase';
/*interface end*/

@Component({
	name: 'EnableSupplier',
	
})

export default class EnableSupplier extends Vue {
  // @Prop() IsMultiSelect: boolean  //是否多选
  // @Prop() IsPeriod: boolean //是否存在账期（api请求需要）
  // @Prop() LoadingEnableTab: boolean //是否重新加载数据
  @Prop() AddCityList: PInterface.AreaTree[]  //地区下拉数据

  @Emit() EmitEableSupplier(V: boolean, IsChangeSearchTable:boolean, SelectData?: Interface.Supplier[]){
    this.EnableSupplierModal = false;
  }

  @Watch('SearchFilter.Province')
	private ChangeProvince(Val: number): void{
		this.CList = [];
		this.AList = [];
		this.SearchFilter.City = 0;
		this.SearchFilter.Area = 0;
		if(Val !== 0){
			this.CList = (this.AddCityList.find(Item => Item.Id === Val) as PInterface.AreaTree).ChildNodes;
		}
	}

	@Watch('SearchFilter.City')
	private ChangeCity(Val: number): void{
		this.AList = [];
		this.SearchFilter.Area = 0;
		if(Val !== 0){
			this.AList = (this.CList.find(Item => Item.Id === Val) as PInterface.AreaTree).ChildNodes;
		}
	}

  private TriggerModal(IsPeriod: boolean, LoadingEnableTab: boolean, IsMultiSelect: boolean):void{
    // this.AddCityList = AddCityList;
    this.IsPeriod = IsPeriod
    this.LoadingEnableTab = LoadingEnableTab
    this.IsMultiSelect = IsMultiSelect

    if(this.LoadingEnableTab){
      this.ResetList();
    }
    if(this.IsMultiSelect && this.TableCols.length == 6){
      this.TableCols.pop()
    }else if(!this.IsMultiSelect && this.TableCols.length == 6){
      this.TableCols.splice(0, 1)
    }
    this.Title = this.IsMultiSelect ? '添加供应商' : '选择供应商'
    this.CancelSelect()
    this.$nextTick(() =>{
      this.$set(this,'EnableSupplierModal', true);
    })
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchFilter[S] == undefined ){
      this.$set(this.SearchFilter, S, '');
    }
  }
	
	//级联选择地区
  // private PickCity(Value: number[], SelectedData: any) {
	// 	let Length = Value.length;
	// 	switch (Length) {
	// 		case 1:
	// 			this.SearchFilter.Province = Value[0];
	// 			break;
	// 		case 2:
	// 			this.SearchFilter.Province = Value[0];
	// 			this.SearchFilter.City = Value[1];
	// 			break;
	// 		case 3:
	// 			this.SearchFilter.Province = Value[0];
	// 			this.SearchFilter.City = Value[1];
	// 			this.SearchFilter.Area = Value[2];
	// 			break;
	// 		default:
	// 			this.SearchFilter.Province = 0;
	// 			this.SearchFilter.City = 0;
	// 			this.SearchFilter.Area = 0;
	// 			break;
	// 	}
	// }

	// 获取列表
	private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'AddSupplierList', []);
		const SearchFilter = JSON.parse(JSON.stringify(this.SearchFilter));
		SearchFilter.Status = SearchFilter.Status === "" ? "" : Boolean(SearchFilter.Status);
		SearchFilter.IsPeriod = this.IsPeriod;
		delete SearchFilter.LocationArea;
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SupplyGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchFilter },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.ChangeTable()
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
					this.AddSupplierList.push(...Res.Data.PageModel.Items);
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  //判断是否筛选数据
  private ChangeTable():void{
    if(this.SearchFilter.Province == 0 && this.SearchFilter.Area == 0 && this.SearchFilter.City == 0 &&this.SearchFilter.SearchKeyType == 0 &&this.SearchFilter.SearchKey == "" &&this.Pager.PageIndex == 1){
      this.IsChangeSearchTable = false;
    }else{
      this.IsChangeSearchTable = true;
    }
  }

  private CancelSupplier():void{
    this.EmitEableSupplier(false, this.IsChangeSearchTable)
  }

  private SelectedSupplierModal():void{
    if(this.SelectedSupplier.length < 1){
      this.$UI.Tips.Floating('warning', `请选择供应商`);
      return
    }
    this.EmitEableSupplier(true, this.IsChangeSearchTable, this.SelectedSupplier)
  }

	// 计算列表高度
	private CalculateTbHeight(): number {
		return 500;
	}

	//获取列表复选框选中的数据
  private SelectedData(Data: Interface.Supplier[] ): void{
    this.$set(this, 'SelectedSupplier', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["Supplier"] as any).selectAll(false);
    this.$set(this, 'SelectedSupplier', [])
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchFilter', new Interface.SupplierSearch())
		this.GetList();
	}

	// 触发“切换页码”
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex', N);
		this.GetList();
	}

	// 触发“切换数据展示数量”
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
  }
  
  //单个选中
  private SelcSingle(Idx: number):void{
    this.EmitEableSupplier(true, this.IsChangeSearchTable, [this.AddSupplierList[Idx]])
  }
	
  private EnableSupplierModal: boolean = false;
  // private AddCityList: PInterface.AreaTree[] = [] //地区下拉数据
  private IsPeriod: boolean = false; //是否存在账期（api请求需要）
  private LoadingEnableTab: boolean = true; //是否重新加载数据
  private IsMultiSelect: boolean = false  //是否多选
  
	private CList: PInterface.AreaTree[] = [];	//城市下拉数据
  private AList: PInterface.AreaTree[] = [];	//区域下拉数据
  
	// private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 状态
	private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.SupplySearchType) // 搜索关键词
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
	private SearchFilter: Interface.SupplierSearch = new Interface.SupplierSearch() // 筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private SelectedSupplier: Interface.Supplier[] = [] // 列表选中数据
  private AddSupplierList: Interface.Supplier[] = [] // 列表数据源
  private IsChangeSearchTable: boolean = false  //是否筛选过数据
  private Title: string = ""
	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
		{ title: '供应商名称', key: 'SupplyName' },
		{ title: '联系人', key: 'Contact' },
		{ title: '联系电话', key: 'Phone' },
		{ title: '地址', width: 500, render: (h: any, params: any): string => {
				return h('p', `${(params.row as any).ProvinceName}${(params.row as any).CityName}${(params.row as any).AreaName}${(params.row as any).Street}`)
			}
    },
    { title: '操作', width: 100, render: (h: any, params: any): string => {
        return h('div', [
          h('Button', {
              props: {
                  type: 'primary',
                  size: 'small'
              },
              on: {
                click: () => {
                  this.SelcSingle(params.index)
                }
              }
          }, '选择')
        ])
      }
    }
  ]
  
  
  private TableCols: PInterface.TableCol[] = this.Cols  //兼容多选与单选数据表头
}

</script>
<style lang="less"></style>
