<template>
  <Col span="24">
    <Table ref="List" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()" @on-selection-change="EmitListSelected"></Table>
    <Page class="P-MT-10" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Sales";

@Component({

})
export default class StoreList extends Vue {
  @Prop(Number) private Platform:number
  @Prop() private Powers:PInterface.Power
  @Prop(Array) private List:Interface.StoreList[]

  @Emit() EmitPagerChange(Pager: PInterface.Pager):void {}
  @Emit() EmitListSelected(List:Interface.StoreList[]):void{}
  @Emit() EmitListOperations(O:string,D:Interface.StoreList):void {}

  private mounted():void {
    this.SetListCols();
  }

  /**设置列表列 */
  private SetListCols():void {
    // 1 有Paypal账号
    // 1 2 8 有有效至
    // 3 4 16 18 有站点
    if([1,2,8].some(Item => Item === this.Platform)){
      this.Cols.splice(-3,0,{ title:'有效至', width:160, key:'Expiration', render:(h:any,params:any):string => { return h('span',this.$UI.Render.Date(params.row.Expiration)) } })
    }
    if(this.Platform === 1){
      this.Cols.splice(3,0,{ title:'Paypal账号', key: 'PaypalAccoutnName', render:(h:any,params:any):string => { return h('span', params.row.PaypalAccoutnName || '-') } })
    }
    if([3,4,16,18].some(Item => Item === this.Platform)){
      this.Cols.splice(3,0,{ title:'站点', key:'SiteName' , render:(h:any,params:any):string => { return h('span', this.RenderSite(params.row)) }})
    }
    if(this.Platform === 99){
      this.Cols.splice(-3,1);
    }
    this.$nextTick(()=>{
      this.SetOperations();
    })
  }

  private RenderSite(D:Interface.StoreList):string {
    let Site:string | undefined = '';
    switch(this.Platform){
      case 3:
        Site = D.SiteName;
        break;
      case 4:
        Site = D.Site;
        break;
      case 16:
        Site = this.$Enums.Sales.JumiaSiteType[D.SiteType || 0];
        break;
      case 18:
        Site = this.$Enums.Sales.LazadaSiteType[D.LazadaSiteType || 0];
        break;
    }
    return Site || '-'
  }

  /**设置列表操作项 */
  private SetOperations():void {
    if([this.Powers.EbayStoreModify,this.Powers.WishStoreModify,this.Powers.AmazonStoreModify,this.Powers.ShopeeStoreModify,this.Powers.walmartStoreModify,this.Powers.CdiscountStoreModify,this.Powers.JoomStoreModify,this.Powers.FyndiqStoreModify,this.Powers.TopBuyModify,this.Powers.TophatterStoreModify,this.Powers.FactoryMarketStoreModify,this.Powers.vovaStoreModify,this.Powers.MymallStoreModify,this.Powers.JumiaStoreModify,this.Powers.AllegroStoreSave,this.Powers.LazadaStoreSave,this.Powers.GrouponStoreUpdate,this.Powers.SaveRealDeStore,this.Powers.SaveRakutenStore,this.Powers.SaveNeweggStore,this.Powers.OtherStoreModify].some(Item => Item === true)){
      this.Operations.push({ Key:'编辑', Value:'Modify' })
    }
    if([this.Powers.EbayChangeApi,this.Powers.WishChangeApi,this.Powers.AmazonChangeUseApi,this.Powers.ShopeeChangeApi,this.Powers.walmartChangeUseApi,this.Powers.CdiscountChangeUseApi,this.Powers.JoomChangeApi,this.Powers.FyndiqChangeUseApi,this.Powers.TopBuyChangeUseApi,this.Powers.TophatterChangeUseApi,this.Powers.FactoryMarketStoreUseApi,this.Powers.vovaChangeUseApi,this.Powers.MymallChangeUseApi,this.Powers.JumiaChangeApi,this.Powers.AllegroChangeApi,this.Powers.LazadaChangeApi,this.Powers.GrouponChangeApi,this.Powers.RealDeChangeApi,this.Powers.RakutenChangeUseApi,this.Powers.NeweggChangeApi].some(Item => Item === true)){
      this.Operations.push({ Key:'', Value:'EnableApi' })
    }
    if([this.Powers.EbayChangeStatus,this.Powers.WishChangeStatus,this.Powers.AmazonChangeStatus,this.Powers.ShopeeChangeStatus,this.Powers.walmartChangeStatus,this.Powers.CdiscountChangeStatus,this.Powers.JoomChangeStatus,this.Powers.FyndiqChangeStatus,this.Powers.TopBuyChangeStatus,this.Powers.TophatterChangeStatus,this.Powers.FactoryMarketStoreStatus,this.Powers.vovaChangeStatus,this.Powers.MymallChangeStatus,this.Powers.JumiaChangeStatus,this.Powers.AllegroChangeStatus,this.Powers.LazadaChangeStatus,this.Powers.GrouponChangeStatus,this.Powers.RealDeChangeStatus,this.Powers.RakutenChangeStatus,this.Powers.NeweggChangeStatus,this.Powers.OtherStoreChangeStatus].some(Item => Item === true)){
      this.Operations.push({ Key:'', Value:'EnableAccount' })
    }
    if(this.Powers.EbayBindRedisDb){
      this.Operations.push({ Key:'绑定RedisDB', Value: 'RedisDB' })
    }
    if(this.Powers.AllegroStoreLocation){
      this.Operations.push({ Key:'运输设置', Value: 'Location' })
    }
    // if([this.Powers.EbayStoreSaler,this.Powers.WishStoreSaler].some(Item => Item === true)){
    //   this.Operations.push({ Key:'编辑授权用户', Value:'StoreSaler' })
    // }
  }

