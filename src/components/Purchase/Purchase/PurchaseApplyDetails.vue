<!-- 采购申请详情 -->
<template>
  <Modal v-model="DetailModal" title="采购申请详情" @on-cancel="ClearModal(0)" :mask-closable="false" width='1100'>
    <Row>
      <Form :label-width="120" onsubmit="return false">
        <Row>
          <Col span="18">
            <Col span="12">
              <Form-item class="P-MB-10" label="SKU编号：">
                {{ DetailInformation[0].ApplySummary.SkuCode }}
              </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="SKU名称：">
                  {{ DetailInformation[0].ApplySummary.SkuName }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="当前库存：">
                  {{ DetailInformation[0].Inventory.Quantity }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="在途库存：">
                  {{ DetailInformation[0].Inventory.PurchasingQuantity }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="销售员：">
                  {{ DetailInformation[0].ApplySummary.CreatorName }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="销售数据：">
                  {{ `${DetailInformation[0].AvgSaleQuantity.AvgSaleQuantity7}/${DetailInformation[0].AvgSaleQuantity.AvgSaleQuantity15}/${DetailInformation[0].AvgSaleQuantity.AvgSaleQuantity30}` }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="仓库：">
                  {{ DetailInformation[0].ApplySummary.WarehouseName }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="采购数量：">
                  {{ DetailInformation[0].ApplySummary.PurchaseQuantity }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="关联采购单：">
                  {{ DetailPurOrderInfo.PurchaseCode ? DetailPurOrderInfo.PurchaseCode : "-" }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="关联采购单状态：">
                  {{  RenderStatus(DetailPurOrderInfo.Status)  }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="申请时间：">
                  {{ $UI.Render.Date( DetailInformation[0].ApplySummary.CreateTime, true) }}
                </Form-item>
              </Col>
              <Col span="12">
                <Form-item class="P-MB-10" label="备注：">
                  {{ DetailInformation[0].ApplySummary.Remark }}
                  <Tooltip class="P-W-100-Percent" :content="`${DetailInformation[0].ApplySummary.Remark ? DetailInformation[0].ApplySummary.Remark : '-'}`" :maxWidth="200">
                    <p class="P-LINE-1">{{ DetailInformation[0].ApplySummary.Remark ? DetailInformation[0].ApplySummary.Remark : '-' }}</p>
                  </Tooltip>
                </Form-item>
              </Col>
            </Col>
            <Col span="6">
              <div class="demo-upload-list Detail-Picture">
                <img :src="`${$Server.File}/${DetailInformation[0].ApplySummary.DefaultImage}`" height="200" width="200">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="ShowPic(DetailInformation[0].ApplySummary.DefaultImage)"></Icon>
                </div>
              </div>
            </Col>
          </Col>
        </Row>
        <Row>
          <h1 class="P-TA-C">审核记录</h1>
          <Col span="24" class="P-MT-10">
            <Table :columns="Cols" :data="DetailPurApplyHistory" size="small" stripe :height="300" ref="ApplyHistory" ></Table>
          </Col>
        </Row>
      </Form>
    </Row>
    <footer slot="footer" style="text-align:right;">
      <Button @click="ClearModal(0)">返回</Button>
    </footer>
    <!-- 放大图片 -->
    <ShowBigPic ref="ShowBigPic" />
  </Modal>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Purchase";
  @Component({
    name: 'PurchaseApplyDetails',
    components: {
      ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    }
  })
  export default class PurchaseApplyDetails extends Vue {
    @Prop() SelectedData: Interface.PurchaseApply[];   //选中数据
    @Prop() ShowModal: boolean;   // 模态框

    @Emit() HandleResMsg(): void {} // 回调
    
     // 打开模态框
    @Watch('ShowModal')
    private IsShowModal(Bool: boolean):void {
      if( Bool ){

        this.GetApplyInfo()

        this.$nextTick(function() {
          this.$set(this,'DetailModal', true);
        })
      } 
    }

    // 渲染状态
    private RenderStatus(Status: number): string{
      return Status ? ( Status === -1 ? "已终止" : ['', '新建', '待采购审核', '待销售确认', '待发货', '待签收', '待入库', '部分入库', '已完成'][Status] ) : "-"
    }

    // 打开大图
    private ShowPic(Url: string): void {
      (this as any).$refs.ShowBigPic.Trigger(Url)
    }

    // 获取物品详情
    private GetApplyInfo() {
      const Id:number = this.SelectedData[0].ApplySummary.Id
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.PurchaseApplyGetApplyInfo,
          Login: true
        },
        Data: Id,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.DetailInformation = [res.Data.Data]

            const PurchaseCode:string = this.DetailInformation[0].ApplySummary.PurchaseCode;

            if (PurchaseCode !== "") {
              //获取关联采购单
              this.GetPurchaseApplyOrderInfo(PurchaseCode, Id)
            } else {
              this.GetPurApplyHistory(Id)
            }
          } else {
            this.GetPurApplyHistory(Id)
            this.$Request.Error(res);
          }
        }
      })
    }
    // 获取关联采购单
    private GetPurchaseApplyOrderInfo(PurchaseCode: string, Id: number): void{
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.PurchaseOrderGetByCode,
          Login: true
        },
        Data: PurchaseCode,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.DetailPurOrderInfo = res.Data.Data
          }else {
            this.$Request.Error(res);
          }
          this.GetPurApplyHistory(Id)
        }
      })
    }

    // 获取审核记录
    private GetPurApplyHistory(Id: number): void {
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.PurchaseApplyGetHistory,
          Login: true
        },
        Data: Id,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.DetailPurApplyHistory = res.Data.Data
          }else {
            this.$Request.Error(res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.DetailInformation.splice(0, this.DetailInformation.length, new Interface.PurchaseApply());
      this.DetailPurApplyHistory.splice(0, this.DetailPurApplyHistory.length);

      this.$set(this, 'DetailModal', false);

      this.HandleResMsg()
    }

    private DetailModal: boolean = false // 当前模态框

    private DetailInformation: Interface.PurchaseApply[] = [new Interface.PurchaseApply()]; // 展示信息
    private DetailPurOrderInfo: Interface.ApplyOrderInfo = new Interface.ApplyOrderInfo(); // 采购单详细
    private DetailPurApplyHistory: Interface.AuditHistory[] = []; // 审核记录 

    private Cols: PInterface.TableCol[] = [
      { title: '编号', key: 'Id', width: 80},
      { title: '操作者名称', key: 'Operator', width: 100},
      { title: '操作时间', key: 'OperateTime', width: 160, render: (h: any, params: any): string => h('span', {}, this.$UI.Render.Date( (params.row as any).OperateTime, true))},
      { title: '备注', key: 'OperateLog'}
    ]

  }
</script>
<style lang="less" scoped>

.Detail-Picture{
  width: 200px;
  height: 200px;
  display: inline-block;
  position: relative;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
  width: 200px;
  height: 200px;
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: -webkit-flex;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 200px;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
</style>
