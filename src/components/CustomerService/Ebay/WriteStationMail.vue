<!-- 发送站内信 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="Trigger" v-if="IsBtn">发送站内信</Button>
    <Modal v-model="StationMailModal" title="发送站内信" :width="800" @on-cancel="CancelModal">
      <Form :model="SendMailForm" ref="SendMailForm" :label-width="0" onsubmit="return false">
        <FormItem>
          <Cascader ref="TplCascader" trigger="hover" placeholder="请选择模板" :data="Tree" clearable filterable @on-change="RenderContent"></Cascader>
        </FormItem>
        <FormItem prop="Content" :rules="{required: true, message: '请输入内容'}">
          <Input placeholder="请输入内容" ref="Ipt" type="textarea" :autosize="{maxRows: 6, minRows: 6}" v-model="SendMailForm.Content"></Input>
        </FormItem>
        <div class="P-Inline-Block P-Uploader-Img" v-for="(Item, Index) in SendMailForm.Images" :key="Index">
          <img class="P-Uploader-Img" :src="`${$Server.File}/${Item}`" />
          <Icon class="P-Uploader-Del" type="md-close-circle" size="20" @click="UploaderDel(Index)"></Icon>
        </div>
        <Upload v-show="SendMailForm.Images.length < 5" :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})" :show-upload-list="false" :on-success="HandleUploadSuccess" :accept="'.jpg, .jpge, .png'" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" :before-upload="HandleBeforeUpload" multiple :action="`${$Server.Settings}${$Api.UploadImage}`" class="P-Uploader P-Inline-Block P-VA-T">
          <div class="P-Uploader-Img">
            <Icon type="md-add" size="20"></Icon>
          </div>
        </Upload>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'WriteStationMail'
})

export default class WriteStationMail extends Vue {
  @Prop({default: true, type: Boolean}) private IsBtn: boolean

  @Emit() private EmitOperateSuccess(): void {}
  @Emit() private TriggerOperations(Ref: string = 'EbayMsgSend'): void {}

  private Trigger(): void {
    this.TriggerOperations('EbayMsgSend')
  }

  /* 发货订单页面触发发送站内信 */
  private TriggerWrite(D: ShipOrder.ShipOrderList[]): void {
    if(!D.length || D.some( Item => Item.ShipOrder.Platform !== 1 )){
      this.$UI.Tips.Floating('warning', '请选择eBay平台发货订单进行操作')
      return
    }
    this.OrderCodes = D.map(Item => Item.ShipOrder.OrderCode)
    this.TriggerModal()
  }

  /* 物流异常订单触发发送站内信 */
  private TriggerLogisticsWrite(D: Interface.LogisticsExcaption[]): void {
    if(D.some( Item => Item.Platform !== 1 )){
      this.$UI.Tips.Floating('warning', '请选择eBay平台发货订单进行操作')
      return
    }
    this.$set(this, 'SendType', 2);
    this.$set(this.SendMailForm, 'ShipOrderCodes', D.map(Item => Item.OrderCode))
    this.TriggerModal()
  }

  /* trackmore物流跟踪页面触发发送站内信 */
  private TriggerOrdinaryWrite(D: string[]): void{
    this.OrderCodes = D;
    this.TriggerModal()
  }

  /* 纠纷触发发送站内信 */
  private DisputedWrite(D: string[]): void {
    if(!D.length){
      this.$UI.Tips.Floating('warning', '请选择有关联发货订单的纠纷进行操作')
      return
    }
    this.OrderCodes.push(...D)
    this.TriggerModal()
  }

  /* 使用ItemId */
  private ItemIdWrite(C: string, ItemId: string): void {
    this.$set(this, 'SendType', 3)
    this.OrderCodes.push(C)
    this.$set(this.SendMailForm, 'ItemId', ItemId)
    this.TriggerModal()
  }

  /* 打开模态框 */
  private TriggerModal(): void {
    if(!this.Tree.length){
      this.GetTplTree()
    }
    this.$set(this, 'StationMailModal', true)
    this.$nextTick(()=>{
      (this as any).$refs.Ipt.focus()
    })
  }

  /* 客户评价触发发送站内信 需要调用SetStatus改变客户评价状态 迁移客户评价时需要兼容*/
  private EvaluateWrite(): void {
    this.$set(this, 'SendType', 4) 
  }

