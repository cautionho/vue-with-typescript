<template>
  <Modal v-model="IsShowModal" :title="['-', '物流设置模板详情', '屏蔽目的地模板详情', '商品所在地模板详情', '退货设置模板详情', '买家限制模板详情', '收款选项模板详情'][ModalType]" @on-cancel="ClearModal" :mask-closable="false" :width="1200">
    <div id="EBayTemplate">
      <Row class="PointerNo">
        <Col :span="24" v-if="ModalType===1">
          <Card v-if="ShippingInline.length" class="P-PB-10">
            <h3 slot="title">当前站点国家境内物流</h3>
            <table v-for="(Item, Index) in ShippingInline" :key="Index" class="P-MB-10">
              <tr>
                <td class="P-TA-R">境内运输方式{{ Index+1 }}：</td>
                <td>
                  <p>{{ Item.ShippingService || '-'}}</p>
                  <p v-if="Item.IsFreeShipping">
                    <Checkbox :value="true">{{ 'Free P&P' }}</Checkbox>
                  </p>
                </td>
              </tr>
              <tr>
                <td class="P-TA-R">首件运费：</td>
                <td>{{ Item.ShippingCost }} USD</td>
              </tr>
              <tr>
                <td class="P-TA-R">续件运费：</td>
                <td>{{ Item.AdditionalCost }} USD</td>
              </tr>
            </table>
          </Card>
          <Card v-if="ShippingOut.length" class="P-MB-10">
            <h3 slot="title">当前站点国家境外物流</h3>
            <table v-for="(Item, Index) in ShippingOut" :key="Index" class="P-MB-10">
              <tr>
                <td class="P-TA-R">境外运输方式{{ Index+1 }}：</td>
                <td>
                  <p>{{ Item.ShippingService ||'-' }}</p>
                  <p v-if="Item.IsFreeShipping">
                    <Checkbox :value="true">{{ 'Free P&P' }}</Checkbox>
                  </p>
                </td>
              </tr>
              <tr>
                <td class="P-TA-R">首件运费：</td>
                <td>{{ Item.ShippingCost }} USD</td>
              </tr>
              <tr>
                <td class="P-TA-R">续件运费：</td>
                <td>{{ Item.AdditionalCost }} USD</td>
              </tr>
              <tr>
                <td class="P-TA-R">可运至的国家：</td>
                <td>
                  <RadioGroup :value="Item.CountryIds.length===12 ? 1:2">
                    <Radio :label="1">全球</Radio>
                    <Radio :label="2">自由选择</Radio>
                  </RadioGroup>
                  <F-CheckboxGroup :options="DropCountry" v-model="Item.CountryIds" class="P-MT-5"/>
                </td>
              </tr>
            </table>
          </Card>
          <div style="padding: 0 16px">
            <table>
              <tr>
                <td class="P-TA-R">已选择的屏蔽目的地：</td>
                <td>
                  <p>{{ ShieldedTarget }}</p>
                </td>
              </tr>
              <tr>
                <td class="P-TA-R">备货时间：</td>
                <td>{{ OperateForm.DispatchTimeMax ||'-' }} 天</td>
              </tr>
              <tr>
                <td class="P-TA-R">加入全球运输计划：</td>
                <td>
                  <RadioGroup :value="OperateForm.GlobalShipping ? 1 : 2">
                    <Radio :label="1">加入</Radio>
                    <Radio :label="2">不加入</Radio>
                  </RadioGroup>
                </td>
              </tr>
              <tr>
                <td class="P-TA-R">Tax：</td>
                <td>
                  <Row>
                    <Col span="24">
                      <span class="P-MR-10">{{OperateForm.SalesTaxState}}</span>
                      <span class="P-MR-30">{{ OperateForm.SalesTaxPercent }} % </span>
                      <Checkbox :value="OperateForm.ShippingIncludedInTax">运费加税</Checkbox>
                    </Col>
                  </Row>
                </td>
              </tr>
              <tr>
                <td class="P-TA-R">Local PickUp：</td>
                <td>
                  <RadioGroup :value="OperateForm.LocalPickup ? 1 : 2">
                    <Radio :label="1">允许</Radio>
                    <Radio :label="2">不允许</Radio>
                  </RadioGroup>
                </td>
              </tr>
            </table>
          </div>
        </Col>
        <Col :span="24" v-if="ModalType===2">
          <div style="max-height: 800px;overflow: auto;">
            <p v-for="(Item, Index) in EbayExcludeShippingLocations[SiteId]" :key="Index" class="P-MB-5">
              <Checkbox :indeterminate="GetHasIndeterminate(Item.Dtail)" :value="GetCheckBoxValue(Item.Dtail)">{{ Item.Region }}</Checkbox>
              <F-CheckboxGroup :options="GetExcludeKV(Item.Dtail)" v-model="OperateForm.EbayCountryIds" class="P-ML-20"/>
            </p>
          </div>
        </Col>
        <Col :span="24" v-if="ModalType===3">
          <table>
            <tr>
              <td class="P-TA-R">商品地址：</td>
              <td>
                {{ OperateForm.ProductUrl || '-' }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">国家或地区：</td>
              <td>
                {{ OperateForm.CountryCode || '-' }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">邮编：</td>
              <td>
                {{ OperateForm.PostCode || '-' }}
              </td>
            </tr>
          </table>
        </Col>
        <Col :span="24" v-if="ModalType===4">
          <table>
            <tr>
              <td class="P-TA-R">接受退货：</td>
              <td>
                {{ ['-', 'Returns Accepted', 'No Returns Accepted'][Number(OperateForm.AcceptReturns)] }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">退货方式：</td>
              <td>
                {{ ['-', 'Money Back', 'Money Back Or Replacement'][Number(OperateForm.ReturnMethod)] }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">接受退货期限：</td>
              <td>
                {{ OperateForm.ReturnPeriod || '-' }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">退货运费承担：</td>
              <td>
                {{ ['-', 'Buyer', 'Seller'][Number(OperateForm.FreightBurden)] }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">国际接受退货：</td>
              <td>
                {{ ['-', 'Returns Accepted', 'No Returns Accepted'][Number(OperateForm.IntAcceptReturns)] }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">国际退货方式：</td>
              <td>
                {{ ['-', 'Money Back', 'Money Back Or Replacement'][Number(OperateForm.IntReturnMethod)] }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">国际接受退货期限：</td>
              <td>
                {{ OperateForm.IntReturnPeriod || "-" }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">国际退货运费承担：</td>
              <td>
                {{ ['-', 'Buyer', 'Seller'][Number(OperateForm.IntFreightBurden)]}}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">退货说明：</td>
              <td>
                {{ OperateForm.Description||'-' }}
              </td>
            </tr>
          </table>
        </Col>
        <Col :span="24" v-if="ModalType===5">
          <table>
            <tr>
              <td class="P-TA-R">买家不付款订单相关：</td>
              <td>
                <p>未付款次数：{{ OperateForm.UnpaidFrequency||'-' }}</p>
                <p>违规时段：{{ ['-', '30天', '180天', '360天'][Number(OperateForm.ViolationPeriod)] }}内</p>
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">10天期间限制拍卖次数：</td>
              <td>
                <p>限制拍卖次数小于或等于：{{ OperateForm.LimitAuctionFrequency ||'-'}}</p>
                <p>反馈分数：{{ OperateForm.FeedbackScore ||'-'}}</p>
              </td>
            </tr>
          </table>
        </Col>
        <Col :span="24" v-if="ModalType===6">
          <table>
            <tr>
              <td class="P-TA-R">收款方式：</td>
              <td>
                {{ OperateForm.PaymentMethod.join(",") }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">收款PayPal账号：</td>
              <td>
                {{ OperateForm.PayPalEmail || '-' }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">要求买家立即付款：</td>
              <td>
                {{ OperateForm.IsImmediatePayment ? '是' : '否' }}
              </td>
            </tr>
            <tr>
              <td class="P-TA-R">付款说明：</td>
              <td>
                {{ OperateForm.Description || '-' }}
              </td>
            </tr>
          </table>
        </Col>
      </Row>
    </div>
    <footer slot="footer">
      <Button @click="ClearModal">取消</Button>
    </footer>
  </Modal>
</template>

<script lang="ts">
  import {Component, Prop, Emit, Vue, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public"
  import Interface from "@/assets/Interface/Sales"

  @Component({
    name: "DetailEBayPublicTempl",
  })
  export default class DetailEBayPublicTempl extends Vue {
    get ShippingInline(): Interface.EbayTempShippingItemResultModel[] {
      if (this.ModalType === 1 && this.OperateForm) {
        return (this.OperateForm as Interface.EbayTempShippingResultModel).ItemModels.filter(Item => Item.ShippingType === 1)
      } else {
        return [];
      }
    }

    get ShippingOut(): Interface.EbayTempShippingItemResultModel[] {
      if (this.ModalType === 1 && this.OperateForm) {
        return (this.OperateForm as Interface.EbayTempShippingResultModel).ItemModels.filter(Item => Item.ShippingType === 2)
      } else {
        return [];
      }
    }

    private GetExcludeKV(Data: Interface.EbayExcludeShippingLocationsDetail[]): PInterface.KV[] {
      return Data.map((Item) => {
        return {Key: Item.Description, Value: Item.Id}
      })
    }

    private GetHasIndeterminate(Data: Interface.EbayExcludeShippingLocationsDetail[]): boolean {
      let Ids = Data.map((Item) => Item.Id);
      let Num = 0;
      for (let Item of Data.map((Item) => Item.Id)) {
        if ((this.OperateForm as Interface.EbayTempExcludeCountryResultModel).EbayCountryIds.includes(Item)) {
          Num++;
        }
      }
      return Num !== 0 && Data.length !== Num ? true : false;
    }

    private GetCheckBoxValue(Data: Interface.EbayExcludeShippingLocationsDetail[]): boolean {
      return Data.map((Item) => Item.Id).every((Item, Idx) => (this.OperateForm as Interface.EbayTempExcludeCountryResultModel).EbayCountryIds.includes(Item));
    }

    private async OpenModal({Id, SiteId, TempType}: { Id: number, SiteId: number, TempType: number }): Promise<void> {
      this.TemplId = Id;
      this.SiteId = SiteId;
      if ([1, 2].includes(TempType) && this.EbayExcludeShippingLocations[this.SiteId] === undefined) {
        (this.EbayExcludeShippingLocations[this.SiteId] as any) = await this.GetGetEbayExcludeShippingLocations();
      }
      if (TempType === 1 && this.DropEbayTax.length === 0) {
        this.$set(this, "DropEbayTax", await this.GetCategoryFeaturesSite());
      }
      await this.GetTemplateDetail(TempType);
      console.log(this.EbayExcludeShippingLocations[this.SiteId]);
    }

    // 根据站点获取可屏蔽国家
    private GetGetEbayExcludeShippingLocations(): Promise<Interface.EbayExcludeShippingLocations | undefined> {
      return new Promise(resolve => {
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.GetEbayExcludeShippingLocations,
            Login: true
          },
          Data: this.SiteId,
          Callback: (Res: PInterface.Res): void => {
            if (!Res.IsSuccess) {
              this.$Request.Error(Res);
            }
            resolve(JSON.parse(JSON.stringify(Res.Data.Data)) || undefined);
          }
        })
      })
    }

    // 根据站点获取其他信息
    private GetCategoryFeaturesSite(): Promise<PInterface.KV[]> {
      return new Promise(resolve => {
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.EbayCategoryFeaturesGetSiteList,
            Login: true
          },
          Data: this.SiteId,
          Callback: (Res: PInterface.Res): void => {
            if (!Res.IsSuccess) {
              this.$Request.Error(Res);
            }
            resolve(JSON.parse(JSON.stringify(Res.Data.Data.filter((Item: Interface.SiteOther) => Item.SiteId === this.SiteId)[0].Taxs || [])));
          }
        })
      })
    }

    // 获取模板数据信息
    private GetTemplateDetail(TempType: number): void {
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.EbayGetTempInfo,
          Login: true
        },
        Data: {
          Id: this.TemplId,
          Type: TempType,
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$set(this, "OperateForm", Res.Data.Data);
            if (TempType === 1) {
              this.$set(this, "ShieldedTarget", this.GetSelectedExcludeShippingLocations() || "-");
            }
            this.ModalType = TempType;
            this.IsShowModal = true;
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private GetSelectedExcludeShippingLocations(): string {
      let List: string[] = [];
      for (let Item of this.EbayExcludeShippingLocations[this.SiteId]) {
        List.push(...Item.Dtail.filter(Val => (this.OperateForm as Interface.EbayTempShippingResultModel).ExcludeCountry.EbayCountryIds.includes(Val.Id)).map((Val) => Val.Description));
      }
      return List.join(",")
    }

    private ClearModal(): void {
      this.IsShowModal = false;
    }

    private IsShowModal: boolean = false;
    private ModalType: number = 0; // 模态框类型
    private TemplId: number = 0; //  模板ID
    private SiteId: number = 0; // 站点ID
    private EbayExcludeShippingLocations: Interface.EbayExcludeShippingLocations = [];
    private DropEbayTax: PInterface.KV[] = [];
    private OperateForm: Interface.EbayTempShippingResultModel | Interface.EbayTempExcludeCountryResultModel | Interface.EbayTempProductLocationResultModel | Interface.EbayTempReturnsSettingsResultModel | Interface.EbayTempBuyerRestrictionsResultModel | Interface.EbayTempCollectionOptionResultModel | null = null;
    private ShieldedTarget: string = ""; // 已选择的屏蔽目的地
    private DropCountry: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.CountryBox)	//时间类型下拉
  }
</script>

<style scoped lang="less">
  #EBayTemplate {
    max-height: 650px;
    overflow: auto;

    .PointerNo {
      pointer-events: none;
    }

    table {
      width: 100%;
      border: 1px solid #dcdee2;
      border-collapse: collapse;
      font-size: 12px;

      tr {
        &:last-child {
          margin-bottom: 0;
        }

        & > td {
          border: 1px solid #dcdee2;
          padding: 6px;
          text-align: left;

          &:nth-child(1) {
            width: 200px;
            text-align: right;
            padding-right: 20px;
            font-weight: bold;
          }

          &:nth-child(2) {
            padding-left: 12px;

            & .ivu-select.ivu-select-single,
            & .ivu-cascader,
            & .ivu-input-wrapper.ivu-input-type,
            & .ivu-input-number {
              //width: 220px;
              width: 420px;
            }
          }
        }
      }
    }
  }
</style>