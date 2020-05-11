<template>
  <Row class="P-Inline-Block" style="vertical-align: middle;">
    <Button type="primary" class="P-Inline-Block" @click="OpenModal">创建退件工单</Button>
    <Modal v-model="IsShowModal" :mask-closable="false" :closable="false" :width="1300">
      <div slot="header" class="ivu-modal-header-inner">
        <span>{{ ['创建退件工单','扫描签收'][ModalType] }}</span>
        <span style="float: right;cursor: pointer;" @click="CancelModal(false)">
          <Icon type="md-close"/>
        </span>
      </div>
      <Row>
        <Col :span="24">
          <Form inline :label-width="100" onsubmit="return false">
            <Form-item label="跟踪号：">
              <Input v-model.trim="TrackingCode" ref="TrackingCode_Ipt" @on-enter="GetShipOrderDetails" placeholder="请输入/扫描跟踪号">
                <Button slot="append" @click="FocusTrackIpt(true)">清除跟踪号</Button>
              </Input>
            </Form-item>
            <Form-item label="物流渠道：">
              <Select v-model="ShippingMethodId" placeholder="请选择物流渠道" :options="PropShippingMethodDrop" optionValKey="Id" optionKey="Name" />
              <!-- <Select v-model="ShippingMethodId" clearable filterable placeholder="请选择物流渠道">
                <Option v-for="(Item,Index) in PropShippingMethodDrop" :value="Item.Id" :key="Item.Name">{{ Item.Name }}</Option>
              </Select> -->
            </Form-item>
            <Button type="primary" @click="SubModal(0)" class="P-MR-10">提交</Button>
            <Button type="primary" @click="SubModal(1)" class="P-MR-10">完成工单</Button>
            <Button type="primary" @click="BatchEditReturnReason">批量添加退件原因</Button>
          </Form>
        </Col>
        <Col :span="24">
          <Table ref="TableList" @on-selection-change="TableGetSelected" :height="530" :columns="TableRowHead" :data="TableList" size="small" stripe border></Table>
        </Col>
      </Row>
      <footer slot="footer"></footer>
    </Modal>
    <!--批量添加退件原因-->
    <Modal v-model="ShowBatchEditReasonModal" @on-cancel="ClearReasonModal" :mask-closable="false" :width="600" title="批量添加退件原因">
      <Form onsubmit="return false" :label-width="100">
        <FormItem label="退件原因：" required>
          <Input v-model="BatchReturnReason" ref="BatchReturnReason_Ipt" maxlength="200" show-word-limit type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入退件原因"></Input>
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="SubBatchEditReason">确定</Button>
        <Button type="default" @click="ClearReasonModal">取消</Button>
      </footer>
    </Modal>
    <ShipOrderDetails ref="ShipOrderDetails"></ShipOrderDetails>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "LogisticsReturnOrderModify",
    components: {
      ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    }
  })
  export default class LogisticsReturnOrderModify extends Vue {
    @Prop() PropShippingMethodDrop: PInterface.IdName[];

    @Emit() EmitChange(Res: boolean): void {
    }

    // 打开模态框
    private $Trigger({IsShowModal, SelectedDetail, ModalType}: {
      IsShowModal: boolean,
      ModalType: number
      SelectedDetail: Interface.LogisticsReturnOrderTable,
    }): void {
      this.$set(this, "ModalType", ModalType);
      if (this.ModalType === 0) {
        this.$set(this, "IsShowModal", true);
        this.IsShowModal = true;
        this.FocusTrackIpt(true);
      } else {
        this.$set(this, "ModifyDetails", SelectedDetail);
        this.GetReturnLogisticsDetail();
      }
    }

    private OpenModal(): void {
      this.$set(this, "ModalType", 0);
      this.$set(this, "IsShowModal", true);
      this.FocusTrackIpt(true);
    }

    private GetReturnLogisticsDetail(): void {
      let PostData = {
        Id: this.ModifyDetails.Id,
        Code: this.ModifyDetails.ReturnLogisticsCode
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.ReturnLogisticsGeDetail,
          Login: true
        },
        Data: PostData,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.TableListBefore.push(...JSON.parse(JSON.stringify(Res.Data.Data.ReturnLogisticsItemResultModel)));
            this.TableList.push(...JSON.parse(JSON.stringify(Res.Data.Data.ReturnLogisticsItemResultModel)));
            this.IsShowModal = true;
            this.FocusTrackIpt(true);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private FocusTrackIpt(Empty: boolean = false) {
      this.$nextTick(() => {
        (this.$refs["TrackingCode_Ipt"] as any).focus();
        if (Empty) {
          this.$set(this, "TrackingCode", "");
        }
      })
    }

    private GetShipOrderDetails(): void {
      if (this.TrackingCode === "") {
        this.$UI.Tips.Floating("warning", "请输入/扫描跟踪号")
        this.FocusTrackIpt();
        return;
      }
      const Len = this.TrackingCode.length;
      if ([161, 162, 173, 174, 157, 158].includes(this.ShippingMethodId as number) && this.TrackingCode.startsWith("420") && (Len === 30 || Len === 34)) {
        this.TrackingCode = this.TrackingCode.substr(-22);
      }
      // 跟踪号开头为420且长度为30位时自动截取后面22位
      if ([189, 191, 190, 192].includes(this.ShippingMethodId as number) && this.TrackingCode.startsWith("420") && Len === 30) {
        this.TrackingCode = this.TrackingCode.substr(-22);
      }
      // 跟踪号开头为JJD且长度为19位时去掉开头的第一个J
      if (this.ShippingMethodId === 154 && this.TrackingCode.startsWith("JJD") && Len === 19) {
        this.TrackingCode = this.TrackingCode.substr(-18);
      }
      // 跟踪号长度为20位时自动截取后面18位
      if (this.ShippingMethodId === 176 && Len === 20) {
        this.TrackingCode = this.TrackingCode.substr(-18);
      }
      // 扫描跟踪号是否已存在
      if (this.TableList.some((Item) => Item.TrackingNumber === this.TrackingCode)) {
        this.$UI.Tips.CustomModal({
          Type: "warning",
          Content: `${this.TrackingCode}已存在列表`,
          Callback: (B: boolean): void => {
            this.FocusTrackIpt();
          }
        })
        return;
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.GetShipOrderByTrackCode,
          Login: true
        },
        Data: this.TrackingCode,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            if (Res.Data.Data == null) {
              this.$UI.Tips.CustomModal({
                Type: "warning",
                Content: `${this.TrackingCode}无法匹配发货单，请重新扫描`,
                Callback: (B: boolean): void => {
                  this.FocusTrackIpt();
                }
              })
              return;
            }
            // 不是“已发货”状态
            if (Res.Data.Data.Status != 6) {
              let Type = ["", "待检查", "已确认", "待拣货", "已拣货", "已打包", "", "缺货", "已拦截", "联系客户"];
              Type[99] = "已拦截";
              this.$UI.Tips.CustomModal({
                Type: "warning",
                Content: `只有已发货状态的才可以扫描签收，${this.TrackingCode}状态为${Type[Res.Data.Data.Status]}`,
                Callback: (B: boolean): void => {
                  this.FocusTrackIpt(true);
                }
              })
              return;
            }
            // 跟踪号与筛选渠道不一致
            if (this.ShippingMethodId != "" && this.ShippingMethodId != Res.Data.Data.ShippingMethodId) {
              this.$UI.Tips.CustomModal({
                Type: "warning",
                Content: `请扫描/输入相同物流渠道的跟踪号`,
                Callback: (B: boolean): void => {
                  this.FocusTrackIpt(true);
                }
              })
              return;
            }
            // 跟踪号与列表中第一个扫描的跟踪号的物流渠道不一致
            if (this.TableList.length != 0 && Res.Data.Data.ShippingMethodId != this.TableList[0].ShippingMethodId) {
              this.$UI.Tips.CustomModal({
                Type: "warning",
                Content: `请扫描/输入相同物流渠道的跟踪号`,
                Callback: (B: boolean): void => {
                  this.FocusTrackIpt(true);
                }
              })
              return;
            }

            const Item: Interface.LogisticsReturnOrderModifyTable = {
              Id: Res.Data.Data.Id,
              ReturnLogisticsCode: "",
              ShippingMethodId: Res.Data.Data.ShippingMethodId,
              ShippingMethodName: Res.Data.Data.MethodName,
              ShipOrderCode: Res.Data.Data.OrderCode,
              TrackingNumber: Res.Data.Data.TrackingNumber,
              PlatOrderTime: Res.Data.Data.PlatOrderTime,
              ScannedReceiptTime: this.$UI["Render"].NewDate(new Date(), true),
              ReturnReason: "",
              IsNewly: true
            }
            this.TableList.push(Item);
            this.$set(this, "ShippingMethodId", Res.Data.Data.ShippingMethodId);
            this.FocusTrackIpt(true);
          } else {
            this.$Request.Error(Res, () => this.FocusTrackIpt(true));
          }
        }
      })
    }

    private SubModal(Type: number): void {
      if (this.TableList.length === 0) {
        this.$UI.Tips.Floating("warning", "请先扫描签收退件订单再进行操作");
        return;
      }
      (this.$refs["TableList"] as any).selectAll(true);
      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: [`本次扫描签收${this.TableList.length}个退件订单, 是否要全部提交？`, `是否要完成工单，完成后将不能继续扫描签收退件订单？`][Type],
        Callback: (Res: boolean): void => {
          if (Res) {
            const SubInfo: Interface.LogisticsReturnOrderModifySubInfo = new Interface.LogisticsReturnOrderModifySubInfo(
              [0, this.ModifyDetails.Id][this.ModalType],
              ["", this.ModifyDetails.ReturnLogisticsCode][this.ModalType],
              this.TableList[0].ShippingMethodId,
              [1, 2][Type],
              this.TableList.length,
              [this.$UI["Render"].NewDate(new Date(), true), this.ModifyDetails.CreateTime][this.ModalType],
              ["", this.$UI["Render"].NewDate(new Date(), true)][this.ModalType],
            );
            const SubItem: Interface.LogisticsReturnOrderModifySubItem[] = this.TableList.map((Item, Index) => {
              return new Interface.LogisticsReturnOrderModifySubItem(
                [Item.Id, 0][Number(Item.IsNewly)],
                ["", Item.ReturnLogisticsCode][this.ModalType],
                Index,
                Item.ShippingMethodId,
                Item.ShippingMethodName,
                Item.ShipOrderCode,
                Item.TrackingNumber,
                Item.PlatOrderTime,
                Item.ReturnReason,
                this.$UI["Render"].NewDate(new Date(), true)
              );
            })
            this.$UI.Loading.Show();
            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.ReturnLogisticsSave,
                Login: true
              },
              Data: {
                ReturnLogisticsInfo: SubInfo,
                ReturnLogisticsItems: SubItem,
                IsComplete: Boolean(Type)
              },
              Callback: (Res: PInterface.Res): void => {
                this.$UI.Loading.Hide();
                if (Res.IsSuccess) {
                  if (Type === 0) {
                    this.$UI.Tips.Floating("success", [`退件订单签收成功，创建工单${Res.Data.ReturnLogisticsCode}`, `退件订单签收成功`][this.ModalType]);
                  } else {
                    this.$UI.Tips.Floating("success", "工单已签收完成");
                  }
                  this.CancelModal(true);
                } else {
                  this.$Request.Error(Res);
                }
              }
            })
          } else {
            this.TableCancelSelected();
          }
        }
      })
    }

    private BatchEditReturnReason(): void {
      if (this.TableSelected.length === 0) {
        this.$UI.Tips.Floating("warning", `请先选择退件订单再进行操作`);
        return;
      }
      this.$set(this, "ShowBatchEditReasonModal", true);
      this.$nextTick(() => {
        (this.$refs["BatchReturnReason_Ipt"] as any).focus();
      })
    }

    private SubBatchEditReason(): void {
      if (this.BatchReturnReason == "") {
        this.$UI.Tips.Floating("warning", `请输入退件原因`);
        this.$nextTick(() => {
          (this.$refs["BatchReturnReason_Ipt"] as any).focus();
        })
        return;
      }
      for (let Item of this.TableSelected) {
        for (let Val of this.TableList) {
          if (Item.Id === Val.Id) {
            this.$set(Val, "ReturnReason", this.BatchReturnReason);
            break;
          }
        }
      }
      this.$UI.Tips.Floating("success", `批量添加退件原因成功`);
      this.ClearReasonModal();
    }

    private ClearReasonModal(): void {
      this.$set(this, "BatchReturnReason", "");
      this.$set(this, "ShowBatchEditReasonModal", false);
    }

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
    }

    private TableGetSelected(data: Interface.LogisticsReturnOrderModifyTable[]): void {
      this.$set(this, "TableSelected", data)
    }

    private CancelModal(Res: boolean): void {
      if (!Res) {
        if (
          (this.ModalType === 0 && this.TableList.length !== 0) ||
          (this.TableListBefore.length !== this.TableList.length) ||
          (this.TableListBefore.length !== 0 && this.TableList.length !== 0 && (this.TableListBefore[0].ShippingMethodId !== this.TableList[0].ShippingMethodId)) ||
          (this.TableList.some((Item, Index) => (Item.Id !== this.TableListBefore[Index].Id) || (Item.ReturnReason !== this.TableListBefore[Index].ReturnReason)))
        ) {
          this.$UI.Tips.CustomModal({
            Type: "warning",
            Content: "列表有退件订单未提交,是否要关闭窗口？",
            Callback: (B: boolean): void => {
              if (B) {
                this.CancelModal(true);
              }
            }
          })
          return;
        }
      }
      this.$set(this, "IsShowModal", false);
      this.$set(this, "ModalType", 0);
      this.$set(this, "ModifyDetails", new Interface.LogisticsReturnOrderTable());
      this.TableList.splice(0);
      this.TableListBefore.splice(0);
      this.EmitChange(true);
    }

    private TriggerShipOrderDetails(Code: string): void {
      (this as any).$refs.ShipOrderDetails.Validate({
        OrderId: 0,
        OrderCode: Code
      })
    }

    private SetLocationCode(Val: string, Idx: number) {
      this.TableList[Idx].ReturnReason = Val;
    }

    private ShowBatchEditReasonModal: boolean = false;
    private IsShowModal: boolean = false;
    private ModalType: number = 0;
    private ModifyDetails: Interface.LogisticsReturnOrderTable = new Interface.LogisticsReturnOrderTable();

    private TableListBefore: Interface.LogisticsReturnOrderModifyTable[] = [];
    private TableList: Interface.LogisticsReturnOrderModifyTable[] = [];
    private TableSelected: Interface.LogisticsReturnOrderModifyTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "",
      renderHeader: (h, params) => {
        return h("span", {
          style: {
            fontSize: "14px"
          }
        }, `已扫描 ${this.TableList.length} 个退件订单`)
      },
      children: [{
        type: "selection", width: 60, align: "center"
      }, {
        title: "序号",
        type: "index",
        width: 70,
      }, {
        title: "物流渠道",
        key: "ShippingMethodName"
      }, {
        title: "跟踪号",
        key: "TrackingNumber"
      }, {
        title: "发货订单",
        key: "ShipOrderCode",
        render: (h: any, params: any) => {
          return h("a", {
            style: {
              cursor: "pointer"
            },
            on: {
              click: () => {
                this.TriggerShipOrderDetails(params.row.ShipOrderCode);
              }
            }
          }, params.row.ShipOrderCode)
        }
      }, {
        title: "下单时间", key: "PlatOrderTime", width: 160,
        render: (h: any, params: any) => {
          return h("span", this.$UI.Render.Date(params.row.PlatOrderTime, true));
        }
      }, {
        title: "签收时间", key: "ScannedReceiptTime", width: 160,
        render: (h: any, params: any) => {
          return h("span", this.$UI.Render.Date(params.row.ScannedReceiptTime, true));
        }
      },
        {
          title: "退件原因",
          key: "ReturnReason",
          render: (h: any, params: any) => {
            return h("Input", {
              props: {
                value: params.row.ReturnReason
              },
              attrs: {
                placeholder: "请输入退件原因"
              },
              on: {
                "on-change": (Ev: any) => {
                  this.SetLocationCode(Ev.target.value, params.index);
                }
              }
            })
          },
        },
        {
          title: "操作",
          width: 80,
          render: (h: any, params: any) => {
            return h("div", [
              h("Button", {
                props: {
                  type: "error",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.TableList.splice(params.row._index, 1);
                  }
                }
              }, "删除")
            ])
          }
        }]
    }];

    private TrackingCode: string = "";
    private ShippingMethodId: number | "" = "";
    private DropShippingMethod: PInterface.IdName[] = [];

    private BatchReturnReason: string = "";
  }
</script>
<style scoped lang="less">
  .ivu-modal-header-inner {
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #1c2438;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>