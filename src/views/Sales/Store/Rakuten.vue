<template>
  <Row>
    <Store :Platform="21" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'RakutenStore'
})

export default class RealDeStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['SaveRakutenStore','RakutenChangeUseApi','RakutenChangeStatus']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>