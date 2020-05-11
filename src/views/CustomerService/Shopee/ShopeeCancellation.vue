<!-- Shopee Retufn/Refund -->
<template>
  <Row>
    <Col span="24" class="P-Search-Group">
      <Form inline ref="SearchFilter" :model="SearchFilter" onsubmit="return false;">
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
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选状态" v-model="SearchFilter.ShopeeStatus" :options="Status" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选状态" v-model="SearchFilter.ShopeeStatus" filterable clearable>
						<Option v-for="(Item, Index) in Status" :value="Item" :key="Index">{{ Item }}</Option>
					</Select> -->
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessStatus" :options="HandleStatusDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessStatus" filterable clearable>
						<Option v-for="(Item, Index) in HandleStatusDrop" :value="$Enums.CustomerService.CancellationProcessStatus[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选原因" v-model="SearchFilter.ReturnReason" filterable clearable>
						<Option v-for="(Item, Index) in RefundReason" :value="Item" :key="Index">{{ Item }}</Option>
					</Select> -->
          创建时间：
          <FormItem class="P-ML-20 P-W-200 P-VA-T P-Inline-Block" prop="StartTime" :rules="{ type: 'date', validator: ValidateDateRange, trigger: 'change' }">
            <DatePicker type="datetime" placeholder="开始时间" v-model="SearchFilter.StartTime"></DatePicker>
          </FormItem>
          <FormItem class="P-ML-20 P-W-200 P-VA-T P-Inline-Block" prop="EndTime" :rules="{ type: 'date', validator: ValidateDateRange, trigger: 'change' }">
            <DatePicker type="datetime" placeholder="结束时间" v-model="SearchFilter.EndTime"></DatePicker>
          </FormItem>
					</Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.FieldName" :options="SearchTypeDrop" />
          <!-- <Select slot="prepend" class="P-W-100" placeholder="关键词" filterable clearable v-model="SearchFilter.FieldName">
            <Option v-for="(Item, Index) in SearchTypeDrop" :key="Index" :value="$Enums.CustomerService.ShopeeCancellationSearchType[Item]">{{ Item }}</Option>
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
    <Modal v-model="DetailsModal" :title="IsHandle ? '处理Return/Refund' : 'Return/Refund详情'" @on-cancel="CancelDetails" :width="1000">
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
  name: 'ShopeeCancellation',
  components: {
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    Details: () => import('@/components/CustomerService/Shopee/ShopeeCancellationDetails.vue')
  }
})

export default class ShopeeCancellation extends Vue {
  @Action private 'CustomerService/CLEAR_DISPUTED_ASYNC': any

  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['DisposeReturn', 'ReturnExport']))
    this.GetStoreDrop();
    this.GetList();
  }

  private CalculateHeight(): number {
    return this.$UI.FullHeight() - 210;
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
        style: {  display: Params.row.ProcessStatus < 2 && this.Powers.DisposeReturn ? 'inline-block' : 'none' },
        on: { click: () => { this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 2, Params.row.Id); } }
      },'处理')
    ])
  }

  private GetStoreDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales['4'].StoreDrop
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
    (this as any).$refs.SearchFilter.validate((Valid: boolean): void => {
      if(Valid){
        this.CloseSearch();
        this.$UI.Loading.Show()
        this.$Request.Post({
          Server: this.$Server.CustomerService,
          Api: {
            Address: this.$Api.ShopeeCancellationGetList,
            Login: true
          },
          Data: {
            PageIndex: this.Pager.PageIndex,
            PageSize: this.Pager.PageSize,
            Conditions: this.GetSearchFilter()
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
    })
  }

  private SearchList(): void {
    this.ChangePage(1);
  }

  private ResetList(): void {
    this.$set(this, 'SearchFilter', new Interface.SearchShopeeReturnRefund())
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
      }, DisputedType, Id ,'ShopeeCancellationDetails')
    }else {
      this.$set(this, 'IsHandle', DisputedType > 1);
      (this as any).$refs.Details.Trigger(Id, DisputedType);
      this.$set(this, 'DetailsModal', true);
    }
  }

  private GetSearchFilter(): Interface.SearchShopeeReturnRefund {
    let Data = JSON.parse(JSON.stringify(this.SearchFilter))
    Data.StartTime ? Data.StartTime = this.$UI.Render.NewDate(Data.StartTime, true) : null
    Data.EndTime ? Data.EndTime = this.$UI.Render.NewDate(Data.EndTime, true) : null
    return Data
  }

  /* 验证时间区间，待优化 */
  private ValidateDateRange(Rule: any, Val: string): any {
    const OriKey = Rule.field, OtherKey = OriKey === 'StartTime' ? 'EndTime' : 'StartTime', Tips: string[] = OriKey === 'StartTime' ? ['开始', '结束', '晚于'] : ['结束','开始', '早于'], 
      OriVal = (this.SearchFilter as any)[OriKey], OtherVal =  (this.SearchFilter as any)[OtherKey]
      if(!OtherVal){
        (this as any).$refs.SearchFilter.validateField(OtherKey)
        return true
      }else{
        if(OriVal === ""){
          return new Error(`请选择${Tips[0]}时间`)
        }else if(this.SearchFilter.EndTime < this.SearchFilter.StartTime){
          return new Error(`${Tips[0]}时间不能${Tips[2]}${Tips[1]}时间`)
        }else if(+new Date(this.SearchFilter.EndTime) - (+new Date(this.SearchFilter.StartTime)) > 86400000 * 31){
          return new Error('时间区间不能超过31天')
        }else{
          return true
        }
      }
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
  private HandleStatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CancellationProcessStatus)
  private Status: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.ShopeeCancellationStatus)
  private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.ShopeeCancellationSearchType)

  private SearchFilter: Interface.SearchShopeeReturnRefund = new Interface.SearchShopeeReturnRefund()
  private Pager: PInterface.Pager = new PInterface.Pager()
  private List: Interface.ShopeeCancellationList[] = []

  private DetailsModal: boolean = false
  private IsHandle: boolean = false

  private Cols: PInterface.TableCol[] = [{
    title: '平台单号',
    render: (h: any, Params: any): string => {
      return h('a', {
        on: {
          click:() => {
            this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 1, Params.row.Id)
          }
        }
      }, Params.row.OrderSn)
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
    title: '权限原因',
    key: 'Reason'
  },{
    title: '状态',
    key: 'ShopeeStatus'
  }, {
    title: '客服处理状态',
    render: (h: any, Params: any): string => {
      return h('span', this.$Enums.CustomerService.CancellationProcessStatus[Params.row.ProcessStatus])
    }
  }, {
    title: '创建时间', width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.CreationTime, true))
    }
  }, {
    title: '更新时间', width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.UpdateTime, true))
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