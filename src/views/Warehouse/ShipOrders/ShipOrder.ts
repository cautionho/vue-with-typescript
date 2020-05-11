import { Vue, Component, Prop } from 'vue-property-decorator';
import {Action,Getter} from 'vuex-class';
import Interface from '@/assets/Interface/ShipOrder';
import PInterface from '@/assets/Interface/Public';

@Component({
  name: 'ShipOrder',
  components: {
    SearchShipOrder: () => import('@/components/Warehouse/ShipOrders/SearchShipOrder.vue'),
    ShipOrderList: () => import('@/components/Warehouse/ShipOrders/ShipOrderList.vue'),
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
  }
})

export default class ShipOrder extends Vue {
  @Action private 'ShipOrder/UPDATE_SHIP_ORDER_POWERS':any
  @Getter private 'ShipOrder/SHIP_ORDER_POWERS':PInterface.Power
  // get SHIP_ORDER_POWERS() {
  //   return this["ShipOrder/SHIP_ORDER_POWERS"];
  // }
  @Prop(Interface.ShipOrderSearch) private SearchInit?: Interface.ShipOrderSearch
  @Prop(Array) private UsableOperations?:string[]
  @Prop(String) private Page: string

  get TOperations(){
    return this.UsableOperations
  }

  private mounted(){
    this['ShipOrder/UPDATE_SHIP_ORDER_POWERS']({VM:this,Powers:['ShipOrderCreate','ShipOrderModify','ImportShipOrder','ToConfirmed','ToNoCheck','ToCancel','ToHoldUp','ToOutStock','ToContact','SplitShipOrder','MergeShipOrder','ReSentOrder','ChangeShipWarehouse','SetShippingMethod','CreateBatchOrder','RevertPack','PrintLable','SetTrackNumber','QuickCreateBatchOrder','OrderReCreate','ExportShipOrder','SignShiped','ReviewShipOrder','ReplaceLogisticsLabel','UpdEdisPackage','CancelLmaParcel','CancelFLSFlag','ExportDetailsErrorOrder','ReturnGoods', 'AddShipOrderRemark', 'ExportDetailsErrorOrder', 'ReviewShipOrder','EbayMsgSend']});
  }

  /* 搜索数据变更 */
  private EmitList(List: any[], Total: number): void {
    this.$set(this, 'List', [])
    this.List.push(...List);
    (this as any).$refs.ShipOrderList.SetTotalItems(Total);
  }
  /* 分页器变更 */
  private EmitPagerChange(Pager: PInterface.Pager, Init?: boolean): void {
    this.$set(this, 'Pager', Pager);
    this.$nextTick(() => {
      if (Init) {
        (this as any).$refs.ShipOrderList.PagerReset();
      }
      (this as any).$refs.SearchShipOrder.SearchList();
    })
  }

  private EmitCloseSearch(): void {
    (this as any).$refs.SearchShipOrder.CloseSearch();
  }

  private EmitDetails(Params:Interface.InfoParams):void {
    (this as any).$refs.ShipOrderDetails.Validate(Params);
  }

  private EmitOperateSuccess():void {
    (this as any).$refs.SearchShipOrder.SearchList();
  }

  private Pager: PInterface.Pager = new PInterface.Pager()
  private List: Interface.ShipOrderList[] = []
}