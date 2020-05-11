<template>
  <Col>
    <Button type="primary" @click="Trigger">审核通过</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "ReviewOrder"
})
export default class ReviewOrder extends Vue {
  @Emit() TriggerOperations(N:string):void {}
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.TriggerOperations('ReviewShipOrder');
  }

  private Validate(D:Interface.ShipOrderList[]):void {
    for(let Item of D){
      const Platform: number = Item.ShipOrder.Platform,
        AutoMatchRemark: string = Item.ShipOrder.AutoMatchRemark.toLowerCase();

        if( !((Platform === 1 && AutoMatchRemark.includes('收款账号')) || (Platform === 2 && AutoMatchRemark.includes('风控'))) ){
          this.$UI.Tips.Floating('warning', '请选择eBay收款账号错误或Wish风控订单进行操作');
          return;
        }

      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: '是否确认执行审核通过操作',
        Callback: (B:boolean) =>{
          if(B){
            this.$UI.Loading.Show()
            this.$Request.Post({
              Server: this.$Server.Warehouse,
              Api: {
                Address: this.$Api.CleanAutoMatchRemark,
                Login:true
              },
              Data: D.map(Item => Item.ShipOrder.Id),
              Callback:(Res:PInterface.Res):void => {
                if(Res.IsSuccess){
                  this.$UI.Tips.Floating('success', '审核成功');
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
}
</script>