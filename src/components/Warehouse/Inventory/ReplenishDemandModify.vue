<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block P-MR-10 P-MB-10" @click="OpenModal()">添加补货需求</Button>
    <Modal :title="['添加补货需求','修改补货需求'][Number(CurIsModify)]" v-model="IsShowModal" :mask-closable="false" @on-cancel="CancelModal(false)" :width="1000">
      <Row>
        <Col :span="24" v-show="!CurIsModify">
          <Form :model="OperateForm" ref="OperateForm" :rules="OperateFormRules" :label-width="120" onsubmit="return false">
            <Form-item label="仓库：" prop="WarehouseId">
              <Select v-model="OperateForm.WarehouseId" placeholder="请选择仓库" :options="PropWarehouseDrop" />
              <!-- <Select v-model="OperateForm.WarehouseId" clearable filterable placeholder="请选择仓库">
                <Option v-for="(Item, Index) in PropWarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
              </Select> -->
            </Form-item>
            <Form-item label="备注：" prop="Remark">
              <Input v-model="OperateForm.Remark" :autosize="{minRows:3,maxRows:3}" placeholder="请输入备注" type="textarea"></Input>
            </Form-item>
          </Form>
        </Col>
        <Col :span="24">
          <div class="P-TA-C P-P-5 THeadBorder FS_15">物品列表</div>
          <Table ref="TableList" :height="400" :columns="ViewRowHead" :data="TableList" size="small" stripe></Table>
        </Col>
        <Col :span="24" v-show="!CurIsModify" class="P-TA-R P-MT-10">
          <Button type="primary" @click="$TriggerEnableSku">选择SKU</Button>
        </Col>
      </Row>
      <footer slot="footer">
        <Button type="primary" @click="SubModal">{{ ['添加','修改'][Number(CurIsModify)] }}</Button>
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
    name: "ReplenishDemandModify",
    components: {
      EnableSku: () => import("@/components/Public/EnableSku.vue"),
    }
  })
  export default class ReplenishDemandModify extends Vue {
    @Prop() PropWarehouseDrop: PInterface.KV[];

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private $Trigger({IsModify, SelectedDetail}: {
      IsModify: boolean,
      SelectedDetail: Interface.ReplenishDemandTable
    }) {
      this.CurIsModify = IsModify;
      this.IsShowModal = true;
      this.$set(this, "ViewRowHead", this.TableRowHead.slice(0, IsModify ? -1 : undefined));
      if (IsModify) {
        this.TableList.push(new Interface.ReplenishDemandModifyTable(
          SelectedDetail.ReplenishId,
          SelectedDetail.SkuCode,
          SelectedDetail.SkuName,
          SelectedDetail.Num
        ))
      }
    }

    private OpenModal(): void {
      this.CurIsModify = false
      this.IsShowModal = true;
      this.$set(this, "ViewRowHead", this.TableRowHead.slice(0));
    }

    private $TriggerEnableSku() {
      (this.$refs["EnableSku"] as Vue).Trigger(false);
    }

    // Sku回调
    private HandleSkuRes(SelectSku: PInterface.EnableSku[]): void {
      for (let Item of SelectSku) {
        if (this.TableList.some((Val) => Val.ReplenishId == Item.Id)) {
          continue;
        } else {
          this.TableList.push(new Interface.ReplenishDemandModifyTable(Item.Id, Item.SkuCode, Item.SkuName))
        }
      }
    }

    private SetSelectedSkuNum(Index: number, Num: number): void {
      this.$set(this.TableList[Index], "Num", Number(Num));
    }

    private SubModal(): void {
      (this.$refs["OperateForm"] as any).validate((valid: boolean) => {
        if (valid || this.CurIsModify) {
          if (this.TableList.length == 0) {
            this.$UI.Tips.Floating("warning", `请添加SKU`);
            return;
          }
          if (this.TableList.some((Item) => Item.Num == 0)) {
            this.$UI.Tips.Floating("warning", `请输入正确的补货数量`);
            return;
          }
          this.PostModal();
        }
      });
    }

    private PostModal(): void {
      let Api = this.CurIsModify ? this.$Api.SkuReplenishEdit : this.$Api.SkuReplenishAdd;
      let PostData = this.CurIsModify ? new Interface.ReplenishDemandPostModify(
        this.TableList[0].ReplenishId,
        this.TableList[0].Num
      ) : this.TableList.map((Item) => new Interface.ReplenishDemandPostAdd(
        (this.OperateForm.WarehouseId as number),
        this.OperateForm.Remark,
        Item.ReplenishId,
        Item.Num)
      )
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: Api,
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$UI.Tips.Floating("success", this.CurIsModify ? "修改补货需求成功" : "添加补货需求成功");
            this.CancelModal(true);
          } else {
            this.$Request.Error(res);
          }
        }
      })
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
    private CurIsModify: boolean = false;

    private TableList: Interface.ReplenishDemandModifyTable[] = [];
    private ViewRowHead: PInterface.TableCol[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "SKU编号",
      key: "SkuCode",
      width: 200,
    }, {
      title: "名称",
      key: "SkuName"
    }, {
      title: "补货数量",
      width: 200,
      renderHeader: (h, params) => {
        return h("div", [
          h("span", {
            style: {
              color: "red"
            }
          }, "*"),
          h("span", "补货数量")
        ])
      },
      render: (h, params) => {
        return h("InputNumber", {
          class: "P-W-100-Percent",
          props: {
            "value": params.row.Num,
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
  .FS_15 {
    font-size: 15px;
  }

  .THeadBorder {
    &:before {
      content: '*';
      display: inline-block;
      color: red;
      vertical-align: middle;
      height: 14px;
      margin-top: -5px;
      margin-right: 5px;
    }

    border: 1px solid #f1f1f2;
    border-bottom: none;
    font-weight: bold;
  }
</style>