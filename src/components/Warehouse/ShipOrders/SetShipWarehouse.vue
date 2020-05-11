<template>
  <Col>
    <Button type="primary" @click="Trigger">更新发货仓</Button>
    <Modal v-model="WarehouseModal" title="更新发货仓" :width="600" @on-cancel="CancelModal">
      <Form :model="WarehouseInfo" ref="WarehouseInfo" :rules="WarehouseRules" :label-width="90" onsubmit="return false;">
        <FormItem label="发货仓：" prop="WarehouseId">
          <Select placeholder="发货仓" v-model="WarehouseInfo.WarehouseId" :options="WarehouseDrop" :onChange="ChangeWarehouse" />
          <!-- <Select placeholder="发货仓" v-model="WarehouseInfo.WarehouseId" filterable clearable @on-change="ChangeWarehouse">
            <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <Form :model="MethodInfo" ref="MethodInfo" :rules="MethodRules" :label-width="90" onsubmit="return false;">
        <FormItem label="物流渠道：" prop="MethodId">
          <Select placeholder="物流渠道" v-model="MethodInfo.MethodId" :options="ShipMethodDrop" optionValKey="Id" optionKey="Name" ref="MethodDrop" />
          <!-- <Select placeholder="物流渠道" v-model="MethodInfo.MethodId" filterable clearable ref="MethodDrop">
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
  name: "SetShipWarehouse"
})
export default class SetShipWarehouse extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('ChangeShipWarehouse');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      if (!([7,9].some(S => S === Item.ShipOrder.Status))) {
        this.$UI.Tips.Floating('warning','请选择状态为缺货、联系客户的发货订单进行操作')
        return;
      }
    }
    this.WarehouseInfo.OrderId = this.MethodInfo.OrderId = D.map(Item => Item.ShipOrder.Id);
    this.WarehouseInfo.WarehouseId = D[0].ShipOrder.ShipWarehouseId;
    if(!this.WarehouseDrop.length){
      this.GetWarehouseDrop();
    }
    if(!this.ShipMethodDrop.length){
      this.ChangeWarehouse(this.WarehouseInfo.WarehouseId)
    }
    this.MethodInfo.MethodId = D[0].ShipOrder.ShippingMethodId;
    this.$set(this,'WarehouseModal',true);
  }

  private GetWarehouseDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.WarehouseDrop.push(...Res.Data.DropList);
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private ChangeWarehouse(Val: number): void {
    this.MethodInfo.MethodId = 0;
    if(Val){
      this.$set(this, 'ShipMethodDrop', []);
      this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelDropList
      },
      Data: Val,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.ShipMethodDrop.push(...Res.Data.DropList);
        }else{
          this.$Request.Error(Res);
        }
      }
    })
    }else{
      this.$set(this, 'ShipMethodDrop', []);
      (this as any).$refs.MethodDrop.clearSingleSelect();
    }
  }

  private Post():void {
    (this as any).$refs.WarehouseInfo.validate((WValid: boolean) => {
      if(WValid){
        (this as any).$refs.MethodInfo.validate(async (MValid: boolean): Promise<void> => {
          if(MValid){
           const W: PInterface.Res = await this.PostInfo<Interface.SetWarehouse>(this.$Server.Warehouse, this.$Api.ShipOrderSetWarehouse, this.WarehouseInfo)
           if(W.IsSuccess){
            const M: PInterface.Res = await this.PostInfo<Interface.SetShippintMethod>(this.$Server.Warehouse, this.$Api.ShipOrderSetShippingMethod, this.MethodInfo)
            if(M.IsSuccess){
              this.$UI.Tips.Floating('success','更换发货仓成功');
              this.EmitOperateSuccess();
              this.CancelModal();
            }else{
              this.$UI.Loading.Hide();
              this.$Request.Error(M);
            }
           }else{
            this.$UI.Loading.Hide();
            this.$Request.Error(W);
           }
          }
        })
      }
    })
  }

  private PostInfo<T>(Server:string,Api:string,Data:T):Promise<PInterface.Res> {
    return new Promise((resolve:(Val:PInterface.Res)=>void) => {
      this.$Request.Post({
        Server: Server,
        Api: {
          Address: Api,
          Login:true
        },
        Data: Data,
        Callback: (Res:PInterface.Res): void => {
          resolve(Res);
        }
      })
    })
  }

  private CancelModal(): void {
    this.$set(this, 'WarehouseModal', false);
    this.$set(this, 'WarehouseInfo', new Interface.SetWarehouse());
    (this as any).$refs.WarehouseInfo.resetFields();
  }

  private WarehouseModal:boolean = false
  private WarehouseDrop: PInterface.IdName[] = []
  private WarehouseInfo: Interface.SetWarehouse = new Interface.SetWarehouse()
  private WarehouseRules: any = {
    WarehouseId: [{required: true, message: '请选择发货仓', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择发货仓', trigger: 'change'}]
  }

  private ShipMethodDrop: PInterface.IdName[] = []
  private MethodInfo: Interface.SetShippintMethod = new Interface.SetShippintMethod()
  private MethodRules: any = {
    MethodId: [{required: true, message: '请选择物流渠道', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择物流渠道', trigger: 'change'}]
  }
}
</script>