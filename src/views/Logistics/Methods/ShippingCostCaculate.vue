<!--运费预计算-->
<template>
	<Row>
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" :model="SearchForm" name="SearchForm" :rules="Rules" onsubmit="return false" >
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-P-10">
            <FormItem class="P-Inline-Block P-W-200 P-ML-10 P-MB-10" prop="CountryCode">
              <Select placeholder="筛选目标国家" v-model="SearchForm.CountryCode" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" />
              <!-- <Select placeholder="筛选目标国家" v-model="SearchForm.CountryCode" filterable clearable>
                <Option v-for="Item in CountryData" :value="Item.CountryCode" :key="Item.CountryCode">{{Item.CountryNameCn}}</Option>
              </Select> -->
            </FormItem>
            <FormItem class="P-Inline-Block P-W-200 P-ML-10 P-MB-10">
              <Select placeholder="筛选物流渠道" v-model="SearchForm.MethodId" :options="ShipMethodList" optionValKey="Id" optionKey="Name" />
              <!-- <Select placeholder="筛选物流渠道" v-model="SearchForm.MethodId" filterable clearable>
                <Option v-for="Item in ShipMethodList" :value="Item.Id" :key="Item.Name">{{Item.Name}}</Option>
              </Select> -->
            </FormItem>
            <FormItem class="P-Inline-Block P-W-200 P-ML-10 P-MB-10">
              <Input placeholder="筛选邮编" v-model="SearchForm.ZipCode" ></Input>
            </FormItem>
            <FormItem class="P-Inline-Block P-MB-10">
              <span class="P-ML-10 P-Inline-Block">体积（cm³）:</span>
              <FormItem class="P-ML-10 P-W-200 P-Inline-Block" prop="Length">
                <Input placeholder="筛选长度" v-model="SearchForm.Length" ></Input>
              </FormItem>
              <span class="P-ML-10 P-Inline-Block">x</span>
              <FormItem class="P-ML-10 P-W-200 P-Inline-Block" prop="Width">
                <Input placeholder="筛选宽度" v-model="SearchForm.Width" ></Input>
              </FormItem>
              <span class="P-ML-10 P-Inline-Block">x</span>
              <FormItem class="P-ML-10 P-W-200 P-Inline-Block" prop="Height">
                <Input placeholder="筛选高度" v-model="SearchForm.Height" ></Input>
              </FormItem>
            </FormItem>
            <FormItem class="P-Inline-Block P-MB-10">
              <span class="P-ML-10 P-Inline-Block">重量（kg）:</span>
              <FormItem class="P-ML-10 P-W-200 P-Inline-Block" prop="Weight">
                <Input placeholder="筛选重量" v-model="SearchForm.Weight" ></Input>
              </FormItem>
            </FormItem>
					</Col>
				</Dropdown>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="primary" @click="Valid">计算运费</Button>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="Table"></Table>
		</Col>
	</Row>
</template>
<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';
/*interface end*/

@Component({
	name: 'ShippingCostCaculate',
	components: {}
})

export default class ShippingCostCaculate extends Vue {
	private mounted() {
		this.GetCountryDropList();
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
    this.GetShipMethodDrop()
  }

  // 获取物流渠道
  private GetShipMethodDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelDropList
      },
      Data: 0,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.ShipMethodList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
    this.$UI.Loading.Hide();
  }

	// 获取列表
	private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'List', []);
    const SearchForm = JSON.parse(JSON.stringify(this.SearchForm));
    SearchForm.Height = SearchForm.Height === "" ? 0 : Number(SearchForm.Height);
    SearchForm.Length = SearchForm.Length === "" ? 0 : Number(SearchForm.Length);
    SearchForm.Weight = SearchForm.Weight === "" ? 0 : Number(SearchForm.Weight);
    SearchForm.Width = SearchForm.Width === "" ? 0 : Number(SearchForm.Width);

		this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.ChannelCaculate,
				Login: true
			},
			Data: SearchForm,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.List.push(...Res.Data.Data);
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}

	// 计算列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 190;
		return (window.innerHeight - Flag);
	}

	// 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

  private Valid(): void{
    (this.$refs.SearchForm as any).validate( (Valid: boolean)=>{
      if(Valid){
        this.GetList();
      }else{
        this.$UI.Tips.Floating('warning', '请检查筛选数据')
      }
    })
  }

	// 触发“重置”按钮
	private ResetList(): void {
    this.$set(this, 'AccurateSearch', false);
    (this.$refs['SearchForm'] as any).resetFields();
		this.$set(this, 'SearchForm', new Interface.ShippingCostCaculateSearch())
    this.$set(this, 'List', []);
	}
	
	private Powers: PInterface.Power = {}  // 权限
	private AccurateSearch: boolean = false // 控制“精准搜索”下拉菜单展示
  private CountryData:PInterface.CountryEntity[] = []; //国家下拉
  private ShipMethodList:PInterface.IdName[] = []; // 物流渠道下拉列表
	private SearchForm: Interface.ShippingCostCaculateSearch = new Interface.ShippingCostCaculateSearch() // 筛选项默认数据
  private List: Interface.ShippingCostCaculateList[] = [] // 列表数据源
  private Rules: any = {
    CountryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
    Length: [{ pattern: this.$Pattern.Positive, message: '长度格式不正确' }],
    Width: [{ pattern: this.$Pattern.Positive, message: '宽度格式不正确' }],
    Height: [{ pattern: this.$Pattern.Positive, message: '高度格式不正确' }],
    Weight: [{ required: true, message: '请输入重量' }, { pattern: this.$Pattern.Positive, message: '重量格式不正确' }]
  }

	private Cols: PInterface.TableCol[] = [
    { title: '渠道名称', width: 200, key: 'MethodName', }, 
    { title: '渠道代码', width: 200, key: 'MethodCode' }, 
    { title: '运费', width: 140, key: 'Fee', render: (h: any, Params: any): string => h('p', `${ Params.row.Fee} ${Params.row.Currency}`) }, 
    { title: '有无跟踪号', width: 140,  key: 'IsRegistry', render: (h: any, Params: any): string => {
      return h('p', {
        class: Params.row.IsRegistry ? 'P-Text-Success' : 'P-Text-Error'
      }, Params.row.IsRegistry ? '有' : '无') 
    } },
		{ title: '渠道备注', render: (h: any, Params: any): string => h('p', Params.row.Remark === "" ? '-' : Params.row.Remark) },
	]
}

</script>
<style lang="less"></style>
