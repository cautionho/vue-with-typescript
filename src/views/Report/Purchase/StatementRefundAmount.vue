<!--退付款金额统计报表-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" :model="SearchForm" name="SearchForm" onsubmit="return false" :rules="Rules">
        <Form-item prop="IsPayment">
          <Select class="P-W-200" placeholder="筛选类型" v-model="SearchForm.IsPayment" :options="PaymentType" />
          <!-- <Select class="P-W-200" @on-change="OnClearSelect('IsPayment')" placeholder="筛选类型" v-model="SearchForm.IsPayment" filterable clearable>
            <Option v-for="(Item,Index) in PaymentType" :value="$Enums.Report.PaymentType[Item]" :key="Index">{{ Item }}</Option>
          </Select> -->
        </Form-item>
        <span class="P-ML-10 P-Inline-Block" style="margin-top: 6px;">时间区间：</span>
        <Form-item prop="BeginTime" class="P-ML-10">
        <DatePicker class="P-W-200" v-model="SearchForm.BeginTime" type="datetime" placeholder="开始日期"></DatePicker>
        </Form-item>
        <span class="P-ML-5 P-Inline-Block">-</span>
        <Form-item prop="EndTime" class="P-ML-10">
          <DatePicker class="P-W-200" v-model="SearchForm.EndTime" type="datetime" placeholder="结束日期"></DatePicker>
        </Form-item>
				<Form-item class="P-MB-10 P-ML-10">
					<Button type="primary" @click="SearchList">数据统计</Button>
					</Input>
				</Form-item>
				<Form-item class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</Form-item>
			</Form>
		</Row>
		</Col>
		<Col span="24">
      <div v-if="!IsChart" >
        <div :style="{height:Height + 'px'}" style="display: flex;justify-content: center;align-items: center;border: 1px solid #ddd;border-radius: 6px;">
          暂无数据
        </div>
      </div>
      <div v-if="IsChart" ref="ChartsDom"></div>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
let Echarts = require('echarts');
@Component({
	name: 'StatementRefundAmount'
})
export default class StatementRefundAmount extends Vue {
  get StartTimeMs(): number {
    return this.SearchForm.BeginTime != '' ? new Date(this.SearchForm.BeginTime).getTime() : 0;
  }
  get EndTimeMs(): number {
    return this.SearchForm.EndTime != '' ? new Date(this.SearchForm.EndTime).getTime() : 0;
  }

  @Watch('SearchForm.BeginTime')
  private ChangeBeginTime(Val: string | ""): void{
    if(Val){
      (this.$refs.SearchForm as any).validate();
    }
  }

  @Watch('SearchForm.EndTime')
  private ChangeEndTime(Val: string | ""): void{
    if(Val){
      (this.$refs.SearchForm as any).validate();
    }
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  private SearchList(): void{
    (this.$refs['SearchForm'] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.GetList()
        
      } else {
        this.$UI.Tips.Floating('warning', '请检查必填项')
      }
    })
  }

  //获取列表
  private GetList(): void{
    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.IsPayment = SearchForm.IsPayment===1 ? true : false;
    SearchForm.BeginTime = this.$UI["Render"].NewDate(SearchForm.BeginTime, true)
    SearchForm.EndTime = this.$UI["Render"].NewDate(SearchForm.EndTime, true)

    if (this.MyChart != null && this.MyChart != "" && this.MyChart != undefined) {
      this.MyChart.dispose();
    }

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Report,
			Api: {
				Address: this.$Api.StatisticalStatementRefundAmount,
				Login: true
			},
			Data: SearchForm,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.ReportData = Res.Data.Data;
          this.IsChart = true;
          this.RenderReportChart()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  // 整理图表数据
  private RenderReportChart(): void {
    this.YData = [];
    this.XData = [];
    this.TotalAmount = 0;
    for ( let I=0; I < this.ReportData.length; I++) {
      this.XData.push(this.ReportData[I].CreateTime.slice(5,10));
      this.YData.push(this.ReportData[I].OrderAmount);
      this.TotalAmount += this.ReportData[I].OrderAmount;
    }
    this.ChartTitle = (this.ReportData[0].CreateTime).replace('T', " ") + ' - ' + (this.ReportData[this.ReportData.length - 1].CreateTime).replace('T', " ")
    this.Chart();
  }

  // 绘制
  private Chart(): void {
    // 动态创建y轴
    let Content = [{
      name: [],
      type: 'bar',
      barMaxWidth : 50,//柱图宽度
      smooth: true,
      data: this.YData
    }];

    //绘制图表
    var Option = {
      tooltip: {
        formatter: function (Params: any) {
          var Html=`${Params[0].name}<br>`;
          for(var I=0;I<Params.length;I++){
            Html+=`金额：${Params[I].value}`;
          }
          return Html;
        },
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
        data: []
      },
      xAxis: [{
        name: '日期',
        type: 'category',
        data: this.XData
      }],
      yAxis: {
        name: '金额（CNY）',
        type: 'value'
      },
      series: Content
    };
    this.$nextTick(()=>{
      this.MyChart = Echarts.init((this.$refs["ChartsDom"] as any),'macarons',{width:window.innerWidth,height:this.Height});
      this.MyChart.setOption(Option);
    })
  }
	
	//重置
	private ResetList(): void{
    (this.$refs['SearchForm'] as any).resetFields();
    this.IsChart = false;
  }
  
  private ValidateStartDate(Rule: any, Value: string, CallBack:any): void{
    if( Value === '' ){
      CallBack( new Error( '请选择开始时间' ) )
    }else {
      if( this.EndTimeMs != 0){
        if( this.StartTimeMs > this.EndTimeMs ){
          CallBack( new Error( '开始时间不能晚于结束时间' ) );
        }else if( (this.EndTimeMs - this.StartTimeMs) > 31*24*3600000 ){
          CallBack( '时间区间不能超过31天' );
        }else{
          CallBack();
        }
      }else{
        CallBack();
      }
    }
  };
  private ValidateEndDate(Rule:any, Value: string, CallBack:any):void{
    if( Value === '' ){
      CallBack( new Error( '请选择结束时间' ) );
    }else{
      if( this.StartTimeMs!=0 && (this.EndTimeMs - this.StartTimeMs) > 31*24*3600000 ){
        CallBack( new Error( '时间区间不能超过31天' ) );
      }else{
        CallBack()
      }
    }
  };
  
  private IsChart: boolean = false;
  private MyChart:any = null;
  private TotalAmount: number = 0;  //总金额
  private ReportData: Interface.StateRefundData[] = [];
  private ChartTitle: string = "";  //标题
  private XData: string[] = []; //时间
  private YData: number[] = [];  //金额
  private SearchForm : Interface.StateRefundSearch = new Interface.StateRefundSearch()  //筛选数据
  private PaymentType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.PaymentType)
  private Height: number = window.innerHeight - 200;
  private Rules: any = {
    IsPayment: [{ required: true, message: '请选择类型', trigger: 'change', type: 'number'}],
    BeginTime: [{ validator: this.ValidateStartDate, trigger: 'change', type: 'date'}],
    EndTime: [{ validator: this.ValidateEndDate, trigger: 'change', type: 'date'}]
  }
}

</script>
<style lang="less"></style>

