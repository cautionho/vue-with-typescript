<template>
   <Row class="Max-600">
     <Form inline :label-width="100">
      <FormItem label="退款编号：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_RETURN_INFO.ReturnOrder.ReturnSn : RefundInfo.ReturnOrder.ReturnSn}}</span>
      </FormItem>
      <FormItem label="店铺：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_RETURN_INFO.ReturnOrder.StoreName : RefundInfo.ReturnOrder.StoreName}}</span>
      </FormItem>
      <FormItem label="买家ID：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_RETURN_INFO.ReturnOrder.BuyerId : RefundInfo.ReturnOrder.BuyerId}}</span>
      </FormItem>
      <FormItem label="退款原因：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_RETURN_INFO.ReturnOrder.Reason : RefundInfo.ReturnOrder.Reason}}</span>
      </FormItem>
      <FormItem label="退款状态：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_RETURN_INFO.ReturnOrder.ShopeeStatus : RefundInfo.ReturnOrder.ShopeeStatus}}</span>
      </FormItem>
      <FormItem label="退款金额：" class="P-W-49-Percent P-MB-10">
        <span>{{ IsState ? SHOPEE_RETURN_INFO.ReturnOrder.RefundAmt : RefundInfo.ReturnOrder.RefundAmt}} {{IsState ? SHOPEE_RETURN_INFO.ReturnOrder.Currency : RefundInfo.ReturnOrder.Currency}}</span>
      </FormItem>
      <FormItem label="创建时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? SHOPEE_RETURN_INFO.ReturnOrder.StartTime : RefundInfo.ReturnOrder.StartTime, true)}}</span>
      </FormItem>
      <FormItem label="截止处理时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date( IsState ? SHOPEE_RETURN_INFO.ReturnOrder.LatestResponseDate : RefundInfo.ReturnOrder.LatestResponseDate, true)}}</span>
      </FormItem>
      <FormItem label="买家退款说明：" class="P-W-100-Percent P-MB-10">
        <p>{{ IsState ? SHOPEE_RETURN_INFO.ReturnOrder.ReasonText : RefundInfo.ReturnOrder.ReasonText}}</p>
      </FormItem>
      <FormItem label="图片：" class="P-W-100-Percent P-MB-10" v-if="IsState ? SHOPEE_RETURN_INFO.ReturnOrder.ReasonImages.length : RefundInfo.ReturnOrder.ReasonImages.length">
        <img v-for="(Item,Index) in IsState ? SHOPEE_RETURN_INFO.ReturnOrder.ReasonImages : RefundInfo.ReturnOrder.ReasonImages" :key="Index" :src="Item" class="P-Uploader-Img" @click="$refs.BigPic.Trigger(Item)">
      </FormItem>
    </Form>
    <Table class="P-MB-10" :columns="Cols" :data="IsState ?  SHOPEE_RETURN_INFO.ReturnItem : RefundInfo.ReturnItem" size="small" stripe></Table>
    <Col span="24">
      <div class="Chat-Item" v-for="(Item, Index) in (IsState ? SHOPEE_RETURN_INFO.ReturnHistory : RefundInfo.ReturnHistory)" :key="Index">
        <p>{{Item.ReasonText}} <span class="P-Float-Right">{{$UI.Render.Date(Item.OperateTime, true)}}</span></p>
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
    Handle: () => import('./HandleShopeeReturnRefund.vue'),
    BigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})

export default class RefundDetails extends Vue {
  @Action private 'CustomerService/UPDATE_DISPUTED': any

  @Getter private 'CustomerService/SHOPEE_RETURN_INFO': Interface.ShopeeReturnRefundInfo
  get SHOPEE_RETURN_INFO(){
    return this['CustomerService/SHOPEE_RETURN_INFO'];
  }
  @Emit() private EmitOperateSuccess(): void {}
  @Emit() private EmitCancelDetails(): void {}

  private Trigger(Id: number, DisputedType: number = 0): void {
    this.$set(this, 'RefundInfo', new Interface.ShopeeReturnRefundInfo());
    if(this['CustomerService/SHOPEE_RETURN_INFO'].ReturnOrder.Id){
       // 已有数据 获取新的
      this.$set(this, 'IsState', false)
      this.GetDisputedDetails(Id)
    }else{
      this['CustomerService/UPDATE_DISPUTED']({Type: 'SHOPEE_RETURN', Id: Id})
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
        Address: this.$Api.ShopeeReturnDetail,
        Login: true
      },
      Data: {
        ReturnId: Id,
        ReturnSn: ""
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
  private RefundInfo: Interface.ShopeeReturnRefundInfo = new Interface.ShopeeReturnRefundInfo()

  private Cols: PInterface.TableCol[] = [{
    title: '图片', width: 80, align: 'center',
    render: (h: any, Params: any): string => {
      return h('div', {
        style: {
          'background-image': `url(${this.$Server.File}/${Params.row.SkuImage})`,
        },
        on: {
          click: () => {
            (this as any).$refs.BigPic.Trigger(`${this.$Server.File}/${Params.row.SkuImage}`)
          }
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