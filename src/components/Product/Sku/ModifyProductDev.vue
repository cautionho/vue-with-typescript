<template>
  <Row class="P-Inline-Block P-MB-10">
    <Col>
      <Button class="P-MR-10" type="primary" @click="HandleResMsg(2)">添加新品</Button>
      <Modal v-model="ShowModal" title="新品详情" @on-cancel="ClearModal(0)" :mask-closable="false" width='1000' class="Container-Tabs">
        <Row class="P-MB-5" v-if="ModifyStatus" style="margin-bottom:6px;">
          <p>开发日期：{{ProductDevDetails.CreateTime.split('T')[0]}}</p>
        </Row>
        <Row>
          <Tabs name="ProductDev" type="card" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" >
            <TabPane label="基本信息" name="Base" tab="ProductDev">
              <Form inline :label-width="100" :model="ProductDevDetails" ref="ProductDevDetails" :rules="ProductDevRules" onsubmit="return false;" name="ProductDevDetails">
                <Col span="17" class="P-MR-20">
                  <Form-item label="产品名：" prop="ProductName" class="P-W-100-Percent">
                    <Input v-model="ProductDevDetails.ProductName" placeholder="产品名" v-if="ModifyStatus" name="proNameInput"></Input>
                    <span v-else>{{ ProductDevDetails.ProductName }}</span>
                  </Form-item>
                  <Form-item label="销售关键字：" prop="SaleKeyWord" class="P-W-100-Percent" >
                    <Input v-model="ProductDevDetails.SaleKeyWord" placeholder="销售关键字" v-if="ModifyStatus"></Input>
                    <span v-else>{{ ProductDevDetails.SaleKeyWord }}</span>
                  </Form-item>
                  <Form-item label="特性标签："  prop="Attribute" class="P-W-100-Percent">
                    <Select multiple v-model="ProductDevDetails.Attribute" placeholder="特性标签" v-if="ModifyStatus" :options="DropAttribute" transfer />
                    <!-- <Select multiple v-model="ProductDevDetails.Attribute" placeholder="特性标签" v-if="ModifyStatus">
                      <Option v-for="Item in DropAttribute" :value="Item.Value" :key="Item.Key">{{Item.Key}}</Option>
                    </Select> -->
                    <span v-else>{{ ProductDevDetails.AttributeName }}</span>
                  </Form-item>
                  <Form-item label="品类：" prop="CategoryId" class="P-W-300">
                    <Cascader transfer :data="Tree" v-model="ProductDevDetails.CategoryId" @on-change="SetCategory" change-on-select filterable placeholder="品类" v-if="ModifyStatus"></Cascader>
                    <span v-else>{{ ProductDevDetails.CategoryName }}</span>
                  </Form-item>
                  <Form-item label="平台：" prop="Platfrom" class="P-W-300">
                    <Select v-model="ProductDevDetails.Platfrom" placeholder="平台" v-if="ModifyStatus" :options="DropPlatform" transfer />
                    <!-- <Select v-model="ProductDevDetails.Platfrom" placeholder="平台" v-if="ModifyStatus">
                      <Option v-for="(Item, Index) in DropPlatform" :key="Index" :value="$Enums.Sales.Platform[Item]">{{ Item }}</Option>
                    </Select> -->
                    <span v-else>{{ $Enums.Sales.Platform[ProductDevDetails.Platfrom] }}</span>
                  </Form-item>
                  <Form-item label="产品经理：" prop="DevManager" class="P-W-300">
                    <Select v-model="ProductDevDetails.DevManager" placeholder="产品经理" v-if="ModifyStatus" :options="DropDevManager" transfer />
                    <!-- <Select v-model="ProductDevDetails.DevManager" placeholder="产品经理" v-if="ModifyStatus">
                      <Option v-for="Item in DropDevManager" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                    </Select> -->
                    <span v-else>{{ ProductDevDetails.DevMangerName}}</span>
                  </Form-item>
                  <Form-item label="销售主管：" prop="SaleManager" class="P-W-300">
                    <Select v-model="ProductDevDetails.SaleManager" placeholder="销售主管" v-if="ModifyStatus" :options="DropSaleManager" transfer />
                    <!-- <Select v-model="ProductDevDetails.SaleManager" placeholder="销售主管" v-if="ModifyStatus">
                      <Option v-for="Item in DropSaleManager" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                    </Select> -->
                    <span v-else>{{ ProductDevDetails.SaleManagerName }}</span>
                  </Form-item>
                  <Form-item label="重量：" prop="Weight" class="P-W-300">
                    <InputNumber :min="0" v-model="ProductDevDetails.Weight" placeholder="重量" class="P-W-100-Percent" v-if="ModifyStatus"></InputNumber>
                    <span v-else>{{ ProductDevDetails.Weight }}</span>
                  </Form-item>
                  <Form-item label="SKU序号：" prop="CategoryNum" class="P-W-300">
                    <Input v-model="ProductDevDetails.CategoryNum" placeholder="SKU序号" v-if="ModifyStatus"></Input>
                    <span v-else>{{ ProductDevDetails.CategoryNum }}</span>
                  </Form-item>
                  <Form-item label="开发员：" prop="Creator" class="P-W-300">
                    <Select v-model="ProductDevDetails.Creator" placeholder="请选择开发员" v-if="ModifyStatus" :options="DropDevUser" transfer />
                    <!-- <Select v-model="ProductDevDetails.Creator" placement="top" placeholder="请选择开发员" v-if="ModifyStatus">
                      <Option v-for="Item in DropDevUser" :key="Item.Value" :value="Item.Value">{{ Item.Key }}</Option>
                    </Select> -->
                    <span v-else>{{ ProductDevDetails.CreatorName }}</span>
                  </Form-item>
                </Col>
                <!-- 上传图片 -->
                <Col span="6" class="P-TA-C">
                  <div class="demo-upload-list" style="width:200px; height:200px;" v-if="ProductDevDetails.ImageUrl !== ''">
                    <img :src="`${$Server.File}/${ProductDevDetails.ImageUrl}`" height="200" width="200">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="ShowPic(ProductDevDetails.ImageUrl)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="HandleRemove" v-if="ModifyStatus"></Icon>
                    </div>
                  </div>
                  <Upload v-else ref="Upload" 
                    :show-upload-list="false" 
                    :on-success="HandleSuccess" 
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
                  <Form-item label="备注：" prop="Remark" class="P-W-100-Percent">
                    <Input type="textarea" :autosize="{minRows:4,maxRows:4}" v-model="ProductDevDetails.Remark" placeholder="备注" v-if="ModifyStatus"></Input>
                    <span v-else>{{ProductDevDetails.Remark}}</span>
                  </Form-item>
                  <Form-item label="审核备注：" prop="Remark" class="P-W-100-Percent" v-if="IsReview">
                    <Input type="textarea" :autosize="{minRows:4,maxRows:4}" v-model="ReviewRemark" placeholder="审核备注"></Input>
                  </Form-item>
                </Col>
              </Form>
            </TabPane>
            <TabPane label="供应商" name="Supply" tab="ProductDev">
              <Row>
                <Table :columns="SupplyDataCol" :data="ProductSupplyInfo" size="small" stripe :height="150"></Table>
              </Row>
              <Row class="P-MT-10 P-TA-R" v-if="ModifyStatus">
                <Button type="primary" class="P-MR-5" @click="AddSupplier">添加供应商</Button>
                <Button type="primary" @click="AddLine('Supply')">添加一行</Button>
              </Row>
              <Row class="P-MT-10">
                <Table :columns="ProfitDataCols" :data="[ProfitData]" size="small" stripe :height="76"></Table>
              </Row>
              <Row class="P-MT-10">
                <Table :columns="MatchCols" :data="ProductMatch" size="small" stripe :height="150"></Table>
              </Row>
              <Row class="P-MT-10 P-TA-R" v-if="ModifyStatus">
                <Button type="primary" @click="AddLine('Match')">添加一行</Button>
              </Row>
            </TabPane>
            <TabPane label="新品属性" name="Property" tab="ProductDev">
              <!-- 新品属性 -->
              <div class="Cont-Wrap">
                <div class="Cont-Title">
                  新品属性
                </div>
                <div class="Cont-Body">
                  <p class="P-TA-C" v-if="ProductProperty.length === 0">暂无新品属性</p>
                  <div v-else>
                    <Tag type="dot" :closable="ModifyStatus" color="primary" :key="Item.PropertyName" v-for="(Item, Index) in ProductProperty" @on-close="ClosePropertyTag('ProductProperty', Index)">{{Item.PropertyName}}</Tag>
                  </div>
                  <div class="P-MT-10" v-if="ModifyStatus">
                    <Input v-model="AddPropertyName" @on-enter="AddPropertyTag('ProductProperty')" placeholder="新品属性">
                      <Button slot="append" @click="AddPropertyTag('ProductProperty')">添加</Button>
                    </Input>
                  </div>
                </div> 
              </div>
              <div class="Cont-Wrap P-MT-10">
                <div class="Cont-Title">
                  属性信息
                </div>
                <div class="Cont-Body">
                  <p class="P-TA-C" v-if="ProductProperty.length === 0">暂无属性信息</p>
                  <div v-else>
                    <Form :label-width="80" class="P-MT-5" onsubmit="return false;">
                      <Form-item class="P-MB-10" v-for="(Item, Index) in ProductProperty" :label="Item.PropertyName+'：'" :key="Item.PropertyName">
                        <Tag class="P-MB-5" type="dot" :closable="ModifyStatus" color="primary" v-for="(It, Idx) in Item.PropertyValue" :key="It.PropertValue" @on-close="ClosePropertyTag('PropertyValue', Index, Idx)" >{{It.PropertValue}}</Tag>
                        <Input v-model="AddPropertyValue[Index]" @on-enter="AddPropertyTag('PropertyValue', Index)" placeholder="新品属性值" v-if="ModifyStatus">
                          <Button slot="append" @click="AddPropertyTag('PropertyValue', Index)">添加</Button>
                        </Input>
                      </Form-item>
                    </Form>
                  </div>
                </div> 
              </div>
            </TabPane>
            <TabPane label="审核信息" name="Review" v-if="!ModifyStatus">
              <Table :columns="ReviewCol" :data="ReviewList" size="small" stripe :height="400"></Table>
            </TabPane>

          </Tabs>
        </Row>
        <!-- 放大图片 -->
        <ShowBigPic ref="ShowBigPic" />
        <!-- 选择供应商 -->
        <EnableSupplier 
          ref="EnableSupplier" 
          :AddCityList="CityTrees"
          @emit-eable-supplier="CloseEnableSupplier" 
        />
        <!-- 添加供应商 -->
        <ModifySupplier 
          :TriggerModifySupplier="TriggerModifySupplier" 
          :IsEdit='[]' 
          :AreaTree="CityTrees" 
          @emit-supplier="HandleResSupplier" 
        />

        <footer slot="footer" v-if="ModifyStatus">
          <Button @click="ArrangeProductData(true)">提交审核</Button>
          <Button type="primary" @click="ArrangeProductData(false)">{{ SelecData.length === 0 ? '添加':'修改'}}</Button>
          <Button @click="ClearModal(0)">取消</Button>
        </footer>
        <footer slot="footer" v-if="IsReview || !ModifyStatus">
          <Button type="primary" v-if="IsReview" @click="ReviewProductDev(1)">通过</Button>
          <Button type="primary" v-if="IsReview" @click="ReviewProductDev(2)">不通过</Button>
          <Button type="primary" v-if="IsReview" @click="ReviewProductDev(3)">退回修改</Button>
          <Button @click="ClearModal(0)">{{ IsReview ? '取消' : '返回' }}</Button>
        </footer>
      </Modal>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Interface from "@/assets/Interface/Product";
