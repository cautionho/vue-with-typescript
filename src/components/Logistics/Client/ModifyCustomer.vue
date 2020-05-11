<template>
<Row class="P-Inline-Block">
	<Col>
  <Button type="primary" @click="TriggerModal" v-if="Power" class="P-MR-10">添加客户</Button>
  <Modal :title="(CustomerMsg.Customer.Id !== 0?'修改':'添加')+'用户'" v-model="IsShowModal" :mask-closable="false" @on-cancel="HandleRes(false)" :width="860" class="Container-Tabs">
    <Tabs type="card" name="ModifyCustomer" :value="CurrentPane" @on-click="ChangePane" id="crmTabs">
      <TabPane label="基本信息" name="Pane-1" tab="ModifyCustomer">
        <Form onsubmit="return false" ref="CustomerMsg" :model="CustomerMsg" :rules="customerRules" :label-width="85" inline name="crmForm">
          <Form-item label="公司：" class="P-W-400" prop="Customer.Company">
            <Input placeholder="请输入公司名称" v-model="CustomerMsg.Customer.Company" name="crmInput"></Input>
          </Form-item>
          <Form-item label="联系人：" class="P-W-400" prop="Customer.Contact">
            <Input placeholder="请输入联系人" v-model="CustomerMsg.Customer.Contact"></Input>
          </Form-item>
          <Form-item label="电话：" class="P-W-400" prop="Customer.Phone">
            <Input placeholder="请输入电话" v-model="CustomerMsg.Customer.Phone"></Input>
          </Form-item>
          <Form-item label="邮箱：" class="P-W-400" prop="Customer.Email">
            <Input placeholder="请输入邮箱" v-model="CustomerMsg.Customer.Email"></Input>
          </Form-item>
          <Form-item label="邮编：" class="P-W-400" prop="Customer.ZipCode">
            <Input placeholder="请输入邮编" v-model="CustomerMsg.Customer.ZipCode"></Input>
          </Form-item>
          <br>
          <Form-item label="地址：" class="P-W-98-Percent P-MB-5 ivu-form-item-required">
            <Form-item prop="Customer.Province" class="P-W-200">
              <Select placeholder="请选择省份" v-model="CustomerMsg.Customer.Province" :options="CountryList" optionValKey="value" optionKey="label" :onChange="OnClearSelect.bind(this,'Province')" transfer/>
              <!-- <Select placeholder="请选择省份" v-model="CustomerMsg.Customer.Province" @on-change="OnClearSelect('Province')" label-in-value filterable clearable>
                <Option v-for="Item in CountryList" :value="Item.value" :key="Item.label">{{Item.label}}</Option>
              </Select> -->
            </Form-item>
            <Form-item prop="Customer.City" class="P-W-200">
              <Select placeholder="请选择城市" v-model="CustomerMsg.Customer.City" :options="CityList" optionValKey="value" optionKey="label" :onChange="OnClearSelect.bind(this,'City')" ref="city" transfer/>
              <!-- <Select placeholder="请选择城市" v-model="CustomerMsg.Customer.City" @on-change="OnClearSelect('City')" label-in-value filterable clearable ref="city">
                <Option v-for="Item in CityList" :value="Item.value" :key="Item.label">{{Item.label}}</Option>
              </Select> -->
            </Form-item>
            <Form-item prop="Customer.Area" class="P-W-200">
              <Select placeholder="请选择区县" v-model="CustomerMsg.Customer.Area" :options="AreaList" optionValKey="value" optionKey="label" :onChange="OnClearSelect.bind(this, 'Area')" ref="area" transfer/>
              <!-- <Select placeholder="请选择区县" v-model="CustomerMsg.Customer.Area" @on-change="OnClearSelect('Area')" label-in-value filterable clearable ref="area">
                <Option v-for="Item in AreaList" :value="Item.value" :key="Item.label">{{Item.label}}</Option>
              </Select> -->
            </Form-item>
          </Form-item>
          <Form-item prop="Customer.Street" class="P-W-100-Percent">
            <Input placeholder="请输入详细街道" v-model="CustomerMsg.Customer.Street" class="mt20"></Input>
          </Form-item>
          <Form-item label="备注：" class="P-W-100-Percent" prop="Customer.Remark">
            <Input placeholder="请输入备注" type="textarea" v-model="CustomerMsg.Customer.Remark" :autosize="{minRows:4,maxRows: 4}"></Input>
          </Form-item>
        </Form>
      </TabPane>
      <TabPane label="渠道折扣" name="Pane-2" tab="ModifyCustomer">
        <p>渠道各类费用折扣默认为1，例如8折请输入0.8</p>
        <Form onsubmit="return false" inline :label-width="80">
          <Form-item label="添加渠道：">
            <Select placeholder="请选择渠道" v-model="ShippingMethodId" ref="shippingMethods" :options="MethodList" optionValKey="Id" optionKey="Name" :onChange="GetShippingMethods" transfer/>
            <!-- <Select placeholder="请选择渠道" v-model="ShippingMethodId" label-in-value filterable clearable ref="shippingMethods" @on-change="GetShippingMethods">
              <Option v-for="Item in MethodList" :value="Item.Id" :key="Item.Name">{{Item.Name}}</Option>
            </Select> -->
          </Form-item>
          <Table :columns="Cols" :data="CustomerMsg.Discount" size="small" stripe height="400" ref="Discount"></Table>
        </Form>
      </TabPane>
    </Tabs>
    <footer slot="footer">
      <Button type="primary" @click="PostCustomerMsg()">提交</Button>
      <Button @click="HandleRes(false)">取消</Button>
    </footer>
  </Modal>
  </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Emit, Vue, Watch, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from "@/assets/Interface/Logistics";
