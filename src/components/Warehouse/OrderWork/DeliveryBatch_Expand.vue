<template>
  <Row class="tal">
    <Col span="24">
      <Table size="small" :highlight-row="true" :columns="TableRowHead" :data="PropData" stripe></Table>
    </Col>
    <ShipOrderDetails ref="ShipOrderDetails"></ShipOrderDetails>
    <TrackingDetails ref="TrackingDetails"></TrackingDetails>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";
  import PInterface from "../../../assets/Interface/Public";
  import Interface from "../../../assets/Interface/Warehouse";

  @Component({
    name: "DeliveryBatch_Expand",
    components: {
      ShipOrderDetails: () => import("@/components/Warehouse/ShipOrders/ShipOrderDetails.vue"),
      // TrackingDetails: () => import("@/components/Public/TrackingDetails.vue"),
    }
  })
  export default class DeliveryBatch_Expand extends Vue {
    @Prop() PropData: Interface.DeliveryBatchTableDetail[];

    private TriggerShipOrderDetails(Code: string): void {
      (this as any).$refs.ShipOrderDetails.Validate({
        OrderId: 0,
        OrderCode: Code
      })
    }

    private TableRowHead: PInterface.TableCol[] = [{
      title: "发货单号",
      key: "ShipOrderCode",
      render: (h: any, Params: any): string => {
        return h("a", {
          on: {
            click: () => {
              this.TriggerShipOrderDetails(Params.row.ShipOrderCode);
            }
          }
        }, Params.row.ShipOrderCode)
      }
    }, {
      title: "订单号",
      key: "OriginalOrderCode"
    }, {
      title: "目的国家",
      key: "Country",
    }, {
      title: "跟踪号",
      key: "TrackingNum",
      render: (h: any, Params: any): string => {
        return h("a", {
          on: {
            click: (e: any) => {
              // (this.$refs["TrackingDetails"] as any).Trigger({
              //   PropType: "abroad",
              //   PropTrackingNum: Params.row.TrackingNum,
              //   PropTrackCompany: "",
              //   PropOffsetTop: e.clientY,
              //   PropOffsetLeft: e.clientX
              // });
            }
          }
        }, Params.row.TrackingNum)
      }
    }, {
      title: "重量",
      key: "Weight",
      render: (h: any, params: any): any => {
        return h("span", params.row.Weight + " kg");
      },
    }];
  }
</script>

<style scoped>

</style>