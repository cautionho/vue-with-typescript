<template>
  <Row>
    <Col span="24">
      <Form inline ref="SearchFilter" v-model="SearchFilter">
        <Dropdown trigger="custom" :visible="AccurateSearch">
          <Button type="primary" @click="TriggerSearch">
            精准搜索
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <Col span="24" slot="list" class="P-P-10">
          <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选仓库" v-if="Type === 1" v-model="SearchFilter.SelectedValue" :options="WarehouseDrop" transfer/>
            <!-- <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选仓库" v-if="Type === 1" v-model="SearchFilter.SelectedValue" filterable clearable>
              <Option v-for="(Item,Index) in WarehouseDrop" :value="Item.Value" :key="Index">{{ Item.Key }}</Option>
            </Select> -->
            <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" v-model="SearchFilter.IsEnable" :options="EnableDrop" transfer/>
            <!-- <Select class="P-W-200 P-ML-10 P-MB-10" placeholder="筛选状态" v-model="SearchFilter.IsEnable" filterable clearable>
              <Option v-for="(Item,Index) in EnableDrop" :value="$Enums.Public.Enable[Item]" :key="Index">{{ Item }}</Option>
            </Select> -->
          </Col>
        </Dropdown>
        <FormItem class="P-ML-10 P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-300" v-model="SearchFilter.SearchKey">
          <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-ML-10 P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
    </Col>
    <Col span="24" class="P-MB-10">
      <Button type="primary" class="P-MR-10" @click="EmitOperate(1)" v-if="Powers.MatchRuleCreate">添加规则</Button>
      <ChangeStatus ref="CustomRulesChangeStatus" @emit-change="HandleChangeStatus" v-if="Powers.MatchRuleChangeStatus" ></ChangeStatus>
    </Col>
    <Col span="24">
      <Table size="small" ref="List" :columns="Cols" :data="List" :height="CalculateHeight()"></Table>
    </Col>
    <Col span="24">
      <Page class="P-MT-10" :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>
  </Row>
</template>
<script lang="ts">
import {Component, Vue, Prop, Emit} from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/Warehouse'

@Component({
  name: 'CustomRulesList',
  components: {
    ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
    ModifyCustomRules: () => import('./ModifyCustomRules.vue')
  }
})

export default class CustomRulesList extends Vue {
  @Emit() private EmitOperate(Type:number, Data: Interface.CustomRulesList[] = [new Interface.CustomRulesList()]):void {}

  @Prop(Number) private Type: number
  @Prop() private Powers: PInterface.Power
  @Prop({type:Array,default:()=>{return []}}) private WarehouseDrop?: PInterface.KV[] 

  private TriggerSearch(): void {
    this.$set(this,'AccurateSearch',!this.AccurateSearch)
  }

  private CloseSearch(): void {
    this.$set(this,'AccurateSearch', false);
  }

  private TriggerChange(): void {
    if(!this.List.length){
      this.GetList();
    }
  }

  private CalculateHeight():number {
    return 675
  }

  /* 触发切换页码 */
  private ChangePage(P: number):void {
    this.$set(this.Pager, "PageIndex", P);
    this.GetList()
  }
  /* 触发切换页码展示量 */
  private ChangePageSize(P: number):void {
    this.$set(this.Pager, "PageSize", P);
    this.GetList()
  }

