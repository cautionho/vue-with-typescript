<!-- 修改物流信息 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10"  @click="OpenLogisticsModal()">修改物流信息</Button>
      <Modal v-model="ModifyModal" title="修改物流信息" @on-cancel="ClearModal(0)" :mask-closable="false" width="600">
          <Form :label-width="100" ref="ExpressInfoForm" :model="ExpressInfoForm" :rules="ExpressInfoRule" inline onsubmit="return false"> 
            <Form-item label="快递单号：" prop="ExpressCode" class="P-W-100-Percent">
              <Input :autofocus="true" ref="ExpressCodeInput" v-model.trim="ExpressInfoForm.ExpressCode" name="ExpressCodeInput" placeholder="快递单号"></Input>
            </Form-item>
            <Form-item label="物流公司：" prop="ExpressCompany" class="P-W-100-Percent">
              <Select v-model="ExpressInfoForm.ExpressCompany" placeholder="物流公司" optionKey="Key" optionValKey="Key" :options="DropExpressCompany" />
            </Form-item>
            <Form-item v-if="IsOtherExpressCompany" prop="OtherExpressCompany" class="P-W-100-Percent">
              <Input v-model="ExpressInfoForm.OtherExpressCompany" placeholder="物流公司" ref="ExpressNameInput"></Input>
            </Form-item>
          </Form>
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="PostData">提交</Button>
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
// JSON文件 物流公司
import { DropList } from "@/assets/Config/JSON/ExpressCompany.json";

@Component({
  name: "PaoLogistics"
})
export default class PaoLogistics extends Vue {
  @Emit() HandleResMsg(Type: number): void {}

  private Trigger(SelectedData: Interface.Pao[]): void {

    if (SelectedData.length < 1 || SelectedData.some( (Item: Interface.Pao):boolean => Item.Status !== 1) ) {
      this.$UI.Tips.Floating('warning', `请选择状态为待签收的到货单进行操作`);
      return;
    }

    this.SelecData = JSON.parse(JSON.stringify(SelectedData));

    if (this.SelecData.length === 1) {
      this.ExpressInfoForm.ExpressCompany = this.SelecData[0].ExpressCompany;
      this.ExpressInfoForm.ExpressCode = this.SelecData[0].ExpressCode;
    }
    
    this.ModifyModal = true

    // 物流公司下拉
    if (this.DropExpressCompany.length === 0) {
      this.DropExpressCompany.push(...DropList)
    }

    this.$nextTick( ()=>{
      ( this.$refs["ExpressCodeInput"] as Vue).focus()
    })

    
  }

  @Watch("ExpressInfoForm.ExpressCompany")
  private ShowOtherExpressCompanyInput(Val: string): void {
    this.ExpressInfoForm.OtherExpressCompany = "";
    this.IsOtherExpressCompany = Val === 'qita' 
  }
 
  // 回调 打开模态框 
  private OpenLogisticsModal(): void {
    this.HandleResMsg(2)
  }

  // 发送 提交修改物流信息
  private PostData(): void {
    (this.$refs['ExpressInfoForm'] as any).validate((valid: boolean): void => {
      if (valid) {
        let SendData: any = {
		      Id: [],
		      ExpressCompany: this.ExpressInfoForm.ExpressCompany,
		      ExpressCode: this.ExpressInfoForm.ExpressCode      		
        }
        SendData.Id = this.SelecData.map( (Item: Interface.Pao): number => Item.Id )
        
        if(this.IsOtherExpressCompany){
          SendData.ExpressCompany = this.ExpressInfoForm.OtherExpressCompany;
        }
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Purchase,
          Api: {
            Address: this.$Api.PurchaseModifyShippingMethod,
            Login: true
          },
          Data: SendData,
          Callback: (res: PInterface.Res): void => {
            if (res.IsSuccess) {
              this.$UI.Tips.Floating('success', `修改物流信息成功`);
              this.ClearModal(1)
            } else {
              this.$UI.Loading.Hide();
              this.$Request.Error(res);
            }
          }
        });

      } else {
        return;
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
    this.IsOtherExpressCompany = false;
  }

  private SelecData: Interface.Pao[] = [new Interface.Pao()]; //当前选中数据

  private ModifyModal: boolean = false // 控制模态框

  private DropExpressCompany: PInterface.KV[] = [];
  private IsOtherExpressCompany: boolean = false; // 判断是否选择其他公司  
  private ExpressInfoForm: Interface.ExpressInfoForm = new Interface.ExpressInfoForm(); // 修改物流信息表单

  private ExpressInfoRule: any = {
    ExpressCompany: [{ required: true, message: '请选择物流公司', trigger: 'change'}],
    ExpressCode: [{ required: true, message: '请输入快递单号' }],
    OtherExpressCompany: [{ required: true, message: '请输入物流公司' }],
  }
}
</script>