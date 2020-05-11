  <!-- 作图需求 -->
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
            <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.ProcessStatus" :options="DropStatus" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="状态" v-model="SearchForm.ProcessStatus" filterable clearable>
                <Option v-for="(Item, Index) in DropStatus" :key="Index" :value="$Enums.Product.PhotoStatus[Item]">{{ Item }}</Option>
              </Select> -->
              <Select class="P-W-200 P-ML-10" placeholder="发布人" v-model="SearchForm.CreateUserId" :options="DropCreateUserList" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="发布人" v-model="SearchForm.CreateUserId" filterable clearable>
                <Option v-for="Item in DropCreateUserList" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
              </Select> -->
              <Select class="P-W-200 P-ML-10" placeholder="美工" v-model="SearchForm.OperateUserId" :options="DropOperateUserList" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="美工" v-model="SearchForm.OperateUserId" filterable clearable>
                <Option v-for="Item in DropOperateUserList" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
              </Select> -->
              <Select class="P-W-200 P-ML-10" placeholder="排序方式" v-model="SearchForm.OrderByType" :options="DropOrderByType" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="排序方式" v-model="SearchForm.OrderByType" filterable clearable>
                <Option v-for="(Item, Index) in DropOrderByType" :key="Index" :value="$Enums.Product.SortType[Item]">{{ Item }}</Option>
              </Select> -->
              <Cascader  class="P-W-200 P-ML-10 P-Inline-Block" placeholder="品类" transfer :data="Tree" v-model="SearchForm.CategoryId" @on-change="SetCategory" change-on-select filterable  />
              <Select class="P-W-200 P-ML-10" placeholder="时间类型" v-model="SearchForm.TimeType" :options="DropTimeype" />
              <!-- <Select class="P-W-200 P-ML-10" placeholder="时间类型" v-model="SearchForm.TimeType" filterable clearable>
                <Option v-for="(Item, Index) in DropTimeype" :key="Index" :value="$Enums.Product.TimeType[Item]">{{ Item }}</Option>
              </Select> -->
              <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="开始时间"></DatePicker>
              <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="结束时间"></DatePicker>
            </Col>
          </Dropdown>
          <FormItem class="P-ML-10 P-MB-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
            <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
            <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
                <Option v-for="(Item, Index) in SearchKeyTypeDrop" :key="Index" :value="$Enums.Product.RequirementsType[Item]">{{Item}}</Option>
              </Select> -->
            <Button slot="append" type="primary" @click="SearchList">搜索</Button>
            </Input>
          </FormItem>
          <Button type="warning" @click="ResetList()">重置</Button>
      </Form>
		</Col>
    <Col span="24">
      <!-- 添加作图需求 -->
      <ModifyDrawingRequirements
        ref="ModifyDrawingRequirements"
        v-if="Powers.AddOrEditDrawing"
        :DropOperateUserList="DropOperateUserList"
      />
      <!-- 批量导入作图需求 -->
      <BatchImportDrawingRequirements
        v-if="Powers.BatchImportRequire"
        @handle-res-msg="HandleBatchImport" 
      />
      <!--提交美工处理 需求退回修改 审核 更换美工-->
      <DrawingRequirementsOperator
        ref="DrawingRequirementsOperator"
        :Powers="Powers"
        :DropOperateUserList="DropOperateUserList"
        @handle-res-msg="HandleOperator"
      />
      <!-- 下载美工作图 -->
      <Button v-if="Powers.DownloadArtistImg" class="P-MB-10 P-MR-10" type="primary" @click="HandleDownloadImages">下载美工作图</Button>
      <!-- 数据统计导出 -->
      <Button v-if="Powers.ExportDrawData" class="P-MB-10 P-MR-10" type="primary" @click="HandleExport">数据统计导出</Button>
    </Col>
    <Col span="24" class="P-MB-10">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="Table" @on-selection-change="GetSelected"></Table>
		</Col>
		<Col span="24">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <!-- 详情 -->
    <DrawingRequirementsDetail 
      ref="DrawingRequirementsDetail"
      @handle-res-msg="HandleDetail"
    />
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';
/*interface end*/

