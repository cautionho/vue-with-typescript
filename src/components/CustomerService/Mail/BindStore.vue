<!-- 邮箱账号管理 - 绑定店铺 -->
<template>
  <Modal v-model="BindStoreModal" title="绑定店铺" :width="700" @on-cancel="CancelModal" class="Email-Bind-Store-Tree">
    <PlatformStoreTree ref="PlatformStoreTree" />
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService';
// import Tree from '@/assets/Interface/Tree';

@Component({
  name: 'BindStore',
  components: {
    PlatformStoreTree: () => import('@/components/Public/PlatformStoreTree.vue')
  }
})

export default class BindStore extends Vue {
  private Trigger(Id: number): void {
    this.$set(this, 'BindStoreModal', true);
    this.$set(this, 'EmailId', Id)
    this.GetBinded(Id); // 获取已经授权的店铺
  }

  private GetBinded(Id: number): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetBindingStore,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          (this as any).$refs.PlatformStoreTree.Trigger(Res.Data.Data.map((Item: any) => `${Item.Platform}-${Item.StoreId}`).join(','));
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Validate(): void {
    this.$UI.Loading.Show()
    const Selc = (this as any).$refs.PlatformStoreTree.GetSelected()
    let PostData: Interface.BindStore[] = []
    if(!Selc.length){
      PostData.push(new Interface.BindStore())
    }else{
      for(let Item of Selc){
        console.log(Item)
        PostData.push(new Interface.BindStore(this.EmailId, Item.platform, Item.value))
      }
    }
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.BindingStore,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '绑定成功')
          this.CancelModal()
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'BindStoreModal', false)
    this.$set(this, 'EmailId', 0)
  }

  // private IsInit: boolean = true
  private BindStoreModal: boolean = false
  private EmailId: number = 0
}
</script>
<style lang="less">
.Email-Bind-Store-Tree .ivu-modal-body{
  max-height: 500px;
  overflow: auto;
}
</style>