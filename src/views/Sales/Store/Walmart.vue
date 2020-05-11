<template>
  <Row>
    <Store :Platform="5" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'WalmartStore'
})

export default class WalmartStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['walmartStoreCreate','walmartStoreModify','walmartChangeStatus','walmartChangeUseApi']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>