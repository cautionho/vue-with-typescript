<!-- 到货单管理 -->
<template>
	<Row>
		<Col span="24">
      <Form inline v-model="SearchForm" ref="SearchForm" onsubmit="return false"  >
          <Dropdown trigger="custom" :visible="AccurateSearch" placement="bottom-start">
            <Button type="primary" @click="TriggerSearch">
              精准搜索
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <Col span="24" slot="list" class="P-P-10">
            <Select class="P-W-200 P-ML-10" placeholder="仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
            <Select class="P-W-200 P-ML-10" placeholder="采购员" v-model="SearchForm.Purchaser" :options="DropPurchaserList" />
            <Select class="P-W-200 P-ML-10" placeholder="质检员" v-model="SearchForm.QAUser" :options="DropQAUserList" />
            <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.Status" :options="DropStatus" />
            <Select class="P-W-200 P-ML-10" placeholder="异常状态" v-model="SearchForm.ExceptStatus" :options="DropExceptionStatus" />
            </Col>
          </Dropdown>
          <FormItem class="P-ML-10 P-MB-10">
            <Input placeholder="搜索关键字" class="P-W-400" @on-enter="SearchList" v-model="SearchForm.SearchKey">
              <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
              <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <Button type="warning" @click="ResetList()">重置</Button>
      </Form>
		</Col>
    <Col span="24">
      <!-- 修改物流信息 -->
      <PaoLogistics class="P-MB-10" 
        ref="PaoLogistics"
        v-if="Powers.ShippingMethodModify"
        @handle-res-msg="HandleLogistics"
      />
       <!-- 扫描签收 -->
      <ScanSign class="P-MB-10" 
        ref="ScanSign"
        v-if="Powers.ArrivalOrderSign"
        @handle-res-msg="HandleScanSign"
      />
       <!-- 打印到货单 -->
      <PrintPao class="P-MB-10" 
        ref="PrintPao"
        v-if="Powers.ArrivalOrderView"
        @handle-res-msg="HandlePrintPao"
      />
      <!-- 批量质检 -->
      <QuantityTestingBatch class="P-MB-10" 
        ref="QuantityTestingBatch"
        v-if="Powers.ArrivalOrderQABatch"
        @handle-res-msg="HandleQualityTestingBactch"
      />
      <!-- 扫描质检 -->
      <QuantityTestingScan class="P-MB-10" 
        ref="QuantityTestingScan"
        v-if="Powers.ArrivalOrderQAScan"
        @handle-res-msg="HandleQualityTestingScan"
      />
      <!-- 批量打印SKU标签 -->
      <PrintSkuLabelBatch class="P-MB-10" 
        ref="PrintSkuLabelBatch"
        v-if="Powers.ArrivalOrderPrintSkuBatch"
        @handle-res-msg="HandlePrintSkuLabelBatch"
      />
      <!-- 打印SKU标签 -->
      <PrintSkuLabel class="P-MB-10" 
        ref="PrintSkuLabel"
        v-if="Powers.ArrivalOrderPrintSku"
        @handle-res-msg="HandlePrintSkuLabel"
      />
      <!-- 扫描入库 -->
      <InStorage class="P-MB-10" 
        ref="InStorage"
        v-if="Powers.ArrivalOrderInStorage"
        @handle-res-msg="HandleInStorage"
      />
      <!-- 作废到货单 -->
      <CancelPao class="P-MB-10" 
        v-if="Powers.CancelPao"
        ref="CancelPao"
        :SelectedData="Selected"
        @handle-res-msg="HandleCancelPao"
      />
      <!--导出采购入库记录-->
      <ExportInventoryRecords 
        v-if="Powers.PurchaseArrivalExport" 
        ref="ExportInventoryRecords" 
        @handle-res-msg="HandleExportInventoryRecord"
      />
    </Col>
    <Col span="24" class="P-MB-10">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="Pao" @on-selection-change="GetSelected"></Table>
		</Col>
		<Col span="24">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <!-- 质检  -->
    <QuantityTesting class="P-MB-10" 
      ref="QuantityTesting"
      v-if="Powers.ArrivalOrderQA"
      @handle-res-msg="HandleQualityTesting"
    />
    <!-- SKU详情 -->
    <SkuDetail ref="SkuDetail" />
    <!-- 采购申请详情 -->
    <PaoDetails
      ref="PaoDetails"
    />
    <!-- 处理到货单 -->
    <HandlePaoException 
      ref="HandlePaoException"
      v-if="Powers.ArrivalOrderExcept"
      @handle-res-msg="HandlePaoExceptionRes"
    />
    <!-- 退货 -->
    <ReturnGoods 
      ref="ReturnGoods"
      v-if="Powers.ArrivalOrderRefund"
      @handle-res-msg="HandleReturnGoods"
    />
    
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
/*interface end*/

