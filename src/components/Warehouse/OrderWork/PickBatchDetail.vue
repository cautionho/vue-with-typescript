<!-- 拣货批次详情 -->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Modal v-model="CurIsShowModal" title="拣货批次详情" @on-cancel="ClearModal" :mask-closable="false" :width="1000" class="Container-Tabs">
        <Tabs :value="CurTabType" @on-click="GetTableList" name="PickingBatchDetailTab" type="card">
          <TabPane label="拣货订单" name="PickingOrder" tab="PickingBatchDetailTab">
            <Table :columns="TableRowHeadPickingOrder" :data="TableListPickingOrder" height="550" size="small" stripe></Table>
          </TabPane>
          <TabPane label="批次明细" name="BatcheDetail" tab="PickingBatchDetailTab">
            <Table :columns="TableRowHeadBatcheDetail" :data="TableListBatcheDetail" height="550" size="small" stripe></Table>
          </TabPane>
        </Tabs>
        <div slot="footer">
          <Button @click="ClearModal">返回</Button>
        </div>
      </Modal>
      <ShipOrderDetails ref="ShipOrderDetails"
                        @emit-operate-success="EmitOperateSuccess"
      ></ShipOrderDetails>
    </Col>
  </div>
</template>

<script lang="ts" src="../../../views/Warehouse/ShipOrders/ShipOrder.ts"></script>
<script lang="ts">
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import InterfaceShipOrder from "@/assets/Interface/ShipOrder";
  import Interface from "@/assets/Interface/Warehouse";
  import ExpandRow from "./PickBatchDetail_Expand.vue";

  @Component({
    name: "PickBatchDetail",
    components: {
      ShipOrderDetails: () => import("@/components/Warehouse/ShipOrders/ShipOrderDetails.vue"),
    }
  })
  export default class PickBatchDetail extends Vue {
    @Prop() PropShowCreateBtn: boolean;

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    // 打开模态框
    private $Trigger({IsShowModal, SelectedDetail}: {
      IsShowModal: boolean,
      SelectedDetail: Interface.PickBatchTable
    }): void {
      this.$set(this, "CurTabType", "PickingOrder");
      this.$set(this, "CurSelectedData", SelectedDetail);
      this.GetTableList(this.CurTabType, true);
    }

    private GetTableList(Name: string, Init?: boolean): void {
      let Type = ({PickingOrder: 0, BatcheDetail: 1} as any)[Name];
      if (this[["TableListPickingOrder", "TableListBatcheDetail"][Type]].length != 0) {
        return
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api[["BatchOrderGetBatchOrderInfo", "BatchOrderGetBatchOrderItem"][Type]],
          Login: true
        },
        Data: new Interface.PickBatchGetDetail(this.CurSelectedData.Id),
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this[["TableListPickingOrder", "TableListBatcheDetail"][Type]].push(...res.Data.Data);
            Init ? this.CurIsShowModal = true : "";
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private ClearModal(): void {
      this.CurIsShowModal = false;
      this.TableListPickingOrder.splice(0);
      this.TableListBatcheDetail.splice(0);
    }

    private EmitOperateSuccess(): void {
    }

    private CurIsShowModal: boolean = false;
    private CurTabType: string = "";
    private CurSelectedData: Interface.PickBatchTable = new Interface.PickBatchTable();
    private TableRowHeadPickingOrder: PInterface.TableCol[] = [{
      type: "expand", width: 40, align: 'center',
      render: (h, params) => {
        return h(ExpandRow, {
          props: {
            PropRow: params.row.Item
          }
        })
      }
    }, {
      title: "发货单号",
      key: "",
      render: (h, params) => {
        return h("a", {
          on: {
            click: () => {
              (this.$refs["ShipOrderDetails"] as any).Validate(new InterfaceShipOrder.InfoParams(undefined, params.row.OrderCode));
            }
          }
        }, params.row.OrderCode)
      }
    }, {
      title: "箱号",
      key: "BoxNum"
    }, {
      title: "状态",
      render: (h, params): void => {
        return h("Tag", {
          props: {
            color: params.row.OrderStatus == 3 ? "error" : ""
          }
        }, this.$Enums.Warehouse.ShipOrderStatus[params.row.OrderStatus])
      }
    }, {
      title: "下单时间", width: 160,
      render: (h, params) => {
        return h("span", this.$UI.Render.Date(params.row.PlatformOrderTime, true));
      }
    }, {
      title: "操作",
      width: 100,
      render: (h, params): void => {
        let self = this;
        return h("Button", {
          props: {
            size: "small",
            type: "primary"
          },
          on: {
            click: () => {
              (this.$refs["ShipOrderDetails"] as any).Validate(new InterfaceShipOrder.InfoParams(undefined, params.row.OrderCode));
            }
          }
        }, "查看");
      }
    }];

    private TableRowHeadBatcheDetail: PInterface.TableCol[] = [{
      title: "SKU编号",
      key: "SkuCode"
    }, {
      title: "产品名",
      key: "SkuName",
      render: (h, params) => {
        return h("Tooltip", {class: "P-LINE-1", props: {content: params.row.SkuName}}, params.row.SkuName)
      }
    }, {
      title: "货架号",
      key: "LocationCode"
    }, {
      title: "需求数",
      key: "Quantity"
    }, {
      title: "已拣数",
      key: "PickedQuantity"
    }, {
      title: "拣货时间", width: 160,
      render: (h, params) => {
        return h("span", this.$UI.Render.Date(params.row.PickedTime, true))
      }
    }];
    private TableListPickingOrder: Interface.PickBatchOrderTable[] = [];
    private TableListBatcheDetail: Interface.PickBatchDetailTable[] = [];

  }
</script>