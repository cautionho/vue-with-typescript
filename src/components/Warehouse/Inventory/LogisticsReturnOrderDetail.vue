<template>
  <div class="P-Inline-Block">
    <Col>
      <Modal v-model="IsShowModal" title="退件工单详情" @on-cancel="ClearModal" :mask-closable="false" :width="1200" class="Container-Tabs">
        <Tabs :value="CurTabType" @on-click="SetChangeTabs" name="LogisticsReturnOrderDetail" type="card">
          <TabPane label="工单基本信息" name="Base" tab="LogisticsReturnOrderDetail">
            <Form :model="OperateForm" :label-width="100" onsubmit="return false" inline>
              <Form-item label="编号：" class="P-W-49-Percent">{{ OperateForm.ReturnLogisticsCode || '-' }}</Form-item>
              <Form-item label="物流渠道：" class="P-W-49-Percent">{{ OperateForm.ShippingMethodName || '-' }}</Form-item>
              <Form-item label="订单数量：" class="P-W-49-Percent">{{ OperateForm.ShipOrderCount || '-' }}</Form-item>
              <Form-item label="退件状态：" class="P-W-49-Percent">{{ this.$Enums.Warehouse.LogisticsReturnOrderStaus[OperateForm.Status] }}</Form-item>
              <Form-item label="创建时间：" class="P-W-49-Percent">{{ OperateForm.CreateTime ? $UI.Render.Date(this.OperateForm.CreateTime, true) : "-" }}</Form-item>
              <Form-item label="更新时间：" class="P-W-49-Percent">{{ OperateForm.UpdateTime ? $UI.Render.Date(this.OperateForm.UpdateTime, true) : "-" }}</Form-item>
            </Form>
          </TabPane>
          <TabPane label="退件订单明细" name="Detail" tab="LogisticsReturnOrderDetail">
            <Table :columns="TableRowHead_Detail" :data="TableList_Detail" height="550" size="small" stripe></Table>
          </TabPane>
          <TabPane label="操作记录" name="Log" tab="LogisticsReturnOrderDetail">
            <Table :columns="TableRowHead_Log" :data="TableList_Log" height="550" size="small" stripe></Table>
          </TabPane>
        </Tabs>
        <div slot="footer">
          <Button @click="ClearModal">返回</Button>
        </div>
      </Modal>
      <ShipOrderDetails ref="ShipOrderDetails"></ShipOrderDetails>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "LogisticsReturnOrderDetail",
    components: {
      ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    }
  })
  export default class LogisticsReturnOrderDetail extends Vue {
    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    // 打开模态框
    private $Trigger({OrderDetial}: {
      OrderDetial: Interface.LogisticsReturnOrderDetail
    }): void {
      this.$set(this, "OperateForm", OrderDetial.ReturnLogisticsInfo);
      this.$set(this, "TableList_Detail", OrderDetial.ReturnLogisticsItemResultModel);
      this.IsShowModal = true;
    }

    private ClearModal(): void {
      this.IsShowModal = false;
      this.EmitChange(false);
      this.$nextTick(() => {
        this.$set(this, "CurTabType", "Base");
        this.TableList_Detail.splice(0);
        this.TableList_Log.splice(0);
      })
    }

    private TriggerShipOrderDetails(Code: string): void {
      (this as any).$refs.ShipOrderDetails.Validate({
        OrderId: 0,
        OrderCode: Code
      })
    }

    private SetChangeTabs(Name: string): void {
      this.CurTabType = Name;
      if (Name === "Log" && this.TableList_Log.length === 0) {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.ReturnLogisticsGeHistorys,
            Login: true
          },
          Data: this.OperateForm.ReturnLogisticsCode,
          Callback: (Res: PInterface.Res): void => {
            this.$UI.Loading.Hide();
            if (Res.IsSuccess) {
              this.TableList_Log.push(...Res.Data.Data)
            } else {
              this.$Request.Error(Res);
            }
          }
        })
      }
    }

    private IsShowModal: boolean = false;
    private OperateForm: Interface.LogisticsReturnOrderTable = new Interface.LogisticsReturnOrderTable();
    private TableList_Detail: Interface.LogisticsReturnOrderModifySubItem[] = [];
    private TableList_Log: Interface.LogisticsReturnOrderModifySubItem[] = [];


    private TableRowHead_Detail: PInterface.TableCol[] = [{
      title: "序号",
      key: "Number",
      width: 60
    }, {
      title: "物流渠道",
      key: "ShippingMethodName"
    }, {
      title: "跟踪号",
      key: "TrackingNumber",
      width: 170
    }, {
      title: "发货单号",
      key: "ShipOrderCode",
      width: 150,
      render: (h, params) => {
        return h("a", {
          style: {
            cursor: "pointer"
          },
          on: {
            click: () => {
              this.TriggerShipOrderDetails(params.row.ShipOrderCode);
            }
          }
        }, params.row.ShipOrderCode)
      }
    }, {
      title: "订单下单时间", key: "PlatOrderTime", width: 160,
      render: (h, params) => {
        return h("span", params.row.PlatOrderTime ? this.$UI.Render.Date(params.row.PlatOrderTime, true) : "-");
      }
    }, {
      title: "退件签收时间", key: "ScannedReceiptTime", width: 160,
      render: (h, params) => {
        return h("span", params.row.ScannedReceiptTime ? this.$UI.Render.Date(params.row.ScannedReceiptTime, true) : "-");
      }
    }, {
      title: "退件原因说明",
      key: "ReturnReason",
      width: 300
    }];
    private TableRowHead_Log: PInterface.TableCol[] = [{
      title: "序号",
      key: "Numer",
      width: 60
    }, {
      title: "操作人",
      key: "OperateUserName",
      width: 160
    }, {
      title: "操作时间", key: "OperateTime", width: 160,
      render: (h, params) => {
        return h("span", params.row.OperateTime ? this.$UI.Render.Date(params.row.OperateTime, true) : "-");
      }
    }, {
      title: "操作记录",
      key: "Content"
    }];

    private CurTabType: string = "Base";

  }
</script>
<style scoped lang="less">
  .PurHeadBox {
    border: 1px solid #e8e9eb;
    font-size: 15px;
    font-weight: bold;
  }
</style>