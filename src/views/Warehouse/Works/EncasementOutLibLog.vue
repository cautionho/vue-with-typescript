<!-- 装箱出库记录 -->
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
                <span class="P-ML-10 P-Inline-Block">装箱时间：</span>
                <DatePicker class="P-W-200 P-MR-10" v-model="SearchForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-MR-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-MR-10" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
                <Select v-model="SearchForm.ShippingMethodId" class="P-W-200" placeholder="筛选物流渠道" :options="DropShippingMethod" optionValKey="Id" optionKey="Name" />
                <Select v-model="SearchForm.FirstShippingMethodType" class="P-W-200 P-ML-10" placeholder="筛选头程发货渠道" :options="DropFirstShippingMethodType" />
                <!-- <Select v-model="SearchForm.ShippingMethodId" @on-change="OnClearSelect('ShippingMethodId')" filterable clearable class="P-W-200" placeholder="筛选物流渠道">
                  <Option v-for="(Item,Index) in DropShippingMethod" :value="Item.Id" :key="Item.Name">{{ Item.Name }}</Option>
                </Select> -->
                <!-- <Select v-model="SearchForm.FirstShippingMethodType" @on-change="OnClearSelect('FirstShippingMethodType')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选头程发货渠道">
                  <Option v-for="(Item,Index) in DropFirstShippingMethodType" :value="$Enums.Warehouse.FirstShippingMethodType[Item]" :key="Index">{{ Item }}</Option>
                </Select> -->
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
              <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropSearchKeyType" />
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in DropSearchKeyType" :value="$Enums.Warehouse.EncasementOutLibLogKeyType[Item]" :key="Index">{{Item}}</Option>
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
            <!-- 打印箱唛 -->
            <Button @click="PrintBox" type="primary" class="P-MB-10 P-MR-10">打印箱唛</Button>
            <Button @click="ExportData" type="primary" class="P-MB-10 P-MR-10" v-if="Powers.OutLogPrintData">导出数据</Button>
            <OutLibLogChangeWeight v-if="Powers.BatchChangeWeight" ref="OutLibLogChangeWeight"
                                   :PropSelected="TableSelected"
                                   @emit-change="EmitChange"
                                   class="P-MB-10 P-MR-10"></OutLibLogChangeWeight>
            <OutLibLogFirstShipping v-if="Powers.FirstShippingCode" ref="OutLibLogFirstShipping"
                                    :PropSelected="TableSelected"
                                    @emit-change="EmitChange"
                                    class="P-MB-10 P-MR-10"></OutLibLogFirstShipping>
            <OutLibLogDetail ref="OutLibLogDetail" @emit-change="EmitChange"></OutLibLogDetail>
            <h3>
              <span>已选择：{{TableSelected.length}}；</span>
              <span>装箱数：{{EncasementCount}}</span>
            </h3>
          </Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" @on-selection-change="TableGetSelected" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
        </Col>
        <Col :span="24">
          <Page ref="Pager" @on-change="SetChangePageTable" @on-page-size-change="SetChangePageSizeTable" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer
                show-elevator
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
  import GetLodop from "@/assets/LODOP/LodopFuncs";

  @Component({
    name: "EncasementOutLibLog",
    components: {
      OutLibLogChangeWeight: () => import("@/components/Warehouse/OrderWork/OutLibLogChangeWeight.vue"),
      OutLibLogFirstShipping: () => import("@/components/Warehouse/OrderWork/OutLibLogFirstShipping.vue"),
      OutLibLogDetail: () => import("@/components/Warehouse/OrderWork/OutLibLogDetail.vue"),
    }
  })

  export default class EncasementOutLibLog extends Vue {
    private mounted() {
      this.GetPoints();
    }

    get EncasementCount(): number {
      return this.TableSelected.reduce((Pre, Cur) => {
        return Pre + Cur.TotalBoxCapacity
      }, 0)
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["OutLogPrintData", "BatchChangeWeight", "FirstShippingCode"]));

      this.$set(this, "DropShippingMethod", await this.GetDropList<number, PInterface.KV>(this.$Server.Logistics, this.$Api.ChannelDropList, 0));

      this.GetTableList();
    }

    private EmitChange(Res: boolean) {
      if (Res) {
        this.TableCancelSelected();
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
            if (Res.IsSuccess) {
              resolve(Res.Data.DropList)
            } else {
              this.$Request.Error(Res);
            }
          }
        })
      })
    }

    private ResetList(): void {
      this.AccurateSearch = false;
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.OutLibLogSearchGroup());
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
          Address: this.$Api.BoxGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : "",
            EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
            FirstShippingMethodType: this.SearchForm.FirstShippingMethodType,
            SearchKey: this.SearchForm.SearchKey,
            SearchKeyType: this.SearchForm.SearchKeyType,
            ShippingMethodId: this.SearchForm.ShippingMethodId
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
      let H = window.innerHeight - 150;
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

    private TableGetSelected(Data: Interface.OutLibLogTable[]): void {
      this.$set(this, "TableSelected", Data)
    }

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
    }

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private OperateGroup(Data: Interface.OutLibLogTable, Type: string) {
      switch (Type) {
        case "Look":
          this.TableCancelSelected();
          (this.$refs["OutLibLogDetail"] as any).OpenModal({
            BoxCode:Data.BoxCode,
            Id: Data.BoxId
          })
          break;
      }
    }

    private PrintBox(): void {
      if (this.TableSelected.length === 0) {
        this.$UI.Tips.Floating("warning", "请先选择出库记录再进行操作");
        return;
      }
      if (this.TableSelected.some((Item) => Item.ShippingMethodId !== this.TableSelected[0].ShippingMethodId)) {
        this.$UI.Tips.Floating("warning", "请选择同一渠道进行打印");
        return;
      }
      if (this.TableSelected.some((Item) => !Item.GrossWeight)) {
        this.$UI.Tips.Floating("warning", "存在毛重未录入的批次号，请先录入毛重后再进行操作")
        return;
      }
      for (let Item of this.TableSelected) {
        const LODOP = GetLodop();
        LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "");
        LODOP.SET_PRINT_PAGESIZE(0, "100mm", "100mm", "打印箱唛");
        LODOP.ADD_PRINT_RECT("0mm", "0mm", "100.01mm", "100.01mm", 0, 1);
        LODOP.ADD_PRINT_TEXT("4.5mm", "0.53mm", "98.95mm", "11.38mm", Item.ShippingMethodName);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_LINE("14.29mm", "0.79mm", "14.58mm", "99.48mm", 0, 1);
        LODOP.ADD_PRINT_BARCODE("18.26mm", "2.38mm", "95.25mm", "19.84mm", "128Auto", Item.BoxCode);
        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
        LODOP.ADD_PRINT_TEXT("39.69mm", "0.53mm", "99.48mm", "6.88mm", Item.BoxCode);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_LINE("48.68mm", "1.59mm", "48.39mm", "98.98mm", 0, 1);
        LODOP.ADD_PRINT_TEXT("54.5mm", "0.79mm", "98.95mm", "7.14mm", "重量：" + Item.GrossWeight + "/kg");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("72.23mm", "1.85mm", "97.37mm", "8.2mm", "件数： " + Item.TotalBoxCapacity + "pc");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_LINE("65.09mm", "1.32mm", "64.8mm", "99.51mm", 0, 1);
        LODOP.ADD_PRINT_TEXT("89.43mm", "1.06mm", "95.51mm", "7.94mm", Item.CreateTime ? Item.CreateTime.replace("T", " ") : "-");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_LINE("83.61mm", "1.32mm", "83.9mm", "98.13mm", 0, 1);
        LODOP.PRINT()
      }
      this.$UI.Tips.Floating("success", "打印箱唛成功");
      this.TableCancelSelected();
    }

    private ExportData(): void {
      if (this.TableSelected.length === 0) {
        this.$UI.Tips.Floating("warning", "请先选择出库记录再进行操作");
        return
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.BoxExport,
          Login: true
        },
        Data: this.TableSelected.map((Item) => Item.BoxCode),
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$Modal.success({
              title: "操作成功",
              content: "创建导出退件订单成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据;"
            })
            this.TableCancelSelected();
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }


    private AccurateSearch: boolean = false;
    private SearchForm: Interface.OutLibLogSearchGroup = new Interface.OutLibLogSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.OutLibLogTable[] = [];
    private TableSelected: Interface.OutLibLogTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "装箱批次号",
      key: "BoxCode"
    }, {
      title: "物流渠道",
      key: "ShippingMethodName"
    }, {
      title: "装箱数量",
      key: "TotalBoxCapacity",
      width: 100,
    }, {
      title: "净重(Kg.)",
      key: "TotalWeight",
      width: 130,
    }, {
      title: "毛重(Kg.)",
      key: "GrossWeight",
      width: 130,
    }, {
      title: "装箱人",
      key: "BoxOperator",
      width: 100,
    }, {
      title: "装箱时间", key: "CreateTime", width: 160,
      render: (h, params): any => {
        return h("span", params.row.CreateTime ? this.$UI.Render.Date(params.row.CreateTime, true) : "-")
      }
    }, {
      title: "头程发货渠道",
      key: "",
      width: 130,
      render: (h, params) => {
        return h("span", this.$Enums.Warehouse.FirstShippingMethodType[params.row.FirstShippingMethodType]);
      }
    }, {
      title: "头程发运单号",
      key: "FirstShipOrderCode",
      width: 130
    }, {
      title: "最后操作时间", key: "OperateTime", width: 160,
      render: (h, params): any => {
        return h("span", params.row.OperateTime ? this.$UI.Render.Date(params.row.OperateTime, true) : "-")
      }
    }, {
      title: "操作",
      width: 140,
      render: (h: any, params: any): string => {
        return h("div", [
          h("Button", {
            props: {
              size: "small",
              type: "primary"
            },
            on: {
              click: () => {
                this.OperateGroup(params.row, "Look");
              }
            }
          }, "查看")]
        )
      }
    }];

    private DropShippingMethod: PInterface.IdName[] = [];
    private DropFirstShippingMethodType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.FirstShippingMethodType);
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.EncasementOutLibLogKeyType);

    private Powers: PInterface.Power = {} // 权限
  }
</script>
<style lang="less" scoped>
  .OperateBtnGroup > * {
    vertical-align: top !important;
  }
</style>