<!--  导出库存 -->
<template>
	<Row class="P-Inline-Block">
    <Button type="primary" class="P-Inline-Block P-MR-10" @click="TriggerModal">导出库存</Button>
    <Modal v-model="ExportInventoryModal" title="导出库存" :mask-closable="false" :width="650" @on-cancel="CancelModal">
      <Form  :label-width="95" :model="ExportInventoryMsg" ref="ExportInventoryMsg" name="ExportInventoryMsg" :rules="ExportInventoryRules" onsubmit="return false">
        <Form-item label="仓库：" prop="WareHouseId">
          <Select v-model="ExportInventoryMsg.WareHouseId" placeholder="请选择仓库" :options="WarehouseDropList" />
          <!-- <Select v-model="ExportInventoryMsg.WareHouseId" clearable filterable transfer placeholder="请选择仓库">
            <Option v-for="Item in WarehouseDropList" :key="Item.Key" :value="Item.Value">{{Item.Key}}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="特性标签：" prop="AttributeIds">
          <Select v-model="ExportInventoryMsg.AttributeIds" multiple placeholder="请选择特性标签" :options="AttributeList" />
          <!-- <Select v-model="ExportInventoryMsg.AttributeIds" clearable filterable transfer multiple placeholder="请选择特性标签">
            <Option v-for="Item in AttributeList" :key="Item.Key" :value="Item.Value">{{Item.Key}}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="SKU状态：" prop="SkuStatus">
          <Select v-model="ExportInventoryMsg.SkuStatus" multiple placeholder="请选择SKU状态" :options="SkuStatusList" />
          <!-- <Select v-model="ExportInventoryMsg.SkuStatus" clearable filterable transfer multiple placeholder="请选择SKU状态">
            <Option v-for="(Item,Index) in SkuStatusList" :value="$Enums.Warehouse.SkuStatus[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="库存类型：" prop="InventoryType">
          <Select class="P-W-200" v-model="ExportInventoryMsg.InventoryType" placeholder="请选择库存类型" :options="InventoryTypeList" />
          <!-- <Select v-model="ExportInventoryMsg.InventoryType" clearable filterable transfer placeholder="请选择库存类型" style="width: 238px">
            <Option v-for="(Item,Index) in InventoryTypeList" :value="$Enums.Public.Inventory[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
          <Form-item class="P-Inline-Block" style="width: 135px;" prop="StartQuantity">
            <Input v-model="ExportInventoryMsg.StartQuantity" placeholder="开始范围" ref="StartQuantity" :disabled="IsDisabled"></Input>
          </Form-item>
          -
          <Form-item class="P-Inline-Block" style="width: 134px;" prop="EndQuantity">
            <Input v-model="ExportInventoryMsg.EndQuantity" placeholder="结束范围" ref="EndQuantity" :disabled="IsDisabled"></Input>
          </Form-item>
        </Form-item>
        <Form-item label="采购员：" prop="PurchaserIds">
          <Select v-model="ExportInventoryMsg.PurchaserIds" multiple placeholder="请选择采购员" :options="PurchaserList" />
          <!-- <Select v-model="ExportInventoryMsg.PurchaserIds" clearable filterable transfer multiple placeholder="请选择采购员">
            <Option v-for="Item in PurchaserList" :key="Item.Key" :value="Item.Value">{{Item.Key}}</Option>
          </Select> -->
        </Form-item>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="CheckExportMsg">创建导出库存任务</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Watch, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";

@Component({
  name: 'ExportInventory'
})
export default class ExportInventory extends Vue {
  @Prop() WarehouseDropList:PInterface.KV[]

  @Watch('ExportInventoryMsg.InventoryType')
  private ChangeType(Val: number | string){
    if(Val){
      this.IsDisabled = false;
    }else{
      this.IsDisabled = true;
      this.ExportInventoryMsg.StartQuantity = '';
      this.ExportInventoryMsg.EndQuantity = '';
    }
  }
  
