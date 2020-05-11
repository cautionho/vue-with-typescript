<template>
  <Col :span="24" class="P-MT-20">
    <Card>
      <p slot="title">产品细节</p>
      <table>
        <tr v-for="(Item,Index) in TableList" :key="Index">
          <td>{{Item.SpecificName}}：</td>
          <td v-if="Item.IsCustomizeAttr">
            <Button type="primary" size="small" @click="DelCustomize(Index)">删除细节</Button>
            <div>
              自定义属性（输入内容后按回车添加）：
              <Input v-model.trim="Item.CustomizeInput" @on-enter="AddCustomizeAttr(Index)" placeholder="请输入自定义属性"></Input>
            </div>
            <div>
              <Tag v-for="(Val,Idx) in Item.SelectedVal[1]" :key="Idx" @on-close="DelCustomizeAttr(Index,Idx)" color="primary" closable>{{ Val }}</Tag>
            </div>
          </td>
          <td v-else-if="Item.MaxValue===1">
            <Input v-model="Item.SelectedVal[1][0]" v-if="Item.IsCustomizeCheckbox" :placeholder="'请输入'+Item.SpecificName"/>
            <Select v-model="Item.SelectedVal[1][0]" v-else :options="Item.SpecificValueNames" :placeholder="'请选择'+Item.SpecificName" :data-index="Index" :onChange="SetCustomizeSelectChange"/>
            <Checkbox v-model="Item.IsCustomizeCheckbox" @on-change="SetCustomizeCheckboxChange(Index)" class="P-MT-5 P-ML-10">自定义</Checkbox>
          </td>
          <td v-else>
            <F-CheckboxGroup :options="Item.SpecificValueNames" v-model="Item.SelectedVal[0]" :data-index="Index" :onChange="VerifyAttrMaxValue"/>
            <div v-if="Item.SelectionMode === 'FreeText'">
              <div class="P-MT-5 P-MB-5">
                自定义属性（输入内容后按回车添加）：
                <Input v-model.trim="Item.CustomizeInput" @on-enter="AddCustomizeAttr(Index)" placeholder="请输入自定义属性"></Input>
              </div>
              <div>
                <Tag v-for="(Val,Idx) in Item.SelectedVal[1]" :key="Idx" @on-close="DelCustomizeAttr(Index,Idx)" color="primary" closable>{{ Val }}</Tag>
              </div>
            </div>
          </td>
          <td v-if="Item.IsCustomizeAttr"></td>
          <td v-else>
            {{ Item.UsageConstraint['2']?'必填，':Item.UsageConstraint['0']?'可选,':'推荐，' }}
            {{ Item.MaxValue=== 1 ? '单选。' : '多选最多'+Item.MaxValue+'项。' }}
            {{ Item.ParentName ? '必须先选择'+Item.ParentName : '' }}
          </td>
        </tr>
      </table>
      <div class="P-MT-10">自定义细节（输入内容后按回车添加）： <Input v-model.trim="CustomizeItem" @on-enter="AddCustomize" style="width: 300px"></Input></div>
    </Card>
  </Col>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {Getter, Action} from "vuex-class";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "ProductDetail",
    components: {}
  })
  export default class ProductDetail extends Vue {
    @Getter private "EbayPublish/FEATURES": Interface.SiteFeatures;

    get SpecificsResult(): Interface.Feature_SpecificsResult[] {
      return this["EbayPublish/FEATURES"].SpecificsResult;
    }

    @Watch("SpecificsResult")
    private WatchFeatures(List: Interface.Feature_SpecificsResult[]): void {
      this.TableList.splice(0);
      this.TableList.push(...List.map((Item) => {
        return new Interface.ProductDetailTable(
          Item.ParentName ? [] : Item.SpecificValueNames.map((Val): Interface.Feature_SpecificValueNames => {
            Val.Key = Val.SpecificValue;
            Val.Value = Val.SpecificValue;
            return JSON.parse(JSON.stringify(Val));
          }),
          Item.UsageConstraint,
          Item.SelectionMode,
          Item.SpecificName,
          Item.MaxValue,
          Item.ParentName,
          false,
          false,
          Item.MaxValue === 1 ? [[], [""]] : [[], []],
          ""
        )
      }))
    }

    private SetCustomizeCheckboxChange(Index: number): void {
      this.TableList[Index].SelectedVal[1][0] = "";
    }

    private SetCustomizeSelectChange(Value: string): void {
      let Index = (window as any).event.target.parentNode.parentNode.parentNode.getAttribute("data-index");
      let Row = this.TableList[Index];
      let RelevanceRow: Interface.ProductDetailTable | undefined = undefined;// 关联的属性下拉

      if (Row.SpecificValueNames.length && Row.SpecificValueNames[0].ChildName) {
        RelevanceRow = this.TableList.find((Item) => Item.SpecificName === Row.SpecificValueNames[0].ChildName);

        if (RelevanceRow) {
          if (Row.SelectedVal[1][0]) {
            RelevanceRow.SpecificValueNames.push(...(Row.SpecificValueNames.find((Item) => Item.Value === Row.SelectedVal[1][0]) as Interface.Feature_SpecificValueNames).ChildSpecificValues.map((Val): Interface.Feature_SpecificValueNames => {
              Val.Key = Val.SpecificValue;
              Val.Value = Val.SpecificValue;
              return JSON.parse(JSON.stringify(Val));
            }));
          } else {
            RelevanceRow.SpecificValueNames.splice(0);
          }
          RelevanceRow.SelectedVal[1][0] = "";
        }
      }
    }

    private AddCustomizeAttr(Index: number): void {
      let Row = this.TableList[Index];
      let Seleceted = Row.SelectedVal[0].concat(Row.SelectedVal[1]);
      if (Row.CustomizeInput) {
        if (Seleceted.some((Item) => Item === Row.CustomizeInput) || Row.SpecificValueNames.some((Item) => Item.Value === Row.CustomizeInput)) {
          this.$UI.Tips.Floating("warning", "该属性已存在");
        } else if (Seleceted.length === Row.MaxValue) {
          this.$UI.Tips.Floating("warning", "已达到可选的最大值");
        } else {
          Row.SelectedVal[1].push(Row.CustomizeInput);
        }
        Row.CustomizeInput = "";
      }
    }

    private VerifyAttrMaxValue(Val: string[]): void {
      let Row = this.TableList[(window as any).event.target.parentNode.parentNode.parentNode.getAttribute("data-index")] ||
                this.TableList[(window as any).event.target.parentNode.parentNode.getAttribute("data-index")] ||
                this.TableList[(window as any).event.target.parentNode.getAttribute("data-index")];

      let Seleceted = Row.SelectedVal[0].concat(Row.SelectedVal[1]);
      if (Seleceted.length > Row.MaxValue) {
        this.$nextTick(() => {
          Row.SelectedVal[0].pop();
          this.$UI.Tips.Floating("warning", "已达到可选的最大值");
        })
      }
    }

    private DelCustomizeAttr(RowIndex: number, ItemIndex: number): void {
      this.TableList[RowIndex].SelectedVal[1].splice(ItemIndex, 1);
    }

    private AddCustomize(): void {
      if (this.CustomizeItem) {
        if (this.TableList.some((Item) => Item.SpecificName === this.CustomizeItem)) {
          this.$UI.Tips.Floating("warning", "列表已存在同名细节，请重新输入");
        } else {
          this.TableList.push(
            new Interface.ProductDetailTable(
              [],
              "",
              "FreeText",
              this.CustomizeItem,
              Number.POSITIVE_INFINITY,
              "",
              true,
              "",
              [[], []],
              ""
            )
          )
        }
        this.CustomizeItem = "";
      }
    }

    private DelCustomize(RowIndex: number): void {
      this.TableList.splice(RowIndex, 1);
    }


    private TableList: Interface.ProductDetailTable[] = [];
    private CustomizeItem: string = "";
  }
</script>

<style lang="less"></style>