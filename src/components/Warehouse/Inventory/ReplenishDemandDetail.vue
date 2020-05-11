<template>
  <div class="P-Inline-Block">
    <Col>
      <Modal v-model="IsShowModal" title="补货需求详情" @on-cancel="ClearModal" :mask-closable="false" :width="1000" class="Container-Tabs">
        <Tabs :value="CurTabType" @on-click="SetChangeTabs" name="ReplenishDemandDetail" type="card">
          <TabPane label="基本信息" name="Replenish" tab="ReplenishDemandDetail">
            <Form :model="OperateForm" :label-width="100" onsubmit="return false" inline>
              <Form-item label="编号：" class="P-W-49-Percent">{{ OperateForm.ReplenishCode || '-' }}</Form-item>
              <Form-item label="创建人：" class="P-W-49-Percent">{{ OperateForm.Creator || '-' }}</Form-item>
              <Form-item label="目标仓：" class="P-W-49-Percent">{{ OperateForm.tWarehouseName || '-' }}</Form-item>
              <Form-item label="备货仓：" class="P-W-49-Percent">{{ OperateForm.sWarehouseName || '-' }}</Form-item>
              <Form-item label="创建时间：" class="P-W-49-Percent">{{ CreateTime }}</Form-item>
              <Form-item label="备注：" class="P-W-100-Percent">{{ OperateForm.Remark || '-' }}</Form-item>
              <div class="P-P-5 P-MB-10 P-TA-C PurHeadBox">
                产品信息
              </div>
              <Form-item label="SKU编号：" class="P-W-300">{{ OperateForm.SkuCode || '-' }}</Form-item>
              <Form-item label="名称：" class="P-W-400">{{ OperateForm.SkuName || '-' }}</Form-item>
              <Form-item label="补货数量：" class="P-W-200">{{ OperateForm.Num || '-' }}</Form-item>
            </Form>
          </TabPane>
          <TabPane label="批次明细" name="ReplenishHistory" tab="ReplenishDemandDetail">
            <Table :columns="TableRowHead" :data="TableList" height="550" size="small" stripe></Table>
          </TabPane>
        </Tabs>
        <div slot="footer">
          <Button @click="ClearModal">返回</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import InterfaceShipOrder from "@/assets/Interface/ShipOrder";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "ReplenishDemandDetail",
    components: {}
  })
  export default class ReplenishDemandDetail extends Vue {
    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    get CreateTime(): string {
      return this.OperateForm.CreateTime ? this.$UI.Render.Date(this.OperateForm.CreateTime, true) : "-";
    }

    // 打开模态框
    private $Trigger({ReplenishId}: {
      ReplenishId: number
    }): void {
      this.GetDetail(ReplenishId);
    }

    private GetDetail(ReplenishId: number): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.SkuReplenishDetail,
          Login: true
        },
        Data: ReplenishId,
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$set(this, "OperateForm", res.Data.Data.Replenish);
            this.TableList.push(...res.Data.Data.ReplenishHistory);
            this.IsShowModal = true;
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private ClearModal(): void {
      this.TableList.splice(0);
      this.$set(this, "OperateForm", new Interface.ReplenishDemandDetail());
      this.CurTabType = "Replenish";
      this.IsShowModal = false;
    }

    private SetChangeTabs(Name: string): void {
      this.CurTabType = Name;
    }

    private IsShowModal: boolean = false;
    private OperateForm: Interface.ReplenishDemandDetail = new Interface.ReplenishDemandDetail();

    private TableRowHead: PInterface.TableCol[] = [{
      title: "编号",
      key: "Id",
      width: 70,
    }, {
      title: "操作人",
      key: "Operator",
      width: 110,
    }, {
      title: "操作时间", key: "", width: 160,
      render: (h, params) => {
        return h("div", this.$UI.Render.Date(params.row.OperateTime, true));
      }
    }, {
      title: "操作记录",
      key: "",
      render: (h: any, params: any): any => {
        return params.row.OperateLog ? h("Tooltip", {
          props: {
            "content": params.row.OperateLog,
            "maxWidth": 600
          },
          class: "P-W-100-Percent P-LINE-1"
        }, params.row.OperateLog) : h("span", "-");
      }
    }];
    private TableList: Interface.ReplenishHistory[] = [];

    private CurTabType: string = "Replenish";

  }
</script>
<style scoped lang="less">
  .PurHeadBox {
    border: 1px solid #e8e9eb;
    font-size: 15px;
    font-weight: bold;
  }
</style>