import PInterface from "@/assets/Interface/Public";
@Component({
  name: "ModifyProductDev",
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
    EnableSupplier: () => import('@/components/Public/EnableSupplier.vue'),
    ModifySupplier: () => import('@/components/Purchase/Supply/ModifySupplier.vue')
  }
})
export default class ModifyProductDev extends Vue {

  @Emit() HandleResMsg(Type: number): void {}

  // 打开模态框
  private async Trigger({
    SelectedData,
    DropAttribute,
    DropDevUser,
    DropDevManager,
    DropSaleManager,
    ModifyStatus,
    Tree,
    IsReview
  }: {
    SelectedData: Interface.ProductDevList[],
    DropAttribute: PInterface.KV[], // 特性标签下拉
    DropDevUser: PInterface.KV[],  // 开发员下拉
    DropDevManager: PInterface.KV[], // 产品经理下拉
    DropSaleManager: PInterface.KV[], // 销售主管下拉
    Tree: PInterface.ProductCagtegoryTree[],
    ModifyStatus: boolean,
    IsReview: boolean
  }): Promise<void> {
    
    this.DropAttribute.splice(0, this.DropAttribute.length, ...DropAttribute);
    this.DropDevUser.splice(0, this.DropDevUser.length, ...DropDevUser);
    this.DropDevManager.splice(0, this.DropDevManager.length, ...DropDevManager);
    this.DropSaleManager.splice(0, this.DropSaleManager.length, ...DropSaleManager);
    this.Tree.splice(0, this.Tree.length, ...Tree);
    
    this.ActiveTab = "Base"
    this.ModifyStatus = ModifyStatus
    this.$set(this.ModifyStatusObj, 'Boolean', ModifyStatus)
    this.IsReview = IsReview

    this.ChangeTableCols(this.ModifyStatus)

    if (SelectedData.length > 0) {
      this.SelecData.splice(0, this.SelecData.length, ...SelectedData);
      await this.GetProductDevInfo( this.SelecData[0].Id );
      await this.GetProductAttribute( this.SelecData[0].Id );
      await this.GetProperty( this.SelecData[0].Id );
      await this.GetSupplyInfo( this.SelecData[0].Id );
      await this.GetMatchIfo( this.SelecData[0].Id );
      await this.GetReviewHistory( this.SelecData[0].Id );
    } else {
      this.$set(this, 'ProductDevDetails', new Interface.ProductDevDetails() );
      this.$set(this, 'ProductAttribute', new Interface.ProductAttribute() );
      this.$set(this, 'ProfitData', new Interface.ProfitData() );
      
      this.ProductSupplyInfo.splice(0, this.ProductSupplyInfo.length);
      this.ProductMatch.splice(0, this.ProductMatch.length);
      this.ProductProperty.splice(0, this.ProductProperty.length);

      this.ProductSupplyInfo.push( new Interface.ProductSupplyInfo() )
      this.ProductMatch.push( new Interface.ProductMatch() )

    }
    await this.GetERList();
    if(this.CityTrees.length < 1){
      this.GetAreaTree()
    }
    
    this.$nextTick(()=>{
      this.ShowModal = true; 
    })
  }

