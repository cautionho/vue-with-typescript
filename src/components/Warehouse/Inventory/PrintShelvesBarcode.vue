<!--  打印货架条码操作 -->
<template>
  <Row class="P-Inline-Block">
      <Button type="primary" class="P-Inline-Block P-MR-10"  @click="ShelvesModal = true">打印货架号条码</Button>
      <Modal v-model="ShelvesModal" title="打印货架条码" @on-cancel="ClearModal" :mask-closable="false" width="800">
        <Row>
          <Col>
            <Form onsubmit="return false" :model="GenerationForm" ref="GenerationForm" :rules="GenerationRule" inline :label-width="100">
              <Form-item label="生成方式：" class="P-W-98-Percent" prop="GenerationId">
                <Select v-model="GenerationForm.GenerationId" class="P-W-100-Percent" :options="GenerationList" />
                <!-- <Select v-model="GenerationForm.GenerationId" class="P-W-100-Percent" filterable label-in-value>
                  <Option v-for="(Item,Index) in GenerationList" :value="$Enums.Warehouse.GenerationType[Item]" :key="Index">{{Item}}</Option>
                </Select> -->
              </Form-item>
            </Form>
          </Col>
          <!--手动输入-->
          <Col span="24" v-if="GenerationForm.GenerationId == 1">
            <Table border :columns="ManualCol" :data="ManualData" height="250" size="small" stripe ref="GenerationTable"></Table>
          </Col>
          <Col span="24" v-if="GenerationForm.GenerationId == 1" class="P-TA-R">
            <Button type="primary" class="P-MT-10" @click="AddManualCol">添加一行</Button>
          </Col>

          <!--自动生成-->
          <Col span="24">
          <Form onsubmit="return false" :model="AutomaticData" ref="AutomaticData" v-if="GenerationForm.GenerationId == 2" :rules="PrintMsgRule" inline :label-width="100">
            <Form-item label="库区编号：" class="P-W-98-Percent" prop="Warehouse">
              <Select v-model="AutomaticData.Warehouse" placeholder="请选择库区编号" class="P-W-100-Percent" :options="ReservoirList" />
              <!-- <Select v-model="AutomaticData.Warehouse" placeholder="请选择库区编号" class="P-W-100-Percent" filterable label-in-value clearable>
                <Option v-for="(Item,Index) in ReservoirList" :value="(Index+1)" :key="Index">{{ (Index+1) }}</Option>
              </Select> -->
            </Form-item>
            <Form-item label="排号：" class="P-W-98-Percent" prop="NumeralId">
              <Input v-model="AutomaticData.NumeralId"></Input>
            </Form-item>
            <Form-item label="架号：" class="P-W-98-Percent ivu-form-item-required">
              <Row>
                <Col span="11">
                <FormItem class="P-W-100-Percent" prop="MinFrame">
                  <Input v-model="AutomaticData.MinFrame" placeholder="请输入开始架号,格式为A~Z"></Input>
                </FormItem>
                </Col>
                <Col span="2" class="P-TA-C">-</Col>
                <Col span="11">
                <FormItem class="P-W-100-Percent" prop="MaxFrame">
                  <Input v-model="AutomaticData.MaxFrame" placeholder="请输入结束架号,格式为A~Z"></Input>
                </FormItem>
                </Col>
              </Row>
            </Form-item>
            <Form-item label="位号：" class="P-W-98-Percent ivu-form-item-required">
              <Row>
                <Col span="11">
                <FormItem class="P-W-100-Percent" prop="MinBitNumber">
                  <Input v-model="AutomaticData.MinBitNumber"></Input>
                </FormItem>
                </Col>
                <Col span="2" class="P-TA-C">-</Col>
                <Col span="11">
                <FormItem class="P-W-100-Percent" prop="MaxBitNumber">
                  <Input v-model="AutomaticData.MaxBitNumber"></Input>
                </FormItem>
                </Col>
              </Row>
            </Form-item>
            <Form-item label="打印数量：" class="P-W-98-Percent" prop="PrintNum">
              <InputNumber class="P-W-100-Percent" v-model="AutomaticData.PrintNum" :min="1"></InputNumber>
            </Form-item>
          </Form>
          </Col>
        </Row>
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="PostPrint">打印</Button>
          <Button @click="ClearModal">取消</Button>
        </footer>
      </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Emit, Watch } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
import getLodop from '@/assets/LODOP/LodopFuncs';
@Component({
  name: 'PrintShelvesBarcode'
})
export default class PrintShelvesBarcode extends Vue {

