<template>
  <Col>
    <Button type="primary" @click="Trigger">合并</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "MergeOrder"
})
export default class MergeOrder extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('MergeShipOrder');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    if(D.length < 2){
      this.$UI.Tips.Floating('warning','请选择两条以上状态为已确认、缺货、已拦截或联系客户的发货订单进行操作')
      return
    }
    let Statuses:number[] = [], OrderMsgs:string[] = [], PlatOrderTimes:number[] = [], OrderIds:number[] = []
    for(let Item of D){
      if (!([2,7,8,9].some(S => S === Item.ShipOrder.Status))) {
        this.$UI.Tips.Floating('warning','请选择状态为已确认、缺货、已拦截、联系客户的发货订单进行操作')
        return;
      }
      Statuses.push(Item.ShipOrder.Status)
      OrderMsgs.push(`Platform:${Item.ShipOrder.Platform},Warehouse:${Item.ShipOrder.ShipWarehouseId},Country:${Item.Address.Country ? Item.Address.Country.CountryCode : ''},
                    BuyerUserId:${Item.ShipOrder.BuyerUserId},BuyerFullName:${Item.Address.BuyerFullName},BuyerState:${Item.Address.BuyerState},BuyerCity:${Item.Address.BuyerCity},
                    BuyerStreet1:${Item.Address.BuyerStreet1},BuyerStreet2:${Item.Address.BuyerStreet2},BuyerPhone:${Item.Address.BuyerPhone},BuyerZipCode:${Item.Address.BuyerZipCode}`)
      PlatOrderTimes.push(new Date(Item.ShipOrder.PlatOrderTime).getTime()); // 下单时间时间戳 取最小
      OrderIds.push(Item.ShipOrder.Id)
    }

    const S = new Set(Statuses),I = new Set(OrderMsgs)
    // 多于一种状态，无法合并
    if(S.size > 1){
      this.$UI.Tips.Floating('warning', '请选择同一状态的发货订单进行操作');
      return;
    }

    // 订单信息不一致，无法合并
    if(I.size > 1){
      this.$UI.Tips.Floating('warning', '订单信息不一致，无法合并');
      return;
    }

    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否合并发货订单',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show()
          const MinTime = Math.min(...PlatOrderTimes),Index = PlatOrderTimes.indexOf(MinTime)
          let PostData:Interface.Merge = {
            TargetOrderId:OrderIds.splice(Index,1)[0],
            SourceId: OrderIds
          }
          
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.MergeOrder,
              Login:true
            },
            Data: PostData,
            Callback:(Res:PInterface.Res):void => {
              if(Res.IsSuccess){
                this.$UI.Tips.Floating('success', '合并发货订单成功');
                this.EmitOperateSuccess()
              }else{
                this.$UI.Loading.Hide()
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