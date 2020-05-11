<template>
	<Modal title="修改调拨需求" v-model="ModifyModal" :mask-closable="false" width="700" @on-cancel="ModifyRes(false)">
    <Table :columns="Columns" :data="ProductData" border></Table>
    <footer slot="footer" class="P-TA-R">
      <Button @click="PostModify" type="primary">修改</Button>
      <Button @click="ModifyRes(false)">返回</Button>
    </footer>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';
@Component({
  name: 'ModifyTransferDemand'
})
export default class ModifyTransferDemand extends Vue {
  @Emit() ModifyRes(Val: boolean){
    this.ModifyModal = false;
    this.ProductData = [];
  }

  private TriggerModal(SelectData:Interface.TransferDemandList): void{
    let Obj:Interface.ProductInfoTb = new Interface.ProductInfoTb();
    Obj.Id = SelectData.Id
    Obj.SkuCode = SelectData.SkuCode
    Obj.SkuName = SelectData.SkuName
    Obj.Quantity = SelectData.Quantity
    this.ProductData.push(Obj)

    this.ModifyModal = true;
  }

  private PostModify(): void{
    if( this.ProductData[0].Quantity==0 ){
      this.$UI.Tips.Floating('warning', '调拨数量必须大于0');
      return;
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Warehouse,
			Api: {
				Address: this.$Api.TransferRequireModify,
				Login: true
			},
			Data: { Id: this.ProductData[0].Id, Quantity: this.ProductData[0].Quantity },
			Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', '修改调拨需求成功');
          this.ModifyRes(true)
				} else {
          this.$Request.Error(Res);
				}
			}
		})
  }

  //表格内数据填充到提交数据
  private SetTabInput(Val: string|number, Idx: number, Key:string): void{
    (this.ProductData[Idx] as any)[Key] = Val
  }

  private ProductData: Interface.ProductInfoTb[] = []
  private ModifyModal: boolean = false;
  private Columns: PInterface.TableCol[] = [
    { title: '物品列表',
      children: [
        { title: 'SKU编号', key: 'SkuCode' },
        { title: '产品名', key: 'SkuName' },
        { title: '调拨数量', key: 'Quantity', render: (h: any, Params: any): string => 
          h('InputNumber', {
            props: {
              placeholder: '请输入调拨数量',
              value: Params.row.Quantity
            },
            class: 'P-W-98-Percent',
            on: {
              'on-change': (Val: number) => {
                this.SetTabInput(Val, Params.index, 'Quantity')
              }
            }
          })
        }
      ]
    }
  ]
}

</script>
<style lang="less"></style>
