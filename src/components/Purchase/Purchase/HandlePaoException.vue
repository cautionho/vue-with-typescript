<!-- 处理到货单 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Modal v-model="ModifyModal" title="处理异常" @on-cancel="ClearModal(0)" :mask-closable="false" :width="1100" class="Container-Tabs">
        <Row>
          <Tabs name="HandlePaoExceptionTabs" type="card" :closable="false"   >
            <TabPane label="质检信息" name="Base" tab="HandlePaoExceptionTabs">
              <PaoBaseInfo :DetailInfoMsg="SelecData[0]" v-if="SelecData.length > 0" />
              <QualityTestingResult :DetailInfoMsg="SelecData[0]" v-if="SelecData.length > 0" />
            </TabPane>
            <TabPane label="体积/重量" name="QualityInspection" tab="HandlePaoExceptionTabs">
              <h1 class="P-TA-C">参考尺寸</h1>
              <div class="QA-Content" v-if="SkuInfo.Sizes" v-html="SkuInfo.Sizes"></div>
              <h2 class="P-TA-C" v-else>暂无参考尺寸</h2>
            </TabPane>
          </Tabs>
        </Row>

         <!-- 放大图片 -->
        <ShowBigPic ref="ShowBigPic" />
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="HandlePaoExcp(1)">保留</Button>
          <Button type="primary" @click="HandlePaoExcp(2)">退货</Button>
          <Button type="primary" @click="HandlePaoExcp(3)">换货</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Purchase";
@Component({
  name: "HandlePaoException",
  components: {
    PaoBaseInfo: () => import("./PaoBaseInfo.vue"),
    QualityTestingResult: () => import("./QualityTestingResult.vue"),
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class HandlePaoException extends Vue {
  @Emit() HandleResMsg(Type: number): void {}

  private Trigger(SelectedData: Interface.Pao[]): void {
    this.SelecData = JSON.parse(JSON.stringify(SelectedData));
    this.GetSkuInfo()
    
    this.$nextTick( ()=>{
      this.ModifyModal = true
    })
  }

  // 获取SKU详细信息
  private GetSkuInfo():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuInfoByCode,
        Login: true
      },
      Data: this.SelecData[0].SkuCode,
      Callback: (res: PInterface.Res): void => {
        if (res.IsSuccess) {
          this.SkuInfo = JSON.parse(JSON.stringify(res.Data.Data));
        } else {
          this.$Request.Error(res);
        }
        this.$UI.Loading.Hide();
      }
    });
  }

  // 1-保留 2-退货 3-换货
  private HandlePaoExcp(Status: number): void {
    let postData = {
      Id: this.SelecData[0].Id,
      Status: Status,
      Remark: ""
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PurchaseArrivalOrderHandleExcept,
        Login: true
      },
      Data: postData,
      Callback: (res: PInterface.Res): void => {
        if (res.IsSuccess) {
          this.$UI.Tips.Floating('success', `处理到货单成功`);
          this.ClearModal(1)
        } else {
          this.$UI.Loading.Hide();
          this.$Request.Error(res);
        }
      }
    });
  }

   // 关闭模态框
  private ClearModal(Val:number):void {
    this.$set(this, 'ModifyModal', false);
    this.$nextTick(()=>{
      this.HandleResMsg(Val)
    })
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }

  private SelecData: Interface.Pao[] = [new Interface.Pao()]; //当前选中数据

  private ModifyModal: boolean = false // 控制模态框
  private SkuInfo: Interface.SkuInfo = new Interface.SkuInfo();

}
</script>
<style lang="less">
.QA-Content{
  width: 100%;
  height: 400px;
  overflow-y: scroll;
}
</style>
