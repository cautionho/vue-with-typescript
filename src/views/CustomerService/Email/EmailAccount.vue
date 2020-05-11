<!-- 邮箱账号管理 -->
<template>
  <Row>
    <Col span="24" class="P-Search-Group">
      <Form inline ref="SearchFilter" v-model="SearchFilter" onsubmit="return false;">
        <FormItem class="P-MB-10">
           <Select class="P-W-200" placeholder="筛选状态" v-model="SearchFilter.IsEnable" :options="EnableDrop" />
          <!-- <Select class="P-W-200" placeholder="筛选状态" v-model="SearchFilter.IsEnable" filterable clearable>
						<Option v-for="(Item, Index) in EnableDrop" :value="$Enums.Public.Enable[Item]" :key="Index">{{ Item }}</Option>
					</Select> -->
        </FormItem>
				<FormItem class="P-MB-10 P-ML-10">
					<Input placeholder="搜索关键字" class="P-W-400" v-model="SearchFilter.KeyWord" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.DataField" :options="SearchTypeDrop" />
          <!-- <Select slot="prepend" class="P-W-100" placeholder="关键词" v-model="SearchFilter.DataField" filterable clearable >
            <Option v-for="(Item, Index) in SearchTypeDrop" :key="Index" :value="$Enums.CustomerService.EmailAccountSearchType[Item]">{{ Item }}</Option>
          </Select> -->
					<Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
    </Col>
    <Col span="24">
      <Button class="P-MR-10 P-MB-10" type="primary" @click="TriggerOperate(1)" v-if="Powers.EmailAccountCreate">添加邮箱</Button>
      <ModifyEmailAccount ref="ModifyEmailAccount" @emit-operate-success="GetList" v-if="Powers.EmailAccountCreate || Powers.EmailAccountModify" />
      <ChangeStatus ref="ChangeStatus" class="P-MB-10 P-VA-T" @emit-change="TriggerChangeStatus" v-if="Powers.ChangeEmailAccountStatus" />
      <AuthorizeUser ref="AutohrizeUser" v-if="Powers.EmailAccountBind" />
      <BindStore ref="BindStore" v-if="Powers.BindStore" />
    </Col>
     <Col span="24" class="P-MB-10">
      <Table ref="List" :columns="Cols" :data="List" size="small" stripe :height="CalculateHeight()"></Table>
    </Col>
    <Col span="24">
      <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageSizeOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
    </Col>
  </Row>  
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PInterface from '@/assets/Interface/Public'
import Interface from '@/assets/Interface/CustomerService'

@Component({
  name: 'EmailAccount',
  components: {
    ChangeStatus: () => import('@/components/Public/ChangeStatus.vue'),
    ModifyEmailAccount: () => import('@/components/CustomerService/Mail/ModifyEmailAccount.vue'),
    AuthorizeUser: () => import('@/components/CustomerService/Mail/AuthorizeUser.vue'),
    BindStore: () => import('@/components/CustomerService/Mail/BindStore.vue')
  }
})

