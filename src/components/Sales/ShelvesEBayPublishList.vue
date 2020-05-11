<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button type="primary" class="P-MR-10 P-MB-10" @click="OpenModal()">提交上架</Button>
      <Modal v-model="IsShowModal" title="提交上架" @on-cancel="ClearModal(false)" :mask-closable="false">
        <Form ref="OperateForm" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110">
          <Form-item label="上架方式：" prop="ListingType">
            <Select placeholder="请选择上架方式" v-model="OperateForm.ListingType" :options="DropListingType"/>
          </Form-item>
          <Form-item label="上架时间：" prop="ExpectedStartTime">
            <DatePicker v-model="OperateForm.ExpectedStartTime" :disabled="OperateForm.ListingType===''" type="datetime" placeholder="请选择上架时间" class="P-W-100-Percent"></DatePicker>
          </Form-item>
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
  import {Component, Vue, Emit, Prop, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "ShelvesEBayPublishList"
  })
  export default class ShelvesEBayPublishList extends Vue {
    @Prop() PropSelected: Interface.EBayPublishListTable[];

    @Watch("OperateForm.ListingType")
    private WatchListingType(Val: number | ""): void {
      if (Val === "") {
        this.$set(this.OperateForm, "ExpectedStartTime", "");
      }
    }

    @Emit() EmitChange(Res: boolean): void {
    }

    private OpenModal(Id?: number): void {
      if (Id) {
        this.OperateForm.Ids.push(Id);
      } else {
        if (this.PropSelected.length === 0) {
          this.$UI.Tips.Floating("warning", "请选择刊登产品进行操作");
          return;
        }
        if (this.PropSelected.some((Item) => [1, 5].includes(Item.ListingStatus))) {
          this.$UI.Tips.Floating("warning", "请选择刊登状态为新建、刊登失败的刊登产品进行操作");
          return;
        }
        this.OperateForm.Ids.push(...this.PropSelected.map((Item) => Item.Id));
      }
      this.IsShowModal = true;
    }

    private SubModal(): void {
      (this.$refs["OperateForm"] as any).validate((Valid: boolean) => {
        if (Valid) {
          let PostData = JSON.parse(JSON.stringify(this.OperateForm));
          PostData.ExpectedStartTime = PostData.ListingType ? this.$UI.Render.NewDate(this.OperateForm.ExpectedStartTime, true) : "1900-01-01";
          delete PostData.ListingType;
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Sales,
            Api: {
              Address: this.$Api.ShelvesEBayShelvesListing,
              Login: true
            },
            Data: PostData,
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating("success", "提交刊登产品上架成功");
                this.ClearModal(true);
              } else {
                this.$Request.Error(Res);
              }
              this.$UI.Loading.Hide();
            }
          })
        }
      })
    }

    private ClearModal(Res: boolean): void {
      this.IsShowModal = false;
      this.$set(this, "OperateForm", new Interface.EBayPublishListShelves());
      this.EmitChange(Res);
    }

    private ValidateExpectedStartTime = (Rule: any, Value: string, CallBack: any) => {
      if (this.OperateForm.ListingType && Value === "") {
        CallBack(new Error("请选择上架时间"));
      } else if (Value !== "" && +new Date() > +new Date(Value)) {
        CallBack(new Error("上架时间不得早于当前时间"));
      } else {
        CallBack();
      }
    };

    private IsShowModal: boolean = false;
    private OperateForm: Interface.EBayPublishListShelves = new Interface.EBayPublishListShelves();
    private OperateFormRule: any = {
      ListingType: [{required: true, message: "请选择上架方式", trigger: "change", type: "number"}],
      ExpectedStartTime: [{validator: this.ValidateExpectedStartTime, trigger: "change", type: "date"}],
    }
    private DropListingType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.EBayPublishListType);
  }

</script>
<style lang="less"></style>
