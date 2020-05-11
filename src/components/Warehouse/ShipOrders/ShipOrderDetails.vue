<template>
  <Row class="P-Inline-Block">
    <Modal v-model="ShipOrderModal" :title="DisputedType > 1 ? '处理纠纷' : DisputedType === 0 ? '发货订单详情' : '纠纷详情'" class="Container-Tabs" :mask-closable="false" :width="1200" @on-cancel="CancelShipOrderModal">
      <Tabs type="card" name="ShipOrderDetailsTabs" :closable="false" :value="ActiveTab" @on-click="ChangeTabs">
        <TabPane v-if="DisputedType > 0" label="纠纷详情" name="DisputedBaseInfo" tab="ShipOrderDetailsTabs" :index="1">
          <component v-if="DisputedCompName" :ref="DisputedCompName" :is="DisputedCompName"  @emit-operate-success="EmitDisputedSuccess" @emit-cancel-details="CancelShipOrderModal"></component>
        </TabPane>
        <TabPane label="基本信息" name="ShipOrderBaseInfo" tab="ShipOrderDetailsTabs" :index="2">
          <ShipOrderBaseInfo v-if="SHIP_ORDER_INFO.Id && ShipOrderModal" @emit-operate-success="EmitDetailsOperateSuccess"></ShipOrderBaseInfo>
        </TabPane>
        <TabPane label="订单明细" name="ShipOrderItems" tab="ShipOrderDetailsTabs" :index="3">
          <ShipOrderItems v-if="SHIP_ORDER_INFO.Id && ShipOrderModal"></ShipOrderItems>
        </TabPane>
        <TabPane label="配送地址" name="ShipOrderAddress" tab="ShipOrderDetailsTabs" :index="4">
          <ShipOrderAddress v-if="SHIP_ORDER_INFO.Id && ShipOrderModal"></ShipOrderAddress>
        </TabPane>
        <TabPane label="发货物流" name="ShipOrderLogistics" tab="ShipOrderDetailsTabs" :index="5">
          <ShipOrderLogistics v-if="SHIP_ORDER_INFO.Id && ShipOrderModal"></ShipOrderLogistics>
        </TabPane>
        <TabPane label="售后" name="ShipOrderAS" tab="ShipOrderDetailsTabs" :index="6">
          <ShipOrderAfterSales ref="ShipOrderAfterSales" @emit-disputed-details="TriggerDisputedDetails"  @emit-after-sales-order="TriggerAfterSalesOrder" /></ShipOrderAfterSales>
        </TabPane>
        <TabPane label="操作记录" name="ShipOrderHistory" tab="ShipOrderDetailsTabs" :index="7">
          <ShipOrderHistory v-if="SHIP_ORDER_INFO.Id && ShipOrderModal"></ShipOrderHistory>
        </TabPane>
        <TabPane v-if="SHIP_ORDER_INFO.IsReport" label="毛利" name="ShipOrderProfits" tab="ShipOrderDetailsTabs" :index="8">
          <ShipOrderGrossProfits ref="ShipOrderGrossProfits" />
        </TabPane>
      </Tabs>
      <footer slot="footer">
        <ShipOrderDetailsOperate v-if="DisputedType < 2" ref="ShipOrderDetailsOperate" @cancel-ship-order-modal="CancelShipOrderModal" @emit-operate-success="EmitDetailsOperateSuccess"></ShipOrderDetailsOperate>
        <DisputedOperate v-else :DisputedCompName="DisputedCompName" :DisputedType="DisputedType"  @cancel-ship-order-modal="CancelShipOrderModal" @emit-operate-success="EmitDetailsOperateSuccess"></DisputedOperate>
      </footer>
    </Modal>
    <Modal v-model="DisputedModal" title="纠纷详情" :width="1000" @on-cancel="CancelDisputedModal">
      <component :is="DisputedDetailsCompName" :ref="`DisputedDetails${DisputedDetailsCompName}`"></component>
      <footer slot="footer">
        <Button @click="CancelDisputedModal">返回</Button>
      </footer>
    </Modal>
    <ModifyAfterSalesOrder ref="ModifyAfterSalesOrder" @emit-operate-success="UpdateShipOrderAfterSales" ></ModifyAfterSalesOrder>
    <AfterSalesOrderDetails ref="AfterSalesOrderDetails" />
  </Row>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/ShipOrder";


const Components: PInterface.KV[] = [{
    Key: 'ShipOrderBaseInfo',
    Value: './ShipOrderBaseInfo'  
  }, {
    Key: 'ShipOrderItems',
    Value: './ShipOrderItems'
  }, {
    Key: 'ShipOrderAddress',
    Value: './ShipOrderAddress'
  }, {
    Key: 'ShipOrderLogistics',
    Value: './ShipOrderLogistics'
  }, {
    Key: 'ShipOrderHistory',
    Value: './ShipOrderHistory'
  }, {
    Key: 'ShipOrderDetailsOperate',
    Value: './ShipOrderDetailsOperate'
  }, {
    Key: 'ShipOrderAfterSales',
    Value: './ShipOrderAfterSales'
  }, {
    Key: 'ShipOrderGrossProfits',
    Value: './ShipOrderGrossProfits'
  }]

