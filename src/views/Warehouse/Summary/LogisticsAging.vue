<!-- 物流时效 -->
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
                <Select v-model="SearchForm.PlatformId" class="P-W-200 P-MR-10" placeholder="筛选平台" :options="PlatformDrop" />
                <Select v-model="SearchForm.StoreId" class="P-W-200 P-MR-10" placeholder="筛选店铺" :options="StoreDrop" />
                <Select v-model="SearchForm.ShippingMethodId" multiple class="P-W-200" placeholder="筛选物流" :options="ShippingMethodDrop" optionValKey="Id" optionKey="Name" />
                <!-- <Select v-model="SearchForm.PlatformId" @on-change="OnClearSelect('PlatformId')" filterable clearable class="P-W-200 P-MR-10" placeholder="筛选平台">
                  <Option v-for="(Item, Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
                </Select>
                <Select v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable class="P-W-200 P-MR-10" placeholder="筛选店铺">
                  <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
                </Select>
                <Select v-model="SearchForm.ShippingMethodId" @on-change="OnClearSelect('ShippingMethodId')" multiple filterable clearable class="P-W-200" placeholder="筛选物流">
                  <Option v-for="(Item,Index) in ShippingMethodDrop" :value="Item.Id" :key="Item.Name">{{ Item.Name }}</Option>
                </Select> -->
                <span class="P-ML-10 P-Inline-Block">付款时间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.BeginPayTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndPayTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Button type="primary" @click="SearchList">统计汇总</Button>
            </FormItem>
            <FormItem class="P-MB-0">
              <Button type="warning" @click="ResetList">重置</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :span="24">
          <Row ref="OperateBtnGroup" class="OperateBtnGroup">
            <Button v-if="Powers.ExportLogListData" @click="ExportData(1)" type="primary" class="P-MB-10 P-MR-10">导出列表数据</Button>
            <Button v-if="Powers.ExportNotQualified" @click="ExportData(2)" type="primary" class="P-MB-10">导出未达标订单数据</Button>
          </Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" :columns="TableRowHead" :data="TableList" :Data-ShowPlatform="Boolean(SearchForm.PlatformId)" :span-method="TableRowColSpan" :height="CalculateTbHeight()" size="small" stripe></Table>
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
    name: "LogisticsAging",
    components: {}
  })

  export default class LogisticsAging extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["ExportLogListData", "ExportNotQualified"]));

      this.$set(this, "ShippingMethodDrop", await this.GetDropList<number, PInterface.KV>(this.$Server.Logistics, this.$Api.ChannelDropList, 0))
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
      this.$set(this, "SearchForm", new Interface.PickBatchSearchgroup());
      this.TableList.splice(0);
    }

    private SearchList(): void {
      if (this.SearchForm.ShippingMethodId.length == 0) {
        this.$UI.Tips.Floating("warning", "请选择物流渠道");
        return;
      }
      if (this.SearchForm.BeginPayTime == "") {
        this.$UI.Tips.Floating("warning", "请选择付款开始时间");
        return;
      }
      if (this.SearchForm.EndPayTime == "") {
        this.$UI.Tips.Floating("warning", "请选择付款结束时间");
        return;
      }
      let StartTimes = new Date(this.SearchForm.BeginPayTime).valueOf();
      let EndTimes = new Date(this.SearchForm.EndPayTime).valueOf();
      if (StartTimes > EndTimes) {
        this.$UI.Tips.Floating("warning", "开始时间不能晚于结束时间");
        return;
      }
      if (((EndTimes - StartTimes) / 86400000) > 7) {
        this.$UI.Tips.Floating("warning", "付款时间跨度不能超过7天");
        return
      }
      this.AccurateSearch = false;
      this.GetTableList();
    }

    private GetTableList(): void {
      if (this.SearchForm.PlatformId == "") {
        if (this.TableRowHead.length == 7) {
          this.TableRowHead.shift();
        }
      } else {
        if (this.TableRowHead.length == 6) {
          this.TableRowHead.unshift(this.TableRowHead_Platform);
        }
      }

      this.TableList.splice(0);
      let PostData = {
        PlatformId: this.SearchForm.PlatformId,
        StoreId: this.SearchForm.StoreId,
        ShippingMethodId: this.SearchForm.ShippingMethodId,
        BeginPayTime: this.$UI.Render.NewDate(this.SearchForm.BeginPayTime, true),
        EndPayTime: this.$UI.Render.NewDate(this.SearchForm.EndPayTime, true)
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Logistics,
        Api: {
          Address: this.$Api.GetLogisticsAgingList,
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.ShowPlatformTitle = Boolean(this.SearchForm.PlatformId);
            this.ChangeTableConstruction(res.Data.Data);
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private ChangeTableConstruction(DataList: any): void {
      let List: Interface.LogisticsAgingTable[] = [];
      for (let Item of DataList) {
        let ColSpan = Item.Value.length
        for (let i = 0; i < Item.Value.length; i++) {
          let ObJ = JSON.parse(JSON.stringify(Item.Value[i]));
          if (ColSpan == 1) {
            ObJ.ColSpan = 1;
          } else {
            ObJ.ColSpan = i == 0 ? ColSpan : 0;
          }
          List.push(ObJ);
        }
      }
      this.TableList.push(...List);
    }

    private TableRowColSpan({row, column, rowIndex, columnIndex}: { row: any, column: any, rowIndex: number, columnIndex: number }) {
      if (columnIndex === 0) {
        if (this.ShowPlatformTitle) {
          if (columnIndex == 0) {
            return [row.ColSpan, 1];
          }
        }
      }
    }

    private ExportData(Type: number): void {
      if (this.TableList.length == 0) {
        this.$UI.Tips.Floating("warning", `当前列表为空，请先统计汇总数据再进行导出操作`);
        return
      }

      let PostData = {
        PlatformId: this.SearchForm.PlatformId,
        StoreId: this.SearchForm.StoreId,
        ShippingMethodId: this.SearchForm.ShippingMethodId,
        BeginPayTime: this.$UI.Render.NewDate(this.SearchForm.BeginPayTime, true),
        EndPayTime: this.$UI.Render.NewDate(this.SearchForm.EndPayTime, true)
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Logistics,
        Api: {
          Address: [, this.$Api.ExportLogisticsAging, this.$Api.ExportNotQualified][Type],
          Login: true
        },
        Data: PostData,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            window.open(this.$Server.Logistics + "/" + Res.Data.Url);
            this.$UI.Tips.Floating("success", `导出数据成功`);
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private CalculateTbHeight(): number {
      let H = window.innerHeight - 155;
      if (this.$refs["SearchForm"]) {
        H -= (this.$refs["SearchForm"] as any).$el.offsetHeight;
      }
      if (this.$refs["OperateBtnGroup"]) {
        H -= (this.$refs["OperateBtnGroup"] as any).$el.offsetHeight;
      }
      return H;
    }

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.LogisticsAgingSearchGroup = new Interface.LogisticsAgingSearchGroup();
    private ShowPlatformTitle: boolean = false;

    private TableList: Interface.LogisticsAgingTable[] = [];
    private TableRowHead_Platform: PInterface.TableCol = {
      title: "店铺",
      key: "StoreName"
    };
    private TableRowHead: PInterface.TableCol[] = [{
      title: "物流渠道",
      key: "ShippingMethodName"
    }, {
      title: "订单总数",
      key: "TotalOrderNum"
    }, {
      title: "24小时发货率",
      render: (h, params): any => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "量"),
            h("span", params.row.H24)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "率"),
            h("span", (params.row.H24 / params.row.TotalOrderNum * 100).toFixed(2) + "%")
          ])
        ])
      }
    }, {
      title: "48小时预上网率",
      render: (h, params) => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "量"),
            h("span", params.row.H481)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "率"),
            h("span", (params.row.H481 / params.row.TotalOrderNum * 100).toFixed(2) + "%")
          ])
        ])
      }
    }, {
      title: "48小时上网率",
      render: (h: any, params: any): string => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "量"),
            h("span", params.row.H482)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "率"),
            h("span", (params.row.H482 / params.row.TotalOrderNum * 100).toFixed(2) + "%")
          ])
        ])
      }
    }, {
      title: "5天妥投率",
      render: (h: any, params: any): string => {
        return h("div", [
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "量"),
            h("span", params.row.D5)
          ]),
          h("p", [
            h("span", {class: "P-Table-Tip P-BG-Primary"}, "率"),
            h("span", (params.row.D5 / params.row.TotalOrderNum * 100).toFixed(2) + "%")
          ])
        ])
      }
    }];

    private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
    private StoreDrop: PInterface.KV[] = [];
    private ShippingMethodDrop: PInterface.IdName[] = [];

    private Powers: PInterface.Power = {} // 权限
  }
</script>
<style lang="less"></style>