<template>
  <Modal title="选择SKU" :mask-closable="false" v-model="EnableSkuModal" :width="1400" @on-cancel="EnableSkuModal = false">
    <Row>
      <Col span="24">
        <Form inline v-model="SearchForm" ref="SearchForm" onsubmit="return false">
          <FormItem  class="P-MB-10">
            <Dropdown trigger="custom" :visible="AccurateSearch" placement="bottom-start">
              <Button type="primary" @click="TriggerSearch">
                精准搜索
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <Col span="24" slot="list" class="P-P-10">
              <Select class="P-W-200 P-ML-10" placeholder="平台" v-model="SearchForm.WarehouseId" :options="DropPlatformList" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="平台" v-model="SearchForm.WarehouseId" filterable clearable>
                  <Option v-for="(item, index) in DropPlatformList" :key="index" :value="$Enums.Sales.Platform[item]">{{ item }}</Option>
                </Select> -->
                <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.Status" :options="DropStatus" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.Status" filterable clearable>
                  <Option v-for="(item, index) in DropStatus" :key="index" :value="$Enums.Warehouse.SkuStatus[item]">{{ item }}</Option>
                </Select> -->
                <Select class="P-W-200 P-ML-10" placeholder="品牌" v-model="SearchForm.Purchaser" :options="DropBrandList" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="品牌" v-model="SearchForm.Purchaser" filterable clearable>
                  <Option v-for="item in DropBrandList" :key="item.Value" :value="item.Value">{{ item.Key }}</Option>
                </Select> -->
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10">
              <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
              <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
              <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
                  <Option v-for="(item, index) in SearchKeyTypeDrop" :key="index" :value="$Enums.Product.SkuSearchType[item]">{{item}}</Option>
                </Select> -->
              <Button slot="append" type="primary" @click="SearchList">搜索</Button>
              </Input>
            </FormItem>
            <Button type="warning" @click="ResetList">重置</Button>
          </FormItem>
        </Form>
      </Col>
      <Col span="24" class="P-MB-10">
        <Table :columns="Cols" :data="List" size="small" stripe :height="500" ref="EnableSku" @on-selection-change="GetSelected"></Table>
      </Col>
      <Col span="24" >
        <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
      </Col>
    </Row>
    <ShowBigPic ref="ShowBigPic"></ShowBigPic>
    <footer slot="footer">
      <Button type="primary" @click="HandleAddSku()">添加</Button>
      <Button @click="EnableSkuModal = false" >取消</Button>
    </footer>
  </Modal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
/*interface end*/

@Component({
  name: 'EnableSku',
  components: {
    ShowBigPic: () => import('./ShowBigPic.vue')
  }
})
export default class EnableSku extends Vue{

  @Emit() HandleResMsg(SelectData: PInterface.EnableSku[], IsSuccess?: boolean): void {}

  // 打开模态框
  private Trigger(IsEdit: boolean, ComponentFrom?: string ):void {
    this.GetPoints()

    this.ComponentFrom = ComponentFrom === undefined ? "" : ComponentFrom;
    
    // 兼容修改采购申请
    if (IsEdit) {
      if (this.Cols[0].type === 'selection') {
        this.Cols.shift();
      }
      if (this.Cols[this.Cols.length - 1].title !== '操作') {
        const temp = { title: '操作', width: 100,  render: (h: any, params: any): string => {
            return h('Button', {
              props: {
                size: 'small',
                type: 'error'
              },
              on: {
                click:() => {
                  this.Selected.push(JSON.parse(JSON.stringify(params.row)));
						      if(this.ComponentFrom === 'ModifyPurchaseApply'){
						      	if(this.Selected[0].Status == 4 || this.Selected[0].Status == 5){
                      this.$UI.Tips.Floating('warning', `选择的SKU中包含了待清或清完状态的SKU，请检查后再进行添加`);
							        this.CancelSelect();
								      return;
							    	}
							    }
                  this.EmitSkuRes();
                }
              }
            }, '选择')
          }
        }
        this.Cols.push(temp);
      }
    } else {
      if (this.Cols[0].type !== 'selection') {
        const temp = { type: 'selection', width: 60, align: 'center' }
        this.Cols.unshift(temp)
        this.Cols.pop();
      }
    }
    if (this.List.length > 0) {
      this.CancelSelect();
    } else {
      this.ResetList()
    }
    this.$nextTick(function() {
      this.$set(this,'EnableSkuModal', true);
    })
  }

  /* methods Start */
	//获取 权限 下拉 初始化
  private async GetPoints(): Promise<void> {
    this.$set(this, 'DropBrandList', await this.GetDropList<string, PInterface.KV>(this.$Server.Purchase, this.$Api.BrandDropList, "" ))
  }

