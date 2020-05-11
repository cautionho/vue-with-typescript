<!--查阅 拍摄需求-->
<template>
  <Col>
  <Modal v-model="IsShowModal" title="拍摄需求详情" @on-cancel="CloseModal" :mask-closable="false" :width="700" class="Container-Tabs">
    <Row>
      <Tabs name="PhotoTab" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" >
        <TabPane label="基本信息" name="Info" tab="PhotoTab">
          <PhotoRequestInfo ref="PhotoRequestInfo" />
        </TabPane>
        <TabPane label="审核记录" name="History" tab="PhotoTab">
          <Table :columns="Cols" :data="HistoryList" size="small" stripe height="300"></Table>
        </TabPane>
      </Tabs>
    </Row>
    <div slot="footer">
      <Button @click="CloseModal">返回</Button>
    </div>
  </Modal>
  </Col>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'ViewPhotoRequest',
  components:{
    PhotoRequestInfo: () => import('@/components/Product/Sku/PhotoRequestInfo.vue'),
  }
})
export default class ViewPhotoRequest extends Vue {
  private CloseModal(): void {
    this.$set(this,'IsShowModal', false)
    this.ActiveTab = "Info";
    this.HistoryList = [];
    this.InfoData = new Interface.PhotoRequestList();
  }

  private TriggerModal(SelectedData: Interface.PhotoRequestList[]){
    this.InfoData = SelectedData[0];
    (this.$refs.PhotoRequestInfo as any).InfoData = this.InfoData;
    this.$set(this,'IsShowModal', true);
  }

  private ChangeTabs(Val: string) {
    this.ActiveTab = Val;

    if(Val === 'History' && this.HistoryList.length < 1){
      this.GetHistory()
    }
  }

  private GetHistory(): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PhotoRequestGetHistory,
				Login: true
			},
			Data: this.InfoData.Id,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.HistoryList = Res.Data.PageModel
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private InfoData: Interface.PhotoRequestList = new Interface.PhotoRequestList()
  private IsShowModal: boolean = false; 
  private ActiveTab: string = "Info"; //tab索引值
  private HistoryList: Interface.PhotoRequestHistory[] = []
  private Cols: PInterface.TableCol[] = [
    { title: '编号', key: 'Id' },
    { title: '审核人', key: 'Operator' },
    { title: '审核时间', render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.OperateTime, true)) },
    { title: '备注', key: 'OperateLog' },
  ]
}

</script>
<style lang="less">
</style>
