<!-- 海外仓 导入 -->
<template>
  <div class="P-Inline-Block">
    <Button type="primary" @click="OpenModal">批量导入</Button>
    <Modal v-model="ShowModal" title="批量导入" :mask-closable="false" @on-cancel="HandleRes(false)">
      <Form onsubmit="return false" :label-width="100">
        <Form-item label="选择文件：">
          <Upload ref="UploadFile" :action="UploadUrl" :format="['xls','xlsx']" :before-upload="HandleUpload" :on-success="UploadSuccess" :on-error="HandleError" :headers="Headers">
            <Button icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <p v-if="File !== null">{{ File.name }} </p>
        </Form-item>
        <Form-item label="下载模板：">
          <a class="ivu-btn" :href="`${$Server.Purchase}/Import/海外仓产品导入导出模板.xlsx`" download>海外仓产品导入模板.xlsX</a>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" style="margin-left: 8px" @click="UploadProduct">导入</Button>
        <Button style="margin-left: 8px" @click="HandleRes(false)">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Sales';
@Component({
  name: 'ImportOverseasWare'
})
export default class ImportOverseasWare extends Vue {
  @Emit() private HandleRes(B:boolean):void{
    if(this.$refs.UploadFile){
      (this.$refs["UploadFile"] as any).clearFiles();
    }
    this.ShowModal = false;
    this.File = null;
  }

  //打开导入模态框
  private OpenModal(Val: number): void{
    this.ShowModal = true;
  }

  private HandleUpload(File: any):boolean {
    this.File = File;
    return false;
  }
  
  private HandleError(Errors: any, File:any): void {
    this.$UI.Loading.Hide();
    this.$UI.Tips.Modal({
      Type: 'warning',
      Content: Errors,
      Callback: (B:boolean):void =>{}
    })
  }
  
  //上传前判断
  private UploadProduct():void {
    if (this.File == null) {
      this.$UI.Tips.Floating('warning', '请选择文件进行操作');
      return
    }
    let FileType = this.File.name.slice(this.File.name.lastIndexOf('.') + 1)
    if ( !['xls', 'xlsx'].includes(FileType) ) {
      this.$UI.Tips.Floating('warning', '请选择格式为xls或xlsx的文件进行导入');
      return
    }
    (this.$refs["UploadFile"] as any).post(this.File);
    this.$UI.Loading.Show();
  }

  //上传成功的方法
  private UploadSuccess(Res: PInterface.Res):void {
    this.$UI.Loading.Hide();
    if (Res.IsSuccess) {
      this.ShowModal = false;
      // 导入成功后执行的操作
      if( Res.Data.Url == undefined ){
        this.$UI.Floating('success', Res.Msg);
      } else {
        this.$UI.Tips.Modal({
          Type: 'success',
          Content: `${Res.Msg} <a href="${this.$Server.Purchase + Res.Data.Url}" download>导入失败表格</a>`,
          Callback: (B:boolean):void =>{}
        })
      }
      this.HandleRes(true);
    } else {
      this.$UI.Tips.Modal({
        Type: 'error',
        Content: Res.Msg,
        Callback: (B:boolean):void =>{}
      })
    }
    (this.$refs["UploadFile"] as any).clearFiles();
  }

  private UploadTitle: string = ""
  private ShowModal: boolean = false //上传产品模态框
  private File: any = null; //上传使用的数据
  private UploadUrl:string = this.$Server.Purchase + this.$Api.OverseaSkuImport;
  private Headers: any = {
    "userid": JSON.parse(this.$Cookie.Get('frler_user')).UserId
  }
}

</script>
<style lang="less"></style>
