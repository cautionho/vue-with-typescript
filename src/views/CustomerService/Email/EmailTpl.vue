<template>
  <Row>
    <Col span="3" class="Type-Tree P-PR-10">
      <FrTree ref="FrTree" :Data="FolderTree" :ClickFn="TriggerFolderTree" :TreeNodeFunc="HandleFolderTreeNode"></FrTree>
    </Col>
    <Col span="21" class="P-Search-Group">
      <Form inline ref="SearchFilter" v-model="SearchFilter" onsubmit="return false;">
        <FormItem class="P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-300" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
      </Form>
    </Col>
    <Col span="21">
      <Button type="primary" v-if="Powers.EmailTempTypeCreate" @click="TriggerOperates(1)" class="P-MB-10" >添加模板类型</Button>
      <Button type="primary" v-if="Powers.EmailTempCreate" @click="TriggerOperates(3)" class="P-ML-10 P-MB-10">添加模板</Button>
      <Button type="error" v-if="Powers.EmailTempDel" @click="TriggerOperates(6)" class="P-ML-10 P-MB-10">删除模板</Button>
      <ModifyMailTpl ref="ModifyMailTpl" :TplTypeDrop="FolderTree" @emit-get-tpl-type="GetTplType" @emit-get-list="GetList" v-if="[Powers.EmailTempTypeCreate, Powers.EmailTempTypeModify, Powers.EmailTempCreate, Powers.EmailTempModify].includes(true)"></ModifyMailTpl>
    </Col>
    <Col span="21">
      <Table ref="List" class="P-MB-10" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()"></Table>
    </Col>
    <Col span="21">
      <Page :total="Pager.TotalItems" :current="Pager.PageIndex" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'
import Tree from '@/assets/Interface/Tree'

@Component({
  name: 'EmailTpl',
  components: {
    FrTree: () => import('@/components/Public/Tree.vue'),
    ModifyMailTpl: () => import('@/components/CustomerService/Mail/ModifyMailTpl.vue')
  }
})

export default class EmailTpl extends Vue {
  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['EmailTempTypeCreate', 'EmailTempTypeModify', 'EmailTempCreate', 'EmailTempModify', 'EmailTempTypeDel', 'EmailTempDel']))
    this.GetTplType(true)
  }

  private CalculateHeight(): number {
    return this.$UI.FullHeight() - ([this.Powers.EmailTempTypeCreate, this.Powers.EmailTempCreate, this.Powers.EmailTempDel].includes(true) ? 250 : 210)
  }

  private GetTplType(IsList: boolean = false): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetEmailTemplateTypeDrop,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$set(this, 'FolderTree', [])
          for(let Item of Res.Data.Data){
            this.FolderTree.push({
              Id: Item.TypeId,
              Title: Item.TypeName,
              Children: [],
              IsExpand: false,
              IsActive: this.SearchFilter.TypeId === Item.TypeId,
              IsHandle: true
            })
          }
          if(IsList){
            this.GetList()
          }else{
            this.$UI.Loading.Hide()
          }
        }else{
          this.$UI.Loafing.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private RenderOperates(h:any, Params: any): string {
    return h('div', [
      h('Button', {
        props: { type: 'primary', size: 'small' },
        on: { click: () => { (this as any).$refs.List.selectAll(false); this.TriggerOperates(4, Params.row) } }
      }, '编辑'),
      h('Button', {
        props: { type: 'error', size: 'small' },
        on: { click: () => { (this as any).$refs.List.selectAll(false); this.TriggerOperates(6, Params.row) } },
        class: 'P-ML-5'
      }, '删除')
    ])
  }

  private GetList(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetEmailTemplateList,
        Login: true
      },
      Data: {
        PageIndex: this.Pager.PageIndex,
        PageSize: this.Pager.PageSize,
        Conditions: this.SearchFilter
      },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this.Pager, 'TotalItems', Res.Data.PageModel.TotalItems)
          this.$set(this, 'List', Res.Data.PageModel.Items)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private ChangePage(P: number): void {
    this.$set(this.Pager, 'PageIndex', P)
    this.GetList()
  }

  private ChangePageSize(N: number): void {
    this.$set(this.Pager, 'PageSize', N)
    this.GetList()
  }

  private SearchList(): void {
    this.ChangePage(1)
  }

  private ResetList(): void {
    this.$set(this, 'Pager', new PInterface.Pager())
    this.$set(this, 'SearchFilter', new Interface.SearchEmailTpl())
    this.GetTplType(true);
  }
  

  private TriggerFolderTree(Node: Tree.TreeNode): void {
    this.$set(this.SearchFilter, 'TypeId', this.SearchFilter.TypeId === Node.Id ? 0 : Node.Id)
    this.SearchList()
  }

  /* 点击树节点编辑/删除 */
  private HandleFolderTreeNode(Type: string, Node: Tree.TreeNode): void {
    if(Type === 'delete'){
      this.TriggerOperates(5, Node)
    }else{
      this.TriggerOperates(2, Node)
    }
  }

  /* T: 1-添加模板类型 2-编辑模板类型 3-添加模板 4-编辑模板 5-删除模板类型 6-删除模板 */
  private TriggerOperates(T: number, D?: Tree.TreeNode | Interface.EmailTpl): void {
    if(T < 5){
      (this as any).$refs.ModifyMailTpl.Trigger(T, D);
    }else{
      T === 5 ? this.ConfirmDeleteTplType(D as Tree.TreeNode) : this.ConfirmDelTpl(D ? [D as Interface.EmailTpl] : (this as any).$refs.List.getSelection())
    }
    
  }

  /* 确认删除模板类型 */
  private ConfirmDeleteTplType(Node: Tree.TreeNode): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否确认执行删除模板类型[${Node.Title}]`,
      Callback: (B: boolean): void => {
        if(B){
          this.PostDelTplType(Node.Id as number)
        }
      }
    })
  }

  private PostDelTplType(Id: number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EmailTemplateTypeDel,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '删除模板类型成功')
          this.GetTplType(false)
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* 确认删除模板 */
  private ConfirmDelTpl(D: Interface.EmailTpl[]): void {
    if(!D.length){
      this.$UI.Tips.Floating('warning', '请选择模板进行删除操作')
      return
    }
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否确认执行删除模板`,
      Callback: (B: boolean): void => {
        if(B){
          this.PostDelTpl(D.map(Item => Item.Id))
        }
      }
    })
  }

  private PostDelTpl(Id: number[]): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EmailTemplateDel,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '删除模板成功')
          this.GetList()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Powers: PInterface.Power = {}
  private SearchFilter: Interface.SearchEmailTpl = new Interface.SearchEmailTpl()
  private Pager: PInterface.Pager = new PInterface.Pager()
  private FolderTree: Tree.TreeNode[] = []
  private List: Interface.EmailTpl[] = []

  private Cols: PInterface.TableCol[] = [{
    type: 'selection', width: 60, align: 'center'
  }, {
    title: '编号',
    key: 'Id'
  }, {
    title: '标题',
    key: 'Title'
  }, {
    title: '类型',
    key: 'TypeName'
  }, {
    title: '创建人',
    key: 'CreateUser'
  }, {
    title: '添加时间',
    render: (h: any, Params:any): string => {
      return h('span', this.$UI.Render.Date(Params.row.Created, true))
    }
  }, {
    title: '操作',
    width: 126,
    render: this.RenderOperates
  }]
  
}
</script>
<style lang="less" scoped>
.Type-Tree{
  height: calc(100vh - 125px);
  overflow: auto;
}
</style>