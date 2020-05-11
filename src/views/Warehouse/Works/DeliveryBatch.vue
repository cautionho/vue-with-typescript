<!-- 发货批次 -->
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
                <Select v-model="SearchForm.WareHouseId" @on-change="OnClearSelect('WareHouseId')" class="P-W-200" placeholder="筛选仓库" :options="DropWarehouse" />
                <!-- <Select v-model="SearchForm.WareHouseId" @on-change="OnClearSelect('WareHouseId')" filterable clearable class="P-W-200" placeholder="筛选仓库">
                  <Option v-for="(Item, Index) in DropWarehouse" :value="Item.Value" :key="Item.Value">{{ Item.Key }}</Option>
                </Select> -->
                <Select v-model="SearchForm.ShipMethodId" class="P-W-200 P-ML-10" placeholder="先筛选发货仓再选物流渠道" :options="DropShipMethod" optionValKey="Id" optionKey="Name" />
                <!-- <Select v-model="SearchForm.ShipMethodId" @on-change="OnClearSelect('ShipMethodId')" filterable clearable class="P-W-200 P-ML-10" placeholder="先筛选发货仓再选物流渠道">
                  <Option v-for="(Item,Index) in DropShipMethod" :value="Item.Id" :key="Index">{{ Item.Name }}</Option>
                </Select> -->
                <span class="P-ML-10 P-Inline-Block">发货时间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.BeginTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
                <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropSearchKeyType" />
                <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                  <Option v-for="(Item,Index) in DropSearchKeyType" :value="$Enums.Warehouse.BeliveryBatchKeyType[Item]" :key="Index">{{Item}}</Option>
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
            <PrintSendOrder :PropSelected="TableSelected" class="P-MR-10 P-MB-10"></PrintSendOrder>
            <Button type="primary" class="P-MR-10 P-MB-10" @click="PrintEdisOrder">打印eDIS交接单</Button>
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
  import {Component, Vue, Watch} from "_vue-property-decorator@8.3.0@vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";
  import GetLodop from "@/assets/LODOP/LodopFuncs";
  import DeliveryBatchExpand from "@/components/Warehouse/OrderWork/DeliveryBatch_Expand.vue"

  @Component({
    name: "DeliveryBatch",
    components: {
      PrintSendOrder: () => import("@/components/Warehouse/OrderWork/PrintSendOrderList.vue")
    }
  })

  export default class DeliveryBatch extends Vue {
    @Watch("SearchForm.WareHouseId")
    WatchWareHouseId(Val: number): void {
      this.DropShipMethod.splice(0);
      if (Val) {
        this.GetDropList<number, PInterface.IdName[]>(this.$Server.Logistics, this.$Api.ChannelDropList, Val).then((Res: PInterface.IdName[]) => {
          this.DropShipMethod.push(...Res);
        })
      } else {
        this.$set(this.SearchForm, "ShipMethodId", "");
      }
    }

    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "DropWarehouse", await this.GetDropList<boolean, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true));

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
            if (!Res.IsSuccess) {
              this.$Request.Error(Res);
            }
            resolve(Res.Data.DropList || [])
          }
        })
      })
    }

    private ResetList(): void {
      this.AccurateSearch = false;
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.DeliveryBatchSearchGroup());
      this.GetTableList();
    }

    private SearchList(): void {
      let Start = new Date(this.SearchForm.BeginTime).valueOf();
      let End = new Date(this.SearchForm.EndTime).valueOf();
      if (Start > End) {
        this.$UI.Tips.Floating("warning", `开始日期不能晚于结束日期`);
        return
      }
      this.Pager.PageIndex = 1;
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.TableCancelSelected();
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.DeliveryBatchGetList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            WareHouseId: Number(this.SearchForm.WareHouseId),
            ShipMethodId: Number(this.SearchForm.ShipMethodId),
            BeginTime: this.SearchForm.BeginTime ? this.$UI.Render.NewDate(this.SearchForm.BeginTime, true) : "",
            EndTime: this.SearchForm.EndTime ? this.$UI.Render.NewDate(this.SearchForm.EndTime, true) : "",
            SearchKeyType: Number(this.SearchForm.SearchKeyType),
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

    private TableGetSelected(Data: Interface.BlacklistTable[]): void {
      this.$set(this, "TableSelected", Data)
    }

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private PrintEdisOrder(): void {
      if (this.TableSelected.length == 0) {
        this.$UI.Tips.Floating("warning", "请选择发货批次进行打印eDIS交接单操作");
        return
      }
      if (this.TableSelected.some(((Item: Interface.DeliveryBatchTable) => Item.ShipMethodName.toLowerCase().search("edis") < 0))) {
        this.$UI.Tips.Floating("warning", "请选择eDIS物流相关渠道进行操作");
        return;
      }
      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否确定打印eDIS交接单?",
        Callback: (Res: boolean): void => {
          if (Res) {
            this.PlayPrintEdisOrder();
          }
        }
      })
    }

    private PlayPrintEdisOrder(): void {
      let Sum = 0;
      let NewestBatchCode = "";
      let Num: PInterface.KV[] = [{Key: "economical", Value: 0}, {Key: "standard", Value: 0}, {Key: "lightSmall", Value: 0}];
      let BatchCode: number[] = [];
      let Height = 0;
      let TableHtml = ["<table style=\"width:100%;text-align:center;\" border=\"1\" cellpadding=\"6\" cellspacing=\"\"><tr><th>序号</th><th>产品</th><th>贸易方式</th><th>包裹数</th></tr>"];
      for (let Item of this.TableSelected) {
        BatchCode.push(Number(Item.BatchCode.slice(3)));
        Sum += Item.TotalShipOrder;
        if (Item.ShipMethodName == "eDIS-SpeedPAK标准型服务") {
          (Num[1].Value as number) += Item.TotalShipOrder;
        } else if (Item.ShipMethodName == "eDIS-SpeedPAK轻小件") {
          (Num[2].Value as number) += Item.TotalShipOrder;
        } else {
          (Num[0].Value as number) += Item.TotalShipOrder;
        }
      }
      NewestBatchCode = "SEN" + Math.max(...BatchCode);

      let Idx = 0;
      Num.forEach((Item, index) => {
        if (Item.Value != 0) {
          Idx++;
          Height += 1
          TableHtml.push("<tr><td>" + (Idx) + "</td><td>" + (Item.Key === "standard" ? "标准" : Item.Key === "economical" ? "经济" : Item.Key === "lightSmall" ? "轻小件" : "-") + "</td><td>DDU</td><td>" + Item.Value + "</td></tr>")
        }
      })
      TableHtml.push("</table>")
      let LODOP = GetLodop();
      LODOP.NewPage();
      LODOP.PRINT_INITA("0mm", "0mm", "211.67mm", "297mm", "edis交接单");
      LODOP.SET_PRINT_PAGESIZE(0, 0, 2100, "297mm");
      LODOP.ADD_PRINT_TEXT("19.31mm", "64.56mm", "90.49mm", "32.01mm", "橙联Orange Connex\r\n     ebay 交接单");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 23);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT("55.83mm", "16.14mm", "55mm", "5.29mm", "流水单号：" + NewestBatchCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("55.3mm", "112.98mm", "60.33mm", "5.29mm", "IS账号: yxw850818@163.com");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("69.32mm", "16.14mm", "32.28mm", "5.29mm", "联系人: 温志峰");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("69.59mm", "112.98mm", "60.33mm", "5.29mm", "联系方式: 17708646436");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("84.67mm", "16.14mm", "35mm", "5.29mm", "包裹总数: " + Sum);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("86.52mm", "112.98mm", "59.53mm", "16.4mm", "联系地址：中国大陆 广东省 佛山市 禅城区 南庄镇紫南村信德路7号");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT(["", "136.52mm", "142.52mm", "151.52mm"][Height], "67.06mm", "118.64mm", "5.29mm", "*注：揽收数量以实际揽收数量为准，此表格揽收数量仅供参考");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TABLE("112.43mm", "10%", "80%", "52.46mm", TableHtml.join(""));
      LODOP.ADD_PRINT_TEXT("164.57mm", "17.2mm", "26.46mm", "5.29mm", "实际交接数量:");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("173.04mm", "17.2mm", "26.46mm", "5.29mm", "小包数：");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("190.5mm", "17.2mm", "26.46mm", "5.29mm", "卖家签名：");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("173.3mm", "66.68mm", "26.46mm", "5.29mm", "大包数：");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("190.24mm", "66.68mm", "26.46mm", "5.29mm", "揽收员签名：");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("172.77mm", "118mm", "32.54mm", "5.29mm", "交易总重量 （g）:");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
      LODOP.ADD_PRINT_TEXT("189.71mm", "118mm", "32.54mm", "5.29mm", "日期：");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

      LODOP.PRINT();
      this.$UI.Tips.Floating("success", "打印eDIS交接单成功");
    }

    private OperateGroup(Type: number, Index: number): void {
      this.TableCancelSelected();
      this.$set(this, "TableSelected", JSON.parse(JSON.stringify([this.TableList[Index]])));
      switch (Type) {
        case 1:
          (this.$refs["BatcheDetail"] as Vue).$Trigger({
            IsShowModal: true,
            SelectedDetail: this.TableSelected[0]
          });
          break;
        case 2:
          (this.$refs["DoneBatche"] as Vue).$Trigger({
            SelectedData: this.TableSelected
          });
          break;
      }
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.DeliveryBatchSearchGroup = new Interface.DeliveryBatchSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.DeliveryBatchTable[] = [];
    private TableSelected: Interface.DeliveryBatchTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      type: "selection", width: 60, align: "center"
    }, {
      type: "expand", width: 40, align: "center",
      render: (h: any, Params: any): string => {
        return h(DeliveryBatchExpand, {
          props: {
            PropData: Params.row.Items
          }
        })
      }
    }, {
      title: "出库批次",
      key: "BatchCode"
    }, {
      title: "仓库",
      key: "WareHouseName"
    }, {
      title: "物流渠道",
      key: "ShipMethodName",
    }, {
      title: "订单数",
      key: "TotalShipOrder",
    }, {
      title: "重量",
      render: (h: any, params: any): any => {
        return h("span", params.row.TotalWeight + " kg");
      }
    }, {
      title: "操作人",
      key: "Operator",
      width: 130,
    }, {
      title: "发货时间", width: 160,
      render: (h: any, params: any): any => {
        return h("span", this.$UI.Render.Date(params.row.DeliveryTime, true));
      }
    }];

    private DropWarehouse: PInterface.KV[] = [];  // 仓库下拉
    private DropShipMethod: PInterface.IdName[] = []; // 物流渠道
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.BeliveryBatchKeyType);  //关键字下拉
    private OperateDrop: PInterface.KV[] = [{Key: "查看", Value: 1}] // 下拉操作项

    private PlayPrint: boolean = false;
  }
</script>
<style lang="less"></style>