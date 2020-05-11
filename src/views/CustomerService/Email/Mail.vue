<!-- 邮件管理 -->
<template>
  <Row>
    <Col span="24">
      <Button type="primary" v-if="Powers.EmailWrite" @click="TriggerOperates(1)">写邮件</Button>
      <WriteMail ref="WriteMail" :Accounts="FolderTree" @emit-handle-success="EmitHandleSuccess" v-if="Powers.EmailWrite || Powers.EmailReply || Powers.EmailRepost" />
      <SignMail ref="SignMail" @trigger-operates="TriggerOperates" @emit-handle-success="EmitHandleSuccess" class="P-ML-10" v-if="Powers.EmailSign" />
      <DeleteMail ref="DeleteMail" class="P-ML-10" @trigger-operates="TriggerOperates" @emit-handle-success="EmitHandleSuccess" v-if="Powers.EmailDelete" />
      <Form class="P-Inline-Block P-VA-T P-MB-10" inline ref="SearchFilter" v-model="SearchFilter" onsubmit="return false;">
        <FormItem class="P-ML-10  P-MB-0">
					<Input placeholder="搜索关键字" class="P-W-300" v-model="SearchFilter.KeyWord" @on-enter="SearchList(false)">
					<Button slot="append" type="primary" @click="SearchList(false)">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10  P-MB-0">
					<Button type="warning" @click="ResetAll(true)">重置</Button>
				</FormItem>
      </Form>
    </Col>
    <Col span="3" class="Tree-Container">
      <FrTree ref="FrTree" :Data="FolderTree" :ClickFn="TriggerFolderTree" :TreeNodeFunc="HandleFolderTreeNode"></FrTree>
    </Col>
    <Col span="4" class="Mail-List-Container">
      <ul class="Mail-List">
        <p class="P-TA-C Mail-List-None" v-if="!MailList.length">暂无数据</p>
        <CheckboxGroup v-model="HandleMails">
          <li v-for="(Item, Index) in MailList" :key="Index" :class="`${Item.Active ? 'Mail-List-Item-Active': ''}`">
            <!-- 复选框 -->
            <div class="Mail-List-Checkbox">
              <Checkbox :label="Item.Id"><span></span></Checkbox>
            </div>
            <!-- 信简介 -->
            <div class="Mail-List-Box" @click="GetMailDetails(Index)">
              <p><b>{{Item.FromName}}</b></p>
              <p><b>{{$UI.Render.Date(Item.EmailTime, true)}}</b><b class="P-Float-Right P-Table-Tip P-BG-Primary">{{Item.CustomerName}}</b></p>
              <p class="P-LINE-1">{{Item.Title}}</p>
            </div>
          </li>
        </CheckboxGroup>
      </ul>
      <Page v-if="MailList.length" class="P-MT-10 P-TA-C" :current="Pager.PageIndex" :total="Pager.TotalItems" simple />
    </Col>
    <Col span="17" class="Mail-Details" v-if="HandleMail.Id">
      <Row class="Mail-Details-Operations">
        <Button type="primary" ghost size="small" v-if="Powers.EmailReply" @click="TriggerOperates(2)">回复</Button>
        <Button type="primary" ghost size="small" class=" P-ML-5" v-if="Powers.EmailReply" @click="TriggerOperates(3)">回复全部</Button>
        <Button type="primary" ghost size="small" class=" P-ML-5" v-if="Powers.EmailRepost" @click="TriggerOperates(6)">转发</Button>
        <Button type="primary" ghost size="small" class=" P-ML-5" v-if="Powers.EmailSign" @click="TriggerOperates(MailList[HandleIndex].RecordType === 1 ? 4 : 5, 2)">{{MailList[HandleIndex].RecordType === 1 ? '标记已读' : '标记未读'}}</Button>
        <Button type="error" ghost size="small" class=" P-ML-5" v-if="Powers.EmailDelete" @click="TriggerOperates(7, 2)">删除</Button>
      </Row>
      <div class="Send-Info-Container">
        <Tooltip class="Mail-Title" :content="HandleMail.Title">{{HandleMail.Title}}</Tooltip>
        <p><b>发件人：</b>{{HandleMail.FromAccount}}</p>
        <p><b>收件人：</b>{{HandleMail.ToAccounts}}</p>
        <p><b>回复人：</b>{{HandleMail.ReplyTo}}</p>
        <p><b>抄送：</b>{{HandleMail.CCAccounts}}</p>
        <p><b>时间：</b>{{$UI.Render.Date(HandleMail.EmailTime, true)}}</p>
      </div>
      <div class="Send-Content Height-Cut-364">
        <section v-html="HandleMail.Content"></section>
        <ul class="P-PL-10 P-PR-10 P-MT-10 P-MB-20" style="border: 1px dashed #ccc;overflow: hidden;" v-if="HandleMail.Attachments.length">
          <h2 class="P-TA-C" style="border-bottom:1px dashed #ccc;line-height:36px;">附件</h2>
          <li v-for="(Item, Index) in HandleMail.Attachments" :key="Index" class="P-MR-10" style="list-style:none; width:100px;padding:6px;float:left;">
            <p class="P-TA-C">
              <Icon type="ios-paper" size="52" />
            </p>
            <p class="P-TA-C">{{Item.FileName}}</p>
            <p class="P-TA-C"><Button size="small" @click="DownloadFile(Item.DownLoadUrl)">下载</Button></p>
          </li>
        </ul> 
      </div>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import Tree from '@/assets/Interface/Tree';

