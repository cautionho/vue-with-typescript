<template>
	<Row class="AllegroUploadPro">
    <Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-PL-10 P-PB-10 P-PR-10">
          <Select class="P-W-200 P-ML-10" placeholder="筛选上传结果" v-model="SearchForm.Status" :options="DropStatus" />
          <Select class="P-W-200 P-ML-10" placeholder="筛选店铺" v-model="SearchForm.StoreId" ref="Store" :options="DropStoreList" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选上传结果" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
						<Option v-for="(item, index) in DropStatus" :value="$Enums.Sales.UploadStatus[item]" :key="index">{{ item }}</Option>
					</Select>
          <Select class="P-W-200 P-ML-10" placeholder="筛选店铺" @on-change="OnClearSelect('StoreId')" v-model="SearchForm.StoreId" filterable clearable ref="Store">
						<Option v-for="(item,index) in DropStoreList" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select> -->
          <Cascader ref="cascader" class="P-ML-10" v-model="CategoryIds" transfer placeholder="请选择类目" :render-format="RenderFormat" clearable 
          :data="CategoryList" :load-data="LoadData" change-on-select filterable style="width:150px;display: inline-block;"></Cascader>
          <span class="P-ML-10 P-Inline-Block">选择时间：</span>
          <DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.StartTime" type="datetime" placeholder="开始日期"></DatePicker>
          <span class="P-ML-5 P-Inline-Block">-</span>
          <DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.EndTime" type="datetime" placeholder="结束日期"></DatePicker>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="DropSearchType" />
					<!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchKeyType')" v-model="SearchForm.SearchKeyType" filterable clearable>
						<Option v-for="(item,index) in DropSearchType" :value="$Enums.Sales.UploadSearchType[item]" :key="index">{{item}}</Option>
					</Select> -->
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
		<Col span="24">
      <AllegroDownloadPro v-if="Powers.ExcelTemplate" ref="AllegroDownloadPro" @change-res="ChangeRes" />
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.ImportProduct" @click="ShowUploadPro(1)">上传产品</Button>
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.UploadFailedTemplate" @click="DownloadFailPro">下载上传失败产品</Button>
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Powers.ImportProduct" @click="ShowUploadPro(2)">重新上传产品</Button>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="UploadProTable"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    
    <AllegroUploadProOpe ref="AllegroUploadProOpe" @handle-res="HandleRes" />
    <ShowBigPic ref="ShowBigPic" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Sales';
@Component({
	name: 'AllegroUploadPro',
	components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    AllegroUploadProOpe: () => import('@/components/Sales/AllegroUploadProOpe.vue'),
    AllegroDownloadPro: () => import('@/components/Sales/AllegroDownloadPro.vue')
	}
})

