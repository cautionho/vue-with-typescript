<!--国家出库汇总-->
<template>
	<Row>
		<Col span="24">
      <Row class="P-Search-Group">
        <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
          <Dropdown trigger="custom" :visible="AccurateSearch">
            <Button type="primary" @click="TriggerSearch">
              精准搜索
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <Col span="24" slot="list" class="P-P-10">
              <Select class="P-W-200 P-ML-10" placeholder="仓库" v-model="SearchForm.WareHouseId" :options="DropWarehouseList" />
              <Select class="P-W-200 P-ML-10" placeholder="物流渠道" v-model="SearchForm.ShippingMethodId" :options="DropShippingMethodList" />
              <span class="P-ML-10 P-Inline-Block">发货时间：</span>
              <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.ShipBeginTime" type="datetime" placeholder="开始时间"></DatePicker>
              <span class="P-ML-5 P-Inline-Block">-</span>
              <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.ShipEndTime" type="datetime" placeholder="结束时间"></DatePicker>
              <Select class="P-W-200 P-ML-10" placeholder="国家" v-model="SearchForm.Country" :options="DropCountryList" />
              <Select class="P-W-200 P-ML-10" placeholder="平台" :onChange="OnClearSelect('Platform')" v-model="SearchForm.Platform" :options="DropPlatform" />
              <Select class="P-W-200 P-ML-10" placeholder="店铺 " :onChange="OnClearSelect('StoreId')" v-model="SearchForm.StoreId" :options="DropStoreList" />
            </Col>
          </Dropdown>
          <FormItem class="P-MB-10 P-ML-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.PickUserName">
              <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <FormItem class="P-ML-10 P-MB-10">
            <Button type="warning" @click="ResetList">重置</Button>
          </FormItem>
        </Form>
      </Row>
		</Col>
		<Col span="24">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'CountryOutSum'
})
export default class CountryOutSum extends Vue {
	private mounted() :void {
    this.GetPoints();
  }

  // 初始化
  private async GetPoints() {
    this.$UI.Loading.Show();
    this.$set(this, 'DropWarehouseList', await this.GetDropList<string, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, ""))
    this.$set(this, 'DropShippingMethodListBefore', await this.GetDropList<number, PInterface.KV>(this.$Server.Logistics, this.$Api.ChannelDropList, 50))
    this.$set(this, 'DropCountryListBefore', await this.GetDropList<string, PInterface.KV>(this.$Server.Settings, this.$Api.CountryList, ""))
    this.GetList();
  }

  get DropCountryList(): PInterface.KV[] {
    return this.DropCountryListBefore.map(Item => { 
      return { 
        Value: Item.CountryCode, 
        Key: Item.CountryNameCn
      } 
    });
  }

  get DropShippingMethodList(): PInterface.KV[] {
    return this.DropShippingMethodListBefore.map(Item => { 
      return { 
        Value: Item.Id, 
        Key: Item.Name
      } 
    })
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private async OnClearSelect(S: string): Promise<void>{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
    if (S === 'Platform' && this.SearchForm.Platform.toString() !== '') {
      this.$set(this, 'DropStoreList', await this.GetDropList<string, PInterface.KV>(this.$Server.Sales, this.$Api.Sales[this.SearchForm.Platform].StoreDrop, ""))
      this.$set(this.SearchForm, 'StoreId', '');
    } else if ( S === 'WareHouseId' && this.SearchForm.WareHouseId.toString() !== '') {
      this.$set(this, 'DropShippingMethodListBefore', await this.GetDropList<number, PInterface.KV>(this.$Server.Logistics, this.$Api.ChannelDropList, this.SearchForm.WareHouseId))
      this.$set(this.SearchForm, 'ShippingMethodId', '');
    }
  }

  // 获取 仓库 物流渠道 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (!Res.IsSuccess) this.$Request.Error(Res);
          resolve( Res.Data.DropList || [] )
		  	}
	  	})
    })
  }

	//获取列表
  private GetList(): void{
    let SearchGroup: any = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.ShipBeginTime = this.$UI["Render"].NewDate(SearchGroup.ShipBeginTime, true)
		SearchGroup.ShipEndTime = this.$UI["Render"].NewDate(SearchGroup.ShipEndTime, true)
    const StartStamp = new Date(this.SearchForm.ShipBeginTime).getTime()
    const EndStamp = new Date(this.SearchForm.ShipEndTime).getTime()
    if(StartStamp > EndStamp){
      this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
      return;
    }

    if ((EndStamp - StartStamp) / 86400000 > 30) {
      this.$UI.Tips.Floating('warning', '仅支持筛选30天的数据')
      return;
    }
		this.$set(this, 'AccurateSearch', false);
    
		this.$set(this, 'List', [])
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.CountryShipedSummary,
				Login: true
			},
			Data: SearchGroup,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.List.push(...Res.Data.Data);
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
	
	//搜索
  private SearchList(): void{
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
    this.$set(this, 'SearchForm', new Interface.CountryOutSumSearch())
		this.GetList();
  }
  
	
	// 计算列表高度
	private CalculateTbHeight(): number {
		return (window.innerHeight - 170);
	}
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
	private DropShippingMethodListBefore: Interface.DropShippingMethodList[] = [];  // 物流渠道下拉 
  private DropCountryListBefore: Interface.DropCountryList[] = [];  // 国家下拉
  private DropStoreList: PInterface.KV[] = [];  // 店铺下拉
  private DropPlatform: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform); // 平台
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private SearchForm : Interface.CountryOutSumSearch = new Interface.CountryOutSumSearch()  //筛选数据

	private List: Interface.CountryOutSumList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
    { title: '编号', width: 80, type: 'index' },
		{ title: '国家', key: 'Key' },
		{ title: '订单数量', key: 'Value' }
	]
}

</script>
<style lang="less"></style>

