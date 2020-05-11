<template>
  <Row>
    <Store :Platform="1" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'EbayStore'
})

export default class EbayStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['EbayStoreAdd','EbayStoreModify','EbayChangeApi','EbayChangeStatus','EbayBindRedisDb','EbayPlatformLogin']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>