<template>
	<div class="Back-Log">
    <Col :span="SpanLeft">
      <ul class="Back-Tree P-Inline-Block">
        <div class="Matters-Title P-Text-White P-BG-Info"><span class="P-Inline-Block P-PL-10" v-show="SpanRight!==23">待办事项类目</span>
          <div class="P-Inline-Block Switch-Tree P-BG-Info P-Float-Right"><Icon type="md-list" size="16" @click="TriggleShowTree" class="P-Pointer P-Text-White"/></div>
        </div>
        <div class="WrapTree" v-show="SpanRight!==23">
          <li v-for="Item in ToDoTree" :key="Item.Id" class="P-MB-5" :class="{Active: CategoryId === Item.Id}">
            <div><span class="P-Pointer P-MR-10 Category" :data-Id="Item.Id" @click="GetItemList">{{Item.CategoryName}}</span><Icon v-if="Powers.ToDoCategoryModify" type="md-create" size="12" class="P-None P-Pointer" @click="OperateGroup(1, index)" /></div>
          </li>
        </div>
      </ul>
    </Col>
    <Col :span="SpanRight" class="P-PL-10">
      <ModifyCategory ref="ModifyCategory" v-if="Powers.ToDoCategoryAdd || Powers.ToDoCategoryModify" :Power="Powers.ToDoCategoryAdd" @handle-res-msg="HandleResMsg" />
      <ModifyMatters ref="ModifyMatters" v-if="Powers.ToDoItemAdd || Powers.ToDoItemModify" :Power="Powers.ToDoItemAdd" :TreeList="ToDoTree" @handle-res-msg="HandleResMsg"></ModifyMatters>
      <Col span="24">
        <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
      </Col>
    </Col>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';

@Component({
  name: 'BackLog',
  components: {
		ModifyCategory: () => import('@/components/Settings/ModifyCategory.vue'),
		ModifyMatters: () => import('@/components/Settings/ModifyMatters.vue')
	}
})
export default class BackLog extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ToDoCategoryAdd', 'ToDoCategoryModify', 'ToDoItemAdd', 'ToDoItemModify']))
    this.SetOperateDrop()
  }

  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.ToDoItemModify ? Drops.push({ Key: '编辑', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetToDoTree();
  }

  //显示/隐藏左侧树列表
  private TriggleShowTree():void{
    this.$set(this, 'SpanRight', this.SpanRight == 21 ? 23 : 21)
    this.$set(this, 'SpanLeft', this.SpanLeft == 3 ? 1 : 3)
  }
  
  //获取页面数据
  private GetToDoTree(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ToDoTree,
				Login: true
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this, 'ToDoTree', Res.Data.Tree)
          this.GetList()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  //表格高度
  private CalculateTbHeight(): number{
    let Flag: number = 140;
		for(let Item in this.Powers){
			if(['ToDoCategoryAdd', 'ToDoItemAdd'].includes(Item) && this.Powers[Item]){
				Flag = 185;
			}
    }
    return (window.innerHeight - Flag);
  }

  //根据选中左侧类目 获取列表数据
  private GetItemList( e: any ):void{
    if(this.CategoryId == Number(e.target.getAttribute('data-Id'))){
      this.$set(this, 'CategoryId', 0)
      this.$set(this, 'List', [])
      return;
    }

    this.CategoryId = Number(e.target.getAttribute('data-Id'))

    this.GetList()
  }

  //过滤拿到的列表数据进行渲染列表
  private GetList():void{
    // this.ToDoTree.forEach( (Item:Interface.ToDoTree) => { Item.Id === this.CategoryId ? this.$set(this, 'List', Item.ChildNods) : null })
    for(let i=0; i<this.ToDoTree.length; i++){
      if(this.CategoryId === this.ToDoTree[i].Id){
        this.$set(this, 'List', this.ToDoTree[i].ChildNods)
        break;
      }
    }
  }

  /*
  Type： 1-编辑类目 2-编辑事项
  Idx: 数据索引
  */
  private OperateGroup(Type:number, Idx:number): void{
    switch(Type){
      case 1:
        (this as any).$refs.ModifyCategory.TriggerModal([JSON.parse(JSON.stringify(this.ToDoTree[Idx]))])
        break;
      case 2:
        (this as any).$refs.ModifyMatters.TriggerModal([JSON.parse(JSON.stringify(this.List[Idx]))])
        break;
    }
  }

  //子组件回调  val 是否操作成功
  private HandleResMsg(Val: boolean){
    if(Val){ //操作成功
      this.GetToDoTree()
    }
  }

  private SpanLeft:number = 3;
  private SpanRight:number = 21;
  private Powers: PInterface.Power = {} // 权限
  private ToDoTree: Interface.ToDoTree[] = [] //左侧树形数据
  private CategoryId: number = 0; //保存当前类目ID
  private ShowMattersModal: boolean = false;  //事务模态框标识
  private BackLogEditData:Interface.BackLog = new Interface.BackLog(); //保存当前编辑事务的数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private List: Interface.BackLog[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '待办事项名称', key: 'ItemName' },
		{ title: '跳转链接', key: 'HrefUrl' },
		{ title: '请求API', key: 'RequestUrl' },
    { title: '单位', key: 'Unit', width: 80 },
    { title: '操作', width: 100, render: (h: any, Params: any): string => {
      return h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        on: {
          click: () => {
            this.OperateGroup(2, Params.index)
          }
        }
      }, '编辑')
      }
    }
	]
}

</script>
<style lang="less" scoped>
@import '../../assets/Theme/Standard.less'; 
.Back-Log{
  .Back-Tree{
    width: 100%;

    & .WrapTree{
      padding-top: 10px !important;
      max-height: ~'calc(100vh - 180px)' !important;
      overflow-y: auto !important;
    }

    & .Matters-Title{
      height: 30px;
      line-height: 30px;

      & i{
        line-height: 30px;
      }
    }
    & li{
      padding-left: 10px;
      list-style: none;

      & span{
        padding: 5px;
      }
    }

    & li:not(.Active){
      div{
        display: inline-block;
        &:hover{
          span{
            color: @info-color;

            & + i{
              display: inline-block !important;
            }
          }
        }
      }
    }

    & li.Active{
      div{
        display: inline-block;

        &:hover{
          span + i{
            display: inline-block !important;
          }
        }
      }

      span{
        background: @primary-color;
        color: @white;
        border-radius: 5px;
      }
    }
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
    transition:width 0.4s;

    .Switch-Tree{
      width: 100%;
    }
  }
  .ivu-col-span-3{
    transition:width 0.4s;
    min-width: 150px !important;
  }
  .ivu-col-span-21{
    transition:width 0.4s;
    max-width: ~'calc(100vw - 170px)';
  }
  .ivu-col-span-23 {
    width: 98%;
    transition:width 0.4s;
  }
}
</style>