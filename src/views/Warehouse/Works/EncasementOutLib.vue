<!-- 装箱出库 -->
<template>
	<Row>
    <Col span="24">
      <Form ref="SearchForm" onsubmit="return false" inline class="P-MB-10">
        <FormItem class="P-MB-0">
          <Input v-model.trim="TrackCode" ref="TrackCode" @on-enter="HandleLoadingSummary" placeholder="跟踪号" class="P-W-400">
            <Button slot="append" @click="HandleClearInput">清除跟踪号</Button>
          </Input>
        </FormItem>
        <FormItem class="P-ML-10 P-MB-0">
          <Select v-model="MethodId" placeholder="物流渠道" :disabled="MethodDisabled" transfer  optionValKey="Id" optionKey="Name" :options="DropShipMethodList" />
        </FormItem>
        <FormItem class="P-MB-0">
          <Button class="P-ML-10" type="warning" @click="HandleResetList">重置</Button>
          <Button class="P-ML-10" type="primary" @click="HandleOutStorage">出库</Button>
          <Button class="P-ML-10" type="warning" @click="HandleClearList">清空列表</Button>
          <Button class="P-ML-10" type="primary" @click="HandleReBox">重新装箱</Button>
        </FormItem>
      </Form>
    </Col>
    <Col span="24" class="P-MT-10">
      <Row class="P-MB-5">
        <h3>此箱渠道：{{ MethodName ? MethodName : '-' }}</h3>
      </Row>
      <Row class="P-MB-5">
        <h3>装箱数量：{{ List.length }}</h3>
      </Row>
      <Row class="P-MB-5">
        <Col span="20">
         <h3>包裹重量：{{ GetWeight }}</h3>
        </Col>
        <Col span="4" class="P-TA-R">
          <h3>装箱批次号：{{ ReBoxCode ? ReBoxCode : '-' }}</h3>
        </Col>
      </Row>
    </Col>
    <Col span="24" class="P-MT-10">
      <h2 class="P-TA-C P-MB-5">出库列表</h2>
		  <Table :columns="Cols" :data="List" size="small" stripe :height="TableHeight" ref="Table" />
    </Col>
    <Col span="24" class="P-MT-10">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <Modal v-model="ShowReBoxModal" title="重新装箱" :mask-closable="false" @on-cancel=" ShowReBoxModal = false" width="400">
      <h2 class="P-TA-C">请扫描需要重新装箱的箱唛条码</h2>
      <Input class="P-W-100-Percent" v-model="ReBoxCodeInput" ref="ReBoxCode" placeholder="箱唛条码" @on-enter="HandleGetRebox" />
      <footer slot="footer">
        <Button type="primary" @click="HandleGetRebox">确定</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
// import GetLodop from '@/assets/LODOP/LodopFuncs';

@Component({
  name: 'EncasementOutLib'
})
export default class EncasementOutLib extends Vue {
  private async mounted() :Promise<void> {
    this.$set(this, 'DropShipMethodList', await this.GetDropList<number, PInterface.IdName>(this.$Server.Logistics, this.$Api.ChannelDropList, 0 ));
    this.HandleClearInput();
  }

  @Watch('List')
  private WatchPager(List: Interface.SetSendData[]):void {
    this.Pager.TotalItems = List.length;
  }

  // 当前视图列表数据
  get CurrentList(): Interface.SetSendData[] {
    return this.List.slice(this.Pager.PageIndex - 1 * this.Pager.PageSize, this.Pager.PageIndex * this.Pager.PageSize)
  }

  // 获得总重量
  get GetWeight(): number {
    let Num:number = 0;
    for( let Item of this.List ) {
      Num += Item.Weight
    }
    return Number(Num.toFixed(3))
  }

  // 获取 物流渠道 下拉 
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

