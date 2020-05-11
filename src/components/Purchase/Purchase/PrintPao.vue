<!-- 打印到货单 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10"  @click="OpenPrintPaoModal()">打印到货单</Button>
      <Modal v-model="ModifyModal" title="打印到货单" @on-cancel="ClearModal(0)" :mask-closable="false" width="800">
        <Form :label-width="150" ref="PrintPaoForm" :model="PrintPaoForm" :rules="PrintPaoRule" inline onsubmit="return false"> 
          <Form-item label="到货单号/采购单号：" prop="Code" class="P-MB-10 P-W-100-Percent">
            <Input v-model.trim="PrintPaoForm.Code" ref="CodeInput" placeholder="到货单号/采购单号" @on-enter="CheckPrintPaoData" />
            <p class="Color-Gray">请扫描/输入到货单号或快递单号，输入完成后请按回车键。</p>
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
import GetLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: "PrintPao"
})
export default class PrintPao extends Vue {
  @Emit() HandleResMsg(Type: number): void {}

  // 打印到货单
  private Trigger(): void {
    this.ModifyModal = true
    this.$nextTick(()=>{
      ( this.$refs["CodeInput"] as Vue ).focus();
    })
  }

  // 回调 打开模态框 
  private OpenPrintPaoModal(): void {
    this.HandleResMsg(1)
  }

  // 校验 提交打印到货单
  private CheckPrintPaoData(): void {
    (this.$refs['PrintPaoForm'] as any).validate((valid: boolean): void => {
      if (valid) {
        this.PrintPao()
      } else {
        return;
      }
    })
  }

  // 打印到货单
  private PrintPao():void {
    ( this.$refs["CodeInput"] as Vue ).blur();
    const LODOP = GetLodop();
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PrintPAO,
        Login: true
      },
      Data: this.PrintPaoForm.Code,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {

          LODOP.PRINT_INIT("");
          const Pages = Math.ceil(Res.Data.Data.length / 20)
          for (let i = 1; i <= Pages; i++) {
            let Items = this.$Utils.FilterPagination(i, 20, Res.Data.Data)
            LODOP.PRINT_INITA("0mm", "0mm", "100mm", "100mm", "打印到货单");
            LODOP.SET_PRINT_PAGESIZE(1, "100mm", "100mm", "");
            LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
            Items.forEach((item: Interface.Pao): void => {
              this.DesignPao(LODOP, item)
            })
            LODOP.PRINT()
          }
          this.$UI.Tips.Floating('success', `打印到货单成功`);
          (this.$refs['PrintPaoForm'] as any).resetFields();
          ( this.$refs["CodeInput"] as Vue ).focus();
        } else {
          this.$Request.Error(Res);
        }
      }
    });
    
  }

  // 设计 到货单
  private DesignPao(LODOP:any, data: Interface.Pao):void {
    LODOP.NewPage()
    LODOP.ADD_PRINT_BARCODE("2.01mm", "10%", "80%", "10mm", "128A", data.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("12.99mm", "25%", "50%", "10mm", data.OrderCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
    LODOP.ADD_PRINT_TEXT("37.31mm", "2.011%", "96.005%", "7.99mm", "目的仓：" + data.WarehouseName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("47.23mm", "2.011%", "40%", "7.99mm", "采购员：" + data.PurchaserName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("47.23mm", "42.989%", "55%", "7.99mm", "采购日期：" + data.PurchaseTime.slice(0, data.PurchaseTime.indexOf('T')));
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("56.99mm", "2.011%", "96.005%", "12.99mm", "品名：" + data.SkuName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
    LODOP.ADD_PRINT_TEXT("68.37mm", "2.011%", "96.005%", "10mm", "SKU编号：" + data.SkuCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("78.85mm", "2.011%", "43.995%", "7.09mm", "采购数：" + data.PurchaseQuantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("78.85mm", "47.011%", "47.989%", "7.09mm", "到货数：" + data.ArrvialQuantity);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("26.06mm", "2.011%", "96.005%", "10mm", "采购单号：" + data.PurchaseCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 13);
    LODOP.ADD_PRINT_TEXT("91.28mm", "2.011%", "43.995%", "5.29mm", "打印员：" + JSON.parse(this.$Cookie.Get('frler_user')).UserName );
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("91.7mm", "47.011%", "47.989%", "5.29mm", this.$UI.Render.Date( this.$UI.Render.NewDate( new Date(), true) , true)  );
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.PrintPaoForm.Code = ""
    this.ModifyModal = false;
    this.PrintPaoForm = new Interface.SingleCodeForm();
    ( this.$refs["PrintPaoForm"] as Vue ).resetFields();
    this.HandleResMsg(Val)
  }

  private ModifyModal: boolean = false // 控制模态框

  private PrintPaoForm: Interface.SingleCodeForm = new Interface.SingleCodeForm(); // 扫描签收

  private PrintPaoRule: any = {
    Code: [{ required: true, message: ' ' }]
  }
}
</script>