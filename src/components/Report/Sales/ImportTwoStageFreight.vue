<!-- 导入运费 -->
<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-MB-10 P-MR-10 P-Inline-Block" @click="ShowModal = true">导入运费</Button>
	  <Modal v-model="ShowModal" title="导入运费" :mask-closable="false" @on-cancel="ImportProfit(false)">
      <Form onsubmit="return false" :label-width="100">
        <Form-item label="导入类型：" required>
          <Select placeholder="选择导入类型" v-model="ImportType" :options="ImportTypeList" />
          <!-- <Select placeholder="选择导入类型" v-model="ImportType" filterable clearable>
            <Option v-for="(Item, Index) in ImportTypeList" :value="$Enums.Report.ImportType[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="选择文件：" required>
          <Upload ref="UploadFile" :data="UploadData" :action="UploadUrl" :format="['xls','xlsx']" :before-upload="HandleUpload" :on-success="UploadSuccess" :on-error="HandleError" :headers="Headers">
            <Button type="primary" icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <p v-if="File !== null">{{ File.name }} </p>
          <div>说明：最多一次导入10000条数据</div>
        </Form-item>
        <Form-item label="下载模板：">
          <a :href="$Server.Warehouse + TemplateExcel" download>导入运费模板.xls</a>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" style="margin-left: 8px" @click="UploadBefore">导入</Button>
        <Button style="margin-left: 8px" @click="ImportProfit(false)">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'ImportTwoStageFreight'
})
export default class ImportTwoStageFreight extends Vue {
  @Emit() private ImportProfit(N:boolean):void{
    if(this.$refs.UploadFile){
      (this.$refs["UploadFile"] as any).clearFiles();
    }
    this.ShowModal = false;
    this.File = null;
    this.ImportType = "";
  }

  //打开模态框
  private TriggerModal(): void{
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
  private UploadBefore():void {
    if ( !this.ImportType ) {
      this.$UI.Tips.Floating('warning', '请选择导入类型')
      return
    }
    if (this.File == null) {
      this.$UI.Tips.Floating('warning', '请选择文件进行操作');
      return
    }
    let FileType = this.File.name.slice(this.File.name.lastIndexOf('.') + 1)
    if (FileType != 'xls' && FileType != 'xlsx') {
      this.$UI.Tips.Floating('warning', '请选择格式为xlsx的文件进行导入操作');
      return
    }
    this.UploadData.ImportType = this.ImportType;
    (this.$refs["UploadFile"] as any).post(this.File);
    this.$UI.Loading.Show();
  }

  //上传成功的方法
  private UploadSuccess(Res: PInterface.Res):void {
    if (Res.IsSuccess) {
      let ShowMsg = ''
      if( Res.Data.Data.Url ){
        ShowMsg = `本次导入成功【${Res.Data.Data.SuccessCount}】条数据，导入失败【${Res.Data.Data.FailCount}】条数据，重算毛利【${Res.Data.Data.RecalculatedCount}】条数据<span>，详情请下载<a style="color:#4180b1" download href="${this.$Server.Warehouse+Res.Data.Data.Url}">导入失败运费异常表格</a>进行查看</span>`
      }else{
        if (this.UploadData.ImportType === 1 || this.UploadData.ImportType === 2) {
          ShowMsg = Res.Data.Data.RecalculatedCount === 0 ? `本次所有数据都导入成功` : `本次所有数据都导入成功并重算毛利，请到已确认毛利报表查看`
        } else if ( this.UploadData.ImportType === 3 || this.UploadData.ImportType === 4) {
          ShowMsg = `本次所有数据都导入成功并重算毛利，请到已确认毛利报表进行查看`
        }
      }
      this.$UI.Tips.Modal({
        Type: 'success',
        Content: ShowMsg,
        Callback: (B:boolean):void =>{}
      })
      this.ImportProfit(true)	
    } else {
      this.$UI.Loading.Hide();
      this.$Request.Error(Res);
      (this.$refs["UploadFile"] as any).clearFiles();
    }
  }

  private ImportType: number|"" = ""
  private ImportTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.ImportType);
  private UploadData: Interface.ImportTypeForm = new Interface.ImportTypeForm();
  private TemplateExcel: string = "//Template//导入头尾程运费模板.xlsx";
  private ShowModal: boolean = false //模态框
  private File: any = null; //上传使用的数据
  private UploadUrl:string = this.$Server.Warehouse + this.$Api.ImportTwoStageFreight;
  private Headers: any = {
    "userid": JSON.parse(this.$Cookie.Get('frler_user')).UserId
  }
}

</script>
<style lang="less"></style>
