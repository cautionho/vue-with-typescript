<template>
  <Row >
    <Col span="24">
      <Form inline v-model="SearchForm" ref="SearchForm" onsubmit="return false">
        <FormItem class="P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
            <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
              <Option v-for="(Item, Index) in SearchKeyTypeDrop" :key="Index" :value="$Enums.Public.Enable[Item]">{{Item}}</Option>
            </Select> -->
            <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-MB-10">
          <Button type="warning">重置</Button>
        </FormItem>
      </Form>
    </Col>
    <Col span="24" >
      <ModifyAbroadWarehouseRules 
        ref="ModifyAbroadWarehouseRules"
        :Type="Type"
        :DropAbroadWarehouse="DropAbroadWarehouse"
        v-if="(Type === 'Product' && Powers.AddProductRule) || (Type === 'StockUp' && Powers.AddStockUpRule) " 
        @handle-res-msg="HandleResMsg" 
      />
      <ChangeStatus 
        ref="ChangeStatus"
        class="P-MB-10" 
        v-if="(Type === 'Product' && Powers.SetProductRuleIsEnable) || (Type === 'StockUp' && Powers.SetStockUpRuleIsEnable) " 
        @emit-change="EmitChange"
      />
    </Col>
    <Col span="24" class="P-MB-10">
      <Table :columns="Type === 'Product' ? ProductCols : StockUpCols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
    </Col>
    <Col span="24" >
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';

@Component({
  name: 'AbroadWarehouseRulesSettings',
  components: {
    ModifyAbroadWarehouseRules: () => import('@/components/Warehouse/Settings/ModifyAbroadWarehouseRules.vue'),
    ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
	}
})

