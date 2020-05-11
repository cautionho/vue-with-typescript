<template>
  <Row>
    <Store :Platform="10" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'TopbuyStore'
})

export default class TopbuyStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['TopBuyCreate','TopBuyModify','TopBuyChangeUseApi','TopBuyChangeStatus']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>