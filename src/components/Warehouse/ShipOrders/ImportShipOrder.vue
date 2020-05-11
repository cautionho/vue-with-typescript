<template>
  <Col>
    <Button type="primary" @click="Trigger">导入发货单</Button>
    <Modal v-model="ImportModal" title="导入发货单" @on-cancel="CancelModal">
      <Form :label-width="100" onsubmit="return false;">
        <FormItem label="上传文件：">
          <Upload action="" :before-upload="HandleSelect" accept="application/vnd.ms-excel" :format="['xls','xlsx']">
            <Button type="primary">选择文件</Button>
            <p class="P-Text-Info">{{File.name}}</p>
        </Upload>
        </FormItem>
        <FormItem label="下载模板：">
          <a :href="`${$Server.Warehouse}/Template/ShipOrder_Template.xlsx`" download>发货单导入模板.xlsx</a>
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
import PInterface from '@/assets/Interface/Public';

@Component({
  name: "ImportShipOrder"
})
export default class ImportShipOrder extends Vue {
  @Emit() EmitOperateSuccess():void {}

  private Trigger():void{
    this.$set(this, 'ImportModal', true)
  }

  private HandleSelect(File:any):boolean {
    if(new this.$Validate.Xls().Valid(File)){
      this.$set(this,'File',File);
    }else{
      this.$UI.Tips.Floating('warning','请选择格式为xls/xlsx的文件')
    }
    
    return false;
  }

  private Validate():void {
    if(!this.File.name){
      this.$UI.Tips.Floating('warning','请选择上传文件')
      return
    }
    this.PostImport();
  }

  private PostImport():void {
    this.$UI.Loading.Show();
    let Form = new FormData();
    Form.append('File',this.File)
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.ShipOrderImport,
        Login: true
      },
      Data: Form,
      Form:true,
      Callback: (Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          let Content:string = ''
          if(Res.Data.Data.FailCount < 1){
            Content = `本次所有发货订单均导入成功，共导入[${Res.Data.Data.SuccessCount}]个发货订单。`
            this.CancelModal();
          }else{
            Content = `本次导入成功[${Res.Data.Data.SuccessCount}]个发货订单，导入失败[${Res.Data.Data.FailCount}]个发货订单，详情请下载导入失败发货订单表格进行查看。<a download href="${this.$Server.Warehouse}${Res.Data.Data.Url}" target="_blank">导入失败发货订单.xls</a>`
          }
          setTimeout(()=>{
            this.$UI.Tips.Modal({
              Type:'success',
              Content: Content,
              Callback: (B:boolean):void => {
                if(Res.Data.Data.SuccessCount > 0){
                  this.EmitOperateSuccess();
                }
              }
            })
          },500)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal():void {
    this.$set(this, 'ImportModal', false)
    this.File = {}
  }

  private ImportModal:boolean = false
  private File:any = {}
}
</script>