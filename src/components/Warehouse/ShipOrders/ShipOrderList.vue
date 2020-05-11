<template>
  <Col span="24">
  <span v-for="(Index,Item) in GetUsablePowers()" :key="Item">
    <component v-show="TOperations.find(Itm => Itm === Item)" v-if="Item !== 'AddShipOrderRemark'" :is="Item" :ref="Item" :Page="Page" @trigger-operations="TriggerOperations" @emit-operate-success="EmitOperateSuccess" class="P-Inline-Block P-MR-10 P-MB-10"></component>
  </span>
  <Table ref="ShipOrderList" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()" @on-selection-change="GetSelectedData"></Table>
  <Page class="P-MT-10" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
  </Col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { Getter } from "vuex-class";
import Interface from '@/assets/Interface/ShipOrder';
import PInterface from "@/assets/Interface/Public";

const Components: PInterface.KV[] = [{
  Key: 'ShipOrderExpand',
  Value: './ShipOrderExpand'
},{
  Key: 'ShipOrderCreate',
  Value: './Create' // 添加订单
}, {
  Key: 'ShipOrderModify',
  Value: './ModifyOrder' // 编辑订单
}, {
  Key: 'ImportShipOrder',
  Value: './ImportShipOrder' // 导入订单
}, {
  Key: 'ToConfirmed',
  Value: './Confirm' // 确认
}, {
  Key: 'ToNoCheck',
  Value: './Check' // 检查
}, {
  Key: 'ToCancel',
  Value: './Cancel' // 取消
}, {
  Key: 'ToHoldUp',
  Value: './HoldUp' // 拦截
}, {
  Key: 'ToOutStock',
  Value: './SetStockout' // 设置缺货
}, {
  Key: 'ToContact',
  Value: './Contact' // 联系客户
}, {
  Key: 'SplitShipOrder',
  Value: './Split' // 拆分
}, {
  Key: 'MergeShipOrder',
  Value: './Merge' // 合并
}, {
  Key: 'ChangeShipWarehouse',
  Value: './SetShipWarehouse' // 设置发货仓
}, {
  Key: 'CancelFLSFlag',
  Value: './CancelFLS' // 取消FLS包裹单
}, {
  Key: 'CancelLmaParcel',
  Value: './CancelLMA' // 取消LMA包裹单
}, {
  Key: 'ReSentOrder',
  Value: './Resent' // 重发
}, {
  Key: 'SetShippingMethod',
  Value: './SetShippingMethod' // 设置物流渠道
}, {
  Key: 'PrintLable',
  Value: './PrintLabel' // 打印面单
}, {
  Key: 'CreateBatchOrder',
  Value: './CreateBatch' // 生成拣货批次
}, {
  Key: 'QuickCreateBatchOrder',
  Value: './QuickCreateBatch' // 批量生成拣货批次
}, {
  Key: 'ReturnGoods',
  Value: './ReturnGoods' // 释放订单到已确认
}, {
  Key: 'UpdEdisPackage',
  Value: './UpdateEdis' // 更新Edis包裹
}, {
  Key: 'ExportShipOrder',
  Value: './Export' // 导出
}, {
  Key: 'SetTrackNumber',
  Value: './SetTrackingNumber' // 录入跟踪号
}, {
  Key: 'ReplaceLogisticsLabel',
  Value: './ReplaceLogisticsLabel' // 更换面单
}, {
  Key: 'OrderReCreate',
  Value: './ReCreate' // 重新下单
}, {
  Key: 'SignShiped',
  Value: './SignShiped' // 标记发货
}, {
  Key: 'RevertPack',
  Value: './RevertPack' // 还原打包
}, {
  Key: 'ReviewShipOrder',
  Value: './Review' // 审核通过
}, {
  Key: 'ExportDetailsErrorOrder',
  Value: './ExportSkuErrorOrder' // 导出明细错误订单
}]

