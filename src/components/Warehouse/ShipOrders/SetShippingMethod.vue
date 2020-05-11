<template>
  <Col>
    <Button type="primary" @click="Trigger">设置物流渠道</Button>
    <Modal v-model="MethodModal" title="设置物流渠道" :width="600" @on-cancel="CancelModal">
      <Form :model="MethodInfo" ref="MethodInfo" :rules="MethodRules" :label-width="90" onsubmit="return false;">
        <FormItem label="物流渠道：" prop="MethodId">
          <Select placeholder="物流渠道" v-model="MethodInfo.MethodId" :options="ShipMethodDrop" optionValKey="Id" optionKey="Name" />
          <!-- <Select placeholder="物流渠道" v-model="MethodInfo.MethodId" filterable clearable>
            <Option v-for="(Item,Index) in ShipMethodDrop" :value="Item.Id" :key="Index">{{ Item.Name }}</Option>
          </Select> -->
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
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'


@Component({
  name: "SetShippingMethod"
})
export default class SetShippingMethod extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('SetShippingMethod');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if (!([4,7,9].some(S => S === Item.ShipOrder.Status)) || ([2,3].some(S => S === Item.ShipOrder.Status) && Item.ShipOrder.IsException)) {
        this.$UI.Tips.Floating('warning','请选择状态为已拣货、缺货、联系客户的发货订单或状态为已确认、待拣货的异常发货订单进行操作')
        return;
      }
    }
    this.MethodInfo.OrderId = D.map(Item => Item.ShipOrder.Id);
    this.MethodInfo.MethodId = D[0].ShipOrder.ShippingMethodId;
    if(!this.ShipMethodDrop.length){
      this.GetMethodDrop();
    }
    this.$set(this,'MethodModal',true);
  }

  private GetMethodDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelDropList
      },
      Data: 0,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.ShipMethodDrop.push(...Res.Data.DropList);
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private Post():void {
    (this as any).$refs.MethodInfo.validate((Valid: boolean) => {
      if(Valid){
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.ShipOrderSetShippingMethod,
            Login: true
          },
          Data: this.MethodInfo,
          Callback: (Res:PInterface.Res):void => {
            if(Res.IsSuccess){
              this.$UI.Tips.Floating('success', '设置物流渠道成功')
              this.EmitOperateSuccess();
              this.CancelModal();
            }else{
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'MethodModal', false);
    this.$set(this, 'MethodInfo', new Interface.SetShippintMethod());
    (this as any).$refs.MethodInfo.resetFields();
  }

  private MethodModal:boolean = false
  private ShipMethodDrop: PInterface.IdName[] = []
  private MethodInfo: Interface.SetShippintMethod = new Interface.SetShippintMethod()
  private MethodRules: any = {
    MethodId: [{required: true, message: '请选择物流渠道', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择物流渠道', trigger: 'change'}]
  }
}
</script>