<template>
  <Row class="P-Inline-Block" style="vertical-align: middle;">
    <Button type="primary" class="P-Inline-Block" @click="OpenModal">Sku入库</Button>
    <!--批量添加退件原因-->
    <Modal v-model="IsShowModal" @on-cancel="IsShowModal=false" :mask-closable="false" :width="600" title="Sku入库">
      <Form onsubmit="return false" ref="OperateForm" :model="OperateForm" :rules="OperateFormRules" :label-width="100">
        <FormItem label="仓库：" prop="WarehouseId">
          <Select v-model="OperateForm.WarehouseId" placeholder="请选择仓库" :options="DropWarehouse" />
          <!-- <Select v-model="OperateForm.WarehouseId" placeholder="请选择仓库" filterable label-in-value clearable>
            <Option v-for="(item,index) in DropWarehouse" :value="item.Value" :key="item.Key">{{item.Key}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="SKU编号：" prop="SkuCode">
          <Input v-model="OperateForm.SkuCode" ref="SkuCode_Ipt" @keyup.native.13="GetSkuInventory" placeholder="请输入SKU编号"></Input>
        </FormItem>
        <FormItem label="SKU数量：" prop="SkuCount">
          <InputNumber v-model="OperateForm.SkuCount" ref="SkuCount_Ipt" @keyup.native.13="PutWarehouse" placeholder="请输入SKU数量" :min="1" :step="1" :precision="0" class="P-W-100-Percent"></InputNumber>
        </FormItem>
        <Form-item label="产品名：">{{ OperateForm.SkuName || '-' }}</Form-item>
        <Form-item label="货架号：">{{ OperateForm.LocationCode || '-' }}</Form-item>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="PutWarehouse">入库</Button>
        <Button @click="ResetModal(true)">重置</Button>
      </footer>
    </Modal>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit, Watch} from "_vue-property-decorator@8.3.0@vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "SkuPutWarehouse",
    components: {}
  })
  export default class SkuPutWarehouse extends Vue {
    @Emit() EmitChange(): void {
    }

    @Watch("IsShowModal")
    private WatchShowModal(Bool:boolean): void {
      this.ResetModal(true);
    }

    private OpenModal(): void {
      if (this.DropWarehouse.length == 0) {
        this.GetWarehouseList();
      } else {
        this.IsShowModal = true;
      }
    }

    private GetWarehouseList() {
      this.$Request.Post({
        Server: this.$Server.Settings,
        Api: {
          Address: this.$Api.GetWarehouseDropList
        },
        Data: "",
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.DropWarehouse.push(...Res.Data.DropList);
            this.OpenModal();
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private GetSkuInventory(): void {
      (this.$refs["OperateForm"] as any).validate((Valid: boolean) => {
        if (Valid) {
          const PostData = {
            SkuId: 0,
            SkuCode: this.OperateForm.SkuCode,
            WarehouseId: this.OperateForm.WarehouseId
          }
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.InventoryGetSkuInventory,
              Login: true
            },
            Data: PostData,
            Callback: (Res: PInterface.Res): void => {
              this.$UI.Loading.Hide();
              if (Res.IsSuccess == true) {
                this.BeforeWarehouseId = (PostData.WarehouseId as number);
                this.$set(this.OperateForm, "SkuName", Res.Data.Data.SkuName || "-")
                this.$set(this.OperateForm, "LocationCode", Res.Data.Data.LocationCode || "-")
                this.SkuDetail = Res.Data.Data;
                this.$nextTick(function () {
                  (this.$refs["SkuCount_Ipt"] as any).$el.children[1].children[0].focus();
                })
              }
            }
          });
        }
      });
    }

    private PutWarehouse(): void {
      (this.$refs["OperateForm"] as any).validate((Valid: boolean) => {
        if (Valid) {
          if (this.SkuDetail) {
            const PostData = {
              Id: this.SkuDetail.Id,
              Quantity: this.OperateForm.SkuCount
            }
            this.$UI.Loading.Show();
            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.InventorySkuInto,
                Login: true
              },
              Data: PostData,
              Callback: (res: PInterface.Res): void => {
                this.$UI.Loading.Hide();
                if (res.IsSuccess) {
                  this.$UI.Tips.Floating("warning", "SKU入库成功");
                  this.ResetModal(false);
                } else {
                  this.$Request.Error(res);
                }
              }
            })
          } else {
            this.$UI.Tips.Floating("warning", "请输入/扫描SKU编号");
          }
        }
      });
    }

    private ResetModal(ResWarehouse: boolean): void {
      this.$set(this, "OperateForm", new Interface.SkuPutWarehouseSearchGroup());
      (this.$refs["OperateForm"] as any).resetFields();
      this.$nextTick(() => {
        if (!ResWarehouse) {
          this.$set(this.OperateForm, "WarehouseId", this.BeforeWarehouseId);
        }
        (this.$refs["SkuCode_Ipt"] as any).focus();
      });
    }

    private IsShowModal: boolean = false;
    private BeforeWarehouseId: number = 0;

    private DropWarehouse: PInterface.KV[] = [];
    private SkuDetail: Interface.SkuInventoryDetail | null = null;

    private OperateForm: Interface.SkuPutWarehouseSearchGroup = new Interface.SkuPutWarehouseSearchGroup();
    private OperateFormRules: any = {
      WarehouseId: [{required: true, message: "请选择仓库", trigger: "change", type: "number"}],
      SkuCode: [{required: true, message: "请输入SKU编号", trigger: "change", type: "string"}],
      SkuCount: [{required: true, message: "请输入SKU数量", trigger: "change", type: "number"}],
    }
  }
</script>
<style scoped lang="less"></style>