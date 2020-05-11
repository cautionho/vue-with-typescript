<template>
  <Row class="Position">
    <Col span="24">
      <Form :ref="'SearchGroup'" :model="SearchGroup" inline onsubmit="return false" class="P-MB-10">
        <FormItem>
          <Select :onChange="OnClearSelect.bind(this, 'IsEnable')" v-model="SearchGroup.IsEnable" placeholder="请选择状态" :options="DropIsEnable" />
          <!-- <Select @on-change="OnClearSelect('IsEnable')" v-model="SearchGroup.IsEnable" placeholder="请选择状态" filterable clearable>
            <Option v-for="(item, idx) in DropIsEnable" :value="$Enums.Public.Enable[item]" :key="idx">{{ item }}</Option>
          </Select> -->
        </FormItem>
        <FormItem>
          <Input @on-enter="SubSearchGroup" v-model="SearchGroup.SearchKey" placeholder="搜索关键字" class="P-W-300">
            <Button slot="append" type="primary" @click="SubSearchGroup">搜索</Button>
          </Input>
        </FormItem>
        <Button type="warning" @click="ResetSearchGroup">重置</Button>
      </Form>
    </Col>
    <Col span="24">
      <Row :ref="'OperateBtnGroup'" class="OperateBtnGroup">
        <ModifyPost v-if="Powers.PositionAdd"
                    ref="ModifyPost"
                    :PropDropPosition="DropPosition"
                    :PropDropCategoryTree="DropCategoryTree"
                    @emit-change="OperateEmitChange"
                    class="P-MB-10">
        </ModifyPost>
        <BindRole v-if="Powers.PositionSetRole"
                  @emit-change="OperateEmitChange"
                  :PropSelected="TableSelected"
                  :PropDropPosition="DropPosition"
                  class="P-MB-10">
        </BindRole>
        <ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.PositionStatus" @emit-change="EmitChange"></ChangeStatus>
      </Row>
    </Col>
    <Col span="24">
      <Table :ref="'TableList'" @on-selection-change="TableGetSelected" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
    </Col>
    <Col span="24">
      <Page :current="TablePager.PageIndex" :ref="'TablePager'" @on-change="SetChangePageTable" @on-page-size-change="SetChangePageSizeTable" :total="TablePager.TotalItems" :page-size="TablePager.PageSize"
            :page-size-opts="TablePager.PageOpt" show-total show-sizer show-elevator class="P-MT-10"/>
    </Col>
  </Row>
