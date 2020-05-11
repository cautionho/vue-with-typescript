<!-- ebay 刊登 -->
<template>
  <Row id="eBayPublish">
    <!-- 站点分类 -->
    <SiteAndClassify ref="SiteAndClassify"></SiteAndClassify>
    <!-- 产品细节 -->
    <ProductDetail ref="ProductDetail" v-show="SpecificsResult.length"></ProductDetail>
    <!-- 标题与价格 -->
    <TitleAndPrice ref="TitleAndPrice"></TitleAndPrice>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {Getter, Action} from "vuex-class";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "EBayPublish",
    components: {
      SiteAndClassify: () => import("@/views/Sales/EbayPublish/SiteAndClassify.vue"),
      ProductDetail: () => import("@/views/Sales/EbayPublish/ProductDetail.vue"),
      TitleAndPrice: () => import("@/views/Sales/EbayPublish/TitleAndPrice.vue"),
    }
  })

  export default class EBayPublish extends Vue {
    @Getter private "EbayPublish/FEATURES": Interface.SiteFeatures;

    get SpecificsResult(): Interface.Feature_SpecificsResult[] {
      return this["EbayPublish/FEATURES"].SpecificsResult;
    }

  }
</script>

<style lang="less">
  #eBayPublish {
    overflow-y: auto;

    .required:before {
      content: '*';
      display: inline-block;
      color: red;
    }

    .ivu-card-body {
      & > table {
        width: 100%;
        border: 1px solid #dcdee2;
        border-collapse: collapse;
        font-size: 12px;

        & > tr {
          & > td {
            border: 1px solid #dcdee2;
            padding: 6px 20px;
            text-align: left;

            & > .Fr-Select {
              width: 400px;
            }

            &:first-child {
              width: 200px !important;
              text-align: right;
              font-weight: bold;
            }

            &:nth-child(2) {
              padding: 6px 12px;
            }

            &:last-child {
              width: 20% !important;
            }
          }
          & .ivu-select.ivu-select-single,
          & .ivu-cascader,
          & .ivu-input-wrapper.ivu-input-type-text,
          & .ivu-input-number {
            width: 300px;
          }
        }
      }
    }
  }
</style>