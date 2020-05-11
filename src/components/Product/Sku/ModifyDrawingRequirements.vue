<!-- 添加、编辑组件 -->
<template>
  <div class="P-Inline-Block P-MR-10">
    <Col>
      <Button class="P-MB-10" type="primary" @click="Trigger(0)">添加作图需求</Button>
      <Modal v-model="ShowModal" :title="OperateForm.Id === 0 ? '添加作图需求' : '修改作图需求' " @on-cancel="ClearModal(0)" :mask-closable="false" :width="800">
        <Form :ref="'OperateForm'" :model="OperateForm" :rules="OperateFormRules" name="OperateForm" onsubmit="return false" :label-width="110" v-if="ShowModal">
          <Form-item label="SPU编号：" prop="SpuCodes">
            <Button type="primary" @click="TriggerAddSpu">选择SPU</Button>
          </Form-item>
          <Form-item class="Max-Height-200">
            <Tag 
              type="border" 
              color="default" 
              v-for="Item in OperateForm.SpuCodes" 
              :key="Item" 
              :name="Item" 
              closable 
              @on-close="HandleCloseSpu">
              {{ Item }}
            </Tag>
          </Form-item>
          <Form-item label="SPU编号：">
            <Button type="primary" @click="OpenSkuModal">选择Sku</Button>
          </Form-item>
          <Form-item class="Max-Height-200">
            <Tag 
              type="border" 
              color="default" 
              v-for="Item in OperateForm.SkuCodes" 
              :key="Item" 
              :name="Item" 
              closable 
              @on-close="HandleCloseSku">
              {{ Item }}
            </Tag>
          </Form-item>
          <Form-item label="美工：" prop="OperateUserId">
            <Select v-model="OperateForm.OperateUserId" placeholder="美工" :options="DropOperateUserList" />
            <!-- <Select v-model="OperateForm.OperateUserId" placeholder="美工" filterable clearable>
              <Option v-for="Item in DropOperateUserList" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
            </Select> -->
          </Form-item>
          <Form-item label="期望交图时间：">
            <DatePicker v-model="OperateForm.ExpectTime" type="date" placeholder="期望交图时间" class="P-W-100-Percent" />
          </Form-item>
          <Form-item label="描述：">
            <Input v-model="OperateForm.Description" type="textarea" :rows="4" placeholder="描述" />
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="SubModal(true)">提交美工处理</Button>
          <Button type="primary" @click="SubModal(false)">提交</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </div>
      </Modal>

      <Modal title="选择凸显SKU" v-model="ShowSkuModal" :mask-closable="false" width="800" @on-cancel="CloseSkuModal">
        <Row class="Max-Height-500">
          <Col v-for="(Item, Index) in MainSpu" :key="Index">
            <h3>{{ Item.Name }}：</h3>
            <CheckboxGroup v-model="SkuTags" class="P-MB-10">
              <Checkbox :label="X.SkuCode" class="P-ML-10" v-for="(X, Y) in Item.SkuList" :key="Y"></Checkbox>
            </CheckboxGroup>
          </Col>
        </Row>
        <div slot="footer">
          <Button type="primary" @click="HandleAddSku">添加</Button>
          <Button @click="CloseSkuModal">取消</Button>
        </div>
      </Modal>

      <!-- 选择SKU -->
      <EnableSpu ref="EnableSpu" @handle-res-msg="HandleSpuRes" />

    </Col>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import PInterface from '@/assets/Interface/Public';
  import Interface from "@/assets/Interface/Product";
  import RedisDB from '../../Sales/Store/RedisDB.vue';
  @Component({
    name: 'ModifyDrawingRequirements',
    components: {
      EnableSpu: () => import('@/components/Public/EnableSpu.vue')

    }
  })
  export default class ModifyDrawingRequirements extends Vue {
    @Prop() DropOperateUserList: PInterface.KV[];   // 美工 - 下拉

    @Emit() HandleResMsg(Type:number): void {}

    private Trigger(Id: number):void {
      if ( Id === 0 ) {
        this.$set(this, 'OperateForm', new Interface.DrawingRequirementsModify() );
        this.ShowModal = true
      } else {
        this.GetDetail(Id);
      }
    }

    // 关闭模态框
    private ClearModal(Val:number):void {
      this.ShowModal = false;
      (this as any).$refs["OperateForm"].resetFields();
      this.HandleResMsg(Val);
    }

    private GetDetail(Id: number): void {
      this.$UI.Loading.Show();
      this.$Request.Post({
        Server: this.$Server.Purchase,
        Api: {
          Address: this.$Api.GetRequestDetail,
          Login: true
        },
        Data: Id,
        Callback: (Res: PInterface.Res): void => {
          this.$UI.Loading.Hide();
          if (Res.IsSuccess) {

            this.OperateForm.Id = Res.Data.Data.Id
            for(let Item of Res.Data.Data.SpuList){
              this.OperateForm.SpuCodes.push(Item.SkuCode)
              this.MainSpu.push({
                Id: Item.SkuId,
                Name: Item.SkuCode,
                SkuList: []
              })
            }
            for(var Item of Res.Data.Data.SkuList){
              this.OperateForm.SkuCodes.push(Item.SkuCode)
            }
            this.OperateForm.OperateUserId = Res.Data.Data.OperateUserId
            this.OperateForm.ExpectTime = Res.Data.Data.ExpectTime.indexOf('1900-01-01') > -1 ? "" : Res.Data.Data.ExpectTime
            this.OperateForm.Description = Res.Data.Data.Description

            this.ShowModal = true

          } else {
            this.$Request.Error(Res);
          }
        }
      })
    }

    // 添加SKU
    private TriggerAddSpu(): void {
      (this.$refs['EnableSpu'] as Vue).Trigger();
    }

    // 回调 打开SKU
    private HandleSpuRes(SelectData: PInterface.EnableSku[]): void {
      if (SelectData.length > 0) {
        for (let Item of SelectData) {
          if ( !this.OperateForm.SpuCodes.includes( Item.SkuCode ) ) {
            const NewSpu: Interface.MainSpu = {
              Id: Item.Id,
              Name: Item.SkuCode,
              SkuList: []
            };
            this.MainSpu.push(NewSpu);

            this.OperateForm.SpuCodes.push(Item.SkuCode);
          }
        }
      }
    }

    // 提交模态框
    private SubModal(IsToArtist: boolean):void{
      (this as any).$refs['OperateForm'].validate((valid:boolean) => {
        if (valid) {

          let PostData: Interface.DrawingRequirementsModify = JSON.parse(JSON.stringify(this.OperateForm))

          if( PostData.ExpectTime !== "" ){
            let TimeStamp = Date.parse(new Date().toString()),
             ExpectTimeStamp = Date.parse(PostData.ExpectTime as string)

	        	if(TimeStamp > ExpectTimeStamp){
              this.$UI.Tips.Floating('warning', '期望交图时间不能早于当前时间');
	        		return
	        	}
          }

          PostData.ExpectTime = this.$UI.Render.Date( PostData.ExpectTime, true)
          PostData.IsToArtist = IsToArtist;

          this.$UI.Loading.Show();
          this.$Request.Post({
            Server: this.$Server.Purchase,
            Api: {
              Address: this.$Api.AddOrEditDrawing,
              Login: true
            },
            Data: PostData,
            Callback: (Res: PInterface.Res): void => {
              this.$UI.Loading.Hide();
              if (Res.IsSuccess) {
                this.$UI.Tips.Floating('success', '提交作图需求成功');
                this.ClearModal( 1 );
              } else {
                this.$Request.Error(Res);
              }
            }
          })
        }
      });
    }

    // 删除Spu
    private HandleCloseSpu(Event: any, Name: string): void {
      
      this.OperateForm.SpuCodes.splice(
        0, 
        this.OperateForm.SpuCodes.length,
        ...this.OperateForm.SpuCodes.filter( Item => Item !== Name )
      )

      const Target: Interface.MainSpu[] = this.MainSpu.filter( Item => Item.Name === Name)

      for (let Item of Target[0].SkuList) {
        for (let I = 0; I < this.OperateForm.SkuCodes.length; I++) {
          if ( (Item as Interface.SkuManageList).SkuCode === this.OperateForm.SkuCodes[I] ) {
            this.OperateForm.SkuCodes.splice(I, 1)
            I--
          }
        }
      }

      this.MainSpu.splice(
        0, 
        this.MainSpu.length,
        ...this.MainSpu.filter( Item => Item.Name !== Name )
      )
      
    }

    // 删除Sku
    private HandleCloseSku(Event: any, Name: string): void {
      this.OperateForm.SkuCodes.splice(
        0, 
        this.OperateForm.SkuCodes.length,
        ...this.OperateForm.SkuCodes.filter( Item => Item !== Name )
      )
    }

    // 打开Sku模态框
    private OpenSkuModal(): void {
      if ( this.OperateForm.SpuCodes.length === 0) {
        this.$UI.Tips.Floating('warning', '请先选择SPU再选择凸显SKU');
        return;
      }

      for (let Item of this.MainSpu) {
        Item.SkuList.splice(0)
      }

      this.GetSpuPropertyList()
    }

    // 获取Spu下的凸显Sku
    private GetSpuPropertyList():void {
        this.$UI.Loading.Show();
        this.$Request.Post({
          Server: this.$Server.Purchase,
          Api: {
            Address: this.$Api.SkuGetEnableList,
            Login: true
          },
          Data: {
            "PageIndex": 1,
            "PageSize": 9999,
            "SortField": "",
            "SortOrder": "",
            "Conditions": {
              SearchKey: "", //搜索关键字
              Platfrom: "", //选择平台
              Attribute: "", //选择特性标签
              DevUserId: "", //选择开发员
              Purchaser: "", //选择采购员
              SaleManager: "", //选择销售主管
              DevManager: "", //选择产品经理
              Status: "", //选择状态
              BrandId: "", //选择品牌
              SearchType: "", //选择搜索关键词
              CategoryId: "", //类目ID
              MainId: "",
              PropertyType: 2,
              Spus: this.OperateForm.SpuCodes.join(',')
            }
	        },
          Callback: (Res: PInterface.Res): void => {
            this.$UI.Loading.Hide();
            if (Res.IsSuccess) {
              // 推进MainSpu
              for ( let Sku of Res.Data.PageModel.Items ) {
                for ( let Item of this.MainSpu ) {
                  if ( Sku.MainId === Item.Id )
                    Item.SkuList.push( Sku )
                }
              }

              // 空处理
              for (let Item of this.MainSpu) {
                if( Item.SkuList.length === 0 )
                  (Item.SkuList as object[]).push({ SkuCode: Item.Name })
              }
              
              this.SkuTags.splice(0, this.SkuTags.length, ...this.OperateForm.SkuCodes)

              this.ShowSkuModal = true;

            } else {
              this.$Request.Error(Res);
            }
          }
        })
    }

    // 添加Sku 
    private HandleAddSku(): void {
      this.OperateForm.SkuCodes.splice(
        0,
        this.OperateForm.SkuCodes.length,
        ...this.SkuTags
      )
      this.CloseSkuModal();
    }

    // 关闭 凸显Sku模态框
    private CloseSkuModal(): void{
      this.ShowSkuModal = false
      this.SkuTags.splice(0)
    }

    private SkuTags: string[] = []; // 选择Spu凸显Sku子集

    private MapCodeTags: string = '' // 别名 标签
    private ShowModal: boolean = false; // 当前模态框
    private ShowSkuModal: boolean = false; // 凸显Sku模态框
    private OperateForm: Interface.DrawingRequirementsModify = new Interface.DrawingRequirementsModify();  // 表格数据
    private OperateFormRules: any = {
      SpuCodes: [{ required: true, message: '请选择SPU编号',  trigger: 'blur', type:'array'}],
	    OperateUserId: [{ required: true, message: '请选择美工', trigger: 'change', type: 'number' }]
    }
    private MainSpu: Interface.MainSpu[] = [] // SKU
  
  }


</script>
<style>
.Max-Height-200{
  max-height:200px;
  overflow:auto;
}
.Max-Height-500{
  max-height:500px;
  overflow:auto;
}
</style>