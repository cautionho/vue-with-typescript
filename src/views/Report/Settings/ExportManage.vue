<!--库存金额统计报表-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
        <Select class="P-W-200 P-MB-10" placeholder="筛选模块" v-model="SearchForm.ModuleId" :options="ModuleDrop" />
        <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="StatusDrop" />
        <!-- <Select class="P-W-200 P-MB-10" placeholder="筛选模块" @on-change="OnClearSelect('ModuleId')" v-model="SearchForm.ModuleId" filterable clearable>
          <Option v-for="(Item, Index) in ModuleDrop" :value="$Enums.Report.ModuleType[Item]" :key="Index">{{ Item }}</Option>
        </Select>
        <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
          <Option v-for="(Item, Index) in StatusDrop" :value="$Enums.Report.ExportStatus[Item]" :key="Index">{{ Item }}</Option>
        </Select> -->
				<FormItem class="P-ML-10 P-MB-10">
          <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-300">
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
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
    <Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <CreateRemart ref="CreateRemart" @change-modal="ChangeModal" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
	name: 'ExportManage',
	components:{
    CreateRemart: () => import('@/components/Report/Settings/CreateRemart.vue')
	}
})
export default class ExportManage extends Vue {
	private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['AddUserRemark']))
    this.GetWarehouseList();
    this.SetOperateDrop();
  }

  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.AddUserRemark ? Drops.push({ Key: '备注', Value: 1 }) : null;
		Drops.push({ Key: '下载', Value: 2 });
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  //仓库下拉
  private GetWarehouseList(){
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.DropWarehouseList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private SearchList():void{
    this.$set(this.Pager, 'PageIndex', 1);
    this.GetList();
  }

	//获取列表
  private GetList(): void{
    this.ChangeCol();

    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    this.$set(this, 'List', [])
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Report,
			Api: {
				Address: this.$Api.ExportReportRecordGetList,
				Login: true
      },
			Data: { Conditions: SearchGroup, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
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
	
	//重置
	private ResetList(): void{
    this.$set(this, 'SearchForm', new Interface.ExportManageSearch());
    this.$set(this.SearchForm, 'WarehouseId', 50);
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
		return (window.innerHeight - 210);
  }

  private ChangeCol(): void{
    this.Cols = [];
    let Ope = { title: '操作', width: 140, render: (h: any, Params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV, Index: number )=>{
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            class: Index == 0 ? 'P-MR-5' : '',
            style: { display: this.ControlOpera(Number(Item.Value), Params.row) },
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), Params.row._index)
              }
            }
          }, Item.Key )
        }))
      }
    }

    switch (this.SearchForm.Status) {
      case 1:
      case 2:
      case 4:
        this.Cols.push(...this.RCols);
        break;
      default:
        this.Cols.push(...this.RCols);
        this.Cols.push(Ope);
        break
    }
  }

  //OperateGroup 1-备注 2-下载
  private OperateGroup(OpeIndex:number, Index: number): void{
    if(OpeIndex === 1){
      (this as any).$refs.CreateRemart.TriggerModal(this.List[Index])
    }

    if(OpeIndex === 2){
      window.open(`${this.$Server.File}/${this.List[Index].PathUrl}`, '_black');
    }
  }

  private ControlOpera(Idx: number, Data:Interface.ExportManageList): string{
    if(Idx === 1 && this.Powers.AddUserRemark){
      return 'inline-block';
    }else if(Idx === 2 && Data.Status == 3){
      return 'inline-block';
    }else{
      return 'none'
    }
  }

  //备注组件回调
  private ChangeModal(B: boolean): void{
    if(B){
      this.GetList();
    }
  }
  
  private Powers: PInterface.Power = {} // 权限
  private StatusDrop: PInterface.KV[] =  this.$Utils.GetEnumArr(this.$Enums.Report.ExportStatus);
  private ModuleDrop: PInterface.KV[] =  this.$Utils.GetEnumArr(this.$Enums.Report.ModuleType);
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private SearchForm : Interface.ExportManageSearch = new Interface.ExportManageSearch()  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.ExportManageList[] = []; //列表数据
  private Cols: PInterface.TableCol[] = []
	private RCols: PInterface.TableCol[] = [
		{ title: '模块', key: 'ModuleName', width: 150 },
    { title: '任务名称', key: 'ReportName', width: 200 },
    { title: '创建时间', width: 160, render: (h: any, Params: any): string => h('p', this.$UI.Render.Date(Params.row.CreateTime, true)) },
    { title: '完成时间', width: 160, render: (h: any, Params: any): string => h('p', this.$UI.Render.Date(Params.row.ProcessTime, true)) },
    { title: '状态', width: 100, render: (h: any, Params: any): string => h('p', this.$Enums.Report.ExportStatus[Params.row.Status]) },
    { title: '系统备注', key: 'Remark', render: (h: any, Params: any): string => h('p', Params.row.Remark === "" ? '-' : Params.row.Remark) },
    { title: '用户备注', key: 'UserRemark', render: (h: any, Params: any): string =>{
      return h('Tooltip', {
        props: {
          'content': Params.row.UserRemark,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', { class: 'P-LINE-1' }, Params.row.UserRemark === "" ? '-' : Params.row.UserRemark)
      ])
    } }
	]
}

</script>
<style lang="less"></style>