function AsyncComps(): any {
  let Async = []
  for(let Idx = 0, Len = Components.length; Idx < Len; Idx++){
    Async.push(() => ({
      component: import(`${Components[Idx].Value}.vue`),
      delay: 1000,
      timeout: 3000
    }))
  }
  return Async
}

const [ShipOrderExpand, ShipOrderCreate, ShipOrderModify, ImportShipOrder, ToConfirmed, ToNoCheck, ToCancel, ToHoldUp, ToOutStock, ToContact, SplitShipOrder, MergeShipOrder,
      ChangeShipWarehouse, CancelFLSFlag, CancelLmaParcel, ReSentOrder, SetShippingMethod, PrintLable, CreateBatchOrder, QuickCreateBatchOrder, ReturnGoods,
      UpdEdisPackage, ExportShipOrder, SetTrackNumber, ReplaceLogisticsLabel, OrderReCreate, SignShiped, RevertPack, ReviewShipOrder, ExportDetailsErrorOrder] = [...AsyncComps()]

for(let Idx = 0, Len = Components.length; Idx < Len; Idx++){
  Vue.component((Components[Idx].Key as string), (resolve: () => void, reject: () => void) => {
    setTimeout(() => {
      const Path: string = Components[Idx].Value as string
      require([`${Path}.vue`], resolve)
    }, 1000)
  })
}

@Component({
  name: "ShipOrderList",
  components: {
    EbayMsgSend: () => import('@/components/CustomerService/Ebay/WriteStationMail.vue'), // 发送站内信
  }
})

export default class ShipOrderList extends Vue {
  @Prop(Array) private List: Interface.ShipOrderList[];
  @Prop({default: ()=>{return []}}) private TOperations: string[];
  @Prop(String) private Page:string;

  @Getter private "ShipOrder/SHIP_ORDER_POWERS": PInterface.Power;
  get SHIP_ORDER_POWERS() {
    return this["ShipOrder/SHIP_ORDER_POWERS"];
  }

  @Emit() EmitPagerChange(Pager: PInterface.Pager): void {}
  @Emit() EmitDetails(Params: Interface.InfoParams): void {}
  @Emit() EmitCloseSearch(): void {}


  private mounted() {
    this.SetStatus();
  }

  /* 设置展示列 */
  private SetStatus(): void {
    let Pages: string[] = ['Confirmed', 'WaitPick', 'Picked', 'Packed', 'Shiped','StockOut', 'HoldUp','Contact', 'ClearOutStock']
    if (this.IsFromSales || !Pages.includes(this.Page)) {
      this.Cols.splice(-1, 0, {
        title: "状态",
        width: 80,
        render: (h: any, Params: any): string => {
          return h(
            "span",
            this.$Enums.Warehouse.ShipOrderStatus[Params.row.ShipOrder.Status]
          );
        }
      });
    }
  }

  /* 可使用操作项 */
  private GetUsablePowers():PInterface.Power{
    let P:PInterface.Power = {}, AllP: PInterface.Power = {};
    // AddShipOrderRemark 为订单详情中特有的操作，无需在列表组件中展示
    for(let Item in this.SHIP_ORDER_POWERS){
      if(this.SHIP_ORDER_POWERS[Item] && Item !== 'AddShipOrderRemark'){
        AllP[Item] = this.SHIP_ORDER_POWERS[Item]
        if(this.TOperations.find(Itm => Itm === Item)){
          P[Item] = this.SHIP_ORDER_POWERS[Item]
        }
      }
    }
    this.$set(this, 'IsHasTopOperateUsable', Object.keys(P).some( Itm => P[Itm] === true ))
    return AllP;
  }

