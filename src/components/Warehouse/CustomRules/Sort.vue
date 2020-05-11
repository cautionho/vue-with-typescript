<template>
  <Modal v-model="SortModal" title="排序" @on-cancel="CancelModal">
    <Form :model="SortForm" ref="SortForm" :rules="SortRules" :label-width="80" onsubmit="return false;">
      <FormItem label="序号：" prop="Priority">
        <Input ref="SortNum" :min="0" placeholder="请输入序号" v-model="SortForm.Priority"></Input>
      </FormItem>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';

@Component({
  name: 'CustomRulesSort'
})

export default class CustomRulesSort extends Vue {
  @Emit() EmitCustomRules():void {}

  private Trigger(Data: Interface.CustomRulesList):void {
    this.$set(this, 'SortModal', true);
    this.SortForm.Id = Data.Id;
    this.SortForm.Priority = Data.Priority;
    this.$nextTick(()=>{
      (this as any).$refs.SortNum.focus();
    })
  }

  private Validate(): void {
    (this as any).$refs.SortForm.validate((Valid:boolean):void => {
      if(Valid){
        this.PostSort();
      }else{
        (this as any).$refs.SortNum.focus();
      }
    })
  }

  private PostSort(): void {
    this.$UI.Loading.Show();
    const PostData: Interface.CustomRulesSort = JSON.parse(JSON.stringify(this.SortForm))
    PostData.Priority = Number(PostData.Priority);
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.MatchRuleUpdatePriority,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '修改排序成功');
          this.CancelModal();
          this.EmitCustomRules();
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal():void {
    this.$set(this, 'SortModal', false);
    this.$nextTick(()=>{
      (this as any).$refs.SortForm.resetFields();
    })
  }

  private SortModal:boolean = false
  private SortForm: Interface.CustomRulesSort = new Interface.CustomRulesSort()
  private SortRules:any = {
    Priority: [{required: true, message: '请输入序号'}, { pattern: this.$Pattern.PositiveNotZeroInt, message: '序号必须为大于0的整数' }]
  }
}
</script>