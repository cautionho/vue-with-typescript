<!-- 添加  编辑 -->
<template>
  <Row class="P-Inline-Block P-MR-10">
    <Col>
      <Button type="primary" @click="OpenModifyPuchaseApplyModal()">添加采购申请</Button>
      <Modal v-model="ModifyModal" :title=" IsEdit ? '编辑申请' : '添加申请' " @on-cancel="ClearModal(0)" :mask-closable="false" width='1100'>
        <!-- 添加 -->
        <Row>
          <div v-if="!IsEdit">
            <Form :label-width="100" :model="OperateForm" :rules="OperateFormRule" ref="OperateForm" onsubmit="return false">
              <Form-item label="仓库：" prop="WarehouseId">
                <Select placeholder="选择仓库" v-model="OperateForm.WarehouseId" :options="DropWarehouseList" />
              </Form-item>
            </Form>
            <h1 class="P-TA-C">物品列表</h1>
            <Col span="24" class="P-MT-10">
              <Table :columns="Cols" :data="List" size="small" stripe :height="400" ref="ModifyPurchaseApply" ></Table>
            </Col>
          </div>
        <!-- 编辑 -->
          <div v-else >
            <Form :label-width="100" :model="OperateFormEdit" :rules="OperateFormEditRule" ref="OperateFormEdit" onsubmit="return false">
              <Row>
                <Col span="18">
                  <Col span="12">
                    <Form-item class="P-MB-10" label="SKU编号：">
                      {{ List[0].ApplySummarX.SkuCode }}
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item class="P-MB-10" label="SKU名称：">
                    {{ List[0].ApplySummarX.SkuName }}
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item class="P-MB-10" label="当前库存：">
                      {{ List[0].InventorX.Quantity }}
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item class="P-MB-10" label="在途库存：">
                      {{ List[0].InventorX.PurchasingQuantity }}
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item class="P-MB-10" label="销售数据：">
                      {{ `${List[0].AvgSaleQuantitX.AvgSaleQuantity7}/${List[0].AvgSaleQuantitX.AvgSaleQuantity15}/${List[0].AvgSaleQuantitX.AvgSaleQuantity30}` }}
                    </Form-item>
                  </Col>
                </Col>
                <Col span="6">
                  <div class="Detail-Picture" :style="{ background: `url(${$Server.File}/${List[0].ApplySummarX.DefaultImage}) no-repeat` }"></div>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <Form-item label="仓库：" prop="WarehouseId">
                    <Select placeholder="请选择仓库" v-model="OperateFormEdit.WarehouseId" :options="DropWarehouseList" />
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="采购数量：" prop="Quantity">
                    <InputNumber placeholder="采购数量" class="P-W-100-Percent" v-model="OperateFormEdit.Quantity"></InputNumber>
                  </Form-item>
                </Col>
                <Col span="24">
                  <Form-item class="P-MB-10" label="备注：">
                    <Input placeholder="备注" v-model="OperateFormEdit.Remark" />
                  </Form-item>
                </Col>
              </Row>
            </Form>
          </div>
          <Col span="24" class="P-MT-10 P-TA-R">
            <Button type="primary" @click="OpenEnableSkuModal()">{{ IsEdit ? '更换SKU' : '添加SKU' }}</Button>
          </Col>
        </Row>
        
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="CheckData(true)">提交审核</Button>
          <Button type="primary" @click="CheckData(false)">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </footer>
      </Modal>
    </Col>
    <EnableSku ref="EnableSku" @handle-res-msg="HandleSkuRes" ></EnableSku>
  </Row>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '../../../assets/Interface/Public';
  import Interface from "../../../assets/Interface/Purchase";
  @Component({
    name: 'ModifyPurchaseApply',
    components: {
      EnableSku: () => import('@/components/Public/EnableSku.vue')
    }
  })
  export default class ModifyPurchaseApply extends Vue {
    @Prop() IsEdit: boolean; // 添加或编辑
    @Prop() DropWarehouseList: PInterface.KV;   // 被选中的数据
    @Prop() ShowModal: boolean;   // 模态框
    @Prop() SelectedEditData: Interface.PurchaseApply[];   //选中数据

    @Emit() HandleResMsg(Type:number): void {}

    // 打开模态框
    @Watch('ShowModal')
    private IsShowModal(Bool: boolean):void {
      if( Bool ){
        // 是否为编辑
        if (this.IsEdit) {
          this.List.push({
            'ApplySummarX': this.SelectedEditData[0].ApplySummary,
            'AvgSaleQuantitX': this.SelectedEditData[0].AvgSaleQuantity,
            'InventorX': this.SelectedEditData[0].Inventory
          })
          this.OperateFormEdit.WarehouseId = this.SelectedEditData[0].ApplySummary.ToWarehouseId
          this.OperateFormEdit.Quantity = this.SelectedEditData[0].ApplySummary.PurchaseQuantity as number
          this.OperateFormEdit.Remark = this.SelectedEditData[0].ApplySummary.Remark as string
        } 
        
        this.ValidateForm = this.IsEdit ? 'OperateFormEdit' : 'OperateForm';

        this.$nextTick(function() {
          this.$set(this,'ModifyModal', true);
        })
      } 
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.GoodsData.splice(0, this.GoodsData.length);
      this.SelectedData.splice(0, this.SelectedData.length);
      this.List.splice(0, this.List.length);

      (this as any).$refs[this.ValidateForm].resetFields();
      this.$set(this, 'ModifyModal', false);

      this.HandleResMsg(Val);
    }

    // 回调打开添加模态框
    private OpenModifyPuchaseApplyModal():void {
      this.HandleResMsg(2);
    }

    // 回调打开选择SKU
    private OpenEnableSkuModal(): void {
      (this as any).$refs[this.ValidateForm].validate((valid:boolean) => {
        if (valid) {
          (this.$refs['EnableSku'] as Vue).Trigger(this.IsEdit, 'ModifyPurchaseApply');
        } else {
          // 编辑略过采购数量
          if (this.ValidateForm === 'OperateFormEdit' && this.OperateFormEdit.WarehouseId !== '') {
            (this.$refs['EnableSku'] as Vue).Trigger(this.IsEdit, 'ModifyPurchaseApply');
          }
          return
        }
      })
    }

    // Sku回调
    private HandleSkuRes(SelectData: PInterface.EnableSku[]):void {
      // 回调成功执行
      
      this.SelectedData = SelectData
      if (this.IsEdit) {
        this.OperateFormEdit.Quantity = 0
        this.OperateFormEdit.Remark = ''
        SelectData[0]['Remark'] = '';
        SelectData[0]['Quantity'] = 0;
        if (this.List.length < 1) {
          this.GoodsData.push({ "ApplySummarX": SelectData[0], "AvgSaleQuantitX": { AvgSaleQuantity7: 0, AvgSaleQuantity15: 0, AvgSaleQuantity30: 0, AvgSaleQuantity45: 0, AvgSaleQuantity60: 0 }, "InventorX": '' })
        } else {
          this.List[0].ApplySummarX = SelectData[0]
          this.$set(this, 'GoodsData',  JSON.parse(JSON.stringify(this.List)))
        }
      } else {
        this.$set(this, 'GoodsData',  JSON.parse(JSON.stringify(this.List)))
        for (let Item in this.SelectedData) {
          SelectData[Item]['Remark'] = '';
          SelectData[Item]['Quantity'] = 0;
          this.GoodsData.push({ "ApplySummarX": SelectData[Item], "AvgSaleQuantitX": { AvgSaleQuantity7: 0, AvgSaleQuantity15: 0, AvgSaleQuantity30: 0, AvgSaleQuantity45: 0, AvgSaleQuantity60: 0 }, "InventorX": '' })
        }
        //去重
        let length:number = this.GoodsData.length;
        for (let i = 0; i < length; i++) {
          for (let j = i + 1; j < length; j++) {
            if (this.GoodsData[i].ApplySummarX.SkuCode == this.GoodsData[j].ApplySummarX.SkuCode) {
              for (let k = 0; k < this.SelectedData.length; k++) {
                if (this.SelectedData[k].SkuCode == this.GoodsData[i].ApplySummarX.SkuCode) {
                  this.SelectedData.splice(k, 1)
                }
              }
              this.GoodsData.splice(j, 1)
              j--;
              length--;
            }
          }
        }
      }
      this.GetAvgSaleQuantity();
    }

    //获取平均销量/sku库存数据
    private GetAvgSaleQuantity():void {
      this.$UI.Loading.Show();
      let n:number = 0;
      for (let item in this.SelectedData) {
        const PostSkuSale: object = {
          "SkuId": this.SelectedData[item].Id,
          "WarehouseId": this.ValidateForm === 'OperateForm' ? this.OperateForm.WarehouseId :this.OperateFormEdit.WarehouseId
        }
        for (let items in this.GoodsData) {
          if (this.GoodsData[items].ApplySummarX.SkuCode == this.SelectedData[item].SkuCode) {
            // 获取单个sku销量
            
            this.$Request.Post({
              Server: this.$Server.Purchase,
              Api: {
                Address: this.$Api.GetSKUSaleQuantity,
                Login: true
              },
              Data: PostSkuSale,
              Callback: (res: PInterface.Res): void => {
                if (res.IsSuccess == true) {
                  if (res.Data.Date.length > 0) {
                    this.GoodsData[items].AvgSaleQuantitX.AvgSaleQuantity7 = res.Data.Date[0].Qty
                    this.GoodsData[items].AvgSaleQuantitX.AvgSaleQuantity15 = res.Data.Date[1].Qty
                    this.GoodsData[items].AvgSaleQuantitX.AvgSaleQuantity30 = res.Data.Date[2].Qty
                  }
                } else {
                  this.$Request.Error(res);
                }
                const PostSkuInventory = {
                  "SkuCode": this.SelectedData[item].SkuCode,
                  "WarehouseId": this.ValidateForm === 'OperateForm' ? this.OperateForm.WarehouseId :this.OperateFormEdit.WarehouseId
                }
                // 获取SKU库存
                this.$Request.Post({
                  Server: this.$Server.Warehouse,
                  Api: {
                    Address: this.$Api.InventoryGetSkuInventory,
                    Login: true
                  },
                  Data: PostSkuInventory,
                  Callback: (res: PInterface.Res): void => {

                    if (Number(item) === this.SelectedData.length - 1 && Number(items) === this.GoodsData.length - 1 ) {
                      this.$UI.Loading.Hide();
                    }

                    if (res.IsSuccess == true) {
                      this.GoodsData[items].InventorX = res.Data.Data
                    } else {
                      this.$Request.Error(res);
                    }
                    n++;
                    if (n >= this.SelectedData.length) {
                      n = 0;
                      this.List.splice(0, this.List.length, ...this.GoodsData);
                    }
                  }
                })
              }
            })

          }
        }
      }
    }

    // 添加/编辑采购申请/提交审核
    private CheckData(IsSubmit: boolean):void {
      (this as any).$refs[this.ValidateForm].validate((valid:boolean) => {
        if (valid) {
          // 编辑
          if (this.IsEdit) {
            this.List[0].ApplySummarX.Remark = this.OperateFormEdit.Remark
            this.List[0].ApplySummarX.Quantity = this.OperateFormEdit.Quantity
          } else {
            // 添加
            if (this.List.length < 1) {
              this.$UI.Tips.Floating('warning', `请选择SKU`);
              return
            } else {
              const Len = this.List.length
              for (let i = 0; i < Len; i++) {
                if (this.List[i].ApplySummarX.Quantity < 1 || this.List[i].ApplySummarX.Quantity == '') {
                  this.$UI.Tips.Floating('warning', `请输入【${this.List[i].ApplySummarX.SkuCode}】的采购数量`);
                  return
                }
              }
            }
          }
          this.PostAjax(IsSubmit)
        } else {
          return;
        }
      })
    }

    // Ajax 添加/编辑采购申请/提交审核
    private PostAjax(IsSubmit: boolean):void {
      const UseApi = this.IsEdit ? this.$Api.PurchaseApplyModify : this.$Api.PurchaseApplyCreate;
      const SuccessTips = IsSubmit ? ( this.IsEdit ? '编辑并提交审核成功' : '添加并提交审核成功') : this.IsEdit ? '编辑成功' : '添加成功'
      let purApplyModel = []
      const Len = this.List.length
      for (let i = 0; i < this.List.length; i++) {
        let temp = {
          "Id": 0,
          "SkuCode": this.List[i].ApplySummarX.SkuCode,
          "WarehouseId": this.ValidateForm === 'OperateForm' ? this.OperateForm.WarehouseId :this.OperateFormEdit.WarehouseId,
          "Quantity": this.List[i].ApplySummarX.Quantity,
          "Remark": this.List[i].ApplySummarX.Remark
        }
        purApplyModel.push(temp)
        if (this.IsEdit) {
          purApplyModel[i].Id = this.SelectedEditData[0].ApplySummary.Id
        } else {
          delete purApplyModel[i].Id
        }
        
      }
      const PostData = {
        Model: this.IsEdit ? purApplyModel[0] : purApplyModel,
        IsSubmit: IsSubmit
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: UseApi,
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.$UI.Tips.Floating('success', SuccessTips);
            this.ClearModal(1)
          } else {
            this.$UI.Loading.Hide();
            this.$Request.Error(res);
          }
        }
      })
    }

    private ModifyModal: boolean = false // 当前模态框

    private OperateForm: Interface.ModifyPurchaseApplySearch = new Interface.ModifyPurchaseApplySearch(); // 添加表单
    private OperateFormRule: any = {
      WarehouseId: [{ required: true, message: '请选择仓库', trigger: 'change', type: 'number' }]
    }

    private OperateFormEdit: Interface.ModifyPurchaseApplyEdit = new Interface.ModifyPurchaseApplyEdit(); // 编辑表单
    private OperateFormEditRule: any = {
      WarehouseId: [{ required: true, message: '请选择仓库', trigger: 'change', type: 'number' }],
      Quantity: [{ required: true, message: '采购数量必须大于0', type: 'number', min: 1}]
    }

    private ValidateForm:string = ''; // 区分添加编辑表单

    private GoodsData: Interface.GoodsData[] = [];//暂存数组列表
    private SelectedData:PInterface.EnableSku[] = []; //选中SKU数组

    private List: Interface.GoodsData[] = []; // 列表数据源
    private Cols: PInterface.TableCol[] = [
      { title: 'SKU编号',  render: (h: any, params: any): string => h('span', (params.row as any).ApplySummarX.SkuCode) },
      { title: '名称',  render: (h: any, params: any): string => h('span', (params.row as any).InventorX.SkuName) },
      { title: '当前库存',  render: (h: any, params: any): string => h('span', (params.row as any).InventorX.Quantity)},
      { title: '在途库存',  render: (h: any, params: any): string => h('span', (params.row as any).InventorX.PurchasingQuantity)},
      { title: '销量数据',  render: (h: any, params: any): string => h('span', (params.row as any).AvgSaleQuantitX.AvgSaleQuantity7 + '/' + (params.row as any).AvgSaleQuantitX.AvgSaleQuantity15 + '/' + (params.row as any).AvgSaleQuantitX.AvgSaleQuantity30 )},
      { title: '采购数量', render: (h: any, params: any): string => {
        return h('InputNumber', {
          props: {
            'min': 1,
            'value': 0
          },
          on: {
            input: (val: number) => {
              this.List[params.row._index].ApplySummarX.Quantity = val
            }
          }
        })
      }},
      { title: '备注', render: (h: any, params: any): string => {
        return h('Input', {
          attrs: {
            placeholder: '请输入备注'
          },
          on: {
            input: (val: string) => {
              this.List[params.row._index].ApplySummarX.Remark = val
            }
          },
          className: 'w100'
        })
      }},
      { title: '操作', width: 80, render: (h: any, params: any): string => {
        return h('Button', {
          props: {
            type: 'error',
            size: 'small'
          },
          on: {
            click: () => {
              this.List.splice(params.row._index, 1)
            }
          }
        }, '删除')
      }},
      
    ];
  }

</script>
<style lang="less" scoped>
.Detail-Picture{
  width: 100px;
  height: 100px;
  background-size: cover;
  margin: 0 auto;
  cursor: pointer;
}

.th400 {
  height: 400px;
}

.tNoText {
  height: 350px;
  text-align: center;
}

</style>
