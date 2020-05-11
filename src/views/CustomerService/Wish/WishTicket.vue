<!-- 未收到货 -->
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
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" filterable clearable>
						<Option v-for="(Item, Index) in StoreDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select> -->
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessTypeId" :options="HandleStatusDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessTypeId" filterable clearable>
						<Option v-for="(Item, Index) in HandleStatusDrop" :value="$Enums.CustomerService.CancellationProcessStatus[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.FieldName" :options="SearchTypeDrop" />
          <!-- <Select slot="prepend" class="P-W-100" placeholder="关键词" filterable clearable v-model="SearchFilter.FieldName">
            <Option v-for="(Item, Index) in SearchTypeDrop" :key="Index" :value="$Enums.CustomerService.WishTicketSearchType[Item]">{{ Item }}</Option>
          </Select> -->
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
    </Col>
    <Col span="24" class="P-MB-10">
      <Table ref="List" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>

    <ShipOrderDetails ref="ShipOrderDetails" @emit-operate-success="GetList"></ShipOrderDetails>
    <Modal v-model="DetailsModal" :title="IsHandle ? '处理Wish工单' : 'Wish工单详情'" @on-cancel="CancelDetails" :width="1000">
      <Details ref="Details" @emit-operate-success="HandleSuccess"></Details>
      <footer slot="footer">
        <Button v-if="IsHandle" type="primary" @click="ValidateHandle(1)">回复</Button>
        <Button v-if="IsHandle" type="primary" @click="ValidateHandle(2)">关闭</Button>
        <Button v-if="IsHandle" type="primary" @click="ValidateHandle(3)">Wish客服协助</Button>
        <Button @click="CancelDetails">返回</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class'
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'WishTicket',
  components: {
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    Details: () => import('@/components/CustomerService/Wish/WishTicketDetails.vue')
  }
})

export default class WishTicket extends Vue {
  @Action private 'CustomerService/CLEAR_DISPUTED_ASYNC': any

  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['WishTicketHandle']))
    this.GetStoreDrop();
    this.GetList();
  }

  private CalculateHeight(): number {
    return this.$UI.FullHeight() - 210;
  }

  private RenderOperates(h: any, Params:any): string {
    return h('div', [
      h('Button', {
        props: { size: 'small', type: 'primary' },
        on: { click: () => { this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 1, Params.row.Id); } }
      },'查看'),
      h('Button', {
        props: { size: 'small', type: 'primary'  },
        class: 'P-ML-5',
        style: { display: Params.row.ProcessType === 1 && this.Powers.WishTicketHandle ? 'inline-block' : 'none' },
        on: { click: () => { this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 5, Params.row.Id); } }
      },'处理'),
      h('Button', {
        props: { size: 'small', type: 'primary'  },
        class: 'P-ML-5',
        style: { display: Params.row.ProcessType === 2 && this.Powers.WishTicketHandle ? 'inline-block' : 'none' },
        on: { click: () => { this.TriggerClose(Params.row.TicketId) } }
      },'关闭')
    ])
  }

  private GetStoreDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales['2'].StoreDrop
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
    this.$UI.Loading.Show()
    let PostData: Interface.SearchNotReceivedGoods = JSON.parse(JSON.stringify(this.SearchFilter))
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.WishTicketOrderList,
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
    this.$set(this, 'SearchFilter', new Interface.SearchWishTicket())
    this.$set(this, 'Pager', new PInterface.Pager())
    this.$set(this, 'List', [])
    this.GetList()
  }

  /* 关闭工单 */
  private TriggerClose(TicketId: string): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认执行关闭Wish工单操作',
      Callback: (B: boolean): void => {
        if(B){
          this.PostCloseTicket(TicketId)
        }
      }
    })
  }

  private PostCloseTicket(TicketId: string): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.WishTicketOrderClose,
        Login: true
      },
      Data: TicketId,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '关闭成功')
          this.GetList();
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* DisputedType: 0-不展示 1-查看 5-处理 */
  private ForwardShipOrderDetails(C: string, DisputedType: number, Id: number = 0): void {
    this.CloseSearch();
    if(C) {
      (this as  any).$refs.ShipOrderDetails.Validate({
        OrderId: 0,
        OrderCode: C
      }, DisputedType, Id ,'WishTicketDetails')
    }else {
      this.$set(this, 'IsHandle', DisputedType > 1);
      (this as any).$refs.Details.Trigger(Id, DisputedType);
      this.$set(this, 'DetailsModal', true);
    }
  }
  

  private ValidateHandle(T: number): void {
    (this as any).$refs.Details.Validate(T);
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
  

  private Powers: PInterface.Power = {}
  private AccurateSearch: boolean = false
  private StoreDrop: PInterface.KV[] = []
  private HandleStatusDrop: string[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CancellationProcessStatus)
  private SearchTypeDrop: string[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.WishTicketSearchType)

  private SearchFilter: Interface.SearchWishTicket = new Interface.SearchWishTicket()
  private Pager: PInterface.Pager = new PInterface.Pager()
  private List: Interface.NotReceiveGoodsList[] = []

  private DetailsModal: boolean = false
  private IsHandle: boolean = false

  private Cols: PInterface.TableCol[] = [{
    title: '编号',
    render: (h: any, Params: any): string => {
      return h('a', {
        on: {
          click:() => {
            this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 1, Params.row.Id)
          }
        }
      }, Params.row.TicketId)
    }
  }, {
    title: '标题',
    key: 'Subject'
  }, {
    title: '发货订单',
    render: (h: any, Params: any): string => {
      if(Params.row.ShipOrderCode){
        return h('a', {
          on: {
            click:() => {
              this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 0)
            }
          }
        },Params.row.ShipOrderCode)
      }else{
        return h('span', '-');
      }
    }
  }, {
    title: '店铺',
    key: 'StoreName'
  }, {
    title: '买家ID',
    key: 'BuyerName'
  }, {
    title: '标签',
    key: 'Label'
  }, {
    title: '状态',
    key: 'Status'
  }, {
    title: '客服处理状态',
    render: (h: any, Params: any): string => {
      return h('span', this.$Enums.CustomerService.CancellationProcessStatus[Params.row.ProcessType])
    }
  }, {
    title: '创建时间',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.Created, true))
    }
  }, {
    title: '更新时间',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.LastUpdateTime, true))
    }
  }, {
    title: '操作',
    width: 130,
    render: (h: any, Params: any): string => {
      return this.RenderOperates(h, Params);
    }
  }]
}
</script>
<style lang="less" scoped>

</style>