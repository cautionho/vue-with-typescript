<!-- 导入-->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Button v-if="Powers.SkuImport" class="P-MB-10 P-MR-10" type="primary" @click="Trigger(0)">导入SKU</Button>
      <Button v-if="Powers.SkuStatusImport" class="P-MB-10 P-MR-10" type="primary" @click="Trigger(1)">导入SKU状态</Button>
      <Modal v-model="ShowModal" :model="OperateForm" :title="UploadTitle" @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form onsubmit="return false" :label-width="100">
          <FormItem label="导入类型：" v-if="UploadType === 0" required>
            <RadioGroup v-model="OperateForm.IsBindSku" >
              <Radio label="0">普通SKU</Radio>
              <Radio label="1">捆绑SKU</Radio>
            </RadioGroup>
          </FormItem>

          <Form-item label="上传文件：" required>
            <Upload ref="UploadFileComponent" 
              :data="UploadData"
              :format="['xls','xlsx']" 
              :action="UploadUrl" 
              :before-upload="HandleUpload" 
              :on-success="HandleSuccess" 
              :on-error="HandleError" 
              :show-upload-list="false"
              :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})">
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
            <p v-if="UploadFile !== null">{{ UploadFile.name }} </p>
            <p v-else>未选择任何文件</p>
          </Form-item>
          <Form-item label="下载模板：">
            <a v-if="UploadType === 0" class="ivu-btn P-MR-10" :href="`${$Server.Purchase}/Template/普通SKU导入表格.xlsx`" download>普通SKU模板.xls</a>
            <a v-if="UploadType === 0" class="ivu-btn P-MR-10" :href="`${$Server.Purchase}/Template/捆绑SKU导入表格.xlsx`" download>捆绑SKU模板.xls</a>
            <a v-if="UploadType === 1" class="ivu-btn P-MR-10" :href="`${$Server.Purchase}/Template/SkuStatusImport.xlsx`" download>SKU状态模板.xlsx</a>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </div>
      </Modal>

      <Modal  v-if="Powers.SkuImport || Powers.SkuStatusImport"  v-model="ImportFailModal" title="提示" :closable="false" :mask-closable="false">
        <p class="P-PD-15" v-if="ImportFailedNum === 0">本次所有SKU均导入成功，共导入{{ ImportSuccessNum }}个SKU。</p>
        <p class="P-PD-15" v-else>本次导入成功【{{ImportSuccessNum}}】条数据，导入失败【{{ImportFailedNum}}】条数据，详情请下载导入失败SKU表格进行查看。</p>
        
        <div slot="footer">
          <Button type="primary" @click="UploadImportFail" v-show="ImportFailedNum !== 0">下载导入失败SKU表格</Button>
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
    name: 'ImportSku'
  })
  export default class ImportSku extends Vue {
    @Prop() Powers: PInterface.Power;   //权限

    @Emit() HandleResMsg(Type:number): void {}

    private Trigger(Type: number):void {

      this.UploadType = Type;
      this.UploadUrl = `${this.$Server.Purchase}${[this.$Api.SkuImport, this.$Api.SkuStatusImport][Type]}`;       // 上传地址
      this.UploadTitle = ["导入SKU", "导入SKU状态"][Type]; // 模态框名称
      this.UploadFile = null; // 上传文件对象

      this.$set(this,'ShowModal', true);
   }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ShowModal', false);
      this.UploadFile = null;
      (this.$refs['UploadFileComponent'] as Vue).clearFiles();
      this.OperateForm = new Interface.ImportSkuForm()
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      if (this.UploadFile === null) {
        this.$UI.Tips.Floating('warning', `请选择上传文件`);
        return;
      }

      const FileType = this.UploadFile.name.slice(this.UploadFile.name.lastIndexOf('.') + 1)
      if ( !['xls', 'xlsx'].includes(FileType) ) {
        this.$UI.Tips.Floating('warning', '请选择格式为xls或xlsx的文件进行导入');
        return
      }

      if ( this.UploadType === 0 ) {
        this.UploadData['IsBindSku'] = Number(this.OperateForm.IsBindSku) === 1 
      } else {
        this.UploadData = {};
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
      this.$UI.Loading.Hide();
      if (Res.IsSuccess) {
        
        // SKU别名导入
        if (this.UploadType === 0) {
          this.ImportFailUrl = Res.Data.Data.Url
          // 打开错误模态框
          this.ImportSuccessNum = Res.Data.Data.SuccessCount;
      		this.ImportFailedNum = Res.Data.Data.FailCount;
          this.ImportFailModal = true;
          if (	this.ImportFailedNum === 0) {
            this.ClearModal( 1 );
          }
        } else {
          this.$UI.Tips.Floating('success', '导入SKU状态成功');
          this.ClearModal( 1 );
        }
        // 
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
      window.open(`${this.$Server.Purchase}/${this.ImportFailUrl}`)
    }

    private UploadType: number = 0; // 上传类型
    private UploadUrl: string = ""; // 上传地址
    private UploadTitle: string = ""; // 模态框名称
    private UploadFile: any = null; // 上传文件对象

    private UploadData: any = {}; // 上传额外参数

    private ImportSuccessNum: number = 0; // 上传异常提示语：成功数量
    private ImportFailedNum: number = 0; // 上传异常提示语：失败数量
    private ImportFailModal: boolean = false; // 失败模态框
    private ImportFailUrl: string = ""; // 上传异常下载链接

    private OperateForm: Interface.ImportSkuForm = new Interface.ImportSkuForm() //状态改变提交信息
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