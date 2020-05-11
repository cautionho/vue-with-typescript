<template>
  <Modal v-model="LocationModel" :width="600" title="运输设置" @on-cancel="CancelModal">
    <Form :model="LocationForm" ref="LocationForm" :rules="LocationRules" :label-width="80" onsubmit="return false;">
      <FormItem label="城市：" prop="City">
        <Input placeholder="城市" v-model="LocationForm.City"></Input>
      </FormItem>
      <FormItem label="国家：" prop="Country">
        <Select placeholder="国家" v-model="LocationForm.Country" :options="COUNTRY_DROP" />
        <!-- <Select placeholder="国家" v-model="LocationForm.Country" filterable clearable>
          <Option v-for="(item,index) in COUNTRY_DROP" :value="item.CountryCode" :key="index">{{item.CountryNameCn}}</Option>
        </Select> -->
      </FormItem>
      <FormItem label="邮编：" prop="ZipCode">
        <Input placeholder="邮编" v-model="LocationForm.ZipCode"></Input>
      </FormItem>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="Validate">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import {Component, Vue, Prop, Emit} from 'vue-property-decorator';
import {Getter, Action} from 'vuex-class'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/Sales'

@Component({
  name:'AllegroLocation'
})

export default class AllegroLocation extends Vue{
  @Action private 'Base/UPDATE_BASE_INFO':any
  @Getter private 'Base/COUNTRY_DROP':PInterface.CountryEntity[]

  get COUNTRY_DROP(){
    return this['Base/COUNTRY_DROP'];
  }

  // @Prop(Array) private SelectedData:Interface.StoreList[]

  @Emit() EmitModify(G:boolean):void {}

  private Trigger(D:Interface.StoreList):void {
    if(!this['COUNTRY_DROP'].length){
      this['Base/UPDATE_BASE_INFO']('COUNTRY','');
    }
    this.LocationForm.StoreId = D.Id
    this.GetAllegroLocation();
  }

  private GetAllegroLocation():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server:this.$Server.Sales,
      Api:{
        Address:this.$Api.Sales['17'].StoreLocation,
        Login:true
      },
      Data: this.LocationForm.StoreId,
      Callback:(Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.$set(this,'LocationForm',{
            StoreId:this.LocationForm.StoreId,
            Country:Res.Data.Data.Country,
            City:Res.Data.Data.City,
            ZipCode:Res.Data.Data.ZipCode
          });
          this.$set(this,'LocationModel',true);
        }else{
          this.EmitModify(false)
          this.$Request.Error(Res)
        }
      }
    })
  }

  private Validate():void {
    (this as any).$refs.LocationForm.validate((Valid:boolean)=>{
      if(Valid){
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server:this.$Server.Sales,
          Api:{
            Address:this.$Api.Sales['17'].ChangeStoreLocation,
            Login:true
          },
          Data:this.LocationForm,
          Callback:(Res:PInterface.Res):void => {
            this.$UI.Loading.Hide();
            if(Res.IsSuccess){
              this.$UI.Tips.Floating('success','设置成功')
              this.CancelModal();
            }else{
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private CancelModal():void {
    this.$set(this,'LocationModel',false);
    this.$set(this,'LocationForm',new Interface.AllegroLocation())
    this.$nextTick(()=>{
      (this as any).$refs.LocationForm.resetFields();
      this.EmitModify(false)
    })
  }

  private LocationModel:boolean = false
  private LocationForm:Interface.AllegroLocation = new Interface.AllegroLocation()
  private LocationRules:any = {
    City:[{required:true,message:'请输入城市'}],
    Country:[{required:true,message:"请选择国家",trigger:'change'}],
    ZipCode:[{required:true,message:'请输入邮编'}]
  }
}
</script>
<style lang="less" scoped></style>