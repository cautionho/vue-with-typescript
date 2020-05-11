<!--已确认毛利报表-->
<template>
	<GrossProfit :Flag="Num"></GrossProfit>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name:'ConfirmGrossProfit',
  components:{
    GrossProfit:() => import('./GrossProfit.vue')
  }
})
export default class ConfirmGrossProfit extends Vue {
  private Num: number = 2
}
</script>
<style lang="less">
</style>