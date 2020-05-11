<template>
	<Row class="P-Inline-Block SendOps">
		<Button type="primary" class="P-MR-10" @click="TriggerModal" v-if="Power">添加供应商</Button>
		<Modal v-model="SupplierModal" :title="ModalTitle" class="Container-Tabs" :mask-closable="false" @on-cancel="EmitSupplier(false)" :width="900">
			<Form v-if="SupplierModal" inline :label-width="100" :model="SupplierBase" ref="SupplierBase" :rules="SupplierBaseRules">
				<Tabs type="card" :closable="false" :value="ActiveTab" name="ModifySupplier" :animated="false">
					<TabPane label="基本信息" name="Base" tab="ModifySupplier">
						<FormItem label="供应商名称：" class="P-W-400 P-MT-20" prop="SupplyName">
							<Input placeholder="供应商名称" v-model="SupplierBase.SupplyName"></Input>
						</FormItem>
						<FormItem label="联系人：" class="P-W-400 P-MT-20" prop="Contact">
							<Input placeholder="联系人名称" v-model="SupplierBase.Contact"></Input>
						</FormItem>
						<FormItem label="联系电话：" class="P-W-400" prop="Phone">
							<Input placeholder="联系电话" v-model="SupplierBase.Phone"></Input>
						</FormItem>
						<FormItem label="阿里旺旺：" class="P-W-400" prop="AliNum">
							<Input placeholder="阿里旺旺" v-model="SupplierBase.AliNum"></Input>
						</FormItem>
						<FormItem label="邮箱：" class="P-W-400" prop="Email">
							<Input placeholder="邮箱" v-model="SupplierBase.Email"></Input>
						</FormItem>
						<FormItem label="QQ号码：" class="P-W-400" prop="QQNum">
							<Input placeholder="QQ号码" v-model="SupplierBase.QQNum"></Input>
						</FormItem>
						<FormItem label="相关链接：" class="P-W-400" prop="Url">
							<Input placeholder="相关链接" v-model="SupplierBase.Url"></Input>
						</FormItem>
						<FormItem label="邮政编码：" class="P-W-400" prop="ZipCode">
							<Input placeholder="邮政编码" v-model="SupplierBase.ZipCode"></Input>
						</FormItem>
						<FormItem label="地址：" class="P-W-200" prop="Province">
              <Select placeholder="省份" class="P-W-200" :onChange="GetCity" v-model="SupplierBase.Province" :options="ProvinceList" optionValKey="Id" optionKey="Name" transfer />
							<!-- <Select placeholder="省份" class="P-W-200" @on-change="GetCity" v-model="SupplierBase.Province">
								<Option v-for="(item,index) in ProvinceList" :value="item.value" :key="index">{{item.label}}</Option>
							</Select> -->
						</FormItem>
						<FormItem label="" class="P-W-200" prop="City">
               <Select placeholder="城市" class="P-W-200" :onChange="GetArea" v-model="SupplierBase.City" :options="CityList" optionValKey="Id" optionKey="Name" transfer/>
							<!-- <Select placeholder="城市" class="P-W-200" @on-change="GetArea" v-model="SupplierBase.City">
								<Option v-for="(item,index) in CityList" :value="item.value" :key="index">{{item.label}}</Option>
							</Select> -->
						</FormItem>
						<FormItem label="" class="P-W-200" prop="Area">
              <Select placeholder="区县" class="P-W-200" v-model="SupplierBase.Area" :options="AreaList" optionValKey="Id" optionKey="Name" transfer/>
							<!-- <Select placeholder="区县" class="P-W-200" v-model="SupplierBase.Area">
								<Option v-for="(item,index) in AreaList" :value="item.value" :key="index">{{item.label}}</Option>
							</Select> -->
						</FormItem>
						<FormItem label="" class="P-W-100-Percent" prop="Street">
							<Input placeholder="详细街道" v-model="SupplierBase.Street"></Input>
						</FormItem>
						<FormItem label="备注：" class="P-W-100-Percent" prop="Remark">
							<Input placeholder="备注" type="textarea" :autosize="{minRows:4,maxRows:4}" v-model="SupplierBase.Remark"></Input>
						</FormItem>
					</TabPane>
					<TabPane label="财务结算" name="Finance" tab="ModifySupplier">
						<FormItem label="结算方式：" class="P-W-400 P-MT-20" prop="BillType">
              <Select placeholder="结算方式" v-model="SupplierBase.BillType" :options="BillTypeList" transfer/>
							<!-- <Select placeholder="结算方式" v-model="SupplierBase.BillType">
								<Option v-for="(item,index) in BillTypeList" :value="$Enums.Purchase.BillType[item]" :key="index">{{item}}</Option>
							</Select> -->
						</FormItem>
						<FormItem label="支付方式：" class="P-W-400 P-MT-20" prop="PayType">
              <Select placeholder="支付方式" v-model="SupplierBase.PayType" :options="PayTypeList" transfer/>
							<!-- <Select placeholder="支付方式" v-model="SupplierBase.PayType">
								<Option v-for="(item,index) in PayTypeList" :value="$Enums.Purchase.PayType[item]" :key="index">{{item}}</Option>
							</Select> -->
						</FormItem>
						<FormItem label="开户行：" class="P-W-400" prop="BankName">
							<Input placeholder="开户行" v-model="SupplierBase.BankName"></Input>
						</FormItem>
						<FormItem label="账户名：" class="P-W-400" prop="BankAccount">
							<Input placeholder="账户名" v-model="SupplierBase.BankAccount"></Input>
						</FormItem>
						<FormItem label="账号：" class="P-W-100-Percent" prop="BankNumber">
							<Input placeholder="账号" v-model="SupplierBase.BankNumber"></Input>
						</FormItem>
					</TabPane>
					<!-- <TabPane label="富文本" name="Editor" tab="ModifySupplier">
						<Editor ref="Editor"></Editor>
					</TabPane> -->
				</Tabs>
			</Form>
			<footer slot="footer">
				<Button type="primary" @click="Validate">提交</Button>
				<Button @click="EmitSupplier(false)">取消</Button>
			</footer>
		</Modal>
	</Row>
