<template>
	<div class="Resources-Menu">
    <Col :span="SpanLeft">
      <div class="Resources-Tree P-Inline-Block">
        <div class="Matters-Title P-Text-White P-BG-Info P-MB-10">
          <div class="P-Inline-Block Switch-Tree P-BG-Info P-Float-Right"><Icon type="md-list" size="16" @click="TriggleShowTree" class="P-Pointer P-Text-White"/></div>
        </div>
        <Tree :data="Tree" @on-select-change="SelectTree" class="P-Inline-Block TreeWrap" v-show="SpanRight!==23"></Tree>
      </div>
      
    </Col>
    <Col :span="SpanRight" class="P-PL-10">
      <Col span="24">
        <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
          <FormItem class="P-MB-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
            <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :onChange="OnClearSelect.bind(this, 'SearchType')" v-model="SearchForm.SearchType" :options="SearchKeyTypeDrop" />
            <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchType')" v-model="SearchForm.SearchType" filterable clearable>
              <Option v-for="(item,index) in SearchKeyTypeDrop" :value="$Enums.Setting.ResourcesType[item]" :key="index">{{item}}</Option>
            </Select> -->
            <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <FormItem class="P-ML-10 P-MB-10">
            <Button type="warning" @click="ResetList">重置</Button>
          </FormItem>
        </Form>
      </Col>
      <Col span="24">
        <ModifyResources ref="ModifyResources" class="P-MB-10" v-if="Powers.ResourceAdd || Powers.ResourceModify" :Power="Powers.ResourceAdd" :TreeMenu="Tree" @handle-res-msg="HandleResMsg"></ModifyResources>
        <ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.ResourceStatus" @emit-change="EmitChange" ></ChangeStatus>
      </Col>
      <Col span="24" class="P-MB-10">
        <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="ResourceTable"></Table>
      </Col>
      <Col span="24">
        <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
      </Col>
    </Col>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Setting';

