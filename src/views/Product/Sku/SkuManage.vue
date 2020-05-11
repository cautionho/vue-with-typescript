<!-- SKU管理 -->
<template>
  <Row class="Categrory-View">
    <Col :span="ControllViewSpan">
      <Row>
        <Col :span="24">
          <div class="Tree-Title P-BG-Info">
            <Icon type="md-list" size="16" :class="[{ 'Icon-Transition-Center': ControllViewSpan === 1 }, {'Icon-Transition-Right': ControllViewSpan !== 1 }, 'Icon-Transition', 'P-BG-Info P-Pointer', 'P-Text-White', 'P-MR-5' ]" @click="IsShowTreeLeft"/>
          </div>
        </Col>
      </Row>
      <Row :class="[{ 'Row-Transition-Fade': ControllViewSpan === 1 },'Row-Transition', 'P-MT-10' ]">
        <div class="Tree-Wrap">
          <Tree :data="Tree" :render="RenderContent" class="P-Inline-Block" v-show="ControllViewSpan === 3"></Tree>
        </div>
      </Row>
    </Col>
    <Col :span="24 - ControllViewSpan">
      <Col span="24" class="P-PL-10">
        <Form inline v-model="SearchForm" ref="SearchForm" onsubmit="return false">
          <FormItem class="P-MB-10">
            <Dropdown trigger="custom" :visible="AccurateSearch" placement="bottom-start">
              <Button type="primary" @click="TriggerSearch">
                精准搜索
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <Col span="24" slot="list" class="P-P-10">
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="平台" v-model="SearchForm.Platfrom" :options="DropPlatform" />
                <Select class="P-W-400 P-ML-10 P-PB-10" placeholder="特性标签" v-model="SearchForm.Attribute" :options="DropAttribute" multiple />
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="开发员" v-model="SearchForm.DevUserId" :options="DropDevUser" />
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="采购员" v-model="SearchForm.Purchaser" :options="DropPurchaser" />
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="销售主管" v-model="SearchForm.SaleManager" :options="DropSaleManager" />
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="产品经理" v-model="SearchForm.DevManager" :options="DropDevManager" />
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="状态" v-model="SearchForm.Status" :options="DropStatus" />
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="品牌" v-model="SearchForm.BrandId" :options="DropBrand" />
                <Select class="P-W-200 P-ML-10 P-PB-10" placeholder="类型" v-model="SearchForm.IsBindSku" :options="DropSkuIsBind" />
              </Col>
            </Dropdown>
          </FormItem>
          <FormItem class="P-MB-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
            <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
              <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
                <Option v-for="(Item, Index) in SearchKeyTypeDrop" :key="Index" :value="$Enums.Product.SkuSearchType[Item]">{{Item}}</Option>
              </Select> -->
              <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <Button type="warning" @click="ResetList()">重置</Button>
        </Form>
      </Col>
      <Col span="24" class="P-PL-10">
        <Button v-if="Powers.SkuExport" class="P-MB-10 P-MR-10" type="primary" @click="HandleExportSku">导出SKU</Button>
        <ImportSku 
          :Powers="Powers"
        />
        <SettingSku 
          ref="SettingSku"
          :Powers="Powers"
          :Tree="Tree"
          @handle-res-msg="HandleSettingSku"
        />
        <!-- SKU -->
        <ModifySku
          v-if="Powers.SkuModify || Powers.SkuCreate"
          ref="ModifySku"
          :DropAttribute="DropAttribute"
          :DropPurchaser="DropPurchaser"
          :DropDevManager="DropDevManager"
          :DropSaleManager="DropSaleManager"
          :DropBrand="DropBrand"
          :Tree="Tree"
          @handle-res-msg="HandleModifySku"
        />
      </Col>
      <Col span="24" class="P-MB-10 P-PL-10">
        <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
      </Col>
      <Col span="24" class="P-PL-10">
        <Page :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
      </Col>
      <ShowBigPic ref="ShowBigPic" />
      <!-- SKU详情 -->
      <SkuDetail ref="SkuDetail" />
      <!-- 查看销量 -->
      <SkuSaleVolume ref="SkuSaleVolume" />
      <!-- 编辑供应商 -->
      <EnableSupplier
        ref="EnableSupplier" 
        :AddCityList="CityTrees"
        @emit-eable-supplier="CloseEnableSupplier" 
      />
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';
import ExpandRow from './SkuManage_Expand.vue';

