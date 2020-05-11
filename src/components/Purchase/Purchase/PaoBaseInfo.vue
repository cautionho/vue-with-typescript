<template>
	<Row>
    <Col span="18">
      <Form :label-width="150" :model="DetailInfoMsg" ref="PaoBaseInfo" inline>
        <FormItem label="到货单号：" class="P-W-300">
          <span>{{ DetailInfoMsg.OrderCode ? DetailInfoMsg.OrderCode : '-' }}</span>
        </FormItem>
        <FormItem label="采购单号：" class="P-W-300">
          <span>{{ DetailInfoMsg.PurchaseCode ? DetailInfoMsg.PurchaseCode : '-' }}</span>
        </FormItem>
        <FormItem label="快递单号：" class="P-W-300">
          <span>{{ DetailInfoMsg.ExpressCode ? DetailInfoMsg.ExpressCode : '-' }}</span>
        </FormItem>
        <FormItem label="物流公司：" class="P-W-300">
          <span>{{ DetailInfoMsg.ExpressCompany ? DetailInfoMsg.ExpressCompany : '-'}}</span>
        </FormItem>
        <FormItem label="SKU编号：" class="P-W-300">
          <span>{{ DetailInfoMsg.SkuCode ? DetailInfoMsg.SkuCode : '-' }}</span>
        </FormItem>
        <FormItem label="名称：" class="P-W-300">
          <span>{{ DetailInfoMsg.SkuName ? DetailInfoMsg.SkuName : '-' }}</span>
        </FormItem>
        <FormItem label="发货数量：" class="P-W-300">
          <span class="Color-Bold" v-if="DetailInfoMsg.ArrvialQuantity" >{{ DetailInfoMsg.ArrvialQuantity }}</span>
          <span v-else>-</span>
        </FormItem>
        <FormItem label="采购总数：" class="P-W-300" >
          <span class="Color-Bold" v-if="DetailInfoMsg.PurchaseQuantity" >{{DetailInfoMsg.PurchaseQuantity}}</span>
          <span v-else>-</span>
        </FormItem>
        <FormItem label="创建时间：" class="P-W-300">
          <span>{{$UI.Render.Date(DetailInfoMsg.CreateTime, true)}}</span>
        </FormItem>
        <FormItem label="签收时间：" class="P-W-300">
          <span>{{ $UI.Render.Date(DetailInfoMsg.SignTime, true) }}</span>
        </FormItem>
      </Form>
    </Col>
    <Col span="6">
      <div class="demo-upload-list Detail-Picture">
        <img :src="`${$Server.File}/${DetailInfoMsg.DefaultImage}`" height="200" width="200">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="ShowPic(DetailInfoMsg.DefaultImage)"></Icon>
        </div>
      </div>
    </Col>
    <!-- 放大图片 -->
    <ShowBigPic ref="ShowBigPic" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Purchase'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'PaoBaseInfo',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
  }
})
export default class PaoBaseInfo extends Vue {
  @Prop() DetailInfoMsg: Interface.Pao

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }
}

</script>
<style lang="less">
.Color-Bold{
  font-size: 16px;
  font-weight: bold;
  color: red;
}
.Detail-Picture{
  width: 200px;
  height: 200px;
  background-size: cover;
  cursor: pointer;
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
