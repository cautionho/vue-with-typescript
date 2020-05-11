<template>
  <Row>
    <Button class="P-MB-10" type="primary" @click="TriggerModal">导出采购员绩效</Button>
    <Modal v-model="ShowModal" title="导出记录" :mask-closable="false" @on-cancel="CloseModal" width="600">
      <Form onsubmit="return false" ref="ExportForm" :model="ExportForm" :rules="ExportFormRule" :label-width="100" name="ExportForm">
        <Form-item label="采购员：">
          <Select placeholder="采购员" v-model="ExportForm.PurchaserId" :options="DropList" />
          <!-- <Select placeholder="采购员" v-model="ExportForm.PurchaserId" filterable clearable>
            <Option v-for="(Item, Index) in DropList" :value="Item.Value" :key="Item.Value">{{ Item.Key }}</Option>
          </Select> -->
        </Form-item>
        <FormItem label="筛选时间：" class="ivu-form-item-required">
          <Row>
            <Col span="11">
              <FormItem prop="StartTime">
                <DatePicker type="date" placeholder="开始时间" v-model="ExportForm.StartTime" class="P-W-100-Percent"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="EndTime">
                <DatePicker type="date" placeholder="结束时间" v-model="ExportForm.EndTime" class="P-W-100-Percent"></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="Validate">导出</Button>
        <Button style="margin-left: 8px" @click="CloseModal">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'ExportPurchaserStatistics'
})
export default class ExportPurchaserStatistics extends Vue {
  private CloseModal():void{
    (this.$refs['ExportForm'] as any).resetFields();
    this.ShowModal = false
  }

  private TriggerModal(): void {
    this.GetDropList();
    this.ShowModal = true
  }

  private GetDropList(): void{
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.GetUserDropList,
        Login: true
      },
      Data: "采购员",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.DropList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }
  
  private Validate(): void{
    (this.$refs['ExportForm'] as any).validate((Valid: boolean): void => {
      if (Valid) {
        const StartStamp = new Date(this.ExportForm.StartTime).getTime()
        const EndStamp = new Date(this.ExportForm.EndTime).getTime()
        if(StartStamp > EndStamp){
          this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
          return;
        }
        this.PostExport()
      }
    })
  }

  // 导出
  private PostExport():void {
    let ExportGroup = JSON.parse(JSON.stringify(this.ExportForm))
    ExportGroup.StartTime = this.$UI["Render"].NewDate(ExportGroup.StartTime, true)
    ExportGroup.EndTime = this.$UI["Render"].NewDate(ExportGroup.EndTime, true)

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ExportPurchaserPerformance,
        Login: true
      },
      Data: ExportGroup,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `创建导出采购员绩效任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。`,
            Callback: (Res: boolean):void => {
            }
          });
          this.CloseModal()
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }

  private ShowModal: boolean = false // 控制模态框
  private ExportForm: Interface.PurStatisticsExport = new Interface.PurStatisticsExport()
  private DropList: PInterface.KV[] = []
  private ExportFormRule = { //规则
  	StartTime: [{ required: true, message: '请选择开始时间', trigger: 'change', type: 'date'}],
  	EndTime: [{ required: true, message: '请选择结束时间', trigger: 'change', type: 'date'}]
  };
  
}

</script>
<style lang="less"></style>
