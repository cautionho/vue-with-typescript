<template>
  <Modal v-model="ModifyModal" title="导出采购单明细" :mask-closable="false" @on-cancel="HandleResMsg" width="400">
    <Form onsubmit="return false" ref="ExportForm" :model="ExportForm" :rules="ExportFormRule" :label-width="100" name="ExportForm">
      <FormItem prop="StartTime" label="创建时间：">
        <Date-picker type="datetime" v-model="ExportForm.StartTime" placeholder="选择开始时间" style="width: 90%"></Date-picker>
        -
      </FormItem>
      <FormItem prop="EndTime">
        <Date-picker type="datetime" v-model="ExportForm.EndTime" placeholder="选择结束时间" style="width: 90%"></Date-picker>
      </FormItem>
      <Form-item label="采购单状态：">
        <Select placeholder="请选择状态" v-model="ExportForm.Status" :options="DropOrderStatusList" />
        <!-- <Select placeholder="请选择状态" v-model="ExportForm.Status" filterable clearable>
					<Option v-for="(Item,Index) in DropOrderStatusList" :value="$Enums.Purchase.OrderStatus[Item]" :key="Index">{{ Item }}</Option>
				</Select> -->
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="PostExport()">导出</Button>
      <Button style="margin-left: 8px" @click="HandleResMsg">取消</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Purchase';
@Component({
  name: 'ExportPonDetails'
})
export default class ExportPonDetails extends Vue {

  private HandleResMsg(): void {
    this.ExportForm = new Interface.ExportPonDetailsForm();
    (this.$refs['ExportForm'] as any).resetFields();
    this.$set(this, 'ModifyModal', false);
  }

  private TriggerModal(IsOps: boolean): void{
    this.IsOps = IsOps;
    
    this.$set(this.ExportForm, 'IsOps', this.IsOps);

    this.$nextTick( ()=>{
      this.ModifyModal = true
    })
  }

  // 导出
  private PostExport():void {
    (this.$refs['ExportForm'] as any).validate((Valid: boolean): void => {

      if (Valid) {
        let PostData = JSON.parse(JSON.stringify(this.ExportForm));
        PostData.StartTime = this.$UI["Render"].NewDate(PostData.StartTime, true)
        PostData.EndTime = this.$UI["Render"].NewDate(PostData.EndTime, true)
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Purchase,
          Api: {
            Address: this.$Api.PurchaseOrderOrderItemExport,
            Login: true
          },
          Data: PostData,
          Callback: (res: PInterface.Res): void => {
            this.$UI.Loading.Hide();
            if (res.IsSuccess) {

              this.$UI.Tips.Modal({
                Type: 'success',
                Content: `创建导出采购单明细成功。请到报表-导出管理模块查看目前正在进行的导出任务，并在导出成功后可以下载对应数据；`,
                Callback: (Res: boolean):void => {}
              });
              this.HandleResMsg()
            } else {
              this.$Request.Error(res);
            }
          }
        });
      }
    })

  }

  private ValidateStartDate(Rule: any, Value: any, CallBack: any): void {
    if (Value === '') {
      CallBack(new Error('请选择开始时间'))
    } else {
    const CurrentTime: number = new Date().getTime();
      if (this.StartTimeMs > CurrentTime) {
        CallBack(new Error('开始时间不得晚于当前时间'));
      } else if (this.EndTimeMs != '') {
        if ((this.EndTimeMs - (this.StartTimeMs as number) ) > this.MS_NUMBER) {
          CallBack('时间区间不能超过31天');
        } else {
          CallBack();
        }
      } else {
        CallBack();
      }
    }
  };
  private ValidateEndDate(Rule: any, Value: any, CallBack: any): void {
    if (Value === '') {
      CallBack(new Error('请选择结束时间'))
    } else {
      if (this.StartTimeMs > this.EndTimeMs) {
        CallBack(new Error('开始时间不能晚于结束时间'));
      } else if (this.StartTimeMs != '' && ((this.EndTimeMs as number) - (this.StartTimeMs as number) ) > this.MS_NUMBER) {
        CallBack(new Error('时间区间不能超过31天'));
      } else {
        CallBack()
      }
    }
  };

  get StartTimeMs(){
    return this.ExportForm.StartTime !== '' ? new Date(this.ExportForm.StartTime).getTime() : ''
  };
  get EndTimeMs(){
    return this.ExportForm.EndTime !== '' ? new Date(this.ExportForm.EndTime).getTime() : ''
  };

  private ModifyModal: boolean = false // 控制模态框
  private DropOrderStatusList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Purchase.OrderStatus)  //状态下拉
  private ExportForm: Interface.ExportPonDetailsForm = new Interface.ExportPonDetailsForm()
  private IsOps: boolean = false;
  private ExportFormRule: any = {
    StartTime: [{required: true, validator: this.ValidateStartDate, trigger: 'change', type: 'date'}],
    EndTime: [{required: true, validator: this.ValidateEndDate, trigger: 'change', type: 'date'}],
  };

  private MS_NUMBER:number = 31 * 24 * 3600000;
  
}

</script>
<style lang="less"></style>
