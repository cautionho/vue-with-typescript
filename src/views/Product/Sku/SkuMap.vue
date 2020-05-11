<!-- SKU别名 -->
<template>
  <Row class="Role-View">
    <Col span="24">
      <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
        <FormItem class="P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
            <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="DropSearchType" />
            <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
		</Col>
    <Col span="24">
      <!-- SKU别名导入 -->
      <SkuAliasImport
        v-if="Powers.SkuMapImport" 
        @handle-res-msg="HandleResMsg" 
      />
      <!-- SKU别名迁移 -->
      <SkuAliasMigrate
        v-if="Powers.SkuMapRemove" 
        @handle-res-msg="HandleResMsg"  
      />
      <!-- 批量删除SKU别名 -->
      <SkuAliasRemoveBatch
        v-if="Powers.SkuMapBatchDel" 
        @handle-res-msg="HandleResMsg"  
      />
      <!-- 导出SKU别名 -->
      <Button class="P-MB-10 P-MR-10" v-if="Powers.SkuMapExport" type="primary" @click="HandleExportSku">导出SKU别名</Button>
      <!-- 添加、编辑组件 -->
      <ModifySkuMap 
        ref="ModifySkuMap" 
        v-if="Powers.SkuMapCreate || Powers.SkuMapModify" 
        @handle-res-msg="HandleResMsg" 
      />
    </Col>
		<Col span="24" >
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="BrandTable"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>

  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';

@Component({
  name: 'SkuMap',
  components: {
    ModifySkuMap: () => import('@/components/Product/Sku/ModifySkuMap.vue'),
    SkuAliasImport: () => import('@/components/Product/Sku/SkuAliasImport.vue'),
    SkuAliasMigrate: () => import('@/components/Product/Sku/SkuAliasMigrate.vue'),
    SkuAliasRemoveBatch: () => import('@/components/Product/Sku/SkuAliasRemoveBatch.vue'),
	}
})

export default class SkuMap extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['SkuMapCreate', 'SkuMapModify','SkuMapImport', 'SkuMapRemove', 'SkuMapExport', 'SkuMapBatchDel']))
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.SkuMapModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
    this.OperateDrop.push(...Drops);
		this.GetList();
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取列表数据
  private GetList(): void {
		this.$UI.Loading.Show();
    this.$set(this, 'List', []);

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SkuMapGetList,
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

	// 搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	// 重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.SkuMapSearch());
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
      this.$set(this, 'Selected',  JSON.parse(JSON.stringify(this.List[Idx])) )
    }
    switch(Type){
      case 1:
        (this.$refs['ModifySkuMap'] as Vue).Trigger(this.Selected)
        break;
    }
  }

  //子组件回调  0-不操作 1-启禁用操作成功 2-添加菜单模态框 3-添加/编辑操作成功
  private HandleResMsg(Type: number): void{
    if( Type === 1){
      this.GetList()
    }
  }

  // 导出Sku
  private HandleExportSku():void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SkuMapExport,
				Login: true
			},
			Data: { 
        SearchKeyType: this.SearchForm.SearchKeyType === "" ? 1 : this.SearchForm.SearchKeyType,
        SearchKey: this.SearchForm.SearchKey
      },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating("success", "导出SKU别名成功")
          window.open(`${this.$Server.Purchase}/${Res.Data.Url}`)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限

  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.SkuMapSearch = new Interface.SkuMapSearch(); //筛选数据

  private DropSearchType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.SkuMap) //关键词下拉

  private ShowModifyModal: boolean = false; // 模态框 - 添加/编辑 

  private Selected: Interface.SkuMapList[] = []; // 列表选中数据
  private List: Interface.SkuMapList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { title: 'SKU编号', key: 'SkuCode', render: (h: any, params: any): string => {
        return h('p', {
          on: {
            click: () => {
              // this.ShowPic(params.row.BrandLogo)
            }
          }
        }, (params.row as any).SkuCode)
      }
    },
		{ title: '产品名称', render: (h: any, params: any): string => {
      return h('Tooltip', {
        props: {
          'content': (params.row as any).SkuName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', {
          class: 'P-MT-5'
        }, (params.row as any).SkuName === "" ? '-' : (params.row as any).SkuName ),
      ])
    }},
    { title: 'SKU别名', key: 'MapCode'},
    { title: '操作', width: 120, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (Item:PInterface.KV): string => {
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              display: (params.row as any).MapCode === "" ? 'none' : 'inline-block'
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