  private ClearModal():void{
    this.ShelvesModal = false;
    this.ManualData = [new Interface.GenerationManual()];
    this.AutomaticData = new Interface.GenerationAutomatic();
    this.GenerationForm = new Interface.GenerationForm();
    (this.$refs['GenerationForm'] as any).resetFields();
  }

  @Watch('GenerationForm.GenerationId') 
  private TriggerSelect(Val: number | string): void{
    if(Val === 1){
      this.ManualData = [new Interface.GenerationManual()]
    }else{
      this.AutomaticData = new Interface.GenerationAutomatic()
    }
  }

  //手动添加一行
  private AddManualCol(): void{
    this.ManualData.push({
      LocationCode: '',
      PrintNum: 1
    })
  }

  private PostPrint():void{
    if (getLodop(this) == undefined) {
      this.ClearModal()
      return
    }
    if (this.GenerationForm.GenerationId == 1) { // 1 手动输入
      if (this.ManualData.length == 0) {
        this.$UI.Tips.Floating('warning', '请至少添加一行记录');
        return
      }

      for (let Item in this.ManualData) {
        if (this.ManualData[Item].LocationCode == '') {
          this.$UI.Tips.Floating('warning', '请输入货架号');
          return
        }

        let Re = /^((1[0-5])|[1-9])(\-)((0[1-9])|[1-9][\d]{1,2})(\-)([A-Z])(\-)(0[1-9]|[1-9][0-9]|1[\d]{2}|200)$/
        if (!Re.test(this.ManualData[Item].LocationCode)) {
          this.$UI.Tips.Floating('warning', '请输入格式为“（1-15数字）-（01-999数字）-（A-Z大写字母）-（01-200数字）”的货架号');
          return
        }
      }
    
    } else{
      let Flag: boolean = true;
      (this.$refs["AutomaticData"] as any).validate((Valid: boolean) => {
        if (Valid) {
          if (this.Automatic.MinFrame.charCodeAt(0) > this.Automatic.MaxFrame.charCodeAt(0)) {
            this.$UI.Tips.Floating('warning', '请输入正确的架号范围')
            Flag = false
            return
          }
          if (Number(this.Automatic.MinBitNumber) > Number(this.Automatic.MaxBitNumber)) {
            this.$UI.Tips.Floating('warning', '请输入正确的位号范围')
            Flag = false
          }
        } else {
          Flag = false
        }
      })
      if (!Flag) { return }
    }

    // 打印
    var LODOP = getLodop()
    var That = this
    try {
      if (LODOP.VERSION) {
        this.$UI.Loading.Show();
        if (this.GenerationForm.GenerationId == 1) {
          PrintManual()
        } else {
          PrintAutomatic()
        }
        this.ClearModal()
        this.$UI.Tips.Floating('success', '打印货架条码成功')
      }
    } catch (err) {}

    function PrintManual() {
      LODOP.PRINT_INIT("");
      LODOP.PRINT_INITA("0mm", "0mm", '60mm', '40mm', "");
      LODOP.SET_PRINT_PAGESIZE(0, "60mm", "40mm", "")
      for (let item in That.ManualData) {
        for (let I = 1; I <= That.ManualData[item].PrintNum; I++) {
          LODOP.NewPage()
          LODOP.ADD_PRINT_BARCODE("5.64mm", "10%", "80%", "19.02mm", "128Auto", That.ManualData[item].LocationCode);
          LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
          LODOP.ADD_PRINT_TEXT(105, "2.99mm", "51.59mm", 25, That.ManualData[item].LocationCode);
          LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
          LODOP.SET_PRINT_STYLEA(0, "FontSize", 16);
          LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
          LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 1);
        }
      }
      LODOP.PRINT()
      That.$UI.Loading.Hide();
    }

