<template>
  <div class="P-Inline-Block">
    <Button class="P-MB-10 P-MR-5" type="primary" @click="EmitApi(true)">启用API</Button>
    <Button class="P-MB-10 P-MR-5" type="error" @click="EmitApi(false)">禁用API</Button>
  </div>
</template>
<script lang="ts">
import {Component,Vue,Prop,Emit} from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Sales';

@Component({
  name:'EnableApi'
})

export default class EnableApi extends Vue{
  @Prop(Number) private Platform:number
  @Prop(Array) private SelectedData:Interface.StoreList[]
  @Prop(String) private PostApi: string
  @Prop(String) private PostServer: string
  @Emit() EmitModify(B:boolean):void {}
//  @Emit() EmitApi(B:boolean):void {}
 /* 触发启禁用API */
  private EmitApi(B: boolean, D?: Interface.StoreList[]): void {
    let Datas:Interface.StoreList[] = D || this.SelectedData;
    if(!Datas.length){
      this.$UI.Tips.Floating('warning', '请选择店铺进行操作');
      return;
    }else{
      if (Datas.every(Item => Item.IsUseApi === B)) {
        this.$UI.Tips.Floating('warning', `当前选中账号API状态均为${B ? '已启用' : '已禁用'}，请检查`)
        return
      }

      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: `是否将选中账号API状态变更为${B ? '启用' : '禁用'}`,
        Callback: (Confirm: boolean) => {
          if (Confirm) {
            this.$UI.Loading.Show();
            this.$Request.Post({
              Server: this.PostApi ? this.PostServer : this.$Server.Sales,
              Api: {
                Address: this.PostApi ? this.PostApi : this.$Api.Sales[this.Platform].StoreApi,
                Login: true
              },
              Data: {
                Id: Datas.map((Item: Interface.StoreList): number | undefined => { if (Item.IsUseApi !== B) { return Item.Id }else { return 0 } }),
                IsUseApi: B
              },
              Callback: (Res: PInterface.Res): void => {
                if (Res.IsSuccess) {
                  this.$UI.Tips.Floating('success', `账号API状态已变更为${B ? '启用' : '禁用'}`);
                  this.EmitModify(true);
                } else {
                  this.$UI.Loading.Hide();
                  this.$Request.Error(Res);
                }
              }
            })
          }
        }
      })
    }
  }

}
</script>
<style lang="less"></style>