<!-- 拣货批次 -->
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
              <Select v-model="SearchForm.Status" class="P-W-200" placeholder="筛选状态" :options="StatusDrop" />
              <Select v-model="SearchForm.LabelSize" class="P-W-200 P-ML-10" placeholder="筛选面单" :options="LabelSizeDrop" />
                <!-- <Select v-model="SearchForm.Status" @on-change="OnClearSelect('Status')" filterable clearable class="P-W-200" placeholder="筛选状态">
                  <Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.PinckingBatchStatusType[Item]" :key="Index">{{ Item }}</Option>
                </Select>
                <Select v-model="SearchForm.LabelSize" @on-change="OnClearSelect('LabelSize')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选面单">
                  <Option v-for="(Item,Index) in LabelSizeDrop" :value="$Enums.Warehouse.PinckingBatchLabelSize[Item]" :key="Index">{{ Item }}</Option>
                </Select> -->
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
              <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.PinckingBatchKeyType[Item]" :key="Index">{{Item}}</Option>
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
            <BatcheDetail ref="BatcheDetail"></BatcheDetail>
            <!-- 打印拣货批次||打印箱号 -->
            <PrintBatche ref="PrintBatche"
                         @emit-change="EmitChange"
                         class="P-MR-10 P-MB-10"
            ></PrintBatche>
            <!-- 完成批次 -->
            <DoneBatche ref="DoneBatche"
                        v-if="Powers.FinishBatch"
                        @emit-change="EmitChange"
                        class="P-MR-10 P-MB-10"
            ></DoneBatche>
            <!-- 打印批次SKU标签 -->
            <PrintBatchSkuTag class="P-MR-10 P-MB-10"></PrintBatchSkuTag>
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
    name: "PickBatch",
    components: {
      BatcheDetail: () => import("@/components/Warehouse/OrderWork/PickBatchDetail.vue"),
      PrintBatche: () => import("@/components/Warehouse/OrderWork/PickBatchPrint.vue"),
      DoneBatche: () => import("@/components/Warehouse/OrderWork/DoneBatche.vue"),
      PrintBatchSkuTag: () => import("@/components/Warehouse/OrderWork/PrintBatchSkuTag.vue"),
    }
  })

  export default class PickBatch extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private GetPoints(): void {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["FinishBatch"]));

      this.Powers.FinishBatch ? this.OperateDrop.push({Key: "完成批次", Value: 2}) : null;

      this.GetTableList();
    }

    private ResetList(): void {
      this.AccurateSearch = false;
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.PickBatchSearchgroup());
      this.GetTableList();
    }

    private SearchList(): void {
      this.Pager.PageIndex = 1;
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.TableCancelSelected();
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.BatchOrderGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            SearchKey: this.SearchForm.SearchKey,
            SearchKeyType: Number(this.SearchForm.SearchKeyType),
            LabelSize: Number(this.SearchForm.LabelSize),
            Status: Number(this.SearchForm.Status)
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

    private CalculateTbHeight(): number {
      let H = window.innerHeight - 155;
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

    private TableGetSelected(Data: Interface.BlacklistTable[]): void {
      this.$set(this, "TableSelected", Data)
    }

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
    }

    private EmitChange(Res: boolean, Type?: string) {
      switch (Type) {
        case "BatchPrint":
        case "BoxPrint":
          (this.$refs["PrintBatche"] as any).$Trigger({
            IsShowModal: true,
            ModalType: Type,
            SelectedData: this.TableSelected
          });
          break;
      }

      if (Res) {
        this.GetTableList();
      }
    }

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private OperateGroup(Type: number, Index: number): void {
      this.TableCancelSelected();
      this.$set(this, "TableSelected", JSON.parse(JSON.stringify([this.TableList[Index]])));
      switch (Type) {
        case 1:
          (this.$refs["BatcheDetail"] as Vue).$Trigger({
            IsShowModal: true,
            SelectedDetail: this.TableSelected[0]
          });
          break;
        case 2:
          (this.$refs["DoneBatche"] as Vue).$Trigger({
            SelectedData: this.TableSelected
          });
          break;
      }
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.PickBatchSearchgroup = new Interface.PickBatchSearchgroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.PickBatchTable[] = [];
    private TableSelected: Interface.PickBatchTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "批次号",
      key: "BatchCode",
      render: (h: any, params: any): any => {
        return h("a", {
          on: {
            click: () => {
              this.OperateGroup(1, params.row._index);
            }
          }
        }, params.row.BatchCode);
      }
    }, {
      title: "未拣订单数",
      key: "OrderCount"
    }, {
      title: "面单尺寸",
      key: "LabelSize",
      render: (h, params): any => {
        return h("span", params.row.LabelSize ? ("10 * " + params.row.LabelSize) : "暂无")
      }
    }, {
      title: "创建人/打印人",
      width: 135,
      render: (h, params) => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "创"),
            h("span", params.row.CreateUser)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "印"),
            h("span", params.row.Printer ? params.row.Printer : "-")
          ])
        ])
      }
    }, {
      title: "状态",
      width: 90,
      render: (h: any, params: any): string => {
        return h("span", this.$Enums.Warehouse.PinckingBatchStatusType[params.row.Status]);
      }
    }, {
      title: "生成时间", width: 160,
      render: (h, params): any => {
        return h("span", this.$UI.Render.Date(params.row.CreateTime, true))
      }
    }, {
      title: "操作",
      width: 100,
      render: (h: any, params: any): string => {
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
          h("DropdownMenu", {slot: "list"}, this.OperateDrop.map((Item: PInterface.KV): string => {
            return h("DropdownItem", {
              props: {
                name: Item.Value
              },
              class: "P-TA-C",
              style: {
                display: Item.Value == 2 && params.row.Status == 4 ? "none" : "block",
                textAlign: 'center'
              },
            }, Item.Key);
          }))
        ])
      }
    }];

    private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.PinckingBatchStatusType) // 状态
    private LabelSizeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.PinckingBatchLabelSize) // 面单下拉
    private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.PinckingBatchKeyType)  //关键字下拉
    private OperateDrop: PInterface.KV[] = [{Key: "查看", Value: 1}] // 下拉操作项
    private Powers: PInterface.Power = {} // 权限
  }
</script>
<style lang="less"></style>