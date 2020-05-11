<template>
   <Row class="Max-600">
     <Form inline :label-width="100">
      <FormItem label="编号：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? WISH_TICKET_INFO.TicketId : WishTicketInfo.TicketId}}</span>
      </FormItem>
      <FormItem label="发货单号：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? WISH_TICKET_INFO.ShipOrderCode : WishTicketInfo.ShipOrderCode}}</span>
      </FormItem>
      <FormItem label="店铺：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? WISH_TICKET_INFO.StoreName : WishTicketInfo.StoreName}}</span>
      </FormItem>
      <FormItem label="买家ID：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? WISH_TICKET_INFO.BuyerName : WishTicketInfo.BuyerName}}</span>
      </FormItem>
      <FormItem label="关闭人：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? WISH_TICKET_INFO.CloseBy : WishTicketInfo.CloseBy}}</span>
      </FormItem>
      <FormItem label="标签：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? WISH_TICKET_INFO.Label : WishTicketInfo.Label}}</span>
      </FormItem>
      <FormItem label="创建时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date(IsState ? WISH_TICKET_INFO.Created : WishTicketInfo.Created, true)}}</span>
      </FormItem>
      <FormItem label="更新时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date(IsState ? WISH_TICKET_INFO.LastUpdateTime : WishTicketInfo.LastUpdateTime, true)}}</span>
      </FormItem>
    </Form>
    <Col span="24">
      <div class="Chat-Item" v-for="(Item, Index) in (IsState ? WISH_TICKET_INFO.Replies : WishTicketInfo.Replies)" :key="Index">
        <p>{{Item.CustomerName}}({{Item.CustomerName ? '客服' : '买家'}}) <span class="P-Float-Right"><Button class="P-MR-5" size="small" v-if="Item.Message" @click="Translation(Item.Message)">翻译成英文</Button>{{$UI.Render.Date(Item.Date, true)}}</span></p>
        <section v-html="Item.Message"></section>
      </div>
    </Col>
    <Handle ref="Handle" @emit-handle-success="EmitOperateSuccess" v-if="Disputed === 5" />
   </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'WishTicketDetails',
  components: {
    Handle: () => import('./HandleWishTicket.vue')
  }
})

export default class WishTicketDetails extends Vue {
  @Action private 'CustomerService/UPDATE_DISPUTED': any

  @Getter private 'CustomerService/WISH_TICKET_INFO': Interface.WishTicketInfo
  get WISH_TICKET_INFO(){
    return this['CustomerService/WISH_TICKET_INFO'];
  }
  @Emit() private EmitOperateSuccess(): void {}

  private Trigger(Id: number, DisputedType: number = 0): void {
    this.$set(this, 'WishTicketInfo', new Interface.WishTicketInfo());
    if(this['CustomerService/WISH_TICKET_INFO'].TicketId){
      this.$set(this, 'IsState', false)
      this.GetDisputedDetails(Id);
    }else{
      this.$set(this, 'IsState', true)
      this['CustomerService/UPDATE_DISPUTED']({Type: 'WISH_TICKET', Id: Id})
    }
    this.$nextTick(()=>{
      this.$set(this, 'Disputed', DisputedType)
    })
  }

   private GetDisputedDetails(Id: number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.WishTicketOrderDetai,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'WishTicketInfo', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Translation(Ctn: string): void {
    window.open(`https:\/\/translate.google.cn/#view=home&op=translate&sl=auto&tl=en&text=${Ctn}`, '_blank')
  }

  private Validate(T: number = 1): void {
    (this as any).$refs.Handle.Validate(T);
  }

  private Disputed: number = 0 /* 存储DisputedType: 0-不展示 1-查看 2-处理 */
  private IsState: boolean = true
  private WishTicketInfo: Interface.WishTicketInfo = new Interface.WishTicketInfo()
}
</script>
<style lang="less" scoped>
.Max-600{
  max-height:500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.Chat-Item {
  border-radius: 2px;
  border: 1px solid #eee;
  margin-bottom:2px;

  &>p{
    line-height: 30px;
    font-weight: 700;
    background-color: #eee;
    padding: 0 10px;
  }

  &>section {
    word-break: break-word;
    padding: 10px;
  }
}
</style>