<template>
  <Row class="tal">
    <Col span="24">
      <Table size="small" :highlight-row="true" :columns="PurchaseOederCol" :data="PropRow" stripe></Table>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import PInterface from '../../../assets/Interface/Public';
  import Interface from '../../../assets/Interface/Warehouse';
  @Component({
    name: 'PickBatchDetail_Expand'
  })
  export default class PurchaseOrder_expand extends Vue {
    @Prop() PropRow: Interface.PickBatchOrderTableDetail[];

    private PurchaseOederCol: PInterface.TableCol[] = [{
      title: 'SKU编号',
      key: 'SkuCode'
    }, {
      title: '产品名',
      key: '',
      render: (h:any, Params:any) => {
        return h('Tooltip', {
          props: {
            content: Params.row.SkuName
          },
          class: 'P-LINE-1'
        }, Params.row.SkuName)
      }
    }, {
      title: '购买数量',
      key: 'Quantity',
    }, {
      title: '已拣数量',
      key: 'PickedQuantity',
    }, {
      title: 'ItemId',
      key: 'ItemId',
    }, {
      title: '到货单号',
      key: 'PaoCode'
    }];
  }
</script>

<style scoped>

</style>