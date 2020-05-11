<template>
	<Row>
    <Modal title="添加发货" v-model="OpenAddShipedModal" :mask-closable="false" :width="1200" @on-cancel="EmitPurchase(false)">
      <Form :label-width="100" ref="AddShipForm" :model="AddShipForm" :rules="AddShipFormRules" inline>
        <FormItem label="快递单号：" class="P-W-400" prop="ExpressCode">
          <Input placeholder="请输入快递单号" v-model="AddShipForm.ExpressCode"></Input>
        </FormItem>
        <FormItem label="物流公司：" class="P-W-400" prop="ExpressCompany">
          <Select placeholder="请选择物流公司" v-model="AddShipForm.ExpressCompany" :options="ExpressCompanyList" optionValKey='Key' optionKey="Key" />
          <!-- <Select placeholder="请选择物流公司" filterable clearable v-model="AddShipForm.ExpressCompany">
            <Option v-for="(item,index) in DropWarehouseList" :value="item.Key" :key="index">{{ item.Key }}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <Table class="P-MT-10" size="small" v-if="OpenAddShipedModal" :highlight-row="true" :columns="ItemCol" :data="ItemData" border stripe height="500"></Table>
      
      <footer slot="footer">
      <Button type="primary" @click="Valide">提交</Button>
      <Button @click="EmitPurchase(false)">取消</Button>
    </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
import { DropList } from "@/assets/Config/JSON/ExpressCompany.json";
@Component({
  name: 'PonAddShiped'
})
export default class PonAddShiped extends Vue {

  @Emit() private EmitPurchase(r: boolean):void{
    this.OpenAddShipedModal = false;
    (this.$refs["AddShipForm"] as any).resetFields();
    this.$set(this, 'AddShipForm', new Interface.AddShipPonData())
  }

  private TriggerModal(SelectedData: Interface.PurchaseOrd[], DropWarehouseList: PInterface.KV[]): void{
    this.SelectedData = SelectedData;
    this.DropWarehouseList = DropWarehouseList;
    this.GetPurchaseOrderGetItem()
      // 物流公司下拉
      if (this.ExpressCompanyList.length === 0) {
        this.$set(this, 'ExpressCompanyList', DropList)
      }
      this.OpenAddShipedModal = true
  }

  //获取信息
  private GetPurchaseOrderGetItem():void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PurchaseOrderGetItem, 
        Login: true
      },
      Data: this.SelectedData[0].Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.RemarkArr = []
          this.ItemData = Res.Data.Data;
          this.ItemData.forEach( (item: Interface.PurchaseOrdItem) =>{
            this.RemarkArr.push("")
            this.$set(item.Item, 'Delivery', (item.Item.PurchaseQuantity - item.Item.ArrivalQuantity) < 0 ? 0 : (item.Item.PurchaseQuantity - item.Item.ArrivalQuantity))
          })
          
        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  private ParseRemark(val: string, idx: number){
    this.RemarkArr[idx] = val;
  }

  private GetArrivalQuantity(val: number, idx: number){
    this.ItemData[idx].Item.Delivery = val;
  }

  private Valide():void{
    (this as any).$refs['AddShipForm'].validate((valid:boolean) => {
      if(valid){
        this.ValideAddShip()
      }
    })
  }

  private ValideAddShip(){
    this.AddShipForm["Id"] = this.SelectedData[0].Id
    this.AddShipItem = []
    let Flag = true, IsAllZero = true;
    for( let i = 0; i <this.ItemData.length; i++){
      let MaxArrivalQuantity = (this.ItemData[i].Item.PurchaseQuantity - this.ItemData[i].Item.ArrivalQuantity) < 0 ? 0 : (this.ItemData[i].Item.PurchaseQuantity - this.ItemData[i].Item.ArrivalQuantity)
      if((this.ItemData[i].Item as any).Delivery > MaxArrivalQuantity){
        this.$UI.Tips.Floating('warning', `[${this.ItemData[i].Item.SkuCode}]发货数量不能大于待发货数量`);
        Flag = false;
        return Flag;
      }

      if((this.ItemData[i].Item as any).Delivery > 0){
        IsAllZero = false
      }

      let Obj: Interface.AddShipPonItem = new Interface.AddShipPonItem
      Obj["Id"] = this.ItemData[i].Item.Id;
      (Obj as any)["ArrivalQuantity"] = this.ItemData[i].Item.Delivery;
      Obj["Remark"] = this.RemarkArr[i];

      this.AddShipItem.push(Obj)
    }

    if(IsAllZero && Flag){
      this.$UI.Tips.Floating('warning', `必须有一项SKU发货数量不为0`);
      return;
    }

    this.AddShipForm["Item"] = this.AddShipItem

    if(Flag){
      this.PostAddShip()
    }
  }

  //添加发货请求
  private PostAddShip():void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PurchaseCreateArrivalOrder, 
        Login: true
      },
      Data: this.AddShipForm,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', '添加发货成功');
          this.EmitPurchase(true)
        } else {
          this.$Request.Error(Res);
          this.$UI.Loading.Hide();
        }
      }
    })
  }
  
  private SelectedData: Interface.PurchaseOrd[] = []
  private DropWarehouseList: PInterface.KV[] = []
  private AddShipedModal: boolean = false
  private OpenAddShipedModal: boolean = false;
  private AddShipForm: Interface.AddShipPonData = new Interface.AddShipPonData()
  private AddShipItem: Interface.AddShipPonItem[] = []
  private ExpressCompanyList: PInterface.KV[] = [];
  private RemarkArr: string[] = []  //备注集合
  private ItemData: Interface.PurchaseOrdItem[] = []  //表格数据
  private AddShipFormRules: any = {
    ExpressCode: [{ required: true, message: '请输入快递单号' }],
    ExpressCompany: [{ required: true, message: '请选择物流公司', trigger: 'change', type: 'string' }]
  }
  private ItemCol: PInterface.TableCol[] = [
    { title: 'sku编号', key: '', render: (h: any, params: any): string => h('span', params.row.Item.SkuCode) },
    { title: '产品名称', key: '', render: (h: any, params: any): string => h('span', params.row.Item.SkuName) },
    { title: '采购数量', key: '', render: (h: any, params: any): string => h('span', params.row.Item.PurchaseQuantity) },
    { title: '发货数量', key: '', render: (h: any, params: any): string => 
      h('InputNumber', {
        props: {
          min: 0,
          value: params.row.Item.Delivery
        },
        on: {
          'on-change': (val: number) => {
            this.GetArrivalQuantity(val, params.index)
          }
        }
      })
    },
    { title: '备注', key: 'PurchaserName', render: (h: any, params: any): string => 
      h('Input', {
        props: {
          placeholder: '请输入备注',
          value: ""
        },
        on: {
          'on-change': (val: string) => {
            this.ParseRemark(val, params.index)
          }
        }
      }) 
    }
  ]
}

</script>
<style lang="less"></style>
