<!-- 标记已读 标记未读 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="TriggerOperates(4, 1)">标记已读</Button>
    <Button class="P-ML-10" type="error" @click="TriggerOperates(5, 1)">标记未读</Button>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'WriteMail'
})

export default class WriteMail extends Vue {
  @Emit() private TriggerOperates(T: number, B: number): void {}
  @Emit() private EmitHandleSuccess(): void {}

  /* T: 4-标记已读 5-标记未读 */
  private Trigger(T: number, Data: (Interface.EmailList)[]): void {
    if(!Data.length){
      this.$UI.Tips.Floating('warning', '请选择邮件进行操作');
      return;
    }else if(Data.some(Itm => T === 4 ? Itm.RecordType !== 1 : ![2,3].includes(Itm.RecordType))){
      this.$UI.Tips.Floating('warning', `请选择${T === 4 ? '未读' : '已读/已发送'}邮件进行操作`)
      return
    }
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否确认执行${T === 4 ? '标记已读' : '标记未读'}操作`,
      Callback: (B: boolean): void => {
        if(B){
          this.PostSetRead(T === 4, Data)
        }
      }
    })
  }

  private PostSetRead(IsRead: boolean, Data: Interface.EmailList[]): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EmailRecordSign,
        Login: true
      },
      Data: {
        IsRead: IsRead,
        Id: Data.map(Itm => Itm.Id)
      },
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '标记成功')
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