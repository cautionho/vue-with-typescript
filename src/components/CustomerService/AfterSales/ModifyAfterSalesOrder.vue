<template>
  <Modal :title="ModalTitle" v-model="ModifyModal" @on-cancel="CancelModal" :width="1000" class="Container-Tabs">
    <Form inline :model="AfterSalesInfo" ref="AfterSalesInfo" :rules="AfterSalesRules" :label-width="90" onsubmit="return false;">
      <Tabs type="card" :value="AfterSalesTabs" name="AfterSalesTab" @on-click="ChangeTabs">
        <TabPane label="基本信息" name="Base" tab="AfterSalesTab">
          <FormItem class="P-W-100-Percent" label="发货单号：" prop="ShipOrderCode">
            <Input placeholder="扫描发货单号" ref="ShipOrderCodeIpt" v-model="AfterSalesInfo.ShipOrderCode" @on-enter="ValidateShipOrder" v-if="ModalTitle === '添加售后单'">
              <Button slot="append" @click="ValidateShipOrder">匹配订单</Button>
            </Input>
            <span v-else>{{AfterSalesInfo.ShipOrderCode}}</span>
          </FormItem>
          <FormItem class="P-W-100-Percent" label="订单金额：">
            {{AfterSalesInfo.PayAmount}} {{AfterSalesInfo.Currency}} {{AfterSalesInfo.RefundedAmount ? `(已退款${AfterSalesInfo.RefundedAmount} ${AfterSalesInfo.Currency})` : ''}}
          </FormItem>
          <FormItem class="P-W-49-Percent" label="客服主管：" prop="SupervisorId">
            <Select placeholder="客服主管" v-model="AfterSalesInfo.SupervisorId" :options="SupervisorDrops" transfer/>
            <!-- <Select placeholder="客服主管" v-model="AfterSalesInfo.SupervisorId" clearable filterable>
              <Option v-for="(Item, Index) in SupervisorDrops" :key="Index" :value="Item.Value">{{Item.Key}}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-W-49-Percent" label="原因：" prop="ReasonType">
            <Select placeholder="售后原因" v-model="AfterSalesInfo.ReasonType" :options="ReasonDrops" transfer/>
            <!-- <Select placeholder="售后原因" v-model="AfterSalesInfo.ReasonType" clearable filterable>
              <Option v-for="(Item, Index) in ReasonDrops" :key="Index" :value="Item.Id">{{Item.Reason}}</Option>
            </Select> -->
          </FormItem>
          <FormItem class="P-W-100-Percent" label="处理方式：" prop="ProcessType">
            <RadioGroup v-model="AfterSalesInfo.ProcessType">
              <Radio class="P-MR-20" v-for="(Item, Index) in ProcessType" :key="Index" :label="Item.Value">{{Item.Key}}</Radio>
            </RadioGroup>
          </FormItem>
          <Col span="24" v-if="AfterSalesInfo.ProcessType === 1 || AfterSalesInfo.ProcessType === 2">
            <FormItem class="P-W-100-Percent" label="收件人：" prop="BuyerFullName" :rules="{required: true, message: '请输入收件人'}">
              <Input placeholder="收件人" v-model="AfterSalesInfo.BuyerFullName"></Input>
            </FormItem>
            <FormItem class="P-W-49-Percent" label="省/州：" prop="BuyerState" :rules="{required: true, message: '请输入省/州'}">
              <Input placeholder="省/州" v-model="AfterSalesInfo.BuyerState"></Input>
            </FormItem>
            <FormItem class="P-W-49-Percent" label="城市：" prop="BuyerCity" :rules="{required: true, message: '请输入城市'}">
              <Input placeholder="城市" v-model="AfterSalesInfo.BuyerCity"></Input>
            </FormItem>
            <FormItem class="P-W-100-Percent" label="地址1：" prop="BuyerStreet1" :rules="{required: true, message: '请输入地址1'}">
              <Input placeholder="地址1" v-model="AfterSalesInfo.BuyerStreet1"></Input>
            </FormItem>
            <FormItem class="P-W-100-Percent" label="地址2：" prop="BuyerStreet2">
              <Input placeholder="地址2" v-model="AfterSalesInfo.BuyerStreet2"></Input>
            </FormItem>
            <FormItem class="P-W-49-Percent" label="邮编：" prop="BuyerZipCode" :rules="{required: true, message: '请输入邮编'}">
              <Input placeholder="邮编" v-model="AfterSalesInfo.BuyerZipCode"></Input>
            </FormItem>
            <FormItem class="P-W-49-Percent" label="电话：" prop="BuyerPhone" :rules="{required: true, message: '请输入电话'}">
              <Input placeholder="电话" v-model="AfterSalesInfo.BuyerPhone"></Input>
            </FormItem>
            <FormItem class="P-W-100-Percent" label="金额：" prop="DiffAmount" v-if="AfterSalesInfo.ProcessType === 2" :rules="{required: true, message: '请输入差价金额', pattern: $Pattern.PositiveNotZero}">
              <InputNumber class="P-W-400 P-MR-5" placeholder="补差价金额" v-model="AfterSalesInfo.DiffAmount" :max="AfterSalesInfo.PayAmount" :min="0"></InputNumber>
               {{AfterSalesInfo.Currency}}
            </FormItem>
          </Col>
          <!-- 退款 -->
          <Col span="24" v-if="AfterSalesInfo.ProcessType === 3 || AfterSalesInfo.ProcessType === 4">
            <!-- eBay、Walmart、Allegro 全额退款时需要展示明细，其余平台全额退款时仅展示退款金额（退款金额 = 订单金额 - 已退金额） -->
            <!-- eBay、Walmart、Allegro 部分退款时需要展示明细并填写退款金额，其余平台提供一个输入框供输入退款金额，最大可退金额 = 订单金额 - 已退金额 -->
            <Table v-if="Platform !== 0" class="P-MB-20" size="small" stripe :span-method="HandleSpan" :columns="GetRefundCols()" :data="TransitionDetails"></Table>
            <FormItem label="金额：" v-else>
              <InputNumber class="P-W-400 P-MR-5" v-model="AfterSalesInfo.FullRefundAmt" :min="0" :max="(AfterSalesInfo.PayAmount - AfterSalesInfo.RefundedAmount)" v-if="AfterSalesInfo.ProcessType === 4"></InputNumber>
              <span  v-if="AfterSalesInfo.ProcessType === 4">{{AfterSalesInfo.Currency}}</span>
              <span v-else>{{(AfterSalesInfo.PayAmount - AfterSalesInfo.RefundedAmount).toFixed(3)}} {{AfterSalesInfo.Currency}}</span>
            </FormItem>
          </Col>
          <FormItem class="P-W-100-Percent" label="备注：" prop="Remark">
            <Input placeholder="备注" v-model="AfterSalesInfo.Remark"></Input>
          </FormItem>
          <FormItem class="P-W-100-Percent">
            <Col span="24">
            <div class="P-Inline-Block P-Uploader-Img" v-for="(Item, Index) in AfterSalesInfo.ImageUrl" :key="Index">
              <img class="P-Uploader-Img" :src="`${$Server.File}/${Item}`" @click="$refs.BigPic.Trigger(`${$Server.File}/${Item}`)" />
              <Icon class="P-Uploader-Del" type="md-close-circle" size="20" @click="UploaderDel(Index)"></Icon>
            </div>
            <Upload :headers="$Request.Headers({Server:'', Api: { Address: '', Login: true }, Data: '', Form: true})" :show-upload-list="false" :on-success="HandleUploadSuccess" :accept="'.jpg, .jpge, .png'" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" :before-upload="HandleBeforeUpload" multiple :action="`${$Server.Settings}${$Api.UploadImage}`" class="P-Uploader P-Inline-Block P-VA-T">
              <div class="P-Uploader-Img">
                <Icon type="md-add" size="20"></Icon>
              </div>
            </Upload>
            </Col>
          </FormItem>
        </TabPane>
        <TabPane label="问题货品" name="Issue"  tab="AfterSalesTab">
          <Table size="small" :columns="IssueCols" :data="IssueItems" stripe :height="490"></Table>
        </TabPane>
        <TabPane label="重发货品" name="Resend" tab="AfterSalesTab" v-if="AfterSalesInfo.ProcessType < 3">
          <Table size="small" :columns="ResendCols" :data="ResendItems" stripe :height="460"></Table>
          <Col class="P-TA-R P-MT-5" span="24">
            <Button type="primary" @click="EmitEnableSku">选择SKU</Button>
          </Col>
        </TabPane>
      </Tabs>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="Validate(true)">提交审核</Button>
      <Button type="primary" @click="Validate(false)">提交</Button>
      <Button @click="CancelModal">取消</Button>
    </footer>
    <BigPic ref="BigPic" />
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/CustomerService';

