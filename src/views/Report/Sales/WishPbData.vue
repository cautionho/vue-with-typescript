<!--wish pb数据报表-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" :model="SearchForm" :rules="RuleValidate" onsubmit="return false">
        <FormItem class="P-Inline-Block P-MB-10">
          <Select class="P-W-200" v-model="SearchForm.StoreId" placeholder="筛选店铺" ref="Store" :options="StoreDrop" />
          <!-- <Select class="P-W-200" v-model="SearchForm.StoreId" @on-change="OnClearSelect('StoreId')" filterable clearable placeholder="筛选店铺" ref="Store">
            <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
          </Select> -->
        </FormItem>
        <FormItem class="P-Inline-Block P-ML-10 P-MB-10" prop="StartTime">
          <DatePicker class="P-W-200" v-model="SearchForm.StartTime" type="month" placeholder="筛选月份"></DatePicker>
        </FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="primary" @click="ValidateForm">搜索</Button>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
    <Col span="24">
      <Button type="primary" @click="GetList(1)" class="P-MB-10 P-MR-10 P-Inline-Block" v-if="Powers.ExportSummaryCampaign">导出PB汇总数据</Button>
    	<Button type="primary" @click="GetList(2)" class="P-MB-10 P-MR-10 P-Inline-Block" v-if="Powers.ExportCampaign">导出PB原始数据</Button>
    </Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
    <Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
	name: 'WishPbData',
	components:{
	}
})
export default class WishPbData extends Vue {
	private mounted() :void {
    this.GetPoints()
  }

  //获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ExportSummaryCampaign', 'ExportCampaign']))
    this.$set(this.SearchForm, 'StartTime', new Date(new Date(new Date().toLocaleDateString()).getTime()));
    this.GetStoreDropList()
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).SearchForm[S] == undefined ){
      this.$set(this.SearchForm, S, '');
    }
  }

  // 获取平台下的所有店铺
  private GetStoreDropList():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales["2"].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.StoreDrop = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
    this.GetList();
  }

  private ValidateForm():void{
    (this as any).$refs.SearchForm.validate((B: boolean)=>{
      if(B){
        this.$set(this.Pager, 'PageIndex', 1);
        this.GetList();
      }else{
        this.$UI.Tips.Floating('warning', '请检查必填项')
      }
    })
  }

	//获取列表
  private GetList(N?:number): void{
    let SearchGroup = JSON.parse(JSON.stringify(this.SearchForm))
    SearchGroup.StartTime = `${new Date(SearchGroup.StartTime).getFullYear()}-${new Date(SearchGroup.StartTime).getMonth()+1}`;
    
    if(!N){
      this.$set(this, 'List', [])
    }
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Sales,
			Api: {
				Address: N === 1 ? this.$Api.WishStoreExportSummaryCampaign : N === 2 ? this.$Api.WishStoreExportCampaign : this.$Api.WishStoreGetCampaignList,
				Login: true
      },
			Data: N ? SearchGroup : { Conditions: SearchGroup, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if(N){
            this.$UI.Tips.Modal({
              Type: 'success',
              Content: `创建${N === 1 ? '导出PB汇总数据' : '导出PB原始数据'}任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
              Callback: (Res: boolean):void => { 
              }
            });
          }else{
            this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
            this.$set(this, 'List', Res.Data.PageModel.Items)
          }
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
	
	//重置
	private ResetList(): void{
    (this.$refs['SearchForm'] as any).resetFields();
    this.$set(this, 'SearchForm', new Interface.WishPbDataSearch());
    this.$set(this.SearchForm, 'StartTime', new Date(new Date(new Date().toLocaleDateString()).getTime()));
		this.GetList();
  }
  
  //切换列表条数
	private ChangePageSize(N: number): void {
		this.$set(this.Pager, 'PageSize', N);
		this.GetList();
	}
	
	//切换列表页码
	private ChangePage(N: number): void {
		this.$set(this.Pager, 'PageIndex',N);
		this.GetList();
	}
	
	//获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		for(let item in this.Powers){
			if(this.Powers[item]){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }
  
  private Powers: PInterface.Power = {} // 权限
  private StoreDrop: PInterface.KV[] = [];
  private SearchForm : Interface.WishPbDataSearch = new Interface.WishPbDataSearch()  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private List: Interface.WishPbDataList[] = []; //列表数据
  private RuleValidate: any = {
    StartTime: [{ required: true, message: '请选择月份', trigger: 'change', type: 'date'}]
  }
	private Cols: PInterface.TableCol[] = [
		{ title: '店铺名', key: 'StoreName' },
    { title: '别名', key: 'Alias' },
    { title: '费用(USD)', key: 'Cost'}
	]
}

</script>
<style lang="less"></style>

