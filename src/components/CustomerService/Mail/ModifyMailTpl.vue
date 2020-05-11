<template>
  <Modal v-model="MailTplModal" :title="ModalTitle" :width="800" @on-cancel="CancelModal">
    <Form :model="MailTplTypeInfo" ref="MailTplTypeInfo" :label-width="90" onsubmit="return false" v-if="[1,2].includes(Type)">
      <FormItem label="模板类型：" prop="TemplateName" :rules="{required: true, message: '请输入模板类型名称'}">
        <Input ref="TypeIpt" placeholder="模板类型名称" v-model="MailTplTypeInfo.TemplateName"></Input>
      </FormItem>
    </Form>
    <Form :model="MailTplInfo" ref="MailTplInfo" :label-width="90" onsubmit="return false" v-if="[3,4].includes(Type)">
      <FormItem label="标题：" prop="Title" :rules="{required: true, message: '请输入标题'}">
        <Input ref="TplIpt" placeholder="请输入标题" v-model="MailTplInfo.Title"></Input>
      </FormItem>
      <FormItem label="模板类型：" prop="TypeId" :rules="{required: true, message: '请选择模板类型', pattern: $Pattern.PositiveNotZero, trigger: 'change'}">
        <Select placeholder="请选择模板类型" v-model="MailTplInfo.TypeId" :option="TplTypeDrop" />
        <!-- <Select placeholder="请选择模板类型" v-model="MailTplInfo.TypeId" clearable filterable>
          <Option v-for="(Item, Index) in TplTypeDrop" :key="Index" :value="Item.Id">{{Item.Title}}</Option>
        </Select> -->
      </FormItem>
      <FormItem label="模板内容" prop="Content" :rules="{required: true, message: '请输入模板内容'}">
        <Input placeholder="请输入模板内容" type="textarea" v-model="MailTplInfo.Content" :autosize="{maxRows: 8, minRows: 8}"></Input>
      </FormItem>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'
import Tree from '@/assets/Interface/Tree'

@Component({
  name: 'ModifyMailTpl'
})

export default class ModifyMailTpl extends Vue {
  @Prop(Array) private TplTypeDrop: Tree.TreeNode[]
  @Emit() private EmitGetTplType(): void {}
  @Emit() private EmitGetList(): void {}

  // T: 1-添加模板类型  2-编辑模板类型  3-添加模板  4-编辑模板
  private Trigger(T: number, D?: Tree.TreeNode | Interface.EmailTpl): void {
    this.$set(this, 'ModalTitle', T === 1 ? '添加模板类型' : T === 2 ? '编辑模板类型' : T === 3 ? '添加模板' : '编辑模板');
    this.$set(this, 'Type', T);
    if(T < 3){
      const TplType: Tree.TreeNode = (D as Tree.TreeNode) || new Tree.TreeNode()
      this.MailTplTypeInfo = new Interface.MailTplTypeInfo(TplType.Id as number, TplType.Title)
    }else {
      const Tpl: Interface.EmailTpl = (D as Interface.EmailTpl) || new Interface.EmailTpl()
      this.MailTplInfo = new Interface.MailTplInfo(Tpl.Title, Tpl.TypeId, Tpl.Content, Tpl.Id)
    }
    this.$set(this, 'MailTplModal', true)
    this.$nextTick(() => {
      (this as any).$refs[T < 3 ? 'TypeIpt' : 'TplIpt'].focus();
    })
  }

  private Validate(): void {
    (this as any).$refs[this.Type < 3 ? 'MailTplTypeInfo' : 'MailTplInfo'].validate((Valid: boolean): void => {
      if(Valid){
        this.Type < 3 ? this.PostTplType() : this.PostTpl()
      }
    })
  }

  private PostTplType(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.Type === 1 ? this.$Api.EmailTemplateTypeAdd : this.$Api.EmailTemplateTypeEdit,
        Login: true
      },
      Data: this.Type === 1 ? this.MailTplTypeInfo.TemplateName : this.MailTplTypeInfo,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', this.Type === 1 ? '添加成功' : '修改成功')
          this.CancelModal()
          this.EmitGetTplType()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private PostTpl(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.Type === 3 ? this.$Api.EmailTemplateAdd : this.$Api.EmailTemplateEdit,
        Login: true
      },
      Data: this.MailTplInfo,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', this.Type === 3 ? '添加成功' : '修改成功')
          this.CancelModal()
          this.EmitGetList()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'MailTplModal', false)
    this.$set(this, 'ModalTitle', '')
    this.$nextTick(()=>{
      (this as any).$refs[this.Type < 3 ? 'MailTplTypeInfo' : 'MailTplInfo'].resetFields();
      this.$set(this, 'Type', 0);
    })
  }

  private MailTplModal: boolean = false
  private ModalTitle: string = ''
  private Type: number = 0

  private MailTplTypeInfo: Interface.MailTplTypeInfo = new Interface.MailTplTypeInfo()
  private MailTplInfo: Interface.MailTplInfo = new Interface.MailTplInfo()
}
</script>
<style lang="less" scoped>

</style>