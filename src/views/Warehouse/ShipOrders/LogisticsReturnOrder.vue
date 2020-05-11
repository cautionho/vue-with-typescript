<!-- 物流退件订单 -->
<template>
  <Row>
    <Col span="24">
      <Row class="P-Search-Group">
        <Col :span="24">
          <Form ref="SearchForm" :model="SearchForm" onsubmit="return false" inline class="P-MB-10">
            <Dropdown trigger="custom" :visible="AccurateSearch">
              <Button type="primary" @click="TriggerSearch">
                精准搜索
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <Col span="24" slot="list" class="P-P-10">
                <Select v-model="SearchForm.ShippingMethodId" class="P-W-200 P-MR-10" placeholder="筛选物流渠道" optionValKey="Id" optionKey="Name" options="DropShippingMethod" />
                <Select v-model="SearchForm.Status" class="P-W-200 P-MR-10" placeholder="筛选状态" :options="DropStatus" />
                <Select v-model="SearchForm.ProcessingStatus" class="P-W-200" placeholder="筛选客服处理状态" :options="DropProcessingStatus" />
                <!-- <Select v-model="SearchForm.ShippingMethodId" @on-change="OnClearSelect('ShippingMethodId')" multiple filterable clearable class="P-W-200 P-MR-10" placeholder="筛选物流渠道">
                  <Option v-for="(Item,Index) in DropShippingMethod" :value="Item.Id" :key="Item.Name">{{ Item.Name }}</Option>
                </Select>
                <Select v-model="SearchForm.Status" @on-change="OnClearSelect('Status')" filterable clearable class="P-W-200 P-MR-10" placeholder="筛选状态">
                  <Option v-for="(Item, Index) in DropStatus" :value="$Enums.Warehouse.LogisticsReturnOrderStaus[Item]" :key="Index">{{ Item }}</Option>
                </Select>
                <Select v-model="SearchForm.ProcessingStatus" @on-change="OnClearSelect('ProcessingStatus')" filterable clearable class="P-W-200" placeholder="筛选客服处理状态">
                  <Option v-for="(Item, Index) in DropProcessingStatus" :value="$Enums.Warehouse.LogisticsReturnOrderServiceStaus[Item]" :key="Index">{{ Item }}</Option>
                </Select> -->
                <span class="P-ML-10 P-Inline-Block">创建时间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
              <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropSearchKeyType" />
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in DropSearchKeyType" :value="$Enums.Warehouse.LogisticsReturnOrderKeyType[Item]" :key="Index">{{Item}}</Option>
                </Select> -->
                <Button slot="append" type="primary" @click="SearchList">搜索</Button>
              </Input>
            </FormItem>
            <FormItem class="P-MB-0">
              <Button type="warning" @click="ResetList">重置</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :span="24">
          <Row ref="OperateBtnGroup" class="OperateBtnGroup">
            <LogisticsReturnOrderDetail ref="LogisticsReturnOrderDetail"></LogisticsReturnOrderDetail>
            <!-- 创建退件工单 -->
            <LogisticsReturnOrderModify ref="LogisticsReturnOrderCreate"
                                        v-if="Powers.CreateReturnOrder"
                                        :PropShippingMethodDrop="DropShippingMethod"
                                        @emit-change="OperateEmitChange"
                                        class="P-MB-10 P-MR-10"
            ></LogisticsReturnOrderModify>
            <Button type="primary" v-if="Powers.LogisticsCommitOperation" class="P-MB-10 P-MR-10" @click="BatchOrderOperate(0, true)">批量完成工单</Button>
            <Button type="primary" v-if="Powers.LogisticsCommitOperation" class="P-MB-10 P-MR-10" @click="BatchOrderOperate(1, true)">批量作废工单</Button>
            <!-- SKU入库 -->
            <SkuPutWarehouse ref="SkuPutWarehouse"
                             v-if="Powers.InventorySkuInto"
                             class="P-MB-10 P-MR-10"></SkuPutWarehouse>
            <!-- 更改客服处理状态 -->
            <ChangeServiceStatus ref="ChangeServiceStatus"
                                 v-if="Powers.ProcessingStatus"
                                 :PropTableSelected="TableSelected"
                                 @emit-change="OperateEmitChange"
                                 class="P-MB-10 P-MR-10"></ChangeServiceStatus>
            <Button type="primary" v-if="Powers.ExportReturnOrder" class="P-MB-10 P-MR-10" @click="ExportReturnOrder">导出退件订单</Button>
          </Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" @on-selection-change="TableGetSelected" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
        </Col>
        <Col :span="24">
          <Page ref="Pager" @on-change="SetChangePageTable" @on-page-size-change="SetChangePageSizeTable" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator
                class="P-MT-10"/>
        </Col>
      </Row>
    </Col>
  </Row>
