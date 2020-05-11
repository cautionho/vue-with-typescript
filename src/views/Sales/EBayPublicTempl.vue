<!-- ebay公共模板 -->
<template>
  <Row>
    <Col span="24">
      <Row class="P-Search-Group">
        <Col :span="24">
          <Form ref="SearchForm" :model="SearchForm" onsubmit="return false" inline class="P-MB-10">
            <Form-item class="P-MB-0">
              <Select placeholder="请选择站点" v-model="SearchForm.SiteId" :options="DropSite"/>
            </Form-item>
            <FormItem class="P-MB-0">
              <Input v-model="SearchForm.SearchKey" @on-enter="SearchList" placeholder="搜索关键字" class="P-W-400">
                <Select v-model="SearchForm.TempType" slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索模板类型" :options="DropTempType"/>
                <Button slot="append" type="primary" @click="SearchList">搜索</Button>
              </Input>
            </FormItem>
            <FormItem class="P-MB-0">
              <Button type="warning" @click="ResetList">重置</Button>
            </FormItem>
          </Form>
        </Col>
        <Col :span="24">
          <Table ref="TableList" :height="CalculateTbHeight()" :columns="TableRowHead" :data="TableList" size="small" stripe></Table>
        </Col>
        <Col :span="24">
          <Page ref="Pager" @on-change="SetChangePageTable" @on-page-size-change="SetChangePageSizeTable" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer
                show-elevator class="P-MT-10"/>
        </Col>
      </Row>
      <Detail ref="Detail"></Detail>
    </Col>
  </Row>
</template>
<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Sales";

  @Component({
    name: "EBayPublicTempl",
    components: {
      Detail: () => import("@/components/Sales/DetailEBayPublicTempl.vue")
    }
  })

  export default class EBayPublicTempl extends Vue {
    private mounted() {
      this.GetPoints();
    }

    //获取权限
    private async GetPoints(): Promise<void> {
      this.$set(this, "Powers", this.$Utils.GetUserResource.call(this, ["EbayGetTempInfo", "EbayDeleteTempPublish"]));
      this.$set(this, "DropSite", await this.GetDropList<string, PInterface.KV>(this.$Server.Sales, this.$Api.EbaySites, ""))
      this.Powers.EbayGetTempInfo ? this.OperateDrop.push({Key: "查看", Value: 0}) : null;
      this.Powers.EbayDeleteTempPublish ? this.OperateDrop.push({Key: "删除", Value: 1}) : null;

      this.GetTableList();
    }

    private GetDropList<T, R>(Server: string, Api: string, Data: T): Promise<R> {
      return new Promise(resovle => {
        this.$Request.Post({
          Server: Server,
          Api: {
            Address: Api,
            Login: false
          },
          Data: Data,
          Callback: (Res: PInterface.Res): void => {
            if (!Res.IsSuccess) {
              this.$Request.Error(Res);
            }
            resovle(Res.Data.DropList || []);
          }
        })
      })
    }

    private ResetList(): void {
      this.$set(this, "Pager", new PInterface.Pager());
      this.$set(this, "SearchForm", new Interface.EBayTemplSearchGroup());
      this.GetTableList();
    }

    private SearchList(): void {
      this.Pager.PageIndex = 1;
      this.GetTableList();
    }

    private GetTableList(): void {
      this.TableList.splice(0);
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Sales,
        Api: {
          Address: this.$Api.EbayGetTempPublishList,
          Login: true
        },
        Data: {
          PageIndex: this.Pager.PageIndex,
          PageSize: this.Pager.PageSize,
          Conditions: {
            SearchKey: this.SearchForm.SearchKey,
            SiteId: this.SearchForm.SiteId === "" ? -1 : this.SearchForm.SiteId,
            TempType: this.SearchForm.TempType
          }
        },
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.Pager.TotalItems = res.Data.PageModel.TotalItems;
            this.TableList.push(...res.Data.PageModel.Items);
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private CalculateTbHeight(): number {
      let H = window.innerHeight - 150;
      if (this.$refs["SearchForm"]) {
        H -= (this.$refs["SearchForm"] as any).$el.offsetHeight;
      }
      if (this.$refs["OperateBtnGroup"]) {
        H -= (this.$refs["OperateBtnGroup"] as any).$el.offsetHeight;
      }
      if (this.$refs["Pager"]) {
        H -= (this.$refs["Pager"] as any).$el.offsetHeight;
      }
      return H;
    }

    private SetChangePageTable(pageNum: number): void {
      this.Pager.PageIndex = pageNum;
      this.GetTableList();
    }

    private SetChangePageSizeTable(pageSize: number): void {
      this.Pager.PageSize = pageSize;
      this.GetTableList();
    }

    private OperateEmitChange(Res: boolean): void {
      if (Res) {
        this.GetTableList();
      }
    }

    private OperateGroup(Type: number, Item: Interface.EBayTemplTable): void {
      switch (Type) {
        case 0:
          (this.$refs["Detail"] as any).OpenModal({
            Id: Item.Id,
            SiteId: Item.SiteId,
            TempType: Item.TempType,
          });
          break;
        case 1:
          this.SetDeteleTempl(Item.Id);
          break;
      }
    }
    private SetDeteleTempl(Id:number):void{
      this.$UI.Tips.Modal({
        Type:'confirm',
        Content: '确认删除该模板吗',
        Callback:(B:boolean):void => {
          if(B){
            this.$UI.Loading.Show();
            this.$Request.Post({
              Server: this.$Server.Sales,
              Api: {
                Address: this.$Api.EbayDeleteTempPublish,
                Login:true
              },
              Data: Id,
              Callback: (Res:PInterface.Res):void => {
                if(Res.IsSuccess){
                  this.$UI.Tips.Floating('success','删除模板成功');
                  this.GetTableList();
                }else{
                  this.$UI.Loading.Hide();
                  this.$Request.Error(Res)
                }
              }
            })
          }
        }
      })
    }

    private GetSiteName(SiteId: number): string {
      if (this.DropSite.filter(Item => Item.Value === SiteId).length) {
        return (this.DropSite.filter(Item => Item.Value === SiteId)[0].Key as string)
      } else {
        return ""
      }
    }

    private SearchForm: Interface.EBayTemplSearchGroup = new Interface.EBayTemplSearchGroup();

    private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
    private TableList: Interface.EBayTemplTable[] = [];
    private TableRowHead: PInterface.TableCol[] = [{
      title: "模板名称", key: "TempName",
    }, {
      title: "模板类型",
      render: (h: any, params: any): string => {
        return h("span", this.$Enums.Sales.TempType[params.row.TempType]);
      }
    }, {
      title: "站点",
      key: "SiteId",
      render: (h, params) => {
        return h("span", this.GetSiteName(params.row.SiteId))
      }
    }, {
      title: "操作",
      width: 140,
      render: (h: any, params: any): string => {
        return h("div", this.OperateDrop.map((Item: PInterface.KV, Index: number) => {
          return h("Button", {
            props: {
              type: ["primary", "error"][(Item.Value as number)],
              size: "small"
            },
            style: {
              marginRight: "6px"
            },
            on: {
              click: () => {
                this.OperateGroup((Item.Value as number), params.row)
              }
            }
          }, Item.Key)
        }))
      }
    }];

    private DropSite: PInterface.KV[] = [];
    private DropTempType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.TempType);
    private OperateDrop: PInterface.KV[] = []; // 下拉操作项
    private Powers: PInterface.Power = {}; // 权限
  }
</script>
<style lang="less">
</style>