export default class AbroadWarehouseRulesSettings extends Vue {
  @Prop() Type: string; // 定义 Product StockUp
  @Prop() DropAbroadWarehouse:  PInterface.KV[]; // 海外仓库下拉
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private GetPoints(): void {
		this.$UI.Loading.Show();
    const Power: string[] = this.Type === 'Product' ? ['AddProductRule', 'ModifyProductRule', 'SetProductRuleIsEnable'] : ['AddStockUpRule', 'ModifyStockUpRule', 'SetStockUpRuleIsEnable']
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, Power))
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		( this.Type === 'Product' && this.Powers.ModifyProductRule ) || ( this.Type === 'StockUp' && this.Powers.ModifyStockUpRule ) ? Drops.push({ Key: '编辑', Value: 1 }) : null;
    ( this.Type === 'Product' && this.Powers.SetProductRuleIsEnable ) || ( this.Type === 'StockUp' && this.Powers.SetStockUpRuleIsEnable ) ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

  // 获取列表数据
  private GetList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$UI.Loading.Show();
    this.$set(this, 'List', []);
    this.$set(this.SearchForm, 'IsEnable', this.SearchForm.SearchKeyType === '' ? '' : [false, true][this.SearchForm.SearchKeyType] );

    const PostData: any = JSON.parse(JSON.stringify(this.SearchForm));

    delete PostData.SearchKeyType

		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.Type === 'Product' ? this.$Api.GetProductRuleList : this.$Api.GetStockUpRuleList, 
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: PostData },
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

	// 获取列表复选框选中的数据
  private GetSelected(data: Interface.ProductAboadWareList[] | Interface.StockUpAboadWareList[] ): void{
    this.$set(this, 'Selected', data)
  }

	// 取消全选
  private CancelSelect():void {
    this.$set(this, 'Selected', [])
  }

	// 搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	// 重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.AboadWareSearch())
		this.GetList();
	}
	
	//  切换列表条数
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}
	
	//  切换列表页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
  }
  
  //  获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 250;
		for(let item in this.Powers){
			if(this.Powers[item]){
				Flag = 305;
			}
		}
		return (window.innerHeight - Flag);
  }	

  // 列表操作列 
  // 1-编辑用户 2-重置密码
  private OperateGroup(Type:number, Idx?:number): void{
    if (Idx) {
      this.CancelSelect()
      this.$set(this, 'Selected', [JSON.parse(JSON.stringify(this.List[Idx]))] );
    }
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : []);
    switch(Type){
      case 1:
        (this.$refs['ModifyAbroadWarehouseRules'] as Vue).Trigger(this.Selected)
        break;
      case 2:
        this.ChangeStatusObj.ToTarget = !this.Selected[0].IsEnable;
        this.ChangeStatusObj.IdKey = this.Type === 'Product' ? 'WarehouseIds' : 'Ids';
        (this.$refs['ChangeStatus'] as Vue).TriggerModal(this.Selected, this.ChangeStatusObj)
        break;
    }
  }
 
  // 0 - 取消， 1 - 编辑或添加 2 - 触发打开模态框
  private HandleResMsg(Type: number){
    this.CancelSelect()

    if(Type == 1){
      this.GetList()
    }else if(Type == 2){
      this.OperateGroup(1)
    }else if(Type == 3){
      this.GetList()
    }
  }
  // 状态回调
  private EmitChange(Res: boolean, Type?: number){
		if(Type !== undefined){
      this.ChangeStatusObj.ToTarget = Type === 1 ? true : false;
      this.ChangeStatusObj.IdKey = this.Type === 'Product' ? 'WarehouseIds' : 'Ids';
			(this.$refs["ChangeStatus"] as any).TriggerModal(this.Selected, this.ChangeStatusObj);
		}else{
			this.CancelSelect()
		}

		if(Res){
      this.GetList()
		}
	}
  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限
  
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.AboadWareSearch = new Interface.AboadWareSearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 搜索关键词

  private ChangeStatusObj: PInterface.ChangeStatus = {  //禁启用
    Server: this.$Server.Settings, 
    Api: this.Type === 'Product' ? this.$Api.SetProductRuleIsEnable : this.$Api.SetStockUpRuleIsEnable,
    IdKey: 'Id',
    StatusKey: 'IsEnable', 
    ToTarget: false,
    TipsKey: '规则' 
  };  

  private Selected: Interface.ProductAboadWareList[] | Interface.StockUpAboadWareList[] = []; // 列表选中数据
  private List: Interface.ProductAboadWareList[] | Interface.StockUpAboadWareList[] = []; // 列表数据源
  private ProductCols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '编号', key: 'Sequence',  width: 60 },
		{ title: '海外仓库', key: 'WarehouseName'},
		{ title: '日均销量阈值', key: 'ThresholdValue'},
    { title: '状态', key: 'IsEnable', width: 80,
      render: (h: any, params: any): string => {
			  return h('div', {
          class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error',
        }, params.row.IsEnable ? '已启用' : '已禁用' )
      }
    },
    { title: '操作', width: 140, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV, Index: number )=>{
          return h('Button', {
            props: {
              type: (Item.Value === 2 && params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            class: Index == 0 ? 'P-MR-5' : '',
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row._index)
              }
            }
          }, Item.Value == 2 ? (params.row.IsEnable ? '禁用' : '启用') : Item.Key )
        }))
      }
    }
  ];

  private StockUpCols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '编号', key: 'Sequence',  width: 60},
		{ title: '海外仓库', key: 'WarehouseName'},
    { title: '日均销量阈值', key: 'ThresholdValue',
      render: (h: any, params: any): string => h('span', `${params.row.SaleSlowQty} ~ ${params.row.SaleHighQty}`)
    },
		{ title: '备货天数', key: 'StockupDays'},
    { title: '状态', key: 'IsEnable', width: 80,
      render: (h: any, params: any): string => {
			  return h('div', {
          class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error',
        }, params.row.IsEnable ? '已启用' : '已禁用' )
      }
    },
    { title: '操作', width: 140, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV, Index: number )=>{
          return h('Button', {
            props: {
              type: (Item.Value === 2 && params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            class: Index == 0 ? 'P-MR-5' : '',
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row._index)
              }
            }
          }, Item.Value == 2 ? (params.row.IsEnable ? '禁用' : '启用') : Item.Key )
        }))
      }
    }
  ];
}
</script>
