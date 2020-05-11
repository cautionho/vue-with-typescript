<template>
  <Row class="P-Inline-Block">
    <Col span="24">
      <Import class="P-MB-10" @emit-operate-success="OperateSuccess" v-if="Powers.ImportLogisticsAnomalyRecord" />
      <ChangeProcessStatus ref="ChangeCustomerStatus" class="P-MB-10 P-ML-10" v-if="Powers.ChangeLogisticsCustomerStatus"  @emit-operate-success="OperateSuccess" @emit-get-selected="GetSelected" />
      <AddRemark ref="AddRemark" class="P-MB-10 P-ML-10" v-if="Powers.AddLogisticsRemark" @emit-get-selected="GetSelected" @emit-cancel-select="CancelSelected" />
      <ShipOrderDetails ref="ShipOrderDetails" />
      <Button type="primary" class="P-MB-10 P-ML-10 P-VA-T" v-if="Powers.BatchSendMail" @click="TriggerOperations('SendEmail')">发送邮件</Button>
      <SendEmail ref="SendEmail" v-if="Powers.BatchSendMail" @emit-handle-success="OperateSuccess" />
      <SendStationMail ref="EbayMsgSend" class="P-MB-10 P-ML-10"  @trigger-operations="TriggerOperations" @emit-operate-success="OperateSuccess" />
    </Col>
    <Col span="24"><Table class="P-MB-10" ref="List" :columns="Cols" :data="List" stripe :height="CalculateHeight()"></Table></Col>
    <Col span="24"> <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" /></Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'LogisticsExceptionOrder',
  components: {
    Import: () => import('@/components/Warehouse/ShipOrders/ImportLogisticsExceptionOrder.vue'),
    ChangeProcessStatus: () => import('@/components/Warehouse/ShipOrders/ChangeCustomerProcessType.vue'),
    AddRemark: () => import('@/components/Warehouse/ShipOrders/LogisticsExceptionAddRemark.vue'),
    ShipOrderDetails: () => import('@/components/Warehouse/ShipOrders/ShipOrderDetails.vue'),
    SendEmail: () => import('@/components/CustomerService/Mail/WriteMail.vue'),
    SendStationMail: () => import('@/components/CustomerService/Ebay/WriteStationMail.vue')
  }
})

