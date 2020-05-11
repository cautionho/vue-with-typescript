<!-- eBay平台Cancel Request -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="Trigger">发送Cancel Request</Button>
    <Modal v-model="RequestModal" title="发送Cancel Request" :width="700" @on-cancel="CancelModal">
      <Form :model="CancelRequestForm" ref="CancelRequestForm" :rules="CancelRequestRules" onsubmit="return false" :label-width="90">
        <FormItem label="取消原因：" prop="Reason">
          <Select placeholder="取消原因" v-model="CancelRequestForm.Reason" :options="ReasonDrop" />
          <!-- <Select placeholder="取消原因" v-model="CancelRequestForm.Reason" clearable filterable>
            <Option v-for="(Item, Index) in ReasonDrop" :key="Index" :value="Item">{{Item}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="平台单号：" prop="OrderId">
          <Select placeholder="平台单号" v-model="CancelRequestForm.OrderId" :options="PlatformIds" />
          <!-- <Select placeholder="平台单号" v-model="CancelRequestForm.OrderId" clearable filterable>
            <Option v-for="(Item, Index) in PlatformIds" :key="Index" :value="Item">{{Item}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'CancelRequest'
})

export default class CancelRequest extends Vue {
  @Getter private "ShipOrder/SHIP_ORDER_INFO": ShipOrder.ShipOrderBase

  private Trigger(): void {
    this.$set(this, 'RequestModal', true)
    this.GetPlatformIds()
  }

  private GetPlatformIds(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleGetEbayPlatformOrderId,
        Login: true
      },
      Data: this['ShipOrder/SHIP_ORDER_INFO'].Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'PlatformIds', Res.Data.Data)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private Validate(): void {
    (this as any).$refs.CancelRequestForm.validate((Valid: boolean):void => {
      if(Valid){
        this.PostCancelRequest()
      }
    })
  }

  private PostCancelReqeust(): void {
    let PostData: Interface.CancelRequest = JSON.parse(JSON.stringify(this.CancelRequestForm))
    PostData.ShipOrderId = this['ShipOrder/SHIP_ORDER_INFO'].Id
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api:{
        Address: this.$Api.AfterSaleSubmitCancel,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success','发送成功')
          this.CancelModal();
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'RequestModal', false);
    (this as any).$refs.CancelRequestForm.resetFields();
  }

  private RequestModal: boolean = false
  private ReasonDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.CancelRequestReason)
  private PlatformIds: string[] = []

  private CancelRequestForm: Interface.CancelRequest = new Interface.CancelRequest()
  private CancelRequestRules: any = {
    OrderId: [{ required: true, message: '请选择平台单号', trigger: 'change' }]
  }
}
</script>
<style lang="less" scoped>

</style>