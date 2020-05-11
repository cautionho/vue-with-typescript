<!-- 退货 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Modal v-model="ModifyModal" title="修改物流信息" @on-cancel="ClearModal(0)" :mask-closable="false" width="800">
        <Row>
          <Col span="18">
            <Form :label-width="100" ref="ReturnGoodsMsg" inline>
              <FormItem label="SKU编号：" class="P-W-100-Percent">
                <span>{{ SelecData[0].SkuCode }}</span>
              </FormItem>
              <FormItem label="产品名称：" class="P-W-100-Percent">
                <span>{{ SelecData[0].SkuName }}</span>
              </FormItem>
              <FormItem label="退货数量：" class="P-W-100-Percent">
                <span>{{ SelecData[0].NoPassQuantity }}</span>
              </FormItem>
            </Form>
          </Col>
          <Col span="6">
            <div class="Detail-Picture" :style="{ background: `url(${$Server.File}/${SelecData[0].DefaultImage}) no-repeat` }"></div>
          </Col>
        </Row>
        <Row>
          <Form :label-width="100" ref="ExpressInfoForm" :model="ExpressInfoForm" :rules="ExpressInfoRule" inline onsubmit="return false"> 
            <Form-item label="快递单号：" prop="ExpressCode" class="P-W-100-Percent">
              <Input ref="ExpressCodeInput" :autofocus="true" v-model.trim="ExpressInfoForm.ExpressCode" name="ExpressCodeInput" placeholder="快递单号"></Input>
            </Form-item>
          </Form>
        </Row>
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="PostRefund">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Purchase";
@Component({
  name: "ReturnGoods"
})
export default class ReturnGoods extends Vue {
  @Emit() HandleResMsg(Type: number): void {}

  private Trigger(SelectedData: Interface.Pao[]): void {
    this.SelecData = JSON.parse(JSON.stringify(SelectedData));
    (this.$refs['ExpressInfoForm'] as Vue).resetFields();
    this.ModifyModal = true

    this.$nextTick( ()=>{
      (this.$refs["ExpressCodeInput"] as Vue).focus()
    })
  }

  // 退货
  private PostRefund():void {

    (this.$refs['ExpressInfoForm'] as any).validate((valid: boolean): void => {

      if (valid) {
        let postData = {
          Id: this.SelecData[0].Id,
          ExpressCode: this.ExpressInfoForm.ExpressCode
        }

        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Purchase,
          Api: {
            Address: this.$Api.PurchaseArrivalOrderRefund,
            Login: true
          },
          Data: postData,
          Callback: (res: PInterface.Res): void => {
            if (res.IsSuccess) {
              this.$UI.Tips.Floating('success', `采购单退货成功`);
              (this.$refs['ExpressInfoForm'] as any).resetFields();
              this.ClearModal(1)
            } else {
              this.$UI.Loading.Hide();
              this.$Request.Error(res);
            }
          }
        });
      }
    })

  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.$set(this, 'ModifyModal', false);
    this.$nextTick(()=>{
      this.HandleResMsg(Val)
    })
    this.ExpressInfoForm = new Interface.ExpressInfoForm();
    (this.$refs['ExpressInfoForm'] as any).resetFields();
  }

  private SelecData: Interface.Pao[] = [new Interface.Pao()]; //当前选中数据
  private ModifyModal: boolean = false // 控制模态框

  private ExpressInfoForm: Interface.ExpressInfoForm = new Interface.ExpressInfoForm(); // 修改物流信息表单

  private ExpressInfoRule: any = {
    ExpressCode: [{ required: true, message: '请输入快递单号' }],
  }

}
</script>

<style lang="less" scoped>
.Detail-Picture{
  width: 100px;
  height: 100px;
  background-size: cover;
  cursor: pointer;
}
</style>