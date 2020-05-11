<!-- 发货时效 -->
<template>
	<Row class="DeliveryAging">
    <Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
        <FormItem label="下单时间：" class="P-MB-10" style="width: 275px;margin-right:0;">
          <DatePicker class="P-W-200" v-model="SearchForm.StartTime" type="datetime" placeholder="开始日期"></DatePicker>
        </FormItem>
        <FormItem class="P-ML-10 P-MB-10" style="margin-right:0;">
          <span class="P-MR-10" style="display:inline-block;">-</span>
          <DatePicker class="P-W-200" v-model="SearchForm.EndTime" type="datetime" placeholder="结束日期"></DatePicker>
        </FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="primary" @click="SearchList">搜索</Button>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
    </Col>
    <Col span="24">
      <div class="cardList"  v-if="!IsChart" >
        <div :style="{height:Height + 'px'}" style="display: flex;justify-content: center;align-items: center;border: 1px solid #ddd;border-radius: 6px;">
          暂无数据
        </div>
      </div>
      <div v-show="IsChart" ref="Charts"></div>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
let Echarts = require('echarts');
@Component({
  name: 'DeliveryAging'
})
export default class DeliveryAging extends Vue {
  private mounted() {
    this.ResetList()
  }

  // 触发“搜索”按钮
	private SearchList(): void {
    let Start = new Date(this.SearchForm.StartTime).valueOf();
    let End = new Date(this.SearchForm.EndTime).valueOf()
    if (Start > End) {
      this.$UI.Tips.Floating('warning', `开始时间不能晚于结束时间`);
      return
    }
    if ((End - Start) / 86400000 > 30) {
      this.$UI.Tips.Floating('warning', '筛选时间区间最多只能30天');
      return
    }
    if(this.SearchForm.StartTime == ''&&this.SearchForm.EndTime != ''){
      this.$UI.Tips.Floating('warning','请选择开始时间');
      return
    }
    if(this.SearchForm.StartTime != ''&&this.SearchForm.EndTime == ''){
      this.$UI.Tips.Floating('warning','请选择结束时间');
      return
    }
		this.GetList();
  }

