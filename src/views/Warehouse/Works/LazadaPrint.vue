<!--
  仓储 => Lazada发票打印
 -->
<template>
  <Row id="LazadaPrint">
    <Col span="24">
      <Form inline :label-width="100" name="SetSendForm" onsubmit="return false" class="BlowUp">
        <Form-item label="跟踪号：" required class="P-MB-0">
          <Input v-model.trim="TrackCode" ref="TrackCode_Ipt" @on-enter="MatchOrder" placeholder="请输入跟踪号"></Input>
        </Form-item>
        <Button type="primary" class="P-MR-20" @click="MatchOrder">匹配订单</Button>
        <Button type="warning" @click="Refresh">清除列表</Button>
      </Form>
    </Col>
    <Col span="24" class="P-MT-20">
      <div class="P-TA-C P-P-5 THeadBorder FS_15">已打印发票订单列表{{ TableList.length > 0 ? `（共${TableList.length}个）` : ""}}</div>
      <Table size="small" :columns="TableRowHead" :data="TableList" stripe :height="CalculateTbHeight()"></Table>
    </Col>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";
  import GetLodop from "@/assets/LODOP/LodopFuncs";

  @Component({
    name: "LazadaPrint",
    components: {}
  })

  export default class LazadaPrint extends Vue {
    private CalculateTbHeight(): number {
      let height = window.innerHeight - 230;
      if (this.$refs["SearchGroup"]) {
        height -= (this.$refs["SearchGroup"] as any).$el.offsetHeight + 10;
      }
      if (this.$refs["OperateBtnGroup"]) {
        height -= (this.$refs["OperateBtnGroup"] as any).$el.offsetHeight;
      }
      if (this.$refs["TablePager"]) {
        height -= (this.$refs["TablePager"] as any).$el.offsetHeight + 10;
      }
      return height;
    }

    private FocusTrackIpt() {
      this.TrackCode = "";
      (this.$refs["TrackCode_Ipt"] as any).focus();
    }

    private MatchOrder(): void {
      if (this.TrackCode == "") {
        this.$UI.Tips.CustomModal({
          Type: "warning",
          Content: `请输入跟踪号`,
          Callback: (B: boolean): void => {
            this.FocusTrackIpt();
          }
        })
        return;
      }

      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.PrintLazadaInvoice,
          Login: true
        },
        Data: this.TrackCode,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            if (this.TableList.every((Item) => Item.OrderCode != Res.Data.Data.OrderCode)) {
              this.TableList.unshift(JSON.parse(JSON.stringify(Res.Data.Data)));
            }
            this.PlayPrint(Res.Data.Data);
            this.FocusTrackIpt();
          } else {
            this.$Request.Error(Res, () => this.FocusTrackIpt());
          }
        }
      })
    }

    private PlayPrint(Data: Interface.LazadaPrintTable) {
      if (Data.Country == "马来西亚") {
        Data.invoiceUrl = Data.invoiceUrl.replace("<img", "<img style='height: 80px;'");
      }
      let LODOP = GetLodop()
      LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4")
      LODOP.ADD_PRINT_HTM("0mm", "0mm", "200mm", "287mm", Data.invoiceUrl)
      LODOP.PRINT()
    }

    private Refresh(): void {
      this.TableList.splice(0);
      this.FocusTrackIpt();
    }

    private TrackCode: string = "";
    private TableList: Interface.LazadaPrintTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "发货单号",
      key: "OrderCode"
    }, {
      title: "订单号",
      key: "PlatformOrderId"
    }, {
      title: "国家",
      key: "Country"
    }, {
      title: "物流渠道",
      key: "ShippingMethodName"
    }, {
      title: "订单类型",
      key: "ItemType",
      width: 200,
      render: (h: any, params: any) => {
        // export enum ItemType { 单品单件 = 1, 单品多件, 单品, 多品两件, 多品多件, 多品 }
        return h("span", this.$Enums.Warehouse.ItemType[params.row.ItemType]);
      }
    }];
  }
</script>
<style lang="less">
  #LazadaPrint {
    .BlowUp {
      transform: scale(1.2, 1.2);
      transform-origin: 0 0;
    }

    .FS_15 {
      font-size: 15px;
    }

    .THeadBorder {
      border: 1px solid #f1f1f2;
      border-bottom: none;
      font-weight: bold;
    }
  }
</style>