<!-- 调拨装箱 -->
<template>
  <Card dis-hover>
    <div slot="title">
      <Form ref="SearchForm" :label-width="100" inline onsubmit="return false">
        <Form-item label="调拨拣货批次：" class="P-MB-0">
          <Input ref="TransferBatchCode_Ipt" v-model.trim="TransferBatchCode" @on-enter="LoadTransferBatchDetail" placeholder="请输入调拨拣货批次"></Input>
        </Form-item>
        <Form-item label="SKU编号：" class="P-MB-0">
          <Input ref="SkuCode_Ipt" v-model.trim="SkuCode" @on-enter="MatchSkuEncasementCount" placeholder="请输入SKU编号"></Input>
        </Form-item>
        <Form-item label="数量：" class="P-MB-0">
          <InputNumber ref="Quantity_Ipt" v-model="Quantity" @on-enter="SetEncasementOperate" :min="1" :precision="0" placeholder="请输入数量"></InputNumber>
        </Form-item>
      </Form>
    </div>
    <div class="P-MB-10">
      <Button @click="PostShipment" type="primary" class="P-MR-10">装货</Button>
      <Button @click="PostAccomplish" type="primary" class="P-MR-10">完成装箱</Button>
      <Button @click="PostResetBatchData" type="primary" class="P-MR-10">清除批次数据</Button>
      <Button @click="PostReset" type="warning" class="P-MR-10">重置</Button>
    </div>
    <div :style="{'height': TableH + 'px'}">
      <table border="0" cellspacing="0" cellpadding="0" class="ErpTable">
        <thead>
        <th class="TLeft">SKU编号 <span v-show="TransferBatchTable.SkuTypeNum > 0">(共计 {{ TransferBatchTable.SkuTypeNum }} 种)</span></th>
        <th class="TLeft">装箱数量 <span v-show="TransferBatchTable.SkuToBoxNum > 0">(共计 {{ TransferBatchTable.SkuToBoxNum }} 件)</span></th>
        <th style="width:150px" class="TCenter">操作</th>
        </thead>
        <tbody v-if="Object.keys(TransferBatchTable.LoadedToBoxSku).length <1">
        <tr>
          <td colspan="3" class="TCenter">暂无数据</td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr v-for="(Item, Key, Idx) in TransferBatchTable.LoadedToBoxSku">
          <td class="TLeft">{{ Key }}</td>
          <td class="TLeft">{{ Item.Count }}</td>
          <td style="width:150px" class="TCenter">
            <Button size="small" type="error" @click="DelSkuCode(Key)">删除</Button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>
