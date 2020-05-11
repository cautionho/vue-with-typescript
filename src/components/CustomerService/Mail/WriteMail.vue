<!--写邮件-->
<template>
  <Modal v-model="EmailModal" :title="ModalTitle" :width="1000" @on-cancel="CancelModal"  class="Container-Tabs">
    <Form :model="WriteEmailForm" ref="WriteEmailForm" :rules="WriteEmailRules" :label-width="90" onsubmit="return false">
      <Tabs name="WriteEmailTabs" v-model="Tabs" type="card" @click="ChangeTabs">
        <TabPane label="基本信息" name="Base" tab="WriteEmailTabs">
          <FormItem label="发件人：" prop="FromAccount" :rules="{required: true, message: '请选择发件人', trigger: 'change'}" v-if="Type < 7">
            <Select placeholder="发件人" v-model="WriteEmailForm.FromAccount" :options="EmailAccounts" v-if="Type < 2" transfer/>
            <!-- <Select placeholder="发件人" v-model="WriteEmailForm.FromAccount" clearable filterable v-if="Type < 2">
              <Option v-for="(Item, Index) in Accounts" :key="Index" :value="`${Item.Name}-${Item.Account}`">{{Item.Name}}({{Item.Account}})</Option>
            </Select> -->
            <span v-else>
              {{WriteEmailForm.FromAccount}}
            </span>
          </FormItem>
          <FormItem label="收件人：" prop="ToAccounts" :rules="{required: true, message: '请输入收件人，多个地址之间请使用英文逗号隔开', validator: this.ValidateEmails}" v-if="Type < 7">
            <Input placeholder="收件人" v-model="WriteEmailForm.ToAccounts" />
          </FormItem>
          <FormItem label="抄送：" prop="CCAccounts" :rules="{required: false, message: '请输入正确格式的抄送邮箱地址，多个地址之间请使用英文逗号隔开', validator: this.ValidateEmails}" v-if="Type < 7">
            <Input placeholder="多个抄送请使用英文逗号隔开" v-model="WriteEmailForm.CCAccounts" />
          </FormItem>
          <FormItem label="主题：" prop="Title">
            <Input placeholder="主题" v-model="WriteEmailForm.Title" />
          </FormItem>
          <FormItem label="正文：" required>
            <Cascader placeholder="模板" :data="Tpl" clearable filterable @on-change="ChangeContent"></Cascader>
          </FormItem>
          <FormItem>
            <Jodit ref="Editor" />
          </FormItem>
        </TabPane>
        <TabPane label="附件信息" name="Attachment" tab="WriteEmailTabs">
          <FormItem label="附件：">
            <Upload multiple type="drag" :action="UploadFileApi" v-show="WriteEmailForm.Attachments.length < 5" :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})"  :show-upload-list="false" :on-success="HandleUploadSuccess" :format="['rar','zip','jpg','png','jpeg','gif','bmp','docx','doc','pdf','xps','xml']" :max-size="10240" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" :before-upload="HandleBeforeUpload">
              <div style="padding: 14px 0">
                  <Icon type="ios-cloud-upload" size="26"></Icon>
                  <p>点击或拖拽文件到此处（最多上传5个每个大小不超过10M的附件）</p>
              </div>
            </Upload>
            <ul>
              <li v-for="(Item, Index) in WriteEmailForm.Attachments" :key="Index" style="border-bottom: 1px dashed #ccc;list-style:none;">
                {{Item.FileName}}
                <Icon @click="UploaderDel(Index)" class="P-Float-Right P-Pointer P-MR-10" size="16" color="red" type="md-close" style="line-height:32px;"></Icon>
                <span class="P-Float-Right P-Inline-Block P-W-100">{{Item.FileSize}}</span>
              </li>
            </ul>
          </FormItem>

        </TabPane>
      </Tabs>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'
import Tree from '@/assets/Interface/Tree'

@Component({
  name: 'WriteMail',
  components: {
    Jodit: () => import('@/components/Public/Jodit.vue')
  }
})

export default class WriteMail extends Vue {
  @Emit() private EmitHandleSuccess(): void {}
  @Prop(Array) private Accounts: Tree.TreeNode[]

  @Watch('Accounts')
  AccountWatcher(Val: Tree.TreeNode[]): void {
    this.EmailAccounts = [];
    for(let { Name, Account } of Val){
      this.EmailAccounts.push({Key:`${Name}(${Account})`, Value: `${Name}-${Account}`})
    }
  }

  /* Type: 1-写邮件 2-回复邮件 3-回复全部 6-转发 7-物流异常订单写邮件 */
  private Trigger(Type: number, Mail: Interface.EmailDetails = new Interface.EmailDetails(), Folder: Tree.TreeNode): void {
    this.$set(this, 'EmailModal', true)
    this.$set(this, 'Type', Type)
    if(Type > 1){
      this.$set(this, 'WriteEmailForm', JSON.parse(JSON.stringify(Mail)));
      this.SetWriteEmail(JSON.parse(JSON.stringify(Mail)), Folder)
    }
    this.SetModalTitle()
  }

