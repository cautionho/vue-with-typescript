<!--调拨箱列表 -> 录入费用 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="TriggerModal" class="P-MR-10 P-MB-10">录入费用</Button>
    <Modal title="录入费用" v-model="BoxChargeModal" :mask-closable="false" width="450" @on-cancel="ClearModal(false)">
      <Form onsubmit="return false" :model="BoxChargeMsg" ref="BoxChargeMsg" :rules="BoxChargeMsgRules" :label-width="100" name="BoxChargeMsg">
          <Form-item label="费用：" prop="ChargeAmt">
            <InputNumber class="P-W-100-Percent" v-model="BoxChargeMsg.ChargeAmt" ref="ChargeAmt" :min="0" style="width: 200px;"></InputNumber> CNY
          </Form-item>
          <p style="margin-left:40px;">提示：如果勾选多个箱子进行批量录入，会将录入的费用按箱子的毛重比例分配给这些箱子。</p>
        </Form>
        <footer slot="footer">
          <Button type="primary" @click="Validate()">录入</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
@Component({
  name: 'TransferInBoxCharge'
})
export default class TransferInBoxCharge extends Vue {
  @Prop() SelectData: Interface.TransferBoxList[]

  @Emit() ClearModal(Val: boolean): void{
    this.BoxChargeModal = false;
    (this.$refs["BoxChargeMsg"] as any).resetFields();
    
  }

  private TriggerModal(): void{
    if(this.SelectData.length < 1){
      this.$UI.Tips.Floating('warning', '请先选择列表上的调拨箱再进行操作');
    }else{
      this.BoxChargeModal = true;
    }
    this.$nextTick( () => {
      (this.$refs["ChargeAmt"] as any).$el.childNodes[2].children[0].focus();
    })
  }

  private Validate():void{
    (this.$refs["BoxChargeMsg"] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.$UI.Loading.Show();
        this.BoxChargeMsg.Id = this.SelectData.map(Item=>Item.Id);
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.TransferInBoxInputCharge,
            Login: true
          },
          Data: this.BoxChargeMsg,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating('success', '录入费用成功')
              this.ClearModal(true)
            } else {
              this.$Request.Error(Res);
              this.$UI.Loading.Hide();
            }
          }
        })
      }
    })
  }

  private BoxChargeMsgRules: any = {
    ChargeAmt: [{ required: true, message: '请输入费用' }],
  }

  private BoxChargeMsg = new Interface.InputCharge()
  private BoxChargeModal: boolean = false;
}

</script>
<style lang="less"></style>
