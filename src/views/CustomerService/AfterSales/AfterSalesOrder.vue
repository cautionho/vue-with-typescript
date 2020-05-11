<!-- 售后单管理 -->
<template>
  <Row>
    <Col span="24" class="P-Search-Group">
      <Form inline ref="SearchFilter" v-model="SearchFilter" onsubmit="return false;">
        <Dropdown trigger="custom" :visible="AccurateSearch">
          <Button type="primary" @click="TriggerSearch">
            精准搜索
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <Col span="24" slot="list" class="P-PT-10">
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选平台" v-model="SearchFilter.Platform" :onChange="GetStore" :options="PlatformDrop"/>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" :options="StoreDrop"/>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" v-model="SearchFilter.Status" :options="StatusDrop"/>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选处理结果" v-model="SearchFilter.ProcessType" multiple :options="ProcessTypeDrop"/>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选售后原因" v-model="SearchFilter.ReasonType" :options="ReasonDrop" optionValKey="Id" optionKey="Reason"/>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选客服" v-model="SearchFilter.CustomerId" :options="CustomerDrop"/>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选客服主管" v-model="SearchFilter.SupervisorId" :options="SupervisorDrop"/>
            <!-- <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选平台" v-model="SearchFilter.Platform" filterable clearable @on-change="GetStore">
              <Option v-for="(Item, Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选店铺" v-model="SearchFilter.StoreId" filterable clearable>
              <Option v-for="(Item, Index) in StoreDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" v-model="SearchFilter.Status" filterable clearable>
              <Option v-for="(Item, Index) in StatusDrop" :value="$Enums.CustomerService.AfterSalesStatus[Item]" :key="Index">{{ Item }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选处理结果" v-model="SearchFilter.ProcessType" multiple filterable clearable>
              <Option v-for="(Item, Index) in ProcessTypeDrop" :key="Index" :value="$Enums.CustomerService.ProcessType[Item]">{{Item}}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选售后原因" v-model="SearchFilter.ReasonType" filterable clearable>
              <Option v-for="(Item, Index) in ReasonDrop" :value="Item.Id" :key="Index">{{ Item.Reason }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选客服" v-model="SearchFilter.CustomerId" filterable clearable>
              <Option v-for="(Item, Index) in CustomerDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选客服主管" v-model="SearchFilter.SupervisorId" filterable clearable>
              <Option v-for="(Item, Index) in SupervisorDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
            </Select> -->
            <span class="P-ML-10">添加时间：</span>
            <DatePicker class="P-W-200 P-ML-10 P-MB-10 P-VA-M" type="datetime" placeholder="开始时间" v-model="SearchFilter.AddTimeStart" clearable transfer></DatePicker>
            <DatePicker class="P-W-200 P-ML-10 P-MB-10 P-VA-M" type="datetime" placeholder="结束时间" v-model="SearchFilter.AddTimeEnd" clearable transfer></DatePicker>
            <span class="P-ML-10">下单时间：</span>
            <DatePicker class="P-W-200 P-ML-10 P-MB-10 P-VA-M" type="datetime" placeholder="开始时间" v-model="SearchFilter.DownloadTimeStart" clearable transfer></DatePicker>
            <DatePicker class="P-W-200 P-ML-10 P-MB-10 P-VA-M" type="datetime" placeholder="结束时间" v-model="SearchFilter.DownloadTimeEnd" clearable transfer></DatePicker>
          </Col>
        </Dropdown>
        <FormItem class="P-MB-10 P-ML-10">
          <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
            <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.DataField" :options="SearchTypeDrop"/>
            <!-- <Select slot="prepend" class="P-W-100" placeholder="关键词" filterable clearable v-model="SearchFilter.DataField">
              <Option v-for="(Item, Index) in SearchTypeDrop" :key="Index" :value="$Enums.CustomerService.AfterSalesSearchType[Item]">{{ Item }}</Option>
            </Select> -->
            <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-ML-10 P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
    </Col>
    <Col span="24" class="P-MB-10">
      <Button type="primary" @click="TriggerOperate(1)" v-if="Powers.AfterSaleOrdCreat">添加售后单</Button>
      <Modify ref="ModifyAfterSalesOrder" :ReasonDrop="ReasonDrop" :SupervisorDrop="SupervisorDrop" @emit-enable-sku="TriggerEnableSku" @emit-operate-success="GetList" v-if="Powers.AfterSaleOrdCreat || Powers.AfterSaleOrdModify"></Modify>
      <PostReview class="P-ML-5" ref="PostReview" @trigger-operate="TriggerOperate(3)" @emit-operate-success="GetList" v-if="Powers.AfterSaleOrdToReview"></PostReview>
      <Review class="P-ML-5" ref="Review" @trigger-operate="TriggerOperate" @emit-operate-success="GetList" v-if="Powers.AfterSaleOrdReview"></Review>
      <ExportEbay class="P-ML-5" ref="ExportEbay" @trigger-operate="TriggerOperate(7)" v-if="Powers.AfterSaleEbayExport"></ExportEbay>
      <Export class="P-ML-5" v-if="Powers.AfterSaleWalmartExport"></Export>
      <Cancel class="P-ML-5" ref="Cancel" @trigger-operate="TriggerOperate(9)" @emit-operate-success="GetList" v-if="Powers.AfterSaleCropping"></Cancel>
      <Details ref="AfterSalesOrderDetails" @emit-ship-order-details="TriggerShipOrderDetails" @emit-operate-success="GetList"></Details>
      <ShipOrderDetails ref="ShipOrderDetails"></ShipOrderDetails>
      <EnableSku ref="EnableSku" @handle-res-msg="GetSelectedSku" v-if="Powers.AfterSaleOrdCreat || Powers.AfterSaleOrdModify"></EnableSku>
    </Col>
    <Col span="24" class="P-MB-10">
      <Table ref="List" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
    </Col>
  </Row>
</template>
<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/CustomerService";

  @Component({
    name: "AfterSalesOrder",
    components: {
      PostReview: () => import("@/components/CustomerService/AfterSales/AfterSalesPostReview.vue"),
      Review: () => import("@/components/CustomerService/AfterSales/AfterSalesReview.vue"),
      ExportEbay: () => import("@/components/CustomerService/AfterSales/ExportEbayOrder.vue"),
      Export: () => import("@/components/CustomerService/AfterSales/ExportAfterSalesOrder.vue"),
      Cancel: () => import("@/components/CustomerService/AfterSales/AfterSalesCancel.vue"),
      Modify: () => import("@/components/CustomerService/AfterSales/ModifyAfterSalesOrder.vue"),
      Details: () => import("@/components/CustomerService/AfterSales/AfterSalesOrderDetails.vue"),
      ShipOrderDetails: () => import("@/components/Warehouse/ShipOrders/ShipOrderDetails.vue"),
      EnableSku: () => import("@/components/Public/EnableSku.vue")
    }
  })

  export default class AfterSalesOrder extends Vue {

    private mounted(): void {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["AfterSaleOrdCreat", "AfterSaleOrdModify", "AfterSaleOrdToReview", "AfterSaleOrdReview", "AfterSaleWalmartExport", "AfterSaleEbayExport", "AfterSaleCropping"]))
      this.GetList();
      this.GetFilterDrop();
    }

    private CalculateHeight(): number {
      let Flag = this.Powers.AfterSaleOrdCreat || this.Powers.AfterSaleOrdToReview || this.Powers.AfterSaleOrdReview || this.Powers.AfterSaleWalmartExport || this.Powers.AfterSaleEbayExport || this.Powers.AfterSaleCropping
      return this.$UI.FullHeight() - (Flag ? 250 : 210);
    }

    private TriggerSearch(): void {
      this.$set(this, "AccurateSearch", !this.AccurateSearch);
    }

    private CloseSearch(): void {
      this.$set(this, "AccurateSearch", false);
    }

    private GetOperates(S: number): PInterface.KV[] {
      let Os: PInterface.KV[] = [{Key: "查看", Value: 10}]
      if (S === 1) {
        this.Powers.AfterSaleOrdModify ? Os.push({Key: "编辑", Value: 2}) : null
        this.Powers.AfterSaleOrdToReview ? Os.push({Key: "提交审核", Value: 3}) : null
        this.Powers.AfterSaleCropping ? Os.push({Key: "作废", Value: 9}) : null
      } else if (S === 2) {
        this.Powers.AfterSaleOrdReview ? Os.push({Key: "审核", Value: 11}) : null
      }
      return Os;
    }

    private async GetFilterDrop(): Promise<void> {
      this.$set(this, "ReasonDrop", await this.GetDropList<number, Interface.ReasonDrop[]>(this.$Server.CustomerService, this.$Api.SaleReasonDropList, 1, "Data"));
      this.$set(this, "CustomerDrop", await this.GetDropList<string, PInterface.KV[]>(this.$Server.Admin, this.$Api.GetUserDropList, "客服"));
      this.$set(this, "SupervisorDrop", await this.GetDropList<string, PInterface.KV[]>(this.$Server.Admin, this.$Api.GetUserDropList, "客服主管"));
    }

    private GetDropList<T, S>(Server: string, Api: string, Data: T, Key: string = "DropList"): Promise<S | []> {
      return new Promise((Resolve: (V: S | []) => void) => {
        this.$Request.Post({
          Server: Server,
          Api: {
            Address: Api
          },
          Data: Data,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              Resolve(Res.Data[Key]);
            } else {
              Resolve([])
              this.$Request.Error(Res)
            }
          }
        })
      })
    }

    private GetStore(N: number): void {
      if (N) {
        this.GetDropList<number, PInterface.KV[]>(this.$Server.Sales, this.$Api.Sales[String(N)].StoreDrop, N).then((Res: PInterface.KV[]) => {
          this.$set(this, "StoreDrop", Res);
        })
      } else {
        this.$set(this, "StoreDrop", [])
        this.$set(this.SearchFilter, "StoreId", 0)
      }
    }

    private SearchList(): void {
      this.ChangePage(1);
    }

    private ResetList(): void {
      this.$set(this, "SearchFilter", new Interface.AfterSalesSearch());
      this.$set(this, "Pager", new PInterface.Pager())
      this.GetList();
    }

    private ChangePage(N: number): void {
      this.$set(this.Pager, "PageIndex", N);
      this.GetList();
    }

    private ChangePageSize(N: number): void {
      this.$set(this.Pager, "PageSize", N);
      this.GetList();
    }

    private GetList(): void {
      this.$UI.Loading.Show();
      let SearchFilter = JSON.parse(JSON.stringify(this.SearchFilter))
      SearchFilter.ProcessType = SearchFilter.ProcessType.join(",")
      SearchFilter.AddTimeStart = SearchFilter.AddTimeStart ? this.$UI.Render.NewDate(SearchFilter.AddTimeStart, true) : ""
      SearchFilter.AddTimeEnd = SearchFilter.AddTimeEnd ? this.$UI.Render.NewDate(SearchFilter.AddTimeEnd, true) : ""
      SearchFilter.DownloadTimeStart = SearchFilter.DownloadTimeStart ? this.$UI.Render.NewDate(SearchFilter.DownloadTimeStart, true) : ""
      SearchFilter.DownloadTimeEnd = SearchFilter.DownloadTimeEnd ? this.$UI.Render.NewDate(SearchFilter.DownloadTimeEnd, true) : ""
      this.$Request.Post({
        Server: this.$Server.CustomerService,
        Api: {
          Address: this.$Api.AfterSaleList,
          Login: true,
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: SearchFilter
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.$set(this, "List", Res.Data.PageModel.Items);
            this.$set(this.Pager, "TotalItems", Res.Data.PageModel.TotalItems);
            this.CloseSearch();
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 1-添加 2-编辑 3-提审 4-审核通过 5-审核退回修改 6-审核而不通过 7-导出ebay 8-导出 9-作废 10-查看 11-单个审核
    private TriggerOperate(T: number, D?: Interface.AfterSalesList): void {
      this.CloseSearch();
      switch (T) {
        case 1:
          (this as any).$refs.ModifyAfterSalesOrder.Trigger();
          break;
        case 2:
          (this as any).$refs.ModifyAfterSalesOrder.Trigger(D);
          break;
        case 3:
          const PostReviewDatas = D ? [D] : (this as any).$refs.List.getSelection();
          (this as any).$refs.PostReview.Trigger(PostReviewDatas)
          break;
        case 4:
        case 5:
        case 6:
          const ReviewDatas = D ? [D] : (this as any).$refs.List.getSelection();
          (this as any).$refs.Review.Trigger(T, ReviewDatas)
          break;
        case 7:
          (this as any).$refs.ExportEbay.Trigger(this.SearchFilter);
          break;
        case 9:
          const CancelDatas = D ? [D] : (this as any).$refs.List.getSelection();
          (this as any).$refs.Cancel.Trigger(CancelDatas)
          break;
        case 10:
          (this as any).$refs.AfterSalesOrderDetails.Trigger(D);
          break;
        case 11:
          (this as any).$refs.AfterSalesOrderDetails.Trigger(D, true);
          break;
      }
    }

    private TriggerShipOrderDetails(Code: string): void {
      (this as any).$refs.ShipOrderDetails.Validate({
        OrderId: 0,
        OrderCode: Code
      })
    }

    private TriggerEnableSku(): void {
      (this as any).$refs.EnableSku.Trigger(false)
    }

    private GetSelectedSku(SelectData: PInterface.EnableSku[]): void {
      (this as any).$refs.ModifyAfterSalesOrder.GetSelectedSku(SelectData)
    }

    private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform)
    private StoreDrop: PInterface.KV[] = []
    private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AfterSalesStatus)
    private ProcessTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.ProcessType)
    private ReasonDrop: Interface.ReasonDrop[] = []
    private CustomerDrop: PInterface.KV[] = []
    private SupervisorDrop: PInterface.KV[] = []
    private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AfterSalesSearchType)
    private Powers: PInterface.Power = {}
    private Operations: PInterface.KV[] = [] // 操作列

    private AccurateSearch: boolean = false
    private SearchFilter: Interface.AfterSalesSearch = new Interface.AfterSalesSearch()
    private Pager: PInterface.Pager = new PInterface.Pager()

    private List: Interface.AfterSalesList[] = []

    private Cols: PInterface.TableCol[] = [
      {type: "selection", width: 60, align: "center"}, {
        title: "编号",
        key: "AfterSaleCode",
        render: (h: any, Params: any): string => {
          return h("a", {
            on: {
              click: () => {
                this.TriggerOperate(10, Params.row);
              }
            }
          }, Params.row.AfterSaleCode)
        }
      }, {
        title: "发货单号",
        key: "OriginalShipOrderCode",
        render: (h: any, Params: any): string => {
          return h("a", {
            on: {
              click: () => {
                this.TriggerShipOrderDetails(Params.row.OriginalShipOrderCode);
              }
            }
          }, Params.row.OriginalShipOrderCode)
        }
      }, {
        title: "平台",
        render: (h: any, Params: any): string => {
          return h("span", this.$Enums.Sales.Platform[Params.row.Platform])
        }
      }, {
        title: "店铺",
        key: "StoreName"
      }, {
        title: "类型",
        render: (h: any, Params: any): string => {
          return h("span", this.$Enums.CustomerService.ProcessType[Params.row.ProcessType])
        }
      }, {
        title: "客服",
        key: "CustomerName"
      }, {
        title: "客服主管",
        key: "SupervisorName"
      }, {
        title: "状态",
        width: 100,
        render: (h: any, Params: any): string => {
          return h("span", this.$Enums.CustomerService.AfterSalesStatus[Params.row.Status])
        }
      }, {
        title: "添加时间", width: 160,
        render: (h: any, Params: any): string => {
          return h("span", this.$UI.Render.Date(Params.row.Created, true))
        }
      }, {
        title: "操作",
        width: 100,
        render: (h: any, Params: any): string => {
          const Operations = this.GetOperates(Params.row.Status);
          return h(
            "Dropdown",
            {
              on: {
                "on-click": (N: number) => {
                  this.TriggerOperate(N, Params.row);
                }
              }
            },
            [
              h("a", [
                h("span", {class: "P-MR-5"}, "操作"),
                h("Icon", {props: {type: "ios-arrow-down"}})
              ]),
              h("DropdownMenu", {
                  slot: "list"
                },
                Operations.map((item: PInterface.KV): string => {
                  return h("DropdownItem", {
                      props: {
                        name: item.Value
                      },
                      class: "P-TA-C"
                    },
                    item.Key
                  );
                })
              )
            ]
          );
        }
      }]
  }
</script>