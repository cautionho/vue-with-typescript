<template>
   <Row class="Max-600">
     <Form inline :label-width="100">
      <FormItem label="编号：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CASE_INFO.CaseId : CaseInfo.CaseId}}</span>
      </FormItem>
      <FormItem label="来源纠纷：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CASE_INFO.SourceCode : CaseInfo.SourceCode}}</span>
      </FormItem>
      <FormItem label="店铺：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CASE_INFO.StoreName : CaseInfo.StoreName}}</span>
      </FormItem>
      <FormItem label="买家ID：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CASE_INFO.BuyerId : CaseInfo.BuyerId}}</span>
      </FormItem>
      <FormItem label="升级原因：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CASE_INFO.Reason : CaseInfo.Reason}}</span>
      </FormItem>
      <FormItem label="状态：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CASE_INFO.OrderStatus: CaseInfo.OrderStatus}}</span>
      </FormItem>
      <FormItem label="是否可申诉：" class="P-W-49-Percent P-MB-10">
        <span>{{ (IsState ? CASE_INFO.IsAppeal : CaseInfo.IsAppeal) ? '是' : '否'}}</span>
      </FormItem>
      <FormItem label="申诉结果：" class="P-W-49-Percent P-MB-10">
        <span>{{IsState ? CASE_INFO.AppealResult : CaseInfo.AppealResult}}</span>
      </FormItem>
      <FormItem label="创建时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date(IsState ? CASE_INFO.Created : CaseInfo.Created, true)}}</span>
      </FormItem>
      <FormItem label="更新时间：" class="P-W-49-Percent P-MB-10">
        <span>{{$UI.Render.Date(IsState ? CASE_INFO.Updated : CaseInfo.Updated, true)}}</span>
      </FormItem>
    </Form>
    <Col span="24" class="P-MB-10">
      <div class="Chat-Item" v-for="(Item, Index) in (IsState ? CASE_INFO.Chats : CaseInfo.Chats)" :key="Index">
        <p>{{Item.Title}} <span class="P-Float-Right"><Button class="P-MR-5" size="small" v-if="Item.Content" @click="Translation(Item.Content)">翻译成英文</Button>{{$UI.Render.Date(Item.Created, true)}}</span></p>
        <section v-html="Item.Content"></section>
      </div>
    </Col>
    <Handle ref="Handle" :Disputed="Disputed" @emit-handle-success="EmitOperateSuccess" @emit-cancel-modal="EmitCancelDetails" v-if="Disputed > 2" />
   </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'CaseDetails',
  components: {
    Handle: () => import('./HandleCase.vue')
  }
})

export default class CaseDetails extends Vue {
  @Action private 'CustomerService/UPDATE_DISPUTED': any

  @Getter private 'CustomerService/CASE_INFO': Interface.CaseInfo
  get CASE_INFO(){
    return this['CustomerService/CASE_INFO'];
  }
  @Emit() private EmitOperateSuccess(): void {}
  @Emit() private EmitCancelDetails(): void {}

  private Trigger(Id: number, DisputedType: number = 0): void {
    this.$set(this, 'CaseInfo', new Interface.CaseInfo());
    if(this['CustomerService/CASE_INFO'].CaseId){
      // 已有数据 获取新的
      this.$set(this, 'IsState', false)
      this.GetDisputedDetails(Id)
    }else{
      this['CustomerService/UPDATE_DISPUTED']({Type: 'CASE', Id: Id})
      this.$nextTick(()=>{
        this.$set(this, 'Disputed', DisputedType)
        if(DisputedType > 2){
          setTimeout(()=>{
            (this as any).$refs.Handle.Reset()
          },300)
        }
      })
    }
  }

  private GetDisputedDetails(Id: number): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetCaseDetail,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'CaseInfo', Res.Data.Data)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Translation(Ctn: string): void {
    window.open(`https:\/\/translate.google.cn/#view=home&op=translate&sl=auto&tl=en&text=${Ctn}`, '_blank')
  }

  private Validate(): void {
    (this as any).$refs.Handle.Validate();
  }

  private Disputed: number = 0 /* 存储DisputedType: 0-不展示 1-查看 2-处理 */
  private IsState: boolean = true
  private CaseInfo: Interface.CaseInfo = new Interface.CaseInfo()
}
</script>
<style lang="less" scoped>
.Max-600{
  max-height:500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.Chat-Item {
  border-radius: 2px;
  border: 1px solid #eee;
  margin-bottom:2px;

  &>p{
    line-height: 30px;
    font-weight: 700;
    background-color: #eee;
    padding: 0 10px;
  }

  &>section {
    word-break: break-word;
    padding: 10px;
  }
}
</style>