function AsyncComps(): any {
  let Async = []
  for(let Idx = 0, Len = Components.length; Idx < Len; Idx++){
    Async.push(() => ({
      component: import(`${Components[Idx].Value}.vue`),
      delay: 1000,
      timeout: 3000
    }))
  }
  return Async
}

const [ShipOrderBaseInfo, ShipOrderItems, ShipOrderAddress, ShipOrderLogistics, ShipOrderHistory, ShipOrderDetailsOperate, ShipOrderAfterSales, ShipOrderGrossProfits] = [...AsyncComps()]

for(let Idx = 0, Len = Components.length; Idx < Len; Idx++){
  Vue.component((Components[Idx].Key as string), (resolve: () => void, reject: () => void) => {
    setTimeout(() => {
      const Path: string = Components[Idx].Value as string
      require([`${Path}.vue`], resolve)
    }, 1000)
  })
}

@Component({
  name: "ShipOrderDetails",
  components: {
    // ShipOrderBaseInfo: () => import("./ShipOrderBaseInfo.vue"),
    // ShipOrderItems: () => import("./ShipOrderItems.vue"),
    // ShipOrderAddress: () => import("./ShipOrderAddress.vue"),
    // ShipOrderLogistics: () => import("./ShipOrderLogistics.vue"),
    // ShipOrderHistory: () => import("./ShipOrderHistory.vue"),
    // ShipOrderDetailsOperate: () => import("./ShipOrderDetailsOperate.vue"),
    // ShipOrderAfterSales: () => import('./ShipOrderAfterSales.vue'),
    CancellationDetails: () => import('@/components/CustomerService/Ebay/CancellationDetails.vue'),
    NotReceivedGoodsDetails: () => import('@/components/CustomerService/Ebay/NotReceivedGoodsDetails.vue'),
    RefundDetails: () => import('@/components/CustomerService/Ebay/RefundDetails.vue'),
    CaseDetails: () => import('@/components/CustomerService/Ebay/CaseDetails.vue'),
    WishTicketDetails: () => import('@/components/CustomerService/Wish/WishTicketDetails.vue'),
    ShopeeReturnRefundDetails: () => import('@/components/CustomerService/Shopee/ShopeeReturnRefundDetails.vue'),
    ShopeeCancellationDetails: () => import('@/components/CustomerService/Shopee/ShopeeCancellationDetails.vue'),
    AfterSalesOrderDetails: () => import('@/components/CustomerService/AfterSales/AfterSalesOrderDetails.vue'),
    DisputedOperate: () => import('@/components/CustomerService/Ebay/DisputedOperate.vue'),
    ModifyAfterSalesOrder: () => import('@/components/CustomerService/AfterSales/ModifyAfterSalesOrder.vue'),
    AllegroDisputedDetails: () => import('@/components/CustomerService/Allegro/AllegroDisputedDetails.vue')
  }
})
export default class ShipOrderDetails extends Vue {
  @Action private "ShipOrder/UPDATE_SHIP_ORDER_INFO": any;
  @Action private "ShipOrder/UPDATE_SHIP_ORDER_REMARK": any;
  @Action private "ShipOrder/UPDATE_STATE_ASYN": any;
  @Action private 'CustomerService/CLEAR_DISPUTED_ASYNC': any
  @Getter private "ShipOrder/SHIP_ORDER_ADDRESS": PInterface.ShipToAddress;
  @Getter private "ShipOrder/SHIP_ORDER_ITEMS": Interface.ShipOrderItem[];
  @Getter private "ShipOrder/SHIP_ORDER_HISTORY": Interface.ShipOrderHistory[];
  @Getter private "ShipOrder/SHIP_ORDER_REMARK": Interface.ShipOrderRemark[];
  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;

  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }
  get SHIP_ORDER_ADDRESS() {
    return this["ShipOrder/SHIP_ORDER_ADDRESS"];
  }
  get SHIP_ORDER_ITEMS() {
    return this["ShipOrder/SHIP_ORDER_ITEMS"];
  }
  get SHIP_ORDER_HISTORY() {
    return this["ShipOrder/SHIP_ORDER_HISTORY"];
  }
  get SHIP_ORDER_REMARK() {
    return this["ShipOrder/SHIP_ORDER_REMARK"];
  }

  @Emit() EmitOperateSuccess():void {}

  /* Params: 获取订单详情的参数  DisputedType-不展示纠纷  1-查看纠纷  2-处理纠纷（默认为0,1和2均要获取纠纷详情）3-退款（升级纠纷） 4-申诉（升级纠纷） 5-处理Wish工单  DisputedCompName */
  private Validate(Params: Interface.InfoParams, DisputedType: number = 0, DisputedId: number = 0,DisputedCompName: string = ""):void {
    this.$set(this,'ShipOrderModal',true);
    this.$set(this, 'HadModify', false); // 是否经过操作，若有，则需要在关闭模态框时刷新列表
    this["ShipOrder/UPDATE_SHIP_ORDER_INFO"](Params); // 获取订单详情
    // 纠纷相关
    this.$set(this, "ActiveTab", DisputedType > 0 ? "DisputedBaseInfo" : "ShipOrderBaseInfo") // 初始tab为纠纷或订单
    this.$set(this, 'DisputedType', DisputedType) // 纠纷展示类型
    this.$set(this, 'DisputedId', DisputedId) // 纠纷ID
    this.$set(this, 'DisputedCompName', DisputedCompName); // 纠纷详情组件名称
    if(DisputedType > 0){
      this.$nextTick(()=>{
        setTimeout(()=>{
          (this as any).$refs[DisputedCompName].Trigger(DisputedId, DisputedType); // 获取纠纷详情
        },300)
      })
    }
  }

  private ChangeTabs(N:string):void{
    this.$set(this,'ActiveTab',N);
    if(N === 'ShipOrderAS'){
      (this as any).$refs.ShipOrderAfterSales.Trigger(this.SHIP_ORDER_INFO.Platform, this.SHIP_ORDER_INFO.OrderCode);
    }else if(N === 'ShipOrderProfits'){
      (this as any).$refs.ShipOrderGrossProfits.Trigger()
    }
  }

  private EmitDetailsOperateSuccess(Action:string = "ShipOrder/UPDATE_SHIP_ORDER_INFO"):void {
    this[Action]();
    this.$set(this,'HadModify',true);
  }

  private EmitDisputedSuccess(): void {
    this.$set(this,'HadModify',true);
    this.CancelShipOrderModal();
  }

  private CancelShipOrderModal():void {
    this["ShipOrder/UPDATE_STATE_ASYN"]({
      SHIP_ORDER_INFO: {},
      SHIP_ORDER_ADDRESS: {},
      SHIP_ORDER_ITEMS: [],
      SHIP_ORDER_HISTORY: [],
      ORDER_PARAMS: new Interface.InfoParams()
    });
    this["CustomerService/CLEAR_DISPUTED_ASYNC"]()
    if(this.HadModify){
      this.EmitOperateSuccess();
    }
    (this as any).$refs.ShipOrderAfterSales.Reset();
    this.$set(this,'ShipOrderModal',false);
    this.$set(this, 'DisputedType', 0)
    this.$set(this, 'DisputedId', 0)
  }

  /* 纠纷 */
  private TriggerDisputedDetails(DisputedId: number, CompName: string): void {
    if(CompName === this.DisputedCompName && this.DisputedType > 0 && this.DisputedId === DisputedId){
      this.$set(this, 'ActiveTab', 'DisputedBaseInfo')
    }else{
      if(CompName === 'AfterSalesOrderDetails'){
        (this as any).$refs[`AfterSalesOrderDetails`].Trigger(DisputedId, false);
      }else{
        this.$set(this, 'DisputedModal', true)
        this.$set(this, 'DisputedDetailsCompName', CompName)
        this.$nextTick(()=>{
          this.$UI.Loading.Show();
          setTimeout(()=>{
            (this as any).$refs[`DisputedDetails${CompName}`].Trigger(DisputedId, 1);
          },300)
        })
      }
    }
  }

  private CancelDisputedModal(): void {
    this.$set(this, 'DisputedModal', false)
    if(this.DisputedType < 1){
      // 清空纠纷信息
      this["CustomerService/CLEAR_DISPUTED_ASYNC"]()
    }
  }

  private TriggerAfterSalesOrder(): void {
    (this as any).$refs.ModifyAfterSalesOrder.TriggerCreate(this.SHIP_ORDER_INFO.OrderCode);
  }

   private UpdateShipOrderAfterSales(): void {
    (this as any).$refs.ShipOrderAfterSales.Trigger(this.SHIP_ORDER_INFO.Platform, this.SHIP_ORDER_INFO.OrderCode);
  }

  /* 纠纷 */

  private ShipOrderModal: boolean = false;
  private ActiveTab: string = "ShipOrderBaseInfo";
  private HadModify: boolean = false

  private DisputedType: number = 0 // 0-不展示纠纷 1-查看纠纷 2-处理纠纷
  private DisputedCompName: string = '' // 纠纷详情组件名称
  private DisputedId: number = 0

  private DisputedModal: boolean = false
  private DisputedDetailsCompName: string = '' // 售后tab查看纠纷详情组件名称

}
</script>
<style lang="less" scoped>
</style>