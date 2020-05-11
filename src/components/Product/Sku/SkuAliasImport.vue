<!-- SKU别名导入 -->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Button class="P-MB-10 P-MR-10" type="primary" @click="Trigger">SKU别名导入</Button>
      <Modal v-model="ShowModal" title="SKU别名导入" @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form onsubmit="return false" :label-width="100">
          <Form-item label="选择文件：">
            <Upload ref="UploadFileComponent" 
              :format="['xls','xlsx']" 
              :action="UploadUrl" 
              :before-upload="HandleUpload" 
              :on-success="HandleSuccess" 
              :on-error="HandleError" 
              :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})">
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
            <p v-if="UploadFile !== null">{{ UploadFile.name }} </p>
            <p class="P-Text-Error" v-else>说明：最多一次导入1000条数据</p>
          </Form-item>
          <Form-item label="样表下载：">
            <a class="ivu-btn" :href="`${$Server.Purchase}/Template/Sku_Map.xls`" download>SKU别名导入表格模板.xlsx</a>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </div>
      </Modal>

      <Modal v-model="ImportFailModal" title="提示" :closable="false" :mask-closable="false">
        <p class="P-PD-15">本次导入成功【{{ImportSuccessNum}}】条数据，导入失败【{{ImportFailedNum}}】条数据，详情请下载导入失败SKU别名表格进行查看</p>
        <div slot="footer">
          <Button type="primary" @click="UploadImportFail">下载失败SKU别名表格</Button>
          <Button type="primary" @click="ImportFailModal = false">确定</Button>
        </div>
      </Modal>

    </Col>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  @Component({
    name: 'SkuAliasImport'
  })
  export default class SkuAliasImport extends Vue {
    @Emit() HandleResMsg(Type:number): void {}

    private Trigger( ):void {
      this.ShowModal = true
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ShowModal', false);
      this.UploadFile = null;
      (this.$refs['UploadFileComponent'] as Vue).clearFiles();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      if (this.UploadFile === null) {
        this.$UI.Tips.Floating('warning', `请选择文件进行导入SKU别名操作`);
        return;
      }

      const FileType = this.UploadFile.name.slice(this.UploadFile.name.lastIndexOf('.') + 1)
      if ( !['xls', 'xlsx'].includes(FileType) ) {
        this.$UI.Tips.Floating('warning', '仅支持xls、xlsx格式的表格文件导入');
        return
      }

      (this.$refs['UploadFileComponent'] as Vue).post(this.UploadFile)
      this.$UI.Loading.Show();
    }

    // 文件上传
    private HandleUpload(File: any): boolean {
      this.UploadFile = File;
      return false;
    }

    // 文件上传成功
    private HandleSuccess(Res:any, File:any): void {
      if (Res.IsSuccess) {
        
        // SKU别名导入
        if (Res.Data.Data.Url !== "") {

          this.ImportFailUrl = Res.Data.Data.Url
          // 打开错误模态框
          this.ImportSuccessNum = Res.Data.Data.SuccessQuantity;
      		this.ImportFailedNum = Res.Data.Data.FailureQuantity;
          this.ImportFailModal = true;
          
        } else {
          this.$UI.Tips.Floating('success', "SKU别名导入成功");
        }
        this.ClearModal( 1 );
      } else {
        this.$Request.Error(Res);
      }
    }

    // 文件上传错误
    private HandleError(ErrorMsg: string, File: any, FileList: any): void {
      this.$UI.Tips.Floating('warning', ErrorMsg);
    }

    // 上传异常模态框 下载
    private UploadImportFail(): void {
      window.open(`${this.$Server.File}/${this.ImportFailUrl}`)
    }

    private UploadUrl: string = `${this.$Server.Purchase}${this.$Api.SkuMapImport}`; // 上传地址
    private UploadFile: any = null; // 上传文件对象
    private UploadTemplateTips: string = ""; // 上传提示

    private ImportSuccessNum: number = 0; // 上传异常提示语：成功数量
    private ImportFailedNum: number = 0; // 上传异常提示语：失败数量
    private ImportFailModal: boolean = false; // 失败模态框
    private ImportFailUrl: string = ""; // 上传异常下载链接

    private ShowModal: boolean = false; // 当前模态框
  }


</script>
<style>
.Max-Height-200{
  max-height:200px;
  overflow:auto;
}
.P-PD-15{
  padding: 15px;
}
</style>