</template>
<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Purchase'
import PInterface from '@/assets/Interface/Public'

@Component({
	name: 'MoodifySupplier',
	components: {
		// Editor: () => import('../Public/Editor.vue')
	}
})
export default class MoodifySupplier extends Vue {
	/*lefe start*/
	// @Prop() TriggerModifySupplier!: boolean
	@Prop() AreaTree!: PInterface.AreaTree[]
	@Prop() Power: boolean

	@Emit() EmitSupplier(R: boolean): void {
		(this.$refs.SupplierBase as any).resetFields();
		this.$set(this, 'SupplierModal', false);
	}

	// @Watch('TriggerModifySupplier')
	// WatchTriggerModifySupplier(V: boolean) {
	// 	if(V){
	// 		if(this.ProvinceList.length < 1){
	// 			this.$set(this, 'ProvinceList', this.AreaTree)
	// 		}
	// 		if(this.IsEdit.length > 0){	//编辑
	// 			this.$set(this, 'SupplierBase', this.IsEdit[0])
	// 			this.$set(this, 'ModalTitle', '编辑供应商')
	// 			this.SearchCity('ProvinceList', this.SupplierBase.Province)
	// 			this.SearchCity('CityList', this.SupplierBase.City)
	// 		}else{
	// 			this.$set(this, 'SupplierBase', new Interface.Supplier())
	// 			this.$set(this, 'ModalTitle', '添加供应商')
	// 		}
	// 	}

	// 	this.$set(this, 'SupplierModal', V);
	// }

	private TriggerModal(IsEdit:Interface.Supplier[]){
		this.IsEdit = IsEdit;
		if(this.ProvinceList.length < 1){
				this.$set(this, 'ProvinceList', this.AreaTree)
			}
		if(this.IsEdit.length){	//编辑
			this.$set(this, 'SupplierBase', this.IsEdit[0])
			this.$set(this, 'ModalTitle', '编辑供应商')
			this.SearchCity('ProvinceList', this.SupplierBase.Province)
			this.SearchCity('CityList', this.SupplierBase.City)
		}else{
			this.$set(this, 'SupplierBase', new Interface.Supplier())
			this.$set(this, 'ModalTitle', '添加供应商')
		}
		this.$set(this, 'SupplierModal', true);
	}

