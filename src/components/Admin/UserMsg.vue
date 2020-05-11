<template>
	<div>
		<Col class="P-Float-Right P-PL-10 P-PR-10 P-MR-10 P-Pointer">
			<Dropdown>
				<span href="javascript:void(0)" class="P-Text-White P-Hover-White">当前用户：{{UserName}} <Icon type="ios-arrow-down" class="P-ML-5"/></span>
				<Dropdown-menu slot="list" style="width: 140px;">
					<Dropdown-item>
						<span class="P-Block" @click="ModifyPwdEntrance">
							<span>修改密码</span>
						</span>
					</Dropdown-item>
					<Dropdown-item>
						<span class="P-Block" @click="Logout">
							<span>退出系统</span>
						</span>
					</Dropdown-item>
				</Dropdown-menu>
			</Dropdown>
			<Modal v-model="ModifyModal" title="修改密码" :closable="false" :mask-closable="false">
				<Form onsubmit="return false" ref="ModifyPwdMsg" :model="ModifyPwdMsg" :rules="RuleValidate" :label-width="100">
					<Form-item label="原密码：" prop="OldPwd">
						<Input type="password" v-model="ModifyPwdMsg.OldPwd" placeholder="请输入原密码" class="P-W-100-Percent" ref="OldPwdInput" @on-enter="ValidateModifyPwd"></Input>
					</Form-item>
					<Form-item label="新密码：" prop="NewPwd">
						<Input type="password" v-model="ModifyPwdMsg.NewPwd" placeholder="请输入长度为14~25位新密码" class="P-W-100-Percent" ref="NewPwdInput" @on-enter="ValidateModifyPwd"></Input>
					</Form-item>
				</Form>
				<div slot="footer">
					<Button type="primary" @click="ValidateModifyPwd">提交</Button>
					<Button type="default" @click="ModifyCancel" class="P-ML-10">取消</Button>
				</div>
			</Modal>
		</Col>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Interface from '../../assets/Interface/Admin';
import PInterface from '../../assets/Interface/Public';
@Component({
	name: 'UserMsg'
})

export default class UserMsg extends Vue {
	private mounted() {
    //根据登录信息修改username值
    this.UserName = JSON.parse(this.$Cookie.Get('frler_user')).UserName
  }
	
	private Logout(): void {
    this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content:'是否退出系统',
    	Enter:false,
    	Callback:(bool:boolean):void=>{
    		if(bool){
    			this.$Log.Out();
    		}
    	}
    })
  }
	
	private ModifyPwdEntrance(): void {
		(this.$refs["ModifyPwdMsg"] as any).resetFields();
    this.ModifyModal = true;
    this.$nextTick(function() {
      (this.$refs["OldPwdInput"] as any).focus();
    })
	}
	
	private ValidateModifyPwd(): void {
		(this.$refs["ModifyPwdMsg"] as any).validate((Valid: boolean):void => {
      if (Valid) {
      	this.PostModifyPwd();
      }else{
      	if(!this.ModifyPwdMsg.OldPwd){
      		(this.$refs["OldPwdInput"] as any).focus();
      	}else{
      		(this.$refs["NewPwdInput"] as any).$el.children[1].select();
      		(this.$refs["NewPwdInput"] as any).focus();
      	}
      }
    })
	}
	
	private PostModifyPwd(): void {
		this.$UI.Loading.Show();
  	this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.UserChangePwd,
				Login: true
			},
			Data: this.ModifyPwdMsg,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
					this.$UI.Tips.Floating('success', '修改密码成功');
					this.ModifyCancel()
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}
	
	private ModifyCancel(): void {
		this.$set(this, 'ModifyModal', false);
    (this.$refs["ModifyPwdMsg"] as any).resetFields();
	}
	
	private UserName:string = "";
	private ModifyModal:boolean = false;
	private RuleValidate: any = {
    OldPwd: [{ required: true, message: '请填写原密码', trigger: 'blur' }, { type: 'string', min: 8, message: '密码长度不能小于8位' }],
    NewPwd: [{ required: true, message: '请填写新密码', trigger: 'blur' }, { type: 'string', min: 14, message: '密码长度不能小于14位' }, { type: 'string', max: 25, message: '密码长度不能大于25位' }]
  }
	private ModifyPwdMsg: Interface.ReqPwd = { OldPwd: '', NewPwd: '' }
}
</script>

<style lang="less">

</style>