  // 触发“重置”按钮
	private ResetList(): void {
    this.$set(this.SearchForm, 'StartTime', new Date(new Date(new Date().toLocaleDateString()).getTime()-6*24*60*60*1000))
    this.$set(this.SearchForm, 'EndTime', new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1))
		this.GetList();
	}

  // 获取列表
	private GetList(): void {
    if (this.MyChart != null && this.MyChart != "" && this.MyChart != undefined) {
      this.MyChart.dispose()
    }
		this.$UI.Loading.Show();
    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.StartTime = SearchForm.StartTime == '' ? '' : this.$UI["Render"].NewDate(SearchForm.StartTime, true)
    SearchForm.EndTime = SearchForm.EndTime == '' ? '' : this.$UI["Render"].NewDate(SearchForm.EndTime, true)

		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.StatisticsGetShipedAgingList,
				Login: true
			},
			Data: SearchForm,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.BarData = Res.Data.data;
          if(this.BarData.length < 1){
            this.IsChart = false;
          }else{
            this.RenderXAxis();
            this.RenderChart();
            this.IsChart = true;
          }
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  private RenderXAxis(){
    this.XAsix = [];
    let SearchData = JSON.parse(JSON.stringify(this.SearchForm));
    
    SearchData.StartTime = SearchData.StartTime == '' ? '' : new Date(this.$UI["Render"].NewDate(SearchData.StartTime,true));
    SearchData.EndTime = SearchData.EndTime == '' ? '' : new Date(this.$UI["Render"].NewDate(SearchData.EndTime,true));
    
    let StartDay  = SearchData.StartTime.getDate();//开始日期
    let EndDay = SearchData.StartTime.getDate()+6;//结束日期
    let CurrentMonth = SearchData.StartTime.getMonth() + 1;
    let CurrentYear = SearchData.StartTime.getFullYear();
    let Weeks = this.BarData.length;//获取周数
    
    let StartMonthDays = new Date(CurrentYear, CurrentMonth, 0).getDate(); //获取开始时间月份天数
    let EndMonthDays = new Date(SearchData.EndTime.getFullYear(), SearchData.EndTime.getMonth()+1, 0).getDate(); //获取结束时间月份天数
    
    let Cycle = 0;
    for(var I=0; I<Weeks;I++){//循环创建X轴坐标
      if(Weeks == 1){
        this.XAsix[I] = this.$UI["Render"].NewDate(this.SearchForm.StartTime,true).replace('T', " ") +' - '+'\n'+this.$UI["Render"].NewDate(this.SearchForm.EndTime,true).replace('T', " ");
        return
      }else if(I == (Weeks-1) && Cycle > 0){//最后一个时间段结束时间默认用户选择时间
        if((StartDay+Cycle)>StartMonthDays){
          if((SearchData.StartTime.getMonth()+1) == 12){
            this.XAsix[I] = (SearchData.StartTime.getFullYear()+1)+'-'+'01'+'-'+(StartDay+Cycle - StartMonthDays)+" "+"00:00:00"+' - '+'\n'+this.$UI["Render"].NewDate(this.SearchForm.EndTime,true).replace('T', " ");	   
          }else{
            this.XAsix[I] = SearchData.StartTime.getFullYear()+'-'+(SearchData.StartTime.getMonth()+2)+'-'+(StartDay+Cycle - StartMonthDays)+" "+"00:00:00"+' - '+'\n'+this.$UI["Render"].NewDate(this.SearchForm.EndTime,true).replace('T', " ");
          }	
        }else{
          this.XAsix[I] = SearchData.StartTime.getFullYear()+'-'+(SearchData.StartTime.getMonth()+1)+'-'+(StartDay+Cycle)+" "+"00:00:00"+' - '+'\n'+this.$UI["Render"].NewDate(this.SearchForm.EndTime,true).replace('T', " ");
        }
        return
      } else if(I == 0){
        if((EndDay+Cycle)>StartMonthDays){
          if(CurrentMonth == 12){
            this.XAsix[I] = this.$UI["Render"].NewDate(this.SearchForm.StartTime,true).replace('T', " ")+' - '+'\n'+(CurrentYear+1)+'-'+'01'+'-'+(EndDay+Cycle-StartMonthDays)+" "+"23:59:59";	;
          }else{
            this.XAsix[I] = this.$UI["Render"].NewDate(this.SearchForm.StartTime,true).replace('T', " ")+' - '+'\n'+CurrentYear+'-'+(CurrentMonth+1)+'-'+(EndDay+Cycle-StartMonthDays)+" "+"23:59:59";	;
          }
        }else{
          this.XAsix[I] = this.$UI["Render"].NewDate(this.SearchForm.StartTime,true).replace('T', " ")+' - '+'\n'+CurrentYear+'-'+CurrentMonth+'-'+EndDay+" "+"23:59:59";	
        }
      }
      if(Cycle>0){
        if((StartDay+Cycle) > StartMonthDays){
          if((EndDay+Cycle) > EndMonthDays){
            if(CurrentMonth == 12) {
              this.XAsix[I] = (CurrentYear+1)+'-'+'01'+'-'+(StartDay+Cycle-StartMonthDays)+" "+"00:00:00"+' - '+'\n'+(CurrentYear+1)+'-'+'01'+'-'+(EndDay+Cycle-EndMonthDays)+" "+"23:59:59";	 
            }else{
              this.XAsix[I] = CurrentYear+'-'+(CurrentMonth+1)+'-'+(StartDay+Cycle-StartMonthDays)+" "+"00:00:00"+' - '+'\n'+CurrentYear+'-'+(CurrentMonth+1)+'-'+(EndDay+Cycle-StartMonthDays)+" "+"23:59:59";	
            }
          }else{
            if(CurrentMonth == 12) {
              this.XAsix[I] = (CurrentYear+1)+'-'+'01'+'-'+(StartDay+Cycle-StartMonthDays)+" "+"00:00:00"+' - '+'\n'+(CurrentYear+1)+'-'+'01'+'-'+(EndDay+Cycle)+" "+"23:59:59";	 
            }else{
              this.XAsix[I] = CurrentYear+'-'+(CurrentMonth+1)+'-'+(StartDay+Cycle-StartMonthDays)+" "+"00:00:00"+' - '+'\n'+CurrentYear+'-'+(CurrentMonth+1)+'-'+(EndDay+Cycle)+" "+"23:59:59";	
            }	      				
          }
        }else{
          if((EndDay+Cycle) > StartMonthDays){
            if(CurrentMonth == 12){
              this.XAsix[I] = CurrentYear+'-'+CurrentMonth+'-'+(StartDay+Cycle)+" "+"00:00:00"+' - '+'\n'+(CurrentYear+1)+'-'+"01"+'-'+(EndDay+Cycle-StartMonthDays)+" "+"23:59:59";	
            }else{
              this.XAsix[I] = CurrentYear+'-'+CurrentMonth+'-'+(StartDay+Cycle)+" "+"00:00:00"+' - '+'\n'+CurrentYear+'-'+(CurrentMonth+1)+'-'+(EndDay+Cycle-StartMonthDays)+" "+"23:59:59";	
            }
          }else{
            this.XAsix[I] = CurrentYear+'-'+CurrentMonth+'-'+(StartDay+Cycle)+" "+"00:00:00"+' - '+'\n'+CurrentYear+'-'+CurrentMonth+'-'+(EndDay+Cycle)+" "+"23:59:59";
          }
        }
      }

      Cycle += 7;
    }
  }

  private RenderChart(){
    var ItemStyle = {
      emphasis: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.8)'
      },
    }
    var Len = this.BarData.length;
    var NewData: any[] = [];
    this.MyChart = Echarts.init((this.$refs["Charts"] as any),'macarons',{width:window.innerWidth,height:this.Height});
      
    this.MyChart.title = '发货时效统计图';
    
    var YData: any[] = [
      {
        name:'24小时以内',
        type:'bar',
        stack: 'delivery',
        itemStyle:ItemStyle,
        barWidth: 40,
        data:[]      		
      },
      {
        name:'24-36小时',
        type:'bar',
        stack: 'delivery',
        itemStyle:ItemStyle,
        barWidth: 40,
        data:[]      		
      },
      {
        name:'36-48小时',
        type:'bar',
        stack: 'delivery',
        itemStyle:ItemStyle,
        barWidth: 40,
        data:[]      		
      },
      {
        name:'48-72小时',
        type:'bar',
        stack: 'delivery',
        itemStyle:ItemStyle,
        barWidth: 40,
        data:[]      		
      },
      {
        name:'超过72小时',
        type:'bar',
        stack: 'delivery',
        itemStyle:ItemStyle,
        barWidth: 40,
        data:[]      		
      },
      {
        name:'未发货',
        type:'bar',
        stack: 'delivery',
        itemStyle:ItemStyle,
        barWidth: 40,
        data:[]      		
      },
      {
        name:'总数',
        type:'line',
        stack: 'delivery1',
        label: {
          normal: {
            offset:['50', '80'],
            show: true,
            position: 'insideBottom',
            formatter:'{a}\n{c}',
            textStyle:{ color:'#000' }
          }
        },
        itemStyle:{
          normal:{
            color:'rgba(128, 128, 128, 0)'
          }
        },
        data:[]      		
      },
    ];
    for(var I = 0;I<7;I++){
      for(var J = 0;J<Len;J++){
        if(I == 6){
          YData[I].data.push(this.BarData[J].QuantityF24H+this.BarData[J].QuantityF36H+this.BarData[J].QuantityF48H+this.BarData[J].QuantityF72H+this.BarData[J].QuantityFM72H+this.BarData[J].NoShipQuantity);
        }
        switch(YData[I].name){
          case '24小时以内':
            YData[I].data.push(this.BarData[J].QuantityF24H);
            break;
          case '24-36小时':
            YData[I].data.push(this.BarData[J].QuantityF36H);
            break;
          case '36-48小时':
            YData[I].data.push(this.BarData[J].QuantityF48H);
            break;
          case '48-72小时':
            YData[I].data.push(this.BarData[J].QuantityF72H);
            break;
          case '超过72小时':
            YData[I].data.push(this.BarData[J].QuantityFM72H);
            break;
          case '未发货':
            YData[I].data.push(this.BarData[J].NoShipQuantity);
            break;
        }      		
      }
    }
    var Option = {
      color: this.DefaultColor,
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"+"件"
      },
      legend: {
        data:['24小时以内','24-36小时','36-48小时','48-72小时','超过72小时','未发货']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : {
        data : this.XAsix
      },
      yAxis :{
        type : 'value',
        name: '发货单数量',
        max: function(Value: any) {
            return Value.max + 5 ;
        }
      },
      series : YData,
      brush:{
        toolbox: [''],
        xAxisIndex: 0
      },
    }
    this.MyChart.setOption(Option);
    this.MyChart.on('brushselected', (Obj: any) => {
      let Arr:string[] = []
      let Selected: any[] = Obj.batch[0].selected
      Selected.forEach(Item => {
        if (Item.seriesName != '总数') {
          Arr.push(Item.seriesName)
        }
      })
      SetSum(Arr)
      this.MyChart.setOption({
        series: NewData
      })
    })
    function SetSum(Arr:string[]) {
      NewData = [];
      for(var I=0;I<Arr.length;I++){
        for(var J=0;J<YData.length;J++){
          if(Arr[I] == YData[J].name){
            NewData.push(YData[J]);
          }
        }
      }
    CalculateSum(NewData)
    }
    function CalculateSum(Arr: any[]){
      var SumData = [];
      for(var K=0;K<Len;K++){
        SumData[K] = 0;
      }
      for(var I=0;I<Arr.length;I++){
        for(var J=0;J<Arr[I].data.length;J++){
          SumData[J] += Arr[I].data[J]
        }
      }
      Arr.push({
        name:'总数',
        type:'line',
        stack: 'delivery1',
        label: {
          normal: {
            offset:['50', '80'],
            show: true,
            position: 'insideBottom',
            formatter:'{a}\n{c}',
            textStyle:{ color:'#000' }
          }
        },
        itemStyle:{
          normal:{
            color:'rgba(128, 128, 128, 0)'
          }
        },
        data:SumData      		
      })
    }
  }

  private SearchForm: Interface.DeliveryAgingSearch = new Interface.DeliveryAgingSearch()	//筛选项默认数据
  
  private BarData: Interface.DeliveryAgingList[] = []
  private IsChart: boolean = false;
  private MyChart:any = null
  private XAsix: any = []
  private Height: number = window.innerHeight - 200;

  private DefaultColor: string[] = ['#05a1b6', '#2f8fdc', '#3080dc', '#277cb4', '#057bb5', '#0566b5']

}

</script>
<style lang="less"></style>
