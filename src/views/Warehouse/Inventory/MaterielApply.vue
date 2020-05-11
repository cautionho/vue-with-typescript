<!-- 物料申请 -->
<template>
  <Row>
    <Col span="24">
      <Row class="P-Search-Group">
        <Col :span="24">
          <Form ref="SearchForm" :model="SearchForm" onsubmit="return false" inline>
            <Dropdown trigger="custom" :visible="AccurateSearch">
              <Button type="primary" @click="TriggerSearch">
                精准搜索
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <Col span="24" slot="list" class="P-P-10">
              <Select v-model="SearchForm.WareHouseId" class="P-W-200" placeholder="筛选仓库" :options="DropWarehouse" />
              <Select v-model="SearchForm.Status" class="P-W-200 P-ML-10" placeholder="筛选状态" :options="DropStatus" />
                <!-- <Select v-model="SearchForm.WareHouseId" @on-change="OnClearSelect('WareHouseId')" filterable clearable class="P-W-200" placeholder="筛选仓库">
                  <Option v-for="(Item, Index) in DropWarehouse" :value="Item.Value" :key="Item.Value">{{ Item.Key }}</Option>
                </Select>
                <Select v-model="SearchForm.Status" @on-change="OnClearSelect('Status')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选状态">
                  <Option v-for="(Item, Index) in DropStatus" :key="Index" :value="$Enums.Warehouse.MaterielApplyStatus[Item]">{{ Item }}</Option>
                </Select> -->
                <span class="P-ML-10 P-Inline-Block">创建时间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-10">
              <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
              <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="DropSearchKeyType" />
                <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
                  <Option v-for="(Item, Index) in DropSearchKeyType" :key="Index" :value="$Enums.Warehouse.MaterielApplyKeyType[Item]">{{ Item }}</Option>
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
            <MaterielApplyModify ref="MaterielApplyModify" :PropWarehouseDrop="DropWarehouse" @emit-change="EmitChange" class="P-MB-10 P-MR-10"></MaterielApplyModify>
            <MaterielApplyOther ref="MaterielApplyOther" :PropSelected="TableSelected" @emit-change="EmitChange" class="P-MB-10 P-MR-10"></MaterielApplyOther>
            <Button type="primary" class="P-Inline-Block P-MB-10 P-MR-10" @click="ExportApply">导出物料申请</Button>
            <MaterielApplyDetail ref="MaterielApplyDetail"></MaterielApplyDetail>
          </Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" @on-selection-change="TableGetSelected" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
        </Col>
        <Col span="24">
          <Page ref="Pager" @on-change="SetChangePageTable" @on-page-size-change="SetChangePageSizeTable" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator class="P-MT-10"/>
        </Col>
      </Row>
    </Col>
  </Row>
