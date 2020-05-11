<template>
  <Row>
    <Store :Platform="6" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'CdiscountStore'
})

export default class CdiscountStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['CdiscountStoreCreate','CdiscountStoreModify','CdiscountChangeUseApi','CdiscountChangeStatus']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>