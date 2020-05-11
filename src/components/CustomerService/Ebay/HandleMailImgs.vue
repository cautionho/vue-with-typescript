<template>
  <div class="P-Inline-Block">
    <Button type="primary" class="Badge-Btn" @click="Trigger">
      上传图片
      <Badge :count="Images.length" v-if="Images.length">
        <a href="#" class="demo-badge"></a>
      </Badge>
    </Button>
    <Modal v-model="MailImgsModal" title="上传图片" :width="600" @on-cancel="CancelModal">
      <div class="P-Inline-Block P-Uploader-Img" v-for="(Item, Index) in Images" :key="Index">
        <img class="P-Uploader-Img" :src="`${$Server.File}/${Item}`" @click="$refs.BigPic.Trigger(`${$Server.File}/${Item}`)" />
        <Icon class="P-Uploader-Del" type="md-close-circle" size="20" @click="UploaderDel(Index)"></Icon>
      </div>
      <Upload v-show="Images.length < 5" :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})" :show-upload-list="false" :on-success="HandleUploadSuccess" :accept="'.jpg, .jpge, .png'" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" :before-upload="HandleBeforeUpload" multiple :action="`${$Server.Settings}${$Api.UploadImage}`" class="P-Uploader P-Inline-Block P-VA-T">
        <div class="P-Uploader-Img">
          <Icon type="md-add" size="20"></Icon>
        </div>
      </Upload>
      <p class="P-MT-5">最多上传5张大小在2M内且格式为PNG或JPG格式的图片</p>
      <footer slot="footer">
        <Button type="primary" @click="CancelModal">确定</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
      <BigPic ref="BigPic" />
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';

@Component({
  name: 'HandleMailImgs',
  components: {
    BigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})

export default class HandleMailImgs extends Vue {
  private Trigger(): void {
    this.$set(this, 'MailImgsModal', true)
  }
  
  /* 上传文件 */
  private HandleUploadSuccess(Res: PInterface.Res, File: any, FileList: any[]): void {
    if(Res.IsSuccess){
      this.Images.push(Res.Data.Url);
    }else{
      this.$Request.Error(Res);
    }
    this.CountUploadQty()
  }
  private HandleFormatError(File: any): void {
    this.$UI.Tips.Floating('warning', `文件[${File.name}]格式不为JPG/JPGE/PNG，请检查`);
    this.CountUploadQty()
  }
  private HandleMaxSize(File: any, FileList: any[]): void {
    this.$UI.Tips.Floating('warning', `文件${File.name}大小超过2M，请检查`);
    this.CountUploadQty()
  }
  private HandleBeforeUpload(File: any): void | boolean {
    if(this.UploadQty === 0){
      this.$UI.Loading.Show();
    }
    // 超过5张不再继续上传
    if(this.UploadQty + this.Images.length >= 5){
      return false
    }
    this.UploadQty++;
  }

  private CountUploadQty(): void {
    this.UploadQty--;
    if(this.UploadQty <= 0){
      this.$UI.Loading.Hide();
    }
  }

  private UploaderDel(Idx: number): void {
    this.Images.splice(Idx, 1);
  }
  /* 上传文件 */

  private Reset(): void {
    console.log(123123)
    this.$set(this, 'Images', [])
    this.$set(this, 'UploadQty', 0);
  }

  private CancelModal(): void {
    this.$set(this, 'MailImgsModal', false)
  }
  
  private MailImgsModal: boolean = false
  private Images: string[] = []
  private UploadQty: number = 0
}
</script>

<style lang="less" scoped>
.Badge-Btn{
  position: relative;

  & .ivu-badge {
    position: absolute;
    top: 0px;
    right: 6px;
  }
}
</style>