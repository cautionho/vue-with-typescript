<template>
   <Row class="Max-600">
     <Form inline :label-width="100">
      <FormItem label="平台单号：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.OrderSn : RefundInfo.CancellationOrder.OrderSn}}</span>
      </FormItem>
      <FormItem label="店铺：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.StoreName : RefundInfo.CancellationOrder.StoreName}}</span>
      </FormItem>
      <FormItem label="买家ID：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.BuyerId : RefundInfo.CancellationOrder.BuyerId}}</span>
      </FormItem>
      <FormItem label="取消原因：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.Reason : RefundInfo.CancellationOrder.Reason}}</span>
      </FormItem>
      <FormItem label="状态：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.ShopeeStatus : RefundInfo.CancellationOrder.ShopeeStatus}}</span>
      </FormItem>
      <FormItem label="客服：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.CustomerName : RefundInfo.CancellationOrder.CustomerName}}</span>
      </FormItem>
      <FormItem label="创建时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.CreationTime : RefundInfo.CancellationOrder.CreationTime, true)}}</span>
      </FormItem>
      <FormItem label="更新时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? SHOPEE_CANCELLATION_INFO.CancellationOrder.UpdateTime : RefundInfo.CancellationOrder.UpdateTime, true)}}</span>
      </FormItem>
    </Form>
    <Col span="24">
      <div class="Chat-Item" v-for="(Item, Index) in (IsState ? SHOPEE_CANCELLATION_INFO.CancellationHistory : RefundInfo.CancellationHistory)" :key="Index">
        <p>{{Item.OperateLog}} <span class="P-Float-Right">{{$UI.Render.Date(Item.OperateTime, true)}}</span></p>
      </div>
    </Col>
    <Handle ref="Handle" @emit-handle-success="EmitOperateSuccess" @emit-cancel-modal="EmitCancelDetails" v-if="Disputed === 2" />
   </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'ShopeeCancellationDetails',
  components: {
    Handle: () => import('./HandleShopeeCancellation.vue')
  }
})

export default class ShopeeCancellationDetails extends Vue {
  @Action private 'CustomerService/UPDATE_DISPUTED': any

  @Getter private 'CustomerService/SHOPEE_CANCELLATION_INFO': Interface.ShopeeCancellationInfo
  get SHOPEE_CANCELLATION_INFO(){
    return this['CustomerService/SHOPEE_CANCELLATION_INFO'];
  }
  @Emit() private EmitOperateSuccess(): void {}
  @Emit() private EmitCancelDetails(): void {}

  private Trigger(Id: number, DisputedType: number = 0): void {
    
    this.$set(this, 'RefundInfo', new Interface.ShopeeCancellationInfo());
    if(this['CustomerService/SHOPEE_CANCELLATION_INFO'].CancellationOrder.Id){
       // 已有数据 获取新的
      this.$set(this, 'IsState', false)
      this.GetDisputedDetails(Id)
    }else{
      this['CustomerService/UPDATE_DISPUTED']({Type: 'SHOPEE_CANCELLATION', Id: Id})
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
        Address: this.$Api.ShopeeCancellationDetail,
        Login: true
      },
      Data: {
        CancellationId: Id,
        OrderSn: ""
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'RefundInfo', Res.Data)
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
  private RefundInfo: Interface.ShopeeCancellationInfo = new Interface.ShopeeCancellationInfo()

  private Cols: PInterface.TableCol[] = [{
    title: '图片', width: 80, align: 'center',
    render: (h: any, Params: any): string => {
      return h('div', {
        style: {
          'background-image': `url(${this.$Server.File}/${Params.row.SkuImage})`,
        },
        class: 'P-List-Img'
      })
    }
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130
  }, {
    title: 'SKU名称',
    render: (h:any, Params: any): string => {
      return h('Tooltip', { props: { content: Params.row.SkuName }, class: 'P-LINE-1' }, Params.row.SkuName)
    }
  }, {
    title: 'ItemId',
    key: 'ItemId'
  }, {
    title: '数量',
    key: 'Quantity'
  }, {
    title: '交易金额',
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.ItemPrice}${Params.row.Currency}`)
    }
  }]
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