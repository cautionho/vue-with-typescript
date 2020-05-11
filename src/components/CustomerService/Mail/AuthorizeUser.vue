<!-- 邮箱账号 授权用户 -->
<template>
  <Modal v-model="AuthorizeModal" title="授权用户" :width="700" @on-cancel="CancelModal">
    <Row class="Max-Height-500">
      <label @click.prevent="CheckedUser(Item.Value)" v-for="(Item, Index) in Users" :key="Index" :class="`P-W-200 P-MB-10 ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default ${IsChecked(Item.Value,1)}`">
        <span :class="`ivu-checkbox ${IsChecked(Item.Value,2)}`">
          <span class="ivu-checkbox-inner"></span> 
          <input @click.prevent type="checkbox" class="ivu-checkbox-input" :value="Item.Value">
          </span> 
        {{Item.Key}}  
      </label>
    </Row>
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'AuthorizeUser'
})

export default class AuthorizeUser extends Vue {
  private Trigger(Id: number): void {
    this.$set(this.AuthorizeUserForm, 'Id', Id);
    if(!this.Users.length){
      this.GetUsers(Id);
    }else{
      this.GetAuthorizeUser(Id)
    }
    this.$set(this, 'AuthorizeModal', true)
  }

  private GetUsers(Id:number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.GetUserDropList
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$set(this, 'Users', Res.Data.DropList)
          this.GetAuthorizeUser(Id)
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    })
  }

  private GetAuthorizeUser(Id:number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EmailAccountDropList,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.AuthorizeUserForm.UserIds.push(...Res.Data.Data.map((Item: {BindUserId: number}) => Item.BindUserId))
          this.$forceUpdate();
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* Type: 1-wrapper  2-inner */
  private IsChecked(Val: number, Type: number): string {
   return this.AuthorizeUserForm.UserIds.findIndex(Itm  => Itm === Val) < 0 ? '' :  (Type === 1 ? 'ivu-checkbox-wrapper-checked' : 'ivu-checkbox-checked')
  }

  private CheckedUser(Val: number): void {
    const Idx: number = this.AuthorizeUserForm.UserIds.findIndex(Itm  => Itm === Val);
    Idx < 0 ? this.AuthorizeUserForm.UserIds.push(Val) : this.AuthorizeUserForm.UserIds.splice(Idx, 1);
  }

  private Validate(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.EmailAccountBindUser,
        Login: true
      },
      Data: this.AuthorizeUserForm,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '授权成功')
          this.CancelModal()
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'AuthorizeModal', false)
    this.$set(this, 'AuthorizeUserForm', new Interface.AuthorizeUser())
  }

  private AuthorizeModal: boolean = false
  private Users: PInterface.KV[] = []

  private AuthorizeUserForm: Interface.AuthorizeUser = new Interface.AuthorizeUser()
}
</script>
<style lang="less" scoped>
.Max-Height-500{
  max-height:500px;
  overflow: auto;
}
</style>