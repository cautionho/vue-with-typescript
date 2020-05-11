<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button type="primary" @click="OpenModal({Type:0})" class="P-MR-10">添加分类</Button>
      <Modal v-model="IsShowModal" :title="['添加分类','编辑分类','移动分类'][ModalType]" @on-cancel="ClearModal(false)" :mask-closable="false" :width="600">
        <Form ref="OperateForm" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110">
          <Form-item label="分类ID：" v-if="ModalType!==0">{{CustomCategoryID||'-'}}</Form-item>
          <Form-item label="店铺：" prop="StoreId">
            <Select v-if="ModalType===0" v-model="OperateForm.StoreId" :onChange="SycnChangeStore" placeholder="请选择店铺" :options="PropStoreDrop"/>
            <p v-else>{{ EbayStoreName||'-' }}</p>
          </Form-item>
          <Form-item label="分类名称：" prop="CustomCategoryName">
            <p v-if="ModalType===2">{{OperateForm.CustomCategoryName||'-'}}</p>
            <Input v-else ref="CustomCategoryName_Ipt" v-model="OperateForm.CustomCategoryName" placeholder="请输入分类名称"/>
          </Form-item>
          <Form-item label="上级分类：" prop="DestinationParentCategoryID">
            <p v-if="ModalType===1">{{ CustomCategoryParentName||'-' }}</p>
            <Select v-else v-model="OperateForm.DestinationParentCategoryID" placeholder="请选择上级分类" :options="DropDestinationParentCategoryID"/>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">{{['添加','提交','修改'][ModalType]}}</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Vue, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/Sales"

  @Component({
    name: "ModifyEBayCustomStoreClass",
    components: {}
  })
  export default class ModifyEBayCustomStoreClass extends Vue {
    @Prop() PropStoreDrop: PInterface.KV[];

    @Emit() EmitChange(Res: boolean): void {
    }

    private async OpenModal({Type, Detail}: { Type: number, Detail: Interface.EBayCustomClassTable }) {
      this.ModalType = Type;
      if (Detail) {
        this.$set(this, "CustomCategoryID", Detail.CustomCategoryID);
        this.$set(this, "EbayStoreName", Detail.EbayStoreName);
        this.$set(this, "CustomCategoryParentName", Detail.CustomCategoryParentName);
        this.$set(this, "OperateForm", new Interface.EBayCustomClassModify(
          Detail.EbayStoreId,
          Detail.CustomCategoryParentID,
          Detail.CustomCategoryID,
          Detail.CustomCategoryName,
          Detail.Order,
        ));
      }
      switch (Type) {
        case 0:
        case 1:
          this.$nextTick(() => {
            (this.$refs["CustomCategoryName_Ipt"] as any).focus();
          })
          break;
        case 2:
          await this.GetStoreCategoryDropList((this.OperateForm.StoreId as number));
          break;
      }
      this.IsShowModal = true;
    }

    private SycnChangeStore(Val: number | ""): void {
      if (Val) {
        this.GetStoreCategoryDropList(Val);
      } else {
        this.$set(this.OperateForm, "DestinationParentCategoryID", "");
        this.$set(this, "DropDestinationParentCategoryID", []);
      }
    }

    private GetStoreCategoryDropList(Val: number): Promise<void> {
      return new Promise(resolve => {
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.GetStoreCategoryDropList,
            Login: true
          },
          Data: Val,
          Callback: (Res: PInterface.Res): void => {
            if (!Res.IsSuccess) {
              this.$Request.Error(Res);
            }
            this.$set(this, "DropDestinationParentCategoryID", Res.Data.DropList || []);
            resolve();
          }
        })
      })
    }

    private ClearModal(Bool: boolean): void {
      this.IsShowModal = false;
      this.EmitChange(Bool);
      this.$nextTick(() => {
        this.DropDestinationParentCategoryID.splice(0);
        this.$set(this, "OperateForm", new Interface.EBayCustomClassModify());
        (this as any).$refs["OperateForm"].resetFields();
      })
    }

    private SubModal(): void {
      (this.$refs["OperateForm"] as any).validate((Bool: boolean) => {
        if (Bool) {
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Sales,
            Api: {
              Address: this.$Api.SetStoreCategories,
              Login: true
            },
            Data: {
              StoreId: this.OperateForm.StoreId,
              DestinationParentCategoryID: this.OperateForm.DestinationParentCategoryID,
              CustomCategoryID: this.ModalType ? this.OperateForm.CustomCategoryID : 0,
              CustomCategoryName: this.OperateForm.CustomCategoryName,
              Order: this.OperateForm.Order,
              OperationType: this.ModalType === 1 ? 4 : this.ModalType + 1,
            },
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating("warning", ["添加分类成功", "编辑分类成功", "移动分类成功"][this.ModalType]);
                this.ClearModal(true);
              } else {
                this.$Request.Error(Res);
              }
              this.$UI.Loading.Hide();
            }
          })
        }
      });

    }

    private IsShowModal: boolean = false;
    private ModalType: number = 0;
    private CustomCategoryID: number = 0;
    private EbayStoreName: string = "";
    private CustomCategoryParentName: string = "";
    private DropDestinationParentCategoryID: PInterface.KV[] = [];
    private OperateForm: Interface.EBayCustomClassModify = new Interface.EBayCustomClassModify();
    private OperateFormRule: any = {
      StoreId: [{required: true, message: "请选择店铺", trigger: "change", type: "number"}],
      CustomCategoryName: [{required: true, message: "请输入分类名称", trigger: "change"}],
    }
  }

</script>
<style lang="less"></style>