  private CalculateHeight():number{1
    return this.$UI.FullHeight() - 250;
  }

  private ClearSelected():void {
    (this as any).$refs.List.selectAll(false);
  }

  /* 触发切换页码 */
  private ChangePage(P: number) {
    this.$set(this.Pager, "PageIndex", P);
    this.EmitPagerChange(this.Pager);
  }
  /* 触发切换页码展示量 */
  private ChangePageSize(P: number) {
    this.$set(this.Pager, "PageSize", P);
    this.EmitPagerChange(this.Pager);
  }
  /* 设置总条数 */
  private SetTotalItems(Total: number): void {
    this.Pager.TotalItems = Total;
  }
  /* 重置分页器 */
  private PagerReset() {
    this.Pager = new PInterface.Pager();
  }

  private Cols:PInterface.TableCol[] = [
    { type: "selection", width: 60, align: "center" },
    { title:'账号', key:'StoreName' },
    { title:'别名', key:'Alias' },
    { title:'创建日期', width:160, key:'CreateTime', render:(h:any,params:any):string => { return h('span',this.$UI.Render.Date(params.row.CreateTime || params.row.CreatedTime,false)) }},
    { title:'API状态', width:100, key:'IsUseApi', align: 'center', render:(h:any,params:any):string =>{
      return h('Icon',{ class: params.row.IsUseApi ? 'P-Text-Success' : 'P-Text-Error', attrs: { type: params.row.IsUseApi ? 'md-checkmark' : 'md-close' }, props: { size: 18 } })
    } },
    { title:'账号状态', width:100, key:'IsEnable', align: 'center', render:(h:any,params:any):string =>{
      return h('Icon',{ class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error', attrs: { type: params.row.IsEnable ? 'md-checkmark' : 'md-close' }, props: { size: 18 } })
    } },
    { title:'操作',width:100,align:'center',render:(h:any,params:any):string =>{
      return h(
          "Dropdown",
          {
            on: {
              "on-click": (n: string) => {
                this.EmitListOperations(n,JSON.parse(JSON.stringify(params.row)));
              }
            }
          },
          [
            h("a", [
              h("span", { class: "P-MR-5" }, "操作"),
              h("Icon", { props: { type: "ios-arrow-down" } })
            ]),
            h(
              "DropdownMenu",
              { slot: "list" },
              this.Operations.map((item: PInterface.KV): string => {
                return h(
                  "DropdownItem",
                  { props: { name: item.Value }, class: "P-TA-C" },
                  item.Value === 'EnableApi' ? (params.row.IsUseApi ? '禁用API' : '启用API') : item.Value === 'EnableAccount' ? (params.row.IsEnable ? '禁用账号' : '启用账号') : item.Key
                );
              })
            )
          ]
        );
    } }
  ]
  // private List:Interface.StoreList[]  = []
  private Operations:PInterface.KV[] = []
  private Pager:PInterface.Pager = new PInterface.Pager();
}
</script>