  private GetTplTree(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetTemplateList,
        Login: true
      },
      Data: {
        PageIndex: 1,
        PageSize: 100000001,
        Conditions: new Interface.SeatchMailTpl()
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          // 提取一级类型并去重
          const Types: string[] = Array.from(new Set(Res.Data.PageModel.Items.map((Item: any) => { return JSON.stringify({ label: Item.TemplateTypeName, value: Item.TemplateTypeId, children: [] }) })))
          this.Tree = Types.map((Item: string) => {
            const Type = JSON.parse(Item)
            Res.Data.PageModel.Items.map((Itm: any) => {
              if(Itm.TemplateTypeId === Type.value){
                Type.children.push( { label: Itm.TemplateTitle, value: Itm.TemplateId, content: Itm.Content })
              }
            })
            return Type;
          })
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private RenderContent(Tpl: number[], SelectedData: PInterface.Cascader[]): void {
    if(Tpl.length){
      this.$set(this.SendMailForm, 'Content', (SelectedData.pop() as PInterface.Cascader).content);
    }
  }

    /* 上传文件 */
  private HandleUploadSuccess(Res: PInterface.Res, File: any, FileList: any[]): void {
    if(Res.IsSuccess){
      this.SendMailForm.Images.push(Res.Data.Url);
    }else{
      this.$Request.Error(Res);
    }
    this.CountUploadQty()
  }
  private HandleFormatError(File: any): void {
    this.$UI.Tips.Floating('warning', `文件[${File.name}]格式不为JPG/JPGE/PNG，请检查`);
    this.CountUploadQty()
  }
  private HandleMaxSize(File: any, FileList: any[]): void {
    this.$UI.Tips.Floating('warning', `文件${File.name}大小超过2M，请检查`);
    this.CountUploadQty()
  }
  private HandleBeforeUpload(File: any): void | boolean {
    if(this.UploadQty === 0){
      this.$UI.Loading.Show();
    }
    // 超过5张不再继续上传
    if(this.UploadQty + this.SendMailForm.Images.length >= 5){
      return false
    }
    this.UploadQty++;
  }

  private CountUploadQty(): void {
    this.UploadQty--;
    if(this.UploadQty <= 0){
      this.$UI.Loading.Hide();
    }
  }

  private UploaderDel(Idx: number): void {
    this.SendMailForm.Images.splice(Idx, 1);
  }
  /* 上传文件 */

  /* 1-普通发送 2-物流异常订单发送 3-使用ItemId 4-客户评价发送站内信 */
  private Validate(): void {
    (this as any).$refs.SendMailForm.validate(async (Valid: boolean): Promise<void> => {
      if(Valid){
        if(this.SendType === 2){
          this.PostLogisticsExceptionMail()
        }else{
          // 逐个发送
          this.$UI.Loading.Show()
          for(let Item of this.OrderCodes){
            this.$set(this.SendMailForm, 'ShipOrderCode', Item)
            await this.PostMail()
          }
          if(this.SendType === 3){
            this.HandleItemIdRes()
          }else{
            this.HandleNormalRes()
          }
          this.$UI.Loading.Hide()
        }
      }
    })
  }

  private HandleItemIdRes(): void {
    if(this.SendErrorCodes.length){
      this.$UI.Tips.Floating('success', '发送失败')
      this.$set(this, 'SendErrorCodes', [])
    }else{
      this.$UI.Tips.Floating('success', '发送成功')
      this.EmitOperateSuccess()
      this.CancelModal()
    }
  }

  private HandleNormalRes(): void {
    this.$UI.Tips.Modal({
      Type: 'success',
      Content: this.SendErrorCodes.length ? `发送成功，其中${this.SendErrorCodes.length}个订单的站内信发送失败。失败订单如下：${this.SendErrorCodes.join(',')}` : `发送成功`,
      Callback: (B: boolean): void => {
        this.CancelModal();
        this.EmitOperateSuccess()
        this.$set(this, 'SendErrorCodes', [])
      }
    })
  }

  /* 物流异常订单发送站内信 */
  private PostLogisticsExceptionMail(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.BatchSendEmail,
        Login: true
      },
      Data: this.SendMailForm,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Modal({
            Type: Res.Data.IsAllSuccess ? 'success' : 'error',
            Content: `${Res.Data.ResultContent}。${Res.Data.IsAllSuccess ? '' : '<a href="'+this.$Server.CustomerService+Res.Data.Url+'" download>下载邮件发送失败订单表格</a>'}`,
            Callback: (B: boolean): void => {
              if(Res.Data.IsAllSuccess){
                this.CancelModal()
                this.EmitOperateSuccess()
              }
            }
          })
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* 普通发送站内信 */
  private PostMail(): Promise<boolean> {
    return new Promise((Resolve: (Val: boolean) => void) => {
      this.$Request.Post({
        Server: this.$Server.CustomerService,
        Api: {
          Address: this.$Api.EbayMessageSend,
          Login: true
        },
        Data: this.SendMailForm,
        Callback: (Res: PInterface.Res): void => {
          Resolve(true)
          if(!Res.IsSuccess){
            this.SendErrorCodes.push(this.SendMailForm.ShipOrderCode as string)
          }
        }
      })
    })
  }

  private CancelModal(): void {
    this.$set(this, 'StationMailModal', false);
    (this as any).$refs.TplCascader.clearSelect()
    this.$set(this, 'SendMailForm', new Interface.SendMail())
    this.$set(this, 'SendType', 1)
    this.$set(this, 'OrderCodes', [])
    this.$set(this, 'SendErrorCodes', [])
    this.$nextTick(()=>{
      (this as any).$refs.SendMailForm.resetFields();
    })
  }


  private SendType: number = 1 // 1-普通发送 2-物流异常订单发送 3-使用ItemId 4-客户评价
  private StationMailModal: boolean = false
  private Tree: PInterface.Cascader[] = []

  // private Images: string[] = []
  private UploadQty: number = 0

  private SendMailForm: Interface.SendMail = new Interface.SendMail()
  private OrderCodes: string[] = []
  private SendErrorCodes: string[] = []
}
</script>
<style lang="less" scoped>

</style>