@Component({
  name: 'SkuManage',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    EnableSupplier: () => import('@/components/Public/EnableSupplier.vue'),
    SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue'),
    SettingSku: () => import('@/components/Product/Sku/SettingSku.vue'),
    ImportSku: () => import('@/components/Product/Sku/ImportSku.vue'),
    ModifySku: () => import('@/components/Product/Sku/ModifySku.vue'),
    SkuSaleVolume: () => import('@/components/Product/Sku/SkuSaleVolume.vue'),
	}
})

export default class SkuManage extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
    this.$UI.Loading.Show();
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['SkuModify','SkuExport','SkuSetBrand', 'SkuSetStatus', 'SkuSetCategory', 'SkuSetPurchase', 'SkuSetSaleManager', 'SkuSetDevManager', 'SkuCreate', 'SkuImport', 'SkuStatusImport', 'UpdDefaultSupply', 'BatchAddTag']))
    this.$set(this, 'DropAttribute', await this.GetDropList<string, PInterface.KV[]>(this.$Server.Purchase, this.$Api.AttributeDropList, '') )
    this.$set(this, 'DropDevUser', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '开发员' ))
    this.$set(this, 'DropPurchaser', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '采购员' ))
    this.$set(this, 'DropDevManager', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '产品经理' ))
    this.$set(this, 'DropSaleManager', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '销售主管' ))
    this.$set(this, 'DropBrand', await this.GetDropList<string, PInterface.KV>(this.$Server.Purchase, this.$Api.BrandDropList, '' ))
    await this.GetTree()
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
    let Drops: PInterface.KV[] = [];
    this.Powers.SkuModify ? Drops.push({ Key: '编辑', Value: 0 }): null;
		Drops.push({ Key: '查看', Value: 1 })
		Drops.push({ Key: '查看销量', Value: 2 })
    this.Powers.UpdDefaultSupply ? Drops.push({ Key: '编辑供应商', Value: 3 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
  }
  
  // 获取 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (Res.IsSuccess) {
            resolve(Res.Data.DropList)
		  		} else {
           this.$Request.Error(Res);
		  		}
		  		
		  	}
	  	})
    })
  }

  // 收缩展示
  private IsShowTreeLeft():void {
    this.ControllViewSpan = this.ControllViewSpan === 1 ? this.ControllViewSpan += 2 :this.ControllViewSpan -= 2;
  }

  // 获取省市区树
	private GetAreaTree(CallBack?: any): void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ProvincialAreasGetTree,
				Login: false
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'CityTrees', Res.Data.Tree);
          this.SetTreeMenu(this.CityTrees)
          if (CallBack) CallBack()
				} else {
					this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
			}
		})
  }
  
	//组装成级联菜单所要的数据结构
	private SetTreeMenu(Data: PInterface.AreaTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id);
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetTreeMenu(Data[Item].children);
			}
		}
	}

  // 获取组织架构树
  private GetTree(): void {
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.CategoryGetCategoryTree,
				Login: true
			},
			Data: true,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this, 'Tree', Res.Data.Tree)
          this.IntegratedData(this.Tree)
				} else {
					this.$Request.Error(Res);
				}
			}
		})
  }

  // 整合成树组件、级联菜单需要的数据结构以及默认打开树激活节点
  private IntegratedData(Data: PInterface.ProductCagtegoryTree[]):void{
    Data.forEach((Item: PInterface.ProductCagtegoryTree) => {
      this.$set(Item, 'title', Item.Name)
      this.$set(Item, 'children', Item.ChildNodes)
      this.$set(Item, 'ParentId', Item.ParentId.toString())
      this.$set(Item, 'value', Item.Id.toString())
      this.$set(Item, 'label', Item.Name)
      if ( Item.ChildNodes.length > 0 ) {
        this.IntegratedData(Item.ChildNodes)

        for ( let i = 0; i < Item.ChildNodes.length; i++ ) {
          if ( this.CurrTreeDomId.length > 0 ) {
            if ( Item.ChildNodes[i].Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1]) ) {
              this.$set(Item.ChildNodes[i], 'selected', true)
            }else if(Item.Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1])){ //第一级激活状态
              this.$set(Item, 'selected', true)
            }

            for(let j = 0; j < this.CurrTreeDomId.length; j++){     //展开激活的树节点
              if( Item.ChildNodes[i].Id == Number(this.CurrTreeDomId[j] )){
                this.$set(Item.ChildNodes[i], 'expand', true)
                this.$set(Item, 'expand', true)
              }
            }
          }
        }
      }
    })
  }

  //点击左侧树节点
  private SelectTree(Node: PInterface.ProductCagtegoryTree, Root: []):void{
    // 判断是否为根 子节点
    if ( Number(Node.ParentId) === 0){
      this.$set(this, 'CurrTreeDomId', [this.CurTreeId.toString()])
    } else{
      this.$set(this, 'CurrTreeDomId', []);
      this.GetParentId(Root, Node);
    }
    // 父ID
    const Index:number = this.CurrTreeDomId.length === 1 ? 0 : this.CurrTreeDomId.length - 1
    this.$set(this.SearchForm, 'CategoryId', this.CurrTreeDomId[Index])
    this.GetList()
  }

  // 获取子节点的父节点，递归直至父节点为0，组合为数组
  private GetParentId(Root: any[], Node: PInterface.ProductCagtegoryTree):void{
    // 插入当前节点Id
    this.CurrTreeDomId.unshift( Node.Id.toString() );

    // 父节点为0结束
    if (Node.ParentId === 0 ) return

    // 查找父节点
    for (let item in Root ) {
      if(Root[item].node.Id === Node.ParentId) {
        this.GetParentId(Root, Root[item].node)
      }
    }
  }

  // 树结构 Render方法
  private RenderContent(h: any, { root, node, data }: any):any {
    // 存储根节点
    if (this.TreeRoot.length === 0) this.$set(this, 'TreeRoot', root);
    return h('span', {
      style: {
        display: 'inline-block'
      },
      class: 'P-ML-10 Tree-BtnGroup P-Pointer'
    }, [
      h('span', {  
        attrs: {
          dataKey: `${node.nodeKey}`
        },
        style: { verticalAlign: 'middle' },
        class: 'P-P-5 Tree-Text',
        on: {
          click: () => {
            // 树样式
            document.querySelectorAll(`.Tree-Text`).forEach( (Elem: Element):void => Elem.classList.remove("Tree-Active"));
            if (this.LastActiveNodeKey !== node.nodeKey) {
              (document.querySelector(`span[datakey='${node.nodeKey}']`) as Element).classList.add("Tree-Active");
              this.LastActiveNodeKey = node.nodeKey
            } else {
              this.LastActiveNodeKey = 0
            }
            this.CurTreeId = this.CurTreeId === data.Id ? 0 : data.Id
            this.SelectTree(data, root)
          },
      }}, data.title),
    ]);
  }

  // 获取列表数据
  private GetList(): void {
    this.$UI.Loading.Show();

    this.$set(this, 'List', []);
    
    const PostData: any = JSON.parse(JSON.stringify(this.SearchForm));
    PostData.Attribute = PostData.Attribute.length > 0 ? JSON.stringify(PostData.Attribute) : '';
    PostData.IsBindSku = PostData.IsBindSku === 1 ? true : PostData.IsBindSku === 2 ? false : ''

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SkuGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: PostData},
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
  private GetSelected(data: Interface.SkuManageList[] ): void{
    this.$set(this, 'Selected', data)
  }

	// 取消全选
  private CancelSelect():void {
    (this.$refs["Table"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 搜索
  private SearchList(): void{
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	// 重置
	private ResetList(): void{
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.SkuManageSearch())
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
		let Flag: number = 210;
		for(let item in this.Powers){
			if(this.Powers[item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }	

  // 列表操作列 
  // 0-编辑 1-查看 2-查看销量 3-编辑供应商
  private OperateGroup(Type:number, Idx?:number, OtherList?: Interface.SkuManageList[]): void{
    if (typeof Idx === 'number') {
      this.CancelSelect()
      this.$set(this, 'Selected', typeof OtherList === 'undefined' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : [JSON.parse(JSON.stringify(OtherList[Idx]))]);
    }
    switch(Type){
      case 0:
        (this.$refs['ModifySku'] as Vue).Trigger(this.Selected);
        break;
      case 1:
        (this.$refs['SkuDetail'] as Vue).Trigger(this.Selected[0].SkuCode);
        break;
      case 2:
        (this.$refs['SkuSaleVolume'] as Vue).Trigger(this.Selected[0].Id);
        break;
      case 3:
        this.ChooseSupplyIndex = (Idx as number);
        (this.$refs["EnableSupplier"] as any).TriggerModal(false, this.IsLoadingEnableTab, false)
        break;
    }
  }

  // 导出SKU
  private HandleExportSku(): void {
    if (this.Selected.length === 0) {
      this.$UI.Tips.Floating('warning', '请选择SKU进行导出操作');
      return;
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.SkuExport,
        Login: true
      },
      Data: this.Selected.map(Item => Item.Id),
      Callback: (res: PInterface.Res): void => {
        if (res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type:'confirm',
            Content:'创建导出SKU任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。',
            Enter:false,
            Callback:(bool:boolean):void=>{ }
          })
          this.CancelSelect();
        } else {
          this.$Request.Error(res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  // 设置状态组 1'品牌', 2'状态', 3'品类', 4'采购员', 5'销售主管', 6'产品经理'
  private HandleSettingSku(Type: number): void {
    if (Type === 0) {
      this.GetList();
      this.CancelSelect()
    } else {
      const CurrentDrop: PInterface.KV[]= [this.DropBrand, [], [], this.DropPurchaser, this.DropSaleManager, this.DropDevManager, this.DropAttribute][Type - 1];
      ( this.$refs['SettingSku'] as Vue ).Trigger(this.Selected, CurrentDrop);
    }
  }

  // 添加捆绑SKU - 编辑SKU
  private HandleModifySku(Type: number): void {
    if (Type === 1) {
      this.GetList();
      this.CancelSelect()
    } 
  }

  // 选择供应商 回调
  private CloseEnableSupplier(Res: boolean, IsLoadingTab: boolean, SelectData: Interface.Supplier[]): void{
    this.IsLoadingEnableTab = IsLoadingTab;
    if (Res) {
      this.$UI.Loading.Show();

      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.UpdDefaultSupply,
          Login: true
        },
        Data: { 
          Id: [this.List[this.ChooseSupplyIndex].Id],
          SupplyId: SelectData[0].Id
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$UI.Tips.Floating("success", "修改供应商成功");
            this.GetList()
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }
  }

  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }
  
  // 打开大图
  private ShowPic(Url: string): void {
    (this.$refs['ShowBigPic'] as any).Trigger(Url)
  }

  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限
  private AccurateSearch: Boolean = false; // 精准搜索
  
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.SkuManageSearch = new Interface.SkuManageSearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.SkuSearchType) // 搜索关键词

  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); // 状态枚举下拉
  private DropAttribute: PInterface.KV[] = []; // 特性标签下拉
  private DropDevUser: PInterface.KV[] = [];  // 开发员下拉
  private DropPurchaser: PInterface.KV[] = []; // 采购员下拉
  private DropDevManager: PInterface.KV[] = []; // 产品经理下拉
  private DropSaleManager: PInterface.KV[] = []; // 销售主管下拉
  private DropBrand: PInterface.KV[] = []; // 品牌下拉
  private DropPlatform: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform); // 平台
  private DropSkuIsBind: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.SkuIsBind); // 状态

  private IsLoadingEnableTab: boolean = true;  //打开添加供应商时是否加载表格数据
  private CityTrees:PInterface.AreaTree[] = []; //地区下拉数据
  private ChooseSupplyIndex: number = 0;  // 被选中的供应商下标

  private TreeRoot: any[] = []; // 树 根存储 
  private Tree: PInterface.ProductCagtegoryTree[] = [] //左侧树数据
  private CurrTreeDomId: string[] = []  // 当前编辑数据的父节点Id数组(左侧树激活状态节点Id)
  private CurTreeId: number = 0; // 当前选中树节点ID
  private LastActiveNodeKey: number = 0; // 记录上一位点击的树节点

  private ControllViewSpan: number = 3; //

  private Selected: Interface.SkuManageList[] = []; // 列表选中数据
  private List: Interface.SkuManageList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { type: 'expand', width: 50, render: (h: any, Params: any): string => {
      return h(ExpandRow, {
        props: {
          Row: Params.row,
          OperateDrop: this.OperateDrop
        },
        style: {
          border: 'none',
        },
        on: {
          operate: (Type:number, Idx?:number, OtherList?: Interface.SkuManageList[]) => {
            this.OperateGroup(Type, Idx, OtherList);
          }
        }
      })
    }},
		{ title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, Params) => {
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
      return h('Tooltip', {
        props: {
          'content': (Params.row as any).SkuName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent',
        
      }, [
        h('a', {
          on: {
            click:() => {
              this.OperateGroup(1, Params.row._index)
            }
          }
        }, (Params.row as any).SkuCode),
        h('p', {
          class: 'P-MT-5'
        }, (Params.row as any).SkuName )
      ])
    }},
    { title: '品类/特性标签', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "品"),
          h('span', (Params.row as any).CategoryName )
        ]),
        h('p', { class: 'P-LINE-1' }, [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "特"),
          h('span',  (Params.row as any).Attribute )
        ])
      ])
    }},
    { title: '供应商/采购价', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          'content': `【供应商】${(Params.row as any).DefaultSupply.SupplyName === null ? '暂无供应商': (Params.row as any).DefaultSupply.SupplyName}`,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "供"),
          h('span', (Params.row as any).DefaultSupply.SupplyName )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
          h('span', `${(Params.row as any).DefaultSupply.PurchasePrice}${(Params.row as any).DefaultSupply.CurrencyCode}` )
        ])
      ])
    }},
    { title: '体积(cm³)/毛重(g)/净重(g)', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "体"),
          h('span', `${ (Params.row as any).Length }*${ (Params.row as any).Width }*${ (Params.row as any).Height }`)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "毛"),
          h('span', (Params.row as any).GrossWeight )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "净"),
          h('span', (Params.row as any).NetWeight )
        ])
      ])
    }},
    { title: '开发员/采购员/销售主管', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "开"),
          h('span', (Params.row as any).DevUserName )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
          h('span', (Params.row as any).Purchaser )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "销"),
          h('span', (Params.row as any).SaleManager )
        ])
      ])
    }},
		{ title: '创建时间', width: 160, key: 'CreateTime', render: (h: any, Params: any): string => h('div', {}, this.$UI.Render.Date( Params.row.CreateTime, true)) },
    { title: '状态', key: 'IsEnable', width: 120,
      render: (h: any, Params: any): string => {
			  return h('Tag', {
          props: { color: ['primary', 'primary', 'success', 'primary', 'warning', 'error', 'primary', 'warning'][(Params.row as any).Status - 1] }
        }, this.$Enums.Warehouse.SkuStatus[(Params.row as any).Status] )
      }
    },
    { title: '操作', width: 100, render: (h: any, Params: any): string => {
        return h('Dropdown',{
					on: {
            'on-click': (Type: any) => {
              this.OperateGroup(Type, Params.row._index)
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
						}, Item.Key);
					}))
				])
      }
    }
  ];
}
</script>

