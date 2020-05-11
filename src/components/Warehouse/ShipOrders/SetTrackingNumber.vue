<template>
  <Col>
    <Button type="primary" @click="Trigger">录入跟踪号</Button>
     <Modal v-model="TrackingNumeberModal" title="录入跟踪号" @on-cancel="CancelModal">
       <Form :model="TrackingNumberInfo" ref="TrackingNumberInfo" :rules="TrackingNumberRules" :label-width="90" onsubmit="return false;">
          <FormItem label="发货单号：" prop="OrderCode">
            <Input placeholder="发货单号" v-model="TrackingNumberInfo.OrderCode" ref="OrderCodeIpt" @on-enter="Validate"></Input>
          </FormItem>
          <FormItem label="跟踪号：" prop="TrackCode">
            <Input placeholder="跟踪号" v-model="TrackingNumberInfo.TrackCode" ref="TrackCodeIpt" @on-enter="Validate"></Input>
          </FormItem>
        </Form>
       <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
     </Modal>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "SetTrackNumber"
})

export default class SetTrackNumber extends Vue {
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void {
    this.$set(this, 'TrackingNumeberModal', true);
    this.ResetForm();
  }

  private Validate():void {
    if(!this.TrackingNumberInfo.OrderCode){
      (this as any).$refs.OrderCodeIpt.focus();
    }else if(!this.TrackingNumberInfo.TrackCode){
      (this as any).$refs.TrackCodeIpt.focus();
    }
    (this as any).$refs.TrackingNumberInfo.validate((Valid:boolean) => {
      if(Valid){
        this.$UI.Loading.Show()
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.SetTrackNumberByCode,
            Login: true
          },
          Data: this.TrackingNumberInfo,
          Callback: (Res:PInterface.Res):void => {
            this.$UI.Loading.Hide();
            if(Res.IsSuccess){
              this.$set(this,'Success',true);
              this.$UI.Tips.Floating('success','录入跟踪号成功');
              this.ResetForm();
            }else{
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private ResetForm():void {
    this.$set(this, 'TrackingNumberInfo', new Interface.SetTrackingNumber());
    this.$nextTick(() => {
      (this as any).$refs.OrderCodeIpt.focus();
      (this as any).$refs.TrackingNumberInfo.resetFields();
    })
  }

  private CancelModal():void {
    this.$set(this, 'TrackingNumeberModal', false);
    this.ResetForm();
    if(this.Success){
      this.EmitOperateSuccess();
      this.$nextTick(() => {
        this.$set(this, 'Success', false);
      })
    }
  }

  private TrackingNumeberModal:boolean = false
  private TrackingNumberInfo: Interface.SetTrackingNumber = new Interface.SetTrackingNumber()
  private TrackingNumberRules:any = {
    OrderCode: [{required:true, message: '请输入发货单号'}],
    TrackCode: [{required:true, message: '请输入跟踪号'}]
  }
  private Success:boolean = false
}
</script>