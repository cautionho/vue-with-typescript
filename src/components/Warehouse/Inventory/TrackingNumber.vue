<!--调拨箱列表 -> 录入跟踪信息 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="TriggerModal" class="P-MR-10 P-MB-10">录入跟踪信息</Button>
    <Modal title="录入跟踪信息" v-model="TrackingModal" :mask-closable="false" width="450" @on-cancel="ClearModal(false)">
      <Form onsubmit="return false" :model="TrackingMsg" ref="TrackingMsg" :rules="TrackingMsgRules" :label-width="100" name="TrackingMsg">
          <Form-item label="物流公司：" prop="LogisticsCmp">
            <Select v-model="TrackingMsg.LogisticsCmp" class="P-W-100-Percent" placeholder="请选择物流公司" :options="LogisticsDrop" optionValKey="Key" />
            <!-- <Select transfer clearable filterable v-model="TrackingMsg.LogisticsCmp" class="P-W-100-Percent" placeholder="请选择物流公司">
              <Option v-for="(Item,Index) in LogisticsDrop" :value="Item" :key="Index">{{Item}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="快递单号：" prop="TrackingNumber">
            <Input v-model="TrackingMsg.TrackingNumber" placeholder="请输入快递单号" ref="TrackingNumber"></Input>
          </Form-item>
        </Form>
        <footer slot="footer">
          <Button type="primary" @click="Validate()">录入</Button>
          <Button @click="ClearModal(false)">取消</Button>
        </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
@Component({
  name: 'TrackingNumber'
})
export default class TrackingNumber extends Vue {
  @Prop() SelectData:Interface.TransferBoxList[]

  @Emit() ClearModal(Val: boolean): void{
    this.TrackingModal = false;
    (this.$refs["TrackingMsg"] as any).resetFields();
    
  }

  private TriggerModal(): void{
    if(this.SelectData.length < 1){
      this.$UI.Tips.Floating('warning', '请先选择列表上的调拨箱再进行操作');
    }else{
      this.TrackingModal = true;
    }
    
    this.$nextTick( () => {
      (this.$refs["TrackingNumber"] as any).focus();
    })
  }

  private Validate():void{
    (this.$refs["TrackingMsg"] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.$UI.Loading.Show();
        this.TrackingMsg.Id = this.SelectData.map(Item=>Item.Id);
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.InBoxInputTrackingNumber,
            Login: true
          },
          Data: this.TrackingMsg,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating('success', '录入跟踪信息成功')
              this.ClearModal(true)
            } else {
              this.$Request.Error(Res);
              this.$UI.Loading.Hide();
            }
          }
        })
      }
    })
  }

  private TrackingMsgRules: any = {
    LogisticsCmp: [{ required: true, message: '请选择物流公司', trigger: 'change', type: 'string' }],
    TrackingNumber: [{ required: true, message: '请输入费用' }],
  }

  private LogisticsDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.LogisticsCmpList);
  private TrackingMsg = new Interface.TrackingInfo()
  private TrackingModal: boolean = false;
}

</script>
<style lang="less"></style>