export default class LogisticsExceptionOrder extends Vue {
  @Emit() private EmitPagerChange(Pager: PInterface.Pager): void {}

  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['ImportLogisticsAnomalyRecord', 'ReplyLogisticsAnomalyRecord', 'AddLogisticsRemark', 'ChangeLogisticsCustomerStatus', 'BatchSendMail'])) 
  }

  private CalculateHeight(): number {
    return this.$UI.FullHeight() - ((Object.values(this.Powers) as boolean[]).includes(true) ? 255 : 210);
  }

  private RenderOperates(h: any, Params: any): void {
    let Operations: PInterface.KV[] = [{ Key: '查看', Value: 'ShipOrderView' }]
    this.Powers.AddLogisticsRemark ? Operations.push({ Key: '添加备注', Value: 'AddRemark' }) : null;
    this.Powers.ChangeLogisticsCustomerStatus ? Operations.push({ Key: '更改客服联系状态', Value: 'ChangeCustomerStatus' }) : null;
    return h( "Dropdown", {
        on: {
          "on-click": (N: string) => { this.CancelSelected(); this.$nextTick(()=>{ this.TriggerOperations(N, Params.row); }) }
        }
      }, [
        h("a", [
          h("span", { class: "P-MR-5" }, "操作"),
          h("Icon", { props: { type: "ios-arrow-down" } })
        ]),
        h( "DropdownMenu", { slot: "list" }, Operations.map((item: PInterface.KV): string => {
            return h( "DropdownItem", { props: { name: item.Value }, class: "P-TA-C" }, item.Key );
          })
        )
      ]
    );
  }

  private ChangePage(N: number): void {
    this.$set(this.Pager, 'PageIndex', N)
    this.EmitPagerChange(this.Pager);
  }
  private ChangePageSize(N: number): void {
    this.$set(this.Pager, 'PageSize', N)
    this.EmitPagerChange(this.Pager);
  }

  private GetSelected(Ref: string): void {
    (this as any).$refs[Ref].TriggerSelected((this as any).$refs.List.getSelection())
  }

  private CancelSelected(): void {
    (this as any).$refs.List.selectAll(false)
  }

  /* 转发操作项 */
  private TriggerOperations(T: string, D: Interface.LogisticsExcaption): void {
    switch(T){
      case 'SendEmail':
      case 'EbayMsgSend':
        this.ValidateSelected(T);
        break;
      case 'ShipOrderView':
        (this as any).$refs.ShipOrderDetails.Validate({OrderId: D.Id, OrderCode: D.OrderCode})
        break
      default:
        (this as any).$refs[T].TriggerSelected([D])
        break
    }
  }

  private ValidateSelected(T: string): void {
    const Selected = (this as any).$refs.List.getSelection()
    if(!Selected.length){
      this.$UI.Tips.Floating('warning', '请选择订单进行操作');
      return;
    }
    (this as any).$refs[T].TriggerLogisticsWrite(Selected);
  }

  private OperateSuccess(): void {
    this.EmitPagerChange(this.Pager)
  }

  private Powers: PInterface.Power = {}
  private List: Interface.LogisticsExcaption[] = []

  private Pager: PInterface.Pager = new PInterface.Pager()

  private Cols: PInterface.TableCol[] = [{
    type: 'selection', width: 60, align: 'center'
  }, {
    title: '发货单号/订单号',
    width: 140,
    render: (h: any, Params: any): string => {
      return h("div", [
        h("a", {
          on: {
            click: () => {
              this.CancelSelected()
              this.$nextTick(()=>{
                this.TriggerOperations('ShipOrderView', Params.row);
              })
            }
          }
        }, Params.row.OrderCode),
        h("p", Params.row.PlatformOrderId)
      ])
    }
  }, {
    title: '发货仓',
    key: 'WarehouseName',
    width: 140
  }, {
    title: '国家',
    key: 'Country',
    width: 140
  }, {
    title: "物流渠道/跟踪号",
      key: "",
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          { Key: "物", Value: Params.row.ShipMethodName || "-" },
          { Key: "跟", Value: Params.row.TrackingNumber || "-" }
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
  }, {
      title: "平台/店铺/买家ID",
      key: "",
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          {
            Key: "平",
            Value:
              this.$Enums.Sales.Platform[Params.row.Platform] || "-"
          },
          { Key: "店", Value: Params.row.StoreName || "-" },
          { Key: "买", Value: Params.row.BuyerId || "-" }
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
    }, {
      title: '物流状态/物流信息/异常原因',
      width: 300,
      render: (h: any, Params: any): string => {
        const Remarks: PInterface.KV[] = [
            { Key: "状", Value: this.$Enums.CustomerService.LogisticsStatus[Params.row.LogisticsStatus] || "-" },
            { Key: "流", Value: Params.row.LogisticsInfo || "-" },
            { Key: "异", Value: Params.row.LogisticsAnomalyReason || "-" }
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
    }, {
      title: "下单/付款/发货时间", width: 180,
      render: (h: any, Params: any): string => {
        const Dates: PInterface.KV[] = [
          {
            Key: "下",
            Value: this.$UI.Render.Date(Params.row.CreatedTime, true)
          },
          {
            Key: "付",
            Value: this.$UI.Render.Date(Params.row.PayTime, true)
          },
          {
            Key: "发",
            Value: this.$UI.Render.Date(Params.row.ShipTime, true)
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
    }, {
      title: '客服联系状态',
      width: 120,
      render: (h: any, Params: any): string => {
        return h('span', this.$Enums.CustomerService.CustomerHandleProcess[Params.row.CustomerStatus])
      }
    }, {
      title: '添加时间', width: 160,
      render: (h: any, Params: any): string => {
        return h('span', this.$UI.Render.Date(Params.row.OrderTime, true))
      }
    }, {
      title: '操作', width: 100,
      render: this.RenderOperates
    }]
}
</script>
<style lang="less" scoped>

</style>