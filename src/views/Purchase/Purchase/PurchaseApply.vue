<!-- 采购申请 -->
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
            <Select class="P-W-200 P-ML-10" placeholder="销售员" v-model="SearchForm.Creator" :options="DropCreatorList" />
            <Select class="P-W-200 P-ML-10" placeholder="销售主管" v-model="SearchForm.SaleManager" :options="DropSaleManagerList" />
            <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.Status" :options="DropStatus" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="仓库" v-model="SearchForm.WarehouseId" filterable clearable>
                <Option v-for="item in DropWarehouseList" :key="item.Value" :value="item.Value">{{ item.Key }}</Option>
              </Select>
              <Select class="P-W-200 P-ML-10" placeholder="采购员" v-model="SearchForm.Purchaser" filterable clearable>
                <Option v-for="item in DropPurchaserList" :key="item.Value" :value="item.Value">{{ item.Key }}</Option>
              </Select>
              <Select class="P-W-200 P-ML-10" placeholder="销售员" v-model="SearchForm.Creator" filterable clearable>
                <Option v-for="item in DropCreatorList" :key="item.Value" :value="item.Value">{{ item.Key }}</Option>
              </Select>
              <Select class="P-W-200 P-ML-10" placeholder="销售主管" v-model="SearchForm.SaleManager" filterable clearable>
                <Option v-for="item in DropSaleManagerList" :key="item.Value" :value="item.Value">{{ item.Key }}</Option>
              </Select>
              <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.Status" filterable clearable>
                <Option v-for="(item, index) in DropStatus" :key="index" :value="$Enums.Purchase.ApplyStatus[item]">{{ item }}</Option>
              </Select> -->
            </Col>
          </Dropdown>
          <FormItem class="P-ML-10 P-MB-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
              <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
              <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <Button type="warning" @click="ResetList()">重置</Button>
      </Form>
		</Col>
    <Col span="24">
      <!-- 添加采购申请 -->
      <ModifyPurchaseApply class="P-MB-10" 
        v-if="Powers.PurcahseApplyCreate"
        :IsEdit="PurchaseApplyIsEdit"
        :DropWarehouseList="DropWarehouseList" 
        :ShowModal="ShowModifyPurchaseApplyModal"
        :SelectedEditData="Selected"
        @handle-res-msg="HandlePurchaseApply"
      />
      <!-- 提交审核 -->
      <PurchaseApplyToReview class="P-MB-10"
        v-if="Powers.PurcahseApplyToReview"
        :SelectedData="Selected"
        @handle-res-msg="HandleToReview"
      />
      <!-- 退回修改 通过 不通过 -->
      <ReviewPurchaseApply class="P-MB-10"
        v-if="Powers.PurcahseApplyReview"
        :SelectedData="Selected"
        :TypeEdit="ReviewTypeString"
        @handle-res-msg="HandleReviewPurchaseApply"
      />
    </Col>
    <Col span="24" class="P-MB-10">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="PurchaseApply" @on-selection-change="GetSelected"></Table>
		</Col>
		<Col span="24">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <!-- 放大图片 -->
    <ShowBigPic ref="ShowBigPic" />
    <!-- SKU详情 -->
    <SkuDetail ref="SkuDetail" />
    <!-- 采购申请详情 -->
    <PurchaseApplyDetails 
      :ShowModal="ShowPurchaseApplyDetailModal"
      :SelectedData="Selected"
      @handle-res-msg="HandleDetails"
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
  name: 'PurchaseApply',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue'),
    ModifyPurchaseApply: () => import('@/components/Purchase/Purchase/ModifyPurchaseApply.vue'),
    PurchaseApplyToReview: () => import('@/components/Purchase/Purchase/PurchaseApplyToReview.vue'),
    PurchaseApplyDetails: () => import('@/components/Purchase/Purchase/PurchaseApplyDetails.vue'),
    ReviewPurchaseApply: () => import('@/components/Purchase/Purchase/ReviewPurchaseApply.vue'),
	}
})

