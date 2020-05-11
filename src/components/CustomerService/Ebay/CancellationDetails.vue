<template>
  <Row class="Cancellation-Details">
    <Form inline :label-width="90">
      <FormItem label="编号：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CANCELLATION_INFO.CancelId : CancellationInfo.CancelId}}</span>
      </FormItem>
      <FormItem label="店铺：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CANCELLATION_INFO.StoreName : CancellationInfo.StoreName}}</span>
      </FormItem>
      <FormItem label="买家ID：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CANCELLATION_INFO.BuyerId : CancellationInfo.BuyerId}}</span>
      </FormItem>
      <FormItem label="原因：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? (CANCELLATION_INFO.Reason || '-') : (CancellationInfo.Reason || '-')}}</span>
      </FormItem>
      <FormItem label="状态：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CANCELLATION_INFO.OrderStatus : CancellationInfo.OrderStatus}}</span>
      </FormItem>
      <FormItem label="客服：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? (CANCELLATION_INFO.CustomerName || '-') : (CancellationInfo.CustomerName || '-')}}</span>
      </FormItem>
      <FormItem label="创建时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date(IsState ? CANCELLATION_INFO.Created : CancellationInfo.Created, true)}}</span>
      </FormItem>
      <FormItem label="更新时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date(IsState ? CANCELLATION_INFO.Updated : CancellationInfo.Updated, true)}}</span>
      </FormItem>
    </Form>
    <ul :class="`Chat-List ${Disputed === 2 ? 'H-200' : 'H-240'}`">
      <li v-for="(Item, Index) in ( IsState ? CANCELLATION_INFO.Chats : CancellationInfo.Chats)" :key="Index">
        <p>{{Item.ChatTitle}} <span class="P-Float-Right">{{$UI.Render.Date(Item.Created, true)}}</span></p>
      </li>
    </ul>
    <Handle ref="Handle" @emit-handle-success="EmitOperateSuccess" v-if="Disputed === 2" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'CancellationDetails',
  components: {
    'Handle': () => import('./HandleCancellation.vue')
  }
})

export default class CancellationDetails extends Vue {
  @Getter private 'CustomerService/CANCELLATION_INFO': Interface.CancellationInfo
  get CANCELLATION_INFO(){
    return this['CustomerService/CANCELLATION_INFO']
  }

  @Action private 'CustomerService/UPDATE_DISPUTED': any

  @Emit() private EmitOperateSuccess() {}

  /* DisputedType: 0-不展示 1-查看 2-处理 */
  private Trigger(Id: number, DisputedType: number = 0): void {
    this.$set(this, 'CancellationInfo', new Interface.CancellationInfo());
    if(this['CustomerService/CANCELLATION_INFO'].CancelId){
      // 已有数据 获取新的
      this.$set(this, 'IsState', false)
      this.GetDisputedDetails(Id)
    }else{
      this['CustomerService/UPDATE_DISPUTED']({Type: 'CANCELLATION', Id: Id})
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
        Address: this.$Api.CancelDetail,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'CancellationInfo', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Validate(): void {
    (this as any).$refs.Handle.Validate();
  }

  private Disputed: number = 0 /* 存储DisputedType: 0-不展示 1-查看 2-处理 */
  private IsState: boolean = true
  private CancellationInfo: Interface.CancellationInfo = new Interface.CancellationInfo()
}
</script>
<style lang="less" scoped>
.Cancellation-Details{
  & .Chat-List {
    overflow: auto;
    &.H-200{
      max-height: 250px; 
    }

    &.H-240{
      max-height: 330px; 
    }

    &>li{
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      list-style: none;

      &:nth-child(2n-1){
        background: #eee;
      }
    }
  }
}

</style>