@Component({
  name: 'Mail',
  components: {
    FrTree: () => import('@/components/Public/Tree.vue'),
    SignMail: () => import('@/components/CustomerService/Mail/SignMail.vue'),
    DeleteMail: () => import('@/components/CustomerService/Mail/DeleteMail.vue'),
    WriteMail: () => import('@/components/CustomerService/Mail/WriteMail.vue')
  }
})

export default class Mail extends Vue {
  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['EmailWrite','EmailSign','EmailDelete','EmailReply','EmailRepost']))
    this.GetFolderTree()
  }

  /* 获取账号树 */
  private GetFolderTree(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetEmailRecordAccounts,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          if((this as any).$refs.FrTree){
            (this as any).$refs.FrTree.GetExpandNodes().then((Expands: Tree.TreeNode[])=>{
              this.$set(this, 'FolderTree', []);
              this.SetFolderTree(Res.Data.Data, Expands, this.FolderTree)
            })
          }else{
            this.SetFolderTree(Res.Data.Data, [], this.FolderTree)
          }
          
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* 设置账号树源数据 */
  private SetFolderTree(Trees: Interface.EMailAccountTree[], Expands: Tree.TreeNode[], List: Tree.TreeNode[]): void {
    for(let Item of Trees){
      const Node:Tree.TreeNode = {
        Title: `${Item.Name}${Item.UnRead > 0 ? '('+Item.UnRead+')' : ''}`,
        Name: Item.Name,
        Account: Item.Account,
        Children: [{
          Title: `未读邮件${Item.UnRead > 0 ? '('+Item.UnRead+')' : ''}`,
          IsActive: this.ActiveTreeNode.Id === `${Item.AccountId}-1`,
          Id: `${Item.AccountId}-1`,
          Account: Item.Account,
          Children: []
        },{
          Title: `已读邮件`,
          IsActive: this.ActiveTreeNode.Id === `${Item.AccountId}-2`,
          Id: `${Item.AccountId}-2`,
          Account: Item.Account,
          Children: []
        },{
          Title: `已发送邮件`,
          IsActive: this.ActiveTreeNode.Id === `${Item.AccountId}-3`,
          Id: `${Item.AccountId}-3`,
          Account: Item.Account,
          Children: []
        }],
        IsExpand: Expands.some(Exp => Exp.Id === Item.AccountId),
        IsActive: this.ActiveTreeNode.Id === Item.AccountId,
        Id: Item.AccountId,
      }
      List.push(Node)
    }
  }

  /* 点击账号树 */
  private TriggerFolderTree(Item: Tree.TreeNode): void {
    if(Item.IsActive){
      this.$set(this, 'ActiveTreeNode', Item)
      this.ResetList()
    }else{
      this.$set(this, 'ActiveTreeNode', new Tree.TreeNode())
      this.ResetAll(false)
    }
  }

  /* 获取邮件详情 */
  private GetMailDetails(Idx: number): void {
    for(let Item of this.MailList){
      Item['Active'] = false
    }
    this.MailList[Idx].Active = true;
    this.$set(this, 'HandleMail',  new Interface.EmailDetails())
    this.$set(this, 'HandleIndex', Idx)
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EmailRecordDetail,
        Login: true
      },
      Data: this.MailList[Idx].Id,
      Callback:(Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'HandleMail', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* 搜索列表 */
  private SearchList(IsHandle: boolean = false): void {
    this.$UI.Loading.Show()
    let PostData: Interface.SearchEmailList = JSON.parse(JSON.stringify(this.SearchFilter))
    PostData.AccountId = Number((String(this.ActiveTreeNode.Id)).split('-')[0])
    PostData.RecordType = Number((String(this.ActiveTreeNode.Id)).split('-')[1]) || 0
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetEmailRecordList,
        IsLogin: true
      },
      Data: {
        PageIndex: this.Pager.PageIndex,
        PageSize: 20,
        Conditions: PostData
      },
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$set(this, 'MailList', Res.Data.PageModel.Items.map((Item: Interface.MailList, Index: number): Interface.MailList =>{ return Object.assign(Item, { Active: this.HandleIndex === Index }) }));
          this.$set(this.Pager, 'TotalItems', Res.Data.PageModel.TotalItems)
          if(IsHandle){
            this.GetMailDetails(this.HandleIndex)
          }else{
            this.$UI.Loading.Hide();
          }
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }
  /* 仅重置列表 */
  private ResetList(): void {
    this.$set(this, 'Pager', new PInterface.Pager())
    this.ResetHandle();
    this.SearchList();
  }

  private ResetHandle(): void {
    this.$set(this, 'HandleIndex', NaN)
    this.$set(this, 'HandleMail', new Interface.MailDetails())
    this.$set(this, 'HandleMails', [])
  }
  
  /* 重置全部  GetTree：是否重新获取账号树 */
  private ResetAll(GetTree: boolean): void {
    this.$set(this, 'Pager', new PInterface.Pager())
    this.$set(this, 'MailList', [])
    this.$set(this, 'ActiveTreeNode', new Tree.TreeNode())
    this.$set(this, 'SearchFilter', new Interface.SearchEmailList())
    this.ResetHandle()
    if(GetTree){
      this.GetFolderTree();
    }
  }

  /* 账号树操作项 */
  private HandleFolderTreeNode(T: string, Node: Tree.TreeNode): void {
    if(T === 'modify'){
      (this as any).$refs.ModifyMailFolder.Trigger(Node)
    }else if(T === 'delete'){
      this.HandleDelete(Node)
    }
  }

  /* 1-写邮件 2-回复 3-回复全部 4-标记已读 5-标记未读 6-转发 7-删除 */
  /* Ot 1-批量 2-单个 */
  private TriggerOperates(Type: number, Ot: number = 1): void {
    let Selc: Interface.EmailList[] = []
    if(Ot === 1){
        Selc = this.MailList.filter((Mail: Interface.EmailList) => {
          return this.HandleMails.some( Id => Id === Mail.Id);
        })
    }else{
      Selc.push(this.MailList[this.HandleIndex])
    }
    switch(Type){
      case 1:
      case 2:
      case 3:
      case 6:
        (this as any).$refs.WriteMail.Trigger(Type, this.HandleMail, this.ActiveTreeNode)
        break
      case 4:
      case 5:
        (this as any).$refs.SignMail.Trigger(Type, Selc)
        break;
      case 7:
        (this as any).$refs.DeleteMail.Trigger(Selc)
        break
    }
  }

  private DownloadFile(Url: string): void {
    window.open(Url, '_blank')
  }

  /* 处理成功：1.重新获取树数据，2.重新获取站内信列表，3.自动打开下一个站内信进行处理 */
  private EmitHandleSuccess(): void {
    this.GetFolderTree()
    this.$set(this, 'HandleMails', []);
    if(this.ActiveTreeNode.Id){
      this.SearchList(!isNaN(this.HandleIndex))
    }
  }

  private Powers: PInterface.Power = {}

  private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.MailSearchType)

  private SearchFilter: Interface.SearchEmailList = new Interface.SearchEmailList()
  private Pager: PInterface.Pager = new PInterface.Pager()

  private FolderTree: Tree.TreeNode[] = []
  private ActiveTreeNode: Tree.TreeNode = new Tree.TreeNode()

  private MailList: Interface.EmailList[] = []
  private HandleMails: number[] = []
  private HandleIndex: number = NaN // 正在处理的信件下标
  private HandleMail: Interface.EmailDetails = new Interface.EmailDetails() // 正在处理的信件详情

}
</script>