  /* 计算列表高度 */
  private CalculateHeight(): number {
    return this.$UI.FullHeight() - 210 - (this.IsHasTopOperateUsable ? 42 : 0);
  }
  /* 触发切换页码 */
  private ChangePage(P: number):void {
    this.$set(this.Pager, "PageIndex", P);
    this.EmitPagerChange(this.Pager);
  }
  /* 触发切换页码展示量 */
  private ChangePageSize(P: number):void {
    this.$set(this.Pager, "PageSize", P);
    this.EmitPagerChange(this.Pager);
  }
  /* 设置总条数 */
  private SetTotalItems(Total: number): void {
    this.Pager.TotalItems = Total;
  }
  /* 重置分页器 */
  private PagerReset():void {
    this.Pager = new PInterface.Pager();
  }

  /* 操作成功 重新获取列表数据 */
  private EmitOperateSuccess():void {
    this.CancelSelected();
    this.EmitPagerChange(this.Pager);
  }

  /* 判断数据可操作功能 */
  private GetOrderOperations(Params: any): PInterface.KV[] {
    let Os: PInterface.KV[] = [];
    for (let Item in this.SHIP_ORDER_POWERS) {
      if (this.SHIP_ORDER_POWERS[Item]) {
        const Status = Params.ShipOrder.Status,
          IsException = Params.ShipOrder.IsException,
          MethodApiType = Params.ShipOrder.MethodApiType,
          ApiType = Params.ShipOrder.ApiType,
          IsOverseas = [15, 16, 17].includes(ApiType),
          IsTrackingNumber = Params.ShipOrder.TrackingNumber !== "",
          ItemType = Params.ShipOrder.ItemType,
          WarehouseId = Params.ShipOrder.ShipWarehouseId,
          ShippingMethodId = Params.ShipOrder.ShippingMethodId;
        switch (Item) {
          case "CancelFLSFlag":
            if (
              ApiType === 26 &&
              IsTrackingNumber &&
              MethodApiType &&
              [7, 8, 9, 99].includes(Status)
            ) {
              Os.push({ Key: "取消FLS包裹单", Value: Item });
            }
            break;
          case "CancelLmaParcel":
            if (
              ApiType === 29 &&
              IsTrackingNumber &&
              MethodApiType &&
              [7, 8, 9, 99].includes(Status)
            ) {
              Os.push({ Key: "取消LMA包裹单", Value: Item });
            }
            break;
          case "ShipOrderModify":
            if (
              [1, 7, 8, 9].includes(Status) ||
              ([2, 3, 4].includes(Status) && IsException)
            ) {
              Os.push({ Key: "编辑", Value: Item });
            }
            break;
          case "ToConfirmed":
            if ([1, 7, 8, 9].includes(Status) && WarehouseId && ShippingMethodId) {
              Os.push({ Key: "确认", Value: Item });
            }
            break;
          case "ToCancel":
            if ([1, 7, 8, 9].includes(Status)) {
              Os.push({ Key: "取消", Value: Item });
            }
            break;
          case "ToContact":
            if ([2, 7, 8].includes(Status) && !IsOverseas) {
              Os.push({ Key: "联系客户", Value: Item });
            }
            break;
          case "SplitShipOrder":
            if (
              ItemType !== 1 &&
              (([2, 4, 7, 8, 9].includes(Status) && !IsOverseas) ||
                (IsOverseas && IsException))
            ) {
              Os.push({ Key: "拆分", Value: Item });
            }
            break;
          case "SetShippingMethod":
            if (
              ([2, 3].includes(Status) && IsException) ||
              [4, 7, 9].includes(Status)
            ) {
              Os.push({ Key: "设置物流渠道", Value: Item });
            }
            break;
          case "ChangeShipWarehouse":
            if ([7, 9].includes(Status)) {
              Os.push({ Key: "设置发货仓", Value: Item });
            }
            break;
          case "ToOutStock":
            if (Status === 3) {
              Os.push({ Key: "设置缺货", Value: Item });
            }
            break;
          case "ReSentOrder":
            if (Status === 6) {
              Os.push({ Key: "重发", Value: Item });
            }
            break;
          case "PrintLable":
            if ([5, 6].includes(Status)) {
              Os.push({ Key: "重打面单", Value: Item });
            }
            break;
          case "RevertPack":
            if (Status === 5) {
              Os.push({ Key: "还原打包", Value: Item });
            }
            break;
          case "ToNoCheck":
            if (Status === 99) {
              Os.push({ Key: "检查", Value: Item });
            }
            break;
          case "ToHoldUp":
            if ([2, 3, 4, 5].includes(Status) && !IsOverseas) {
              Os.push({ Key: "拦截", Value: Item });
            }
            break;
          case "UpdEdisPackage":
            if (ApiType === 20 && [7, 8, 9].includes(Status)) {
              Os.push({ Key: "更新eDIS包裹", Value: Item });
            }
            break;
        }
      }
    }
    Os.push({ Key: "查看", Value: "ShipOrderView" });
    return Os;
  }

