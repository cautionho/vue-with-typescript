<!-- 平日店铺销量组件 -->
<template>
  <Row class="DailyStoreSales">
    <Collapse @on-change="ChangeDailyStore">
      <Panel name="DailyStoreSales" hide-arrow class="Box-Shadow">
        <span class="P-Text-Info P-FZ-16 P-FW-Bold">平台店铺日销量</span>
        <div slot="content" style="height: 300px;">
          <div class="container">
            <table cellpadding="0" cellspacing="0" border="0" class="dailyTable P-W-100-Percent">
              <thead>
                <tr>
                  <th style="width:14%;">
                    <Select v-model="SearchForm.Platform" class="P-TA-L" placeholder="筛选平台" :options="PlatformDrop" />
                  </th>
                  <th style="width:30%;">
                    <Select v-model="SearchForm.StoreId" class="P-TA-L" placeholder="筛选店铺" ref="Store" :options="StoreDrop" />
                  </th>
                  <th style="width:13%;">店铺账号</th>
                  <th style="width:17%;">订单量[列表总计{{DailySalesData.length>0 ? TotalOrder : 0}}]</th>
                  <th style="width:26%;">销售金额（USD）[列表总计{{DailySalesData.length>0 ? TotalAmount : 0}}]</th>
                </tr>
              </thead>
              <tbody v-if="ShowValue">
                <tr>
                  <td colspan="4" style="height:100px;text-align:center;"> 暂无数据</td>
                </tr>
              </tbody>
            </table>
            <div class="dailyTableContent" v-if="!ShowValue">
              <table cellpadding="0" cellspacing="0" border="0" class="dailyTable P-W-100-Percent">
                <tbody v-for="Itm in DailySalesData">
                  <tr v-for="(X,Y) in Itm.Value">
                    <td v-if="Y==0" :rowspan="Itm.Value.length" class="borR" :style="{'width':'14%'}">{{ PlatformDrop.find(Item=>Item.Value === Itm.Key).Key }}</td>
                    <td class="borB" :style="{'width':'30%'}">{{X.Alias}}</td>
                    <td class="borB" :style="{'width':'13%'}">{{X.StoreName}}</td>
                    <td class="borB" :style="{'width':'17%'}">{{X.OrderCount}}</td>
                    <td class="borB" :style="{'width':'26%'}">{{X.AmountCount}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Panel>
    </Collapse>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';

@Component({
  name: 'DailyStoreSales',
  components: {
    
  }
})
export default class DailyStoreSales extends Vue {
  @Watch('SearchForm.Platform')
  private ChangePlatForm(Val: number | ''):void{
    this.SearchForm.StoreId = '';
    if (this.StoreDrop.length != 0) {
      (this.$refs.Store as any).clearSingleSelect();
    }
    this.StoreDrop = [];
    this.GetDaySaleReport()
    if (Val != '') {
      this.GetStoreDropList(Val);
    }
  }

  @Watch('SearchForm.StoreId')
  private ChangeStoreId(Val: number | ''):void{
    this.GetDaySaleReport();
  }

  // 获取平台下的所有店铺
  private GetStoreDropList(Val:number | ''):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales[Val].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.StoreDrop = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private ChangeDailyStore(V: string[]){
    if(V.length > 0 && this.IsFirst){
      this.GetDaySaleReport()
      this.IsFirst = false;
    }
  }

  private GetDaySaleReport(): void{
    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm))
    SearchForm.Platform = SearchForm.Platform === "" ? 0 : SearchForm.Platform;
    SearchForm.StoreId = SearchForm.StoreId === "" ? 0 : SearchForm.StoreId;
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.ShipOrderGetDaySaleReport
      },
      Data: SearchForm,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.DailySalesData = Res.Data.Data;
          this.TotalOrder = 0
          this.TotalAmount = 0
          for (var Item of this.DailySalesData) {
            for (var Itm of Item.Value) {
              this.TotalOrder += Itm.OrderCount
              this.TotalAmount = this.TotalAmount + Itm.AmountCount
            }
          }
          this.TotalAmount = Number(this.TotalAmount.toFixed(3))
          if(this.DailySalesData.length > 0){
            this.ShowValue = false
          }
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private IsFirst: boolean = true
  private ShowValue: boolean = true

  private DailySalesData: Interface.ControlStoreList[] = [];
  private SearchForm: Interface.ControlStoreSearchData = new Interface.ControlStoreSearchData()
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private StoreDrop: PInterface.KV[] = [];

  private TotalOrder: number = 0
  private TotalAmount:number = 0

}
</script>
<style lang="less">
  .DailyStoreSales {
    text-align: left;
  
    .dailyTable {
      thead tr {
        background: rgb(247, 247, 248);

        th {
          border-bottom: 1px solid #e9eaec;
        }
      }

      td,
      th {
        padding: 6px 12px;
        height: 36px;
      }

      tr:nth-of-type(2n) td {
        background: #f8f8f9;
      }

      tbody tr:hover {
        background: rgb(235, 246, 255);
      }
    }

    & .dailyTableContent {
      max-height: 250px;
      overflow: auto;
    }
  }
  .borB {
    border-bottom: 1px solid #e9eaec;
  }

  .borR {
    border-right: 1px solid #e9eaec;
    border-bottom: 1px solid #e9eaec;
  }
</style>