export default class AllegroUploadPro extends Vue {
  private mounted() {
    this.GetCategoryList();
    this.GetPoints();
	}

  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExcelTemplate', 'ImportProduct', 'UploadFailedTemplate']));
    this.GetStoreDropList();
  }
	
	//清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取类目下拉
  private GetCategoryList(): void {
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.AllegroStoreCategoryDropList,
        Login: true
      },
      Data: 0,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
         this.CategoryList = Res.Data.Data.map( (Item: PInterface.KV)=>{
          return {
            value: Item.Key.toString(),
            label: Item.Value,
            children: [],
            loading: false,
            arr: [Item.Key.toString()]
          }
        })
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //自定义级联菜单方法
  private RenderFormat(Labels: string[], SelectedData: Interface.CascaderCategory[]) : string | void{
    const Idx = Labels.length - 1;
    const Data = SelectedData[Idx];
    if (Data) {
      return Labels[Idx]
    }
  }

  private LoadData(Item: Interface.CascaderCategory, Callbacks:any) {
    Item.loading = true
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.AllegroStoreCategoryDropList,
        Login: true
      },
      Data: Item.value,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
         Item.loading = false
          if(Res.Data.Data.length < 1){
            this.$nextTick(()=>{ 
              this.$delete(Item, 'loading');
              this.$set(this, 'CategoryIds', Item.arr)
            })
          }else{
            this.$set(Item, 'children', Res.Data.Data.map( (QItem: PInterface.KV)=>{
              let flag = JSON.parse(JSON.stringify(Item.arr))
              flag.push(QItem.Key.toString())
              return {
                value: QItem.Key.toString(),
                label: QItem.Value,
                children: [],
                loading: false,
                arr: flag
              }
            }))
            this.$nextTick(()=>{
              this.$set(this, 'CategoryIds', [])
              this.CategoryIds.push(...Item.arr)
            })
            Item.loading = false;
          }
          Callbacks();
        } else {
          Item.loading = false;
          this.$Request.Error(Res);
        }
      }
    })
  }

  //获取店铺下拉
  private GetStoreDropList():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales[17].StoreDrop,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.DropStoreList = Res.Data.DropList;
          this.GetList();
        } else {
          this.$Request.Error(Res);
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
		for(let Item in this.Powers){
			if(this.Powers[Item]){
				Flag = 255;
			}
    }
    
		return (window.innerHeight - 255);
  }


  // 获取列表
	private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
    const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.StartTime = SearchForm.StartTime == '' ? '' :  this.$UI["Render"].NewDate(SearchForm.StartTime, true)
    SearchForm.EndTime = SearchForm.EndTime == '' ? '' :  this.$UI["Render"].NewDate(SearchForm.EndTime, true)
    SearchForm.SearchKeyType = SearchForm.SearchKeyType == '' ? 0 : Number(SearchForm.SearchKeyType)
    SearchForm.CategoryId = this.CategoryIds.length < 1 ? 0 : Number(this.CategoryIds[this.CategoryIds.length-1])
    SearchForm.StoreId = SearchForm.StoreId == '' ? 0 : Number(SearchForm.StoreId)
    SearchForm.Status = SearchForm.Status == '' ? 0 : Number(SearchForm.Status)

		this.$Request.Post({
			Server: this.$Server.Sales,
			Api: {
				Address: this.$Api.AllegroStoreUploadProductList,
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

	//获取列表复选框选中的数据
  private GetSelected(Data: Interface.AllegroUploadProList[] ): void{
    this.$set(this, 'Selected', Data)
  }
  
  //取消全选
  private CancelSelect():void {
    (this.$refs["UploadProTable"] as any).selectAll(false);
    this.$set(this, 'Selected', []);
  }

	// 触发“搜索”按钮
	private SearchList(): void {
    let Start = new Date(this.SearchForm.StartTime).valueOf();
    let End = new Date(this.SearchForm.EndTime).valueOf()
    if (Start > End) {
      this.$UI.Tips.Floating('warning', `开始时间不能晚于结束时间`);
      return
    }
    // if(isNaN(Start) && !isNaN(End)){
    //   this.$UI.Tips.Floating('warning', `请选择开始时间`);
    //   return
    // }
    // if(isNaN(End) && !isNaN(Start)){
    //   this.$UI.Tips.Floating('warning', `请选择结束时间`);
    //   return
    // }
		this.$set(this, 'AccurateSearch', false);
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
  }
  

	// 触发“重置”按钮
	private ResetList(): void {
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.AllegroUploadProSearch())
    this.CategoryIds = [];
		this.GetList();
	}

	// 触发“切换页码”
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex', N);
		this.GetList();
  }

  // 触发“切换数据展示数量”
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
  }

  //打开上传产品模态框
  private ShowUploadPro(Val: number): void{
    (this.$refs.AllegroUploadProOpe as any).TriggerModal(Val)
    this.CancelSelect();
  }

  //下载失败产品
  private DownloadFailPro(): void{
    if(this.Selected.length < 1){   //判断筛选项是否符合下载
      let SearchData = JSON.parse(JSON.stringify(this.SearchForm)),
        BeginTime = new Date(SearchData.StartTime).getTime(),
        EndTime = new Date(SearchData.EndTime).getTime();

      if(SearchData.Status !== 3){
        this.$UI.Tips.Floating('warning', '请选择上传结果筛选项为失败');
        return
      }

      if(this.CategoryIds.length < 1){
        this.$UI.Tips.Floating('warning', '请选择类目');
        return
      }

      if(SearchData.StartTime == "" || SearchData.EndTime == "") {
        this.$UI.Tips.Floating('warning', '请选择时间');
        return
      }

      if(BeginTime > EndTime) {
        this.$UI.Tips.Floating('warning', '开始时间不能晚于结束时间');
        return
      }

      if(EndTime - BeginTime > 30*86400000) {
        this.$UI.Tips.Floating('warning', '时间段不能超过30天');
        return
      }
      this.PostDownloadFail(1);

    }else{
      let CurrDate = Date.parse(new Date().toString());
      let flag:number = this.Selected[0].CategoryId;
      if( !(this.Selected.every( Item => { return Item.Status === 3 && (CurrDate-Date.parse(this.$UI["Render"].NewDate(Item.OperatorTime, true))<=30*86400000) && Item.CategoryId === flag })) ){
        this.$UI.Tips.Floating('warning', '请选择同一产品类目下上传结果为失败，且时间段不超过30天的数据再进行下载操作');
        this.CancelSelect();
        return;
      }
      this.PostDownloadFail(2);
    }
  }

  //下载上传失败请求
  PostDownloadFail(Val: number){
    let SearchData = JSON.parse(JSON.stringify(this.searchGroup));
    SearchData.CategoryId = this.CategoryIds.length < 1 ? 0 : Number(this.CategoryIds[this.CategoryIds.length-1])
    SearchData.Ids = Val === 1 ? [] : this.Selected.map( Item => Item.Id )
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Sales,
			Api: {
				Address: this.$Api.AllegroStoreFailedTemplate,
				Login: true
			},
			Data: SearchData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.CancelSelect();
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建批量下载失败产品任务成功。请到报表-导出管理模块查看目前正在进行的任务, 并在导出成功后可以下载对应的数据。`,
            Callback: (B:boolean):void =>{}
          })
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  //上传产品组件回调
  private HandleRes(B: boolean):void{
    if(B){
      this.GetList()
    }
  }

  //组件回调 打开下载模态框
  private ChangeRes(B: boolean): void{
    this.CancelSelect()
    if(B){
      (this.$refs.AllegroDownloadPro as any).TriggerModal(this.CategoryList)
    }
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url);
	}
  
  private Powers: PInterface.Power = {}  // 权限
  private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.UploadStatus);  //上传结果下拉
  // private DropReviseType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.ReviseType);  //类型下拉
  private DropSearchType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.UploadSearchType) //关键词下拉
  private DropStoreList: PInterface.KV[] = [] //店铺下拉
	private SearchForm: Interface.AllegroUploadProSearch = new Interface.AllegroUploadProSearch()	//筛选项默认数据
  private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private List: Interface.AllegroUploadProList[] = [] //列表数据
  private Selected: Interface.AllegroUploadProList[] = [] //列表选中数据

  private CategoryList: Interface.CascaderCategory[] = [] //类目列表
  private CategoryIds: string[] = []  //类目数据
  private DownCategoryIds: string[] = []
  
  private DownloadPro: boolean = false //下载产品模态框
  private OpenUploadmodal: boolean = false //上传产品模态框
  

  private File: any = null //上传使用的数据
  private UploadUrl:string = this.$Server.Sales + this.$Api.AllegroStoreImportProduct
  private Headers: any = {
    "userid": JSON.parse(this.$Cookie.Get('frler_user')).UserId
  }
	
	private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '图片', key: 'Image', width: 80, render: (h, params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + params.row.Image.split(",")[0] + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.Image)
            }
          }
        })
      }
    },
		{ title: 'offer id', key: 'OfferId', width: 120 },
		{ title: 'SKU编号', key: 'SkuCode', width: 120 },
    { title: 'SKU名称', render: (h: any, params: any): string => {
      return h('div', { class: "P-MT-5 P-MB-5" }, [
				h('Tooltip', {
					props: {
						'content': params.row.SkuName,
						'maxWidth': 300
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, params.row.SkuName === "" ? '-' : params.row.SkuName)
				]),
			])
		}},
		{ title: '店铺', key: 'StoreName' },
		{ title: '所属类目', key: 'CategoryName' },
		{ title: '上传结果', render: (h: any, params: any): string => h('span', this.$Enums.Sales.UploadStatus[params.row.Status]) },
    { title: '失败原因', width: 350, render: (h: any, params: any): string => {
      return h('div', { class: "P-MT-5 P-MB-5" }, [
				h('Tooltip', {
					props: {
						'content': params.row.FailMessage,
						'maxWidth': 300
					},
					class: 'P-W-100-Percent'
				}, [
          h('p', { class: 'P-LINE-1' }, params.row.FailMessage === "" ? '-' : params.row.FailMessage)
				]),
			])
		}},
		{ title: '操作人', key: 'OperatorName', width: 100 },
		{ title: '最后操作时间', width: 160, render: (h: any, params: any): string => h('span', this.$UI.Render.Date(params.row.OperatorTime, true)) },
    
  ];
}

</script>
<style lang="less"></style>
