<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10"  @click="OpenScanInStorageModal()">扫描入库</Button>
      <Modal v-model="ModifyModal" title="扫描入库" @on-cancel="ClearModal(0)" :mask-closable="false" width="800">
        <Form :label-width="150" ref="InStorageForm" :model="InStorageForm" :rules="InStorageRule" inline onsubmit="return false"> 
          <Form-item label="到货单号：" prop="OrderCode" class="P-MB-10 P-W-100-Percent">
            <Input v-model.trim="InStorageForm.OrderCode" ref="InStorageOrderCodeInput" placeholder="到货单号" @on-enter="GetPaoItems" />
            <p class="Color-Gray">请扫描/输入到货单号，输入完成后请按回车键。</p>
          </Form-item>
          <Form-item label="产品名称：" class="P-W-100-Percent">
            <span>{{ InStorageForm.SkuName ? InStorageForm.SkuName : '-' }}</span>
          </Form-item>
          <Form-item label="发货仓入库数量：" prop="InStorageQuantity" class="P-W-100-Percent">
            <InputNumber class="P-W-100-Percent" @on-enter="PostInStorage('Num1')" v-model="InStorageForm.InStorageQuantity" ref="InStorageQuantityInput" placeholder="发货仓入库数量" />
          </Form-item>
          <Form-item label="发货仓货架号：" prop="LocationCode" class="P-W-100-Percent">
            <Input v-model.trim="InStorageForm.LocationCode" @on-enter="PostInStorage('Location1')" ref="InStorageLocationCodeInput" placeholder="发货仓货架号" :readonly="ReadonlyLocation1" />
          </Form-item>
          <Checkbox class="P-MB-10 P-ML-20" v-model="IsOpen">主货架货位不足开启备用货架</Checkbox>
          <Form-item v-if="IsOpen" label="备货仓入库数量：" prop="InStorageQuantity2" class="P-W-100-Percent">
            <InputNumber class="P-W-100-Percent" @on-enter="PostInStorage('Num2')" v-model="InStorageForm.InStorageQuantity2" ref="InStorageQuantity2Input" placeholder="备货仓入库数量" />
          </Form-item>
          <Form-item v-if="IsOpen" label="备货仓货架号：" prop="LocationCode2" class="P-W-100-Percent">
            <Input v-model.trim="InStorageForm.LocationCode2" @on-enter="PostInStorage('Location2')" ref="InStorageLocationCode2Input" placeholder="备货仓货架号" :readonly="ReadonlyLocation2" />
          </Form-item>
        </Form>
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="PostInStorage">提交</Button>
          <Button @click="ResetInStorageForm">重置</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Purchase";
@Component({
  name: "InStorage"
})
export default class InStorage extends Vue {
  @Emit() HandleResMsg(Type: number): void {}

  private Trigger(SelectedData: Interface.Pao[]): void {
    this.InStorageForm.OrderCode = SelectedData[0].OrderCode;
    this.GetPaoItems()
    
    this.$nextTick( ()=>{
      this.ModifyModal = true
    })
  }

  @Watch('IsOpen')
  private IsOpenLocationCode(val: boolean):void {
    if (val && this.SkuId !== 0) {
      this.GetSpare();
    } else {
      this.InStorageForm.LocationCode2 = '';
    }
    if (!this.IsGetPao) {
      (this.$refs.InStorageOrderCodeInput as any).focus();
    } else if (val) {
      this.$nextTick(function() {
        (this.$refs.InStorageQuantityInput as any).focus();
      })
    } else {
      (this.$refs.InStorageQuantityInput as any).focus();
    }
  }
  
  // 回调 打开模态框 
  private OpenScanInStorageModal(): void {
    this.HandleResMsg(0)
    this.ModifyModal = true
    this.$nextTick(()=>{
      (this.$refs['InStorageForm'] as any).resetFields();
      (this.$refs.InStorageOrderCodeInput as any).focus();
    })
  }

