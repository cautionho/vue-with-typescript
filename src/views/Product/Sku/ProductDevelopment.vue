<!-- 新品开发 -->
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
                <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.Status" :options="DropStatus" />
                <Select class="P-W-400 P-ML-10" placeholder="特性标签" v-model="SearchForm.Attribute" :options="DropAttribute" multiple />
                <Select class="P-W-200 P-ML-10" placeholder="开发员" v-model="SearchForm.DevUserId" :options="DropDevUser" />
                <Select class="P-W-200 P-ML-10" placeholder="产品经理" v-model="SearchForm.DevManager" :options="DropDevManager" />
                <Select class="P-W-200 P-ML-10" placeholder="销售主管" v-model="SearchForm.SaleManager" :options="DropSaleManager" />
                <Select class="P-W-200 P-ML-10" placeholder="平台" v-model="SearchForm.Platfrom" :options="DropPlatform" />
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.DevBeginDate" type="date" placeholder="入职开始日期"></DatePicker>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.DevEndDate" type="date" placeholder="入职结束日期"></DatePicker>
              </Col>
            </Dropdown>
          </FormItem>
          <FormItem class="P-MB-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
              <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
              <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <Button type="warning" @click="ResetList()">重置</Button>
        </Form>
      </Col>
      <Col span="24" class="P-PL-10">
        <ModifyProductDev 
          ref="ModifyProductDev"
          v-if="Powers.ProductCreate || Powers.ProductModify" 
          @handle-res-msg="HandleResModify" 
        />
        <!-- 提交审核 -->
        <ProductDevToReview class="P-MB-10"
          v-if="Powers.ProductToReview"
          :SelectedData="Selected"
          @handle-res-msg="HandleToReview"
        />
        <!-- 退回修改-->
        <ProductDevBackModify class="P-MB-10"
          ref="ProductDevBackModify"
          v-if="Powers.ProductDevBackModify"
          @handle-res-msg="HandleReviewProductDev"
        />
        <!-- 通过-->
        <ProductDevPass class="P-MB-10"
          ref="ProductDevPass"
          v-if="Powers.ProductReview"
          @handle-res-msg="HandleReviewProductDev"
        />
        <!-- 不通过 -->
        <ProductDevNoPass class="P-MB-10"
          ref="ProductDevNoPass"
          v-if="Powers.ProductReviewNoPass"
          @handle-res-msg="HandleReviewProductDev"
        />
      </Col>
      <Col span="24" class="P-MB-10 P-PL-10">
        <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
      </Col>
      <Col span="24" class="P-PL-10">
        <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
      </Col>
    </Col>
    <ShowBigPic ref="ShowBigPic" />
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';

@Component({
  name: 'ProductDevelopment',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    ModifyProductDev: () => import('@/components/Product/Sku/ModifyProductDev.vue'),
    ProductDevPass: () => import('@/components/Product/Sku/ProductDevPass.vue'),
    ProductDevToReview: () => import('@/components/Product/Sku/ProductDevToReview.vue'),
    ProductDevBackModify: () => import('@/components/Product/Sku/ProductDevBackModify.vue'),
    ProductDevNoPass: () => import('@/components/Product/Sku/ProductDevNoPass.vue'),
	}
})