@Component({
  name: 'ResourcesMenu',
  components: {
    ChangeStatus: () => import('../../components/Public/ChangeStatus.vue'),
    ModifyResources: () => import('../../components/Settings/ModifyResources.vue')
	}
})
export default class ResourcesMenu extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ResourceAdd', 'ResourceModify', 'ResourceStatus']))
    this.SetOperateDrop()
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(s: string):void{
    if( (this as any).SearchForm[s] == undefined ){
      this.$set(this.SearchForm, s, '');
    }
  }

  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
    this.Powers.ResourceModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
    this.Powers.ResourceStatus ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
    this.GetTree();
  }

  //显示/隐藏左侧树列表
  private TriggleShowTree():void{
    this.$set(this, 'SpanRight', this.SpanRight == 21 ? 23 : 21)
    this.$set(this, 'SpanLeft', this.SpanLeft == 3 ? 1 : 3)
  }
  
  //获取左侧树结构数据
  private GetTree(S?:boolean): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.MenuTree,
				Login: true
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this, 'Tree', Res.Data.Tree)
          this.IntegratedData(this.Tree)
				} else {
					this.$Request.Error(Res);
				  this.$UI.Loading.Hide();
        }
        if(!S){
          this.GetList();
        }
			}
    })
  }

  //整合成树组件、级联菜单需要的数据结构以及默认打开树激活节点
  private IntegratedData(Data: Interface.Resources[]):void{
    Data.forEach((item: Interface.Resources) => {
      this.$set(item, 'title', item.ResourceName)
      this.$set(item, 'children', item.ChildNods)
      this.$set(item, 'value', item.Id.toString())
      this.$set(item, 'label', item.ResourceName)
      if(item.ChildNods.length > 0){
        this.IntegratedData(item.ChildNods)

        for(let i=0; i<item.ChildNods.length; i++){
          if(this.CurrTreeDomId.length > 0){
            if(item.ChildNods[i].Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1])){
              this.$set(item.ChildNods[i], 'selected', true)
            }else if(item.Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1])){ //根节点选中状态
              this.$set(item, 'selected', true)
            }

            for(let j=0; j<this.CurrTreeDomId.length; j++){     //展开激活的树节点
              if(item.ChildNods[i].Id == Number(this.CurrTreeDomId[j])){
                this.$set(item.ChildNods[i], 'expand', true)
              }else if(item.Id == Number(this.CurrTreeDomId[j])){ //根节点选中状态
                this.$set(item, 'expand', true)
              }
            }
          }
        }
      }
    })
    // this.$UI.Loading.Hide();
  }

  //点击左侧树节点
  private SelectTree(Val: Interface.Resources[]):void{
    this.$set(this.SearchForm, 'ParentId', Val.length > 0 ? Val[0].Id : 0)
    if(Val.length > 0){
      this.$set(this, 'CurrTreeDomId', [Val[0].Id.toString()]);
      this.GetParentId(this.Tree, Val[0].ParentId);
    } else{
      this.$set(this, 'CurrTreeDomId', [])
    }
    this.$set(this.Pager, 'PageIndex', 1);
    this.GetList()
  }

  //获取当前左侧树激活的Id
  private GetParentId(TreeList: Interface.Resources[], Id: Number):void{
    for (let item in TreeList) {
      if (TreeList[item].Id == Id) {
        this.CurrTreeDomId.unshift(TreeList[item].value.toString());
        this.GetParentId(this.Tree, TreeList[item].ParentId)
      } else {
        if (TreeList[item].children.length > 0) {
          this.GetParentId(TreeList[item].children, Id)
        }
      }
    }
  }

  //获取列表
  private GetList(): void{
    this.$set(this, 'List', [])
    this.CancelSelect();
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.MenuGetChilds,
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
  private GetSelected(data: Interface.Resources[] ): void{
    this.$set(this, 'Selected', data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["ResourceTable"] as any).selectAll(false);
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
    this.$set(this, 'SearchForm', new Interface.SearchResources())
    this.$set(this.SearchForm, 'ParentId', this.CurrTreeDomId.length > 0 ? Number(this.CurrTreeDomId[this.CurrTreeDomId.length - 1]) : 0)
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
			if(this.Powers[Item] && ['ResourceAdd', 'ResourceStatus'].includes(Item)){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }

  /*
  Type 1-编辑 2-启禁用
  */
  private OperateGroup(Type:number, Idx:number): void{ 
    this.CancelSelect()
    switch(Type){
      case 1:
        (this as any).$refs.ModifyResources.TriggerModal([JSON.parse(JSON.stringify(this.List[Idx]))], this.CurrTreeDomId)
        break;
      case 2:
        this.ChangeStatusObj.ToTarget = !this.List[Idx].IsEnable;
        (this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Idx]))], this.ChangeStatusObj);
        break;
    }
  }

  //复制结果
  private Copy(s: string): void {
		this.$copyText(s).then(() => {
			// 成功
			this.$UI.Tips.Floating('success', '复制成功');
		}, () => {
			// 失败
			this.$UI.Tips.Floating('error', '复制失败');
		})
  }

  //添加 编辑组件回调
  private HandleResMsg(Type: boolean){
    if(Type){
      this.GetTree()
    }
  }
  
  /*
	批量禁启用组件回调
		Res true-操作成功
		Type  1-启用 0-禁用	99-取消数据
	*/
	private EmitChange(Res: boolean, Type?: number){
		if(Type !== undefined){
      this.ChangeStatusObj.ToTarget = Type === 1 ? true : false;
			(this.$refs["ChangeStatus"] as any).TriggerModal(this.Selected, this.ChangeStatusObj);
		}

		if(Res){
      this.GetList()
		}
	}

  private SpanLeft:number = 3;
  private SpanRight:number = 21;
  private Powers: PInterface.Power = {} // 权限
  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Settings, Api: this.$Api.MenuChangeStatus, IdKey: 'Id', StatusKey: 'Status', ToTarget: false, TipsKey: '菜单' };  //禁启用
  private ShowModal: boolean = false; //添加/编辑菜单模态框标识
  private Tree: Interface.Resources[] = [] //左侧树数据
  private CurrTreeDomId:string[] = []  //当前编辑数据的父节点Id(左侧树激活状态节点Id)
  private SearchForm : Interface.SearchResources = new Interface.SearchResources()  //筛选数据
  private SearchKeyTypeDrop : PInterface.KV[] =this.$Utils.GetEnumArr(this.$Enums.Setting.ResourcesType)  //关键字下拉
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private List: Interface.ResourcesChild[] = []; //列表数据
  private Selected: Interface.ResourcesChild[] = []; //列表选中数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '元素ID', key: 'ElementId', width: 150 },
		{ title: '菜单名称', key: 'ResourceName', width: 120 },
		{ title: '上级菜单ID', key: 'ParentId', width: 100 },
    { title: '是否为功能点', key: 'IsPoint', width: 120, render: (h: any, params: any): string =>{
      return h('span', params.row.IsPoint ? '是' : '否')
    } },
    { title: '请求API/跳转链接', key: 'ActionUrl', className: 'Copy-Url', render: (h: any, params: any): any => {
      return (params.row as any).ActionUrl === "" ? h('span', '-') : h('Tooltip', {
        props: {
          'content': (params.row as any).ActionUrl
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', {
          class: 'P-LINE-1 P-Copy-Content'
        }, (params.row as any).ActionUrl ),
        h('Icon', {
          props: {
            type: 'md-copy',
            size: 16
          },
          class: 'P-Copy-Icon',
          style: 'display: none',
          on: {
            click: ():void => {
              this.Copy((params.row as any).ActionUrl);
            }
          }
        })
      ])
    } },
    { title: '包含API', key: 'IncludeAction', render: (h: any, params: any): string =>{
      return h('span', params.row.IncludeAction ? params.row.IncludeAction : '-')
    }  },
    { title: '状态', key: 'IsEnable', width: 80, render: (h: any, params: any): string => {
				return h('Icon', {
          props: { 
            type: params.row.IsEnable ? 'md-checkmark' : 'md-close',
            size: '18'
          },
					class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error'
				})
      }
    },
    { title: '操作', width: 140, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (item:PInterface.KV, index: number )=>{
          return h('Button', {
            props: {
              type: (item.Value === 2 && params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            class: index == 0 ? 'P-MR-5' : '',
            on: {
              click: () => {
                this.OperateGroup(Number(item.Value), params.row._index)
              }
            }
          }, item.Value == 2 ? (params.row.IsEnable ? '禁用' : '启用') : item.Key )
        }))
      }
    }
	]
}

</script>
<style lang="less">

.Resources-Menu{
  .Matters-Title{
    height: 30px;
    line-height: 30px;
  }
  .Resources-Tree{
    width: 100%;
  }

  .Switch-Tree{
    line-height: 30px;
    vertical-align: top;
    height: 30px;
    text-align: center;
    width: 15%;
  }

  .ivu-col-span-1 {
    width: 1.8%;
    transition:all 0.4s;

    .Switch-Tree{
      width: 100%;
    }
  }

  .ivu-col-span-3{
    transition:all 0.4s;
    // min-width: 150px !important;

    .TreeWrap{
      max-height: ~'calc(100vh - 180px)' !important;
      overflow-y: auto !important;
      width: 100%;
    }
  }

  .ivu-col-span-21{
    transition:all 0.4s;
    // max-width: ~'calc(100vw - 170px)';
  }
  
  .ivu-col-span-23 {
    width: 98%;
    transition:all 0.4s;
  }


    .Copy-Url:hover{
      & i.P-Copy-Icon{
        display: inline-block !important;
      }
    }

}
</style>