<!-- 取消后台单 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="Trigger">取消后台单</Button>
    <Modal v-model="BackOrderModal" title="取消后台单" @on-cancel="CancelModal" :width="700">
      <Form :model="BackOrderForm" ref="BackOrderForm" :label-width="90" onsubmit="return false;">
        <FormItem label="取消原因" prop="CancellingReason" :rules="{ required: true, message:'请选择取消原因', trigger:'change', pattern: $Pattern.PositiveNotZero}">
          <Select v-model="BackOrderForm.CancellingReason" placeholder="取消原因" :options="CancelReason" />
          <!-- <Select v-model="BackOrderForm.CancellingReason" placeholder="取消原因" clearable filterable >
            <Option v-for="(Item, Index) in CancelReason" :key="Index" :value="$Enums.CustomerService.CancelBackReason[Item]">{{Item}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <Table ref="List" :columns="Cols" :data="List" stripe size="small" :height="300"></Table>
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'CancelBackOrder'
})

export default class CancelBackOrder extends Vue {
  @Getter private 'ShipOrder/SHIP_ORDER_INFO': ShipOrder.ShipOrderBase

  private Trigger(): void {
    this.GetCancelItems()
    this.$set(this, 'BackOrderModal', true)
  }

  private GetCancelItems(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api:{
        Address: this.$Api.AfterSaleGetListByShipOrderCode,
        Login: true
      },
      Data: this['ShipOrder/SHIP_ORDER_INFO'].OrderCode,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'List', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Validate(): void {
    (this as any).$refs.BackOrderForm.validate((Valid:boolean): void => {
      if(Valid){
        if(!(this as any).$refs.List.getSelection().length){
          this.$UI.Tips.Floating('warning', '请至少选择一条订单明细进行操作')
        }else{
          this.PostCancelBackOrder()
        }
      }
    })
  }

  private PostCancelBackOrder(): void {
    let PostData: Interface.CancelBackOrder = JSON.parse(JSON.stringify(this.BackOrderForm)),Selc = (this as any).$refs.List.getSelection()
    PostData.Ids = Selc.map((Item:Interface.WalmartAfterSalesItem) => Item.Id)
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.AfterSaleCancellingOrderLines,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success','取消成功')
          this.CancelModal()
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'BackOrderModal', false);
    this.$set(this, 'List', [])
    this.$set(this, 'BackOrderForm', new Interface.CancelBackOrder());
    this.$nextTick(()=>{
      (this as any).$refs.BackOrderForm.resetFields()
    })
  }

  private BackOrderModal: boolean = false
  private CancelReason: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CancelBackReason)

  private BackOrderForm: Interface.CancelBackOrder = new Interface.CancelBackOrder()
  private List: Interface.WalmartAfterSalesItem[] = []

  private Cols: PInterface.TableCol[] = [{
    type: 'selection', width: 60, align: 'center'
  }, {
    title: 'LineNumber',
    key: 'LineNumber',
    width: 120
  },{
    title: 'SKU编号',
    key: 'SkuCode'
  },{
    title: '明细价格(单位：USD)',
    key: 'ProductPrice',
    render: (h:any, Params:any) =>{
      return h('span', Params.row.ProductPrice.toFixed(3))
    }
  },{
    title: '数量',
    width:60,
    key: 'Quantity'
  }]
}
</script>
<style lang="less" scoped>

</style>