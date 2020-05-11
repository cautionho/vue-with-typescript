<template>
  <Modal v-model="ShowModal" title="SKU详情" @on-cancel="ClearModal(0)" :mask-closable="false" width='1000'>
    <Form inline :label-width="100" :model="SkuDetails" ref="SkuDetails"  onsubmit="return false;" name="SkuDetails" class="Container-Tabs">
      <Tabs name="SkuDetail" type="card" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" >
        <TabPane label="基本信息" name="Base" tab="SkuDetail">
          <Col span="17" class="P-MR-20">
            <Form-item label="产品名：" class="P-W-100-Percent">
              {{ SkuDetails.SkuInformation.SkuName }}
            </Form-item>
            <Form-item label="英文名：" class="P-W-100-Percent">
              {{ SkuDetails.SkuInformation.SkuNameEn }}
            </Form-item>
            <Form-item label="SKU编号：" class="P-W-100-Percent" >
              {{ SkuDetails.SkuInformation.SkuCode }}
            </Form-item>
            <Form-item label="特性标签：" class="P-W-100-Percent">
              <span v-for="(Item, Index) in SkuDetails.SkuAttribute" :key="Index">{{Item.AttributeName}}{{Index === SkuDetails.SkuAttribute.length -1 ? '' : ','}}</span>
            </Form-item>
            <Form-item label="销售关键字：" class="P-W-100-Percent">
              {{ SkuDetails.SkuInformation.SaleKeyWords }}
            </Form-item>
          </Col>
          <Col span="6" class="P-TA-C">
            <div class="demo-upload-list" style="width:200px; height:200px;" v-if="SkuDetails.SkuInformation.DefaultImage !== undefined">
              <img :src="`${$Server.File}/${SkuDetails.SkuInformation.DefaultImage}`" height="200" width="200">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="ShowPic(SkuDetails.SkuInformation.DefaultImage)"></Icon>
              </div>
            </div>
          </Col>
          <Col span="24">
            <Form-item label="品类：" class="P-W-49-Percent">
              {{ SkuDetails.SkuInformation.CategoryName }}
            </Form-item>
            <Form-item label="品牌：" class="P-W-49-Percent">
              {{ SkuDetails.SkuInformation.BrandName }}
            </Form-item>
            <Form-item label="平台：" class="P-W-49-Percent">
              {{ $Enums.Sales.Platform[SkuDetails.SkuInformation.Platform] }}
            </Form-item>
            <Form-item label="状态：" class="P-W-49-Percent">
              {{ $Enums.Warehouse.SkuStatus[SkuDetails.SkuInformation.Status] }}
            </Form-item>
            <Form-item label="产品经理：" class="P-W-49-Percent">
              {{ SkuDetails.SkuInformation.DevManagerName }}
            </Form-item>
            <Form-item label="采购员：" class="P-W-49-Percent">
              {{ SkuDetails.SkuInformation.PurchaserName }}
            </Form-item>
            <Form-item label="开发员：" class="P-W-49-Percent">
              {{ SkuDetails.SkuInformation.DevUserName }}
            </Form-item>
            <Form-item label="销售主管：" class="P-W-49-Percent">
              {{ SkuDetails.SkuInformation.SaleManagerName }}
            </Form-item>
            <Form-item label="创建时间：" class="P-W-49-Percent">
              {{ $UI.Render.Date( SkuDetails.SkuInformation.CreateTime, true) }}
            </Form-item>
            <Form-item label="备注：" class="P-W-100-Percent">
              {{ SkuDetails.SkuInformation.Remark }}
            </Form-item>
          </Col>
        </TabPane>
        <TabPane label="产品描述" name="Description" tab="SkuDetail">
          <Row>
            <Col span="24">
              <div class="Max-Height" v-html="SkuDetails.SkuInformation.Description"></div>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="上架图片" name="Images" tab="SkuDetail">
          <Row>
            <Col span="24" class="Max-Height">
              <div class="demo-upload-list Detail-Picture" v-for="Item in SkuDetails.SkuImages">
                <img :src="`${$Server.File}/${Item.ImageUrl}`" height="200" width="200">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="ShowPic(Item.ImageUrl)"></Icon>
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
        <Tab-pane label="参考尺寸表" name="Sizes" tab="SkuDetail">
          <Row>
            <Col span="24">
              <div class="Max-Height" v-html="SkuDetails.SkuInformation.Sizes"></div>
            </Col>
          </Row>
        </Tab-pane>
        <Tab-pane label="体积/重量" name="VolumeWeight" tab="SkuDetail">
          <Row>
            <Col span="12">
              <Form-item label="长（cm）：" class="P-W-100-Percent">
                {{ SkuDetails.SkuInformation.Length }}
              </Form-item>
              <Form-item label="高（cm）："  class="P-W-100-Percent">
                {{ SkuDetails.SkuInformation.Height }}
              </Form-item>
              <Form-item label="净重（g）："  class="P-W-100-Percent">
                {{ SkuDetails.SkuInformation.NetWeight }}
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="宽（cm）："  class="P-W-100-Percent">
                {{ SkuDetails.SkuInformation.Width }}
              </Form-item>
              <Form-item label="毛重（g）："  class="P-W-100-Percent">
                {{ SkuDetails.SkuInformation.GrossWeight }}
              </Form-item>
              <Form-item label="整箱数："  class="P-W-100-Percent">
                {{ SkuDetails.SkuInformation.Pcs }}
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="备注：" class="P-W-100-Percent">
                {{ SkuDetails.SkuInformation.WeightRemark }}
              </Form-item>
            </Col>
          </Row>
        </Tab-pane>
        <Tab-pane label="申报信息" name="Declare" tab="SkuDetail">
          <Form-item label="海关编码：" class="P-W-100-Percent" >
            {{ SkuDetails.SkuDeclare.DeclareCode }}
          </Form-item>
          <Form-item label="申报价格：" class="P-W-100-Percent">
            {{ SkuDetails.SkuDeclare.DeclareAmout }}USD
            </Input>
          </Form-item>
          <Form-item label="申报中文名称：" class="P-W-100-Percent">
            {{ SkuDetails.SkuDeclare.DeclareNameCN }}
          </Form-item>
          <Form-item label="申报英文名称：" class="P-W-100-Percent">
            {{ SkuDetails.SkuDeclare.DeclareName }}
          </Form-item>
        </Tab-pane>
        <TabPane label="捆绑SKU" name="SkuBind" tab="SkuDetail" v-if="SkuDetails.SkuBind.length > 0">
          <Table :columns="Col" :data="SkuDetails.SkuBind" size="small" stripe :height="600"></Table>
        </TabPane>
      </Tabs>
    </Form>
    <!-- 放大图片 -->
    <ShowBigPic ref="ShowBigPic" />
    <footer slot="footer">
      <Button @click="ClearModal(0)">返回</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Interface from "@/assets/Interface/Product";
