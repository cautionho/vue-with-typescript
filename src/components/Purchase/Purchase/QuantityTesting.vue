<!-- 质检 -->
<template>
  <Modal v-model="ModifyModal" title="质检" @on-cancel="ClearModal(0)" :mask-closable="false" :width="1100" class="Container-Tabs">
    <Row>
      <Tabs name="QuantityTestingTabs" type="card" :closable="false"   >
        <TabPane label="质检信息" name="Base" tab="QuantityTestingTabs">
          <PaoBaseInfo :DetailInfoMsg="SelecData[0]" v-if="SelecData.length > 0" />
          <Form :label-width="150" ref="QualityTestingForm" :model="QualityTestingForm" :rules="QualityTestingRule" inline onsubmit="return false"> 
            <FormItem label="实际到货数量：" class="P-W-300" prop="ActualQuantity">
              <Input-number :min="0" placeholder="实际到货数量" v-model="QualityTestingForm.ActualQuantity" class="P-W-150"/>
            </FormItem>
            <FormItem label="质检不合格数：" class="P-W-300" prop="NoPassQuantity">
              <Input-number :min="0" placeholder="质检不合格数" v-model="QualityTestingForm.NoPassQuantity" class="P-W-150" />
            </FormItem>
            <FormItem label="备注：" class="P-W-100-Percent"> 
              <Input placeholder="备注" v-model="QualityTestingForm.Remark" />
            </FormItem>
          </Form>
          <h1 class="P-TA-C">质检图片</h1>
          <h2 class="P-TA-C">仅支持jpg、jpeg、png格式，大小不超过2M；数量最多为5张</h2>
          <!-- 上传图片 -->
          <div class="demo-upload-list" v-for=" (item, index) in UploadList" :key="index">
            <template v-if="item.status === 'finished'">
              <img :src="$Server.File +'/'+ item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="ShowPic(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="HandleRemove(item)" v-if="SelecData.length > 0 && SelecData[0].Status == 2"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload 
            v-show="UploadList.length < 5 && SelecData.length > 0 && SelecData[0].Status == 2" 
            ref="upload" 
            :show-upload-list="false" 
            :default-file-list="DefaultList" 
            :on-success="HandleSuccess" 
            :format="['jpg','jpeg','png']" 
            :max-size="2048" 
            :on-format-error="HandleFormatError" 
            :on-exceeded-size="HandleMaxSize" 
            :before-upload="HandleBeforeUpload" 
            multiple 
            type="drag" 
            :action="UploadImgServer" 
            style="display: inline-block;width:120px;height:120px">
            <div style="width: 120px;height:120px;line-height: 120px;">
              <Icon type="md-add" size="30"></Icon>
            </div>
          </Upload>
        </TabPane>
        <TabPane label="体积/重量" name="QualityInspection" tab="QuantityTestingTabs">
          <Form :label-width="100" ref="QualityTestingForm" :model="QualityTestingForm" :rules="QualityTestingRule" inline onsubmit="return false"> 
            <FormItem label="长度（cm）：" class="P-W-500" prop="Length">
              <Input-number :min="0" placeholder="长度（cm）" v-model="QualityTestingForm.Length" class="P-W-400" />
            </FormItem>
            <FormItem label="宽度（cm）：" class="P-W-500" prop="Width">
              <Input-number :min="0" placeholder="宽度（cm）" v-model="QualityTestingForm.Width" class="P-W-400"/>
            </FormItem>
            <FormItem label="高度（cm）：" class="P-W-500" prop="Height">
              <Input-number :min="0" placeholder="高度（cm）" v-model="QualityTestingForm.Height" class="P-W-400"/>
            </FormItem>
            <FormItem label="毛重（g）：" class="P-W-500" prop="GrossWeight">
              <Input-number :min="0" placeholder="毛重（g）" v-model="QualityTestingForm.GrossWeight" class="P-W-400"/>
            </FormItem>
            <FormItem label="净重（g）：" class="P-W-500" prop="NetWeight">
              <Input-number :min="0" placeholder="净重（g）" v-model="QualityTestingForm.NetWeight" class="P-W-400"/>
            </FormItem>
            <FormItem label="整箱数：" class="P-W-500" prop="PCS">
              <Input-number :min="0" placeholder="整箱数" v-model="QualityTestingForm.PCS" class="P-W-400" />
            </FormItem>
            <FormItem label="备注：" class="P-W-1000" prop="WeightRemark">
              <Input placeholder="备注" v-model="QualityTestingForm.WeightRemark" />
            </FormItem>
          </Form>
          <h1 class="P-TA-C">参考尺寸</h1>
          <div class="QA-Content" v-if="SkuInfo.Sizes" v-html="SkuInfo.Sizes"></div>
          <h2 class="P-TA-C" v-else>暂无参考尺寸</h2>
        </TabPane>
      </Tabs>
    </Row>
     <!-- 放大图片 -->
    <ShowBigPic ref="ShowBigPic" />
    <footer slot="footer" class="P-TA-R">
      <Button type="primary" @click="PostData">提交</Button>
      <Button @click="ClearModal(0)">取消</Button>
    </footer>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Purchase";
@Component({
  name: "QuantityTesting",
  components: {
    PaoBaseInfo: () => import("./PaoBaseInfo.vue"),
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class QuantityTesting extends Vue {
  @Emit() HandleResMsg(Type: number, IsScan: boolean): void {}

  private Trigger(SelectedData: Interface.Pao[], IsScan: boolean): void {
    
    // 判断是否来自扫描质检的触发模态框
    this.IsScan = IsScan

    this.SelecData = JSON.parse(JSON.stringify(SelectedData));
    this.GetSkuInfo()
    this.QualityTestingForm.ActualQuantity = this.SelecData[0].ArrvialQuantity
  }

  // 获取SKU详细信息
  private GetSkuInfo():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuInfoByCode,
        Login: true
      },
      Data: this.SelecData[0].SkuCode,
      Callback: (res: PInterface.Res): void => {
        if (res.IsSuccess) {
          this.SkuInfo = JSON.parse(JSON.stringify(res.Data.Data));
          this.ModifyModal = true
        } else {
          this.$Request.Error(res);
        }
        this.$UI.Loading.Hide();
      }
    });
  }

  // 发送 单个质检
  private PostData(): void {
    (this.$refs['QualityTestingForm'] as any).validate( (valid: boolean) => {
      if (valid) {
        // 质检不合格数>到货数量
        if (this.QualityTestingForm.NoPassQuantity > this.QualityTestingForm.ActualQuantity) {
          this.$UI.Tips.Floating('warning', '质检不合格数量不能大于实际到货数量');
          return;
        }
        // 质检不合格数>发货数量
        if (this.QualityTestingForm.NoPassQuantity > this.SelecData[0].ArrvialQuantity) {
          this.$UI.Tips.Floating('warning', '质检不合格数量不能超过发货数量');
          return;
        }
        // 整合数据
        this.QualityTestingForm.Id = this.SelecData[0].Id;
        // 整合质检图片
        this.QualityTestingForm.ImageUrl = [];
        if (this.UploadList.length > 0) {
          for (let item in this.UploadList) {
            this.QualityTestingForm.ImageUrl.push(this.UploadList[item].url)
          }
        }
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Purchase,
          Api: {
            Address: this.$Api.PurchaseArrivalOrderQA,
            Login: true
          },
          Data: this.QualityTestingForm,
          Callback: (res: PInterface.Res): void => {
            if (res.IsSuccess) {
              this.$UI.Tips.Floating('success', '提交质检成功');
              this.ClearModal(1);
            } else {
              this.$UI.Loading.Hide();
              this.$Request.Error(res);
            }
          }
        });
      } else {
        return;
      }
    })
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.ModifyModal = false;
    this.HandleResMsg(Val, this.IsScan)
    this.UploadList = [];
    this.SkuInfo = new Interface.SkuInfo();
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }
  // 删除上传图片
  private HandleRemove(file: any):void {
    // 从 upload 实例删除数据
    this.UploadList.splice(this.UploadList.indexOf(file), 1);
    this.QAImgLength = this.UploadList.length
  }
  // 上传图片成功
  private HandleSuccess(res: any, file: any) {
    file.url = res.Data.Url;
    this.UploadList.push(file)
  }
  // 验证上传图片
  private HandleFormatError(file: any):void {
    this.$Notice.warning({
      title: '文件格式不正确',
      desc: `文件${file.name}格式不正确，请上传 jpg 或 png 格式的图片。`
    });
  }
  // 验证上传图片
  private HandleMaxSize(file: any):void {
    this.$Notice.warning({
      title: '超出文件大小限制',
      desc: `文件${file.name}太大，不能超过 2M。`
    });
  }
  // 验证上传图片
  private HandleBeforeUpload():boolean {
    this.QAImgLength += 1;
    const check = this.QAImgLength < 6;
    if (!check) {
      this.$Notice.warning({
        title: '最多只能上传 5 张图片。'
      });
    }
    return check;
  }


  private SelecData: Interface.Pao[] = [new Interface.Pao()]; //当前选中数据

  private QAImgLength:number = 0; // 上传U图片 长度
  private UploadList: any[] = []; // 上传图片 数组
  private DefaultList: string[] = [];
  private UploadImgServer: string = this.$Server.Settings + this.$Api.UploadImage; // 上传图片 地址

  private ModifyModal: boolean = false // 控制模态框

  private IsScan: boolean = false; // 判断是否来自 扫描质检的触发模态框
  
  private SkuInfo: Interface.SkuInfo = new Interface.SkuInfo(); 

  private QualityTestingForm: Interface.QualityTestingForm = new Interface.QualityTestingForm(); // 提交表单
  private QualityTestingRule:any = {
    ArrvialQuantity: [{ type: 'number', required: true, message: '请输入实际到货数量', trigger: 'change' }],
    NoPassQuantity: [{ type: 'number', required: true, message: '请输入质检不合格数', trigger: 'change' }],
    Length: [{ type: 'number', required: true,message: '请输入长度',trigger: 'change' }],
    Width: [{ type: 'number', required: true, message: '请输入宽度', trigger: 'change' }],
    Height: [{ type: 'number', required: true, message: '请输入高度', trigger: 'change' }],
    GrossWeight: [{ type: 'number', required: true, message: '请输入毛重', trigger: 'change' }],
    NetWeight: [{ type: 'number', required: true, message: '请输入净重', trigger: 'change' }],
    PCS: [{ type: 'number', required: true, message: '请输入整箱数', trigger: 'change' }]
  };
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
  height: 350px;
  overflow-y: scroll;
}

.demo-upload-list {
  display: inline-block;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  margin: 0 12px;
}
</style>
