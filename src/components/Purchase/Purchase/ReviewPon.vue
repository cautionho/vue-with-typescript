<template>
	<Row>
    <Modal v-model="OpenReviewModal" :title="TabTitle" @on-cancel="EmitPurchase(false)" :mask-closable="false" :width="IsBatch ? 600 : 1200">
      <PonDetails ref="PonDetails" :HideArrival="true" :IsBatch="IsBatch" :CurrOperatPon="CurrentPon" :PurchaserList="PurchaserList" v-show="!IsBatch"/>
      <footer slot="footer" v-if="!IsBatch">
				<Button type="primary" @click="PostReview(1)">通过</Button>
				<Button type="primary" @click="PostReview(2)">退回修改</Button>
				<Button type="error" @click="PostReview(3)">不通过</Button>
				<Button type="default" @click="EmitPurchase(false)">返回</Button>
			</footer>

      <Form :label-width="100" ref="BatchReviewForm" :model="BatchReviewForm" v-if="IsBatch">
        <FormItem label="审核结果：">
            <RadioGroup v-model="BatchReviewForm.Status">
                <Radio label="1">通过</Radio>
                <Radio label="2">不通过</Radio>
                <Radio label="3">退回修改</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="更换采购员：" v-if="CurrentPon === 1">
          <Select placeholder="请选择采购员" :onChange="OnClearSelect.bind(this, 'Purchaser')" v-model="BatchReviewForm.Purchaser" :options="PurchaserList" />
          <!-- <Select placeholder="请选择采购员" filterable clearable @on-change="OnClearSelect('Purchaser')" v-model="BatchReviewForm.Purchaser">
            <Option v-for="(item,index) in DropPurchaserList" :value="item.Value" :key="index">{{ item.Key }}</Option>
          </Select> -->
        </FormItem>
        <FormItem label="备注：">
          <Input placeholder="请输入备注" type="textarea" v-model="BatchReviewForm.Remark" :autosize="{minRows:4,maxRows:4}" ></Input>
        </FormItem>
      </Form>
      <footer slot="footer" v-if="IsBatch">
				<Button type="primary" @click="PostReview(0)">提交</Button>
				<Button type="default" @click="EmitPurchase(false)">取消</Button>
			</footer>
    </Modal>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Purchase';
import PInterface from '@/assets/Interface/Public';
@Component({
  name: 'ReviewPon',
  components: {
    PonDetails: ()=>import('./PonDetails.vue')
  }
})
export default class ReviewPon extends Vue {
  @Emit() private EmitPurchase(r: boolean):void{
    this.OpenReviewModal = false;
    this.$set(this, 'BatchReviewForm', new Interface.ReviewPostData())
  }

  private TriggerModal(SelectedData: Interface.PurchaseOrd[], IsBatch: boolean, DropPurchaserList: PInterface.KV[], CurrentPon: number): void {
    if(CurrentPon === 1 && !(SelectedData.every( Item => Item.Status==2))){
			this.$UI.Tips.Floating('warning', `请选择状态为待采购主管审核的采购单进行操作`);
			return;
		}

		if(CurrentPon === 2 && !(SelectedData.every( Item => Item.Status==3))){
			this.$UI.Tips.Floating('warning', `请选择状态为待销售确认的采购单进行操作`);
			return;
		}

		if(CurrentPon === 3 && !(SelectedData.every( Item => Item.Status==10))){
			this.$UI.Tips.Floating('warning', `请选择状态为待总经理审核的采购单进行操作`);
			return;
    }
    
    this.CurrentPon = CurrentPon;
    this.IsBatch = IsBatch;
    this.SelecData = SelectedData;
    this.PurchaserList = DropPurchaserList;
    this.TabTitle = CurrentPon === 1 ? '采购主管审核' : CurrentPon === 2 ? '销售主管确认': CurrentPon === 3 ? '总经理审核' : '';
    if(this.IsBatch){ //批量时默认赋值单选框
      this.BatchReviewForm.Status = "1"
    }
    this.OpenReviewModal = true;
    (this as any).$refs.PonDetails.TriggerModal(this.SelecData)
  }

  //清空下拉选项时值为undefined 重新赋值为空
  private OnClearSelect(s: string):void{
    if( (this as any).BatchReviewForm[s] == undefined ){
      this.$set(this.BatchReviewForm, s, '');
    }
  }


  //审核   0-批量操作  1-通过 2-退回修改 3-不通过
  private PostReview(ope: number):void{
    let PostData = null;
    
    if(ope !== 0){
      PostData = JSON.parse(JSON.stringify((this.$refs["PonDetails"] as any).ReviewForm))
      PostData.Id = [this.SelecData[0].Id];
      PostData.Status = ope;

    }else{
      PostData = JSON.parse(JSON.stringify(this.BatchReviewForm))
      PostData.Id = this.SelecData.map( (item:Interface.PurchaseOrd):number => item.Id )
      PostData.Status = Number(PostData.Status)
    }
    
    if(this.CurrentPon !== 1){  //非采购审核删除属性
      delete PostData.Purchaser
    }else{
      PostData.Purchaser = PostData.Purchaser === "" ? 0 : PostData.Purchaser
    }

    this.PostReviewReq(PostData)
  }

  private PostReviewReq(PostData:Interface.ReviewPostData): void{
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.CurrentPon === 1 ? this.$Api.PurchaseOrderPMReview : this.CurrentPon === 2 ? this.$Api.PurchaseOrderSMReview : this.CurrentPon === 3 ? this.$Api.PurchaseOrderGMReview : "",
				Login: true
			},
			Data: PostData,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.$UI.Tips.Floating('success', `审核成功`);
					this.EmitPurchase(true)
				} else {
					this.$Request.Error(res);
				  this.$UI.Loading.Hide();
				}
			}
		})
  }

  private OpenReviewModal: boolean = false;
  private PurchaserList: PInterface.KV[] = []
  private CurrentPon: number = 0  //当前操作  1-采购主管审核 2-销售主管确认 3-总经理审核
  private IsBatch: boolean = false; //是否批量
  private TabTitle: string = "";  //模态框标题
  private SelecData: Interface.PurchaseOrd[] = [];
  private BatchReviewForm: Interface.ReviewPostData = new Interface.ReviewPostData();  //批量审核提交数据
}

</script>
<style lang="less"></style>
