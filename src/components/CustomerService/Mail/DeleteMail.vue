<!-- 删除邮件 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="error" @click="TriggerOperates(7, 1)">删除</Button>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'DeleteMail'
})

export default class DeleteMail extends Vue {
  @Emit() private TriggerOperates(T: number, B: number): void {}
  @Emit() private EmitHandleSuccess(): void {}

  private Trigger(Data: Interface.EmailList[]): void {
    if(!Data.length){
      this.$UI.Tips.Floating('warning', '请选择邮件进行操作')
      return
    }
    
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认执行删除邮件操作',
      Callback: (B: boolean): void => {
        if(B){
          this.PostDelete(Data);
        }
      }
    })
  }

  private PostDelete(Data: Interface.EmailList[]): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EmailRecordDel,
        Login: true
      },
      Data: Data.map(Itm => Itm.Id),
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '删除成功')
          this.EmitHandleSuccess()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }
}
</script>
<style lang="less" scoped>

</style>