<template>
	<Transactions :Flag="Flag" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Finance';
@Component({
	name: 'PayManage',
	components:{
		Transactions: () => import('./Transactions.vue')
	}
})
export default class PayManage extends Vue {
	private Flag: number = 1
}

</script>
<style lang="less"></style>
