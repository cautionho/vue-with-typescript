<template>
	<Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block P-MR-10" v-if="Power" @click="TriggerModal(null)">添加规则</Button>
    <Modal v-model="IsShow" :title="RuleForm.Id === 0 ? '添加规则' : '修改规则'" :mask-closable="false" :width="680" @on-cancel="ChangeModifyRule(false)">
      <Form onsubmit="return false" ref="RuleForm" :model="RuleForm" :rules="Rule" :label-width="100" name="RuleForm">
      <Form-item label="规则名称：" prop="RuleName">
        <Input v-model="RuleForm.RuleName" placeholder="请输入规则名称"></Input>
      </Form-item>
      <Form-item label="平台：" prop="PlatformId">
        <Select v-model="RuleForm.PlatformId" placeholder="请选择平台" :onChange="OnClearSelect.bind(this, 'PlatformId')" :options="PlatformList" />
        <!-- <Select v-model="RuleForm.PlatformId" placeholder="请选择平台" @on-change="OnClearSelect('PlatformId')" filterable clearable>
          <Option v-for="(Item, Index) in PlatformList" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="店铺：" prop="StoreId">
        <Select v-model="RuleForm.StoreId" placeholder="请选择店铺" :onChange="OnClearSelect.bind(this, 'StoreId')" ref="Store" :options="DropStoreList" />
        <!-- <Select v-model="RuleForm.StoreId" placeholder="请选择店铺" @on-change="OnClearSelect('StoreId')" filterable clearable ref="Store">
          <Option v-for="Item in DropStoreList" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="国家：" prop="Country">
        <Select v-model="RuleForm.Country" placeholder="请选择国家" :onChange="OnClearSelect.bind(this, 'Country')" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" />
        <!-- <Select v-model="RuleForm.Country" placeholder="请选择国家" @on-change="OnClearSelect('Country')" filterable clearable>
          <Option v-for="Item in CountryData" :value="Item.CountryCode" :key="Item.CountryNameCn">{{Item.CountryNameCn}}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="发货仓：" prop="WarehouseId">
        <Select v-model="RuleForm.WarehouseId" placeholder="请选择发货仓" :disabled="true" :options="WarehouseList" />
        <!-- <Select v-model="RuleForm.WarehouseId" placeholder="请选择发货仓" filterable clearable :disabled="true">
          <Option v-for="Item in WarehouseList" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="物流渠道：" prop="ShippingMethodId">
        <Select v-model="RuleForm.ShippingMethodId" placeholder="请选择物流渠道" ref="shipMethod" multiple :options="ShipMethodList" optionValKey="Id" optionKey="Name" />
        <!-- <Select v-model="RuleForm.ShippingMethodId" placeholder="请选择物流渠道" filterable clearable ref="shipMethod" multiple>
          <Option v-for="Item in ShipMethodList" :value="Item.Id" :key="Item.Name">{{Item.Name}}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="订单类型：" prop="ItemType">
        <Select v-model="RuleForm.ItemType" placeholder="请选择订单类型" :options="ItemTypeList" />
        <!-- <Select v-model="RuleForm.ItemType" placeholder="请选择订单类型" filterable clearable>
          <Option v-for="(Item, Index) in ItemTypeList" :value="$Enums.Warehouse.ItemType[Item]" :key="Index">{{ Item }}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="库区：" prop="Area">
        <Select v-model="RuleForm.Area" multiple placeholder="请选择库区（可多选）" :options="LocationList" />
        <!-- <Select v-model="RuleForm.Area" multiple placeholder="请选择库区（可多选）" filterable label-in-value clearable>
          <Option v-for="(Item,Index) in LocationList" :value="(Index+1)" :key="Index">{{ (Index+1) }}</Option>
        </Select> -->
      </Form-item>
      <Form-Item label="时间段：">
        <Select class="P-W-200" v-model="RuleForm.TimeType" placeholder="请选择时间类型" :onChange="OnClearSelect.bind(this, 'TimeType')" :options="TimeTypeList" />
        <!-- <Select v-model="RuleForm.TimeType" placeholder="请选择时间类型" @on-change="OnClearSelect('TimeType')" filterable clearable style="width: 160px">
          <Option v-for="(Item,Index) in TimeTypeList" :value="$Enums.Warehouse.TimeType[Item]" :key="Index">{{Item}}</Option>
        </Select> -->
        <FormItem  class="P-Inline-Block" prop="StartTime" style="width:160px;">
          <Date-picker type="datetime" v-model="RuleForm.StartTime" @on-change="PickStartTime" placeholder="选择开始时间" placement="top" transfer></Date-picker>
        </FormItem>
          -
        <FormItem class="P-Inline-Block" prop="EndTime" style="width:160px">
          <Date-picker type="datetime" v-model="RuleForm.EndTime" @on-change="PickEndTime" placeholder="选择结束时间" placement="top" transfer></Date-picker>
        </FormItem>
      </Form-item>
      <Form-item label="生成规则：" prop="Quantity">
        每 <Input v-model="RuleForm.Quantity" style="width:40%" placeholder="请输入订单个数"></Input> 个订单自动生成一个批次
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="CheckData">{{RuleForm.Id === 0 ? '添加':'修改'}}</Button>
      <Button style="margin-left: 8px" @click="ChangeModifyRule(false)">取消</Button>
    </div>
    </Modal>
  </Row> 
