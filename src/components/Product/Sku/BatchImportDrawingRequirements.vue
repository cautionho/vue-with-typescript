<!-- 批量导入作图需求 -->
<template>
  <Row class="P-Inline-Block" >
    <Button class="P-MB-10 P-MR-10" type="primary" @click="Trigger">批量导入作图需求</Button>
    <Modal v-model="ShowModal" title="批量导入作图需求" :width="600" @on-cancel="CancelModal(0)">
      <Form onsubmit="return false" :label-width="90">
        <FormItem label="导入文件：" required>
          <Upload 
            :before-upload="HandleSelect" 
            :show-upload-list="false" 
            accept="application/vnd.ms-excel" 
            :format="['xls', 'xlsx']" 
            action="">
            <Button type="primary">选择文件</Button>
             <p class="P-Text-Info">{{File.name}}</p>
          </Upload>
        </FormItem>
        <FormItem label="下载模板：">
          <a :href="`${$Server.Purchase}/Template/导入作图需求.xls`" download>默认模板.xls</a>
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary"  @click="Validate">提交</Button>
        <Button @click="CancelModal(0)">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product'

@Component({
  name: 'ImportLogisticsExceptionOrder'
})

export default class ImportLogisticsExceptionOrder extends Vue {
  @Emit() HandleResMsg(Type:number): void {}

  private Trigger(Selected: Interface.DrawingRequirementsList[]): void {
    this.$set(this, 'ShowModal', true)
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
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ImportDrawRequset,
        Login: true
      },
      Data: Form,
      Form: true,
      Callback: (Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', `批量导入作图需求成功,本次导入共成功导入${Res.Data.Data.SuccessCount}个,失败${Res.Data.Data.FailCount}个`)
          
          if(Res.Data.Data.FailCount > 0){
            window.open(`${this.$Server.Purchase}/${Res.Data.Data.Url}`)
          }
          
          this.CancelModal(1)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal(Type: number): void {
    this.File = {};
    this.$set(this, 'ShowModal', false)
    this.HandleResMsg(Type)
  }

  private ShowModal: boolean = false
  private File: any = {}
}

</script>
<style lang="less" scoped>

</style>