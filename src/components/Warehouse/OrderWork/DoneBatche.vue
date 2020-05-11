<!-- 完成批次 -->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Button type="primary" @click="$Trigger">完成批次</Button>
    </Col>
  </div>
</template>
<script lang="ts">
  import {Vue, Component, Prop, Emit} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/Warehouse"

  @Component({
    name: "DoneBatche"
  })
  export default class DoneBatche extends Vue {
    @Emit() EmitChange(Res: boolean, Type?: number): void {
    }

    private $Trigger({SelectedData = []}: {
      SelectedData: Interface.PickBatchTable[]
    }) {
      if (SelectedData.length == 0) {
        this.$UI.Tips.Floating("warning", `请选择状态为待拣货、已打印或部分拣货的拣货批次进行操作`);
        return
      }
      if (SelectedData.some((Item) => Item.BatchCode.slice(0, 2).toLowerCase() == "mp") && SelectedData.some((Item) => Item.BatchCode.slice(0, 2).toLowerCase() == "p")) {
        this.$UI.Tips.Floating("warning", `请选择相同明细类型的拣货批次进行操作`);
        return
      }
      if (SelectedData.some((Item) => Item.Status == 4)) {
        this.$UI.Tips.Floating("warning", `请选择状态为待拣货、已打印或部分拣货的拣货批次进行操作`);
        return
      }
      // 如果多品批次中包括的待拣货、已拣货订单数量超过100条，提示“生成拣货批次的多品订单不能超过100条
      if (SelectedData.some((Item) => Item.BatchCode.slice(0, 2).toLowerCase() == "mp")) {
        if (SelectedData.reduce((Pre: number, Cur: Interface.PickBatchTable) => Pre + Cur.OrderCount, 0) > 100) {
          this.$UI.Tips.Floating("warning", `生成拣货批次的多品订单不能超过100条`);
          return;
        }
      }
      // 如果单品批次中包括的待拣货、已拣货订单数量超过500条，提示“生成拣货批次的单品订单不能超过500条
      if (SelectedData.some((Item) => Item.BatchCode.slice(0, 2).toLowerCase() == "p")) {
        if (SelectedData.reduce((Pre: number, Cur: Interface.PickBatchTable) => Pre + Cur.OrderCount, 0) > 500) {
          this.$UI.Tips.Floating("warning", `生成拣货批次的单品订单不能超过500条`);
          return;
        }
      }

      this.CurSelectedIds = SelectedData.map((Item) => Item.Id);

      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "选中的批次将变为已完成，批次下未打包的订单将释放回去已确认状态，确认完成？",
        Enter: false,
        Callback: (bool: boolean): void => {
          if (bool) {
            this.PostDoneBatche();
          }
        }
      })
    }

    private PostDoneBatche(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.BatchOrderReCreateBatchOrder,
          Login: true
        },
        Data: new Interface.PickBatchFinish(undefined, this.CurSelectedIds),
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$UI.Tips.Modal({
              Type: 'confirm',
              Content: '完成批次成功',
              Callback: (Res: boolean): void => {
                this.EmitChange(true);
              }
            });
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private CurSelectedIds: number[] = [];
  }
</script>