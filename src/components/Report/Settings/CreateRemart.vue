<template>
  <Row class="P-Inline-Block">
    <Modal v-model="ShowModal" title="备注" :mask-closable="false" @on-cancel="ChangeModal(false)" width="500">
      <Input v-model="UserRemarkVal" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入备注..." name="UserRemarkVal" ref="UserRemarkVal"></Input>
      <div slot="footer">
        <Button type="primary" @click="PostExport()">添加</Button>
        <Button style="margin-left: 8px" @click="ChangeModal(false)">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'CreateRemart'
})
export default class CreateRemart extends Vue {
  @Emit() ChangeModal(B: boolean): void{
    this.UserRemarkVal = ""
    this.ShowModal = false;
  }

  private TriggerModal(Data: Interface.ExportManageList): void {
    this.OpeData = Data;
    this.UserRemarkVal = this.OpeData.UserRemark;
    this.ShowModal = true;
    this.$nextTick(()=> (this.$refs.UserRemarkVal as any).focus())
  }

  // 导出
  private PostExport():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Report,
      Api: {
        Address: this.$Api.ExportAddUserRemark,
        Login: true
      },
      Data: { Id: this.OpeData.Id, UserRemark: this.UserRemarkVal },
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.ChangeModal(true)
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }

  private OpeData: Interface.ExportManageList = new Interface.ExportManageList;
  private UserRemarkVal: string = ""
  private ShowModal: boolean = false;
}

</script>
<style lang="less"></style>
