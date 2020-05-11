<template>
  <Row>
    <Button class="P-MB-10" type="primary" @click="Trigger()">导出数据</Button>
    <Modal v-model="ShowModal" title="导出记录" :mask-closable="false" @on-cancel="ShoModal = false" width="400">
      <Form onsubmit="return false" ref="ExportForm" :model="ExportForm" :rules="ExportFormRule" :label-width="100" name="ExportForm">
        <Form-item label="发货仓：" prop="WarehouseId">
          <Select placeholder="发货仓" v-model="ExportForm.WarehouseId" :options="DropWarehouseList" />
        </Form-item>
        <FormItem prop="StartTime" label="操作时间：">
          <Date-picker type="datetime" v-model="ExportForm.StartTime" placeholder="开始时间" style="width: 90%"></Date-picker>
          -
        </FormItem>
        <FormItem prop="EndTime">
          <Date-picker type="datetime" v-model="ExportForm.EndTime" placeholder="结束时间" style="width: 90%"></Date-picker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="PostExport()">导出</Button>
        <Button style="margin-left: 8px" @click="ShowModal = false">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'ExportFifteenDayReport'
})
export default class ExportFifteenDayReport extends Vue {
  @Prop() DropWarehouseList: PInterface.KV[] // 发货仓

  private Trigger(v: boolean): void {
    this.ExportForm = new Interface.FifteenDayReportExport();
    (this.$refs['ExportForm'] as any).resetFields();
    this.ShowModal = true
  }

  // 导出
  private PostExport():void {
     (this.$refs['ExportForm'] as any).validate((Valid: boolean): void => {
      if (Valid) {
        const StartStamp = new Date(this.ExportForm.StartTime).getTime()
        const EndStamp = new Date(this.ExportForm.EndTime).getTime()
        if(StartStamp > EndStamp){
          this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
          return;
        }

        if ((EndStamp - StartStamp) / 86400000 > 31) {
          this.$UI.Tips.Floating('warning', '仅支持筛选31天的数据')
          return;
        }

        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.ExportInventoryCheckLogList,
            Login: true
          },
          Data: this.ExportForm,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {

              this.$UI.Tips.Modal({
                Type: 'confirm',
                Content: `创建导出15天库存盘亏盘盈统计报表任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
                Callback: (Res: boolean):void => {
                }
              });
              (this.$refs['ExportForm'] as any).resetFields();
              this.ShowModal = false
            } else {
              this.$Request.Error(Res);
            }
          }
        });
      }
    })

  }

  private ShowModal: boolean = false // 控制模态框
  private ExportForm: Interface.FifteenDayReportExport = new Interface.FifteenDayReportExport()

  private ExportFormRule = { //规则
		WarehouseId: [{ required: true, message: '请选择发货仓', trigger: 'change', type: 'number'}],
  	StartTime: [{ required: true, message: '请选择开始时间', trigger: 'change', type: 'date'}],
  	EndTime: [{ required: true, message: '请选择结束时间', trigger: 'change', type: 'date'}]
  };

  private MS_NUMBER:number = 31 * 24 * 3600000;
  
}

</script>
<style lang="less"></style>
