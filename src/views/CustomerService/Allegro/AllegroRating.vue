<!-- allegro 客户评价 -->
<template>
  <Row>
    <Col span="24" class="P-Search-Group">
      <Form inline ref="SearchFilter" v-model="SearchFilter" onsubmit="return false;">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-PT-10">
          <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" :options="StoreDrop" />
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选评价类型" v-model="SearchFilter.Type" :options="TypeDrop" />
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选状态" v-model="SearchFilter.State" :options="StateDrop" />
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="是否回复" v-model="SearchFilter.Isreply" :options="IsreplyDrop" />
          <span class="P-MT-5 P-Inline-Block">评价时间：</span>
          <DatePicker type="datetime" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" placeholder="开始时间" v-model="SearchFilter.StartTime"></DatePicker>
          <DatePicker type="datetime" class="P-W-200 P-ML-10 P-MB-10 P-VA-T P-MR-10" placeholder="结束时间" v-model="SearchFilter.EndTime"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="关键词" v-model="SearchFilter.FieldName" :options="SearchTypeDrop" />
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
    </Col>
    <Col span="24">
      <Button type="primary" v-if="Powers.AllegroRatingsUpdateState" @click="ValidateOpe(4)" class="P-MR-10 P-MB-10">设置状态</Button>
      <Button type="primary" v-if="Powers.AllegroRatingsSetRemark" @click="ValidateOpe(5)" class="P-MR-10 P-MB-10">批量设置备注</Button>
    </Col>
    <Col span="24" class="P-MB-10">
      <Table ref="List" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()" @on-selection-change="GetSelected"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>
    <ShipOrderDetails ref="ShipOrderDetails" @emit-operate-success="GetList"></ShipOrderDetails>
    <AllegroRatingOpe ref="AllegroRatingOpe" @handle-res="HandleRes"></AllegroRatingOpe>/>
    <ViewAllegroRating ref="ViewAllegroRating"></ViewAllegroRating>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class'
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'AllegroRating',
  components: {
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    AllegroRatingOpe: ()=> import('@/components/CustomerService/Allegro/AllegroRatingOpe.vue'),
    ViewAllegroRating: ()=> import('@/components/CustomerService/Allegro/ViewAllegroRating.vue'),
  }
})

