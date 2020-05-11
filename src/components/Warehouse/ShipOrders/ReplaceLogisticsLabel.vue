<template>
  <Col>
    <Button type="primary" @click="Trigger">更换面单</Button>
    <Modal v-model="ReplaceModal" title="更换面单" :mask-closable="false" @on-cancel="CancelModal">
      <!-- <Form :model="ReplaceLableInfo" ref="ExportShiped" :rules="ExportRules" :label-width="100" onsubmit="return false;" v-if="IsExportShiped"></Form> -->
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "ReplaceLogisticsLabel"
})
export default class ReplaceLogisticsLabel extends Vue {
  private Trigger():void {
    // console.log('ReplaceLogisticsLabel')
    this.$set(this, 'ReplaceModal', true);
  }

  private Validate():void {

  }

  private CancelModal():void {
    this.$set(this, 'ReplaceModal', false);
  }

  private ReplaceModal: boolean = false
  private ReplaceLableInfo: Interface.ReplaceLable = new Interface.ReplaceLable()
}
</script>