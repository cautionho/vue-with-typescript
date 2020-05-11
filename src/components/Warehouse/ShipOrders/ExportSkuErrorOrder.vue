<template>
  <Col>
    <Button type="primary" @click="Validate">导出明细错误订单</Button>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder';

@Component({
  name: "ExportSkuErrorOrder"
})
export default class ExportSkuErrorOrder extends Vue {
  @Emit() EmitOperateSuccess():void {}

  private Validate():void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认执行导出明细错误订单操作',
      Callback: (B:boolean) =>{
        if(B){
          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.ShipOrderSkuErrorExport,
              Login: true
            },
            Data: new Interface.ShipOrderSearch({Status: 1}),
            Callback:(Res:PInterface.Res):void => {
              this.$UI.Loading.Hide();
              if(Res.IsSuccess){
                setTimeout(()=>{
                  this.$UI.Tips.Modal({
                    Type:'success',
                    Content:'创建导出发货订单任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。',
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