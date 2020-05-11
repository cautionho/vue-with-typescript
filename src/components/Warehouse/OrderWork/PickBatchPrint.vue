<!-- 打印拣货批次||打印箱号 -->
<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button type="primary" @click="OpenCurModal('BatchPrint')" class="P-MR-10">打印拣货批次</Button>
      <Button type="primary" @click="OpenCurModal('BoxPrint')">打印箱号</Button>
      <Modal v-model="CurIsShowModal" :title="CurModalType==='BatchPrint' ? '打印拣货批次':'打印箱号'" @on-cancel="ClearModal(false)" :mask-closable="false" :width="600">
        <Form :model="CurOperateForm" ref="CurOperateForm" :rules="CurOperateFormRules" :label-width="90" onsubmit="return false">
          <div v-if="CurModalType==='BatchPrint'">
            <Form-item label="纸张类型：" prop="PrintType">
              <Select v-model="CurOperateForm.PrintType" placeholder="请选择纸张类型" :options="DropPrintType" />
              <!-- <Select v-model="CurOperateForm.PrintType" placeholder="请选择纸张类型" filterable clearable>
                <Option v-for="(Item,Index) in DropPrintType" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
              </Select> -->
            </Form-item>
          </div>
          <div v-else>
            <Form-item label="打印方式：" prop="PrintBoxType">
              <Select v-model="CurOperateForm.PrintBoxType" placeholder="请选择打印方式" :opotions="DropPrintBoxType" />
              <!-- <Select v-model="CurOperateForm.PrintBoxType" placeholder="请选择打印方式" filterable clearable>
                <Option v-for="(Item,Index) in DropPrintBoxType" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
              </Select> -->
            </Form-item>
            <Form-item label="箱号：" prop="PrintBoxCode">
              <InputNumber v-model="CurOperateForm.PrintBoxCode" :min="0" placeholder="请输入箱号" class="P-W-100-Percent" :step="1"></InputNumber>
            </Form-item>
          </div>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
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
  import GetLodop from "@/assets/LODOP/LodopFuncs";

  @Component({
    name: "PickBatchPrint.vue"
  })
  export default class PickBatchPrint extends Vue {
    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private $Trigger({IsShowModal, ModalType, SelectedData}: {
      IsShowModal: boolean,
      ModalType: string,
      SelectedData: Interface.PickBatchTable[]
    }): void {
      this.CurModalType = ModalType;
      this.$set(this, "PropSelectedData", SelectedData);
      switch (ModalType) {
        case "BoxPrint":
          this.CurIsShowModal = IsShowModal;
          break;
        case "BatchPrint":
          this.CurIsShowModal = Boolean(SelectedData.length);
          this.CurIsShowModal ? "" : this.$UI.Tips.Floating("warning", "请选择需要打印的拣货批次");
          break;
      }
    }

    private OpenCurModal(Type: string): void {
      this.EmitChange(false, Type);
    }

    private SubModal(): void {
      (this as any).$refs["CurOperateForm"].validate((valid: boolean) => {
        if (valid) {
          if (GetLodop(this) == undefined) {
            this.EmitChange(false);
            return;
          }
          switch (this.CurModalType) {
            case "BatchPrint":
              if (this.CurOperateForm.PrintType == 1) {
                this.PrintA4();
              } else if (this.CurOperateForm.PrintType == 2) {
                this.PrintThermalPaper();
              }
              break;
            case "BoxPrint":
              this.PrintBox();
              break;
          }
        }
      })
    }

    // 箱号打印
    private PrintBox(): void {
      const LODOP: any = GetLodop();
      LODOP.PRINT_INITA("0mm", "0mm", "60mm", "40mm", "");
      LODOP.SET_PRINT_PAGESIZE(0, "60mm", "40mm", "");
      // 从1开始打印箱号
      if (this.CurOperateForm.PrintBoxType == 1) {
        for (let Idx = 1; Idx <= this.CurOperateForm.PrintBoxCode; Idx++) {
          let Code = Idx.toString().padStart(3, "0");
          LODOP.NewPage();
          LODOP.ADD_PRINT_BARCODE("2.99mm", "10%", "80%", "20.24mm", "128Auto", "box-" + Code);
          LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
          LODOP.ADD_PRINT_TEXT("29.05mm", "10%", "44mm", 32, Code);
          LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
          LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
          LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
          LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 1);
        }
        LODOP.PRINT();
      } else if (this.CurOperateForm.PrintBoxType == 2) { //单独打印箱号
        LODOP.NewPage();
        let Code = this.CurOperateForm.PrintBoxCode.toString().padStart(3, "0");
        LODOP.ADD_PRINT_BARCODE("2.99mm", "10%", "80%", "20.24mm", "128Auto", "box-" + Code);
        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
        LODOP.ADD_PRINT_TEXT("29.05mm", "10%", "44mm", 32, Code);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 24);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 1);
        LODOP.PRINT();
      }
      this.ClearModal(true);
    }

    // A4 打印
    private PrintA4(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.BatchOrderGetNoPickItemArray,
          Login: true
        },
        Data: new Interface.PickBatchGetA4Detail(this.PropSelectedData.map(Item => Item.Id)),
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            if (res.Data.Data == null) {
              this.$UI.Tips.Floating("warning", "该批次号不存在");
            } else if (res.Data.Data[0].Key == "") {
              this.$UI.Tips.Floating("warning", "打印拣货批次的订单数必须大于0");
            } else {
              // 调用打印
              this.PrintNoPackItem(res.Data.Data)
            }
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    // 热敏纸打印
    private PrintThermalPaper(): void {
      const LODOP: any = GetLodop();
      for (let Index = 0; Index < this.PropSelectedData.length; Index++) {
        LODOP.PRINT_INITA("0mm", "0mm", "60mm", "40mm", "");
        LODOP.SET_PRINT_PAGESIZE(0, "60mm", "40mm", "");
        LODOP.ADD_PRINT_BARCODE("2.99mm", "10%", "80%", "15mm", "128Auto", this.PropSelectedData[Index].BatchCode);
        LODOP.ADD_PRINT_TEXT("19.31mm", "10.441%", "50.01mm", "5.29mm", "待拣订单数：" + this.PropSelectedData[Index].OrderCount);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
        LODOP.ADD_PRINT_TEXT("24.61mm", "10.441%", "50.01mm", "5.29mm", "待拣SKU数：" + this.PropSelectedData[Index].SkuCount);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
        LODOP.ADD_PRINT_TEXT("30.16mm", "6.09mm", "51.33mm", "5.29mm", "面单尺寸：" + (this.PropSelectedData[Index].LabelSize == 0 ? "" : ("10 * " + this.PropSelectedData[Index].LabelSize)));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
        LODOP.ADD_PRINT_TEXT("36mm", "6.09mm", "53.18mm", "5.29mm", this.$UI.Render.NewDate(new Date(), true).replace("T", " "));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.PRINT();
      }
      this.SetChangeBatchOrderStatus();
    }

    private PrintNoPackItem(List: Interface.PickBatchA4Detail[]) {
      const LODOP: any = GetLodop();
      for (let Index = 0; Index < List.length; Index++) {
        var Table = "<table cellspacing='0' cellpadding='6' border='1' id='printTable' style='text-align:center;width:100%;font-size:14px;'><tr><th style='width:100px'>SKU编号</th><th style='width:400px;'>产品名</th><th style='width:60px'>待拣数</th><th style='width:100px'>可用库存数</th><th style='width:120px;'>货架号</th></tr>";
        for (let Idx in List[Index].Value) {
          Table += "<tr><td>" + List[Index].Value[Idx].SkuCode + "</td><td>" + List[Index].Value[Idx].SkuName + "</td><td>" + (List[Index].Value[Idx].Quantity - List[Index].Value[Idx].PickedQuantity) + "</td><td>" + List[Index].Value[Idx].InventoryAmout + "</td><td>" + List[Index].Value[Idx].LocationCode + "</td></tr>"
        }
        Table += "</table>"

        LODOP.NewPage();
        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
        LODOP.ADD_PRINT_BARCODE("5mm", "5mm", 176, 60, "128Auto", List[Index].Key);
        LODOP.ADD_PRINT_TEXT(22, 341, 132, 54, "拣货单");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 30);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(117, 15, 250, 20, "订单数：" + this.PropSelectedData[Index].OrderCount + (this.PropSelectedData[Index].LabelSize == 0 ? "" : ("   面单尺寸：10 * " + this.PropSelectedData[Index].LabelSize)));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
        LODOP.ADD_PRINT_TEXT("30.96mm", "116.15mm", "83.08mm", "5.29mm", "打印时间：" + this.$UI.Render.NewDate(new Date(), true).replace("T", " "));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 11);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
        LODOP.ADD_PRINT_TABLE(148, 12, 746, "250mm", Table);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.PRINT();
      }
      this.SetChangeBatchOrderStatus();
    }

    private SetChangeBatchOrderStatus(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.BatchOrderChangeToPrinted,
          Login: true
        },
        Data: this.PropSelectedData.map(Item => Item.Id),
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$nextTick(() => {
              this.ClearModal(true);
            })
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private ClearModal(Res: boolean = false): void {
      this.CurIsShowModal = false;
      (this.$refs["CurOperateForm"] as any).resetFields();

      Res ? this.EmitChange(true) : "";
    }

    private CurModalType: string = "";
    private CurIsShowModal: boolean = false;
    private CurOperateForm: Interface.PickBatchPrint = new Interface.PickBatchPrint();
    private CurOperateFormRules: any = {
      PrintType: [{required: true, message: "请选择纸张类型", trigger: "change", type: "number"}],
      PrintBoxType: [{required: true, message: "请选择打印方式", trigger: "change", type: "number"}],
      PrintBoxCode: [{required: true, message: "请输入箱号", trigger: "change", type: "number"}],
    };
    private PropSelectedData: Interface.PickBatchTable[] = [];
    private DropPrintType: PInterface.KV[] = [{
      Key: "A4",
      Value: 1
    }, {
      Key: "热敏纸",
      Value: 2
    }];
    private DropPrintBoxType: PInterface.KV[] = [{
      Key: "从001开始打印",
      Value: 1
    }, {
      Key: "单独打印",
      Value: 2
    }];
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