<!-- eBay升级纠纷 -->
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
           <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessStatus" :options="HandleStatusDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="筛选客服处理状态" v-model="SearchFilter.ProcessStatus" filterable clearable>
						<Option v-for="(Item, Index) in HandleStatusDrop" :value="$Enums.CustomerService.CancellationStatus[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
          <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="是否可申诉" v-model="SearchFilter.IsAppeal" :options="IsAppealDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MB-10 P-MR-10" placeholder="是否可申诉" v-model="SearchFilter.IsAppeal" filterable clearable>
						<Option v-for="(Item, Index) in IsAppealDrop" :value="$Enums.Public.YesNo[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
					</Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.FieldName" :options="SearchTypeDrop" />
          <!-- <Select slot="prepend" class="P-W-100" placeholder="关键词" filterable clearable v-model="SearchFilter.FieldName">
            <Option v-for="(Item, Index) in SearchTypeDrop" :key="Index" :value="$Enums.CustomerService.CaseSearchType[Item]">{{ Item }}</Option>
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
    <Modal v-model="DetailsModal" :title="IsHandle ? '处理升级纠纷' : '升级纠纷详情'" @on-cancel="CancelDetails" :width="900">
      <Details ref="Details" @emit-operate-success="HandleSuccess"></Details>
      <footer slot="footer">
        <Button v-if="IsHandle" type="primary" @click="ValidateHandle">{{ IsHandle === 3 ? '退款' : '申诉'}}</Button>
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
  name: 'EbayCase',
  components: {
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    Details: () => import('@/components/CustomerService/Ebay/CaseDetails.vue')
  }
})

export default class EbayCase extends Vue {
  @Action private 'CustomerService/CLEAR_DISPUTED_ASYNC': any
  
  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['EbayCaseRefund', 'EbayCaseAppeal']))
    this.GetStoreDrop();
    this.SearchList()
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
        style: { display: Params.row.ProcessStatus === 1 && this.Powers.EbayCaseRefund ? 'inline-block' : 'none' },
        on: { click: () => { this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 3, Params.row.Id); } }
      },'退款'),
      h('Button', {
        props: { size: 'small', type: 'primary'  },
        class: 'P-ML-5',
        style: { display: Params.row.ProcessStatus === 3 && this.Powers.EbayCaseAppeal && Params.row.IsAppeal ? 'inline-block' : 'none' },
        on: { click: () => { this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 4, Params.row.Id); } }
      },'申诉')
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
    let PostData: Interface.SearchCase = JSON.parse(JSON.stringify(this.SearchFilter))
    PostData.IsAppeal = PostData.IsAppeal === 0 ? false : PostData.IsAppeal === 1 ? true : ""

    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetCaseList,
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
    this.$set(this, 'List', [])
    this.ChangePage(1);
  }
  private ResetList(): void {
    this.$set(this, 'List', [])
    this.$set(this, 'SearchFilter', new Interface.SearchCancellation())
    this.$set(this, 'Pager', new PInterface.Pager())
    this.GetList();
  }

  /* DisputedType: 0-不展示 1-查看 2-处理 3-退款 4-申诉 */
  private ForwardShipOrderDetails(C: string, DisputedType: number, Id: number = 0): void {
    this.CloseSearch();
    if(C) {
      (this as  any).$refs.ShipOrderDetails.Validate({
        OrderId: 0,
        OrderCode: C
      }, DisputedType, Id ,'CaseDetails')
    }else {
      this.$set(this, 'IsHandle', DisputedType);
      (this as any).$refs.Details.Trigger(Id, DisputedType);
      this.$set(this, 'DetailsModal', true);
    }
  }

  private ValidateHandle(): void {
    (this as any).$refs.Details.Validate();
  }

  private HandleSuccess(): void {
    this.CancelDetails();
    this.GetList();
  }

  private CancelDetails(): void {
    this['CustomerService/CLEAR_DISPUTED_ASYNC']()
    this.$set(this, 'DetailsModal', false);
    this.$set(this, 'IsHandle', 0);
  }

  private Powers: PInterface.Power = {}
  private AccurateSearch: boolean = false
  private StoreDrop: PInterface.KV[] = []
  private HandleStatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CancellationStatus)
  private IsAppealDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.YesNo)
  private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CaseSearchType)

  private SearchFilter: Interface.SearchCase = new Interface.SearchCase()
  private Pager: PInterface.Pager = new PInterface.Pager()
  private List: Interface.CaseList[] = []

  private DetailsModal: boolean = false
  private IsHandle: number = 0

  private Cols: PInterface.TableCol[] = [{
    title: '编号',
    key: 'CaseId',
    render: (h: any, Params: any): string => {
      return h('a', {
        on: {
          click:() => {
            this.ForwardShipOrderDetails(Params.row.ShipOrderCode, 1, Params.row.Id)
          }
        }
      }, Params.row.CaseId)
    }
  }, {
    title: '发货单号',
    key: 'ShipOrderCode',
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
    title: '来源纠纷',
    key: 'SourceCode'
  },{
    title: '店铺',
    key: 'StoreName'
  }, {
    title : '买家ID',
    key: 'BuyerId'
  }, {
    title: '原因',
    key: 'Reason',
    render: (h: any, Params: any): string => {
      return h('span', Params.row.Reason || '-')
    }
  }, {
    title: '状态',
    key: 'OrderStatus',
  }, {
    title: '是否可申诉',
    render: (h: any, Params: any): string => {
      return h('span', {
        class: Params.row.IsAppeal ? 'P-Text-Error' : 'P-Text-Info'
      },Params.row.IsAppeal ? '是' : '否')
    }
  },{ 
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
    title: '更新时间',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.Updated, true))
    }
  }, { 
    title: '操作',
    width: 130,
    render: (h: any, Params: any): string => {
      return this.RenderOperates(h, Params)
    }
  }]
}
</script>
<style lang="less" scoped>

</style>