  /* 订单售后Tab触发发邮件 */
  private TriggerWrite(ToAccounts: string): void {
    this.$set(this, 'EmailModal', true)
    this.$set(this, 'Type', 1)
    this.$set(this.WriteEmailForm, 'ToAccounts', ToAccounts)
    this.SetModalTitle()
  }

  /* 物流异常订单触发发送邮件 */
  private TriggerLogisticsWrite(D: Interface.LogisticsExcaption[]): void {
    this.$set(this, 'EmailModal', true)
    this.$set(this, 'Type', 7)
    this.$set(this.WriteEmailForm, 'ShipOrderCodes', D.map(Item => Item.Id))
    this.SetModalTitle()
  }

  private SetModalTitle(): void {
    this.$set(this, 'ModalTitle', [1,7].includes(this.Type) ? '写邮件' : this.Type < 4 ? '回复邮件' : '转发')
    if(!this.Tpl.length){
      this.GetEmailTpls()
    }
  }

  /* 设置回复、回复全部、转发的特定值 */
  private SetWriteEmail(Mail: Interface.EmailDetails, Folder: Tree.TreeNode): void {
    this.$set(this.WriteEmailForm, 'FromAccount', Folder.Account)
    this.WriteEmailForm['OldEmailRecordId'] = Mail.Id;
    switch(this.Type){
      case 2:
        this.$set(this.WriteEmailForm, 'Title', `Re: ${Mail.Title}`)
        this.$set(this.WriteEmailForm, 'ToAccounts', Mail.ReplyTo || Mail.FromAccount)
        this.$set(this.WriteEmailForm, 'Attachments', [])
        break
      case 3:
        this.$set(this.WriteEmailForm, 'Title', `RE: ${Mail.Title}`)
        let Accounts:string[] = Array.from(new Set([Mail.FromAccount].concat([Mail.ToAccounts, Mail.ReplyTo], Mail.CCAccounts.split(',')))).filter(Itm => Itm !== ''), // 所有邮件集合
          Idx:number = Accounts.indexOf(this.WriteEmailForm.FromAccount)
          Idx >= 0 ? Accounts.splice(Idx, 1): null;
        this.$set(this.WriteEmailForm, 'ToAccounts', Accounts.join(',')) // Mail中的发件人、收件人、回复人、抄送人合起来去重后，去除回复邮件的账号收件地址
        this.$set(this.WriteEmailForm, 'Attachments', [])
        break
      case 6:
        this.$set(this.WriteEmailForm, 'Title', `Fw: ${Mail.Title}`)
        this.$set(this.WriteEmailForm, 'ToAccounts', '')
        break
    }
    this.$set(this.WriteEmailForm, 'Content', `<p><br></p><p><br></p><p><br></p>
    <p>------------------------------------------------------------original------------------------------------------------------------<br></p>
    <div style="background: rgb(241, 241, 241); font-size: 12px; width:100%; padding: 6px;margin-bottom: 6px; line-height:14px;">
      <p><b>From: </b>${Mail.FromAccount}</p>
      <p><b>To: </b>${Mail.ToAccounts}</p>
      <p><b>Reply-To: </b>${Mail.ReplyTo || '-'}</p>
      <p><b>Cc: </b>${Mail.CCAccounts || '-'}</p>
      <p><b>Date: </b>${this.$UI.Render.Date(Mail.EmailTime,true)}</p>
      <p><b>Subject: </b>${Mail.Title}</p>
    </div>
    ${Mail.Content}`)
    
    this.$nextTick(()=>{
      (this as any).$refs.Editor.SetContent(this.WriteEmailForm.Content)
    })
  }