export default class PurchaseApply extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取 权限 下拉 初始化
  private async GetPoints(): Promise<void> {
		this.$UI.Loading.Show();
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['PurcahseApplyCreate','PurcahseApplyModify','PurcahseApplyToReview','PurcahseApplyReview']))
    this.$set(this, 'DropWarehouseList', await this.GetDropList<boolean, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true ))
    this.$set(this, 'DropPurchaserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '采购员' ))
    this.$set(this, 'DropCreatorList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '销售员' ))
    this.$set(this, 'DropSaleManagerList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '销售主管' ))
    this.SetOperateDrop()
  }
  
  // 初始化列表操作按钮
	private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [{ Key: '查看', Value: 0 }];
		this.Powers.PurcahseApplyModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.PurcahseApplyReview ? Drops.push({ Key: '通过', Value: 2 }) : null;
		this.Powers.PurcahseApplyReview ? Drops.push({ Key: '退回修改', Value: 3 }) : null;
		this.Powers.PurcahseApplyReview ? Drops.push({ Key: '不通过', Value: 4 }) : null;
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
    this.CancelSelect();
		this.$UI.Loading.Show();
		let SearchForm: any = JSON.parse(JSON.stringify(this.SearchForm));
		SearchForm.WarehouseId = SearchForm.WarehouseId === "" ? 0 : Number(SearchForm.WarehouseId);
		SearchForm.Purchaser = SearchForm.Purchaser === "" ? 0 : Number(SearchForm.Purchaser);
		SearchForm.Creator = SearchForm.Creator === "" ? 0 : Number(SearchForm.Creator);
		SearchForm.SaleManager = SearchForm.SaleManager === "" ? 0 : Number(SearchForm.SaleManager);
		SearchForm.Status = SearchForm.Status === "" ? 0 : Number(SearchForm.Status);
		SearchForm.SearchKeyType = SearchForm.SearchKeyType === "" ? 0 : Number(SearchForm.SearchKeyType);
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseApplyGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchForm },
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.Pager.TotalItems = res.Data.PageModel.TotalItems;
					this.List.splice(0, this.List.length, ...res.Data.PageModel.Items);
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
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
  private GetSelected(data: Interface.PurchaseApply[] ): void{
    this.$set(this, 'Selected', data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["PurchaseApply"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 触发“搜索”按钮
	private SearchList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.PurchaseApplySearch())
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

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }
  /*
	列表操作列操作按钮触发方法  
	OpeIndex: 0-查看 1-编辑 2-通过 3-退回修改 4-不通过
	Index： 操作列索引
	*/
	private OperateGroup(Type:number, Idx?:number): void {	
    this.CancelSelect()
    this.AccurateSearch = false;
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : []);
    switch(Type){
      case 0: 
        this.$set(this, 'ShowPurchaseApplyDetailModal', true);
        break;
      case 1:
        this.PurchaseApplyIsEdit = this.Selected.length === 1
        this.$set(this, 'ShowModifyPurchaseApplyModal', true);
        break;
      case 2:
        this.HandleReviewPurchaseApply(false, 'SuccessEdit');
        break;
      case 3:
        this.HandleReviewPurchaseApply(false, 'ReturnEdit');
        break;
      case 4:
        this.HandleReviewPurchaseApply(false, 'ErrorEdit');
        break;
    }
  }

  // 添加/编辑 申请 模态框 子组件回调
  // 0 - 取消， 1 - 编辑或添加 2 - 触发打开模态框
  private HandlePurchaseApply(Type: number): void {
    this.PurchaseApplyIsEdit = false;
    this.$set(this, 'ShowModifyPurchaseApplyModal', false)

    if (Type == 1) {
      this.GetList()
    } else if(Type == 2) {
      this.OperateGroup(1)
    }
  }

  // 提交审核 子组件回调
  // 0 - 取消， 1 - 成功
  private HandleToReview(Type: number): void {
    if (Type == 1) {
      this.GetList()
    }
  }

  // 提交修改，通过，不通过 子组件回调
  private HandleReviewPurchaseApply(IsSub: boolean, TypeString: string): void {
    this.ReviewTypeString = TypeString;
    if (IsSub) {
      this.ReviewTypeString = '';
      this.GetList();
    }
  }

  // 查看 子组件回调
  private HandleDetails():void{
    this.$set(this, 'ShowPurchaseApplyDetailModal', false);
  }
  //控制列表操作列下拉按钮显示隐藏
	private ControlOpera(OpeIndex:number, RowData: Interface.PurchaseApply): string{
    switch (OpeIndex) {
      case 0: return 'block';
      case 1: return RowData.ApplySummary.Status === 1 ? 'block' : 'none';
      case 2: 
      case 3: 
      case 4: return RowData.ApplySummary.Status === 2 ? 'block' : 'none';
      default: return 'none';
    }
	}

	private Powers: PInterface.Power = {}  // 权限

  private ShowModifyPurchaseApplyModal: boolean = false; // 添加申请 模态框
  private PurchaseApplyIsEdit: boolean = false; // 添加申请 是否编辑

  private ShowPurchaseApplyDetailModal: boolean = false; // 查看 模态框

  private ReviewTypeString: string = ''; // 退回修改，通过，不通过

  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private DropPurchaserList: PInterface.KV[] = [];  // 采购员下拉
  private DropCreatorList: PInterface.KV[] = []; // 销售员下拉
  private DropSaleManagerList: PInterface.KV[] = []; // 销售主管下拉
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ApplyStatus); // 状态枚举下拉
  
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private AccurateSearch: Boolean = false; // 精准搜索
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.PurchaseApplySearch = new Interface.PurchaseApplySearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ApplySearchType) // 搜索关键词

  private Selected: Interface.PurchaseApply[] = []; // 列表选中数据
  private List: Interface.PurchaseApply[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '编号', key: 'Id', width: 100, render: (h, Params) => {
      return h('a', {
        on: {
          click:() => {
            this.OperateGroup(0, Params.row._index)
          }
        }
      }, (Params.row as any).ApplySummary.Id)
    }},
		{ title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, Params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + Params.row.ApplySummary.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.ApplySummary.DefaultImage)
            }
          }
        })
      }
    },
		{ title: 'SKU信息', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          'content': (Params.row as any).ApplySummary.SkuName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('a', {
          on: {
            click:() => {
              (this.$refs['SkuDetail'] as Vue).Trigger((Params.row as any).ApplySummary.SkuCode);
            }
          }
        }, (Params.row as any).ApplySummary.SkuCode === "" ? '-' : (Params.row as any).ApplySummary.SkuCode),
        h('p', {
          class: 'P-MT-5'
        }, (Params.row as any).ApplySummary.SkuName === "" ? '-' : (Params.row as any).ApplySummary.SkuName )
      ])
    }},
		{ title: '仓库', render: (h: any, Params: any): string => h('span', (Params.row as any).ApplySummary.WarehouseName)},
		{ title: '当前库存/在途库存', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "当前"),
          h('span', (Params.row as any).Inventory.Quantity)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "在途"),
          h('span', (Params.row as any).Inventory.PurchasingQuantity)
        ])
      ])
    }},
    { title: '销售数量/采购数量', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "销"),
          h('span', (Params.row as any).AvgSaleQuantity.AvgSaleQuantity7 + '/' + (Params.row as any).AvgSaleQuantity.AvgSaleQuantity15 + '/' + (Params.row as any).AvgSaleQuantity.AvgSaleQuantity30)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
          h('span', (Params.row as any).ApplySummary.PurchaseQuantity)
        ])
      ])
    }},
    { title: '销售员/销售主管/采购员', width: 200, render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "销售"),
          h('span', (Params.row as any).ApplySummary.CreatorName)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "主管"),
          h('span', (Params.row as any).ApplySummary.SaleManagerName)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采购"),
          h('span', (Params.row as any).ApplySummary.PurchaserName)
        ])
      ])
    }},
		{ title: '备注', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          'content': (Params.row as any).ApplySummary.Remark ? (Params.row as any).ApplySummary.Remark : '-',
          'maxWidth': 200
        },
        class: 'P-W-100-Percent',
        
      }, [
        h('p', { class: 'P-LINE-1' }, (Params.row as any).ApplySummary.Remark ? (Params.row as any).ApplySummary.Remark : '-' )
      ])
    }},
		{ title: '申请时间', width: 160, render: (h: any, Params: any): string => h('span', {}, this.$UI.Render.Date( (Params.row as any).ApplySummary.CreateTime, true)) },
    { title: '状态', key: 'Status', width: 120, align: 'left', 
      render: (h: any, Params: any): string => {
			  return h('Tag', {
          props: { color: ['primary', 'warning', 'success', 'default'][(Params.row as any).ApplySummary.Status - 1] }
        }, this.$Enums.Purchase.ApplyStatus[(Params.row as any).ApplySummary.Status])
      }
    },
    { title: '操作',width: 100,render: (h: any, Params: any): string => {
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
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((Item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: Item.Value
							},
              class: "P-TA-C",
							style: { display: this.ControlOpera(Number(Item.Value), Params.row) },
						}, Item.Key);
					}))
				])
			}
    }
  ];
}

</script>
<style lang="less"></style>
