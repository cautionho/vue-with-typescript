<!-- 渠道出库汇总 -->
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
              <Select v-model="SearchForm.WareHouseId" class="P-W-200" placeholder="筛选仓库" :options="DropWarehouse" />
              <Select v-model="SearchForm.ShippingMethodId" class="P-W-200 P-ML-10" placeholder="筛选物流渠道" optionValKey="Id" optionKey="Name" :options="DropShipMethod" />
                <!-- <Select v-model="SearchForm.WareHouseId" @on-change="OnClearSelect('WareHouseId')" filterable clearable class="P-W-200" placeholder="筛选仓库">
                  <Option v-for="(Item, Index) in DropWarehouse" :value="Item.Value" :key="Item.Value">{{ Item.Key }}</Option>
                </Select>
                <Select v-model="SearchForm.ShippingMethodId" @on-change="OnClearSelect('ShippingMethodId')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选物流渠道">
                  <Option v-for="(Item,Index) in DropShipMethod" :value="Item.Id" :key="Index">{{ Item.Name }}</Option>
                </Select> -->
                <span class="P-ML-10 P-Inline-Block">发货时间：</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.ShipBeginTime" type="datetime" placeholder="筛选开始时间"></DatePicker>
                <span class="P-ML-5 P-Inline-Block">-</span>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.ShipEndTime" type="datetime" placeholder="筛选结束时间"></DatePicker>
                <Select v-model="SearchForm.Country" class="P-W-200 P-ML-10" placeholder="筛选国家" optionValKey="CountryCode" optionKey="CountryNameCn" :options="DropCountry" />
                <Select v-model="SearchForm.Platform" class="P-W-200 P-ML-10" placeholder="筛选平台" :options="DropPlatform" />
                <Select v-model="SearchForm.StoreId" class="P-W-200 P-ML-10" placeholder="筛选店铺" :options="DropStore" />
                <!-- <Select v-model="SearchForm.Country" @on-change="OnClearSelect('Country')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选国家">
                  <Option v-for="Item in DropCountry" :value="Item.CountryCode" :key="Item.CountryNameCn">{{Item.CountryNameCn}}</Option>
                </Select>
                <Select v-model="SearchForm.Platform" @on-change="OnClearSelect('Platform')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选平台">
                  <Option v-for="(Item,Index) in DropPlatform" :value="$Enums.Sales.Platform[Item]" :key="$Enums.Sales.Platform[Item]">{{ Item }}</Option>
                </Select>
                <Select v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable class="P-W-200 P-ML-10" placeholder="筛选店铺">
                  <Option v-for="(Item, Index) in DropStore" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
                </Select> -->
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10 P-MB-0">
              <Button type="primary" @click="GetTableList">搜索</Button>
            </FormItem>
            <FormItem class="P-MB-0">
              <Button type="warning" @click="ResetList">重置</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :span="24">
          <Row ref="OperateBtnGroup" class="OperateBtnGroup"></Row>
        </Col>
        <Col :span="24">
          <Table ref="TableList" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" show-summary :summary-method="TableSummary" size="small" stripe></Table>
        </Col>
      </Row>
    </Col>
  </Row>
