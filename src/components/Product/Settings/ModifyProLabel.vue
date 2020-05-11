<template>
	<div class="P-Inline-Block ">
    <Col>
      <Button class="P-MR-10" type="primary" v-if="Power" @click="TriggerModal">添加特性标签</Button>
      <Modal v-model="IsShowModal" :title="LabelMsg.Id==0?'添加特性标签':'编辑特性标签'" @on-cancel="HandleLabelMsg(false)" :mask-closable="false" :width="500">
        <Form onsubmit="return false" ref="LabelMsg" :model="LabelMsg" :rules="Rules" :label-width="110">
          <Form-item label="特性标签" prop="Name">
            <Input v-model="LabelMsg.Name" placeholder="请输入特性标签" ref="Name"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="ValidateLabel">提交</Button>
          <Button @click="HandleLabelMsg(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'ModifyProLabel'
})
export default class ModifyProLabel extends Vue {
  @Prop() Power: boolean
  
  @Emit() HandleLabelMsg(Res: boolean): void {
    this.$set(this, 'IsShowModal', false);
    (this.$refs["LabelMsg"] as any).resetFields();
  }

  private TriggerModal(SelectedData: Interface.ProLabelList[]){
    this.$set(this, 'LabelMsg', SelectedData.length ? SelectedData[0] : new Interface.ProLabelList());
    this.$set(this,'IsShowModal', true);
    this.$nextTick(() => { 
      (this.$refs["Name"] as any).focus() 
    });
  }

  private ValidateLabel(){
    (this.$refs["LabelMsg"] as any).validate((Valid: boolean) => {
      if (Valid) {
      	this.PostAddOrEdit();
      }
    })
  }

  private PostAddOrEdit():void{
    let LabelMsg = JSON.parse(JSON.stringify(this.LabelMsg));
    LabelMsg["OperatorId"] = JSON.parse(this.$Cookie.Get('frler_user')).UserId;
    LabelMsg["Operator"] = JSON.parse(this.$Cookie.Get('frler_user')).UserName;
    LabelMsg["OperateTime"] = new Date().toLocaleDateString();

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: LabelMsg.Id === 0 ? this.$Api.AttributeCreate : this.$Api.AttributeModify,
				Login: true
			},
			Data: LabelMsg,
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${LabelMsg.Id === 0 ? '添加特性标签成功' : '编辑特性标签成功'}`);
          this.HandleLabelMsg(true)
				} else {
          this.$Request.Error(Res);
				  this.$UI.Loading.Hide();
          this.$nextTick(() => { (this.$refs["Name"] as any).focus() })
				}
			}
		})
  }

  private Rules: any = {
    Name: [{ required: true, message: '请输入特性标签' }]
  }

  private IsShowModal: boolean = false
  private LabelMsg: Interface.ProLabelList = new Interface.ProLabelList()
}

</script>
<style lang="less"></style>
