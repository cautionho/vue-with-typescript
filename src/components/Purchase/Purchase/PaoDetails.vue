<template>
  <Modal v-model="DetailsModal" title="到货单详情" @on-cancel="ClearModal(0)" :mask-closable="false" width='1000' class="Container-Tabs">
    <Row>
      <Tabs name="PaoDetail" type="card" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" >
        <TabPane label="基本信息" name="Base" tab="PaoDetail">
          <PaoBaseInfo :DetailInfoMsg="SelecData[0]" />
        </TabPane>
        <TabPane label="质检" name="QualityInspection" tab="PaoDetail">
          <QualityTestingResult 
            :DetailInfoMsg="SelecData[0]" 
            :ActivedQuality="ActivedQuality"
            @handle-res-msg="ShowPic"
          />
        </TabPane>
        <TabPane label="处理结果" name="Result" tab="PaoDetail">
          <Form :label-width="100" ref="PaoQualityInspection" inline >
            <FormItem label="采购员：" class="P-W-400">
              <span>{{ SelecData[0].PurchaserName ? SelecData[0].PurchaserName : '-' }}</span>
            </FormItem>
            <FormItem label="处理结果：" class="P-W-400">
              <span>{{ SelecData[0].ExceptHandeType ? SelecData[0].ExceptHandeType : '-' }}</span>
            </FormItem>
            <FormItem label="处理时间：" class="P-W-400">
              <span>{{ $UI.Render.Date(SelecData[0].ExceptHandleTime, true) }}</span>
            </FormItem>
            <FormItem label="备注：" class="P-W-100-Percent">
              <span>{{ SelecData[0].ExceptHandlerRemark ? SelecData[0].ExceptHandlerRemark : '-' }}</span>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="入库记录" name="History" tab="PaoDetail">
          <Table class="P-MT-10" size="small" :highlight-row="true" :columns="InventoryHistoryCol" :data="PaoInStorageRecordList" border stripe height="300"></Table>
        </TabPane>
        <TabPane label="退换货记录" name="Records" tab="PaoDetail">
          <Table class="P-MT-10" size="small" :highlight-row="true" :columns="ReturnExchangeRecordsCol" :data="PaoRefundRecordList" border stripe height="300"></Table>
        </TabPane>
      </Tabs>
    </Row>
    <!-- 放大图片 -->
    <ShowBigPic ref="ShowBigPic" />
    <footer slot="footer" style="text-align:right;">
      <Button @click="ClearModal(0)">返回</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import Interface from "@/assets/Interface/Purchase";
import PInterface from "@/assets/Interface/Public";
@Component({
  name: "PaoDetails",
  components: {
    PaoBaseInfo: () => import("./PaoBaseInfo.vue"),
    QualityTestingResult: () => import("./QualityTestingResult.vue"),
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class PaoDetails extends Vue {
  private Trigger(SelectedData: Interface.Pao[]): void {
    this.SelecData = JSON.parse(JSON.stringify(SelectedData));
    this.PaoInStorageRecordList.splice(0);
    this.PaoRefundRecordList.splice(0);

    // 存在 入库
    if ( this.SelecData[0].LocationCode ) {
      this.PaoInStorageRecordList.push({
        InStorageQuantity: this.SelecData[0].InStorageQuantity,
        LocationCode: this.SelecData[0].LocationCode,
        InStorageTime: this.SelecData[0].InStorageTime
      })
    }

    // 存在 退换货
    if ( this.SelecData[0].TrackCode ) {
      this.PaoRefundRecordList.push({
        TrackCode: this.SelecData[0].TrackCode,
        RefundQuantity: this.SelecData[0].RefundQuantity,
        OperateTime: this.SelecData[0].OperateTime,
      })
    }

    this.ActiveTab = "Base"
    this.$nextTick(()=>{
      this.DetailsModal = true; 
    })
  }

  private ChangeTabs(val: string) {
    this.ActiveTab = val;
    if (val === "QualityInspection") {
      this.ActivedQuality = true;
    }
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.DetailsModal = false; 
    this.ActivedQuality = false; // 监听关闭
    this.$set(this, 'DetailsModal', false);
  }

  // 打开大图
  private ShowPic(Url: string): void {
    // this.ShowBigPicModal = true;
    // this.BigPicSrc = Url;
    (this as any).$refs.ShowBigPic.Triger(Url)
  }

  // private ShowBigPicModal: boolean = false;  // 控制大图Modal
  // private BigPicSrc: string = ""; // 控制大图Url

  private ActivedQuality: boolean = false; // 控制质检

  private DetailsModal: boolean = false;  //模态框

  private SelecData: Interface.Pao[] = [new Interface.Pao()]; //当前选中数据
  private ActiveTab: string = "Base"; //tab索引值

  private PaoInStorageRecordList: Interface.InStorageRecord[] = []; // 入库记录
  private PaoRefundRecordList: Interface.RefundRecord[] = []; // 退换货记录

  /* 审核 */
  // private ReviewForm: Interface.ReviewPostData = new Interface.ReviewPostData(); //审核提交数据

  // 入库记录 
  // 表头
  private InventoryHistoryCol: PInterface.TableCol[] = [
    { title: "入库数量", key: "InStorageQuantity"},
    { title: "货架号", key: "LocationCode"},
    {
      title: "入库时间", key: "", width: 160, render: (h: any, params: any): string => h("span", this.$UI.Render.Date(params.row.InStorageTime, true))
    }
  ];
  // 列表
  // private InventoryHistoryList: Interface.InventoryHistory[] = [];

  // 退换货记录 
  // 表头
  private ReturnExchangeRecordsCol: PInterface.TableCol[] = [
    { title: "快递单号", key: "TrackCode"},
    { title: "退货数量", key: "RefundQuantity"},
    {
      title: "添加时间", key: "", width: 160, render: (h: any, params: any): string => h("span", this.$UI.Render.Date(params.row.OperateTime, true))
    }
  ];
  // 列表
  // private ReturnExchangeRecordsList: Interface.ReturnExchangeRecords[] = [];
}
</script>
<style lang="less">
.Detail-Picture{
  width: 200px;
  height: 200px;
  background-size: cover;
  cursor: pointer;
}
</style>
