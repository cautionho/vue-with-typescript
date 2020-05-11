<!-- 扫描签收 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10"  @click="OpenScanSignModal()">扫描签收</Button>
      <Modal v-model="ModifyModal" title="扫描签收" @on-cancel="ClearModal(0)" :mask-closable="false" width="600">
        <Form :label-width="100" ref="ExpressCodeForm" :model="ExpressCodeForm" :rules="ExpressCodeRule" inline onsubmit="return false"> 
          <Form-item label="快递单号：" prop="ExpressCode" class="P-MB-10 P-W-100-Percent">
            <Input v-model.trim="ExpressCodeForm.ExpressCode" ref="ExpressCodeInput" placeholder="快递单号" @on-enter="CheckScanSignData" />
            <p class="Color-Gray">请扫描/输入快递单号，输入完成后请按回车键。</p>
          </Form-item>
        </Form>
        <footer slot="footer" class="P-TA-R">
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
  name: "ScanSign"
})
export default class ScanSign extends Vue {
  @Emit() HandleResMsg(Type: number): void {}

  // 点击列表打开 签收
  private Trigger(SelectedData: Interface.Pao[]): void {
    // 列表签收
    if (!this.IsBatchButton) {
      
      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: '是否确认执行签收操作',
        Callback: (Res: boolean):void => {
          if (Res) {
            this.ScanSignData( SelectedData[0].ExpressCode );
          } else {
            this.HandleResMsg(0)
          }
        }
      })

    } else {
      this.ModifyModal = true;
      this.$nextTick(()=>{
        ( this.$refs["ExpressCodeInput"] as Vue ).focus();
      })
    }
  }

  // 回调 打开模态框 
  private OpenScanSignModal(): void {
    this.IsBatchButton = true;
    this.HandleResMsg(2)
  }

  // 校验 提交扫描签收
  private CheckScanSignData(): void {
    (this.$refs['ExpressCodeForm'] as any).validate((valid: boolean): void => {
      if (valid) {
        this.ScanSignData(this.ExpressCodeForm.ExpressCode)
      } else {
        return;
      }
    })
  }

  // 发送 提交扫描签收
  private ScanSignData(Code: string): void {
    ( this.$refs["ExpressCodeInput"] as Vue ).blur();
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PurchaseArrivalOrderSign,
        Login: true
      },
      Data: Code,
      Callback: (res: PInterface.Res): void => {
        if (res.IsSuccess) {
          this.$UI.Tips.Floating('success', `签收成功`);
          // 列表签收
          this.ClearModal(1)
        } else {
          this.$UI.Loading.Hide();
          this.$Request.Error(res);
        }

        if (this.ModifyModal) {
          (this.$refs.ExpressCodeForm as any).resetFields();
          (this.$refs.ExpressCodeInput as any).focus();
        }
      }
    });
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.ModifyModal = false
    this.ExpressCodeForm.ExpressCode = ""
    this.IsBatchButton = false;
    ( this.$refs["ExpressCodeForm"] as Vue ).resetFields();
    this.ExpressCodeForm = new Interface.ExpressCodeForm();
    this.HandleResMsg(Val)
  }

  private SelecData: Interface.Pao[] = [new Interface.Pao()]; //当前选中数据
  private ModifyModal: boolean = false // 控制模态框
  private IsBatchButton: boolean = false // 判断是否按钮打开

  private ExpressCodeForm: Interface.ExpressCodeForm = new Interface.ExpressCodeForm(); // 扫描签收

  private ExpressCodeRule: any = {
    ExpressCode: [{ required: true, message: ' ' }]
  }
}
</script>