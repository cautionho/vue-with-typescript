<template>
  <Row>
    <Form :label-width="150" ref="PaoQualityInspection" inline>
      <FormItem label="实际到货数量：" class="P-W-300">
        <span>{{ DetailInfoMsg.ArrvialQuantity ? DetailInfoMsg.ArrvialQuantity : '-' }}</span>
      </FormItem>
      <FormItem label="质检不合格数：" class="P-W-500">
        <span>{{ DetailInfoMsg.NoPassQuantity ? DetailInfoMsg.NoPassQuantity : '-' }}</span>
      </FormItem>
      <FormItem label="质检员：" class="P-W-300">
        <span>{{ DetailInfoMsg.QAUser ? DetailInfoMsg.QAUser : '-' }}</span>
      </FormItem>
      <FormItem label="质检时间：" class="P-W-500">
        <span>{{ $UI.Render.Date(DetailInfoMsg.QATime, true) }}</span>
      </FormItem>
      <FormItem label="备注：" class="P-W-100-Percent">
        <span>{{ DetailInfoMsg.Remark ? DetailInfoMsg.Remark : "-" }}</span>
      </FormItem>
    </Form>
    <h1 class="P-TA-C">质检图片</h1>
    <Col span="24" class="P-MT-10">
      <div v-if="PaoImageList.length > 0">
        <div
          class="Detail-Picture P-MR-5 P-Inline-Block"
          @click="HandleResMsg(Item)"
          v-for="(Item, Index) in PaoImageList"
          :key="Index"
          :style="{ background: `url(${$Server.File}/${Item}) no-repeat` }"
        ></div>
      </div>
      <p v-else class="P-TA-C">暂无质检图片</p>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component,  Vue, Prop, Watch, Emit  } from "vue-property-decorator";
import Interface from "@/assets/Interface/Purchase";
import PInterface from "@/assets/Interface/Public";
@Component({
  name: "QualityTestingResult"
})
export default class QualityTestingResult extends Vue {
  @Prop() DetailInfoMsg: Interface.Pao;
  @Prop() ActivedQuality: boolean;

  @Emit() HandleResMsg(Url: string): void {}

  @Watch("ActivedQuality")
  private TriggerActivedTabs(val: string): void {
    if (val && this.PaoImageList.length < 1) {
      this.GetPAOImage()
    } else {
      this.PaoImageList.splice(0, this.PaoImageList.length);
    }
  }
  private GetPAOImage(): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetPAOImage,
        Login: true
      },
      Data: this.DetailInfoMsg.Id,
      Callback: (res: PInterface.Res): void => {
        if (res.IsSuccess) {
          this.PaoImageList.splice(0, this.PaoImageList.length);
          this.PaoImageList.push(...res.Data.Url);
        } else {
          this.$Request.Error(res);
        }
        this.$UI.Loading.Hide();
      }
    });
  }

  private PaoImageList: string[] = []; // 质检图片数组

}
</script>
<style lang="less"></style>