</template>
<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import PInterface from "../../assets/Interface/Public";
  import Interface from "../../assets/Interface/Admin";

  @Component({
    name: "Position",
    components: {
      ChangeStatus: () => import("../../components/Public/ChangeStatus.vue"),
      ModifyPost: () => import("../../components/Admin/ModifyPost.vue"),
      BindRole: () => import("../../components/Admin/BindRole.vue"),
    }
  })

  export default class Position extends Vue {
    private mounted() {
      this.GetPoints();
    }

    // 获取权限
    private async GetPoints(): Promise<void> {
      this.$UI.Loading.Show();
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["PositionAdd", "PositionModify", "PositionStatus", "PositionSetRole", "PositionSetToDo"]));
      this.$set(this, "DropPosition", await this.DropGetList<boolean, PInterface.KV>(this.$Server.Admin, this.$Api.RDropList, "DropList", true));
      this.$set(this, "DropCategoryTree", await this.DropGetList<boolean, Interface.PositionToDoTree>(this.$Server.Settings, this.$Api.ToDoTree, "Tree", true));
      this.SetOperateBtn()
    }

    private SetOperateBtn(): void {
      let Drops: PInterface.KV[] = [];
      this.Powers.PositionModify ? Drops.push({Key: "编辑", Value: "Modify"}) : "";
      this.Powers.PositionStatus ? Drops.push({Key: "启用", Value: "Use"},
        {Key: "禁用", Value: "Stop"}) : "";
      this.DropOperate.push(...Drops);
      this.TableGetList();
    }

    private SubSearchGroup(): void {
      this.TablePager.PageIndex = 1;
      this.TableGetList();
    }

    private ResetSearchGroup(): void {
      this.$set(this, "TablePager", new PInterface.Pager());
      this.$set(this, "SearchGroup", new Interface.PositionSearchGroup());
      this.TableGetList();
    }

    private TableGetList(): void {
      this.TableCancelSelected();
      this.$set(this, "TableList", []);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Admin,
        Api: {
          Address: this.$Api.PositionList,
          Login: true
        },
        Data: {
          PageIndex: this.TablePager.PageIndex,
          PageSize: this.TablePager.PageSize,
          Conditions: {
            SearchKey: this.SearchGroup.SearchKey,
            IsEnable: this.SearchGroup.IsEnable === "" ? "" : Boolean(this.SearchGroup.IsEnable)
          }
        },
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.TablePager.TotalItems = res.Data.PageModel.TotalItems;
            this.$set(this,'TableList', res.Data.PageModel.Items);
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    // Idx:列表下标  Type:操作类型
    private TableOperateGroup(Item: Interface.PositionTableList, Type: string): void {
      this.TableCancelSelected();
      switch (Type) {
        case "Modify":
          (this.$refs["ModifyPost"] as any).OpenModal({
            Type: 1,
            Selected: JSON.parse(JSON.stringify(Item))
          });
          break;
        case "Use":
        case "Stop":
          this.OperateChangeStatus.ToTarget = !Item.IsEnable;
          (this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(Item))], this.OperateChangeStatus);
          break;
      }
    }

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
    }

    //获取列表复选框选中的数据
    private TableGetSelected(data: Interface.PositionTableList[]): void {
      this.$set(this, "TableSelected", data)
    }

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchGroup[Key] == undefined) {
        this.$set(this.SearchGroup, Key, "");
      }
    }

    private CalculateTbHeight(): number {
      let height = window.innerHeight - 130;
      if (this.$refs["SearchGroup"]) {
        height -= (this.$refs["SearchGroup"] as any).$el.offsetHeight + 10;
      }
      if (this.$refs["OperateBtnGroup"]) {
        height -= (this.$refs["OperateBtnGroup"] as any).$el.offsetHeight;
      }
      if (this.$refs["TablePager"]) {
        height -= (this.$refs["TablePager"] as any).$el.offsetHeight + 10;
      }
      return height;
    }

    // 分页切换
    private SetChangePageTable(pageNum: number): void {
      this.TablePager.PageIndex = pageNum;
      this.TableGetList();
    }

    private SetChangePageSizeTable(pageSize: number): void {
      this.TablePager.PageSize = pageSize;
      this.TableGetList();
    }

    // Res: 重置列表  Type: 操作类型
    private OperateEmitChange(Res: boolean, Type: string): void {
      if (Res) {
        this.TableGetList();
      }
    }

    // Server:服务器  Api:api  EndName:返回的对象名称  Data:请求参数
    private DropGetList<T, R>(Server: string, Api: string, EndName: string, Data: T): Promise<R> {
      return new Promise(resovle => {
        this.$Request.Post({
          Server: Server,
          Api: {
            Address: Api,
            Login: false
          },
          Data: Data,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              resovle(Res.Data[EndName]);
            } else {
              this.$Request.Error(Res);
            }
          }
        })
      })
    }

    /*
    批量禁启用组件回调
      Res true-操作成功
      Type  1-启用 0-禁用	99-取消数据
    */
    private EmitChange(Res: boolean, Type?: number): void {
      if (Type !== undefined) {
        this.OperateChangeStatus.ToTarget = Type === 1 ? true : false;
        (this.$refs["ChangeStatus"] as any).TriggerModal(this.TableSelected, this.OperateChangeStatus);
      } else {
        this.TableCancelSelected()
      }

      if (Res) {
        this.TableGetList()
      }
    }

    private Powers: PInterface.Power = {} // 权限
    private DropOperate: PInterface.KV[] = []; // 操作项
    private DropIsEnable: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable);
    private DropPosition: PInterface.KV[] = []; // 角色下拉
    private DropCategoryTree: Interface.PositionToDoTree[] = []; // 待办事项树

    public SearchGroup: Interface.PositionSearchGroup = new Interface.PositionSearchGroup();

    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "序号",
      key: "Id",
      width: 60
    }, {
      title: "职位",
      key: "Name",
    }, {
      title: "角色",
      key: "RoleName",
    }, {
      title: "待办事项",
      key: "ToDoName",
    }, {
      title: "备注",
      key: "Remark",
      render: (h, params) => {
        return h("div", params.row.Remark ? params.row.Remark : "-");
      }
    }, {
      title: "创建时间", key: "CreateTime", width: 160,
      render: (h, params) => {
        return h("div", this.$UI.Render.Date(params.row.CreateTime, true).slice(0, params.row.CreateTime.indexOf("+")));
      }
    }, {
      title: "状态",
      key: "IsEnable",
      width: 80,
      render: (h, params) => {
        return h("Icon", {
          props: {
            type: params.row.IsEnable ? "md-checkmark" : "md-close",
            size: 18
          },
          class: params.row.IsEnable ? "P-Text-Success" : "P-Text-Error"
        }, "");
      }
    }, {
      title: "操作",
      key: "operate",
      width: 140,
      render: (h: any, params: any): string => {
        let self = (this as any);
        return h("div", this.DropOperate.map((item: PInterface.KV, index: number) => {
          return h("Button", {
            props: {
              type: ((type) => {
                let btnType: string = "";
                switch (type) {
                  case "Modify":
                  case "Use":
                    btnType = "primary";
                    break;
                  case "Stop":
                    btnType = "error";
                    break;
                }
                return btnType;
              })(item.Value),
              size: "small"
            },
            style: {
              marginRight: self.DropOperate.length - 1 == index ? "" : "6px",
              display: ((type) => {
                let display: string = "";
                switch (type) {
                  case "Modify":
                    display = "inline-block";
                    break;
                  case "Use":
                    display = params.row.IsEnable == false ? "inline-block" : "none";
                    break;
                  case "Stop":
                    display = params.row.IsEnable == true ? "inline-block" : "none";
                    break;
                }
                return display;
              })(item.Value)
            },
            on: {
              click: () => {
                this.TableOperateGroup(params.row, (item as any).Value);
              }
            }
          }, item.Key)
        }))
      }
    }]
    private TableList: Interface.PositionTableList[] = [];
    private TablePager: PInterface.Pager = new PInterface.Pager();
    private TableSelected: Interface.PositionTableList[] = [];

    private OperateChangeStatus: PInterface.ChangeStatus = {
      Server: this.$Server.Admin,
      Api: this.$Api.PositionChangeStatus,
      IdKey: "Id", StatusKey: "Status", ToTarget: false,
      TipsKey: "岗位"
    }
    private OperateIsBatchChangeStatus: boolean = true;    // 是否批量(禁用启用)
  }

</script>
<style lang="less">
  .Position {
    .ivu-form.ivu-form-label-right.ivu-form-inline {
      & > .ivu-form-item {
        margin-bottom: 0;
      }
    }

    .OperateBtnGroup {
      button {
        margin-right: 10px;
      }
    }
  }
</style>