@Component({
  name: 'ModifyCustomer'
})
export default class ModifyCustomer extends Vue {
  @Prop() Power: boolean
  @Prop() IsShowDiscount: boolean
  @Prop() CityDropList: PInterface.AreaTree[]

  @Emit() HandleRes(B:boolean): void {
    this.IsShowModal = false;
    this.$nextTick(()=>{ (this.$refs['CustomerMsg'] as any).resetFields();})
    this.CustomerMsg = new Interface.ModifyCustomer();
    this.CurrentPane = 'Pane-1'
  }

  get CountryList(){
    return this.CityDropList
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).CustomerMsg.Customer[S] == undefined ){
      this.$set(this.CustomerMsg.Customer, S, '');
    }
  }

  @Watch('CustomerMsg.Customer.Province')
  private ChangeProvince(Val: string): void{
    if (Val != "") {
      for (let item in this.CountryList) {
        if (this.CountryList[item].value == Val) {
          this.CityList = this.CountryList[item].children;
        }
      }
    } else {
      this.CustomerMsg.Customer.City = "";
      this.CustomerMsg.Customer.Area = "";
      (this.$refs.city as any).clearSingleSelect();
      (this.$refs.area as any).clearSingleSelect();
      this.CityList = [];
      this.AreaList = [];
    }
  }

  @Watch('CustomerMsg.Customer.City')
  private ChangeCity(Val: string): void{
    if (Val != "") {
      for (let item in this.CityList) {
        if (this.CityList[item].value == Val) {
          this.AreaList = this.CityList[item].children;
        }
      }
    } else {
      this.CustomerMsg.Customer.Area = "";
      (this.$refs.area as any).clearSingleSelect();
      this.AreaList = [];
    }
  }
  
  // 打开模态框
  private TriggerModal(SelectedData: Interface.CustomerManageList[]):void {
    let discountTab = (document.getElementById('crmTabs') as any).getElementsByClassName('ivu-tabs-tab')[1]
    if (this.IsShowDiscount) {
      (discountTab as any).style.display = 'inline-block'
    } else {
      (discountTab as any).style.display = 'none'
    }

    if(SelectedData.length){ //编辑
      this.CustomerMsg.Customer = JSON.parse(JSON.stringify(SelectedData[0]))
      if (this.IsShowDiscount) {
        this.GetCustomerDiscount(this.CustomerMsg.Customer.Id);
      }
    }
    if (this.MethodList.length < 1) {
      this.GetMethodsList();
    }
    this.$set(this,'IsShowModal', true);
  }

  // 获取物流渠道下拉
  private GetMethodsList() {
    this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.ChannelDropList,
				Login: false
			},
			Data: 0,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.MethodList = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
				}
			}
		})
  }

  //获取已选渠道
  private GetCustomerDiscount(CustomerId: number): void{
    this.$UI.Loading.Show();
    let PostData = {
        CustomerId: CustomerId,
        CustomerCode: ""
      }
    this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.GetCustomerDiscount,
				Login: false
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
					this.CustomerMsg.Discount = Res.Data.Data;
				} else {
					this.$Request.Error(Res);
				}
			}
		})
  }

  // 获取选择渠道
  private GetShippingMethods(Val: any) {
    if (Val != undefined) {
      for (let item in this.CustomerMsg.Discount) {
        if (this.CustomerMsg.Discount[item].ShippingMethodId == Val.value) {
          this.$UI.Tips.Floating('warning', '该渠道在列表中已存在')
          this.ShippingMethodId = "";
          (this.$refs.shippingMethods as any).clearSingleSelect();
          return;
        }
      }
      let Obj: Interface.DiscountInfo = new Interface.DiscountInfo()
      Obj.CustomerId = this.CustomerMsg.Customer.Id
      Obj.CustomerCode = this.CustomerMsg.Customer.CustomerCode
      Obj.ShippingMethodId = Val.value
      Obj.MethodName = Val.label
      this.CustomerMsg.Discount.push(Obj)
      this.ShippingMethodId = "";
      (this.$refs.shippingMethods as any).clearSingleSelect();
    }
  }

  private ChangePane(val: string) {
    this.CurrentPane = val;
  }

  private PostCustomerMsg(): void{
    (this.$refs['CustomerMsg'] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Logistics,
          Api: {
            Address: this.CustomerMsg.Customer.Id !== 0 ? this.$Api.CustomerModify : this.$Api.CustomerCreate,
            Login: false
          },
          Data: this.CustomerMsg,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating('success', (this.CustomerMsg.Customer.Id !== 0 ? '修改' : '添加') + '客户成功')
              this.HandleRes(false)
            } else {
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private ChangeInput(Idx: number, Key: string, Val: number): void{
    (this.CustomerMsg.Discount[Idx] as any)[Key] = Val
  }

  private DeleteCol(Idx: number){
    this.CustomerMsg.Discount.splice(Idx, 1)
  }

  private IsShowModal: boolean = false;
  private CurrentPane:string = 'Pane-1' //当前标签页
  private MethodList: PInterface.IdName[] = [] //物流渠道下拉列表
  private CustomerMsg: Interface.ModifyCustomer = new Interface.ModifyCustomer();
  private ShippingMethodId: number |"" = "" //选中的物流渠道
  private CityList: PInterface.AreaTree[] = []
  private AreaList: PInterface.AreaTree[] = []
  private customerRules:any = {
    'Customer.Company': [{ required: true, message: '请输入公司名称' }],
    'Customer.Contact': [{ required: true, message: '请输入联系人' }],
    'Customer.Phone': [
      { required: true, message: '请输入电话', trigger: 'blur' },
      { pattern: /^(([1]\d{10})$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, message: '请输入正确的电话' }
    ],
    'Customer.Email': [{ required: true, message: '请输入邮箱' }, { pattern: /^[0-9A-Za-z][\.0-9A-Za-z_-]+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/, message: '请输入正确的邮箱' }],
    'Customer.ZipCode': [{ required: true, message: '请输入邮编' }],
    'Customer.Province': [{ required: true, message: '请选择省份', trigger: 'change', type:'number'}],
    'Customer.City': [{ required: true, message: '请选择市', trigger: 'change', type:'number' }]
  }
  private Cols: PInterface.TableCol[] = [
    { title: '渠道', key: 'MethodName' },
    { title: '运费', render: (h: any, Params: any): string => {
      return h('InputNumber', {
        props: {
          'min': 0,
          'max': 1,
          'step': 0.1,
          'value': Params.row.FeeDiscount
        },
        on: {
          input: (val: number) => {
            this.ChangeInput(Params.row._index, 'FeeDiscount', val)
          }
        }
      })
    }},
    { title: '附加费', render: (h: any, Params: any): string => {
      return h('InputNumber', {
        props: {
          'min': 0,
          'max': 1,
          'step': 0.1,
          'value': Params.row.AdditionalFeeDiscount
        },
        on: {
          input: (val: number) => {
            this.ChangeInput(Params.row._index, 'AdditionalFeeDiscount', val)
          }
        }
      })
    }},
    { title: '处理费', render: (h: any, Params: any): string => {
      return h('InputNumber', {
        props: {
          'min': 0,
          'max': 1,
          'step': 0.1,
          'value': Params.row.ProcessingDiscount
        },
        on: {
          input: (val: number) => {
            this.ChangeInput(Params.row._index, 'ProcessingDiscount', val)
          }
        }
      })
    }},
    { title: '挂号费', render: (h: any, Params: any): string => {
      return h('InputNumber', {
        props: {
          'min': 0,
          'max': 1,
          'step': 0.1,
          'value': Params.row.RegistryDiscount
        },
        on: {
          input: (val: number) => {
            this.ChangeInput(Params.row._index, 'RegistryDiscount', val)
          }
        }
      })
    }},
    { title: '操作', width: 80, render: (h: any, Params: any): string => {
      return h('Button', {
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: () => {
            this.DeleteCol(Params.row._index)
          }
        }
      }, '删除')
    }},
  ]
}

</script>
<style lang="less"></style>
