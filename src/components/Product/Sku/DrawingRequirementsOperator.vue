<!--提交美工处理 需求退回修改 审核 更换美工-->
<template>
  <Row class="P-Inline-Block" >
    <Button class="P-MB-10 P-MR-10" v-if="Powers.SubmitToDeal" type="primary" @click="OpenModal(1)">提交美工处理</Button>
    <Button class="P-MB-10 P-MR-10" v-if="Powers.BackToEdit" type="primary" @click="OpenModal(2)">需求退回修改</Button>
    <Button class="P-MB-10 P-MR-10" v-if="Powers.AuditRequire" type="primary" @click="OpenModal(3)">审核</Button>
    <Button class="P-MB-10 P-MR-10" v-if="Powers.ChangeAritist" type="primary" @click="OpenModal(4)">更换美工</Button>
    <Modal v-model="ShowModal" :title="`${['提交美工处理', '需求退回修改', '审核', '更换美工'][ModalType-1]}`" @on-cancel="ChangeMsg(false)" :mask-closable="false" :width="700">
      <Form onsubmit="return false" :label-width="100">
        <FormItem label="更换美工：" v-if="ModalType === 1 || ModalType === 4">
          <Select v-model="OperateUser" placeholder="美工" :options="DropOperateUserList" />
          <!-- <Select v-model="OperateUser" placeholder="美工" filterable clearable>
            <Option v-for="Item in DropOperateUserList" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="备注："  v-if="ModalType === 2">
          <Input v-model="Remark" placeholder="备注" type="textarea" :autosize="{minRows: 4,maxRows: 5}" ref="Remark"></Input>
        </FormItem>
        <FormItem label="审核意见：" v-if="ModalType === 3">
          <RadioGroup class="P-W-100-Percent" v-model="IsPass">
            <Radio label="1">通过</Radio>
            <Radio label="0">图片退回修改</Radio>
          </RadioGroup>
          <Input v-show="IsPass === '0'" class="P-W-100-Percent" v-model="Remark" placeholder="备注" type="textarea" :autosize="{minRows: 4,maxRows: 5}" ref="Remark"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="SubModal(ModalType)">提交</Button>
        <Button @click="ClearModal(0)">返回</Button>
      </div>
    </Modal>
  </Row>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'

@Component({
  name: 'DrawingRequirementsOperator'
})
export default class DrawingRequirementsOperator extends Vue {
  @Prop() Powers: PInterface.Power[];   // 权限

  @Prop() DropOperateUserList: PInterface.KV[];   // 美工 - 下拉

  @Emit() HandleResMsg(Type:number): void {};
  
  private Trigger(SelectedData: Interface.DrawingRequirementsList[], Type?: number): void {

    if( Type !== undefined) {
      this.ModalType = Type;
    }

    if (this.ModalType === 1 
      && ( SelectedData.length === 0 
      || SelectedData.some(Item => Item.ProcessStatus !== 1) )
    ) {
      this.$UI.Tips.Floating('warning', `请选择状态为新建的作图需求进行提交美工处理操作`);
      return;
    } else if (this.ModalType === 2
      && ( SelectedData.length === 0 
      || SelectedData.some(Item => Item.ProcessStatus !== 2) )
    ) {
      this.$UI.Tips.Floating('warning', `请选择状态为待处理的作图需求进行需求退回修改操作`);
      return;
    } else if (this.ModalType === 3
      && ( SelectedData.length === 0 
      || SelectedData.some(Item => Item.ProcessStatus !== 3) )
    ) {
      this.$UI.Tips.Floating('warning', `请选择状态为已上传的作图需求进行审核操作`);
      return;
    } else if (this.ModalType === 4
      && ( SelectedData.length === 0 
      || SelectedData.some(Item => Item.ProcessStatus !== 1 && Item.ProcessStatus !== 2) )
    ) {
      this.$UI.Tips.Floating('warning', `请选择状态为新建或待处理的作图需求进行下载更换美工操作`);
      return;
    }

    this.Selected.splice(0, this.Selected.length, ...SelectedData);

    this.ShowModal = true;
  }

  // 打开模态框
  private OpenModal(Type: number): void {
    this.ModalType = Type;
    this.HandleResMsg(2)
  }

  // 关闭模态框
  private ClearModal(Type: number): void {
    this.ShowModal = false;
    this.ModalType = 0;
    this.IsPass = "1";
    this.OperateUser = "";
    this.Remark = ""; 
    this.Selected.splice(0)
    this.HandleResMsg(Type);
  }

  // 提交模态框
  private SubModal(Type: number): void {

    if ((Type === 1 || Type === 4) && this.OperateUser === "") {
      this.$UI.Tips.Floating('warning', `请选择美工`);
      return;
    }

    let PostData: any = 
      Type === 4 
      ? {
        Id: this.Selected.map(Item => Item.Id),
        OperateUserId: this.OperateUser
      } : {
        PhotoProcessRequestIds: this.Selected.map(Item => Item.Id),
        ChangeArtistId: this.OperateUser,
        IsPass: this.IsPass === "1" ? true : false,
        Remark: this.IsPass === "1" ? "" : this.Remark ,
        File: ""
      } 

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: [this.$Api.ToArtistProcess, this.$Api.DemandReturn, this.$Api.AuditDrawRequset, this.$Api.ChangeArtist][Type - 1],
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${["提交美工处理", "需求退回修改", "审核", "更换美工"][Type-1]}成功`);
          this.ClearModal(1)
				} else {
					this.$Request.Error(Res);
				}
			}
    });
  }

  private ModalType: number = 0; // 模态框类型
  private IsPass: string = "1"; // 单选按钮 审核意见
  private OperateUser: number | "" = ""; // 美工
  private Remark: string = ""; // 备注

  private Selected: Interface.DrawingRequirementsList[] = [] ;// 选中数据

  private Type: number = 0
  private ShowModal: boolean = false;
}
</script>