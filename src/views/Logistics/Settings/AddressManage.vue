<!--地址管理-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
          <Select class="P-W-200 P-ML-10" placeholder="筛选国家" v-model="SearchForm.Country" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" />
            <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选国家" v-model="SearchForm.Country" filterable clearable>
              <Option v-for="Item in CountryData" :value="Item.CountryCode" :key="Item.CountryCode">{{Item.CountryNameCn}}</Option>
            </Select> -->
            <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.IsEnable" :options="DropEnable" />
            <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.IsEnable" filterable clearable>
              <Option v-for="(Item, Index) in DropEnable" :key="Index" :value="$Enums.Public.Enable[Item]">{{Item}}</Option>
            </Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Logistics.AddressSearchType[Item]" :key="Index">{{Item}}</Option>
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
    <ModifyAddress class="P-MR-10 P-MB-10" v-if="Powers.AddressCreate || Powers.AddressModify" ref="ModifyAddress" :CountryData="CountryData" :Power="Powers.AddressCreate" @handle-res="EmitChange"/>
		<ChangeStatus class="P-MB-10" v-if="Powers.AddressChangeStatus" ref="ChangeStatus" @emit-change="EmitChange" />
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="AddressManage"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';
/*interface end*/

@Component({
	name: 'AddressManage',
	components: {
		ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
		ModifyAddress: () => import('@/components/Logistics/Settings/ModifyAddress.vue')
	}
})

export default class AddressManage extends Vue {
	private mounted() {
		this.GetPoints();
	}

	private GetPoints(): void {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['AddressCreate', 'AddressModify', 'AddressChangeStatus']));
		this.GetCountryDropList();
		this.SetOperateDrop();
  }
  
  //获取国家
  private GetCountryDropList(): void{
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.CountryList
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.CountryData = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

	// 获取列表
	private GetList(): void {
		this.CancelSelect();
		this.$set(this, 'AccurateSearch', false);
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.IsEnable = SearchForm.IsEnable === "" ? "" : Boolean(SearchForm.IsEnable);
		this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.AddressGetList,
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

	// 初始化列表操作按钮
	private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.AddressModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.AddressChangeStatus ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

	// 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['AddressCreate', 'AddressChangeStatus'].includes(Item)){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
	}

	// 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	//获取列表复选框选中的数据
  private GetSelected(Data: Interface.AddressManageList[] ): void{
    this.$set(this, 'Selected', Data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["AddressManage"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.AddressManageSearch())
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


	/*
	列表操作列操作按钮触发方法  
	OpeIndex: 1-编辑 2-禁启用
	Index： 操作列索引
	*/
	private OperateGroup(OpeIndex:number, Index: number): void{	
		this.CancelSelect()
		this.$set(this, 'AccurateSearch', false);
    
		switch(OpeIndex){
			case 1:
				(this.$refs["ModifyAddress"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))]);
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
  private CountryData:PInterface.CountryEntity[] = []; //国家下拉
  private DropEnable: string[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 状态下拉
	private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Logistics, Api: this.$Api.AddressChangeStatus, IdKey: 'Id', StatusKey: 'IsEnable', ToTarget: false, TipsKey: '客户' };	//禁启用
	private SearchKeyTypeDrop: string[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.AddressSearchType) // 搜索关键词
	private OperateDrop: PInterface.KV[] = [] // 操作项
	private SearchForm: Interface.AddressManageSearch = new Interface.AddressManageSearch() // 筛选项默认数据
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private Selected: Interface.AddressManageList[] = [] // 列表选中数据
	private List: Interface.AddressManageList[] = [] // 列表数据源

	private Cols: PInterface.TableCol[] = [
		{ type: 'selection', width: 60, align: 'center' },
    { title: '地址别名', width: 200, key: 'AddressAlias', }, 
    { title: '国家', width: 200, key: 'CountryName' }, 
    { title: '联系人', width: 200, key: 'Contact' }, 
    { title: '手机', width: 250,  key: 'Mobile' },
		{ title: '地址', render: (h: any, Params: any): string => h('p', `${Params.row.State} ${Params.row.City} ${Params.row.District} ${Params.row.Street1} ${Params.row.Street2}`) },
		{ title: '状态', key: 'IsEnable', width: 80, render: (h: any, Params: any): string => {
      return h('Icon', {
        props: { 
          type: Params.row.IsEnable ? 'md-checkmark' : 'md-close',
          size: '18'
        },
        class: Params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error'
      })
    } },
		{ title: '操作',width: 140,align: 'center',render: (h: any, Params: any): string => {
			return h('div', this.OperateDrop.map( (Item:PInterface.KV, Index: number )=>{
        return h('Button', {
          props: {
            type: (Item.Value === 2 && Params.row.IsEnable) ? 'error' : 'primary',
            size: 'small'
          },
          class: Index == 0 ? 'P-MR-5' : '',
          style: { display: 'inline-block' },
          on: {
            click: () => {
              this.OperateGroup(Number(Item.Value), Params.row._index)
            }
          }
        }, Item.Value == 2 ? (Params.row.IsEnable ? '禁用' : '启用') : Item.Key )
      }))
    } }
	]
}

</script>
<style lang="less"></style>
