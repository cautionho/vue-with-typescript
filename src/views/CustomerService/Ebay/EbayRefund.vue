<!-- 退款退货 -->
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
          <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" :opotions="StoreDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" filterable clearable>
						<Option v-for="(Item, Index) in StoreDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
					</Select> -->
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessStatus" :options="HandleStatusDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessStatus" filterable clearable>
						<Option v-for="(Item, Index) in HandleStatusDrop" :value="$Enums.CustomerService.RefundProcessStatus[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选状态" v-model="SearchFilter.EbayStatus" :options="RefundStatus" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选状态" v-model="SearchFilter.EbayStatus" filterable clearable>
						<Option v-for="(Item, Index) in RefundStatus" :value="Item" :key="Index">{{ Item }}</Option>
					</Select> -->
           <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选原因" v-model="SearchFilter.ReturnReason" :options="RefundReason" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选原因" v-model="SearchFilter.ReturnReason" filterable clearable>
						<Option v-for="(Item, Index) in RefundReason" :value="Item" :key="Index">{{ Item }}</Option>
					</Select> -->
          创建时间：
          <DatePicker type="datetime" class="P-W-200 P-ML-10 P-MB-10 P-VA-T" placeholder="开始时间" v-model="SearchFilter.StartCreatedTime"></DatePicker>
          <DatePicker type="datetime" class="P-W-200 P-ML-10 P-MB-10 P-VA-T P-MR-10" placeholder="结束时间" v-model="SearchFilter.EndCreatedTime"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.FieldName" :options="SearchTypeDrop" />
          <!-- <Select slot="prepend" class="P-W-100" placeholder="关键词" filterable clearable v-model="SearchFilter.FieldName">
            <Option v-for="(Item, Index) in SearchTypeDrop" :key="Index" :value="$Enums.CustomerService.RefundSearchType[Item]">{{ Item }}</Option>
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
      <EbayMsgSend ref="EbayMsgSend" class="P-MB-10" v-if="Powers.EbayMsgSend" @trigger-operations="TriggerOperations" @emit-operate-success="CancelSelected" />
    </Col>
    <Col span="24" class="P-MB-10">
      <Table ref="List" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>

    <ShipOrderDetails ref="ShipOrderDetails" @emit-operate-success="GetList"></ShipOrderDetails>
    <Modal v-model="DetailsModal" :title="IsHandle ? '处理退款退货' : '退款退货详情'" @on-cancel="CancelDetails" :width="1000">
      <Details ref="Details" @emit-operate-success="HandleSuccess" @emit-cancel-details="CancelDetails"></Details>
      <footer slot="footer">
        <Button v-if="IsHandle" type="primary" @click="ValidateHandle">提交</Button>
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
  name: 'EbayRefund',
  components: {
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    Details: () => import('@/components/CustomerService/Ebay/RefundDetails.vue'),
    EbayMsgSend: () => import('@/components/CustomerService/Ebay/WriteStationMail.vue')
  }
})

export default class EbayRefund extends Vue {
  @Action private 'CustomerService/CLEAR_DISPUTED_ASYNC': any

  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['EbayMsgSend', 'EbayReturnHandle']))
    this.GetStoreDrop();
    this.GetList();
  }

  private CalculateHeight(): number {
    return this.Powers.EbayMsgSend ? this.$UI.FullHeight() - 252 : this.$UI.FullHeight() - 210;
  }

  private RenderOperates(h:any, Params:any): string {
    return h('div', [
      h('Button', {
        props: { size: 'small', type: 'primary' },
        on: { click: () => { this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 1, Params.row.Id); } }
      },'查看'),
      h('Button', {
        props: { size: 'small', type: 'primary' },
        class: 'P-ML-5',
        style: {  display: Params.row.ProcessStatus < 3 && this.Powers.EbayReturnHandle ? 'inline-block' : 'none' },
        on: { click: () => { this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 2, Params.row.Id); } }
      },'处理')
    ])
  }

  private GetStoreDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales['1'].StoreDrop
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
    let PostData: Interface.SearchRefund = JSON.parse(JSON.stringify(this.SearchFilter))
    PostData.StartCreatedTime ? PostData.StartCreatedTime = this.$UI.Render.NewDate(PostData.StartCreatedTime, true) : null
    PostData.EndCreatedTime ? PostData.EndCreatedTime = this.$UI.Render.NewDate(PostData.EndCreatedTime, true) : null
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.ReturnList,
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
    this.$set(this, 'SearchFilter', new Interface.SearchNotReceivedGoods())
    this.$set(this, 'Pager', new PInterface.Pager())
    this.$set(this, 'List', [])
    this.GetList()
  }

  /* DisputedType: 0-不展示 1-查看 2-处理 */
  private ForwardShipOrderDetails(C: string, DisputedType: number, Id: number = 0): void {
    this.CloseSearch();
    if(C) {
      (this as  any).$refs.ShipOrderDetails.Validate({
        OrderId: 0,
        OrderCode: C
      }, DisputedType, Id ,'RefundDetails')
    }else {
      this.$set(this, 'IsHandle', DisputedType > 1);
      (this as any).$refs.Details.Trigger(Id, DisputedType);
      this.$set(this, 'DetailsModal', true);
    }
  }

  private TriggerOperations(): void {
    const Selc:Interface.RefundList[] = (this as any).$refs.List.getSelection().filter((Item : Interface.RefundList) => Item.ShipOrderCode !== "");
    (this as any).$refs.EbayMsgSend.DisputedWrite(Selc.map((Item : Interface.RefundList) => Item.ShipOrderCode))
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

  private Powers: PInterface.Power = {}
  private AccurateSearch: boolean = false
  private StoreDrop: PInterface.KV[] = []
  private HandleStatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.RefundProcessStatus)
  private RefundStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.RefundStatus)
  private RefundReason: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.RefundReason)
  private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.RefundSearchType)

  private SearchFilter: Interface.SearchRefund = new Interface.SearchRefund()
  private Pager: PInterface.Pager = new PInterface.Pager()
  private List: Interface.RefundList[] = []

  private DetailsModal: boolean = false
  private IsHandle: boolean = false

  private Cols: PInterface.TableCol[] = [{
    type: 'selection', width: 60, align: 'center'
  },{
    title: '编号',
    render: (h: any, Params: any): string => {
      return h('a', {
        on: {
          click:() => {
            this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 1, Params.row.Id)
          }
        }
      }, Params.row.ReturnId)
    }
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
    key: 'BuyerId'
  }, {
    title: '原因',
    key: 'Reason'
  },{
    title: '买家期望方案',
    render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.BuyerExpect
        },
        class: 'P-LINE-1'
      },Params.row.BuyerExpect)
    }
  }, {
    title: '状态',
    key: 'OrderStatus'
  }, {
    title: '客服处理状态',
    render: (h: any, Params: any): string => {
      return h('span', this.$Enums.CustomerService.CancellationProcessStatus[Params.row.ProcessStatus])
    }
  }, {
    title: '创建时间',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.Created, true))
    }
  }, {
    title: '最迟回复时间',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.LatestResponseDate, true))
    }
  }, {
    title: '操作',
    width: 130,
    render: (h: any, Params: any): string => {
      return this.RenderOperates(h,Params)
    }
  }]
}
</script>
<style lang="less" scoped>

</style>