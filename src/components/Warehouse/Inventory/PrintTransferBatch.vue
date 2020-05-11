<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-MR-10 P-MB-10"  @click="TriggerModal">打印批次</Button>
    <Modal title="打印批次" v-model="IsPrint" :mask-closable="false" width="500" @on-cancel="ChangePrintModal(false)">
      <Form inline onsubmit="return false" :model="PrintForm" ref="PrintForm" :label-width="120">
        <Form-item prop="PaperType" label="纸张类型：" class="ivu-form-item-required">
          <Select v-model="PrintForm.PaperType" placeholder="请选择纸张类型" :options="PaperTypeList" />
          <!-- <Select v-model="PrintForm.PaperType" placeholder="请选择纸张类型" filterable>
            <Option v-for="(Item,Index) in PaperTypeList" :value="$Enums.Warehouse.PaperType[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="CheckData">打印</Button>
        <Button type="default" style="margin-left: 8px" @click="ChangePrintModal(false)">取消</Button>
      </div>
    </Modal>
    <Col span="24" style="display: none;" id="tpl">
    <table class="viewTable" border="1" cellspacing="0" cellpadding="8" width="720" style="margin-top: 20px;font-family:'宋体';font-size: 12px;">
      <th>SKU编号</th>
      <th style="word-break: break-all;">产品名</th>
      <th>待拣数</th>
      <th>可用库存数</th>
      <th>货架号</th>
      </tr>
      <tr class="tcenter" style="text-align: center;" v-for="Item in PrintData" v-if="PrintData.length > 0">
        <td>{{ Item.SkuCode }}</td>
        <td>{{ Item.SkuName }}</td>
        <td>{{ Item.NeedPickQuantity }}</td>
        <td>{{ Item.StockQuantity }}</td>
        <td>{{ Item.LocationCode }}</td>
      </tr>
    </table>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
import GetLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: 'PrintTransferBatch'
})
export default class PrintTransferBatch extends Vue {
  @Prop() SelectedData:Interface.TransferPickBatchList[]
  @Emit() ChangePrintModal(Val: boolean):void{
    this.PrintForm = new Interface.PrintBatchForm();
    this.IsPrint = false;
  }

  private TriggerModal():void{
    if(this.SelectedData.some(Item=> Item.TransferRequireStatus>2) ){
      this.$UI.Tips.Floating('warning', '请选择状态为待拣货或已打印的批次进行操作')
      return;
    }
    this.IsPrint = true;
  }

  private CheckData():void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferBatchPrint,
				Login: true
			},
			Data: { TransferBatchCode: this.SelectData.map(Item=>Item.TransferBatchCode), NeedItemData: this.PrintForm.PaperType === 1 ? true : false },
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          // this.$UI.Tips.Floating('success', `打印批次成功`);
          // this.ChangePrintModal();
          this.PrepareData(Res.Data.Data)
				} else {
          this.$Request.Error(Res);
				}
			}
		})
  }

  private PrepareData(Data: Interface.PrintBatchData[]): void{
    if(this.PrintForm.PaperType === 1 && Data[0].Items){
      this.PrintData = (Data[0].Items as Interface.PrintBatchItems[]).filter(val => val.NeedPickQuantity > 0)
    }
    this.$nextTick(() => {
      this.PrintPickingOrder(Data, this.PrintForm.PaperType)
    })
  }

  private PrintPickingOrder(Data: Interface.PrintBatchData[], type: number): void {
    let CurrentData = Data[0]
    let Now = new Date();
    let NowMonth = Now.getMonth() + 1;
    let Current = Now.getFullYear() + "-" + (NowMonth < 10 ? '0' + NowMonth : NowMonth) + "-" + (Now.getDate() < 10 ? '0' + Now.getDate() : Now.getDate()) +
      " " + (Now.getHours() < 10 ? '0' + Now.getHours() : Now.getHours()) + ":" + (Now.getMinutes() < 10 ? '0' + Now.getMinutes() : Now.getMinutes()) +
      ":" + (Now.getSeconds() < 10 ? '0' + Now.getSeconds() : Now.getSeconds());
    let LODOP = GetLodop()

    if(type === 1) {

      LODOP.PRINT_INITA("0mm", "0mm", "210mm", "296.99mm", "拣货单");
      LODOP.SET_PRINT_PAGESIZE(1, 2100, 2970, "拣货单");
      LODOP.ADD_PRINT_BARCODE("8.2mm", "10.58mm", "65.88mm", "18.52mm", "128Auto", CurrentData.TransferBatchCode);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      LODOP.ADD_PRINT_TEXT("27.52mm", "10.58mm", "60.59mm", "6.35mm", CurrentData.TransferBatchCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("11.64mm", "81.49mm", "74.08mm", "12.17mm", "调拨批次拣货单");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 22);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.ADD_PRINT_TEXT("36.78mm", "10.58mm", "60.59mm", "6.35mm", `待拣SKU数量：${CurrentData.NeedPickQuantity}`);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
      LODOP.ADD_PRINT_TEXT("36.51mm", "139.96mm", "60.59mm", "6.35mm", Current);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);

      LODOP.ADD_PRINT_HTM(180, 40, '100%', '81%', (document as any).getElementById("tpl").innerHTML);
      LODOP.PRINT();
    } else {
      LODOP.PRINT_INITA("0mm", "0mm", "60.01mm", "40.01mm", "拣货单");
      LODOP.SET_PRINT_PAGESIZE(1, 600, 400, "拣货单");
      LODOP.ADD_PRINT_BARCODE("2.65mm", "10.85mm", "37.84mm", "11.38mm", "128Auto", CurrentData.TransferBatchCode);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
      LODOP.ADD_PRINT_TEXT("15.29mm", "-0.53mm", "60.59mm", "6.35mm", CurrentData.TransferBatchCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("20.11mm", "4.23mm", "60.59mm", "6.35mm", `待拣SKU数量：${CurrentData.NeedPickQuantity}`);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.ADD_PRINT_TEXT("28.05mm", "4.5mm", "60.59mm", "6.35mm", `打印时间：${Current}`);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);

      LODOP.PRINT();
    }
    if(Data.length > 1){
      Data.splice(0,1)
      this.PrepareData(Data)
    }else{
      this.$UI.Tips.Floating('success', '打印批次成功')
      this.ChangePrintModal(true)
    }
  }

  private PrintData:Interface.PrintBatchItems[] = []; //渲染打印表格的数据
  private SelectData:Interface.TransferPickBatchList[] = [];
  private IsPrint: boolean = false;
  private PrintForm: Interface.PrintBatchForm = new Interface.PrintBatchForm();
  private PaperTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.PaperType);  //下拉
}

</script>
<style lang="less"></style>
