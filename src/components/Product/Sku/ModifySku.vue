<template>
  <Col class="P-Inline-Block">
    <Button class="P-MB-10" type="primary" @click="OpenModal()">添加捆绑SKU</Button>
    <Modal v-model="ShowModal" title="SKU详情" @on-cancel="ClearModal(0)" :mask-closable="false" width='1000' class="Container-Tabs">
      <Form inline :label-width="120" :model="OperateForm" :rules="OperateFormRules" ref="OperateForm"  onsubmit="return false;" name="OperateForm">
        <Tabs name="SkuDetail" type="card" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" >
          <TabPane label="基本信息" name="Base" tab="SkuDetail">
            <Col span="17" class="P-MR-20">
              <Form-item label="产品名：" class="P-W-100-Percent" prop="SkuInformation.SkuName">
                <Input v-model="OperateForm.SkuInformation.SkuName" placeholder="产品名" />
              </Form-item>
              <Form-item label="英文名：" class="P-W-100-Percent" prop="SkuInformation.SkuNameEn">
                <Input v-model="OperateForm.SkuInformation.SkuNameEn" placeholder="英文名" />
              </Form-item>
              <Form-item label="SKU编号：" class="P-W-100-Percent" prop="SkuInformation.SkuCode">
                <Input v-model="OperateForm.SkuInformation.SkuCode" placeholder="SKU编号" />
              </Form-item>
              <Form-item label="特性标签：" class="P-W-100-Percent" prop="SkuAttribute" >
                <Select v-model="OperateForm.SkuAttribute" placeholder="特性标签" multiple :options="DropAttribute" :onChange="ChangeSkuAttribute" transfer />
                <!-- <Select v-model="OperateForm.SkuAttribute" placeholder="特性标签" filterable clearable multiple label-in-value @on-change="ChangeSkuAttribute">
                  <Option v-for="Item in DropAttribute" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="销售关键字：" class="P-W-100-Percent" prop="SkuInformation.SaleKeyWords">
                <Input v-model="OperateForm.SkuInformation.SaleKeyWords" placeholder="SKU编号" />
              </Form-item>
            </Col>
            <Col span="6">
              <div class="demo-upload-list Detail-Picture"  v-if="OperateForm.SkuInformation.DefaultImage !== ''">
                <img :src="`${$Server.File}/${OperateForm.SkuInformation.DefaultImage}`" height="200" width="200">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="ShowPic(OperateForm.SkuInformation.DefaultImage)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="HandleRemove(undefined)"></Icon>
                </div>
              </div>
              <Upload v-else ref="Upload" 
                :show-upload-list="false" 
                :on-success="HandleSuccessSku" 
                :format="['jpg','jpeg','png']" 
                :max-size="2048" 
                :on-format-error="HandleFormatError" 
                :on-exceeded-size="HandleMaxSize" 
                type="drag" 
                :action="UploadImgServer" style="display: inline-block;width: 100%; height: 200px;">
                <div style="height: 200px;">
                  <Icon type="camera" size="20" style="margin-top: 55px;"></Icon>
                  <p>上传图片</p>
                  <span style="padding-bottom: 12px;">仅支持jpg、png图片格式，大小不超过2M</span>
                </div>
              </Upload>
            </Col>
            <Col span="24">
              <Form-item label="品类：" class="P-W-49-Percent" prop="SkuInformation.CategoryId">
                <Cascader placeholder="品类" transfer :data="Tree" v-model="OperateForm.SkuInformation.CategoryId" @on-change="SetCategory" change-on-select filterable  />
              </Form-item>
              <Form-item label="品牌：" class="P-W-49-Percent" prop="SkuInformation.BrandId">
                <Select v-model="OperateForm.SkuInformation.BrandId" placeholder="品牌" :options="DropBrand" transfer/>
                <!-- <Select v-model="OperateForm.SkuInformation.BrandId" placeholder="品牌" filterable clearable>
                  <Option v-for="Item in DropBrand" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="平台：" class="P-W-49-Percent" prop="SkuInformation.Platform">
                <Select placeholder="平台" v-model="OperateForm.SkuInformation.Platform" :options="DropPlatform" transfer/>
                <!-- <Select placeholder="平台" v-model="OperateForm.SkuInformation.Platform" filterable clearable>
                  <Option v-for="(Item, Index) in DropPlatform" :key="Index" :value="$Enums.Sales.Platform[Item]">{{ Item }}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="状态：" class="P-W-49-Percent" prop="SkuInformation.Status">
                <Select placeholder="平台" v-model="OperateForm.SkuInformation.Status" :options="DropStatus" transfer/>
                <!-- <Select placeholder="平台" v-model="OperateForm.SkuInformation.Status" filterable clearable>
                  <Option v-for="(Item, Index) in DropStatus" :key="Index" :value="$Enums.Warehouse.SkuStatus[Item]">{{ Item }}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="产品经理：" class="P-W-49-Percent" prop="SkuInformation.Platform">
                <Select v-model="OperateForm.SkuInformation.DevManager" placeholder="产品经理" :options="DropSaleManager" transfer/>
                <!-- <Select v-model="OperateForm.SkuInformation.DevManager" placeholder="产品经理" filterable clearable>
                  <Option v-for="Item in DropSaleManager" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="采购员：" class="P-W-49-Percent" prop="SkuInformation.Purchaser">
                <Select v-model="OperateForm.SkuInformation.Purchaser" placeholder="采购员" :options="DropPurchaser" transfer/>
                <!-- <Select v-model="OperateForm.SkuInformation.Purchaser" placeholder="采购员" filterable clearable>
                  <Option v-for="Item in DropPurchaser" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="开发员：" class="P-W-49-Percent" v-if="OperateForm.SkuInformation.Id !== 0" prop="SkuInformation.DevUserId">
                {{ OperateForm.SkuInformation.DevUserName }}
              </Form-item>
              <Form-item label="销售主管：" class="P-W-49-Percent" prop="SkuInformation.SaleManager">
                <Select v-model="OperateForm.SkuInformation.SaleManager" placeholder="销售主管" :options="DropSaleManager" transfer/>
                <!-- <Select v-model="OperateForm.SkuInformation.SaleManager" placeholder="销售主管" filterable clearable>
                  <Option v-for="Item in DropSaleManager" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="创建时间：" class="P-W-49-Percent" prop="SkuInformation.CreateTime">
                {{ OperateForm.SkuInformation.Id !== 0 ? OperateForm.SkuInformation.CreateTime.split('T')[0] :  new Date().getFullYear() + '-' + ((new Date().getMonth() +1) > 10 ? (new Date().getMonth() +1) :('0' + (new Date().getMonth() +1))) +'-' + (new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()) }}
              </Form-item>
              <Form-item label="备注：" class="P-W-100-Percent" prop="SkuInformation.Remark">
                <Input type="textarea" :autosize="{minRows:3,maxRows:3}" v-model="OperateForm.SkuInformation.Remark" placeholder="备注" />
              </Form-item>
            </Col>
          </TabPane>
          <TabPane label="产品描述" name="Description" tab="SkuDetail">
            <Row>
              <Col span="24">
                <Jodit ref="EditorDescription" :DomHeight="600"/>
              </Col>
            </Row>
          </TabPane>
          <TabPane label="上架图片" name="Images" tab="SkuDetail">
            <Row>
              <Col span="24" class="Max-Height">
                <div class="demo-upload-list Detail-Picture P-MR-5"  v-for="Item in OperateForm.SkuImages">
                  <img :src="`${$Server.File}/${Item.ImageUrl}`" height="200" width="200">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="ShowPic(Item.ImageUrl)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="HandleRemove(Item.ImageUrl)"></Icon>
                  </div>
                </div>
                <Upload ref="Upload" 
                  :show-upload-list="false" 
                  :on-success="HandleSuccessImages" 
                  :format="['jpg','jpeg','png']" 
                  :max-size="2048" 
                  :on-format-error="HandleFormatError" 
                  :on-exceeded-size="HandleMaxSize" 
                  type="drag" 
                  :action="UploadImgServer" style="display: inline-block; width: 200px;">
                  <div style="height: 200px;width: 200px;">
                    <Icon type="camera" size="20" style="margin-top: 55px;"></Icon>
                    <p>上传图片</p>
                    <span style="padding-bottom: 12px;">仅支持jpg、png图片格式，大小不超过2M</span>
                  </div>
                </Upload>
              </Col>
            </Row>
          </TabPane>
          <Tab-pane label="参考尺寸表" name="Sizes" tab="SkuDetail">
            <Row>
              <Col span="24">
                <Jodit ref="EditorSizes" :DomHeight="600" />
              </Col>
            </Row>
          </Tab-pane>
          <Tab-pane label="体积/重量" name="VolumeWeight" tab="SkuDetail">
            <Row>
              <Col span="24">
                <Form-item label="长（cm）：" class="P-W-30-Percent" prop="SkuInformation.Length">
                  <Input v-model.number="OperateForm.SkuInformation.Length" placeholder="长" />
                </Form-item>
                <Form-item label="宽（cm）："  class="P-W-30-Percent" prop="SkuInformation.Width">
                  <Input v-model.number="OperateForm.SkuInformation.Width" placeholder="宽" />
                </Form-item>
                <Form-item label="高（cm）："  class="P-W-30-Percent" prop="SkuInformation.Height">
                  <Input v-model.number="OperateForm.SkuInformation.Height" placeholder="高" />
                </Form-item>
                
              </Col>
              <Col span="24">
                <Form-item label="毛重（g）："  class="P-W-30-Percent" prop="SkuInformation.GrossWeight">
                  <Input v-model.number="OperateForm.SkuInformation.GrossWeight" placeholder="毛重" />
                </Form-item>
                <Form-item label="净重（g）："  class="P-W-30-Percent" prop="SkuInformation.NetWeight">
                  <Input v-model.number="OperateForm.SkuInformation.NetWeight" placeholder="净重" />
                </Form-item>
                <Form-item label="整箱数："  class="P-W-30-Percent" prop="SkuInformation.Pcs" >
                  <Input v-model.number="OperateForm.SkuInformation.Pcs" placeholder="整箱数" />
                </Form-item>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <Form-item label="备注：" class="P-W-90-Percent" prop="SkuInformation.WeightRemark">
                  <Input v-model="OperateForm.SkuInformation.WeightRemark" type="textarea" :rows="10" placeholder="备注" />
                </Form-item>
              </Col>
            </Row>
          </Tab-pane>
          <Tab-pane label="申报信息" name="Declare" tab="SkuDetail">
            <Form-item label="海关编码：" class="P-W-100-Percent" prop="SkuDeclare.DeclareCode">
              <Input v-model="OperateForm.SkuDeclare.DeclareCode" placeholder="海关编码" /> 
            </Form-item>
            <Form-item label="申报价格：" class="P-W-100-Percent" prop="SkuDeclare.DeclareAmout">
              <Input class="P-W-90-Percent" v-model="OperateForm.SkuDeclare.DeclareAmout" placeholder="申报价格" />&nbsp;&nbsp; USD
            </Form-item>
            <Form-item label="申报中文名称：" class="P-W-100-Percent" prop="SkuDeclare.DeclareNameCN">
              <Input v-model="OperateForm.SkuDeclare.DeclareNameCN" placeholder="申报中文名称" />
            </Form-item>
            <Form-item label="申报英文名称：" class="P-W-100-Percent" prop="SkuDeclare.DeclareName">
              <Input v-model="OperateForm.SkuDeclare.DeclareName" placeholder="申报英文名称" />
            </Form-item>
          </Tab-pane>
          <TabPane  :label="OperateForm.SkuInformation.Id !== 0 && OperateForm.SkuInformation.HasProperty ? '应用变体' : '捆绑SKU'" name="SkuBind" tab="SkuDetail" >
            <Row v-if="OperateForm.SkuInformation.Id !== 0 && OperateForm.SkuInformation.HasProperty" class="Max-Height">
              <div class="Line-Check" v-show="OperateForm.SkuInformation.HasProperty">
                <Checkbox :indeterminate="Indeterminate" :value="CheckAll" @click.prevent.native="HandleCheckAll">全选</Checkbox>
              </div>
              <Checkbox-group v-model="CheckAllGroup" @on-change="CheckAllGroupChange">
                <Checkbox v-for="(Item, Index) in SkuProperty" :label="Item.Id" :key="Item.SkuName" class="P-W-30-Percent">{{ Item.SkuName }}</Checkbox>
              </Checkbox-group>
              <p v-show="!OperateForm.SkuInformation.HasProperty">暂无变体</p>
            </Row>
            <Row v-else>
              <Table :columns="Col" :data="OperateForm.SkuBind" size="small" stripe :height="550" />
            </Row>
            <Row class="P-MT-10" type="flex" justify="end" v-if="!( OperateForm.SkuInformation.Id !== 0 && OperateForm.SkuInformation.HasProperty)">
              <Button type="primary" @click="TriggerAddBind()">添加SKU</Button>
            </Row>
          </TabPane>
        </Tabs>
      </Form>
      <!-- 放大图片 -->
      <ShowBigPic ref="ShowBigPic" />
      <!-- 添加SKU -->
      <EnableSku ref="EnableSku" @handle-res-msg="HandleSkuRes" />
      <footer slot="footer">
        <Button type="primary" @click="SubModal()">提交</Button>
        <Button @click="ClearModal(0)">返回</Button>
      </footer>
    </Modal>
  </Col>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Interface from "@/assets/Interface/Product";