  // 出库
  private HandleOutStorage(): void {
    if (this.List.length === 0) {
      this.$UI.Tips.Floating("出库列表为空，请先扫描/输入跟踪号再进行操作");
      this.HandleClearInput();
      return;
    }

    const PostData: any = this.List.map(Item => {
      return {
        BoxItemId: 0,
        BoxCode: this.ReBoxCode,
        OrderCode: Item.OrderCode,
        CountryCode: Item.CountryCode,
        ShippingMethodId: Item.ShippingMethodId,
        TrackingNumber: Item.TrackingNumber,
        Weight: Item.Weight
      }
    })

    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.BoxOutStorage,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();
				if (Res.IsSuccess) {

          // 模态框

				} else {
					this.$Request.Error(Res);
				}
			}
		})

  }

  // 清空列表
  private HandleClearList(): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否要清空出库列表？',
      Enter: false,
      Callback: (Val: boolean) => {
        if(Val){
          this.List.splice(0);
          this.$UI.Tips.Floating("success", "出库列表已清空")
        }
      }
    })
  }

  // 重置列表
	private HandleResetList(): void {
		this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否要重置并清空页面所有数据？',
      Enter: false,
      Callback: (Val: boolean) => {
        if(Val){
          this.List.splice(0);
          this.MethodDisabled = false;
          this.MethodName = "";
          this.ReBoxCode = "";
          this.MethodId = "";
          this.HandleClearInput();
          this.$UI.Tips.Floating("success", "页面已清空");
          this.Pager = new PInterface.Pager();
        }
      }
    })
	}

  // 清空跟踪号 并聚焦
  private HandleClearInput(): void {
    this.TrackCode = "";
    ( this.$refs['TrackCode'] as Vue ).focus()
  }
  
  // 获取跟踪号信息 
  private HandleLoadingSummary(): void {
    if (this.TrackCode === "") {
      this.$UI.Tips.Floating("warning", "请输入/扫描跟踪号")
      return;
    }

    const Length: number = this.TrackCode.length;

    if ( [157,158,161,162,173,174].includes(this.MethodId as number) && this.TrackCode.startsWith("420") && [30,34].includes(Length) ) {
      this.TrackCode = this.TrackCode.substr(-22);
    }
    // 跟踪号开头为420且长度为30位时自动截取后面22位
    if ( [189,190,191,192].includes(this.MethodId as number) && this.TrackCode.startsWith("420") && [30].includes(Length) ) {
      this.TrackCode = this.TrackCode.substr(-22);
    }
    // 跟踪号开头为JJD且长度为19位时去掉开头的第一个J
    if ( [154].includes(this.MethodId as number) && this.TrackCode.startsWith("JJD") && [19].includes(Length) ) {
      this.TrackCode = this.TrackCode.slice(-18)
    }
    // 跟踪号长度为20位时自动截取后面18位
    if ( [176].includes(this.MethodId as number) && [20].includes(Length) ) {
      this.TrackCode = this.TrackCode.slice(-18)
    }

    // 跟踪号是否已在列表
    if (this.List.length !== 0 && this.List.some((item) => item.TrackingNumber === this.TrackCode)) {
      this.$UI.Tips.Floating("warning", `${this.TrackCode}已存在出库列表`);
      this.HandleClearInput();
      return;
    }

    // 获取订单信息
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.GetShipOrderByTrackCode,
				Login: true
			},
			Data: this.TrackCode,
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();
				if (Res.IsSuccess) {

          // 是否为空
          if ( Res.Data.Data === null ) {
            this.$UI.Tips.Floating("warning", `${this.TrackCode}在系统中不存在，请重新输入`);
            return;
          }
          // 是否为已发货状态
          if ( Res.Data.Data.Status !== 6 ) {
            this.$UI.Tips.Floating("warning", `请扫描/输入状态为已发货订单的跟踪号`);
            return;
          }

          // 是否跟踪号与渠道一致
          if ( this.MethodId !== "" && this.MethodId !== Res.Data.Data.ShippingMethodId ) {
            this.$UI.Tips.Floating("warning", `正在装箱的是${this.List[0].MethodName}，请扫描/输入相同渠道的跟踪号`);
            return;
          }

          Res.Data.Data.CountryCode = Res.Data.Data.Country.CountryCode;
          Res.Data.Data.CountryNameCn = Res.Data.Data.Country.CountryNameCn;

          this.List.unshift(Res.Data.Data);

          this.MethodId = Res.Data.Data.ShippingMethodId;
          this.MethodName = Res.Data.Data.MethodName;

          this.MethodDisabled = true;
          
          this.$nextTick(()=>{
            this.HandleClearInput();
          })

				} else {
					this.$Request.Error(Res);
				}
			}
		})


  }

  // 操作 重新装箱
  private HandleReBox():void {

    if (this.MethodName !== "") {
      this.$UI.Tips.Floating("warning", `${this.ReBoxCode ? '正在重新装箱' : '正在装箱出库'}，请先出库或重置后再进行操作`)
      return;    
    }
    this.ReBoxCodeInput = "";
    this.ShowReBoxModal = true;
    this.$nextTick(()=>{
      (this.$refs["ReBoxCode"] as Vue).focus();
    })    
  } 

  // 重新装箱出库 获取内容
  private HandleGetRebox():void {
    if (this.ReBoxCodeInput === "") {
      this.$UI.Tips.Floating("warning", "请输入/扫描箱唛条码");
      (this.$refs["ReBoxCode"] as Vue).focus();
      return;
    }

    const PostData: any = {
      PageIndex: 1,
      PageSize: 9999,
      Conditions: {
        Id: 0,
        BoxCode: this.ReBoxCodeInput,
        SearchKeyType: 0,
        SearchKey: ""
      }
    }

    // 获取箱子订单信息
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.BoxGetBoxItemList,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();
				if (Res.IsSuccess) {

          Res.Data.PageModel.Items.forEach((Item: any)  => {
            Item.CountryNameCn = Item.CountryCode.CountryNameCn;
            Item.CountryCode = Item.CountryCode.CountryCode;
            Item.MethodName = Item.ShippingMethodName
          });

          this.List.splice(0, this.List.length, ...Res.Data.PageModel.Items);

          this.MethodId = Res.Data.PageModel.Items[0].ShippingMethodId;
          this.MethodName = Res.Data.PageModel.Items[0].ShippingMethodName;
          this.MethodDisabled = true;

          this.ReBoxCode = this.ReBoxCodeInput;
          
          this.ShowReBoxModal = false;

          this.$nextTick(()=>{
            this.HandleClearInput();
          })

				} else {
					this.$Request.Error(Res);
				}
			}
		})


  }

  // 取消全选
  private CancelSelect():void {
    (this.$refs["Pao"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 触发“切换页码”
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
	}

	// 触发“切换数据展示数量”
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}

  private TableHeight: number = window.innerHeight - 338;
  private MethodDisabled: boolean = false;

  private DropShipMethodList: PInterface.IdName[] = []; // 物流渠道下拉列表

  private ReBoxCode: string = ""; // 重新装箱的批次号
  private ReBoxCodeInput: string = ""; // 重新装箱的输入框
  private ShowReBoxModal: boolean = false // 重新装箱模态框

  private MethodName: string = "";  // 物流渠道名称
  private MethodId: number | "" = "";  // 物流渠道Id
  private TrackCode: string = "";     // 跟踪号
  private TrackCodeRules: any = {     // 校验
    TrackCode: [{ required: true, message: '请扫描/输入跟踪号', trigger: 'blur' }],
  }
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.SetSendData[] = []; // 列表
  private Cols: PInterface.TableCol[] = [
    { title: '发货单号', key: 'OrderCode' }, 
    { title: '国家', key: 'CountryNameCn' }, 
    { title: '物流渠道', key: 'MethodName' },
    { title: '跟踪号', key: 'TrackingNumber' },
    { title: '重量(Kg.)', key: 'Weight' },
    { title: '操作', width: 200, render: (h, Params) => {
      return h('Button', {
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: ()=> {
            this.List.splice(((this.Pager.PageIndex - 1) * this.Pager.PageSize) + Params.row._index, 1);
          }
        }
      }, '删除')
    }
  }]
}

</script>
<style lang="less"></style>
