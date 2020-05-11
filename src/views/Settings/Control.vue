<template>
	<Row class="P-MT-20" id="Control">
    <Row class="P-PL-20 P-PR-20">
      <Col span="24">
        <SalesReport ref="SalesReport" v-if="Powers.GetSummaryReport" class="P-MB-30"/>
        <DailyStoreSales ref="DailyStoreSales" v-if="Powers.GetDaySaleReport" class="P-MB-30" />
        <Backlog ref="Backlog" :UserCategory="UserCategory" />
      </Col>
    </Row>
    <Row :gutter="16" class="P-MT-30 P-PL-20 P-PR-20">
      <Col span="12">
        <Exchange :ERlist="ERlist" :BaseExchange="BaseExchange" />
        <FreightCalculation class="P-MT-30" />
      </Col>
      <Col span="12">
        <LogisticsQuery />
        <CountryCodeQuery class="P-MT-30" />
      </Col>
    </Row>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';

@Component({
  name: 'Control',
  components: {
    SalesReport: () => import('@/components/Settings/Control/SalesReport.vue'),
    DailyStoreSales: () => import('@/components/Settings/Control/DailyStoreSales.vue'),
    Backlog: () => import('@/components/Settings/Control/Backlog.vue'),
    Exchange: () => import('@/components/Settings/Control/Exchange.vue'),
    LogisticsQuery: () => import('@/components/Settings/Control/LogisticsQuery.vue'),
    FreightCalculation: () => import('@/components/Settings/Control/FreightCalculation.vue'),
    CountryCodeQuery: () => import('@/components/Settings/Control/CountryCodeQuery.vue'),
  }
})
export default class Control extends Vue {
  // @Watch('$Resource.Point', {immediate: true, deep: true})
  // private ChangeReasoce(val: any): void{
  //   console.log(val)
  //   this.GetPoints()
  // }
  
  private mounted() :void {
    this.GetBacklog()
    this.GetERList()
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['GetSummaryReport', 'GetDaySaleReport']))
  }

  private GetBacklog(): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.UserGetUserToDoTree
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.UserCategory = Res.Data.Tree;
          for (let Item in this.UserCategory) {
            for (let Index in this.UserCategory[Item].ChildNods) {
              let Temp = {
                Base: this.UserCategory[Item].ChildNods[Index],
                Item: Number(Item),
                Index: Number(Index)
              }
              this.WaitGetCount.push(Temp)
            }
          }
          let Flag = false
          for(var I = 0;I<this.WaitGetCount.length;I++){
          	if(this.WaitGetCount[I].Base.RequestUrl.slice(this.WaitGetCount[I].Base.RequestUrl.indexOf('/api')) === "/api/PhotoProcessRequest/GetHomeData"){
          		if(Flag){
          			this.WaitGetCount.splice(I, 1)
          		}else{
          			Flag = true
          		}
          	}
          }
          this.CheckGetCount()
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CheckGetCount(): void {
    if (this.WaitGetCount.length > 0) {
      let requestServer = this.WaitGetCount[0].Base.RequestUrl.slice(0, this.WaitGetCount[0].Base.RequestUrl.indexOf('/api'))
      let requestApi = this.WaitGetCount[0].Base.RequestUrl.slice(this.WaitGetCount[0].Base.RequestUrl.indexOf('/api'))
      this.GetCount(requestServer, requestApi, this.WaitGetCount[0].Item, this.WaitGetCount[0].Index)
    }
  }
  
  // 获取待办事项条数
  private GetCount(RequestServer: string, RequestApi: string, Item: number, Index: number): void {
    this.$Request.Post({
			Server: RequestServer,
			Api: {
				Address: RequestApi,
				Login: true
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this.UserCategory[Item].ChildNods[Index], 'RequestData', Res.Data.Data);
				} else {
          this.$set(this.UserCategory[Item].ChildNods[Index], 'RequestData', "");
					this.$Request.Error(Res);
				}
				this.WaitGetCount.shift()
        this.CheckGetCount()
			}
		})
  }

  // 获取币种
  private GetERList(): void {
    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ERDropList,
				Login: true
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.ERlist = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
        }
        this.getDefaultExchange()
			}
		})
  }

  // 获取初始汇率
  private getDefaultExchange() {
    //发送请求
    let postData = {
      SourceCode: 'USD',
      TargetCode: 'CNY'
    };

    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ERExchangeRate,
				Login: true
			},
			Data: postData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.BaseExchange = Res.Data.Rate;
				} else {
					this.$Request.Error(Res);
        }
			}
		})
  }
  
  private Powers: PInterface.Power = {} // 权限
  private UserCategory: Interface.BackLogData[] = []
  private WaitGetCount: Interface.BackLogTemporary[] = []
  private ERlist: PInterface.KV[] = []
  private BaseExchange: number = 0 //初始汇率
}

</script>
<style lang="less">
#Control{
  height: calc(100vh - 150px) !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;

  & .ivu-collapse{
    border: none !important;
  }
  & .ivu-collapse-header{
    background: #fff !important;
    border: none !important;
  }

  & .Box-Shadow{
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
        // box-shadow: 1px 1px 5px #ccc;
  }
}
</style>
