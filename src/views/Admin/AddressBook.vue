<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
          <Select class="P-W-200 P-ML-10" placeholder="筛选岗位" :onChange="OnClearSelect.bind(this, 'PositionId')" v-model="SearchForm.PositionId" :options="PositionDrop" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选岗位" @on-change="OnClearSelect('PositionId')" v-model="SearchForm.PositionId" filterable clearable>
						<Option v-for="(item,index) in PositionDrop" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select> -->
					<Cascader class="P-W-200 P-ML-10 P-Inline-Block" placeholder="筛选组织" :data="OrganizationDrop" change-on-select filterable clearable v-model="SearchForm.OrganizationId"></Cascader>
					</Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
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
			<Button type="primary" class="P-MR-10 P-MB-10" @click="ExportBook" v-if="Powers.BookExport">导出通讯录</Button>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Admin';
@Component({
	name: 'AddressBook' 
})
export default class AddressBook extends Vue {
	private mounted() :void {
		this.GetPoints()
		this.GetPositionDrop()
		this.GetOrganizationDrop()
  }

  //获取权限
  private GetPoints(): void {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['BookExport']))
		this.GetList()
	}
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	// 获取岗位下拉
	private GetPositionDrop(): void {
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetPositionDropList,
				Login: true
			},
			Data: true,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'PositionDrop', Res.Data.DropList);
				} else {
					this.$Request.Error(Res);
				}
			}
		})
	}

	// 获取组织下拉
	private GetOrganizationDrop(): void {
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.OGetOrganizationTree,
				Login: true
			},
			Data: false,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'OrganizationDrop', Res.Data.Tree);
					this.SetOrganizationMenu(this.OrganizationDrop)
				} else {
					this.$Request.Error(Res);
				}
			}
		})
	}

	//组装成级联菜单所要的数据结构
	private SetOrganizationMenu(Data: Interface.OrganizationTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'title', Data[Item].Name);
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id.toString());
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetOrganizationMenu(Data[Item].children);
			}
		}
	}

	//获取列表
  private GetList(): void{
		this.$set(this, 'List', [])
		this.$set(this, 'AccurateSearch', false);
		let PostData = JSON.parse(JSON.stringify(this.SearchForm))
		PostData.OrganizationId = PostData.OrganizationId.length > 0 ? Number(PostData.OrganizationId.pop()) : 0
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetContactBookList,
				Login: true
			},
			Data: { Conditions: PostData, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
					this.$set(this,'List', Res.Data.PageModel.Items)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}
	
	//搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.AddressBookSearch())
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
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
	}

	//导出通讯录
	private ExportBook(): void{
		this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认导出通讯录',
      Enter: false,
      Callback: (B: boolean): void => {
        if(B){
          this.$UI.Loading.Show();
					let PostData = JSON.parse(JSON.stringify(this.SearchForm))
					PostData.OrganizationId = PostData.OrganizationId.length > 0 ? Number(PostData.OrganizationId.pop()) : 0

					this.$Request.Post({
						Server: this.$Server.Admin,
						Api: {
							Address: this.$Api.ContactBookExport,
							Login: true
						},
						Data: PostData,
						Callback: (Res: PInterface.Res): void => {
							if (Res.IsSuccess) {
								this.$UI.Tips.Floating('success', '导出通讯录成功')
								window.open(this.$Server.Admin + Res.Data.Url);
							} else {
								this.$Request.Error(Res);
							}
							this.$UI.Loading.Hide();
						}
					})
        }
      }
    })
	}
	
	private PositionDrop: PInterface.KV[] = []	//岗位下拉数据
	private OrganizationDrop: Interface.OrganizationTree[] = []	//组织下拉数据
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
	private Powers: PInterface.Power = {} // 权限
	private SearchForm : Interface.AddressBookSearch = new Interface.AddressBookSearch()  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
	private List: Interface.AddressBook[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '编号', key: 'UserCode' },
		{ title: '姓名', key: 'UserName' },
		{ title: '职务', key: 'PositionName' },
		{ title: '组织', key: 'OrganizationName' },
		{ title: '联系电话', key: 'TelePhone' },
		{ title: '邮箱', key: 'Email' }
	]
}

</script>
<style lang="less"></style>
