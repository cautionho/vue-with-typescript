<template>
  <Row>
    <Store :Platform="17" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'AllegroStore'
})

export default class AllegroStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['AllegroStoreSave','AllegroChangeApi','AllegroChangeStatus','AllegroStoreLocation']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>