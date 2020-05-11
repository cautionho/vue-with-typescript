<!-- 库存流水 -->
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
              <Select v-model="SearchForm.WarehouseId" class="P-W-200" placeholder="筛选仓库" :options="DropWarehouse" />
                <Select v-model="SearchForm.LogType" class="P-W-200 P-ML-10" placeholder="筛选类型" :options="DropLogType" />
                <!-- <Select v-model="SearchForm.WarehouseId" @on-change="OnClearSelect('WarehouseId')" filterable clearable class="P-W-200" placeholder="筛选仓库">
                  <Option v-for="(Item,Index) in DropWarehouse" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
                </Select>
                <Select v-model="SearchForm.LogType" @on-change="OnClearSelect('LogType')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选类型">
                  <Option v-for="(Item,Index) in DropLogType" :value="$Enums.Warehouse.InventoryLogType[Item]" :key="Index">{{ Item }}</Option>
                </Select> -->
                <span class="P-ML-10 P-Inline-Block">操作时间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
              <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropSearchKeyType" />
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in DropSearchKeyType" :value="$Enums.Warehouse.InventoryLogKeyType[Item]" :key="Index">{{Item}}</Option>
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
            <!-- 放大图片 -->
            <ShowBigPic ref="ShowBigPic"/>
            <!-- 导出数据 -->
            <Button v-if="Powers.ExportInitInventoryLog" @click="ExportInventoryLogData" type="primary" class="P-MB-10">导出数据</Button>
          </Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
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
    name: "InventoryLog",
    components: {
      ShowBigPic: () => import("@/components/Public/ShowBigPic.vue")
    }
  })

  export default class InventoryLog extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$UI.Loading.Show();

      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["ExportInitInventoryLog"]))

      this.$set(this, "DropWarehouse", await this.GetDropList<object, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, {IsEnable: true, Type: [1, 2, 3, 4, 5]}));

      this.ResetList();
    }

    private GetDropList<T, R>(Server: string, Api: string, Data: T): Promise<R> {
      return new Promise(resovle => {
        this.$Request.Post({
          Server: Server,
          Api: {
            Address: Api,
            Login: false
          },
          Data: Data,
          Callback: (Res: PInterface.Res): void => {
            if (!Res.IsSuccess) {
              this.$Request.Error(Res);
            }
            resovle(Res.Data.DropList || []);
          }
        })
      })
    }

    private ResetList(): void {
      this.AccurateSearch = false;
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.InventoryLogSearchGroup());
      this.$set(this.SearchForm, "StartTime", new Date(new Date(new Date().toLocaleDateString()).setTime(new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 6)));
      this.$set(this.SearchForm, "EndTime", new Date(new Date(new Date().toLocaleDateString()).getTime() + (24 * 3600 * 1000 - 1)));
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.InventoryLogGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            SearchKey: this.SearchForm.SearchKey,
            SearchKeyType: Number(this.SearchForm.SearchKeyType),
            LogType: Number(this.SearchForm.LogType),
            WarehouseId: Number(this.SearchForm.WarehouseId),
            StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : "",
            EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
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

    private SearchList(): void {
      this.Pager.PageIndex = 1;
      this.GetTableList();
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

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private ExportInventoryLogData(): void {
      let PostData: Interface.InventoryLogSearchGroup = JSON.parse(JSON.stringify(this.SearchForm));
      PostData.SearchKeyType = Number(PostData.SearchKeyType);
      PostData.LogType = Number(PostData.LogType);
      PostData.WarehouseId = Number(PostData.WarehouseId);
      PostData.StartTime = PostData.StartTime ? this.$UI.Render.NewDate(PostData.StartTime, true) : "";
      PostData.EndTime = PostData.EndTime ? this.$UI.Render.NewDate(PostData.EndTime, true) : "";

      if (!PostData.LogType) {
        this.$UI.Tips.Floating("warning", "请先选择类型再进行导出");
        return;
      }
      if (PostData.StartTime && PostData.EndTime) {
        let StartTime = Date.parse(this.$UI.Render.NewDate(PostData.StartTime, true));
        let EndTime = Date.parse(this.$UI.Render.NewDate(PostData.EndTime, true));
        if (StartTime > EndTime) {
          this.$UI.Tips.Floating("warning", "开始时间不能晚于结束时间")
          return
        }
        if ((EndTime - StartTime) / 86400000 > 31) {
          this.$UI.Tips.Floating("warning", "时间段不能超过31天");
          return;
        }
      } else if (PostData.StartTime == "" || PostData.EndTime == "") {
        this.$UI.Tips.Floating("warning", "开始时间和结束时间必须同时填写");
        return
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Report,
        Api: {
          Address: this.$Api.ExportReportRecordAdd,
          Login: true
        },
        Data: new Interface.ExportReportRecord(22, JSON.stringify(PostData)),
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$Modal.success({
              title: "操作成功",
              content: "创建导出库存流水任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。"
            })
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    // 打开大图
    private ShowPic(Url: string): void {
      (this as any).$refs.ShowBigPic.Trigger(Url)
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.InventoryLogSearchGroup = new Interface.InventoryLogSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.InventoryLogTable[] = [];
    private TableSelected: Interface.InventoryLogTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [
      {
        title: "图片", key: "Image", width: 80, align: "center", render: (h, params) => {
          return h("div", {
            style: {
              width: "45px",
              height: "45px",
              background: "url(" + this.$Server.File + "/" + params.row.DefaultImage + ") no-repeat",
              backgroundSize: "cover",
              margin: "0 auto",
              cursor: "pointer"
            },
            on: {
              click: () => {
                this.ShowPic(params.row.DefaultImage)
              }
            }
          })
        }
      },
      {
        title: "SKU编号/产品名", key: "", render: (h, params) => {
          return h("div", [
            h("p", params.row.SkuCode),
            h("Tooltip", {
              props: {
                "content": params.row.SkuName,
                "maxWidth": 400
              },
              class: "P-LINE-1 P-W-100-Percent"
            }, params.row.SkuName)
          ])
        }
      }, {
        title: "仓库",
        key: "WarehouseName",
        width: 170
      }, {
        title: "货架号",
        key: "LocationCode"
      }, {
        title: "可用库存",
        width: 100,
        render: (h, params) => {
          return h("div", [
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "新"),
              h("span", params.row.NewQuantity)
            ]),
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "旧"),
              h("span", params.row.OldQuantity)
            ])
          ])
        }
      }, {
        title: "在途库存",
        width: 100,
        render: (h, params) => {
          return h("div", [
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "新"),
              h("span", params.row.NewPurchasingQuantity)
            ]),
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "旧"),
              h("span", params.row.OldPurchasingQuantity)
            ])
          ])
        }
      }, {
        title: "调拨中库存",
        width: 100,
        render: (h, params) => {
          return h("div", [
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "新"),
              h("span", params.row.NewShippingQuantity)
            ]),
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "旧"),
              h("span", params.row.OldShippingQuantity)
            ])
          ])
        }
      }, {
        title: "待拣货库存",
        width: 100,
        render: (h, params) => {
          return h("div", [
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "新"),
              h("span", params.row.NewWaitPickQuantity)
            ]),
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "旧"),
              h("span", params.row.OldWaitPickQuantity)
            ])
          ])
        }
      }, {
        title: "等待发货库存",
        width: 110,
        render: (h, params) => {
          return h("div", [
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "新"),
              h("span", params.row.NewWaitShipedQuantity)
            ]),
            h("p", [
              h("span", {class: "P-Table-Tip P-BG-Primary"}, "旧"),
              h("span", params.row.OldWaitShipedQuantity)
            ])
          ])
        }
      }, {
        title: "操作人",
        key: "Operator",
      }, {
        title: "相关单据",
        key: "OrderCode"
      }, {
        title: "类型",
        key: "LogType",
        width: 100,
      }, {
        title: "时间", width: 160,
        render: (h, params) => {
          return h("span", this.$UI.Render.Date(params.row.OperateTime, true));
        }
      }];

    private DropWarehouse: PInterface.KV[] = [];// 仓库下拉
    private DropLogType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.InventoryLogType);// 类型下拉
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.InventoryLogKeyType);  //关键字下拉

    private Powers: PInterface.Power = {} // 权限
  }
</script>
<style lang="less"></style>