<!-- 买家黑名单列表 -->
<template>
  <Row>
    <Col span="24">
      <Row class="P-Search-Group">
        <Col :span="24">
          <Form ref="SearchForm" :model="SearchForm" onsubmit="return false" inline>
            <Dropdown trigger="custom" :visible="AccurateSearch">
              <Button type="primary" @click="TriggerSearch">
                精准搜索
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <Col span="24" slot="list" class="P-P-10">
                <Select class="P-W-200 P-ML-10" placeholder="筛选平台"  v-model="SearchForm.Platform" :options="PlatformDrop" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选平台" @on-change="OnClearSelect('Platform')" v-model="SearchForm.Platform" filterable clearable>
                  <Option v-for="(Item,Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="$Enums.Sales.Platform[Item]">{{ Item }}</Option>
                </Select> -->
                <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.IsEnable" :options="StatusDrop" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" @on-change="OnClearSelect('IsEnable')" v-model="SearchForm.IsEnable" filterable clearable>
                  <Option v-for="(Item,Index) in StatusDrop" :value="$Enums.Public.Enable[Item]" :key="Index">{{ Item }}</Option>
                </Select> -->
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-10">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
                <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="SearchKeyTypeDrop" />
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in SearchKeyTypeDrop" :value="$Enums.Warehouse.BuyerBlackKeyType[Item]" :key="Index">{{Item}}</Option>
                </Select> -->
                <Button slot="append" type="primary" @click="SearchList">搜索</Button>
              </Input>
            </FormItem>
            <FormItem class="P-ML-10 P-MB-10">
              <Button type="warning" @click="ResetList">重置</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :span="24">
          <Row ref="OperateBtnGroup" class="OperateBtnGroup">
            <ModifyBlackBuyer ref="ModifyBlackBuyer"
                              :PropShowCreateBtn="Powers.BlackListCreate"
                              @emit-change="EmitChange" class="P-MR-10 P-MB-10"></ModifyBlackBuyer>
            <ChangeStatus v-if="Powers.BlackListChangeStatus" ref="ChangeStatus"
                          @emit-change="EmitChange" class="P-MB-10"></ChangeStatus>
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
    name: "BuyerBlackList",
    components: {
      ModifyBlackBuyer: () => import("@/components/Warehouse/Settings/ModifyBlackList.vue"),
      ChangeStatus: () => import("@/components/Public/ChangeStatus.vue")
    }
  })

  export default class BuyerBlackList extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private GetPoints(): void {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["BlackListCreate", "BlackListModify", "BlackListChangeStatus"]));

      this.Powers.BlackListModify ? this.OperateDrop.push({Key: "编辑", Value: 1}) : null;
      this.Powers.BlackListChangeStatus ? this.OperateDrop.push({Key: "禁启用", Value: 2}) : null;

      this.GetTableList();
    }

    // 状态回调
    private EmitChange(Res: boolean, Type?: number){
      if(Type !== undefined){
        this.ChangeStatusObj.ToTarget = Type === 1 ? true : false;
        (this.$refs["ChangeStatus"] as any).TriggerModal(this.TableSelected, this.ChangeStatusObj);
      }else{
        this.TableCancelSelected()
      }

      if(Res){
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

    private ResetList(): void {
      this.AccurateSearch = false;
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.BlacklistSearchGroup());
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
        Server: this.$Server.Settings,
        Api: {
          Address: this.$Api.BlackListGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            Platform: Number(this.SearchForm.Platform),
            IsEnable: this.SearchForm.IsEnable === "" ? "" : Boolean(this.SearchForm.IsEnable),
            SearchKey: this.SearchForm.SearchKey,
            SearchKeyType: Number(this.SearchForm.SearchKeyType)
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
      let H = window.innerHeight - 210;
      if (this.$refs["SearchGroup"]) {
        H -= (this.$refs["SearchGroup"] as any).$el.offsetHeight;
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

    private OperateGroup(Type: number, Index: number): void {
      this.TableCancelSelected();
      this.$set(this, "TableSelected", JSON.parse(JSON.stringify([this.TableList[Index]])));
      switch (Type) {
        case 1:
          (this.$refs["ModifyBlackBuyer"] as Vue).Trigger({
            IsShowModal: true,
            SelectedDetail: this.TableSelected[0]
          })
          break;
        case 2:
          this.ChangeStatusObj.ToTarget = !this.TableSelected[0].IsEnable;
          (this.$refs["ChangeStatus"] as any).TriggerModal(
            this.TableSelected,
            this.ChangeStatusObj
          );
          break;
      }
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.BlacklistSearchGroup = new Interface.BlacklistSearchGroup();

    private TableList: Interface.BlacklistTable[] = [];
    private TableSelected: Interface.BlacklistTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "买家ID",
      width: 150,
      key: "BuyerUserId"
    }, {
      title: "电话号码",
      width: 150,
      key: "BuyerPhone"
    }, {
      title: "邮箱",
      width: 240,
      key: "BuyerEmail",
    }, {
      title: "平台",
      width: 130,
      key: "Platform",
      render: (h, params) => {
        let _this = this;
        return h("span", _this.$Enums.Sales.Platform[params.row.Platform])
      }
    }, {
      title: "备注",
      key: "Remark",
    }, {
      title: "添加时间", width: 160, key: "CreateTime",
      render: (h: any, params: any): string => {
        return h("span", this.$UI.Render.Date(params.row.CreateTime, true));
      }
    }, {
      title: "状态",
      width: 80,
      key: "IsEnable",
      render: (h: any, params: any): string => {
        return h("span", {
          class: ["P-Text-Error", "P-Text-Success"][Number(params.row.IsEnable)]
        }, this.$Enums.Public.Enable[Number(params.row.IsEnable)]);
      }
    }, {
      title: "操作",
      width: 140,
      render: (h: any, params: any): string => {
        return h("div", this.OperateDrop.map((Item: PInterface.KV, Index: number) => {
          return h("Button", {
            props: {
              type: (Item.Value === 2 && params.row.IsEnable) ? "error" : "primary",
              size: "small"
            },
            class: "P-MB-5 P-MR-5",
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row._index)
              }
            }
          }, Item.Value == 2 ? (params.row.IsEnable ? "禁用" : "启用") : Item.Key)
        }))
      }
    }];
    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据

    private Powers: PInterface.Power = {} // 权限

    private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);
    private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 状态
    private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.BuyerBlackKeyType)  //关键字下拉
    private OperateDrop: PInterface.KV[] = [] // 下拉操作项
    private ChangeStatusObj: PInterface.ChangeStatus = {
      Server: this.$Server.Settings,
      Api: this.$Api.BlackListChangeStatus,
      IdKey: 'Id', StatusKey: 'IsEnable', ToTarget: false,
      TipsKey: "黑名单账号"
    };
  }
</script>
<style lang="less"></style>