<!--  打印货架条码操作 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block P-MR-10"  @click="TriggerModal">打印SKU标签</Button>
    <Modal :mask-closable="false" title="打印SKU标签" v-model="ShowModal" :width="600" @on-cancel="CancelPrint(true)">
      <Form onsubmit="return false" :model="PrintMsg" ref="PrintMsg" :rules="PrintMsgRule" :label-width="100" name="PrintMsg">
        <Form-item label="选择仓库：" class="pw85" prop="WarehouseId">
          <Select v-model="PrintMsg.WarehouseId" placeholder="请选择仓库" :options="WarehouseList" />
          <!-- <Select v-model="PrintMsg.WarehouseId" placeholder="请选择仓库" filterable label-in-value clearable>
            <Option v-for="(Item, Index) in WarehouseList" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="SKU编号：" prop="SkuCode">
          <Input @on-enter="SubmitPrint" v-model.trim="PrintMsg.SkuCode" ref="skuInput" placeholder="请输入SKU编号"></Input>
        </Form-item>
        <Form-item label="打印数量：" class="ivu-form-item-required">
          <InputNumber class="P-W-100-Percent" v-model="PrintNum" :min="1"></InputNumber>
        </Form-item>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="SubmitPrint">打印</Button>
        <Button @click="CancelPrint(true)">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
import getLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: 'PrintShelvesBarcode'
})
export default class PrintShelvesBarcode extends Vue {
  @Prop() WarehouseList: PInterface.KV[]
  private CancelPrint(B: boolean): void{
    if(B){
      this.ShowModal = false;
      (this.$refs['PrintMsg'] as any).resetFields();
    }
  }

  private TriggerModal():void{
    this.ShowModal = true;
    this.InputFocus();
  }

  // 按回车键
  private SubmitPrint() {
    (this.$refs['PrintMsg'] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.GetPrintData(JSON.parse(JSON.stringify(this.PrintMsg)));
      }
    })
  }

  // 调用打印接口 获取SKU  获取成功后调用打印
  private GetPrintData(PostData: Interface.SkuLabel): void {
    if (getLodop(this) == undefined) {
      this.CancelPrint(true)
      return;
    }
    this.IsSplit++;
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.InventoryGetSkuInventory
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          // 打印
          this.IsSplit = 0;
          this.PrintFunc(Res.Data.Data);
        } else {
          if (this.IsSplit % 2 == 1) {
            if (PostData.SkuCode.lastIndexOf('-') != -1) {
              PostData.SkuCode = PostData.SkuCode.slice(0, PostData.SkuCode.lastIndexOf('-'))
              this.GetPrintData(PostData)
            } else {
              this.IsSplit = 0;
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
              this.CancelPrint(false)
            }
          } else {
            this.IsSplit = 0;
            this.$UI.Loading.Hide();
            this.$Request.Error(Res);
            this.CancelPrint(false)
          }
        }
      }
    })
  }

  // 打印
  private PrintFunc(PrintData: any) {
    var LODOP;
    LODOP = getLodop();
    let Pages = Math.ceil(this.PrintNum / 40)
    for (let I = 1; I <= Pages; I++) {
      LODOP.PRINT_INITA("0mm", "0mm", '60mm', '40mm', "");
      LODOP.SET_PRINT_PAGESIZE(0, '60mm', '40mm', "SKU标签");
      LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
      let items = this.$Utils.ComputedSkuLabelAmount(I, this.PrintNum, 40)
      for (let J = 0; J < items; J++) {
        this.$Utils.DesignSkuLabel(LODOP, this.PrintMsg.SkuCode, this.PrintMsg.SkuCode, PrintData.SkuName, PrintData.LocationCode)
      }
      LODOP.PRINT()
    }
    this.$UI.Loading.Hide();
    this.CancelPrint(false)
    this.$UI.Tips.Floating('success', '打印SKU标签成功');
    this.PrintNum = 1;
    this.PrintMsg.SkuCode= ""
  }


  //获取焦点
  private InputFocus() {
    this.$nextTick( () => { (this.$refs["skuInput"] as any).focus();})
  }

  private PrintNum: number = 1;
  private ShowModal: boolean = false;
  private PrintMsg: Interface.SkuLabel = new Interface.SkuLabel()
  private IsSplit:number = 0; //是否已经截取PAOID 单数为为截取 双数为已截取
  private PrintMsgRule: any = {
    'WarehouseId': [{ required: true, message: '请选择仓库', trigger: 'change', type: 'number' }],
    'SkuCode': [{ required: true, message: '请输入SKU编号', trigger: 'blur' }]
  }
}
</script>