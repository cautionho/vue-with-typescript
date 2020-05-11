<template>
  <Col span="24" class="P-Search-Group">
  <Form inline ref="SearchFilter" v-model="SearchFilter">
    <Dropdown trigger="custom" :visible="AccurateSearch">
      <Button type="primary" @click="TriggerSearch">
        精准搜索
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <Col span="24" slot="list" class="P-P-10">
      <Select class="P-W-200 P-ML-10" placeholder="筛选账号状态" v-model="SearchFilter.IsEnable" :options="EnableDrop" />
      <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选账号状态" v-model="SearchFilter.IsEnable" filterable clearable>
        <Option v-for="(item,index) in EnableDrop" :value="$Enums.Public.Enable[item]" :key="index">{{ item }}</Option>
      </Select> -->
      <Select class="P-W-200 P-ML-10" placeholder="筛选API状态" v-model="SearchFilter.IsUseApi" v-if="Platform === 1" :options="EnableDrop" />
      <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选API状态" v-model="SearchFilter.IsUseApi" filterable clearable v-if="Platform === 1">
        <Option v-for="(item,index) in EnableDrop" :value="$Enums.Public.Enable[item]" :key="index">{{ item }}</Option>
      </Select> -->
      <Select class="P-W-200 P-ML-10" placeholder="筛选Paypal账号" v-model="SearchFilter.PaypalAccountId" :options="PaypalDrop" v-if="Platform === 1" />
      <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选Paypal账号" v-model="SearchFilter.PaypalAccountId" filterable clearable v-if="Platform === 1">
        <Option v-for="(item,index) in PaypalDrop" :value="item.Value" :key="index">{{ item.Key }}</Option>
      </Select> -->
      <Select class="P-W-200 P-ML-10" placeholder="筛选站点" v-model="SearchFilter.SiteCode" :options="AmazonSiteDrop" v-if="Platform === 3" />
      <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选站点" v-model="SearchFilter.SiteCode" filterable clearable v-if="Platform === 3">
        <Option v-for="(item,index) in AmazonSiteDrop" :value="item.Value" :key="index">{{ item.Key }}</Option>
      </Select> -->
      <Select class="P-W-200 P-ML-10" placeholder="筛选站点" v-model="SearchFilter.LazadaSiteType" :options="LazadaSiteDrop" v-if="Platform === 18" />
      <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选站点" v-model="SearchFilter.LazadaSiteType" filterable clearable v-if="Platform === 18">
        <Option v-for="(item,index) in LazadaSiteDrop" :value="$Enums.Sales.LazadaSiteType[item]" :key="index">{{ item }}</Option>
      </Select> -->
      </Col>
    </Dropdown>
    <FormItem class="P-ML-10 P-MB-10">
      <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.SearchKey" @on-enter="SearchList">
      <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchFilter.SearchKeyType" :options="SearchKeyType" />
      <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchFilter.SearchKeyType" filterable clearable>
        <Option v-for="(item,index) in SearchKeyType" :value="$Enums.Sales.StoreSearchType[item]" :key="item">{{item}}</Option>
      </Select> -->
      <Button slot="append" type="primary" @click="SearchList">搜索</Button>
      </Input>
    </FormItem>
    <FormItem class="P-ML-10 P-MB-10">
      <Button type="warning" @click="ResetList">重置</Button>
    </FormItem>
  </Form>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Sales";

@Component({})
export default class SearchShipOrder extends Vue {
  @Prop(Number) private Platform: number
  @Prop(PInterface.Pager) Pager: PInterface.Pager;

  @Emit() EmitList(List: Interface.StoreList[], Total: number) {}
  @Emit() EmitPagerChange(Pager:PInterface.Pager,Init?:boolean){}
  @Emit() EmitPaypalDrop(Drop:PInterface.KV[]) {}

  private mounted() {
    this.SearchList();
    if(this.Platform === 1 && !this.PaypalDrop.length){
      this.GetPaypalDrop();
    }
  }

  /**获取Paypal下拉列表 */
  private GetPaypalDrop():void {
    this.$Request.Post({
      Server: this.$Server.Finance,
      Api: {
        Address: this.$Api.PaypalDropList,
        Login: false
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.PaypalDrop.push(...Res.Data.DropList);
          this.EmitPaypalDrop(this.PaypalDrop)
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }

  /* 点击“精准搜索” */
  private TriggerSearch(): void {
    this.$set(this, "AccurateSearch", !this.AccurateSearch);
  }

  /* 搜索列表数据 */
  private SearchList(): void {
    this.$UI.Loading.Show();
    let PostData:Interface.StoreSearch = JSON.parse(JSON.stringify(this.SearchFilter))
    if(this.Platform === 1){
      PostData.IsUseApi = PostData.IsUseApi === '' ? '' : Boolean(PostData.IsUseApi)
    }
     PostData.IsEnable = PostData.IsEnable === '' ? '' : Boolean(PostData.IsEnable)
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales[this.Platform].StoreList,
        Login: true
      },
      Data: {
        PageIndex: this.Pager.PageIndex,
        PageSize: this.Pager.PageSize,
        SortField: "",
        SortOrder: "",
        Conditions: PostData
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$set(this, "AccurateSearch", false);
          this.EmitList(
            Res.Data.PageModel.Items,
            Res.Data.PageModel.TotalItems
          );
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }
  /* 重置列表数据 */
  private ResetList(): void {
    this.$set(this, "AccurateSearch", false);
    this.$set(this,'SearchFilter',new Interface.StoreSearch())
    this.EmitPagerChange(new PInterface.Pager(),true);
  }

  private AccurateSearch:boolean = false
  private EnableDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable)
  private PaypalDrop:PInterface.KV[] = []
  private AmazonSiteDrop:PInterface.KV[] = [{Value: 'ATVPDKIKX0DER',Key: '美国'}, {Value: 'A1F83G8C2ARO7P',Key: '英国'}, {Value: 'A1PA6795UKMFR9', Key: '德国'}, {Value: 'A13V1IB3VIYZZH',Key: '法国'}, {Value: 'APJ6JRA9NG5V4',Key: '意大利'}, {Value: 'A1RKKUPIHCS9HS',Key: '西班牙'}, {Value: 'A2EUQ1WTGCTBG2', Key: '加拿大' }, { Value: 'A1VC38T7YXB528', Key: '日本'}, {Value: 'A1AM78C64UM0Y8', Key: '墨西哥'}, {Value: 'A39IBJ37TRP1C6',Key: '澳大利亚'}]
  private LazadaSiteDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.LazadaSiteType)
  private SearchKeyType:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.StoreSearchType)
  private SearchFilter: Interface.StoreSearch = new Interface.StoreSearch();
}
</script>