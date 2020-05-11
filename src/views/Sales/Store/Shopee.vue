<template>
  <Row>
    <Store :Platform="4" :Powers="Powers"></Store>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public';

@Component({
  name:'ShopeeStore'
})

export default class ShopeeStore extends Vue {
  private mounted():void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ShopeeStoreAdd','ShopeeStoreModify','ShopeeChangeApi','ShopeeChangeStatus']))
  }

  private Powers:PInterface.Power = {}
}
</script>
<style lang="less" scoped></style>