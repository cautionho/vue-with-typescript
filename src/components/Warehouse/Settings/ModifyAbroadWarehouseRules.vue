<!-- 添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button type="primary" @click="OpenModifyModal">{{ Type === 'Product' ? '添加产品规则' : '添加备货规则' }}</Button>
      <Modal v-model="ShowModal" :title="ModalTitle" @on-cancel="ClearModal(0)" :mask-closable="false" :width="600">
        <Form ref="OperateForm" :model="Type === 'Product' ? OperateProductForm : OperateStockUpForm" :rules="Type === 'Product' ? ProductRule : StockUpRule " name="OperateForm" onsubmit="return false" :label-width="110" v-if="ShowModal">
          
          <Form-item v-if="Type === 'Product'" label="海外仓库：" prop="WarehouseId">
             <Select v-if="OperateProductForm.Id === 0" class="P-W-100-Percent" v-model="OperateProductForm.WarehouseId" placeholder="请选择海外仓库" :options="DropAbroadWarehouse" />
            <span v-else>{{ WarehouseName }}</span>
          </Form-item>

          <Form-item v-if="Type === 'StockUp'" label="海外仓库：" prop="WarehouseId">
            <Select v-if="OperateStockUpForm.Id === 0" class="P-W-100-Percent" v-model="OperateStockUpForm.WarehouseId" placeholder="请选择海外仓库" :options="DropAbroadWarehouse" />
            <span v-else>{{ WarehouseName }}</span>
          </Form-item>

          <Form-item label="日均销量阈值：" v-if="Type === 'Product'" prop="ThresholdValue">
            <InputNumber placeholder="请输入日均销量阈值" v-model="OperateProductForm.ThresholdValue" class="P-W-100-Percent"></InputNumber>
          </Form-item>
          <Form-item label="日均销量范围："  v-else prop="SaleSlowQty">
            <Form-item prop="SaleSlowQty" class="P-W-49-Percent P-Inline-Block" >
              <InputNumber placeholder="请输入最低销量" v-model="OperateStockUpForm.SaleSlowQty" class="P-W-100-Percent"></InputNumber>
            </Form-item>
              <span>-</span>
            <Form-item prop="SaleHighQty" class="P-W-49-Percent P-Inline-Block">
              <InputNumber placeholder="请输入最高销量" v-model="OperateStockUpForm.SaleHighQty" class="P-W-100-Percent"></InputNumber>
            </Form-item>
          </Form-item>
          <Form-item label="备货天数：" prop="StockupDays" v-if="Type === 'StockUp'">
            <InputNumber placeholder="请输入备货天数" v-model="OperateStockUpForm.StockupDays" class="P-W-100-Percent"></InputNumber>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Warehouse";
  @Component({
    name: 'ModifyAbroadWarehouseRules'
  })
  export default class ModifyAbroadWarehouseRules extends Vue {
    @Prop() Type: string;
    @Prop() DropAbroadWarehouse:  PInterface.KV[]; // 海外仓库下拉

    @Emit() HandleResMsg(Type:number): void {}

    private Trigger(Selected: Interface.ProductAboadWareList[] | Interface.StockUpAboadWareList[]): void {
      let TargetData: any; 

      if (Selected.length > 0) {
        this.WarehouseName = Selected[0].WarehouseName;
        TargetData = this.Type === 'Product' ? {
          WarehouseId: ( Selected[0] as Interface.ProductAboadWareList ).WarehouseId,
          ThresholdValue: ( Selected[0] as Interface.ProductAboadWareList ).ThresholdValue
        } : {
          Id: ( Selected[0] as Interface.StockUpAboadWareList ).Id,
          WarehouseId: ( Selected[0] as Interface.StockUpAboadWareList ).WarehouseId,
          SaleSlowQty:  ( Selected[0] as Interface.StockUpAboadWareList ).SaleSlowQty,
          SaleHighQty: ( Selected[0] as Interface.StockUpAboadWareList ).SaleHighQty,
          StockupDays: ( Selected[0] as Interface.StockUpAboadWareList ).StockupDays
        }
      } else {
        TargetData = this.Type === 'Product' ? new Interface.ModifyProductRulesForm() : new Interface.ModifyStockUpForm()
      }

      const TargetForm: string = this.Type === 'Product' ? 'OperateProductForm' : 'OperateStockUpForm'

      this.$set(this, TargetForm, TargetData);
      this.$set(this,'ShowModal', true);
    }

    get ModalTitle():string {
      const Id: number | "" = this.Type === 'Product' ? this.OperateProductForm.WarehouseId : this.OperateStockUpForm.Id;
      const IsEdit:string = Id === 0 ? '添加' : '编辑' 
      const IsType:string = this.Type === 'Product' ? '产品' : '备货' 
      return `${IsEdit}${IsType}规则`
    }

    // 回调打开添加模态框
    private OpenModifyModal():void {
      this.Trigger([])
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ShowModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((valid:boolean) => {
        if (valid) {

          let PostData:any;
          let ProductRuleId: number = 0;
          if (this.Type === 'Product' ) {
            PostData = JSON.parse(JSON.stringify(this.OperateProductForm))
            ProductRuleId = PostData.Id;
            delete PostData.Id
          } else {
            PostData = JSON.parse(JSON.stringify(this.OperateStockUpForm))
          }

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Settings,
            Api: {
              Address: this.Type === 'Product' 
                ? ( ProductRuleId === 0 ? this.$Api.AddProductRule : this.$Api.ModifyProductRule ) 
                : ( this.OperateStockUpForm.Id === 0 ? this.$Api.AddStockUpRule : this.$Api.ModifyStockUpRule ),
              Login: true
            },
            Data: PostData,
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating('success', `${this.ModalTitle}成功`);
              } else {
                this.$Request.Error(Res);
              }
              this.ClearModal(1)
            }
          })
        }
      })
    }

    private WarehouseName:string = "" //仓库名称
    private ShowModal: boolean = false; // 当前模态框
    private OperateProductForm: Interface.ModifyProductRulesForm = new Interface.ModifyProductRulesForm();  // 表格数据
    private OperateStockUpForm: Interface.ModifyStockUpForm = new Interface.ModifyStockUpForm();  // 表格数据
    private ProductRule: any = {
      WarehouseId: [{ required: true, message: '请选择海外仓库', trigger: 'change', type: 'number' }],
			ThresholdValue: [{ required: true, message: '请输入大于或等于0的数字或小数', min: 1, type: 'number' }],
    }
    private StockUpRule: any = {
      WarehouseId: [{ required: true, message: '请选择海外仓库', trigger: 'change', type: 'number' }],
			SaleSlowQty: [{ required: true, message: '请输入大于或等于0的数字或小数', min: 1, type: 'number' }],
			SaleHighQty: [{ required: true, message: '请输入大于或等于0的数字或小数', min: 1, type: 'number' }],
			StockupDays: [{ required: true, message: '请输入大于或等于0的数字或小数', min: 1, type: 'number' }]
    }
  }


</script>