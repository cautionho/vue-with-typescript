<!--库存盘亏盘盈记录-->
<template>
	<Row>
		<Col span="24">
      <Row class="P-Search-Group">
        <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
          <Dropdown trigger="custom" :visible="AccurateSearch">
            <Button type="primary" @click="TriggerSearch">
              精准搜索
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <Col span="24" slot="list" class="P-P-10">
            <Select class="P-W-200 P-ML-10" placeholder="仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
            <!-- <Select class="P-W-200 P-ML-10" placeholder="仓库" @on-change="OnClearSelect('WarehouseId')" v-model="SearchForm.WarehouseId" filterable clearable>
              <Option v-for="Item in DropWarehouseList" :value="Item.Value" :key="Item.Value">{{ Item.Key }}</Option>
            </Select> -->
            <span class="P-ML-10 P-Inline-Block">操作时间：</span>
            <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="datetime" placeholder="开始时间"></DatePicker>
            <span class="P-ML-5 P-Inline-Block">-</span>
            <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="datetime" placeholder="结束时间"></DatePicker>
            </Col>
          </Dropdown>
          <FormItem class="P-MB-10 P-ML-10">
            <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
            <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" :options="SearchKeyTypeDrop" />
              <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchKeyType" filterable clearable>
                <Option v-for="(Item, Index) in SearchKeyTypeDrop" :key="Index" :value="$Enums.Warehouse.InventoryManageType[Item]">{{Item}}</Option>
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
      <ExportInventoryCheckRecord
        :DropWarehouseList="DropWarehouseList"
        v-if="Powers.ExportCheckRecord" 
      />
    </Col>
		<Col span="24">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
    <Col span="24" class="P-MT-10">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
    <ShowBigPic ref="ShowBigPic" />
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'InventoryCheckRecord',
  components: {
    ShowBigPic: () => import ('@/components/Public/ShowBigPic.vue'),
    ExportInventoryCheckRecord: () => import ('@/components/Warehouse/Report/ExportInventoryCheckRecord.vue')
  }
})
export default class InventoryCheckRecord extends Vue {
	private mounted() :void {
    this.GetPoints();
  }

  // 初始化
  private async GetPoints() {
    this.$UI.Loading.Show();
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportCheckRecord']))
    this.$set(this, 'DropWarehouseList', await this.GetDropList<number[], PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, [1] ))
    this.GetList();
  }

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取 仓库 下拉 
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

	//获取列表
  private GetList(): void{
    let SearchGroup: any = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.StartTime = this.$UI["Render"].NewDate(SearchGroup.StartTime, true)
		SearchGroup.EndTime = this.$UI["Render"].NewDate(SearchGroup.EndTime, true)
		SearchGroup.WareHouseId = SearchGroup.WareHouseId === "" ? 0 : SearchGroup.WareHouseId
    const StartStamp = new Date(this.SearchForm.StartTime).getTime()
    const EndStamp = new Date(this.SearchForm.EndTime).getTime()
    if (this.SearchForm.StartTime == "" || this.SearchForm.EndTime == "") {
      this.$UI.Tips.Floating('warning', '请选择操作时间范围')
      return
    }

    if(StartStamp > EndStamp){
      this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
      return;
    }

    if ((EndStamp - StartStamp) / 86400000 > 31) {
      this.$UI.Tips.Floating('warning', '仅支持筛选31天的数据')
      return;
    }
		this.$set(this, 'AccurateSearch', false);
    
		this.$set(this, 'List', [])
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.GetInventoryCheckLogList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: SearchGroup },
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
  
	
	//搜索
  private SearchList(): void{
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
    this.$set(this, 'SearchForm', new Interface.InventoryCheckRecordSearch())
    this.$set(this, 'Pager', new PInterface.Pager());
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
	private Powers: PInterface.Power = {}  // 权限
	
	private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private SearchForm : Interface.InventoryCheckRecordSearch = new Interface.InventoryCheckRecordSearch()  //筛选数据

  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.InventoryManageType) // 搜索关键词
  
	private Pager: PInterface.Pager = new PInterface.Pager() // 分页数据
	private List: Interface.InventoryCheckRecordList[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '30px',
            height: '30px',
            background: 'url(' + this.$Server.File + '/' + params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              (this.$refs['ShowPic'] as Vue).Trigger(params.row.DefaultImage)
            }
          }
        })
      }
    },
		{ title: 'SKU编号', key: 'SkuCode', render: (h, params) => {
      return h('span', {
        class: 'P-Pointer',
        on: {
          click: () => {
            // this.operateGroup(0, params.row._index)
          }
        }
      }, (params.row as any).SkuCode) }
    },
    { title: '产品名', key: 'SkuName', width:300, render: (h, params) => {
      return h('span', {
        class: 'P-Pointer',
        on: {
          click: () => {
            // this.operateGroup(0, params.row._index)
          }
        }
      }, (params.row as any).SkuName) }
    },
		{ title: '仓库', key: 'WarehouseName' },
		{ title: '货架号', key: 'LocationCode' },
		{ title: '旧可用库存', key: 'OldQuantity' },
		{ title: '新可用库存', key: 'NewQuantity' },
		{ title: '盘点库存数', key: 'CheckQuantity' },
		{ title: '平均采购价(CNY)', key: 'AvgPrice' },
		{ title: '金额(CNY)', key: 'Amount' },
		{ title: '操作人', key: 'Operator' },
		{ title: '操作时间', width: 160, render: (h: any, params: any): string => h('span', {}, this.$UI.Render.Date( (params.row as any).OperateTime, true)) },
	]
}

</script>
<style lang="less"></style>

