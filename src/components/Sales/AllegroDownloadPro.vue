<template>
  <div class="P-Inline-Block ">
    <Col>
    <Button type="primary" class="P-MR-10 P-MB-10" @click="ChangeRes(true)">下载产品模板</Button>
    <Modal v-model="DownloadPro" title="下载产品模板" @on-cancel="ChangeRes(false)" :mask-closable="false" >
      <Form onsubmit="return false" name="downloadProForm" :label-width="100">
        <Form-item label="选择类目：" prop="BrandUrl">
          <Cascader v-model="DownCategoryIds" transfer placeholder="请选择类目" clearable :data="CategoryList" :load-data="LoadData" change-on-select filterable></Cascader>
          <p class="mt10">说明：每次只能上传同一个类目的产品</p>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="PostDownload">下载</Button>
        <Button @click="ChangeRes(false)">取消</Button>
      </div>
    </Modal>
    </Col>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Sales';
@Component({
  name: 'AllegroDownloadPro'
})
export default class AllegroDownloadPro extends Vue {

  @Emit() private ChangeRes(B:boolean){
    this.DownloadPro = false;
  }

  private TriggerModal(CategoryList: Interface.CascaderCategory[]): void{
    this.CategoryList = CategoryList;
    this.DownCategoryIds = []
    this.DownloadPro = true
  }

  private LoadData(Item: Interface.CascaderCategory, Callbacks:any) {
    Item.loading = true
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api: {
        Address: this.$Api.AllegroStoreCategoryDropList,
        Login: true
      },
      Data: Item.value,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
         Item.loading = false
          if(Res.Data.Data.length < 1){
            this.$nextTick(()=>{ 
              this.$delete(Item, 'loading');
              this.$set(this, 'DownCategoryIds', Item.arr)
            })
          }else{
            this.$set(Item, 'children', Res.Data.Data.map( (QItem: PInterface.KV)=>{
              let flag = JSON.parse(JSON.stringify(Item.arr))
              flag.push(QItem.Key.toString())
              return {
                value: QItem.Key.toString(),
                label: QItem.Value,
                children: [],
                loading: false,
                arr: flag
              }
            }))
            this.$nextTick(()=>{
                this.$set(this, 'DownCategoryIds', [])
                this.DownCategoryIds.push(...Item.arr)
            })
            Item.loading = false;
          }
          Callbacks();
        } else {
          Item.loading = false;
          this.$Request.Error(Res);
        }
      }
    })
  }

  private PostDownload(): void{
    if(this.DownCategoryIds.length <1){
      this.$UI.Tips.Floating('warning', '请选择类目');
      return
    } 
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Sales,
			Api: {
				Address: this.$Api.AllegroStoreExcelTemplate,
				Login: true
			},
			Data: this.DownCategoryIds[this.DownCategoryIds.length-1],
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.ChangeRes(false)
          window.open(`${this.$Server.Sales}/${Res.Data.Data}`, '_blank')
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private DownloadPro: boolean = false //下载产品模态框
  private DownCategoryIds: string[] = []
  private CategoryList: Interface.CascaderCategory[] = [] //类目列表
}

</script>
<style lang="less"></style>
