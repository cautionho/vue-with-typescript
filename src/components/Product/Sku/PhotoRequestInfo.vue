<template>
  <Col class="PhotoRequestInfo">
  <Form onsubmit="return false" ref="InfoData" :model="InfoData" inline :label-width="100">
    <FormItem label="销售员：" class="P-W-49-Percent">
      <span>{{InfoData.CreatorName}}</span>
    </FormItem>
    <FormItem label="美工：" class="P-W-49-Percent">
      <span>{{InfoData.OperatorName}}</span>
    </FormItem>
    <FormItem label="SKU编号：" class="P-W-49-Percent">
      <span>{{InfoData.SkuCode}}</span>
    </FormItem>
    <FormItem label="申请时间：" class="P-W-49-Percent">
      <span>{{$UI.Render.Date(InfoData.CreateTime, true)}}</span>
    </FormItem>
    <FormItem label="参考链接：" class="P-W-100-Percent">
      <span>{{InfoData.DemoUrl}}</span>
    </FormItem>
    <FormItem label="备注：" class="P-W-100-Percent">
      <span>{{InfoData.Remark === "" ? '-' : InfoData.Remark}}</span>
    </FormItem>
    <FormItem label="图片：" class="P-W-100-Percent">
      <div v-if="InfoData.SkuImage.length > 0" class="demo-upload-list" v-for="(Item, Idx) in InfoData.SkuImage">
        <template>
        <img :src="$Server.File + '/' +Item">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="ShowBigImg(Item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="RemoveImg(Idx)" v-if="OpeStatus === 3"></Icon>
        </div>
        </template>
      </div>
      <div v-if="OpeStatus !== 3 && (!InfoData.SkuImage || !InfoData.SkuImage.length)">-</div>
      <Upload v-if="OpeStatus === 3" class="P-Inline-Block P-VA-T P-Pointer" ref="uploadFile" :show-upload-list="false" :action="UploadUrl" :headers="Headers" :max-size="2048" :on-exceeded-size="HandleMaxSize" :before-upload="UploadBefore" :on-success="UploadSuccess" :on-error="HandleError">
        <div style="width: 60px;height:60px;line-height: 60px;text-align: center; border: 1px dashed #dcdee2;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
    </FormItem>
  </Form>
  <ShowBigPic ref="ShowBigPic" />
  </Col>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'PhotoRequestInfo',
  components:{
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
  }
})
export default class PhotoRequestInfo extends Vue {
  @Prop() OpeStatus: number

  private ShowBigImg(Url: string): void{
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }

  private RemoveImg(Idx: number): void{
    this.IsChangeImg = true;
    this.InfoData.SkuImage.splice(Idx, 1);
    this.$forceUpdate();
  }

  private UploadBefore(): void{
    this.$UI.Loading.Show();
  }

  private UploadSuccess(Res: PInterface.Res): void{
    this.IsChangeImg = true;
    this.$UI.Loading.Hide();
    this.InfoData.SkuImage.push(Res.Data.Url);
    (this.$refs["uploadFile"] as any).clearFiles();
  }

  private HandleError(Errors: any, File:any): void {
    this.$UI.Loading.Hide();
    this.$UI.Tips.Modal({
      Type: 'warning',
      Content: Errors,
      Callback: (B:boolean):void =>{}
    })
  }

  private HandleMaxSize(File:any):void {
    this.$UI.Loading.Hide();
    this.HandleForm.Enclosure = "";
    this.$Notice.warning({
      title: '超出文件大小限制',
      desc: '文件 ' + File.name + ' 太大，不能超过 2M。'
    });
  }
  
  private InfoData: Interface.PhotoRequestList = new Interface.PhotoRequestList()

  private UploadUrl: string = this.$Server.Settings + this.$Api.UploadImage
  private IsChangeImg: boolean = false; //是否上传过图片
  private Headers: any = {
    "userid": JSON.parse(this.$Cookie.Get('frler_user')).UserId
  }
}

</script>
<style lang="less">
.PhotoRequestInfo{
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
