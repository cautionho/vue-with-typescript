
<!-- 添加、编辑站内信文件夹 -->
<template>
  <div class="P-Inline-Block">
    <Button type="primary" @click="Trigger(0)" v-if="IsCreate">添加文件夹</Button>
    <Modal v-model="ModifyModal" :title="IsModify ? '编辑文件夹' : '添加文件夹'" @on-cancel="CancelModal">
      <Form :model="ModifyFolderForm" ref="ModifyFolderForm" :rules="ModifyFolderRules" :label-width="100" onsubmit="return false;">
        <FormItem label="所属账号：" prop="StoreId">
          <Select placeholder="所属账号" v-model="ModifyFolderForm.StoreId" :options="StoreDrop" />
          <!-- <Select placeholder="所属账号" filterable clearable v-model="ModifyFolderForm.StoreId">
            <Option v-for="(Item, Index) in StoreDrop" :key="Index" :value="Item.Value">{{Item.Key}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="文件夹名称：" prop="FolderName">
          <Input placeholder="文件夹名称" ref="FolderNameIpt" v-model="ModifyFolderForm.FolderName"></Input>
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
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import Tree from '@/assets/Interface/Tree';


@Component({
  name: 'ModifyMailFolder'
})

export default class ModifyMailFolder extends Vue {
  @Prop(Boolean) private IsCreate: boolean
  @Emit() EmitHandleSuccess(): void {}

  private Trigger(D?: Tree.TreeNode): void {
    if(!this.StoreDrop.length){
      this.GetStoreDrop()
    }
    if(D){
      this.$set(this, 'ModifyFolderForm', new Interface.MailFolder(D.StoreId, D.Title, (D.Id as number)))
      this.$set(this, 'IsModify', true);
    }
    this.$set(this, 'ModifyModal', true);
    this.$nextTick(()=>{
      (this as any).$refs.FolderNameIpt.focus();
    })
  }

  private GetStoreDrop(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales["1"].StoreDrop
      },
      Data:"",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.StoreDrop.push(...Res.Data.DropList);
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Validate(): void {
    (this as any).$refs.ModifyFolderForm.validate((Valid: boolean):void => {
      if(Valid){
        this.PostModifyFolder()
      }else {
        (this as any).$refs.FolderNameIpt.focus();
      }
    })
  }

  private PostModifyFolder(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.IsModify ? this.$Api.EbayMessageEditFolder : this.$Api.EbayMessageAddFolder,
        Login: true,
      },
      Data: this.ModifyFolderForm,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', this.IsModify ? '修改成功' : '添加成功')
          this.CancelModal()
          this.EmitHandleSuccess()
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'ModifyFolderForm', new Interface.MailFolder());
    this.$set(this, 'ModifyModal', false)
    this.$set(this, 'IsModify', false);
    this.$nextTick(()=>{
      (this as any).$refs.ModifyFolderForm.resetFields();
    })
  }

  private ModifyModal: boolean = false
  private IsModify: boolean = false
  private StoreDrop: PInterface.KV[] = []

  private ModifyFolderForm: Interface.MailFolder = new Interface.MailFolder()
  private ModifyFolderRules: any = {
    FolderName: [{required: true, message:'请输入文件夹名称'}]
  }
}

</script>