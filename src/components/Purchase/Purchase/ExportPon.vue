<!-- 打印采购单明细 -->
<template>
	<Row>
    <div class="P-Inline-Block" id="printItems">
    <table class="P-TA-C" border="1" cellpadding="4" cellspacing="0" style="font-size:12px;width:100%;font-family:'微软雅黑';">
      <thead>
        <tr>
          <td colspan="6" style="font-size:20px;text-align:center;">
            <b>采购单 {{CurPrintData.PurchaseCode}}</b>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="width:50%;text-align:left;" colspan="3">供应商：{{CurPrintData.SupplyName}}</td>
          <td class="P-TA-L" colspan="3">收货仓库：{{CurPrintData.WarehouseName}}</td>
        </tr>
        <tr>
          <td class="P-TA-L" colspan="3">采购员：{{CurPrintData.PurchaserName}}</td>
          <td class="P-TA-L" colspan="3">预计到达日期：{{ CurPrintData.ExpectedTime ? $UI.Render.Date(CurPrintData.ExpectedTime,false) : ""}}</td>
        </tr>
        <tr>
          <td class="P-TA-L" colspan="3">发票号：</td>
          <td class="P-TA-L" colspan="3">发票说明：</td>
        </tr>
        <tr>
          <th>序号</th>
          <th>图片</th>
          <th>SKU编号</th>
          <th>货品名称</th>
          <th>采购数量</th>
          <th>单价(人民币)</th>
        </tr>
        <tr v-for="(item,index) in CurPrintData.Items" :key="index">
          <td>{{index +1}}</td>
          <td><img width="60" :src="$Server.File+'/'+item.Item.DefaultImage"></td>
          <td>{{item.Item.SkuCode}}</td>
          <td>{{item.Item.SkuName}}</td>
          <td>{{item.Item.PurchaseQuantity}}</td>
          <td>{{item.Item.PurchasePrice}}</td>
        </tr>
        <tr>
          <td colspan="6" class="P-TA-L">实际应付货款（人民币）：{{CurPrintData.RealPrice}}</td>
        </tr>
        <tr>
          <td colspan="6" class="P-TA-L">运费（人民币）：</td>
        </tr>
        <tr>
          <td colspan="6" class="P-TA-L">总金额（人民币）：</td>
        </tr>
        <tr>
          <td colspan="6" class="P-TA-L">备注：</td>
        </tr>
      </tbody>
    </table>
  </div>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
import getLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: 'ExportPon'
})
export default class ExportPon extends Vue {
  @Emit() EmitPurchase(r: boolean): void {}

  private TriggerModal(SelectedData: Interface.PurchaseOrd[]): void{
    this.SelectedData = SelectedData;
    this.CheckData();
  }

  private CheckData() {
    if (getLodop(this) == undefined) {
      this.ExportPurchase(false)
      return
    }
    
    this.GetPrintItems()
  }


  private GetPrintItems(): void {
    this.$UI.Loading.Show();
    let originSave = 'D:\\'
    this.SelectedData.forEach((item, index) => {
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.PurchaseOrderGetItem,
          Login: true
        },
        Data: item.Id,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            item['Items'] = Res.Data.Data
            this.CurPrintData = item;
            this.CurPrintData['RealPrice'] = 0
            for (let i in this.CurPrintData.Items) {
              this.CurPrintData['RealPrice'] += ((this.CurPrintData.Items as any)[i].Item.PurchaseQuantity * (this.CurPrintData.Items as any)[i].Item.PurchasePrice)
            }
            this.CurPrintData['RealPrice'] = (Math.round(this.CurPrintData['RealPrice'] * 100) / 100).toFixed(2)
            this.$nextTick(function() {
              var LODOP = getLodop();
              let random = new Date().getTime().toString().slice(0, 10);
              let fileName = item.PurchaseCode + '-' + random + '' + (index + 1);
              
              let user = JSON.parse(this.$Cookie.Get('frler_user')).UserName;
              LODOP.PRINT_INIT("")
              LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4")
              LODOP.ADD_PRINT_TABLE('1%', '1%', '98%', '98%', (document as any).getElementById('printItems').innerHTML)
              LODOP.SET_SAVE_MODE('FILE_PROMPT', true)
              LODOP.SAVE_TO_FILE(originSave + fileName + '.xls')
            })
            
          } else {
            this.$Request.Error(Res);
          }
          if (index == this.SelectedData.length - 1) {
            this.$UI.Loading.Hide();
            this.EmitPurchase(false)
          }
        }
      })
    })
  }

  private CurPrintData: Interface.PurchaseOrd = new Interface.PurchaseOrd()
  private SelectedData: Interface.PurchaseOrd[] = []
}

</script>
<style lang="less"></style>
