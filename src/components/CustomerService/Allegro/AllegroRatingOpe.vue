<!--allegro客户评价 回复、删除、设置备注 组件-->
<template>
  <Modal v-model="ShowModal" :title="Type === 2 ? '回复评价' : Type === 3 ? '删除评价' : Type === 4 ? '设置状态' : '设置备注'" :mask-closable="false" @on-cancel="HandleRes(false)">
    <Form onsubmit="return false;" :label-width="100">
      <div v-if="Type != 4">
        <p class="P-MB-5" :class="[Type===5?'P-None':'']">回复内容</p>
        <Input v-model="Remark" ref="Remark" type="textarea" :autosize="{minRows: 5,maxRows: 5}" :placeholder="Type === 5 ? '请输入备注' : ''" :maxlength="Type !==5 ? 500 : ''"></Input>
        <p class="P-MT-10" :class="[Type===5?'P-None':'']">回复内容最多输入只能输入500个字符</p>
      </div>
      <FormItem label="选择状态：" class="ivu-form-item-required" v-else>
        <Select placeholder="请选择状态" v-model="State" :options="StateDrop" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="Valid" class="P-MR-5">提交</Button>
      <Button type="primary" @click="HandleRes(false)">取消</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'AllegroRatingOpe',
  components: {}
})

export default class AllegroRatingOpe extends Vue {
  @Emit() private HandleRes(B: boolean): void {
    this.ShowModal = false;
    this.Remark = "";
    this.State = 0;
  }

  private TriggerModal(Select:Interface.AllegroRatingList[], Type: number, IsBatch: boolean): void {  //2-回复评价 3-删除评价 4-设置状态 5-设置备注
    this.Type = Type;
    this.CurrOpeData = Select;
    if(this.Type === 5 && !IsBatch){
      this.Remark = this.CurrOpeData[0].Remark;
    }
    if(this.Type === 4 && !IsBatch){
      this.State = this.CurrOpeData[0].State as number;
    }
    this.ShowModal = true;
    if(this.Type !== 4) this.$nextTick(()=>{ (this as any).$refs.Remark.focus() })
  }

  private Valid(){
    if((this.Type === 2 || this.Type === 3) && this.Remark.trim() === ""){
      this.$UI.Tips.Floating('warning', `请输入内容`);
      return;
    }

    if(this.Type === 4 && !this.State){
      this.$UI.Tips.Floating('warning', `请选择状态`);
      return;
    }

    let Obj1 = { Id: this.CurrOpeData[0].Id, Content: this.Remark.trim() },
    Obj2 = { Ids: this.CurrOpeData.map(Item=>Item.Id), Remark: this.Remark },
    Obj3 = { Ids: this.CurrOpeData.map(Item=>Item.Id), State: this.State }

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.Type === 2 ? this.$Api.AllegroRatingsReply : this.Type === 3 ? this.$Api.AllegroRatingsDelete : this.Type === 4 ? this.$Api.AllegroRatingsUpdateState : this.$Api.AllegroRatingsSetRemark,
        Login: true
      },
      Data: this.Type === 5 ? Obj2 : this.Type === 4 ? Obj3 : Obj1,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', `${this.Type == 2 ? '回复评价' : this.Type === 3 ? '删除评价' : this.Type === 4 ? '设置状态' : this.Type === 5 ? '设置备注' : ''}成功`);
          this.HandleRes(true);
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CurrOpeData: Interface.AllegroRatingList[] = []; 
  private Remark: string = ""
  private ShowModal:boolean = false
  private Type: number = 0
  private State: number = 0;
  private StateDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AllegroRatingState)
}
</script>
<style lang="less">
</style>