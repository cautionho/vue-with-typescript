<template>
  <Row class="P-Inline-Block">
    <Col span="24">
      <Modal v-model="CustomRulesModal" :title="ModalTitle" :width="1200" @on-cancel="CancelModal">
        <Row>
          <Col span="24">
            <Form :model="RuleInfo" ref="RuleInfo" :rules="RuleInfoRules" inline onsubmit="return false;" :label-width="90">
              <FormItem class="P-W-400" label="规则名称：" prop="RuleName">
                <Input placeholder="规则名称" v-model="RuleInfo.RuleName" ref="RuleNameIpt"></Input>
              </FormItem>
              <FormItem class="P-W-400" v-if="Type !== 'ManMade'" :label="Type === 'Warehouse' ? '仓库' : '虚拟渠道'" prop="SelectedValue">
                <Select v-if="Type === 'Warehouse'" placeholder="仓库" :options="WarehouseDrop" v-model="RuleInfo.SelectedValue" />
                <!-- <Select v-if="Type === 'Warehouse'" placeholder="仓库" clearable filterable v-model="RuleInfo.SelectedValue">
                   <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
                </Select> -->
                <Select v-if="Type === 'Logistics'" placeholder="虚拟渠道" :options="MethodDrop" optionValKey="Id" optionKey="Name" v-model="RuleInfo.SelectedValue" />
                <!-- <Select v-if="Type === 'Logistics'" placeholder="虚拟渠道" clearable filterable v-model="RuleInfo.SelectedValue">
                   <Option v-for="(Item,Index) in MethodDrop" :value="Item.Id" :key="Index">{{ Item.Name }}</Option>
                </Select> -->
              </FormItem>
            </Form>
          </Col>
          <Col span="18">
            <Table size="small" :columns="Cols" :data="SelectedConditions" height="600"></Table>
          </Col>
          <Col span="6">
             <Table size="small" ref="ConditionsList" :columns="ConditionsCol" :data="ConditionsList" height="600" @on-selection-change="SetSelectedConditions"></Table>
          </Col>
        </Row>
        <footer slot="footer">
          <Button type="primary" @click="Validate">提交</Button>
          <Button @click="CancelModal">取消</Button>
        </footer>
      </Modal>

      <!-- 条件模态框 -->
      <Modal v-model="ConditionModal" :title="ConditionModalTitle" :width="900" @on-cancel="CancelConditionModal">
        <Row class="P-Inline-Block Condition-Modal P-W-100-Percent">
          <Col span="24" v-show="ConditionModalFlags[1]">
            <PlatformStoreTree ref="PlatformStoreTree"></PlatformStoreTree>
          </Col>
          <Col span="24" v-if="ConditionModalFlags[2]">
            <EbaySiteCondition ref="EbaySiteCondition"></EbaySiteCondition>
          </Col>
          <!-- 多选框 -->
          <Col span="24" v-show="ConditionModalFlags[3] || ConditionModalFlags[30] || ConditionModalFlags[33]">
            <h4 v-if="ModifyConditionId === 30" class="P-MB-10">eBay：</h4>
            <!-- <CheckboxGroup v-model="ConditionVal" v-if="ModifyConditionId === 3">
              <Checkbox class="P-W-200" v-for="(Item,Index) in COUNTRY_DROP" :key="Index" :label="`${Item.CountryNameCn}(${Item.CountryCode})`">{{Item.CountryNameCn}}({{Item.CountryCode}})</Checkbox>
            </CheckboxGroup> -->
            <F-CheckboxGroup :width="200" :options="GetCountryDrop()" v-model="ConditionVal" v-if="ModifyConditionId === 3" />
            <CheckboxGroup v-model="ConditionVal" v-else-if="ModifyConditionId === 30">
              <Checkbox class="P-W-200" v-for="(Item,Index) in DisputedDrop" :key="Index" :label="Item.Value">{{Item.Key}}</Checkbox>
            </CheckboxGroup>
            <CheckboxGroup v-model="ConditionVal" v-else>
              <Checkbox class="P-W-200" v-for="(Item,Index) in PlatformDrop" :key="Index" :label="Item.Value">{{Item.Key}}</Checkbox>
            </CheckboxGroup>
          </Col>
          <!-- 输入框 -->
          <Col span="24" v-if="ConditionModalFlags[4] || ConditionModalFlags[5] || ConditionModalFlags[6] || ConditionModalFlags[7] || ConditionModalFlags[8] || ConditionModalFlags[9]">
            <Form :label-width="100" onsubmit="return false;">
              <FormItem :label="`${ConditionsList[ModifyConditionId-1].ClickString}：`">
                <Input v-if="ModifyConditionId !== 7" placeholder="输入字符" ref="TagInput" v-model="InputVals[0]" @on-enter="AddTags" class="P-W-400">
                 <Button slot="append" @click="AddTags">添加</Button>
                </Input>
                <InputNumber v-if="ModifyConditionId === 7" v-model="InputVals[0]" :min="0" placeholder="输入整数" ref="NumInput" class="P-W-400"></InputNumber>
              </FormItem>
            </Form>
            <Col span="24" v-if="ModifyConditionId !== 7">
              <Tag v-for="(Item,Index) in ConditionVal" size="medium" color="success" :key="Index" :name="Item" closable @on-close="DelTags(Index)" class="P-MB-10">{{Item}}</Tag>
            </Col>
          </Col>
          <!-- 范围区间 -->
          <Col span="24" v-if="ConditionModalFlags[10] || ConditionModalFlags[12] || ConditionModalFlags[14] || ConditionModalFlags[16] || ConditionModalFlags[17] || ConditionModalFlags[18] || ConditionModalFlags[19] || ConditionModalFlags[20] || ConditionModalFlags[27] || ConditionModalFlags[34]">
            {{`${ConditionsList[ModifyConditionId-1].ConditionName}满足以下条件：`}}
            <CheckboxGroup v-model="ConditionVal" class="P-MT-20">
              <Checkbox :label="1">＞</Checkbox><InputNumber class="P-W-200" v-model="InputVals[0]" :min="-100000" :max="100000" placeholder="请输入最小值"></InputNumber>
              <br />
              <Checkbox class="P-MT-20" :label="2">＜</Checkbox><InputNumber class="P-W-200" v-model="InputVals[1]" :min="-100000" :max="100000" placeholder="请输入最大值"></InputNumber>
            </CheckboxGroup>
          </Col>
          <!-- 单个范围 -->
          <Col span="24" v-if="ConditionModalFlags[11]">
            利润：＜ <InputNumber class="P-W-200" v-model="InputVals[1]" :min="-100000" :max="100000" placeholder="请输入最大值"></InputNumber> USD
          </Col>
          <!-- 按钮标签 -->
          <Col span="24" v-if="ConditionModalFlags[13]">
            <Button type="primary" @click="TriggerSkuModal">选择SKU</Button>
            <div class="P-MT-10">
              <Tag v-for="(Item,Index) in ConditionVal" size="medium" color="success" :key="Index" :name="Item" closable @on-close="DelTags(Index)" class="P-MB-5 P-MR-5">{{Item}}</Tag>
            </div>
          </Col>
          <!-- 下拉框 -->
          <Col span="24" v-if="ConditionModalFlags[15] || ConditionModalFlags[21] || ConditionModalFlags[22] || ConditionModalFlags[23] || ConditionModalFlags[24] || ConditionModalFlags[25] || ConditionModalFlags[26] || ConditionModalFlags[28] || ConditionModalFlags[29] || ConditionModalFlags[31] || ConditionModalFlags[32]">
            <Form inline :label-width="220" onsubmit="return false;">
              <FormItem v-if="ModifyConditionId !== 15 && ModifyConditionId !== 29" :label="`${ConditionsList[ModifyConditionId-1].ConditionName}`">
                <Select v-model="InputVals[0]" :placeholder="`请选择${ConditionsList[ModifyConditionId-1].ConditionName.slice(0,-1)}`" class="P-W-300" :options="BooleanDrop" />
                <!-- <Select v-model="InputVals[0]" :placeholder="`请选择${ConditionsList[ModifyConditionId-1].ConditionName.slice(0,-1)}`" class="P-W-300" clearable filterable>
                  <Option v-for="(Item,Index) in BooleanDrop" :key="Index" :value="$Enums.Public.YesNo[Item]">{{Item}}</Option>
                </Select> -->
              </FormItem>
              <FormItem v-else-if="ModifyConditionId === 29" :label="`${ConditionsList[ModifyConditionId-1].ConditionName}：`">
                <Select v-model="InputVals[0]" :placeholder="`请选择${ConditionsList[ModifyConditionId-1].ConditionName}`" class="P-W-300" :options="MethodDrop" optionValKey="Id" optionKey="Name" />
                <!-- <Select v-model="InputVals[0]" :placeholder="`请选择${ConditionsList[ModifyConditionId-1].ConditionName}`" class="P-W-300" clearable filterable>
                  <Option v-for="(Item, Index) in MethodDrop" :key="`M${Index}`" :value="Item.Id">{{Item.Name}}</Option>
                </Select> -->
              </FormItem>
              <FormItem v-else :label="`${ConditionsList[ModifyConditionId-1].ConditionName}：`">
                <Select v-model="ConditionVal" :placeholder="`请选择${ConditionsList[ModifyConditionId-1].ConditionName}`" class="P-W-400" multiple :options="AttributeDrop" />
                <!-- <Select v-model="ConditionVal" :placeholder="`请选择${ConditionsList[ModifyConditionId-1].ConditionName}`" class="P-W-400" multiple clearable filterable>
                  <Option v-for="(Item, Index) in AttributeDrop" :key="`T${Index}`" :value="Item.Value">{{Item.Key}}</Option>
                </Select> -->
              </FormItem>
            </Form>
          </Col>
        </Row>
        <footer slot="footer">
          <Button type="primary" @click="PostModifyCondition">提交</Button>
          <Button @click="CancelConditionModal">取消</Button>
        </footer>
      </Modal>
      <EnableSku ref="EnableSku" @handle-res-msg="GetSelectedSku"></EnableSku>
    </Col>
  </Row>
