<template>
	<Row>
    <Modal title="编辑采购单" v-model="EditModal" :mask-closable="false" :width="1200" @on-cancel="EmitPurchase(false)">
    <Form inline :model="PonBaseData" ref="PonBaseData" :rules="BaseDataRules" :label-width="110" onsubmit="return false">
      <Form-item label="采购单号：" class="P-W-49-Percent" prop="PurchaseCode">
        {{PonBaseData.PurchaseCode}}
      </Form-item>
      <Form-item label="采购员：" class="P-W-49-Percent" prop="PurchaserName">
        {{PonBaseData.PurchaserName}}
      </Form-item>
      <Form-item label="仓库：" class="P-W-49-Percent" prop="WarehouseName">
        <span>{{PonBaseData.WarehouseName}}</span>
      </Form-item>
      <Form-item label="来源：" class="P-W-49-Percent" prop="SourceType">
        {{PonBaseData.SourceType !== 0 ? $Enums.Purchase.SourceType[PonBaseData.SourceType] : PonBaseData.SourceType}}
      </Form-item>
      <Form-item label="采购主管：" class="P-W-49-Percent" prop="PurchaseManager">
        <Select v-model="PonBaseData.PurchaseManager" class="P-W-100-Percent" placeholder="请选择采购主管" :options="PurchaseManagerList" />
        <!-- <Select transfer clearable filterable v-model="PonBaseData.PurchaseManager" class="P-W-100-Percent" placeholder="请选择采购主管">
          <Option v-for="(item,index) in PurchaseManagerList" :value="item.Value" :key="index">{{item.Key}}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="销售主管：" class="P-W-49-Percent" prop="SaleManagerName">
        <span>{{PonBaseData.SaleManagerName}}</span>
      </Form-item>
      <Form-item label="供应商：" class="P-W-49-Percent" prop="SupplyName">
        <span class="P-MR-10">{{PonBaseData.SupplyName}}</span>
        <Button size="small" type="primary" @click="OpenSupplierModal">更换供应商</Button>
      </Form-item>
      <Form-item label="预计到货日期：" class="P-W-49-Percent" prop="ExpectedTime">
        <Date-picker type="date" class="P-W-100-Percent" v-model="PonBaseData.ExpectedTime" placeholder="请选择预计到货日期"></Date-picker>

      </Form-item>
      <Form-item label="运费：" class="P-W-49-Percent" prop="ShippingCost">
        <InputNumber style="width: 420px" v-model="PonBaseData.ShippingCost" :min="0" @on-change="ChangeVal"></InputNumber> CNY
      </Form-item>
      <Form-item label="平台单号：" class="P-W-49-Percent" prop="ThirdOrderCode">
        <Input v-model="PonBaseData.ThirdOrderCode" placeholder="请输入第三方平台单号"></Input>
      </Form-item>
      <Form-item label="备注：" class="P-W-100-Percent" prop="Remark">
        <Input v-model="PonBaseData.Remark" placeholder="请输入备注"></Input>
      </Form-item>
    </Form>
    <div>
      <Table class="P-MT-10" size="small" :highlight-row="true" :columns="ReviewItemCol" :data="ReviewItemData" border stripe height="300"></Table>
      <p>统计：产品种类数 {{ReviewItemData.length}}；产品总数量 {{TotalAmount}}；采购总价 {{PurchaseTotalAmount + ' CNY'}}；总节约成本 {{TotalSaveAmount + ' CNY'}}</p>
    </div>
    <footer slot="footer">
      <Button type="primary" @click="CheckPON(true)" v-if="Power">提交审核</Button>
      <Button type="primary" @click="CheckPON(false)">修改</Button>
      <Button @click="EmitPurchase(false)">取消</Button>
    </footer>
    </Modal>
    <ShowBigPic ref="ShowBigPic" />
    <EnableSupplier ref="ShowEnableModal" :AddCityList="CityTrees"  @emit-eable-supplier="CloseEnableSupp" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
  name: 'ModifyPon',
  components:{
    EnableSupplier: () => import('@/components/Public/EnableSupplier.vue'),
    ShowBigPic: () => import ('@/components/Public/ShowBigPic.vue')
  }
})
export default class ModifyPon extends Vue {
  @Prop() Power: boolean

  @Emit() EmitPurchase(r: boolean): void {
    this.EditModal =false;
		(this.$refs.PonBaseData as any).resetFields();
	}
  
  private TriggerModal(SelectedData:Interface.PurchaseOrd[]):void{
    this.SelectedData = SelectedData
    this.GetDropList()
    if(this.CityTrees.length < 1){
      this.GetAreaTree()
    }
    this.EditModal = true
  }

