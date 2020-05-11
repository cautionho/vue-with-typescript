<template>
  <Row class="tal">
    <Col span="24">
      <Table class="P-MT-10" size="small" :highlight-row="true" :columns="Cols" :data="List" border stripe :height="List.length > 5 ? 400 : 0"></Table>
    </Col>
    <ShowBigPic ref="ShowBigPic" />
    <!-- SKU详情 -->
    <SkuDetail ref="SkuDetail" />
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Product';
@Component({
  name: 'SkuManage_Expand',
  components: {
    ShowBigPic: () => import ('@/components/Public/ShowBigPic.vue'),
    SkuDetail: () => import('@/components/Product/Sku/SkuDetail.vue'),
  }
})
export default class SkuManage_Expand extends Vue {
  @Prop() Row: Interface.SkuManageList; // 目标行
  @Prop() OperateDrop: PInterface.KV[];

  @Emit() Operate(Type:number, Idx?:number, OtherList?: Interface.SkuManageList[]): void {}

  private mounted(): void {
    this.GetList();
  }

  private GetList(): void {
    this.$UI.Loading.Show();
		this.$set(this, 'List', []);

		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.SkuGetList,
				Login: true
			},
			Data: { PageIndex: 1, PageSize: 100, Conditions: {
        MainId: this.Row.Id,
        IsBindSku: ''
      }},
			Callback: (Res: PInterface.Res): void => {
				this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.$set(this, 'List', Res.Data.PageModel.Items);
				} else {
					this.$Request.Error(Res);
				}
			}
		})
  }

  // Method层触发Emit
  private HandleOperate(Type: number, Index: number) {
    this.Operate(Type, Index, this.List);
  }
  
  // 查看大图
  private ShowPic(Url: string){
    (this as any).$refs.ShowBigPic.Trigger(Url);
  }

  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); // 状态枚举下拉
  
  private List: Interface.SkuManageList[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, Params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + Params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(Params.row.DefaultImage)
            }
          }
        })
      }
    },
    { title: 'SKU编号/产品名', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          'content': (Params.row as any).SkuName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent',
        
      }, [
        h('p', {
          class: 'P-MT-5 P-Pointer',
          on: {
          click: () => {
              (this.$refs['SkuDetail'] as Vue).Trigger((Params.row as any).SkuCode);
            }
          }
        }, (Params.row as any).SkuCode ),
        h('p', {
          class: 'P-MT-5'
        }, (Params.row as any).SkuName )
      ])
    }},
    { title: '品类/特性标签', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "品"),
          h('span', (Params.row as any).CategoryName )
        ]),
        h('p', { class: 'P-LINE-1' }, [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "特"),
          h('span',  (Params.row as any).Attribute )
        ])
      ])
    }},
    { title: '供应商/采购价', render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          'content': `【供应商】${(Params.row as any).DefaultSupply.SupplyName === null ? '暂无供应商': (Params.row as any).DefaultSupply.SupplyName}`,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "供"),
          h('span', (Params.row as any).DefaultSupply.SupplyName )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
          h('span', `${(Params.row as any).DefaultSupply.PurchasePrice}${(Params.row as any).DefaultSupply.CurrencyCode}` )
        ])
      ])
    }},
    { title: '体积(cm³)/毛重(g)/净重(g)', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "体"),
          h('span', `${ (Params.row as any).Length }*${ (Params.row as any).Width }*${ (Params.row as any).Height }`)
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "毛"),
          h('span', (Params.row as any).GrossWeight )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "净"),
          h('span', (Params.row as any).NetWeight )
        ])
      ])
    }},
    { title: '开发员/采购员/销售主管', render: (h: any, Params: any): string => {
      return h('div', [
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "开"),
          h('span', (Params.row as any).DevUserName )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "采"),
          h('span', (Params.row as any).Purchaser )
        ]),
        h('p', [
          h('span', { class: 'P-Table-Tip P-BG-Primary' }, "销"),
          h('span', (Params.row as any).SaleManager )
        ])
      ])
    }},
		{ title: '创建时间', width: 160, key: 'CreateTime', render: (h: any, Params: any): string => h('div', {}, this.$UI.Render.Date( Params.row.CreateTime, true)) },
    { title: '状态', key: 'IsEnable', width: 120,
      render: (h: any, Params: any): string => {
			  return h('Tag', {
          props: { color: ['primary', 'primary', 'success', 'primary', 'warning', 'error', 'primary', 'warning'][(Params.row as any).Status - 1] }
        }, this.$Enums.Warehouse.SkuStatus[(Params.row as any).Status] )
      }
    },
    { title: '操作', width: 100, render: (h: any, Params: any): string => {
        return h('Dropdown',{
					on: {
            'on-click': (Type: any) => {
              this.HandleOperate(Type, Params.row._index);
            }
          }
				}, [
					h('a', [
						h('span', { class: 'P-MR-5' }, '操作'),
						h('Icon', { props: { type: 'ios-arrow-down' } })
					]),
					h('DropdownMenu', { slot: 'list' }, this.OperateDrop.map((Item: PInterface.KV): string => {
						return h('DropdownItem',{
							props: {
								name: Item.Value
							},
              class: "P-TA-C",
						}, Item.Key);
					}))
				])
      }
    }
  ];
}

</script>
<style lang="less"></style>