@Component({
  name: 'Pao',
  components: {
    SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue'),
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    PaoDetails: () => import('@/components/Purchase/Purchase/PaoDetails.vue'),
    QuantityTesting: () => import('@/components/Purchase/Purchase/QuantityTesting.vue'),
    QuantityTestingBatch: () => import('@/components/Purchase/Purchase/QuantityTestingBatch.vue'),
    QuantityTestingScan: () => import('@/components/Purchase/Purchase/QuantityTestingScan.vue'),
    PaoLogistics: () => import('@/components/Purchase/Purchase/PaoLogistics.vue'),
    ScanSign: () => import('@/components/Purchase/Purchase/ScanSign.vue'),
    PrintPao: () => import('@/components/Purchase/Purchase/PrintPao.vue'),
    PrintSkuLabelBatch: () => import('@/components/Purchase/Purchase/PrintSkuLabelBatch.vue'),
    PrintSkuLabel: () => import('@/components/Purchase/Purchase/PrintSkuLabel.vue'),
    InStorage: () => import('@/components/Purchase/Purchase/InStorage.vue'),
    HandlePaoException: () => import('@/components/Purchase/Purchase/HandlePaoException.vue'),
    ReturnGoods: () => import('@/components/Purchase/Purchase/ReturnGoods.vue'),
    CancelPao: () => import('@/components/Purchase/Purchase/CancelPao.vue'),
    ExportInventoryRecords: () => import('@/components/Purchase/Purchase/ExportInventoryRecords.vue'),
	}
})

