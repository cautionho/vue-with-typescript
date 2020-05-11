<!-- 仓库添加、编辑组件 -->
<template>
  <div class="P-Inline-Block">
    <Col>
    <Button class="P-MR-10" type="primary" v-if="Power" @click="TriggerModal">添加仓库</Button>
      <Modal v-model="IsShowModal" :title="WarehouseMsg.Id==0?'添加仓库':'编辑仓库'" @on-cancel="HandleWareMsg(false)" :mask-closable="false" :width="800">
        <Form onsubmit="return false" ref="WarehouseMsg" :model="WarehouseMsg" :rules="WareMsgRule" :label-width="120" name="wareForm">
          <Form-item label="仓库名称：" prop="Name">
            <Input v-model="WarehouseMsg.Name" placeholder="请输入仓库名称" name="wareNameInput" ref="WareName"></Input>
          </Form-item>
          <Form-item label="仓库类型：" prop="Type">
            <Select v-model="WarehouseMsg.Type" placeholder="请选择仓库类型" :options="DropLists.WareTypeList" />
            <!-- <Select v-model="WarehouseMsg.Type" placeholder="请选择仓库类型" :options="DropLists.WareTypeList">
              <Option v-for="(item,index) in DropLists.WareTypeList" :value="$Enums.Setting.WarehouseStatus[item]" :key="index">{{item}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="第三方仓库代码：" prop="ThirdCode">
            <Input v-model="WarehouseMsg.ThirdCode" placeholder="请输入第三方仓库代码"></Input>
          </Form-item>
          <Form-item label="弗睿内部代码：" prop="FrCode">
            <Input v-model="WarehouseMsg.FrCode" placeholder="请输入弗睿内部代码"></Input>
          </Form-item>
          <Form-item label="结算币种：" prop="CurrencyCode">
            <Select v-model="WarehouseMsg.CurrencyCode" placeholder="请选择结算币种"  :options="DropLists.ERDropList" />
            <!-- <Select v-model="WarehouseMsg.CurrencyCode" placeholder="请选择结算币种"  :options="DropLists.ERDropList">
              <Option v-for="(item,index) in DropLists.ERDropList" :value="item.Value" :key="index">{{item.Key}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="所在国家：" prop="CountryCode">
            <Select v-model="WarehouseMsg.CountryCode" placeholder="请选择所在国家" :options="DropLists.CountryList" optionKey="CountryNameCn" optionValKey="CountryCode" />
            <!-- <Select v-model="WarehouseMsg.CountryCode" placeholder="请选择所在国家" :options="DropLists.CountryList" optionKey="CountryNameCn" optionValKey="CountryCode">
              <Option v-for="(item,index) in DropLists.CountryList" :value="item.CountryCode" :key="index">{{item.CountryNameCn}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="仓库地址：" prop="Address">
            <Input v-model="WarehouseMsg.Address" placeholder="请输入仓库地址"></Input>
          </Form-item>
          <Form-item label="邮政编码：" prop="ZipCode">
            <Input v-model="WarehouseMsg.ZipCode" placeholder="请输入邮编"></Input>
          </Form-item>
          <Form-item label="联系人：" prop="Contacts">
            <Input v-model="WarehouseMsg.Contacts" placeholder="请输入联系人"></Input>
          </Form-item>
          <Form-item label="联系电话：" prop="TelePhone">
            <Input v-model="WarehouseMsg.TelePhone" placeholder="请输入联系电话"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="ValidateWarehouse">提交</Button>
          <Button @click="HandleWareMsg(false)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
import Interface from '../../assets/Interface/Setting'
import PInterface from '../../assets/Interface/Public'
@Component({
  name: 'ModifyWarehouse'
})
export default class ModifyWarehouse extends Vue {
  @Prop() DropLists: Interface.WarehouseDrop
  @Prop() Power: boolean

  @Emit() HandleWareMsg(Res: boolean): void {
    this.$set(this, 'IsShowModal', false);
    this.WarehouseMsg = new Interface.Warehouse();
    (this.$refs["WarehouseMsg"] as any).resetFields();
  }
  

  private TriggerModal(SelectData: Interface.Warehouse[]){
    if(SelectData.length){
      this.$set(this, 'WarehouseMsg', SelectData[0])
    }
    this.$set(this,'IsShowModal', true)
    this.$nextTick(()=>{ (this.$refs["WareName"] as any).focus() });
  }

  private ValidateWarehouse():void{
    (this.$refs["WarehouseMsg"] as any).validate((valid: boolean) => {
      if (valid) {
      	this.PostWareAddOrEdit();
      }
    })
  }

  private PostWareAddOrEdit():void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.WarehouseMsg.Id === 0 ? this.$Api.CreateWarehouse : this.$Api.ModifyWarehouse,
				Login: true
			},
			Data: this.WarehouseMsg,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${this.WarehouseMsg.Id === 0 ? '添加仓库成功' : '编辑仓库成功'}`);
          this.HandleWareMsg(true)
				} else {
          this.$Request.Error(Res);
          this.$nextTick(() => { (this.$refs["WareName"] as any).focus() })
				  this.$UI.Loading.Hide();
				}
			}
		})
  }

  private WareMsgRule: any = {
    Name: [{ required: true, message: '请输入仓库名称' }],
    Type: [{ type: 'number', required: true, message: '请选择仓库类型', trigger: 'change' }],
    ThirdCode: [{ required: true, message: '请输入第三方仓库代码' }],
    FrCode: [{ required: true, message: '请输入弗睿内部代码' }],
    CountryCode: [{ required: true, message: '请选择所在国家', trigger: 'change' }],
    Address: [{ required: true, message: '请输入仓库地址' }],
    Contacts: [{ required: true, message: '请输入联系人' }],
    TelePhone: [{ pattern: this.$Pattern.Mobile, message: '请输入正确的联系电话' }]
  }

  
  private IsShowModal: boolean = false
  private WarehouseMsg: Interface.Warehouse = new Interface.Warehouse()
}


</script>