    function PrintAutomatic() {
      LODOP.PRINT_INIT("")
      LODOP.PRINT_INITA("0mm", "0mm", '60mm', '40mm', "");
      LODOP.SET_PRINT_PAGESIZE(0, "60mm", "40mm", "");
      // 排号范围
      let NumeralId = That.AutomaticData.NumeralId
      // 架号
      let MinFrame = That.AutomaticData.MinFrame.charCodeAt(0)
      let MaxFrame = That.AutomaticData.MaxFrame.charCodeAt(0)
      // 位号范围
      let MinBitNum = Number(That.AutomaticData.MinBitNumber)
      let MaxBitNum = Number(That.AutomaticData.MaxBitNumber)
      // 打印数量
      let PrintNum = That.AutomaticData.PrintNum
      for (let Frame = MinFrame; Frame <= MaxFrame; Frame++) {
        for (let K = MinBitNum; K <= MaxBitNum; K++) {
          let BitNumber = K < 10 ? '0' + K : K;
          for (let I = 1; I <= PrintNum; I++) {
            LODOP.NewPage();
            let PrintCode = That.AutomaticData.Warehouse + '-' + NumeralId + '-' + String.fromCharCode(Frame) + '-' + BitNumber
            LODOP.ADD_PRINT_BARCODE("5.64mm", "10%", "80%", "19.02mm", "128Auto", PrintCode);
            LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
            LODOP.ADD_PRINT_TEXT(105, "2.99mm", "51.59mm", 25, PrintCode);
            LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 18);
            LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
            LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 1);
          }
        }
      }
      LODOP.PRINT()
      That.$UI.Loading.Hide();
    }
  }

  //删除表格行
  private DeleteManualCols(Idx: number):void{
    this.ManualData.splice(Idx, 1)
  }

  //表格内数据填充到提交数据
  private SetTabInput(Val: string|number, Idx: number, Key:string): void{
    (this.ManualData[Idx] as any)[Key] = Val
  }

  private GetLocations(): PInterface.KV[] {
    let V: PInterface.KV[] = []
    for(let I=1; I<=15; I++){
      V.push({Key: I, Value: I})
    }
    return V
  }

  private GenerationList:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.GenerationType);  //生成方式
  private ReservoirList: PInterface.KV[] = this.GetLocations()
  private ShelvesModal: boolean = false;
  private GenerationForm = new Interface.GenerationForm()
  private ManualData: Interface.GenerationManual[] = [new Interface.GenerationManual()]  //手动生成数据
  private AutomaticData = new Interface.GenerationAutomatic()  //自动生成数据
  private GenerationRule:any = {
    'GenerationId': [{ required: true, message: '请选择生成方式', trigger: 'change', type: 'number' }],
  }
  private PrintMsgRule: any = {
    'Warehouse': [{ required: true, message: '请选择库区编号', trigger: 'change', type: 'number' }],
    'NumeralId': [{ required: true, message: '请选择排号', trigger: 'blur' }, { pattern: /^0[1-9]|[1-9][\d]{1,2}$/, message: '请输入正确的排号，格式为01-999（数字）' }],
    'MinFrame': [{ required: true, message: '请输入开始架号', trigger: 'blur' }, {
      pattern: /^([A-Z]){1}$/,
      message: '请输入正确的架号,格式为A~Z'
    }],
    'MaxFrame': [{ required: true, message: '请输入结束架号', trigger: 'blur' }, {
      pattern: /^([A-Z]){1}$/,
      message: '请输入正确的架号,格式为A~Z'
    }],
    'MinBitNumber': [{ required: true, message: '请输入开始位号', trigger: 'blur' }, { pattern: /^(0[1-9]|[1-9][0-9]|1[\d]{2}|200)$/, message: '请输入正确的位号，格式为01-200（数字）' }],
    'MaxBitNumber': [{ required: true, message: '请输入结束位号', trigger: 'blur' }, { pattern: /^(0[1-9]|[1-9][0-9]|1[\d]{2}|200)$/, message: '请输入正确的位号，格式为01-200（数字）' }],
    'PrintNum': [{ required: true, message: '打印数量输入格式为数字', trigger: 'blur', type: 'number' }]
  }
  private ManualCol: PInterface.TableCol[] = [
    { title: '* 货架号', render: (h: any, params: any): string => {
        return h('Input', {
          props: {
            value: params.row.LocationCode
          },
          on: {
          'on-change': (Name: any) => {
            this.SetTabInput(Name.target.value, params.index, 'LocationCode')
          }
        }
        })
      }
    }, 
    { title: '* 打印数量', render: (h: any, params: any): string => {
        return h('InputNumber', {
          style: {
            width: '80%'
          },
          props: {
            min: 1,
          },
          on: {
            'on-change': (Name: number) => {
              this.SetTabInput(Name, params.index, 'PrintNum')
            }
          }
        })
      }
    }, 
    { title: '操作', width: 80, render: (h: any, params: any): string => {
        return h('Button', {
          props: {
            type: 'error',
            size: 'small'
          },
          on: {
            click: () => {
              this.DeleteManualCols(params.index)
            }
          }
        }, '删除')
      }
    }
  ]
}

</script>
<style lang="less"></style>