@Component({
  name: 'ModifyAfterSalesOrder',
  components: {
    BigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})

export default class ModifyAfterSalesOrder extends Vue {
  @Prop(Array) private SupervisorDrop: PInterface.KV[]
  @Prop(Array) private ReasonDrop: Interface.ReasonDrop[]

  @Emit() private EmitEnableSku(): void {}
  @Emit() private EmitOperateSuccess(): void {}

  @Watch('SupervisorDrop')
  WatchSupervisorDrop(V: PInterface.KV[]):void { 
    this.$set(this, 'SupervisorDrops', V);
  }

  @Watch('ReasonDrop')
  WatchReasonDrop(V: Interface.ReasonDrop[]): void {
    this.$set(this, 'ReasonDrops', V);
  }

  private Focus(Ref: string): void {
    (this as any).$refs[Ref].focus();
  }

  private ChangeTabs(N: string): void {
    this.$set(this, 'AfterSalesTabs', N);
  }

  private ChangeTbVal<T>(Key: string, Index: number, Target: string, Val: T): void {
    this[Key][Index][Target] = Val;
  }

  private TriggerCreate(C: string): void {
    this.$set(this.AfterSalesInfo, 'ShipOrderCode', C)
    this.$set(this, 'ModifyModal', true);
    this.ValidateShipOrder();
    this.GetDropLists()
  }

  private async GetDropLists(): Promise<void> {
    this.$set(this, 'ReasonDrops', await this.GetDropList<number, Interface.ReasonDrop[]>(this.$Server.CustomerService, this.$Api.SaleReasonDropList, 1, 'Data'));
    this.$set(this, 'SupervisorDrops', await this.GetDropList<string, PInterface.KV[]>(this.$Server.Admin, this.$Api.GetUserDropList, '客服主管'));
  }

  private GetDropList<T,S>(Server: string, Api: string, Data: T, Key: string = 'DropList'): Promise<S | []> {
    return new Promise((Resolve:(V:S | [])=>void) => {
      this.$Request.Post({
        Server: Server,
        Api: {
          Address: Api
        },
        Data: Data,
        Callback: (Res: PInterface.Res): void => {
          if(Res.IsSuccess){
            Resolve(Res.Data[Key]);
          }else{
            Resolve([])
            this.$Request.Error(Res)
          }
        }
      })
    })
  }

  private SetReasonDrops(h: any): string[] {
    return this.ReasonDrops.map((Item: Interface.ReasonDrop) => {
      return h('Option', {
        attrs: {
          value: Item.Id
        }
      }, Item.Reason)
    })
  }

  private Trigger(D: Interface.AfterSalesList = new Interface.AfterSalesList()): void {
    this.$set(this, 'ModifyModal', true);
    if(D.AfterSalerId){
      this.$set(this, 'IsModify', true);
      this.$set(this, 'ModalTitle', '编辑售后单')
      this.GetAfterSalesOrderDetails(D.AfterSalerId);
    }else{
      this.$set(this, 'IsModify', false);
      this.$set(this, 'ModalTitle', '添加售后单')
      this.$nextTick(()=>{
        this.Focus('ShipOrderCodeIpt');
      })
    }
  }

  private GetAfterSalesOrderDetails(Id: number): void{
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleDetail,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          const IsResend: boolean = Res.Data.Data.OrderInfo.ProcessType < 3
          this.$set(this,'AfterSalesInfo', {
            AfterSalerId: Res.Data.Data.OrderInfo.AfterSalerId,
            ShipOrderCode: Res.Data.Data.OrderInfo.OriginalShipOrderCode,
            PayAmount: Res.Data.Data.OrderInfo.OriginalPayment,
            Currency: Res.Data.Data.OrderInfo.Currency,
            RefundedAmount: Res.Data.Data.OrderInfo.HistoryRefundAmount,
            SupervisorId: this.SupervisorDrops.filter( Item => (Item.Key as string).split('(')[0] === Res.Data.Data.OrderInfo.SupervisorName )[0].Value,
            ReasonType: this.ReasonDrops.filter( Item => Item.Reason === Res.Data.Data.OrderInfo.Reason )[0].Id,
            ProcessType: Res.Data.Data.OrderInfo.ProcessType,
            Remark: Res.Data.Data.OrderInfo.Remark,
            TransactionDetails:  Res.Data.Data.TransactionDetails,
            DiffAmount: Res.Data.Data.OrderInfo.RefundOrDiffAmount,
            FullRefundAmt:  Res.Data.Data.OrderInfo.RefundOrDiffAmount,
            ImageUrl: Res.Data.Data.Images.map((Item: { ImageUrl: string }) => { return Item.ImageUrl }),
            BuyerFullName: IsResend ? Res.Data.Data.ReSendDetails[0].Address.BuyerFullName : "",
            BuyerState: IsResend ? Res.Data.Data.ReSendDetails[0].Address.BuyerState : "",
            BuyerCity: IsResend ? Res.Data.Data.ReSendDetails[0].Address.BuyerCity : "",
            BuyerStreet1: IsResend ? Res.Data.Data.ReSendDetails[0].Address.BuyerStreet1 : "",
            BuyerStreet2: IsResend ? Res.Data.Data.ReSendDetails[0].Address.BuyerStreet2 : "",
            BuyerZipCode: IsResend ? Res.Data.Data.ReSendDetails[0].Address.BuyerZipCode : "",
            BuyerPhone: IsResend ? Res.Data.Data.ReSendDetails[0].Address.BuyerPhone : ""
          })
          for(let Item of Res.Data.Data.IssueDetails){
            Item['ReasonType'] = this.ReasonDrops.filter( R => R.Reason === Item.Reason )[0].Id
          }
          this.$set(this, 'IssueItems', Res.Data.Data.IssueDetails)
          if(this.AfterSalesInfo.ProcessType < 3) {
            this.$set(this, 'ResendItems', Res.Data.Data.ReSendDetails)
          }
          this.GetShipOrderInfo()
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  /* 匹配订单 */
  private ValidateShipOrder(): void {
    (this as any).$refs.AfterSalesInfo.validateField('ShipOrderCode', (Valid: boolean):void => {
      if(!Valid){
        this.GetShipOrderInfo();
      }else{
        this.Focus('ShipOrderCodeIpt');
      }
    })
  }

  /* 获取订单信息 */
  private GetShipOrderInfo(): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleOriginalShipOrder,
        Login: true
      },
      Data: this.AfterSalesInfo.ShipOrderCode,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          if(!Res.Data.Data.ShipOrderCode){
            this.$UI.Tips.Floating('warning', '匹配订单不存在');
            this.ResetInfo();
            return;
          }
          this.$set(this, 'OriginShipOrderInfo', Res.Data.Data);
          for(let Item in this.AfterSalesInfo){
            // 使用原始单数据补全数据
            if((this.OriginShipOrderInfo[Item] && !(this as any).AfterSalesInfo[Item]) || (this.OriginShipOrderInfo[Item] && !(this as any).AfterSalesInfo[Item].length)){
              (this as any).AfterSalesInfo[Item] = this.OriginShipOrderInfo[Item]
            }
          }
          const Start: string = this.AfterSalesInfo.ShipOrderCode.slice(0,1);
          this.$set(this, 'Platform', Start === 'E' ? 1 : Start === 'L' ? 5 : Start === 'R' ? 17 : 0)
          this.$set(this, 'TransitionDetails', this.GetTransitionDatas());
          if(!this.IsModify){
            this.$set(this.AfterSalesInfo, 'ProcessType', 1);
            this.$set(this.AfterSalesInfo, 'SupervisorId', this.Platform === 1 ? 322 : 325);
            this.GetHistoryRefund();
          }
        }else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  /* 获取历史退款金额 */
  private GetHistoryRefund(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.AfterSaleHistoryRefund,
        Login: true
      },
      Data: this.AfterSalesInfo.ShipOrderCode,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this.AfterSalesInfo, 'RefundedAmount', Res.Data.Data.TotalRefundAmount)
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  /* 处理列表头 */
  private GetRefundCols(): PInterface.TableCol[] | [] {
    if(this.Platform === 0){
      return [];
    } else{
      if(this.AfterSalesInfo.ProcessType === 3) {
        // 全额
        return this[`Cols${this.Platform}`];
      }else {
        // 部分退款
        return this[`RefundCols${this.Platform}`];
      }
    }
  }

  /* 处理数据 */
  private GetTransitionDatas(): (Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo)[] {
    let Datas: (Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo)[] = []
    this.AfterSalesInfo.TransactionDetails.forEach((Item: Interface.AfterSalesTransactionDetails, Index: number): void => {
      Item['Num'] = (Index++)
      let BItem = JSON.parse(JSON.stringify(Item))
      for(let Sku of Item.SkuInfo){
        /* 整理明细 */
        delete BItem.SkuInfo;
        const N:Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo = Object.assign(Sku, BItem, { Span: Item.SkuInfo.length, Num: (Index++) })
        Datas.push(N);
        if(!this.IsModify){
          this.IssueItems = [];
          this.ResendItems = [];
           /* 整理问题产品 */
          let PloblemItem = new Interface.IssueItems();
          for(let P in PloblemItem){
            if((N as any)[P]){
              (PloblemItem as any)[P] = (N as any)[P]
            }
          }
          this.IssueItems.push(PloblemItem);

          /* 整理重发产品 */
          let ResendItem = new Interface.ResendItems();
          for(let P in ResendItem){
            if((N as any)[P]){
              (ResendItem as any)[P] = (N as any)[P]
            }
          }
          this.ResendItems.push(ResendItem);
        }
      }
    })
    return Datas
  }

  /* 处理合并行、合并列 */
  private HandleSpan({ row, column, rowIndex, columnIndex }:any): any {
    if(columnIndex === 0){
      if(rowIndex === 0){
        return { rowspan: row.Span, colspan: 1 }
      }else {
        if(row.Num !== this.TransitionDetails[rowIndex - 1].Num){
          return { rowspan: row.Span, colspan: 1 }
        }else{
          return { rowspan:0, colspan:0 }
        }
      }
    }else{
      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }

  /* 上传文件 */
  private HandleUploadSuccess(Res: PInterface.Res, File: any, FileList: any[]): void {
    console.log(Res);
    if(Res.IsSuccess){
      this.AfterSalesInfo.ImageUrl.push(Res.Data.Url);
    }else{
      this.$Request.Error(Res);
    }
    this.CountUploadQty()
  }
  private HandleFormatError(File: any): void {
    this.$UI.Tips.Floating('warning', `文件[${File.name}]格式不为JPG/JPGE/PNG，请检查`);
    this.CountUploadQty()
  }
  private HandleMaxSize(File: any, FileList: any[]): void {
    this.$UI.Tips.Floating('warning', `文件${File.name}大小超过2M，请检查`);
    this.CountUploadQty()
  }
  private HandleBeforeUpload(File: any): void {
    if(this.UploadQty === 0){
      this.$UI.Loading.Show();
    }
    this.UploadQty++;
  }

  private CountUploadQty(): void {
    this.UploadQty--;
    if(this.UploadQty <= 0){
      this.$UI.Loading.Hide();
    }
  }

  private UploaderDel(Idx: number): void {
    this.AfterSalesInfo.ImageUrl.splice(Idx, 1);
  }
  /* 上传文件 */

  private GetSelectedSku(SelectData: PInterface.EnableSku[]): void {
    for(let Selc of SelectData){
      let F = true
      for(let Sku of this.ResendItems){
        if(Selc.Id === Sku.SkuId){
          F = false
        }
      }
      if(F) {
        this.ResendItems.push({ SkuId: Selc.Id,
          SkuCode: Selc.SkuCode,
          SkuName: Selc.SkuName,
          ReSendCount: 0, 
          DefaultImage: Selc.DefaultImage
        })
      }
    }
  }

  private DelResendItem(Idx: number): void {
    this.ResendItems.splice(Idx, 1);
  }

  /* 点击 “提交” 按钮 */
  private Validate(IsUp: boolean): void {
    (this as any).$refs.AfterSalesInfo.validate((Valid: boolean): void => {
      if(Valid){
        if(this.AfterSalesInfo.ProcessType < 3){
          // 处理重发/补差价重发
          if(!this.ResendItems.length){
            this.$UI.Tips.Floating('warning', '请选择重发货品');
            return;
          }
          /* 必须有一项同时满足问题数量>0且有售后原因 */
          if(!(this.IssueItems.some( Sku => Sku.IssueCount > 0 && Sku.ReasonType > 0))){
            this.$UI.Tips.Floating('warning', '请补充问题货品的售后原因和问题数量');
            return;
          }
          if(this.ResendItems.every( Sku => Sku.ReSendCount <= 0 )){
            this.$UI.Tips.Floating('warning', '请补充重发货品的重发数量');
            return;
          }
        }
        if(this.AfterSalesInfo.ProcessType === 4){
          if(this.Platform !== 0){
            // 部分退款
            if(this.TransitionDetails.every(Sku => Sku.ReAmount === 0)){
              this.$UI.Tips.Floating('warning', '请补充货品的退款金额');
              return;
            }
            if(this.TransitionDetails.some( Sku => Sku.ReAmount > (Sku.PayAmount - Sku.RetiredAmount) )){
              this.$UI.Tips.Floating('warning', '请输入正确的退款金额（退款金额不可大于支付金额-已退金额）');
              return;
            }
          }else {
            if(this.AfterSalesInfo.FullRefundAmt <= 0 || this.AfterSalesInfo.FullRefundAmt > this.AfterSalesInfo.PayAmount - this.AfterSalesInfo.RefundedAmount){
              this.$UI.Tips.Floating('warning', '请输入正确的退款金额');
            }
          }
        }

        this.HandlePostDatas(IsUp);
      }else {
        this.$UI.Tips.Floating('warning', '请补充必填项');
      }
    })
  }

  /* 整理数据 */
  private HandlePostDatas(IsUp: boolean): void {
    /* 公共参数 */
    const Opts: Interface.CreateAfterSalesOrder = {
      AfterSalerId: this.AfterSalesInfo.AfterSalerId,
      OriginalShipOrderCode: this.AfterSalesInfo.ShipOrderCode,
      ProcessType: this.AfterSalesInfo.ProcessType,
      ReasonType: this.AfterSalesInfo.ReasonType,
      SupervisorId: this.AfterSalesInfo.SupervisorId,
      Remark: this.AfterSalesInfo.Remark,
      ImageUrl: this.AfterSalesInfo.ImageUrl,
      IsSubmitAudit: IsUp,
      IssueItems: this.IssueItems.map(( Sku: Interface.IssueItems ) => { return {SkuId: Sku.SkuId, SkuCode: Sku.SkuCode, ReasonType: Sku.ReasonType, IssueCount: Sku.IssueCount, DetailId: Sku.DetailId} })
    }
    let PostData: Interface.CreateAfterSalesOrder = new Interface.CreateAfterSalesOrder();

    if(this.AfterSalesInfo.ProcessType < 3){
      /* 重发、重发并补差价 */
      /* 地址参数 */
      const Address: Interface.AfterSalesAddress = new Interface.AfterSalesAddress(this.AfterSalesInfo)
      /* 重发货品参数 */
      const PostResendItems: Interface.ResendItems[] = this.ResendItems.map( (Sku: Interface.ResendItems) => { return {SkuId: Sku.SkuId, SkuCode: Sku.SkuCode, ReSendCount: Sku.ReSendCount } } ),
        ResendOpts:Interface.CreateAfterSalesOrder = Object.assign(Opts, { ReSendItems: PostResendItems })
      
      if(this.AfterSalesInfo.ProcessType === 1){
        /* 重发 */
        PostData = new Interface.CreateAfterSalesOrder(Object.assign(ResendOpts,{ ReSendAddress: Address } ))
      }else {
        /* 重发并补差价 */
        PostData = new Interface.CreateAfterSalesOrder(Object.assign(ResendOpts, { DiffAndSendAddress: Address , DiffAmount: this.AfterSalesInfo.DiffAmount}))
      }
    }else{
      /* 全额退款、部分退款 */
      if(this.Platform === 0){
        let RefundAmt = this.AfterSalesInfo.ProcessType === 3 ? this.AfterSalesInfo.PayAmount - this.AfterSalesInfo.RefundedAmount : this.AfterSalesInfo.FullRefundAmt
        PostData = new Interface.CreateAfterSalesOrder(Object.assign(Opts, { FullRefundAmt : RefundAmt }))
      }else {
        /* eBay、Walmrt、Allegro 重新整理TransitionDetails */
        PostData = new Interface.CreateAfterSalesOrder(Object.assign(Opts, { TransactionDetails : this.GetPostTransitionDetails() }))
      }
    }
    this.PostModifyAfterSalesOrder(PostData);
  }

  private GetPostTransitionDetails(): Interface.AfterSalesTransactionDetails[] {
    let Tds: Interface.AfterSalesTransactionDetails[] = [], SkuItems: Interface.AfterSalesSkuInfo[] = []
    this.TransitionDetails.forEach((Item: Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo, Index: number): void => {
      if(Index === 0 || Item.Num !== this.TransitionDetails[Index-1].Num){
        SkuItems = []
      }
      SkuItems.push(new Interface.AfterSalesSkuInfo(Item));
      (Tds as any)[Item.Num - 1] = new Interface.AfterSalesTransactionDetails(Object.assign(Item, {SkuInfo: SkuItems}))
    })
    return Tds
  }

  private PostModifyAfterSalesOrder(PostData: Interface.CreateAfterSalesOrder): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.IsModify ? this.$Api.AfterSaleEdit : this.$Api.AfterSaleAdd,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', PostData.IsSubmitAudit ? '提交审核成功' : this.IsModify ? '修改售后单成功' : '添加售后单成功');
          this.CancelModal();
          this.EmitOperateSuccess();
        }else{
          this.$UI.Loading.Hide();
          this.$Request.Error(Res);
        }
      }
    })
  }

  /* 重置数据 */
  private ResetInfo(): void {
    this.$set(this, 'AfterSalesInfo', new Interface.AfterSalesInfo());
    this.$set(this, 'TransitionDetails', [])
    this.$set(this, 'IssueItems', [])
    this.$set(this, 'ResendItems', [])
    this.$set(this, 'Platform', 0)
    this.$set(this, 'AfterSalesTabs', 'Base')
    this.$nextTick(()=>{
      (this as any).$refs.AfterSalesInfo.resetFields();
    })
  }

  private CancelModal(): void {
    this.ResetInfo();
    this.$set(this, 'ModifyModal', false);
  }

  /* data start */
  private IsModify: boolean = false
  private ModifyModal: boolean = false
  private ModalTitle: string = '添加售后单'
  private SupervisorDrops: PInterface.KV[] = []
  private ReasonDrops: Interface.ReasonDrop[] = []

  private AfterSalesTabs: string = 'Base'
  private Platform: number = 0

  private ProcessType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.ProcessType)

  private OriginShipOrderInfo: any = {}
  private AfterSalesInfo: Interface.AfterSalesInfo = new Interface.AfterSalesInfo()
  private AfterSalesRules:any = {
    ShipOrderCode: [{required: true, message: '请扫描发货单号/输入发货单号按回车键'}],
    SupervisorId: [{required: true, message:'请选择客服主管', trigger:'change', type: 'number'}, { pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择客服主管' }],
    ReasonType: [{required: true, message:'请选择售后原因', trigger:'change', type: 'number'}, { pattern: this.$Pattern.PositiveNotZeroInt, message: '请选择售后原因' }],
    ProcessType: [{required: true, message:'请选择处理方式',trigger:'change',type:'number'}]
  }

  private TransitionDetails: (Interface.AfterSalesTransactionDetails & Interface.AfterSalesSkuInfo)[] = []
  private IssueItems: Interface.IssueItems[] = []
  private ResendItems: Interface.ResendItems[] = []
  private UploadQty: number = 0
  // private Images: string[] = []

  /* 全额退款 */
  private Cols1: PInterface.TableCol[] = [{
    title: '交易号',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: 'ItemId',
    key: 'ItemId',
    width: 120
  }, {
    title: '数量',
    key: 'Quantity',
    width: 100
  }, {
    title: '交易金额',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount - Params.row.RetiredAmount} ${Params.row.Currency}`)
    }
  }]

  private Cols5: PInterface.TableCol[] = [{
    title: 'LineNumber',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: '数量',
    width:100,
    key: 'Quantity'
  }, {
    title: '交易金额',
    key: 'PayAmount',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    key: 'PayAmount',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount - Params.row.RetiredAmount} ${Params.row.Currency}`)
    }
  }]

  private Cols17: PInterface.TableCol[] = [{
    title: 'LineItems ID',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: '数量',
    width:100,
    key: 'Quantity'
  }, {
    title: '交易金额',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount - Params.row.RetiredAmount} ${Params.row.Currency}`)
    }
  }]

  /* 部分退款 */
  private RefundCols1: PInterface.TableCol[] = [{
    title: '交易号',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: 'ItemId',
    key: 'ItemId',
    width: 120
  }, {
    title: '数量',
    key: 'Quantity',
    width: 100
  }, {
    title: '交易金额',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('div', [
        h('InputNumber',{
          attrs: {
            value: Params.row.ReAmount,
            min: 0,
            max: Params.row.PayAmount - Params.row.RetiredAmount < 0 ? 0 : Params.row.PayAmount - Params.row.RetiredAmount
          },
          on: {
            'on-change': (V: number): void => {
              this.ChangeTbVal<number>('TransitionDetails', Params.row._index, 'ReAmount', V);
            }
          },
          class: 'P-MR-5'
        }),
        h('span', Params.row.Currency)
      ])
    }
  }] // eBay
  private RefundCols5: PInterface.TableCol[] = [{
    title: 'LineNumber',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: '数量',
    width:100,
    key: 'Quantity'
  }, {
    title: '交易金额',
    key: 'PayAmount',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    key: 'PayAmount',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('div', [
        h('InputNumber',{
          attrs: {
            value: Params.row.ReAmount,
            min: 0,
            max: Params.row.PayAmount - Params.row.RetiredAmount < 0 ? 0 : Params.row.PayAmount - Params.row.RetiredAmount
          },
          on: {
            'on-change': (V: number): void => {
              this.ChangeTbVal<number>('TransitionDetails', Params.row._index, 'ReAmount', V);
            }
          },
          class: 'P-MR-5'
        }),
        h('span', Params.row.Currency)
      ])
    }
  }] // Walmart
  private RefundCols17: PInterface.TableCol[] = [{
    title: 'LineItems ID',
    key: 'PaypalTransactionId',
    width: 120
  }, {
    title: 'SKU编号',
    key: 'SkuCode',
    width: 130,
  }, {
    title: 'SKU名称',
    key: 'SkuName',
    render: (h: any, Params: any): string => {
      return h('Tooltip', { 
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
       }, Params.row.SkuName)
    }
  }, {
    title: '数量',
    width:100,
    key: 'Quantity'
  }, {
    title: '交易金额',
    key: 'PayAmount',
    width: 120,
    render: (h: any, Params: any): string => {
      return h('span', `${Params.row.PayAmount} ${Params.row.Currency}${Params.row.RetiredAmount > 0 ? '(已退款'+Params.row.RetiredAmount+ Params.row.Currency +')' : ''}`)
    }
  }, {
    title: '退款金额',
    key: 'PayAmount',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('div', [
        h('InputNumber',{
          attrs: {
            value: Params.row.ReAmount,
            min: 0,
            max: Params.row.PayAmount - Params.row.RetiredAmount < 0 ? 0 : Params.row.PayAmount - Params.row.RetiredAmount
          },
          on: {
            'on-change': (V: number): void => {
              this.ChangeTbVal<number>('TransitionDetails', Params.row._index, 'ReAmount', V);
            }
          },
          class: 'P-MR-5'
        }),
        h('span', Params.row.Currency)
      ])
    }
  }] // Allegro

  // 问题货品
  private IssueCols: PInterface.TableCol[] = [{
    title: '图片', width: 80, align: 'center',
    render: (h: any, Params: any): string => {
      return h('div', {
        class: 'P-List-Img',
        on: {
          click: () => { (this as any).$refs.BigPic.Trigger(`${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage}`) }
        },
        style: {
          backgroundImage: `url(${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage})`
        }
      })
    }
  }, {
    title: 'SKU编号',
    width: 130,
    key: 'SkuCode'
  }, {
    title: 'SKU名称',
    render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
      },Params.row.SkuName)
    }
  },{
    title: '购买数量',
    width: 100,
    render: (h: any, Params: any): string => {
      return h('span', Params.row.Quantity || Params.row.BuyCount)
    }
  }, {
    title: '原因',
    width: 200,
    render: (h: any, Params:any): string => {
      return h('Select', {
        attrs: {
          placeholder: '请选择原因',
          value: Params.row.ReasonType
        },
        props: {
          filterable: true,
          options: this.ReasonDrops,
          onChange: (V: number): void => {
            this.ChangeTbVal<number>('IssueItems', Params.row._index, 'ReasonType', V);
          }
        }
      })
    }
  }, {
    title: '重发/问题数量',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('InputNumber', {
        attrs: {
          value: Params.row.IssueCount,
          min:0,
          max: Params.row.Quantity ? Params.row.Quantity : Params.row.BuyCount
        },
        on: {
          'on-change':(V: number): void => {
            this.ChangeTbVal<number>('IssueItems', Params.row._index, 'IssueCount', V);
          }
        },
        class: 'P-W-100-Percent'
      })
    }
  }]

  // 重发货品
  private ResendCols: PInterface.TableCol[] = [{
    title: '图片', width: 80, align: 'center',
    render: (h: any, Params: any): string => {
      console.log(this.$Server.File)
      return h('div', {
        class: 'P-List-Img',
        on: {
          click: () => { (this as any).$refs.BigPic.Trigger(`${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage}`) }
        },
        style: {
          backgroundImage: `url(${this.$Server.File}/${Params.row.ImageUrl || Params.row.DefaultImage}`
        }
      })
    }
  }, {
    title: 'SKU编号',
    width: 130,
    key: 'SkuCode'
  }, {
    title: 'SKU名称',
    render: (h: any, Params: any): string => {
      return h('Tooltip', {
        props: {
          content: Params.row.SkuName
        },
        class: 'P-LINE-1'
      },Params.row.SkuName)
    }
  }, {
    title: '重发数量',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('InputNumber', {
        attrs: {
          value: Params.row.ReSendCount,
          min:0
        },
        on: {
          'on-change':(V: number): void => {
            this.ChangeTbVal<number>('ResendItems', Params.row._index, 'ReSendCount', V);
          }
        },
        class: 'P-W-100-Percent'
      })
    }
  }, {
    title: '操作',
    width: 80,
    render: (h:any, Params:any): string => {
      return h('Button', {
        props: {
          size: 'small',
          type: 'error'
        },
        on: {
          click: () => {
            this.DelResendItem(Params.row._index)
          }
        }
      }, '删除')
    }
  }]

  /* data end */
}
</script>
<style lang="less" scoped>
.ivu-tabs .ivu-tabs-tabpane{
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>