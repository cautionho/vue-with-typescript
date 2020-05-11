<!-- 设置发货 -->
<template>
	<Row class="tal">
    <Col span="24">
    <div class="card-header"></div>
    <Card :bordered="true" class="card-body">
      <Form inline :label-width="100" :model="SetSendForm" name="SetSendForm" ref="SetSendForm" :rules="SetSendRules" onsubmit="return false">
        <Form-item label="跟踪号：" prop="TrackCode">
          <Input v-model="SetSendForm.TrackCode" autofocus name="InputTrackCode" @on-enter="GetShipOrderInfo" ref="InputTrackCode"></Input>
        </Form-item>
        <Form-item label="重量（Kg.）：" prop="Weight">
          <Input v-model="SetSendForm.Weight" autofocus name="InputWeight" @on-enter="CheckWeight" ref="InputWeight"></Input>
        </Form-item>
        <Button type="primary" class="P-MR-20" @click="CheckWeight">称重</Button>
        <Button @click="FocusTrackNum" class="P-MR-20">清除跟踪号</Button>
        <Form-item label="物流渠道：">
          <Select v-model="SetSendForm.MethodName" placeholder="请选择物流渠道" :disabled="SeleDisabled" transfer  optionValKey="Id" optionKey="Name" :options="ShipMethodList" />
          <!-- <Select v-model="SetSendForm.MethodName" placeholder="请选择物流渠道" filterable clearable :disabled="SeleDisabled" transfer >
            <Option v-for="Item in ShipMethodList" :value="Item.Id" :key="Item.Name">{{Item.Name}}</Option>
          </Select> -->
        </Form-item>
        <Button type="primary" class="P-MR-20" @click="SendProduct">发货</Button>
        <Button type="warning" @click="Refresh">重置</Button>
      </Form>
    </Card>
    </Col>
    <Col span="24" class="P-MT-20">
    <Row :gutter="16">
      <Col span="12">
      <h3 class="P-TA-C" style="padding: 5px 0; border: 1px solid #ddd; border-bottom: none;">发货列表<span v-if="SetSendData.length!=0">(共{{SetSendData.length}}件)</span></h3>
      <Table size="small" :columns="SetSendCol" :data="SetSendData" stripe border :height="TableHeight"></Table>
      </Col>
      <Col span="12">
      <h3 class="P-TA-C" style="padding: 5px 0; border: 1px solid #ddd; border-bottom: none;">异常列表<span v-if="HoldUpData.length!=0">（拦截{{HoldUpNumber}}件,重量不符{{WeightNumber}}件）</span></h3>
      <Table size="small" :columns="HoldUpRow" :data="HoldUpData" stripe border :height="TableHeight"></Table>
      </Col>
    </Row>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import PInterface from "@/assets/Interface/Public";
import Interface from "@/assets/Interface/Warehouse";
import GetLodop from '@/assets/LODOP/LodopFuncs';

@Component({
  name: 'SetSend'
})
export default class SetSend extends Vue {
  @Prop() private Flag: number

  @Watch('SetSendForm.TrackCode')
  private ChangeTrackCode(D: string):void{
    this.SetSendForm.TrackCode = this.SetSendForm.TrackCode.trim();
  }

  @Watch('SetSendData')
  private ChangeSetSendData(Val:Interface.SetSendData[]):void{
    if(Val.length > 0){
      this.SeleDisabled = true;
    }
  }

  @Watch('HoldUpData')
  private ChangeHoldUpData(Val:Interface.SetSendData[]):void{
    if(Val.length > 0){
      this.SeleDisabled = true;
    }
  }

  private mounted(): void {
    this.GetShipMethodDrop()
    this.$nextTick(function() {
      (this.$refs['InputTrackCode'] as any).focus();
    })
  }

  get HoldUpNumber(): number{
    let Num = 0;
    for (let Item of this.HoldUpData) {
      if (Item.HoldUpName == '拦截') {
        Num++;
      }
    }
    return Num;
  }