  private GetList(): void {
    this.$UI.Loading.Show()
    let PostData = {
      PageIndex: this.Pager.PageIndex,
      PageSize: this.Pager.PageSize,
      SortField: "",
      SortOrder: "",
      Conditions: JSON.parse(JSON.stringify(this.SearchFilter))
    }
    PostData.Conditions.IsEnable = PostData.Conditions.IsEnable === 1 ? true : PostData.Conditions.IsEnable === 2 ? false : ''
    PostData.Conditions.RuleType = this.Type
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.MatchRuleGetList,
        Login: true
      },
      Data: PostData, 
      Callback: (Res: PInterface.Res): void => {
        this.CloseSearch();
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this.Pager, 'TotalItems', Res.Data.PageModel.TotalItems);
          this.$set(this, 'List', Res.Data.PageModel.Items);
        }else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private SearchList(): void {
    this.ChangePage(1)
  }

  private ResetList(): void {
    this.$set(this, 'SearchFilter', new Interface.CustomRulesSearch());
    this.$set(this, 'Pager', new PInterface.Pager());
    this.GetList();
  }

  private SetOperate(h:any, Params:any): string[] {
    let Operates:string[] = []
    if(this.Powers.MatchRuleModify){
      Operates.push(
        h('Button', {
          props: {type: 'primary',size: 'small'},
          on: {
            click: () => {
              this.CloseSearch()
              this.EmitOperate(2, [JSON.parse(JSON.stringify(Params.row))])
            }
          }
        } ,'编辑')
      )
    }
    if(this.Powers.MatchRuleSort){
      Operates.push(
        h('Button', {
          props: {type: 'primary',size: 'small'},
          class: 'P-ML-5',
          on: {
            click: () => {
              this.CloseSearch()
              this.EmitOperate(3, [JSON.parse(JSON.stringify(Params.row))])
            }
          }
        } ,'排序')
      )
    }
    if(this.Powers.MatchRuleChangeStatus){
      Operates.push(
        h('Button', {
          props: {type:Params.row.IsEnable ? 'error' : 'primary',size: 'small'},
          class: 'P-ML-5',
          on: {
            click: () => {
              this.TriggerChangeStatus(!Params.row.IsEnable, Params.row)
            }
          }
        } , Params.row.IsEnable ? '禁用' : '启用')
      )
    }
    return Operates;
  }

  /* 启禁用 */
  private TriggerChangeStatus(To: boolean, D: Interface.CustomRulesList): void {
    (this as any).$refs.List.selectAll(false)
    this.ChangeStatusObj.ToTarget = To;
    (this as any).$refs.CustomRulesChangeStatus.TriggerModal([D], this.ChangeStatusObj)
  }

  private HandleChangeStatus(R:boolean, T?:number): void {
    if(T !== undefined){
      this.ChangeStatusObj.ToTarget = T === 1 ? true : false;
      (this as any).$refs.CustomRulesChangeStatus.TriggerModal((this as any).$refs.List.getSelection(), this.ChangeStatusObj)
    }

    if(R){
      this.GetList();
    }
  }

  private EnableDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable)
  private SearchFilter: Interface.CustomRulesSearch = new Interface.CustomRulesSearch()
  private AccurateSearch: boolean = false
  private Pager:PInterface.Pager = new PInterface.Pager();
  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Settings, Api: this.$Api.MatchRuleChangeStatus, IdKey: 'Id', StatusKey: 'IsEnable', ToTarget: false, TipsKey: '自定义规则' };

  private List: Interface.CustomRulesList[] = []
  private Cols: PInterface.TableCol[] = [{
    type: 'selection', width: 60, align:'center'
  }, {
    title: '排序号',
    width: 100,
    key: 'Priority'
  }, {
    title: '序号',
    width: 100,
    key: 'Id'
  }, {
    title: '规则名称',
    key: 'RuleName',
    render: (h:any, Params:any) => {
      return h('Tooltip', {
        props: {
          content: Params.row.RuleName
        },
        class: 'P-LINE-1'
      }, Params.row.RuleName)
    }
  }, {
    title: '状态',
    width: 100,
    render: (h:any, Params:any) => {
      return h('Icon', {
        class: Params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error',
        props: {
          type: Params.row.IsEnable ? 'md-checkmark' : 'md-close',
          size: 18
        }
      })
    }
  }, {
    title: '操作',
    width: 180,
    render: (h:any, Params:any) => {
      return h('div', this.SetOperate(h,Params))
    }
  }]
}
</script>
<style lang="less"></style>