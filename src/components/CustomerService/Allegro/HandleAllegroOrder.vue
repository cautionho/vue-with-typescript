<template>
<Row>
  <Form :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="100">
    <FormItem label="操作：" class="P-MB-10">
      <RadioGroup v-model="HandleForm.OperationType">
        <Radio label="1">回复纠纷消息</Radio>
        <Radio label="2">请求关闭纠纷</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="模板：" class="P-MB-10">
      <div class="Tpl-Container">
        <a class="P-MR-5" v-for="(Item, Index) in TemplateList" :key="Index" @click="RenderContent(Item)" >{{`(${Index+1}) ${Item.Title}`}}</a>
      </div>
    </FormItem>
    <FormItem label="消息：" :rules="{required: true, message: '请输入消息'}" prop="Content">
      <Input placeholder="消息" type="textarea" :autosize="{minRows:6, maxRows:6}" v-model="HandleForm.Content"></Input>
    </FormItem>
    <FormItem label="附件：" v-if="HandleForm.OperationType!=2">
      <Upload ref="uploadFile" :show-upload-list="false" :action="UploadUrl" :headers="Headers" :max-size="2048" :on-exceeded-size="HandleMaxSize" :before-upload="UploadBefore" :on-success="UploadSuccess" :on-error="HandleError">
        <Button type="primary" class="P-MR-10">附件</Button>
        <span>{{HandleForm.Enclosure}}</span>
      </Upload>
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
  name: 'HandleAllegroOrder',
  components: {
  }
})

export default class HandleAllegroOrder extends Vue {
  @Getter private 'CustomerService/ALLEGRO_ORDER_INFO': Interface.AllegroOrderDisputeInfo
  get ALLEGRO_ORDER_INFO(){
    return this['CustomerService/ALLEGRO_ORDER_INFO']
  }

  @Getter private 'ShipOrder/SHIP_ORDER_INFO': ShipOrder.ShipOrderBase
  get SHIP_ORDER_INFO(){
    return this['ShipOrder/SHIP_ORDER_INFO'];
  }

  @Getter private 'ShipOrder/SHIP_ORDER_ADDRESS': PInterface.ShipToAddress
  get SHIP_ORDER_ADDRESS(){
    return this['ShipOrder/SHIP_ORDER_ADDRESS'];
  }

  @Emit() private EmitHandleSuccess(): void {}
  @Emit() private EmitCancelModal(): void {}

  private mounted(): void {
    this.GetTemplateList()
  }

  private GetTemplateList(IsLoading: boolean = false): void {
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetEmailTemplateList,
        Login: true
      },
      Data: { PageIndex: 1, PageSize: 9999, Conditions: {KeyWord: "", TypeId: 8} },
      Callback: (Res: PInterface.Res): void => {
        
        if(Res.IsSuccess){
          this.$set(this, 'TemplateList', Res.Data.PageModel.Items)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private RenderContent(Tpl: Interface.TplList): void {
    let Ctn = Tpl.Content;
    if(this.SHIP_ORDER_INFO.Id){
      let ShipedTime = this.$UI.Render.Date(this.SHIP_ORDER_INFO.ShipedTime, true), PaidTime = this.$UI.Render.Date(this.SHIP_ORDER_INFO.PaidTime, true); 
      Ctn = Ctn.replace(/\[BuyerId\]/g, this.SHIP_ORDER_INFO.BuyerUserId);
      Ctn = Ctn.replace(/\[TrackingNumber\]/g, this.SHIP_ORDER_INFO.TrackingNumber || '[TrackingNumber]');
      Ctn = Ctn.replace(/\[ShippingCarrier\]/g, this.SHIP_ORDER_INFO.ShippingService);
      Ctn = Ctn.replace(/\[ShipedTime\]/g, ShipedTime === '-' ? '[ShipedTime]' : ShipedTime);
      Ctn = Ctn.replace(/\[PaidTime\]/g, PaidTime === '-' ? '[PaidTime]' : PaidTime);
      Ctn = Ctn.replace(/\[ShipToAddress\]/g, `${this.SHIP_ORDER_ADDRESS.BuyerStreet2 ? (this.SHIP_ORDER_ADDRESS.BuyerStreet2 + ',') : ''}${this.SHIP_ORDER_ADDRESS.BuyerStreet1},${this.SHIP_ORDER_ADDRESS.BuyerCity},${this.SHIP_ORDER_ADDRESS.BuyerState},${this.SHIP_ORDER_ADDRESS.BuyerCountry},${this.SHIP_ORDER_ADDRESS.BuyerZipCode}`);
    }
    this.$set(this.HandleForm, 'Content', Ctn);
  }

  private UploadBefore(): void{
    this.$UI.Loading.Show();
  }

  private UploadSuccess(Res: PInterface.Res): void{
    this.$UI.Loading.Hide();
    this.HandleForm.Enclosure = Res.Data.Url;
    (this.$refs["uploadFile"] as any).clearFiles();
  }

  private HandleError(Errors: any, File:any): void {
    this.$UI.Loading.Hide();
    this.$UI.Tips.Modal({
      Type: 'warning',
      Content: Errors,
      Callback: (B:boolean):void =>{}
    })
  }

  private HandleMaxSize(File:any):void {
    this.$UI.Loading.Hide();
    this.HandleForm.Enclosure = "";
    this.$Notice.warning({
      title: '超出文件大小限制',
      desc: '文件 ' + File.name + ' 太大，不能超过 2M。'
    });
  }

  private Reset(): void {
    (this as any).$refs.HandleForm.resetFields()
    this.$set(this, 'HandleForm', new Interface.HandleAllegroOrder());
  }

  private Validate(): void {
    let PostData = JSON.parse(JSON.stringify(this.HandleForm));
    PostData.Id = this['ALLEGRO_ORDER_INFO'].Id;
    PostData.OperationType = Number(PostData.OperationType);
    if(PostData.OperationType == 2){
      PostData.Enclosure = ""
    }
    (this.$refs.HandleForm as any).validate((Valid:boolean) => {
      if (Valid) {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.CustomerService,
          Api: {
            Address: this.$Api.AllegroDisputesOrderProcess,
            Login: true
          },
          Data: PostData,
          Callback: (Res: PInterface.Res): void => {
            if(Res.IsSuccess){
              this.$UI.Tips.Floating('success', `${PostData.OperationType == 1 ? '回复纠纷消息' : '请求关闭纠纷'}成功`);
              this.EmitHandleSuccess();
            }else{
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private TemplateList: Interface.TplList[] = []
  private HandleForm: Interface.HandleAllegroOrder = new Interface.HandleAllegroOrder()
  private UploadUrl: string = this.$Server.Settings + this.$Api.UploadImage
  private Headers: any = {
    "userid": JSON.parse(this.$Cookie.Get('frler_user')).UserId
  }
}
</script>
<style lang="less" scoped>
.Tpl-Container {
  max-height:100px;
  overflow: auto;
}
</style>