  get WeightNumber(): number {
    let Num = 0;
    for (let Item of this.HoldUpData) {
      if (Item.HoldUpName == '重量不符') {
        Num++;
      }
    }
    return Num;
  }

   // 获取物流渠道
  private GetShipMethodDrop(): void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Logistics,
			Api: {
				Address: this.$Api.ChannelDropList,
				Login: true
			},
			Data: 0,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.ShipMethodList = Res.Data.DropList;
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  private FocusTrackNum(): void {
    this.SetSendForm.TrackCode = "";
    this.CurSendData = null;
    (this.$refs['SetSendForm'] as any).resetFields();
    (this.$refs['InputTrackCode'] as any).focus();
  }

  private FocusWeight(): void {
    this.SetSendForm.Weight = "";
    (this.$refs['InputWeight'] as any).focus();
  }

  // 根据跟踪号获取发货单基础信息
  private GetShipOrderInfo(): any {
    return this.PostShipInfo(false);
  }

  private CheckWeight(): void {
    (this.$refs.SetSendForm as any).validateField('TrackCode', (Val: string) => {
      // 跟踪号 false
      if (Val) {
        this.FocusTrackNum();
        return;
      }
      // 跟踪号与输入框的不一致
      if (this.CurSendData && (this.CurSendData.TrackingNumber != this.SetSendForm.TrackCode)) {
        this.PostShipInfo(true);
        return;
      }
      this.ValidateWeight();
    })
  }

  private ValidateWeight(): void {
    (this.$refs.SetSendForm as any).validateField('Weight', (Val: string) => {
      // 重量 false    获取数据 false
      if (Val && !this.CurSendData) {
        this.PostShipInfo(false);
        return;
      }
      // 重量 false   获取数据 true
      if (Val && this.CurSendData) {
        this.$UI.Tips.CustomModal({
          Type: 'warning',
          Content: `请输入正确的包裹重量`,
          Callback: (B:boolean):void =>{
            this.SetSendForm.Weight = ''
            this.FocusWeight()
          }
        })
        return;
      }
      // 重量 true   获取数据  false
      if (Val == '' && !this.CurSendData) {
        this.PostShipInfo(true);
        return;
      }
      // 重量 true   获取数据  true
      if (Val == '' && this.CurSendData) {
        if (isNaN(Number(this.SetSendForm.Weight))) {
          this.$UI.Tips.CustomModal({
            Type: 'warning',
            Content: `请输入正确的包裹重量`,
            Callback: (B:boolean):void =>{
              this.SetSendForm.Weight = ''
              this.FocusWeight()
            }
          })
          return
        }
        if (Number(this.SetSendForm.Weight) <= 0) {
          this.$UI.Tips.CustomModal({
            Type: 'warning',
            Content: `包裹称重重量必须大于等于0，请重新对该包裹进行称重`,
            Callback: (B:boolean):void =>{
              this.SetSendForm.Weight = ''
              this.FocusWeight()
            }
          })
          return
        }
        // 单品单件
        if (this.CurSendData.ItemType == 1) {
          let GrossWeight = parseFloat(String(this.CurSendData.Sku.GrossWeight));
          let SetWeight = parseFloat(this.SetSendForm.Weight) * 1000;
          let WeightErr = Math.abs((GrossWeight - SetWeight) / GrossWeight);

          if (SetWeight > GrossWeight * 10) {
            this.$UI.Tips.CustomModal({
              Type: 'warning',
              Content: `当前SKU原重量为[${GrossWeight}](g)，实际重量[${SetWeight}](g)，实际重量超过原重量10倍，请检查是否发错货或电子称单位设置有误`,
              Callback: (B:boolean):void =>{
                this.AddpendHoldUpList(this.CurSendData as Interface.SetSendData, 2, Number(this.SetSendForm.Weight));
                this.SetSendForm.Weight = "";
                (this.$refs['InputWeight'] as any).focus();
              }
            })
            return
          }
          if (GrossWeight > SetWeight * 10) {
            this.$UI.Tips.CustomModal({
              Type: 'warning',
              Content: `当前SKU原重量为[${GrossWeight}](g)，实际重量[${SetWeight}](g)，原重量超过实际重量10倍，请检查是否发错货或电子称单位设置有误`,
              Callback: (B:boolean):void =>{
                this.AddpendHoldUpList(this.CurSendData as Interface.SetSendData, 2, Number(this.SetSendForm.Weight));
                this.SetSendForm.Weight = "";
                (this.$refs['InputWeight'] as any).focus();
              }
            })
            return
          }
          if (WeightErr > 0.1) {
            this.$UI.Tips.CustomModal({
            Type: 'confirm',
            Content: `当前SKU原重量为${GrossWeight}(g)，实际重量${SetWeight}(g)，原重量与实际重量误差大于10%，是否继续进行打包并更新原重量？`,
            Callback: (Res: boolean):void => {
              if (Res) {
                this.UpdSkuGrossWeight();
              }else{
                this.AddpendHoldUpList(this.CurSendData as Interface.SetSendData, 2, Number(this.SetSendForm.Weight));
                this.FocusWeight();
              }
            }
          })
          } else {
            this.InsertOrd();
          }
        } else {
          this.InsertOrd();
        }
      }
    })
  }

