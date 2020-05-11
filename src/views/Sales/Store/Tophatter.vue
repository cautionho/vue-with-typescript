<template>
  <Row>
    <Store :Platform="11" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'TophatterStore'
})

export default class TophatterStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['TophatterStoreCreate','TophatterStoreModify','TophatterChangeUseApi','TophatterChangeStatus']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>