</template>
<script lang="ts">
import { Component, Vue, Watch, Emit, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
@Component({
  name: 'ModifyPickBatchRule'
})
export default class ModifyPickBatchRule extends Vue {
  @Prop() Power: boolean

  @Emit() ChangeModifyRule(Val: boolean){
    this.IsShow = false;
    (this.$refs.RuleForm as any).resetFields();
  }

  @Watch('RuleForm.PlatformId')
  private ChangePlatForm(Val: number | ''):void{
    this.RuleForm.StoreId = '';
    if (this.DropStoreList.length != 0) {
      (this.$refs.Store as any).clearSingleSelect();
    }
    this.DropStoreList = [];
    if (Val != '') {
      this.GetStoreDropList(Val);
    }
  }

  private GetLocations(): PInterface.KV[] {
    let Locations: PInterface.KV[] =  []
    for(let I=1; I <= 15; I++){ Locations.push({Key: I, Value: I}) }
    return Locations;
  }

  private TriggerModal(Select: Interface.ModifyRuleDetail | null): void{
    if(this.ShipMethodList.length < 1){
      this.GetShipMethodDrop();
    }
    if(this.WarehouseList.length < 1){
      this.GetWarehouseDropList();
    }
    if(this.CountryData.length < 1){
      this.GetCountryDropList();
    }

    if(Select === null){
      this.RuleForm = new Interface.ModifyRuleDetail()
      this.$set(this.RuleForm, 'WarehouseId', 50)
      
    }else{
      this.$set(this.RuleForm, 'PlatformId', Select.PlatformId == 0 ? '' : Select.PlatformId)
      setTimeout(()=>{
        this.RuleForm.Country = Select['Country'];
        this.RuleForm.EndTime = Select['EndTime'];
        this.RuleForm.Id = Select['Id'];
        this.RuleForm.ItemType = Select['ItemType'];
        this.RuleForm.Quantity = Select['Quantity'];
        this.RuleForm.RuleName = Select['RuleName'];
        this.RuleForm.StartTime = Select['StartTime'];
        this.RuleForm.StoreId = Select['StoreId'];
        this.RuleForm.WarehouseId = Select['WarehouseId'];

        this.RuleForm.TimeType = Select['TimeType'] == 0 ? '' : Select['TimeType']
        this.RuleForm.Area = ((Select['Area'] as string).split(',') as string[]).map( Itm => parseInt(Itm) )
        this.RuleForm.ShippingMethodId = ((Select['ShippingMethodId'] as string).split(',') as string[]).map( Itm => parseInt(Itm) )

        if (this.RuleForm.StartTime == '1900-01-01T00:00:00'){
          this.RuleForm.StartTime = "";
          this.RuleForm.EndTime = "";
        }
        
      }, 100)
    }

    this.IsShow = true;
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).RuleForm[S] == undefined ){
      this.$set(this.RuleForm, S, '');
    }
  }

  private PickStartTime(val: string): void {
    this.RuleForm.StartTime = val;
  }

  private PickEndTime(val: string): void {
    this.RuleForm.EndTime = val;
  }

  // 获取平台下的所有店铺
  private GetStoreDropList(Val:number | ''):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales[Val].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.DropStoreList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取物流渠道
  private GetShipMethodDrop(): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelDropList
      },
      Data: 50,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.ShipMethodList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetWarehouseDropList(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.GetWarehouseDropList
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.WarehouseList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetCountryDropList(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.CountryList
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.CountryData = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CheckData(): void {
    (this.$refs['RuleForm'] as any).validate((Valid: boolean) => {
      if (Valid) {
        if (this.RuleForm.TimeType !== "") {
          if (this.RuleForm.StartTime == "" && this.RuleForm.EndTime == "") {
            this.$UI.Tips.Floating('warning', '请选择开始时间和结束时间');
            return;
          }
          if (this.RuleForm.StartTime == "") {
            this.$UI.Tips.Floating('warning', '请选择开始时间');
            return;
          }
          if (this.RuleForm.EndTime == "") {
            this.$UI.Tips.Floating('warning', '请选择结束时间');
            return;
          }
        } else if (this.RuleForm.StartTime !== "" || this.RuleForm.EndTime !== "") {
          this.$UI.Tips.Floating('warning', '请选择时间类型');
          return;
        }
        let Begin = Date.parse(this.RuleForm.StartTime);
        let End = Date.parse(this.RuleForm.EndTime);
        if (Begin > End) {
          this.$UI.Tips.Floating('warning', '开始时间不能晚于结束时间');
          return;
        }
        this.PostRule()
      }
    })
  }

  private PostRule(): void {
    this.$UI.Loading.Show();
    let Obj = JSON.parse(JSON.stringify(this.RuleForm));
    Obj.ShippingMethodId = Obj.ShippingMethodId.join(',');
    Obj.Area = Obj.Area.join(',');
    Obj.StartTime = Obj.StartTime == "" ? "" : this.$UI.Render.NewDate(Obj.StartTime, false);
    Obj.EndTime = Obj.EndTime == "" ? "" : this.$UI.Render.NewDate(Obj.EndTime, false);
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: (this.RuleForm.Id !== 0) ? this.$Api.BatchOrderRuleModify : this.$Api.BatchOrderRuleAdd,
        Login: true
      },
      Data: Obj,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating("success", this.RuleForm.Id !== 0 ? "编辑规则成功" : "添加规则成功");
          this.ChangeModifyRule(true);
        } else {
          this.$Request.Error(Res);
          this.$UI.Loading.Hide();
        }
      }
    })
  }

  private IsShow: boolean = false;
  private WarehouseList:PInterface.KV[] = []; //仓库下拉
  private CountryData:PInterface.CountryEntity[] = []; //国家下拉
  private RuleForm: Interface.ModifyRuleDetail = new Interface.ModifyRuleDetail();
  // 订单类型下拉列表
  private ItemTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ItemType);
  //库区下拉列表
  private LocationList: PInterface.KV[] = this.GetLocations()  //库区编号
  private PlatformList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private ShipMethodList:PInterface.IdName[] = []; // 物流渠道下拉列表
  private DropStoreList: PInterface.KV[] = [];
  private TimeTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.TimeType);
  private Rule: any = {
    WarehouseId: [{ required: true, message: '请选择发货仓', trigger: 'change', type: 'number' }],
    ShippingMethodId: [{ required: true, message: '请选择物流渠道', trigger: 'change', type: 'array' }],
    ItemType: [{ required: true, pattern: this.$Pattern.PositiveNotZero, message: '请选择订单类型', trigger: 'change', type: 'number' }],
    RuleName: [{ required: true, message: '请输入规则名称', type: 'string' }],
    Quantity: [{ required: true, pattern: /^[1-9]+[0-9]*]*$/, message: '生成规则格式不正确' }]
  }
}

</script>
<style lang="less"></style>
