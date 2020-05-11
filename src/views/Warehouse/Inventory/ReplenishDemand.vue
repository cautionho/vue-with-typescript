<!-- 补货需求 -->
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
                <Select v-model="SearchForm.tWarehouseId" class="P-W-200" placeholder="筛选仓库" :options="TWarehouseIdDrop"/>
                <Select v-model="SearchForm.sWarehouseId" class="P-W-200 P-ML-10" placeholder="筛选备货仓" :options="SWarehouseIdDrop"/>
                <Select v-model="SearchForm.srStatus" class="P-W-200 P-ML-10" placeholder="筛选状态" :options="StatusDrop"/>
                <!-- <Select v-model="SearchForm.tWarehouseId" @on-change="OnClearSelect('tWarehouseId')" filterable clearable class="P-W-200" placeholder="筛选仓库">
                  <Option v-for="(Item,Index) in TWarehouseIdDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
                </Select>
                <Select v-model="SearchForm.sWarehouseId" @on-change="OnClearSelect('sWarehouseId')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选备货仓">
                  <Option v-for="(Item,Index) in SWarehouseIdDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
                </Select>
                <Select v-model="SearchForm.srStatus" @on-change="OnClearSelect('srStatus')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选状态">
                  <Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Warehouse.ReplenishDemandStatus[Item]" :key="Index">{{ Item }}</Option>
                </Select> -->
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
                <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="SearchKeyTypeDrop"/>
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.ReplenishDemandKeyType[Item]" :key="Index">{{Item}}</Option>
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
            <!-- 添加补货需求 -->
            <ModifyReplenishDemand ref="AddReplenishDemand"
                                   :PropWarehouseDrop="TWarehouseIdDrop"
                                   @emit-change="EmitChange"
                                   v-if="Powers.ReplenishCreate"></ModifyReplenishDemand>
            <!-- 打印补货需求 -->
            <Button @click="PrintReplenish" v-if="Powers.ReplenishPrint" class="P-Inline-Block P-MR-10 P-MB-10" type="primary">打印补货需求</Button>
            <!-- 取消 -->
            <Button @click="PostCancel(true)" v-if="Powers.ReplenishCancel" class="P-Inline-Block P-MR-10 P-MB-10" type="primary">取消</Button>
            <!-- 入库||扫描入库 -->
            <ScanPutStorage ref="ScanPutStorage"
                            @emit-change="EmitChange"
                            v-if="Powers.ArrivalOrderInStorage"
            ></ScanPutStorage>
            <!-- 查看 -->
            <Detail ref="Detail"></Detail>
            <!-- SKU详情 -->
            <SkuDetail ref="SkuDetail" />
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
    name: "ReplenishDemand",
    components: {
      ModifyReplenishDemand: () => import("@/components/Warehouse/Inventory/ReplenishDemandModify.vue"),
      ScanPutStorage: () => import("@/components/Warehouse/Inventory/ScanPutStorage.vue"),
      Detail: () => import("@/components/Warehouse/Inventory/ReplenishDemandDetail.vue"),
      SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue')
    }
  })

  export default class ReplenishDemand extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$UI.Loading.Show();

      this.$set(this, "TWarehouseIdDrop", await this.GetDropList<object, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, {IsEnable: true, Type: [1]}));
      this.$set(this, "SWarehouseIdDrop", await this.GetDropList<object, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, {IsEnable: true, Type: [5]}))

      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["ReplenishCreate", "ReplenishModify", "ReplenishCancel", "ArrivalOrderInStorage", "ReplenishPrint"]));
      this.Powers.ReplenishModify ? this.OperateDrop.push({Key: "编辑", Value: "Modify"}) : null;
      this.Powers.ReplenishCancel ? this.OperateDrop.push({Key: "取消", Value: "Cancel"}) : null;
      this.Powers.ArrivalOrderInStorage ? this.OperateDrop.push({Key: "入库", Value: "InStorage"}) : null;

      this.GetTableList();
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
      this.AccurateSearch = false;
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.ReplenishDemandSearchGroup());
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.TableCancelSelected();
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.SkuReplenishList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            tWarehouseId: Number(this.SearchForm.tWarehouseId),
            sWarehouseId: Number(this.SearchForm.sWarehouseId),
            SearchKeyType: Number(this.SearchForm.SearchKeyType),
            srStatus: this.SearchForm.srStatus === "" ? "" : Number(this.SearchForm.srStatus),
            SearchKey: this.SearchForm.SearchKey
          }
        },
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.Pager.TotalItems = res.Data.PageModel.TotalItems;
            this.$set(this, "TableList", res.Data.PageModel.Items);
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

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
    }

    private TableGetSelected(Data: Interface.ReplenishDemandTable[]): void {
      this.$set(this, "TableSelected", Data)
    }

    private EmitChange(Res: boolean, Type?: string) {
      if (Res) {
        this.GetTableList();
      }
    }

    private PrintReplenish(): void {
      if (this.TableSelected.length == 0) {
        this.$UI.Tips.Floating("warning", `请选择补货需求进行打印操作`);
        return;
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.SkuReplenishPrint,
          Login: true
        },
        Data: this.TableSelected.map((Item) => Item.ReplenishId),
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.PlayPrintReplenish(res.Data.Data);
          } else {
            this.$Request.Error(res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private PlayPrintReplenish(List: Interface.ReplenishDemandPrintDetail[]): void {
      const LODOP: any = GetLodop();
      LODOP.PRINT_INITA("0mm", "0mm", "60mm", "40mm", "");
      LODOP.SET_PRINT_PAGESIZE(0, "60mm", "40mm", "补货需求");
      LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
      for (let Item of List) {
        LODOP.NewPage();
        LODOP.ADD_PRINT_BARCODE("4.26mm", "10%", "80%", "11.83mm", "128Auto", Item.ReplenishCode);
        LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
        LODOP.ADD_PRINT_TEXT("17.97mm", "8.1mm", "43.76mm", "7.09mm", Item.ReplenishCode);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(92, 7, 144, 25, Item.SkuCode);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(92, 131, 90, 25, "数量：" + Item.Num);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 3);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(119, 7, 150, 25, Item.Location);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      }
      LODOP.PRINT();

      this.$UI.Tips.Floating("success", "打印补货需求条码成功");
      this.GetTableList();
    }

    private PostCancel(IsBatch: boolean): void {
      if (this.TableSelected.length == 0) {
        this.$UI.Tips.Floating("warning", "请选择状态为待出库的补货单进行取消操作");
        return;
      }
      if (this.TableSelected.some((Item) => Item.srStatus != 1)) {
        this.$UI.Tips.Floating("warning", "请选择状态为待出库的补货单进行操作");
        return;
      }

      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否对选中的补货单进行取消操作",
        Enter: false,
        Callback: (bool: boolean): void => {
          if (bool) {
            this.$UI.Loading.Show();
            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.SkuReplenishCancel,
                Login: true
              },
              Data: this.TableSelected.map((Item) => Item.ReplenishId),
              Callback: (res: PInterface.Res): void => {
                if (res.IsSuccess) {
                  this.$UI.Tips.Floating("success", IsBatch ? "批量取消补货单成功" : "取消补货单成功");
                  this.GetTableList();
                } else {
                  this.$Request.Error(res);
                }
                this.$UI.Loading.Hide();
              }
            })
          }
        }
      })
    }

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private OperateGroup(Type: string, Index: number): void {
      this.TableCancelSelected();
      this.$set(this, "TableSelected", JSON.parse(JSON.stringify([this.TableList[Index]])));
      switch (Type) {
        case "Modify":
          (this.$refs["AddReplenishDemand"] as Vue).$Trigger({
            IsModify: true,
            SelectedDetail: this.TableSelected[0]
          });
          break;
        case "Cancel":
          this.PostCancel(false);
          break;
        case "InStorage":
          (this.$refs["ScanPutStorage"] as Vue).$Trigger({
            SelectedDetail: this.TableSelected[0]
          });
        case "Look":
          (this.$refs["Detail"] as Vue).$Trigger({
            ReplenishId: this.TableSelected[0].ReplenishId
          });
          break;
      }
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.ReplenishDemandSearchGroup = new Interface.ReplenishDemandSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.ReplenishDemandTable[] = [];
    private TableSelected: Interface.ReplenishDemandTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "编号",
      key: "ReplenishCode",
      width: 140,
      render: (h: any, params: any): any => {
        return h("a", {
          on: {
            click: () => {
              (this.$refs["Detail"] as Vue).$Trigger({
                ReplenishId: params.row.ReplenishId
              });
            }
          }
        }, params.row.ReplenishCode);
      }
    }, {
      title: "SKU编号",
      key: "SkuCode",
      width: 140,
      render: (h: any, params: any): any => {
        return h("a", {
          on: {
            click: () => {
              (this.$refs["SkuDetail"] as Vue).Trigger((params.row as any).SkuCode);
            }
          }
        }, params.row.SkuCode);
      }
    }, {
      title: "产品名",
      key: "SkuCode",
      render: (h: any, params: any): any => {
        return h("Tooltip", {
          props: {
            "content": params.row.SkuName
          },
          class: "P-W-100-Percent P-LINE-1"
        }, params.row.SkuName);
      }
    }, {
      title: "创建人",
      key: "Creator",
      width: 110
    }, {
      title: "数量",
      key: "Num",
      width: 75
    }, {
      title: "目标仓",
      key: "tWarehouseName"
    }, {
      title: "来源仓",
      key: "sWarehouseName"
    }, {
      title: "备注",
      key: "SkuCode",
      render: (h: any, params: any): any => {
        return params.row.Remark ? h("Tooltip", {
          props: {
            "content": params.row.Remark
          },
          class: "P-W-100-Percent P-LINE-1"
        }, params.row.Remark) : h("span", "-");
      }
    }, {
      title: "状态",
      width: 80,
      render: (h, params) => {
        return h("span", this.$Enums.Warehouse.ReplenishDemandStatus[params.row.srStatus]);
      }
    }, {
      title: "创建时间", width: 160,
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
          h("DropdownMenu", {slot: "list"}, this.OperateDrop.map((Item: PInterface.KV): string => {
            return h("DropdownItem", {
              props: {
                name: Item.Value
              },
              class: "P-TA-C",
              style: {
                display: ((Type) => {
                  let display = "";
                  switch (Type) {
                    case "Look":
                      display = "block";
                      break;
                    case "Modify":
                      display = params.row.srStatus == 0 ? "block" : "none";
                      break;
                    case "Cancel":
                      display = params.row.srStatus == 1 ? "block" : "none";
                      break;
                    case "InStorage":
                      display = params.row.srStatus == 2 ? "block" : "none";
                      break;
                  }
                  return display;
                })(Item.Value)
              },
            }, Item.Key);
          }))
        ])
      }
    }];

    private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ReplenishDemandStatus);
    private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ReplenishDemandKeyType);
    private SWarehouseIdDrop: PInterface.KV[] = [];
    private TWarehouseIdDrop: PInterface.KV[] = [];

    private OperateDrop: PInterface.KV[] = [{Key: "查看", Value: "Look"}] // 下拉操作项
    private Powers: PInterface.Power = {} // 权限
  }
</script>
<style lang="less"></style>