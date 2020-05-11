<!--拣货批次规则-->
<template>
	<Row>
    <Col span="24">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="请输入需要搜索的内容" class="P-W-400" v-model="SearchForm.RuleName" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="筛选状态" v-model="SearchForm.IsEnable" :options="DropEnableType" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="筛选状态" @on-change="OnClearSelect('IsEnable')" v-model="SearchForm.IsEnable" filterable clearable>
						<Option v-for="(Item,Index) in DropEnableType" :value="$Enums.Public.Enable[Item]" :key="Index">{{Item}}</Option>
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
      <ModifyPickBatchRule class="P-MB-10" ref="ModifyPickBatchRule" :Power="Powers.AddBatchOrderRule" v-if="Powers.AddBatchOrderRule || Powers.ModifyBatchOrderRule" @change-modify-rule="EmitChange" />
      <ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.ChangeBatchStatus" @emit-change="EmitChange"></ChangeStatus>
    </Col>
    <Col span="24" class="P-MB-10">
      <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="InventoryTable"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>
    <Modal v-model="IsSort" title="排序" :mask-closable="false" @on-cancel="CancelSort(false)">
	    <Form onsubmit="return false" ref="SortForm" :model="SortForm" :rules="SortRule" :label-width="100" name="SortForm">
	      <Form-item label="序号：" prop="Priority">
	        <Input type="text" v-model="SortForm.Priority" @on-enter="" placeholder="请输入序号……" ref="Priority"></Input>
	      </Form-item>
	    </Form>
	    <div slot="footer">
	      <Button type="primary" @click="ChangeSort">修改</Button>
	      <Button @click="CancelSort(false)">取消</Button>
	    </div>
	  </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'PickBatchRule',
  components: {
		ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
		ModifyPickBatchRule: () => import('@/components/Warehouse/Settings/ModifyPickBatchRule.vue')
	}
})
export default class PickBatchRule extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['AddBatchOrderRule', 'ModifyBatchOrderRule', 'ChangeBatchStatus', 'SortBatchRule']))
    this.SetOperateDrop()
  }

  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.ModifyBatchOrderRule ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.ChangeBatchStatus ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		this.Powers.SortBatchRule ? Drops.push({ Key: '排序', Value: 3 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  //获取列表
  private GetList(): void{
    this.CancelSelect();
    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    this.$set(SearchForm, 'IsEnable', SearchForm.IsEnable === "" ? "" : Boolean(SearchForm.IsEnable))
    this.$set(this, 'List', [])
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.BatchOrderRuleGetList,
				Login: true
			},
			Data: { Conditions: SearchForm, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.Pager.TotalItems = Res.Data.PageData.TotalItems;
          this.$set(this, 'List', Res.Data.PageData.Items)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  //获取列表复选框选中的数据
  private GetSelected(Data: Interface.InventoryManageList[] ): void{
    this.$set(this, 'Selected', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["InventoryTable"] as any).selectAll(false);
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
		this.$set(this, 'SearchForm', new Interface.PickBatchRuleSearch())
		this.GetList();
	}
	
	//切换列表条数
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
	}
	
	//切换列表页码
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex', N);
		this.GetList();
	}

  //获取列表高度
	private CalculateTbHeight(): number {
    let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && (Item === 'AddBatchOrderRule' || Item === 'ChangeBatchStatus' )){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }

  // 列表操作项	(Type 1-添加编辑仓库  2-禁启用 3-排序)	(Index 当前编辑数据索引)
  private OperateGroup(Type: number, Index: number):void{
		this.CancelSelect()
    switch(Type){
			case 1:
        // this.ShowModifyWareModal(2, Index)
        this.GetDetail(this.List[Index].Id)
        break;
      case 2:
        this.ChangeStatusObj.ToTarget = !this.List[Index].IsEnable;
        (this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))], this.ChangeStatusObj);
        break;
      case 3:
        this.IsSort = true;
        this.SortForm.Id = this.List[Index].Id;
        this.$nextTick(()=> (this.$refs["Priority"] as any).focus() )
        break;
    }
  }

  private GetDetail(Id: number): void{
    this.$UI.Loading.Show();

    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.BatchOrderRuleGetRuleDetails,
				Login: true
			},
			Data: Id,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          (this.$refs["ModifyPickBatchRule"] as any).TriggerModal(Res.Data.Data)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private ChangeSort(): void{
    (this.$refs['SortForm'] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.BatchOrderRuleSetPriority,
            Login: true
          },
          Data: this.SortForm,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating("success", "修改排序成功");
                this.CancelSort(true);
            } else {
              this.$Request.Error(Res);
              this.$UI.Loading.Hide();
            }
          }
        })
      }
    })
  }

  //关闭排序模态框
  private CancelSort(Bool: boolean): void{
    this.IsSort = false;
    this.SortForm = new Interface.PickBatchRuleSortForm();
    (this.$refs['SortForm'] as any).resetFields();
    if(Bool){
      this.GetList();
    }
  }
  
  /*
	 组件回调
		Res true-操作成功
		Type  1-启用 0-禁用	99-取消数据
	*/
	private EmitChange(Res: boolean, Type?: number): void{
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

  private IsSort: boolean = false;
  private SortForm: Interface.PickBatchRuleSortForm = new Interface.PickBatchRuleSortForm();  //排序
  private SortRule: any = {
    Priority: [{  required: true, message: '序号格式不正确', pattern: /^[0-9]+[0-9]*]*$/ }]
  }

  private Powers: PInterface.Power = {}; // 权限
  private DropEnableType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable);  //状态下拉
  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Warehouse, Api: this.$Api.BatchOrderRuleSetIsEnable, IdKey: 'Id', StatusKey: 'IsEnable', ToTarget: false, TipsKey: '规则' };
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.PickBatchRuleSearch = new Interface.PickBatchRuleSearch(); //搜索数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private List: Interface.PickBatchRuleList[] = []; //列表数据
  private Selected: Interface.PickBatchRuleList[] = []; //列表选中数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '排序号', key: 'Priority' },
    { title: '规则名称', key: 'RuleName' },
    { title: '状态', key: 'IsEnable', render: (h: any, params: any): string => {
      return h('span',{
        class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error'
      }, params.row.IsEnable ? '已启用' : '已禁用')
    } },
    { title: '操作', width: 180, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (item:PInterface.KV, index: number )=>{
          return h('Button', {
            props: {
              type: (item.Value === 2 && params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            class: index !== this.OperateDrop.length - 1 ? 'P-MR-5' : '',
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
<style lang="less"></style>
