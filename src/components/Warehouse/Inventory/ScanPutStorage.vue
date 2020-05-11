<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block P-MR-10 P-MB-10" @click="ScanOpenModal">扫描入库</Button>
    <!-- 扫描入库 -->
    <Modal title="扫描入库" v-model="IsShowScanModal" :mask-closable="false" @on-cancel="ScanCloseModal(false)" :width="700">
      <Form :model="ScanOperateForm" ref="ScanOperateForm" :rules="ScanOperateFormRules" :label-width="120" onsubmit="return false">
        <Form-item label="补货需求编号：" prop="ReplenishCode">
          <Input ref="ReplenishCode_Ipt" v-model="ScanOperateForm.ReplenishCode" @on-enter="GetPdaOutStoreDetial(true, ScanOperateForm.ReplenishCode)" :disabled="DisabledReplenishCode" placeholder="请输入补货需求编号"></Input>
        </Form-item>
        <Form-item label="SKU编号：">{{ ScanOperateForm.SkuCode || '-' }}</Form-item>
        <Form-item label="产品名：">{{ ScanOperateForm.SkuName || '-' }}</Form-item>
        <Form-item label="数量：">{{ ScanOperateForm.Num || '-' }}</Form-item>
        <Form-item label="发货仓货架号：" prop="Location2">
          <Input ref="Location2_Ipt" v-model="ScanOperateForm.Location2" :disabled="DisabledLocation2" placeholder="请输入发货仓货架号"></Input>
        </Form-item>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="ScanSubModal">入库</Button>
        <Button @click="ScanResetModal(false)">重置</Button>
      </footer>
    </Modal>
    <!-- 入库 -->
    <Modal title="入库" v-model="IsShowInStorageModal" @on-cancel="CancelInStorage(false)" :mask-closable="false" :width="900">
      <Table class="mt20" :columns="TableRowHead" :data="TableList" stripe></Table>
      <footer slot="footer">
        <Button type="primary" @click="PostInStorage(false)">入库</Button>
        <Button @click="CancelInStorage(false)">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "ScanPutStorage"
  })
  export default class ScanPutStorage extends Vue {
    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private $Trigger({SelectedDetail}: {
      SelectedDetail: Interface.ReplenishDemandTable
    }) {
      this.GetPdaOutStoreDetial(false, SelectedDetail.ReplenishCode);
    }

    private FocusReplenishCode(): void {
      this.ScanOperateForm.ReplenishCode = "";
      this.$nextTick(() => {
        (this.$refs["ReplenishCode_Ipt"] as any).focus();
      })
    }

    private GetPdaOutStoreDetial(IsScan: boolean, ReplenishCode: string): void {
      if (ReplenishCode == "") {
        this.$UI.Tips.Floating("warning", "请输入或扫描补货需求编号");
        return;
      }
      if (ReplenishCode.slice(0, 3) != "SUP") {
        this.$UI.Tips.Floating("warning", "请输入正确的补货需求编号");
        this.FocusReplenishCode();
        return;
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.SkuReplenishPdaOutStore,
          Login: true
        },
        Data: ReplenishCode,
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            let Detail: Interface.PdaOutStoreDetial = res.Data.Data;
            // 扫描入库
            if (IsScan) {
              if (Detail.srStatus != 2) {
                this.$UI.Tips.Floating("warning", "请输入状态为已出库的补货需求编号");
                this.FocusReplenishCode();
                return;
              }
              this.$set(this, "ScanOperateForm", Detail);
              this.DisabledReplenishCode = true;
              if (this.VerifyLocationCode.test(Detail.Location2)) {
                this.DisabledLocation2 = true;
              } else {
                this.$UI.Tips.Floating("warning", "请输入正确的发货货仓架号");
              }
            }
            // 入库
            else {
              this.IsShowInStorageModal = true;
              this.TableList.push(Detail);
            }
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private ScanOpenModal(): void {
      this.IsShowScanModal = true;
      this.FocusReplenishCode();
    }

    private ScanSubModal(): void {
      (this.$refs["ScanOperateForm"] as any).validate((valid: boolean) => {
        if (valid) {
          this.PostInStorage(true);
        } else {
          if (!this.ScanOperateForm.ReplenishCode) {
            this.FocusReplenishCode();
            return;
          }
          if (!this.ScanOperateForm.Location2) {
            (this.$refs["Location2_Ipt"] as any).focus();
            return;
          }
        }
      });
    }

    private PostInStorage(IsScan: boolean) {
      if (IsScan) {
        if (!this.ScanOperateForm.ReplenishId) {
          this.$UI.Tips.Floating("warning", "请输入或扫描补货需求编号");
          this.ScanResetModal(false);
          this.FocusReplenishCode();
          return;
        }
      } else {
        if (!this.VerifyLocationCode.test(this.TableList[0].Location2)) {
          this.$UI.Tips.Floating("warning", "请输入格式为“（1-15数字）-（01-999数字）-（A-Z大写字母）-（01-200数字）”的货架号");
          return;
        }
      }

      let Module: Interface.PdaOutStoreDetial = IsScan ? this.ScanOperateForm : this.TableList[0];
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.PurchaseArrivalOrderInStorage,
          Login: true
        },
        Data: new Interface.OrderInStorage(
          Module.ReplenishId,
          Module.ReplenishCode,
          Module.Num,
          Module.Location2
        ),
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$UI.Tips.Floating("warning", IsScan ? "扫描入库成功" : "入库成功");
            IsScan ? this.ScanResetModal(true) : this.CancelInStorage(true);
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private ScanResetModal(Res:boolean): void {
      this.DisabledReplenishCode = false;
      this.DisabledLocation2 = false;
      this.$set(this, "ScanOperateForm", new Interface.PdaOutStoreDetial());
      (this as any).$refs["ScanOperateForm"].resetFields();
      this.FocusReplenishCode();
      if (Res) {
        this.EmitChange(true);
      }
    }

    private ScanCloseModal(Res: boolean): void {
      this.ScanResetModal(false);
      this.IsShowScanModal = false;
    }

    private ValidateLocation2 = (Rule: any, Value: string, CallBack: any): void => {
      if (Value === "") {
        CallBack(new Error("请输入发货仓货架号"));
      } else if (!(this.VerifyLocationCode.test(Value))) {
        CallBack(new Error("请输入格式为“（1-15数字）-（01-999数字）-（A-Z大写字母）-（01-200数字）”的货架号"));
      } else {
        CallBack();
      }
    };

    private SetLocationCode(Val: string, Idx: number) {
      this.TableList[Idx].Location2 = Val;
    }

    private CancelInStorage(Res: boolean): void {
      this.IsShowInStorageModal = false;
      this.TableList.splice(0);
      if (Res) {
        this.EmitChange(true);
      }
    }

    private ScanOperateForm: Interface.PdaOutStoreDetial = new Interface.PdaOutStoreDetial();
    private ScanOperateFormRules: any = {
      ReplenishCode: [{required: true, message: "请输入补货需求编号", trigger: "change", type: "string"}],
      Location2: [{required: true, validator: this.ValidateLocation2, trigger: "change", type: "string"}],
    }

    private TableList: Interface.PdaOutStoreDetial[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "SKU编号",
      key: "SkuCode"
    }, {
      title: "名称",
      key: "SkuName",
      render: (h, params) => {
        return params.row.SkuName ? h("Tooltip", {
          props: {
            "content": params.row.SkuName,
            "maxWidth": 500
          },
          class: "P-W-100-Percent P-Tooltip-LINE-1"
        }, params.row.SkuName) : h("span", "-");
      }
    }, {
      title: "入库数量",
      key: "Num"
    }, {
      title: "",
      key: "",
      renderHeader: (h, params) => {
        return h("div", [
          h("span", {
            style: {
              color: "red"
            }
          }, "*"),
          h("span", " 发货仓货架号")
        ])
      },
      render: (h, params) => {
        return h("Input", {
          props: {
            value: params.row.Location2,
            disabled: this.VerifyLocationCode.test(params.row.Location2)
          },
          attrs: {
            placeholder: "请输入货架号",
          },
          on: {
            "on-change": (Val: string) => {
              this.SetLocationCode(Val, params.index);
            }
          }
        })
      }
    }];
    private IsShowScanModal: boolean = false;
    private IsShowInStorageModal: boolean = false;

    private DisabledReplenishCode: boolean = false;// 禁启用补货需求
    private DisabledLocation2: boolean = false; //禁启用货架号

    // 货架号正则
    private VerifyLocationCode: any = /^((1[0-5])|[1-9])(\-)((0[1-9])|[1-9][\d]{1,2})(\-)([A-Z])(\-)(0[1-9]|[1-9][0-9]|1[\d]{2}|200)$/;
  }
</script>
<style scoped lang="less"></style>