@Component({
  name: 'DrawingRequirements',
  components: {
    DrawingRequirementsDetail: () => import('@/components/Product/Sku/DrawingRequirementsDetail.vue'),
    ModifyDrawingRequirements: () => import('@/components/Product/Sku/ModifyDrawingRequirements.vue'),
    BatchImportDrawingRequirements: () => import('@/components/Product/Sku/BatchImportDrawingRequirements.vue'),
    DrawingRequirementsOperator: () => import('@/components/Product/Sku/DrawingRequirementsOperator.vue')
  }
})

export default class DrawingRequirements extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取 权限 下拉 初始化
  private async GetPoints(): Promise<void> {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['AddOrEditDrawing','SubmitToDeal','BatchImportRequire','BackToEdit','AuditRequire', 'DownloadArtistImg', 'DownloadMaterialImg', 'GetHomeData', 'ArtistUploadImages', 'ChangeAritist', 'ExportDrawData']))
    this.$set(this, 'DropCreateUserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '销售' ))
    this.$set(this, 'DropOperateUserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, '美工' ))
    await this.GetTree()
    this.SetOperateDrop()
  }
  
  // 初始化列表操作按钮
	private SetOperateDrop(): void { 
    // 0-查看 1-编辑 2-删除 3-处理 4-下载素材图片 5-审核 6-下载美工作图 7-更换美工
		let Drops: PInterface.KV[] = [{ Key: '查看', Value: 0 }];
		this.Powers.AddOrEditDrawing ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.DeleteDrawing ? Drops.push({ Key: '删除', Value: 2 }) : null;
		this.Powers.ArtistUploadImages ? Drops.push({ Key: '处理', Value: 3 }) : null;
		this.Powers.DownloadMaterialImg ? Drops.push({ Key: '下载素材图片', Value: 4 }) : null;
		this.Powers.AuditRequire ? Drops.push({ Key: '审核', Value: 5 }) : null;
		this.Powers.DownloadArtistImg ? Drops.push({ Key: '下载美工作图', Value: 6 }) : null;
		this.Powers.ChangeAritist ? Drops.push({ Key: '更换美工', Value: 7 }) : null;
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
	  			if (!Res.IsSuccess) this.$Request.Error(Res);

          resolve( Res.Data.DropList || [] )
		  	}
	  	})
    })
  }

  // 获取品类树
  private GetTree(): void {
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.CategoryGetCategoryTree,
				Login: true
			},
			Data: true,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this, 'Tree', Res.Data.Tree)
          this.IntegratedData(this.Tree)
				} else {
					this.$Request.Error(Res);
				}
			}
		})
  }

  // 整合成树组件、级联菜单需要的数据结构以及默认打开树激活节点
  private IntegratedData(Data: PInterface.ProductCagtegoryTree[]):void{
    Data.forEach((Item: PInterface.ProductCagtegoryTree) => {
      this.$set(Item, 'title', Item.Name)
      this.$set(Item, 'children', Item.ChildNodes)
      this.$set(Item, 'ParentId', Item.ParentId.toString())
      this.$set(Item, 'value', Item.Id.toString())
      this.$set(Item, 'label', Item.Name)
      if ( Item.ChildNodes.length > 0 ) {
        this.IntegratedData(Item.ChildNodes)
      }
    })
  }

  // 获取列表
	private GetList(): void {
    this.$set(this, 'List', []);
    
		let SearchGroup: any = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.StartTime = this.$UI["Render"].NewDate(SearchGroup.StartTime, true)
    SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
    SearchGroup.CategoryId = Number(SearchGroup.CategoryId[SearchGroup.CategoryId.length - 1]);

    const StartStamp = new Date(this.SearchForm.StartTime).getTime()
    const EndStamp = new Date(this.SearchForm.EndTime).getTime()

    if ((this.SearchForm.StartTime === "" && this.SearchForm.EndTime !== "") || (this.SearchForm.StartTime !== "" && this.SearchForm.EndTime === "")) {
      this.$UI.Tips.Floating('warning', '请选择时间范围')
      return
    }

    if(StartStamp > EndStamp){
      this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
      return;
    }

		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GetDrawList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchGroup },
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.Pager.TotalItems = res.Data.PageModel.TotalItems;
					this.List.push(...res.Data.PageModel.Items);
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
  private GetSelected(data: Interface.DrawingRequirementsList[] ): void{
    this.$set(this, 'Selected', data)
  }

	//取消全选
  private CancelSelect():void {
    (this.$refs["Table"] as any).selectAll(false);
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
		this.$set(this, 'SearchForm', new Interface.DrawingRequirementsSearch())
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

  // 品类 值获取
  private SetCategory(Data: string[]): void {
    ( this.SearchForm.CategoryId as number[] ).splice(0, ( this.SearchForm.CategoryId as number[] ).length, ...Data.map( Item => Number(Item) ) )
  }
  
  /*
	列表操作列操作按钮触发方法  
	OpeIndex:  0-查看 1-编辑 2-删除 3-处理 4-下载素材图片 5-审核 6-下载美工作图 7-更换美工
	Index： 操作列索引
	*/
	private OperateGroup(Type:number, Idx?:number): void {	
    this.CancelSelect()
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : []);
    switch(Type){
      case 0: 
        ( this.$refs["DrawingRequirementsDetail"] as Vue ).Trigger(this.Selected, false)
        break;
      case 1:
        ( this.$refs["ModifyDrawingRequirements"] as Vue ).Trigger(this.Selected[0].Id)
        break;
    //   case 2:
    //     this.$set(this, 'ShowLogisticsModal', true)
    //     break;
      case 3:
        ( this.$refs["DrawingRequirementsDetail"] as Vue ).Trigger(this.Selected, true)
        break;
      case 4:
        this.HandleDownloadSkuImages(this.Selected[0]);
        break;
      case 5:
        ( this.$refs["DrawingRequirementsOperator"] as Vue ).Trigger(this.Selected, 3)
        break;
      case 6:
        this.HandleDownloadImages()
        break;
      case 7:
        ( this.$refs["DrawingRequirementsOperator"] as Vue ).Trigger(this.Selected, 4)
        break;
    }
  }
  
  // 批量导入作图需求
  private HandleBatchImport(Type: number): void {
    if (Type === 1) {
      this.GetList()
    }
  }

  // 下载美工作图
  private HandleDownloadImages(): void {

    if (this.Selected.length === 0 || this.Selected.some(Item => Item.ProcessStatus !== 4)) {
      this.$UI.Tips.Floating('warning', `请选择状态为已完成的作图需求进行下载美工作图操作`)
      return;
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.DownloadArtistImage,
				Login: true
			},
			Data: this.Selected.map(Item => Item.Id),
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();

				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `下载美工作图成功`);
          window.open(`${this.$Server.Purchase}${Res.Data.Url}`);
				} else {
					this.$Request.Error(Res);
        }
        
        this.CancelSelect()
			}
    });
  }

  // 下载素材图片
  private HandleDownloadSkuImages(Target: Interface.DrawingRequirementsList): void {

    if (Target.ProcessStatus !== 2) {
      this.$UI.Tips.Floating('warning', `只能导出待处理作图需求的图片`);
      return;
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.DownloadSkuImage,
				Login: true
			},
			Data: Target.Id,
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();

				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `下载素材图片成功`);
          window.open(`${this.$Server.Purchase}${Res.Data.Url}`);
				} else {
					this.$Request.Error(Res);
        }
        this.CancelSelect()
			}
    });
  }

  // 导出
  private HandleExport(): void {
    if( this.SearchForm.TimeType === "" ) {
      this.$UI.Tips.Floating('warning', `请选择时间类型`)
      return
    }
    if( this.SearchForm.StartTime === "" ) {
      this.$UI.Tips.Floating('warning', `请选择开始时间`)
      return
    }
    if( this.SearchForm.EndTime === "" ) {
      this.$UI.Tips.Floating('warning', `请选择结束时间`)
      return
    }
    if(Date.parse(this.SearchForm.StartTime.toString()) > Date.parse(this.SearchForm.EndTime.toString())){
			this.showWarning('warning', '开始时间不能晚于结束时间');
			return
    }

    let PostData: any = JSON.parse(JSON.stringify(this.SearchForm))

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.StatisticsExport,
				Login: true
			},
			Data: {
        TimeType: PostData.TimeType,
				StartTime: this.$UI.Render.Date( PostData.StartTime, true),
				EndTime: this.$UI.Render.Date( PostData.EndTime, true)
      },
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();

				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `创建导出交易记录任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据任务成功。<br/>请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据`);
				} else {
					this.$Request.Error(Res);
				}
			}
    });
  }

  // 操作处理回调
  private HandleOperator(Type: number, Handle?: string, Target?: Interface.DrawingRequirementsList): void {
    if (Type === 1) {
      this.GetList()
    } else if (Type === 2) {
      ( this.$refs["DrawingRequirementsOperator"] as Vue ).Trigger(this.Selected)
    }
  }

  // 详情- 处理 回调
  private HandleDetail(Type:number, Handle?: string, Target?: Interface.DrawingRequirementsList): void {
    if (Type === 1) {
      this.GetList()
    } else if (Type === 2) {
      if ( Handle !== undefined && Target !== undefined) {
        if ( Handle === 'HandleDownloadSkuImages' ) {
          this.HandleDownloadSkuImages(Target);
        } else if ( Handle === 'DrawingRequirementsOperator' ) {
          ( this.$refs["DrawingRequirementsOperator"] as Vue ).Trigger([Target], 2)
        }
      }
    }
    
  }


  //控制列表操作列下拉按钮显示隐藏
	private ControlOpera(OpeIndex:number, RowData: Interface.DrawingRequirementsList): string{
    switch (OpeIndex) { 
      // 查看
      case 0: return 'block';
      // 编辑
      case 1: 
      // 删除
      case 2: return RowData.ProcessStatus === 1 ? 'block' : 'none';
      // 处理
      case 3: 
      // 下载素材图片
      case 4: return RowData.ProcessStatus === 2 ? 'block' : 'none';
      // 审核
      case 5: return RowData.ProcessStatus === 3 ? 'block' : 'none';
      // 下载美工作图
      case 6: return RowData.ProcessStatus === 4 ? 'block' : 'none';
      // 更换美工
      case 7: return RowData.ProcessStatus === 2 ? 'block' : 'none';
      default: return 'none';
    }
  }

  private Powers: PInterface.Power = {}  // 权限
  
  private DropCreateUserList: PInterface.KV[] = [];  // 销售下拉
  private DropOperateUserList: PInterface.KV[] = []; // 美工下拉
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.PhotoStatus); // 状态枚举下拉
  private DropOrderByType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.SortType); // 排序枚举下拉
  private DropTimeype: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.TimeType); // 时间类型枚举下拉
  
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private AccurateSearch: Boolean = false; // 精准搜索
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.DrawingRequirementsSearch = new Interface.DrawingRequirementsSearch(); //筛选数据
  private SearchKeyTypeDrop: string[] = this.$Utils.GetEnumArr(this.$Enums.Product.RequirementsType) // 搜索关键词
  private Tree: PInterface.ProductCagtegoryTree[] = [] // 品类 树

  private Selected: Interface.DrawingRequirementsList[] = []; // 列表选中数据
  private List: Interface.DrawingRequirementsList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
	  { title: '编号', key: 'Id', width: 100 },
    { title: 'SPU编号', key: 'SkuCode', render: (h: any, params: any): string => {
      return h('span', {
        class: 'P-Pointer',
        on: {
          click: () => {
            this.OperateGroup(0, params.row._index)
          }
        }
      }, (params.row as any).SkuCode)
    }},
    { title: '发布人', key: 'CreateUserName', width: 200 },
    { title: '美工', key: 'OperateUserName', width: 200 },
    { title: '期望时间', width: 160, render: (h: any, params: any): string => h('span', this.$UI.Render.Date( (params.row as any).ExpectTime, true) ) },
    { title: '描述', key: 'Description', className: 'Copy-Url', 
      render: (h: any, params: any): string => {
        return h('Tooltip', {
          props: {
            'content': (params.row as any).Description,
            'maxWidth': 600
          },
          class: 'P-W-100-Percent'
        }, h('p', { class: 'P-LINE-1 P-MT-5' }, (params.row as any).Description === "" ? '-' : (params.row as any).Description ),
        )
    }},
    { title: '状态', key: 'ProcessStatus', width: 120,
      render: (h: any, params: any): string => {
			  return h('Tag', {
          props: { color: ['primary', 'error', 'primary', 'success'][(params.row as any).ProcessStatus - 1] }
        }, this.$Enums.Product.PhotoStatus[(params.row as any).ProcessStatus] )
      }
    },
    { title: '操作',width: 100,align: 'center',render: (h: any, params: any): string => {
		    return h('Dropdown',{
            on: {
                'on-click': (name: any) => {
                  this.OperateGroup(name, params.row._index)
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
                    style: { display: this.ControlOpera(Number(Item.Value), params.row) },
                }, Item.Key);
            }))
	      ])
    }}
  ];
}

</script>
<style lang="less"></style>