  private CancelModal(): void{
    this.ExportInventoryModal = false;
    (this.$refs["ExportInventoryMsg"] as any).resetFields();
  }

  private TriggerModal(): void{
    this.ExportInventoryMsg.SkuStatus = [1,2,3,6],
    this.ExportInventoryModal = true;
    if(this.PurchaserList.length < 1){
      this.GetPurchaser()
    }
    if(this.AttributeList.length < 1){
      this.GetInventoryType()
    }
  }

  //获取特性标签
  private GetInventoryType(): void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.AttributeDropList,
				Login: true
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.AttributeList = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  //获取采购员
  private GetPurchaser(): void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetUserDropList,
				Login: true
			},
			Data: '采购员',
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.PurchaserList = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private CheckExportMsg(): void{
    (this.$refs["ExportInventoryMsg"] as any).validate((Valid: boolean) => {
      if (Valid) {
        let Re = /^[0-9]+$/;
        if( this.ExportInventoryMsg.StartQuantity!='' || this.ExportInventoryMsg.EndQuantity!='' ){
          if( this.ExportInventoryMsg.StartQuantity!='' && this.ExportInventoryMsg.EndQuantity!='' ){
            if( !Re.test(this.ExportInventoryMsg.StartQuantity.toString()) ){
              this.$UI.Tips.Floating('warning', '请输入大于或等于0的正整数');
              (this.$refs.StartQuantity as any).select();
              (this.$refs.StartQuantity as any).focus();
              return;
            }
            if( !Re.test(this.ExportInventoryMsg.EndQuantity.toString()) ){
              this.$UI.Tips.Floating('warning', '请输入大于或等于0的正整数');
              (this.$refs.EndQuantity as any).select();
              (this.$refs.EndQuantity as any).focus();
              return;
            }
            if( Number(this.ExportInventoryMsg.StartQuantity)<0 ){
              this.$UI.Tips.Floating('warning', '请输入大于或等于0的库存开始范围');
              (this.$refs.StartQuantity as any).select();
              (this.$refs.StartQuantity as any).focus();
              return;
            }
            if( Number(this.ExportInventoryMsg.EndQuantity)<0 ){
              this.$UI.Tips.Floating('warning', '请输入大于或等于0的库存结束范围');
              (this.$refs.EndQuantity as any).select();
              (this.$refs.EndQuantity as any).focus();
              return;
            }
            if( Number(this.ExportInventoryMsg.StartQuantity)>Number(this.ExportInventoryMsg.EndQuantity) ){
              this.$UI.Tips.Floating('warning', '库存开始范围不能大于结束范围');
              return;
            }
          }else{
            this.$UI.Tips.Floating('warning', '请输入库存范围区间');
            return;
          }
        }
        let ExportMsg = JSON.parse(JSON.stringify(this.ExportInventoryMsg));
        ExportMsg.StartQuantity = Number(ExportMsg.StartQuantity);
        ExportMsg.EndQuantity = Number(ExportMsg.EndQuantity);
        ExportMsg.InventoryType = Number(ExportMsg.InventoryType);
        this.ExportInventory(ExportMsg)
      }
    })
  }

  private ExportInventory(ExportMsg: Interface.ExportInventory) {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.InventoryExport,
				Login: true
			},
			Data: ExportMsg,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.CancelModal();
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出库存任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
            Callback: (B:boolean):void =>{}
          })
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  private IsDisabled: boolean = true;
  private ExportInventoryModal:boolean = false;
  private SkuStatusList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus);  //SKU状态下拉
  private InventoryTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Inventory);  //库存类型下拉
  private AttributeList: PInterface.KV[] = [];  //特性标签下拉
  private PurchaserList: PInterface.KV[] = []; //采购员下拉
  private ExportInventoryMsg: Interface.ExportInventory = new Interface.ExportInventory(); //表单数据
  private ExportInventoryRules: any = {
    WareHouseId: [{ required: true, message: '请选择仓库', trigger: 'change', type: 'number' }]
  }
}

</script>
<style lang="less"></style>
