<template>
  <div class="P-Inline-Block">
    <Col>
      <Modal v-model="IsShowModal" title="装箱明细" @on-cancel="ClearModal" :mask-closable="false" :width="1200">
        <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
          <FormItem class="P-MB-0">
            <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
            <Select v-model="SearchForm.SearchKeyType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" :options="DropSearchKeyType" />
              <!-- <Select v-model="SearchForm.SearchKeyType" @on-change="OnClearSelect('SearchKeyType')" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" filterable clearable>
                <Option v-for="(Item,Index) in DropSearchKeyType" :value="$Enums.Warehouse.OutLibLogDetailKeyType[Item]" :key="Index">{{Item}}</Option>
              </Select> -->
              <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <FormItem class="P-MB-0">
            <Button type="warning" @click="ResetList">重置</Button>
          </FormItem>
        </Form>
        <Table ref="TableList" :height="550" :columns="TableRowHead" :data="TableList" size="small" stripe class="P-MT-10 P-MB-10"></Table>
        <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
        <div slot="footer">
          <Button @click="ClearModal">返回</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Watch, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import InterfaceShipOrder from "@/assets/Interface/ShipOrder";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "OutLibLogDetail",
    components: {}
  })
  export default class OutLibLogDetail extends Vue {
    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    // 打开模态框
    private OpenModal({BoxCode, Id}: {
      BoxCode: string,
      Id: number
    }): void {
      this.IsShowModal = true;
      this.$set(this, "SearchForm", new Interface.OutLibLogDetailSearchGroup(BoxCode, Id));
      this.GetTableList();
    }

    //  切换列表条数
    private ChangePageSize(n: number): void {
      this.$set(this.Pager, 'PageSize', n);
      this.GetTableList();
    }

    //  切换列表页码
    private ChangePage(n: number): void {
      this.$set(this.Pager, 'PageIndex', n);
      this.GetTableList();
    }

    private SearchList(): void {
      this.$set(this.Pager, "PageIndex", 1);
      this.GetTableList();
    }

    private ResetList(): void {
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this.SearchForm, "SearchKey", "");
      this.$set(this.SearchForm, "SearchKeyType", "");
      this.GetTableList();
    }

    private OnClearSelect(S: string): void {
      if ((this as any).SearchForm[S] == undefined) {
        this.$set(this.SearchForm, S, "");
      }
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.BoxGetBoxItemList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: this.SearchForm
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
            this.TableList.push(...Res.Data.PageModel.Items)
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private ClearModal(): void {
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.OutLibLogDetailSearchGroup());
      this.IsShowModal = false;
    }

    private IsShowModal: boolean = false;
    private SearchForm: Interface.OutLibLogDetailSearchGroup = new Interface.OutLibLogDetailSearchGroup();
    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据

    private TableList: Interface.OutLibLogDetailTable[] = [];
    private DropSearchKeyType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.OutLibLogDetailKeyType);

    private TableRowHead: PInterface.TableCol[] = [{
      title: "发货单号",
      key: "OrderCode"
    }, {
      title: "国家",
      key: "",
      render: (h, params) => {
        return h("span", params.row.CountryCode.CountryNameCn);
      }
    }, {
      title: "物流渠道",
      key: "ShippingMethodName"
    }, {
      title: "跟踪号",
      key: "TrackingNumber"
    }, {
      title: "重量(Kg.)",
      key: "Weight",
      width: 100
    }, {
      title: "头程发货渠道",
      key: "",
      width: 120,
      render: (h, params) => {
        return h("span", this.$Enums.Warehouse.FirstShippingMethodType[params.row.FirstShippingMethodType]);
      }
    }, {
      title: "头程运单号",
      key: "FirstShipOrderCode",
      width: 120
    }];

  }
</script>