  /* 判断数据标签 */
  private GetShipOrderTags(ShipOrder:Interface.ShipOrderBase):string[]{
    let Ts:string[] = [],ShipOrderExt:Interface.ShipOrderExt = ShipOrder.ShipOrderExt ? JSON.parse(ShipOrder.ShipOrderExt) : new Interface.ShipOrderExt() ;
    Ts.push(ShipOrder.IsApiDownLoad ? 'API' : '手' );
    ShipOrder.IsHoldUp ? Ts.push('拦截') : null;
    ShipOrder.IsMerge ? Ts.push('合') : null;
    ShipOrder.IsSplit ? Ts.push('拆') : null;
    ShipOrder.IsReport ? Ts.push('报表') : null;
    ShipOrder.IsException ? Ts.push('异') : null;
    ShipOrderExt.LazadaGC ? Ts.push('GC') : null;
    ShipOrderExt.WishExpress ? Ts.push('Wish WE') : null;
    ShipOrderExt.WishEPC ? Ts.push('EPC') : null;
    ShipOrderExt.PremiumCarrier ? Ts.push('优') : null;
    ShipOrderExt.VovaIsCombinedOrder ? Ts.push('集运') : null;
    ShipOrder.AfterSaleOrderType === 1 ? Ts.push('退') : null;
    ShipOrder.AfterSaleOrderType === 2 ? Ts.push('重') : null;
    return Ts;
  }

  /* 获取列表选中数据 */
  private GetSelectedData(D:Interface.ShipOrderList[]):void {
    this.$set(this,'SelectedData',D);
  }

  /* 清空列表选中数据 */
  private CancelSelected():void {
    (this as any).$refs.ShipOrderList.selectAll(false);
    this.GetSelectedData([])
  }

  /* 触发操作 N-操作项的权限ID B-是否列表操作项 */
  private TriggerOperations(N:string,B?:boolean):void{
    this.EmitCloseSearch();
    switch(N){
      case 'ShipOrderView':
        this.EmitDetails({ OrderId: this.SelectedData[0].ShipOrder.Id, OrderCode: "" });
        this.CancelSelected()
        break;
      case 'EbayMsgSend':
        (this as any).$refs.EbayMsgSend[0].TriggerWrite(this.SelectedData);
        break
      default:
        if(!this.SelectedData.length){
          this.$UI.Tips.Floating('warning','请选择发货订单进行操作');
          return;
        };  
        (this as any).$refs[N][0].Validate(JSON.parse(JSON.stringify(this.SelectedData)));
        if(B){
          /* 列表操作项需清空选中数据 因数据已经传输到指定位置 */
          this.CancelSelected()
        }
        break;
    }
  }