  //采购主管下拉
  private GetDropList():void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetUserDropList,
				Login: true
			},
			Data: '采购主管',
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.PurchaseManagerList = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
        }
        this.GetDetailInfo()
			}
		})
  }
  
  //获取详情数据
  private GetDetailInfo():void{
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderGetInfo,
				Login: true
			},
			Data: this.SelectedData[0].Id,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.PonBaseData = Res.Data.Data;
          let ExpectedYear = this.PonBaseData.ExpectedTime.slice(0,4)
          this.$set(this.PonBaseData, 'ExpectedTime', (ExpectedYear == '1901' || ExpectedYear == '0001' || ExpectedYear == '1900') ? '' : new Date(this.PonBaseData.ExpectedTime))
          this.$set(this.PonBaseData, 'PurchaseManager', this.PonBaseData.PurchaseManager === 0 ? "" : this.PonBaseData.PurchaseManager)
				} else {
					this.$Request.Error(Res);
        }
        this.GetReviewItem()
			}
		})
  }

  //获取表格数据
  private GetReviewItem():void{
		this.$set(this, 'ReviewItemData', []);
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderGetItem,
				Login: true
			},
			Data: this.SelectedData[0].Id,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.ReviewItemData.push(...Res.Data.Data);
          this.StatisticalSum()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  // 获取省市区树
	private GetAreaTree(): void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ProvincialAreasGetTree,
				Login: false
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'CityTrees', Res.Data.Tree);
					this.SetTreeMenu(this.CityTrees)
				} else {
					this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
			}
		})
  }
  
  //组装成级联菜单所要的数据结构
  private SetTreeMenu(Data: PInterface.AreaTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id);
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetTreeMenu(Data[Item].children);
			}
		}
	}

  //打开可用供应商模态框
  private OpenSupplierModal():void{
    
    (this.$refs["ShowEnableModal"] as any).TriggerModal(false, this.IsLoadingEnableTab, false)
  }

  //可用供应商回调选中供应商
  private CloseEnableSupp(val: boolean, isLoadingTab: boolean, selectData: Interface.Supplier[]): void{
    this.IsLoadingEnableTab = isLoadingTab;
    if(val){
      this.PonBaseData.SupplyName = selectData[0].SupplyName
      this.PonBaseData.SupplyId = selectData[0].Id
    }
  }

  //统计
  private StatisticalSum(): void{
    this.TotalAmount = 0;
    this.PurchaseTotalAmount = 0;
    this.TotalSaveAmount = 0;
    for (let Item in this.ReviewItemData) {
      this.TotalAmount = this.TotalAmount + this.ReviewItemData[Item].Item.PurchaseQuantity;
      this.PurchaseTotalAmount = this.PurchaseTotalAmount + this.ReviewItemData[Item].Item.PurchasePrice * this.ReviewItemData[Item].Item.PurchaseQuantity;
      this.TotalSaveAmount = this.TotalSaveAmount + ((this.ReviewItemData[Item].Item.LowestPrice - this.ReviewItemData[Item].Item.PurchasePrice) * this.ReviewItemData[Item].Item.PurchaseQuantity)
    }
  }

  //查看大图
  private ShowPic(Url: string): void{
    // this.ShowBigPic = true;
    // this.BigPicSrc = data;
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }

  private ChangeVal(): void{
    this.$nextTick(()=>{
      this.$set(this.PonBaseData, 'ShippingCost', parseFloat((this.PonBaseData.ShippingCost*100/100).toFixed(2)))
    })
  }

  //删除明细
  private DelItem(idx: number): void{
    if(this.ReviewItemData.length == 1){
      this.$UI.Tips.Floating('warning', '采购单至少需要保留一条明细')
      return;
    }
    this.ReviewItemData.splice(idx, 1)
  }

  //表格内input框改动值触发 - 采购数量
  private SetPurchaseQuantity(Val: number, Idx:number):void{
    this.ReviewItemData[Idx].Item.PurchaseQuantity = Val
    this.StatisticalSum()
  }

  //表格内input框改动值触发 - 单价
  private SetPurchasePrice(Val: number, Idx:number):void{
    this.ReviewItemData[Idx].Item.PurchasePrice = Val
    this.StatisticalSum()
  }

  //验证
  private CheckPON(v: boolean):void{
    (this.$refs['PonBaseData'] as any).validate((bool: boolean) => {
      if (bool) {
        for (let item in this.ReviewItemData) {
          if (this.ReviewItemData[item].Item.PurchasePrice == 0) {
            this.$UI.Tips.Floating('warning', `[${this.ReviewItemData[item].Item.SkuCode}]单价必须大于0`)
            return;
          }
        }
        
        let PostData: Interface.PurchasePostModify = new Interface.PurchasePostModify()
        PostData["Id"] = this.SelectedData[0].Id
        PostData["SaleManager"] = this.PonBaseData.SaleManagerName
        PostData["PurchaseManager"] = this.PonBaseData.PurchaseManager
        PostData["SupplyId"] = this.PonBaseData.SupplyId
        PostData["ExpectedTime"] = this.$UI.Render.NewDate(this.PonBaseData.ExpectedTime)
        PostData["ShippingCost"] = this.PonBaseData.ShippingCost
        PostData["ThirdOrderCode"] = this.PonBaseData.ThirdOrderCode
        PostData["Remark"] = this.PonBaseData.Remark
        PostData["IsSbumit"] = v

        this.ReviewItemData.forEach( (Items: Interface.PurchaseOrdItem)=>{
          let Obj: Interface.PurchasePostModifyItem = new Interface.PurchasePostModifyItem()
          Obj["Id"] = Items.Item.Id
          Obj["CurrencyCode"] = Items.Item.CurrencyCode
          Obj["PurchasePrice"] = Items.Item.PurchasePrice
          Obj["PurchaseQuantity"] = Items.Item.PurchaseQuantity
          
          PostData.Item.push(Obj)
        })
        
        this.PostReview(PostData)
      }
    })
  }

  //提交
  private PostReview(postData:Interface.PurchasePostModify) {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseOrderModify,
				Login: true
			},
			Data: postData,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.$UI.Tips.Floating('success', postData.IsSbumit ? '提交审核成功' : '编辑采购单成功')
          this.EmitPurchase(true)
				} else {
					this.$Request.Error(res);
				  this.$UI.Loading.Hide();
				}
			}
		})
  }

  private PonBaseData: Interface.PurchaseDetail = new Interface.PurchaseDetail()
  private SelectedData: Interface.PurchaseOrd[] = []
  private ReviewItemData: Interface.PurchaseOrdItem[] = []
  private PurchaseManagerList:PInterface.KV[] = []  //销售主管下拉
  private EditModal: boolean = false; //模态框标识
  private IsLoadingEnableTab: boolean = true;  //打开添加供应商时是否加载表格数据
  private CityTrees:PInterface.AreaTree[] = []; //地区下拉数据
  private TotalAmount: number = 0 //产品总数量
  private PurchaseTotalAmount: number = 0 //采购总价
  private TotalSaveAmount: number = 0 //总节约成本
  private ReviewItemCol: PInterface.TableCol[] = [
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + params.row.Item.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.Item.DefaultImage)
            }
          }
        })
      }
    },
    { title: 'sku编号/产品名称', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { }, params.row.Item.SkuCode)
				]),
				h('p', [
					h('span', { }, params.row.Item.SkuName)
				]),
			])
    } },
    { title: '在线库存/在途库存', key: '', width: 160, render: (h: any, params: any): string => {
			return h('div', [
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '当'),
					h('span', { }, params.row.Inventory.Quantity)
				]),
				h('p', [
					h('span', { class: 'P-Table-Tip P-BG-Primary' }, '途'),
					h('span', { }, params.row.Inventory.PurchasingQuantity)
				]),
			])
    } },
    { title: '销售数据', key: '', render: (h: any, params: any): string =>  
      h('span', params.row.AvgSaleQuantity.AvgSaleQuantity30 + '/' + params.row.AvgSaleQuantity.AvgSaleQuantity15 + '/' + params.row.AvgSaleQuantity.AvgSaleQuantity7)
    },
    // { title: '采购数量', key: '',  render: (h: any, params: any): string =>  h('span', params.row.Item.PurchaseQuantity) },
    { title: '采购数量', key: '', render: (h: any, params: any): string => h('div', [
        h('InputNumber', {
          style: { width:'100%'},
          props: {
            min: 0,
            value: params.row.Item.PurchaseQuantity
          },
          on: {
						'on-change': (Name: number) => {
              this.SetPurchaseQuantity(Name, params.index)
						}
					}
        })
      ])
    },
    { title: '单价', key: '', width: 140, render: (h: any, params: any): string => h('div', [
        h('InputNumber', {
          style: { width:'60px', marginRight: '5px' },
          props: {
            min: 0,
            value: params.row.Item.PurchasePrice
          },
          on: {
						'on-change': (name: number) => {
              this.SetPurchasePrice(name, params.index)
						}
					}
        }),
        h('span', params.row.Item.CurrencyCode)
      ])
    },
    { title: '上次采购价格', key: '', width: 110, render: (h: any, params: any): string => h('span', '￥'+params.row.Item.LastTimePrice) },
    { title: '历史最低单价', key: '', width: 110, render: (h: any, params: any): string => h('span', '￥'+params.row.Item.LowestPrice) },
    { title: '节约成本', key: '',  render: (h: any, params: any): string => 
      h('span', '￥'+((params.row.Item.LowestPrice - params.row.Item.PurchasePrice) * params.row.Item.PurchaseQuantity).toFixed(3)) 
    },
    { title: '操作', width: 80, render: (h: any, params: any): string => {
        return h('div', [
          h('Button', {
              props: {
                  type: 'error',
                  size: 'small'
              },
              on: {
                click: () => {
                  this.DelItem(params.index)
                }
              }
          }, '删除')
        ])
      }
    }
  ]
  private BaseDataRules: any = {
    PurchaseManager: [{ required: true, message: '请选择采购主管', trigger: 'change', type: 'number' }],
    ExpectedTime: [{ required: true, message: '请选择预计到货日期', trigger: 'change', type: 'date' }],
    ShippingCost: [{ required: true, message: '运费必须大于0', trigger: 'change', type: 'number' }]
  }
}

</script>
<style lang="less"></style>
