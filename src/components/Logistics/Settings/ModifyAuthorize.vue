
<template>
<Row class="P-Inline-Block">
	<Col>
  <Button type="primary" @click="TriggerModal" class="P-MB-10 P-MR-5" v-if="Power">添加账号</Button>
  <Modal :title="(InfoMsg.Id !== 0?'修改':'添加')+'账号'" v-model="IsShowModal" :mask-closable="false" @on-cancel="HandleRes(false)" :width="550">
    <Form onsubmit="return false" ref="InfoMsg" :model="InfoMsg" :rules="Rules" :label-width="85">
      <Form-item label="账号：" prop="AccountName">
        <Input v-model="InfoMsg.AccountName" placeholder="请输入账号" ref="AccountName"></Input>
      </Form-item>
      <Form-item label="别名：" prop="Alias">
        <Input v-model="InfoMsg.Alias" placeholder="请输入别名"></Input>
      </Form-item>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="PostMsg">提交</Button>
      <Button @click="HandleRes(false)">取消</Button>
    </footer>
  </Modal>
  </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import SInterface from "@/assets/Interface/Sales";
import Interface from "@/assets/Interface/Logistics";
@Component({
  name: 'ModifyAuthorize'
})
export default class ModifyAuthorize extends Vue {
  @Prop() UseApi: string
  @Prop() Power: boolean

  @Emit() HandleRes(Type: boolean): void {
    this.IsShowModal = false;
    this.$nextTick(()=>{ (this.$refs['InfoMsg'] as any).resetFields()})
  }
  
  // 打开模态框
  private TriggerModal(SelectedData: SInterface.StoreList[]):void {
    if(SelectedData.length){ //添加
      this.InfoMsg.Id = SelectedData[0].Id;
      this.InfoMsg.AccountName = SelectedData[0].AccountName as string;
      this.InfoMsg.Alias = SelectedData[0].Alias;
    }else{
      this.InfoMsg = new Interface.AuthorizeData();
    }
    this.$set(this,'IsShowModal', true);
    this.$nextTick(()=>{ (this.$refs.AccountName as any).focus() })
  }

  private PostMsg(): void{
    (this.$refs['InfoMsg'] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Logistics,
          Api: {
            Address: this.InfoMsg.Id !== 0 ? this.$Api[`${this.UseApi}Modify`] : this.$Api[`${this.UseApi}Create`],
            Login: true
          },
          Data: this.InfoMsg,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating('success', `${ this.InfoMsg.Id !== 0 ? '编辑' : '添加' }账号成功`)
              window.open(Res.Data.Url, '_blank');
              this.HandleRes(true)
            } else {
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }
  private IsShowModal: boolean = false;
  private InfoMsg: Interface.AuthorizeData = new Interface.AuthorizeData();
  private Rules:any = {
    AccountName: [{ required: true, message: '请输入账号' }],
    Alias: [{ required: true, message: '请输入别名' }],
  }
}

</script>
<style lang="less"></style>
