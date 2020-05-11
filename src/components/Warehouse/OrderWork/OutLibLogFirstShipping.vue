<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button type="primary" @click="OpenModal()">录入头程运单号</Button>
      <Modal v-model="IsShowModal" title="批量录入毛重" @on-cancel="ClearModal(false)" :mask-closable="false" :width="700">
        <Form onsubmit="return false" ref="OperateForm" :model="OperateForm" :rules="OperateFormRule" :label-width="120">
          <Form-item label="装箱批次号：">
            <div style="max-height: 400px; overflow: auto">
              <Tag v-for="(Item,Index) in OperateForm.BoxCodes" :key="Index" @on-close="DelSelected(Index)" type="border" :closable="OperateForm.BoxCodes.length>1">{{ Item }}</Tag>
            </div>
            <div style="text-align: right;"><span>{{OperateForm.BoxCodes.length}}</span> / 100</div>
          </Form-item>
          <Form-item label="头程发货渠道：" prop="FirstShippingMethodType">
            <Select v-model="OperateForm.FirstShippingMethodType" placeholder="请选择头程发货渠道" :options="DropFirstShippingMethodType" />
            <!-- <Select v-model="OperateForm.FirstShippingMethodType" placeholder="请选择头程发货渠道" filterable clearable>
              <Option v-for="(Item,Index) in DropFirstShippingMethodType" :value="$Enums.Warehouse.FirstShippingMethodType[Item]" :key="Index">{{ Item }}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="头程运单号：" prop="FirstShipOrderCode">
            <Input v-model="OperateForm.FirstShipOrderCode" placeholder="请输入头程运单号" class="P-W-100-Percent"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">确定</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "OutLibLogFirstShipping"
  })
  export default class OutLibLogFirstShipping extends Vue {
    @Prop() PropSelected: Interface.OutLibLogTable[];

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private DelSelected(Index: number): void {
      this.OperateForm.BoxCodes.splice(Index, 1);
    }

    private OpenModal(): void {
      if (this.PropSelected.length === 0) {
        this.$UI.Tips.Floating("warning", "请先选择出库记录再进行操作");
        return;
      }
      if (this.PropSelected.length > 100) {
        this.$UI.Tips.Floating("warning", "请勾选小于100条出库记录");
        return;
      }
      this.$set(this, "OperateForm", new Interface.OutLibLogFirstShipping(this.PropSelected.map((Item) => Item.BoxCode), "", ""))
      this.IsShowModal = true;
    }

    private SubModal(): void {
      // if (this.OperateForm.BoxCodes.length == 0) {
      //   this.$UI.Tips.Floating("warning", "装箱批次号为空，请先勾选出库记录再进行操作。");
      //   return;
      // }
      // if (this.OperateForm.FirstShippingMethodType == "") {
      //   this.$UI.Tips.Floating("warning", "请选择头程发货渠道后再进行操作");
      //   return;
      // }
      // if (this.OperateForm.FirstShipOrderCode == "") {
      //   this.$UI.Tips.Floating("warning", "请填写头程运单号后再进行操作");
      //   return;
      // }

      (this as any).$refs["OperateForm"].validate((valid: boolean) => {
        if (valid) {
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.BoxBatchInputFirstShippingInfo,
              Login: true
            },
            Data: this.OperateForm,
            Callback: (res: PInterface.Res): void => {
              this.$UI.Loading.Hide();
              if (res.IsSuccess) {
                this.$UI.Tips.Floating("success", "录入头程运单号成功");
                this.ClearModal(true);
              } else {
                this.$Request.Error(res);
              }
            }
          })
        }
      });
    }

    private ClearModal(Res: boolean): void {
      this.IsShowModal = false;
      this.$set(this, "OperateForm", new Interface.OutLibLogFirstShipping());
      (this as any).$refs["OperateForm"].resetFields();
      this.EmitChange(Res);
    }

    private IsShowModal: boolean = false;
    private OperateForm: Interface.OutLibLogFirstShipping = new Interface.OutLibLogFirstShipping();
    private OperateFormRule: any = {
      FirstShippingMethodType: [{required: true, message: "请选择头程发货渠道", type: "number"}],
      FirstShipOrderCode: [{required: true, message: "请输入头程运单号"}]
    }
    private DropFirstShippingMethodType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.FirstShippingMethodType);
  }


</script>
<style lang="less">
  .Row-Tree {
    height: 300px;
    overflow: auto;
  }

  .Row-Item {
    padding: 20px 0px 0px 19px !important;
  }

  .Row-Item-UserName {
    padding: 24px 0px 0px 19px !important;
  }

  .Row-Authorization {
    max-height: 120px;
    overflow: auto;
    margin: 20px 0px 0 0px !important;
  }

</style>