<!-- 扫描质检 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10" @click="Trigger">扫描质检</Button>
      <Modal v-model="ModifyModal" title="扫描质检" @on-cancel="ClearModal(0)" :mask-closable="false" :width="600" class="Container-Tabs">
        <Row>
          <Form :label-width="100" ref="BatchQualityTestingForm" :model="BatchQualityTestingForm" :rules="BatchQualityTestingRule" inline onsubmit="return false"> 
            <FormItem label="到货单号：" class="P-W-100-Percent P-MB-10" prop="Code" >
              <Input ref="BatchQualityTestingCode" placeholder="到货单号" v-model="BatchQualityTestingForm.Code" @on-enter="PostData"/>
              <p class="Color-Gray">请扫描/输入到货单号，输入完成后请按回车键。</p>
            </FormItem>
          </Form>
        </Row>
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="PostData">质检</Button>
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
  name: "QuantityTesting",
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class QuantityTesting extends Vue {
  @Emit() HandleResMsg(Type: number, Target?: Interface.Pao): void {}

  private Trigger(): void {
    this.ModifyModal = true
    this.$nextTick(()=>{
      ( this.$refs["BatchQualityTestingCode"] as Vue ).focus();
    })
  }

  // 获取信息
  private PostData(): void {
    if (this.BatchQualityTestingForm.Code === "") return;
    this.GetCodeInfo()
  }

  // 通过扫描的条码获取到货单信息
  private GetCodeInfo():void {
    ( this.$refs["BatchQualityTestingCode"] as Vue ).blur();
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetPAOInfoByCode,
        Login: true
      },
      Data:  this.BatchQualityTestingForm.Code,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {

          if (Res.Data.PageModel.SkuCode === null || Res.Data.PageModel.SkuCode === "") {
            this.$UI.Tips.Floating('warning', `系统中不存在到货单[${this.BatchQualityTestingForm.Code}]，请重新输入/扫描到货单号`);
            this.FocusInput()
            return;
          }
          if (Res.Data.PageModel.Status !== 2) {
            this.$UI.Tips.Floating('warning', `请扫描/录入状态为待质检的到货单号进行操作`);
            this.FocusInput()
            return;
          }
          // Emit 给兄弟组件 质检
          this.ClearModal(2, Res.Data.PageModel)

        } else {
          this.$Request.Error(Res);
        }
        
      }
    });
  }

  // 聚焦
  private FocusInput():void {
    this.BatchQualityTestingForm.Code = "";
    (this.$refs.BatchQualityTestingCode as any).focus()
  }

  // 关闭模态框
  private ClearModal(Val:number, Target?: Interface.Pao):void {
    this.ModifyModal = false;
    (this.$refs["BatchQualityTestingForm"] as Vue).resetFields()
    this.HandleResMsg(Val, Target);
    this.BatchQualityTestingForm.Code = "";
  }

  private ModifyModal: boolean = false // 控制模态框

  private BatchQualityTestingForm: Interface.SingleCodeForm = new Interface.SingleCodeForm(); // 批量质检表单
  private BatchQualityTestingRule: any = {
    Code: [{ required: true, message: ' ' }]
  }
  
  private QualityTestingCode: string = "" // 到货单号/快递单号

}
</script>

<style lang='less'>
@import '../../../assets/Theme/Color.less';

.Color-Gray{
  color: gray;
}
.Color-Red{
  color: @error-color;
}
.QA-Content{
  width: 100%;
  height: 240px;
  overflow-y: scroll;
}

.demo-upload-list {
  display: inline-block;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  margin: 0 12px;
}
</style>
