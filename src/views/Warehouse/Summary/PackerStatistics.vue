<!--打包员绩效-->
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
            <Select class="P-W-200 P-ML-10" placeholder="打包类型" v-model="SearchForm.ItemType" :options="DropItemType" />
            <!-- <Select class="P-W-200 P-ML-10" placeholder="仓库" @on-change="OnClearSelect('WareHouseId')" v-model="SearchForm.WareHouseId" filterable clearable>
              <Option v-for="Item in DropWarehouseList" :value="Item.Value" :key="Item.Value">{{ Item.Key }}</Option>
            </Select>
            <Select class="P-W-200 P-ML-10" placeholder="打包类型" @on-change="OnClearSelect('ItemType')" v-model="SearchForm.ItemType" filterable clearable>
              <Option v-for="(Item, Index) in DropItemType" :key="Index" :value="$Enums.Warehouse.ItemTypeSimple[Item]">{{ Item }}</Option>
            </Select> -->
            <span class="P-ML-10 P-Inline-Block">打包时间：</span>
            <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.PackBeginTime" type="datetime" placeholder="开始时间"></DatePicker>
            <span class="P-ML-5 P-Inline-Block">-</span>
            <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.PackEndTime" type="datetime" placeholder="结束时间"></DatePicker>
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
  name: 'PackerStatistics'
})
export default class PackerStatistics extends Vue {
	private mounted() :void {
    this.GetPoints();
  }

  // 初始化
  private async GetPoints() {
    this.$UI.Loading.Show();
    this.$set(this, 'DropWarehouseList', await this.GetDropList<number[], PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, [1] ))
    this.GetList();
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取 仓库 下拉 
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
    SearchGroup.PackBeginTime = this.$UI["Render"].NewDate(SearchGroup.PackBeginTime, true)
		SearchGroup.PackEndTime = this.$UI["Render"].NewDate(SearchGroup.PackEndTime, true)
		SearchGroup.WareHouseId = SearchGroup.WareHouseId === "" ? 0 : SearchGroup.WareHouseId
		SearchGroup.ItemType = SearchGroup.ItemType === "" ? 0 : SearchGroup.ItemType
    const StartStamp = new Date(this.SearchForm.PackBeginTime).getTime()
    const EndStamp = new Date(this.SearchForm.PackEndTime).getTime()
    if (this.SearchForm.PackBeginTime === "" || this.SearchForm.PackEndTime === "") {
      this.$UI.Tips.Floating('warning', '请选择打包时间范围')
      return
    }

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
				Address: this.$Api.UpPackUserPerformance,
				Login: true
			},
			Data: SearchGroup,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.List.push(...Res.Data.Data);
          
          if (this.List.length > 0) {
            const temp = {
              Name: '总计',
              Number: this.List
                .map((Item: Interface.PackerStatisticsList):number => Item.Number)
                .reduce((Acc: number, Cur:number):number => Acc + Cur )
            }
            this.List.push(temp);
          }

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
    this.$set(this, 'SearchForm', new Interface.PackerStatisticsSearch())
		this.GetList();
  }
  
	
	// 计算列表高度
	private CalculateTbHeight(): number {
		return (window.innerHeight - 170);
	}
	private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private SearchForm : Interface.PackerStatisticsSearch = new Interface.PackerStatisticsSearch()  //筛选数据

  private DropItemType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ItemTypeSimple); // 平台

	private List: Interface.PackerStatisticsList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
    { title: '编号', width: 80, render: (h, params) => {
        return h('span', params.row.Name === '总计'  ? '' : (params.index + 1))
      }
    },
		{ title: '打包员', key: 'Name' },
		{ title: '打包数量', key: 'Number', width: 500, render: (h, params) => {
      return h('span', {
        attrs: { class: params.row.Name === '总计'  ? 'P-Text-Error' : '' }
      }, params.row.Number)}
    }
	]
}

</script>
<style lang="less"></style>

