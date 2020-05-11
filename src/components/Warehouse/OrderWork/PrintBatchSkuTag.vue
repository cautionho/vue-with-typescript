<!--打印SKU标签-->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Button type="primary" @click="$Trigger">打印SKU标签</Button>
      <Modal v-model="CurIsShowModal" title="打印批次SKU标签" @on-cancel="ClearModal(false)" :mask-closable="false" :width="600">
        <Form :model="CurOperateForm" ref="CurOperateForm" :rules="CurOperateFormRules" :label-width="90" onsubmit="return false">
          <Form-item label="批次号：" prop="BatchCode">
            <Input ref="BatchCode_Ipt" v-model="CurOperateForm.BatchCode" @on-enter="SubModal" placeholder="请扫描批次号并回车" class="P-W-100-Percent"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">打印</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>
<script lang="ts">
  import {Vue, Component, Prop, Emit} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/Warehouse"
  import GetLodop from "@/assets/LODOP/LodopFuncs";

  @Component({
    name: "PrintBatchSkuTag"
  })
  export default class PrintBatchSkuTag extends Vue {
    private $Trigger() {
      this.CurIsShowModal = true;
      this.FocusBatchCode();
    }

    private SubModal(): void {
      (this.$refs["CurOperateForm"] as any).validate((Valid: boolean) => {
        if (Valid) {
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.BatchOrderGetBatchOrderItem,
              Login: true
            },
            Data: this.CurOperateForm,
            Callback: (res: PInterface.Res): void => {
              this.$UI.Loading.Hide();
              if (res.IsSuccess) {
                if (res.Data.Data.length < 1) {
                  this.$UI.Tips.Floating("warning", `系统中不存在此批次`);
                  this.FocusBatchCode();
                  return;
                }
                this.PrintSkuLabel(res.Data.Data);
              } else {
                this.$Request.Error(res);
              }
            }
          })
        }
      });
    }

    private PrintSkuLabel(List: Interface.PickBatchDetailTable[]): void {
      const LODOP = GetLodop();
      let Pages = Math.ceil(List.length / 40);
      for (let Index = 1; Index <= Pages; Index++) {
        LODOP.PRINT_INITA("0mm", "0mm", "60mm", "40mm", "");
        LODOP.SET_PRINT_PAGESIZE(0, "60mm", "40mm", "SKU标签");
        LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
        let Items = this.$Utils.FilterPagination(Index, 40, List);
        Items.forEach((Item: any) => {
          this.$Utils.DesignSkuLabel(LODOP, Item.SkuCode, Item.SkuCode, Item.SkuName, Item.LocationCode);
        })
        LODOP.PRINT();
      }
      this.$UI.Tips.Floating("success", `打印批次SKU标签成功`);
      this.FocusBatchCode();
    }

    private FocusBatchCode():void{
      (this.$refs["CurOperateForm"] as any).resetFields();
      this.$nextTick(() => {
        (this.$refs["BatchCode_Ipt"] as any).focus();
      })
    }

    private ClearModal(): void {
      this.CurIsShowModal = false;
      (this.$refs["CurOperateForm"] as any).resetFields();
    }

    private CurIsShowModal: boolean = false;
    private CurOperateForm: Interface.PickBatchGetDetail = new Interface.PickBatchGetDetail();
    private CurOperateFormRules: any = {
      BatchCode: [{required: true, message: "请输入批次号", trigger: "change"}],
    }
  }
</script>