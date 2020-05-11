<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block" @click="OpenModal()">添加物料申请</Button>
    <Modal :title="['添加物料申请','修改物料申请'][ModalType]" v-model="IsShowModal" :mask-closable="false" @on-cancel="CancelModal(false)" :width="1000">
      <Row>
        <Col :span="24">
          <Form :model="OperateForm" ref="OperateForm" :rules="OperateFormRules" :label-width="120" onsubmit="return false">
            <Form-item label="发货仓库：" prop="WarehouseId">
               <Select v-model="OperateForm.WarehouseId" placeholder="请选择发货仓库" :options="PropWarehouseDrop" />
              <!-- <Select v-model="OperateForm.WarehouseId" clearable filterable placeholder="请选择发货仓库">
                <Option v-for="(Item, Index) in PropWarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
              </Select> -->
            </Form-item>
            <Form-item label="备注：" prop="Remark">
              <Input v-model="OperateForm.Remark" :autosize="{minRows:3,maxRows:3}" placeholder="请输入备注" type="textarea"></Input>
            </Form-item>
          </Form>
        </Col>
        <Col :span="24">
          <Table ref="TableList" :height="400" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
        </Col>
        <Col :span="24" class="P-TA-R P-MT-10">
          <Button type="primary" @click="$TriggerEnableSku">选择SKU</Button>
        </Col>
      </Row>
      <footer slot="footer">
        <Button type="primary" @click="SubModal(1)">{{ ['添加','修改'][ModalType] }}</Button>
        <Button type="primary" @click="SubModal(2)">提交审核</Button>
        <Button @click="CancelModal(false)">取消</Button>
      </footer>
    </Modal>
    <EnableSku ref="EnableSku" @handle-res-msg="HandleSkuRes"></EnableSku>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "MaterielApplyModify",
    components: {
      EnableSku: () => import("@/components/Public/EnableSku.vue"),
    }
  })
  export default class MaterielApplyModify extends Vue {
    @Prop() PropWarehouseDrop: PInterface.KV[];

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private $Trigger({SelectedDetail}: {
      SelectedDetail: Interface.MaterielApplyTable
    }) {
      this.ModalType = 1;
      this.ModifyId = SelectedDetail.Id;
      this.$set(this, "OperateForm", new Interface.ReplenishDemandModifyForm(SelectedDetail.WarehouseId, SelectedDetail.Remark));
      for (let Item of SelectedDetail.MaterialApplyItems) {
        this.TableList.push(new Interface.MaterielApplyModifyTable(
          Item.SkuId,
          Item.SkuCode,
          Item.SkuName,
          Item.Image,
          Item.Quantity
        ));
      }
      this.IsShowModal = true;
    }

    private OpenModal(): void {
      this.ModalType = 0;
      this.ModifyId = 0;
      this.IsShowModal = true;
    }

    private $TriggerEnableSku() {
      (this.$refs["EnableSku"] as Vue).Trigger(false);
    }

    // Sku回调
    private HandleSkuRes(SelectSku: PInterface.EnableSku[]): void {
      for (let Item of SelectSku) {
        if (this.TableList.some((Val) => Val.SkuId == Item.Id)) {
          continue;
        } else {
          this.TableList.push(new Interface.MaterielApplyModifyTable(Item.Id, Item.SkuCode, Item.SkuName, Item.DefaultImage))
        }
      }
    }

    private SetSelectedSkuNum(Index: number, Num: number): void {
      this.$set(this.TableList[Index], "Quantity", Number(Num));
    }

    private SubModal(Type: number): void {
      (this.$refs["OperateForm"] as any).validate((Bool: boolean) => {
        if (Bool) {
          if (this.TableList.length == 0) {
            this.$UI.Tips.Floating("warning", `请添加SKU后进行操作`);
            return;
          }
          const PostData: Interface.MaterielApplyModify = {
            Id: this.ModifyId,
            Status: Type,
            WarehouseId: (this.OperateForm.WarehouseId as number),
            Remark: this.OperateForm.Remark,
            MaterialApplyItems: this.TableList
          }
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.MaterialApplySave,
              Login: true
            },
            Data: PostData,
            Callback: (Res: PInterface.Res): void => {
              this.$UI.Loading.Hide();
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating("success", Type == 1 ? ["添加物料申请成功", "修改物料申请成功"][this.ModalType] : "提交审核物料申请成功");
                this.CancelModal(true);
              } else {
                this.$Request.Error(Res);
              }
              this.$UI.Loading.Hide();
            }
          })
        }
      });
    }

    private CancelModal(Res: boolean): void {
      this.IsShowModal = false;
      this.TableList.splice(0);
      (this as any).$refs["OperateForm"].resetFields();
      this.EmitChange(Res);
    }

    private OperateForm: Interface.ReplenishDemandModifyForm = new Interface.ReplenishDemandModifyForm();
    private OperateFormRules: any = {
      WarehouseId: [{required: true, message: "请选择仓库", trigger: "change", type: "number"}],
    }
    private IsShowModal: boolean = false;
    private ModalType: number = 0;
    private ModifyId: number = 0;

    private TableList: Interface.MaterielApplyModifyTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "SKU编号",
      key: "SkuCode",
      width: 200,
    }, {
      title: "产品名",
      key: "SkuName"
    }, {
      title: "数量",
      width: 200,
      render: (h, params) => {
        return h("InputNumber", {
          class: "P-W-100-Percent",
          props: {
            "value": params.row.Quantity,
            "precision": 0,
            "min": 1,
            "step": 1
          },
          attrs: {
            placeholder: "请输入数量"
          },
          on: {
            input: (Val: number) => {
              this.SetSelectedSkuNum(params.index, Val);
            }
          }
        })
      }
    }, {
      title: "操作",
      width: 100,
      render: (h, params) => {
        return h("Button", {
          props: {
            type: "error",
            size: "small"
          },
          on: {
            click: () => {
              this.TableList.splice(params.index, 1)
            }
          }
        }, "删除")
      }
    }];

  }
</script>
<style scoped lang="less">
</style>