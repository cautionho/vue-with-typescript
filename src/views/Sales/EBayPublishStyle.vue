<!-- ebay刊登风格 -->
<template>
  <Row>
    <Col span="24">
      <Row class="P-Search-Group">
        <Col :span="24">
          <Form ref="SearchForm" :model="SearchForm" onsubmit="return false" inline class="P-MB-10">
            <FormItem class="P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
                <Select v-model="SearchForm.IsEnable" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropStatus"/>
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
            <EBayPublishStyleModify ref="EBayPublishStyleModify"
                                    @emit-change="OperateEmitChange"></EBayPublishStyleModify>
            <ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.EnableEBayStyle" @emit-change="EmitChange"></ChangeStatus>
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
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "EBayPublishStyle",
    components: {
      EBayPublishStyleModify: () => import("@/components/Sales/EBayPublishStyleModify.vue"),
      ChangeStatus: () => import("@/components/Public/ChangeStatus.vue"),
    }
  })

  export default class EBayPublishStyle extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private GetPoints(): void {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["CreateEBayStyle", "ModifyEBayStyle", "EnableEBayStyle"]));

      this.Powers.ModifyEBayStyle ? this.OperateDrop.push({Key: "编辑", Value: 0}) : null;
      this.Powers.EnableEBayStyle ? this.OperateDrop.push(...[{Key: "启用", Value: 1}, {Key: "禁用", Value: 2}]) : null;

      this.GetTableList();
    }

    private ResetList(): void {
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.EBayStyleSearchGroup());
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
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.GetEbayTempDescriptionList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            IsEnable: this.SearchForm.IsEnable === "" ? "" : Boolean(this.SearchForm.IsEnable),
            SearchKey: this.SearchForm.SearchKey
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

    private TableGetSelected(Data: Interface.EBayStyleTable[]): void {
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

    private OperateEmitChange(Res: boolean): void {
      this.TableCancelSelected();
      if (Res) {
        this.GetTableList();
      }
    }

    private OperateGroup(Type: number, Item: Interface.EBayStyleTable): void {
      this.TableCancelSelected();
      this.TableSelected.push(JSON.parse(JSON.stringify(Item)));
      switch (Type) {
        case 0:
          this.GetEbayStyleDetail();
          break;
        case 1:
        case 2:
          this.ChangeStatusObj.ToTarget = !this.TableSelected[0].IsEnable;
          (this.$refs["ChangeStatus"] as any).TriggerModal(this.TableSelected, this.ChangeStatusObj);
          break;
      }
    }

    /*
    批量禁启用组件回调
      Res true-操作成功
      Type  1-启用 0-禁用	99-取消数据
    */
    private EmitChange(Res: boolean, Type?: number) {
      if (Type !== undefined) {
        this.ChangeStatusObj.ToTarget = Type === 1 ? true : false;
        (this.$refs["ChangeStatus"] as any).TriggerModal(this.TableSelected, this.ChangeStatusObj);
      } else {
        this.TableCancelSelected()
      }

      if (Res) {
        this.GetTableList();
      }
    }

    private GetEbayStyleDetail() {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.GetEbayTempDescriptionById,
          Login: true
        },
        Data: this.TableSelected[0].Id,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            (this.$refs["EBayPublishStyleModify"] as any).OpenModal({
              Type: 1,
              Detail: JSON.parse(JSON.stringify(Res.Data.Data))
            });
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private SearchForm: Interface.EBayStyleSearchGroup = new Interface.EBayStyleSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.EBayStyleTable[] = [];
    private TableSelected: Interface.EBayStyleTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "风格名称", key: "Title"
    }, {
      title: "状态",
      width: 120,
      render: (h: any, params: any): string => {
        return h("span", {
          class: params.row.IsEnable ? "P-Text-Success" : "P-Text-Error"
        }, this.$Enums.Public.Enable[Number(params.row.IsEnable)]);
      }
    }, {
      title: "操作",
      width: 140,
      render: (h: any, params: any): string => {
        return h("div", this.OperateDrop.map((Item: PInterface.KV, Index: number) => {
          return h("Button", {
            props: {
              type: ["primary", "primary", "error"][(Item.Value as number)],
              size: "small"
            },
            style: {
              marginRight: "6px",
              display: ((Type: number) => {
                switch (Type) {
                  case 0:
                    return "inline-block"
                  case 1:
                    return !params.row.IsEnable ? "inline-block" : "none"
                  case 2:
                    return params.row.IsEnable ? "inline-block" : "none"
                }
              })((Item.Value as number))
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

    private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable); // 状态
    private OperateDrop: PInterface.KV[] = []; // 下拉操作项
    private ChangeStatusObj: PInterface.ChangeStatus = {Server: this.$Server.Sales, Api: this.$Api.UpdateIsEnableEbayTempDescription, IdKey: "Ids", StatusKey: "IsEnable", ToTarget: false, TipsKey: "风格"};
    private Powers: PInterface.Power = {}; // 权限
  }
</script>
<style lang="less">
</style>