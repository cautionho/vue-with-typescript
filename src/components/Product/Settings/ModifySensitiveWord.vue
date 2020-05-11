<!-- 组织添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button type="primary" @click="OpenModifyModal">添加</Button>
      <Modal v-model="ShowModal" :title="OperateForm.Id === 0 ? '添加敏感词' : '编辑敏感词' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRule" name="OperateForm" onsubmit="return false" :label-width="110" v-if="ShowModal">
          <Form-item label="类型：" prop="Type" >
            <Select v-model="OperateForm.Type" placeholder="类型" :options="DropLangType" />
            <!-- <Select v-model="OperateForm.Type" name="Type" placeholder="类型" filterable clearable>
              <Option v-for="(Item, Index) in DropLangType" :key="Index" :value="$Enums.Public.Lang[Item]">{{Item}}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="敏感词：" prop="KeyWord">
            <Input v-model="OperateForm.KeyWord" placeholder="敏感词" name="KeyWord" />
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
    name: 'ModifySensitiveWord'
  })
  export default class ModifySensitiveWord extends Vue {
    @Emit() HandleResMsg(Type:number): void {}

    private Trigger(Selected: Interface.SensitiveWordList[]): void {
      this.$set(this, 'OperateForm', Selected.length > 0 ? JSON.parse(JSON.stringify(Selected[0])) : new Interface.SensitiveWordList());
      this.$set(this,'ShowModal', true);
    }

    // 回调打开添加模态框
    private OpenModifyModal():void {
      this.HandleResMsg(2);
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.$set(this, 'ShowModal', false);
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    // 提交模态框
    private SubModal():void{
      (this as any).$refs['OperateForm'].validate((valid:boolean) => {
        if (valid) {
          
          const PostData: any = JSON.parse(JSON.stringify(this.OperateForm));
          if (PostData.Id === -1) {
            delete PostData.Id
            delete PostData.IsEnable
          } else {
            PostData.Id += 1
          }

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Purchase,
            Api: {
              Address: PostData.Id === undefined ? this.$Api.SensitiveAdd : this.$Api.SensitiveModify,
              Login: true
            },
            Data: PostData,
            Callback: (res: PInterface.Res): void => {
              if (res.IsSuccess) {
                this.$UI.Tips.Floating('success', PostData.Id === undefined ? '添加敏感词成功' : '编辑敏感词成功');
                this.ClearModal( 1 );
              } else {
                this.$Request.Error(res);
              }
            }
          })
        }
      });
    }

    private DropLangType: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Lang) // 类型
    private ShowModal: boolean = false; // 当前模态框
    private OperateForm: Interface.SensitiveWordSearch = new Interface.SensitiveWordSearch();  // 表格数据
    private OperateFormRule: any = {
      KeyWord: [{required: true, message: '请输入敏感词' }],
      Type: [{required: true, message: '请选择类型', trigger: 'change', type: 'number' }]
    }
  }


</script>