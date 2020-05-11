<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button type="primary" @click="OpenModal()">批量录入毛重</Button>
      <Modal v-model="IsShowModal" title="批量录入毛重" @on-cancel="ClearModal(false)" :mask-closable="false" :width="600">
        <Table size="small" :highlight-row="true" :columns="TableRowHead" :data="TableList" stripe :height="450"></Table>
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

  @Component({
    name: "OutLibLogChangeWeight"
  })
  export default class OutLibLogChangeWeight extends Vue {
    @Prop() PropSelected: Interface.OutLibLogTable[];

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private OpenModal(): void {
      if (this.PropSelected.length === 0) {
        this.$UI.Tips.Floating("warning", "请先选择出库记录再进行操作");
        return;
      }
      this.TableList.push(...this.PropSelected.map((Item) => {
        return {Key: Item.BoxCode, Value: ""}
      }));
      this.IsShowModal = true;
    }

    private SubModal(): void {
      if (this.TableList.some((Item) => Number(Item.Value) === 0)) {
        this.$UI.Tips.Floating("warning", "存在毛重未填写/格式不正确，请确认后再操作");
        return
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.BoxBatchInputGrossWeight,
          Login: true
        },
        Data: this.TableList,
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$UI.Tips.Floating("success", "批量录入毛重成功");
            this.ClearModal(true);
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private ClearModal(Res: boolean): void {
      this.IsShowModal = false;
      this.TableList.splice(0);
      this.EmitChange(Res);
    }

    private IsShowModal: boolean = false;
    private TableRowHead: PInterface.TableCol[] = [{
      title: "装箱批次号",
      key: "Key",
    }, {
      title: "毛重（KG.）",
      key: "Value",
      render: (h, params) => {
        return h("Input", {
          style: {
            width: "100%"
          },
          attrs: {},
          props: {
            value: params.row.Value,
            placeholder: "请输入该箱毛重"
          },
          on: {
            "on-blur": (event: any) => {
              this.$set(this.changeData[params.index], "Value", parseFloat(event.target.value) || 0);
              event.target.value = parseFloat(event.target.value) || 0;
            }
          }
        })
      }
    }];
    private TableList: PInterface.KV[] = [];
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