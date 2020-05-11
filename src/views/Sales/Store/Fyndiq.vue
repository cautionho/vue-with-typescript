<template>
  <Row>
    <Store :Platform="9" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'FyndiqStore'
})

export default class FyndiqStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['FyndiqStoreCreate','FyndiqStoreModify','FyndiqChangeStatus','FyndiqChangeUseApi']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>