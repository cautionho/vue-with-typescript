<!--查阅 海外仓产品管理-->
<template>
  <Col>
  <Modal v-model="IsShowModal" title="海外仓产品详情" @on-cancel="CloseModal" :mask-closable="false" :width="1000" class="Container-Tabs">
    <Row>
      <Tabs name="OverseasWareTab" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" >
        <TabPane label="基本信息" name="Info" tab="OverseasWareTab">
          <Row :gutter="16">
            <Col span="16">
              <Form onsubmit="return false" :label-width="90" :model="DetailInfo" inline >
                <Form-item label="SKU编号：" class="P-W-300">{{DetailInfo.OverseaSkuCode}}</Form-item>
                <Form-item label="产品名：" class="P-W-300">{{DetailInfo.OverseaSkuCode}}</Form-item>
                <Form-item label="长：" class="P-W-300">{{DetailInfo.OverseaSkuCode}}</Form-item>
                <Form-item label="宽：" class="P-W-300">{{DetailInfo.OverseaSkuCode}}</Form-item>
                <Form-item label="高：" class="P-W-300">{{DetailInfo.OverseaSkuCode}}</Form-item>
                <Form-item label="重量：" class="P-W-300">{{DetailInfo.GrossWeight}} g</Form-item>
                <Form-item label="国家：" class="P-W-300">{{DetailInfo.CountryNameCn+' ('+DetailInfo.CountryCode+')'}}</Form-item>
                <Form-item label="是否带电：" class="P-W-300">{{DetailInfo.IsBattery ? '是':'否'}}</Form-item>
                <Form-item label="进口申报价：" class="P-W-300">{{DetailInfo.ImportDeclareAmout}} USD</Form-item>
                <Form-item label="出口申报价：" class="P-W-300">{{DetailInfo.ExportDeclareAmout}} USD</Form-item>
                <Form-item label="申报英文名：" class="P-W-300">{{DetailInfo.DeclareName}}</Form-item>
                <Form-item label="申报链接：" class="P-W-300 P-Break-All">{{ DetailInfo.DeclareUrl }}</Form-item>
              </Form>
            </Col>
            <Col span="8">
              <img class="P-W-100-Percent P-Pointer P-Block" :src="$Server.File + '/' +DetailInfo.DefaultImage" @click="ShowPic(DetailInfo.DefaultImage)">
            </Col>
          </Row>
        </TabPane>
        <TabPane label="审核记录" name="History" tab="OverseasWareTab">
          <Table :columns="Cols" :data="HistoryList" size="small" stripe height="400"></Table>
        </TabPane>
      </Tabs>
    </Row>
    <div slot="footer">
      <Button @click="CloseModal">返回</Button>
    </div>
  </Modal>
  <ShowBigPic ref="ShowBigPic" />
  </Col>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'ViewOverseasWare',
  components:{
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
  }
})
export default class ViewOverseasWare extends Vue {
  private CloseModal(): void{
    this.$set(this,'IsShowModal', false);
    this.ActiveTab = "Info";
    this.DetailInfo = new Interface.OverseasWareManageDetail();
    this.HistoryList = [];
  }

  private TriggerModal(SelectedData: Interface.OverseasWareManageList[]){
    this.GetDetailInfo(SelectedData[0].Id)
    this.$set(this,'IsShowModal', true);
  }

  private ChangeTabs(Val: string) {
    this.ActiveTab = Val;
  }

  // 打开大图
  private ShowPic(Url: string): void {
		(this as any).$refs.ShowBigPic.Trigger(Url);
	}

  private GetDetailInfo(Id: number): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.OverseaSkuDetails,
				Login: true
			},
			Data: Id,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.DetailInfo = Res.Data.Data.Detail;
					this.HistoryList = Res.Data.Data.Historys;
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private DetailInfo: Interface.OverseasWareManageDetail = new Interface.OverseasWareManageDetail()
  private IsShowModal: boolean = false; 
  private ActiveTab: string = "Info"; //tab索引值
  private HistoryList: Interface.PhotoRequestHistory[] = []
  private Cols: PInterface.TableCol[] = [
    { title: '编号', width: 100, render: (h: any, Params: any): string => h('span', Params.index+1) },
    { title: '操作人', key: 'OperaterName', width: 120 },
    { title: '操作时间', width: 160, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.OperatedTime, true)) },
    { title: '备注', key: 'Note' },
  ]
}
</script>