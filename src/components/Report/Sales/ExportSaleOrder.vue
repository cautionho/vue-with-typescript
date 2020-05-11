<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-MB-10 P-MR-10 P-Inline-Block" @click="ShowModal = true">导出数据</Button>
    <Modal v-model="ShowModal" title="导出数据" :mask-closable="false" @on-cancel="ShoModal = false" width="600">
      <Form ref="ExportForm" :model="ExportForm" :rules="Rule" :label-width="100" onsubmit="return false;">
        <Row>
          <FormItem label="平台：" prop="Platform">
            <Select v-model="ExportForm.Platform" placeholder="请选择平台" :options="PlatformDrop" :onChange="OnClearSelect.bind(this, 'Platform')" />
            <!-- <Select v-model="ExportForm.Platform" placeholder="请选择平台" filterable clearable @on-change="OnClearSelect('Platform')">
              <Option v-for="(Item, Index) in PlatformDrop" :value="$Enums.Sales.Platform[Item]" :key="Index">{{ Item }}</Option>
            </Select> -->
          </FormItem>
          <FormItem label="店铺：">
            <Select v-model="ExportForm.StoreId" placeholder="请选择店铺" :options="StoreDrop" :onChange="OnClearSelect.bind(this, 'StoreId')" ref="ExportStore" />
            <!-- <Select v-model="ExportForm.StoreId" placeholder="请选择店铺" filterable clearable @on-change="OnClearSelect('StoreId')" ref="ExportStore">
              <Option v-for="(Item,Index) in StoreDrop" :value="Item.Value" :key="Item.Key">{{ Item.Key }}</Option>
            </Select> -->
          </FormItem>
          <Col span="24">
          <FormItem label="下单时间：" class="ivu-form-item-required">
          <Row>
            <Col span="11">
              <FormItem prop="BeginTime">
                <DatePicker type="date" placeholder="开始时间" v-model="ExportForm.BeginTime" class="P-W-100-Percent"></DatePicker>
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
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="PostExport()">导出</Button>
        <Button style="margin-left: 8px" @click="ClearExport">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Report';
@Component({
  name: 'ExportSaleOrder'
})
export default class ExportSaleOrder extends Vue {
  ClearExport(): void{
    this.ShowModal = false;
    (this.$refs['ExportForm'] as any).resetFields();
  }

  @Watch('ExportForm.Platform')
  private ChangePlatForm(Val: number | ''):void{
    this.ExportForm.StoreId = '';
    if (this.StoreDrop.length != 0) {
      (this.$refs.ExportStore as any).clearSingleSelect();
    }
    this.StoreDrop = [];
    if (Val != '') {
      this.GetStoreDropList(Val);
    }
  }

  get StartTimeMs(): number {
    return this.ExportForm.BeginTime != '' ? new Date(this.ExportForm.BeginTime).getTime() : 0;
  }
  get EndTimeMs(): number {
    return this.ExportForm.EndTime != '' ? new Date(this.ExportForm.EndTime).getTime() : 0;
  }

  // 获取平台下的所有店铺
  private GetStoreDropList(Val:number | ''):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.Sales[Val].StoreDrop
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.StoreDrop = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(S: string):void{
    if( (this as any).ExportForm[S] == undefined ){
      this.$set(this.ExportForm, S, '');
    }
  }

  // 导出
  private PostExport():void {
    (this.$refs['ExportForm'] as any).validate((Valid: boolean): void => {
      let ExportForm = JSON.parse(JSON.stringify(this.ExportForm));
      ExportForm.BeginTime = this.$UI["Render"].NewDate(ExportForm.BeginTime, true);
      ExportForm.EndTime = this.$UI["Render"].NewDate(ExportForm.EndTime, true);

      if (Valid) {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Report,
          Api: {
            Address: this.$Api.ShipOrderSummaryOfDayExport,
            Login: true
          },
          Data: ExportForm,
          Callback: (Res: PInterface.Res): void => {
            this.$UI.Loading.Hide();
            if (Res.IsSuccess) {
              this.ClearExport();
              this.$UI.Tips.Modal({
                Type: 'success',
                Content: `创建导出订单销售报表成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据`,
                Callback: (Res: boolean):void => { 
                }
              });
            } else {
              this.$Request.Error(Res);
            }
          }
        });
      }
    })
  }

  private ValidateStartDate(Rule: any, Value: string, CallBack: any):void {
    if ( Value === '' && this.EndTimeMs !== 0) {
      CallBack(new Error('开始时间和结束时间必须同时填写'))
    } else if( Value === '' ){
      CallBack(new Error('请选择开始时间'));
    } else {
      const CurrentTime = new Date().getTime();
      if (this.StartTimeMs > CurrentTime) {
        CallBack(new Error('开始时间不得晚于当前时间'));
      } else if (this.EndTimeMs != 0) {
        if ((this.EndTimeMs - this.StartTimeMs) > 31 * 24 * 3600000) {
          CallBack('时间区间不能超过31天');
        } else {
          CallBack();
        }
      } else {
        CallBack();
      }
    }
  };
  private ValidateEndDate(Rule: any, Value: string, CallBack: any):void {
    if ( Value === '' && this.StartTimeMs !== 0) {
      CallBack(new Error('开始时间和结束时间必须同时填写'));
    } else if( Value === '' ){
      CallBack(new Error('请选择结束时间'));
    } else {
      if (this.StartTimeMs > this.EndTimeMs) {
        CallBack(new Error('开始时间不能晚于结束时间'));
      } else if (this.StartTimeMs != 0 && (this.EndTimeMs - this.StartTimeMs) > 31 * 24 * 3600000) {
        CallBack(new Error('时间区间不能超过31天'));
      } else {
        CallBack()
      }
    }
  };

  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);  //平台下拉
  private StoreDrop: PInterface.KV[] = [];
  private ShowModal: boolean = false // 控制模态框
  private ExportForm: Interface.SalesOrdersSearch = new Interface.SalesOrdersSearch()
  // private ExportTypeList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Report.ExportType);
  private Rule = { //规则
		BeginTime: [{validator: this.ValidateStartDate, trigger: 'change', type: 'date'}],
    EndTime: [{validator: this.ValidateEndDate, trigger: 'change', type: 'date'}],
    Platform: [{ required: true, type: 'number', message: '请选择平台', trigger: 'change' }]
  };
}

</script>
<style lang="less"></style>
