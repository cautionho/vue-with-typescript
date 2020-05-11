<!-- 添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button class="P-MB-10" type="primary" @click="OpenModifyModal">添加SKU别名</Button>
      <Modal v-model="ShowModal" :title="OperateForm.SkuId === 0 ? '添加SKU别名' : '编辑SKU别名' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110" v-if="ShowModal">
          <Form-item label="SKU编号：" prop="SkuCode">
            <Input v-model="OperateForm.SkuCode" placeholder="请输入SKU编号" ref="SkuCode" v-if="OperateForm.SkuId === 0"></Input>
            <span v-else>{{ OperateForm.SkuCode }}</span>
          </Form-item>
          <Form-item label="SKU别名：" prop="MapCode">
            <Input v-model.trim="MapCodeTags" placeholder="请输入SKU别名" @on-enter="AddMapCodeTags" ref="MapCodeTags">
            <Button type="primary" slot="append" @click="AddMapCodeTags">添加</Button></Input>
          </Form-item>
          <Form-item class="Max-Height-200">
            <Tag 
              type="border" 
              color="blue" 
              v-for="Item in OperateForm.MapCode" 
              :key="Item" 
              :name="Item" 
              closable 
              @on-close="HandleCloseTag">
              {{ Item }}
            </Tag>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </div>
      </Modal>
    </Col>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  @Component({
    name: 'ModifySkuMap'
  })
  export default class ModifySkuMap extends Vue {
    @Emit() HandleResMsg(Type:number): void {}

    private Trigger(Selected: Interface.SkuMapList):void {

      const OperateData: Interface.ModifySkuMap = {
        SkuId: Selected.SkuId,
        SkuCode: Selected.SkuCode,
        MapCode: Selected.MapCode
      }

      this.$set(this, 'OperateForm', JSON.parse(JSON.stringify(OperateData)) );
      
      this.$set(this.OperateForm, 'MapCode', this.OperateForm.MapCode === "" ? [] : (this.OperateForm.MapCode as string).split(',') );

      this.OperateFormRule.MapCode[0].required = this.OperateForm.SkuId === 0 // 编辑非必填

      this.$set(this,'ShowModal', true);
        
      this.$nextTick(function() {
        this.OperateForm.SkuId === 0 ? (this.$refs["SkuCode"] as any).focus() : (this.$refs["MapCodeTags"] as any).focus()
      })
   }


    //  打开添加模态框
    private OpenModifyModal():void {
      this.Trigger( new Interface.SkuMapList() );
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ShowModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.MapCodeTags = ""
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((valid:boolean) => {
        if (valid) {

          let PostData: Interface.ModifySkuMap = JSON.parse(JSON.stringify(this.OperateForm))
          PostData.MapCode = (PostData.MapCode as  string[]).join(',')

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Purchase,
            Api: {
              Address: PostData.SkuId === 0 ? this.$Api.SkuMapCreate : this.$Api.SkuMapModify,
              Login: true
            },
            Data: PostData,
            Callback: (Res: PInterface.Res): void => {
              this.$UI.Loading.Hide();
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating('success', PostData.SkuId === 0 ? '添加SKU别名成功' : '编辑SKU别名成功');
                this.ClearModal( 1 );
              } else {
                this.$Request.Error(Res);
              }
            }
          })
        }
      });
    }

    //添加 SKU别名 
    private AddMapCodeTags():void {
      if (this.MapCodeTags !== '') {

        if ( this.MapCodeTags.length > 100 ) {
          this.$UI.Tips.Floating('warning', '请输入长度小于等于100的SKU别名');
          (this.$refs["MapCodeTags"] as any).focus();
          return
        }

        for( let Item of (this.OperateForm.MapCode as  string[]) ) {
          if ( Item === this.addEditInput ) {
            this.$UI.Tips.Floating('warning', '已存在相同别名');
            this.MapCodeTags = ""
            return;
          }
        }

        (this.OperateForm.MapCode as  string[]).push(this.MapCodeTags)
        this.MapCodeTags = ""
      }
    }
    //删除SKU别名小按钮
    private HandleCloseTag(Event: any, Name: string): void {
      const Index: number = Number((this.OperateForm.MapCode as string[]).indexOf(Name));
      (this.OperateForm.MapCode as  string[]).splice(Index, 1);
      (this.$refs["MapCodeTags"] as any).focus();
    }

    private MapCodeTags: string = '' // 别名 标签
    private ShowModal: boolean = false; // 当前模态框
    private OperateForm: Interface.ModifySkuMap = new Interface.ModifySkuMap();  // 表格数据
    private OperateFormRule: any = {
      SkuCode: [{ required:true, message:'请输入SKU编号'}],
      MapCode: [{ required:false, message:'请添加SKU别名', type:'array', trigger:'change'}]
    }
  }


</script>
<style>
.Max-Height-200{
  max-height:200px;
  overflow:auto;
}
</style>