<template>
	<Menu mode="horizontal" theme="dark" active-name="1" @on-select="EmitTabs">
		<Submenu v-for="(item,index) in Menu" :key="index" :name="index" :class="item.ChildNods.length > 6 ? 'Max-Nav' : ''">
			<template slot="title">
				<Icon :type="item.ActionUrl" />
				{{item.ResourceName}}
			</template>
			<MenuGroup v-for="(itm,idx) in item.ChildNods" :key="idx" :title="itm.ResourceName">
				<MenuItem v-for="(t,d) in itm.ChildNods" :key="d" :name="JSON.stringify(t)">{{t.ResourceName}}</MenuItem>
			</MenuGroup>
		</Submenu>
		<UserMsg></UserMsg>
	</Menu>
</template>
<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import PInterface from '../assets/Interface/Public';
@Component({
	components: {
		UserMsg: () => import('./Admin/UserMsg.vue')
	}
})

export default class Nav extends Vue {
	/*选择导航 父组件打开*/
	@Emit() EmitTabs(arg: string): void {}

	/*钩子*/
	private mounted() {
		this.GetMenus()
	}

	/*methods*/
	private GetMenus() {
		if (!this.$Resource.Menu.length) {
			setTimeout(() => {
				this.GetMenus();
			}, 10);
		} else {
			this.Menu.push(...this.$Resource.Menu);
		}
	}

	/*数据源*/
	private Menu: PInterface.Resource[] = []
}

</script>
<style lang="less"></style>
