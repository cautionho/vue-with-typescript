<!-- 盘点 -->
<template>
  <Row class="P-Inline-Block">
  <Button type="primary" class="P-Inline-Block P-MR-10"  @click="TriggerModal(undefined)">盘点</Button>
  <Modal title="盘点" v-model="InventoryModal" :mask-closable="false" @on-cancel="InventoryRes(false)" :width="700">
    <Form :model="InventoryForm" ref="InventoryForm" :rules="InventoryRules" :label-width="85" inline onsubmit="return false">
      <Form-item label="仓库：" prop="WarehouseId" class="P-W-100-Percent">
        <Select v-model="InventoryForm.WarehouseId" placeholder="请选择仓库" :options="WarehouseList" v-if="!IsDisabled" />
        <span v-else>{{InventoryForm.WarehouseId ? WarehouseList.filter(Item => Item.Value === InventoryForm.WarehouseId)[0].Key : ''}}</span>
        <!-- <Select v-model="InventoryForm.WarehouseId" clearable filterable placeholder="请选择仓库" :disabled="IsDisabled">
          <Option v-for="(Item, Index) in WarehouseList" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
        </Select> -->
      </Form-item>
      <Form-item label="SKU编号：" prop="SkuCode" class="P-W-100-Percent">
        <Input v-model.trim="InventoryForm.SkuCode" placeholder="请输入/扫描SKU编号" ref="SkuCode" @on-enter="CheckGetSkuInventory" v-if="!IsDisabled"></Input>
        <span v-else>{{InventoryForm.SkuCode}}</span>
      </Form-item>
      <Form-item label="产品名：" prop="SkuName" class="P-W-100-Percent">
        <span>{{InventoryForm.SkuName}}</span>
      </Form-item>
      <Form-item label="货架号：" prop="LocationCode" class="P-W-100-Percent">
        <span>{{InventoryForm.LocationCode}}</span>
      </Form-item>
      <Form-item label="待发数：" prop="WaitingShipedQuantity" class="P-W-49-Percent">
        <span>{{InventoryForm.WaitingShipedQuantity}}</span>
      </Form-item>
      <Form-item label="待拣数：" prop="WaitPickQuantity" class="P-W-49-Percent">
        <span>{{InventoryForm.WaitPickQuantity}}</span>
      </Form-item>
      <Form-item label="可用数：" prop="Quantity" class="P-W-49-Percent">
        <span>{{InventoryForm.Quantity}}</span>
      </Form-item>
      <Form-item label="原架上数：" prop="OriQuantity" class="P-W-49-Percent">
        <p>{{InventoryForm.OriQuantity}}</p>
      </Form-item>
      <Form-item label="现架上数：" prop="NowQuantity" class="P-W-100-Percent">
        <Input :readonly="InventoryForm.Id == ''" v-model="InventoryForm.NowQuantity" placeholder="请输入当前SKU现架上数" ref="NowQuantity" @on-enter="CheckInventoryMsg"></Input>
      </Form-item>
      <Form-item label="">
        <p class="P-Text-Info">原架上数 = 可用数 + 待拣数</p>
      </Form-item>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="CheckInventoryMsg">盘点</Button>
      <Button @click="InventoryRes(false)">取消</Button>
    </footer>
  </Modal>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";

@Component({
  name: 'InventorySku'
})
export default class InventorySku extends Vue {
  @Prop() WarehouseList: PInterface.KV[]
  @Emit() ChangeModal(Val: boolean){}

  @Watch('InventoryForm.WarehouseId')
  private WatchGetSku(Val: number|string){
    if(Val){
      if (this.InventoryForm.SkuCode != "") {
        this.CheckGetSkuInventory()
      } else {
        this.FocusSkuCode(false)
      }
    }
  }

  private InventoryRes(Res: boolean):void {
    if (this.IsInventory || Res) { this.ChangeModal(true) };
    this.InventoryModal = false;
    this.IsInventory = false;
    (this.$refs['InventoryForm'] as any).resetFields();
    this.$nextTick( ()=> { this.InventoryForm.Id = "" });
  }

  private TriggerModal(RowData?: Interface.ChecktDemandList){
    this.InventoryModal = true
    if(RowData !== undefined){
      this.$set(this.InventoryForm, 'WarehouseId', RowData.WarehouseId);
      this.$set(this.InventoryForm, 'SkuCode', RowData.SkuCode);
      this.$set(this, 'IsDisabled', true);
      this.GetSkuInventory()
    }else{
      this.FocusSkuCode(true)
    }
  }

