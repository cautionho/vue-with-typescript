<template>
  <Col class="P-Inline-Block">
    <Button type="primary" @click="TriggerOperate">导出eBay售后单</Button>
  </Col>
</template>
<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'ExportEbayOrder'
})

export default class ExportEbayOrder extends Vue {
  @Emit() TriggerOperate(): void {}

  private Trigger(SearchFilter: Interface.AfterSalesSearch): void {
    if(SearchFilter.Platform !== 1){
      this.$UI.Tips.Floating('warning', '请选择eBay平台进行操作');
      return;
    }

    if(!SearchFilter.ProcessType.length){
      this.$UI.Tips.Floating('warning', '请选择处理结果');
      return;
    }

    if(SearchFilter.Status === 5 && SearchFilter.ProcessType.some(Item => Item === 1 || Item === 2)){
      this.$UI.Tips.Floating('warning', '请选择正确的处理结果进行操作');
      return;
    }

    if (!SearchFilter.ProcessType.every(Item => Item == 1 || Item == 2) && !SearchFilter.ProcessType.every(Item => Item == 3 || Item == 4)) {
      this.$UI.Tips.Floating('warning', '请选择同类型的导出类型');
      return;
    }

    /* 判断添加时间 */
    const Flag1 = this.IsTimeArea(SearchFilter.AddTimeStart, SearchFilter.AddTimeEnd, 31);
    if(Flag1) {
      const Flag2 = this.IsTimeArea(SearchFilter.DownloadTimeStart, SearchFilter.DownloadTimeEnd, 31);
      
      if(Flag1 && Flag2){
        this.$UI.Tips.Floating('warning', Flag1);
        return;
      }
    }

    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: '是否确认导出当前筛选条件下的eBay售后单',
      Enter: false,
      Callback: (B: boolean): void => {
        if(B){
          this.PostExport(SearchFilter)
        }
      }
    })
  }

  private IsTimeArea(Start: string, End: string, Max: number): string {
    let A: string[] = [Start, End];
    if(A.some( Item => Item === "" )){
      return '请补充时间区间'
    }

    let S:number = +new Date(Start),E:number = +new Date(End), N:number = +new Date();
    if(S > N){
      return '开始时间不得晚于当前时间'
    }
    if(S > E){
      return '开始时间不能晚于结束时间'
    }
    if(E - S > 86400000 * Max){
      return `筛选添加时间区间最多只能${Max}天`
    }
    return '';
  }

  private PostExport(SearchFilter: Interface.AfterSalesSearch): void {
    this.$UI.Loading.Show();
    let PostData = JSON.parse(JSON.stringify(SearchFilter));
    PostData.ProcessType = PostData.ProcessType.join(',');
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleExport,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          setTimeout(()=>{
            this.$UI.Tips.Modal({
              Type: 'success',
              Content: '创建导出Ebay售后单任务成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据。',
              Enter: true
            })
          },300)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }
}
</script>