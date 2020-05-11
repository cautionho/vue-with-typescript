import { Component, Vue, Prop } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Sales';

@Component({
  name: 'Store',
  components: {
    Search: () => import('@/components/Sales/Store/Search.vue'),
    List: () => import('@/components/Sales/Store/List.vue'),
    Modify: () => import('@/components/Sales/Store/Modify.vue'),
    EnableApi: () => import('@/components/Sales/Store/EnableApi.vue'),
    EnableStore: () => import('@/components/Sales/Store/EnableStore.vue'),
    RedisDB: () => import('@/components/Sales/Store/RedisDB.vue'),
    Location: () => import('@/components/Sales/Store/Location.vue'),
  }
})

export default class Store extends Vue {
  @Prop(Number) private Platform: number
  @Prop() private Powers: PInterface.Power

  // Paypal账号
  private EmitPaypalDrop(Drop:PInterface.KV[]):void {
    this.PaypalDrop.push(...Drop);
  }

  /* 搜索数据变更 */
  private EmitList(List: Interface.StoreList[], Total: number): void {
    this.$set(this, 'List', [])
    this.$set(this, 'SelectedData', [])
    this.List.push(...List);
    (this as any).$refs.StoreList.SetTotalItems(Total);
  }
  /* 分页器变更 */
  private EmitPagerChange(Pager: PInterface.Pager, Init?: boolean): void {
    this.$set(this, 'Pager', Pager);
    this.$nextTick(() => {
      if (Init) {
        (this as any).$refs.StoreList.PagerReset();
      }
      (this as any).$refs.SearchStore.SearchList();
    })
  }

