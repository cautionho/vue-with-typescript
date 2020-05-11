<template>
  <Row>
    <Form inline :label-width="50" onsubmit="return false;">
    <Col span="11">
      <FormItem label="渠道：">
        <span>eBay</span>
      </FormItem>
      <Table :columns="ShippingCols" ref="ShippingTB" :data="ShippingList" size="small" :height="400" border></Table>
      <Button type="primary" class="P-MT-10" @click="SetSelected">添加到已选</Button>
    </Col>
    <Col span="11" offset="2">
      <FormItem label="站点：">
        <Select  placeholder="站点" class="P-W-300" :options="SiteDrop" :onChange="GetShippingService" />
        <!-- <Select  placeholder="站点" class="P-W-300" clearable filterable @on-change="GetShippingService">
          <Option v-for="(Item, Index) in SiteDrop" :key="`S${Index}`" :value="Item.Value">{{Item.Key}}</Option>
        </Select> -->
      </FormItem>
      <Table :columns="SelectedCols" ref="SelectedTB" :data="SelectedList" size="small" :height="400" border></Table>
      <Button type="error" class="P-MT-10" @click="DelSelected">从已选列表中删除</Button>
    </Col>
    </Form>
  </Row>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';

@Component

export default class EbaySiteCondition extends Vue {
  private Trigger (Selc: PInterface.KV[]): void {
    this.$nextTick(()=> {
      if(!this.SiteDrop.length){
        this.GetDropList<string>(this.$Server.Sales, this.$Api.Sales[1].Sites, "").then((Res: PInterface.KV[])=>{
          this.SiteDrop.push(...Res);
        });
      }
      this.$set(this, 'SelectedList', Selc)
    })
  }

  private GetShippingService(V: number): void{
    if((typeof(V)).toLowerCase() === 'number'){
      this.$UI.Loading.Show();
      this.GetDropList<number>(this.$Server.Sales, this.$Api.Sales[1].ShippingService, V).then((Res: PInterface.KV[])=>{
        this.$UI.Loading.Hide();
        this.$set(this, 'ShippingList', Res);
      })
    }
  }

  private GetDropList<T>(Server: string, Api: string, Data:T): Promise<PInterface.KV[] | []> {
    return new Promise((Resolve:(V:PInterface.KV[] | [])=>void) => {
      this.$Request.Post({
        Server: Server,
        Api: {
          Address: Api
        },
        Data: Data,
        Callback: (Res: PInterface.Res): void => {
          if(Res.IsSuccess){
            Resolve(Res.Data.DropList);
          }else{
            Resolve([]);
            this.$Request.Error(Res);
          }
        }
      })
    })
  }

  private SetSelected(): void {
    const SelcStr = ((this as any).$refs.ShippingTB.getSelection().concat(this.SelectedList)).map((Item: PInterface.KV): string => { return JSON.stringify(Item) })
    const Selc = new Set(SelcStr);
    (this as any).$refs.ShippingTB.selectAll(false);
    this.$nextTick(()=>{
      this.$set(this, 'SelectedList', (Array.from(Selc) as string[]).map((Item: string): PInterface.KV => { return JSON.parse(Item) }));
    })
  }

  private DelSelected(): void {
    const Selc = (this as any).$refs.SelectedTB.getSelection().map((Item: PInterface.KV): string => { return JSON.stringify(Item) });
    (this as any).$refs.SelectedTB.selectAll(false);
    this.$nextTick(()=>{
      for(let Item of Selc){
        this.SelectedList.splice(this.SelectedList.findIndex((Itm: PInterface.KV): boolean => { return JSON.stringify(Itm) === Item }), 1);
      }
    })
  }

  private GetSelected(): PInterface.KV[] {
    return this.SelectedList;
  }

  private ShippingList: PInterface.KV[] = []
  private SelectedList: PInterface.KV[] = []

  private SiteDrop: PInterface.KV[] = []

  private Site:number | "" = ""

  private ShippingCols: PInterface.TableCol[] = [{
    type: 'selection', width:60, align:'center'
  }, {
    title: '待选运输类型',
    key: 'Value'
  }]

  private SelectedCols: PInterface.TableCol[] = [{
    type: 'selection', width:60, align:'center'
  }, {
    title: '已选运输类型',
    key: 'Value'
  }]
}
</script>
<style lang="less"></style>