export default class ProductDevelopment extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ProductCreate','ProductModify','ProductToReview', 'ProductReview', 'ProductDevBackModify', 'ProductReviewNoPass']))
    this.$set(this, 'DropAttribute', await this.GetDropList<string, PInterface.KV[]>(this.$Server.Purchase, this.$Api.AttributeDropList, '') )
    this.$set(this, 'DropDevUser', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '开发员' ))
    this.$set(this, 'DropDevManager', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '产品经理' ))
    this.$set(this, 'DropSaleManager', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '销售主管' ))
    await this.GetTree()
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [{ Key: '查看', Value: 0 }];
		this.Powers.ProductModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
    this.Powers.ProductReview ? Drops.push({ Key: '审核', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
  }
  
  // 获取 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$UI.Loading.Show();
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
		  		this.$UI.Loading.Hide();
		  	}
	  	})
    })
  }

  // 收缩展示
  private IsShowTreeLeft():void {
    this.ControllViewSpan = this.ControllViewSpan === 1 ? this.ControllViewSpan += 2 :this.ControllViewSpan -= 2;
  }

  // 获取组织架构树
  private GetTree(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
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
				this.$UI.Loading.Hide();
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

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.ProductGetList,
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
  private GetSelected(data: Interface.ProductDevList[] ): void{
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
		this.$set(this, 'SearchForm', new Interface.ProductDevSearch())
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
  // 0-查看 1-编辑 2-审核
  private OperateGroup(Type:number, Idx?:number): void{
    if (typeof Idx === 'number') {
      this.CancelSelect()
      this.$set(this, 'Selected', [JSON.parse(JSON.stringify(this.List[Idx]))] );
    }
    switch(Type){
      case 0:
      case 1:
      case 2:
        (this.$refs['ModifyProductDev'] as Vue).Trigger({
          SelectedData: this.Selected,
          DropAttribute: this.DropAttribute,
          DropDevUser: this.DropDevUser,
          DropDevManager: this.DropDevManager,
          DropSaleManager: this.DropSaleManager,
          Tree: this.Tree,
          ModifyStatus: Type === 1, // true编辑
          IsReview: Type === 2 
        })
        break;
    }
  }

  // 提交审核 子组件回调
  // 0 - 取消， 1 - 成功
  private HandleToReview(Type: number): void {
    this.CancelSelect()
    if (Type == 1) {
      this.GetList()
    }
  }
 
  // 新品开发
  // 0 - 取消， 1 - 编辑或添加成功 2 - 触发打开模态框
  private HandleResModify(Type: number){
    this.CancelSelect()

    if(Type == 1){
      this.GetList()
    }else if(Type == 2){
      this.OperateGroup(1)
    }
  }

   //控制列表操作列下拉按钮显示隐藏
	private ControlOpera(OpeIndex:number, RowData: Interface.ProductDevList): string{
    switch (OpeIndex) {
      case 0: return 'block';
      case 1: return RowData.Status === 1 ? 'block' : 'none';
      case 2: return RowData.Status === 2 ? 'block' : 'none';
      default: return 'none';
    }
  }

  // 提交修改，通过，不通过 子组件回调
  private HandleReviewProductDev(IsSub: boolean, TypeString: string): void {
    if (IsSub) {
      this.GetList();
    } else {
      switch(TypeString) {
        case 'ReturnEdit': (this.$refs["ProductDevBackModify"] as Vue).Trigger(this.Selected);break;
        case 'ErrorEdit': (this.$refs["ProductDevNoPass"] as Vue).Trigger(this.Selected);break;
        case 'SuccessEdit': (this.$refs["ProductDevPass"] as Vue).Trigger(this.Selected);break;
      }
    }
  }

  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }
  
  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }

  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限
  private AccurateSearch: Boolean = false; // 精准搜索
  
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.ProductDevSearch = new Interface.ProductDevSearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.NewSearchType) // 搜索关键词

  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.NewStatus); // 状态枚举下拉
  private DropAttribute: PInterface.KV[] = []; // 特性标签下拉
  private DropDevUser: PInterface.KV[] = [];  // 开发员下拉
  private DropDevManager: PInterface.KV[] = []; // 产品经理下拉
  private DropSaleManager: PInterface.KV[] = []; // 销售主管下拉
  private DropPlatform: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform); // 平台

  private TreeRoot: any[] = []; // 树 根存储 
  private Tree: PInterface.ProductCagtegoryTree[] = [] //左侧树数据
  private CurrTreeDomId: string[] = []  // 当前编辑数据的父节点Id数组(左侧树激活状态节点Id)
  private CurTreeId: number = 0; // 当前选中树节点ID
  private LastActiveNodeKey: number = 0; // 记录上一位点击的树节点

  private ControllViewSpan: number = 3; //

  private Selected: Interface.ProductDevList[] = []; // 列表选中数据
  private List: Interface.ProductDevList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '编号', key: 'Id', width: 100, render: (h, params) => {
      return h('span', {
        class: 'P-Pointer',
        on: {
          click: () => {
            this.OperateGroup(0, params.row._index)
          }
        }
      }, (params.row as any).Id)
    }},
		{ title: '图片', key: 'ImageUrl', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + params.row.ImageUrl + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.ImageUrl)
            }
          }
        })
      }
    },
    { title: '产品名', render: (h: any, params: any): string => {
      return h('Tooltip', {
        props: {
          'content': (params.row as any).ProductName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', {
          class: 'P-MT-5'
        }, (params.row as any).ProductName ),
      ])
    }},
    { title: '新品属性', render: (h: any, params: any): string => {
      return h('div', params.row.PropertyList.map((Item: any) => {
        return h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, `${Item.PropertyName}`),
          h('span', `${Item.PropertyCount}种`)
        ])
      }))
    }},
    { title: '采购价/竞品价/预售价', width: 200, render: (h: any, params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
          h('span', `${ (params.row as any).PurchasePrice }(${ (params.row as any).PPCurrencyCode })`)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "竞"),
          h('span', `${ (params.row as any).MatchPrice }(${ (params.row as any).MPCurrencyCode })`)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "预"),
          h('span', `${ (params.row as any).SalePrice }(${ (params.row as any).SPCurrencyCode })`)
        ])
      ])
    }},
    { title: '采购链接/竞品链接', width: 200, render: (h: any, params: any): string => {
      const HasMatchHttp = params.row.MatchUrl.startsWith('http://') || params.row.MatchUrl.startsWith('https://');
      const HasPurchaseHttp = params.row.PurchaseUrl.startsWith('http://') || params.row.PurchaseUrl.startsWith('https://');
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
          h('a', {
            attrs: {
              href: HasPurchaseHttp ? params.row.PurchaseUrl : `http://${params.row.PurchaseUrl}`,
              target: '_blank'
            }
          }, '点击跳转')
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "竞"),
          h('a', {
            attrs: {
              href: HasMatchHttp ? params.row.MatchUrl : `http://${params.row.MatchUrl}`,
              target: '_blank'
            }
          }, '点击跳转')
        ])
      ])
    }},
		{ title: '开发员', key: 'Operator' },
		{ title: '重量(g)', key: 'Weight'},
		{ title: '开发时间', width: 160, key: 'OperateTime', render: (h: any, params: any): string => h('div', {}, this.$UI.Render.Date( params.row.OperateTime, true)) },
    { title: '状态', key: 'IsEnable', width: 120,
      render: (h: any, params: any): string => {
			  return h('Tag', {
          props: { color: ['primary', 'primary', 'success', 'error'][(params.row as any).Status - 1] }
        }, this.$Enums.Product.NewStatus[(params.row as any).Status] )
      }
    },
    { title: '操作', width: 100, render: (h: any, params: any): string => {
        return h('Dropdown',{
					on: {
            'on-click': (Type: any) => {
              this.OperateGroup(Type, params.row._index)
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
							style: { display: this.ControlOpera(Number(Item.Value), params.row) },
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
    height: calc(100vh - 165px);
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