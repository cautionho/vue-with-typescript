<!-- 海外多仓规则 -->
<template>
    <Tabs size="small"  :animated="false" name='AbroadWarehouseRules'>
        <TabPane label="产品设置" name="name1" tab='AbroadWarehouseRules'>
        	<AbroadWarehouseRulesSettings  :Type="'Product'" :DropAbroadWarehouse="DropAbroadWarehouse" />
        </TabPane>
        <TabPane label="备货设置" name="name2" tab='AbroadWarehouseRules'>
        	<AbroadWarehouseRulesSettings :Type="'StockUp'" :DropAbroadWarehouse="DropAbroadWarehouse" />
        </TabPane>
    </Tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';

@Component({
  name: 'AbroadWarehouseRules',
  components: {
    AbroadWarehouseRulesSettings: () => import('@/components/Warehouse/Settings/AbroadWarehouseRulesSettings.vue')
	}
})
export default class AbroadWarehouseRules extends Vue {
  private mounted() :void {
    this.GetPoints()
  }
  /* methods Start */
	//获取下拉
  private async GetPoints(): Promise<void> {
    this.$set(this, 'DropAbroadWarehouse', await this.GetDropList<string, PInterface.KV[]>(this.$Server.Settings, this.$Api.OverseawhDropList, '') )
  }
  // 获取 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (!Res.IsSuccess) {
            this.$Request.Error(Res);
		  		}
		  		resolve( Res.Data.DropList || [] )
		  	}
	  	})
    })
  }
  
  private DropAbroadWarehouse: PInterface.KV[] = []; // 海外仓库下拉
}
</script>