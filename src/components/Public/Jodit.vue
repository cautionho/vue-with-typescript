<template>
	<Row>
    <textarea :id="EdtId"></textarea>
	</Row>
</template>
<script lang="ts">
declare let Jodit: any;
import { Component, Vue, Prop } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';

import '@/assets/Jodit/build/jodit.min.css'
import '@/assets/Jodit/build/jodit'

@Component({})

export default class JoditEditor extends Vue {
  @Prop(Number) private DomHeight:number

  private mounted(){
    this.JoditEdt = new Jodit(`#${this.EdtId}`, {
      height: `${this.DomHeight || 300}px`,
      toolbarAdaptive: false,
      uploader: {
        url: `${this.$Server.Settings}${this.$Api.UploadImage}`
      },
      events: {
        click: this.ChangeSelection,
        keyup: this.ChangeSelection
      }
    });
  }

  private SetContent(Ctn: string): void {
    this.JoditEdt.value = Ctn
  }

  /* 监听光标移动位置 */
  private ChangeSelection(): void {
    this.SelectionStart = this.JoditEdt.selection.range.startOffset
    this.SelectionEnd = this.JoditEdt.selection.range.endOffset
    if(this.JoditEdt.selection.range.nodeType === 1 && this.JoditEdt.selection.range.commonAncestorContainer.classList.value.includes('jodit_wysiwyg')){
      this.SelectionEle = ''
    }else{
      this.SelectionEle = this.JoditEdt.selection.range.commonAncestorContainer.parentElement
    }
  }

  /* 从光标位置插入数据 */
  private InsertCtn(Ctn: string): void {
    if(!this.SelectionEle){
      this.SetContent(`${this.JoditEdt.value}${Ctn}`)
    }else{
      const Childs = this.JoditEdt.editor.childNodes, 
        Idx = Array.from(Childs).findIndex((Itm : any) => Itm === this.SelectionEle);
      if(Idx < 0){
        this.SetContent(`${this.JoditEdt.value.slice(0, this.SelectionStart)}${Ctn}${this.JoditEdt.value.slice(this.SelectionEnd)}`)
      }else{
        Childs[Idx].innerText = `${this.SelectionEle.innerText.slice(0, this.SelectionStart)}${Ctn}${this.SelectionEle.innerText.slice(this.SelectionEnd)}`
      }
    }
    this.SelectionStart += Ctn.length
    this.SelectionEnd += Ctn.length
  }

  private GetContent():string {
    return this.JoditEdt.value
  }

  private EdtId: string = `Jodit${String(new Date().getTime())}`
  private JoditEdt: any = null

  private SelectionStart: number = 0
  private SelectionEnd: number = 0
  private SelectionEle: any = ""
}

</script>
<style lang="less" scoped></style>
