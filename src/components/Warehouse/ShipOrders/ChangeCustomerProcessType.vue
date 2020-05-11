<!-- 更改客服状态 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="Trigger">更改客服联系状态</Button>
    <Modal v-model="ChangeModal" title="更改客服联系状态" :width="600" @on-cancel="CancelModal">
      <Form :model="ChangeForm" ref="ChangeForm" onsubmit="return false" :label-width="110">
        <FormItem label="客服联系状态：" prop="customerStatus" :rules="{required: true, message:'请选择客服联系状态', trigger:'change', pattern: $Pattern.PositiveNotZero}">
          <Select placeholder="客服联系状态" v-model="ChangeForm.customerStatus" :options="ProcessDrop" />
          <!-- <Select placeholder="客服联系状态" v-model="ChangeForm.customerStatus" clearable filterable>
            <Option v-for="(Item, Index) in ProcessDrop" :key="Index" :value="$Enums.CustomerService.CustomerHandleProcess[Item]">{{Item}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary"  @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'ChangeCustomerProcessType'
})

export default class ChangeCustomerProcessType extends Vue {
  @Emit() private EmitGetSelected(Ref: string): void {}
  @Emit() private EmitOperateSuccess(): void {}

  private Trigger(): void {
    this.EmitGetSelected('ChangeCustomerStatus')
  }

  private TriggerSelected(D: Interface.LogisticsExcaption[]): void {
    if(!D.length){
      this.$UI.Tips.Floating('warning', '请选择订单进行操作')
      return
    }
    this.$set(this.ChangeForm, 'ids', D.map(Item => Item.Id))
    this.$set(this, 'ChangeModal', true)
  }

  private Validate(): void {
    (this as any).$refs.ChangeForm.validate((Valid: boolean): void => {
      if(Valid){
        this.PostChange()
      }
    })
  }

  private PostChange(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.ChangeLogisticsCustomerStatus,
        Login: true
      },
      Data: this.ChangeForm,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '更改成功')
          this.CancelModal()
          this.EmitOperateSuccess()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'ChangeModal', false)
    this.$set(this, 'ChangeForm', new Interface.ChangeCustomerStatus())
    this.$nextTick(()=>{
      (this as any).$refs.ChangeForm.resetFields();
    })
  }

  private ChangeModal: boolean = false
  private ProcessDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CustomerHandleProcess)

  private ChangeForm: Interface.ChangeCustomerStatus = new Interface.ChangeCustomerStatus()
}

</script>
<style lang="less" scoped>

</style>