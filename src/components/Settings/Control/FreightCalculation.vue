<!-- 运费计算组件 -->
<template>
  <Row class="DailyStoreSales">
    <Collapse @on-change="ChangeDailyStore">
      <Panel name="DailyStoreSales" hide-arrow class="Box-Shadow">
        <span class="P-Text-Info P-FZ-16 P-FW-Bold">运费计算</span>
        <div slot="content">
          <Form ref="CaculateForm" :model="CaculateForm" :rules="CaculateRules" :label-width="100" onsubmit="return false">
            <Row>
              <Col span="12">
              <FormItem label="目标国家" prop="CountryCode">
                <Select placeholder="请选择目标国家" v-model="CaculateForm.CountryCode" :options="CountryData" optionValKey="CountryCode" optionKey="CountryNameCn" />
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="邮编">
                <Input v-model="CaculateForm.ZipCode" placeholder="请输入邮编"></Input>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="发货渠道">
                <Select placeholder="请选择发货渠道" v-model="CaculateForm.MethodId" :options="ShipMethodList" optionValKey="Id" optionKey="Name" />
              </FormItem>
              </Col>
            </Row>
            <FormItem label="体积（cm³）:">
              <Col span="7"><FormItem prop="Length"><Input placeholder="请输入长度" v-model="CaculateForm.Length" ></Input></FormItem></Col>
              <Col span="1" class="P-TA-C">x</Col>
              <Col span="8"><FormItem prop="Width"><Input placeholder="请输入宽度" v-model="CaculateForm.Width" ></Input></FormItem></Col>
              <Col span="1" class="P-TA-C">x</Col>
              <Col span="7"><FormItem prop="Height"><Input placeholder="请输入高度" v-model="CaculateForm.Height" ></Input></FormItem></Col>
            </FormItem>
            <Row>
              <Col span="16">
                <FormItem label="重量（kg)：" prop="Weight">
                  <Input placeholder="请输入重量" v-model="CaculateForm.Weight" ></Input>
                </FormItem>
              </Col>
              <Col span="8"><Button type="primary" class="P-ML-20" @click="GetCaculateData">运费预计算</Button></Col>
            </Row>
          </Form>
          <Table :columns="CaculateCol" :data="CaculateData" class="P-MT-10" stripe size='small' height="300"></Table>
        </div>
      </Panel>
    </Collapse>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Logistics';

@Component({
  name: 'FreightCalculation',
  components: {
    
  }
})
export default class FreightCalculation extends Vue {
  

  private ChangeDailyStore(V: string[]){
    if(V.length > 0 && this.IsFirst){
      this.IsFirst = false;
      this.GetCountryDropList()
    }
  }

  //获取国家
  private GetCountryDropList(): void{
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.CountryList
      },
      Data: true,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.CountryData = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
    this.GetShipMethodDrop()
  }

  // 获取物流渠道
  private GetShipMethodDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Logistics,
      Api: {
        Address: this.$Api.ChannelDropList
      },
      Data: 0,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.ShipMethodList = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetCaculateData(): void {
    (this as any).$refs.CaculateForm.validate((Valid: boolean)=>{
      if(Valid){
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Logistics,
          Api: {
            Address: this.$Api.ChannelCaculate,
            Login: true
          },
          Data: this.CaculateForm,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$set(this, 'CaculateData',Res.Data.Data)
            } else {
              this.$Request.Error(Res);
            }
            this.$UI.Loading.Hide();
          }
        })
      }
    })
  }

  private IsFirst: boolean = true

  private CaculateForm: Interface.ShippingCostCaculateSearch = new Interface.ShippingCostCaculateSearch() // 筛选项默认数据
  private CaculateData: Interface.ShippingCostCaculateList[] = [] // 列表数据源
  private CountryData:PInterface.CountryEntity[] = []; //国家下拉
  private ShipMethodList:PInterface.IdName[] = []; // 物流渠道下拉列表
  private CaculateRules: any = {
    CountryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
    Length: [{ pattern: this.$Pattern.Positive, message: '长度格式不正确' }],
    Width: [{ pattern: this.$Pattern.Positive, message: '宽度格式不正确' }],
    Height: [{ pattern: this.$Pattern.Positive, message: '高度格式不正确' }],
    Weight: [{ required: true, message: '请输入重量' }, { pattern: this.$Pattern.Positive, message: '重量格式不正确' }]
  }
  private CaculateCol:PInterface.TableCol[] = [
    { title: '渠道名称', key: 'MethodName' },
    { title: '渠道代码', key: 'MethodCode' },
    { title: '预估运费', key: 'CountryName', render: (h: any, Params: any): string => h('p', `${ Params.row.Fee}（${Params.row.Currency}）`)}
  ]
}
</script>
<style lang="less">
  
</style>