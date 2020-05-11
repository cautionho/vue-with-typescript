<!-- Ebay刊登列表 -->
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
                <Select v-model="SearchForm.ListingStatus" class="P-W-200 P-MR-10" placeholder="筛选刊登状态" :options="DropListingStatus"/>
                <Select v-model="SearchForm.VerifyStatus" class="P-W-200 P-MR-10" placeholder="筛选验证状态" :options="DropVerifyStatus"/>
                <Select v-model="SearchForm.SiteId" class="P-W-200 P-MR-10" placeholder="筛选站点" :options="DropSite"/>
                <Select v-model="SearchForm.StoreId" class="P-W-200 P-MR-10" placeholder="筛选店铺" :options="DropStore"/>
                <Select v-model="SearchForm.UserId" class="P-W-200" placeholder="筛选创建人" :options="DropUser"/>
                <span class="P-ML-10 P-Inline-Block">创建时间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="结束时间"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-MB-0 P-ML-10">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
                <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropSearchKeyType"/>
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
            <ShelvesEBayPublishList v-if="Powers.SubmitShelvesListing"
                                    ref="ShelvesEBayPublishList"
                                    :PropSelected="TableSelected"
                                    @emit-change="OperateEmitChange"></ShelvesEBayPublishList>
            <Button v-if="Powers.SubmitVerifyListing" type="primary" class="P-MR-10 P-MB-10" @click="PostVerifyListing()">提交验证</Button>
            <!-- 查看操作记录-->
            <HistoryEBayPublishList ref="HistoryEBayPublishList"></HistoryEBayPublishList>
            <!-- 刊登失败原因||验证失败原因 -->
            <ReasonEBayPublishList ref="ReasonEBayPublishList"></ReasonEBayPublishList>
          </Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" @on-selection-change="TableGetSelected" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
        </Col>
        <Col :span="24">
          <Page ref="Pager" @on-change="SetChangePageTable" @on-page-size-change="SetChangePageSizeTable" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer
                show-elevator class="P-MT-10"/>
        </Col>
      </Row>
    </Col>
  </Row>
