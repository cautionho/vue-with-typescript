<template>
  <Row>
    <AddShipOrderRemark v-if="SHIP_ORDER_POWERS.AddShipOrderRemark" ref="AddShipOrderRemark" class="P-Inline-Block P-MR-5" @emit-operate-success="EmitOperateSuccess"></AddShipOrderRemark>
    <span v-for="(Item,Index) in EnableOperate"  :key="`${Item.Value}${Index}`">
      <component :is="Item.Value" :ref="Item.Value" class="P-Inline-Block P-MR-5" v-if="IsEnableOperate(Item.Value)" @trigger-operations="TriggerOperations" @emit-operate-success="EmitOperateSuccess"></component>
    </span>
    <Button @click="CancelShipOrderModal">返回</Button>
  </Row>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { Getter } from "vuex-class";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/ShipOrder";

const Components: PInterface.KV[] = [{
    Key: 'AddShipOrderRemark',
    Value: './AddRemark'
  }, {
    Key: 'CancelFLSFlag',
    Value: './CancelFLS'
  }, {
    Key: 'CancelLmaParcel',
    Value: './CancelLMA'
  }, {
    Key: 'ShipOrderModify',
    Value: './ModifyOrder'
  }, {
    Key: 'ToConfirmed',
    Value: './Confirm'
  }, {
    Key: 'ToCancel',
    Value: './Cancel'
  }, {
    Key: 'ToHoldUp',
    Value: './HoldUp'
  }, {
    Key: 'ToContact',
    Value: './Contact'
  }, {
    Key: 'ToNoCheck',
    Value: './Check'
  }, {
    Key: 'ReSentOrder',
    Value: './Resent'
  }, {
    Key: 'SetShippingMethod',
    Value: './SetShippingMethod'
  }, {
    Key: 'ChangeShipWarehouse',
    Value: './SetShipWarehouse'
  }, {
    Key: 'SplitShipOrder',
    Value: './Split'
  }, {
    Key: 'UpdEdisPackage',
    Value: './UpdateEdis'
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

const [AddShipOrderRemark, CancelFLSFlag, CancelLmaParcel, ShipOrderModify, ToConfirmed, ToCancel, ToHoldUp, ToContact, ToNoCheck, 
      ReSentOrder, SetShippingMethod, ChangeShipWarehouse, SplitShipOrder, UpdEdisPackage] = [...AsyncComps()]

for(let Idx = 0, Len = Components.length; Idx < Len; Idx++){
  Vue.component((Components[Idx].Key as string), (resolve: () => void, reject: () => void) => {
    setTimeout(() => {
      const Path: string = Components[Idx].Value as string
      require([`${Path}.vue`], resolve)
    }, 1000)
  })
}

@Component({
  name: "ShipOrderDetailsOperate",
  components: {
    // AddShipOrderRemark: () => import("./AddRemark.vue"),
    // CancelFLSFlag: () => import('./CancelFLS.vue'),
    // CancelLmaParcel: () => import('./CancelLMA.vue'),
    // ShipOrderModify: () => import('./ModifyOrder.vue'),
    // ToConfirmed: () => import('./Confirm.vue'),
    // ToCancel: () => import('./Cancel.vue'),
    // ToHoldUp: () => import('./HoldUp.vue'),
    // ToContact: () => import('./Contact.vue'),
    // ToNoCheck: () => import('./Check.vue'),
    // ReSentOrder: () => import('./Resent.vue'),
    // SetShippingMethod: () => import('./SetShippingMethod.vue'),
    // ChangeShipWarehouse: () => import('./SetShipWarehouse.vue'),
    // SplitShipOrder: () => import('./Split.vue'),
    // UpdEdisPackage: () => import('./UpdateEdis.vue')
  }
})
export default class ShipOrderDetailsOperate extends Vue {
  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  @Getter private "ShipOrder/SHIP_ORDER_ADDRESS": PInterface.ShipToAddress;
  @Getter private "ShipOrder/SHIP_ORDER_REMARK": Interface.ShipOrderRemark[];
  @Getter private "ShipOrder/SHIP_ORDER_POWERS": PInterface.Power

  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }
  get SHIP_ORDER_ADDRESS() {
    return this["ShipOrder/SHIP_ORDER_ADDRESS"];
  }
  get SHIP_ORDER_REMARK() {
    return this["ShipOrder/SHIP_ORDER_REMARK"];
  }
  get SHIP_ORDER_POWERS(){
    return this["ShipOrder/SHIP_ORDER_POWERS"]
  }

  @Emit() CancelShipOrderModal():void {}
  @Emit() EmitOperateSuccess(Action:string = 'ShipOrder/UPDATE_SHIP_ORDER_INFO'):void {}

  private mounted() {
    this.SetEnableOperate();
  }

  private SetEnableOperate(): void {
    this.EnableOperate = [];
    for (let Item in this.SHIP_ORDER_POWERS) {
      if (this.SHIP_ORDER_POWERS[Item]) {
        switch (Item) {
          case "CancelFLSFlag":
            this.EnableOperate.push({
              Key: "取消FLS包裹单",
              Value: Item
            });
            break;
          case "CancelLmaParcel":
            this.EnableOperate.push({
              Key: "取消LMA包裹单",
              Value: Item
            });
            break;
          case "ShipOrderModify":
            this.EnableOperate.push({ Key: "编辑", Value: Item });
            break;
          case "ToConfirmed":
            this.EnableOperate.push({ Key: "确认", Value: Item });
            break;
          case "ToCancel":
            this.EnableOperate.push({ Key: "取消", Value: Item });
            break;
          case "ToHoldUp":
            this.EnableOperate.push({ Key: "拦截", Value: Item });
            break;
          case "ToContact":
            this.EnableOperate.push({ Key: "联系客户", Value: Item });
            break;
          case "ToNoCheck":
            this.EnableOperate.push({ Key: "检查", Value: Item });
            break;
          case "ReSentOrder":
            this.EnableOperate.push({ Key: "重发", Value: Item });
            break;
          case "SetShippingMethod":
            this.EnableOperate.push({
              Key: "设置发货渠道",
              Value: Item
            });
            break;
          case "ChangeShipWarehouse":
            this.EnableOperate.push({
              Key: "设置发货仓",
              Value: Item
            });
            break;
          case "SplitShipOrder":
            this.EnableOperate.push({ Key: "拆分", Value: Item });
            break;
          case "UpdEdisPackage":
            this.EnableOperate.push({
              Key: "更新EDIS包裹单",
              Value: Item
            });
            break;
        }
      }
    }
  }

  private IsEnableOperate(P: string): boolean {
    const Status = this.SHIP_ORDER_INFO.Status,
      ApiType = this.SHIP_ORDER_INFO.ApiType,
      TrackingNumber = this.SHIP_ORDER_INFO.TrackingNumber !== "",
      MethodApiCode = this.SHIP_ORDER_INFO.MethodApiCode !== "",
      IsException = this.SHIP_ORDER_INFO.IsException || false,
      ItemType = this.SHIP_ORDER_INFO.ItemType,
      IsOverseas = [15, 16, 17].some(item => this.SHIP_ORDER_INFO.ApiType === item),
      WarehouseId = this.SHIP_ORDER_INFO.ShipWarehouseId !== 0,
      ShippingMethodId = this.SHIP_ORDER_INFO.ShippingMethodId !== 0;
    switch (P) {
      case "CancelFLSFlag":
        return (
          ApiType === 26 &&
          [7, 8, 9, 99].some(item => item === Status) &&
          TrackingNumber &&
          MethodApiCode
        );
      case "CancelLmaParcel":
        return (
          ApiType === 29 &&
          [7, 8, 9, 99].some(item => item === Status) &&
          TrackingNumber &&
          MethodApiCode
        );
      case "ShipOrderModify":
        
        return <boolean>(
          ([1, 7, 8, 9].some(item => item === Status)) ||
          ([2, 3, 4].some(item => item === Status) && IsException)
        );
      case "ToConfirmed":
        return [1, 7, 8, 9].some(item => item === Status) && WarehouseId && ShippingMethodId;
      case "ToCancel":
        return [1, 7, 8, 9].some(item => item === Status);
      case "ToHoldUp":
        return [2, 3, 4, 5].some(item => item === Status) && !IsOverseas;
      case "ToContact":
        return [2, 7, 8].some(item => item === Status) && !IsOverseas;
      case "ToNoCheck":
        return Status === 99;
      case "ReSentOrder":
        return Status === 6;
      case "SetShippingMethod":
        return [7, 9].some(item => item === Status);
      case "ChangeShipWarehouse":
      case "SplitShipOrder":
        return (
          ItemType !== 1 &&
          [2, 4, 7].some(item => item === Status) &&
          !IsOverseas
        );
      case "UpdEdisPackage":
        return ApiType === 20 && [7, 8, 9].some(item => item === Status);
      default:
        return false;
    }
  }

  private TriggerOperations(N:string):void {
    (this as any).$refs[N][0].Validate([{
      ShipOrder: this.SHIP_ORDER_INFO,
      Address:this.SHIP_ORDER_ADDRESS,
      Remark:this.SHIP_ORDER_REMARK
    }]);
  }

  private TriggerRemark() {
    // (this as any).$refs.AddShipOrderRemark.Trigger([{ShipOrder:this.SHIO_ORDER_INFO}]);
  }

  // private Powers: PInterface.Power = {};
  private EnableOperate: PInterface.KV[] = [];
}
</script>
<style lang="less" scoped>
</style>