<!-- 批量质检 -->
<template>
  <Row class="P-Inline-Block">
    <Col>
      <Button type="primary" class="P-Inline-Block P-MR-10"  @click="OpenModal()">批量质检</Button>
      <Modal v-model="ModifyModal" title="批量质检" @on-cancel="ClearModal(0)" :mask-closable="false" :width="1100" class="Container-Tabs">
        <Row>
          <Form v-if="SelecData.length < 1" :label-width="150" ref="BatchQualityTestingForm" :model="BatchQualityTestingForm" :rules="BatchQualityTestingRule" inline onsubmit="return false"> 
            <FormItem label="到货单号/采购单号：" class="P-W-100-Percent P-MB-10" prop="Code" >
              <Input ref="BatchQualityTestingCode" placeholder="到货单号/采购单号" v-model.trim="BatchQualityTestingForm.Code" @on-enter="CheckQAList(false)"/>
              <p class="Color-Gray">请扫描/输入到货单号或快递单号，输入完成后请按回车键。</p>
            </FormItem>
          </Form>
          <Col>
            <p class="Color-Red P-MB-10" v-if="IsShowFilterTips" >已为您筛选出状态处于待质检的到货单：</p>
            <Table :columns="Cols" :data="List" size="small" stripe :height="400" ref="BatchQualityTesting" ></Table>
          </Col>
        </Row>
         <!-- 放大图片 -->
        <ShowBigPic ref="ShowBigPic" />
        <footer slot="footer" class="P-TA-R">
          <Button type="primary" @click="PostData">质检</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Purchase";
@Component({
  name: "QuantityTestingBatch",
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class QuantityTestingBatch extends Vue {
  @Emit() HandleResMsg(Type: number): void {}

  private Trigger(SelectedData: Interface.Pao[]): void {
    if (SelectedData.some( Item => Item.Status !== 2 )) {
      this.$UI.Tips.Floating('warning', '请选择状态为待质检的到货单进行质检操作');
      return
    }

    this.SelecData = JSON.parse(JSON.stringify(SelectedData));
    this.List.splice(0, this.List.length, ...SelectedData)

    this.ModifyModal = true

    this.$nextTick(()=>{
      if (this.SelecData.length < 1) {
        ( this.$refs["BatchQualityTestingCode"] as Vue ).focus()
      }
    })
  }

  // 回调 打开模态框 
  private OpenModal(): void {
    this.HandleResMsg(2)
  }

  // 获取信息
  private CheckQAList(IsScan: boolean): void {
    if (this.BatchQualityTestingForm.Code === "") return;
    
    // 批量质检
    if (this.List.length < 1) {
      this.GetCodeInfo()
    } else {  
      if ( this.List.some( Item => Item.OrderCode === this.BatchQualityTestingForm.Code ) ) {
        this.$UI.Tips.Floating('warning', '该到货单已存在列表中');
        this.FocusInput()
        return
      } else {
        this.GetCodeInfo()
      }
    }
  }

  // 通过扫描的条码获取到货单信息
  private GetCodeInfo():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PrintPAO,
        Login: true
      },
      Data:  this.BatchQualityTestingForm.Code,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.RenderQAData(Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
        
      }
    });
  }

  // 渲染 渲染源数据；是否需要去重
  private RenderQAData(Data: Interface.Pao[]):void {
    Data.forEach( (Item: Interface.Pao): void => {
      // 提示筛选出状态处于待质检订单 并跳过
      if (Item.Status !== 2) {
        this.IsShowFilterTips = true
      } else {
        if ( !this.List.some( Ite => Ite.OrderCode === Item.OrderCode ) )
          this.List.push(Item)
      }
    })

    if (this.List.length < 1) {
      this.$UI.Tips.Floating('warning', '扫描到货单状态不为待质检或扫描的快递单号中所有的到货单均不处于待质检状态，请重新扫描');
      this.FocusInput();
      this.IsShowFilterTips = false
    }
  }

  // 发送 批量质检 
  private PostData(): void {
    if (this.List.length < 1) {
      this.FocusInput()
      return
    }

    let SendData: object[] = []
    this.List.forEach((item: Interface.Pao):void => {
      let temp: any = { 
        Id: item.Id, 
        NoPassQuantity: item.NoPassQuantity, 
        ActualQuantity: item.ActualQuantity, 
        Remark: item.Remark 
      }
      SendData.push(temp)
    })

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.PurchaseArrivalOrderMulitQA,
        Login: true
      },
      Data: SendData,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$UI.Tips.Floating('success', '质检成功');
            this.ClearModal(1);
          } else {
            this.$UI.Loading.Hide();
            this.$Request.Error(Res);
          }
      }
    });
  }

  // 聚焦
  private FocusInput():void {
    this.BatchQualityTestingForm.Code = "";
    (this.$refs.BatchQualityTestingCode as any).focus()
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.$set(this, 'ModifyModal', false);
    this.HandleResMsg(Val)
    
    this.UploadList = [];
    this.SkuInfo = new Interface.SkuInfo();
    this.BatchQualityTestingForm.Code = ""
  }

  private SelecData: Interface.Pao[] = [new Interface.Pao()]; //当前选中数据

  private QAImgLength:number = 0; // 上传U图片 长度
  private UploadList: any[] = []; // 上传图片 数组
  private DefaultList: string[] = [];
  private UploadImgServer: string = this.$Server.Settings + this.$Api.UploadImage; // 上传图片 地址

  private ModifyModal: boolean = false // 控制模态框
  
  private SkuInfo: Interface.SkuInfo = new Interface.SkuInfo(); 

  private BatchQualityTestingForm: Interface.SingleCodeForm = new Interface.SingleCodeForm(); // 批量质检表单
  private BatchQualityTestingRule: any = {
    Code: [{ required: true, message: ' ' }]
  }
  
  private QualityTestingCode: string = "" // 到货单号/快递单号
  private IsShowFilterTips: boolean = false // 是否提示此次存在筛选待质检订单的操作

  private List: Interface.Pao[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { title: '到货单号', key: 'OrderCode', width: 150 },
    { title: 'SKU编号', key: 'SkuCode', width: 150 },
    { title: '采购数量', key: 'PurchaseQuantity', width: 150 },
    { title: '实到数量', render: (h: any, params: any): string => {
      return h('InputNumber', {
        props: {
            'min': 0,
            'value': this.List[params.row._index].ActualQuantity
          },
          on: {
            'on-change': (val: number) => {
              this.List[params.row._index].ActualQuantity = val
            }
          }
        })
    }},
    { title: '质检不通过数量', render: (h: any, params: any): string => {
      return h('InputNumber', {
        props: {
            'min': 0,
            'value': this.List[params.row._index].NoPassQuantity
          },
          on: {
            'on-change': (val: number) => {
              this.List[params.row._index].NoPassQuantity = val
            }
          }
      })
    }},
    { title: '备注', render: (h: any, params: any): string => {
      return h('Input', {
        attrs: {
          placeholder: '请输入备注'
        },
        on: {
          input: (val: string) => {
            this.List[params.row._index].Remark = val
          }
        },
        className: 'w100'
      })
    }},
    { title: '操作', width: 80, render: (h: any, params: any): string => {
      return h('Button', {
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: () => {
            this.List.splice(params.row._index, 1)
          }
        }
      }, '删除')
    }},    
  ];
}
</script>

<style lang='less'>
@import '../../../assets/Theme/Color.less';

.Color-Gray{
  color: gray;
}
.Color-Red{
  color: @error-color;
}
.QA-Content{
  width: 100%;
  height: 240px;
  overflow-y: scroll;
}
</style>
