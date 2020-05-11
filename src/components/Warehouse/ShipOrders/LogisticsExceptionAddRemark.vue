<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="Trigger">添加备注</Button>
    <Modal v-model="AddModal" title="添加备注" :width="600" @on-cancel="CancelModal">
      <Form :model="AddForm" ref="AddForm" onsubmit="return false" :label-width="60">
        <FormItem label="备注：" prop="content" :rules="{required: true, message:'请输入备注'}">
          <Input ref="Ipt" placeholder="请输入备注" type="textarea" :autosize="{minRows: 6, maxRows: 6}" v-model="AddForm.content"></Input>
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
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'LogisticsExcaptionAddRemark'
})

export default class LogisticsExcaptionAddRemark extends Vue {
  @Emit() private EmitGetSelected(Ref: string): void {}
  @Emit() private EmitCancelSelect(): void {}

  private Trigger(): void {
    this.EmitGetSelected('AddRemark')
  }

  private TriggerSelected(D: Interface.LogisticsExcaption[]): void {
     if(!D.length){
      this.$UI.Tips.Floating('warning', '请选择订单进行操作')
      return
    }
    this.$set(this.AddForm, 'orderCodes', D.map(Item => Item.OrderCode))
    this.$set(this, 'AddModal', true)
    this.$nextTick(()=>{
      (this as any).$refs.Ipt.focus();
    })
  }

  private Validate(): void {
    (this as any).$refs.AddForm.validate((Valid: boolean): void => {
      if(Valid){
        this.PostAddRemark()
      }
    })
  }

  private PostAddRemark(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.AddRemarkBatch,
        Login: true
      },
      Data: this.AddForm,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '添加备注成功')
          this.EmitCancelSelect()
          this.CancelModal()
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

   private CancelModal(): void {
    this.$set(this, 'AddModal', false)
    this.$set(this, 'AddForm', new Interface.ChangeCustomerStatus())
    this.$nextTick(()=>{
      (this as any).$refs.AddForm.resetFields();
    })
  }

  private AddModal: boolean = false
  private AddForm: Interface.AddRemarkBatch = new Interface.AddRemarkBatch()
}
</script>
<style lang="less" scoped>

</style>