<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";
  import GetLodop from "@/assets/LODOP/LodopFuncs";

  @Component({
    name: "TransferPack",
    components: {}
  })

  export default class TransferPack extends Vue {
    @Watch("TransferBatchTable.LoadedToBoxSku", {immediate: true, deep: true})
    private WatchLoadedToBoxSku(Value: Interface.LoadedToBoxSku): void {
      let SkuCount = 0;
      for (let Sku in Value) {
        SkuCount += Value[Sku].Count;
      }
      this.TransferBatchTable.SkuTypeNum = Object.keys(Value).length;
      this.TransferBatchTable.SkuToBoxNum = SkuCount;
    }

    private mounted(): void {
      this.FocusTransferBatchCode();
    }

    private FocusTransferBatchCode() {
      this.$set(this, "TransferBatchCode", "");
      this.$set(this, "SkuCode", "");
      this.$set(this, "Quantity", 1);
      this.$nextTick(() => {
        (this.$refs["TransferBatchCode_Ipt"] as any).focus();
      })
    }

    private FocusSkuCode() {
      this.SkuCode = "";
      this.Quantity = 1;
      this.$nextTick(function () {
        (this.$refs["SkuCode_Ipt"] as any).focus();
      });
    }

    private LoadTransferBatchDetail(): void {
      if (this.TransferBatchCode == "") {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "请输入调拨拣货批次号",
          Callback: (Res: boolean): void => {
            this.FocusTransferBatchCode();
          }
        })
        return;
      }
      if (this.LoadedTransferBatchDetail && (this.LoadedTransferBatchDetail.TransferBatchCode === this.TransferBatchCode)) {
        // 重复加载同一个批次号
        return;
      }
      this.GetTransferBatchDetail();
    }

    private GetTransferBatchDetail(): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.TransferBatchPdaDetail,
          Login: true
        },
        Data: this.TransferBatchCode,
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            // 列表已加载过数据
            if (Object.keys(this.TransferBatchTable.LoadedToBoxSku).length > 0) {
              // 来源仓 && 目的仓
              if (res.Data.Data.OriginWarehouseName !== this.TransferBatchTable.OriginWarehouseName || res.Data.Data.TargetWarehouseName !== this.TransferBatchTable.TargetWarehouseName) {
                this.$UI.Tips.Modal({
                  Type: "warning",
                  Content: "当前批次的来源仓和目的仓与列表数据不一致，无法继续装货",
                  Callback: (Res: boolean): void => {
                    this.FocusTransferBatchCode();
                  }
                })
                return;
              }
            }
            // 已拣货 || 部分装箱
            if (res.Data.Data.TransferPickingBatchStatus != 3 && res.Data.Data.TransferPickingBatchStatus != 4) {
              this.$UI.Tips.Modal({
                Type: "warning",
                Content: "请扫描已拣货或部分装箱状态的调拨拣货批次进行操作",
                Callback: (Res: boolean): void => {
                  this.FocusTransferBatchCode();
                }
              })
              return;
            }
            // 待入箱数量是否都为0
            if (this.BatchCountNum(res.Data.Data.Details, res.Data.Data.TransferBatchCode).every((Item) => Item.LoadedToBox == 0)) {
              this.$UI.Tips.Modal({
                Type: "warning",
                Content: "该批次的所有待装箱产品已装货到列表，无其他可装箱产品",
                Callback: (Res: boolean): void => {
                  this.FocusTransferBatchCode();
                }
              })
              return;
            }
            this.$set(this, "LoadedTransferBatchDetail", res.Data.Data);
            this.$set(this, "LoadedSkuList", this.BatchCountNum(res.Data.Data.Details, res.Data.Data.TransferBatchCode));
            this.$set(this, "MatchSkuDetail", null);

            this.SkuCode ? this.MatchSkuEncasementCount() : this.FocusSkuCode();
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private BatchCountNum(SkuDetailList: Interface.TransferBatchDeatil[], BatchCode: string): Interface.TransferBatchDeatil[] {
      let SkuList: Interface.TransferBatchDeatil[] = [...SkuDetailList];
      for (let i = 0; i < SkuList.length; i++) {
        let SkuObj = this.TransferBatchTable.LoadedToBoxSku[SkuList[i].SkuCode];
        // 为 true 说明添加过SKU
        if (SkuObj && SkuObj.BacthCodeSkuInfo[BatchCode]) {
          SkuList[i].LoadedToBox = SkuList[i].PickedQuantity - SkuList[i].InBoxQuantity - SkuObj.BacthCodeSkuInfo[BatchCode];
        } else {
          SkuList[i].LoadedToBox = SkuList[i].PickedQuantity - SkuList[i].InBoxQuantity;
        }
      }
      return SkuList;
    }

    // 匹配SKU待装箱数
    private MatchSkuEncasementCount(): void {
      // 批次号 == ''
      if (this.TransferBatchCode === "") {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "请先扫描或输入批次号",
          Callback: (Res: boolean): void => {
            this.FocusTransferBatchCode();
          }
        })
        return;
      }
      // 未加载数据
      if (this.LoadedSkuList.length === 0) {
        this.GetTransferBatchDetail();
        return;
      }
      // 批次号 与 批次信息不一致
      if (this.TransferBatchCode != (this.LoadedTransferBatchDetail as Interface.TransferBatch).TransferBatchCode) {
        this.$UI.Tips.Modal({
          Type: "confirm",
          Content: "当前调拨拣货批次号与已加载的批次信息不一致,是否重新加载批次信息?",
          Callback: (Res: boolean): void => {
            if (Res) {
              this.GetTransferBatchDetail();
            } else {
              this.$set(this, "TransferBatchCode", (this.LoadedTransferBatchDetail as Interface.TransferBatch).TransferBatchCode);
              this.MatchSkuEncasementCount();
            }
          }
        })
        return;
      }
      // SKU产品未找到
      if (this.LoadedSkuList.every((Item: Interface.TransferBatchDeatil) => Item.SkuCode != this.SkuCode)) {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "该调拨拣货批次中不存在可装箱的该产品",
          Callback: (Res: boolean): void => {
            this.FocusSkuCode();
          }
        })
        return;
      }
      // SKU待装箱数 < 数量输入框的值
      if (this.LoadedSkuList.some((Item) => (Item.SkuCode == this.SkuCode) && ((Item.LoadedToBox as number) < this.Quantity))) {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "批次该SKU待装箱数不足，无法装货",
          Callback: (Res: boolean): void => {
            this.FocusSkuCode();
          }
        })
        return;
      }

      // 存储已匹配的SKU
      this.$set(this, "MatchSkuDetail", this.LoadedSkuList.filter((Item) => Item.SkuCode == this.SkuCode)[0]);
      this.SetEncasementOperate();
    }

    // 装箱操作
    private SetEncasementOperate(): void {
      // 批次号== ''
      if (this.TransferBatchCode === "") {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "请先扫描或输入批次号",
          Callback: (Res: boolean): void => {
            this.FocusTransferBatchCode();
          }
        })
        return;
      }
      // SKU编号== ''
      if (this.SkuCode === "") {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "请扫描或输入SKU编号",
          Callback: (Res: boolean): void => {
            this.FocusSkuCode();
          }
        })
        return;
      }
      // 批次号未加载数据
      if (this.LoadedSkuList.length == 0) {
        this.GetTransferBatchDetail();
        return;
      }
      // SKU未匹配
      if (this.MatchSkuDetail == null || this.MatchSkuDetail.SkuCode != this.SkuCode) {
        this.MatchSkuEncasementCount();
        return;
      }
      // 待装箱数 < 数量
      if ((this.MatchSkuDetail.LoadedToBox as number) < this.Quantity) {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "批次不存在该SKU或待装箱数不满足要求",
          Callback: (Res: boolean): void => {
            this.FocusSkuCode();
          }
        })
        return;
      }

      this.AppendToTable();
    }

    private AppendToTable(): void {
      let SkuObj: Interface.TransferBatchTableDetail = this.TransferBatchTable.LoadedToBoxSku[this.SkuCode];
      // 是否为添加过当前SKU
      if (SkuObj) {
        if (SkuObj.BacthCodeSkuInfo.hasOwnProperty(this.TransferBatchCode)) {
          SkuObj.BacthCodeSkuInfo[this.TransferBatchCode] += this.Quantity;
        } else {
          SkuObj.BacthCodeSkuInfo[this.TransferBatchCode] = this.Quantity;
        }
        SkuObj.Count += this.Quantity;
      } else {
        this.$set(this.TransferBatchTable.LoadedToBoxSku, this.SkuCode, {
          Count: this.Quantity,
          BacthCodeSkuInfo: {
            [this.TransferBatchCode]: this.Quantity
          }
        });
      }

      // 更新批次中待装箱数据
      this.LoadedSkuList.map((Item) => {
        if (Item.SkuCode == (this.MatchSkuDetail as Interface.TransferBatchDeatil).SkuCode) {
          (Item.LoadedToBox as number) -= this.Quantity
        }
      });
      this.$set(this.TransferBatchTable, "OriginWarehouseName", (this.LoadedTransferBatchDetail as Interface.TransferBatch).OriginWarehouseName);
      this.$set(this.TransferBatchTable, "TargetWarehouseName", (this.LoadedTransferBatchDetail as Interface.TransferBatch).TargetWarehouseName);

      // 当前批次SKU已全部加载完成
      if (this.LoadedSkuList.every((Item) => Item.LoadedToBox == 0)) {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "该批次已装货完成",
          Callback: (Res: boolean): void => {
            this.$nextTick(() => {
              this.$set(this, "LoadedTransferBatchDetail", null);
              this.LoadedSkuList.splice(0);
              this.$set(this, "MatchSkuDetail", null);
              this.FocusTransferBatchCode();
            })
          }
        })
      } else {
        this.$UI.Tips.Floating("success", `装货成功`);
        this.$nextTick(() => {
          this.FocusSkuCode();
        })
      }
    }

    private DelSkuCode(SkuCode: string): void {
      if (this.LoadedTransferBatchDetail) {
        for (let Key in this.TransferBatchTable.LoadedToBoxSku) {
          if (Key == SkuCode) {
            this.RestoreToBoxCount(Key);
            break;
          }
        }
      }
      this.$delete(this.TransferBatchTable.LoadedToBoxSku, SkuCode);
    }

    private RestoreToBoxCount(Skucode: string) {
      for (let Idx in this.LoadedSkuList) {
        let SkuObj = this.LoadedSkuList[Idx];
        if (SkuObj.SkuCode == Skucode) {
          this.$set(this.LoadedSkuList[Idx], "LoadedToBox", SkuObj.PickedQuantity - SkuObj.InBoxQuantity);
        }
      }
    }

    private PostShipment(): void {
      // 批次号 == ''
      if (this.TransferBatchCode === "") {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "请先扫描或输入批次号",
          Callback: (Res: boolean): void => {
            this.FocusTransferBatchCode();
          }
        })
        return;
      }
      // sku为空
      if (this.SkuCode === "") {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "请扫描或输入SKU编号",
          Callback: (Res: boolean): void => {
            this.FocusSkuCode();
          }
        });
        return;
      }

      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否确定对当前SKU编号进行装货操作?",
        Callback: (Res: boolean): void => {
          if (Res) {
            this.MatchSkuEncasementCount();
          }
        }
      });
    }

    private PostAccomplish(): void {
      if (Object.keys(this.TransferBatchTable.LoadedToBoxSku).length == 0) {
        this.$UI.Tips.Modal({
          Type: "warning",
          Content: "列表数据为空，无法完成装箱",
          Callback: (Res: boolean): void => {
            this.ResetPage();
          }
        });
        return;
      }
      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否确定进行完成装箱操作?",
        Callback: (Res: boolean): void => {
          if (Res) {
            this.PerformEncasement();
          }
        }
      })
    }

    private PerformEncasement(): void {
      let PostData: Interface.FinishInBox[] = this.GetCommitEncasement();
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.TransferInBoxFinishInBox,
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (res.IsSuccess) {
            this.PrintBoxOrder(res.Data.Data);
            this.$UI.Tips.Modal({
              Type: "confirm",
              Content: "完成装箱成功",
              Callback: (Res: boolean): void => {
                if (Res) {
                  this.HasAllPerform();
                }
              }
            })
          } else {
            this.$Request.Error(res);
          }
        }
      })
    }

    private HasAllPerform() {
      if (this.LoadedSkuList.every((Item) => Item.LoadedToBox == 0)) {
        this.ResetPage();
      } else {
        this.ResetPage(false);
      }
      ;
    }

    private PrintBoxOrder(List: Interface.TransferInBox): void {

      let Code = "";
      if (List.SkuTypeNum === 1) {
        if (List.SkuTotalNum === 1) {
          Code = "A+"
        } else {
          Code = "A"
        }
      } else if (List.SkuTypeNum > 1 && List.SkuTypeNum < 6) {
        Code = "B"
      } else {
        Code = "C"
      }

      let LODOP = GetLodop();

      LODOP.PRINT_INITA("0mm", "0mm", "100.01mm", "100.01mm", "装箱单");
      LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000, "装箱单");

      LODOP.ADD_PRINT_TEXT("5.29mm", "3.18mm", "59mm", "10.58mm", List.StoreInCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);

      LODOP.ADD_PRINT_TEXT("5.29mm", "75.44mm", "59mm", "10.58mm", `${List.SkuTypeNum}-`);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 26);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

      LODOP.ADD_PRINT_TEXT("27.52mm", "14.82mm", "59mm", "10.58mm", `CN - ${List.TargetWarehouseCode}`);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);

      LODOP.ADD_PRINT_TEXT("22.49mm", "62.44mm", "45mm", "24.34mm", Code);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 70);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

      LODOP.ADD_PRINT_BARCODE("60.76mm", "10.58mm", "78.58mm", "14.02mm", "128Auto", List.TransferBoxCode);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
      LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);

      LODOP.ADD_PRINT_TEXT("76.9mm", "9.79mm", "78.05mm", "6.35mm", List.TransferBoxCode);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑", 12);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

      LODOP.ADD_PRINT_TEXT("83.9mm", "1.00mm", "90.05mm", "6.35mm", List.PackageNo);
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑", 12);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

      LODOP.ADD_PRINT_TEXT("92.9mm", "45.44mm", "78.05mm", "10.58mm", "Made in China");
      LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑", 12);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

      LODOP.PRINT();
    }

    private GetCommitEncasement(): Interface.FinishInBox[] {
      let PostData: Interface.FinishInBox[] = [];
      for (let Sku in this.TransferBatchTable.LoadedToBoxSku) {
        for (let BatchCode in this.TransferBatchTable.LoadedToBoxSku[Sku].BacthCodeSkuInfo) {
          let Obj = {
            TransferBatchCode: BatchCode,
            SkuCode: Sku,
            InBoxQuantity: this.TransferBatchTable.LoadedToBoxSku[Sku].BacthCodeSkuInfo[BatchCode]
          };
          PostData.push(Obj);
        }
      }
      return PostData;
    }

    private ResetPage(IsAuto: boolean = true): void {
      this.SkuCode = "";
      this.Quantity = 1;
      this.$set(this, "TransferBatchTable", new Interface.TransferBatchTable());
      this.$set(this, "MatchSkuDetail", null);
      this.$set(this, "LoadedTransferBatchDetail", null);
      this.LoadedSkuList.splice(0);
      if (IsAuto) {
        this.FocusTransferBatchCode();
      } else {
        this.LoadTransferBatchDetail();
      }
    }

    private PostResetBatchData(): void {
      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否确定进行清除批次数据操作?",
        Callback: (Res: boolean): void => {
          if (Res) {
            this.FocusTransferBatchCode();
          }
        }
      })
    }

    private PostReset(): void {
      this.$UI.Tips.Modal({
        Type: "confirm",
        Content: "是否确定进行重置页面操作?",
        Callback: (Res: boolean): void => {
          if (Res) {
            this.ResetPage();
          }
        }
      })
    }

    // form
    private TransferBatchCode: string = "";
    private SkuCode: string = "";
    private Quantity: number = 1;

    private LoadedTransferBatchDetail: Interface.TransferBatch | null = null; // 批次信息
    private LoadedSkuList: Interface.TransferBatchDeatil[] = []; // 已加载的SKU列表
    private TransferBatchTable: Interface.TransferBatchTable = new Interface.TransferBatchTable(); //表格数据
    private MatchSkuDetail: Interface.TransferBatchDeatil | null = null; // 匹配的SKU信息


    private TableH: number = window.innerHeight - 300;

  }
</script>
<style lang="less" scoped>
  /*自定义列表、表格*/
  .ErpTable {
    width: 100%;
    border: 1px solid #E9EAEC;
    overflow-y: scroll;

    thead {
      background-color: #F8F8F9;
    }

    th,
    td {
      height: 40px;
      border: 0px;
      padding: 0 24px;
    }

    .TCenter {
      text-align: center;
    }

    .TLeft {
      text-align: left;
    }

  }
</style>