<template>
<Row>
  <Form :model="HandleForm" ref="HandleForm" onsubmit="return false" :label-width="100">
    <FormItem class="P-MB-10" label="操作：">
      <RadioGroup v-model="HandleForm.ProcessType">
         <Radio :label="1">
          <span>同意退款</span>
        </Radio>
        <Radio :label="2">
          <span>提交给Shopee</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <Col span="24" v-show="HandleForm.ProcessType === 2">
      <FormItem label="邮箱：" prop="Email" :rules="{ required: HandleForm.ProcessType === 2, message: '请输入邮箱', pattern: $Pattern.Email }">
        <Input placeholder="请输入邮箱" v-model="HandleForm.Email"></Input>
      </FormItem>
      <FormItem label="原因：" prop="Reason" :rules="{ required: HandleForm.ProcessType === 2, message: '请选择原因', trigger: 'change' }">
        <Select placeholder="请选择原因" v-model="HandleForm.Reason" :options="ReasonDrop" />
        <!-- <Select placeholder="请选择原因" clearable filterable v-model="HandleForm.Reason">
          <Option v-for="(Item, Index) in ReasonDrop" :key="Index" :value="$Enums.CustomerService.ShopeeReturnReason[Item]">{{Item}}</Option>
        </Select> -->
      </FormItem>
      <FormItem label="备注说明：" prop="ReasonText" :rules="{required: HandleForm.ProcessType === 2, message: '请输入备注说明'}">
        <Input placeholder="请输入备注" type="textarea" maxlength="2000" show-word-limit :autosize="{minRows: 4, maxRows: 4}" v-model="HandleForm.ReasonText"></Input>
      </FormItem>
      <FormItem>
        <div class="P-Inline-Block P-Uploader-Img" v-for="(Item, Index) in HandleForm.ReasonImages" :key="Index">
          <img class="P-Uploader-Img" :src="`${$Server.File}/${Item}`" />
          <Icon class="P-Uploader-Del" type="md-close-circle" size="20" @click="UploaderDel(Index)"></Icon>
        </div>
        <Upload v-show="HandleForm.ReasonImages.length < 3" :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})" :show-upload-list="false" :on-success="HandleUploadSuccess" :accept="'.jpg, .jpge, .png'" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" :before-upload="HandleBeforeUpload" multiple :action="`${$Server.Settings}${$Api.UploadImage}`" class="P-Uploader P-Inline-Block P-VA-T">
          <div class="P-Uploader-Img">
            <Icon type="md-add" size="20"></Icon>
          </div>
        </Upload>
        <p class="P-MT-5">最多上传3张大小在2M内且格式为PNG或JPG格式的图片</p>
      </FormItem>
    </Col>
  </Form>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';
import ShipOrder from '@/assets/Interface/ShipOrder';

@Component({
  name: 'HandleRefund'
})

export default class HandleRefund extends Vue {
  @Getter private 'CustomerService/SHOPEE_RETURN_INFO': Interface.ShopeeReturnRefundInfo
  get SHOPEE_RETURN_INFO(){
    return this['CustomerService/SHOPEE_RETURN_INFO']
  }

  @Emit() private EmitHandleSuccess(): void {}

  private Reset(): void {
    this.$set(this, 'HandleType', 1);
    this.$set(this, 'HandleForm', new Interface.HandleShopeeReturnRefund())
  }

  /* 上传文件 */
  private HandleUploadSuccess(Res: PInterface.Res, File: any, FileList: any[]): void {
    if(Res.IsSuccess){
      this.HandleForm.ReasonImages.push(Res.Data.Url);
    }else{
      this.$Request.Error(Res);
    }
    this.CountUploadQty()
  }
  private HandleFormatError(File: any): void {
    this.$UI.Tips.Floating('warning', `文件[${File.name}]格式不为JPG/JPGE/PNG，请检查`);
    this.CountUploadQty()
  }
  private HandleMaxSize(File: any, FileList: any[]): void {
    this.$UI.Tips.Floating('warning', `文件${File.name}大小超过2M，请检查`);
    this.CountUploadQty()
  }
  private HandleBeforeUpload(File: any): void | boolean {
    if(this.UploadQty === 0){
      this.$UI.Loading.Show();
    }
    // 超过5张不再继续上传
    if(this.UploadQty + this.HandleForm.ReasonImages.length >= 5){
      return false
    }
    this.UploadQty++;
  }

  private CountUploadQty(): void {
    this.UploadQty--;
    if(this.UploadQty <= 0){
      this.$UI.Loading.Hide();
    }
  }

  private UploaderDel(Idx: number): void {
    this.HandleForm.ReasonImages.splice(Idx, 1);
  }
  /* 上传文件 */

  private Validate(): void {
    (this as any).$refs.HandleForm.validate((Valid: boolean): void => {
      if(Valid){
        if(!this.HandleForm.ReasonImages.length){
          this.$UI.Tips.Floating('warning', '请上传图片')
          return
        }
        this.PostHandle();
      }
    })
  }

  private PostHandle(): void {
    this.$set(this.HandleForm, 'ReturnId', this.SHOPEE_RETURN_INFO.ReturnOrder.Id)
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.ShopeeReturnSubmitOperation,
        Login: true
      },
      Data: this.HandleForm,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', '处理成功')
          this.EmitHandleSuccess()
        }else{
          this.$UI.Loading.Hide()
          this.$Request.Error(Res)
        }
      }
    }) 
  }

  private HandleForm: Interface.HandleShopeeReturnRefund = new Interface.HandleShopeeReturnRefund()
  private ReasonDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.ShopeeReturnReason)
  private UploadQty: number = 0
  // private HandleType: number = 1
}
</script>
<style lang="less" scoped>
.Tpl-Container {
  max-height:100px;
  overflow: auto;
}
</style>