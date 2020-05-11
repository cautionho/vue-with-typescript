<template>
<Row>
  <Form :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="100">
    <FormItem class="P-MB-10" label="操作：">
      <RadioGroup v-model="HandleForm.ProcessType">
         <Radio :label="1">
          <span>同意</span>
        </Radio>
        <Radio :label="2">
          <span>拒绝</span>
        </Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'HandleRefund'
})

export default class HandleRefund extends Vue {
  @Getter private 'CustomerService/SHOPEE_CANCELLATION_INFO': Interface.ShopeeCancellationInfo
  get SHOPEE_CANCELLATION_INFO(){
    return this['CustomerService/SHOPEE_CANCELLATION_INFO']
  }

  @Emit() private EmitHandleSuccess(): void {}

  private Reset(): void {
    this.$set(this, 'HandleForm', new Interface.HandleShopeeCancellation())
  }

  private Validate(): void {
    this.$set(this.HandleForm, 'CancellationId', this.SHOPEE_CANCELLATION_INFO.CancellationOrder.Id)
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.ShopeeCancellationSubmitOperation,
        Login: true
      },
      Data: this.HandleForm,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '处理成功')
          this.EmitHandleSuccess()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    }) 
  }

  private HandleForm: Interface.HandleShopeeCancellation = new Interface.HandleShopeeCancellation()
}
</script>
<style lang="less" scoped>
.Tpl-Container {
  max-height:100px;
  overflow: auto;
}
</style>