export default class EmailAccount extends Vue {
  private mounted(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['EmailAccountCreate', 'EmailAccountModify', 'EmailAccountBind', 'ChangeEmailAccountStatus', 'BindStore']))
    this.GetList()
  }

  private CalculateHeight(): number {
    let Flag = this.Powers.EmailAccountCreate || this.Powers.ChangeEmailAccountStatus
    return this.$UI.FullHeight() - (Flag ? 250 : 210);
  }

  private GetOperates(S: boolean): PInterface.KV[] {
    let Os: PInterface.KV[] = []
    this.Powers.EmailAccountModify ? Os.push({ Key: '编辑', Value: 2 }) : null
    this.Powers.EmailAccountBind ? Os.push({ Key: '授权用户', Value: 3 }) : null
    this.Powers.BindStore ? Os.push({ Key: '绑定店铺', Value: 4 }) : null
    if(this.Powers.ChangeEmailAccountStatus){
      Os.push({ Key: S ? '禁用' : '启用', Value: S ? 6 : 5 })
    }
    return Os;
  }

  private ChangePage(N: number): void {
    this.$set(this.Pager, 'PageIndex', N);
    this.GetList();
  }

  private ChangePageSize(N: number): void {
    this.$set(this.Pager, 'PageSize', N);
    this.GetList();
  }
  private SearchList(): void {
    this.ChangePage(1)
  }
  private ResetList(): void {}

  private GetList(): void {
    this.$UI.Loading.Show()
    this.$Request.Post({
      Server: this.$Server.CustomerService,
      Api: {
        Address: this.$Api.GetEmailAccountList,
        Login: true
      },
      Data: {
        PageIndex: this.Pager.PageIndex,
        PageSize: this.Pager.PageSize,
        Conditions: this.SearchFilter
      },
      Callback: (Res: PInterface.Res):void => {
        this.$UI.Loading.Hide()
        if(Res.IsSuccess){
          this.$set(this, 'List', Res.Data.PageModel.Items)
          this.$set(this.Pager, 'TotalItems', Res.Data.PageModel.TotalItems)
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  /* T: 1-添加邮箱 2-编辑邮箱 3-授权用户 4-绑定店铺 5-启用 6-禁用 */
  private TriggerOperate(T: number, D: Interface.EmailAccountInfo = new Interface.EmailAccountInfo): void {
    switch(T){
      case 1:
      case 2:
        (this as any).$refs.ModifyEmailAccount.Trigger(D || new Interface.EmailAccountInfo());
        break;
      case 3:
        (this as any).$refs.AutohrizeUser.Trigger(D.Id);
        break
      case 4:
        (this as any).$refs.BindStore.Trigger(D.Id);
        break
      case 5:
      case 6:
        this.ChangeStatus.ToTarget = T === 5;
        (this as any).$refs.ChangeStatus.TriggerModal(D.Id ? [D] : (this as any).$refs.List.getSelection(), this.ChangeStatus)
        break;
      
    }
  }

  private TriggerChangeStatus(Res: boolean, T?: number): void {
    if(Res){
      this.GetList()
    }else{
      if(typeof T === 'number'){
        this.TriggerOperate(T === 1 ? 5 : 6);
      }
    }
  }

  private Powers: PInterface.Power = {}

  private EnableDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable)
  private SearchTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.CustomerService.EmailAccountSearchType)
  private SearchFilter: Interface.SearchEmailAccount = new Interface.SearchEmailAccount()
  private Pager: PInterface.Pager = new PInterface.Pager()
  private List: Interface.EmailAccountInfo[] = []

  private ChangeStatus: PInterface.ChangeStatus = { Server: this.$Server.CustomerService, Api: this.$Api.EmailAccountEnable, TipsKey: '邮箱', IdKey: 'Id', StatusKey: 'IsEnable', ToTarget: false }

  private Cols: PInterface.TableCol[] = [{
    type: 'selection', width: 60, align: 'center'
  }, {
    title: '编号',
    key: 'Id',
    width: 120
  }, {
    title: '名称',
    key: 'Name'
  }, {
    title: '邮箱',
    key: 'Account'
  }, { 
    title: '添加日期',
    width: 160,
    render: (h: any, Params: any): string => {
      return h('span', this.$UI.Render.Date(Params.row.Created, true))
    }
  }, {
    title: '状态',
    width: 80,
    render: (h: any, Params: any): string => {
      return h('span',{
        class: Params.row.IsEnable ? 'P-Text-Info' : 'P-Text-Error'
      }, Params.row.IsEnable ? '已启用' : '已禁用')
    }
  }, {
    title: '操作',
    width: 100,
    render: (h: any, Params:any): string => {
      const Operations = this.GetOperates(Params.row.IsEnable);
      return h(
        "Dropdown",
        {
          on: {
            "on-click": (N: number) => {
              this.TriggerOperate(N, Params.row);
            }
          }
        },
        [
          h("a", [
            h("span", { class: "P-MR-5" }, "操作"),
            h("Icon", { props: { type: "ios-arrow-down" } })
          ]),
          h(
            "DropdownMenu",
            { slot: "list" },
            Operations.map((item: PInterface.KV): string => {
              return h(
                "DropdownItem",
                { props: { name: item.Value }, class: "P-TA-C" },
                item.Key
              );
            })
          )
        ]
      );
    }
  }]
}

</script>
<style lang="less" scoped>

</style>