<template>
  <Col :span="24" class="P-MT-20">
    <Card>
      <p slot="title">标题与价格</p>
      <table>
        <tr>
          <td>SKU：</td>
          <td>
            <p>
              <Input v-model.trim="OperateForm.PlatformSkuCode" @on-enter="RelevancySysSku" @on-change="ResetPlatformSkuCode" type="text" placeholder="请输入SKU" class="P-MR-10"></Input>
              <Button type="primary" size="small" @click="RelevancySysSku" class="P-MR-10">关联系统SKU</Button>
              <Button type="primary" size="small" @click="GetInventory">匹配库存</Button>
            </p>
            <p v-if="OperateForm.SkuCode">
              {{ OperateForm.SkuCode }}
              <Tag :color="
                [5,8].includes(SysSkuStatus) ? 'error' :
                [4,7].includes(SysSkuStatus) ? 'warning' : 'primary'
              ">{{[,'待完善','预售','在售','待清','清完','热售','待暂停','已暂停'][SysSkuStatus]}}
              </Tag>
            </p>
          </td>
          <td>未设置多属性时必填。如果设置了多属性，则不需要填写。</td>
        </tr>
        <tr>
          <td class="required">刊登标题：</td>
          <td>
            <Input v-model.trim="OperateForm.Title" type="text" placeholder="请输入刊登标题" class="P-MR-10 P-MB-5"></Input>
            <div>
              <Button type="primary" size="small" @click="GetDisabledKey" class="P-MR-10">{{ShowDisabledKey ? '隐藏禁用关键字':'显示禁用关键字'}}</Button>
              <Button type="primary" size="small" @click="VerifyTitleRetry">检查标题重复</Button>
              <p v-show="ShowDisabledKey" class="P-MT-5">
                <Tag v-for="(Item,Index) in DropDisabled" :key="Index" color="primary">{{ Item.Keywords }}</Tag>
              </p>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>刊登副标题（$）：</td>
          <td><Input v-model="OperateForm.SubTitle" placeholder="请输入刊登副标题"></Input></td>
          <td></td>
        </tr>
        <tr>
          <td>数量：</td>
          <td>
            <InputNumber v-model="OperateForm.Quantity" :min="0" :precision="0" :disabled="BASE.ListingType === 1" placeholder="请输入数量"></InputNumber>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>LotSize：</td>
          <td>
            <InputNumber v-model="OperateForm.LotSize" :min="0" :precision="0" placeholder="请输入LotSize"></InputNumber>
          </td>
          <td></td>
        </tr>
        <tr>
          <td class="required">上架时间：</td>
          <td><Select placeholder="请选择上架时间" v-model="OperateForm.ListingDuration" :disabled="BASE.ListingType===''||BASE.CategoryId.length===0" :options="DropPutawayTime"/></td>
          <td></td>
        </tr>
        <tr v-show="BASE.ListingType===8">
          <td>价格：</td>
          <td>
            <InputNumber v-model="OperateForm.StartPrice" :min="0" placeholder="请输入价格"></InputNumber>
            {{BASE.Currency}}
          </td>
          <td>多属性Listing可不填</td>
        </tr>
        <tr v-show="BASE.ListingType===8 && BASE.CategoryId.length && BestOfferEnabled">
          <td>Best Offer：</td>
          <td>
            <F-RadioGroup :options="UseBestOfferRadio" v-model="OperateForm.UseBestOffer" :onChange="ChangeUseBestOffer"/>
            <div v-show="OperateForm.UseBestOffer">
              <p>
                <span>自动交易价格>=</span>
                <InputNumber v-model="OperateForm.BestOfferAcceptPrice" :min="0" placeholder="请输入自动交易价格" class="P-ML-5 P-MR-5"></InputNumber>
                <span v-text="BASE.Currency"></span>
              </p>
              <p>
                <span>自动拒绝价格<=</span>
                <InputNumber v-model="OperateForm.MinBestOfferPrice" :min="0" placeholder="请输入自动拒绝价格" class="P-ML-5 P-MR-5"></InputNumber>
                <span v-text="BASE.Currency"></span>
              </p>
            </div>
          </td>
          <td></td>
        </tr>
        <tr v-show="BASE.ListingType===1">
          <td class="required">拍卖底价：</td>
          <td>
            <InputNumber v-model="OperateForm.StartPrice" :min="0" placeholder="请输入拍卖底价"></InputNumber>
            <span v-text="BASE.Currency"></span>
          </td>
          <td></td>
        </tr>
        <tr v-show="BASE.ListingType===1">
          <td class="required">保底拍卖价：</td>
          <td>
            <InputNumber v-model="OperateForm.ReservePrice" :min="0" placeholder="请输入保底拍卖价"></InputNumber>
            <span v-text="BASE.Currency"></span>
          </td>
          <td></td>
        </tr>
        <tr v-show="BASE.ListingType===1">
          <td class="required">一口价：</td>
          <td>
            <InputNumber v-model="OperateForm.BuyItNowPrice" :min="0" placeholder="请输入一口价"></InputNumber>
            <span v-text="BASE.Currency"></span>
          </td>
          <td></td>
        </tr>
        <tr v-show="BASE.ListingType===1">
          <td class="required">SecondOffer：</td>
          <td>
            <span>大于或等于</span>
            <InputNumber v-model="OperateForm.SecondOffer" :min="0" placeholder="请输入SecondOffer"></InputNumber>
            <span v-text="BASE.Currency"></span>
          </td>
          <td>系统将自动在拍卖贴结束后，为拍卖价格超过您设置价格的买家自动发送SecondOffer</td>
        </tr>
        <tr v-show="IsShowVAT">
          <td>VAT税率：</td>
          <td>
            <InputNumber v-model="OperateForm.VATPercent" :min="0" placeholder="请输入VAT税率"></InputNumber>
            <span>%</span>
          </td>
          <td></td>
        </tr>
      </table>
    </Card>
  </Col>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {Getter, Action} from "vuex-class";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "TitleAndPrice",
    components: {}
  })
  export default class TitleAndPrice extends Vue {
    @Getter private "EbayPublish/BASE": Interface.SiteAndClassify;
    @Getter private "EbayPublish/FEATURES": Interface.SiteFeatures;

    @Watch("BASE.ListingType", {immediate: true, deep: true})
    private WatchBASE(Type: number | ""): void {
      this.$set(this.OperateForm, "Quantity", Type === 1 ? 1 : "");
      this.$set(this.OperateForm, "ListingDuration", "");
      this.$set(this.OperateForm, "StartPrice", "");
      this.$set(this.OperateForm, "UseBestOffer", 0);
      this.$set(this.OperateForm, "BestOfferAcceptPrice", "");
      this.$set(this.OperateForm, "MinBestOfferPrice", "");
      this.$set(this.OperateForm, "UpsetPrice", "");
      this.$set(this.OperateForm, "ReservePrice", "");
      this.$set(this.OperateForm, "BuyItNowPrice", "");
      this.$set(this.OperateForm, "SecondOffer", "");
    }

    get BASE(): Interface.SiteAndClassify {
      return this["EbayPublish/BASE"];
    }

    get FEATURES(): Interface.SiteFeatures {
      return this["EbayPublish/FEATURES"];
    }

    get DropPutawayTime(): string[] {
      let List = this.FEATURES.FeaturesResult.categoryFeatures[0] ? this.FEATURES.FeaturesResult.categoryFeatures[0].ListingDurations.filter((Item) => Item.DurationSet == (this.BASE.ListingType === 1 ? "chineseSet" : "fixedPriceItemSet")) : [];
      return List.length ? List[0].Duration.map((Item: string): any => {
        return {Key: Item, Value: Item}
      }) : [];
    }

    get BestOfferEnabled(): boolean {
      return this.FEATURES.FeaturesResult.categoryFeatures[0] ? this.FEATURES.FeaturesResult.categoryFeatures[0].BestOfferEnabled : false;
    }

    get IsShowVAT(): boolean {
      return this.VATSiteId.some((Item) => Item === this.BASE.SiteId);
    }

    private mounted(): void {
      this.$set(this.OperateForm, "LotSize", 0);
      this.$set(this.OperateForm, "UseBestOffer", 0);
    }

    private RelevancySysSku(): void {
      if (this.OperateForm.PlatformSkuCode === "") {
        this.$UI.Tips.Floating("warning", `请输入SKU后操作`);
        return;
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.SkuGetEnableList,
          Login: true
        },
        Data: {
          "PageIndex": 1,
          "PageSize": 20,
          "SortField": "",
          "SortOrder": "",
          "Conditions": {
            SearchType: 1, // 关键字类型：1-SKU编号；2-名称；3-英文名；4-海关编码；5-申报中文；6-申报英文
            SearchKey: this.OperateForm.PlatformSkuCode,
            IsAlias: true,
            Platfrom: "",
            Attribute: "",
            DevUserId: "",
            Purchaser: "",
            SaleManager: "",
            DevManager: "",
            Status: "",
            BrandId: "",
            CategoryId: "",
            MainId: "",
            PropertyType: 3, // 属性类型：1-spu；2-sku；传空默认为sku类型
            Spus: "",
            IsNotFilterSkuBind: true
          }
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            let Item = Res.Data.PageModel.Items[0];
            if (Item) {
              this.SysSkuStatus = Item.Status;
              this.$set(this.OperateForm, "SkuCode", Item.SkuCode);
              this.$UI.Tips.Floating("success", "关联系统SKU成功");
            } else {
              this.$set(this.OperateForm, "SkuCode", "");
              this.$UI.Tips.Floating("warning", "关联系统SKU失败");
            }
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private GetInventory(): void {
    }

    private ResetPlatformSkuCode(): void {
      this.$set(this.OperateForm, "SkuCode", "");
    }

    private GetDisabledKey(): void {
      if (this.ShowDisabledKey) {
        this.$set(this, "ShowDisabledKey", false);
        return;
      } else if (this.DropDisabled.length) {
        this.$set(this, "ShowDisabledKey", true);
      } else {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Settings,
          Api: {
            Address: this.$Api.SaleDisableKeywordsGetDisableKeywords,
            Login: true
          },
          Data: 1,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.DropDisabled.push(...Res.Data.Data);
              this.$set(this, "ShowDisabledKey", true);
            } else {
              this.$Request.Error(Res);
            }
            this.$UI.Loading.Hide();
          }
        })
      }
    }

    private ChangeUseBestOffer(): void {
      this.$set(this.OperateForm, "BestOfferAcceptPrice", "");
      this.$set(this.OperateForm, "MinBestOfferPrice", "");
    }

    private VerifyTitleRetry(): void {
      if (this.OperateForm.Title === "") {
        this.$UI.Tips.Floating('warning', '请输入刊登标题后操作');
        return;
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.ShelvesEBayListingsVerifyShelvesListingTitle,
          Login: true
        },
        Data: {
          Id: 0,
          Title: this.OperateForm.Title
        },
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.$UI.Tips.Floating('success', '该标题检查正常，不存在重复');
          } else {
            this.$Request.Error(res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private OperateForm: Interface.TitleAndPrice = new Interface.TitleAndPrice();
    private SysSkuStatus: number = 0; // 系统SKU状态
    private ShowDisabledKey: boolean = false; // 是否显示禁用关键字
    private DropDisabled: Interface.DisableKeyList[] = [];
    private UseBestOfferRadio: PInterface.KV[] = [{Key: "开启", Value: 1}, {Key: "关闭", Value: 0}];
    private VATSiteId: number[] = [2, 3, 15, 16, 23, 71, 77, 100, 101, 123, 146, 186, 193, 201, 203, 205, 207, 210, 211, 212, 216]; // 显示VAT税率的站点
  }
</script>

<style lang="less"></style>