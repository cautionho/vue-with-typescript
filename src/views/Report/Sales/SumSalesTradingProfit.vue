<!-- 毛利汇总报表 -->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" :model="SearchForm" :rules="RuleValidate" onsubmit="return false">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
          <Form-item class="P-Inline-Block P-ML-10 P-MB-10">
            <Select v-model="SearchForm.Platform" class="P-W-200" placeholder="筛选平台" :options="PlatformDrop" />
            <!-- <Select v-model="SearchForm.Platform" filterable clearable class="P-W-200" placeholder="筛选平台" @on-change="OnClearSelect('Platform')">
              <Option v-for="(Item, Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
            </Select> -->
          </Form-item>
          <Form-item class="P-Inline-Block P-ML-10 P-MB-10">
            <Select v-model="SearchForm.StoreId" class="P-W-200" placeholder="筛选店铺" ref="Store" :options="StoreDrop" />
            <!-- <Select v-model="SearchForm.StoreId" filterable clearable class="P-W-200" placeholder="筛选店铺" @on-change="OnClearSelect('StoreId')" ref="Store">
              <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
            </Select> -->
          </Form-item>
          <Form-item prop="TimeType" class="P-Inline-Block P-ML-10 P-MB-10">
            <Select v-model="SearchForm.TimeType" class="P-W-200" placeholder="筛选时间类型" :options="TimeTypeDrop" />
            <!-- <Select v-model="SearchForm.TimeType" filterable clearable class="P-W-200" placeholder="筛选时间类型" @on-change="OnClearSelect('TimeType')">
              <Option v-for="(Item, Index) in TimeTypeDrop" :value="$Enums.Report.TimeType[Item]" :key="Index">{{ Item }}</Option>
            </Select> -->
          </Form-item>
          <FormItem prop="BeginTime" class="P-Inline-Block P-ML-10 P-MB-10">
            <DatePicker class="P-W-200" v-model="SearchForm.BeginTime" :type="TimeType" :placeholder="PlaceTime" ref="TimeType"></DatePicker>
          </FormItem>
          <span class="P-ML-10 P-Inline-Block" style="margin-top: 6px;" v-if="IsShow">-</span>
          <FormItem prop="EndTime" class="P-Inline-Block P-ML-10 P-MB-10" v-if="IsShow">
            <DatePicker class="P-W-200" v-model="SearchForm.EndTime" :type="TimeType" placeholder="筛选结束时间"></DatePicker>
          </FormItem>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
          <Button type="primary" @click="ValidForm">统计汇总</Button>
        </FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
    <Col span="24">
      <Button v-if="Powers.ExportSalesReport" type="primary" class="P-MB-10 P-MR-10 P-Inline-Block" @click="ExportData">导出数据</Button>
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
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
const Echarts = require('echarts');
@Component({
  name: 'SumSalesTradingProfit'
})
export default class SumSalesTradingProfit extends Vue {
  @Watch('SearchForm.Platform')
  private ChangePlatForm(Val: number | ''):void{
    this.SearchForm.StoreId = '';
    if (this.StoreDrop.length != 0) {
      (this.$refs.Store as any).clearSingleSelect();
    }
    this.StoreDrop = [];
    if (Val != '') {
      this.GetStoreDropList(Val);
    }
  }

  @Watch('SearchForm.TimeType')
  private ChangeTimeType(Val: number | ''):void{
    this.SearchForm.BeginTime = ''
    this.SearchForm.EndTime = ''
    if (Val == 1) {
      this.IsShow = true;
      this.TimeType = 'year';
    } else if (Val == 2) {
      this.IsShow = false;
      this.TimeType = 'year';
    } else {
      this.IsShow = true;
      this.TimeType = 'month';
    }
    this.PlaceTime = Val !== 2 ? '筛选开始时间' : '筛选时间';
  }

  private mounted(): void{
    //获取权限
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportSalesReport']))
    this.CalculateTbHeight();
  }

  // 获取平台下的所有店铺
  private GetStoreDropList(Val:number | ''):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales[Val].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.StoreDrop = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  //切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }

