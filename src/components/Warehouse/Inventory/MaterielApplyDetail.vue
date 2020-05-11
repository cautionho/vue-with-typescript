<template>
  <Row class="P-Inline-Block">
    <Modal title="物料申请详情" v-model="IsShowModal" :mask-closable="false" @on-cancel="CancelModal()" :width="1000" class="Container-Tabs">
      <Tabs type="card" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" name="MaterielApplyDetail">
        <TabPane label="基本信息" name="Base" tab="MaterielApplyDetail">
          <Form inline onsubmit="return false" :label-width="100">
            <Form-item label="编号：" class="P-W-49-Percent">{{ BaseData.MaterialApplyCode }}</Form-item>
            <Form-item label="创建时间：" class="P-W-49-Percent">{{ $UI.Render.Date(BaseData.CreatedTime || '', true) }}</Form-item>
            <Form-item label="申请人：" class="P-W-49-Percent">{{ BaseData.CreatedUserName }}</Form-item>
            <Form-item label="发货仓库：" class="P-W-49-Percent">{{ BaseData.ShipWarehouseName }}</Form-item>
            <Form-item label="备注：" class="P-W-100-Percent">{{ BaseData.Remark }}</Form-item>
            <Table ref="TableList" :height="320" :columns="TableRowHead_Base" :data="BaseData.MaterialApplyItems" size="small" stripe></Table>
          </Form>
        </TabPane>
        <TabPane label="操作历史" name="History" tab="MaterielApplyDetail">
          <Table ref="TableList" :height="500" :columns="TableRowHead_History" :data="TableList_History" size="small" stripe></Table>
        </TabPane>
      </Tabs>
      <footer slot="footer"></footer>
    </Modal>
  </Row>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Emit, Watch} from "vue-property-decorator";
  import PInterface from "@/assets/Interface/Public";
  import Interface from "@/assets/Interface/Warehouse";

  @Component({
    name: "MaterielApplyDetail"
  })
  export default class MaterielApplyDetail extends Vue {
    @Prop() PropWarehouseDrop: PInterface.KV[];

    @Emit() EmitChange(Res: boolean, Type?: string): void {
    }

    private $Trigger({SelectedDetail}: {
      SelectedDetail: Interface.MaterielApplyTable
    }) {
      this.$set(this, "BaseData", SelectedDetail);
      this.IsShowModal = true;
    }

    private CancelModal(): void {
      this.IsShowModal = false;
      this.$nextTick(() => {
        this.TableList_History.splice(0);
        this.$set(this, "BaseData", new Interface.MaterielApplyTable());
        this.$set(this, "ActiveTab", "Base");
      })
    }

    private ChangeTabs(Val: string) {
      this.ActiveTab = Val;
      if( Val == 'History' && this.TableList_History.length == 0){
        this.GetTableList_History();
      }
    }

    private GetTableList_History(){
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Warehouse,
        Api: {
          Address: this.$Api.MaterialApplyGeHistorys,
          Login: true
        },
        Data: this.BaseData.Id,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.TableList_History.push(...Res.Data.Data);
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    private BaseData: Interface.MaterielApplyTable = new Interface.MaterielApplyTable();
    private IsShowModal: boolean = false;

    private TableRowHead_Base: PInterface.TableCol[] = [{
      title: "SKU编号",
      key: "SkuCode",
    }, {
      title: "产品名",
      key: "SkuName"
    }, {
      title: "数量",
      key: "Quantity"
    }];
    private TableRowHead_History: PInterface.TableCol[] = [{
      title: "编号",
      key: "Number",
      width: 60
    }, {
      title: "操作人",
      key: "OperateUserName",
      width: 110
    }, {
      title: "操作时间", key: "", width: 160,
      render: (h, params) => {
        return h("span", this.$UI.Render.Date(params.row.OperateTime, true));
      }
    }, {
      title: "操作记录",
      key: "Content"
    }];
    private TableList_History: Interface.MaterielApplyHistory[] = [];

    private ActiveTab: string = "Base"
  }
</script>
<style scoped lang="less">
</style>