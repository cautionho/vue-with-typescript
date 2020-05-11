<template>
  <Row class="tal">
    <Col span="24">
    <Table class="P-MT-10" size="small" :highlight-row="true" :columns="PurchaseOederCol" :data="PurchaseOederData" border stripe :height="PurchaseOederData.length > 5 ? 400 : 0"></Table>
    <p class="P-MT-10 P-MB-0">统计：产品种类数 {{PurchaseOederData.length}}；产品总数量 {{TotalAmount}}；采购总价 {{PurchaseTotalAmount.toFixed(3) + ' CNY'}}；总节约成本 {{TotalSaveAmount.toFixed(3) + ' CNY'}}</p>
    </Col>
    <ShowBigPic ref="ShowBigPic" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
  name: 'PurchaseOrder_expand',
  components: {
    ShowBigPic: () => import ('@/components/Public/ShowBigPic.vue')
  }
})
export default class PurchaseOrder_expand extends Vue {
  @Prop() Row: Interface.PurchaseOrd
  @Prop() Data?: Interface.PurchaseOrdItem[]

  @Watch('Data')
  private TriggerItemDetail(){
    if(this.Data !== undefined){
      this.PurchaseOederData = JSON.parse(JSON.stringify(this.Data))
      this.StatisticalSum()
    }
  }

  private created() {
    if(this.Data == undefined){
      this.GetPurchaseItems();
    }else{
    }
  }

  private GetPurchaseItems():void {
    this.$UI.Loading.Show();
		this.$set(this, 'PurchaseOederData', []);
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderGetItem,
				Login: true
			},
			Data: this.Row.Id,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.PurchaseOederData.push(...res.Data.Data);
          this.StatisticalSum()
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  //统计
  private StatisticalSum(): void{
    for (let item in this.PurchaseOederData) {
      this.TotalAmount = this.TotalAmount + this.PurchaseOederData[item].Item.PurchaseQuantity;
      this.PurchaseTotalAmount = this.PurchaseTotalAmount + this.PurchaseOederData[item].Item.PurchasePrice * this.PurchaseOederData[item].Item.PurchaseQuantity;
      this.TotalSaveAmount = this.TotalSaveAmount + ((this.PurchaseOederData[item].Item.LowestPrice - this.PurchaseOederData[item].Item.PurchasePrice) * this.PurchaseOederData[item].Item.PurchaseQuantity)
    }
  }

  private PurchaseOederData: Interface.PurchaseOrdItem[] = []  //表格数据
  private TotalAmount: number = 0 //产品总数量
  private PurchaseTotalAmount: number = 0 //采购总价
  private TotalSaveAmount: number = 0 //总节约成本

  private ShowPic(Url: string){
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }

  private PurchaseOederCol: PInterface.TableCol[] = [
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + params.row.Item.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.Item.DefaultImage)
            }
          }
        })
      }
    },
    { title: 'sku编号/产品名称', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { }, params.row.Item.SkuCode)
        ]),
        h('Tooltip', {
					props: {
						'content': params.row.Item.SkuName,
						'maxWidth': 400
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, params.row.Item.SkuName === "" ? '-' : params.row.Item.SkuName)
        ])
			])
    } },
    { title: '在线库存/在途库存', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '当'),
					h('span', { }, params.row.Inventory.Quantity)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '途'),
					h('span', { }, params.row.Inventory.PurchasingQuantity)
				]),
			])
    } },
    { title: '销售数据', key: '', render: (h: any, params: any): string =>  
      h('span', params.row.AvgSaleQuantity.AvgSaleQuantity30 + '/' + params.row.AvgSaleQuantity.AvgSaleQuantity15 + '/' + params.row.AvgSaleQuantity.AvgSaleQuantity7)
    },
    { title: '单价', key: '',   render: (h: any, params: any): string => h('span', params.row.Item.PurchasePrice + params.row.Item.CurrencyCode) },
    { title: '上次采购价格', key: '', width: 110, render: (h: any, params: any): string => h('span', params.row.Item.LastTimePrice + params.row.Item.CurrencyCode) },
    { title: '历史最低单价', key: '', width: 110, render: (h: any, params: any): string => h('span', params.row.Item.LowestPrice + params.row.Item.CurrencyCode) },
    { title: '节约成本', key: '',  render: (h: any, params: any): string => 
      h('span', ((params.row.Item.LowestPrice - params.row.Item.PurchasePrice) * params.row.Item.PurchaseQuantity).toFixed(3) + params.row.Item.CurrencyCode )  
    },
    { title: '均摊运费', render: (h: any, params: any): string => h('span', params.row.Item.AvgShippingCost + params.row.Item.CurrencyCode) }, 
    { title: '实际成本', render: (h: any, params: any): string => h('span', params.row.Item.ActualCost + params.row.Item.CurrencyCode) }, 
    { title: '到货数量/入库数量', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', {
        class: "P-MT-5 P-MB-5"
      }, [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, '采'),
          h('span', { }, params.row.Item.PurchaseQuantity)
        ]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '到'),
					h('span', { }, params.row.Item.ArrivalQuantity)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '入'),
					h('span', { }, params.row.Item.InStorageQuantity)
        ])
			])
    } }
  ]
}

</script>
<style lang="less"></style>