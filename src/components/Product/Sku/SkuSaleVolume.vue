
<template>
  <Modal v-model="ShowModal" title="SKU销量" :mask-closable="false" @on-cancel="ClearModal(0)" width="800">
    <Form inline onsubmit="return false">
      <Form-item>
        <Select v-model="CurrentWarehouse" placeholder="仓库" :options="DropWarehouse" />
        <!-- <Select v-model="CurrentWarehouse" placeholder="仓库" filterable clearable>
          <Option v-for="Item in DropWarehouse" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
        </Select> -->
      </Form-item>
      <Button class="P-MB-10 P-MR-10" type="primary" @click="GetList(false)">搜索</Button>
      <Button class="P-MB-10" type="warning" @click="GetList(true)">重置</Button>
    </Form>
    <Table :columns="Cols" :data="List" size="small" stripe />
    <div slot="footer">
      <Button @click="ClearModal()">返回</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  @Component({
    name: 'SkuSaleVolume'
  })
  export default class SkuSaleVolume extends Vue {
    @Emit() HandleResMsg(Type: number): void {} // 回调
    
     // 打开模态框 
    private Trigger(SkuId: number):void {
      this.CurrentSkuId = SkuId;
      if (this.DropWarehouse.length === 0) {
        this.GetWareHouse()
      } else {
        this.GetList(true)
      }
      this.ShowModal = true;
    }
    
    // 发送请求 
    private GetList(IsReset: boolean): void {

      if (IsReset) {
        this.CurrentWarehouse = ""
      }

      this.$UI.Loading.Show();
      this.$set(this, 'List', []);

      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.GetSKUSaleQuantity,
          Login: true
        },
        Data: { 
          skuId: this.CurrentSkuId,
          wareHouseId: this.CurrentWarehouse === "" ? 0 :this.CurrentWarehouse
        },
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            let Temp: any = {};
            Res.Data.Date.map((Item: any) => {
              Temp[Item.Days] = Math.round(Item.Days * Item.Qty)
            })
            this.List.push(Temp);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 获取下拉
    private GetWareHouse():void {
      this.$Request.Post({
        Server: this.$Server.Settings,
        Api: {
          Address: this.$Api.GetWarehouseDropList,
          Login: true
        },
        Data: true,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.DropWarehouse.splice(0, this.DropWarehouse.length, ...Res.Data.DropList)
            this.GetList(true)
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }
 
    // 关闭模态框
    private ClearModal():void {
      this.CurrentWarehouse = ""
      this.ShowModal = false;
    }
    
    private ShowModal: boolean = false // 当前模态框

    private DropWarehouse: PInterface.KV[] = []; // 仓库下拉
    private CurrentWarehouse: number | "" = ""; // 仓库
    private CurrentSkuId: number = 0
    
    private List: Interface.SkuSaleVolume[] = []
    private Cols: PInterface.TableCol[] = [
      { title: '60日', key: '60' },
      { title: '45日', key: '45' },
      { title: '30日', key: '30' },
      { title: '15日', key: '15' },
      { title: '7日', key: '7' }
    ]

  }
</script>
<style lang="less" scoped>
</style>
