<!-- 拍摄需求-->
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
            <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Status" :options="DropStatus" />
            <Select class="P-W-200 P-ML-10" placeholder="筛选销售员" v-model="SearchForm.SaleUserId" :options="DropSaleUser" />
              <Select class="P-W-200 P-ML-10" placeholder="筛选美工" v-model="SearchForm.Operator" :options="DropOperator" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="筛选状态" v-model="SearchForm.Status" filterable clearable>
                <Option v-for="(Item, Index) in DropStatus" :key="Index" :value="$Enums.Product.PhotoStatus[Item]">{{Item}}</Option>
              </Select>
              <Select class="P-W-200 P-ML-10" placeholder="筛选销售员" v-model="SearchForm.SaleUserId" filterable clearable>
                <Option v-for="Item in DropSaleUser" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
              </Select>
              <Select class="P-W-200 P-ML-10" placeholder="筛选美工" v-model="SearchForm.Operator" filterable clearable>
                <Option v-for="Item in DropOperator" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
              </Select> -->
            </Col>
          </Dropdown>
        </FormItem>
        <FormItem class="P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
            <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
              <Option v-for="(Item, Index) in SearchKeyTypeDrop" :key="Index" :value="$Enums.Purchase.ProposalType[Item]">{{Item}}</Option>
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
      <ModifyPhotoRequest ref="ModifyPhotoRequest" v-if="Powers.PRequestCreate || Powers.PRequestModify" :Power="Powers.PRequestCreate" @change-modal="HandleMsg" />
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.PRequestToHandle" @click="ValidateOpePon(3)">提交美工处理</Button>
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.PRequestUpload" @click="ValidateOpePon(8)">批量上传图片</Button>
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.RequestRefund" @click="ValidateOpePon(1)">需求退回修改</Button>
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.PhotoRefund" @click="ValidateOpePon(2)">图片退回修改</Button>
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.PRequestReview" @click="ValidateOpePon(4)">通过</Button>
    </Col>
    <Col span="24" class="P-MB-10">
      <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="Table"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
    </Col>
    <ViewPhotoRequest ref="ViewPhotoRequest" />
    <OperaPhotoRequest ref="OperaPhotoRequest" @change-msg="ChangeMsg" />
    <BatchOpePhotoRequest ref="BatchOpePhotoRequest" @clear-modal="ChangeMsg" />
    <PhotoRequestUploadImg ref="PhotoRequestUploadImg" @change-msg="ChangeMsg"/>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';

@Component({
  name: 'PhotoRequest',
  components: {
    ViewPhotoRequest: () => import('@/components/Product/Sku/ViewPhotoRequest.vue'),
    OperaPhotoRequest: () => import('@/components/Product/Sku/OperaPhotoRequest.vue'),
    BatchOpePhotoRequest: () => import('@/components/Product/Sku/BatchOpePhotoRequest.vue'),
    PhotoRequestUploadImg: () => import('@/components/Product/Sku/PhotoRequestUploadImg.vue'),
    ModifyPhotoRequest: () => import('@/components/Product/Sku/ModifyPhotoRequest.vue'),
	}
})