export default class Pao extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取 权限 下拉 初始化
  private async GetPoints(): Promise<void> {
    this.$UI.Loading.Show();
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ArrivalOrderView', 'ArrivalOrderPrintSku', 'ArrivalOrderPrintSkuBatch','ArrivalOrderSign','ArrivalOrderQA', 'ArrivalOrderQABatch', 'ArrivalOrderQAScan', 'ArrivalOrderInStorage','ArrivalOrderExcept', 'ArrivalOrderRefund', 'ShippingMethodModify', 'CancelPao', 'PurchaseArrivalExport']))
    this.$set(this, 'DropWarehouseList', await this.GetDropList<boolean, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true ))
    this.$set(this, 'DropPurchaserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '采购员' ))
    this.$set(this, 'DropQAUserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '质检员' ))
    this.SetOperateDrop()
  }
  
  // 初始化列表操作按钮
	private SetOperateDrop(): void { 
		let Drops: PInterface.KV[] = [];
		this.Powers.ArrivalOrderSign ? Drops.push({ Key: '签收', Value: 1 }) : null;
		this.Powers.ShippingMethodModify ? Drops.push({ Key: '修改物流信息', Value: 2 }) : null;
		this.Powers.ArrivalOrderQA ? Drops.push({ Key: '质检', Value: 3 }) : null;
		this.Powers.ArrivalOrderInStorage ? Drops.push({ Key: '入库', Value: 4 }) : null;
		this.Powers.ArrivalOrderExcept ? Drops.push({ Key: '处理', Value: 5 }) : null;
		this.Powers.ArrivalOrderRefund ? Drops.push({ Key: '退货', Value: 6 }) : null;
    this.Powers.CancelPao ? Drops.push({ Key: '作废', Value: 7 }) : null;
    Drops.push({ Key: '查看', Value: 0 });
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

  // 获取 仓库 / 采购员 / 销售员 / 销售主管 下拉 
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

  // 获取列表
	private GetList(): void {
    this.CancelSelect()
    this.$set(this, 'AccurateSearch', false);
		this.$UI.Loading.Show();
		const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.Status = SearchForm.Status === "" ? "" : Number(SearchForm.Status);
		SearchForm.ExceptStatus = SearchForm.ExceptStatus === "" ? "" : Number(SearchForm.ExceptStatus);
		SearchForm.QAUser = SearchForm.QAUser === "" ? "" : Number(SearchForm.QAUser);
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseArrivalOrderGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchForm },
			Callback: (res: PInterface.Res): void => {
				this.$UI.Loading.Hide();
				if (res.IsSuccess) {
					this.Pager.TotalItems = res.Data.PageModel.TotalItems;
					this.List.splice(0, this.List.length, ...res.Data.PageModel.Items);
				} else {
					this.$Request.Error(res);
				}
			}
		})
	}

    // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
    }

     // 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let item in this.Powers){
			if(this.Powers[item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
	}

	//获取列表复选框选中的数据
  private GetSelected(data: Interface.Pao[] ): void{
    this.$set(this, 'Selected', data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["Pao"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.PaoSearch())
		this.GetList();
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
  /*
	列表操作列操作按钮触发方法  
	OpeIndex: 0-查看 1-签收 2-修改物流信息 3-质检 4-入库 5-处理 6-退货 7-作废
	Index： 操作列索引
	*/
	private OperateGroup(Type:number, Idx?:number): void {	
		this.$set(this, 'AccurateSearch', false);
    this.CancelSelect();
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : []);
    switch(Type){
      case 0: 
        (this.$refs["PaoDetails"] as Vue).Trigger(this.Selected);
        break;
      case 1:
        (this.$refs["ScanSign"] as Vue).Trigger(this.Selected);
        break;
      case 2:
        (this.$refs["PaoLogistics"] as Vue).Trigger(this.Selected);
        break;
      case 3:
        (this.$refs["QuantityTesting"] as Vue).Trigger(this.Selected, false);
        break;
      case 4:
        (this.$refs["InStorage"] as Vue).Trigger(this.Selected);
        break;
      case 5:
        (this.$refs["HandlePaoException"] as Vue).Trigger(this.Selected);
        break;
      case 6:
        (this.$refs["ReturnGoods"] as Vue).Trigger(this.Selected);
        break;
      case 7:
        (this.$refs["CancelPao"] as any).Trigger(this.Selected);
        break;
      case 8:
        (this.$refs['SkuDetail'] as Vue).Trigger(this.Selected[0].SkuCode);
        break;
    }
  }
  
  // 修改物流参数
  // 0 - 取消， 1 - 提交 2 - 触发打开模态框
  private HandleLogistics(Type: number): void {
    if (Type === 1) {
      this.GetList()
    } else if(Type === 2) {
      (this.$refs["PaoLogistics"] as Vue).Trigger(this.Selected);
    }
  }

  // 扫描签收
  // 0 - 取消， 1 - 提交 2 - 触发打开模态框
  private HandleScanSign(Type: number): void {
    if (Type === 1) {
      this.GetList()
    } else if(Type === 2) {
      (this.$refs["ScanSign"] as Vue).Trigger(this.Selected);
    }
  }

  // 打印到货单
  // 0 - 取消， 1 - 提交 2 - 触发打开模态框
  private HandlePrintPao(Type: number): void {
    this.CancelSelect()
    if (Type === 1) {
      (this.$refs["PrintPao"] as Vue).Trigger();
    } 
  }

  // 批量打印SKU标签
  // 0 - 取消， 1 - 提交 2 - 触发打开模态框
  private HandlePrintSkuLabelBatch(Type: number): void {
    if (Type === 1) {
      this.GetList()
    } else if(Type === 2) {
      this.CancelSelect();
      (this.$refs["PrintSkuLabelBatch"] as Vue).Trigger();
    }
  }

  // 打印SKU标签
  // 0 - 取消， 1 - 提交 2 - 触发打开模态框
  private HandlePrintSkuLabel(Type: number): void {
    if (Type === 1) {
      this.GetList()
    } else if(Type === 2) {
      this.CancelSelect();
      (this.$refs["PrintSkuLabel"] as Vue).Trigger();
    }
  }

  // 扫描入库
  private HandleInStorage(Type: number): void {
    this.CancelSelect()
    if (Type === 1) {
      this.GetList()
    }
  }

  // 处理到货单
  private HandlePaoExceptionRes(Type: number): void{
    if (Type === 1) {
      this.GetList()
    }
  }

  // 退货
  private HandleReturnGoods(Type: number): void {
    if (Type === 1) {
      this.GetList()
    } 
  }

  // 作废到货单
  private HandleCancelPao(Type: number): void {
    if (Type === 1) {
      this.GetList()
    } else if(Type === 2) {
      (this.$refs["CancelPao"] as any).Trigger(this.Selected);
    }
  }

  // 质检
  // 0 - 取消， 1 - 提交 
  private HandleQualityTesting(Type: number, IsScan: boolean): void {
    if (Type === 1) {
      this.GetList()
    }
    // 返回 扫描质检 模态框
    if (IsScan) {
      this.CancelSelect();
      (this.$refs["QuantityTestingScan"] as Vue).Trigger();
    }
  }

  // 批量质检
  // 0 - 取消， 1 - 提交 
  private HandleQualityTestingBactch(Type: number): void {
    if (Type === 1) {
      this.GetList()
    } else if (Type === 2) {
      (this.$refs["QuantityTestingBatch"] as Vue).Trigger(this.Selected);
    }
  }

  // 扫描质检
  // 0 - 取消  1 - 触发质检模态框
  private HandleQualityTestingScan(Type: number, TargetData?: Interface.Pao) {
    if (Type === 1) {
      this.GetList()
    } else if (Type === 2 && TargetData !== undefined) {
      this.CancelSelect();
      (this.$refs["QuantityTesting"] as Vue).Trigger([TargetData], true);
    }
  }

  // 提交审核 子组件回调
  // 0 - 取消， 1 - 成功
  private HandleToReview(Type: number): void {
    this.CancelSelect()
    if (Type == 1) {
      this.GetList()
    }
  }

  // 采购入库记录
  private HandleExportInventoryRecord(): void{
    (this.$refs["ExportInventoryRecords"] as any).Trigger(this.DropWarehouseList)
  }

  //控制列表操作列下拉按钮显示隐藏
	private ControlOpera(OpeIndex:number, RowData: Interface.Pao): string{
    switch (OpeIndex) {
      // 查看
      case 0: return 'block';
      // 签收
      case 1: 
      // 修改物流信息
      case 2: return RowData.Status === 1 ? 'block' : 'none';
      // 质检
      case 3: return RowData.Status === 2 ? 'block' : 'none';
      // 入库
      case 4: return (RowData.Status === 3 && RowData.WaitInStorageQuantity !== 0 ) || RowData.Status === 4 ? 'block' : 'none';
      // 处理
      case 5: return RowData.ExceptStatus === 1 ? 'block' : 'none';
      // 退货
      case 6: return RowData.ExceptStatus === 2 ? 'block' : 'none';
      // 作废
      case 7: return !(RowData.Status === 5 || RowData.ExceptStatus === 1) && RowData.ExceptStatus !== 1 ? 'block' : 'none';
      default: return 'none';
    }
  }

	private Powers: PInterface.Power = {}  // 权限

  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private DropPurchaserList: PInterface.KV[] = [];  // 采购员下拉
  private DropQAUserList: PInterface.KV[] = []; // 质检员下拉
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ArrivalStatus); // 状态枚举下拉
  private DropExceptionStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ExceptionStatus); // 异常状态枚举下拉
  
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private AccurateSearch: Boolean = false; // 精准搜索
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.PaoSearch = new Interface.PaoSearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ArrivalSearchType) // 搜索关键词

  private Selected: Interface.Pao[] = []; // 列表选中数据
  private List: Interface.Pao[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
	  { title: '到货单号/采购单号/快递单号', width: 200, render: (h, Params) => {
        return h('div', [
            h('a', {
              on: {
                click:() => {
                  this.OperateGroup(0, Params.row._index)
                }
              }
            }, [
                h('span', {  class: 'P-Table-Tip P-BG-Primary'}, "到"),
                h('span', (Params.row as any).OrderCode)
            ]),
            h('p', [
                h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
                h('span', (Params.row as any).PurchaseCode)
            ]),
            h('a', {
              on: {
                click:() => {
                  window.open(`https://www.kuaidi100.com/chaxun?com=${(Params.row as any).ExpressCompany}&nu=${(Params.row as any).ExpressCode}`, "_blank");
                }
              }
            }, [
                h('span', { class: 'P-Table-Tip P-BG-Primary' }, "快"),
                h('span', (Params.row as any).ExpressCode)
            ])

      ])
    }},
    { title: 'SKU编号', key: 'SkuCode', render: (h, Params) => {
      return h('a', {
        on: {
          click:() => {
            this.OperateGroup(8, Params.row._index)
          }
        }
      }, (Params.row as any).SkuCode)
    }},
	  { title: '采购员', key: 'PurchaserName' },
    { title: '仓库', key: 'WarehouseName' },
    { title: '到货/待入库/已入库数量', render: (h, Params) => {
        return h('div', [
            h('p', [
                h('span', {  class: 'P-Table-Tip P-BG-Primary'}, "到货"),
                h('span', (Params.row as any).ArrvialQuantity)
            ]),
            h('p', [
                h('span', { class: 'P-Table-Tip P-BG-Primary' }, "待入"),
                h('span', (Params.row as any).WaitInStorageQuantity)
            ]),
            h('p', [
                h('span', { class: 'P-Table-Tip P-BG-Primary' }, "已入"),
                h('span', (Params.row as any).InStorageQuantity)
            ])
      ])
    }},
    { title: '异常/退货数量', render: (h, Params) => {
        return h('div', [
            h('p', [
                h('span', {  class: 'P-Table-Tip P-BG-Primary'}, "异"),
                h('span', (Params.row as any).NoPassQuantity)
            ]),
            h('p', [
                h('span', { class: 'P-Table-Tip P-BG-Primary' }, "退"),
                h('span', (Params.row as any).RefundQuantity)
            ])
      ])
    }},
    { title: '创建时间/签收时间', width: 180, render: (h, Params) => {
        return h('div', [
            h('p', [
                h('span', {  class: 'P-Table-Tip P-BG-Primary'}, "创"),
                h('span', this.$UI.Render.Date( (Params.row as any).CreateTime, true) )
            ]),
            h('p', [
                h('span', { class: 'P-Table-Tip P-BG-Primary' }, "签"),
                h('span', this.$UI.Render.Date( (Params.row as any).SignTime, true) )
            ])
      ])
    }},
    { title: '到货单状态', key: 'Status', width: 100, render: (h: any, Params: any): string => h('span', this.$Enums.Purchase.ArrivalStatus[(Params.row as any).Status] )},
    { title: '异常处理进度', key: 'ExceptStatus', width: 140, render: (h: any, Params: any): string => h('span', this.$Enums.Purchase.ExceptionStatus[(Params.row as any).ExceptStatus] )},
    { title: '操作',width: 100, render: (h: any, Params: any): string => {
		    return h('Dropdown',{
            on: {
                'on-click': (name: any) => {
                  this.OperateGroup(name, Params.row._index)
                }
            }
        }, [
            h('a', [
                h('span', { class: 'P-MR-5' }, '操作'),
                h('Icon', { props: { type: 'ios-arrow-down' } })
            ]),
            h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map( (Item: PInterface.KV): string => {
                return h('DropdownItem',{
                    props: {
                        name: Item.Value
                    },
                  class: "P-TA-C",
                    style: { display: this.ControlOpera(Number(Item.Value), Params.row) },
                }, Item.Key);
            }))
	      ])
    }}
  ];
}

</script>
<style lang="less"></style>
