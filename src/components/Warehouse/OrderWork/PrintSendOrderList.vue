<template>
  <Button type="primary" @click="PrintSendOrder">打印发货清单</Button>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";
  import PInterface from "../../../assets/Interface/Public";
  import Interface from "../../../assets/Interface/Warehouse";
  import GetLodop from "@/assets/LODOP/LodopFuncs";

  @Component({
    name: "PrintSendOrderList"
  })
  export default class PrintSendOrderList extends Vue {
    @Prop() PropSelected: any[];

    private PrintSendOrder(): void {
      if (this.PropSelected.length == 0) {
        this.$UI.Tips.Floating("warning", "请选择订单进行打印发货清单操作");
        return;
      }
      this.PlayPrint();
    }

    private PlayPrint(): void {
      let LODOP = GetLodop();
      LODOP.PRINT_INITA("0.53mm", "0.53mm", "100.01mm", "100.01mm", "发货清单");
      LODOP.SET_PRINT_PAGESIZE(0, 1000, 1000, "");
      for (let Item of this.PropSelected) {
        LODOP.NewPage();
        LODOP.ADD_PRINT_RECT("17.99mm", "2.99mm", "94.01mm", "79mm", 0, 1);
        LODOP.ADD_PRINT_TEXT("2.99mm", "2.99mm", "94.01mm", "13.23mm", "发货清单");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 26);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_LINE("97.42mm", "50.01mm", "18.31mm", "50.01mm", 0, 1);
        LODOP.ADD_PRINT_LINE("31.01mm", "2.99mm", "31.01mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("44mm", "2.99mm", "44mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("56.99mm", "2.99mm", "56.99mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("70.01mm", "2.99mm", "70.01mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("83mm", "2.99mm", "83mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_TEXT("22.75mm", "2.99mm", "46.99mm", "5.29mm", "发货时间");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("35.45mm", "2.99mm", "46.99mm", "5.29mm", "发货仓库");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("48.95mm", "2.99mm", "46.99mm", "5.29mm", "发货批次");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("61.91mm", "2.99mm", "46.99mm", "5.29mm", "物流渠道");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("74.61mm", "2.99mm", "46.99mm", "5.29mm", "包裹数");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("88.37mm", "2.99mm", "46.99mm", "5.29mm", "总重量");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("22.75mm", "50.01mm", "46.99mm", "5.29mm", Item.DeliveryTime.replace('T', ' '));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("35.45mm", "50.01mm", "46.99mm", "5.29mm", Item.WareHouseName);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("48.95mm", "50.01mm", "46.99mm", "5.29mm", Item.BatchCode);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("61.91mm", "50.01mm", "46.99mm", "5.29mm", Item.ShipMethodName);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("74.61mm", "50.01mm", "46.99mm", "5.29mm", Item.TotalShipOrder);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("88.37mm", "50.01mm", "46.99mm", "5.29mm", Item.TotalWeight.toFixed(3) + 'kg');
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      }
      LODOP.PRINT();
      this.$UI.Tips.Floating("success", "打印发货清单成功");
    }

    private TableRowHead: PInterface.TableCol[] = [{
      title: "发货单号",
      key: "ShipOrderCode",
      render: (h: any, Params: any): string => {
        return h("a", {
          on: {
            click: () => {
              this.TriggerShipOrderDetails(Params.row.ShipOrderCode);
            }
          }
        }, Params.row.ShipOrderCode)
      }
    }, {
      title: "订单号",
      key: "OriginalOrderCode"
    }, {
      title: "目的国家",
      key: "Country",
    }, {
      title: "跟踪号",
      key: "TrackingNum",
      render: (h: any, Params: any): string => {
        return h("a", {
          on: {
            click: (e: any) => {
              // (this.$refs["TrackingDetails"] as any).Trigger({
              //   PropType: "abroad",
              //   PropTrackingNum: Params.row.TrackingNum,
              //   PropTrackCompany: "",
              //   PropOffsetTop: e.clientY,
              //   PropOffsetLeft: e.clientX
              // });
            }
          }
        }, Params.row.TrackingNum)
      }
    }, {
      title: "重量",
      key: "Weight",
      render: (h: any, params: any): any => {
        return h("span", params.row.Weight + " kg");
      },
    }];
  }
</script>

<style scoped>

</style>