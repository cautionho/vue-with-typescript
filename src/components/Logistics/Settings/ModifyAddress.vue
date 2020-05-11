<template>
<Row class="P-Inline-Block">
	<Col>
  <Button type="primary" @click="TriggerModal" v-if="Power">添加地址</Button>
  <Modal :title="(AddressMsg.Id !== 0?'修改':'添加')+'地址'" v-model="IsShowModal" :mask-closable="false" @on-cancel="HandleRes(false)" :width="860">
      <Form onsubmit="return false" ref="AddressMsg" :model="AddressMsg" :rules="Rules" :label-width="85" inline>
        <Form-item label="地址别名：" class="P-W-400" prop="AddressAlias">
          <Input v-model="AddressMsg.AddressAlias" placeholder="请输入地址别名" style="width:100%" name="aliasInput"></Input>
        </Form-item>
        <Form-item label="国家：" prop="CountryCode" class="P-W-400">
          <Select v-model="AddressMsg.CountryCode" placeholder="请选择国家" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" />
          <!-- <Select v-model="AddressMsg.CountryCode" placeholder="请选择国家" filterable clearable>
            <Option v-for="Item in CountryData" :value="Item.CountryCode" :key="Item.CountryCode">{{Item.CountryNameCn}}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="省/州：" class="P-W-400" prop="State">
          <Input v-model="AddressMsg.State" placeholder="请输入省/州"></Input>
        </Form-item>
        <Form-item label="城市：" class="P-W-400" prop="City">
          <Input v-model="AddressMsg.City" placeholder="请输入城市"></Input>
        </Form-item>
        <Form-item label="区县：" class="P-W-400" prop="District">
          <Input v-model="AddressMsg.District" placeholder="请输入区县"></Input>
        </Form-item>
        <Form-item label="邮编：" class="P-W-400" prop="ZipCode">
          <Input v-model="AddressMsg.ZipCode" placeholder="请输入邮编"></Input>
        </Form-item>
        <Form-item label="地址1：" class="P-W-400" prop="Street1">
          <Input v-model="AddressMsg.Street1" placeholder="请输入地址1"></Input>
        </Form-item>
        <Form-item label="地址2：" class="P-W-400" prop="Street2">
          <Input v-model="AddressMsg.Street2" placeholder="请输入地址2"></Input>
        </Form-item>
        <Form-item label="联系人：" class="P-W-400" prop="Contact">
          <Input v-model="AddressMsg.Contact" placeholder="请输入联系人"></Input>
        </Form-item>
        <Form-item label="公司名称：" class="P-W-400" prop="Company">
          <Input v-model="AddressMsg.Company" placeholder="请输入公司名称"></Input>
        </Form-item>
        <Form-item label="手机：" class="P-W-400" prop="Mobile">
          <Input v-model="AddressMsg.Mobile" placeholder="请输入手机号码"></Input>
        </Form-item>
        <Form-item label="固话：" class="P-W-400" prop="TelPhone">
          <Input v-model="AddressMsg.TelPhone" placeholder="请输入固定电话"></Input>
        </Form-item>
        <Form-item label="邮箱：" class="P-W-400" prop="Email">
          <Input v-model="AddressMsg.Email" placeholder="请输入邮箱"></Input>
        </Form-item>
      </Form>
    <footer slot="footer">
      <Button type="primary" @click="PostMsg">提交</Button>
      <Button @click="HandleRes(false)">取消</Button>
    </footer>
  </Modal>
  </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from "@/assets/Interface/Logistics";
@Component({
  name: 'ModifyAddress'
})
export default class ModifyAddress extends Vue {
  @Prop() Power: boolean;
  @Prop() CountryData: PInterface.CountryEntity[]

  @Emit() HandleRes(Type:boolean): void { //1-打开模态框 2-成功 3-取消
    this.IsShowModal = false;
    this.$nextTick(()=>{ (this.$refs['AddressMsg'] as any).resetFields()})
    
  }
  
  // 打开模态框
  private TriggerModal(SelectedData: Interface.AddressManageList[] ):void {
    this.AddressMsg = SelectedData.length? SelectedData[0] : new Interface.AddressManageList();
    this.$set(this,'IsShowModal', true);
  }

  private PostMsg(): void{
    (this.$refs['AddressMsg'] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Logistics,
          Api: {
            Address: this.AddressMsg.Id !== 0 ? this.$Api.AddressModify : this.$Api.AddressCreate,
            Login: true
          },
          Data: this.AddressMsg,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating('success', `${ this.AddressMsg.Id !== 0 ? '编辑' : '添加' }地址成功`)
              this.HandleRes(true)
            } else {
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }
  private IsShowModal: boolean = false;
  private AddressMsg: Interface.AddressManageList = new Interface.AddressManageList();
  private Rules:any = {
    AddressAlias: [{ required: true, message: '请输入地址别名' }],
    State: [{ required: true, message: '请输入州/省' }],
    Street1: [{ required: true, message: '请输入地址'}],
    Contact: [{ required: true, message: '请输入联系人' }],
    Mobile: [{ required: true, message: '请输入手机号' }, { pattern: this.$Pattern.Mobile, message: '请填写正确的手机号码' }],
    CountryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
    City: [{ required: true, message: '请输入城市' }],
    ZipCode: [{ required: true, message: '请输入邮编' }],
    Email: [{ message: '请输入邮箱' }, { pattern: this.$Pattern.Email, message: '邮箱格式不正确' } ]
  }
}

</script>
<style lang="less"></style>
