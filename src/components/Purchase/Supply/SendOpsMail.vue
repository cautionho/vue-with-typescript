<template>
	<Row class="P-Inline-Block SendOps">
    <Button type="primary" @click="SendOpsMailModal = true">发送OPS站内信</Button>
    <Col>
      <Modal v-model="SendOpsMailModal" title="发送OPS系统站内信" :mask-closable="false" :width="850" @on-cancel="EmitSendMail(false)">
        <Form onsubmit="return false" ref="SendPmsForm" :model="SendPmsForm" :rules="SendPmsMsgRules" :label-width="100">
          <Form-item label="标题：" prop="Title">
            <Input v-model="SendPmsForm.Title" placeholder="请输入标题"></Input>
          </Form-item>
          <Form-item label="信息类型：" prop="MsgType">
            <Select v-model="SendPmsForm.MsgType" placeholder="请选择消息类型" :options="MsgTypeList" />
            <!-- <Select v-model="SendPmsForm.MsgType" placeholder="请选择消息类型" filterable clearable>
              <Option v-for="(item,index) in MsgTypeList" :value="$Enums.Purchase.MsgType[item]" :key="index">{{item}}</Option>
            </Select> -->
          </Form-item>
          <Row>
            <Col span="12">
              <Form-item label="全局发送：" class="ivu-form-item-required">
                <Radio-group v-model="SendPmsForm.IsGlobalSend">
                  <Radio :label="1">
                    <span>否</span>
                  </Radio>
                  <Radio :label="2">
                    <span>是</span>
                  </Radio>
                </Radio-group>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="发送邮件：" class="ivu-form-item-required">
                <Radio-group v-model="SendPmsForm.IsSendEmail">
                  <Radio :label="1">
                    <span>否</span>
                  </Radio>
                  <Radio :label="2">
                    <span>是</span>
                  </Radio>
                </Radio-group>
              </Form-item>
            </Col>
          </Row>
          <Form-item label="收件供应商：" class="ivu-form-item-required" v-if="SendPmsForm.IsGlobalSend==1">
            <Button type="primary" @click="AddSupplier()">添加供应商</Button>
            <Table class="P-MT-5" size="small" height="200" ref="SupplierTable" :columns="SupplierCol" :data="SupplierData" stripe style="line-height:1;"></Table>
          </Form-item>
          <Form-item label="消息内容：" class="ivu-form-item-required">
            <Editor ref="Editor" :DomHeight="250"></Editor>
          </Form-item>
        </Form>
        <footer slot="footer">
          <Button type="primary" @click="Valid">发送</Button>
          <Button @click="EmitSendMail(false)">取消</Button>
        </footer>
      </Modal>
    </Col>
    
    <EnableSupplier ref="ShowEnableModal" :AddCityList="CityTrees"  @emit-eable-supplier="CloseEnableSupp" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit} from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
  name: 'SendOpsMail',
  components: {
    Editor: () => import('@/components/Public/Jodit.vue'),
    EnableSupplier: () => import('@/components/Public/EnableSupplier.vue')
  }
})
export default class SendOpsMail extends Vue {
  @Prop() CityList: PInterface.AreaTree[]

  @Emit() EmitSendMail(V: boolean): void{
    this.SendOpsMailModal = false;
    (this.$refs["SendPmsForm"] as any).resetFields();
    this.$set(this, 'SendPmsForm',  new Interface.SendOpsMails());
    (this.$refs["Editor"] as any).SetContent(""); //清空文本框
    this.SupplierData = [];
  }

  @Watch('SendPmsForm.IsGlobalSend')    //切换全局发送清空表格数据
  private ChangeGlobal(): void{
    this.SupplierData = [];
  } 

  get CityTrees(){  //计算属性赋值
    return this.CityList;
  }

  private AddSupplier(): void{
    (this.$refs["ShowEnableModal"] as any).TriggerModal(true, this.IsLoadingEnableTab, true)
  }

  private Valid(): void{
    (this.$refs['SendPmsForm'] as any).validate((Valid: boolean) => {
      if (Valid) {
        if(this.SendPmsForm.IsGlobalSend == 1 && this.SupplierData.length < 1){
          this.$UI.Tips.Floating('warning', `请选择供应商`);
          return
        }
        
        if((this.$refs["Editor"] as any).GetContent() == undefined || (this.$refs["Editor"] as any).GetContent() == "" || (this.$refs["Editor"] as any).GetContent() == '<p><br></p>'){
          this.$UI.Tips.Floating('warning', `请输入消息内容`);
          return
        }

        this.PostSend()
      }
    })
  }

  //发送请求
  private PostSend():void{
    let PostForm = JSON.parse(JSON.stringify(this.SendPmsForm))
    PostForm.IsGlobalSend = PostForm.IsGlobalSend === 1 ? false : true
    PostForm.IsSendEmail = PostForm.IsSendEmail === 1 ? false : true
    PostForm.Content = (this.$refs["Editor"] as any).GetContent()
    PostForm.SupplyIds = this.SupplierData.map( (Item: Interface.Supplier):number => Item.Id )
    PostForm.OperateName = JSON.parse(this.$Cookie.Get('frler_user')).UserName
    PostForm.OperateId = JSON.parse(this.$Cookie.Get('frler_user')).UserId

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.SupplySendPMSMessage,
        Login: true
      },
      Data: PostForm,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `发送OPS系统站内信成功`);
          this.EmitSendMail(true)
        } else {
          this.$Request.Error(Res);
          this.$UI.Loading.Hide();
        }
      }
    })
  }

  //选择供应商
  private CloseEnableSupp(Val: boolean, IsLoadingTab: boolean, SelectData: Interface.Supplier[]): void{
    this.IsLoadingEnableTab = IsLoadingTab;

    if(SelectData){
      SelectData.forEach( (Item)=>{
        let Flag = false;
        this.SupplierData.forEach( (Itm: Interface.Supplier[] | any)=>{
          if(Itm.Id === Item.Id){
            Flag = true;
          }
        })
        if(!Flag){
          this.SupplierData.push(Item)
        }
      })
    }
  }

  //删除供应商
  private DelSupplier(Idx: number):void{
    this.SupplierData.splice(Idx, 1)
  }

  private SendOpsMailModal: boolean = false;
  private SendPmsForm: Interface.SendOpsMails = new Interface.SendOpsMails(); //提交发送站内信数据
  private MsgTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.MsgType)    //信息类型下拉
  private SupplierData: Interface.Supplier[] | any = [] //表格数据
  private IsLoadingEnableTab: boolean = true;  //打开添加供应商时是否加载表格数据

  private SendPmsMsgRules: any = {
    Title: [{required: true, message: '请输入标题'}],
    MsgType: [{required: true, message: '请选择信息类型', trigger: 'change', type: 'number'}]
  }
  private SupplierCol: PInterface.TableCol[] = [
    { title: '供应商名称', key: 'SupplyName' },
    { title: '操作',width: 100,render: (h: any, params: any): string => {
          return h('Button', {
            props: {
              size: 'small',
              type: 'error'
            },
            on: {
              click: () => {
                this.DelSupplier(params.index)
              }
            }
          }, '删除')
        }
      }
    ]
}

</script>
<style lang="less">
</style>
