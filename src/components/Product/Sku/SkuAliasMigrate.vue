<!-- SKU别名迁移 -->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Button class="P-MB-10 P-MR-10" type="primary" @click="Trigger">SKU别名迁移</Button>
      <Modal v-model="ShowModal" title="SKU别名迁移" @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form onsubmit="return false" :label-width="100">
          <Form-item label="选择文件：">
            <Upload ref="UploadFileComponent" 
              :format="['xls','xlsx']" 
              :action="`${$Server.Purchase}${$Api.SkuMapMigration}`" 
              :before-upload="HandleUpload" 
              :on-success="HandleSuccess" 
              :on-error="HandleError" 
              :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})">
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
            <p v-if="UploadFile !== null">{{ UploadFile.name }} </p>
          </Form-item>
          <Form-item label="样表下载：">
            <a class="ivu-btn" :href="`${$Server.Purchase}/Template/SkuMigration.xls`" download>SKU别名迁移表格模板.xlsx</a>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
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
    name: 'SkuAliasMigrate'
  })
  export default class SkuAliasMigrate extends Vue {
    @Emit() HandleResMsg(Type: number): void {}

    private Trigger():void {
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
        this.$UI.Tips.Floating('warning', `请选择文件后再进行迁移操作`);
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
        this.$UI.Tips.Floating('success', `SKU别名迁移成功，共${Res.Msg}`);
        this.ClearModal( 1 );
      } else {
        this.$Request.Error(Res);
      }
    }

    // 文件上传错误
    private HandleError(ErrorMsg: string, File: any, FileList: any): void {
      this.$UI.Tips.Floating('warning', ErrorMsg);
    }

    private UploadFile: any = null; // 上传文件对象
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