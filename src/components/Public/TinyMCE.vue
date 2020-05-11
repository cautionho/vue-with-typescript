<template>
	<Row>
    <Tinymce v-model="Content" :init="Init"></Tinymce>
	</Row>
</template>
<script lang="ts">
declare let tinymce: any;
import { Component, Vue, Prop } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';

import '@/assets/TinyMCE/tinymce'
import E from '@tinymce/tinymce-vue'
import '@/assets/TinyMCE/themes/silver'

import '@/assets/TinyMCE/plugins/image' // 插入上传图片插件
import '@/assets/TinyMCE/plugins/table' // 插入表格插件
import '@/assets/TinyMCE/plugins/lists' // 列表插件
import '@/assets/TinyMCE/plugins/wordcount' // 字数统计插件
import '@/assets/TinyMCE/plugins/pagebreak' // 分页插件
import '@/assets/TinyMCE/plugins/preview' // 预览插件
import '@/assets/TinyMCE/plugins/link' // 链接插件
import '@/assets/TinyMCE/plugins/directionality' // 方向插件
import '@/assets/TinyMCE/plugins/hr' // 方向插件
import '@/assets/TinyMCE/plugins/spellchecker' // 方向插件
import '@/assets/TinyMCE/plugins/insertdatetime' // 时间插件
import '@/assets/TinyMCE/plugins/fullscreen' // 全屏插件
import '@/assets/TinyMCE/plugins/paste' // 粘贴
import '@/assets/TinyMCE/plugins/code' // 代码

@Component({
  components: {
    Tinymce: E
  }
})

export default class Editor extends Vue {
  @Prop(Number) private DomHeight:number

  private mounted(){
    new tinymce.init({})
  }

  private FilePick(): void {

  }

  private UploadHandler(Info: any, Success:(V:string)=>void, Failure:(V:string)=>void): void{
    let F = new FormData()
    F.append('Image', Info.blob())
    this.$Request.Post({
      Server: `${this.$Server.Settings}`,
      Api: {
        Address: this.$Api.UploadImage,
        Login: true
      },
      Data: F,
      Form: true,
      Callback: (Res:PInterface.Res):void => {
        if(Res.IsSuccess){
          Success(`${this.$Server.File}/${Res.Data.Url}`)
        }else{
          Failure(Res.Msg || '')
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Plugins: string[] = [
   'lists image table wordcount pagebreak preview link directionality hr spellchecker insertdatetime fullscreen paste code',
  ]

  private Toolbar:string =  'fullscreen preview | undo redo cut copy paste selectall | code | spellcheck | image table link unlink | hr | pagebreak | insertdatetime | \
   bold italic underline strikethrough subscript superscript code | formatselect blockselct fontselect  fontsizeselect alignleft aligncenter alignright alignjustify | forecolor backcolor | removeformat | wordcount '
  
  
  private Init:any = {
    language_url: `/TinyMCE/langs/zh_CN.js`,
    language: 'zh_CN',
    skin_url: '/TinyMCE/skins/ui/oxide',  
    height: this.DomHeight || 300, 
    branding: false, 
    menubar: false, 
    plugins: this.Plugins,
    toolbar: this.Toolbar,
    file_picker_types:'image',
    image_prepend_url: `${this.$Server.Settings}${this.$Api.UploadImage}`,
    file_picker_callback: this.FilePick,
    images_upload_handler: this.UploadHandler,
    paste_data_images: true
  }

  private SetContent(Ctn: string): void {
    this.$set(this, 'Content', Ctn);
  }

  private GetContent():string {
    return this.Content;
  }

  private Content:string = ''
}

</script>
<style lang="less" scoped></style>
