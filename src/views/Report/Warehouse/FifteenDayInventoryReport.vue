<!--十五天库存-->
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
            <span class="P-ML-10 P-Inline-Block">时间区间：</span>
            <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="开始时间"></DatePicker>
            <span class="P-ML-10 P-Inline-Block">-</span>
            <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="结束时间"></DatePicker>
            </Col>
          </Dropdown>
          <FormItem class="P-ML-10 P-MB-10">
            <Button type="primary" @click="SearchList">搜索</Button>
            <Button class="P-ML-10" type="warning" @click="ResetList">重置</Button>
          </FormItem>
        </Form>
      </Row>
		</Col>
    <Col span="24">
      <ExportFifteenDayReport
        v-if="Powers.ExportInventoryCheckLogList"
        :DropWarehouseList="DropWarehouseList"
      />
    </Col>
		<Col span="24">
      <div v-show="!IsCharts"></div>
      <div v-show="IsCharts">
        <div ref="EChartsDom" :style="{height:CalculateTbHeight() + 'px'}"></div>
      </div>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';

const ECharts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/theme/macarons')

@Component({
  name: 'FifteenDayInventoryReport',
  components: {
    ExportFifteenDayReport: () => import('@/components/Report/Warehouse/ExportFifteenDayReport.vue')
  }
})
export default class FifteenDayInventoryReport extends Vue {
	private mounted() :void {
    this.GetPoints();
  }

  // 初始化
  private async GetPoints() {
    this.$UI.Loading.Show();
    this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["ExportInventoryCheckLogList"]));
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
    SearchGroup.StartTime = this.$UI["Render"].NewDate(SearchGroup.StartTime, true)
		SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
		SearchGroup.WareHouseId = SearchGroup.WareHouseId === "" ? 0 : SearchGroup.WareHouseId
    const StartStamp = new Date(this.SearchForm.StartTime).getTime()
    const EndStamp = new Date(this.SearchForm.EndTime).getTime()
    if (this.SearchForm.StartTime === "" || this.SearchForm.EndTime === "") {
      this.$UI.Tips.Floating('warning', '请选择时间范围')
      return
    }

    if(StartStamp > EndStamp){
      this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
      return;
    }

    if ((EndStamp - StartStamp) / 86400000 > 31) {
      this.$UI.Tips.Floating('warning', '仅支持筛选31天的数据')
      return;
    }
		this.$set(this, 'AccurateSearch', false);
    
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.GetInventoryCheckLogListChart,
				Login: true
			},
			Data: SearchGroup,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if ( this.CheckedDataLength(Res.Data.PageModel.lossList) || this.CheckedDataLength(Res.Data.PageModel.surplusList) ) {
              this.InventoryReport.Data = Res.Data.PageModel;
              this.IsCharts = true;
              this.RenderECharts()
            } else {
              this.IsCharts = false;
            }

				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  // 审阅数据
  private CheckedDataLength(DataModel: any): boolean {
    for (let Item in DataModel) {
      if (DataModel[Item].Amount > 0) {
        return true
      }
    }
    return false
  }

  // 绘制图表
  private RenderECharts():void {

    this.InventoryReport.XAxis = [];
    this.InventoryReport.LossListData = [];
    this.InventoryReport.SurplusListData = [];

    if (this.InventoryReport.Data.lossList.length > 0 || this.InventoryReport.data.surplusList.length ) {
      let ReportData = this.InventoryReport.Data
      let Length = ReportData.lossList.length || ReportData.surplusList.length;
      // 反转数组
      ReportData.lossList.reverse()
      ReportData.surplusList.reverse()
      for ( let i=0; i < Length; i++) {
        this.InventoryReport.XAxis.push(ReportData.lossList[i].OperateDate.slice(ReportData.lossList[i].OperateDate.indexOf('-') + 1));
        this.InventoryReport.LossListData.push(ReportData.lossList[i].Amount);
        this.InventoryReport.SurplusListData.push(ReportData.surplusList[i].Amount);
      }
      this.InventoryReport.ChartTitle = (ReportData.lossList[0].OperateDate).split('-').join('/') + ' - ' + (ReportData.lossList[ReportData.lossList.length - 1].OperateDate).split('-').join('/')
    }

    // 动态创建y轴
    const Content = [{
      name: '盘亏金额',
      type: 'line',
      smooth: true,
      data: this.InventoryReport.LossListData
    }, {
      name: '盘盈金额',
      type: 'line',
      smooth: true,
      data: this.InventoryReport.SurplusListData
    }];
    //绘制图表
    const Option = {
      color: ['#675bba', 'rgb(85,193,195)'],
      tooltip: {
        trigger: 'axis'
      },
      title: {
        show: true,
        text: this.InventoryReport.ChartTitle,
        y: 'bottom',
        x: 'center'
      },
      calculable: true,
      legend: {
        data: ['盘亏金额', '盘盈金额']
      },
      xAxis: [{
        name: '日期',
        type: 'category',
        data: this.InventoryReport.XAxis
      }],
      yAxis: {
        name: '金额（CNY）',
        type: 'value'
      },
      series: Content
    };

    this.$nextTick(function(){
      ECharts.init(this.$refs.EChartsDom, 'macarons').setOption(Option);
    })
  }
  
	//搜索
  private SearchList(): void{
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
    this.$set(this, 'SearchForm', new Interface.FifteenDayReportSearch())
		this.GetList();
  }
  
	
	// 计算列表高度
	private CalculateTbHeight(): number {
		return (window.innerHeight - 210);
  }

	private Powers: PInterface.Power = {}  // 权限
  
  private IsCharts: boolean = false // 是否存在图表渲染
  private InventoryReport:any = {
    Data: null,
    XAxis: [],
    LossListData: [],
    SurplusListData: [],
    ChartTitle: ""
  }

	private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private SearchForm : Interface.FifteenDayReportSearch = new Interface.FifteenDayReportSearch()  //筛选数据

}

</script>
<style lang="less"></style>

