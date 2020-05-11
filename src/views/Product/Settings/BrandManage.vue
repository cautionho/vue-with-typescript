<!-- 品牌管理 -->
<template>
  <Row class="Role-View">
    <Col span="24">
      <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
        <FormItem class="P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-ML-10 P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
		</Col>
    <Col span="24">
      <ModifyBrand 
        ref="ModifyBrand" 
        v-if="Powers.ProBrandModify" 
        @handle-res-msg="HandleResMsg" 
      />
    </Col>
		<Col span="24">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="BrandTable" @on-selection-change="GetSelected"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>

    <ShowBigPic ref="ShowBigPic"></ShowBigPic>

  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';

@Component({
  name: 'BrandManage',
  components: {
    ModifyBrand: () => import('@/components/Product/Settings/ModifyBrand.vue'),
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')

	}
})

export default class BrandManage extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ProBrandView','ProBrandCreate','ProBrandModify']))
    this.SetOperateDrop()
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.ProBrandModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
    this.OperateDrop.push(...Drops);
		this.GetList();
  }

  // 获取列表数据
  private GetList(): void {
		this.$UI.Loading.Show();
    this.$set(this, 'List', []);

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.GetBrandList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: this.SearchForm },
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
  private GetSelected(data: Interface.BrandManageList[] ): void{
    this.$set(this, 'Selected', data)
  }

	// 取消全选
  private CancelSelect():void {
    (this.$refs["BrandTable"] as any).selectAll(false);
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
    this.$set(this, 'SearchForm', new Interface.BrandManageSearch());
    this.$set(this, 'CurOrganizationId', []);
		this.GetList();
	}
	
	//  切换列表条数
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}
	
	//  切换列表页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
  }
  
  // 计算表格高度
	private CalculateTbHeight(): number {
		return window.innerHeight - 250;
	}

  // 列表操作列 
  // 1-批量新增权限
  private OperateGroup(Type:number, Idx?:number): void{ 
    if (typeof Idx === 'number') {
      this.CancelSelect()
      this.$set(this, 'Selected',  [JSON.parse(JSON.stringify(this.List[Idx]))] )
    }

    switch(Type){
      case 1:
        (this.$refs['ModifyBrand'] as Vue).Trigger(this.Selected)
        break;
    }
  }

  //子组件回调  0-不操作 1-启禁用操作成功 2-添加菜单模态框 3-添加/编辑操作成功
  private HandleResMsg(Type: number){
    this.CancelSelect()
    this.$set(this, 'ShowBrandModal', false)

    if(Type == 1){
      this.GetList()
    }else if(Type == 2){
      this.OperateGroup(1)
    }
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }
  
  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限

  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.BrandManageSearch = new Interface.BrandManageSearch(); //筛选数据

  private ShowBrandModal: boolean = false; // 模态框 - 添加/编辑 

  private Selected: Interface.BrandManageList[] = []; // 列表选中数据
  private List: Interface.BrandManageList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
    { title: '品牌LOGO', key: 'BrandLogo', width: 160, render: (h: any, params: any): string => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + params.row.BrandLogo + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.BrandLogo)
            }
          }
        })
      }
    },
		{ title: '品牌名称', key: 'BrandName' },
    { title: '网址', key: 'BrandUrl',  render: (h: any, params: any): string => {
      const HasHttp = params.row.BrandUrl.slice(0, 7).toLowerCase() == 'http://' || params.row.BrandUrl.slice(0, 7).toLowerCase() == 'https:/'
      return h('a', {
        attrs: {
          href: HasHttp ? params.row.BrandUrl : 'http://' + params.row.BrandUrl,
          target: "_blank"
        } 
      }, params.row.BrandUrl === '' ? "" : '点击跳转')
    }},
    { title: '备注', key: 'Remark' },
    { title: '添加时间 ',key: 'CreateTime', width: 160, render: (h: any, params: any): string => h('span', {}, this.$UI.Render.Date( params.row.CreateTime, true)) },
    { title: '操作', width: 140, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV): string => {
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                this.OperateGroup(Number(Item.Value), params.row._index)
              }
            }
          }, Item.Key )
        }))
      }
    }
  ];
}
</script>

<style lang="less">

</style>