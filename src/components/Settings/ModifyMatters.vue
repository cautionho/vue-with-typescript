<template>
  <div class="P-Inline-Block">
    <Col>
      <Button class="P-MR-10 P-MB-10" type="primary" v-if="Power" @click="TriggerModal">添加事项</Button>
      <Modal v-model="MattersModal" :title="BackLogMsg.Id==0?'添加事项':'编辑事项'" @on-cancel="HandleResMsg(false)" :mask-closable="false" :width="500">
        <Form onsubmit="return false" ref="BackLogMsg" :model="BackLogMsg" :rules="MattersRule" :label-width="110">
          <Form-item label="所属类目：" prop="CategoryId">
            <Select v-model="BackLogMsg.CategoryId" placeholder="所属类目" :options="TreeList" optionValKey="Id" optionKey="CategoryName" /> 
            <!-- <Select v-model="BackLogMsg.CategoryId" placeholder="所属类目" filterable clearable>
              <Option v-for="(item,index) in TreeList" :value="item.Id" :key="index">{{item.CategoryName}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="事项名称：" prop="ItemName">
            <Input v-model="BackLogMsg.ItemName" placeholder="事项名称" ref="ItemName"></Input>
          </Form-item>
          <Form-item label="跳转链接：" prop="HrefUrl">
            <Input v-model="BackLogMsg.HrefUrl" placeholder="跳转链接"></Input>
          </Form-item>
          <Form-item label="请求API：" prop="RequestUrl">
            <Input v-model="BackLogMsg.RequestUrl" placeholder="请求API"></Input>
          </Form-item>
          <Form-item label="事项单位：" prop="Unit">
            <Input v-model="BackLogMsg.Unit" placeholder="事项单位"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="ValidatePostMatter">提交</Button>
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
  name: 'ModifyMatters'
})
export default class ModifyMatters extends Vue {
  @Prop() TreeList: Interface.ToDoTree[]
  @Prop() Power: boolean
  

  @Emit() HandleResMsg(Res: boolean): void {
    this.$set(this, 'MattersModal', false);
    this.BackLogMsg = new Interface.BackLog();
    (this.$refs["BackLogMsg"] as any).resetFields();
  }

  private TriggerModal(SelectData: Interface.BackLog[]){
    if(SelectData.length){
      this.BackLogMsg = SelectData[0]
    }
    this.$set(this,'MattersModal', true);
    this.$nextTick(function() {
      (this.$refs["ItemName"] as any).focus();
    })
  }

  private ValidatePostMatter():void {
    (this.$refs["BackLogMsg"] as any).validate((valid: boolean) => {
      if (valid) {
      	this.PostBackLogMsg();
      }
    })
  }

  private PostBackLogMsg():void {
    this.$UI.Loading.Show();
     this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.BackLogMsg.Id === 0 ? this.$Api.ToDoCreateItem : this.$Api.ToDoModifyItem,
				Login: true
			},
			Data: this.BackLogMsg,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${this.BackLogMsg.Id === 0 ? '添加事项成功' : '编辑事项成功'}`);
          this.HandleResMsg(true)
				} else {
          this.$Request.Error(Res);
          this.$nextTick(function() {
            (this.$refs["ItemName"] as any).focus();
          })
				  this.$UI.Loading.Hide();
				}
			}
		})
  }
  
  private MattersModal:boolean = false;
  private BackLogMsg: Interface.BackLog = new Interface.BackLog();
  private MattersRule: any = {
    CategoryId: [{ type: 'number', required: true, message: '请选择所属类目', trigger: 'change' }],
    ItemName: [{ required: true, message: '请输入事项名称' }],
    HrefUrl: [{ required: true, message: '请输入跳转链接' }],
    RequestUrl: [{ required: true, message: '请输入请求API' }],
    Unit: [{ required: true, message: '请输入事项单位' }],
  }
}

</script>
<style lang="less"></style>
