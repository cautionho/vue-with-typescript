<template>
  <Col>
    <Table :columns="Cols" :data="Items" size="small" borderless stripe></Table>
    <ShowBigPic ref="ShowBigPic"></ShowBigPic>
  </Col>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name:'ShipOrderExpand',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})

export default class ShipOrderExpand extends Vue {
  @Prop() private ShipOrder:Interface.ShipOrderList

  private mounted():void {
    this.SetCols();
    this.GetItems();
  }

  private SetCols(): void {
    const EbayCol: PInterface.TableCol = {
      title: 'Paypal交易号/交易金额',
      render: (h: any, Params: any): string => {
        const Vals: PInterface.KV[] = [
            { Key: "pp", Value: Params.row.PaypalTransactionId || "-" },
            { Key: "金", Value: `${Params.row.PayAmount} ${Params.row.PayCurrency}` || "-" }
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
    },
    OtherCol: PInterface.TableCol = {
      title: '交易金额',
      render: (h: any, Params: any): string => {
        return h('span', `${Params.row.PayAmount} ${Params.row.PayCurrency}`)
      }
    },
    IsEbay = this.ShipOrder.ShipOrder.OrderCode.startsWith('E')
    this.Cols.splice(5, 0, IsEbay ? EbayCol : OtherCol);
  }

  private GetItems():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.GetShipOrderItem,
        Login: true
      },
      Data: {
        OrderId: this.ShipOrder.ShipOrder.Id,
        OrderCode: this.ShipOrder.ShipOrder.OrderCode
      },
      Callback: (Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.Items.push(...Res.Data.Data);
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private ShowBigPic(Url:string):void {
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }

  private Cols:PInterface.TableCol[] = [{
    title: '图片',
    width:80,
    align:'center',
    render:(h:any,Params:any):string => {
      return h('div', {
        style: {
          'background-image': `url(${this.$Server.File}/${Params.row.Sku.DefaultImage})`,
        },
        class: 'P-List-Img',
        on: {
          click: () => {
            this.ShowBigPic(Params.row.Sku.DefaultImage)
          }
        }
      })
    }
  },{
    title: 'SKU编号',
    key: 'SkuCode',
    width:120
  },{
    title: '产品名',
    key: 'SkuName',
    render: (h:any,Params:any):string => {
      return h('Tooltip', { class: 'P-LINE-1', props: {content: Params.row.Sku.SkuName} } , Params.row.Sku.SkuName)
    }
  },{
    title: 'ItemID',
    key: 'ItemId',
    render: (h:any,Params:any):string => {
      const Platform: number = this.ShipOrder.ShipOrder.Platform,
      ItemId: string = Params.row.ItemId || '-'
      return h('Tooltip', { class: 'P-LINE-1 P-Pointer', props: {content: ItemId} } , [
        this.$Enums.Sales.ItemIdLink[Platform] ? h('a', {attrs: { href: Params.row.ItemId ? `${this.$Enums.Sales.ItemIdLink[Platform]}${ItemId}` : 'javascript:void(0)', target: '_blank' }}, ItemId) : h('span', ItemId)
      ])
    }
  },{
      title: '平台单号/平台交易号',
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
    title: '数量',
    key: 'Quantity',
    // width:60
  }, {
    title: '到货单号',
    key: 'PaoCode',
    render: (h:any,Params:any):string => {
      return h('span', Params.row.PaoCode || '-');
    }
  },{
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
  },{
    title: '货架号',
    key: 'LocationCode',
    render: (h:any,Params:any):string => {
      return h('span', Params.row.LocationCode || '-');
    }
  }]
  private Items:Interface.ShipOrderItem[] = []
}
</script>
<style lang="less" scoped></style>