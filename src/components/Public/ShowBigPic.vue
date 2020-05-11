<!-- 查看大图组件 -->
<template class="Big-Pic-Container">
  <Modal v-model="PicModal" :width="600" @on-cancel="CancelModal" :mask-closable="true" >
    <img :src="ImageSrc" class="Pic-Style">
    <footer slot="footer"></footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
@Component({
  name: 'ShowBigPic'
})
export default class ShowBigPic extends Vue {
  private Trigger(Url:string, IsCompleteUrl?: boolean):void {
    this.$set(this,'PicModal',true);
    this.ImageSrc = IsCompleteUrl || Url.startsWith('http') ? Url : `${this.$Server.File}/${Url}`
  }
  
  private CancelModal():void {
    this.$set(this,'PicModal',false);
    this.$set(this,'ImageSrc','');
  }

  private ImageSrc:string = ""
  private PicModal:boolean = false
  
}

</script>
<style lang="less" scoped>
.Big-Pic-Container {
  z-index: 999999999;
}

.Pic-Style {
  display: block;
  margin: 0 auto;
  max-width: 500px;
  max-height: 600px;
}

</style>
