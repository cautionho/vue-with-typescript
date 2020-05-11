<template>
  <Col class="P-Inline-Block">
    <Button type="primary" @click="Trigger">导出售后单</Button>
    <Modal v-model="ExportModal" title="导出售后单" @on-cancel="CancelModal">
      <Form :model="ExportForm" ref="ExportForm" :rules="ExportRules" :label-width="90" onsubmit="return false;">
        <FormItem label="平台：" prop="Platform">
          <Select placeholder="选择平台" v-model="ExportForm.Platform" :options="PlatformDrop" />
          <!-- <Select placeholder="选择平台" v-model="ExportForm.Platform" clearable filterable>
            <Option v-for="(Item, Index) in PlatformDrop" :key="Index" :value="$Enums.Sales.Platform[Item]">{{Item}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="添加时间：" prop="TimeRange">
          <DatePicker class="P-W-100-Percent" type="datetimerange" placeholder="选择时间区间" v-model="ExportForm.TimeRange" @on-change="ChangeDateTimeRange" split-panels clearable transfer></DatePicker>
        </FormItem>
        <FormItem label="处理结果：" prop="AfterSaleOrderType">
          <Select placeholder="选择处理结果" v-model="ExportForm.AfterSaleOrderType" :options="ProcessTypeDrop" multiple />
          <!-- <Select placeholder="选择处理结果" v-model="ExportForm.AfterSaleOrderType" multiple clearable filterable>
            <Option v-for="(Item, Index) in ProcessTypeDrop" :key="Index" :value="$Enums.CustomerService.ProcessType[Item]">{{Item}}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="售后单状态：" prop="AfterSaleOrderStatus">
          <Select placeholder="选择售后单状态" v-model="ExportForm.AfterSaleOrderStatus" :options="StatusDrop" multiple />
          <!-- <Select placeholder="选择售后单状态" v-model="ExportForm.AfterSaleOrderStatus" multiple clearable filterable>
            <Option v-for="(Item, Index) in StatusDrop" :key="Index" :value="$Enums.CustomerService.AfterSalesStatus[Item]">{{Item}}</Option>
          </Select> -->
        </FormItem>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelModal">取消</Button>
      </footer>
    </Modal>
  </Col>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'ExportAfterSalesOrder'
})

export default class ExportAfterSalesOrder extends Vue {
  private Trigger(): void {
    this.$set(this, 'ExportModal', true);
    this.$nextTick(()=>{
      (this as any).$refs.ExportForm.resetFields();
    })
  }

  private ChangeDateTimeRange(V: string[]): void {
    this.$set(this.ExportForm, 'StatrTime', V[0])
    this.$set(this.ExportForm, 'EndTime', V[1])
  }

  private Validate(): void {
    (this as any).$refs.ExportForm.validate((Valid: boolean): void => {
      if(Valid){
        this.PostExport();
      }
    })
  }

  private PostExport(): void {
    let PostData = JSON.parse(JSON.stringify(this.ExportForm));
    delete PostData.TiimeRange;
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleWalmartExport,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: '创建导出售后单任务成功，请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。',
            Callback: (B: boolean): void => {
              this.CancelModal();
            }
          })
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CancelModal(): void {
    this.$set(this, 'ExportModal', false);
    this.$nextTick(()=>{
      (this as any).$refs.ExportForm.resetFields();
    })
  }

  private ValidateDateTimeRange(Rules:any, Data: string[], Callback:(S?:string)=>void): boolean{
    if(Data.every(Item => Item !== "")){
      const ThirtyDays: number = 90*24*3600000;
      if(+new Date(Data[1]) - (+new Date(Data[0])) > ThirtyDays){
        Callback('时间区间不可大于3个月');
        return false
      }else{
        return true;
      }
    }else{
      Callback('请选择时间区间');
      return false
    }
  }

  private ExportModal: boolean = false

  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform)
  private ProcessTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.ProcessType)
  private StatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.AfterSalesStatus)

  private ExportForm: Interface.AfterSalesOrderExport = new Interface.AfterSalesOrderExport()
  private ExportRules: any = {
    Platform: [{required: true, message: '请选择平台', trigger: 'change', type: 'number'}, {pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择平台'}],
    AfterSaleOrderType: [{required: true, message: '请选择处理结果', trigger: 'change', type: 'array'}],
    TimeRange: [{required: true, trigger:'change', validator: this.ValidateDateTimeRange}]
  }
}
</script>