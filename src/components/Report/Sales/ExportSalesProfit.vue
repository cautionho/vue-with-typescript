<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-MB-10 P-MR-10 P-Inline-Block" @click="ExportProfit(true)">导出当前列表数据</Button>
    <Modal v-model="ShowModal" title="导出当前列表数据" :mask-closable="false" @on-cancel="ShoModal = false" width="500">
      <Form onsubmit="return false" ref="ExportForm" :model="ExportForm" :rules="ExportFormRule" :label-width="100" name="ExportForm">
        <Form-item label="导入方式：" prop="ExportType">
          <Select placeholder="筛选导入方式：" v-model="ExportForm.ExportType" :options="ExportTypeList" />
          <!-- <Select placeholder="筛选导入方式：" v-model="ExportForm.ExportType" filterable clearable>
            <Option v-for="(Item, Index) in ExportTypeList" :value="$Enums.Report.ExportType[Item]" :key="Index">{{Item}}</Option>
          </Select> -->
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="PostExport()">导出</Button>
        <Button style="margin-left: 8px" @click="ShowModal = false">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'ExportSalesProfit'
})
export default class ExportSalesProfit extends Vue {
  @Emit() ExportProfit(B: boolean): void{
    this.ShowModal = false;
    (this.$refs['ExportForm'] as any).resetFields();
  }

  private Trigger(FormData: Interface.GrossProfitExport, PageIndex: number, PageSize: number): void {
    this.PostData = FormData;
    this.PageIndex = PageIndex;
    this.PageSize = PageSize;
    this.ShowModal = true;
  }

  // 导出
  private PostExport():void {
     (this.$refs['ExportForm'] as any).validate((Valid: boolean): void => {
      if (Valid) {
        this.PostData.ExportType = this.ExportForm.ExportType;
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.ExportSalesTradingProfit,
            Login: true
          },
          Data: { PageIndex: this.PageIndex, PageSize: this.PageSize, Conditions: this.PostData },
          Callback: (Res: PInterface.Res): void => {
            this.$UI.Loading.Hide();
            if (Res.IsSuccess) {
              this.$UI.Tips.Modal({
                Type: 'success',
                Content: `创建${this.$Enums.Report.ExportType[(this.ExportForm.ExportType as number)]}任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
                Callback: (Res: boolean):void => {
                }
              });
              this.ExportProfit(false)
            } else {
              this.$Request.Error(Res);
            }
          }
        });
      }
    })

  }

  private PageIndex: number = 0;
  private PageSize: number = 0;
  private ShowModal: boolean = false // 控制模态框
  private ExportForm: Interface.GrossProfitExportForm = new Interface.GrossProfitExportForm()
  private PostData: Interface.GrossProfitExport = new Interface.GrossProfitExport()
  private ExportTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.ExportType);
  private ExportFormRule = { //规则
		ExportType: [{ required: true, message: '请选择导入方式', trigger: 'change', type: 'number'}]
  };
  
}

</script>
<style lang="less"></style>
