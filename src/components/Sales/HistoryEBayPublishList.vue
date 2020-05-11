<template>
  <Modal title="查看操作记录" v-model="IsShowModal" :mask-closable="false" :width="1200" @on-cancel="ClearModal">
    <Row class="P-MT-10">
      <Table size="small" :highlight-row="true" height="550" stripe :columns="TableRowHead" :data="TableList"></Table>
    </Row>
    <footer slot="footer">
      <Button @click="ClearModal">返回</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "HistoryEBayPublishList"
  })
  export default class HistoryEBayPublishList extends Vue {
    private OpenModal(Id: number): void {
      this.GetShelvesListingHistory(Id);
    }

    private GetShelvesListingHistory(Id: number): void {
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.GetShelvesListingHistory,
          Login: true
        },
        Data: Id,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.TableList.push(...Res.Data.Data);
            this.IsShowModal = true;
          } else {
            this.$Request.Error(Res);
          }
        }
      });
    }

    private ClearModal(): void {
      this.IsShowModal = false;
    }

    private IsShowModal: boolean = false;
    private TableList: Interface.EBayPublishListHistoryTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "编号",
      key: "Id",
      width: 80,
    }, {
      title: "操作人",
      key: "Operator",
      width: 180
    }, {
      title: "操作时间", key: "OperateTime", width: 200,
      render: (h, params) => {
        return h("span", this.$UI.Render.Date(params.row.OperateTime, true));
      }
    }, {
      title: "操作记录",
      key: "OperateLog",
      render: (h: any, params: any): any => {
        return params.row.OperateLog ? h("Tooltip", {
          props: {
            "content": params.row.OperateLog,
            "maxWidth": 600
          },
          class: "P-W-100-Percent P-LINE-1"
        }, params.row.OperateLog) : h("span", "-");
      }
    }]
  }

</script>
<style lang="less"></style>