<style lang="less">
@import '~@/assets/Theme/Color.less';
.ivu-menu-dark{
  background-color: @primary-color;
}
.Categrory-View {
  
  .Row-Transition{
    transition:all 0.2s linear;
  }
  .Row-Transition-Fade{
    opacity: 0;
  }
  .ivu-col-span-1 {
    transition:all 0.2s linear;
  }

  .ivu-col-span-3{
    transition:all 0.2s linear;
  }

  .ivu-col-span-21{
    transition:all 0.2s linear;
  }
  
  .ivu-col-span-23 {
    transition:all 0.2s linear;
  }

  .Tree-Title {
    height: 30px;
    line-height: 30px;
    display: block;
  }
  .Icon-Transition{
    transition:all 0.2s linear;
  }
  .Icon-Transition-Right{
    margin: 0 0 0 85%;
  }
  .Icon-Transition-Center{
    margin: 0 0 0 38%;
  }

  .Tree-Wrap{
    height: 83vh;
    overflow: auto;
  }

  .Tree-BtnGroup:hover {
    & > .Tree-Btn {
      display: inline-block !important;
    }
  }
  .Tree-Hover {
    color: @info-color;
  }
  .Tree-Active {
    background: @primary-color;
    color: @white;
    border-radius: 5px;
  }
}





</style>