export default class AllegroRating extends Vue {
  @Action private 'CustomerService/CLEAR_DISPUTED_ASYNC': any

  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['AllegroRatingsDetail', 'AllegroRatingsReply', 'AllegroRatingsUpdateState', 'AllegroRatingsDelete', 'AllegroRatingsSetRemark', 'AllegroRatingsExport']))
    this.GetStoreDrop();
    this.SetOperateDrop();
  }

  // 初始化列表操作按钮
	private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [{ Key: '查看', Value: 1 }];
		this.Powers.AllegroRatingsReply ? Drops.push({ Key: '回复评价', Value:2 }) : null;
		this.Powers.AllegroRatingsDelete ? Drops.push({ Key: '请求删除评价', Value:3 }) : null;
		this.Powers.AllegroRatingsUpdateState ? Drops.push({ Key: '设置状态', Value:4 }) : null;
		this.Powers.AllegroRatingsSetRemark ? Drops.push({ Key: '设置备注', Value:5 }) : null;
    this.OperateDrop.push(...Drops);
    this.$set(this.SearchFilter, 'Type', 0);
    this.$set(this.SearchFilter, 'StartTime', new Date(new Date(new Date().toLocaleDateString()).setTime(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30)))
    this.$set(this.SearchFilter, 'EndTime', new Date(new Date(new Date().toLocaleDateString()).setTime(new Date(new Date().toLocaleDateString()).getTime() + (3600 * 1000 * 24) -1 )) )
		this.GetList();
	}

  private CalculateHeight(): number {
    let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }

  private GetStoreDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales['17'].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.StoreDrop.push(...Res.Data.DropList);
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CloseSearch(): void {
    this.$set(this, 'AccurateSearch', false)
  }

  private TriggerSearch(): void {
    this.$set(this, 'AccurateSearch', !this.AccurateSearch)
  }

  private ChangePage(N: number): void {
    this.$set(this.Pager, 'PageIndex', N);
    this.GetList();
  }

  private ChangePageSize(N: number): void {
    this.$set(this.Pager, 'PageSize', N);
    this.GetList();
  }

  private GetList(): void {
    this.CloseSearch();
    this.$UI.Loading.Show();
    let PostData: Interface.AllegroRatingSearch = JSON.parse(JSON.stringify(this.SearchFilter));
    PostData.StartTime ? PostData.StartTime = this.$UI.Render.NewDate(PostData.StartTime, true) : null;
    PostData.EndTime ? PostData.EndTime = this.$UI.Render.NewDate(PostData.EndTime, true) : null;
    PostData.Type = PostData.Type === "" ? "" : Boolean(PostData.Type)
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AllegroRatingsGetList,
        Login: true
      },
      Data: {
        PageIndex: this.Pager.PageIndex,
        PageSize: this.Pager.PageSize,
        Conditions: PostData
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'List', Res.Data.PageModel.Items)
          this.$set(this.Pager, 'TotalItems', Res.Data.PageModel.TotalItems)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private SearchList(): void {
    this.ChangePage(1);
  }

  private ResetList(): void {
    this.$set(this, 'SearchFilter', new Interface.AllegroRatingSearch())
    this.$set(this, 'Pager', new PInterface.Pager())
    this.$set(this.SearchFilter, 'Type', 0);
    this.$set(this.SearchFilter, 'StartTime', new Date(new Date(new Date().toLocaleDateString()).setTime(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 30)))
    this.$set(this.SearchFilter, 'EndTime', new Date(new Date(new Date().toLocaleDateString()).setTime(new Date(new Date().toLocaleDateString()).getTime() + (3600 * 1000 * 24) -1 )) )
    this.$set(this, 'List', [])
    this.GetList()
  }

  //获取列表复选框选中的数据
  private GetSelected(Data: Interface.AllegroOrderDisputeList[] ): void{
    this.$set(this, 'Selected', Data)
  }

  //取消全选
  private CancelSelect():void {
    (this.$refs["List"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

  /* DisputedType: 0-不展示 1-查看 2-处理 */
  private ForwardShipOrderDetails(C: string, DisputedType: number, Id: number = 0): void {
    this.CloseSearch();
    (this as  any).$refs.ShipOrderDetails.Validate({
      OrderId: 0,
      OrderCode: C
    }, DisputedType, Id ,'AllegroDisputedDetails')
  }

  private ValidateHandle(): void {
    (this as any).$refs.Details.Validate();
  }

  private CancelSelected(): void {
    (this as any).$refs.List.selectAll(false)
  }

  private HandleSuccess(): void {
    this.CancelDetails();
    this.GetList();
  }

  private CancelDetails(): void {
    this['CustomerService/CLEAR_DISPUTED_ASYNC']()
    this.$set(this, 'DetailsModal', false);
    this.$set(this, 'IsHandle', false);
  }

  private ValidateOpe(Type: number): void{
    if (!this.Selected.length) {
			this.$UI.Tips.Floating('warning', `请选择评价进行操作`);
			return;
    }
    
    if(Type === 5 && !(this.Selected.every( Item => !Item.EvaluateType))){
      this.$UI.Tips.Floating('warning', `请选择类型为do not recommend（不推荐）的评价后再进行操作`);
      this.CancelSelect();
			return;
    }
    this.OperateGroup(Type, undefined, true)
  }

  private OperateGroup(Type: number, Index?: number, IsBatch?:boolean): void{
    if(Index !== undefined){
      this.CancelSelect();
      this.$set(this, 'Selected', [JSON.parse(JSON.stringify(this.List[Index]))])
    }
    if(Type === 1){
      (this as any).$refs.ViewAllegroRating.TriggerModal(this.Selected[0]);
    }else{
      (this as any).$refs.AllegroRatingOpe.TriggerModal(this.Selected, Type, IsBatch);
    }
  }

  private HandleRes(B:boolean){
    this.CancelSelect();
    if(B){
      this.GetList();
    }
  }

  private Powers: PInterface.Power = {}
  private AccurateSearch: boolean = false
  private StoreDrop: PInterface.KV[] = []
  private TypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AllegroRatingType)
  private StateDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AllegroRatingState)
  private IsreplyDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.YesNo)
  private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AllegroRatingSearchType)
  private OperateDrop: PInterface.KV[] = [] // 下拉操作项

  private SearchFilter: Interface.AllegroRatingSearch = new Interface.AllegroRatingSearch()
  private Pager: PInterface.Pager = new PInterface.Pager()
  private List: Interface.AllegroRatingList[] = []
  private Selected: Interface.AllegroRatingList[] = []

  private DetailsModal: boolean = false
  private IsHandle: boolean = false

  private Cols: PInterface.TableCol[] = [{
    type: 'selection',
    width: 60,
    align: 'center'
  },{
    title: '评价ID',
    key: 'Id',
    width: 80
  }, {
    title: '发货订单',
    render: (h: any, Params: any): string => {
      if(Params.row.ShipOrderCode){
        return h('div', Params.row.ShipOrderCode.split(",").map((Item: string, Index: number) => {
          return h('a', {
            on: {
              click: () => {
                this.ForwardShipOrderDetails(Item, 0)
              }
            }
          }, `${Item}${Index === Params.row.ShipOrderCode.split(",").length - 1 ? '' : ', '}`);
        }))
      }else{
        return h('span', '-');
      }
    }
  }, {
    title: '店铺',
    key: 'StoreName'
  }, {
    title: '买家ID',
    key: 'BuyerId'
  }, {
    title: '评价类型',
    width: 150,
    render: (h: any, Params: any): string => {
      let S = Params.row.EvaluateType ? 1 : 0
      return h('span', (this.TypeDrop.find( Item => Item.Value === S) as PInterface.KV).Key )
    }
  }, {
    title: '评价内容',
    render: (h: any, Params: any): string => {
      return Params.row.EvaluateContent === "" ? h('span', '-') : h('Tooltip', {
        props: {
          content: Params.row.EvaluateContent
        },
        class: 'P-LINE-1'
      }, Params.row.EvaluateContent)
    }
  }, {
    title: '状态',
    width: 100,
    render: (h: any, Params: any): string => {
      return h('span', (this.StateDrop.find( Item => Item.Value === Params.row.State) as PInterface.KV).Key )
    }
  }, {
    title: '是否回复',
    width: 100,
    render: (h: any, Params: any): string => h('span', Params.row.IsReply ? '是' : '否') 
  }, {
    title: '备注',
    render: (h: any, Params: any): string => {
      return Params.row.Remark === "" ? h('span', '-') : h('Tooltip', {
        props: {
          content: Params.row.Remark
        },
        class: 'P-LINE-1'
      },Params.row.Remark)
    }
  }, {
    title: '买家评价时间',
    width: 160,
    render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.EvaluateTime, true)) 
  }, {
      title: '操作',
      width: 100,
      align: 'center',
      render: (h: any, Params: any): string => {
				return h('Dropdown',{
					on: {
						'on-click': (Name: number) => {
							this.OperateGroup(Name, Params.row._index)
						}
					}
				}, [
					h('a', [
						h('span', { class: 'P-MR-5' }, '操作'),
						h('Icon', { props: { type: 'ios-arrow-down' } })
					]),
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((Item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: Item.Value
							},
							style: { display: Item.Value === 5 ? (!Params.row.EvaluateType ? 'block' : 'none') : 'block' },
						}, Item.Key);
					}))
				])
			}
		}]
}
</script>
<style lang="less" scoped>

</style>