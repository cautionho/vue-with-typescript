<template>
	<Row>
    <Col>
      <Modal v-model="IsModal" title="查看销量" :mask-closable="false" :width="850" @on-cancel="EmitProposal(false)">
        <Table :columns="TableCols" :data="TableData" size="small" stripe></Table>
        <div class="echarts_line P-MT-10" id="main" style="width:100%; height: 300px;"></div>
        <div slot="footer">
        <Button @click="EmitProposal(false)">返回</Button>
      </div>
      </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
var echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/theme/macarons')
@Component({
  name: 'ViewSalesReport'
})
export default class ViewSalesReport extends Vue {
  @Emit() EmitProposal(Res: boolean):void{
    this.$set(this, 'IsModal', false)
    echarts.init(document.getElementById('main'), 'macarons').clear()
  }

  private TriggerModal(SelectedData: Interface.ProposalList[]): void{
    this.$set(this, 'IsModal', true)
    this.XAxis = [];
    this.LineData = [];
    this.TableData = []
    this.GetSalesReport(SelectedData)
  }

  private GetSalesReport(SelectedData: Interface.ProposalList[]): void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GetSKUSaleQuantity,
				Login: true
			},
			Data: { SkuId: SelectedData[0].SkuId, WareHouseId: SelectedData[0].WareHouseId },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if(Res.Data.Date.length > 0){
            for (let Item = Res.Data.Date.length - 1; Item >= 0; Item--) {
              this.XAxis.push(Res.Data.Date[Item].Days + '日均')
              this.LineData.push(Res.Data.Date[Item].Qty)
            }

            let Obj:Interface.DetailReportData = new Interface.DetailReportData()
            Obj["Sixty"] = Res.Data.Date[4].Qty
            Obj["FortyFive"] = Res.Data.Date[3].Qty
            Obj["Thirty"] = Res.Data.Date[2].Qty
            Obj["Fifteen"] = Res.Data.Date[1].Qty
            Obj["Seven"] = Res.Data.Date[0].Qty
            this.TableData.push(Obj)
          }
          this.chart()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  // 绘制折线图
  private chart() {
    let option = {
      title: { text: '' },
      tooltip: { trigger: 'axis' },
      calculable: true,
      xAxis: [{ type: 'category', name: "时间", boundaryGap: false, data: this.XAxis }],
      yAxis: [{ type: 'value', name: "日均销量", axisLabel: { formatter: '{value}' } }],
      series: [{ name: '销量', type: 'line', data: this.LineData }]
    }
    var main = document.getElementById('main')
    var myChart = echarts.init(main, 'macarons')
    myChart.setOption(option)
  }

  private IsModal: boolean = false;
  private TableData: Interface.DetailReportData[] = []
  private LineData: number[] = []
  private XAxis: string[] = []
  private TableCols: PInterface.TableCol[] = [
    { title: '60日均', key: 'Sixty' },
    { title: '45日均', key: 'FortyFive' },
    { title: '30日均', key: 'Thirty' },
    { title: '15日均', key: 'Fifteen' },
    { title: '7日均', key: 'Seven' }
  ]
}

</script>
<style lang="less"></style>
