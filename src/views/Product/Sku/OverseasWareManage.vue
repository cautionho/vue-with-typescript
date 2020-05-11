<!-- 海外仓产品管理-->
<template>
  <Row >
    <Col span="24">
      <Form inline v-model="SearchForm" ref="SearchForm" onsubmit="return false">
        <FormItem class="P-MB-10">
          <Dropdown trigger="custom" :visible="AccurateSearch" placement="bottom-start">
            <Button type="primary" @click="TriggerSearch">
              精准搜索
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <Col span="24" slot="list" class="P-P-10">
              <Cascader class="P-W-200 P-ML-10 P-Inline-Block" @on-change="PickCategory" placeholder="筛选类目" :data="CategoryList" change-on-select filterable clearable v-model="CategoryIds"></Cascader>
              <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选国家" v-model="SearchForm.Country" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" /> -->
              <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选国家" v-model="SearchForm.Country" filterable clearable>
                <Option v-for="Item in CountryData" :value="Item.CountryCode" :key="Item.CountryCode">{{Item.CountryNameCn}}</Option>
              </Select> -->
               <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="DropStatus" /> -->
              <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Status" filterable clearable>
                <Option v-for="(Item, Index) in DropStatus" :key="Index" :value="$Enums.Product.OverseaStatus[Item]">{{Item}}</Option>
              </Select> -->
              <Select class="P-W-200 P-ML-10" placeholder="是否有效" v-model="SearchForm.IsActive" :options="DropActive" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="是否有效" v-model="SearchForm.IsActive" filterable clearable>
                <Option v-for="(Item, Index) in DropActive" :key="Index" :value="$Enums.Product.OverseaActive[Item]">{{Item}}</Option>
              </Select> -->
              <Select class="P-W-200 P-ML-10" placeholder="筛选启用状态" v-model="SearchForm.IsEnable" :options="DropEnable" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选启用状态" v-model="SearchForm.IsEnable" filterable clearable>
                <Option v-for="(Item, Index) in DropEnable" :key="Index" :value="$Enums.Public.Enable[Item]">{{Item}}</Option>
              </Select> -->
            </Col>
          </Dropdown>
        </FormItem>
        <FormItem class="P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
            <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
              <Option v-for="(Item, Index) in SearchKeyTypeDrop" :key="Index" :value="$Enums.Product.OverseaSearchType[Item]">{{Item}}</Option>
            </Select> -->
            <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
    </Col>
    <Col span="24">
      <ChangeStatus class="P-MB-10 P-MR-10 P-VA-T" ref="ChangeStatus" v-if="Powers.ChangeEnable" @emit-change="EmitChange" />
      <AuditOverseasWare class="P-MB-10 P-PR-10 P-VA-T" ref="AuditOverseasWare" v-if="Powers.AuditPass" @handle-res="HandleRes" />
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.BatchExport" @click="ValidExport">批量导出</Button>
      <ImportOverseasWare class="P-MB-10 P-VA-T" v-if="Powers.BatchImport" @handle-res="HandleRes" />
    </Col>
    <Col span="24" class="P-MB-10">
      <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
    </Col>
    <ShowBigPic ref="ShowBigPic" />
    <ViewOverseasWare ref="ViewOverseasWare" />
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';

@Component({
  name: 'OverseasWareManage',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
    AuditOverseasWare: () => import('@/components/Product/Sku/AuditOverseasWare.vue'),
    ImportOverseasWare: () => import('@/components/Product/Sku/ImportOverseasWare.vue'),
    ViewOverseasWare: () => import('@/components/Product/Sku/ViewOverseasWare.vue'),
	}
})