</template>
<script lang="ts">
import {Component, Vue, Prop, Emit} from 'vue-property-decorator'
import {Action, Getter} from 'vuex-class'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/Warehouse'

@Component({
  name: 'ModifyCustomRules',
  components: {
    PlatformStoreTree: () => import('@/components/Public/PlatformStoreTree.vue'),
    EnableSku: () => import('@/components/Public/EnableSku.vue'),
    EbaySiteCondition: () => import('./EbaySiteCondition.vue')
  }
})

export default class ModifyCustomRules extends Vue {
  @Prop(String) private Type: string
  @Prop(Array) private Conditions: Interface.CustomRulesConditionList[]
  @Prop({type:Array,default:()=>{return []}}) private WarehouseDrop: PInterface.KV[]
  @Prop({type:Array,default:()=>{return []}}) private MethodDrop: PInterface.IdName[]
  @Emit() EmitCustomRules():void {} 

  
  @Action private 'Base/UPDATE_BASE_INFO': any
  @Getter private 'Base/COUNTRY_DROP': PInterface.CountryEntity[]
  get COUNTRY_DROP() {
    return this['Base/COUNTRY_DROP'];
  }

  get ConditionsList(){
    return this.Conditions
  }

  private GetAttributeDrop(): void {
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.AttributeDropList
      },
      Data: true,
      Callback:(Res: PInterface.Res): void => {
        if(Res.IsSuccess){
          this.AttributeDrop.push(...Res.Data.DropList);
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

  private GetCountryDrop(): PInterface.KV[] {
    return this.COUNTRY_DROP.map((Item: any) => { return { Key: `${Item.CountryNameCn}(${Item.CountryCode})`, Value: `${Item.CountryNameCn}(${Item.CountryCode})` } } )
  }

  private Trigger(Data: Interface.CustomRulesList = new Interface.CustomRulesList()): void {
    this.$set(this, 'ModalTitle', Data.Id ? '编辑规则' : '添加规则');
    this.$set(this, 'RuleInfo', Data);
    if(this.RuleInfo.Id){
      this.SetDefaultSelected();
    }
    if(!this.COUNTRY_DROP.length){
      this['Base/UPDATE_BASE_INFO']('COUNTRY', true);
    }
    this.$set(this, 'IsInit', false);
    this.$set(this, 'CustomRulesModal', true);
    this.$nextTick(()=>{
      if(!Data.Id){
        (this as any).$refs.RuleInfo.resetFields();
      }
      (this as any).$refs.RuleNameIpt.focus();
    })
  }

  private SetDefaultSelected():void {
    for(let Item of this.RuleInfo.Conditions){
      // 编辑时选中已选条件
      (this as any).$refs.ConditionsList.toggleSelect(Item.ConditionId - 1)
      Item.ConditionName = `${Item.ConditionName}${this.ConditionsList[Item.ConditionId-1].ClickString}`
    }
    this.$set(this, 'SelectedConditions', this.RuleInfo.Conditions)
  }

  private SetSelectedConditions(D: Interface.CustomRulesConditionList[]):void {
    if(this.Init) {
      return
    }else {
      let NewSelected: Interface.CustomRulesCondition[] = []
      for(let Item of D) {
        let F = true
        for(let Condition of this.SelectedConditions){
          if(Item.ConditionId === Condition.ConditionId){
            F = false
            NewSelected.push(Condition)
          }
        }
        if(F){
          NewSelected.push({
            RuleId: this.RuleInfo.Id,
            ConditionId: Item.ConditionId,
            ConditionName: `${Item.ConditionName}${this.ConditionsList[Item.ConditionId-1].ClickString}`,
            ConditionMatchType: Item.ConditionMatchType,
            ConditionValue: "",
            ConditionValueText: ""
          })
        }
      }
      this.$set(this, 'SelectedConditions', NewSelected);
    }
  }

  private TriggerConditionModal(Data: Interface.CustomRulesCondition): void {
    this.$set(this, 'ModifyConditionId', Data.ConditionId);
    this.$set(this, 'ConditionModalTitle', Data.ConditionName);
    this.ConditionModalFlags[Data.ConditionId] = true;
    this.$set(this, 'ConditionModal', true);
    this.$nextTick(()=>{
      this.GetConditionsSettings(Data);
    })
  }

  /* 标签类，添加标签 */
  private AddTags():void {
    if((this.ConditionVal as string[]).some(Item => Item === this.InputVals[0])){
      this.$UI.Tips.Floating('warning', '输入项已存在')
    }else {
      this.ConditionVal.push(this.InputVals[0])
    }
    this.$set(this.InputVals, 0, "")
  }

  /* 标签类，删除标签 */
  private DelTags(N:number):void {
    this.ConditionVal.splice(N,1)
  }

  /* 打开选择SKU */
  private TriggerSkuModal():void {
    (this as any).$refs.EnableSku.Trigger("", false);
  }

  private GetSelectedSku(Data:PInterface.EnableSku[]): void {
    for(let Item of Data){
      if(!this.ConditionVal.some((Sku:string):boolean => { return Sku === Item.SkuCode })){
        this.ConditionVal.push(Item.SkuCode);
      }
    }
  }

  /* 获取相关的需要配置的数据 */
  private GetConditionsSettings(Data: Interface.CustomRulesCondition){
    switch(this.ModifyConditionId){
      case 1:
        (this as any).$refs.PlatformStoreTree.Trigger(Data.ConditionValue);
        break;
      case 2:
        const DefaultShipping: PInterface.KV[] = [];
        if(Data.ConditionValue){
          const ConditionValue: string[] = (Data.ConditionValue as string).split(','),ConditionValueText: string[] = (Data.ConditionValueText as string).split(',')
          ConditionValue.map((V:string, Idx:number): void => {
            DefaultShipping.push({ Key: ConditionValueText[Idx], Value: ConditionValue[Idx] })
          })
        }
        setTimeout(()=>{
          (this as any).$refs.EbaySiteCondition.Trigger(DefaultShipping);
        },300)
        break;
      case 3:
        this.ConditionVal = Data.ConditionValueText.split(',');
        break;
      // 输入框
      case 4:
      case 5:
      case 6:
      case 8:
      case 9:
        this.$set(this.InputVals, 0, "")
        this.ConditionVal = (Data.ConditionValue as string).split(',').filter(V => Boolean(V))
        this.$nextTick(()=>{
          (this as any).$refs.TagInput.focus();
        })
        break;
      // 数字输入框
      case 7:
        this.$set(this.InputVals, 0, Data.ConditionValue || 0);
        this.$nextTick(()=>{
          const Ipt = (this as any).$refs.NumInput.$el.getElementsByTagName('input')[0];
          Ipt.focus(); Ipt.select();
        })
        break;
      // 单区间
      case 11: 
        this.$set(this.InputVals, 0, 0);
        if(Data.ConditionValue){
          this.$set(this.InputVals, 1, Number((Data.ConditionValue as string).split(',')[3]))
        }else{
          this.$set(this.InputVals, 1, 0)
        }
      // 范围区间
      case 10:
      case 12:
      case 14:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 27:
      case 34:
        if(Data.ConditionValue){
          const V = (Data.ConditionValue as string).split(',')
          this.$set(this.InputVals, 0, Number(V[0]))
          this.$set(this.InputVals, 1, Number(V[3]))
          this.ConditionVal.push(1,2)
        }else {
          this.$set(this.InputVals, 0, 0)
          this.$set(this.InputVals, 1, 0)
        }
        break;
      case 15: // 特性标签
        this.ConditionVal = (Data.ConditionValue as string).split(',').map((V:string):number => { return Number(V) });
        if(!this.AttributeDrop.length){
          this.GetAttributeDrop();
        }
        break
        // 是否
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
      case 28:
      case 31:
      case 32:
        this.$set(this.InputVals, 0, Data.ConditionValue === "" ? "" : (Data.ConditionValue === "true" || Data.ConditionValue ? 1 : 0));
        break;
      case 29:
        this.$set(this.InputVals, 0, Number(Data.ConditionValue));
        break;
      // 复选框
      case 30:
        this.ConditionVal = (Data.ConditionValue as string).split(',').map(V => Number(V))
        break
      // 复选框
      case 33:
        this.ConditionVal = (Data.ConditionValue as string).split(',').map(V => Number(V))
        break;
    }
  }

  /* 提交修改条件 */
  private PostModifyCondition():void {
    for(let Item of this.SelectedConditions){
      if(Item.ConditionId === this.ModifyConditionId){
        let ConditionValue: string[] = [],ConditionValueText: string[] = []
        switch(this.ModifyConditionId) {
          case 1:
            const Selc = (this as any).$refs.PlatformStoreTree.GetSelected();
            for(let Store of Selc){
              ConditionValue.push(`${Store.platform}-${Store.value}`);
              ConditionValueText.push(Store.title);
            }
            Item.ConditionValue = ConditionValue.join(',');
            Item.ConditionValueText = ConditionValueText.join(',');
            break;
          case 2:
            const Shippings = (this as any).$refs.EbaySiteCondition.GetSelected();
            for(let Shipping of Shippings){
              ConditionValue.push(Shipping.Value);
              ConditionValueText.push(Shipping.Key);
            }
            Item.ConditionValue = ConditionValue.join(',');
            Item.ConditionValueText = ConditionValueText.join(',');
            break;
          case 3:
            for(let Val of this.ConditionVal){
              if(Val){
                const V = Val.split('(')
                ConditionValue.push(V[0])
                ConditionValueText.push(Val)
              }
            }
            Item.ConditionValue = ConditionValue.join(',')
            Item.ConditionValueText = ConditionValueText.join(',')
            break;
          case 4:
          case 5:
          case 6:
          case 8:
          case 9:
            Item.ConditionValue = Item.ConditionValueText = this.ConditionVal.join(',')
            break;
          case 7:
            Item.ConditionValue = Item.ConditionValueText = (this.InputVals[0] as string);
            break;
          case 11:
            this.ConditionVal.push(2);
          case 10:
          case 12:
          case 14:
          case 16:
          case 17:
          case 18:
          case 19:
          case 20:
          case 27:
          case 34:
            if(this.ConditionVal.length){
              let Min:number = -100000,Max:number = 100000;
              if(this.ConditionVal.findIndex((Item:number): boolean => { return Item === 1 }) >= 0){ Min = (this.InputVals[0] as number) } // 有大于号
              if(this.ConditionVal.findIndex((Item:number): boolean => { return Item === 2 }) >= 0){ Max = (this.InputVals[1] as number) } // 有小于号
              if(Min >= Max){ 
                this.$UI.Tips.Floating('warning', '最小值不能大于或等于最大值'); return;
              }else{
                Item.ConditionValue = `${Min},>,<,${Max}`
                Item.ConditionValueText = `＞${Min},＜${Max}`
              }
            }else {
              Item.ConditionValue = Item.ConditionValueText = "";
            }
            break;
          case 13:
            Item.ConditionValue = Item.ConditionValueText = this.ConditionVal.join(','); 
            break;
          case 15:
            Item.ConditionValue = this.ConditionVal.join(',');
            for(let Attr of this.AttributeDrop){
              if(this.ConditionVal.some((V:number):boolean => { return V === Attr.Value })){
                ConditionValueText.push(Attr.Key as string)
              }
            }
            Item.ConditionValueText = ConditionValueText.join(',')
            break;
          case 21:
          case 22:
          case 23:
          case 24:
          case 25:
          case 26:
          case 27:
          case 28:
          case 31:
          case 32:
            if(this.InputVals[0] === "" || this.InputVals[0] === undefined){
              Item.ConditionValue = Item.ConditionValueText = ""
            }else {
              Item.ConditionValue = Boolean(this.InputVals[0])
              Item.ConditionValueText = this.$Enums.Public.YesNo[this.InputVals[0]]
            }
            break;
          case 29:
            if(this.InputVals[0]){
              Item.ConditionValue = this.InputVals[0];
              Item.ConditionValueText = (this.MethodDrop.filter((M: PInterface.IdName):boolean => { return M.Id === this.InputVals[0] })[0].Name as string);
            }else {
              Item.ConditionValue = 0
              Item.ConditionValueText = "";
            }
            break;
          case 30:
            for(let Val of this.ConditionVal){
              if(Val){
                ConditionValue.push(Val)
                ConditionValueText.push(this.$Enums.Warehouse.DisputedType[Val])
              }
            }
            Item.ConditionValue = ConditionValue.join(',')
            Item.ConditionValueText = ConditionValueText.join(',')
            break;
          case 33:
            for(let Val of this.ConditionVal){
              if(Val){
                ConditionValue.push(Val)
                ConditionValueText.push(this.$Enums.Sales.Platform[Val])
              }
            }
            Item.ConditionValue = ConditionValue.join(',')
            Item.ConditionValueText = ConditionValueText.join(',')
        }
      }
    }
    this.CancelConditionModal();
  }

  private CancelConditionModal():void {
    this.$set(this, 'ConditionModal', false);
    this.$set(this, 'ConditionVal', []);
    this.$set(this, 'ConditionModalFlags', new Array(33))
  }

  private Validate(): void {
    (this as any).$refs.RuleInfo.validate((Valid:boolean): void => {
      if(Valid) {
        if(!this.SelectedConditions.length){
          this.$UI.Tips.Floating('warning', '请选择该规则的条件');
          return;
        }

        for(let Item of this.SelectedConditions){
          if(Item.ConditionValue === ""){
            this.$UI.Tips.Floating('warning', `请补充条件【${Item.ConditionName}】`)
            return;
          }
        }

        this.PostRules();
      }
    })
  }

  private PostRules(): void {
    let PostData: Interface.CustomRulesList = {
      Id: this.RuleInfo.Id,
      Priority: 0,
      RuleName: this.RuleInfo.RuleName,
      SelectedValue: this.RuleInfo.SelectedValue,
      RuleType: this.Type === 'Warehouse' ? 1 : this.Type === 'Logistics' ? 2 : 3,
      IsEnable: true,
      CreateTime: "",
      Conditions: this.SelectedConditions
    }
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.RuleInfo.Id === 0 ? this.$Api.MatchRuleCreate : this.$Api.MatchRuleModify,
        Login:true
      },
      Data: PostData,
      Callback: (Res: PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
          this.$UI.Tips.Floating('success', this.RuleInfo.Id === 0 ? '添加成功' : '修改成功');
          this.CancelModal();
          this.EmitCustomRules();
        }else{
          this.$Request.Error(Res);
        }
      }
    })
  }

   private CancelModal(): void {
    this.$set(this, 'CustomRulesModal', false);
    (this as any).$refs.ConditionsList.selectAll(false);
    this.$nextTick(()=>{
      (this as any).$refs.RuleInfo.resetFields();
    })
    this.$set(this, 'IsInit', true);
  }

  private IsInit: boolean = true
  private CustomRulesModal:boolean = false
  private ModalTitle:string = '添加规则'
  
  private SelectedConditions: Interface.CustomRulesCondition[] = []
  private RuleInfo: Interface.CustomRulesList = new Interface.CustomRulesList()

  private ConditionModal: boolean = false
  private ConditionModalTitle: string = ''
  private ModifyConditionId: number = 0
  private ConditionVal:any = []
  private InputVals:(string | number)[] = []
  private ConditionModalFlags: (undefined | boolean)[] = new Array(33)
  private AttributeDrop: PInterface.KV[] = []
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform)
  private DisputedDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Warehouse.DisputedType)
  private BooleanDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.YesNo)
 
  private RuleInfoRules:any = {
    RuleName: [{required: true, message:'请输入规则名称'}],
    SelectedValue: [{required: true, message: `请选择${this.Type === 'Warehouse' ? '仓库' : '虚拟渠道'}`, trigger: 'change', type: 'number'},{ pattern: this.$Pattern.PositiveNotZeroInt, message: `请选择${this.Type === 'Warehouse' ? '仓库' : '虚拟渠道'}` }]
  }

  private Cols: PInterface.TableCol[] = [{
    title: '条件',
    width:200,
    render: (h:any, Params:any): string => {
      return h('Tooltip', { props: { content: `${Params.row.ConditionName}` }, class: 'P-LINE-1' } ,`${Params.row.ConditionName}`)
    }
  }, {
    title: '详情',
    key: 'ConditionValueText'
  }, {
    title: '操作',
    width:80,
    render: (h:any, Params:any):string => {
      return h('Button',{ props: { size:'small', type:'primary' }, on:{ click: () => { this.TriggerConditionModal(Params.row) } } }, '编辑')
    }
  }]
  private ConditionsCol: PInterface.TableCol[] = [{
    type: 'selection', width: 60, align: 'center'
  }, {
    title: '可选条件',
    render: (h:any, Params:any): string => {
      return h('Tooltip', { props: { content: `${Params.row.ConditionName}${Params.row.ClickString}` }, class: 'P-LINE-1' } ,`${Params.row.ConditionName}${Params.row.ClickString}`)
    }
  }]
}
</script>
<style lang="less" scoped>
.Condition-Modal{
  max-height:500px;
  overflow:auto;
}
</style>