<!-- 组织添加、编辑组件 -->
<template>
  <div class="P-Inline-Block ">
    <Col>
      <Button class="P-MR-10 P-MB-10" type="primary" @click="OpenModifyBrandModal">添加品牌</Button>
      <Modal v-model="ModifyBrandModal" :title="SelecData.length > 0 ? '编辑品牌' : '添加品牌' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800" >
        <Row>
          <Col span="16">
            <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110" >
              <Form-item label="品牌名称" prop="BrandName">
                <Input ref="OperateFormName" v-model="OperateForm.BrandName" placeholder="用户名称" name="BrandName" />
              </Form-item>
              <Form-item label="网址">
                <Input v-model="OperateForm.BrandUrl" placeholder="品牌网址"  />
              </Form-item>
              <Form-item label="备注">
                <Input v-model="OperateForm.Remark" placeholder="备注" />
              </Form-item>
            </Form>
          </Col>
          <Col span="8" class="P-TA-C">
            <div class="demo-upload-list" v-for="(Item, Index) in UploadList" :key="Index" style="width:145px;height:145px; margin:0 auto">
              <template v-if="Item.Status === 'Finished'" >
                <img :src="$Server.File +'/'+ Item.Url" height="145" width="145">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="ShowPic(Item.Url)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="HandleRemove(Item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="Item.showProgress" :percent="Item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload  v-show="IsUpload" ref="Upload" :show-upload-list="false" :on-success="HandleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" type="drag" :action="UploadImgServer" style="display: inline-block;width: 145px; height: 145px;">
              <div style="height: 145px;">
                <Icon type="camera" size="20" style="margin-top: 30px;"></Icon>
                <p>上传品牌LOGO</p>
                <p style="padding-bottom: 12px;">仅支持jpg、jpeg、png图片格式，大小不超过2M</p>
              </div>
            </Upload>
          </Col>

        </Row>
        <div slot="footer">
          <Button type="primary" @click="SubModal()">提交</Button>
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
    name: 'ModifyBrand'
  })
  export default class ModifyBrand extends Vue {
    @Emit() HandleResMsg(Type:number): void {}

    // 打开模态框
    private Trigger(SelectedData: Interface.BrandManageList[] ):void {
        this.SelecData = JSON.parse(JSON.stringify(SelectedData));
        this.UploadList.splice(0, this.UploadList.length)

        if (this.SelecData.length > 0 ) {
          this.OperateForm = JSON.parse(JSON.stringify(this.SelecData[0]));
          this.UploadList.push({ Status: 'Finished', Url: this.OperateForm.BrandLogo })
          this.IsUpload = false;
        } else {
          this.OperateForm = new Interface.BrandManageList()
          this.IsUpload = true;
        }

        this.$nextTick(function() {
          this.$set(this,'ModifyBrandModal', true);
        })
    }
    // 回调打开添加模态框
    private OpenModifyBrandModal():void {
      this.HandleResMsg(2);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ModifyBrandModal', false);
      this.HandleResMsg(Val);
    }

    // 删除上传图片
    private HandleRemove(File: any):void {
      if (this.UploadList.length != 0) {
        this.UploadList.splice(0, this.UploadList.length)
      }
      this.OperateForm.BrandLogo = "";
      this.IsUpload = true;
    }
    // 上传图片成功
    private HandleSuccess(Res: any, File: any) {
      if (Res.IsSuccess == true) {
        File.Url = Res.Data.Url;
        this.OperateForm.BrandLogo = Res.Data.Url;
        this.UploadList.push(File);
        this.IsUpload = false;
      } else {
        this.$Request.Error(Res);
      }
    }
    // 验证上传图片
    private HandleFormatError(File: any):void {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件${File.name}格式不正确，请上传 jpg、 png 或 jpeg 格式的图片。`
      });
    }
    // 验证上传图片
    private HandleMaxSize(File: any):void {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: `文件${File.name}太大，不能超过 2M。`
      }); 
    }
    // 提交模态框
    private SubModal():void{
      (this.$refs['OperateForm'] as any).validate( (Valid: boolean) => {
        if (Valid) {
          if (this.OperateForm.BrandLogo === "") {
            this.$UI.Tips.Floating('warning', '请上传品牌LOGO');
            return 
          }
          // 添加
          if ( this.SelecData.length === 0 ) {
            this.OperateForm.CreateTime = new Date()
          }

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Purchase,
            Api: {
              Address: this.SelecData.length > 0 ? this.$Api.BrandModify : this.$Api.BrandCreate,
              Login: true
            },
            Data: this.OperateForm,
            Callback: (Res: PInterface.Res): void => {
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating('success',  this.SelecData.length > 0 ? '修改品牌成功' : '添加品牌成功');
                this.ClearModal( 1 );
              } else {
                this.$Request.Error(Res);
              }
            }
          }) 
        }
      })

      
    }

    private UploadList: any[] = []; // 上传图片 数组
    private IsUpload: boolean = true; // 控件展示

    private SelecData: Interface.BrandManageList[] = []; // 选中数据
    private ModifyBrandModal: boolean = false; // 当前模态框
    private UploadImgServer: string = this.$Server.Settings + this.$Api.UploadImage; // 上传图片 地址

    private OperateForm: Interface.BrandManageList = new Interface.BrandManageList();  // 表格数据
    private OperateFormRule: any = {
      BrandName: [{required: true, message: '请输入品牌名称' }]
    }
  }


</script>
<style lang="less">
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
  width: 145px;
  height: 145px;
  margin: 0 auto;
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: -webkit-flex;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 145px;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
</style>