export default class OverseasWareManage extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

	//获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['BatchExport', 'BatchImport', 'AuditPass', 'ChangeEnable']))
    this.GetCountryDropList()
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [{ Key: '查看', Value: 3 }];
		this.Powers.AuditPass ? Drops.push({ Key: '审核通过', Value: 1 },{ Key: '审核不通过', Value: 2 }) : null;
		this.Powers.ChangeEnable ? Drops.push({ Key: '启禁用', Value: 4 }) : null;
		this.OperateDrop.push(...Drops);
  }

  //获取国家
  private GetCountryDropList(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.CountryList
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.CountryData = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
    this.GetCategory();
  }

  //获取品类
  private GetCategory(): void{
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.CategoryGetCategoryTree
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'CategoryList', Res.Data.Tree);
					this.SetTreeMenu(this.CategoryList)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
		this.GetList();
  }

  //组装成级联菜单所要的数据结构
	private SetTreeMenu(Data: PInterface.ProductCagtegoryTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id);
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetTreeMenu(Data[Item].children);
			}
		}
	}

  // 获取列表数据
  private GetList(): void {
		this.$UI.Loading.Show();
    this.CancelSelect();
		this.$set(this, 'AccurateSearch', false);
    this.$set(this, 'List', []);

    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.IsActive = SearchForm.IsActive === "" ? "" : SearchForm.IsActive === 1 ? true : false;
    SearchForm.IsEnable = SearchForm.IsEnable === "" ? "" : SearchForm.IsEnable === 1 ? true : false;

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.OverseaSkuGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchForm },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
					this.$set(this, 'List', Res.Data.PageModel.Items);
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}

	// 获取列表复选框选中的数据
  private GetSelected(Data: Interface.OverseasWareManageList[] ): void{
    this.$set(this, 'Selected', Data)
  }

	// 取消全选
  private CancelSelect():void {
    (this.$refs["Table"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	// 重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.OverseasWareManageSearch())
		this.GetList();
	}
	
	//  切换列表条数
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
	}
	
	//  切换列表页码
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex', N);
		this.GetList();
  }
  
  //  获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }	

  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }

  //列表操作列操作按钮显隐 
	/* (Idx) 1-查看  2-通过 3-不通过 4-启禁用
	 * (Data) 当前行数据
	 */
	private ControlOpera(Idx: number, Data:Interface.OverseasWareManageList): string{
    if( (Idx === 1 && !(Data.Status === 7||Data.Status === 8)) || (Idx === 2 && Data.Status !== 7) ){
      return 'none';
    }else{
      return 'block';
    }
  }

  //批量操作按钮验证   1-通过 2-不通过
  private ValidateOpePon(Val: number): void{
    if (!this.Selected.length) {
			this.$UI.Tips.Floating('warning', `请选择产品进行操作`);
			return;
    }
    this.OperateGroup(Val)
  }

  // 列表操作项	(Type 1-通过 2-不通过 3-查看 4-启禁用)	(Index 当前编辑数据索引)
  private OperateGroup(Type: number, Index?: number):void{
    this.$set(this, 'AccurateSearch', false);
    if(Index !== undefined) this.CancelSelect();

    switch(Type){
			case 1:
			case 2:	
        (this.$refs["AuditOverseasWare"] as any).TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], Type);
        break;
      case 3:
        (this.$refs["ViewOverseasWare"] as any).TriggerModal(Index === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Index]))], Type);
        break;
      case 4:
				this.ChangeStatusObj.ToTarget = !this.List[Index as number].IsEnable;
        (this.$refs["ChangeStatus"] as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Index as number]))], this.ChangeStatusObj);
        break;
    }
  }

  private ValidExport(): void{
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: this.Selected.length > 0 ? '是否批量导出当前勾选的海外仓产品数据' : '是否批量导出当前筛选条件下的海外仓产品数据',
      Callback: (B: boolean) => {
        if (B) {
          this.ExportData()
        }
      }
    })
  }
  
  private ExportData():void{
    let Obj: Interface.OverseasWareManageExport = JSON.parse(JSON.stringify(this.SearchForm));
    Obj.Ids = this.Selected.length > 0 ? this.Selected.map(Item=>Item.Id) : [];
    
    let SearchForm  = JSON.parse(JSON.stringify(Obj));
    SearchForm.IsActive = SearchForm.IsActive === "" ? "" : SearchForm.IsActive === 1 ? true : false;
    SearchForm.IsEnable = SearchForm.IsEnable === "" ? "" : SearchForm.IsEnable === 1 ? true : false;

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.OverseaSkuExport,
        Login: true
      },
      Data: SearchForm,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出海外仓产品任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
            Callback: (B:boolean):void =>{}
          })
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  /*
	批量禁启用组件回调
		Res true-操作成功
		Target  1-启用 0-禁用
	*/
	private EmitChange(Res: boolean, Target?: number){
		if(Target !== undefined){
			this.ChangeStatusObj.ToTarget = Target === 1 ? true : false;
			(this.$refs["ChangeStatus"] as any).TriggerModal(this.Selected, this.ChangeStatusObj);
		}

		if(Res){
      this.GetList()
		}
  }
  
  //审核组件回调    Target 1-通过 2-不通过
  private HandleRes(B: boolean, Target?: number): void{
    if(Target !== undefined){
      this.ValidateOpePon(Target);
    }

    if(B){
      this.GetList()
		}
  }

  // 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.ShowBigPic.Trigger(Url);
	}

  private PickCategory(Value: number[], selectedData: any){
    this.CategoryIds = Value;
    this.$set(this.SearchForm, 'CategoryId', this.CategoryIds.length ? this.CategoryIds[this.CategoryIds.length-1] : 0)
  }
  
  private CategoryIds: number[] = []
  private CategoryList: PInterface.ProductCagtegoryTree[] = []; //类目数组
  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Purchase, Api: this.$Api.OverseaSkuChangeEnable, IdKey: 'Ids', StatusKey: 'IsEnable', ToTarget: false, TipsKey: '产品' };

  private Powers: PInterface.Power = {} // 权限
  private AccurateSearch: Boolean = false;
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private CountryData:PInterface.CountryEntity[] = []; //国家下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.OverseaSearchType) // 搜索关键词
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.OverseaStatus) // 状态下拉
  private DropActive: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.OverseaActive) // 有效下拉
  private DropEnable: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable) // 启用状态下拉
  private SearchForm: Interface.OverseasWareManageSearch = new Interface.OverseasWareManageSearch(); //筛选数据
  private Selected: Interface.OverseasWareManageList[] = []; // 列表选中数据
  private List: Interface.OverseasWareManageList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, Params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + Params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.DefaultImage)
            }
          }
        })
      }
    },
		{ title: 'SKU编号', width: 140, key: 'OverseaSkuCode' },
		{ title: '产品名', key: 'OverseaSkuName' },
		{ title: '国家', width: 160, render: (h: any, Params: any): string => h('p', `${Params.row.CountryNameCn}(${Params.row.CountryCode})`) },
		{ title: '产品状态', width: 120, render: (h: any, Params: any): string => h('p', this.$Enums.Product.OverseaStatus[Params.row.Status]) },
		{ title: '有效状态', width: 100, render: (h: any, Params: any): string => {
      return h('Tag', {
          props: { color: Params.row.IsActive ? 'success' : 'error' }
        }, Params.row.IsActive ? '有效' : '无效' )
    } },
    { title: '启用状态', key: 'IsEnable', width: 100, render: (h: any, Params: any): string => {
				return h('Icon', {
          props: { 
            type: Params.row.IsEnable ? 'md-checkmark' : 'md-close',
            size: '18'
          },
					class: Params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error'
				})
      }
    },
		{ title: '备注', key: 'Remark', render: (h: any, Params: any): string =>{
      if(Params.row.Remark === ""){
        return h('span', '-')
      } else{
        return h('Tooltip', {
					props: {
						'content': Params.row.Remark,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, Params.row.Remark)
				])
      }
    } },
    { title: '操作',width: 100,align: 'center',render: (h: any, Params: any): string => {
				return h('Dropdown',{
					on: {
            'on-click': (Name: any) => {
              this.OperateGroup(Name, Params.row._index)
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
						}, Item.Value === 4 ? (Params.row.IsEnable ? '禁用' : '启用') : Item.Key);
					}))
				])
			}
    }
  ];
}
</script>
