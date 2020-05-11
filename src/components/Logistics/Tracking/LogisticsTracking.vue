<template>
	<Modal v-model="ShowModal" title="物流跟踪" :mask-closable="false" @on-cancel="ClearModal" width="600">
		<Row class="P-MT-10">
	    <Table :columns="DataCols" :data="DataList" size="small" stripe height="400"></Table>
	  </Row>
    <footer slot="footer">
      <Button  @click="ClearModal">返回</Button>
    </footer>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
/*interface start*/
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';
/*interface end*/

@Component({
	name: 'LogisticsTracking',
	components: { }
})

export default class LogisticsTracking extends Vue {
  private ClearModal(){
    this.ShowModal = false;
    this.DataList = [];
  }

  private TriggerModal(DataList:Interface.TrackmoreDetail[]){
    this.DataList = DataList;
    this.ShowModal = true;
  }

  private ShowModal: boolean = false;
  private DataList:Interface.TrackmoreDetail[] = []
  private DataCols: PInterface.TableCol[] = [
    { title: '更新时间(date)', width: 170, render: (h: any, Params: any): string => h('span', this.$UI.Render.Date(Params.row.UpdateTime, true)) },
    { title: '物流记录(StatusDescription)', render: (h: any, Params: any): string => {
      return Params.row.StatusDescription === "" ? h('span', '-') : h('Tooltip', {
        props: {
          'content': Params.row.StatusDescription,
          'maxWidth': 400
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', { class: ' P-LINE-1' }, [
          h('span',Params.row.StatusDescription)
        ])
      ])
    } }
  ]
}
</script>