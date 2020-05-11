<!--质检员绩效-->
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
          <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" v-model="SearchForm.WareHouseId" :options="WarehouseDropList" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选仓库" @on-change="OnClearSelect('WareHouseId')" v-model="SearchForm.WareHouseId" filterable clearable>
						<Option v-for="(item,index) in WarehouseDropList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select> -->
          <span class="P-ML-10 P-Inline-Block">质检时间：</span>
          <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.BeginTime" type="datetime" placeholder="入库开始日期"></DatePicker>
          <span class="P-ML-5 P-Inline-Block">-</span>
          <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="入库结束日期"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="质检员名称" class="P-W-300" v-model="SearchForm.QaUserName" @on-enter="SearchList">
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
import Interface from '@/assets/Interface/Purchase';
@Component({
	name: 'QualitPerformance' 
})
export default class QualitPerformance extends Vue {
	private mounted() :void {
    this.$set(this.SearchForm, 'BeginTime', new Date(new Date(new Date().toLocaleDateString()).getTime()))
    this.$set(this.SearchForm, 'EndTime', new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1))
    this.GetDropList()
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
  
  private GetDropList():void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: [1],
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.WarehouseDropList = Res.Data.DropList
        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
        this.GetList()
      }
    })
  }

	//获取列表
  private GetList(): void{
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.BeginTime = this.$UI["Render"].NewDate(SearchGroup.BeginTime, true)
		SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
		SearchGroup.WareHouseId = SearchGroup.WareHouseId === "" ? 0 : SearchGroup.WareHouseId
    let StartStamp = new Date(this.SearchForm.BeginTime).getTime()
    let EndStamp = new Date(this.SearchForm.EndTime).getTime()
    if (this.SearchForm.BeginTime == "" || this.SearchForm.EndTime == "") {
      this.$UI.Tips.Floating('warning', '请选择入库时间范围')
      return
    }

    if(StartStamp>EndStamp){
      this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
      return;
    }

    if ((EndStamp - StartStamp) / 86400000 > 30) {
      this.$UI.Tips.Floating('warning', '仅支持筛选30天的数据')
      return
    }
		this.$set(this, 'AccurateSearch', false);
    
		this.$set(this, 'List', [])
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.StatisticsQaPerformance,
				Login: true
			},
			Data: SearchGroup,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if(Res.Data.Data.length>0){
            this.List = Res.Data.Data
            this.SumLast()
        	}
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  private SumLast(): void{
    	let Obj ={
    		Name: '总计',
        Number: 0,
        IsEnd: true
    	}
    	for(let i = 0,len = this.List.length;i < len;i++){
    		Obj.Number += this.List[i].Number
    	}
    	this.List.push(Obj)
    }
	
	//搜索
  private SearchList(): void{
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
    this.$set(this, 'SearchForm', new Interface.WarePerformanceSearch())
    this.$set(this.SearchForm, 'BeginTime', new Date(new Date(new Date().toLocaleDateString()).getTime()))
    this.$set(this.SearchForm, 'EndTime', new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1))
		this.GetList();
	}
	
	//获取列表高度
	private CalculateTbHeight(): number {
		return (window.innerHeight - 190);
	}
	
	private WarehouseDropList: PInterface.KV[] = [];  // 仓库下拉
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
	private SearchForm : Interface.WarePerformanceSearch = new Interface.WarePerformanceSearch()  //筛选数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
	private List: Interface.WarePerformance[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '编号', render: (h: any, params: any): string => {
        let MaxLen = this.List.length;
        return h('span', params.row.IsEnd ? '' : (params.index + 1))
      }
    },
		{ title: '入库员', key: 'Name' },
		{ title: '数量', key: 'Number', render: (h, params) => {
        return h('span', {
          class: params.row.IsEnd ? 'P-Text-Error' : ''
        }, params.row.Number)
      }
    }
	]
}

</script>
<style lang="less"></style>

