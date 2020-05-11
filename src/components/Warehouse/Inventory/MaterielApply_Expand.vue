<template>
  <Row>
    <Col span="24">
      <Table class="P-MT-10" size="small" :highlight-row="true" :columns="TableRowHead" :data="TableList" border stripe></Table>
    </Col>
    <!-- 放大图片 -->
    <ShowBigPic ref="ShowBigPic"/>
    <!-- SKU详情 -->
    <SkuDetail ref="SkuDetail" />
  </Row>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "MaterielApply_Expand",
    components: {
      ShowBigPic: () => import("../../../components/Public/ShowBigPic.vue"),
      SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue')
    }
  })
  export default class MaterielApply_Expand extends Vue {
    @Prop() Row: Interface.MaterielApplyTable

    private created(): void {
      this.GetItemDetail();
    }

    private GetItemDetail(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.MaterialApplyGeDetail,
          Login: true
        },
        Data: this.Row.Id,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.TableList.push(...Res.Data.Data.MaterialApplyItems);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 打开大图
    private ShowPic(Url: string): void {
      (this as any).$refs.ShowBigPic.Trigger(Url)
    }

    private TableList: Interface.MaterielApplyDetail[] = [];
    private TableRowHead: PInterface.TableCol[] = [
      {
        title: "图片", key: "Image", width: 80, align: "center", render: (h, params) => {
          return h("div", {
            style: {
              width: "45px",
              height: "45px",
              background: "url(" + this.$Server.File + "/" + params.row.Image + ") no-repeat",
              backgroundSize: "cover",
              margin: "0 auto",
              cursor: "pointer"
            },
            on: {
              click: () => {
                this.ShowPic(params.row.Image);
              }
            }
          })
        }
      },
      {
        title: "SKU编号",
        key: "SkuCode",
        render: (h, params): any => {
          return h("a", {
            on: {
              click: () => {
                (this.$refs["SkuDetail"] as Vue).Trigger((params.row as any).SkuCode);
              }
            }
          }, params.row.SkuCode);
        }
      }, {
        title: "产品名",
        key: "SkuName"
      }, {
        title: "数量",
        key: "Quantity"
      }
    ]
  }
</script>