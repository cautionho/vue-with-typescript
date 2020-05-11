<!-- 批量打印SKU标签 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10"  @click="OpenModal">批量打印SKU标签</Button>
      <Modal v-model="ModifyModal" title="批量打印SKU标签" @on-cancel="ClearModal(0)" :mask-closable="false" :width="1100">
        <Row>
          <Form :label-width="150" ref="PrintSkuForm" :model="PrintSkuForm" :rules="BatchPrintSkuRule" inline onsubmit="return false"> 
            <FormItem label="到货单号/采购单号：" class="P-W-100-Percent P-MB-10" prop="Code">
              <Input ref="BatchPrintSkuLabelCode" placeholder="到货单号/采购单号" v-model="PrintSkuForm.Code" @on-enter="CheckPrintSkuData"/>
              <p class="Color-Gray">请扫描/输入到货单号或快递单号，输入完成后请按回车键。</p>
            </FormItem>
            <FormItem label="选择标签大小："  class="P-W-100-Percent ivu-form-Item-required" >
              <Select class="P-W-100-Percent" v-model="PrintSkuSize" placeholder="标签大小" :options="DropSkuSizeList" />
            </FormItem>
          </Form>
          <Col>
            <Table :columns="Cols" :data="List" size="small" stripe :height="400" ref="BatchPrintSkuTable" ></Table>
          </Col>
        </Row>
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="PrintSku()">打印</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Purchase";
import GetLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: "PrintSkuLabel"
})
export default class PrintSkuLabel extends Vue {

  @Emit() HandleResMsg(Type: number): void {}

  private Trigger(): void {
    this.ModifyModal = true
    
    this.$nextTick( ()=>{
      (this.$refs['BatchPrintSkuLabelCode'] as Vue).focus();
    })
  }

   // 回调 打开模态框 
  private OpenModal(): void {
    this.HandleResMsg(2)
  }

  // 校验 提交打印到货单
  private CheckPrintSkuData(): void {
    (this.$refs['PrintSkuForm'] as any).validate((valid: boolean): void => {
      if (valid) {
        
        // 批量打印SKU
        for (let i = 0; i < this.List.length; i++) {
          if (this.List[i].PaoOrderCode === this.PrintSkuForm.Code) {
            this.$UI.Tips.Floating('warning', `该到货单已存在列表中`);
            this.PrintSkuForm.Code = ""
            return;
          }
        }
        this.GetSkuData();
        
      } 
    })
  }