</template>
<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "LogisticsReturnOrder",
    components: {
      LogisticsReturnOrderModify: () => import("@/components/Warehouse/Inventory/LogisticsReturnOrderModify.vue"),
      SkuPutWarehouse: () => import("@/components/Warehouse/Inventory/SkuPutWarehouse.vue"),
      ChangeServiceStatus: () => import("@/components/Warehouse/Inventory/ChangeServiceStatus.vue"),
      LogisticsReturnOrderDetail: () => import("@/components/Warehouse/Inventory/LogisticsReturnOrderDetail.vue"),
    }
  })

  export default class LogisticsReturnOrder extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["CreateReturnOrder", "LogisticsCommitOperation", "InventorySkuInto", "ProcessingStatus", "ExportReturnOrder"]));

      this.$set(this, "DropShippingMethod", await this.GetDropList<number, PInterface.KV>(this.$Server.Logistics, this.$Api.ChannelDropList, 0));

      this.SetOperateBtn();
    }

    private SetOperateBtn(): void {
      let Drops: PInterface.KV[] = [{Key: "查看", Value: "Look"}];
      this.Powers.CreateReturnOrder ? Drops.push({Key: "扫描签收", Value: "ScanSignFor"}) : "";
      this.Powers.LogisticsCommitOperation ? Drops.push({Key: "完成工单", Value: "AchieveWorkOrder"}, {Key: "作废工单", Value: "CancellationWorkOrder"}) : "";
      this.Powers.ProcessingStatus ? Drops.push({Key: "更改客服处理状态", Value: "ChangeProcessingStatus"}) : "";
      this.DropOperate.push(...Drops);

      this.ResetList();
    }

    private OperateEmitChange(Res: boolean): void {
      this.TableCancelSelected();
      if (Res) {
        this.GetTableList();
      }
    }

    private GetDropList<T, S>(Server: String, Api: String, Data: T): Promise<S> {
      return new Promise((resolve: (Val: S) => void) => {
        this.$Request.Post({
          Server: Server,
          Api: {
            Address: Api
          },
          Data: Data,
          Callback: (Res: PInterface.Res): void => {
            if (!Res.IsSuccess) this.$Request.Error(Res);
            resolve(Res.Data.DropList || [])
          }
        })
      })
    }

    private ResetList(): void {
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.LogisticsReturnOrderSearchGroup());
      this.SearchList();
    }

    private SearchList(): void {
      if (this.SearchForm.StartTime !== "" && this.SearchForm.EndTime !== "") {
        const StartTime = new Date(this.SearchForm.StartTime).getTime();
        const EndTime = new Date(this.SearchForm.EndTime).getTime();
        if (StartTime > EndTime) {
          this.$UI.Tips.Floating("warning", `开始时间不能大于结束时间`);
          return;
        }

        if ((EndTime - StartTime) / 86400000 > 31) {
          this.$UI.Tips.Floating("warning", "时间区间不能超过31天");
          return;
        }
      } else if ((this.SearchForm.StartTime === "" && this.SearchForm.EndTime !== "") || (this.SearchForm.StartTime !== "" && this.SearchForm.EndTime === "")) {
        this.$UI.Tips.Floating("warning", "开始时间和结束时间必须同时填写");
        return
      }
      this.$set(this.Pager, "PageIndex", 1);
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableCancelSelected();
      this.AccurateSearch = false;
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.ReturnLogisticsGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            ShippingMethodId: Number(this.SearchForm.ShippingMethodId),
            Status: Number(this.SearchForm.Status),
            StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : "",
            EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
            SearchKeyType: Number(this.SearchForm.SearchKeyType),
            SearchKey: this.SearchForm.SearchKey,
            ProcessingStatus: Number(this.SearchForm.ProcessingStatus),
          }
        },
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.Pager.TotalItems = res.Data.PageModel.TotalItems;
            this.TableList.push(...res.Data.PageModel.Items);
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private BatchOrderOperate(Type: number, IsBatch: boolean): void {
      if (this.TableSelected.length === 0) {
        this.$UI.Tips.Floating("warning", "请先选择工单再进行操作");
        return;
      }
      if (this.TableSelected.some((Item) => Item.Status !== 1)) {
        this.$UI.Tips.Floating("warning", "请选择待签收状态的退件工单");
        return;
      }

      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: ["是否要完成工单,完成后将不能继续扫描签收退件订单?", `是否要作废工单${this.TableSelected.map((Item) => Item.ReturnLogisticsCode).join(", ")}`][Type],
        Enter: false,
        Callback: (Bool: boolean): void => {
          if (Bool) {
            const PostData = {
              Ids: this.TableSelected.map((Item) => Item.Id),
              IsComplete: [true, false][Type]
            }
            this.$UI.Loading.Show();
            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.ReturnLogisticsCommitOperation,
                Login: true
              },
              Data: PostData,
              Callback: (res: PInterface.Res): void => {
                this.$UI.Loading.Hide();
                if (res.IsSuccess) {
                  this.$UI.Tips.Floating("success", ["工单已签收完成", "工单已作废成功"][Type]);
                  this.TableCancelSelected();
                  this.GetTableList();
                } else {
                  this.$Request.Error(res);
                }
              }
            })
          }
        }
      })
    }

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
    }

    //获取列表复选框选中的数据
    private TableGetSelected(data: Interface.LogisticsAgingTable[]): void {
      this.$set(this, "TableSelected", data)
    }

    private CalculateTbHeight(): number {
      let H = window.innerHeight - 145;
      if (this.$refs["SearchForm"]) {
        H -= (this.$refs["SearchForm"] as any).$el.offsetHeight;
      }
      if (this.$refs["OperateBtnGroup"]) {
        H -= (this.$refs["OperateBtnGroup"] as any).$el.offsetHeight;
      }
      if (this.$refs["Pager"]) {
        H -= (this.$refs["Pager"] as any).$el.offsetHeight;
      }
      return H;
    }

    private SetChangePageTable(pageNum: number): void {
      this.Pager.PageIndex = pageNum;
      this.GetTableList();
    }

    private SetChangePageSizeTable(pageSize: number): void {
      this.Pager.PageSize = pageSize;
      this.GetTableList();
    }

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private ShowOperateBtn(Status: number, Type: string): string {
      let Display = "";
      switch (Type) {
        case "Look":
          Display = "block";
          break;
        case "ScanSignFor":
          Display = Status == 1 && this.Powers.CreateReturnOrder ? "block" : "none";
          break;
        case "AchieveWorkOrder":
        case "CancellationWorkOrder":
          Display = Status == 1 && this.Powers.LogisticsCommitOperation ? "block" : "none";
          break;
        case "ChangeProcessingStatus":
          Display = this.Powers.ProcessingStatus ? "block" : "none";
          break;
      }
      return Display;
    }

    private ExportReturnOrder(): void {
      if (this.SearchForm.ProcessingStatus === "") {
        this.$UI.Tips.Floating("warning", "请选择客服处理状态");
        return;
      }
      if (this.SearchForm.StartTime === "") {
        this.$UI.Tips.Floating("warning", "请选择开始时间");
        return;
      }
      if (this.SearchForm.EndTime === "") {
        this.$UI.Tips.Floating("warning", "请选择结束时间");
        return;
      }
      let StartTimes = new Date(this.SearchForm.StartTime).valueOf();
      let EndTimes = new Date(this.SearchForm.EndTime).valueOf();
      if (StartTimes > EndTimes) {
        this.$UI.Tips.Floating("warning", "开始时间不能晚于结束时间");
        return
      }
      if (EndTimes - StartTimes > 31 * 86400000) {
        this.$UI.Tips.Floating("warning", "时间段不能超过31天");
        return
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.ReturnLogisticsExport,
          Login: true
        },
        Data: {
          ShippingMethodId: Number(this.SearchForm.ShippingMethodId),
          Status: Number(this.SearchForm.Status),
          StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : "",
          EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
          SearchKeyType: Number(this.SearchForm.SearchKeyType),
          SearchKey: this.SearchForm.SearchKey,
          ProcessingStatus: Number(this.SearchForm.ProcessingStatus),
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.$Modal.success({
              title: "操作成功",
              content: "创建导出退件订单成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据;"
            })
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private OperateGroup(Type: string, Index: number): void {
      this.TableCancelSelected();
      this.TableSelected.push(JSON.parse(JSON.stringify(this.TableList[Index])));
      switch (Type) {
        case "Look":
          this.GetDetial();
          break;
        case "ScanSignFor":
          (this.$refs["LogisticsReturnOrderCreate"] as Vue).$Trigger({
            IsShowModal: true,
            ModalType: 1,
            SelectedDetail: this.TableSelected[0]
          });
          break;
        case "AchieveWorkOrder":
          this.BatchOrderOperate(0, false)
          break;
        case "CancellationWorkOrder":
          this.BatchOrderOperate(1, false)
          break;
        case "ChangeProcessingStatus":
          this.$nextTick(()=>{
            (this.$refs["ChangeServiceStatus"] as Vue).OpenModal();
          })
          break;
      }
    }

    private GetDetial(): void {
      console.log(JSON.parse(JSON.stringify(this.TableSelected)));
      const PostData = {
        Id: this.TableSelected[0].Id,
        Code: this.TableSelected[0].ReturnLogisticsCode
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
            (this.$refs["LogisticsReturnOrderDetail"] as Vue).$Trigger({
              IsShowModal: true,
              OrderDetial: Res.Data.Data
            });
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private OpenDetailModal(Item: Interface.LogisticsReturnOrderTable): void {
      this.TableSelected.push(JSON.parse(JSON.stringify(Item)));
      this.GetDetial();
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.LogisticsReturnOrderSearchGroup = new Interface.LogisticsReturnOrderSearchGroup();

    private TableList: Interface.LogisticsReturnOrderTable[] = [];
    private TableSelected: Interface.LogisticsReturnOrderTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "工单编号",
      key: "ReturnLogisticsCode",
      render: (h, params) => {
        return h("a", {
          on: {
            click: () => {
              this.OpenDetailModal(params.row);
            }
          }
        }, params.row.ReturnLogisticsCode)

      }
    }, {
      title: "物流渠道",
      key: "ShippingMethodName"
    }, {
      title: "订单数量",
      key: "ShipOrderCount",
    }, {
      title: "状态",
      key: "Status",
      render: (h, params) => {
        return h("span", this.$Enums.Warehouse.LogisticsReturnOrderStaus[params.row.Status]);
      }
    }, {
      title: "创建时间", key: "CreateTime", width: 160,
      render: (h, params) => {
        return h("p", this.$UI.Render.Date(params.row.CreateTime, true));
      }
    }, {
      title: "更新时间", key: "UpdateTime",width: 160,
      render: (h, params) => {
        return h("p", this.$UI.Render.Date(params.row.UpdateTime, true));
      }
    }, {
      title: "客服处理状态",
      key: "ProcessingStatus",
      render: (h, params) => {
        return h("span", this.$Enums.Warehouse.LogisticsReturnOrderServiceStaus[params.row.ProcessingStatus]);
      }
    }, {
      title: "操作",
      width: 100,
      render: (h, params) => {
        return h("Dropdown", {
          on: {
            "on-click": (Name: any) => {
              this.OperateGroup(Name, params.row._index)
            }
          }
        }, [
          h("a", [
            h("span", {class: "P-MR-5"}, "操作"),
            h("Icon", {props: {type: "ios-arrow-down"}})
          ]),
          h("DropdownMenu", {slot: "list"}, this.DropOperate.map((Item: PInterface.KV): string => {
            return h("DropdownItem", {
              props: {
                name: Item.Value
              },
              class: "P-TA-C",
              style: {
                display: this.ShowOperateBtn(params.row.Status, (Item.Value as string))
              }
            }, Item.Key);
          }))
        ])
      }
    }];

    private DropShippingMethod: PInterface.IdName[] = [];
    private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.LogisticsReturnOrderStaus);
    private DropProcessingStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.LogisticsReturnOrderServiceStaus);
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.LogisticsReturnOrderKeyType);
    private DropOperate: PInterface.KV[] = []; // 操作项

    private Powers: PInterface.Power = {} // 权限
    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  }
</script>
<style lang="less"></style>