	// private GetSupplierInfo(): void{
	// 	this.$UI.Loading.Show();
	// 	this.$Request.Post({
	// 		Server: this.$Server.Purchase,
	// 		Api: {
	// 			Address: this.$Api.SupplyGetSupplyInfo,
	// 			Login: true
	// 		},
	// 		Data: this.IsEdit[0].Id,
	// 		Callback: (Res: PInterface.Res): void => {
	// 			if (Res.IsSuccess) {
	// 				this.$set(this, 'SupplierBase', Res.Data.Data)
	// 			} else {
	// 				this.$Request.Error(Res);
	// 			}
	// 			this.$UI.Loading.Hide();
	// 		}
	// 	})
	// }
	/*life end*/

	/*methods start*/
	private Validate(): void {
		(this.$refs.SupplierBase as any).validate((Valid: boolean): void => {
			if (Valid) {
				this.PostSupplier()
			}
		})
	}

	private PostSupplier(): void{
		this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.IsEdit.length > 0 ? this.$Api.SupplyModify : this.$Api.SupplyCreate,
				Login: true
			},
			Data: this.SupplierBase,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$UI.Tips.Floating('success', `${this.IsEdit.length > 0 ? '编辑' : '添加'}供应商成功`);
					this.EmitSupplier(true)
				} else {
					this.$Request.Error(Res);
					this.$UI.Loading.Hide();
				}
			}
		})
	}

	private GetCity(Val: number | string):void{
		this.$set(this, 'CityList', [])
		this.$set(this, 'AreaList', [])
		this.$set(this.SupplierBase, 'City', "")
		this.$set(this.SupplierBase, 'Area', "")
		if(Val){
			this.SearchCity('ProvinceList', Val)
		}
	}

	//获取区下拉
	private GetArea(Val: number | string):void{
		this.$set(this, 'AreaList', [])
		this.$set(this.SupplierBase, 'Area', "")
		if(Val){
			this.SearchCity('CityList', Val)
		}
	}
	
	private SearchCity(List: string, Val: number | string):void{
		this[List].forEach( (Item: PInterface.AreaTree) =>{
			if(Item.Id === Val){
				this.$set(this, List == 'ProvinceList' ? 'CityList' : 'AreaList', Item.ChildNodes)
			}
		})
	}

	/*data start*/
	private SupplierModal: boolean = false // 控制模态框展示隐藏
	private ModalTitle: string = '添加供应商' // 模态框标题
	private ActiveTab: string = 'Base' // 当前激活TAB
	private ProvinceList: PInterface.AreaTree[] = []
	private CityList: PInterface.AreaTree[] = []
	private AreaList: PInterface.AreaTree[] = []
	private BillTypeList: PInterface.KV[] =  this.$Utils.GetEnumArr(this.$Enums.Purchase.BillType)
	private PayTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.PayType)
	private IsEdit: Interface.Supplier[] = [];

	private SupplierBaseRules: any = {
		SupplyName: [{ required: true, message: '请输入供应商名称' }],
		Contact: [{ required: true, message: '请输入联系人' }],
		Phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }, { pattern: this.$Pattern.Mobile, message: '请输入正确格式的联系电话' }],
		Email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { pattern: this.$Pattern.Email, message: '请输入正确格式的邮箱' }],
		Province: [{ required: true, message: '请选择省份', trigger: 'change', type: 'number' }],
		City: [{ required: true, message: '请选择城市', trigger: 'change', type: 'number' }],
		Area: [{ required: true, message: '请选择区县', trigger: 'change', type: 'number' }],
		QQNum: [{ required: false, pattern: /^\d{1,10}$/, message: '请输入正确的QQ号码' }],
	}
	private SupplierBase: Interface.Supplier = new Interface.Supplier() // 供应商信息
	/*data end*/


}

</script>
<style lang="less"></style>
