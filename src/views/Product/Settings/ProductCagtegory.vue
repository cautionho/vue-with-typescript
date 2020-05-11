<!-- 类目管理 -->
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
      <Col span="24" class="P-PL-10">
        <ModifyProductCagtegory 
          ref="ModifyProductCagtefory"
          v-if="Powers.ProCategoryCreate || Powers.ProCategoryModify" 
          @handle-res-msg="HandleResMsg" 
        />
        <ChangeStatus 
          ref="ChangeStatus"
          class="P-MB-10" 
          v-if="Powers.ProCategoryStatus" 
          @emit-change="EmitChange"
        />
      </Col>
      <Col span="24" class="P-MB-10 P-PL-10">
        <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
      </Col>
      <Col span="24" class="P-PL-10">
        <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
      </Col>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';

@Component({
  name: 'ProductCagtegory',
  components: {
    ModifyProductCagtegory: () => import('@/components/Product/Settings/ModifyProductCagtegory.vue'),
    ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
	}
})

export default class ProductCagtegory extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
		this.$UI.Loading.Show();
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ProCategoryCreate','ProCategoryModify','ProCategoryStatus']))
    await this.GetTree()
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.ProCategoryModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
    this.Powers.ProCategoryStatus ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

  // 收缩展示
  private IsShowTreeLeft():void {
    this.ControllViewSpan = this.ControllViewSpan === 1 ? this.ControllViewSpan += 2 :this.ControllViewSpan -= 2;
  }

  // 获取组织架构树
  private GetTree(): void {
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
			}
		})
  }

  // 整合成树组件、级联菜单需要的数据结构以及默认打开树激活节点
  private IntegratedData(Data: PInterface.ProductCagtegoryTree[]):void{
    Data.forEach((item: PInterface.ProductCagtegoryTree) => {
      this.$set(item, 'title', item.Name)
      this.$set(item, 'children', item.ChildNodes)
      this.$set(item, 'value', item.Id.toString())
      this.$set(item, 'label', item.Name)
      if ( item.ChildNodes.length > 0 ) {
        this.IntegratedData(item.ChildNodes)

        for ( let i = 0; i < item.ChildNodes.length; i++ ) {
          if ( this.CurrTreeDomId.length > 0 ) {
            if ( item.ChildNodes[i].Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1]) ) {
              this.$set(item.ChildNodes[i], 'selected', true)
            }else if(item.Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1])){ //第一级激活状态
              this.$set(item, 'selected', true)
            }

            for(let j = 0; j < this.CurrTreeDomId.length; j++){     //展开激活的树节点
              if( item.ChildNodes[i].Id == Number(this.CurrTreeDomId[j] )){
                this.$set(item.ChildNodes[i], 'expand', true)
                this.$set(item, 'expand', true)
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
    if ( Node.ParentId === 0){
      this.$set(this, 'CurrTreeDomId', [this.CurTreeId.toString()])
    } else{
      this.$set(this, 'CurrTreeDomId', []);
      this.GetParentId(Root, Node);
    }
    // 父ID
    this.$set(this.SearchForm, 'ParentId', Number(this.CurrTreeDomId[ this.CurrTreeDomId.length - 1 ]))

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
    
    this.$set(this.SearchForm, 'IsEnable', this.SearchForm.SearchKeyType === '' ? '' : [false, true][this.SearchForm.SearchKeyType] );

    const PostData: any = JSON.parse(JSON.stringify(this.SearchForm));

    delete PostData.SearchKeyType

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.CategoryGetCategoryList,
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
  private GetSelected(data: Interface.ProductCagtegoryList[] ): void{
    this.$set(this, 'Selected', data)
  }

	// 取消全选
  private CancelSelect():void {
    (this.$refs["Table"] as any).selectAll(false);
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
		this.$set(this, 'SearchForm', new Interface.ProductCagtegorySearch())
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
  // 1-编辑用户 2-重置密码
  private OperateGroup(Type:number, Idx?:number): void{
    if (Idx) {
      this.CancelSelect()
      this.$set(this, 'Selected', [JSON.parse(JSON.stringify(this.List[Idx]))] );
    }
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : []);
    switch(Type){
      case 1:
        (this.$refs['ModifyProductCagtefory'] as Vue).Trigger({
          Selected: this.Selected,
          Tree: this.Tree,
          CurrTreeDomId: this.CurrTreeDomId
        })
        break;
      case 2:
        this.ChangeStatusObj.ToTarget = !this.Selected[0].IsEnable;
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
      this.GetTree()
      this.GetList()
    }
  }
  // 状态回调
  private EmitChange(Res: boolean, Type?: number){
		if(Type !== undefined){
      this.ChangeStatusObj.ToTarget = Type === 1 ? true : false;
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
  private SearchForm: Interface.ProductCagtegorySearch = new Interface.ProductCagtegorySearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 搜索关键词

  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Purchase, Api: this.$Api.CategoryChangeStatus, IdKey: 'Id', StatusKey: 'Status', ToTarget: false, TipsKey: '品类' };  //禁启用

  private TreeRoot: any[] = []; // 树 根存储 
  private Tree: PInterface.ProductCagtegoryTree[] = [] //左侧树数据
  private CurrTreeDomId: string[] = []  // 当前编辑数据的父节点Id数组(左侧树激活状态节点Id)
  private CurTreeId: number = 0; // 当前选中树节点ID
  private LastActiveNodeKey: number = 0; // 记录上一位点击的树节点

  private ShowUserModal: boolean = false; // 模态框 - 添加/编辑 

  private ControllViewSpan: number = 3; //

  private Selected: Interface.ProductCagtegoryList[] = []; // 列表选中数据
  private List: Interface.ProductCagtegoryList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '类目编号', key: 'CategoryCode' },
		{ title: '类目名称', key: 'CategoryName'},
		{ title: '采购员名称', key: 'PurchaseUserName' },
		{ title: '添加时间', key: 'CreateTime', render: (h: any, params: any): string => h('div', {}, this.$UI.Render.Date( params.row.CreateTime, true)) },
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