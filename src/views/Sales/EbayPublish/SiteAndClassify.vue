<template>
  <Col :span="24">
    <Card>
      <p slot="title">刊登站点与分类</p>
      <table>
        <tr>
          <td class="required">站点：</td>
          <td>
            <Select v-model="OperateForm.SiteId" :options="DropSite" :onChange="SyncChangeSite" class="P-Inline-Block" placeholder="请选择站点"/>
            <F-CheckboxGroup :options="DropCrossBorderTrade" v-model="OperateForm.CrossBorderTrade" class="P-Inline-Block P-MT-5 P-ML-10"/>
          </td>
          <td></td>
        </tr>
        <tr>
          <td class="required">出售方式：</td>
          <td>
            <Select v-model="OperateForm.ListingType" :options="DropListingType" placeholder="请选择出售方式"/>
          </td>
          <td></td>
        </tr>
        <tr>
          <td class="required">币种：</td>
          <td>
            <Select v-model="OperateForm.Currency" :options="DropCurrency" :disabled="DropCurrency.length<=1" placeholder="请选择币种"/>
          </td>
          <td></td>
        </tr>
        <tr>
          <td class="required">刊登分类：</td>
          <td>
            <Cascader v-model="OperateForm.CategoryId" :load-data="GetNextCategory" @on-change="SyncChangeWrite_A" :data="DropCategory_A" :disabled="IsDisabled" placeholder="请选择刊登分类" clearable filterable
                      class="P-Inline-Block P-MR-10"></Cascader>
            <span class="P-MR-10">或直接输入类目ID</span>
            <Input type="text" v-model="OperateForm.WriteCategoryId" @on-keyup="SyncChangeCategory" :disabled="IsDisabled" number placeholder="请输入类目ID"></Input>
            <div>{{ToStr_CategoryId}}</div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>刊登分类2($)：</td>
          <td>
            <Cascader v-model="OperateForm.SecondaryCategoryId" :load-data="GetNextCategory" @on-change="SyncChangeWrite_B" :data="DropCategory_B" :disabled="IsDisabled" placeholder="请选择刊登分类" clearable filterable
                      class="P-Inline-Block P-MR-10"></Cascader>
            <span class="P-MR-10">或直接输入类目ID</span>
            <Input type="text" v-model="OperateForm.WriteSecondaryCategoryId" @on-keyup="SyncChangeSecondaryCategoryId" :disabled="IsDisabled" number placeholder="请输入类目ID"></Input>
            <div>{{ToStr_SecondaryCategoryId}}</div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>ProductID：</td>
          <td>
            <Input type="text" v-model="OperateForm.ProductID" :disabled="IsDisabled" placeholder="请输入ProductID" class="P-MR-5"></Input>
            <span v-if="OperateForm.CategoryId.length>0">{{['','UPC','EAN','ISBN'][Number(OperateForm.ProductType)]}}</span>
          </td>
          <td>未设置多属性时必填。如果设置了多属性，则不需要填写。</td>
        </tr>
        <tr>
          <td :class="{'required':DropConditionID.length > 0}">物品状况：</td>
          <td>
            <Select v-model="OperateForm.ConditionID" :options="DropConditionID" :disabled="IsDisabled" placeholder="请选择物品状况"/>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>物品描述：</td>
          <td>
            <Input v-model="OperateForm.ConditionDescription" :autosize="{minRows:3}" placeholder="请输入物品描述" type="textarea" class="P-W-100-Percent"/>
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
    name: "SiteAndClassify",
    components: {}
  })
  export default class SiteAndClassify extends Vue {
    @Getter private "EbayPublish/OTHER": Interface.SiteOther[];

    get OTHER(): Interface.SiteOther[] {
      return this["EbayPublish/OTHER"] || []
    }

    get ToStr_CategoryId(): string {
      return this.OperateForm.CategoryId.map((Item) => {
        return JSON.parse(Item).Key;
      }).join(" -> ");
    }

    get ToStr_SecondaryCategoryId(): string {
      return this.OperateForm.SecondaryCategoryId.map((Item) => {
        return JSON.parse(Item).Key;
      }).join(" -> ");
    }

    private async mounted(): Promise<void> {
      this.$UI.Loading.Show();
      await this.GetSiteDrop();
      await this.GetCategoryFeaturesSite();
      await this.GetAllTemplate();
      await this.$store.commit("EbayPublish/UPDATE_BASE", this.OperateForm);
      this.SetAutoOperateForm();
      this.$UI.Loading.Hide();
    }

    private SetAutoOperateForm(): void {
      this.$set(this.OperateForm, "SiteId", 0);
      this.$set(this.OperateForm, "ListingType", 8);
      this.SyncChangeSite(this.OperateForm.SiteId);
    }

    // 站点下拉
    private GetSiteDrop(): Promise<void> {
      return new Promise(resovle => {
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.EbaySites,
            Login: false
          },
          Data: "",
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.DropSite.push(...Res.Data.DropList);
              resovle();
            } else {
              this.$Request.Error(Res);
            }
          }
        })
      })
    }

    // 站点分类特性信息
    private GetCategoryFeaturesSite(): Promise<void> {
      return new Promise(resovle => {
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.EbayCategoryFeaturesGetSiteList,
            Login: false
          },
          Data: "",
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$store.commit("EbayPublish/UPDATE_OTHER", Res.Data.Data);
              resovle();
            } else {
              this.$Request.Error(Res);
            }
          }
        })
      })
    }

    // 获取全部模板
    private GetAllTemplate(): Promise<void> {
      return new Promise(resovle => {
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.EbayTempPublishRelatedList,
            Login: true
          },
          Data: 0,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$store.commit("EbayPublish/UPDATE_TEMPL", Res.Data.Data);
              resovle();
            } else {
              this.$Request.Error(Res);
            }
          }
        })
      })
    }

    // 币种
    private GetCurrencyDrop(): void {
      this.$set(this, "DropCurrency", (this.OTHER.find((Item) => Item.SiteId === this.OperateForm.SiteId) as Interface.SiteOther).CurrencyCodes.map((Item, Index) => {
        return {
          Key: Item,
          Value: Item
        }
      }));
      this.$set(this.OperateForm, "Currency", this.DropCurrency.length === 1 ? this.DropCurrency[0].Value : "");
    }

    // 获取类目下拉
    private GetCategoryDrop(): Promise<void> {
      return new Promise(resolve => {
        const PostData = {
          Site: this.OperateForm.SiteId,
          Level: 1
        }
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.EbayCategoriesGetCategoryBySite,
            Login: true
          },
          Data: PostData,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.DropCategory_A.push(...Res.Data.Data.map((Item: Interface.SiteCategoryDefault) => {
                return new Interface.SiteCategory(
                  JSON.stringify({Key: Item.CategoryName, Value: Number(Item.CategoryID)}),
                  Item.CategoryName, [], 0, false
                );
              }))
              this.DropCategory_B.push(...JSON.parse(JSON.stringify(this.DropCategory_A)));
            } else {
              this.$Request.Error(Res);
            }
            resolve();
          }
        })
      });
    }

    // 动态加载类目
    private GetNextCategory(Item: Interface.SiteCategory, CallBack: any): void {
      const PostData = {
        CategoryId: JSON.parse(Item.value).Value,
        Site: this.OperateForm.SiteId
      }
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.EbayCategoriesGetCategoriesByParentId,
          Login: true
        },
        Data: PostData,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            if (Res.Data.Data.length == 0) {
              this.$delete(Item, "loading");
            } else {
              this.$set(Item, "children", Res.Data.Data.map((Val: Interface.SiteCategoryDefault) => {
                return new Interface.SiteCategory(
                  JSON.stringify({Key: Val.CategoryName, Value: Number(Val.CategoryID)}),
                  Val.CategoryName, [], Number(Val.CategoryParentID), false
                );
              }))
            }
            CallBack();
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    // 站点切换
    private async SyncChangeSite(Val: number | ""): Promise<void> {
      this.IsDisabled = Val === "";
      this.DropCategory_A.splice(0);
      this.DropCategory_B.splice(0);
      if (Val === "") {
        this.$set(this, "OperateForm", new Interface.SiteAndClassify());
        this.$store.commit("EbayPublish/UPDATE_FEATURES", new Interface.SiteFeatures());
      } else {
        this.GetCurrencyDrop();
        await this.GetCategoryDrop();
        await this.TriggerSyncCategory();
      }
    }

    private TriggerSyncCategory(): void {
      if (this.OperateForm.CategoryId.length) {
        this.$set(this.OperateForm, "WriteCategoryId", JSON.parse(this.OperateForm.CategoryId.slice(-1)[0]).Value);
        this.SyncChangeCategory({keyCode: 13});
      }
      if (this.OperateForm.SecondaryCategoryId.length) {
        this.$set(this.OperateForm, "WriteSecondaryCategoryId", JSON.parse(this.OperateForm.SecondaryCategoryId.slice(-1)[0]).Value);
        this.SyncChangeSecondaryCategoryId({keyCode: 13});
      }
    }

    // 手动输入类目
    private SyncChangeCategory(E: any): void {
      if (E.keyCode == 13) {
        if (this.OperateForm.WriteCategoryId === "") {
          return;
        }
        // 验证输入的类目ID是否为最细级
        this.VerifyHasMinCategory(this.OperateForm["WriteCategoryId"], 0);
      } else {
        this.$set(this.OperateForm, "WriteCategoryId", Math.abs(parseInt((this.OperateForm.WriteCategoryId as string))) || "");
      }
    }

    private SyncChangeSecondaryCategoryId(E: any): void {
      if (E.keyCode == 13) {
        if (this.OperateForm.WriteSecondaryCategoryId === "") {
          return;
        }
        // 验证输入的类目ID是否为最细级
        this.VerifyHasMinCategory(this.OperateForm["WriteSecondaryCategoryId"], 1);
      } else {
        this.$set(this.OperateForm, "WriteSecondaryCategoryId", Math.abs(parseInt((this.OperateForm.WriteSecondaryCategoryId as string))) || "");
      }
    }

    private VerifyHasMinCategory(CategoryId: number, Type: number): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.EbayCategoriesGetCategoriesByParentId,
          Login: false
        },
        Data: {
          CategoryId: CategoryId,
          Site: this.OperateForm.SiteId
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            if (Res.Data.Data.length) {
              this.$UI.Loading.Hide();
              this.$UI.Tips.Floating("warning", "输入的类目ID无效");
              this.ResetCategory(Type);
            } else {
              this.GetCategoryDetail(CategoryId, [], [], Type);
            }
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private ResetCategory(Type: number): void {
      this.$set(this.OperateForm, ["WriteCategoryId", "WriteSecondaryCategoryId"][Type], "");
      this.OperateForm[Type ? "SecondaryCategoryId" : "CategoryId"].splice(0);
    }

    // CategoryId：分类ID    CategoryTree：节点树    SelectName：选择中的类目名   Type：类别
    private GetCategoryDetail(CategoryId: number, CategoryTree: Interface.SiteCategory[], SelectName: string[], Type: number): void {
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.EbayCategoriesGetCategory,
          Login: false
        },
        Data: {
          CategoryId: CategoryId,
          Site: this.OperateForm.SiteId
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            const Item = Res.Data.Data;
            if (Item) {
              const Detail = new Interface.SiteCategory(
                JSON.stringify({Key: Item.CategoryName, Value: Number(Item.CategoryID)}),
                Item.CategoryName, CategoryTree, Number(Item.CategoryParentID)
              );
              SelectName.unshift(Detail.value);
              // 是否为一级跟目录
              if (Detail.parentId) {
                this.GetSiblingCategory(Detail, CategoryTree, SelectName, Type);
              } else {
                // 一级根目录的操作
                this.GetCategorySuccess(Number(Item.CategoryID), CategoryTree, SelectName, Type);
              }
            } else {
              this.$UI.Loading.Hide();
              this.$UI.Tips.Floating("warning", "输入的类目ID无效");
              this.ResetCategory(Type);
            }
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 获取类目ID的同级类目
    private GetSiblingCategory(CategoryDetail: Interface.SiteCategory, CategoryTree: Interface.SiteCategory[], SelectName: string[], Type: number): void {
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.EbayCategoriesGetCategoriesByParentId,
          Login: false
        },
        Data: {
          CategoryId: CategoryDetail.parentId,
          Site: this.OperateForm.SiteId
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            const CategoryList = Res.Data.Data.map((Item: Interface.SiteCategoryDefault) => new Interface.SiteCategory(
              JSON.stringify({Key: Item.CategoryName, Value: Number(Item.CategoryID)}),
              Item.CategoryName, [], Number(Item.CategoryParentID)
            ))
            for (let Key in CategoryList) {
              if (CategoryList[Key].value === CategoryDetail.value) {
                CategoryList[Key] = CategoryDetail;
              }
            }
            CategoryTree = CategoryList;
            this.GetCategoryDetail(CategoryDetail.parentId, CategoryTree, SelectName, Type);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 类目获取完毕
    private GetCategorySuccess(CategoryID: number, CategoryTree: Interface.SiteCategory[], SelectName: string[], Type: number): void {
      let HasCategory = false;
      for (let Item of this[Type ? "DropCategory_B" : "DropCategory_A"]) {
        if (JSON.parse(Item.value).Value === CategoryID) {
          HasCategory = true;
          Item.children.splice(0);
          Item.children.push(...JSON.parse(JSON.stringify(CategoryTree)));
          break;
        }
      }
      if (HasCategory) {
        this.OperateForm[Type ? "SecondaryCategoryId" : "CategoryId"].splice(0);
        this.OperateForm[Type ? "SecondaryCategoryId" : "CategoryId"].push(...JSON.parse(JSON.stringify(SelectName)));
        this.$set(this.OperateForm, Type ? "WriteSecondaryCategoryId" : "WriteCategoryId", JSON.parse((SelectName.pop() as string)).Value);
        this.GetBaseFeaturesCategory();
      } else {
        this.$UI.Loading.Hide();
        this.$UI.Tips.Floating("warning", "输入的类目ID无效");
        this.ResetCategory(Type);
      }
    }

    private SyncChangeWrite_A(Val: string[]): void {
      this.$set(this.OperateForm, "WriteCategoryId", Val.length ? Val.map((Item) => JSON.parse(Item).Value).pop() : "");
      if (Val.length) {
        this.$nextTick(() => {
          this.GetBaseFeaturesCategory();
        })
      }
    }

    private SyncChangeWrite_B(Val: string[]): void {
      this.$set(this.OperateForm, "WriteSecondaryCategoryId", Val.length ? Val.map((Item) => JSON.parse(Item).Value).pop() : "");
    }

    // 获取站点类目基本信息
    private GetBaseFeaturesCategory(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.EbayCategoryFeaturesGettDataBySite,
          Login: true
        },
        Data: {
          CategoryId: JSON.parse(this.OperateForm.CategoryId[this.OperateForm.CategoryId.length - 1]).Value,
          Site: this.OperateForm.SiteId
        },
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            const Data: Interface.SiteFeatures = Res.Data.Data;
            if (Data.FeaturesResult.categoryFeatures.length) {
              Data.FeaturesResult.categoryFeatures.push((JSON.parse(JSON.stringify(Data.FeaturesResult.siteDefault)) as Interface.Feature_CategoryFeatures))
            }
            this.$store.commit("EbayPublish/UPDATE_FEATURES", Data);
            this.DropConditionID.push(...JSON.parse(JSON.stringify(Data.FeaturesResult.conditionValues)).map((Item: Interface.Feature_ConditionValues) => {
              return {Value: Item.ConditionId, Key: Item.ConditionName}
            }));
            if (Object.keys(Data.FeaturesResult.categoryFeatures[0].UPCEnabled).some((Key) => Data.FeaturesResult.categoryFeatures[0].UPCEnabled[(Key as any)] === "Required")) {
              this.$set(this.OperateForm, "ProductType", 1);
            } else if (Object.keys(Data.FeaturesResult.categoryFeatures[0].EANEnabled).some((Key) => Data.FeaturesResult.categoryFeatures[0].EANEnabled[(Key as any)] === "Required")) {
              this.$set(this.OperateForm, "ProductType", 2);
            } else if (Object.keys(Data.FeaturesResult.categoryFeatures[0].ISBNEnabled).some((Key) => Data.FeaturesResult.categoryFeatures[0].ISBNEnabled[(Key as any)] === "Required")) {
              this.$set(this.OperateForm, "ProductType", 3);
            } else {
              this.$set(this.OperateForm, "ProductType", 1);
            }
          } else {
            this.$Request.Error(Res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    private DropSite: PInterface.KV[] = []; // 站点
    private DropListingType: PInterface.KV[] = [{Key: "一口价", Value: 8}, {Key: "拍卖", Value: 1}]; // 出售方式
    private DropCrossBorderTrade: PInterface.KV[] = [{Key: "$其他站点可见", Value: 1}]; // $其他站点可见
    private DropCurrency: PInterface.KV[] = []; // 币种
    private DropCategory_A: Interface.SiteCategory[] = []; // 刊登类目
    private DropCategory_B: Interface.SiteCategory[] = []; // 刊登类目
    private DropConditionID: Interface.Feature_ConditionValues[] = []; // 物品状况

    private OperateForm: Interface.SiteAndClassify = new Interface.SiteAndClassify();

    private IsDisabled: boolean = true;
  }
</script>

<style lang="less"></style>