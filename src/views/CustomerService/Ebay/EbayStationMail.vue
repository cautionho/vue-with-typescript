<!-- eBay站内信 -->
<template>
  <Row>
    <Col span="24">
      <ModifyMailFolder v-if="Powers.EbayMsgAddFolder || Powers.EbayMsgEditFolder" :IsCreate="Powers.EbayMsgAddFolder || false" ref="ModifyMailFolder" @emit-handle-success="EmitHandleSuccess" class="P-MB-10" />
      <Move v-if="Powers.EbayMsgMove" class="P-ML-5 P-MB-10" ref="Move" :FolderTree="FolderTree" @get-selected="GetCheckboxSelected" @emit-handle-success="EmitHandleSuccess" />
      <Ignore v-if="Powers.EbayMsgIgnore" class="P-ML-5 P-MB-10" ref="Ignore" @get-selected="GetCheckboxSelected" @emit-handle-success="EmitHandleSuccess" />
      <Remark v-if="Powers.EbayMsgAddRemark" ref="Remark" @emit-handle-success="SearchList(true)" />
      <ModifyAfterSalesOrder v-if="Powers.AfterSaleOrdCreat" ref="ModifyAfterSalesOrder"></ModifyAfterSalesOrder>
      <Form class="P-Inline-Block P-VA-T P-MB-10" inline ref="SearchFilter" v-model="SearchFilter" onsubmit="return false;">
        <FormItem class="P-ML-10  P-MB-0">
          <Select class="P-W-200" placeholder="筛选状态" v-model="SearchFilter.IsProcess" :options="StatusDrop" />
          <!-- <Select class="P-W-200" placeholder="筛选状态" v-model="SearchFilter.IsProcess" filterable clearable>
						<Option v-for="(Item, Index) in StatusDrop" :value="$Enums.CustomerService.MailStatus[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
        </FormItem>
        <FormItem class="P-ML-10  P-MB-0">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList(false)">
          <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.FieldName" :options="SearchTypeDrop" />
          <!-- <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.FieldName" filterable clearable>
            <Option v-for="(Item, Index) in SearchTypeDrop" :key="Index" :value="$Enums.CustomerService.MailSearchType[Item]">{{ Item }}</Option>
          </Select> -->
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
              <Checkbox :label="Item.MainMessageId"><span></span></Checkbox>
            </div>
            <!-- 信简介 -->
            <div class="Mail-List-Box" @click="GetMailDetails(Index)">
              <p><b>{{Item.BuyerId}}</b><b class="P-Float-Right">({{Item.MergeMessageNum}})<Icon v-if="Item.IsRemark" type="md-text" size="14"></Icon></b></p>
              <p><b>{{Item.BuyerSendTime.replace('/', '-')}}</b><b class="P-Float-Right P-Table-Tip P-BG-Primary">{{Item.LastCustomerName}}</b></p>
              <p class="P-LINE-1">{{Item.ChatSubject}}</p>
            </div>
          </li>
        </CheckboxGroup>
      </ul>
      <Page v-if="MailList.length" class="P-MT-10 P-TA-C" :current="Pager.PageIndex" :total="Pager.TotalItems" simple />
    </Col>
    <Col span="17" :class="'Mail-Details ' + GetCurHeight(1)">
      <Row v-if="!isNaN(HandleIndex)" :class="'Mail-Chat ' + GetCurHeight(2)">
        <Table class="P-MB-5" v-if="!isNaN(HandleIndex) && MailList[HandleIndex].BuyerId !== 'eBay'" :columns="HandleMailCol" :data="HandleMail.ShipOrders.slice(0,1) || []" size="small" stripe></Table>
        <Table class="P-MB-5" :show-header="false" :columns="RemarkCol" :data="HandleMail.Remarks.slice(0,1)" v-if="HandleMail.Remarks.length" size="small" stripe></Table>
        <Col v-for="(Item, Index) in HandleMail.Chats" :key="Index" class="Chat-Box">
          <header>
            <p class="Chat-Title">
              <span>{{Item.ChatSubject}}</span>
              <Button class="P-Float-Right" size="small">翻译成英文</Button>
            </p>
            <p>
              <span>{{Item.IsFromCustomer ? Item.SellerId : Item.BuyerId}} -> {{Item.IsFromCustomer ? Item.BuyerId : Item.SellerId}}</span>
              <span class="P-Float-Right">{{Item.ChatTime}}</span>
            </p>
          </header>
          <content v-html="Item.ChatContent"></content>
        </Col>
      </Row>
      <Row v-if="!isNaN(HandleIndex)" class="P-MT-5">
        <Handle :Powers="Powers" :TemplateTypeDrop="TemplateTypeDrop" :HandleMailBase="MailList[HandleIndex]" :HandleMail="HandleMail.ShipOrders[0]" @emit-operates="TriggerOperates" @emit-handle-success="EmitHandleSuccess"></Handle>
      </Row>
      <Row v-else>
        <p :class="'P-TA-C Mail-Details-None ' + GetCurHeight(3)">暂无数据</p>
      </Row>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import Tree from '@/assets/Interface/Tree';

