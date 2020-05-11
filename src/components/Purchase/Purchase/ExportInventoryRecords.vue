<!-- 采购入库记录 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" @click="OpeHandle">导出采购产品入库记录</Button>
      <Modal v-model="ExportModal" title="导出采购产品入库记录" @on-cancel="ClearModal" :mask-closable="false" width="400">
        <Form :label-width="100" ref="ExportForm" :model="ExportForm" :rules="Rules" onsubmit="return false"> 
          <Form-item label="选择仓库" prop="WarehouseId">
            <Select placeholder="选择仓库" v-model="ExportForm.WarehouseId" :options="WarehouseList" />
          </Form-item>
          <Form-item label="选择月份" prop="InStorageTime">
            <Date-picker type="month" format="yyyy-MM" class="P-W-100-Percent" v-model="ExportForm.InStorageTime" placeholder="请选择月份"></Date-picker>
          </Form-item>
        </Form>
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="ValidateExport">导出</Button>
          <Button @click="ClearModal">取消</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
  name: 'ExportInventoryRecords',
})
export default class ExportInventoryRecords extends Vue {
  @Emit() HandleResMsg(): void{}
  
  private ClearModal(): void{
    this.ExportForm = new Interface.ExportForm();
    this.ExportModal = false;
  }

  private Trigger(DropWarehouse: PInterface.KV[]){
    this.ExportForm.WarehouseId = 50;
    this.ExportForm.InStorageTime = new Date((new Date().getMonth() == 0 ? (new Date().getFullYear() - 1) : new Date().getFullYear()) +'-'+ (new Date().getMonth() == 0 ? 12 : new Date().getMonth()));
    this.WarehouseList = DropWarehouse;
    this.ExportModal = true;
  }

  private ValidateExport():void{
    (this.$refs['ExportForm'] as any).validate((bool: boolean) => {
      if (bool) {
        this.PostExport()
      }
    })
  }

  private PostExport(): void{
    let PostData:Interface.ExportForm = JSON.parse(JSON.stringify(this.ExportForm));
    PostData["InStorageTime"] = `${new Date(PostData.InStorageTime).getFullYear()}-${new Date(PostData.InStorageTime).getMonth()+1}`;
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PurchaseArrivalOrderExport,
				Login: true
			},
			Data: PostData,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出采购产品入库记录任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
            Callback: (B:boolean):void =>{}
          })
          this.ClearModal();
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private ExportForm: Interface.ExportForm = new Interface.ExportForm()
  private WarehouseList: PInterface.KV[] = []
  private ExportModal: boolean = false;
  private Rules: any = {
    WarehouseId: [{ required: true, message: '请选择仓库', trigger: 'change', type: 'number' }],
    InStorageTime: [{ required: true, message: '请选择月份', trigger: 'change', type: 'date' }],
  }
}

</script>
<style lang="less"></style>
