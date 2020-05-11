<!--预算毛利报表-->
<template>
	<GrossProfit :Flag="Num"></GrossProfit>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name:'BudgetGrossProfit',
  components:{
    GrossProfit:() => import('./GrossProfit.vue')
  }
})
export default class BudgetGrossProfit extends Vue {
  private Num: number = 1
}
</script>
<style lang="less">
</style>