@Component({
  name: 'EbayStationMail',
  components: {
    ModifyMailFolder: () => import('@/components/CustomerService/Ebay/ModifyMailFolder.vue'),
    Move: () => import('@/components/CustomerService/Ebay/MoveMail.vue'),
    Ignore: () => import('@/components/CustomerService/Ebay/IgnoreMail.vue'),
    Handle: () => import('@/components/CustomerService/Ebay/HandleMail.vue'),
    FrTree: () => import('@/components/Public/Tree.vue'),
    Remark: () => import('@/components/CustomerService/Ebay/MailRemark.vue'),
    ModifyAfterSalesOrder : () => import('@/components/CustomerService/AfterSales/ModifyAfterSalesOrder.vue')
  }
})

export default class EbayStationMail extends Vue {
  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['EbayMsgAddFolder','EbayMsgDelFolder','EbayMsgEditFolder','EbayMsgMove','EbayMsgIgnore','EbayMsgReply','EbayMsgAddRemark','EbayMsgDelRemark','AfterSaleOrdCreat']))
    this.SetTableCols()
    this.GetFolderTree()
  }

  private GetCurHeight(T: number): string {
    if(isNaN(this.HandleIndex)){
      return ''
    }else {
      let Flag1 = this.Powers.EbayMsgMove || this.Powers.EbayMsgIgnore || this.Powers.EbayMsgAddRemark,
            ReplyFlag = this.Powers.EbayMsgReply
      if(this.MailList[this.HandleIndex].BuyerId === 'eBay'){
        /* eBay来信 */
        switch(T){
          case 1:
            return 'Height-Cut-140'
          case 2:
            return Flag1 ? 'Height-Cut-364' : 'Height-Cut-140'
          default:
            return ''
        }
      }else{
        switch(T){
          case 1:
            return 'Height-Cut-140'
          case 2:
            return ReplyFlag ? 'Height-Cut-450' : Flag1 ? 'Height-Cut-364' : 'Height-Cut-140';
          default:
            return ''
        }
      }
    }
  }

  private SetTableCols(): void {
    if(this.Powers.AfterSaleOrdCreat){
      this.HandleMailCol.push(this.ShipOrderHandleCol)
    }
    if(this.Powers.EbayMsgDelRemark){
      this.RemarkCol.push(this.RemarkHandleCol);
    }
  }

  private GetTplDrop(): void {
    if(!this.Powers.EbayMsgReply){
      return
    }
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetTemplateTypeTree,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$set(this, 'TemplateTypeDrop', Res.Data.Data)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  /* 获取账号树 */
  private GetFolderTree(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EbayMessageTreeFolder,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          (this as any).$refs.FrTree.GetExpandNodes().then((Expands: Tree.TreeNode[])=>{
            this.SetFolderTree(Res.Data.Data, Expands, this.FolderTree)
          })
          this.$set(this, 'FolderTree', []);
          
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* 设置账号树源数据 */
  private SetFolderTree(Trees: Interface.MailAccountTree[], Expands: Tree.TreeNode[], List: Tree.TreeNode[]): void {
    for(let Item of Trees){
      const Node = {
        Title: `${Item.Name}${Item.UntreatedMessageNum > 0 ? '('+Item.UntreatedMessageNum+')' : ''}`,
        Children: [],
        IsExpand: Expands.some(Exp => Exp.Id === Item.Id),
        IsActive: this.ActiveTreeNode.Id === Item.Id,
        StoreId: Item.StoreId,
        Id: Item.Id,
        IsHandle: true
      }
      List.push(Node)
      if(Item.Childs.length){
        this.SetFolderTree(Item.Childs, Expands, Node.Children);
      }
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

  private GetMailDetails(Idx: number): void {
    for(let Item of this.MailList){
      Item['Active'] = false
    }
    this.MailList[Idx].Active = true;
    this.$set(this, 'HandleMail',  new Interface.MailDetails())
    this.$set(this, 'HandleIndex', Idx)
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EbayMessageDetail,
        Login: true
      },
      Data: this.MailList[Idx].MainMessageId,
      Callback:(Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'HandleMail', Res.Data)
          this.SetHandleTableCols()
          if(!this.TemplateTypeDrop.length){
            this.GetTplDrop()
          }
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private SetHandleTableCols(): void {
    if(this.HandleMail.Remarks.length > 1){
      this.HandleMail.Remarks[0]._expanded = true
      this.RemarkCol[0].type !== 'expand' ? this.RemarkCol.unshift(this.RemarkExpandCol) : null
    }
    if(this.HandleMail.ShipOrders.length > 1){
      this.HandleMail.ShipOrders[0]._expanded = true
      this.HandleMailCol[0].type !== 'expand' ? this.HandleMailCol.unshift(this.ShipOrderExpandCol) : null
    }
  }
  

  /* 搜索列表 */
  private SearchList(IsHandle: boolean = false): void {
    this.$UI.Loading.Show()
    let PostData: Interface.SearchMailList = JSON.parse(JSON.stringify(this.SearchFilter))
    PostData.BoxId = this.ActiveTreeNode.Id ? (this.ActiveTreeNode.Id as number) : 0 
    PostData.StoreId = this.ActiveTreeNode.StoreId ? this.ActiveTreeNode.StoreId : 0
    PostData.IsProcess = PostData.IsProcess ? true : false
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EbayMessageList,
        IsLogin: true
      },
      Data: {
        PageIndex: this.Pager.PageIndex,
        PageSize: 50,
        Conditions: PostData
      },
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$set(this, 'MailList', Res.Data.PageModel.Items.map((Item: Interface.MailList, Index: number): Interface.MailList =>{ return Object.assign(Item, { Active: this.HandleIndex === Index }) }));
          // console.log(this.MailList);
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
  }
  
  /* 重置全部  GetTree：是否重新获取账号树 */
  private ResetAll(GetTree: boolean): void {
    this.$set(this, 'Pager', new PInterface.Pager())
    this.$set(this, 'MailList', [])
    this.$set(this, 'ActiveTreeNode', new Tree.TreeNode())
    this.$set(this, 'SearchFilter', new Interface.SearchMailList())
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

  /* 3-忽略  4-移动  5-添加备注  6-添加售后单 */
  private TriggerOperates(Type: number, C: string = ""): void {
    switch(Type){
      case 3:
        (this as any).$refs.Ignore.Trigger(this.MailList[this.HandleIndex].MainMessageId);
        break;
      case 4:
        (this as any).$refs.Move.Trigger(this.MailList[this.HandleIndex].MainMessageId);
        break
      case 5:
        (this as any).$refs.Remark.Trigger(this.MailList[this.HandleIndex].MainMessageId)
        break;
      case 6:
          (this as any).$refs.ModifyAfterSalesOrder.TriggerCreate(C);
          break;
    }
  }
  
  /* 删除文件夹 */
  private HandleDelete(N: Tree.TreeNode): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认执行删除文件夹操作',
      Callback: (B: boolean): void => {
        if(B){
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.CustomerService,
            Api: {
              Address: this.$Api.EbayMessageDelFolder,
              Login: true
            },
            Data: N.Id,
            Callback: (Res: PInterface.Res): void => {
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '删除成功')
                this.GetFolderTree();
              }else{
                this.$UI.Loading.Hide();
                this.$Request.Error(Res);
              }
            }
          })
        }
      }
    })
  }

  /* 删除备注 */
  private DelRemark(Id: number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EbayMessageDelRemark,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '删除成功')
          this.GetMailDetails(this.HandleIndex);
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res)
        }
      }
    })
  }

  private GetCheckboxSelected(Comp: string): void {
    (this as any).$refs[Comp].TriggerBatch(this.HandleMails);
  }

  /* 处理成功：1.重新获取树数据，2.重新获取站内信列表，3.自动打开下一个站内信进行处理 */
  private EmitHandleSuccess(): void {
    this.GetFolderTree()
    this.$set(this, 'HandleMails', []);
    if(this.ActiveTreeNode.Id){
      this.SearchList(!isNaN(this.HandleIndex))
    }
  }

  private GetExpandDatas(T: number): (Interface.MailShipOrderList | Interface.MailRemarkList)[] {
    if(T === 1){
      return (this.HandleMail.ShipOrders.length > 1 ? this.HandleMail.ShipOrders.slice(1) : [])
    }else if(T === 2){
      return (this.HandleMail.Remarks.length > 1 ? this.HandleMail.Remarks.slice(1) : [])
    }else{
      return []
    }
  }

  private Powers: PInterface.Power = {}

  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.MailStatus)
  private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.MailSearchType)
  private TemplateTypeDrop: Interface.TplTypeList[] = []

  private SearchFilter: Interface.SearchMailList = new Interface.SearchMailList()
  private Pager: PInterface.Pager = new PInterface.Pager()

  private FolderTree: Tree.TreeNode[] = []
  private ActiveTreeNode: Tree.TreeNode = new Tree.TreeNode()

  private MailList: Interface.MailList[] = []
  private HandleMails: number[] = []
  private HandleIndex: number = NaN // 正在处理的信件下标
  private HandleMail: Interface.MailDetails = new Interface.MailDetails() // 正在处理的信件详情

  private ShipOrderExpandCol: PInterface.TableCol = {
    type: 'expand', width: 40, align:'center',
    render: (h: any, Params:any): string => {
      return h('Table', {
        props: {
          columns: this.HandleMailCol.slice(1),
          data: this.GetExpandDatas(1),
          'show-header': false,
          size: 'small',
          TriggerOperates: this.TriggerOperates
        }
      })
    }
  }

  private ShipOrderHandleCol: PInterface.TableCol = {
    title: '操作',
    width: 114,
    render: (h: any, Params: any): string => {
      return h('Button', {
        props: {
          size: 'small',
          type: 'primary'
        },
        on: {
          click: () => {
            this.TriggerOperates(6, Params.row.ShipOrderCode)
          }
        }
      },'添加售后单')
    }
  }

  private HandleMailCol: PInterface.TableCol[] = [{
    title: '发货单号',
    key: 'ShipOrderCode',
    width: 120
  }, {
    title: '跟踪号',
    key: 'TrackingNumber',
    render: (h: any, Params:any): string => {
      return h('span', Params.row.TrackingNumber || '-')
    }
  }, {
    title: '目的国家',
    key: 'TargetCountry'
  }, {
    title: '付款金额',
    key: 'Amount',
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.Amount} ${Params.row.Currency}`)
    }
  }, {
    title: '状态',
    width: 100,
    render: (h: any, Params: any): string => {
      return h('span', this.$Enums.Warehouse.ShipOrderStatus[Params.row.ShipOrderStatus])
    }
  }, {
    title: '评价',
    key: 'Evaluate',
    render: (h: any, Params:any): string => {
     return h('span', Params.row.Evaluate || '-')
    }
  }, {
    title: '纠纷',
    width: 80,
    render: (h: any, Params: any): string => {
      return h('span', {
        class: Params.row.IsCase ? 'P-Text-Error' : ''
      }, Params.row.IsCase ? '是' : '否')
    }
  }]

  /* 备注的展开项 */
  private RemarkExpandCol: PInterface.TableCol = {
    type: 'expand', width: 40, align:'center', className: 'Expand',
    render: (h:any, Params: any): string => {
      return h('Table', {
        props: {
          columns: this.RemarkCol.slice(1),
          data: this.GetExpandDatas(2),
          'show-header': false,
          size: 'small',
          DelRemark: this.DelRemark
        }
      })
    }
  }

  private RemarkHandleCol: PInterface.TableCol = {
    title: '',
    width:80,
    align:'center',
    render: (h: any, Params: any): string => {
      return h('Button', {
        props: {
          size:'small',
          type: 'error'
        },
        on: {
          click: ()=>{
            this.DelRemark(Params.row.RemarkId);
          }
        }
      },'删除')
    }
  }

  private RemarkCol: PInterface.TableCol[] = [{
    title: '',
    render: (h:any, Params: any): string => {
      return h('Tooltip', {
        props: { content: `${Params.row.CustomerName}：${Params.row.Content}` },
        class: 'P-LINE-1'
      },`${Params.row.CustomerName}：${Params.row.Content}`)
    }
  }]
}
</script>

<style lang="less">
.Tree-Container{
  height: calc(100vh - 170px);
  overflow: auto;
}

.Mail-List-Container{
  height: calc(100vh - 170px);
  border-left: 1px dotted #ccc;

  & .Mail-List{
    padding: 0 10px;
    width: 100%;
    height: calc(100vh - 200px);
    overflow: auto;
    border-left: 1px dotted #ccc;

    &>.Mail-List-None{
      line-height: calc(100vh - 200px);
    }

    & li{
      list-style: none;
      padding: 10px 2px;
      border-bottom: 1px dotted #ccc;
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
  border-left: 1px dotted #ccc;
  padding: 0px 5px;

  & .Mail-Details-None{
    line-height: calc(100vh - 200px);
  }

  & .Mail-Chat{
    overflow: auto;

    & .Chat-Box{
      margin-bottom: 8px;
      border: 1px dotted #ccc;
      
      &>header{
        padding: 2px 6px;
        background: #e6e6e6;
        border-radius: 2px;

        &>p {
          line-height: 24px;
          height: 24px;

          &.Chat-Title{
            &>span {
              font-weight: 700;
            }
          } 
        }
      }

      &>content{
        display: block;
        word-break: break-word;
        padding: 8px 6px;
      }
    }

    & .ivu-table-expanded-cell{
      padding: 0px 0px 0px 41px;
    }

  }
}

.Height-Cut-170{
  height: calc(100vh - 170px);
}

.Height-Cut-140{
  height: calc(100vh - 165px);
}

.Height-Cut-450 {
  height:calc(100vh - 362px);
}

.Height-Cut-364{
  height:calc(100vh - 204px);
}

</style>