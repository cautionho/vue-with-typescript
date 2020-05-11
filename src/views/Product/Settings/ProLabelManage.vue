<!--产品 => 特性标签管理-->
<template>
	<Row>
    <Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.IsEnable" :options="DropSearchType" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('IsEnable')" v-model="SearchForm.IsEnable" filterable clearable>
						<Option v-for="(item,index) in DropSearchType" :value="$Enums.Public.Enable[item]" :key="index">{{item}}</Option>
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
			<ModifyProLabel class="P-MB-10" ref="ModifyProLabel" v-if="Powers.ProAttributeCreate || Powers.ProAttributeModify" :Power="Powers.ProAttributeCreate" @handle-label-msg="EmitChange"/>
			<ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.ProAttributeStatus" @emit-change="EmitChange"></ChangeStatus>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';
@Component({
	name: 'ProLabelManage',
	components: {
		ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
		ModifyProLabel: () => import('@/components/Product/Settings/ModifyProLabel.vue')
	}
})
export default class ProLabelManage extends Vue {
	private mounted() {
		this.GetPoints();
	}

	private GetPoints():void  {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ProAttributeCreate', 'ProAttributeModify', 'ProAttributeStatus']));
		this.SetOperateDrop();
	}
	
	private SetOperateDrop(): void{
		let Drops: PInterface.KV[] = [];
		this.Powers.ProAttributeModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.ProAttributeStatus ? Drops.push({ Key: '禁启用', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
    this.GetList();
	}

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['ProAttributeCreate', 'ProAttributeStatus'].includes(Item)){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }

  // 获取列表
	private GetList(): void {
		this.CancelSelect();
		this.$set(this, 'AccurateSearch', false);
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm["IsEnable"] = SearchForm.IsEnable === "" ? "" : Boolean(SearchForm.IsEnable);

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GetAttributeList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchForm },
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

  // 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
  }
  
  //获取列表复选框选中的数据
  private GetSelected(Data: Interface.ProLabelList[] ): void{
    this.$set(this, 'Selected', Data)
  }
  
  //取消全选
  private CancelSelect():void {
    (this.$refs["Table"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

  // 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.ProLabelSearch())
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

	// 列表操作项	(Type 1-添加  2-禁启用)	(Index 当前编辑数据索引)
  private OperateGroup(Type: number, Index: number):void{
		this.$set(this, 'AccurateSearch', false);
		this.CancelSelect();
		
    switch(Type){
			case 1:
				(this.$refs["ModifyProLabel"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))]);
      break;
      case 2:
				this.ChangeStatusObj.ToTarget = !this.List[Index].IsEnable;
				(this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))], this.ChangeStatusObj);
        break;
    }
	}

	/*
	组件回调
		Res true-操作成功
		Type  1-启用 0-禁用
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

  private Powers: PInterface.Power = {}  // 权限
  private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private DropSearchType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) //关键词下拉
	private SearchForm: Interface.ProLabelSearch = new Interface.ProLabelSearch()	//筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private OperateDrop: PInterface.KV[] = [] // 下拉操作项
	private List: Interface.ProLabelList[] = [] //列表数据
	private Selected: Interface.ProLabelList[] = [] //列表选中数据
	private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Purchase, Api: this.$Api.AttributeChangeStatus, IdKey: 'Id', StatusKey: 'Status', ToTarget: false, TipsKey: '特性标签' };
  
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '编号', key: 'Id' },
    { title: '标签', key: 'Name' },
		{ title: '状态', key: 'IsEnable', render: (h: any, params: any): string => 
			h('span', { class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error' }, params.row.IsEnable ? '已启用' : '已禁用')
    },
    { title: '操作', width: 140, className: 'Ope-Row', render: (h: any, params: any): string => {
        return h('div', {
          class: "P-MT-5"
        }, this.OperateDrop.map( (Item: PInterface.KV, Index: number )=>{
          return h('Button', {
            props: {
              type: (Item.Value === 2 && params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            class: 'P-MB-5 P-MR-5',
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row._index)
              }
            }
          }, Item.Value == 2 ? (params.row.IsEnable ? '禁用' : '启用') : Item.Key )
        }))
      }
    }
  ]
}

</script>
<style lang="less"></style>