</template>
<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "MethodShiped",
    components: {}
  })

  export default class MethodShiped extends Vue {
    @Watch("SearchForm.WareHouseId")
    private WatchWareHouseId(Id: number | ""): void {
      if (Boolean(Id)) {
        this.GetShipMethodDrop();
      } else {
        this.$set(this.SearchForm, "ShippingMethodId", "");
        this.DropShipMethod.splice(0);
      }
    }

    @Watch("SearchForm.Platform")
    private WatchPlatform(Id: number | ""): void {
      if (Boolean(Id)) {
        this.GetStoreDrop();
      } else {
        this.$set(this.SearchForm, "StoreId", "");
        this.DropStore.splice(0);
      }
    }

    private mounted() {
      this.GetPoints();
    }

    // 获取物流渠道
    private GetShipMethodDrop(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Logistics,
        Api: {
          Address: this.$Api.ChannelDropList
        },
        Data: this.SearchForm.WareHouseId,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.DropShipMethod.push(...Res.Data.DropList);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 获取店铺下拉
    private GetStoreDrop(): void {
      let Type = this.SearchForm.Platform;
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.Sales[Type].StoreDrop,
          Login: true
        },
        Data: "",
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.DropStore.push(...Res.Data.DropList);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "DropWarehouse", await this.GetDropList<object, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, {IsEnable: true, Type: [1]}));
      this.$set(this, "DropCountry", await this.GetDropList<string, PInterface.KV>(this.$Server.Settings, this.$Api.CountryList, ""));

      this.GetShipMethodDrop();
      this.ResetList();
    }

    // 合计
    private TableSummary({columns, data}: { columns: any, data: any }): void {
      const Obj: any = {};
      columns.forEach((Item: PInterface.TableCol, Index: number) => {
        const Key = (Item.key as string)
        switch (Index) {
          case 0:
            Obj[Key] = {
              key: "",
              value: ""
            };
            break;
          case 1:
            Obj[Key] = {
              key: "",
              value: "合计"
            };
            break;
          case 2:
            Obj[Key] = {
              key: "",
              value: data.reduce((Per: number, Cur: Interface.MethodShipedTable) => Per + Cur.Number, 0)
            };
            break;
        }
      })
      return Obj;
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
      this.$set(this, "SearchForm", new Interface.MethodShipedSearchGroup());
      this.$set(this.SearchForm, "ShipBeginTime", this.$UI.Render.NewDate(new Date().setHours(0, 0, 0, 0), true));
      this.$set(this.SearchForm, "ShipEndTime", this.$UI.Render.NewDate(new Date().setHours(23, 59, 59, 59), true));

      this.GetTableList();
    }

    private GetTableList(): void {
      if (this.SearchForm.ShipBeginTime == "" || this.SearchForm.ShipEndTime == "") {
        this.$UI.Tips.Floating("warning", `请选择发货时间区间`);
        return;
      }
      // 开始时间不能晚于结束时间
      let BeginTime = new Date(this.SearchForm.ShipBeginTime).valueOf()
      let EndTime = new Date(this.SearchForm.ShipEndTime).valueOf()
      if (BeginTime > EndTime) {
        this.$UI.Tips.Floating("warning", `开始时间不能晚于结束时间`);
        return
      }
      if ((EndTime - BeginTime) / 86400000 > 31) {
        this.$UI.Tips.Floating("warning", `仅支持筛选31天内的数据`);
        return
      }
      this.TableList.splice(0);
      this.AccurateSearch = false;
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.MethodShipedPerfomance,
          Login: true
        },
        Data: {
          WareHouseId: Number(this.SearchForm.WareHouseId),
          ShipBeginTime: this.SearchForm.ShipBeginTime ? this.$UI.Render.NewDate(this.SearchForm.ShipBeginTime, true) : "",
          ShipEndTime: this.SearchForm.ShipEndTime ? this.$UI.Render.NewDate(this.SearchForm.ShipEndTime, true) : "",
          ShippingMethodId: Number(this.SearchForm.ShippingMethodId),
          Country: this.SearchForm.Country,
          Platform: Number(this.SearchForm.Platform),
          StoreId: Number(this.SearchForm.StoreId)
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.TableList.push(...Res.Data.Data.map((Item: Interface.MethodShipedTable, Index: number) => {
              Item.Index = Index + 1;
              return Item
            }));
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private CalculateTbHeight(): number {
      let H = window.innerHeight - 175;
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

    private OnClearSelect(Key: string): void {
      if ((this as any).SearchForm[Key] == undefined) {
        this.$set(this.SearchForm, Key, "");
      }
    }

    private TriggerSearch(): void {
      this.AccurateSearch = !this.AccurateSearch;
    }

    private AccurateSearch: boolean = false;
    private SearchForm: Interface.MethodShipedSearchGroup = new Interface.MethodShipedSearchGroup();

    private TableList: Interface.PickBatchTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "编号",
      type: "index",
      key: "Index",
      width: 60,
    }, {
      title: "物流渠道",
      key: "Name",
    }, {
      title: "订单数量",
      key: "Number",
    }];

    private DropWarehouse: PInterface.KV[] = []; // 仓库下拉
    private DropShipMethod: PInterface.IdName[] = []; // 物流渠道
    private DropCountry: PInterface.CountryEntity[] = []; //国家下拉
    private DropPlatform: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform); // 平台
    private DropStore: PInterface.KV[] = []; // 筛选店铺
  }
</script>
<style lang="less"></style>