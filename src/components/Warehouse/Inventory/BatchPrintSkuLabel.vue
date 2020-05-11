<!--批量打印SKU标签-->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block P-MR-10" @click="ChangeModal(true)">批量打印SKU标签</Button>
    <Modal v-model="BatchPrintSkuModal" title="打印货架条码" @on-cancel="CancelModal" :mask-closable="false" width="950">
      <Row>
        <Col span="4">
        <Button @click="OpenEnableSkuModal" type="primary">添加SKU</Button>
        </Col>
        <Col span="20">
        <span>修改打印数量为：</span>
        <Input-number :min="1" v-model="PrintQuantity" @keypress.native="QtyyKeyPress" class="P-MR-5"></Input-number>
        <Button @click="ChangeQty">修改</Button>
        </Col>
      </Row>
        <Table class="P-MT-10" border :columns="SkuLabelCol" :data="SelectData" height="450" size="small" stripe ref="SkuLabelTable"></Table>
      <footer slot="footer" class="P-TA-R">
        <Button type="primary" @click="ValidatePrint">打印</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
    <EnableSku ref="EnableSku" @handle-res-msg="HandleSkuRes" ></EnableSku>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Watch } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
import getLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: 'BatchPrintSkuLabel',
  components: {
    EnableSku: () => import('@/components/Public/EnableSku.vue'),
  }
})
export default class BatchPrintSkuLabel extends Vue {
  @Emit() ChangeModal(Res: boolean): void {
  }

  private CancelModal(): void {
    this.ResetList()
    this.BatchPrintSkuModal = false
  }

  private TriggerModal(Select: Interface.InventoryManageList[]): void{
    this.SelectData = Select
    this.BatchPrintSkuModal = true
    if (this.SelectData.length > 0) {
      this.ChangeQty()
    }
  }

  private ResetList(): void {
    this.SelectData = []
    this.PrintQuantity = 1
    this.ChangeModal(false)
  }

  // 打开选择SKU
  private OpenEnableSkuModal(): void {
    (this.$refs['EnableSku'] as Vue).Trigger(false);
  }

  // Sku回调
  private HandleSkuRes(SelectSku: PInterface.EnableSku[]):void {
    SelectSku.forEach((Item: PInterface.EnableSku) => {
      let Flag = true
      this.SelectData.forEach((x: Interface.InventoryManageList) => {
        if (x.SkuCode.toLowerCase() === Item.SkuCode.toLowerCase()) {
          Flag = false
        }
      })
      if (Flag) {
        let Temp: Interface.InventoryManageList = new Interface.InventoryManageList()
        Temp["DefaultImage"] = Item.DefaultImage
        Temp["SkuCode"] = Item.SkuCode
        Temp["SkuName"] = Item.SkuName
        Temp["Quantity"] = 1
        this.GetLocationCode(Temp)
      }
    })
  }

  //获取货架号
  private GetLocationCode(Obj: Interface.InventoryManageList){
    let PostData: Interface.SkuInventory = new Interface.SkuInventory();
    PostData["SkuId"] = 0;
    PostData["WarehouseId"] = JSON.parse(this.$Cookie.Get('frler_user')).WarehouseId;
    PostData["SkuCode"] = Obj.SkuCode;

    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.InventoryGetSkuInventory
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          Obj.LocationCode = Res.Data.Data.LocationCode;
          this.SelectData.push(Obj);
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //统一修改值
  private ChangeQty() : void{
    this.SelectData.forEach((Item) => {
      Item.Quantity = this.PrintQuantity
    })
  }
  private QtyyKeyPress(E: any): void {
    if (E.keyCode == 13) {
      this.ChangeQty()
    }
  }

  private ValidatePrint(): void{
    if (this.SelectData.length < 1) {
      this.$UI.Tips.Floating('warning', '请选择SKU进行打印操作')
      return
    }

    let Flag = true
    this.SelectData.forEach((Item) => {
      if (Item.Quantity == 0) {
        Flag = false
      }
    })

    if (!Flag) {
      this.$UI.Tips.Floating('warning', '请输入SKU的打印数量')
      return
    } else {
      this.PrintSkuLabel()
    }
  }

  private PrintSkuLabel() {
    let LODOP:any = null;
    LODOP = getLodop();
    this.$UI.Loading.Show();
    this.SelectData.forEach((Item, Index) => {
      if (Index != 0) {
        LODOP.PRINT_INITA("0mm", "0mm", '60mm', '40mm', "");
        LODOP.SET_PRINT_PAGESIZE(0, '60mm', '40mm', "SKU标签");
        LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
        LODOP.NewPage()
        LODOP.PRINT()
      }

      let Pages = Math.ceil(Item.Quantity / 40)
      for (let I = 1; I <= Pages; I++) {
        LODOP.PRINT_INITA("0mm", "0mm", '60mm', '40mm', "");
        LODOP.SET_PRINT_PAGESIZE(0, '60mm', '40mm', "SKU标签");
        LODOP.SET_PRINT_MODE("PRINT_NOCOLLATE", 1);
        let Items = this.$Utils.ComputedSkuLabelAmount(I, Item.Quantity, 40)
        for (let J = 0; J < Items; J++) {
          this.$Utils.DesignSkuLabel(LODOP, Item.SkuCode, Item.SkuCode, Item.SkuName, Item.LocationCode)
        }
        LODOP.PRINT()
      }
    })
    this.$UI.Loading.Hide();
    this.$UI.Tips.Floating('success', '打印SKU标签成功')
    this.ResetList()
  }

  //表格内数据填充到提交数据
  private SetTabInput(Val: string|number, Idx: number, Key:string): void{
    (this.SelectData[Idx] as any)[Key] = Val
  }

  //删除表格行
  private DeleteCols(Idx: number):void{
    this.SelectData.splice(Idx, 1)
  }

  private PrintQuantity: number = 1;
  private BatchPrintSkuModal: boolean = false;
  private SelectData: Interface.InventoryManageList[] = []
  private SkuLabelCol: PInterface.TableCol[] = [
    { title: '图片', width: 80, render: (h, params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            // cursor: 'pointer'
          },
          // on: {
          //   click: () => {
          //     this.ShowPic(params.row.DefaultImage)
          //   }
          // }
        })
      }
    },
    { title: 'SKU编号', key: 'SkuCode' }, 
    { title: '产品名', key: 'SkuName' },
    { title: '产品名', key: 'SkuName' },
    { title: '打印数量', render: (h: any, params: any): string => {
        return h('InputNumber', {
          style: {
            width: '80%'
          },
          props: {
            min: 1,
            value: params.row.Quantity
          },
          on: {
            'on-change': (Name: number) => {
              this.SetTabInput(Name, params.index, 'Quantity')
            }
          }
        })
      }
    }, 
    { title: '操作', width: 80, render: (h: any, params: any): string => {
        return h('Button', {
          props: {
            type: 'error',
            size: 'small'
          },
          on: {
            click: () => {
              this.DeleteCols(params.index)
            }
          }
        }, '删除')
      }
    }
  ]
}
</script>