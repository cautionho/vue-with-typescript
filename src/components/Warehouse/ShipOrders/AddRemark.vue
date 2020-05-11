<template>
  <Col>
  <Button type="primary" @click="Trigger">添加备注</Button>
  <Modal v-model="ShipOrderRemarkModal" title="添加备注" :mask-closable="false" @on-cancel="CancelModal">
    <Form :model="ShipOrderRemark" :rules="RemarkRules" ref="ShipOrderRemark">
      <FormItem prop="Remark">
        <Input type="textarea" ref="Remark" placeholder="备注" v-model="ShipOrderRemark.Remark" :autosize="{maxRows:5,minRows:5}"></Input>
      </FormItem>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="ValidateRemark">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
  </Col>  
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "AddShipOrderRemark"
})
export default class AddShipOrderRemark extends Vue {
  @Emit() EmitOperateSuccess(Action:string = "ShipOrder/UPDATE_SHIP_ORDER_INFO"):void {}

  @Action private 'ShipOrder/UPDATE_SHIP_ORDER_REMARK':any
  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }

  private Trigger() {
    this.$set(this, "ShipOrderRemarkModal", true);
    this.$nextTick(() => {
      (this as any).$refs.Remark.focus();
    });
  }

  private CancelModal() {
    (this as any).$refs.ShipOrderRemark.resetFields();
    this.$nextTick(() => {
      this.$set(this, "ShipOrderRemarkModal", false);
    });
  }

  private ValidateRemark() {
    (this as any).$refs.ShipOrderRemark.validate((Valid: boolean) => {
      if (Valid) {
        this.PostAddRemark();
      }
    });
  }

  private PostAddRemark() {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.ShipOrderAddRemark,
        Login: true
      },
      Data: {
        OrderId:this.SHIP_ORDER_INFO.Id,
        Content:this.ShipOrderRemark.Remark
      },
      Callback: (Res: PInterface.Res) => {
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success','添加备注成功');
          this.CancelModal();
          this.EmitOperateSuccess("ShipOrder/UPDATE_SHIP_ORDER_REMARK");
        } else {
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    });
  }

  private ShipOrderRemarkModal: boolean = false;
  private ShipOrderRemark: any = {
    Remark: ""
  };
  private RemarkRules: any = {
    Remark: [{ required: true, message: "请输入备注" }]
  };
}
</script>
<style lang="less" scoped>
</style>