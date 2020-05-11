<!-- ebay自定义店铺分类 -->
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
                <Select v-model="SearchForm.StoreId" class="P-W-200" placeholder="筛选店铺" :options="DropStore"/>
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
            <ModifyEBayCustomStoreClass ref="ModifyEBayCustomStoreClass"
                                        @emit-change="EmitChange"
                                        :PropStoreDrop="DropStore" class="P-MB-10"></ModifyEBayCustomStoreClass>
            <DetailEBayCustomStoreClass ref="DetailEBayCustomStoreClass"
                                      :PropStoreDrop="DropStore" class="P-MB-10"></DetailEBayCustomStoreClass>
          </Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
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
    name: "EBayCustomStoreClass",
    components: {
      ModifyEBayCustomStoreClass: () => import("@/components/Sales/ModifyEBayCustomStoreClass.vue"),
      DetailEBayCustomStoreClass: () => import("@/components/Sales/DetailEBayCustomStoreClass.vue"),
    }
  })

  export default class EBayCustomStoreClass extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["GetStoreHistoryList", "ModifyStoreCategories", "CreateStoreCategories", "DeleteStoreCategories", "MoveStoreCategories"]));

      this.Powers.ModifyStoreCategories ? this.OperateDrop.push({Key: "编辑", Value: 0}) : null;
      this.Powers.MoveStoreCategories ? this.OperateDrop.push({Key: "移动", Value: 1}) : null;
      this.Powers.DeleteStoreCategories ? this.OperateDrop.push({Key: "删除", Value: 2}) : null;
      this.$set(this, "DropStore", await this.GetDropList<string, PInterface.KV>(this.$Server.Sales, this.$Api.EbayStoreInSalerDropList, ""))

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
      this.$set(this, "SearchForm", new Interface.EBayCustomClassSearchGroup());
      this.GetTableList();
    }

    private SearchList(): void {
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
          Address: this.$Api.GetStoreCategoryList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            SearchKey: this.SearchForm.SearchKey,
            SearchKeyType: Number(this.SearchForm.SearchKeyType),
            StoreId: Number(this.SearchForm.StoreId)
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

    private TableCancelSelected(): void {
      this.$set(this, "TableSelected", [])
    }

    private OperateGroup(Type: number, Item: Interface.EBayCustomClassTable): void {
      switch (Type) {
        case 0:
        case 1:
          (this.$refs["ModifyEBayCustomStoreClass"] as any).OpenModal({
            Type: Type + 1,
            Detail: JSON.parse(JSON.stringify(Item))
          })
          break;
        case 2:
          this.$UI.Tips.Modal({
            Type: "confirm",
            Content: "确认要删除该分类吗？",
            Callback: (Res: boolean): void => {
              if (Res) {
                this.SetDelClass(Item);
              }
            }
          })
          break;
      }
    }

    private SetDelClass(Item: Interface.EBayCustomClassTable): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.SetStoreCategories,
          Login: true
        },
        Data: {
          StoreId: Item.EbayStoreId,
          DestinationParentCategoryID: Item.CustomCategoryParentID,
          CustomCategoryID: Item.CustomCategoryID,
          CustomCategoryName: Item.CustomCategoryName,
          Order: Item.Order,
          OperationType: 2,
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$UI.Tips.Floating("success", "删除成功");
            this.GetTableList();
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide()
        }
      })
    }

    private EmitChange(Res: boolean) {
      if (Res) {
        this.GetTableList();
      }
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.EBayCustomClassSearchGroup = new Interface.EBayCustomClassSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.EBayCustomClassTable[] = [];
    private TableSelected: Interface.EBayCustomClassTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "分类ID", key: "CustomCategoryID"
    }, {
      title: "分类名称", key: "CustomCategoryName"
    }, {
      title: "上级分类", key: "CustomCategoryParentName",
      render: (h: any, params: any): string => {
        return h("span", params.row.CustomCategoryParentName || "-");
      }
    }, {
      title: "店铺", key: "EbayStoreName"
    }, {
      title: "操作",
      width: 180,
      render: (h: any, params: any): string => {
        return h("div", this.OperateDrop.map((Item: PInterface.KV, Index: number) => {
          return h("Button", {
            props: {
              type: ["primary", "primary", "error"][(Item.Value as number)],
              size: "small"
            },
            style: {
              marginRight: "6px",
              display: "inline-block"
            },
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row)
              }
            }
          }, Item.Key)
        }))
      }
    }];

    private DropStore: PInterface.KV[] = [];
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.CustomStoreKeyType);
    private OperateDrop: PInterface.KV[] = []; // 下拉操作项
    private Powers: PInterface.Power = {}; // 权限
  }
</script>
<style lang="less">
</style>