  // 获取SKU列表数据
  private GetSkuData(): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PrintSKU,
        Login: true
      },
      Data: this.PrintSkuForm.Code,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          // 查找是否有相同SKU并且不同订单
          Res.Data.Data.forEach((Item: any, Index: number): void => {
            if ( !this.List.some(Ite => Ite.PaoOrderCode === Item.PaoOrderCode) ) {
              this.List.push(Res.Data.Data[Index])
            }
          });

          this.PrintSkuForm.Code = "";
          (this.$refs['PrintSkuForm'] as any).resetFields();
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }

  // 打印SKU
  private PrintSku(): void {
    if (this.List.length === 0) {
      this.$UI.Tips.Floating('warning', `请输入到货单/快递单号，按回车键`);
      return;
    }

    const LODOP = GetLodop();
    const PrintSize: string[] = this.PrintSkuSize.split('*');
    const PrintTitle:any = document.createElement('p');
    PrintTitle.style.textAlign = 'center';
    const PrintWidth: string = PrintSize[0];
    const PrintHeight: string = PrintSize[1];
    const BarcodeWidth: number = Number(PrintWidth) - 10;
    const BarcodeHeight: number = Number(PrintHeight) - 20;

    this.$UI.Loading.Show();
    for (let Item in this.List) {

      let Barcode: string = this.List[Item].SkuCode
      let ShowPrintCode: string = Barcode
      let SkuName: string= this.List[Item].SkuName
      let LocationCode: string = this.List[Item].LocationCode
      if (Item !== "0") {
        LODOP.NewPage()
        LODOP.PRINT_INITA("0mm", "0mm", PrintWidth + 'mm', PrintHeight + 'mm', "");
        LODOP.SET_PRINT_PAGESIZE(0, PrintWidth + 'mm', PrintHeight + 'mm', "");
        LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
        LODOP.PRINT()
      }

      let Pages: number = Math.ceil( this.List[Item].ArrivalQuantity / 40)
      for (let I = 1; I <= Pages; I++) {
        LODOP.PRINT_INITA("0mm", "0mm", PrintWidth + 'mm', PrintHeight + 'mm', "");
        LODOP.SET_PRINT_PAGESIZE(0, PrintWidth + 'mm', PrintHeight + 'mm', "");
        LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
        let Items:number = this.ComputedSkuLabelAmount(I, this.List[Item].ArrivalQuantity, 40)
        for (let j = 0; j < Items; j++) {
          this.DesignSkuLabel(LODOP, Barcode, ShowPrintCode, SkuName, LocationCode)
        }
        LODOP.PRINT()
      }
    }
    this.$UI.Tips.Floating('success', `打印SKU标签成功`);
    this.$UI.Loading.Hide();
    this.EmptyContent();
  }

  // 计算一次打印多少张SKU标签
  private ComputedSkuLabelAmount(Index: number, Amount: number, PageSize: number): number {
    return Index * PageSize > Amount ? Amount - ((Index - 1) * PageSize) : PageSize
  }

  // 画SKU标签
  private DesignSkuLabel(LODOP: any, Barcode: string, ShowPrintCode: string, SkuName: string, LocationCode: string): void {
    LODOP.NewPage()
    LODOP.ADD_PRINT_BARCODE("4.26mm", "10%", "80%", "13.15mm", "128Auto", Barcode);
    LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
    LODOP.ADD_PRINT_TEXT("19.82mm", "25.51mm", "32.54mm", "6.56mm", ShowPrintCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("28.84mm", "1.59mm", "57.68mm", "9.79mm", SkuName);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT("19.82mm", "2.01mm", "23.5mm", "5.29mm", LocationCode);
    LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
  }

  // 清空内容
  private EmptyContent():void {
    this.PrintSkuForm = new Interface.SingleCodeForm();
    (this.$refs['PrintSkuForm'] as any).resetFields();
    this.List.splice(0, this.List.length);
    this.PrintSkuSize = '60*40';
    this.List.splice(0);

  }

   // 关闭模态框
  private ClearModal(Val:number):void {
    this.EmptyContent();
    this.ModifyModal = false;
    this.HandleResMsg(Val)
  }


  private PrintSkuSize:string = '60*40'; //打印SKU标签尺寸默认值

  private ModifyModal: boolean = false // 控制模态框

  private PrintSkuForm: Interface.SingleCodeForm = new Interface.SingleCodeForm(); // 扫描签收
  private BatchPrintSkuRule: any = {
    Code: [{ required: true, message: ' ' }]
  }

  // 打印SKU标签大小
  private DropSkuSizeList: PInterface.KV[] = [
    { Key: "50*30mm", Value: "50*30" },
    { Key: "50*20mm", Value: "50*20" },
    { Key: "50*25mm", Value: "50*25" },
    { Key: "40*20mm", Value: "40*20" },
    { Key: "40*25mm", Value: "40*25" },
    { Key: "40*30mm", Value: "40*30" },
    { Key: "60*30mm", Value: "60*30" },
    { Key: "60*40mm", Value: "60*40" },
    { Key: "70*40mm", Value: "70*40" },
    { Key: "70*50mm", Value: "70*50" },
    { Key: "80*40mm", Value: "80*40" },
  ]

  private List: Interface.PrintSku[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { title: '到货单号', key: 'PaoOrderCode' },
    { title: 'SKU编号', key: 'SkuCode' },
    { title: '数量', width: 250, render: (h: any, params: any): string => {
      return h('InputNumber', {
        props: {
          'min': 0,
          'value': this.List[params.row._index].ArrivalQuantity
        },
        className: 'P-W-100-Percent',
        on: {
          'on-change': (val: number) => {
            this.List[params.row._index].ArrivalQuantity = val
          }
        }
      })
    }}
  ];
}
</script>