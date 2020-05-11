<template>
  <Modal title="查看操作记录" v-model="showHistoryModal" :mask-closable="false" :width="1200" @on-cancel="HandleRes">
    <div>跟踪号：<span>{{trackingNumber}}</span></div>
    <Row class="P-MT-10">
      <Table size="small" :highlight-row="true" height="500" stripe :columns="historyCol" :data="historyList"></Table>
    </Row>
    <footer slot="footer">
      <Button @click="HandleRes">返回</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';

@Component({
  name: 'SaleGrossOpeHistory'
})
export default class SaleGrossOpeHistory extends Vue {
  private HandleRes(): void{
    this.showHistoryModal = false;
  }

  private TriggerModal(CurrData: Interface.GrossProfitList): void{
    this.SelectedData = CurrData;
    this.trackingNumber = this.SelectedData.TrackingNumber === "" ? '-' : this.SelectedData.TrackingNumber;
    this.showHistoryModal = true;
    this.GetHistoryData()
  }

  private GetHistoryData() {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.SalesTradingProfitHistoryList,
        Login: true
      },
      Data: this.SelectedData.ShipOrderCode,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.historyList = Res.Data.Data
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }

  private trackingNumber: string = "-";
  private SelectedData: Interface.GrossProfitList = new Interface.GrossProfitList();
  private showHistoryModal: boolean = false;
  private historyList: Interface.HistoryData[] = [];
  private historyCol: PInterface.TableCol[] = [
    { title: '发货单号', key: 'ShipOrderCode' },
    { title: '操作人', key: 'OperateUserName' },
    { title: '操作时间', key: 'OperateTime', render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.OperateTime, true)) },
    { title: '操作记录', width: 700, key: 'OperateContent' }
  ]
}

</script>
<style lang="less"></style>
