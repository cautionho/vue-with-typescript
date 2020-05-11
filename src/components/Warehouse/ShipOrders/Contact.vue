<template>
  <Col>
    <Button type="primary" @click="Trigger">联系客户</Button>
    <Modal v-model="ContactModal" title="联系客户" :width="600" @on-cancel="CancelModal">
      <Form :model="ContactForm" ref="ContactForm" :label-width="80" onsubmit="return false;">
        <FormItem label="备注：" prop="Remark">
          <Input ref="RemarkIpt" type="textarea" placeholder="备注" v-model="ContactForm.Remark" :rows="5" :autosize="{minRows: 5,maxRows: 5}"></Input>
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
  name: "ContactCustomer"
})
export default class ContactCustomer extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}
  
  private Trigger():void{
     this.TriggerOperations('ToContact');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if (!([2,7,8].some(S => S === Item.ShipOrder.Status)) || ([15, 16, 17].some(Api => Api === Item.ShipOrder.ApiType))) {
        this.$UI.Tips.Floating('warning','请选择状态为已确认、缺货、已拦截，发货仓不为海外仓的发货订单进行操作')
        return;
      }
    }
    this.ContactForm.OrderId = D.map(Item => Item.ShipOrder.Id)
    this.$set(this,'ContactModal',true);
    this.$nextTick(()=>{
      (this as any).$refs.RemarkIpt.focus();
    })
  }

  private Post():void {
    this.$UI.Loading.Show()
    this.ContactForm.Targetstatus = 9;
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api:{
        Address: this.$Api.ShipOrderChangeStatus,
        Login: true
      },
      Data: this.ContactForm,
      Callback: (Res:PInterface.Res):void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '发货订单状态已变更为联系客户');
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
    this.ContactForm = new Interface.ChangeShipOrderStatus();
    this.$set(this,'ContactModal',false);
  }

  private ContactModal:boolean = false;
  private ContactForm:Interface.ChangeShipOrderStatus = new Interface.ChangeShipOrderStatus();

  
}
</script>