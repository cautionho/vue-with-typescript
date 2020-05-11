<template>
	<Row :gutter="0">
		<!-- <Col span="24">
		<Nav @emit-tabs="TriggerTabs"></Nav>
		</Col> -->
		<Col span="24" class="Container-Tabs P-P-10">
    <router-view />
		<!-- <Tabs type="card" name="IndexTabs" closable :animated="false" :value="ActiveTab" @on-click="ClickTabs" @on-tab-remove="RemoveTabs" :before-remove="BeforeRemove">
			<TabPane label="控制面板" :closable="false" name="Control" tab="IndexTabs">
				<Control v-if="Flag"></Control>
			</TabPane>
			<TabPane :label="item.Key" :key="index" v-for="(item,index) in TabsList" :name="item.Value" tab="IndexTabs">
				<keep-alive>
					<component v-bind:is="item.Value"></component>
				</keep-alive>
			</TabPane>
		</Tabs> -->
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import PInterface from '../assets/Interface/Public';

@Component({
	components: {
		Nav: () => import('../components/Nav.vue')
	}
})
export default class Index extends Vue {
	private TabsList: PInterface.KV[] = []

	private ActiveTab: string = 'Control'

	private mounted() {
		this.GetResources();
	}

	// 获取用户权限
	private GetResources() {
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Login: true,
				Address: this.$Api.GetUserResource
			},
			Data: "",
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.$Resource.SetResources(res.Data);
					this.$set(this, 'Flag', true)
				} else {
					this.$Request.Error(res);
				}
			}
		})
	}

	// 触发Tab
	private TriggerTabs(n: string) {
		const M: PInterface.Resource = JSON.parse(n),
			Active: PInterface.KV = {
				Key: M.ResourceName,
				Value: M.ActionUrl
			},
			Flag = this.TabsList.find((elem: PInterface.KV): boolean => { return elem.Key === Active.Key && elem.Value === Active.Value; });
		if (!Flag) {
			this.TabsList.push(Active);
		}
    this.$set(this, 'ActiveTab', M.ActionUrl);
	}

	// 切换tab
	private ClickTabs(n: string) {
		this.$set(this, 'ActiveTab', n);
	}

	private BeforeRemove(n: number) {
		this.RemoveTabs(Number(n - 1));
		return new Promise((resolve) => {});
	}

	// 移除Tab
	private RemoveTabs(n: number): void {
		if (this.TabsList.length <= 1) {
			this.ActiveTab = 'Control';
			this.$set(this, 'TabsList', []);
		} else {
			if (this.TabsList.length === 1) {
				this.ActiveTab = 'Control';
				this.$set(this, 'TabsList', []);
			} else {
				// 移除的是当前激活的Tab 要修改激活Tab
				if (this.ActiveTab === this.TabsList[n].Value) {
					if (n === this.TabsList.length - 1) {
						this.ActiveTab = (this.TabsList[n - 1] as any).Value;
					} else {
						this.ActiveTab = (this.TabsList[n + 1] as any).Value;
					}
				}
				this.TabsList.splice(n, 1);
			}
		}
	}

	private Flag: boolean = false;
}

</script>
<style lang="less">
</style>
