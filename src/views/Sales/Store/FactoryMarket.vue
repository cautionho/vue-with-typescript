<template>
  <Row>
    <Store :Platform="12" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'FactoryMarketStore'
})

export default class FactoryMarketStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['FactoryMarketStoreCreate','FactoryMarketStoreModify','FactoryMarketStoreUseApi','FactoryMarketStoreStatus']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>