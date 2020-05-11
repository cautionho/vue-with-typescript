<template>
  <Row class="P-Inline-Block">
    <Button type="primary" class="P-MB-10 P-MR-10 P-Inline-Block" @click="ShowModal = true">导出</Button>
    <Modal v-model="ShowModal" title="导出" :mask-closable="false" @on-ClearModal="ClearModal" width="600">
      <Form onsubmit="return false"  :label-width="90" :rules="exportOrdRules" ref="exportOrdForm" :model="exportOrdForm">
        <FormItem label="时间类型：" prop="SearchTimeType">
          <RadioGroup v-model="exportOrdForm.SearchTimeType">
            <Radio label="1">发货时间</Radio>
            <Radio label="2">付款时间</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="时间区间：" class="ivu-form-item-required">
          <Row>
            <Col span="11">
              <FormItem prop="BeginTime">
                <DatePicker type="datetime" placeholder="开始时间" v-model="exportOrdForm.BeginTime" class="P-W-100-Percent"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="EndTime">
                <DatePicker type="datetime" placeholder="结束时间" v-model="exportOrdForm.EndTime" class="P-W-100-Percent"></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <Form-item label="平台：">
          <Select v-model="exportOrdForm.Platform" placeholder="筛选平台" :options="platformList" />
        </Form-item>
        <Form-item label="店铺：">
          <Select v-model="exportOrdForm.StoreId" placeholder="筛选店铺" ref="Store" :options="storeList" />
        </Form-item>
        <Form-item label="国家：">
          <Select v-model="exportOrdForm.CountryCode" placeholder="筛选国家" :options="CountryList" optionValKey="CountryCode" optionKey="CountryNameCn" />
        </Form-item>
        <Form-item label="状态：">
          <Select placeholder="筛选包裹状态" v-model="exportOrdForm.PackageStatus" :options="packageStatusList" />
        </Form-item>
        <Form-item label="仓库：">
          <Select placeholder="筛选发货仓" v-model="exportOrdForm.WarehouseId" :options="WarehouseList" />
        </Form-item>
        <Form-item label="渠道：">
          <Select v-model="exportOrdForm.ShippingMethodId" placeholder="筛选物流渠道" multiple :options="ShipMethodList" optionValKey="Id" optionKey="Name" />
        </Form-item>
      </Form>
      <footer slot="footer">
        <Button type="primary" @click="exportData">导出</Button>
        <Button @click="ClearModal">取消</Button>
      </footer>
    </Modal>
  </Row>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';
/*interface end*/

@Component({
	name: 'ExportTrackingMore',
	components: { }
})

export default class ExportTrackingMore extends Vue {
  @Prop() CountryList: PInterface.CountryEntity[]
  @Prop() WarehouseList: PInterface.KV[]
  @Prop() ShipMethodList:PInterface.IdName[]


  @Watch('exportOrdForm.Platform')
  private ChangePlatForm(Val: number | ''):void{
    this.exportOrdForm.StoreId = '';
    if (this.storeList.length != 0) {
      (this.$refs.Store as any).clearSingleSelect();
    }
    this.storeList = [];
    if (Val != '') {
      this.GetStoreDropList(Val);
    }
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
          this.storeList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private ClearModal(): void{
    this.ShowModal = false;
    (this.$refs['exportOrdForm'] as any).resetFields();
  }

  private exportData(): void{
    (this.$refs['exportOrdForm'] as any).validate((Valid: boolean): void => {
      if (Valid) {
        const StartStamp = new Date(this.exportOrdForm.BeginTime).getTime()
        const EndStamp = new Date(this.exportOrdForm.EndTime).getTime()
        if(StartStamp > EndStamp){
          this.$UI.Tips.Floating('warning', `开始时间不能大于结束时间`);
          return;
        }
        if ((EndStamp - StartStamp) / 86400000 > 30) {
          this.$UI.Tips.Floating('warning', '筛选订单时间区间最多只能30天')
          return
        }
        this.PostExport()
      }
    })
  }

  private PostExport(): void{
    let ExportForm = JSON.parse(JSON.stringify(this.exportOrdForm));
    ExportForm.SearchTimeType = Number(ExportForm.SearchTimeType);

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelTrackingmoreExport,
        Login: true
      },
      Data: ExportForm,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success','导出数据成功');
			    window.open(this.$Server.Logistics + '/' + Res.Data.Url.replace(/zip/, "xls"));
          this.ClearModal()
        } else {
          this.$Request.Error(Res);
        }
      }
    });
  }
  
  private platformList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);
  private storeList: PInterface.KV[] = [];
  private packageStatusList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Logistics.TrackingmoreStatus);
  private exportOrdForm:Interface.ExportData = new Interface.ExportData();
  private ShowModal: boolean = false;
  private exportOrdRules: any = {
    BeginTime: [{ required: true, message: '请选择开始发货时间', trigger: 'change', type: 'date' }],
    EndTime: [{ required: true, message: '请选择结束发货时间', trigger: 'change', type: 'date' }],
    SearchTimeType: [{ required: true, message: '请选择时间类型', trigger: 'change', type: 'string' }]
  }
}
</script>