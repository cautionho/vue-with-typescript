<template>
	<Modal title="调拨需求详情" v-model="IsOpen" :mask-closable="false" width="800" @on-cancel="ClearModal" class="Container-Tabs">
    <Tabs name="TransferDemandDetail" :closable="false" :value="ActiveTab" @on-click="ChangeTabs">
      <TabPane label="基本信息" name="Info" tab="TransferDemandDetail">
        <Form :label-width="110" ref="DetailForm" inline :model="DetailForm">
          <FormItem label="编号：" class="P-W-49-Percent" v-if="!IsTransferInBox">
            <p>{{ DetailForm.SkuCode }}</p>
          </FormItem>
          <FormItem label="箱号：" class="P-W-49-Percent" v-if="IsTransferInBox">
            <p>{{ DetailForm.TransferBoxCode }}</p>
          </FormItem>
          <FormItem label="创建时间：" class="P-W-49-Percent">
            <p v-if="!IsTransferInBox">{{ $UI.Render.Date(DetailForm.CreatedTime, true) }}</p>
            <p v-else>{{ $UI.Render.Date(DetailForm.Created, true) }}</p>
          </FormItem>
          <FormItem label="目标仓：" class="P-W-49-Percent">
            <p v-if="!IsTransferInBox">{{ DetailForm.TargetWarehouse }}</p>
            <p v-else>{{ DetailForm.TargetWarehouseName }}</p>
          </FormItem>
          <FormItem label="来源仓：" class="P-W-49-Percent">
            <p v-if="!IsTransferInBox">{{ DetailForm.OriginWarehouse }}</p>
            <p v-else>{{ DetailForm.OriginWarehouseName }}</p>
          </FormItem>
          <FormItem label="第三方仓库单号：" class="P-W-49-Percent" v-if="IsTransferInBox">
            <p>{{ DetailForm.StoreInCode }}</p>
          </FormItem>
          <FormItem label="费用：" class="P-W-49-Percent" v-if="IsTransferInBox">
            <p>{{ DetailForm.LogisticsAmt }} CNY</p>
          </FormItem>
          <FormItem label="物流公司：" class="P-W-49-Percent" v-if="IsTransferInBox">
            <p>{{ DetailForm.LogisticsCmp === "" ? '-' : DetailForm.LogisticsCmp }}</p>
          </FormItem>
          <FormItem label="快递单号：" class="P-W-49-Percent" v-if="IsTransferInBox">
            <p>{{ DetailForm.TrackingNumber === "" ? '-' : DetailForm.TrackingNumber }}</p>
          </FormItem>
          <FormItem label="批次号：" class="P-W-100-Percent" v-if="!IsTransferInBox">
            <p>{{ DetailForm.TransferRequireBatchCode === "" ? '-' : DetailForm.TransferRequireBatchCode }}</p>
          </FormItem>
          <FormItem label="备注：" class="P-W-100-Percent" v-if="!IsTransferInBox">
            <p>{{ DetailForm.Remark === "" ? '-' : DetailForm.Remark }}</p>
          </FormItem>
        </Form>
        <Table :columns="Columns" :data="ProductData" border height="180"></Table>
      </TabPane>
      <TabPane label="操作记录" name="History" tab="TransferDemandDetail">
        <Table :columns="HistoryCol" :data="DetailForm.Historys" border height="400"></Table>
      </TabPane>
    </Tabs>  
    <footer slot="footer" class="P-TA-R">
      <Button @click="ClearModal">返回</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'TransferDemandDetail'
})
export default class TransferDemandDetail extends Vue {
  private ClearModal(){
    this.IsOpen = false;
    this.ActiveTab = 'Info';
    
  }

  private TriggerModal(SelectData:Interface.TransferDemandList | Interface.TransferPickBatchDetail, TransferInBox?:boolean): void{
    if(TransferInBox){
      this.IsTransferInBox = true;
      this.DetailForm = new Interface.TransferInBoxDetail();
      this.Columns = [
        { title: '物品列表', align: 'center',
          children: [
            { title: 'SKU编号', key: 'SkuCode' },
            { title: '产品名', key: 'SkuName' },
            { title: '调拨数量', key: 'TransferInQty' },
            { title: '实际入库数量', key: 'ActualInQty' }
          ]
        }]
      this.GetSkuDetail(SelectData.Id)
    }else{
      this.IsTransferInBox = false;
      this.DetailForm = new Interface.TransferDemandDetail();
    }
    this.IsOpen = true;
    this.ProductData = [];
    this.GetDetail(SelectData.Id)
  }
  
  private ChangeTabs(Val:string){
    this.ActiveTab = Val;
  }

  private GetDetail(PostData: number): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: !this.IsTransferInBox ? this.$Api.TransferRequireDetail : this.$Api.TransferInBoxDetail,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.DetailForm = Res.Data.Data
          if(!this.IsTransferInBox){
            let Obj:Interface.ProductInfoTb = new Interface.ProductInfoTb();
            Obj.SkuCode = (this.DetailForm as Interface.TransferDemandDetail).SkuCode;
            Obj.SkuName = (this.DetailForm as Interface.TransferDemandDetail).SkuName;
            Obj.Quantity = (this.DetailForm as Interface.TransferDemandDetail).Quantity;
            (this.ProductData as Interface.ProductInfoTb[]).push(Obj)
          }
				} else {
          this.$Request.Error(Res);
				}
			}
		})
  }

  private GetSkuDetail(PostData: number): void{
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferInBoxSkuDetail,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
            this.ProductData = Res.Data.Data
				} else {
          this.$Request.Error(Res);
				}
			}
		})
  }

  private ProductData: Interface.ProductInfoTb[] | Interface.TransferInBoxItem[] = []
  private IsTransferInBox: boolean = false; //是否调拨箱详情
  private IsOpen: boolean = false;
  private ActiveTab: string = 'Info'  //tab索引值
  private DetailForm: Interface.TransferDemandDetail | Interface.TransferInBoxDetail = new Interface.TransferDemandDetail()
  private Columns: PInterface.TableCol[] = [
    { title: '物品列表', align: 'center',
      children: [
        { title: 'SKU编号', key: 'SkuCode' },
        { title: '产品名', key: 'SkuName' },
        { title: '调拨数量', key: 'Quantity' }
      ]
    }
  ]
  private HistoryCol: PInterface.TableCol[] = [
    { title: '编号', width: 60, render: (h: any, Params: any): string => h('span', Params.index+1) },
    { title: '操作人', key: 'Operater', width: 100 },
    { title: '操作时间', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.OperatedTime, true)) },
    { title: '操作记录', key: 'Note', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.Note
        },
        class: 'P-LINE-1'
      }, Params.row.Note)
    } }
  ]
}

</script>
<style lang="less"></style>