  // 获取 品牌 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (Res.IsSuccess) {
            resolve(Res.Data.DropList)
		  		} else {
           this.$Request.Error(Res);
		  		}
		  	}
	  	})
    })
  }

  // 获取列表
	private GetList(): void {
    this.CancelSelect();
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SkuGetEnableList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: this.SearchForm },
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

	//获取列表复选框选中的数据
  private GetSelected(data: PInterface.EnableSku[] ): void{
    this.$set(this, 'Selected', data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["EnableSku"] as any).selectAll(false);
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
		this.$set(this, 'SearchForm', new PInterface.EnableSkuSearch())
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
    // this.ShowBigPicModal = true;
    // this.BigPicSrc = Url;
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }
  // 添加sku
  private HandleAddSku():void {
    if (this.Selected.length < 1) {
      this.$UI.Tips.Floating('warning', `请选择SKU`);
      return;
    }
    if(this.ComponentFrom == 'ModifyPurchaseApply'){
	    for(let Item of this.Selected){
	    	if(Item.Status == 4 || Item.Status == 5){
          this.$UI.Tips.Floating('warning', `选择的SKU中包含了待清或清完状态的SKU，请检查后再进行添加`);
		      this.CancelSelect();
		      return;
	    	}
	    }
    }
    this.EmitSkuRes();
  }
  // 回调
  private EmitSkuRes() {
    this.HandleResMsg(this.Selected)
		this.$set(this, 'List', []);
    this.$set(this,'EnableSkuModal', false);
    this.CancelSelect();
  }
  
  private EnableSkuModal: boolean = false; // 当前模态框 

  private DropPlatformList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform); // 平台枚举下拉
  private DropBrandList: PInterface.KV[] = [];  // 品牌下拉
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); // 状态枚举下拉
  
  private ComponentFrom: string = ""; // 组件区分

  private AccurateSearch: Boolean = false; // 精准搜索
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: PInterface.EnableSkuSearch = new PInterface.EnableSkuSearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.SkuSearchType) // 搜索关键词

  private Selected: PInterface.EnableSku[] = []; // 列表选中数据
  private List: PInterface.EnableSku[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.DefaultImage)
            }
          }
        })
      }
    },
    { title: 'SKU编号', key: 'SkuCode', width: 150,
      render: (h: any, params: any): string => {
        return h('Tooltip', {
          props: {
            'content': (params.row as any).SkuCode,
            'maxWidth': 200
          },
          class: 'P-W-100-Percent'
        }, [
          h('p', {
            class: 'P-LINE-1 P-MT-5'
          }, (params.row as any).SkuCode === "" ? '-' : (params.row as any).SkuCode ),
        ])
      }
    },
    { title: 'SKU名称', key: 'SkuName', width: 200,
      render: (h: any, params: any): string => {
        return h('Tooltip', {
          props: {
            'content': (params.row as any).SkuName,
            'maxWidth': 200
          },
          class: 'P-W-100-Percent'
        }, [
          h('p', {
            class: 'P-LINE-1 P-MT-5'
          }, (params.row as any).SkuName === "" ? '-' : (params.row as any).SkuName ),
        ])
      }
    },
		{ title: '平台', key: 'Platform', width: 80, render: (h: any, params: any): string => h('span', this.$Enums.Sales.Platform[(params.row as any).Platform])  },
		{ title: '品类', key: 'CategoryName'},
    { title: '特性标签', key: 'Attribute', width: 100,
      render: (h: any, params: any): string => {
        return h('Tooltip', {
          props: {
            'content': (params.row as any).Attribute,
            'maxWidth': 200
          },
          class: 'P-W-100-Percent'
        }, [
          h('p', {
            class: 'P-LINE-1 P-MT-5'
          }, (params.row as any).Attribute === "" ? '-' : (params.row as any).Attribute ),
        ])
      }
    },
    { title: '供应商', key: 'SupplyName', width: 100, 
      render: (h: any, params: any): string => {
        return h('Tooltip', {
          props: {
            'content': (params.row as any).SupplyName,
            'maxWidth': 200
          },
          class: 'P-W-100-Percent'
        }, [
          h('p', {
            class: 'P-LINE-1 P-MT-5'
          }, (params.row as any).SupplyName === "" ? '-' : (params.row as any).SupplyName ),
        ])
      }
    },
		{ title: '采购价', key: 'PurchasePrice', width: 100, render: (h: any, params: any): string => h('span', params.row.DefaultSupply.PurchasePrice ? `￥${params.row.DefaultSupply.PurchasePrice}` : '-' )},
    { title: '销售主管', key: 'SaleManager', width: 100},
    { title: '申请时间', width: 160, render: (h: any, params: any): string => h('span', {}, this.$UI.Render.Date( (params.row as any).CreateTime, true)) },
    { title: '状态', key: 'Status', width: 120, render: (h: any, params: any): string => h('span', this.$Enums.Warehouse.SkuStatus[(params.row as any).Status] ) }
  ];
}
</script>

<style>

</style>