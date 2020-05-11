<!-- 销售统计报表组件 -->
<template>
  <Row class="SalesReport">
    <Collapse @on-change="ChangeReport">
      <Panel hide-arrow name="SalesReport" class="Box-Shadow">
        <span class="P-Text-Info P-FZ-16 P-FW-Bold">销售统计报表</span>
        <div slot="content" class="WrapWidth">
          <div v-if="!IsChart" style="width:100%;height:400px;display:-webkit-flex;display:flex;justify-content:center;align-items:center;">
            暂无数据
          </div>
          <div v-show="IsChart" ref="ChartsDom" class="P-W-100-Percent"></div>
        </div>
      </Panel>
    </Collapse>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';
const Echarts = require('echarts');

@Component({
  name: 'SalesReport',
  components: {
    
  }
})
export default class SalesReport extends Vue {
  private ChangeReport(V: string[]): void{
    if(V.length > 0 && this.ReportData.length < 1){
      this.GetSummaryReport()
    }
  }

  private GetSummaryReport(): void{
    this.$UI.Loading.Show();
     this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.GetSummaryReport,
				Login: true
			},
			Data: { EndTime: "", Platform: 0, StartTime: "", StoreId: 0 },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.ReportData = Res.Data.Data;
          this.ParseData();
				} else {
          this.$Request.Error(Res);
				}
        this.$UI.Loading.Hide();
			}
		})
  }

  private ParseData(): void{
    this.XAxis = [];
    this.BarData = [];
    this.LineData = [];

    if (this.ReportData.length > 0) {
      for (let Item in this.ReportData) {
        this.XAxis.push(this.ReportData[Item].ReportDate.slice(this.ReportData[Item].ReportDate.indexOf('-') + 1));
        this.BarData.push(this.ReportData[Item].OrderCount);
        this.LineData.push(this.ReportData[Item].AmountCount);
      }
      this.ChartTitle = (this.ReportData[0].ReportDate).split('-').join('/') + ' - ' + (this.ReportData[this.ReportData.length - 1].ReportDate).split('-').join('/')
      this.IsChart = true;
      this.Chart();
    }
  }

  private Chart(): void {
    let Y: any[] = [];
    let Content: any[] = [];
    for (let Item in this.ChartY) {
      Y.push({
        type: 'value',
        name: this.ChartY[Item],
        axisLabel: {
          formatter: '{value}'
        },
        splitLine:{
          show:false
        }
      })
    }

    if (this.ChartY.length == 2) {
      Content = [{
        name: this.ChartY[0],
        type: 'bar',
        barMaxWidth: '50',
        data: this.BarData
      }, {
        name: this.ChartY[1],
        type: 'line',
        yAxisIndex: 1,
        data: this.LineData
      }]
    }

    // 绘制图表
    var Option = {
      color: this.ChartColor,
      tooltip: {
        trigger: 'axis'
      },
      title: {
        show: true,
        text: this.ChartTitle,
        y: 'bottom',
        x: 'center'
      },
      calculable: true,
      legend: {
        data: this.ChartY
      },
      xAxis: [{
        type: 'category',
        data: this.XAxis,
        splitLine:{
          show:false,
        }
      }],
      yAxis: Y,
      series: Content
    };
    this.$nextTick(()=>{
      this.MyChart = Echarts.init((this.$refs["ChartsDom"] as any),'macarons',{height:400});
      this.MyChart.setOption(Option);
    })
  }
  
  private MyChart:any = null;
  private IsChart: boolean = false;
  private BarData: number[] = []
  private XAxis: string[] = []
  private LineData: number[] = []
  private ChartTitle: string = ""
  private ReportData: Interface.ControlReportData[] = []
  private ChartY: string[] = ['订单数', '销售金额（USD）']
  private ChartColor: string[] = ['#3cdc6d', '#43719f']
}

</script>
<style lang="less">
  .WrapWidth{
    max-width: 1200px;
    margin: 0 auto;
  }
</style>