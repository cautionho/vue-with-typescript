<template>
   <Row class="Max-600">
     <Form inline :label-width="100">
      <FormItem label="订单号：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? ALLEGRO_ORDER_INFO.PlatformOrderCode : AllegroOrderInfo.PlatformOrderCode}}</span>
      </FormItem>
      <FormItem label="纠纷ID：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? ALLEGRO_ORDER_INFO.DisputeId : AllegroOrderInfo.DisputeId}}</span>
      </FormItem>
      <FormItem label="店铺：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? ALLEGRO_ORDER_INFO.StoreName : AllegroOrderInfo.StoreName}}</span>
      </FormItem>
      <FormItem label="买家ID：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? ALLEGRO_ORDER_INFO.BuyerId : AllegroOrderInfo.BuyerId}}</span>
      </FormItem>
      <FormItem label="纠纷原因：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? ALLEGRO_ORDER_INFO.DisputeContent : AllegroOrderInfo.DisputeContent}}</span>
      </FormItem>
      <FormItem label="状态：" class="P-W-49-Percent P-MB-10">
        <span>{{ $Enums.CustomerService.CancellationProcessStatus[IsState ? ALLEGRO_ORDER_INFO.ProcessStatus : AllegroOrderInfo.ProcessStatus]}}</span>
      </FormItem>
      <FormItem label="纠纷创建时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? ALLEGRO_ORDER_INFO.CreationTime : AllegroOrderInfo.CreationTime, true)}}</span>
      </FormItem>
      <FormItem label="更新时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? ALLEGRO_ORDER_INFO.UpdateTime : AllegroOrderInfo.UpdateTime, true)}}</span>
      </FormItem>
    </Form>
    <Col span="24">
      <div class="Chat-Item" v-for="(Item, Index) in (IsState ? ALLEGRO_ORDER_INFO.Chats : AllegroOrderInfo.Chats)" :key="Index">
        <p>{{Item.Title}} <span class="P-Float-Right"><Button class="P-MR-5" size="small" v-if="Item.Content" @click="Translation(Item.Content)">翻译成英文</Button>{{$UI.Render.Date(Item.Created, true)}}</span></p>
        <section>
          <span v-html="Item.Content"></span>
          <img v-if="Item.Enclosure" style="cursor:pointer;width: 40px;height: 40px;display: block;" :src="Item.Enclosure" @click="ShowPic(Item.Enclosure)">
        </section>
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
  name: 'AllegroDisputedDetails',
  components: {
    Handle: () => import('../Allegro/HandleAllegroOrder.vue'),
    BigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})

export default class AllegroDisputedDetails extends Vue {
  @Action private 'CustomerService/UPDATE_DISPUTED': any

  @Getter private 'CustomerService/ALLEGRO_ORDER_INFO': Interface.AllegroOrderDisputeInfo
  get ALLEGRO_ORDER_INFO(){
    return this['CustomerService/ALLEGRO_ORDER_INFO'];
  }
  @Emit() private EmitOperateSuccess(): void {}
  @Emit() private EmitCancelDetails(): void {}

  private Trigger(Id: number, DisputedType: number = 0): void {
    this.$set(this, 'AllegroOrderInfo', new Interface.AllegroOrderDisputeInfo());
    if(this['CustomerService/ALLEGRO_ORDER_INFO'].DisputeId){
       // 已有数据 获取新的
      this.$set(this, 'IsState', false)
      this.GetDisputedDetails(Id)
    }else{
      this['CustomerService/UPDATE_DISPUTED']({Type: 'ALLEGRO_ORDER', Id: Id})
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
        Address: this.$Api.AllegroDisputesOrderDetail,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'AllegroOrderInfo', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  // 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.BigPic.Trigger(Url, true);
	}

  private Translation(Ctn: string): void {
    window.open(`https:\/\/translate.google.cn/#view=home&op=translate&sl=auto&tl=en&text=${Ctn}`, '_blank')
  }

  private Validate(): void {
    (this as any).$refs.Handle.Validate();
  }

  private Disputed: number = 0 /* 存储DisputedType: 0-不展示 1-查看 2-处理 */
  private IsState: boolean = true
  private AllegroOrderInfo: Interface.AllegroOrderDisputeInfo = new Interface.AllegroOrderDisputeInfo()
  private ProcessStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CancellationProcessStatus)
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