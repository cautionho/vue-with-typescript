<template>
  <Col>
    <Table :columns="Cols" :data="SHIP_ORDER_ITEMS" size="small" stripe :height="CalculateHeight()"></Table>
    <ShowBigPic ref="ShowBigPic"></ShowBigPic>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ShipOrderItems",
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class ShipOrderItems extends Vue {
  @Getter private "ShipOrder/SHIP_ORDER_INFO": Interface.ShipOrderBase;
  @Getter private "ShipOrder/SHIP_ORDER_ITEMS": Interface.ShipOrderItem[];
  
  get SHIP_ORDER_INFO() {
    return this["ShipOrder/SHIP_ORDER_INFO"];
  }
  get SHIP_ORDER_ITEMS() {
    return this["ShipOrder/SHIP_ORDER_ITEMS"];
  }

  private CalculateHeight() {
    return 500;
  }

  private RenderItemId(h:any,Params:any):string {
    if(this.$Enums.Sales.ItemIdLink[this.SHIP_ORDER_INFO.Platform]){
      return h('a', {
        attrs: {
          href: `${this.$Enums.Sales.ItemIdLink[this.SHIP_ORDER_INFO.Platform]}${Params.row.ItemId}`,
          target: '_blank'
        }
      }, Params.row.ItemId)
    }else {
      return h('p', Params.row.ItemId);
    }
  }

  private Cols: PInterface.TableCol[] = [{
    title: ' ',
    width:60,
    align:'center',
    render:(h,Params):string => {
      return h('div', {
        class: 'P-Pointer P-List-Img',
        style: {
          'background-image': `url(${this.$Server.File}/${Params.row.Sku.DefaultImage})`
        },
        on: {
          click: ():void => {
            (this as any).$refs.ShowBigPic.Trigger(Params.row.Sku.DefaultImage);
          }
        }
      })
    }
  }, {
    title:'SKU编号/产品名称',
    width:180,
    render:(h:any,Params:any):string => {
      return h('Tooltip',{
        class:'P-LINE-1',
        props: {
          content: Params.row.Sku.SkuName
        }
      },[
        h('p',Params.row.SkuCode),
        h('p',{class:'P-LINE-1'},Params.row.Sku.SkuName)
      ])
    }
  }, {
    title: 'ItemID',
    key: 'ItemId',
    render: (h:any, Params:any):string => {
      return this.RenderItemId(h,Params)
    }
  }, {
    title: '平台单号/平台交易号',
    width:200,
     render: (h: any, Params: any): string => {
      const Vals: PInterface.KV[] = [
          { Key: "单", Value: Params.row.PlatformOrderId || "-" },
          { Key: "交", Value: Params.row.PlatformTransactionId || "-" }
        ],
        ValsContents: string[] = [],
        ValsComps: string[] = Vals.map((Item: PInterface.KV) => {
          ValsContents.push(h("p", `[${Item.Key}] ${Item.Value}`));
          return h("p", { class: "P-LINE-1" }, [
            h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
            h("span", Item.Value)
          ]);
        }),
        TooltipsCont = h("div", { slot: "content" }, ValsContents);
      return h(
        "Tooltip",
        { class: "P-W-100-Percent P-MT-5" },
        ValsComps.concat(TooltipsCont)
      );
    }
  }, {
    title: '交易金额',
    render: (h:any,Params:any):string => {
      return h('p', `${Params.row.PayAmount} ${Params.row.PayCurrency}`)
    }
  }, {
    title: '数量',
    key: 'Quantity'
  }, {
    title: '到货单号',
    key: 'PaoCode',
    render:(h:any,Params:any):string => {
      return h('span',Params.row.PaoCode || '-')
    }
  }, {
    title: '当前库存/在途库存',
    render: (h: any, Params: any): string => {
      const Vals: PInterface.KV[] = [
          { Key: "当", Value: Params.row.UsableQuantity || "-" },
          { Key: "途", Value: Params.row.PurchasingQuantity || "-" }
        ],
        ValsContents: string[] = [],
        ValsComps: string[] = Vals.map((Item: PInterface.KV) => {
          ValsContents.push(h("p", `[${Item.Key}] ${Item.Value}`));
          return h("p", { class: "P-LINE-1" }, [
            h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
            h("span", Item.Value)
          ]);
        }),
        TooltipsCont = h("div", { slot: "content" }, ValsContents);
      return h(
        "Tooltip",
        { class: "P-W-100-Percent P-MT-5" },
        ValsComps.concat(TooltipsCont)
      );
    }
  }, {
    title: '货架号',
    key: 'LocationCode',
    render:(h:any,Params:any):string => {
      return h('span',Params.row.LocationCode || '-');
    }
  }]
}
</script>
<style lang="less" scoped>
</style>