<!-- 忽略站内信 -->
<template>
  <div class="P-Inline-Block">
    <Button type="error" @click="Trigger(0)">忽略</Button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'IgnoewMail'
})

export default class IgnoewMail extends Vue {
  @Emit() GetSelected(Comp: string): void {}
  @Emit() EmitHandleSuccess(): void {}

  private Trigger(Id?: number): void {
    if(Id){
      // 删除单个
      this.PostIgnore([Id])
    }else{
      // 批量删除
      this.GetSelected('Ignore')
    }
  }

  private TriggerBatch(Data: number[]): void {
    if(!Data.length){
      this.$UI.Tips.Floating('warning', '请选择站内信进行操作');
      return;
    }else {
      this.PostIgnore(Data)
    }
  }

  private PostIgnore(Data: number[]): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认执行忽略站内信操作',
      Callback: (B: boolean): void => {
        if(B){
          this.$UI.Loading.Show()
          this.$Request.Post({
            Server: this.$Server.CustomerService,
            Api: {
              Address: this.$Api.EbayMessageIgnore,
              Login: true
            },
            Data: Data,
            Callback: (Res: PInterface.Res): void => {
              this.$UI.Loading.Hide()
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '忽略成功');
                this.EmitHandleSuccess()
              }else{
                this.$Request.Error(Res);
              }
            }
          })
        }
      }
    })
  }
}
</script>