export default class PhotoRequest extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
    this.$UI.Loading.Show();
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['PRequestCreate','PRequestModify','PRequestUpload', 'PRequestToHandle', 'PRequestReview', 'RequestRefund', 'PhotoRefund']))
    this.$set(this, 'DropSaleUser', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '销售员' ))
    this.$set(this, 'DropOperator', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '美工' ))
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.PRequestModify ? Drops.push({ Key: '编辑', Value: 7 }) : null;
    (this.Powers.RequestRefund || this.Powers.PRequestUpload) ? Drops.push({ Key: '处理', Value: 3 }) : null;
    this.Powers.PRequestReview ? Drops.push({ Key: '审核', Value: 4 }) : null;
    Drops.push({ Key: '查看', Value: 5 })
		this.OperateDrop.push(...Drops);
		this.GetList();
  }
  
  // 获取 下拉 
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

  // 获取列表数据
  private GetList(): void {
    this.CancelSelect();
		this.$set(this, 'AccurateSearch', false);
		this.$UI.Loading.Show();
    this.$set(this, 'List', []);

    let SearchForm = JSON.parse(JSON.stringify(this.SearchForm));

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PhotoRequestGetList,
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
  private GetSelected(Data: Interface.PhotoRequestList[] ): void{
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
		this.$set(this, 'SearchForm', new Interface.PhotoRequestSearch())
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
			if(this.Powers[Item] && (Item === 'PRequestCreate' || Item === 'PRequestToHandle' || Item === 'PRequestUpload' || Item === 'RequestRefund' || Item === 'PhotoRefund' || Item === 'PRequestReview' )){
				Flag = 255;
			}
		}   
		return (window.innerHeight - Flag);
  }	

  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }
  
  //批量操作按钮验证
  private ValidateOpePon(Val: number): void{
    if (!this.Selected.length) {
			this.$UI.Tips.Floating('warning', `请选择需求进行操作`);
			return;
    }
    
    if((Val === 1 || Val === 8) && !(this.Selected.every( Item => Item.Status==2))){
			this.$UI.Tips.Floating('warning', `请选择状态为待处理的需求进行操作`);
			return;
    }
    
    if((Val === 2 || Val === 4) && !(this.Selected.every( Item => Item.Status==3))){
			this.$UI.Tips.Floating('warning', `请选择状态为已上传的需求进行操作`);
			return;
    }
    
    if(Val === 3 && !(this.Selected.every( Item => Item.Status==1))){
			this.$UI.Tips.Floating('warning', ` 请选择状态为新建的需求进行操作`);
			return;
    }
    
    this.OperateGroup(Val)
  }

  //列表操作列操作按钮显隐 
	/* (Idx) 1-查看  7-编辑 3-处理 4-审核
	 * (Data) 当前行数据
	 */
  private ControlOpera(Idx: number, Data:Interface.PhotoRequestList): string{
    if(Idx === 5) return 'inline-block';

    if(Idx === 7 && Data.Status === 1){
      return 'inline-block'
    }
    
    if(Idx === 3 && Data.Status === 2){
      return 'inline-block'
    }

    if(Idx === 4 && Data.Status === 3){
      return 'inline-block'
    }

    return 'none'
  }

  //(OpeIdx) 1-需求退回  2-图片退回 3-处理 4-审核 5-查看 6-添加 7-编辑
  private OperateGroup(OpeIdx: number, Idx?: number): void{
    this.$set(this, 'AccurateSearch', false);
    if(Idx !== undefined){
			this.CancelSelect();

      if(OpeIdx === 3 || OpeIdx === 4 || OpeIdx === 5){
        this.GetSkuImages(Idx);
      }
    }
    
    switch (OpeIdx){
      case 1:
      case 2:
      (this.$refs.BatchOpePhotoRequest as any).TriggerModal(Idx === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Idx]))], OpeIdx)
      break;
      case 3:
        (this.$refs.OperaPhotoRequest as any).TriggerModal(Idx === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Idx]))], OpeIdx, Idx === undefined ? this.DropOperator : null)
        break;
      case 4:
        Idx !== undefined ? (this.$refs.OperaPhotoRequest as any).TriggerModal([JSON.parse(JSON.stringify(this.List[Idx]))], OpeIdx, null) : (this.$refs.BatchOpePhotoRequest as any).TriggerModal(this.Selected, OpeIdx);
        break;
      case 5:
        (this.$refs.ViewPhotoRequest as any).TriggerModal(Idx === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Idx]))]);
        break;
      case 6:
      case 7:
        (this.$refs.ModifyPhotoRequest as any).TriggerModal(Idx === undefined ? this.Selected : [JSON.parse(JSON.stringify(this.List[Idx]))], this.DropOperator);
        break;
      case 8:
        (this.$refs.PhotoRequestUploadImg as any).TriggerModal(this.Selected);
        break;
    }
  }

  private GetSkuImages(Idx: number | undefined): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GetSkuImages,
				Login: true
			},
			Data: Idx === undefined ? this.Selected[0].SkuId : this.List[Idx].SkuId,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if(Res.Data.Data.length > 0){
            let Arr: string[] = [];
            Res.Data.Data.forEach( (Item: Interface.GetSkuImagesData) =>{
              Arr.push(Item.ImageUrl)
            })
            this.$set(Idx === undefined ? this.Selected[0] : this.List[Idx], 'SkuImage', Arr)
          }else{
            this.$set(Idx === undefined ? this.Selected[0] : this.List[Idx], 'SkuImage', [])
          }
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
    });
  }

  private ChangeMsg(B: boolean): void{
    if(B){
      this.GetList();
    }
  }

  //添加、编辑组件回调
  private HandleMsg(V: number): void{
    if(V === 1){
      this.OperateGroup(6)
    }

    if(V === 2){
      this.GetList();
    }
  }
  
  private Powers: PInterface.Power = {} // 权限
  private AccurateSearch: Boolean = false;
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.PhotoRequestSearch = new Interface.PhotoRequestSearch(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.ProposalType) // 搜索关键词
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.PhotoStatus) // 状态下拉
  private DropSaleUser: PInterface.KV[] = [] // 销售下拉
  private DropOperator: PInterface.KV[] = [] // 美工下拉
  
  private Selected: Interface.PhotoRequestList[] = []; // 列表选中数据
  private List: Interface.PhotoRequestList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: 'SKU编号', key: 'SkuCode' },
		{ title: '名称', key: 'SkuName', render: (h: any, Params: any): string => {
      return h('Tooltip', {
					props: {
						'content': Params.row.SkuName,
						'maxWidth': 200
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, Params.row.SkuName === "" ? '-' : Params.row.SkuName)
				])
    } },
		{ title: '销售员', key: 'CreatorName' },
		{ title: '美工', key: 'OperatorName' },
		{ title: '参考链接', key: 'DemoUrl', render: (h: any, Params: any): string => {
      let HasHttp = Params.row.DemoUrl.startsWith('http://') || Params.row.DemoUrl.startsWith('https:/');
      return h('a', {
        attrs: {
          href: HasHttp ? Params.row.DemoUrl : 'http://' + Params.row.DemoUrl,
          target: '_blank',
        }
      }, '点击跳转')
    } },
		{ title: '申请时间', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.CreateTime, true)) },
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
		{ title: '状态', render: (h: any, Params: any): string => {
      return h('Tag', {
        props: { color: Params.row.Status === 4 ? 'success' : Params.row.Status === 2 ? 'error' : 'primary' }
      }, this.$Enums.Product.PhotoStatus[(Params.row as any).Status] )
    } },
    { title: '操作', width: 140, render: (h: any, Params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV, Index: number )=>{
          return h('Button', {
            props: {
              type: (Item.Value === 2 && Params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            style: { display: this.ControlOpera(Number(Item.Value), Params.row) },
            class: Index !== this.OperateDrop.length-1 ? 'P-MR-5' : '',
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), Params.row._index)
              }
            }
          }, Item.Key )
        }))
      }
    }
  ];
}
</script>