  private Cols: PInterface.TableCol[] = [
    { type: "selection", width: 60, align: "center" },
    {
      type: 'expand', width: 40, align: "center", render: (h:any, Params:any): string => {
        return h( ShipOrderExpand , {
          props: {
            ShipOrder: Params.row
          }
        })
      }
    },
    {
      title: "发货单/订单/标识",
      key: "",
      render: (h: any, Params: any): string => {
        const Tags = this.GetShipOrderTags(Params.row.ShipOrder),
         RemarksContents = Params.row.Remark.map((Item: Interface.ShipOrderRemark) => {
          return h('p', `${Item.UserName}：${Item.Content}`)
        }), 
        TooltipsCont = [h("div", { slot: "content" }, RemarksContents)],
        RemarkIcon = [h("Icon", {props:{type:'ios-text'}})],Remark = Params.row.Remark.length ? h("Tooltip", { class: "P-Table-Tip P-BG-Error" }, RemarkIcon.concat(TooltipsCont)) : ''
        
        return h("div", [
          h("a", {
            on: {
              click: () => {
                this.GetSelectedData([Params.row])
                this.$nextTick(()=>{
                  this.TriggerOperations('ShipOrderView' ,true);
                })
              }
            }
          }, Params.row.ShipOrder.OrderCode),
          h("p", Params.row.ShipOrder.PlatformOrderId),
          h("p", Tags.map((Item:string):string=>{
           return h("span", { class: "P-Table-Tip P-BG-Error" }, Item)
          }).concat(Remark) )
        ]);
      }
    },
    {
      title: "国家/收件人/电话",
      key: "",
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          {
            Key: "国",
            Value: `${
              Params.row.Address.Country
                ? Params.row.Address.Country.CountryNameCn
                : "-"
            }(${
              Params.row.Address.Country
                ? Params.row.Address.Country.CountryName
                : "-"
            })`
          },
          { Key: "收", Value: Params.row.Address.BuyerFullName || "-" },
          { Key: "电", Value: Params.row.Address.BuyerPhone || "-" }
        ];
        return h(
          "div",
          Dates.map(Item =>
            h("p", [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
              h("span", Item.Value)
            ])
          )
        );
      }
    },
    {
      title: "地址/邮编",
      width: 300,
      render: (h: any, Params: any): string => {
        return h("div", [
          h(
            "Tooltip",
            {
              class: "P-LINE-3",
              props: {
                content: `${Params.row.Address.BuyerStreet2} ${Params.row.Address.BuyerStreet1} ${Params.row.Address.BuyerCity} ${Params.row.Address.BuyerState}`
              }
            },
            [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, "地"),
              h(
                "span",
                `${Params.row.Address.BuyerStreet2} ${Params.row.Address.BuyerStreet1} ${Params.row.Address.BuyerCity} ${Params.row.Address.BuyerState}`
              )
            ]
          ),
          h("p", [
            h("span", { class: "P-Table-Tip P-BG-Primary" }, "邮"),
            h("span", Params.row.Address.BuyerZipCode || "-")
          ])
        ]);
      }
    },
    {
      title: "交易号/原金额/美金金额",
      key: "",
      render: (h: any, Params: any): string => {
        return h("div", [
          h(
            "Tooltip",
            {
              props: {
                content: Params.row.ShipOrder.TransationId || "-"
              },
              class: "P-LINE-1"
            },
            [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, "交"),
              h("span", Params.row.ShipOrder.TransationId || "-")
            ]
          ),
          h("p", [
            h("span", { class: "P-Table-Tip P-BG-Primary" }, "原"),
            h(
              "span",
              `${Params.row.ShipOrder.PayPrice}${Params.row.ShipOrder.PayCurrency}`
            )
          ]),
          h("p", [
            h("span", { class: "P-Table-Tip P-BG-Primary" }, "美"),
            h("span", `${Params.row.ShipOrder.TotalPrice}USD`)
          ])
        ]);
      }
    },
    {
      title: "物流渠道/跟踪号/批次号",
      key: "",
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          { Key: "物", Value: Params.row.ShipOrder.MethodName || "-" },
          { Key: "跟", Value: Params.row.ShipOrder.TrackingNumber || "-" },
          { Key: "批", Value: Params.row.ShipOrder.BatchNumber || "-" }
        ];
        return h(
          "div",
          Dates.map(Item =>
            h("p", [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
              h("span", Item.Value)
            ])
          )
        );
      }
    },
    {
      title: "平台/店铺/买家ID",
      key: "",
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          {
            Key: "平",
            Value:
              this.$Enums.Sales.Platform[Params.row.ShipOrder.Platform] || "-"
          },
          { Key: "店", Value: Params.row.ShipOrder.StoreName || "-" },
          { Key: "买", Value: Params.row.ShipOrder.BuyerUserId || "-" }
        ];
        return h(
          "div",
          Dates.map(Item =>
            h("p", [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
              h("span", Item.Value)
            ])
          )
        );
      }
    },
    {
      title: "发货仓/重量/运费",
      key: "",
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          { Key: "仓", Value: Params.row.ShipOrder.WarehouseName || "-" },
          { Key: "重", Value: Params.row.ShipOrder.Weight || "-" },
          { Key: "运", Value: Params.row.ShipOrder.ShipFee || "-" }
        ];
        return h(
          "div",
          Dates.map(Item =>
            h("p", [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
              h("span", Item.Value)
            ])
          )
        );
      }
    },
    {
      title: "买家/操作/异常备注",
      key: "",
      render: (h: any, Params: any): string => {
        const Remarks: PInterface.KV[] = [
            { Key: "买", Value: Params.row.ShipOrder.BuyerRemark || "-" },
            { Key: "操", Value: Params.row.ShipOrder.Remark || "-" },
            { Key: "异", Value: Params.row.ShipOrder.AutoMatchRemark || "-" }
          ],
          RemarksContents: string[] = [],
          RemarksComps: string[] = Remarks.map((Item: PInterface.KV) => {
            RemarksContents.push(h("p", `[${Item.Key}] ${Item.Value}`));
            return h("p", { class: "P-LINE-1" }, [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
              h("span", Item.Value)
            ]);
          }),
          TooltipsCont = h("div", { slot: "content" }, RemarksContents);
        return h(
          "Tooltip",
          { class: "P-W-100-Percent P-MT-5" },
          RemarksComps.concat(TooltipsCont)
        );
      }
    },
    {
      title: "下单/付款/发货时间", width: 180,
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          {
            Key: "下",
            Value: this.$UI.Render.Date(Params.row.ShipOrder.CreateTime, true)
          },
          {
            Key: "付",
            Value: this.$UI.Render.Date(Params.row.ShipOrder.PaidTime, true)
          },
          {
            Key: "发",
            Value: this.$UI.Render.Date(Params.row.ShipOrder.ShipedTime, true)
          }
        ];
        return h(
          "div",
          Dates.map(Item =>
            h("p", [
              h("span", { class: "P-Table-Tip P-BG-Primary" }, Item.Key),
              h("span", Item.Value)
            ])
          )
        );
      }
    },
    {
      title: "操作",
      width: 100,
      render: (h: any, Params: any): string => {
        const Operations: PInterface.KV[] = this.GetOrderOperations(Params.row);
        return h(
          "Dropdown",
          {
            on: {
              "on-click": (n: string) => {
                this.GetSelectedData([Params.row])
                this.$nextTick(()=>{
                  this.TriggerOperations(n,true);
                })
              }
            }
          },
          [
            h("a", [
              h("span", { class: "P-MR-5" }, "操作"),
              h("Icon", { props: { type: "ios-arrow-down" } })
            ]),
            h(
              "DropdownMenu",
              { slot: "list" },
              Operations.map((item: PInterface.KV): string => {
                return h(
                  "DropdownItem",
                  { props: { name: item.Value }, class: "P-TA-C" },
                  item.Key
                );
              })
            )
          ]
        );
      }
    }
  ];
  private Pager:PInterface.Pager = new PInterface.Pager();
  private SelectedData:Interface.ShipOrderList[] = []
  private IsFromSales:boolean = false
  private IsHasTopOperateUsable: boolean = true
}
</script>
<style lang="less" scoped>
</style>