<!-- 移动站内信 -->
<template>
  <div class="P-Inline-Block">
    <Button type="primary" @click="Trigger(0)">移动</Button>
    <Modal v-model="MoveModal" title="移动站内信" :width="600" @on-cancel="CancelModal">
      <Form :model="MoveForm" ref="MoveForm" :rules="MoveRules" :label-width="80" onsubmit="return false;">
        <FormItem label="文件夹" prop="BoxIds">
          <Cascader placeholder="文件夹" :data="Tree" v-model="MoveForm.BoxIds"></Cascader>
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import Tree from '@/assets/Interface/Tree';

@Component({
  name: 'MoveMail'
})

export default class MoveMail extends Vue {
  @Prop(Array) private FolderTree: Tree.TreeNode[]
  @Emit() GetSelected(Comp: string): void {}
  @Emit() EmitHandleSuccess(): void {}

  @Watch('FolderTree')
  WatchFolder(Val: Tree.TreeNode[]): void{
    this.$set(this, 'Tree', []);
    this.SetCascaderTree(JSON.parse(JSON.stringify(Val)), this.Tree);
  }

  private SetCascaderTree(List: Tree.TreeNode[], Tree: PInterface.Cascader[]): void {
    for(let Item of List){
      let N: PInterface.Cascader = new PInterface.Cascader();
      N['label'] = Item.Title.split('(')[0]
      N['value'] = Item.Id
      N['children'] = []
      Tree.push(N);
      if(Item.Children.length){
        this.SetCascaderTree(Item.Children, N.children)
      }
    }
  }

  private Trigger(Id?:number): void {
    if(Id){
      // 单个移动
      this.TriggerBatch([Id])
    }else{
      // 批量删除
      this.GetSelected('Move')
    }
  }

  private TriggerBatch(Data: number[]): void {
    if(!Data.length){
      this.$UI.Tips.Floating('warning', '请选择站内信进行操作')
      return
    }
    this.$set(this, 'MainMessageId', Data);
    this.$set(this, 'MoveModal', true)
  }

  private Validate(): void {
    (this as any).$refs.MoveForm.validate((Valid: boolean) => {
      if(Valid) {
        const PostData: Interface.MoveMail = {
          BoxId: JSON.parse(JSON.stringify(this.MoveForm.BoxIds)).pop(),
          MainMessageId: this.MainMessageId
        }

        this.$UI.Loading.Show()
        this.$Request.Post({
          Server: this.$Server.CustomerService,
          Api: {
            Address: this.$Api.EbayMessageMove,
            Login: true
          },
          Data: PostData,
          Callback: (Res: PInterface.Res): void => {
            if(Res.IsSuccess){
              this.$UI.Tips.Floating('success','移动成功')
              this.EmitHandleSuccess()
              this.CancelModal();
            }else{
              this.$UI.Loading.Hide()
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'MoveModal', false);
    this.$nextTick(()=>{
      (this as any).$refs.MoveForm.resetFields();
    })
  }

  private MoveModal: boolean = false
  private MoveForm: {BoxIds: string[]|number[]} = {
    BoxIds: []
  }
  private MoveRules: any = {
    BoxIds: [{required: true, message:'请选择文件夹', trigger:'change', type: 'array'}]
  }

  private Tree: PInterface.Cascader[] = []
  private MainMessageId: number[] = []
}
</script>