  // 通过到货单号 获取信息
  private GetPaoItems():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetPAOInfoByCode,
        Login: true
      },
      Data: this.InStorageForm.OrderCode,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {

          if (Res.Data.PageModel.Status !== 3 && Res.Data.PageModel.Status !== 4) {
            this.$UI.Tips.Floating('warning', '请输入状态为待入库或部分入库的到货单');
            this.InStorageForm.OrderCode = "";
            return;
          }

          this.SkuId = Res.Data.PageModel.SkuId;
          this.SkuCode = Res.Data.PageModel.SkuCode;
          this.StockUpWarehouseId = Res.Data.PageModel.StockUpWarehouseId;
          
          this.IsGetPao = true;
          this.$set(this.InStorageForm, 'Id', Res.Data.PageModel.Id)
          this.$set(this.InStorageForm, 'SkuName', Res.Data.PageModel.SkuName)
          this.$set(this.InStorageForm, 'InStorageQuantity', Res.Data.PageModel.WaitInStorageQuantity )
          this.$set(this.InStorageForm, 'LocationCode', Res.Data.PageModel.LocationCode)
          this.$set(this.InStorageForm, 'InStorageQuantity2', 0)
          this.$set(this.InStorageForm, 'LocationCode2', '')
          this.WaitInStorageQuantity = Res.Data.PageModel.WaitInStorageQuantity;

          if (this.InStorageForm.InStorageQuantity === 0) {
            this.$UI.Tips.Floating('warning', `到货单${this.InStorageForm.OrderCode}无待入库产品，无法入库`);
            (this.$refs['InStorageForm'] as any).resetFields();
            (this.$refs.InStorageOrderCodeInput as any).focus();
            return;
          } else if (Res.Data.PageModel.LocationCode !== '') {
            (this.$refs['InStorageForm'] as any).validateField('LocationCode', (valid: string): void => {
              if (valid !== '') {
                this.$UI.Tips.Floating('warning', `到货单${this.InStorageForm.OrderCode}中的SKU货架号格式不正确，无法入库，请先对SKU进行移货后再进行入库操作`);
                this.ResetInStorageForm();
              } else {
                this.ReadonlyLocation1 = true;
                if (this.IsOpen) {
                  this.GetSpare();
                }
                (this.$refs.InStorageQuantityInput as any).focus();
              }
            })
          } else {

            if (this.IsOpen) {
              this.GetSpare();
            }
            
            (this.$refs.InStorageQuantityInput as any).focus();
          }
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }

  //获取备货仓数据
  private GetSpare(): void {
    let PostData = {
      SkuId: this.SkuId,
      SkuCode: this.SkuCode,
      WarehouseId: this.StockUpWarehouseId
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.GetSkuInventory,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess == true) {
          if (Res.Data.Data.LocationCode !== "") {
            this.InStorageForm.LocationCode2 = Res.Data.Data.LocationCode;
            this.ReadonlyLocation2 = true;
          }
        }
      }
    });

  }

  //重置扫描入库
  private ResetInStorageForm() {
    this.InStorageForm = new Interface.InStorageForm();
    (this.$refs['InStorageForm'] as any).resetFields();

    this.IsGetPao = false;
    this.IsOpen = false;
    this.ReadonlyLocation1 = false;
    this.ReadonlyLocation2 = false;
    this.SkuId = 0,
    this.StockUpWarehouseId = 0,
    this.SkuCode = "",
    this.WaitInStorageQuantity = 0;

    this.$nextTick(function() {
      (this.$refs.InStorageOrderCodeInput as any).focus();
    })
  }

  // 提交 扫描入库
  private PostInStorage(Type?: string): void {
    if ( Type === 'Num1' && this.InStorageForm.InStorageQuantity === 0) {
      (this.$refs.InStorageQuantityInput as any).focus();
      return;
    } else if ( Type === 'Num1' && this.InStorageForm.LocationCode === '') {
      (this.$refs.InStorageLocationCodeInput as any).focus();
      return;
    } else if ( Type === 'Num1' && this.InStorageForm.LocationCode !== '' && this.IsOpen && this.InStorageForm.InStorageQuantity2 === 0) {
      (this.$refs.InStorageQuantity2Input as any).focus();
      return;
    } else if ( Type === 'Num1' && this.InStorageForm.LocationCode !== '' && this.IsOpen && this.InStorageForm.InStorageQuantity2 !== 0 && this.inStorageForm.LocationCode2 === '') {
      (this.$refs.InStorageLocationCode2Input as any).focus();
      return;
    }
    if ( Type === 'Location1' && this.InStorageForm.LocationCode === '') {
      (this.$refs.InStorageLocationCodeInput as any).focus();
      return;
    } else if ( Type === 'Location1' && this.single && this.InStorageForm.InStorageQuantity2 === 0) {
      (this.$refs.InStorageQuantity2Input as any).focus();
      return;
    } else if ( Type === 'Location1' && this.single && this.InStorageForm.LocationCode2 === '') {
      (this.$refs.InStorageLocationCode2Input as any).focus();
      return;
    }
    if ( Type === 'Num2' && this.InStorageForm.InStorageQuantity2 === 0) {
      (this.$refs.InStorageQuantity2Input as any).focus();
      return;
    }
    if ( Type === 'Num2' && this.InStorageForm.LocationCode2 == '') {
      (this.$refs.InStorageLocationCode2Input as any).focus();
      return;
    }
    let PostData: any;
      
    if ( !this.IsGetPao) {
      this.$UI.Tips.Floating('warning', `请输入并加载到货单号`);
      (this.$refs.InStorageOrderCodeInput as any).focus();
      return;
    }
    PostData = JSON.parse(JSON.stringify(this.InStorageForm));

    (this.$refs['InStorageForm'] as any).validate((valid: boolean): void => {
      if (valid) {
        if (Number(PostData.InStorageQuantity) + Number(PostData.InStorageQuantity2) > this.WaitInStorageQuantity) {
          this.$UI.Tips.Floating('warning', `入库数量不能大于待入库数量`);
          return;
        }
        if (this.IsOpen && this.InStorageForm.InStorageQuantity2 > 0) {
          this.$UI.Tips.Modal({
            Type:'confirm',
            Content: `入库明细：发货仓${this.InStorageForm.LocationCode}入库${this.InStorageForm.InStorageQuantity}件；备货仓${this.InStorageForm.LocationCode2}入库${this.InStorageForm.InStorageQuantity2}件。确定数量无误？`,
            Enter:false,
            Callback:(bool:boolean):void=>{
              if(bool){
                this.InStorageAjax(PostData)
              }
            }
          })
        } else {
          this.InStorageForm.InStorageQuantity2 = 0;
          this.InStorageForm.LocationCode2 = "";
          this.InStorageAjax(this.InStorageForm)
        }
      } else {
        (this.$refs['InStorageForm'] as any).validateField('OrderCode', (valid: string): void => {
          // OrderCode
          if (valid !== '') {
            (this.$refs.InStorageOrderCodeInput as any).focus();
          } else {
            (this.$refs['InStorageForm'] as any).validateField('InStorageQuantity', (valid: string): void => {
              // InStorageQuantity
              if (valid !== '') {
                (this.$refs.InStorageQuantityInput as any).focus();
              } else {
                (this.$refs['InStorageForm'] as any).validateField('LocationCode', (valid: string): void => {
                  // LocationCode
                  if (valid !== '') {
                    (this.$refs.InStorageLocationCodeInput as any).focus();
                  } else if (this.IsOpen) {
                    this.$nextTick(function() {
                      (this.$refs['InStorageForm'] as any).validateField('InStorageQuantity2', (valid: string): void => {
                        // InStorageQuantity2
                        if (valid !== '') {
                          (this.$refs.InStorageQuantity2Input as any).focus();
                        } else {
                          (this.$refs['InStorageForm'] as any).validateField('LocationCode2', (valid: string): void => {
                            // LocationCode2
                            if (valid !== '') {
                              (this.$refs.InStorageLocationCode2Input as any).focus();
                            }
                          })
                        }
                      })
                    })
                  } else {
                    (this.$refs.InStorageQuantityInput as any).focus();
                  }
                })
              }
            })
          }
        })
        return;
      }
    })  
  }

  // 发送请求 
  private InStorageAjax(postData: any): void {
    postData.InStorageQuantity = Number(postData.InStorageQuantity)
    postData.InStorageQuantity2 = Number(postData.InStorageQuantity2)

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PurchaseArrivalOrderInStorage,
        Login: true
      },
      Data: postData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Tips.Floating('success', `入库成功`);
        if (Res.IsSuccess == true) {    
          this.ResetInStorageForm();
          (this.$refs.InStorageOrderCodeInput as any).focus();
          this.HandleResMsg(1);
        } else {
          this.$UI.Loading.Hide();
          (this.$refs['InStorageForm'] as any).resetFields();
          (this.$refs.InStorageOrderCodeInput as any).focus();
          this.$Request.Error(Res);
        }
      }
    });
  }


  // 关闭模态框
  private ClearModal(Val:number):void {
    this.$set(this, 'ModifyModal', false);
    this.ResetInStorageForm()
    this.$nextTick(()=>{
      this.HandleResMsg(Val)
    })
    this.InStorageForm = new Interface.InStorageForm();
  }

  private SelecData: Interface.Pao[] = []; //当前选中数据

  private ModifyModal: boolean = false; // 控制模态框
  private IsOpen: boolean = false; // 开启备用
  private IsGetPao: boolean = false; // 是否已经获取到货单
  private WaitInStorageQuantity: number = 0 // 当前到货单待入库数量

  private InStorageForm: Interface.InStorageForm = new Interface.InStorageForm(); // 修改物流信息表单

  private ReadonlyLocation1: boolean = false; // 只读 货架号
  private ReadonlyLocation2: boolean = false; // 只读 备货架

  private SkuId: number = 0; // 目标SkuId
  private SkuCode: string = ""; // 目标SkuCode
  private StockUpWarehouseId: number = 0; // 目标仓库ID

  private InStorageRule:any = {
    OrderCode: [{ required: true, message: ' ' }],
    InStorageQuantity: [
      { required: true, min: 1, type:"number", message: '请输入发货仓入库数'}
    ],
    LocationCode: [
      { required: true, message: '请输入发货仓货架号'},
      { pattern: this.$Pattern.LocationCode, message: '请输入正确的发货仓货架号'}
    ],
    
    InStorageQuantity2: [
      { required: true, min: 1, type:"number", message: '请输入备货仓入库数'}
    ],
    LocationCode2: [
      { required: true, message: '请输入备货仓货架号'},
      { pattern: this.$Pattern.LocationCode, message: '请输入正确的备货仓货架号' }
    ]
  }
}
</script>