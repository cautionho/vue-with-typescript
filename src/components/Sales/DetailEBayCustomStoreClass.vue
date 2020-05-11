<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button type="primary" class="mt10 mr10" @click="OpenModal">查看日志</Button>
      <Modal title="查看日志" v-model="IsShowModal" :mask-closable="false" width="1300" @on-cancel="ClearModal">
        <Row>
          <Col :span="24">
            <Form ref="OperateForm" :model="OperateForm" onsubmit="return false" inline class="P-MB-10">
              <Dropdown trigger="custom" :visible="AccurateSearch" placement="bottom-start">
                <Button type="primary" @click="TriggerSearch">
                  精准搜索
                  <Icon type="ios-arrow-down"></Icon>
                </Button>
                <Col span="24" slot="list" class="P-P-10">
                  <Select v-model="OperateForm.UserId" class="P-W-200 P-MR-10" placeholder="筛选操作人" :options="DropUser"/>
                  <Select v-model="OperateForm.OperationType" class="P-W-200 P-MR-10" placeholder="筛选操作" :options="DropOperationType"/>
                  <Select v-model="OperateForm.StoreId" class="P-W-200 P-MR-10" placeholder="筛选店铺" :options="PropStoreDrop"/>
                  <Select v-model="OperateForm.Status" class="P-W-200 P-MR-10" placeholder="筛选结果" :options="DropStatus"/>
                  <span class="P-ML-10 P-Inline-Block">操作时间：</span>
                  <DatePicker class="P-W-200 P-ML-10" v-model="OperateForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                  <span class="P-ML-5 P-Inline-Block">-</span>
                  <DatePicker class="P-W-200 P-ML-10" v-model="OperateForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
                </Col>
              </Dropdown>
              <FormItem class="P-MB-0 P-ML-10">
                <Input v-model="OperateForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-300">
                  <Button slot="append" type="primary" @click="SearchList">搜索</Button>
                </Input>
              </FormItem>
              <FormItem class="P-MB-0">
                <Button type="warning" @click="ResetList">重置</Button>
              </FormItem>
            </Form>
          </Col>
          <Col :span="24">
            <Table ref="TableList" :height="550" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
          </Col>
          <Col :span="24">
            <Page ref="Pager" @on-change="SetChangePageTable" @on-page-size-change="SetChangePageSizeTable" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total
                  show-sizer
                  show-elevator class="P-MT-10"/>
          </Col>
        </Row>
        <footer slot="footer" class="P-TA-R">
          <Button @click="ClearModal">返回</Button>
        </footer>
      </Modal>
    </Col>
  </div>
</template>
<script lang="ts">
  import {Component, Vue, Emit, Prop} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "DetailEBayCustomStoreClass"
  })
  export default class DetailEBayCustomStoreClass extends Vue {
    @Prop() PropStoreDrop: PInterface.KV[];

    private OpenModal(): void {
      if (this.DropUser.length === 0) {
        this.GetUserDrop();
      }
      this.IsShowModal = true;
      this.ResetList();
    }

    private GetUserDrop(): void {
      this.$Request.Post({
        Server: this.$Server.Admin,
        Api: {
          Address: this.$Api.GetUserDropList,
          Login: ""
        },
        Data: "",
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$set(this, "DropUser", Res.Data.DropList);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private SearchList(): void {
      this.Pager.PageIndex = 1;
      this.GetTableList();
    }

    private ResetList(): void {
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "OperateForm", new Interface.EBayCustomClassLogSearchFrom());
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.$set(this, "AccurateSearch", false);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.GetStoreCategoryHistoryList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            EndTime: this.OperateForm.EndTime ? this.$UI.Render.NewDate(this.OperateForm.EndTime, true) : "",
            OperationType: Number(this.OperateForm.OperationType),
            SearchKey: this.OperateForm.SearchKey,
            StartTime: this.OperateForm.EndTime ? this.$UI.Render.NewDate(this.OperateForm.StartTime, true) : "",
            Status: Number(this.OperateForm.Status),
            StoreId: Number(this.OperateForm.StoreId),
            UserId: Number(this.OperateForm.UserId)
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

    private SetChangePageTable(pageNum: number): void {
      this.Pager.PageIndex = pageNum;
      this.GetTableList();
    }

    private SetChangePageSizeTable(pageSize: number): void {
      this.Pager.PageSize = pageSize;
      this.GetTableList();
    }

    // 触发“精准搜索”按钮
    private TriggerSearch(): void {
      this.$set(this, "AccurateSearch", !this.AccurateSearch);
    }

    private ClearModal(): void {
      this.IsShowModal = false;
      this.AccurateSearch = false;
    }

    private IsShowModal: boolean = false;
    private AccurateSearch: boolean = false;
    private OperateForm: Interface.EBayCustomClassLogSearchFrom = new Interface.EBayCustomClassLogSearchFrom();
    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.EBayCustomClassLogTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "编号", key: "Id", width: 80
    }, {
      title: "操作人", key: "UserName", width: 100
    }, {
      title: "操作", key: "OperationType", width: 100,
      render: (h, params): any => {
        return h("span", (this.DropOperationType.find((Item) => Item.Value === params.row.OperationType) as PInterface.KV).Key);
      }
    }, {
      title: "店铺", key: "EbayStoreName"
    }, {
      title: "分类名称",
      key: "CustomCategoryName"
    }, {
      title: "操作时间",
      key: "CreateTime",
      width: 160,
      render: (h, params) => {
        return h("div", this.$UI.Render.Date(params.row.CreateTime, true));
      }
    }, {
      title: "结果",
      key: "Status",
      width: 100,
      render: (h, params) => {
        return h("span", (this.DropStatus.find(Item => Item.Value === params.row.Status) as PInterface.KV).Key)
      }
    }, {
      title: "操作记录",
      key: "Remark",
      width: 300,
      render: (h: any, params: any): any => {
        return params.row.Remark ? h("Tooltip", {
          props: {
            "content": params.row.Remark,
            "maxWidth": 600
          },
          class: "P-W-100-Percent P-LINE-1"
        }, params.row.Remark) : h("span", "-");
      }
    }];

    private DropUser: PInterface.KV[] = [];
    private DropOperationType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.CustomStoreLogKeyType);
    private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.CustomStoreLogStatus);
  }

</script>
<style lang="less"></style>
