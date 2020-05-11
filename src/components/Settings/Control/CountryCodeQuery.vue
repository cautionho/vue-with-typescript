<!-- 国家简码组件 -->
<template>
  <Row class="CountryCodeQuery">
    <Collapse>
      <Panel name="CountryCodeQuery" hide-arrow class="Box-Shadow">
        <span class="P-Text-Info P-FZ-16 P-FW-Bold">国家简码</span>
        <div slot="content">
          <Input v-model="CountryCode" placeholder="请输入国家名称或简码" @on-enter="getData" class="P-MT-10">
          <Button slot="append" @click="getData">查询</Button>
          </Input>
          <Table :columns="CountryCol" :data="CountryData" class="P-MT-10" stripe size='small' height="300"></Table>
        </div>
      </Panel>
    </Collapse>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';

@Component({
  name: 'CountryCodeQuery',
  components: {
    
  }
})
export default class CountryCodeQuery extends Vue {
  

  private getData(): void{
    if(this.CountryCode === ""){
      this.$UI.Tips.Floating('warning', '请输入国家名称或简码')
      return;
    }
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.CountrySearch
      },
      Data: this.CountryCode,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.CountryData = Res.Data.Data
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private CountryData: Interface.ControlCountryCode[] = []
  private CountryCode: string = ""
  private CountryCol: PInterface.TableCol[] =[
    { title: '二位简码', key: 'CountryCode' },
    { title: '中文名称', key: 'CountryNameCn' },
    { title: '英文名称', key: 'CountryName'}
  ]
}
</script>
<style lang="less">
  
</style>