  private ValidForm(): void{
    (this.$refs['SearchForm'] as any).validate((B: boolean) => {
      if (B) {
        let SearchForm = JSON.parse(JSON.stringify(this.SearchForm))
        SearchForm.BeginTime = SearchForm.BeginTime === "" ? "" : this.$UI["Render"].NewDate(SearchForm.BeginTime, true)
        SearchForm.EndTime = SearchForm.EndTime === "" ? "" : this.$UI["Render"].NewDate(SearchForm.EndTime, true)

        let Begin = new Date(SearchForm.StartTime).getTime(), End = new Date(SearchForm.EndTime).getTime();

        //获取当前年份，月份
        let CurrentDate = new Date(),
          CurrentYear = CurrentDate.getFullYear(),
          CurrentMonth = CurrentDate.getMonth() + 1

        //年份选择判断
        if (this.SearchForm.TimeType == 1) {
          if ((End - Begin) / 86400000 > 1830) {
            this.$UI.Tips.Floating('warning', '年份跨度不能超过5年')
            return
          } else if (new Date(SearchForm.EndTime).getFullYear() > CurrentYear) {
            this.$UI.Tips.Floating('warning', '结束年份不能晚于当前年份')
            return
          } else if (new Date(SearchForm.EndTime).getFullYear() < new Date(SearchForm.BeginTime).getFullYear()) {
            this.$UI.Tips.Floating('warning', '开始年份不能晚于结束年份')
            return
          }
        }

        //季度选择判断
        if (this.SearchForm.TimeType == 2) {
          if (new Date(SearchForm.BeginTime).getFullYear() > CurrentYear) {
            this.$UI.Tips.Floating('warning', '选择的年份不能晚于当年份')
            return
          }
          this.SearchForm.EndTime = new Date(SearchForm.BeginTime).getFullYear() + '-' + (new Date(SearchForm.BeginTime).getMonth() + 12)
        }

        //月份选择判断
        if (this.SearchForm.TimeType == 3) {
          if (new Date(SearchForm.EndTime).getFullYear() < new Date(SearchForm.BeginTime).getFullYear()) {
            this.$UI.Tips.Floating('warning', '开始年份不能晚于结束年份')
            return
          } else if (new Date(SearchForm.EndTime).getFullYear() > CurrentYear) {
            this.$UI.Tips.Floating('warning', '结束年份不能晚于当前年份')
            return
          } else if ((End - Begin) / 86400000 > 366) {
            this.$UI.Tips.Floating('warning', '月份跨度不能超过12个月')
            return
          } else if (new Date(SearchForm.EndTime).getFullYear() == CurrentYear) {
            if (new Date(SearchForm.EndTime).getMonth() + 1 > CurrentMonth) {
              this.$UI.Tips.Floating('warning', '结束月份不能晚于当月份')
              return
            }
          }else if (Begin > End) {
            this.$UI.Tips.Floating('warning', '开始月份不能晚于结束月份')
            return
          }
        }
        
        this.GetList()
      }else{
        this.$UI.Tips.Floating('warning', '请选择必填项')
      }
    })
  }

  //获取列表
  private GetList(): void{
    this.$set(this, 'AccurateSearch', false);
    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.BeginTime = this.$UI["Render"].NewDate(SearchForm.BeginTime, true)
    SearchForm.EndTime = this.$UI["Render"].NewDate(SearchForm.EndTime, true)

    if (this.MyChart != null && this.MyChart != "" && this.MyChart != undefined) {
      this.MyChart.dispose()
    }

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.SummarySalesTradingProfit,
				Login: true
			},
			Data: SearchForm,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if (Res.Data.PageModel.length > 0) {
            this.IsExport = true;
            this.ReportData = Res.Data.PageModel;
            this.IsChart = true;
            this.Chart();
          }
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  //重置
	private ResetList(): void{
		this.$set(this, 'AccurateSearch', false);
    (this.$refs['SearchForm'] as any).resetFields();
    this.IsExport = false;
    this.IsChart = false;
  }
  
