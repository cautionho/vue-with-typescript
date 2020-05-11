<!-- 添加  编辑 -->
<template>
  <Row  class="P-Inline-Block">
    <Button class="P-MR-10 P-MB-10" v-if="Powers.SkuSetBrand" type="primary" @click="OpenSettings(1)">设置品牌</Button>
    <Button class="P-MR-10 P-MB-10" v-if="Powers.SkuSetStatus" type="primary" @click="OpenSettings(2)">设置状态</Button>
    <Button class="P-MR-10 P-MB-10" v-if="Powers.SkuSetCategory" type="primary" @click="OpenSettings(3)">设置品类</Button>
    <Button class="P-MR-10 P-MB-10" v-if="Powers.SkuSetPurchase" type="primary" @click="OpenSettings(4)">设置采购员</Button>
    <Button class="P-MR-10 P-MB-10" v-if="Powers.SkuSetSaleManager" type="primary" @click="OpenSettings(5)">设置销售主管</Button>
    <Button class="P-MR-10 P-MB-10" v-if="Powers.SkuSetDevManager" type="primary" @click="OpenSettings(6)">设置产品经理</Button>
    <Button class="P-MR-10 P-MB-10" v-if="Powers.BatchAddTag" type="primary" @click="OpenSettings(7)">批量增加标签</Button>
    <Modal v-model="ModifyModal" :title=" ModalType === 7 ? `批量增加标签` : `设置${CurrentModalTitle}`" :mask-closable="false" @on-cancel="ClearModal(0)">
      <Form :model="OperateForm" :rules="OperateFormRules" :label-width="100" ref="OperateForm" onsubmit="return false">
        
        <Form-item v-if="ModalType === 3 || ModalType === 7" :label=" ModalType === 3 ? '品类' : '特性标签' " prop="ArrayValue">

          <Cascader v-if="ModalType === 3" transfer :data="Tree" v-model="OperateForm.ArrayValue" @on-change="SetCategory" change-on-select filterable  :placeholder="CurrentModalTitle" />
          <Select v-else v-model="OperateForm.ArrayValue" :placeholder="CurrentModalTitle" multiple :options="DropCurrentList" />
          <!-- <Select v-else v-model="OperateForm.ArrayValue" :placeholder="CurrentModalTitle" filterable clearable multiple>
            <Option v-for="Item in DropCurrentList" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
          </Select> -->
        </Form-item>
        
        <Form-item :label="CurrentModalTitle" prop="SettingValue" v-else>
          <Select v-if="ModalType === 2"  v-model="OperateForm.SettingValue" placeholder="状态" :options="DropStatus" />
          <!-- <Select v-if="ModalType === 2"  v-model="OperateForm.SettingValue" placeholder="状态" filterable clearable >
            <Option v-for="(Item, Index) in DropStatus" :key="Index" :value="$Enums.Warehouse.SkuStatus[Item]">{{ Item }}</Option>
          </Select> -->
          <Select v-else v-model="OperateForm.SettingValue" :placeholder="CurrentModalTitle" :options="DropCurrentList" />
          <!-- <Select v-else v-model="OperateForm.SettingValue" :placeholder="CurrentModalTitle" filterable clearable>
            <Option v-for="Item in DropCurrentList" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
          </Select> -->
        </Form-item>

        <Form-item v-if="ModalType !== 7">
          <p>修改将会应用到选中的母SKU，及其子SKU</p>
        </Form-item>
        
      </Form>
      <div slot="footer">
        <Button type="primary" @click="SubModal()">提交</Button>
        <Button @click="ClearModal(0)">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  @Component({
    name: 'SettingSku'
  })
  export default class SettingSku extends Vue {
    @Prop() Powers: PInterface.Power;   //权限
    @Prop() Tree: PInterface.ProductCagtegoryTree;   // 品类树

    @Emit() HandleResMsg(Type: number): void {} // 回调

    // 当前模态框主题
    get CurrentModalTitle():string {
      return ['品牌', '状态', '品类', '采购员', '销售主管', '产品经理', '特性标签'][this.ModalType - 1];
    }
    
     // 打开模态框 检测类型
    private Trigger(SelectedData: Interface.SkuManageList[], DropCurrent: PInterface.KV[] ):void {
      
      if (SelectedData.length === 0) {
        this.$UI.Tips.Floating('warning', `请选择SKU进行设置${this.CurrentModalTitle}操作`);
        return;
      }

      this.CurSelectedData.splice(0, this.CurSelectedData.length, ...SelectedData)
      this.DropCurrentList.splice(0, this.DropCurrentList.length, ...DropCurrent)

      this.ModifyModal = true;
    }

    // 打开模态框
    private OpenSettings(Type: number): void {
      this.ModalType = Type
      this.HandleResMsg(Type)
    }

    // 品类 值获取
    private SetCategory(Data: string[]): void {
      ( this.OperateForm.ArrayValue as number[] ).splice(0, ( this.OperateForm.ArrayValue as number[] ).length, ...Data.map( Item => Number(Item) ) )
    }

    // 发送请求 
    private SubModal(): void {

      let PostData: any = {};

      // 特性标签另外处理
      if (this.ModalType === 7) {
        PostData['skuId'] = this.CurSelectedData.map(Item => Item.Id)
        PostData['attributeId'] = this.OperateForm.ArrayValue
      } else {
        PostData["Id"] = this.CurSelectedData.map(Item => Item.Id)
        PostData[`${['BrandId', 'Status', 'CategoryId', 'Purchaser', 'SaleManager', 'DevManager'][this.ModalType - 1]}`] = this.ModalType === 3 ? this.OperateForm.ArrayValue[this.OperateForm.ArrayValue.length - 1] : this.OperateForm.SettingValue 
      }

      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: [this.$Api.SkuSetBrand, this.$Api.SkuSetStatus, this.$Api.SkuSetCategory, this.$Api.SkuSetPurchaser, this.$Api.SkuSetSaleManager, this.$Api.SkuSetDevManager, this.$Api.EditAttributes][this.ModalType - 1],
          Login: true
        },
        Data: PostData,
        Callback: (res: PInterface.Res): void => {
          if (res.IsSuccess) {
            this.$UI.Tips.Floating('success', this.ModalType === 7 ? '批量增加SKU特性标签成功' : `设置${this.CurrentModalTitle}成功`);
            this.ClearModal(1)
          } else {
            this.$Request.Error(res);
          }
          this.$UI.Loading.Hide();
        }
      })
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.ModifyModal = false;
      (this as any).$refs["OperateForm"].resetFields();
      this.OperateForm = new Interface.SettingMsg()
      if (Val === 1) {
        this.HandleResMsg(0)
      }
    }

    private CurSelectedData: Interface.SkuManageList[] = []; // 选择列表

    private ModifyModal: boolean = false // 当前模态框

    private DropCurrentList: PInterface.KV[] | string[] = []; // 目标下拉框

    private ModalType: number = 0; // 模态框类型
    private OperateForm: Interface.SettingMsg = new Interface.SettingMsg() //状态改变提交信息
    private OperateFormRules: any = {
      SettingValue: [{ type: 'number', required: true, message: '请选择', trigger: 'change' }],
      ArrayValue: [{ type: 'array', required: true, message: '请选择品类', trigger: 'change' }]
    }
    private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); // 状态枚举下拉
  }
</script>
<style lang="less" scoped>
</style>