  // 聚焦SKU输入框
  private FocusSkuCode(IsClear: boolean): void {
    if (IsClear) {
      this.InventoryForm.SkuCode = ""
    }
    this.$nextTick( ()=> {
      (this.$refs['SkuCode'] as any).focus()
    })
  }
  private FocusQuantity(IsClear: boolean) {
    if (IsClear) {
      this.InventoryForm.NowQuantity = ""
    }
    this.$nextTick( ()=> {
      (this.$refs['NowQuantity'] as any).focus()
    })
  }

  // 获取当前SKU库存
  private CheckGetSkuInventory():void {
    (this.$refs['InventoryForm'] as any).validateField("WarehouseId", (err: any) => {
      if (err == "") {
        (this.$refs['InventoryForm'] as any).validateField("SkuCode", (err: any) => {
          if (err == "") {
            this.GetSkuInventory()
          } else {
            return
          }
        })
      } else {
        return
      }
    })
  }

  //获取sku信息
  private GetSkuInventory(): void {
    this.$UI.Loading.Show();
    this.IsSplit++;
    let PostData: Interface.SkuInventory = new Interface.SkuInventory();
    PostData["SkuCode"] = this.InventoryForm.SkuCode;
    PostData["WarehouseId"] = this.InventoryForm.WarehouseId as number;
    PostData["SkuId"] = 0;

    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.InventoryGetSkuInventory,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.RenderSkuInventory(Res.Data.Data)
        } else {
          if (this.IsSplit % 2 == 1 && this.InventoryForm.SkuCode.indexOf('-') != -1) {
            this.InventoryForm.SkuCode = this.InventoryForm.SkuCode.slice(0, this.InventoryForm.SkuCode.lastIndexOf('-'))
            this.GetSkuInventory()
          } else {
            this.$UI.Loading.Hide();
            this.IsSplit = 0
            this.FocusSkuCode(true)
            this.$Request.Error(Res);
          }
        }
        this.$UI.Loading.Hide();
      }
    })
  }
  private RenderSkuInventory(Info: Interface.InventoryForm):void {
    this.InventoryForm.Id = Info.Id
    this.InventoryForm.SkuName = Info.SkuName
    this.InventoryForm.LocationCode = Info.LocationCode
    this.InventoryForm.WaitingShipedQuantity = Info.WaitingShipedQuantity
    this.InventoryForm.WaitPickQuantity = Info.WaitPickQuantity
    this.InventoryForm.Quantity = Info.Quantity
    this.InventoryForm.OriQuantity = Info.Quantity + Info.WaitPickQuantity
    this.InventoryForm.NowQuantity = (Info.Quantity + Info.WaitPickQuantity).toString()
    this.IsSplit = 0
    this.FocusQuantity(false)
    this.$UI.Loading.Hide();
  }
  private CheckInventoryMsg() {
    (this.$refs['InventoryForm'] as any).validate((Valid: boolean) => {
      if (Valid) {
        this.PostInventory()
      }
    })
  }
  private PostInventory():void {
    this.$UI.Loading.Show();
    let PostData: Interface.PostCheckOut = new Interface.PostCheckOut()
    PostData.InventoryId = this.InventoryForm.Id as number
    PostData.Quantity = parseInt(this.InventoryForm.NowQuantity)
    
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.PDACheckOut,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          if (this.IsDisabled) {
            this.InventoryRes(true);
          }else{
            this.RenderSkuInventory(Res.Data.Data)
          }
        } else {
          if (this.IsSplit % 2 == 1 && this.InventoryForm.SkuCode.indexOf('-') != -1) {
            this.InventoryForm.SkuCode = this.InventoryForm.SkuCode.slice(0, this.InventoryForm.SkuCode.lastIndexOf('-'))
            this.GetSkuInventory()
          } else {
            this.$UI.Tips.Floating('success', '盘点成功')
            this.IsInventory = true
            this.FocusSkuCode(true)
            this.$nextTick( ()=> {
              let WarehouseId = JSON.parse(JSON.stringify(this.InventoryForm.WarehouseId));
              (this.$refs['InventoryForm'] as any).resetFields();
              this.InventoryForm = new Interface.InventoryForm();
              this.InventoryForm.WarehouseId = WarehouseId;
            })
          }
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  private IsDisabled: boolean = false;
  private InventoryModal:boolean = false;
  private InventoryForm: Interface.InventoryForm = new Interface.InventoryForm();
  private IsSplit:number = 0;
  private IsInventory:boolean = false; //是否盘点过
  private InventoryRules:any = {
    WarehouseId: [{ required: true, message: '请选择仓库', trigger: 'change', type: 'number' }],
    SkuCode: [{ required: true, message: '请输入/扫描SKU编号' }],
    NowQuantity: [{ required: true, message: '请输入当前SKU现架上数' }, { pattern: /^[\d]{1,}$/, trigger: 'change', message: '请输入正确的数量' }]
  }
}
</script>