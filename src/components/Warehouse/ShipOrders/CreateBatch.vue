<template>
  <Col>
    <Button type="primary" @click="Trigger">生成拣货批次</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "CreateBatch"
})
export default class CreateBatch extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('CreateBatchOrder');
  }

  /* 
    1.状态为已确认（2）；
    2.非异常订单；
    3.非海外仓订单；
    4.面单大小一致；
    5.明细类型一致；
    6.单品不可超过500条；
    7.多品不可超过100条；
  */
  private Validate(D:Interface.ShipOrderList[]):void {
    let Labels:number[] = [],ItemTypes:number[] = [];
    for(let Item of D){
      if (Item.ShipOrder.Status !== 2) {
        this.$UI.Tips.Floating('warning','请选择状态为已确认的发货订单进行操作')
        return;
      }
      if(Item.ShipOrder.IsException){
        this.$UI.Tips.Floating('warning','请选择非异常的发货订单进行操作')
        return;
      }
      if([15,16,17].some(Over => Over === Item.ShipOrder.ApiType)){
        this.$UI.Tips.Floating('warning','请选择非海外仓的发货订单进行操作')
        return
      }
      if([9,27,80,81,85,86,99,101,105,107,113,118,119,120,148,150,151,154,156,157,158,161,162,170,171,172,173,174,184].some(M => M === Item.ShipOrder.ShippingMethodId)){
        Labels.push(15) // 面单大小150mm
      }else if([28,108,138,147,176,177].some(M => M === Item.ShipOrder.ShippingMethodId)){
        Labels.push(20) // 面单大小200mm
      }else{
        Labels.push(10) // 面单大小100mm
      }
      if(Item.ShipOrder.ItemType <= 3){
        ItemTypes.push(1) // 单品
      }else{
        ItemTypes.push(2) // 多品
      }
    }
    let L = new Set(Labels),I = new Set(ItemTypes);
    if(L.size > 1){
      this.$UI.Tips.Floating('warning','请选择面单大小一致的发货订单进行操作')
      return;
    }
    if(I.size > 1){
      this.$UI.Tips.Floating('warning','请选择明细类型相同的发货订单进行操作')
      return;
    }

    if(ItemTypes[0] === 1 && D.length > 500){
      this.$UI.Tips.Floating('warning','明细类型为单品的发货订单单次生成拣货批次不可超过500条')
      return
    }

    if(ItemTypes[0] === 2 && D.length > 100){
      this.$UI.Tips.Floating('warning','明细类型为多品的发货订单单次生成拣货批次不可超过100条')
      return
    }

    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认生成拣货批次',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.CreateBatchOrder,
              Login:true
            },
            Data: D.map(Item => Item.ShipOrder.Id),
            Callback:(Res:PInterface.Res):void => {
              this.$UI.Loading.Hide();
              if(Res.IsSuccess){
                setTimeout(()=>{
                  this.$UI.Tips.Modal({
                    Type:'success',
                    Content: `生成拣货批次成功，批次号为：${Res.Data.BatchCode}`,
                    Callback:(B:boolean):void => {
                      this.EmitOperateSuccess()
                    }
                  })
                },500)
              }else{
                this.$Request.Error(Res);
              }
            }
          })
        }
      }
    })
  }
}
</script>