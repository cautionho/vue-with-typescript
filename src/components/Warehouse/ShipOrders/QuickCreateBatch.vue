<template>
  <Col>
    <Button type="primary" @click="Trigger">批量生成拣货批次</Button>
    <Modal v-model="CreateBatchModal" title="批量生成拣货批次" :width="800" @on-cancel="CancelModal">
      <Form :model="CreateBatchInfo" ref="CreateBatchInfo" :rules="CreateBatchRules" :label-width="100" onsubmit="return false;">
        <FormItem label="平台：" prop="PlatformId">
          <Select placeholder="平台" v-model="CreateBatchInfo.PlatformId" :options="PlatformDrop" :onChange="ChangePlatform" />
          <!-- <Select placeholder="平台" v-model="CreateBatchInfo.PlatformId" clearable filterable @on-change="ChangePlatform"> 
            <Option v-for="(Item,Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="店铺：" prop="StoreId">
          <Select placeholder="店铺" v-model="CreateBatchInfo.StoreId" :options="StoreDrop" ref="StoreDrop" /> 
          <!-- <Select placeholder="店铺" v-model="CreateBatchInfo.StoreId" clearable filterable ref="StoreDrop"> 
            <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="国家：" prop="CountryCode">
          <Select placeholder="国家" v-model="CreateBatchInfo.CountryCode" :options="COUNTRY_DROP" optionValKey="CountryCode" optionKey="CountryNameCn" />
          <!-- <Select placeholder="国家" v-model="CreateBatchInfo.CountryCode" clearable filterable > 
            <Option v-for="(Item,Index) in COUNTRY_DROP" :value="Item.CountryCode" :key="Index">{{Item.CountryNameCn}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="发货仓：" prop="ShipWarehouseId">
          <Select placeholder="发货仓" v-model="CreateBatchInfo.ShipWarehouseId" :options="WarehouseDrop" :onChange="ChangeWarehouse" /> 
          <!-- <Select placeholder="发货仓" v-model="CreateBatchInfo.ShipWarehouseId" clearable filterable @on-change="ChangeWarehouse"> 
            <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="物流渠道：" prop="ShipMethodId">
          <Select placeholder="物流渠道" v-model="CreateBatchInfo.ShipMethodId" :options="MethodDrop" optionValKey="Id" optionKey="Name" multiple ref="MethodDrop" /> 
          <!-- <Select placeholder="物流渠道" v-model="CreateBatchInfo.ShipMethodId" clearable filterable multiple ref="MethodDrop"> 
           <Option v-for="(Item,Index) in MethodDrop" :value="Item.Id" :key="Index">{{Item.Name}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="订单类型：" prop="ItemType">
          <Select placeholder="订单类型" v-model="CreateBatchInfo.ItemType" :options="ItemTypeDrop" /> 
          <!-- <Select placeholder="订单类型" v-model="CreateBatchInfo.ItemType" clearable filterable > 
            <Option v-for="(Item,Index) in ItemTypeDrop" :value="$Enums.Warehouse.ItemType[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="库区：" prop="StorageFarm">
          <Select placeholder="库区" v-model="CreateBatchInfo.StorageFarm" :options="LocationDrop" multiple /> 
          <!-- <Select placeholder="库区" v-model="CreateBatchInfo.StorageFarm" clearable filterable multiple> 
           <Option v-for="(Item,Index) in LocationDrop" :value="Index" :key="Index">{{Index}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="时间段：" prop="TimeType">
          <Select placeholder="时间段" v-model="CreateBatchInfo.TimeType" :options="TimeTypeDrop" /> 
          <!-- <Select placeholder="时间段" v-model="CreateBatchInfo.TimeType" clearable filterable> 
            <Option v-for="(Item,Index) in TimeTypeDrop" :value="$Enums.Warehouse.TimeType[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="" class="P-Inline-Block P-W-49-Percent P-MR-0" prop="BeginTime">
          <DatePicker type="datetime" placeholder="开始时间" v-model="CreateBatchInfo.BeginTime" class="P-W-100-Percent"></DatePicker>
        </FormItem>
        <FormItem label="" class="P-Inline-Block P-W-49-Percent P-MR-0" prop="EndTime">
          <DatePicker type="datetime" placeholder="结束时间" v-model="CreateBatchInfo.EndTime" class="P-W-100-Percent"></DatePicker>
        </FormItem>
        <FormItem label="生成规则：" prop="OrderCount">
         <Input placeholder="生成规则" v-model="CreateBatchInfo.OrderCount"></Input>
        </FormItem>
      </Form>
       <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { Getter } from "vuex-class";
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/ShipOrder'

@Component({
  name: "QuickCreateBatch"
})
export default class QuickCreateBatch extends Vue {
  @Emit() EmitOperateSuccess():void {}

  @Getter private 'Base/COUNTRY_DROP': PInterface.CountryEntity[]
  get COUNTRY_DROP(){
    return this['Base/COUNTRY_DROP']
  }

  private GetLocations(): PInterface.KV[] {
    let Locations: PInterface.KV[] =  []
    for(let I=1; I <= 15; I++){ Locations.push({Key: I, Value: I}) }
    return Locations;
  }


  private GetDropLists<T,S>(Server:string,Api:string,D:T): Promise<S> {
    return new Promise(( resolve: (Val: S) => void ) => {
      this.$Request.Post({
        Server: Server,
        Api: {
          Address: Api
        },
        Data: D,
        Callback: (Res: PInterface.Res):void => {
          if(Res.IsSuccess){
            resolve(Res.Data.DropList);
          }else{
            this.$Request.Error(Res);
          }
        }
      })
    })
  }

  private GetWarehouseDrop():void {
    this.GetDropLists<boolean,PInterface.KV[]>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true).then((Res: PInterface.KV[]) => {
      this.WarehouseDrop.push(...Res)
    })
  }

  private Trigger():void{
    this.$set(this,'CreateBatchModal',true)
    if(!this.WarehouseDrop.length){
      this.GetWarehouseDrop()
    }
  }

  private ChangePlatform(Val:number):void {
    if(Val){
      this.GetDropLists<string,PInterface.KV[]>(this.$Server.Sales, this.$Api.Sales[String(Val)].StoreDrop, '').then((Res: PInterface.KV[]) => {
        this.StoreDrop.push(...Res)
      })
    }else{
      this.$set(this, 'StoreDrop', []);
      this.CreateBatchInfo.StoreId = 0;
      // (this as any).$refs.StoreId.clearSingleSelect();
    }
  }

  private ChangeWarehouse(Val:number):void {
    if(Val){
      this.GetDropLists<number,PInterface.IdName[]>(this.$Server.Logistics, this.$Api.ChannelDropList, Val).then((Res: PInterface.IdName[]) => {
        this.MethodDrop.push(...Res)
      })
    }else{
      this.$set(this, 'MethodDrop', []);
      this.CreateBatchInfo.ShipMethodId = [];
    }
  }

  private Validate():void {
    (this as any).$refs.CreateBatchInfo.validate((Valid:boolean):void => {
      if(Valid){
        if(this.ValidateRules()){
          this.$UI.Loading.Show();
          let PostData = JSON.parse(JSON.stringify(this.CreateBatchInfo))
          PostData.BeginTime = this.$UI.Render.NewDate(PostData.BeginTime)
          PostData.EndTime = this.$UI.Render.NewDate(PostData.EndTime)
          PostData.StorageFarm = PostData.StorageFarm.join(',')
          this.$Request.Post({
            Server: this.$Server.Warehouse,
            Api: {
              Address: this.$Api.QuickCreateBatchOrder,
              Login: true
            },
            Data: PostData,
            Callback: (Res: PInterface.Res):void => {
              this.$UI.Loading.Hide();
              if(Res.IsSuccess){
                setTimeout(()=>{
                  this.$UI.Tips.Modal({
                    Type: 'success',
                    Content: `批量生成拣货批次成功，共生成${Res.Data.Count}个批次`,
                    Callback: (B:boolean):void => {
                      this.EmitOperateSuccess();
                    }
                  })
                },500)
              }else{
                this.$Request.Error(Res);
              }
            }
          })
        }
      }
    })
  }

  private ValidateRules():boolean {
    let Flag1 = (this.CreateBatchInfo.BeginTime && !this.CreateBatchInfo.EndTime) || (!this.CreateBatchInfo.BeginTime && this.CreateBatchInfo.EndTime),
    Flag2 = !this.CreateBatchInfo.TimeType && (this.CreateBatchInfo.BeginTime && this.CreateBatchInfo.EndTime)
    if(Flag1 || Flag2){
      this.$UI.Tips.Floating('请选择时间区间');
      return false
    }
    if(+new Date(this.CreateBatchInfo.BeginTime) > +new Date(this.CreateBatchInfo.EndTime)){
      this.$UI.Tips.Floating('开始时间不能晚于结束时间');
      return false
    }
    if(this.CreateBatchInfo.OrderCount > 500 && this.CreateBatchInfo.ItemType <= 3){
      this.$UI.Tips.Floating('warning','明细类型为单品的发货订单单次生成拣货批次不可超过500条')
      return false
    }
    if(this.CreateBatchInfo.OrderCount > 100 && this.CreateBatchInfo.ItemType > 3){
      this.$UI.Tips.Floating('warning','明细类型为多品的发货订单单次生成拣货批次不可超过100条')
      return false
    }
    let Labels:number[] = []
    for(let Item of this.CreateBatchInfo.ShipMethodId){
      if([9,27,80,81,85,86,99,101,105,107,113,118,119,120,148,150,151,154,156,157,158,161,162,170,171,172,173,174,184].some(M => M === Item)){
        Labels.push(15) // 面单大小150mm
      }else if([28,108,138,147,176,177].some(M => M === Item)){
        Labels.push(20) // 面单大小200mm
      }else{
        Labels.push(10) // 面单大小100mm
      }
    }
    let L = new Set(Labels)
    if(L.size > 1){
      this.$UI.Tips.Floating('warning','请选择面单大小一致的发货订单进行操作')
      return false
    }
    return true
  }

  private CancelModal():void {
    this.$set(this,'CreateBatchModal',false)
    this.$nextTick(()=>{
      (this.$refs.CreateBatchInfo as any).resetFields();
    })
  }

  private CreateBatchModal:boolean = false
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform)
  private StoreDrop: PInterface.KV[] = []
  private ItemTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ItemType)
  private WarehouseDrop: PInterface.KV[] = []
  private MethodDrop: PInterface.IdName[] = []
  private LocationDrop: PInterface.KV[] = this.GetLocations()
  private TimeTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TimeType)

  private CreateBatchInfo:Interface.CreateBatchInfo = new Interface.CreateBatchInfo()
  private CreateBatchRules:any = {
    ShipWarehouseId: [{required: true, message: '请选择发货仓', trigger: 'change', type: 'number'}],
    ShipMethodId: [{required: true, message: '请选择物流渠道', trigger: 'change', type: 'array'}],
    ItemType: [{required: true, message: '请选择订单类型', trigger: 'change', type: 'number'}],
    OrderCount: [{required: true, message: '请输入生成规则'},{pattern: /^[1-9][\d]*$/, message: '请输入正确的生成规则'}]
  }
}
</script>