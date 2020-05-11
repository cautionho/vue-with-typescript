<template>
  <Form onsubmit="return false" :label-width="0">
    <Row>
      <Col span="16">
        <FormItem class="P-MB-5" v-if="HandleMailBase.BuyerId !== 'eBay' && Powers.EbayMsgReply" >
          <Input placeholder="回复内容" type="textarea" :autosize="{minRows:8, maxRows:8}" v-model="ReplyContent"></Input>
        </FormItem>
        <FormItem class="P-MB-0">
          <Button v-if="Powers.EbayMsgIgnore" type="error" @click="EmitOperates(3)">忽略</Button>
          <Button v-if="Powers.EbayMsgAddRemark" type="primary" class="P-ML-5" @click="EmitOperates(5)">添加备注</Button>
          <Button v-if="Powers.EbayMsgMove" type="primary" class="P-ML-5" @click="EmitOperates(4)">移动</Button>
          <HandleMailImgs ref="HandleMailImgs" class="P-ML-5" v-if="HandleMailBase.BuyerId !== 'eBay' && Powers.EbayMsgReply" />
          <Button type="primary" class="P-ML-5" @click="HandleReply" v-if="HandleMailBase.BuyerId !== 'eBay' && Powers.EbayMsgReply">回复</Button>
        </FormItem>
      </Col>
      <Col span="8" class="P-PL-10" v-if="HandleMailBase.BuyerId !== 'eBay' && Powers.EbayMsgReply">
        <FormItem class="P-MB-5">
          <Select placeholder="回复模板类型" v-model="TplType" :onChange="GetTemplateListLoading" :options="TemplateTypeDrop" optionValKey="TemplateTypeId" optionKey="TemplateTypeName" />
          <!-- <Select placeholder="回复模板类型" v-model="TplType" filterable clearable @on-change="GetTemplateListLoading">
            <Option v-for="(Item, Index) in TemplateTypeDrop" :key="Index" :value="Item.TemplateTypeId">{{Item.TemplateTypeName}}</Option>
          </Select> -->
        </FormItem>
        <FormItem class="P-MB-0 Tpl-List">
          <a class="P-MR-5" v-for="(Item, Index) in TemplateList" :key="Index" @click="RenderContent(Item)">({{Index+1}}) {{Item.TemplateTitle}}</a>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'HandleMail',
  components: {
    HandleMailImgs: () => import('./HandleMailImgs.vue')
  }
})

export default class HandleMail extends Vue {
  @Prop() private TemplateTypeDrop: Interface.TplTypeList[]
  @Prop() private HandleMailBase: Interface.MailList
  @Prop() private MessageId: number
  @Prop() private Powers: PInterface.Power

  @Emit() EmitHandleSuccess(): void {}
  @Emit() EmitOperates(Type: number): void {}

  @Watch('MessageId')
  WatchMessageId(Id: number) {
    if((this as any).$refs.HandleMailImgs){
      (this as any).$refs.HandleMailImgs.Reset();
    }
  }

  private mounted(): void {
    if(this.Powers.EbayMsgReply){
      this.GetTemplateList();
    }
  }

  private GetTemplateList(IsLoading: boolean = false): void {
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetTemplateList,
        Login: true
      },
      Data: {
        PageIndex: 1,
        PageSize: 500,
        Conditions: new Interface.SearchMailTpl({TemplateTypeId: this.TplType})
      },
      Callback: (Res: PInterface.Res): void => {
        if(IsLoading){
          this.$UI.Loading.Hide();
        }
        if(Res.IsSuccess){
          this.$set(this, 'TemplateList', Res.Data.PageModel.Items)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetTemplateListLoading(): void {
    this.$UI.Loading.Show()
    this.GetTemplateList(true)
  }

  private RenderContent(Tpl: Interface.TplList): void {
    let Ctn = Tpl.Content;
    if(this.ShipOrder){
      let ShipedTime = this.$UI.Render.Date(this.ShipOrder.ShipedTime, true), PaidTime = this.$UI.Render.Date(this.ShipOrder.PaidTime, true); 
      Ctn = Ctn.replace(/\[BuyerId\]/g, this.ShipOrder.BuyerId);
      Ctn = Ctn.replace(/\[TrackingNumber\]/g, this.ShipOrder.TrackingNumber || '[TrackingNumber]');
      Ctn = Ctn.replace(/\[ShippingCarrier\]/g, this.ShipOrder.ShippingCarrier);
      Ctn = Ctn.replace(/\[ShipedTime\]/g, ShipedTime === '-' ? '[ShipedTime]' : ShipedTime);
      Ctn = Ctn.replace(/\[PaidTime\]/g, PaidTime === '-' ? '[PaidTime]' : PaidTime);
      Ctn = Ctn.replace(/\[ShipToAddress\]/g, `${this.ShipOrder.BuyerStreet2 ? (this.ShipOrder.BuyerStreet2 + ',') : ''}${this.ShipOrder.BuyerStreet1},${this.ShipOrder.BuyerCity},${this.ShipOrder.BuyerState},${this.ShipOrder.BuyerCountry},${this.ShipOrder.BuyerZipCode}`);
    }
    this.$set(this, 'ReplyContent', Ctn);
  }

  private HandleReply(): void {
    if(!this.ReplyContent) {
      this.$UI.Tips.Floating('warning', '请输入回复内容')
      return
    }
    this.$UI.Loading.Show()
    let PostData = {
      MainMessageId: this.MessageId,
      Content: this.ReplyContent,
      Images: (this as any).$refs.HandleMailImgs.Images
    }
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EbayMessageReply,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '回复成功')
          this.ResetContent();
          this.EmitHandleSuccess();
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private ResetContent(): void {
    this.$set(this, 'ReplyContent', '');
  }

  private TplType: number = 0
  private TemplateList: Interface.TplList[] = []
  private ReplyContent: string = ""
}
</script>
<style lang="less" scoped>
.Tpl-List{
  height: 155px;
  overflow: auto;
}
  
</style>