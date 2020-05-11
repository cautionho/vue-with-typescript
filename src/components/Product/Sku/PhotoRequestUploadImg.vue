<!--拍摄需求 -> 批量上传图片组件-->
<template>
  <Col>
    <Modal v-model="IsShowModal" title="批量上传图片" @on-cancel="ChangeMsg(false)" :mask-closable="false" :width="500" id="PhotoRequestUploadImg">
      <Form onsubmit="return false" :label-width="100">
        <FormItem label="图片(仅支持jpg、png格式,大小不超过2M)：">
          <div class="demo-upload-list" v-for="(Item, Idx) in FileArr">
            <template>
            <img :src="$Server.File + '/' +Item">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="ShowBigImg(Item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="RemoveImg(Idx)"></Icon>
            </div>
            </template>
          </div>
          <Upload ref="uploadFile" class="P-Inline-Block P-VA-T P-Pointer" :show-upload-list="false" :action="UploadUrl" :headers="Headers" :max-size="2048" :accept="'.jpg, .jpge, .png'" :format="['jpg','jpeg','png']" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" :before-upload="UploadBefore" :on-success="UploadSuccess">
            <div style="width: 60px;height:60px;line-height: 60px;text-align: center; border: 1px dashed #dcdee2;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="PostOpe">提交</Button>
        <Button @click="ChangeMsg(false)">取消</Button>
      </div>
    </Modal>
    <ShowBigPic ref="ShowBigPic" />
  </Col>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'PhotoRequestUploadImg',
  components:{
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
  }
})
export default class PhotoRequestUploadImg extends Vue {
  @Emit() ChangeMsg(Res: boolean): void {
    this.FileArr = [];
    this.$set(this,'IsShowModal', false)
  }

  private TriggerModal(SelectedData: Interface.PhotoRequestList[]){
    this.CurrSeleData = SelectedData;
    this.IsShowModal = true;
  }

  private PostOpe(): void{
    if (this.FileArr.length < 1) {
			this.$UI.Tips.Floating('warning', `请上传图片`);
			return;
    }
    this.ChangeImg();

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PhotoRequestChangeStatus,
				Login: true
			},
			Data: {Id: this.CurrSeleData.map(Item=>Item.Id), Remark: "", Status: 3, Operator: 0},
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `操作成功`);
          this.ChangeMsg(true)
				} else {
					this.$Request.Error(Res);
				  this.$UI.Loading.Hide();
				}
			}
    });
  }

  private ChangeImg():void{
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PhotoRequestUpload,
				Login: true
			},
			Data: {Id: this.CurrSeleData.map(Item=>Item.Id), Images: this.FileArr },
			Callback: (Res: PInterface.Res): void => {
				if (!Res.IsSuccess) {
					this.$Request.Error(Res);
				}
			}
    });
  }

  private ShowBigImg(Url: string): void{
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }

  private RemoveImg(Idx: number): void{
    this.FileArr.splice(Idx, 1)
  }

  private UploadBefore(): void{
    this.$UI.Loading.Show();
  }

  private UploadSuccess(Res: PInterface.Res): void{
    if (Res.IsSuccess) {
      this.FileArr.push(Res.Data.Url)
      this.$UI.Loading.Hide();
      (this.$refs["uploadFile"] as any).clearFiles();
    }else{
      this.$Request.Error(Res);
    }
  }
  private HandleFormatError(File: any): void {
    this.$UI.Tips.Floating('warning', `文件[${File.name}]格式不为JPG/JPGE/PNG，请检查`);
    this.$UI.Loading.Hide();
  }
  private HandleMaxSize(File:any):void {
    this.$UI.Tips.Floating('warning', `文件${File.name}大小超过2M，请检查`);
    this.$UI.Loading.Hide();
  }

  private FileArr: string[] = [];
  private CurrSeleData: Interface.PhotoRequestList[] = [];
  private IsShowModal: boolean = false;
  private UploadUrl: string = this.$Server.Settings + this.$Api.UploadImage
  private Headers: any = {
    "userid": JSON.parse(this.$Cookie.Get('frler_user')).UserId
  }
}

</script>
<style lang="less">
  #PhotoRequestUploadImg{
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
  }
</style>
