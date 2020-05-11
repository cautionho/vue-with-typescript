<template>
<Row class="P-Inline-Block">
	<Col>
  <Button type="primary" @click="TriggerModal" v-if="Power">添加虚拟渠道</Button>
  <Modal :title="(VirtualChannelMsg.Id !== 0?'修改':'添加')+'虚拟渠道'" v-model="IsShowModal" :mask-closable="false" @on-cancel="HandleRes(false)" :width="960">
    <Form onsubmit="return false" ref="VirtualChannelMsg" :model="VirtualChannelMsg" :rules="customerRules" :label-width="120">
      <Form-item label="虚拟渠道名称：" prop="VirtualChannelName">
        <Input v-model="VirtualChannelMsg.VirtualChannelName" placeholder="请输入虚拟渠道名称" name="virtualChannelInput"></Input>
      </Form-item>
      <Form-item label="发货仓：" prop="WarehouseId">
        <Select v-model="VirtualChannelMsg.WarehouseId" placeholder="请选择仓库" label-in-value :options="WarehouseList" />
      </Form-item>
      <Form-item label="备注：">
        <Input v-model="VirtualChannelMsg.Remark" type="textarea" :autosize="{minRows: 2,maxRows:5}" placeholder="请输入备注"></Input>
      </Form-item>
      <Form-item label="物流渠道：" class="ivu-form-item-required">
        <div style="max-height: 400px; overflow-y: auto">
          <CheckboxGroup v-model="SelectMethods">
            <Checkbox v-for="(Item,Index) in MethodList" :label="Item.Id" :key="Item.Name" class="P-VA-T P-W-30-Percent">{{Item.Name}}</Checkbox>
            <p v-if="!VirtualChannelMsg.WarehouseId">请先选发货仓再选物流渠道</p>
            <p v-if="MethodList.length < 1 && VirtualChannelMsg.WarehouseId">当前发货仓下暂无物流渠道数据</p>
          </CheckboxGroup>
        </div>
      </Form-item>
    </Form>
    <footer slot="footer">
      <Button type="primary" @click="PostMsg()">提交</Button>
      <Button @click="HandleRes(false)">取消</Button>
    </footer>
  </Modal>
  </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Emit, Vue, Watch, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from "@/assets/Interface/Logistics";
@Component({
  name: 'ModifyVirtualChannel'
})
export default class ModifyVirtualChannel extends Vue {
  @Prop() Power: boolean
  @Prop() WarehouseList: PInterface.KV[]

  @Emit() HandleRes(Type: boolean): void {
    this.IsShowModal = false;
    this.$nextTick(()=>{ (this.$refs['VirtualChannelMsg'] as any).resetFields()})
  }

  @Watch('VirtualChannelMsg.WarehouseId')
  private ChangeWare(Val: number): void{
    this.SelectMethods = [];
    this.MethodList = [];
    this.GetMethodsList(Val)
  }
  
  // 打开模态框
  private TriggerModal(SelectedData: Interface.VirtualChannelList[]):void {
    this.SelectMethods = [];

    if(SelectedData.length){ //修改
      this.VirtualChannelMsg = SelectedData[0];
      this.$nextTick(()=>{
        this.VirtualChannelMsg.BindShipMethods.forEach(Item=>{
          this.SelectMethods.push(Item.ShipMethodId)
        })
      })
    }else{
      this.VirtualChannelMsg = new Interface.VirtualChannelList();
    }
    this.$set(this,'IsShowModal', true);
  }

  // 获取物流渠道下拉
  private GetMethodsList(Val: number) {
    if(Val){
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Logistics,
        Api: {
          Address: this.$Api.ChannelDropList,
          Login: false
        },
        Data: Val,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {
            this.MethodList = Res.Data.DropList;
          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }
  }

  private PostMsg(): void{
    (this.$refs['VirtualChannelMsg'] as any).validate((Valid: boolean) => {
      if (Valid) {
        if(this.SelectMethods.length < 1){
          this.$UI.Tips.Floating('warning', `请选择物流渠道`);
          return;
        }
        let PostData = JSON.parse(JSON.stringify(this.VirtualChannelMsg));
        PostData.BindShipMethods = [];
        this.SelectMethods.forEach(Item =>{
          this.MethodList.forEach(Itm =>{
            if(Item === Itm.Id){
              let Obj:Interface.ChannelList = {
                ShipMethodId: Itm.Id,
                ShipMethodName: Itm.Name as string
              }
              PostData.BindShipMethods.push(Obj)
            }
          })
        })
        
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Logistics,
          Api: {
            Address: this.VirtualChannelMsg.Id !== 0 ? this.$Api.VirtualChannelModify : this.$Api.VirtualChannelCreate,
            Login: false
          },
          Data: PostData,
          Callback: (Res: PInterface.Res): void => {
            if (Res.IsSuccess) {
              this.$UI.Tips.Floating('success', (this.VirtualChannelMsg.Id !== 0 ? '修改' : '添加') + '虚拟渠道成功')
              this.HandleRes(true)
            } else {
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private IsShowModal: boolean = false;
  private MethodList: PInterface.IdName[] = [];
  private SelectMethods: number[] = [];
  private VirtualChannelMsg: Interface.VirtualChannelList = new Interface.VirtualChannelList();
  private customerRules:any = {
    VirtualChannelName: [{ required: true, message: '请输入虚拟渠道名称' }],
    WarehouseId: [{ required: true, message: '请选择仓库', trigger: 'change', type: 'number' }]
  }
}

</script>
<style lang="less"></style>
