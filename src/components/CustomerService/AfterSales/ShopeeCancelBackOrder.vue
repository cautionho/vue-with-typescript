<!-- 取消Shopee后台单 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="Trigger">取消Shopee后台单</Button>
    <Modal v-model="CancelBackModal" title="取消Shopee后台单" @on-cancel="CancelModal">
      <Form :model="CancelBackForm" ref="CancelBackForm" :rules="CancelBackRules" onsubmit="return false" :label-width="90">
        <FormItem label="取消原因" prop="CancelReason">
          <Select placeholder="取消原因" v-model="CancelBackForm.CancelReason" :options="CancelReasonDrop" />
          <!-- <Select placeholder="取消原因" v-model="CancelBackForm.CancelReason" clearable filterable>
            <Option v-for="(Item, Index) in CancelReasonDrop" :key="Index" :value="Item">{{Item}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'
import ShipOrder from '@/assets/Interface/ShipOrder'

@Component({
  name: 'ShopeeCancelBackOrder'
})

export default class ShopeeCancelBackOrder extends Vue {
  @Getter private 'ShipOrder/SHIP_ORDER_INFO': ShipOrder.ShipOrderBase

  private Trigger(): void {
    this.$set(this, 'CancelBackModal', true)
  }

  private Validate(): void {
    (this as any).$refs.CancelBackForm.validate((Valid: boolean): void => {
      if(Valid){
        this.PostShopeeCancelBackOrder();
      }
    })
  }

  private PostShopeeCancelBackOrder(): void {
    let PostData: Interface.ShopeeCancelBackOrder = JSON.parse(JSON.stringify(this.CancelBackForm))
    PostData.ShipOrderCode = this['ShipOrder/SHIP_ORDER_INFO'].OrderCode
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address:'',
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '取消成功')
          this.CancelModal()
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'CancelBackModal', false)
  }

  private CancelBackModal: boolean = false
  private CancelReasonDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CancelShopeeBackReason)
  private CancelBackForm: Interface.ShopeeCancelBackOrder = new Interface.ShopeeCancelBackOrder()

  private CancelBackRules: any = {
    CancelReason: [{required: true, message:'请选择取消原因',trigger:'change'}]
  }
}
</script>
<style lang="less" scoped>

</style>