import PInterface from "@/assets/Interface/Public";
@Component({
  name: "SkuDetail",
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    Jodit: () => import('@/components/Public/Jodit.vue'),
    EnableSku: () => import('@/components/Public/EnableSku.vue')
  }
})
export default class SkuDetail extends Vue {
  @Prop() Tree: PInterface.ProductCagtegoryTree[];   // 品类树
  @Prop() DropAttribute: PInterface.KV[];   // 特性标签 - 下拉
  @Prop() DropPurchaser: PInterface.KV[];   // 采购员 - 下拉
  @Prop() DropDevManager: PInterface.KV[];   // 开发经理 - 下拉
  @Prop() DropSaleManager: PInterface.KV[];   // 销售经理 - 下拉
  @Prop() DropBrand: PInterface.KV[];   // 品牌 - 下拉

  @Emit() HandleResMsg(Type: number): void {}

  // 编辑模态框
  private Trigger(Selected: Interface.SkuManageList[]):void {
    if (Selected.length > 0) {
      this.GetSkuDetails(Selected[0].Id)
    }
  }

  // 打开模态框
  private OpenModal():void {
    this.ShowModal = true;
  }

  // 切换tab页
  private ChangeTabs(Val: string) {
    this.ActiveTab = Val;
  }

  // 获取SKU信息
  private GetSkuDetails(Id: number): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuInfo,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this.OperateForm, 'SkuInformation', Res.Data.Data);

          // 参考尺寸
          (this.$refs["EditorSizes"] as any).SetContent(this.OperateForm.SkuInformation.Sizes); 
          // 描述
          (this.$refs["EditorDescription"] as any).SetContent(this.OperateForm.SkuInformation.Description); 

          // 品类
          const CategoryId:number = JSON.parse(JSON.stringify(this.OperateForm.SkuInformation.CategoryId));

          this.OperateForm.SkuInformation.CategoryId = [];
          ( this.OperateForm.SkuInformation.CategoryId as Array<string> ).unshift( CategoryId.toString() )
          this.FindParentIds(this.Tree, CategoryId)

          // 特性标签
          this.GetSkuAttribute( this.OperateForm.SkuInformation.Id )
          // 申报信息
          this.GetSkuDeclare( this.OperateForm.SkuInformation.Id )
          // 上架图片
          this.GetSkuImage( this.OperateForm.SkuInformation.Id )
          // 若有SKU变体，获取SKU变体，否则获取捆绑SKU
          if (Res.Data.Data.HasProperty) {
            this.GetSkuProperty(this.OperateForm.SkuInformation.Id);
          } else {
            this.GetBindSku(this.OperateForm.SkuInformation.Id)
          }

          this.ShowModal = true; 

        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  // 组合 品类数组
  private FindParentIds(Tree: PInterface.ProductCagtegoryTree[], NodeId: number): void {
    for (let Item in Tree) {
      if (Tree[Item].Id == NodeId) {
        (this.OperateForm.SkuInformation.CategoryId as Array<string> ).unshift( Tree[Item].ParentId.toString() );
        if (Tree[Item].ParentId != 0) {
          this.FindParentIds( this.CagtegoryTree , Number(Tree[Item].ParentId))
        }
      } else {
        this.FindParentIds(Tree[Item].ChildNodes, NodeId)
      }
    }
  }

  // 品类 值获取
  private SetCategory(Data: string[]): void {
    ( this.OperateForm.SkuInformation.CategoryId as number[] ).splice(0, ( this.OperateForm.SkuInformation.CategoryId as number[] ).length, ...Data.map( Item => Number(Item) ) )
  }

  // 获取特性标签
  private GetSkuAttribute(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuAttribute,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.OperateForm.SkuAttribute.splice(0, this.OperateForm.SkuAttribute.length)
          this.EditAttribute = Res.Data.Data.map((Item: Interface.SkuAttribute) => {
            ( this.OperateForm.SkuAttribute as number[] ).push(Number(Item.AttributeId));
            return {
              value: Item.AttributeId,
              label: Item.AttributeName
            }
          });
          
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取上架图片
  private GetSkuImage(Id: number): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuImages,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.OperateForm.SkuImages.splice(0, this.OperateForm.SkuImages.length, ...Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  // 获取申报信息
  private GetSkuDeclare(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuDeclare,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this.OperateForm, 'SkuDeclare', Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取当前SKU变体
  private GetSkuProperty(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuProperty,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.SkuProperty.splice(0, this.SkuProperty.length, ...Res.Data.Data)
          this.CheckAllGroup = this.SkuProperty.map(Item => Item.Id)
          this.Indeterminate = false;
          this.CheckAll = true;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取捆绑SKU
  private GetBindSku(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetSkuBind,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.OperateForm.SkuBind.splice(0, this.OperateForm.SkuBind.length, ...Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.ShowModal = false;
    this.OperateForm = new Interface.SkuDetails();
    ( this.$refs['OperateForm'] as Vue ).resetFields();
    this.ActiveTab = "Base";
    this.EditAttribute = [];
    this.SkuProperty = [];
    (this.$refs["EditorSizes"] as any).SetContent(""); // 参考尺寸 清空文本框
    (this.$refs["EditorDescription"] as any).SetContent(""); // 描述 清空文本框
    this.HandleResMsg(Val)
  }

  // 检查SKU内容
  private SubModal(): void{
    ( this.$refs['OperateForm'] as Vue ).validate((Valid: boolean): void => {
      if (Valid) {
        this.ArrangeSkuMessage();
      } else {
        this.$UI.Tips.Floating('warning', '请输入必填项');
      }
    })
  }
  
  // 整合SKU信息
  private ArrangeSkuMessage(): void {

    let PostData: any = {
      Sku: JSON.parse(JSON.stringify( this.OperateForm.SkuInformation  )),
      SkuAttribute: [],
      SkuImage: JSON.parse(JSON.stringify( this.OperateForm.SkuImages  )),
      SkuMap: [],
      SkuDeclare: JSON.parse(JSON.stringify( this.OperateForm.SkuDeclare  )),
      SkuPropertyId: [],
      SkuBind: JSON.parse(JSON.stringify( this.OperateForm.SkuBind )),
    }
    //默认图片整理
    if ( PostData.Sku.DefaultImage === "" ) {
      this.$UI.Tips.Floating('warning', '请上传默认图片');
      return;
    }

    // 捆绑SKU
    if ( PostData.Sku.Id === 0 ) {
      if ( PostData.SkuBind.length === 0 ) {
        this.$UI.Tips.Floating('warning', '请添加捆绑SKU');
        return;
      } else {
        let Sum = 0;
        for (let Item of PostData.SkuBind) {
          Sum += Item.Quantity;
        }
        if (Sum < 2) {
          this.$UI.Tips.Floating('warning', '捆绑SKU数量总和需大于或等于2');
          return;
        }
      }
    }

    if ( PostData.Sku.Id !== 0 && PostData.SkuBind.length > 0 ) {
      let Sum = 0;
      for (let Item of PostData.SkuBind) {
        Sum += Item.Quantity;
      }
      if (Sum < 2) {
        this.$UI.Tips.Floating('warning', '捆绑SKU数量总和需大于或等于2');
        return;
      }
    }

    // 描述 - 参考尺寸
    PostData.Sku.Description = (this.$refs["EditorDescription"] as any).GetContent();
    PostData.Sku.Sizes = (this.$refs["EditorSizes"] as any).GetContent();
    
    // 品类
    const Category = PostData.Sku.CategoryId;
    PostData.Sku.CategoryId = Number( Category[Category.length - 1] )

    // 特性标签
    PostData.SkuAttribute = [];
    PostData.SkuAttribute.push(...this.EditAttribute.map(Item => {
      return {
        SkuId: PostData.Sku.Id,
        AttributeId: Item.value,
        AttributeName: Item.label
      }
    }));

    // 变体
    PostData.SkuPropertyId.splice(0, PostData.SkuPropertyId.legnth, ...this.CheckAllGroup);

    // 捆绑SKU 开发员为创建人
    PostData.Sku.DevUserId = Number(JSON.parse(this.$Cookie.Get('frler_user')).UserId)

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: PostData.Sku.Id === 0 ? this.$Api.SkuCreate : this.$Api.SkuModify,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', PostData.Sku.Id === 0 ? '添加捆绑SKU成功' : '编辑SKU成功');
          this.ClearModal(1)
        } else {
          this.$Request.Error(Res);
        }
      }
    })

  }

  // 上传图片成功 - Sku图片
  private HandleSuccessSku(Res: any, File: any) {
    if (Res.IsSuccess == true) {
       this.OperateForm.SkuInformation.DefaultImage = Res.Data.Url;
    } else {
      this.$Request.Error(Res);
    }
  }
  // 上传图片成功 - 上架图片
  private HandleSuccessImages(Res: any, File: any) {
    if (Res.IsSuccess == true) {
      this.OperateForm.SkuImages.push( new Interface.SkuImages() )
      this.OperateForm.SkuImages[this.OperateForm.SkuImages.length - 1]['ImageUrl'] = Res.Data.Url;
      this.OperateForm.SkuImages[this.OperateForm.SkuImages.length - 1]['SkuId'] = this.OperateForm.SkuInformation.Id;
    } else {
      this.$Request.Error(Res);
    }
  }
  // 验证上传图片
  private HandleFormatError(File: any):void {
    this.$Notice.warning({
      title: '文件格式不正确',
      desc: `文件${File.name}格式不正确，请上传 jpg、 png 或 jpeg 格式的图片。`
    });
  }
  // 验证上传图片
  private HandleMaxSize(File: any):void {
    this.$Notice.warning({
      title: '超出文件大小限制',
      desc: `文件${File.name}太大，不能超过 2M。`
    }); 
  }

  // 删除上传图片 
  private HandleRemove(Url?: string):void {
    if (Url === undefined) {
      this.$set(this.OperateForm.SkuInformation, 'DefaultImage', "")
    } else {
      for(let I = 0; I < this.OperateForm.SkuImages.length; I++) {
        if (this.OperateForm.SkuImages[I].ImageUrl === Url) this.OperateForm.SkuImages.splice(I, 1)
      }
    }
  }

  // 全选变体
  private HandleCheckAll(): void {
    if (this.Indeterminate) {
      this.CheckAll = false;
    } else {
      this.CheckAll = !this.CheckAll;
    }
    this.Indeterminate = false;
    if (this.CheckAll) {
      this.CheckAllGroup = this.SkuProperty.map(Item => Item.Id)
    } else {
      this.CheckAllGroup = [];
    }
  }

  // 全选变体样式
  private CheckAllGroupChange(Data: any): void {
    if (Data.length === this.SkuProperty.length) {
      this.Indeterminate = false;
      this.CheckAll = true;
    } else if (Data.length > 0) {
      this.Indeterminate = true;
      this.CheckAll = false;
    } else {
      this.Indeterminate = false;
      this.CheckAll = false;
      this.CheckAllGroup = [];
    }
  }

  // 特性标签
  private ChangeSkuAttribute(Data: any): void {
    this.EditAttribute = Data;
  }

  // 添加SKU
  private TriggerAddBind(): void {
    (this.$refs['EnableSku'] as Vue).Trigger(false);
  }

  // 回调 打开SKU
  private HandleSkuRes(SelectData: PInterface.EnableSku[]): void {
    this.OperateForm.SkuBind.push(...SelectData.map((Item: PInterface.EnableSku): Interface.SkuBind => {
      return {
        SkuId: Item.Id,
        SkuCode: Item.SkuCode,
        SkuName: Item.SkuName,
        DefaultImage: Item.DefaultImage,
        Quantity: 1
      }
    }))
    let Length = this.OperateForm.SkuBind.length;
    for (let I = 0; I < Length; I++) {
      for (let J = (I + 1); J < Length; J++) {
        if (this.OperateForm.SkuBind[I].SkuCode === this.OperateForm.SkuBind[J].SkuCode) {
          this.OperateForm.SkuBind.splice(J, 1);
          Length--;
          J--;
        }
      }
    }

  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }

  private ShowModal: boolean = false;  //模态框

  private ActiveTab: string = "Base"; //tab索引值

  private UploadImgServer:string = this.$Server.Settings + this.$Api.UploadImage //上传图片服务器 接口

  private SkuProperty: Interface.SkuProperty[] = []; // SKU变体

  private Indeterminate: boolean = true; // 控制变体数据
  private CheckAll: boolean = false;     // 变体全选
  private CheckAllGroup: number[] = []    // 变体组

  private EditAttribute: any[] = [] // On-Select 特性标签 临时存放

  private DropPlatform: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform); // 平台
  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.SkuStatus); // 状态枚举下拉
 
  private OperateForm: Interface.SkuDetails = new Interface.SkuDetails() // SKU详情
  private OperateFormRules: any = {
    'SkuInformation.SkuCode': [{ required: true, message: '请输入SKU编号', trigger: 'blur' }],
    'SkuInformation.SkuName': [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
    'SkuInformation.CategoryId': [{ type: 'array', required: true, message: '请选择所属品类', trigger: 'change' }],
    'SkuInformation.Platform': [{ type: 'number', required: true, message: '请选择平台', trigger: 'change' }],
    'SkuInformation.DevManager': [{ type: 'number', required: true, message: '请选择开发主管', trigger: 'change' }],
    'SkuInformation.DevUserId': [{ type: 'number', required: true, message: '请选择开发员', trigger: 'blur' }],
    'SkuInformation.SaleManager': [{ type: 'number', required: true, message: '请选择销售主管', trigger: 'change' }],
    'SkuInformation.Purchaser': [{ type: 'number', required: true, message: '请选择采购员', trigger: 'change' }],
    'SkuInformation.Length': [{ type: 'number', required: true, message: '请输入长度', trigger: 'blur' }],
    'SkuInformation.Width': [{ type: 'number', required: true, message: '请输入宽度', trigger: 'blur' }],
    'SkuInformation.Height': [{ type: 'number', required: true, message: '请输入高度', trigger: 'blur' }],
    'SkuInformation.GrossWeight': [{ type: 'number', required: true, message: '请输入毛重', trigger: 'blur' }],
    'SkuInformation.NetWeight': [{ type: 'number', required: true, message: '请输入净重', trigger: 'blur' }],
    'SkuDeclare.DeclareAmout': [{ type: 'number', required: true, message: '请输入申报价值', trigger: 'blur' }],
    'SkuDeclare.DeclareNameCN': [{ required: true, message: '请输入申报中文名称', trigger: 'blur' }],
    'SkuDeclare.DeclareName': [{ required: true, message: '请输入申报英文名称', trigger: 'blur' }],
    'SkuAttribute': [{ type: 'array', required: true, message: '请选择特性标签', trigger: 'change' }],
    'SkuInformation.Status': [{ required: true, message: '请选择状态', trigger: 'change', type: 'number' }]
  }

  // 表头
  private Col: PInterface.TableCol[] = [
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + params.row.DefaultImage + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.ShowPic(params.row.DefaultImage)
            }
          }
        })
      }
    },
    { title: "SKU编号", key: "SkuCode", width: 150},
    { title: '名称', key: "SkuName", render: (h: any, params: any): string => {
      return h('Tooltip', {
        props: {
          'content': (params.row as any).SkuName,
          'maxWidth': 200
        },
        class: 'P-W-100-Percent'
      }, [
        h('p', (params.row as any).SkuName )
      ])
    }},
    { title: "数量", key: "Quantity", width: 120, render: (h: any, Params: any): string => {
      return h('InputNumber', {
        props: {
          'min': 0,
          'value': Params.row.Quantity
        },
        on: {
          input: (Val: number) => {
            this.OperateForm.SkuBind[Params.row._index].Quantity = Val
          }
        }
      })
    }},
    { title: '操作', width: 80, render: (h: any, Params: any): string => {
      return h('Button', {
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: () => {
            this.OperateForm.SkuBind.splice(Params.row._index, 1);
          }
        }
      }, '删除')
    }}
  ];

}
</script>

<style lang="less">
.Max-Height {
  max-height: 600px;
  overflow: auto;
}
.Max-Height-550 {
  max-height: 550px;
  overflow: auto;
}
.Line-Check{
  border-bottom: 1px solid #e9e9e9;
  padding-bottom:6px;
  margin-bottom:6px;
}
.Table-Title {
  text-align: center;
  width: 100%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #dddee1;
  border-bottom: 0px;
  font-size: 14px;
  font-weight: bolder;
}
.Cont-Wrap{
  border: 1px solid #dddee1;
  overflow: auto;
  .Cont-Title{
    line-height: 38px;
    height: 32px;
    border: 0;
    text-align: center;
    padding: 1px 6px;
    font-size: 14px;
    font-weight: bolder;
    background-color: #f7f7f8;
  }
  .Cont-Body {
    padding:12px 24px
  }
}
.Detail-Picture{
  width: 200px;
  height: 200px;
  display: inline-block;
  position: relative;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
  width: 200px;
  height: 200px;
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: -webkit-flex;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 200px;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
</style>
