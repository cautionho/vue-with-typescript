<!-- 交易流水 -->
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
              <Select v-model="SearchForm.TransactionType" class="P-W-200 P-MR-10" placeholder="筛选交易类型" :options="DropTransactionType" />
                <!-- <Select v-model="SearchForm.TransactionType" @on-change="OnClearSelect('TransactionType')" filterable clearable class="P-W-200 P-MR-10" placeholder="筛选交易类型">
                  <Option v-for="(Item,Index) in DropTransactionType" :value="$Enums.Logistics.TransactionRecordType[Item]" :key="Index">{{Item}}</Option>
                </Select> -->
                <Select v-model="SearchForm.MethodId" class="P-W-200 P-MR-10" placeholder="筛选渠道" :options="DropMethodId" optionValKey="Id" optionKey="Name" />
                <!-- <Select v-model="SearchForm.MethodId" @on-change="OnClearSelect('MethodId')" filterable clearable class="P-W-200 P-MR-10" placeholder="筛选渠道">
                  <Option v-for="(Item,Index) in DropMethodId" :value="Item.Id" :key="Index">{{ Item.Name}}</Option>
                </Select> -->
                <Select v-model="SearchForm.WarehouseId" class="P-W-200 P-MR-10" placeholder="筛选仓库" :options="DropWarehouse" />
                <!-- <Select v-model="SearchForm.WarehouseId" @on-change="OnClearSelect('WarehouseId')" filterable clearable class="P-W-200 P-MR-10" placeholder="筛选仓库">
                  <Option v-for="(Item,Index) in DropWarehouse" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
                </Select> -->
                <Select v-model="SearchForm.CountryCode" class="P-W-200" placeholder="筛选国家" :options="DropCountry" optionValKey="CountryCode" optionKey="CountryNameCn" />
                <!-- <Select v-model="SearchForm.CountryCode" @on-change="OnClearSelect('CountryCode')" filterable clearable class="P-W-200" placeholder="筛选国家">
                  <Option v-for="(Item,Index) in DropCountry" :value="Item.CountryCode" :key="Index">{{ Item.CountryNameCn }}</Option>
                </Select> -->
                <span class="P-ML-10 P-Inline-Block">交易时间区间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
              <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropSearchKeyType" />
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in DropSearchKeyType" :value="$Enums.Logistics.TransactionRecordKeyType[Item]" :key="Index">{{Item}}</Option>
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
          <Row ref="OperateBtnGroup" class="OperateBtnGroup P-MB-10">
            <!-- 导出数据 -->
            <Button v-if="Powers.TransactionRecordExport" @click="ExportTransactionRecord" type="primary" class=" P-MR-10">导出交易记录</Button>
            <!-- 退回费用  -->
            <TransactionRecordReturn ref="TransactionRecordReturn"
                                     :PropSelected="TableSelected"
                                     @emit-change="OperateEmitChange"
            ></TransactionRecordReturn>
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
  import Interface from "@/assets/Interface/Logistics";

  @Component({
    name: "TransactionRecord",
    components: {
      TransactionRecordReturn: () => import("@/components/Logistics/Transaction/TransactionRecordReturn.vue")
    }
  })

  export default class TransactionRecord extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$UI.Loading.Show();

      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["TransactionRecordExport", "TransactionRecordRefund"]))

      this.$set(this, "DropMethodId", await this.GetDropList<number, PInterface.KV>(this.$Server.Logistics, this.$Api.ChannelDropList, 0));
      this.$set(this, "DropWarehouse", await this.GetDropList<string, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, ""));
      this.$set(this, "DropCountry", await this.GetDropList<string, PInterface.KV>(this.$Server.Settings, this.$Api.CountryList, ""));

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
      this.$set(this, "SearchForm", new Interface.TransactionRecordSearchGroup());
      this.GetTableList();
    }

    private SearchList(): void {
      this.Pager.PageIndex = 1;
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableCancelSelected();
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Logistics,
        Api: {
          Address: this.$Api.TransactionGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            CountryCode: this.SearchForm.CountryCode,
            MethodId: this.SearchForm.MethodId,
            SearchKey: this.SearchForm.SearchKey,
            SearchKeyType: this.SearchForm.SearchKeyType,
            TransactionType: this.SearchForm.TransactionType,
            WarehourseId: this.SearchForm.WarehourseId,
            EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
            StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : ""
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

    //获取列表复选框选中的数据
    private TableGetSelected(data: Interface.TransactionRecordTable[]): void {
      this.$set(this, "TableSelected", data)
    }

    private TableCancelSelected(): void {
      (this.$refs["TableList"] as any).selectAll(false);
      this.$set(this, "TableSelected", [])
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

    // Res: 重置列表  Type: 操作类型
    private OperateEmitChange(Res: boolean): void {
      if (Res) {
        this.GetTableList();
      }
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

    private ExportTransactionRecord(): void {
      if (this.SearchForm.StartTime === "" || this.SearchForm.EndTime === "") {
        this.$UI.Tips.Floating("warning", "请选择开始时间和结束时间");
        return;
      }
      console.log(+new Date(this.SearchForm.EndTime));
      if ((+new Date(this.SearchForm.EndTime) - +new Date(this.SearchForm.StartTime)) / 86400000 > 31) {
        this.$UI.Tips.Floating("warning", "筛选时间区间最多只能31天");
        return
      }
      if (+new Date(this.SearchForm.StartTime) > +new Date(this.SearchForm.EndTime)) {
        this.$UI.Tips.Floating("warning", "开始时间不能晚于结束时间");
        return
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Logistics,
        Api: {
          Address: this.$Api.TransactionExport,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            CountryCode: this.SearchForm.CountryCode,
            MethodId: this.SearchForm.MethodId,
            SearchKey: this.SearchForm.SearchKey,
            SearchKeyType: this.SearchForm.SearchKeyType,
            TransactionType: this.SearchForm.TransactionType,
            WarehourseId: this.SearchForm.WarehourseId,
            EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
            StartTime: this.SearchForm.StartTime ? this.$UI.Render.NewDate(this.SearchForm.StartTime, true) : ""
          }
        },
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.$Modal.success({
              title: "操作成功",
              content: "创建导出库存流水任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。"
            })
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }


    private AccurateSearch: boolean = false;
    private SearchForm: Interface.TransactionRecordSearchGroup = new Interface.TransactionRecordSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.TransactionRecordTable[] = [];
    private TableSelected: Interface.TransactionRecordTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      title: "客户编号",
      key: "CustomerCode",
      width: 100,
    }, {
      title: "操作单号",
      width: 135,
      key: "OrderCode"
    }, {
      title: "交易类型",
      width: 90,
      key: "TransactionType",
      render: (h, params) => {
        return h("span", this.$Enums.Logistics.TransactionRecordType[params.row.TransactionType]);
      }
    }, {
      title: "目的国家/物流渠道",
      render: (h, params) => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "国"),
            h("span", params.row.CountryNameCn + " (" + params.row.CountryCode + ")")
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "渠"),
            h("span", {}, params.row.MethodName)
          ])
        ])
      }
    }, {
      title: "包裹号/跟踪号",
      render: (h, params) => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "包"),
            h("span", params.row.MethodApiCode || "-")
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "跟"),
            h("span", params.row.TrackingNumber || "-")
          ])
        ])
      }
    }, {
      title: "重量(kg)",
      key: "",
      render: (h, params) => {
        return h("span", parseFloat(params.row.Weight).toFixed(3))
      }
    }, {
      title: "费用(CNY)/成本(CNY)",
      width: 155,
      render: (h, params) => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "费"),
            h("span", params.row.TransactionAmount)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "本"),
            h("span", params.row.TransactionCost)
          ])
        ])
      }
    }, {
      title: "操作仓库",
      key: "WarehouseName"
    }, {
      title: "操作人",
      key: "Operator"
    }, {
      title: "客户余额(CNY)",
      width: 160,
      key: "CustomerBalance"
    }, {
      title: "备注",
      key: "Remark",
      render: (h: any, params: any): any => {
        return params.row.Remark ? h("Tooltip", {
          props: {
            "content": params.row.Remark
          },
          class: "P-W-100-Percent P-LINE-1"
        }, params.row.Remark) : h("span", "-");
      }
    }, {
      title: "交易时间", width: 160,
      render: (h, params) => {
        return h("span", this.$UI.Render.Date(params.row.OperateTime, true));
      }
    }];

    private DropWarehouse: PInterface.KV[] = [];// 仓库下拉
    private DropCountry: PInterface.KV[] = [];// 国家下拉
    private DropMethodId: PInterface.KV[] = [];// 物流渠道下拉
    private DropTransactionType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TransactionRecordType);
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TransactionRecordKeyType);

    private Powers: PInterface.Power = {} // 权限
  }
</script>
<style lang="less"></style>