<style lang="less">
.Tree-Container{
  height: calc(100vh - 170px);
  overflow: auto;
}

.Mail-List-Container{
  height: calc(100vh - 170px);
  border-left: 1px dotted #F1F1F1;

  & .Mail-List{
    padding: 0 10px;
    width: 100%;
    height: calc(100vh - 200px);
    overflow: auto;
    border-left: 1px dotted #F1F1F1;

    &>.Mail-List-None{
      line-height: calc(100vh - 200px);
    }

    & li{
      list-style: none;
      padding: 10px 2px;
      border-bottom: 1px dotted #F1F1F1;
      cursor: pointer;

      &.Mail-List-Item-Active{
        background: rgba(0,0,0,.1);
      }
    }

    & .Mail-List-Checkbox{
      display: inline-block;
      width: 20px;
      vertical-align: text-top;
    }

    & .Mail-List-Box{
      display: inline-block;
      width: calc(100% - 20px);
      vertical-align: top;
      cursor: pointer;
    }
  }
}

.Mail-Details{
  border-left: 1px dotted #e5e5e5;
  padding: 0px 5px;

  & .Mail-Details-Operations {
    padding: 8px 6px;
    background: #F1F1F1;
    border-bottom: 1px dashed #e5e5e5;
  }

  & .Mail-Title{
    font-size: 14px;
    font-weight: 700;
  }

  & .Send-Info-Container {
    padding: 6px;
    background-color: #F1F1F1;
    line-height: 16px;
  }

  & .Send-Content{
    overflow: auto;
    padding-top:6px;
  }
}

.Height-Cut-364{
  height:calc(100vh - 320px);
}

</style>