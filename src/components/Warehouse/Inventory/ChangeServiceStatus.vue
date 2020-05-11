<template>
  <Row class="P-Inline-Block" style="vertical-align: middle;">
    <Button type="primary" class="P-Inline-Block" @click="OpenModal">更改客服处理状态</Button>
    <Modal v-model="IsShowModal" @on-cancel="ClearModal(false)" :mask-closable="false" :width="600" title="更改客服处理状态">
      <Form onsubmit="return false" :label-width="120">
        <FormItem label="客服处理状态：" required>
          <Select placeholder="请选择客服处理状态" v-model="ProcessingStatus" :options="DropProcessingStatus" />
          <!-- <Select placeholder="请选择客服处理状态" clearable filterable v-model="ProcessingStatus">
            <Option v-for="(Item, Index) in DropProcessingStatus" :key="Index" :value="$Enums.Warehouse.LogisticsReturnOrderServiceStaus[Item]">{{Item}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="SubModal">确定</Button>
        <Button type="default" @click="ClearModal(false)">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit, Watch} from "_vue-property-decorator@8.3.0@vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "ChangeServiceStatus",
    components: {}
  })
  export default class ChangeServiceStatus extends Vue {
    @Prop() PropTableSelected: Interface.LogisticsReturnOrderTable[]

    @Emit() EmitChange(Res: boolean): void {
    }

    private OpenModal(): void {
      if (this.PropTableSelected.length === 0) {
        this.$UI.Tips.Floating("warning", "请选择退件工单再进行操作");
        return;
      }
      this.IsShowModal = true;
    }

    private SubModal(): void {
      if (this.ProcessingStatus === "") {
        this.$UI.Tips.Floating("warning", "请选择客服处理状态");
        return;
      }
      const PostData = {
        Ids: this.PropTableSelected.map((Item) => Item.Id),
        ProcessingStatus: this.ProcessingStatus
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.ReturnLogisticsSetProcessingStatus,
          Login: true
        },
        Data: PostData,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess == true) {
            this.$UI.Tips.Floating("success", "更改客服处理状态成功");
            this.ClearModal(true);
          }
        }
      });
    }

    private ClearModal(Res: boolean): void {
      this.$set(this, "ProcessingStatus", "");
      this.IsShowModal = false;
      this.EmitChange(Res);
    }

    private IsShowModal: boolean = false;
    private ProcessingStatus: number | "" = "";
    private DropProcessingStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.LogisticsReturnOrderServiceStaus);
  }
</script>
<style scoped lang="less"></style>