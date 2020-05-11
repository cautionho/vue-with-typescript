<template>
  <Form class="P-MT-20" :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="90">
    <FormItem class="P-MB-0" label="操作：">
      <RadioGroup v-model="HandleForm.IsAgree">
        <Radio :label="1">
          <span>同意</span>
        </Radio>
        <Radio :label="2">
          <span>拒绝</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <Col span="24" v-if="HandleForm.IsAgree === 1">
      <FormItem>
        <Checkbox v-model="HandleForm.InterceptOrCancel">拦截或取消订单</Checkbox>
      </FormItem>
    </Col>
    <Col span="24" v-else>
      <FormItem class="P-MB-0"></FormItem>
      <FormItem label="发货时间：" :rules="{required: true, message: '请选择发货时间', type:'date', trigger: 'change'}" prop="SendTime">
        <DatePicker class="P-W-400" type="date" placeholder="发货时间" v-model="HandleForm.SendTime"></DatePicker>
      </FormItem>
      <FormItem label="跟踪号：" :rules="{required: true, message: '请输入跟踪号'}" prop="TrackingNum">
        <Input class="P-W-400" placeholder="跟踪号" v-model="HandleForm.TrackingNum"></Input>
      </FormItem>
    </Col>
  </Form>
</template>
<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'HandleCancellation'
})

export default class HandleCancellation extends Vue {
  @Getter private 'CustomerService/CANCELLATION_INFO': Interface.CancellationInfo
  get CANCELLATION_INFO(){
    return this['CustomerService/CANCELLATION_INFO']
  }
  @Getter private 'ShipOrder/SHIP_ORDER_INFO': ShipOrder.ShipOrderBase
  get SHIP_ORDER_INFO(){
    return this['ShipOrder/SHIP_ORDER_INFO'];
  }

  @Emit() private EmitHandleSuccess() {}

  @Watch('HandleForm.IsAgree')
  WatchIsAgree(V: number): void {
    (this as any).$refs.HandleForm.resetFields();
  }

  private Reset(): void {
    this.$set(this, 'HandleForm', new Interface.HandleCancellation());
    (this as any).$refs.HandleForm.resetFields();
  }

  private Validate(): void {
    if(this.HandleForm.IsAgree === 1){
      if(!this.SHIP_ORDER_INFO.Id) {
        this.$UI.Tips.Floating('warning', '无订单号或订单详情为空，不能操作此项')
        return;
      }
      if([5,6].some(S => S === this.SHIP_ORDER_INFO.Status)){
        this.$UI.Tips.Modal({
          Type: 'confirm',
          Content: '订单已打包/发货，确定同意取消交易吗',
          Callback: (B: boolean): void => {
            if(B){
              this.PostHandle();
            }
          }
        })
      }else{
        this.PostHandle();
      }
    }else{
      (this as any).$refs.HandleForm.validate((Valid: boolean): void => {
        if(Valid){
          this.PostHandle();
        }
      })
    }
  }

  private PostHandle(): void {
    let PostData: Interface.HandleCancellation = JSON.parse(JSON.stringify(this.HandleForm));
    if(PostData.IsAgree === 1){
      delete PostData.SendTime;
      delete PostData.TrackingNum;
    }else{
      delete PostData.InterceptOrCancel;
    }
    PostData.CancelId = this.CANCELLATION_INFO.CancelId
    let Msg: string = "处理成功";
    if(this.HandleForm.InterceptOrCancel && [1,7,8,9].some(S => S === this.SHIP_ORDER_INFO.Status)){
      Msg = '处理成功，订单已被取消'
    }else if(this.HandleForm.InterceptOrCancel && [2,3,4].some(S => S === this.SHIP_ORDER_INFO.Status)){
      Msg = '处理成功，订单已被拦截'
    }
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.CancelProcessEnd,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', Msg)
          this.EmitHandleSuccess();
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    })
  }

  private HandleForm: Interface.HandleCancellation = new Interface.HandleCancellation()
}
</script>
<style lang="less" scoped>

</style>