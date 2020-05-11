<template>
   <Row class="Max-600">
     <Form inline :label-width="100">
      <FormItem label="编号：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? REFUND_INFO.ReturnId : RefundInfo.ReturnId}}</span>
      </FormItem>
      <FormItem label="店铺：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? REFUND_INFO.StoreName : RefundInfo.StoreName}}</span>
      </FormItem>
      <FormItem label="买家ID：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? REFUND_INFO.BuyerId : RefundInfo.BuyerId}}</span>
      </FormItem>
      <FormItem label="状态：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? REFUND_INFO.OrderStatus : RefundInfo.OrderStatus}}</span>
      </FormItem>
      <FormItem label="创建时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? REFUND_INFO.Created : RefundInfo.Created, true)}}</span>
      </FormItem>
      <FormItem label="最迟回复时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? REFUND_INFO.LatestResponseDate : RefundInfo.LatestResponseDate, true)}}</span>
      </FormItem>
      <FormItem label="买家期望方案：" class="P-W-100-Percent P-MB-10">
        <p>{{ IsState ? REFUND_INFO.BuyerExpect : RefundInfo.BuyerExpect}}</p>
      </FormItem>
      <FormItem label="图片：" class="P-W-100-Percent P-MB-10" v-if="IsState ? REFUND_INFO.Images.length : RefundInfo.Images.length">
        <img v-for="(Item,Index) in IsState ? REFUND_INFO.Images : RefundInfo.Images" :key="Index" :src="Item" class="P-Uploader-Img" @click="$refs.BigPic.Trigger(Item)">
      </FormItem>
    </Form>
    <Col span="24">
      <div class="Chat-Item" v-for="(Item, Index) in (IsState ? REFUND_INFO.Chats : RefundInfo.Chats)" :key="Index">
        <p>{{Item.Title}} <span class="P-Float-Right"><Button class="P-MR-5" size="small" v-if="Item.Content" @click="Translation(Item.Content)">翻译成英文</Button>{{$UI.Render.Date(Item.Created, true)}}</span></p>
        <section v-html="Item.Content"></section>
      </div>
    </Col>
    <Handle ref="Handle" @emit-handle-success="EmitOperateSuccess" @emit-cancel-modal="EmitCancelDetails" v-if="Disputed === 2" />
    <BigPic ref="BigPic" />
   </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'RefundDetails',
  components: {
    Handle: () => import('./HandleRefund.vue'),
    BigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})

export default class RefundDetails extends Vue {
  @Action private 'CustomerService/UPDATE_DISPUTED': any

  @Getter private 'CustomerService/REFUND_INFO': Interface.RefundInfo
  get REFUND_INFO(){
    return this['CustomerService/REFUND_INFO'];
  }
  @Emit() private EmitOperateSuccess(): void {}
  @Emit() private EmitCancelDetails(): void {}

  private Trigger(Id: number, DisputedType: number = 0): void {
    this.$set(this, 'RefundInfo', new Interface.RefundInfo());
    if(this['CustomerService/REFUND_INFO'].ReturnId){
       // 已有数据 获取新的
      this.$set(this, 'IsState', false)
      this.GetDisputedDetails(Id)
    }else{
      this['CustomerService/UPDATE_DISPUTED']({Type: 'REFUND', Id: Id})
      this.$nextTick(()=>{
        this.$set(this, 'Disputed', DisputedType)
        if(DisputedType === 2){
          setTimeout(()=>{
            (this as any).$refs.Handle.Reset()
          },300)
        }
      })
    } 
  }

  private GetDisputedDetails(Id: number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.ReturnDetail,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'RefundInfo', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Translation(Ctn: string): void {
    window.open(`https:\/\/translate.google.cn/#view=home&op=translate&sl=auto&tl=en&text=${Ctn}`, '_blank')
  }

  private Validate(): void {
    (this as any).$refs.Handle.Validate();
  }

  private Disputed: number = 0 /* 存储DisputedType: 0-不展示 1-查看 2-处理 */
  private IsState: boolean = true
  private RefundInfo: Interface.RefundInfo = new Interface.RefundInfo()
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