</template>
<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";
  import ExpandRow from "@/components/Warehouse/Inventory/MaterielApply_Expand.vue";

  @Component({
    name: "MaterielApply",
    components: {
      MaterielApplyModify: () => import("@/components/Warehouse/Inventory/MaterielApplyModify.vue"),
      MaterielApplyDetail: () => import("@/components/Warehouse/Inventory/MaterielApplyDetail.vue"),
      MaterielApplyOther: () => import("@/components/Warehouse/Inventory/MaterielApplyOther.vue"),
    }
  })

  export default class MaterielApply extends Vue {

    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, [
        "MaterialApplySave",
        "MaterialApplyAudit",
        "MaterialApplyCancel",
        "MaterialApplyExport",
        "MaterialApplySubmit",
        "ReturnModify"
      ]));
      this.$set(this, "DropWarehouse", await this.GetDropList<string, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, ""));

      this.SetOperateBtn()
    }

    private SetOperateBtn(): void {
      let Drops: PInterface.KV[] = [{Key: "查看", Value: "Look"}];
      this.Powers.MaterialApplySave ? Drops.push({Key: "编辑", Value: "Modify"}) : "";
      this.Powers.MaterialApplyAudit ? Drops.push({Key: "通过", Value: "HasPass"}, {Key: "不通过", Value: "NoPass"}) : "";
      this.Powers.MaterialApplyCancel ? Drops.push({Key: "作废", Value: "Cancellation"}) : "";
      this.Powers.MaterialApplySubmit ? Drops.push({Key: "提交审核", Value: "SubAudit"}) : "";
      this.Powers.ReturnModify ? Drops.push({Key: "退回修改", Value: "ReturnAlter"}) : "";
      this.DropOperate.push(...Drops);

      this.ResetList();
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
      this.$set(this, "SearchForm", new Interface.MaterielApplySearchGroup());
      this.GetTableList();
    }

    private EmitChange(Res: boolean, Type?: string) {
      this.TableCancelSelected();
      if (Res) {
        this.GetTableList();
      }
    }

    // 触发“搜索”按钮
    private SearchList(): void {
      this.$set(this.Pager, "PageIndex", 1);
      this.GetTableList();
    }

    private GetTableList(): void {
      let Start = this.SearchForm.StartTime,
        End = this.SearchForm.EndTime;
      if ((Start != "" && End == "") || (Start == "" && End != "")) {
        this.$UI.Tips.Floating("warning", `请选择发货时间区间`);
        return;
      }
      if (Start != "" && +new Date(Start) > +new Date()) {
        this.$UI.Tips.Floating("warning", `开始时间不得晚于当前时间`);
        return;
      }
      if (Start != "" && End != "" && (+new Date(End) - +new Date(Start) > this.MS_NUMBER)) {
        this.$UI.Tips.Floating("warning", `筛选时间段最长不超过31天`);
        return;
      }
      this.AccurateSearch = false;
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.MaterialApplyGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          SortField: "",
          SortOrder: "",
          Conditions: {
            WarehouseId: Number(this.SearchForm.WarehouseId),
            Status: Number(this.SearchForm.Status),
            StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : "",
            EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
            SearchKeyType: Number(this.SearchForm.SearchKeyType),
            SearchKey: this.SearchForm.SearchKey
          }
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
            this.TableList.push(...Res.Data.PageModel.Items);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private ExportApply(): void {
      let Start = this.SearchForm.StartTime,
        End = this.SearchForm.EndTime;
      if (End == "" || Start == "") {
        this.$UI.Tips.Floating("warning", `请先选择创建时间段再导出数据`);
        return;
      }
      if (Start != "" && +new Date(Start) > +new Date()) {
        this.$UI.Tips.Floating("warning", `开始时间不得晚于当前时间`);
        return;
      }
      if (Start != "" && End != "" && (+new Date(End) - +new Date(Start) > this.MS_NUMBER)) {
        this.$UI.Tips.Floating("warning", `筛选时间段最长不超过31天`);
        return;
      }

      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.MaterialApplyExport,
          Login: true
        },
        Data: {
          WarehouseId: Number(this.SearchForm.WarehouseId),
          Status: Number(this.SearchForm.Status),
          StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : "",
          EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
          SearchKeyType: Number(this.SearchForm.SearchKeyType),
          SearchKey: this.SearchForm.SearchKey
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.$Modal.success({
              title: "操作成功",
              content: "创建导出物料申请成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据"
            })
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private CalculateTbHeight(): number {
      let H = window.innerHeight - 175;
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

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    // 分页切换
    private SetChangePageTable(pageNum: number): void {
      this.Pager.PageIndex = pageNum;
      this.GetTableList();
    }

    private SetChangePageSizeTable(pageSize: number): void {
      this.Pager.PageSize = pageSize;
      this.GetTableList();
    }

    //获取列表复选框选中的数据
    private TableGetSelected(data: Interface.MaterielApplyTable[]): void {
      this.$set(this, "TableSelected", data)
    }

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", []);
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
        case "Modify":
          Display = Status == 1 && this.Powers.MaterialApplySave ? "block" : "none";
          break;
        case "SubAudit":
          Display = Status == 1 && this.Powers.MaterialApplySubmit ? "block" : "none";
          break;
        case "HasPass":
          Display = Status == 2 && this.Powers.MaterialApplyAudit ? "block" : "none";
          break;
        case "NoPass":
          Display = Status == 2 && this.Powers.MaterialApplyAudit ? "block" : "none";
          break;
        case "ReturnAlter":
          Display = Status == 2 && this.Powers.ReturnModify ? "block" : "none";
          break;
        case "Cancellation":
          Display = Status == 1 && this.Powers.MaterialApplyCancel ? "block" : "none";
          break;
      }
      return Display;
    }

    private OperateGroup(Type: string, Index: number): void {
      this.TableCancelSelected();
      this.$set(this, "TableSelected", JSON.parse(JSON.stringify([this.TableList[Index]])));
      switch (Type) {
        case "Look":
          this.GetTableDetail(this.TableSelected[0].Id, "Look");
          break;
        case "Modify":
          this.GetTableDetail(this.TableSelected[0].Id, "Modify");
          break;
        case "SubAudit":
        case "HasPass":
        case "NoPass":
        case "ReturnAlter":
        case "Cancellation":
          (this.$refs["MaterielApplyOther"] as Vue).$Trigger({
            ModalType: ((Type) => {
              switch (Type) {
                case "SubAudit":
                  return 1;
                case "HasPass":
                  return 2;
                case "NoPass":
                  return 3;
                case "ReturnAlter":
                  return 4;
                case "Cancellation":
                  return 5;
              }
            })(Type),
          });
          break;
      }
    }

    private GetTableDetail(Id: number, Operate: string): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.MaterialApplyGeDetail,
          Login: true
        },
        Data: Id,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            switch (Operate) {
              case "Look":
                (this.$refs["MaterielApplyDetail"] as Vue).$Trigger({
                  SelectedDetail: JSON.parse(JSON.stringify(Res.Data.Data))
                });
                break;
              case "Modify":
                (this.$refs["MaterielApplyModify"] as Vue).$Trigger({
                  SelectedDetail: JSON.parse(JSON.stringify(Res.Data.Data))
                });
                break;
            }
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.MaterielApplySearchGroup = new Interface.MaterielApplySearchGroup();

    private TableList: Interface.MaterielApplyTable[] = [];
    private TableSelected: Interface.MaterielApplyTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      type: "expand", width: 40, align: "center", render: (h: any, params: any): string => {
        return h(ExpandRow, {
          props: {
            row: params.row
          }
        })
      }
    }, {
      title: "申请编号",
      key: "MaterialApplyCode",
      render: (h, params) => {
        return h("a", {
          on: {
            click: () => {
              this.GetTableDetail(params.row.Id, "Look");
            }
          }
        }, params.row.MaterialApplyCode);
      }
    }, {
      title: "产品种类",
      key: "ProductSpeciesQuantity",
    }, {
      title: "备注",
      key: "Remark",
      render: (h, params) => {
        return h("span", params.row.Remark || "-");
      }
    }, {
      title: "状态",
      width: 100,
      render: (h, params) => {
        return h("span", this.$Enums.Warehouse.MaterielApplyStatus[params.row.Status]);
      }
    }, {
      title: "申请人",
      key: "CreatedUserName",
    }, {
      title: "创建时间", key: "CreatedTime", width: 160,
      render: (h, params) => {
        return h("p", this.$UI.Render.Date(params.row.CreateTime, true));
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

    private Powers: PInterface.Power = {} // 权限

    private DropWarehouse: PInterface.KV[] = []; // 仓库下拉
    private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.MaterielApplyStatus);
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.MaterielApplyKeyType);
    private DropOperate: PInterface.KV[] = [];

    private Pager: PInterface.Pager = new PInterface.Pager();

    private MS_NUMBER: number = 31 * 24 * 3600000;

  }
</script>
<style lang="less" scoped>
  .OperateBtnGroup>*{
    vertical-align: top;
  }
</style>