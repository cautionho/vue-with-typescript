<!-- 普通设置发货 -->
<template>
	<SetSend :Flag="Num"></SetSend>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name:'SetSendNormal',
  components:{
    SetSend:() => import('./SetSend.vue')
  }
})
export default class SetSendNormal extends Vue {
  private Num: number = 1
}
</script>
<style lang="less">
</style>