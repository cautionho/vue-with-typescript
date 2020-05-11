<!-- 打印SKU标签 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10" @click="OpenModal">打印SKU标签</Button>
      <Modal v-model="ModifyModal" title="打印SKU标签" @on-cancel="ClearModal(0)" :mask-closable="false" :width="600">
        <Row>
          <Form :label-width="100" ref="PrintSkuForm" :model="PrintSkuForm" :rules="BatchPrintSkuRule" inline onsubmit="return false"> 
            <FormItem label="到货单号：" class="P-W-100-Percent P-MB-10" prop="Code">
              <Input ref="PrintSkuLabelCode" placeholder="到货单号" v-model="PrintSkuForm.Code"  @on-enter="CheckPrintSkuData"/>
            </FormItem>
          </Form>
        </Row>
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
import GetLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: "PrintSkuLabel"
})
export default class PrintSkuLabel extends Vue {
  @Prop() ShowModal: boolean;   // 模态框

  @Emit() HandleResMsg(Type: number): void {}

  private Trigger(): void {
    this.ModifyModal = true
    this.$nextTick( ()=>{
      (this.$refs['PrintSkuLabelCode'] as any).focus();
    })
  }

   // 回调 打开模态框
  private OpenModal(): void {
    this.HandleResMsg(2)
  }

  // 校验 提交打印到货单
  private CheckPrintSkuData(): void {
    (this.$refs['PrintSkuForm'] as any).validate((valid: boolean): void => {
      if (valid) {
        this.GetPaoItems()
      } 
    })
  }

  // 通过到货单号 获取信息
  private GetPaoItems():void {
    (this.$refs['PrintSkuLabelCode'] as any).blur();
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetPAOInfoByCode,
        Login: true
      },
      Data: this.PrintSkuForm.Code,
      Callback: (res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (res.IsSuccess) {
          
          if (res.Data.PageModel.Id == 0) {
            this.$UI.Tips.Floating('warning', `系统中不存在到货单[${this.PrintSkuForm.Code}]，请重新输入/扫描到货单号`);
            this.PrintSkuForm.Code = ""
            return
          }
          const SkuMsg: any = {
            SkuCode: res.Data.PageModel.SkuCode,
            SkuName: res.Data.PageModel.SkuName,
            LocationCode: res.Data.PageModel.LocationCode,
            ArrvialQuantity: res.Data.PageModel.ArrvialQuantity
          }

          this.PrintSingleSku(SkuMsg);

          (this.$refs['PrintSkuLabelCode'] as any).focus();

        } else {
          this.$Request.Error(res);
        }
      }
    });
  }

  // 单个打印SKU
  private PrintSingleSku(SkuMsg: any): void{
    const LODOP = GetLodop();
    let Pages: number = Math.ceil( SkuMsg.ArrvialQuantity / 40)
    for (let i = 1; i <= Pages; i++) {
      LODOP.PRINT_INITA("0mm", "0mm", '60mm', '40mm', "");
      LODOP.SET_PRINT_PAGESIZE(0, '60mm', '40mm', "");
      LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
      let items = this.ComputedSkuLabelAmount(i, SkuMsg.ArrvialQuantity, 40)
      for (let j = 0; j < items; j++) {
        this.DesignSkuLabel(LODOP, SkuMsg.SkuCode, SkuMsg.SkuCode, SkuMsg.SkuName, SkuMsg.LocationCode)
      }
      LODOP.PRINT()
    }
    this.$UI.Tips.Floating('success', `打印SKU标签成功`);
    this.EmptyContent();
  }

  // 计算一次打印多少张SKU标签
  private ComputedSkuLabelAmount(Index: number, Amount: number, PageSize: number): number {
    return Index * PageSize > Amount ? Amount - ((Index - 1) * PageSize) : PageSize
  }

  // 画SKU标签
  private DesignSkuLabel(LODOP: any, Barcode: string, ShowPrintCode: string, SkuName: string, LocationCode: string): void {
    LODOP.NewPage()
    LODOP.ADD_PRINT_BARCODE("4.26mm", "10%", "80%", "13.15mm", "128Auto", Barcode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("19.82mm", "25.51mm", "32.54mm", "6.56mm", ShowPrintCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("28.84mm", "1.59mm", "57.68mm", "9.79mm", SkuName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("19.82mm", "2.01mm", "23.5mm", "5.29mm", LocationCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  }

  // 清空内容
  private EmptyContent():void {
    this.PrintSkuForm.Code = "";
    (this.$refs['PrintSkuForm'] as any).resetFields();
  }

   // 关闭模态框
  private ClearModal(Val:number):void {
    this.EmptyContent()
    this.ModifyModal = false;
    this.HandleResMsg(Val)
  }


  private PrintSkuSize:string = '60*40'; //打印SKU标签尺寸默认值

  private ModifyModal: boolean = false // 控制模态框

  private PrintSkuForm: Interface.SingleCodeForm = new Interface.SingleCodeForm(); // 扫描签收
  private BatchPrintSkuRule: any = {
    Code: [{ required: true, message: ' ' }]
  }

}
</script>