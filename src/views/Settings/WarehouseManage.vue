<template>
	<Row>
    <Col span="24">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<FormItem class="P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Col>
    <Col span="24">
      <ModifyWarehouse ref="ModifyWarehouse" class="P-MB-10" v-if="Powers.WarehouseModify || Powers.WarehouseAdd" :Power="Powers.WarehouseAdd" :DropLists="DropLists" @handle-ware-msg="EmitChange"></ModifyWarehouse>
      <ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.WarehouseStatus" @emit-change="EmitChange"></ChangeStatus>
    </Col>
    <Col span="24" class="P-MB-10">
			<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="WareTable"></Table>
		</Col>
		<Col span="24">
			<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Setting';

@Component({
  name: 'WarehouseManage',
	components: {
		ChangeStatus: () => import('../../components/Public/ChangeStatus.vue'),
		ModifyWarehouse: () => import('../../components/Settings/ModifyWarehouse.vue')
	}
})
export default class WarehouseManage extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

	//获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['WarehouseAdd', 'WarehouseModify', 'WarehouseStatus']))
    this.SetOperateDrop()
  }

	//列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.WarehouseModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.WarehouseStatus ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}
	
	// 获取列表数据
  private GetList(): void {
		this.CancelSelect();
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.GetWarehouseList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: this.SearchForm },
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.Pager.TotalItems = res.Data.PageModel.TotalItems;
					this.$set(this, 'List', res.Data.PageModel.Items)
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}

	//获取列表复选框选中的数据
  private GetSelected(data: Interface.Warehouse[] ): void{
    this.$set(this, 'Selected', data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["WareTable"] as any).selectAll(false);
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
		this.$set(this, 'SearchForm', { SearchKey: "" })
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
			if(this.Powers[Item] && ['WarehouseAdd', 'WarehouseStatus'].includes(Item)){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }	
  
	//获取币种
  private GetER() :void{
    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ERDropList,
				Login: true
			},
			Data: "",
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.$set(this.DropLists, 'ERDropList', res.Data.DropList)
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})    
  }

	//获取国家下拉
  private GetCountryList() {
    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.CountryList,
				Login: true
			},
			Data: "",
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.$set(this.DropLists, 'CountryList', res.Data.DropList)
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})   
	}
	
	// 列表操作项	(Type 1-添加编辑仓库  2-禁启用)	(Index 当前编辑数据索引)
  private OperateGroup(Type: number, Index: number):void{
		this.CancelSelect()
    switch(Type){
			case 1:
				this.ShowModifyWareModal(Index)
        break;
      case 2:
				this.ChangeStatusObj.ToTarget = !this.List[Index].IsEnable;
        (this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))], this.ChangeStatusObj);
        break;
    }
	}

	// idx 当前编辑数据索引)
	private ShowModifyWareModal(Idx:number): void{
		if(this.DropLists.CountryList.length == 0){
			this.GetCountryList()
		}
		if(this.DropLists.ERDropList.length == 0){
			this.GetER()
		}
		(this as any).$refs.ModifyWarehouse.TriggerModal([JSON.parse(JSON.stringify(this.List[Idx]))])
	}

	/*
	  组件回调
		Res true-操作成功
		Target  1-启用 0-禁用
	*/
	private EmitChange(Res: boolean, Target?: number){
		if(Target !== undefined){
			this.ChangeStatusObj.ToTarget = Target === 1 ? true : false;
			(this.$refs["ChangeStatus"] as any).TriggerModal(this.Selected, this.ChangeStatusObj);
		}

		if(Res){
      this.GetList()
		}
	}

  private Powers: PInterface.Power = {} // 权限
  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Settings, Api: this.$Api.ChangeStatusWarehouse, IdKey: 'Id', StatusKey: 'Status', ToTarget: false, TipsKey: '仓库' };
  private DropLists: Interface.WarehouseDrop = { CountryList: [], ERDropList: [], WareTypeList: this.$Utils.GetEnumArr(this.$Enums.Setting.WarehouseStatus) };
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.StateSearch = new Interface.StateSearch(); //筛选数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Selected: Interface.Warehouse[] = []; // 列表选中数据
  private List: Interface.Warehouse[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '仓库名称', key: 'Name' },
		{ title: '仓库地址', key: 'Address', width: 300 },
		{ title: '仓库类型', width: 100, render: (h: any, params: any): string => { return h('span', this.$Enums.Setting.WarehouseStatus[params.row.Type]) } },
		{ title: '第三方仓库代码', key: 'ThirdCode' },
		{ title: '弗睿代码', key: 'FrCode' },
		{ title: '结算币种', key: 'CurrencyCode', width: 100, render: (h: any, params: any): string => {
			return h('div', params.row.CurrencyCode === "" ? '-' : params.row.CurrencyCode)
		} },
		{ title: '所在国家', key: 'CountryCode', width: 100 },
		{ title: '联系人', key: 'Contacts', width: 80 },
		{ title: '联系电话', key: 'TelePhone', width: 120, render: (h: any, params: any): string => {
			return h('div', params.row.TelePhone === "" ? '-' : params.row.TelePhone)
		} },
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
  ];     
}

</script>
<style lang="less"></style>