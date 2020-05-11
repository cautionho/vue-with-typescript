<template>
  <Col>
    <Button type="primary" @click="Trigger">拦截</Button>
    <Modal v-model="HoldUpModal" title="拦截" :width="600" @on-cancel="CancelModal">
      <Form :model="HoldUpForm" ref="HoldUpForm" :label-width="80" onsubmit="return false;">
        <FormItem label="备注：" prop="Remark">
          <Input ref="RemarkIpt" type="textarea" placeholder="拦截备注" v-model="HoldUpForm.Remark" :rows="5" :autosize="{minRows: 5,maxRows: 5}"></Input>
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Post">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "HoldUpOrder"
})
export default class HoldUpOrder extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}
  
  private Trigger():void{
     this.TriggerOperations('ToHoldUp');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if (!([2,3,4,5].some(S => S === Item.ShipOrder.Status)) || ([15, 16, 17].some(item => item === Item.ShipOrder.ApiType))) {
        this.$UI.Tips.Floating('warning','请选择状态为已确认、待拣货、已拣货、已打包，发货仓不为海外仓的发货订单进行操作')
        return;
      }
    }
    this.HoldUpForm.OrderId = D.map(Item => Item.ShipOrder.Id)
    this.$set(this,'HoldUpModal',true);
    this.$nextTick(()=>{
      (this as any).$refs.RemarkIpt.focus();
    })
  }

  private Post():void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api:{
        Address: this.$Api.ShipOrderSetHolUp,
        Login: true
      },
      Data: this.HoldUpForm,
      Callback: (Res:PInterface.Res):void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '发货订单已标识为拦截');
          this.EmitOperateSuccess()
          this.CancelModal();
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal():void {
    this.HoldUpForm = new Interface.Remark();
    this.$set(this,'HoldUpModal',false);
  }

  private HoldUpModal:boolean = false;
  private HoldUpForm:Interface.Remark = new Interface.Remark();
}
</script>