  /* 计算权限 */
  private CalculatePower(T:number): boolean {
    let Flag = false;
    switch (this.Platform) {
      case 1:
        Flag = T === 1 ? (this.Powers.EbayStoreModify || this.Powers.EbayStoreAdd) : T === 2 ? (this.Powers.EbayChangeApi) : this.Powers.EbayChangeStatus
        break;
      case 2:
        Flag = T === 1 ? (this.Powers.WishStoreModify || this.Powers.WishStoreAdd) : T === 2 ? (this.Powers.WishChangeApi) : this.Powers.WishChangeStatus
        break;
      case 3:
        Flag = T === 1 ? (this.Powers.AmazonStoreModify || this.Powers.AmazonStoreCreate) : T === 2 ? (this.Powers.AmazonChangeUseApi) : this.Powers.AmazonChangeStatus
        break;
      case 4:
        Flag = T === 1 ? (this.Powers.ShopeeStoreModify || this.Powers.ShopeeStoreAdd) : T === 2 ? (this.Powers.ShopeeChangeApi) : this.Powers.ShopeeChangeStatus
        break;
      case 5:
        Flag = T === 1 ? (this.Powers.walmartStoreModify || this.Powers.walmartStoreCreate) : T === 2 ? (this.Powers.walmartChangeUseApi) : this.Powers.walmartChangeStatus
        break;
      case 6:
        Flag = T === 1 ? (this.Powers.CdiscountStoreModify || this.Powers.CdiscountStoreCreate) : T === 2 ? (this.Powers.CdiscountChangeUseApi) : this.Powers.CdiscountChangeStatus
        break;
      case 8:
        Flag = T === 1 ? (this.Powers.JoomStoreModify || this.Powers.JoomStoreAdd) : T === 2 ? (this.Powers.JoomChangeApi) : this.Powers.JoomChangeStatus
        break;
      case 9:
        Flag = T === 1 ? (this.Powers.FyndiqStoreModify || this.Powers.FyndiqStoreCreate) : T === 2 ? (this.Powers.FyndiqChangeUseApi) : this.Powers.FyndiqChangeStatus
        break;
      case 10:
        Flag = T === 1 ? (this.Powers.TopBuyModify || this.Powers.TopBuyCreate) : T === 2 ? (this.Powers.TopBuyChangeUseApi) : this.Powers.TopBuyChangeStatus
        break;
      case 11:
        Flag = T === 1 ? (this.Powers.TophatterStoreModify || this.Powers.TophatterStoreCreate) : T === 2 ? (this.Powers.TophatterChangeUseApi) : this.Powers.TophatterChangeStatus
        break;
      case 12:
        Flag = T === 1 ? (this.Powers.FactoryMarketStoreModify || this.Powers.FactoryMarketStoreCreate) : T === 2 ? (this.Powers.FactoryMarketStoreUseApi) : this.Powers.FactoryMarketStoreStatus
        break;
      case 13:
        Flag = T === 1 ? (this.Powers.vovaStoreModify || this.Powers.vovaStoreCreate) : T === 2 ? (this.Powers.vovaChangeUseApi) : this.Powers.vovaChangeStatus
        break;
      case 14:
        Flag = T === 1 ? (this.Powers.MymallStoreModify || this.Powers.MymallStoreCreate) : T === 2 ? (this.Powers.MymallChangeUseApi) : this.Powers.MymallChangeStatus
        break;
      case 16:
        Flag = T === 1 ? (this.Powers.JumiaStoreModify || this.Powers.JumiaStoreAdd) : T === 2 ? (this.Powers.JumiaChangeApi) : this.Powers.JumiaChangeStatus
        break;
      case 17:
        Flag = T === 1 ? (this.Powers.AllegroStoreSave) : T === 2 ? (this.Powers.AllegroChangeApi) : this.Powers.AllegroChangeStatus
        break;
      case 18:
        Flag = T === 1 ? (this.Powers.LazadaStoreSave) : T === 2 ? (this.Powers.LazadaChangeApi) : this.Powers.LazadaChangeStatus
        break;
      case 19:
        Flag = T === 1 ? (this.Powers.GrouponStoreInsert || this.Powers.GrouponStoreUpdate) : T === 2 ? (this.Powers.GrouponChangeApi) : this.Powers.GrouponChangeStatus
        break;
      case 20:
        Flag = T === 1 ? this.Powers.SaveRealDeStore : T === 2 ? (this.Powers.RealDeChangeApi) : this.Powers.RealDeChangeStatus
        break;
      case 21:
        Flag = T === 1 ? this.Powers.SaveRakutenStore : T === 2 ? (this.Powers.RakutenChangeUseApi) : this.Powers.RakutenChangeStatus
        break;
      case 22:
        Flag = T === 1 ? this.Powers.SaveNeweggStore : T === 2 ? (this.Powers.NeweggChangeApi) : this.Powers.NeweggChangeStatus
        break;
      case 99:
        Flag = T === 1 ? (this.Powers.OtherStoreCreate || this.Powers.OtherStoreModify) : T === 2 ? false : this.Powers.OtherStoreChangeStatus
        break;
    }
    return Flag;
  }

  /* 触发选中列表数据 */
  private EmitListSelected(List: Interface.StoreList[]): void {
    this.$set(this, 'SelectedData', [])
    this.SelectedData.push(...List)
  }

  private CancelSelected():void {
    (this as any).$refs.StoreList.ClearSelected();
    this.EmitListSelected([])
  }

  /**触发列表操作项 */
  private EmitListOperations(O:string,D:Interface.StoreList):void {
    this.CancelSelected();
    this.$nextTick(()=>{
      switch(O){
        case 'EnableApi':
          (this as any).$refs.EnableApi.EmitApi(!D.IsUseApi,[D]);
          break
        case 'EnableAccount':
          (this as any).$refs.EnableStore.EmitAccount(!D.IsEnable,[D]);
          break
        case 'Modify':
          (this as any).$refs.ModifyStore.TriggerAccount(D);
          break
        case 'RedisDB':
          (this as any).$refs.RedisDB.Trigger(D);
         break
        case 'Location':
          (this as any).$refs.Location.Trigger(D);
          break
      }
    })
  }

  private EmitModify(G?:boolean):void {
    this.EmitListSelected([]);
    if(G){
      (this as any).$refs.SearchStore.SearchList();
    }
  }

  private List: Interface.StoreList[] = []
  private SelectedData: Interface.StoreList[] = []
  private Pager: PInterface.Pager = new PInterface.Pager()
  private PaypalDrop:PInterface.KV[] = []
}