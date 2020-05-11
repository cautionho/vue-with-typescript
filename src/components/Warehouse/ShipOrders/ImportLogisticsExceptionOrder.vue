<!-- 导入物流异常单 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" @click="Trigger">导入物流异常单</Button>
    <Modal v-model="ImportModal" title="导入物流异常单" :width="600" @on-cancel="CancelModal">
      <Form onsubmit="return false" :label-width="90">
        <FormItem label="导入文件：" required>
          <Upload :before-upload="HandleSelect" :show-upload-list="false" accept="application/vnd.ms-excel" :format="['xls', 'xlsx']" action="">
            <Button type="primary">选择文件</Button>
             <p class="P-Text-Info">{{File.name}}</p>
          </Upload>
        </FormItem>
        <FormItem label="下载模板：">
          <a :href="`${$Server.CustomerService}/Template/物流异常订单导入模板.xlsx`" download>物流异常订单导入模板.xls</a>
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary"  @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: 'ImportLogisticsExceptionOrder'
})

export default class ImportLogisticsExceptionOrder extends Vue {
  private Trigger(): void {
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

  private Validate(): void {
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
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.ImportLogisticsAnomalyRecord,
        Login: true
      },
      Data: Form,
      Form: true,
      Callback: (Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          let Content:string = ''
          if(Res.Data.Data.FailCount < 1){
            Content = `本次所有发货订单均导入成功，共导入[${Res.Data.Data.SuccessCount}]个发货订单。`
            this.CancelModal();
          }else{
            Content = `本次导入成功[${Res.Data.Data.SuccessCount}]个发货订单，导入失败[${Res.Data.Data.FailCount}]个发货订单，详情请下载导入失败发货订单表格进行查看。<a download href="${this.$Server.CustomerService}${Res.Data.Data.Url}" target="_blank">导入失败发货订单.xls</a>`
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

  private CancelModal(): void {
    this.$set(this, 'ImportModal', false)
    this.File = {}
  }

  private ImportModal: boolean = false
  private File: any = {}
}

</script>
<style lang="less" scoped>

</style>