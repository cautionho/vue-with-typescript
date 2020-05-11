<template>
  <Col>
    <Button type="primary" @click="Trigger">导出发货单</Button>
    <Modal v-model="ExportModal" title="导出发货单" @on-cancel="CancelModal">
      <Form :model="ExportShiped" ref="ExportShiped" :rules="ExportRules" :label-width="100" onsubmit="return false;" v-if="IsExportShiped">
        <FormItem label="发货时间：" prop="StartTime">
          <DatePicker type="datetime" placeholder="开始时间" v-model="ExportShiped.StartTime" class="P-W-100-Percent"></DatePicker>
        </FormItem>
        <FormItem label="" prop="EndTime">
          <DatePicker type="datetime" placeholder="结束时间" v-model="ExportShiped.EndTime" class="P-W-100-Percent"></DatePicker>
        </FormItem>
        <FormItem label="发货仓：">
          <Select placeholder="发货仓" v-model="ExportShiped.ShipWarehouseId" :options="WarehouseDrop" /> 
          <!-- <Select placeholder="发货仓" v-model="ExportShiped.ShipWarehouseId" clearable filterable > 
            <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="平台：">
          <Select placeholder="平台" v-model="ExportShiped.Platform" :options="PlatformDrop" :onChange="GetStoreDrop" /> 
          <!-- <Select placeholder="平台" v-model="ExportShiped.Platform" clearable filterable @on-change="GetStoreDrop"> 
            <Option v-for="(Item,Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="店铺：">
          <Select placeholder="店铺" v-model="ExportShiped.StoreId" :options="StoreDrop" /> 
          <!-- <Select placeholder="店铺" v-model="ExportShiped.StoreId" clearable filterable > 
            <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Index" ref="StoreDrop">{{Item.Key}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="国家：">
          <Select placeholder="国家" v-model="ExportShiped.Country" :options="COUNTRY_DROP" optionValKey="CountryCode" optionKey="CountryNameCn" /> 
          <!-- <Select placeholder="国家" v-model="ExportShiped.Country" clearable filterable > 
            <Option v-for="(Item,Index) in COUNTRY_DROP" :value="Item.CountryCode" :key="Index">{{Item.CountryNameCn}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="物流渠道：">
          <Select placeholder="物流渠道" v-model="ExportShiped.ShipMethodId" :options="MethodDrop" optionValKey="Id" optionKey="Name" multiple /> 
          <!-- <Select placeholder="物流渠道" v-model="ExportShiped.ShipMethodId" clearable filterable multiple> 
            <Option v-for="(Item,Index) in MethodDrop" :value="Item.Id" :key="Index">{{Item.Name}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="导出明细：" prop="ExportType">
          <Select placeholder="导出明细" v-model="ExportShiped.ExportType" :options="ExportItemTypeDrop" /> 
          <!-- <Select placeholder="导出明细" v-model="ExportShiped.ExportType" clearable filterable > 
            <Option v-for="(Item,Index) in ExportItemTypeDrop" :value="$Enums.Warehouse.ExportItemType[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <Form :model="ExportOrder" ref="ExportOrder" :rules="ExportOrderRules" :label-width="80" onsubmit="return false;" v-else>
        <FormItem label="发货仓：" prop="WarehouseId">
          <Select placeholder="发货仓" v-model="ExportOrder.WarehouseId" :options="WarehouseDrop" /> 
          <!-- <Select placeholder="发货仓" v-model="ExportOrder.WarehouseId" clearable filterable > 
            <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{Item.Key}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Validate">导出</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </col>
</template>
<script lang="ts">
import { Vue, Component, Emit, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";

import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/ShipOrder";

@Component({
  name: "ExportShipOrder"
})
export default class ExportShipOrder extends Vue {
  @Prop(String) private Page:string
  @Emit() EmitOperateSuccess():void {}

  @Getter private 'Base/COUNTRY_DROP': PInterface.CountryEntity[]
  get COUNTRY_DROP(){
    return this['Base/COUNTRY_DROP']
  }

  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (!Res.IsSuccess) this.$Request.Error(Res);
          resolve( Res.Data.DropList || [] )
		  	}
	  	})
    })
  }

  private async GetDrops():Promise<void>{
    this.$set(this,'WarehouseDrop',await this.GetDropList<boolean,PInterface.KV[]>(this.$Server.Settings,this.$Api.GetWarehouseDropList,true));
    if(this.IsExportShiped){
      this.$set(this,'MethodDrop',await this.GetDropList<number,PInterface.IdName[]>(this.$Server.Logistics,this.$Api.ChannelDropList,0));
    }
  }

  private GetStoreDrop(Val:number):void {
    if(!Val){
      this.$set(this,'StoreDrop',[])
      this.ExportShiped.StoreId = 0;
      // (this as any).$refs.StoreDrop.clearSingleSelect();
    }else{
      this.GetDropList<string,PInterface.KV[]>(this.$Server.Sales, this.$Api.Sales[String(Val)].StoreDrop,'').then((Res)=>{
        this.$set(this,'StoreDrop',Res);
      })
    }
  }

  private Trigger():void {
    this.$set(this, "ExportModal", true);
    this.$set(this,'IsExportShiped',this.Page === 'Shiped');
    if(!this.WarehouseDrop.length){
      this.GetDrops();
    }
  }

  private Validate():void {
    if(this.IsExportShiped){
      this.ValidateExportShiped();
    }else{
      this.ValidateExport();
    }
  }

  private ValidateExportShiped():void {
    (this as any).$refs.ExportShiped.validate((Valid:boolean)=>{
      if(Valid){
        let PostData:Interface.ExportShiped = JSON.parse(JSON.stringify(this.ExportShiped));
        const S = +new Date(PostData.StartTime),E = +new Date(PostData.EndTime)
        if(S > E){
          this.$UI.Tips.Floating('warning','开始时间不能晚于结束时间')
          return;
        }
        if(E - S > (86400000*31)){
          this.$UI.Tips.Floating('warning','发货时间区间不能超过31天')
          return;
        }
        PostData.StartTime = this.$UI.Render.NewDate(PostData.StartTime)
        PostData.EndTime = this.$UI.Render.NewDate(PostData.EndTime)
        this.PostExport(PostData)
      }
    })
  }

  private ValidateExport():void {
    (this as any).$refs.ExportOrder.validate((Valid:boolean)=>{
      if(Valid){
        let PostData:Interface.ExportOrder = JSON.parse(JSON.stringify(this.ExportOrder));
        PostData.ExportType = this.Page === 'WaitPick' ? 3 : this.Page === 'Picked' ? 4 : this.Page === 'Packed' ? 5 : 0;
        this.PostExport(PostData)
      }
    })
  }

  private PostExport(PostData:Interface.ExportShiped | Interface.ExportOrder):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.IsExportShiped ? this.$Api.ExportHasConfirmShipOrders : this.$Api.ExportHasOperationShipOrders,
        Login: true
      },
      Data: PostData,
      Callback:(Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.CancelModal();
          setTimeout(()=>{
            this.$UI.Tips.Modal({
              Type:'success',
              Content:'创建导出发货订单任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。',
            })
          },500)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal():void {
    this.$set(this, 'ExportModal', false);
    if(this.IsExportShiped){
      this.$set(this,'ExportShiped',new Interface.ExportShiped());
      (this as any).$refs.ExportShiped.resetFields();
    }else{
      this.$set(this,'ExportOrder',new Interface.ExportOrder());
      (this as any).$refs.ExportOrder.resetFields();
    }
  }

  private ExportModal: boolean = false
  private IsExportShiped: boolean = false
  private PlatformDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform)
  private ExportItemTypeDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.ExportItemType)
  private WarehouseDrop:PInterface.KV[] = []
  private MethodDrop:PInterface.IdName[] = []
  private StoreDrop:PInterface.KV[] = []
  private ExportShiped: Interface.ExportShiped = new Interface.ExportShiped()
  private ExportOrder: Interface.ExportOrder = new Interface.ExportOrder()
  
  private ExportRules:any = {
    StartTime : [{required:true, message:'请选择开始时间'}],
    EndTime : [{required:true, message:'请选择结束时间'}],
    ExportType : [{required:true, message:'请选择导出明细', trigger:'change', type:'number'}]
  }

  private ExportOrderRules:any = {
    WarehouseId : [{required:true, message:'请选择发货仓', trigger:'change', type:'number'}]
  }
}
</script>