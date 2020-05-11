<template>
  <div class="P-Inline-Block">
    <Col>
      <Button class="P-MR-10" type="primary" v-if="Power" @click="TriggerModal">添加菜单</Button>
      <Modal v-model="ResourcesModal" :title="ResourcesMsg.Id==0?'添加菜单':'编辑菜单'" @on-cancel="HandleResMsg(false)" :mask-closable="false" :width="500">
        <Form onsubmit="return false" ref="ResourcesMsg" :model="ResourcesMsg" :rules="ResourceRule" :label-width="110">
          
          <Form-item label="菜单名称：" prop="ResourceName">
            <Input v-model="ResourcesMsg.ResourceName" placeholder="菜单名称" ref="ResourceName"></Input>
          </Form-item>
          <Form-item label="元素ID：" prop="ElementId">
            <Input v-model="ResourcesMsg.ElementId" placeholder="元素ID"></Input>
          </Form-item>
          <Form-item label="上级菜单：" prop="ParentId">
            <Cascader :data="TreeMenu" v-model="ResourcesId" filterable change-on-select :render-format="RenderFormat" placeholder="请选择上级菜单" ref="ParentName"></Cascader>
          </Form-item>
          <Form-item label="跳转链接：" prop="ActionUrl">
            <Input v-model="ResourcesMsg.ActionUrl" placeholder="跳转链接"></Input>
          </Form-item>
          <Form-item label="请求API：" prop="IncludeAction">
            <Input v-model="ResourcesMsg.IncludeAction" placeholder="请求API"></Input>
          </Form-item>
          <Form-item label="是否功能点：" prop="IsPoint">
            <Select v-model="ResourcesMsg.IsPoint" placeholder="是否功能点" :options="DropList" />
            <!-- <Select v-model="ResourcesMsg.IsPoint" placeholder="是否功能点" filterable clearable>
              <Option v-for="(item,index) in DropList" :value="$Enums.Setting.IsTrue[item]" :key="item">{{item}}</Option>
            </Select> -->
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="ValidatePostResource">提交</Button>
          <Button @click="HandleResMsg(false)">取消</Button>
        </div>
      </Modal>
    </col> 
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import Interface from '@/assets/Interface/Setting'
import PInterface from '@/assets/Interface/Public'
@Component({
  name: 'ModifyResources'
})
export default class ModifyResources extends Vue {
  @Prop() TreeMenu: Interface.Resources[]
  @Prop() Power: boolean

  @Emit() HandleResMsg(Type:boolean): void {
    this.$set(this, 'ResourcesModal', false);
    (this.$refs["ResourcesMsg"] as any).resetFields();
  }

  private TriggerModal(SelectedData: Interface.ResourcesChild[], CurrTreeDomId: string[]): void{
    this.SelectedData = SelectedData.length ? SelectedData : [];
    this.$set(this, 'ResourcesMsg', this.SelectedData.length ? this.SelectedData[0] : new Interface.ResourcesChild());
    this.$set(this, 'ResourcesId', this.SelectedData.length ? CurrTreeDomId : [])
    let arr: string[] = [];
    this.$set(this.ResourcesMsg, 'IsPoint', this.ResourcesMsg.IsPoint === "" ? "" : this.ResourcesMsg.IsPoint ? 1 : 0)

    this.$nextTick(function() {
      (this.$refs["ResourceName"] as any).focus();
    })
    this.$set(this,'ResourcesModal', true);
  }

  //自定义级联菜单方法
  private RenderFormat(Labels:string[], SelectedData:Interface.Resources[]):string | void {
    const Idx = Labels.length - 1;
    const Data = SelectedData[Idx] || false;
    if (Data) {
      this.$set(this, 'ResourcesId', [Number(SelectedData[Idx].Id)])
      return Labels[Idx]
    }
  }

  private ValidatePostResource():void {
    (this.$refs["ResourcesMsg"] as any).validate((valid: boolean) => {
      if (valid) {

        if ( this.ResourcesMsg.Id !== 0 && this.ResourcesMsg.Id === Number(this.ResourcesId[this.ResourcesId.length-1]) ) {
          this.$UI.Tips.Floating('warning', `上级菜单不能为自身`);
          return 
        }

      	this.PostResourcesMsg();
      }
    })
  }

  private PostResourcesMsg():void {
    this.PostMsg = JSON.parse(JSON.stringify(this.ResourcesMsg))
    this.$set(this.PostMsg, 'IsPoint', this.PostMsg.IsPoint ? true : false)
    this.$set(this.PostMsg, 'ParentId', Number(this.ResourcesId[this.ResourcesId.length-1]))
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.ResourcesMsg.Id === 0 ? this.$Api.MenuCreate : this.$Api.MenuModify,
				Login: true
			},
			Data: this.PostMsg,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${this.ResourcesMsg.Id === 0 ? '添加菜单成功' : '编辑菜单成功'}`);
          this.HandleResMsg(true)
				} else {
          this.$Request.Error(Res);
          this.$nextTick(function() {
            (this.$refs["ResourceName"] as any).focus();
          })
				  this.$UI.Loading.Hide();
				}
			}
		})
  }
  
  private SelectedData: Interface.ResourcesChild[] = [];
  private DropList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Setting.IsTrue)
  private ResourcesModal:boolean = false;
  private ResourcesId:string[] = [];
  private ResourcesMsg: Interface.ResourcesChild = new Interface.ResourcesChild();
  private PostMsg: Interface.ResourcesChild = new Interface.ResourcesChild();
  private ResourceRule: any = {
    ResourceName: [{ required: true, message: '请输入菜单名称' }],
    ElementId: [{ required: true, message: '请输入元素ID' }]
  }
}

</script>
<style lang="less"></style>
