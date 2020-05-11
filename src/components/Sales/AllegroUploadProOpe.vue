<!-- allegro 上传产品 -->
<template>
	<Modal v-model="OpenUploadmodal" :title="UploadTitle" :mask-closable="false" @on-cancel="HandleRes(false)">
      <Form onsubmit="return false" :label-width="100">
        <Form-item label="选择文件：">
          <Upload ref="UploadFile" :action="UploadUrl" :format="['xlsx']" :before-upload="HandleUpload" :on-success="UploadSuccess" :on-error="HandleError" :headers="Headers">
            <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <p v-if="File !== null">{{ File.name }} </p>
          <div v-if="UploadTitle == '上传产品'">说明：最多一次导入500条数据,只支持xlsx格式文件</div>
          <div v-else>说明：最多一次导入500条数据,只能上传列表中结果为失败的产品,只支持xlsx格式文件</div>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" style="margin-left: 8px" @click="UploadProduct">上传</Button>
        <Button style="margin-left: 8px" @click="HandleRes(false)">取消</Button>
      </div>
    </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Sales';
@Component({
  name: 'AllegroUploadPro'
})
export default class AllegroUploadPro extends Vue {
  @Emit() private HandleRes(B:boolean):void{
    if(this.$refs.UploadFile){
      (this.$refs["UploadFile"] as any).clearFiles();
    }
    this.OpenUploadmodal = false;
    this.File = null;
  }

  //打开上传产品模态框
  private TriggerModal(Val: number): void{
    this.UploadTitle = Val === 1 ? '上传产品' : '重新上传产品';
    this.OpenUploadmodal = true;
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
    if (FileType != 'xlsx') {
      this.$UI.Tips.Floating('warning', '请选择格式为xlsx的文件进行导入操作');
      return
    }
    (this.$refs["UploadFile"] as any).post(this.File);
    this.$UI.Loading.Show();
  }

  //上传成功的方法
  private UploadSuccess(Res: PInterface.Res):void {
    this.$UI.Loading.Hide();
    if (Res.IsSuccess) {
      if(Res.Data.Data.Url){
        this.$UI.Tips.Modal({
          Type: 'success',
          Content: `此次上传成功${Res.Data.Data.SuccessCount}条，失败${Res.Data.Data.FailCount}条，详情请查看Excel表。`,
          Callback: (B:boolean):void =>{}
        })
        window.open(`${this.$Server.Sales}/${Res.Data.Data.Url}`, '_blank')
      }else{
        this.$UI.Tips.Modal({
          Type: 'success',
          Content: `产品数据上传中，请稍后通过页面列表查看上传结果。`,
          Callback: (B:boolean):void =>{}
        })
      }
      this.HandleRes(true)	
    } else {
      this.$UI.Tips.Modal({
        Type: 'error',
        Content: Res.Msg,
        Callback: (B:boolean):void =>{}
      })
      (this.$refs["UploadFile"] as any).clearFiles();
    }
  }

  private UploadTitle: string = ""
  private OpenUploadmodal: boolean = false //上传产品模态框
  private File: any = null; //上传使用的数据
  private UploadUrl:string = this.$Server.Sales + this.$Api.AllegroStoreImportProduct;
  private Headers: any = {
    "userid": JSON.parse(this.$Cookie.Get('frler_user')).UserId
  }
}

</script>
<style lang="less"></style>
