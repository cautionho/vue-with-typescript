<template>
  <Modal v-model="RedisModel" title="绑定RedisDB" @on-cancel="CancelModal">
  <Form :model="RedisForm" :rules="RedisRules" ref="RedisForm" :label-width="80" on-submit="return false;">
    <FormItem label="编号：" prop="DbNum">
      <Input placeholder="编号" v-model="RedisForm.DbNum"></Input>
    </FormItem>
  </Form>
  <footer slot="footer">
    <Button type="primary" @click="Validate">提交</Button>
    <Button @click="CancelModal">取消</Button>
  </footer>
  </Modal>
</template>
<script lang="ts">
import {Component, Vue, Emit, Prop} from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Sales';

@Component({
  name:'RedisDB'
})

export default class RedisDB extends Vue {
  private Trigger(D:Interface.StoreList):void {
    this.RedisForm.StoreId = D.Id
    this.$set(this,'RedisModel',true);
  }

  private Validate():void {
    (this as any).$refs.RedisForm.validate((Valid:boolean) =>{
      if(Valid){
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server:this.$Server.Sales,
          Api:{
            Address:this.$Api.Sales['1'].BindRedisDb,
            Login:true
          },
          Data:this.RedisForm,
          Callback:(Res:PInterface.Res) => {
            if(Res.IsSuccess){
              this.$UI.Tips.Floating('success','绑定成功');
              this.CancelModal();
            }else{
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private CancelModal():void {
    this.RedisForm = new Interface.RedisDB()
    this.$nextTick(()=>{
      (this as any).$refs.RedisForm.resetFields();
      this.$set(this,'RedisModel', false)
    })
  }

  private RedisModel:boolean = false
  private RedisForm:Interface.RedisDB = new Interface.RedisDB()
  private RedisRules:any = {
    DbNum : [{required:true,message:'请输入编号'}]
  }
}
</script>
<style lang="less" scoped></style>