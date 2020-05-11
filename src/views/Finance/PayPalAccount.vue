<!--paypal账号-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.PaypalEmail" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="筛选状态" v-model="SearchForm.IsEnable" :options="SearchKeyTypeDrop" />
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
    <ModifyPayPalAccount class="P-MB-10 P-MR-10" ref="ModifyPayPalAccount" :Power="Powers.PaypalCreate" @handle-res="EmitChange" v-if="Powers.PaypalCreate || Powers.PaypalModify" />
    <ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.PaypalChangeStatus" @emit-change="EmitChange"></ChangeStatus>
    <Button type="primary" class="P-ML-10 P-MB-10 P-VA-T" v-if="Powers.PaypalExportBalance" @click="ExportData">导出Paypal账号余额</Button>
		</Col>	
		<Col span="24">
    <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="[20,40,60,80,100]" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Finance';
@Component({
  name: 'PayPalAccount',
  components:{
    ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
    ModifyPayPalAccount: () => import('@/components/Finance/ModifyPayPalAccount.vue')
  } 
})
export default class PayPalAccount extends Vue {
	private mounted() :void {
		this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['PaypalCreate', 'PaypalModify', 'PaypalChangeStatus', 'PaypalAuthorizationVerify', 'PaypalGetAccountBalance', 'PaypalExportBalance']))
		this.SetOperateDrop()
  }
  
  // 初始化列表操作按钮
	private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.PaypalGetAccountBalance ? Drops.push({ Key: '获取余额', Value: 1 }) : null;
		this.Powers.PaypalModify ? Drops.push({ Key: '编辑', Value: 2 }) : null;
		this.Powers.PaypalAuthorizationVerify ? Drops.push({ Key: '验证', Value: 3 }) : null;
		this.Powers.PaypalChangeStatus ? Drops.push({ Key: '禁启用', Value: 4 }) : null;
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
		this.$set(this, 'List', [])
    let PostData = JSON.parse(JSON.stringify(this.SearchForm))
    PostData.IsEnable = PostData.IsEnable === "" ? "" : Boolean(PostData.IsEnable)
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: this.$Api.PaypalGetList,
				Login: true
			},
			Data: { Conditions: PostData, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
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
	
	//搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.PayPalAccountSearch())
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
  
  //获取列表复选框选中的数据
  private GetSelected(data: Interface.PayPalAccountList[] ): void{
    this.$set(this, 'Selected', data)
  }

  //取消全选
  private CancelSelect():void {
    (this.$refs["Table"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	
	//获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item] && ['PaypalCreate', 'PaypalChangeStatus', 'PaypalExportBalance'].includes(Item)){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
	}

	//1- 获取余额 3-验证
	private TableOpe(Type:number, Idx: number): void{
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: Type === 1 ? this.$Api.PaypalGetAccountBalance : this.$Api.PaypalAuthorizationVerify,
				Login: true
			},
			Data: Type === 1 ? this.List[Idx].Id : this.List[Idx].PaypalEmail,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', Type === 1 ? `${this.List[Idx].PaypalEmail}获取余额成功` : '验证授权成功');
          this.CancelSelect();
          // this.GetList();
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  // 列表操作项	(Type 1-获取余额  2-编辑 3-验证 4-禁启用)	(Index 当前编辑数据索引)
  private OperateGroup(Type: number, Index: number):void{
    if(Index !== undefined){
      this.CancelSelect();
    }

    switch(Type){
			case 1:
      case 3:
				this.TableOpe(Type, Index);
        break;
      case 2:
        (this.$refs["ModifyPayPalAccount"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))]);
        break
      case 4:
				this.ChangeStatusObj.ToTarget = !this.List[Index].IsEnable;
        (this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index]))], this.ChangeStatusObj);
        break;
    }
  }

  private ExportData(): void{
    let PostData = JSON.parse(JSON.stringify(this.SearchForm))
    PostData.IsEnable = PostData.IsEnable === "" ? "" : Boolean(PostData.IsEnable)

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Finance,
			Api: {
				Address: this.$Api.ExportAccountBalance,
				Login: true
			},
			Data: { IsEnable: PostData.IsEnable, PaypalEmail: PostData.PaypalEmail, Id: this.Selected.map(Item=> Item.Id) },
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出PayPal账号余额任务成功。 请到报表-导出管理模块查看目前正在进行的导出任务, 并在导出成功后可以下载对应的数据。`,
            Callback: (Res: boolean):void => { 
              this.CancelSelect();
            }
          });
				} else {
					this.$Request.Error(Res);
				}
			}
		})
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
	
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) //下拉
  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Finance, Api: this.$Api.PaypalChangeStatus, IdKey: 'Id', StatusKey: 'IsEnable', ToTarget: false, TipsKey: 'PayPal账号' };
	private Powers: PInterface.Power = {} // 权限
	private SearchForm : Interface.PayPalAccountSearch = new Interface.PayPalAccountSearch()  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private List: Interface.PayPalAccountList[] = []; //列表数据
  private Selected: Interface.PayPalAccountList[] = []; // 列表选中数据
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '注册邮箱', key: 'PaypalEmail' },
		{ title: '账号余额', key: 'UserName', render: (h: any, params: any): string => h('span', `${params.row.AccountBalance} ${params.row.BalanceCurrency}`) },
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
    { title: '操作',width: 100,render: (h: any, Params: any): string => {
				return h('Dropdown',{
					on: {
						'on-click': (name: any) => {
							this.OperateGroup(name, Params.row._index)
						}
					}
				}, [
					h('a', [
						h('span', { class: 'P-MR-5' }, '操作'),
						h('Icon', { props: { type: 'ios-arrow-down' } })
					]),
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: item.Value
							},
						}, item.Value === 4 ? (Params.row.IsEnable ? '禁用' : '启用') : item.Key);
					}))
				])
			}
		}
	]
}

</script>
<style lang="less"></style>