  PostShipInfo(IsSetWight: boolean): void {
    if (this.SetSendForm.TrackCode == "") {
      this.$UI.Tips.CustomModal({
        Type: 'warning',
        Content: `请输入跟踪号`,
        Callback: (B:boolean):void =>{
          this.FocusTrackNum()
        }
      })
      return;
    }
    
    this.SetSendForm.TrackCode = this.SetSendForm.TrackCode.trim();
    const Len = this.SetSendForm.TrackCode.length;
    if ((this.SetSendForm.MethodName === 157 || this.SetSendForm.MethodName === 158 || this.SetSendForm.MethodName === 161 || this.SetSendForm.MethodName === 162 || this.SetSendForm.MethodName === 173 || this.SetSendForm.MethodName === 174) && (this.SetSendForm.TrackCode.startsWith('420')) && (Len === 30 || Len === 34)) {
      this.SetSendForm.TrackCode = this.SetSendForm.TrackCode.substr(-22);
    }

    if ((this.SetSendForm.MethodName === 189 || this.SetSendForm.MethodName === 191 || this.SetSendForm.MethodName === 190 || this.SetSendForm.MethodName === 192) && Len === 30) {
      this.SetSendForm.TrackCode = this.SetSendForm.TrackCode.substr(-22)
    }

    if ((this.SetSendForm.MethodName === 154) && (this.SetSendForm.TrackCode.trim().toUpperCase().startsWith('JJD')) && (Len === 19)) {
      this.SetSendForm.TrackCode = this.SetSendForm.TrackCode.slice(1)
    }
    if (this.SetSendForm.MethodName === 176 && Len == 20) {
      this.SetSendForm.TrackCode = this.SetSendForm.TrackCode.substr(2)
    }
    for (let Item in this.SetSendData) {
      if (this.SetSendForm.TrackCode == this.SetSendData[Item].TrackingNumber) {
        // this.showWarning('warning', '发货列表中已存在该跟踪号', 0, () => this.FocusTrackNum(), true, true);
        this.$UI.Tips.CustomModal({
          Type: 'warning',
          Content: `发货列表中已存在该跟踪号`,
          Callback: (B:boolean):void =>{
            this.FocusTrackNum()
          }
        })
        return;
      }
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.CheckPackedOrderByTrackCode,
        Login: true
      },
      Data: this.SetSendForm.TrackCode,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          if (Res.Data.Data == null) {
            this.$UI.Tips.CustomModal({
              Type: 'warning',
              Content: `输入的跟踪号信息有误，请重试`,
              Callback: (B:boolean):void =>{
                this.FocusTrackNum()
              }
            })
            return;
          }
          
          if (Res.Data.Data.Status != 5) {
            this.$UI.Tips.CustomModal({
              Type: 'warning',
              Content: `请扫描/输入状态为已打包订单的跟踪号`,
              Callback: (B:boolean):void =>{
                this.FocusTrackNum()
              }
            })
            return;
          } else if (this.SetSendForm.MethodName != "" && this.SetSendForm.MethodName != undefined && this.SetSendForm.MethodName != Res.Data.Data.ShippingMethodId) {
            this.$UI.Tips.CustomModal({
              Type: 'warning',
              Content: `请扫描/输入相同物流渠道的跟踪号`,
              Callback: (B:boolean):void =>{
                this.FocusTrackNum()
              }
            })
            return;
          }

          this.SetSendForm.MethodName = Res.Data.Data.ShippingMethodId;
          this.MethodId = Res.Data.Data.MethodName;
          this.SeleDisabled = true;

          // 如果订单为拦截状态，则先将状态变更为已拦截 再添加至列表
          if (Res.Data.Data.IsHoldUp == true) {
            this.ChangeShipOrdStatus(Res.Data.Data.Id, Res.Data.Data.Remark, 8, Res.Data.Data);
            return;
          } else {
            this.CurSendData = Res.Data.Data;
            IsSetWight ? this.CheckWeight() : this.FocusWeight();
          }
        } else {
          this.$Request.Error(Res);
          this.FocusTrackNum();
        }
      }
    })
  }
  // 更新SKU毛重
  private UpdSkuGrossWeight(): void {
    let PostData = {
      SkuId: (this.CurSendData as Interface.SetSendData).Sku.SkuId,
      SkuCode: (this.CurSendData as Interface.SetSendData).Sku.SkuCode,
      GrossWeight: (Number(this.SetSendForm.Weight) * 1000)
    };
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.SkuUpdGrossWeight,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (!Res.IsSuccess) {
          this.$Request.Error(Res);
        }
        this.InsertOrd();
      }
    })
  }

  private InsertOrd(): void {
    this.DelUnusualOrder();

    (this.CurSendData as Interface.SetSendData).Weight = parseFloat(this.SetSendForm.Weight);
    this.SetSendData.unshift((this.CurSendData as Interface.SetSendData));
    this.FocusTrackNum();
  }

  // 添加到完成列表中时 清除异常列表中相同订单
  private DelUnusualOrder(): void {
    this.HoldUpData.forEach((Item,Idx)=>{
      if(Item.TrackingNumber == (this.CurSendData as Interface.SetSendData).TrackingNumber){
        this.HoldUpData.splice(Idx, 1);
        return;
      }
    })
  }

  // 将拦截订单状态变更为已拦截 并添加至表格
  private ChangeShipOrdStatus(ShipId: number, Remark: string, Status: number, Datas: Interface.SetSendData): void {
    let PostData = {
      OrderId: [ShipId],
      TargetStatus: Status,
      Remark: Remark
    }
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.$Api.ShipOrderChangeStatus,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if (Res.IsSuccess) {
          this.$UI.Tips.CustomModal({
            Type: 'warning',
            Content: `当前订单【${Datas.OrderCode}】已被拦截，请勿发货。拦截原因：${(Remark == "" ? '暂无' : Remark)}`,
            Callback: (B:boolean):void =>{
              this.AddpendHoldUpList(Datas, 1);
              this.FocusTrackNum();
            }
          })
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 添加至异常列表
  AddpendHoldUpList(Datas: Interface.SetSendData, Type: number, Wight?: number): void {
    this.$set(Datas, 'HoldUpName', Type == 1 ? '拦截' : '重量不符');
    if (Type == 1) {
      for (let Item of this.HoldUpData) {
        if (Datas.TrackingNumber == Item.TrackingNumber) {
          this.FocusTrackNum();
          return;
        }
      }
    }
    if (Type == 2 && Wight) {
      this.HoldUpData.forEach((Item,Idx)=>{
        if(Datas.TrackingNumber == Item.TrackingNumber){
          this.HoldUpData.splice(Idx, 1);
          return false;
        }
      })
      Datas.NewTrackingNumber = Wight
    }
    this.HoldUpData.unshift(Datas)
  }

  // 删除列表中的数据
  DelTrackNum(Index: number): void {
    this.SetSendData.splice(Index, 1);
    this.FocusTrackNum();
  }

  // 发货
  SendProduct(): void {
    this.SeleDisabled = false
    if (this.SetSendData.length < 1) {
      this.FocusTrackNum();
      return;
    }

    if (!GetLodop(this)) {
      return;
    }

    let PostData = [];
    let SumWeight = 0;
    let OrderQuantity = 0;
    let WarehouseName = "";
    for (let Item in this.SetSendData) {
      PostData.push({ OrderId: this.SetSendData[Item].Id, Weight: parseFloat(String(this.SetSendData[Item].Weight)) })
      SumWeight += parseFloat(String(this.SetSendData[Item].Weight));
      OrderQuantity++;
      WarehouseName = this.SetSendData[Item].WarehouseName;
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Warehouse,
      Api: {
        Address: this.Flag === 1 ? this.$Api.ShipOrderSetSend : this.$Api.SetSendByTort,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide()
        if (Res.IsSuccess) {
          let CurrentDate: Date | string = new Date();
          let PrintYear = CurrentDate.getFullYear();
          let PrintMonth = CurrentDate.getMonth() < 9 ? ('0' + (CurrentDate.getMonth() + 1)) : (CurrentDate.getMonth() + 1);
          let PrintDate = CurrentDate.getDate() < 10 ? ('0' + (CurrentDate.getDate())) : CurrentDate.getDate();
          let PrintHour = CurrentDate.getHours() < 10 ? ('0' + CurrentDate.getHours()) : CurrentDate.getHours();
          let PrintMins = CurrentDate.getMinutes() < 10 ? ('0' + CurrentDate.getMinutes()) : CurrentDate.getMinutes();
          CurrentDate = PrintYear + '-' + PrintMonth + '-' + PrintDate + 'T' + PrintHour + ':' + PrintMins;
          this.PrintData = [{
            DeliveryTime: CurrentDate,
            WareHouseName: WarehouseName,
            BatchCode: Res.Data.DeliveryBatchCode,
            ShipMethodName: this.MethodId,
            TotalShipOrder: OrderQuantity,
            TotalWeight: SumWeight
          }]
          this.PrintSendList();
          this.Refresh();
          this.$UI.Tips.Modal({
            Type: 'success',
            Content: `发货成功`,
            Callback: (B:boolean):void =>{ }
          })
        }else{
          this.$Request.Error(Res);
          this.FocusTrackNum()
        }
      }
    })
  }

  private PrintSendList(): void {
      const LODOP:any = GetLodop();
      LODOP.PRINT_INITA("0.53mm", "0.53mm", "100.01mm", "100.01mm", "发货清单");
      LODOP.SET_PRINT_PAGESIZE(0, 1000, 1000, "");
      this.PrintData.forEach((Item, Idx)=>{
        LODOP.NewPage();
        LODOP.ADD_PRINT_RECT("17.99mm", "2.99mm", "94.01mm", "79mm", 0, 1);
        LODOP.ADD_PRINT_TEXT("2.99mm", "2.99mm", "94.01mm", "13.23mm", "发货清单");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 26);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_LINE("97.42mm", "50.01mm", "18.31mm", "50.01mm", 0, 1);
        LODOP.ADD_PRINT_LINE("31.01mm", "2.99mm", "31.01mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("44mm", "2.99mm", "44mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("56.99mm", "2.99mm", "56.99mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("70.01mm", "2.99mm", "70.01mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_LINE("83mm", "2.99mm", "83mm", "97.18mm", 0, 1);
        LODOP.ADD_PRINT_TEXT("22.75mm", "2.99mm", "46.99mm", "5.29mm", "发货时间");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("35.45mm", "2.99mm", "46.99mm", "5.29mm", "发货仓库");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("48.95mm", "2.99mm", "46.99mm", "5.29mm", "发货批次");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("61.91mm", "2.99mm", "46.99mm", "5.29mm", "物流渠道");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("74.61mm", "2.99mm", "46.99mm", "5.29mm", "包裹数");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("88.37mm", "2.99mm", "46.99mm", "5.29mm", "总重量");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("22.75mm", "50.01mm", "46.99mm", "5.29mm", (Item.DeliveryTime as string).replace('T', ' '));
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("35.45mm", "50.01mm", "46.99mm", "5.29mm", Item.WareHouseName);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("48.95mm", "50.01mm", "46.99mm", "5.29mm", Item.BatchCode);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("61.91mm", "50.01mm", "46.99mm", "5.29mm", Item.ShipMethodName);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("74.61mm", "50.01mm", "46.99mm", "5.29mm", Item.TotalShipOrder);
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.ADD_PRINT_TEXT("88.37mm", "50.01mm", "46.99mm", "5.29mm", Item.TotalWeight.toFixed(3) + 'kg');
        LODOP.SET_PRINT_STYLEA(0, "FontName", "微软雅黑");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

        if (Idx >= this.PrintData.length - 1) {
          // 预览
          LODOP.PRINT();

          this.PrintData = []

          if (this.$route.name != 'setSend') {
            this.$UI.Tips.Floating('success', '打印发货清单成功')
          }
        }
      })
    }

  // 重置
  private Refresh(): void {
    this.HoldUpData = [];
    this.SetSendData = [];
    this.SetSendForm.MethodName = "";
    this.FocusTrackNum();
    this.SeleDisabled = false;
    this.MethodId = "";
  }

  private TableHeight: number = window.innerHeight - 276;
  private SetSendForm: Interface.SetSendForm = new Interface.SetSendForm();
  private MethodId: string = "";
  private SeleDisabled: boolean = false;
  private CurSendData: Interface.SetSendData | null = null;
  private SetSendData: Interface.SetSendData[] = [];
  private HoldUpData: Interface.SetSendData[] = [];

  private PrintData: Interface.PrintData[] = [];

  private ShipMethodList: PInterface.IdName[] = []; // 物流渠道下拉列表

  private SetSendRules: any = {
    TrackCode: [{ required: true, message: '请扫描/输入跟踪号', trigger: 'blur' }],
    Weight: [{ required: true, message: '请输入重量', trigger: 'blur' }, { ppattern: /^([0-9]\d*)(\.{0,1}\d*[0-9])?$/, message: '请输入正确的重量', trigger: 'change' }]
  }

  private SetSendCol: PInterface.TableCol[] = [
    { title: '跟踪号', key: 'TrackingNumber', render: (h, Params) => {
        return h('p', [
          h('span', Params.row.TrackingNumber)
        ])
      }
    }, 
    { title: '发货单号', key: 'OrderCode' }, 
    { title: '重量（Kg.）', key: 'Weight' },
    { title: '操作', width: 100, render: (h, Params) => {
      return h('Button', {
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: ()=> {
            this.DelTrackNum(Params.row._index)
          }
        }
      }, '删除')
    }
  }]

  private HoldUpRow: PInterface.TableCol[] = [
    { title: '跟踪号', key: 'TrackingNumber' },
    { title: '发货单号', key: 'OrderCode' }, 
    { title: '重量（Kg.）', key: 'NewTrackingNumber' }, 
    { title: '异常原因', width: 120, key: 'HoldUpName', render: (h, Params) => {
      return h('Tag', {
        props: { color: 'error' }
      }, Params.row.HoldUpName )
    }
  }]
}

</script>
<style lang="less"></style>