  private ChangeTabs(val: string) {
    this.ActiveTab = val;
  }

  // 切换表格模式
  private ChangeTableCols(IsEdit: boolean): void {
    // 编辑
    if (IsEdit) {
      // 供应商
      if (this.SupplyDataCol[0].title !== '默认') {
        this.SupplyDataCol.unshift({ title: '默认', key: 'IsDefault', width: 90,  render: (h: any, params: any): string => {
          return h('span', {
            class: 'P-Pointer',
            on: {
              click: () => {
                this.ChangeDefault('ProductSupplyInfo', params.row._index)
              }
            }
          }, (params.row as any).IsDefault ? '已默认' : '默认' )}
        })
      }
      if (this.SupplyDataCol[this.SupplyDataCol.length - 1].title !== '操作') {
        this.SupplyDataCol.push({ title: '操作', width: 180, render: (h: any, params: any): string => {
          return h('div', [
            h('Button', {
              props: { type: 'error', size: 'small' },
              class: 'P-MR-5',
              on: {
                click: () => {
                  this.DeleteLine('ProductSupplyInfo', params.row._index)
                }
              }
            }, "删除"),
            h('Button', {
              props: { type: 'primary', size: 'small' },
              on: {
                click: () => {
                  this.ChooseEnableSupply(params.row._index)
                }
              }
            }, "选择供应商")
          ])}
        })
      }
      // 竞品
      if (this.MatchCols[0].title !== '默认') {
        this.MatchCols.unshift({ title: '默认', key: 'IsDefault', width: 90,  render: (h: any, params: any): string => {
          return h('span', {
            class: 'P-Pointer',
            on: {
              click: () => {
                this.ChangeDefault('ProductMatch', params.row._index)
              }
            }
          }, (params.row as any).IsDefault ? '已默认' : '默认' )}
        })
      }
      if (this.MatchCols[this.MatchCols.length - 1].title !== '操作') {
        this.MatchCols.push({ title: '操作', width: 80, render: (h: any, params: any): string => {
          return h('Button', {
            props: { type: 'error', size: 'small' },
            class: 'P-MR-5',
            on: {
              click: () => {
                this.DeleteLine('ProductMatch', params.row._index)
              }
            }
          }, "删除")}
        })
      }
      

    } else {
      if (this.SupplyDataCol[0].title === '默认') this.SupplyDataCol.shift()
      if (this.SupplyDataCol[this.SupplyDataCol.length - 1].title === '操作') this.SupplyDataCol.pop()
      if (this.MatchCols[0].title === '默认') this.MatchCols.shift()
      if (this.MatchCols[this.MatchCols.length - 1].title === '操作') this.MatchCols.pop()
    }
  }

