<template>
  <div class="P-Inline-Block">
    <Col>
      <Button class="P-MR-10 P-MB-10" type="primary" v-if="Power" @click="TriggerModal">添加类目</Button>
      <Modal v-model="IsShowModal" :title="CategoryMsg.Id==0?'添加类目':'编辑类目'" @on-cancel="HandleResMsg(false)" :mask-closable="false" :width="500">
        <Form onsubmit="return false" ref="CategoryMsg" :model="CategoryMsg" :rules="CategoryRule" :label-width="110">
          <Form-item label="类目名称：" prop="CategoryName">
            <Input v-model="CategoryMsg.CategoryName" placeholder="类目名称" ref="CategoryName"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="ValidatePostCatrgory">提交</Button>
          <Button @click="HandleResMsg(false)">取消</Button>
        </div>
      </Modal>
    </col> 
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import Interface from '../../assets/Interface/Setting'
import PInterface from '../../assets/Interface/Public'
@Component({
  name: 'ModifyCategory'
})
export default class ModifyCategory extends Vue {
  @Prop() Power: boolean

  @Emit() HandleResMsg(Res: boolean): void {
    this.$set(this, 'IsShowModal', false);
    this.CategoryMsg = new Interface.CategoryMsg();
    (this.$refs["CategoryMsg"] as any).resetFields();
  }

  private TriggerModal(SelectData:Interface.CategoryMsg[]): void{
    if(SelectData.length){
      this.CategoryMsg = SelectData[0]
    }
    this.$set(this,'IsShowModal', true);
    this.$nextTick(function() {
      (this.$refs["CategoryName"] as any).focus();
    })
  }

  private CreateCategory():void {
    this.HandleResMsg(false);
  }

  private ValidatePostCatrgory():void {
    (this.$refs["CategoryMsg"] as any).validate((valid: boolean) => {
      if (valid) {
      	this.PostCategoryMsg();
      }
    })
  }

  private PostCategoryMsg():void {
    this.$UI.Loading.Show();
     this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.CategoryMsg.Id === 0 ? this.$Api.ToDoCreate : this.$Api.ToDoModify,
				Login: true
			},
			Data: this.CategoryMsg,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${this.CategoryMsg.Id === 0 ? '添加类目成功' : '编辑类目成功'}`);
          this.HandleResMsg(true);

				} else {
          this.$Request.Error(Res);
          this.$nextTick(function() {
            (this.$refs["CategoryName"] as any).focus();
          })
				  this.$UI.Loading.Hide();
				}
			}
		})
  }
  
  private IsShowModal:boolean = false;
  private CategoryMsg: Interface.CategoryMsg = new Interface.CategoryMsg();
  private CategoryRule: any = {
    CategoryName: [{ required: true, message: '请输入类目名称' }],
  }
}

</script>
<style lang="less"></style>
