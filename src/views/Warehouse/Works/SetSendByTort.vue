<!-- 侵权订单设置发货 -->
<template>
	<SetSend :Flag="Num"></SetSend>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name:'SetSendByTort',
  components:{
    SetSend:() => import('./SetSend.vue')
  }
})
export default class SetSendByTort extends Vue {
  private Num: number = 2 
}
</script>
<style lang="less">
</style>
