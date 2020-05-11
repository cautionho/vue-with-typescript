<template>
  <Modal :title="['-','查看刊登失败原因','查看验证失败原因'][ModalType]" v-model="IsShowModal" :mask-closable="false" :width="650" @on-cancel="ClearModal">
    <Row class="P-MT-10">
      <Col :span="24" v-if="TableList.length===0" style="text-align: center; line-height:200px;">暂无数据</Col>
      <Col :span="24" v-for="(Item,Index) in TableList">
        <Card>
          <Form :label-width="120">
            <FormItem :label="'错误代码'+(Index+1)+'：'" class="P-MB-0">{{ Item.ErrorCode }}</FormItem>
            <FormItem label="错误标题：" class="P-MB-0">{{ Item.ErrorTitle }}</FormItem>
            <FormItem label="错误详情：" class="P-MB-0">{{ Item.ErrorLog }}</FormItem>
          </Form>
        </Card>
      </Col>
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
    name: "ReasonEBayPublishList"
  })
  export default class ReasonEBayPublishList extends Vue {
    private OpenModal({Id, Type}: { Id: number, Type: number }): void {
      this.ModalType = Type;
      this.GetShelvesListingHistory(Id, Type);
    }

    private GetShelvesListingHistory(Id: number, Type: number): void {
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.GetShelvesEBayListingError,
          Login: true
        },
        Data: {
          Id: Id,
          ErrorType: Type
        },
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
    private ModalType: number = 0;
    private TableList: Interface.EBayPublishListReason[] = [];
  }

</script>
<style lang="less"></style>