import PInterface from "@/assets/Interface/Public";
@Component({
  name: "SkuDetail",
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class SkuDetail extends Vue {
  // 打开模态框
  private Trigger(SkuCode: string):void {
    this.GetSkuDetails(SkuCode)
  }

  // 切换tab页
  private ChangeTabs(Val: string) {
    this.ActiveTab = Val;
    if (Val === 'Images' && this.IsLoadImage) {
      this.IsLoadImage = false;
      this.GetSkuImage(this.SkuDetails.SkuInformation.Id)
    }
    if (Val === 'Declare' && this.IsLoadDeclare) {
      this.IsLoadDeclare = false;
      this.GetSkuDeclare(this.SkuDetails.SkuInformation.Id)
    }
  }

  // 获取SKU信息
  private GetSkuDetails(Code: string): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuInfoByCode,
        Login: true
      },
      Data: Code,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this.SkuDetails, 'SkuInformation', Res.Data.Data)

          this.GetSkuAttribute( this.SkuDetails.SkuInformation.Id )
          
          this.ShowModal = true; 

          if (!Res.Data.Data.HasProperty) {
            this.GetBindSku(this.SkuDetails.SkuInformation.Id)
          }

        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  // 获取特性标签
  private GetSkuAttribute(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuAttribute,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          console.log(this.SkuDetails.SkuAttribute)
          this.SkuDetails.SkuAttribute.splice(0, this.SkuDetails.SkuAttribute.length, ...Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取上架图片
  private GetSkuImage(Id: number): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuImages,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.SkuDetails.SkuImages.splice(0, this.SkuDetails.SkuImages.length, ...Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  // 获取申报信息
  private GetSkuDeclare(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuDeclare,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this.SkuDetails, 'SkuDeclare', Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取捆绑SKU
  private GetBindSku(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuBind,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.SkuDetails.SkuBind.splice(0, this.SkuDetails.SkuBind.length, ...Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.ShowModal = false;
    this.SkuDetails = new Interface.SkuDetails();
    this.IsLoadImage = true;
    this.IsLoadDeclare = true;
    this.ActiveTab = "Base"
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }

  private ShowModal: boolean = false;  //模态框

  private ActiveTab: string = "Base"; //tab索引值

  private SkuDetails: Interface.SkuDetails = new Interface.SkuDetails() // SKU详情

  private IsLoadImage: boolean = true; //是否加载上架图片
  private IsLoadDeclare: boolean = true; //是否加载申报信息

  // 表头
  private Col: PInterface.TableCol[] = [
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.DefaultImage)
            }
          }
        })
      }
    },
    { title: "SKU编号", key: "SkuCode", width: 150},
    { title: '名称', key: "SkuName", render: (h: any, params: any): string => {
      return h('Tooltip', {
        props: {
          'content': (params.row as any).SkuName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', (params.row as any).SkuName )
      ])
    }},
    { title: "数量", key: "Quantity", width: 120}
  ];

}
</script>

<style lang="less">
.Max-Height {
  max-height: 600px;
  overflow: auto;
}
.Table-Title {
  text-align: center;
  width: 100%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #dddee1;
  border-bottom: 0px;
  font-size: 14px;
  font-weight: bolder;
}
.Cont-Wrap{
  border: 1px solid #dddee1;
  overflow: auto;
  .Cont-Title{
    line-height: 38px;
    height: 32px;
    border: 0;
    text-align: center;
    padding: 1px 6px;
    font-size: 14px;
    font-weight: bolder;
    background-color: #f7f7f8;
  }
  .Cont-Body {
    padding:12px 24px
  }
}
.Detail-Picture{
  width: 200px;
  height: 200px;
  display: inline-block;
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
