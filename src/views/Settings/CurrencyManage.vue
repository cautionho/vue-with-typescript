<template>
	<Row>
		<Col span="24">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<FormItem class="P-MB-0">
					<Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-0">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Col>
		<Col span="24" class="P-MT-10">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
		<Modal v-model="UpdateCurrencyModal" title="编辑汇率" :mask-closable="false">
			<Form inline onsubmit="return false" :label-width="100"  >
				<FormItem :label="`${UpdateCurrencyName}：`" class="P-W-100-Percent P-MB-10">
					<Input v-model="UpdateCurrencyData" type="number" step="0.00001" ref="UpdateCurrencyData" placeholder="汇率" @on-keyup="HandleCurrencyData" @on-enter="HandleUpdateCurrency"></Input>
				</FormItem>
			</Form>
      <div slot="footer">
        <Button type="primary" @click="HandleUpdateCurrency">提交</Button>
        <Button class="P-ML-10" @click="ChangeUpdateModal(false)">取消</Button>
      </div>
    </Modal>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Setting';
@Component({
	name: 'CurrencyManage'
})

export default class CurrencyManage extends Vue {
	/*live start*/
	private mounted() {
		this.GetPoints();
	}
	/*live end*/

	/*methods start*/
	// 获取权限
	private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['CurrencyUpdate']))
    this.SetOperateBtn()
	}
	// 设置操作列
	private SetOperateBtn(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.CurrencyUpdate ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}
	// 获取列表数据
	private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.GetCurrencyList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: this.SearchForm },
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

	// 搜索列表
	private SearchList() {
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}

	// 重置列表
	private ResetList() {
		this.$set(this, 'Pager', { PageIndex: 1, PageSize: 20, TotalItems: 0 });
		this.$set(this, 'SearchForm', { SearchKey: "" })
		this.GetList();
	}

	// 修改列表显示数目
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}

	// 切换页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
	}

	// 计算表格高度
	private CalculateTbHeight(): number {
		return window.innerHeight - 210;
	}

  // 操作列功能
	private OperateGroup(Index: number, Type: number):void {
    switch(Type){
      case 1:
				this.$set(this, 'UpdateCurrencyId', this.List[Index].Id)
				this.$set(this, 'UpdateCurrencyName', this.List[Index].CurrencyName)
				this.$set(this, 'UpdateCurrencyData', this.List[Index].Rate)
        this.ChangeUpdateModal(true)
        break;
    }
	}
	
	// 控制输入框内容
	private HandleCurrencyData(Event: Event):void {
		(this.UpdateCurrencyData as number) = Math.abs(	(this.UpdateCurrencyData as number))
	}
	
	// 编辑修改汇率
	private HandleUpdateCurrency():void {
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.UpdateCurrencyData,
				Login: true
			},
			Data: { Id: this.UpdateCurrencyId, NewRate: this.UpdateCurrencyData },
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.ChangeUpdateModal(false)
					this.GetList();
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}

	// 打开/关闭模态框
	private ChangeUpdateModal(Modal: Boolean): void{
		this.$set(this, 'UpdateCurrencyModal', Modal)
		if (Modal) {
			this.$nextTick(()=>{
				( this.$refs["UpdateCurrencyData"] as any).$refs.input.setAttribute("step", "0.00001");
				( this.$refs["UpdateCurrencyData"] as any).focus();
			})
		}
	}

	/*methods end*/

	/*datas start*/
	private Powers: PInterface.Power = {} // 权限
	private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
	private SearchForm: Interface.StateSearch = { SearchKey: "" }
	private OperateDrop: PInterface.KV[] = []; // 操作项
	private UpdateCurrencyModal: Boolean = false; // 编辑汇率模态框
	private UpdateCurrencyName: String = ""; // 编辑汇率目标名
	private UpdateCurrencyId: number = 0; // 编辑汇率目标Id
	private UpdateCurrencyData: String | Number = ""; // 编辑汇率值
	private List: Interface.CurrencyRate[] = []
	private Cols: PInterface.TableCol[] = [
		{ title: '币种符号', key: 'CurrencyCode' },
		{ title: '货币名称', key: 'CurrencyName' },
		{ title: '汇率', key: 'Rate' },
		{
			title: '操作',
			width: 100,
			render: (h: any, params: any): string => {
				return h('div', this.OperateDrop.map( (item:PInterface.KV, index: number )=>{
          return item.Value == 1 ? h('Button', {
						props: {
							type: 'primary',
							size: 'small'
						},
						on: {
							click: () => {
								this.OperateGroup(params.row._index, Number(item.Value))
							}
						}
					}, item.Value == 1 ? '编辑' : '') : null
 	  	  }))
    	}
		}
	]
	/*datas start*/
}

</script>
<style>
</style>
