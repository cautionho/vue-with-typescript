
<!--添加、编辑拍摄需求-->
<template>
  <div class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-MR-10 P-MB-10" v-if="Power" @click="ChangeModal(1)">添加拍摄需求</Button>
      <Modal v-model="IsShowModal" :title="CurrSeleData.length>0?'修改拍摄需求':'添加拍摄需求'" @on-cancel="ChangeModal(3)" :mask-closable="false" :width="500">
        <Form :label-width="100" :model="PhotoRequestMsg" ref="PhotoRequestMsg" :rules="Rules" onsubmit="return false;" name="PhotoRequestMsg">
          <Form-item label="SKU编号：" class="ivu-form-item-required">
            <span class="P-MR-10" v-if="PhotoRequestMsg.SkuCode">{{PhotoRequestMsg.SkuCode}}</span> <Button type="primary" @click="OpenSku">选择SKU</Button>
          </Form-item>
          <Form-item label="产品名：">
            <span>{{ ProductName }}</span>
          </Form-item>
          <Form-item label="参考链接：" prop="DemoUrl">
            <Input v-model="PhotoRequestMsg.DemoUrl" placeholder="请输入参考链接" name="proNameInput" ref="DemoUrl"></Input>
          </Form-item>
          <Form-item label="美工：" prop="Operator">
            <Select placeholder="请选择美工" v-model="PhotoRequestMsg.Operator" :options="DropOperator" />
            <!-- <Select placeholder="请选择美工" v-model="PhotoRequestMsg.Operator" filterable clearable>
              <Option v-for="Item in DropOperator" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="备注：">
            <Input v-model="PhotoRequestMsg.Remark" placeholder="请输入备注" type="textarea" :autosize="{minRows: 4,maxRows: 5}"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="PostOpe(false)">{{this.CurrSeleData.length>0?'修改':'添加'}}</Button>
          <Button type="primary" @click="PostOpe(true)">提交美工处理</Button>
          <Button @click="ChangeModal(3)">取消</Button>
        </div>
      </Modal>
      <EnableSku ref="EnableSku" @handle-res-msg="HandleSkuRes" ></EnableSku>
    </Col>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'ModifyPhotoRequest',
  components:{
    EnableSku: () => import('@/components/Public/EnableSku.vue')
  }
})
export default class ModifyPhotoRequest extends Vue {
  @Prop() Power: boolean;

  @Emit() ChangeModal(Res: number): void {  //1-打开 2-成功 3-取消
    this.PhotoRequestMsg = new Interface.PhotoRequestMsg();
    this.$set(this,'IsShowModal', false);
    (this.$refs.PhotoRequestMsg as any).resetFields();
    this.ProductName = "";
  }

  private TriggerModal(SelectedData: Interface.PhotoRequestList[], DropOperator: PInterface.KV[]){
    this.DropOperator = DropOperator;
    this.CurrSeleData = SelectedData;
    this.IsShowModal = true;
    this.$nextTick(()=>{
      (this.$refs.DemoUrl as any).focus();
    })
    if(this.CurrSeleData.length > 0){
      this.PhotoRequestMsg.Id = this.CurrSeleData[0].Id;
      this.PhotoRequestMsg.DemoUrl = this.CurrSeleData[0].DemoUrl;
      this.PhotoRequestMsg.SkuCode = this.CurrSeleData[0].SkuCode;
      this.PhotoRequestMsg.Remark = this.CurrSeleData[0].Remark;
      this.ProductName = this.CurrSeleData[0].SkuName;
    }
  }

  private OpenSku():void{
    (this.$refs['EnableSku'] as Vue).Trigger(true);
  }

  // Sku回调
  private HandleSkuRes(SelectData: PInterface.EnableSku[]):void {
    this.PhotoRequestMsg.SkuCode = SelectData[0].SkuCode;
    this.PhotoRequestMsg.SkuId = SelectData[0].Id;
    this.ProductName = SelectData[0].SkuName;
  }

  private PostOpe(IsToHandle: boolean): void{
    (this.$refs.PhotoRequestMsg as any).validate( (V: boolean)=>{
      if(V){
        if(this.PhotoRequestMsg.SkuCode === ""){
          this.$UI.Tips.Floating('warning', ` 请选择SKU`);
          return;
        }
        const UseServer = this.CurrSeleData.length == 0 ? this.$Api.PhotoRequestCreate : this.$Api.PhotoRequestModify;
        this.PhotoRequestMsg.IsToHandle = IsToHandle;
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Purchase,
          Api: {
            Address: UseServer,
            Login: true
          },
          Data: this.PhotoRequestMsg,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.ChangeModal(2);
            } else {
              this.$Request.Error(Res);
              this.$UI.Loading.Hide();
            }
          }
        });
      }
    })
  }

  private ProductName:string = ""
  private CurrSeleData: Interface.PhotoRequestList[] = [];  //当前操作数据
  private IsShowModal: boolean = false;
  private DropOperator: PInterface.KV[] = []; //美工下拉
  private PhotoRequestMsg: Interface.PhotoRequestMsg = new Interface.PhotoRequestMsg();  //表单数据
  private Rules: any = {
    Operator: [{ required: true, message: '请选择美工', trigger: 'change', type: 'number' }],
    DemoUrl: [{ required: true, message: '请输入参考链接' }],
  }
}

</script>
<style lang="less"></style>