  // 获取新品信息
  private GetProductDevInfo(Id: number): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ProductGetProductInfo,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'ProductDevDetails', Res.Data.Data[0])

          this.ProfitData.SPCurrencyCode = this.ProductDevDetails.SPCurrencyCode;
          this.ProfitData.GrossProfit = this.ProductDevDetails.GrossProfit;
          const CategoryId:number = JSON.parse(JSON.stringify(this.ProductDevDetails.CategoryId));

          this.ProductDevDetails.CategoryId = [];
          ( this.ProductDevDetails.CategoryId as Array<string> ).unshift( CategoryId.toString() )
          this.FindParentIds(this.Tree, CategoryId)

        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取产品特性标签
  private GetProductAttribute(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ProductGetProAttribute,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.ProductDevDetails.Attribute = []
          if (this.ModifyStatus) {
            this.ProductDevDetails.Attribute.push(...Res.Data.Data.map( (Item: any):number => Item.AttributeId ))
          } else {
            this.ProductDevDetails.AttributeName = Res.Data.Data.map( (Item: any):string => Item.AttributeName ).join(",")
          }
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取新品供应商
  private GetSupplyInfo(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ProductGetProSupply,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.ProductSupplyInfo.splice(0, this.ProductSupplyInfo.length, ...Res.Data.Data)
          // 获取汇率
          // 计算预售价和利润
          this.ProductSupplyInfo.forEach( (Item: Interface.ProductSupplyInfo):void => {
            if (Item.IsDefault) {
              this.GetExchange(Item.CurrencyCode, this.ProfitData.SPCurrencyCode, 'SaleExchange');
              this.GetExchange(this.ProfitData.SPCurrencyCode, 'CNY', 'ProfitExchange');
            }
          })
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取竞品信息
  private GetMatchIfo(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ProductGetProMatch,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'ProductMatch', Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取新品信息
  private GetProperty(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ProductGetProperty,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'ProductProperty', Res.Data.Data);
          this.ProfitData.SalePrice = this.ProductDevDetails.SalePrice;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取汇率  profit为赋值对象
  private GetExchange(Source: string, Target: string, Profit: string): void {
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.ERExchangeRate,
        Login: true
      },
      Data: {
        SourceCode: Source,
        TargetCode: Target
      },
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, Profit, Res.Data.Rate)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取审核记录
  private GetReviewHistory(Id: number): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ProductGetProReviewHistory,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.ReviewList.splice(0, this.ReviewList.length, ...Res.Data.Data)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取币种
  private GetERList(): void {
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.ERDropList,
        Login: true
      },
      Data: '',
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.DropER.splice(0, this.DropER.length, ...Res.Data.DropList)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 获取省市区树
	private GetAreaTree(CallBack?: any): void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ProvincialAreasGetTree,
				Login: false
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'CityTrees', Res.Data.Tree);
          this.SetTreeMenu(this.CityTrees)
          if (CallBack) CallBack()
				} else {
					this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
			}
		})
  }
  
	//组装成级联菜单所要的数据结构
	private SetTreeMenu(Data: PInterface.AreaTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id);
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetTreeMenu(Data[Item].children);
			}
		}
	}
  
  // 组合 品类数组
  private FindParentIds(Tree: PInterface.ProductCagtegoryTree[], NodeId: number): void {
    for (let Item in Tree) {
      if (Tree[Item].Id == NodeId) {
        (this.ProductDevDetails.CategoryId as Array<string> ).unshift( Tree[Item].ParentId.toString() );
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
    ( this.ProductDevDetails.CategoryId as number[] ).splice(0, ( this.ProductDevDetails.CategoryId as number[] ).length, ...Data.map( Item => Number(Item) ) )
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.$set(this, 'ShowModal', false);
    this.HandleResMsg(0);
  }

  // 上传图片成功
  private HandleSuccess(Res: any, File: any) {
    if (Res.IsSuccess == true) {
      this.ProductDevDetails.ImageUrl = Res.Data.Url;
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
  private HandleRemove():void {
    this.ProductDevDetails.ImageUrl = ""
  }

  //打开链接页面
  private JumpPage(Val: string): void {
      if (Val !== '') {
        const PathUrl = Val.startsWith('http://') || Val.startsWith('https://') ? Val : 'https://' + Val;
        window.open(PathUrl);
      }
    }
  
  
  // 切换默认供应商/竞品
  private ChangeDefault(Type: string, Index:number):void {
    for (let Item in this[Type]) {
      this[Type][Item].IsDefault = false;
    }
    this[Type][Index].IsDefault = true;

    if (Type === 'ProductSupplyInfo') {
      // 更新预售价/汇率
      this.ProfitData.SalePrice = this.ProductSupplyInfo[Index].PurchasePrice / (1 - (this.ProfitData.GrossProfit * 0.01)) * this.SaleExchange;
      this.GetExchange(this.ProductSupplyInfo[Index].CurrencyCode, this.ProfitData.SPCurrencyCode, 'SaleExchange')
    }
  }
  
  // 修改采购价
  private ChangeSalePrice(Index: number):void {
    if (this.ProductSupplyInfo[Index].IsDefault == true) {
      this.ProfitData.SalePrice = this.ProductSupplyInfo[Index].PurchasePrice / (1 - (this.ProfitData.GrossProfit * 0.01)) * this.SaleExchange
    }
  }

  // 修改利润率
  private ChangeGrossProfit():void {
    let PurchasePrice: number = 0;
    for (let Item in this.ProductSupplyInfo) {
      if (this.ProductSupplyInfo[Item].IsDefault) {
        PurchasePrice = this.ProductSupplyInfo[Item].PurchasePrice
      }
    }
    // 更新预售价
    this.ProfitData.SalePrice = PurchasePrice / (1 - (this.ProfitData.GrossProfit * 0.01)) * this.SaleExchange
  }

  // 修改币种
  private ChangeCurrency(Type: string, Index?:number):void {
    if (Type === 'ProductSupplyInfo' && Index !== undefined) {
      if (this.ProductSupplyInfo[Index].IsDefault) {
        this.GetExchange(this.ProductSupplyInfo[Index].CurrencyCode, this.ProfitData.SPCurrencyCode, 'SaleExchange')
      }
    } else if (Type === 'Sale') {
      for (let Item in this.ProductSupplyInfo) {
        if (this.ProductSupplyInfo[Item].IsDefault) {
          this.GetExchange(this.ProductSupplyInfo[Item].CurrencyCode, this.ProfitData.SPCurrencyCode, 'SaleExchange');
          this.GetExchange(this.ProfitData.SPCurrencyCode, 'CNY', 'ProfitExchange')
        }
      }
    }
  }

  // 删除供应商/竞品
  private DeleteLine(Type: string, Index:number):void {
    let Currency: string = this[Type][Index].CurrencyCode;
    if (this[Type].length < 2) {
      return;
    }
    this[Type].splice(Index, 1);
    // 默认数据被删除 取第一个为默认
    let SupplyFlag: boolean = false;
    for (let Item in this[Type]) {
      if (this[Type][Item].IsDefault) {
        SupplyFlag = true;
      }
    }
    if (!SupplyFlag) {
      this[Type][0].IsDefault = true;
      if (Type == 'Supply') {
        this.ProfitData.SalePrice = this.ProductSupplyInfo[0].PurchasePrice / (1 - (this.ProfitData.GrossProfit * 0.01)) * this.SaleExchange;
        // 如果货币相同 则可以不发
        if (Currency !== this.ProductSupplyInfo[0].CurrencyCode) {
          this.GetExchange(this.ProductSupplyInfo[0].CurrencyCode, this.ProfitData.SPCurrencyCode, 'SaleExchange')
        }
      }
    }
  }

  // 添加一行供应商/竞品
  private AddLine(Type: string): void {
    if (Type === 'Supply') {
      this.ProductSupplyInfo.push( new Interface.ProductSupplyInfo() )
      this.ProductSupplyInfo[this.ProductSupplyInfo.length - 1].IsDefault = false
    } else if (Type === 'Match') {
      this.ProductMatch.push( new Interface.ProductMatch() )
      this.ProductMatch[this.ProductMatch.length - 1].IsDefault = false
    }
  }

  // 添加供应商
  private AddSupplier(): void{
    if(this.CityTrees.length < 1){
      this.GetAreaTree(()=>{
        this.TriggerModifySupplier = true;
      })
    } else {
      this.TriggerModifySupplier = true;
    }
  }

  // 添加供应商回调
  private HandleResSupplier(Res: boolean): void {
    this.TriggerModifySupplier = false;
  }

  //打开可用供应商模态框
  private ChooseEnableSupply(Index: number):void{
    this.ChooseSupplyIndex = Index;
    (this.$refs["EnableSupplier"] as any).TriggerModal(false, this.IsLoadingEnableTab, false)
  }

  // 选择供应商 回调
  private CloseEnableSupplier(Res: boolean, IsLoadingTab: boolean, SelectData: Interface.Supplier[]): void{
    this.IsLoadingEnableTab = IsLoadingTab;
    if (Res) {
      this.ProductSupplyInfo[this.ChooseSupplyIndex].SupplyId = SelectData[0].Id;
      this.ProductSupplyInfo[this.ChooseSupplyIndex].SupplyName = SelectData[0].SupplyName;
    }
  }

  // 添加标签
  private AddPropertyTag(Type: string, Index?:number):void{
    if (Type === 'ProductProperty') {
      let Flag:boolean = false;
      if (this.AddPropertyName === "") {
        return;
      }

      this.ProductProperty.forEach((Item: Interface.ProductProperty): void => {
        if (Item.PropertyName === this.AddPropertyName) {
          Flag = true
          this.AddPropertyName = "";
        }
      })
      if (Flag) {
        this.$UI.Tips.Floating('warning', `该属性已被添加`);
        return;
      }

      if (this.ProductProperty.length >= 3) {
        this.$UI.Tips.Floating('warning', `只能添加3个新品属性`);
        this.AddPropertyName = "";
        return;
      }

      this.ProductProperty.push({
        Id: 0,
        ProductId: this.ProductDevDetails.Id,
        PropertyName: this.AddPropertyName,
        PropertyValue: []
      })
      this.AddPropertyName = "";

    } else if (Type === 'PropertyValue' && Index !== undefined) {
      if (this.AddPropertyValue[Index] == "") {
        return;
      }

      for (let Item in this.ProductProperty[Index].PropertyValue) {
        if (this.ProductProperty[Index].PropertyValue[Item].PropertValue == this.AddPropertyValue[Index]) {
          this.$UI.Tips.Floating('warning', `该属性值已被添加`);
          this.AddPropertyValue[Index] = "";
          return;
        }
      };

      this.ProductProperty[Index].PropertyValue.push({
        Id: 0,
        PropertyId: this.ProductProperty[Index].Id,
        PropertValue: this.AddPropertyValue[Index]
      })
      this.AddPropertyValue[Index] = "";
    }
  }

  // 删除标签
  private ClosePropertyTag(Type:string, Index: number, Item?: number): void {
    if (Type === 'ProductProperty') {
      this.ProductProperty.splice(Index, 1)
    } else if (Type === 'PropertyValue' && Item !== undefined) {
      this.ProductProperty[Index].PropertyValue.splice(Item, 1);
    }
  }

  // 整理数据
  private ArrangeProductData(IsToReview: boolean): void {
    (this.$refs['ProductDevDetails'] as Vue).validate((valid: boolean): void => {
      if (valid) {
        if (this.ProductDevDetails.ImageUrl == "") {
          this.$UI.Tips.Floating('warning', `请上传图片`);
          return;
        }
        // 验证供应商
        for (let Item in this.ProductSupplyInfo) {
          if (this.ProductSupplyInfo[Number(Item)].SupplyId == 0 || this.ProductSupplyInfo[Number(Item)].SupplyId.toString() === "") {
            this.$UI.Tips.Floating('warning', `请选择第【${ Number(Item) + 1 }】个供应商的供应商`);
            this.showWarning('warning', '')
            return;
          }
          if (this.ProductSupplyInfo[Number(Item)].PurchasePrice <= 0) {
            this.$UI.Tips.Floating('warning', `请填写第【${ Number(Item) + 1 }】个供应商的采购单价，采购单价必须大于0。`);
            return;
          }
          if (this.ProductSupplyInfo[Number(Item)].CurrencyCode == "") {
            this.$UI.Tips.Floating('warning', `请选择第【${ Number(Item) + 1 }】个供应商的采购币种`);
            return;
          }
          if (this.ProductSupplyInfo[Number(Item)].PurchaseUrl == "") {
            this.$UI.Tips.Floating('warning', `请填写第【${ Number(Item) + 1 }】个供应商的采购链接`);
            return;
          }
        }
        // 验证竞品
        for (let Item in this.ProductMatch) {
          if (this.ProductMatch[Number(Item)].SalePrice.toString() === "" || this.ProductMatch[Item].SalePrice <= 0) {
            this.$UI.Tips.Floating('warning', `请填写第【${ Number(Item) + 1 }】个竞品的竞品售价，竞品售价必须大于0。`);
            return;
          }
          if (this.ProductMatch[Number(Item)].CurrencyCode == "") {
            this.$UI.Tips.Floating('warning', `请填写第【${ Number(Item) + 1 }】个竞品的竞品售价币种`);
            return;
          }
          if (this.ProductMatch[Number(Item)].SaleUrl == "") {
            this.$UI.Tips.Floating('warning', `请填写第【${ Number(Item) + 1 }】个竞品的竞品链接`);
            return;
          }
        }
        // 验证新品属性
        if (this.ProductProperty.length > 0) {
          for (let Item in this.ProductProperty) {
            if (this.ProductProperty[Number(Item)].PropertyValue.length < 1) {
              this.$UI.Tips.Floating('warning', `请填写第【${ Number(Item) + 1 }】个新品属性添加属性值`);
              return;
            }
          }
        }
        let PostData: Interface.ModifyProductDev = {
          Product: JSON.parse(JSON.stringify(this.ProductDevDetails)),
          Supply: JSON.parse(JSON.stringify(this.ProductSupplyInfo)),
          Match: JSON.parse(JSON.stringify(this.ProductMatch)),
          Property: JSON.parse(JSON.stringify(this.ProductProperty)),
          Attribute: [],
          IsToReview: IsToReview
        }
        for (let Item in this.ProductDevDetails.Attribute) {
          PostData.Attribute.push({
            ProductId: this.ProductDevDetails.Id,
            AttributeId: this.ProductDevDetails.Attribute[Number(Item)],
            AttributeName: ""
          })
        }
        PostData.Product.CategoryNum = this.AddZero(PostData.Product.CategoryNum)
        PostData.Product.GrossProfit = this.ProfitData.GrossProfit;
        PostData.Product.SPCurrencyCode = this.ProfitData.SPCurrencyCode;
        PostData.Product.SalePrice = this.ProfitData.SalePrice;
        PostData.Product.CategoryId = Number( (PostData.Product.CategoryId as Array<string>)[(PostData.Product.CategoryId as Array<string>).length - 1] )
        delete PostData.Product.Attribute;
        // 提交
        this.PostProductDev(PostData);
      } else {
        return;
      }
    })
  }

  // 提交审核/添加/修改
  private PostProductDev(PostData: Interface.ModifyProductDev):void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.SelecData.length === 0 ? this.$Api.ProductCreate : this.$Api.ProductModify,
        Login: true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', PostData.IsToReview ? '提审新品成功' : `${ this.SelecData.length === 0 ? '添加': '修改'}新品申请成功`);
          this.ClearModal(1)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  // 审核新品
  private ReviewProductDev(Status: number): void {
    this.$UI.Loading.Show();
    const PostData:object = {
      Id: [this.SelecData[0].Id],
      ReviewType: Status,
      Remark: this.ReviewRemark
    }
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ProductProReview,
        Login: true 
      },
      Data: PostData,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', '审核新品申请成功');
          this.ClearModal(1)
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }
  
  // 补0
  private AddZero(Num: string):string  {
    let NumberArr = Num.split('');
    if (NumberArr.length >= 3) {
      return NumberArr.join('')
    } else if (NumberArr.length >= 2) {
      return '0' + NumberArr.join('')
    } else if (NumberArr.length >= 1) {
      return '00' + NumberArr.join('')
    } else {
      return ''
    }
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Triger(Url)
  }

  private ActivedQuality: boolean = false; // 控制质检

  private ShowModal: boolean = false;  //模态框
  private ModifyStatus: boolean = false; // true：修改，false：查看
  private ModifyStatusObj: any = { Boolean: false }; // true：修改，false：查看 解决引用问题
  private IsReview: boolean = false // 是否为审核

  private IsLoadingEnableTab: boolean = true;  //打开添加供应商时是否加载表格数据
  private ShowSupplierModal: boolean = false;  //模态框
  private ChooseSupplyIndex: number = 0;  // 被选中的供应商下标

  private TriggerModifySupplier: boolean = false; // 新加供应商

  private SelecData: Interface.ProductDevList[] = []; //当前选中数据
  private Tree: PInterface.ProductCagtegoryTree[] = [] //左侧树数据
  private CityTrees:PInterface.AreaTree[] = []; //地区下拉数据

  private UploadImgServer:string = this.$Server.Settings + this.$Api.UploadImage //上传图片服务器 接口

  private ProductDevDetails: Interface.ProductDevDetails = new Interface.ProductDevDetails(); // 详情
  private ProductAttribute: Interface.ProductAttribute = new Interface.ProductAttribute();    // 特性标签
  private ProductSupplyInfo: Interface.ProductSupplyInfo[] = []; // 供应商信息
  private ProductMatch: Interface.ProductMatch[] = []                // 竞品信息
  private ProductProperty: Interface.ProductProperty[] = [];       // 新品属性
  private ProfitData: Interface.ProfitData = new Interface.ProfitData();                      // 利润率 利润 预售价表格
  private ProductDevRules: any = {
    Id: [{ required: false }],
    ImageUrl: [{ required: true, message: '请上传图片', trigger: 'change' }],
    ProductName: [{ required: true, message: '请输入产品名' }],
    Platfrom: [{ required: true, message: '请选择平台', trigger: 'change', type: 'number' }],
    SaleKeyWord: [{ required: false }],
    Weight: [{ required: true, message: '请输入重量', trigger: 'change', type: 'number', min: 0.0000000002 }],
    CategoryId: [{ required: true, message: '请选择品类', trigger: 'change', type: 'array' }],
    CategoryName: [{ required: false }],
    CategoryNum: [{ required: true, message: '请输入SKU序号' }, { pattern: /^[0-9]{1,3}$/, message: '请输入正确的SKU序号' }],
    SalePrice: [{ required: false }],
    SPCurrencyCode: [{ required: false }],
    GrossProfit: [{ required: false }],
    DevManager: [{ required: true, message: '请选择产品经理', trigger: 'change', type: 'number' }],
    DevMangerName: [{ required: false }],
    SaleManager: [{ required: true, message: '请选择销售主管', trigger: 'change', type: 'number' }],
    SaleManagerName: [{ required: false }],
    Creator: [{ required: true, message: '请选择开发员', trigger: 'change', type: 'number' }],
    CreatorName: [{ required: false }],
    CreateTime: [{ required: false }],
    CompleteTime: [{ required: false }],
    Remark: [{ required: false }],
    Status: [{ required: false }],
    Attribute: [{ required: true, message: '请选择特性标签', trigger: 'change', type: 'array' }]
  }

  private AddPropertyName: string = ""; // 新加属性
  private AddPropertyValue: string[] = [];//添加的属性值

  private ProfitExchange: number = 1; //汇率 利润处
  private SaleExchange: number = 2; //汇率 预售价处

  private DropAttribute: PInterface.KV[] = []; // 特性标签下拉
  private DropDevUser: PInterface.KV[] = [];  // 开发员下拉
  private DropDevManager: PInterface.KV[] = []; // 产品经理下拉
  private DropSaleManager: PInterface.KV[] = []; // 销售主管下拉
  private DropPlatform: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform); // 平台
  private DropER: PInterface.KV[] = []; //币种下拉  

  private ReviewRemark: string = ""; // 审核备注
  private ActiveTab: string = "Base"; //tab索引值

  // 审核记录 
  // 表头
  private ReviewCol: PInterface.TableCol[] = [
    { title: "编号", width: 100, key: "Id"},
    { title: "审核人", key: "Operator"},
    { title: "审核结果", key: "OperateType", render:(h:any, params: any):string => h('span', ['', '通过', '不通过', '退回修改'][params.row.OperateType] ) },
    {
      title: "审核时间", key: "OperateTime", width: 160, render: (h: any, params: any): string => h("span", this.$UI.Render.Date(params.row.OperateTime, true))
    },
    { title: "备注", key: "Remark"}
  ];
  // 列表
  private ReviewList: Interface.ReviewList[] = [];

  // 供应商
  private SupplyDataCol: PInterface.TableCol[] = [
    { title: '默认', key: 'IsDefault', width: 90,  render: (h: any, params: any): string => {
        return h('span', {
          class: 'P-Pointer P-Text-Info',
          on: {
            click: () => {
              this.ChangeDefault('ProductSupplyInfo', params.row._index)
            }
          }
        }, (params.row as any).IsDefault ? '已默认' : '默认' )}
    },
    { title: '供应商', key: 'SupplyName' },
    { title: '采购价', key: 'IsDefault', width: 220,  render: (h: any, params: any): string => {
        return this.ModifyStatusObj.Boolean 
          ? h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.PurchasePrice
                },
                on: {
                  'on-change': (Data: number): void => {
                    this.SupplyDataList[params.row._index].PurchasePrice = Data
                    this.ChangeSalePrice(params.row._index)
                  }
                }
              }),
              h('Select', {
                props: {
                  value: params.row.CurrencyCode,
                  clearable:true,
                  filterable: true,
                  options: this.DropER,
                  onChange: (Val: number) => {
                    params.row.CurrencyCode = Val
                    this.ChangeCurrency('ProductSupplyInfo', params.row._index)
                  }
                },
                style: {
                  width: '100px'
                }
              })
            ])
          : h('span',  `${params.row.PurchasePrice}${params.row.CurrencyCode}` )
        }
    }, 
    { title: '采购链接', key:'PurchaseUrl', render: (h: any, params: any): string => {
      return this.ModifyStatusObj.Boolean 
        ? h('Input', {
            props: {
              placeholder: "采购链接",
              value: params.row.PurchaseUrl
            },
            on: {
              'on-change': (Event: any): void => {
                this.SupplyDataList[params.row._index].PurchaseUrl = Event.target.value
              }
            }
          })
        : h('a', {
            on: {
              'click.prevent': ()=>{
                this.JumpPage( params.row.PurchaseUrl )
              }
            }
          }, params.row.PurchaseUrl || "-")
    }},
    { title: '操作', width: 180, render: (h: any, params: any): string => {
        return h('div', [
          h('Button', {
            props: { type: 'error', size: 'small' },
            class: 'P-MR-5',
            on: {
              click: () => {
                this.DeleteLine('ProductSupplyInfo', params.row._index)
              }
            }
          }, "删除"),
          h('Button', {
            props: { type: 'primary', size: 'small' },
            on: {
              click: () => {
                this.ChooseEnableSupply(params.row._index)
              }
            }
          }, "选择供应商")
        ])
      }
    }
  ];
  // 利润率
  private ProfitDataCols: PInterface.TableCol[] = [
    { title: '利润率',  render: (h: any, params: any): string => {
        return this.ModifyStatusObj.Boolean 
          ? h('div', [
              h('InputNumber', {
                props: {
                  min: 0,
                  placeholder: "利润率",
                  value: params.row.GrossProfit
                },
                on: {
                  'on-change': (Data: number): void => {
                    this.ProfitData.GrossProfit = Data;
                    this.ChangeGrossProfit();
                  }
                }
              }),
              h('span',  "%" )
            ])
          : h('span',  `${this.ProfitData.GrossProfit}%` )
      }
    },
    { title: '利润',  render: (h: any, params: any): string => h('span',  `${ ((this.ProfitData.SalePrice * this.ProfitExchange) * (this.ProfitData.GrossProfit * 0.01)).toFixed(2) }CNY` )},
    { title: '预售价', render: (h: any, params: any): string => {
        return this.ModifyStatusObj.Boolean 
          ? h('div', [
              h('InputNumber', {
                props: {
                  min: 0,
                  placeholder: "预售价",
                  value: params.row.SalePrice
                },
                on: {
                  'on-change': (Data: number): void => {
                    this.ProfitData.SalePrice = Data;
                  }
                }
              }),
              h('Select', {
                props: {
                  value: params.row.SPCurrencyCode,
                  clearable:true,
                  filterable: true,
                  options: this.DropER,
                  onChange: (Val: number) => {
                    params.row.SPCurrencyCode = Val
                    this.ChangeCurrency('Sale')
                  }
                },
                style: {
                  width: '100px'
                }
              })
            ])
          : h('span',  `${this.ProfitData.SalePrice}${this.ProfitData.SPCurrencyCode}` )
        }
      }
  ];

  // 竞品
  private MatchCols: PInterface.TableCol[] = [
    { title: '默认', key: 'IsDefault', width: 90,  render: (h: any, params: any): string => {
        return h('span', {
          class: 'P-Pointer P-Text-Info',
          on: {
            click: () => {
              this.ChangeDefault('ProductMatch', params.row._index)
            }
          }
        }, (params.row as any).IsDefault ? '已默认' : '默认' )}
    },
    { title: '竞品售价', key: 'SalePrice', width: 220,  render: (h: any, params: any): string => {
      return this.ModifyStatusObj.Boolean  
          ? h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.SalePrice
                },
                on: {
                  'on-change': (Data: number): void => {
                    this.ProductMatch[params.row._index].SalePrice = Data
                  }
                }
              }),
              h('Select', {
                props: {
                  value: params.row.CurrencyCode,
                  clearable:true,
                  filterable: true,
                  options: this.DropER,
                  onChange: (Val: number) => {
                    params.row.CurrencyCode = Val
                    this.ChangeCurrency('ProductSupplyInfo', params.row._index)
                  }
                },
                style: {
                  width: '100px'
                }
              })
            ])
          : h('span',  `${params.row.SalePrice}${params.row.CurrencyCode}` )
      }
    }, 
    { title: '竞品链接', key:'SaleUrl', render: (h: any, params: any): string => {
      return this.ModifyStatusObj.Boolean 
        ? h('Input', {
            props: {
              placeholder: "采购链接",
              value: params.row.SaleUrl
            },
            on: {
              'on-change': (Data: string): void => {
                this.ProductMatch[params.row._index].SaleUrl = Data
              }
            }
          })
        : h('a', {
            on: {
              'click.prevent': ()=>{
                this.JumpPage( params.row.SaleUrl )
              }
            }
          }, params.row.SaleUrl || "-")
    }},
    { title: '操作', width: 80, render: (h: any, params: any): string => {
        return h('Button', {
          props: { type: 'error', size: 'small' },
          class: 'P-MR-5',
          on: {
            click: () => {
              this.DeleteLine('ProductMatch', params.row._index)
            }
          }
        }, "删除")
      }
    }
  ];
}
</script>

<style lang="less">
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
  background-size: cover;
  cursor: pointer;
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