  private GetEmailTpls(): void {
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetEmailTemplateTypeDrop,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.SetTplCascader(Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private  SetTplCascader(Data: any[]): void {
    Data.forEach(async(Item: any, Index: number): Promise<void> => {
      this.Tpl.push({
        value: Index,
        label: Item.TypeName,
        children: await this.GetTpl(Item.TypeId, Index)
      })
    })
  } 

  private GetTpl(Id: number, Idx: number): Promise<PInterface.Cascader[]> {
    return new Promise((Resolve:(Val: PInterface.Cascader[])=>void) => {
      this.$Request.Post({
        Server: this.$Server.CustomerService,
        Api: {
          Address: this.$Api.EmailTemplateDropList,
          Login: true
        },
        Data: Id,
        Callback: (Res: PInterface.Res): void => {
          if(Res.IsSuccess){
            Resolve(Res.Data.Data.map((Itm:any, Index: number) =>{ return { label: Itm.Title, value: `${Idx}-${Index}`, content: Itm.Content } }))
          }else{
            Resolve([])
            this.$Request.Error(Res)
          }
        }
      })
    })
  }

  private ChangeContent(Tpl: (number|string)[]): void {
    if(!Tpl.length) return;
    const T = this.Tpl[(Tpl[0] as number)].children.filter(Itm => Itm.value === Tpl[1])[0],
      Ctn = T ? T.content : '';
    (this as any).$refs.Editor.InsertCtn(Ctn);
  }

  private Validate(): void {
    (this as any).$refs.WriteEmailForm.validate((Valid: boolean): void => {
      if(Valid){
        if(!(this as any).$refs.Editor.GetContent()){
          this.$UI.Tips.Floating('warning', '请输入正文内容')
          return
        }else{
          this.$set(this.WriteEmailForm, 'Content', (this as any).$refs.Editor.GetContent());
          this.PostSendEmail()
        }
      }
    })
  }

  /* 提交邮件 */
  private PostSendEmail(): void {
    let PostData: Interface.WriteEmail = JSON.parse(JSON.stringify(this.WriteEmailForm))
    if(this.Type === 1){
      PostData.FromName = PostData.FromAccount.split('-')[0]
      PostData.FromAccount = PostData.FromAccount.split('-')[1]
    }

    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.Type === 1 ? this.$Api.EmailRecordWrite : this.Type === 2 ? this.$Api.EmailRecordReply : this.Type === 3 ? this.$Api.EmailRecordReplyAll : this.Type === 6 ? this.$Api.EmailRecordForward : this.Type === 7 ? this.$Api.BatchSendEmail : '',
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          if(this.Type === 7){
            // 物流异常订单发送邮件结果处理
            this.$UI.Loading.Hide()
            this.$UI.Tips.Modal({
              Type: Res.Data.IsAllSuccess ? 'success' : 'error',
              Content: `${Res.Data.ResultContent}。${Res.Data.IsAllSuccess ? '' : '<a href="'+this.$Server.CustomerService+Res.Data.Url+'" download>下载邮件发送失败订单表格</a>'}`,
              Callback: (B: boolean): void => {
                if(Res.Data.IsAllSuccess){
                  this.CancelModal()
                  this.EmitHandleSuccess()
                }
              }
            })
          }else{
            this.$UI.Tips.Floating('success', this.Type === 1 ? '发送成功' : this.Type < 4 ? '回复成功' : '转发成功')
            this.EmitHandleSuccess()
            this.CancelModal()
          }
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* 文件上传 */
  private HandleUploadSuccess(Res: PInterface.Res, File: any, FileList: any[]): void {
    if(Res.IsSuccess){
      let A: Interface.EmailAttachments = {
        FileName: File.name,
        FileSize: Res.Data.Size,
        DownloadUrl: `${this.$Server.File}/${Res.Data.Url}`
      }
      this.WriteEmailForm.Attachments.push(A);
    }else{
      this.$Request.Error(Res);
    }
    this.CountUploadQty()
  }
  private HandleFormatError(File: any): void {
    this.$UI.Tips.Floating('warning', `文件[${File.name}]格式不为rar/zip/jpg/png/jpeg/gif/bmp/docx/doc/pdf/xps/xml'，请检查`);
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
    if(this.UploadQty + this.WriteEmailForm.Attachments.length >= 5){
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
    this.WriteEmailForm.Attachments.splice(Idx, 1);
  }
  /* 文件上传 */

  private ChangeTabs(N: string): void {
    this.$set(this, 'Tabs', N)
  }

  private CancelModal(): void {
    this.$set(this, 'EmailModal', false)
    this.$set(this, 'ModalTitle', '')
    this.$set(this, 'UploadQty', 0)
    this.$set(this, 'Type', 0)
    this.$set(this, 'WriteEmailForm', new Interface.WriteEmail());
    (this as any).$refs.Editor.SetContent('')
    this.$nextTick(()=>{
      (this as any).$refs.WriteEmailForm.resetFields();
      this.$set(this, 'Tabs', 'Base')
    })
  }

  /* 验证邮箱正则 */
  private ValidateEmails(Rule:any, Val:string,C:()=>void): boolean {
    if(!Val){
      return !Rule.required
    }else{
      const Emails: string[] = Val.split(',')
      return Emails.every(Email => this.$Pattern.Email.test(Email))
    }
  }

  private EmailModal: boolean = false
  private ModalTitle: string = ''
  private Tabs: string = 'Base'
  private Type: number = 0 // 操作类型 1-写邮件 2-回复邮件 3-回复全部 6-转发

  private EmailAccounts: PInterface.KV[] = []

  private UploadFileApi: string = `${this.$Server.Settings}${this.$Api.UploadDocFile}`
  private Tpl: PInterface.Cascader[] = []

  private WriteEmailTabs: string = 'Base'
  private WriteEmailForm: Interface.WriteEmail = new Interface.WriteEmail()
  private UploadQty: number = 0

  private WriteEmailRules: any = {
    Title: [{required: true, message: '请输入主题'}]
  }
}
</script>
<style lang="less" scoped>

</style>