  // 绘制
  private Chart(): void {
    let ProfitBar:any[] = [],
      SaleBar: any[] = [],
      Store: any = {},
      StoreData: any = {},
      LegendData: string[] = [],
      SumSaleBar: any[] = [],
      SumProfitBar: any[] = []

    let ItemStyle = {
      emphasis: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.8)'
      },
    };
    this.ReportData.forEach((Item, index) => {
      if (Item.StoreName === "") {
        Item.StoreName = '无店铺订单'
      }
    })
    // 创建storeData，直系属性为日期（可能有相同），日期下存放各店铺利润及销售额（这里暂时只存放后端数据返回的）
    this.ReportData.forEach((Item, index) => {
      let Tem = this.SearchForm.Platform === "" ?  this.$Enums.Sales.Platform[Item.Platform] : Item.StoreName
      if (StoreData[Item.TimeZone] == undefined) {
        StoreData[Item.TimeZone] = {}
        StoreData[Item.TimeZone][Tem] = {
          profit: Item.SalesProfit,
          amt: Item.SalesAmount
        }
        StoreData[Item.TimeZone]['index'] = Object.keys(StoreData).length
      } else {
        if (StoreData[Item.TimeZone][Tem] == undefined) {
          StoreData[Item.TimeZone][Tem] = {
            profit: Item.SalesProfit,
            amt: Item.SalesAmount
          }
        }
      }
      // 创建store，一个store对应一个series的data，有多少个store就有多少个series
      if (Store[Tem] == undefined) {
        Store[Tem] = Object.keys(Store).length
      }
      LegendData.push(Tem)
    })


    // 创建series，利润和销售额分开创建，便于后面插入数据
    for (let Item in Store) {
      SaleBar.push({
        name: Item,
        type: 'bar',
        barWidth: 40,
        itemStyle: ItemStyle,
        stack: 'sale',
        data: []
      })
      ProfitBar.push({
        name: Item,
        type: 'bar',
        barWidth: 40,
        itemStyle: ItemStyle,
        stack: 'profit',
        data: []
      })

      // 补全所有店铺
      for (let I in StoreData) {
        if (StoreData[I][Item] == undefined) {
          StoreData[I][Item] = {
            profit: 0,
            amt: 0
          }
        }
      }
    }

    // 插入series数据
    ProfitBar.forEach(function(Item, index) {
      for (let I in StoreData) {
        for (let Tem in StoreData[I]) {
          if (Tem === Item.name) {
            Item.data.push(StoreData[I][Tem].profit)
            SaleBar[index].data.push(StoreData[I][Tem].amt)
          }
        }
      }
    })

    SumSaleBar.push({
      name: '销售额',
      type: 'line',
      itemStyle: {
        normal: {
          color: 'transparent'
        }
      },
      stack: 'totalSale',
      label: {
        normal: {
          offset: [-25, 0],
          show: true,
          color: '#000',
          position: 'top',
          formatter: '{a}\n{c}'
        }
      },
      data: []
    })
    SumProfitBar.push({
      name: '毛利',
      type: 'line',
      itemStyle: {
        normal: {
          color: 'transparent'
        }
      },
      stack: 'totalProfit',
      label: {
        normal: {
          offset: [25, 0],
          show: true,
          color: '#000',
          position: 'top',
          formatter: '{a}\n{c}'
        }
      },
      data: []
    })

    SetSum(Object.keys(Store))

    function SetSum(Arr: any) {
      for (let Item in StoreData) {
        CalculateSum(StoreData[Item], Arr)
      }
    }

    function CalculateSum(A1: any, A2: any) {
      let SaleSum = 0, ProfitSum = 0
      for (let Item in A1) {
        if (typeof A1[Item] != 'number') {
          let Flag = false
          for (let Tem in A2) {
            if (A2[Tem] === Item) {
              Flag = true
            }
          }
          if (Flag) {
            SaleSum = SaleSum + A1[Item].amt
            ProfitSum = ProfitSum + A1[Item].profit
          }
        }
      }
      SaleSum = (Math.round(SaleSum * 1000)) / 1000
      ProfitSum = (Math.round(ProfitSum * 1000)) / 1000
      SumSaleBar[0].data.push(SaleSum)
      SumProfitBar[0].data.push(ProfitSum)
    }

    let XAxisData = Object.keys(StoreData)
    if (this.SearchForm.TimeType == 2) {
      // 渲染x轴
      for (let I = 0; I < XAxisData.length; I++) {
        let Quarter = XAxisData[I].split('-')
        if (Number(Quarter[1]) === 1) {
          XAxisData[I] = Quarter[0] + "第一季度"
        } else if (Number(Quarter[1]) === 2) {
          XAxisData[I] = Quarter[0] + "第二季度"
        } else if (Number(Quarter[1]) === 3) {
          XAxisData[I] = Quarter[0] + "第三季度"
        } else if (Number(Quarter[1]) === 4) {
          XAxisData[I] = Quarter[0] + "第四季度"
        } else {
          XAxisData[I] = Quarter[0] + "第四季度"
        }
      }

    }
    //图例去重
    LegendData = LegendData.filter((Element, Index, Self) => {
      return Self.indexOf(Element) === Index
    })
    // 设置颜色
    let Colors: string[] = [],
      Pages: number = Math.ceil(Object.keys(Store).length / this.DefaultColor.length)
    for (let I = 0; I < Pages; I++) {
      Colors.push.apply(Colors, this.DefaultColor)
    }
    // 绘制图表
    let Option = {
      color: Colors,
      brush: {
        toolbox: [''],
        xAxisIndex: 0
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"
      },
      legend: {
        right: '6%',
        data: LegendData,
        type: 'scroll',
        width: '40%'
      },
      grid: {
        left: 100
      },
      xAxis: {
        data: XAxisData
      },
      yAxis: [{type: 'value', name: '金额(USD)'}],
      series: SaleBar.concat(ProfitBar).concat(SumProfitBar).concat(SumSaleBar)
    }
    this.$nextTick(()=>{
      this.MyChart = Echarts.init((this.$refs["ChartsDom"] as any),'macarons',{width:window.innerWidth,height:this.Height});
      this.MyChart.setOption(Option);
    

      this.MyChart.on('brushselected', (Obj: any) => {
        SumSaleBar[0].data = []
        SumProfitBar[0].data = []
        let Arr: string[] = []
        let Selected: any[] = Obj.batch[0].Selected
        Selected.forEach( Item => {
          if (Item.seriesName != '销售额' && Item.seriesName != '毛利') {
            Arr.push(Item.seriesName)
          }
        })
        SetSum(Arr)
        this.MyChart.setOption({
          series: SaleBar.concat(ProfitBar).concat(SumProfitBar).concat(SumSaleBar)
        })
      })
    })
  }

  // 计算列表高度
	private CalculateTbHeight(): void {
		let F: number = 180;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				F = 220;
			}
    }
    this.Height = window.innerHeight - F
  }

  private ExportData():void{
    if (this.IsExport) {
      let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
      SearchForm.BeginTime = this.$UI["Render"].NewDate(SearchForm.BeginTime, true);
      SearchForm.EndTime = this.$UI["Render"].NewDate(SearchForm.EndTime, true);
      this.$UI.Loading.Show();

      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.ExportSummarySalesProfit,
          Login: true
        },
        Data: SearchForm,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$UI.Tips.Modal({
              Type: 'success',
              Content: `创建导出毛利报表汇总任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
              Callback: (Res: boolean):void => {
              }
            });
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    } else {
      this.$UI.Tips.Floating('warning', '请先统计汇总需要的数据后再进行导出数据')
    }
  }

  private ValidTime(Rule: any, Value: any, Callback: any){
    if (!Value) {
      return Callback(new Error(`${this.SearchForm.TimeType === 2 ? '' : '开始'}时间不能为空`));
    }else{
      Callback();
    }
  }

  private DefaultColor: string[] = ['#05a1b6', '#2f8fdc', '#3080dc', '#277cb4', '#057bb5', '#0566b5']
  private IsChart: boolean = false;
  private MyChart:any = null;
  private Height: number = 0;

  private ReportData: Interface.SumSalesProfitData[] = []
  private PlaceTime: string = '筛选开始时间';
  private IsShow: boolean = true;  //默认显示两个时间选择器
  private TimeType: string = 'month'; //日期选择器类型
  private IsExport: boolean = false;  //是否点击了统计按钮
  private Powers: PInterface.Power = {}  // 权限
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private StoreDrop: PInterface.KV[] = [];  //店铺下拉
  private TimeTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.TimeType);  //时间类型下拉
  private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
  private SearchForm: Interface.SumSalesProfitSearch = new Interface.SumSalesProfitSearch();  //筛选数据
  private RuleValidate: any = {
    TimeType: [{ required: true, message: '时间类型不能为空', trigger: 'change', type: 'number' }],
    BeginTime: [{ required: true, validator: this.ValidTime, trigger: 'change', type: 'date' }],
    EndTime: [{ required: true, message: '结束时间不能为空', trigger: 'change', type: 'date' }]
  }
}

</script>
<style lang="less"></style>