</template>
<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "EBayPublishList",
    components: {
      HistoryEBayPublishList: () => import("@/components/Sales/HistoryEBayPublishList.vue"),
      ShelvesEBayPublishList: () => import("@/components/Sales/ShelvesEBayPublishList.vue"),
      ReasonEBayPublishList: () => import("@/components/Sales/ReasonEBayPublishList.vue"),
    }
  })

  export default class EBayPublishList extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["SubmitShelvesListing", "SubmitCancelListing", "SubmitVerifyListing", "ShelvesListingError", "ShelvesListingEdit"]));

      this.Powers.ShelvesListingEdit ? this.OperateDrop.push({Key: "编辑", Value: 2}) : null;
      this.Powers.SubmitVerifyListing ? this.OperateDrop.push({Key: "提交验证", Value: 3}) : null;
      this.Powers.SubmitShelvesListing ? this.OperateDrop.push({Key: "提交上架", Value: 4}) : null;
      this.Powers.SubmitCancelListing ? this.OperateDrop.push({Key: "取消上架", Value: 5}) : null;
      this.Powers.ShelvesListingError ? this.OperateDrop.push(...[{Key: "查看验证失败原因", Value: 6}, {Key: "查看刊登失败原因", Value: 7}]) : null;

      this.$set(this, "DropStore", await this.GetDropList<string, PInterface.KV>(this.$Server.Sales, this.$Api.EbayStoreDropList, ""));
      this.$set(this, "DropUser", await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, ""));
      this.$set(this, "DropSite", await this.GetDropList<string, PInterface.KV>(this.$Server.Sales, this.$Api.EbaySites, ""));

      this.GetTableList();
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

    // 触发“精准搜索”按钮
    private TriggerSearch(): void {
      this.$set(this, "AccurateSearch", !this.AccurateSearch);
    }

    private ResetList(): void {
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.EBayPublishListSearchGroup());
      this.GetTableList();
    }

    private SearchList(): void {
      if (this.SearchForm.StartTime && this.SearchForm.EndTime) {
        let StartTime = Date.parse(this.$UI.Render.NewDate(this.SearchForm.StartTime, true));
        let EndTime = Date.parse(this.$UI.Render.NewDate(this.SearchForm.EndTime, true));
        if (StartTime > EndTime) {
          this.$UI.Tips.Floating("warning", "开始时间不能晚于结束时间")
          return
        }
        if ((EndTime - StartTime) / 86400000 > 31) {
          this.$UI.Tips.Floating("warning", "时间段不能超过31天");
          return;
        }
      } else if ((this.SearchForm.StartTime == "" && this.SearchForm.EndTime != "") || (this.SearchForm.StartTime != "" && this.SearchForm.EndTime == "")) {
        this.$UI.Tips.Floating("warning", "开始时间和结束时间必须同时填写");
        return
      }
      this.Pager.PageIndex = 1;
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.TableCancelSelected();
      this.$set(this, "AccurateSearch", false);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.ShelvesEbayListingsGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : "",
          EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
          ListingStatus: Number(this.SearchForm.ListingStatus),
          VerifyStatus: Number(this.SearchForm.VerifyStatus),
          SiteId: this.SearchForm.SiteId === "" ? -1 : Number(this.SearchForm.SiteId),
          StoreId: Number(this.SearchForm.StoreId),
          UserId: Number(this.SearchForm.UserId),
          SearchKeyType: Number(this.SearchForm.SearchKeyType),
          SearchKey: this.SearchForm.SearchKey
        },
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.Pager.TotalItems = res.Data.PageModel.TotalItems;
            this.$set(this, "TableList", res.Data.PageModel.Items);
          } else {
            this.$Request.Error(res);
          }
          this.$UI.Loading.Hide();
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

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
    }

    //获取列表复选框选中的数据
    private TableGetSelected(data: Interface.EBayPublishListTable[]): void {
      this.$set(this, "TableSelected", data)
    }

    // Res: 重置列表
    private OperateEmitChange(Res: boolean): void {
      if (Res) {
        this.GetTableList();
      }
    }

    private OperateGroup(Type: number, Item: Interface.EBayPublishListTable): void {
      this.TableCancelSelected()
      switch (Type) {
        case 0: // 查看
        case 2: // 编辑
          break;
        case 1: // 查看操作记录
          (this.$refs["HistoryEBayPublishList"] as any).OpenModal(Item.Id);
          break;
        case 3: // 提交验证
          this.PostVerifyListing(Item.Id);
          break;
        case 4: // 提交上架
          (this.$refs["ShelvesEBayPublishList"] as any).OpenModal(Item.Id);
          break;
        case 5: // 取消上架
          this.PostCancelShelves(Item.Id);
          break;
        case 6: // 查看验证失败原因
        case 7: // 查看刊登失败原因
          (this.$refs["ReasonEBayPublishList"] as any).OpenModal({
            Type: Type - 5,
            Id: Item.Id
          });
          break;
      }
    }

    private PostCancelShelves(Id: number): void {
      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否确定对选中的列表进行取消上架操作?",
        Callback: (Res: boolean): void => {
          if (Res) {
            this.$Request.Post({
              Server: this.$Server.Sales,
              Api: {
                Address: this.api.ShelvesEBayCancelListing,
                Login: false
              },
              Data: [Id],
              Callback: (Res: PInterface.Res): void => {
                if (Res.IsSuccess) {
                  this.$UI.Tips.Floating("success", "取消刊登产品上架成功");
                  this.GetTableList();
                } else {
                  this.$Request.Error(Res);
                }
              }
            })
          }
        }
      });
    }

    private PostVerifyListing(Id?: number): void {
      if (!Id) {
        if (this.TableSelected.length === 0) {
          this.$UI.Tips.Floating("warning", "请选择刊登产品进行操作");
          return
        }
        if (!this.TableSelected.every((Item) => [1, 5].includes(Item.ListingStatus) && Item.ListingStatus !== 2)) {
          this.$UI.Tips.Floating("warning", "请选择刊登状态为新建或刊登失败，且验证状态不为验证中的刊登产品进行操作");
          return;
        }
      }
      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否确定对选中的列表进行提交验证操作?",
        Callback: (Res: boolean): void => {
          if (Res) {
            this.$Request.Post({
              Server: this.$Server.Sales,
              Api: {
                Address: this.api.ShelvesEBayVerifyListing,
                Login: false
              },
              Data: Id || this.TableSelected.map((Item) => Item.Id),
              Callback: (Res: PInterface.Res): void => {
                if (Res.IsSuccess) {
                  this.$UI.Tips.Floating("success", "提交刊登产品验证成功");
                  this.GetTableList();
                } else {
                  this.$Request.Error(Res);
                }
              }
            })
          }
        }
      })
    }

    private ShowOperateBtn(Type: number): boolean {
      let Display = false;
      switch (Type) {
        case 0:
        case 1:
          Display = true;
          break;
        case 2: // 编辑
          Display = this.Powers.ShelvesListingEdit;
          break;
        case 3: // 提交验证
          Display = this.Powers.SubmitVerifyListing;
          break;
        case 4: // 提交上架
          Display = this.Powers.SubmitShelvesListing;
          break;
        case 5: // 取消上架
          Display = this.Powers.SubmitCancelListing;
          break;
        case 6: // 查看验证失败原因
        case 7: // 查看刊登失败原因
          Display = this.Powers.ShelvesListingError;
          break;
      }
      return Display;
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.EBayPublishListSearchGroup = new Interface.EBayPublishListSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.EBayPublishListTable[] = [];
    private TableSelected: Interface.EBayPublishListTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "编号", key: "Id", width: 60,
    }, {
      title: "SKU编号/标题",
      render: (h, params) => {
        return h("div", {
          style: {
            padding: "2px 0"
          }
        }, [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "编"),
            h("span", params.row.Sku)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "标"),
            h("span", params.row.Title)
          ])
        ])
      }
    }, {
      title: "站点/店铺",
      render: (h, params) => {
        return h("div", {
          style: {
            padding: "2px 0"
          }
        }, [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "站"),
            h("span", this.DropSite.length ? (this.DropSite.find(Item => Item.Value === params.row.SiteId) as PInterface.KV).Key : "-")
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "店"),
            h("span", params.row.StoreName)
          ])
        ])
      }
    }, {
      title: "刊登分类/店铺分类",
      render: (h, params) => {
        return h("div", {
          style: {
            padding: "2px 0"
          }
        }, [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "刊"),
            h("span", {attrs: {class: "headerTips lineOne"}}, ""),
            h("span", params.row.ShelvesCategoryName)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "店"),
            h("span", params.row.StoreCategoryName)
          ])
        ])
      }
    }, {
      title: "刊登方式/刊登价格",
      render: (h, params) => {
        return h("div", {
          style: {
            padding: "2px 0"
          }
        }, [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "方"),
            h("span", params.row.ListingType === 1 ? "拍卖" : params.row.ListingType === 8 ? "一口价" : "-")
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "价"),
            h("span", params.row.Price + " " + params.row.Currency)
          ])
        ])
      }
    }, {
      title: "刊登状态/验证状态",
      render: (h, params) => {
        return h("div", {
          style: {
            padding: "2px 0"
          }
        }, [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "刊"),
            h("span", (this.DropListingStatus.find(Item => Item.Value === params.row.ListingStatus) as PInterface.KV).Key)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "验"),
            h("span", (this.DropVerifyStatus.find(Item => Item.Value === params.row.VerifyStatus) as PInterface.KV).Key)
          ])
        ])
      }
    }, {
      title: "创建人/最后操作人",
      render: (h, params) => {
        return h("div", {
          style: {
            padding: "2px 0"
          }
        }, [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "创"),
            h("span", params.row.CreateUserName)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "操"),
            h("span", params.row.LastOperator)
          ])
        ])
      }
    }, {
      title: "创建时间/最后操作时间/定时上架时间",
      width: 240,
      render: (h, params) => {
        return h("div", {
          style: {
            padding: "2px 0"
          }
        }, [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "创"),
            h("span", this.$UI.Render.Date(params.row.CreateTime, true))
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "操"),
            h("span", this.$UI.Render.Date(params.row.UpdateTime, true))
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "定"),
            h("span", this.$UI.Render.Date(params.row.ExpectedStartTime, true))
          ])
        ])
      }
    }, {
      title: "操作",
      width: 160,
      align: "center",
      render: (h, params) => {
        return h("Dropdown", {
          props: {trigger: "hover", placement: "top"},
          on: {
            "on-click": (Type: number) => {
              this.OperateGroup(Type, params.row);
            }
          }
        }, [
          h("a", [
            h("span", {class: "P-MR-5"}, "操作"),
            h("Icon", {props: {type: "ios-arrow-down"}})
          ]), h("DropdownMenu", {slot: "list"}, this.OperateDrop.map((Item: PInterface.KV): any => {
            return h("DropdownItem", {
              props: {name: Item.Value},
              class: "P-TA-C",
              style: {
                display: ((Item, Type) => {
                  switch (Type) {
                    case 0:
                    case 1:
                      return this.ShowOperateBtn(Type) ? "block" : "none";
                    case 2:
                      return this.ShowOperateBtn(Type) && [1, 5].includes(Item.ListingStatus) ? "block" : "none";
                    case 3:
                      return this.ShowOperateBtn(Type) && [1, 5].includes(Item.ListingStatus) && Item.ListingStatus !== 2 ? "block" : "none";
                    case 4:
                      return this.ShowOperateBtn(Type) && [1, 5].includes(Item.ListingStatus) ? "block" : "none";
                    case 5:
                      return this.ShowOperateBtn(Type) && [2].includes(Item.ListingStatus) ? "block" : "none";
                    case 6:
                      return this.ShowOperateBtn(Type) && [4].includes(Item.VerifyStatus) ? "block" : "none";
                    case 7:
                      return this.ShowOperateBtn(Type) && [4, 5].includes(Item.ListingStatus) ? "block" : "none";
                  }
                })(params.row, Item.Value)
              }
            }, Item.Key);
          }))])
      }
    }];

    private DropStore: PInterface.KV[] = [];
    private DropUser: PInterface.KV[] = [];
    private DropSite: PInterface.KV[] = [];
    private DropListingStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.EBayPublishListListing);
    private DropVerifyStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.EBayPublishListVerify);
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.EBayPublishListKeyType);
    private OperateDrop: PInterface.KV[] = [{Key: "查看", Value: 0}, {Key: "查看操作记录", Value: 1}]; // 下拉操作项
    private Powers: PInterface.Power = {}; // 权限
  }
</script>
<style lang="less">
</style>