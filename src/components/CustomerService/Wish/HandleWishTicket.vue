<template>
<Row>
  <Form :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="0">
    <FormItem prop="Content">
      <Input placeholder="消息" type="textarea" :autosize="{minRows:6, maxRows:6}" v-model="HandleForm.Message"></Input>
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
  name: 'HandleWishTicket'
})

export default class HandleWishTicket extends Vue {
  @Getter private 'CustomerService/WISH_TICKET_INFO': Interface.WishTicketInfo
  get WISH_TICKET_INFO(){
    return this['CustomerService/WISH_TICKET_INFO']
  }

  @Emit() private EmitHandleSuccess(): void {}

  // 1-回复 2-关闭 3-Wish客服协助 4-重开
  private Validate(T: number = 1): void {
    if(T === 1 && !this.HandleForm.Message){
      this.$UI.Tips.Floating('warning', '请输入消息内容')
    }else{
      this.PostHandle(T);
    }
  }

  private PostHandle(T: number = 1): void {
    let Api: string = T === 1 ? this.$Api.WishTicketOrderReply : T === 2 ? this.$Api.WishTicketOrderClose : T === 3 ? this.$Api.WishTicketOrderWishSupport : this.$Api.WishTicketOrderReOpen,
      PostData: Interface.HandleWishTicket = JSON.parse(JSON.stringify(this.HandleForm)) 
      PostData.TicketId = this.WISH_TICKET_INFO.TicketId
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: Api,
        Login: true
      },
      Data: T === 1 ? PostData : PostData.TicketId,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '处理成功')
          this.$set(this, 'HandleForm', new Interface.HandleWishTicket())
          this.EmitHandleSuccess()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private HandleForm: Interface.HandleWishTicket = new Interface.HandleWishTicket()
}
</script>
<style lang="less" scoped>
.Tpl-Container {
  max-height:100px;
  overflow: auto;
}
</style>