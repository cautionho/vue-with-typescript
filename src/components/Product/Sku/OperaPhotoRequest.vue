<!--拍摄需求 单个操作处理、审核-->
<template>
  <Col>
  <Modal v-model="ShowModal" :title="Type === 3 ? '美工处理' : '拍摄需求审核'" @on-cancel="ChangeMsg(false)" :mask-closable="false" :width="IsBatch ? 450 : 700">
    <section v-if="!IsBatch">
      <PhotoRequestInfo ref="PhotoRequestInfo" :OpeStatus="Type" />
      <Input v-model="Remark" placeholder="请输入备注" type="textarea" :autosize="{minRows: 4,maxRows: 5}" ref="Remark"></Input>
    </section>
    <section v-else>
      <span class="P-Inline-Block P-MT-5">更换美工：</span>
      <Select class="P-W-300 P-ML-10 P-Inline-Block" placeholder="更换美工" v-model="Operator" :options="DropOperator" />
      <!-- <Select class="P-W-300 P-ML-10 P-Inline-Block" placeholder="更换美工" v-model="Operator" filterable clearable>
        <Option v-for="Item in DropOperator" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
      </Select> -->
    </section>
    <div slot="footer" v-if="Type === 3">
      <Button type="primary" @click="PostComit(3)" v-if="!IsBatch">提交销售审核</Button>
      <Button type="primary" @click="PostComit(1)" v-if="!IsBatch">需求退回修改</Button>
      <Button type="primary" @click="PostComit(2, true)" v-if="IsBatch">提交</Button>
      <Button @click="ChangeMsg(false)">返回</Button>
    </div>
    <div slot="footer" v-if="Type === 4">
      <Button type="primary" @click="PostComit(4)">通过</Button>
      <Button type="primary" @click="PostComit(2)">图片退回修改</Button>
      <Button @click="ChangeMsg(false)">返回</Button>
    </div>
  </Modal>
  </Col>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Product'
import PInterface from '@/assets/Interface/Public'

@Component({
  name: 'OperaPhotoRequest',
  components:{
    PhotoRequestInfo: () => import('@/components/Product/Sku/PhotoRequestInfo.vue'),
  }
})
export default class OperaPhotoRequest extends Vue {
  @Emit() ChangeMsg(Res: boolean): void{
    this.ShowModal = false;
    this.$nextTick(()=>{
      this.Remark = "";
      this.Operator = 0;
      this.IsBatch = false;
    })
  }

  // Type 3-处理 4-审核
  private TriggerModal(SelectedData: Interface.PhotoRequestList[], Type: number, DropOperator:PInterface.KV[]|null): void{
    this.Type = Type;
    this.CurrOpeData = SelectedData;
    (this.$refs.PhotoRequestInfo as any).InfoData = SelectedData[0];
    this.ShowModal = true;
    if(DropOperator !== null && Type == 3){
      this.DropOperator = DropOperator;
      this.IsBatch = true;
    }else{
      this.$nextTick(()=>{
        (this.$refs.Remark as any).focus()
      })
    }
    
  }

  private PostComit(Status: number, Flag:boolean): void{
    if(!this.IsBatch){
      if((this.$refs.PhotoRequestInfo as any).IsChangeImg){ //单个处理时是否上传过图片
        if((this.$refs.PhotoRequestInfo as any).InfoData.SkuImage.length < 1){
          this.$UI.Tips.Floating('warning', ` 请上传图片`);
			    return;
        }
        this.UploadPic();
        (this.$refs.PhotoRequestInfo as any).IsChangeImg = false;
      }
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PhotoRequestChangeStatus,
				Login: true
			},
			Data: {
        Id: this.CurrOpeData.map(Item=>Item.Id), 
        Remark:this.Remark, 
        Status: Status, 
        Operator: this.IsBatch ? this.Operator : this.CurrOpeData[0].Operator
      },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${Status === 1 ? '需求退回修改' : Status === 2 ? (Flag ? '提交美工处理' : '图片退回修改') : Status === 3 ? '提交销售审核' : "审核通过"}成功`);
          this.ChangeMsg(true)
				} else {
					this.$Request.Error(Res);
				  this.$UI.Loading.Hide();
				}
			}
    });
  }

  private UploadPic(): void{
    this.$Request.Post({
			Server: this.$Server.Purchase,
			Api: {
				Address: this.$Api.PhotoRequestUpload,
				Login: true
			},
			Data: {Id: this.CurrOpeData.map(Item=>Item.Id), Images: (this.$refs.PhotoRequestInfo as any).InfoData.SkuImage},
			Callback: (Res: PInterface.Res): void => {
				if (!Res.IsSuccess) {
					this.$Request.Error(Res);
				}
			}
    });
  }

  private Operator: number = 0;
  private IsBatch: boolean = false; //批量美工处理时为true
  private DropOperator: PInterface.KV[] = [];
  private CurrOpeData: Interface.PhotoRequestList[] = []
  private Type: number = 0
  private ShowModal: boolean = false;
  private Remark: string = ""
}
</script>