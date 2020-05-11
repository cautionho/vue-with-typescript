<!-- 组织架构 -->
<template>
  <Row class="Organization-View">
    <Col :span="ControllViewSpan">
      <Row>
        <Col :span="24">
          <div class="Tree-Title P-BG-Info">
            <Icon type="md-list" size="16" :class="[{ 'Icon-Transition-Center': ControllViewSpan === 1 }, {'Icon-Transition-Right': ControllViewSpan !== 1 }, 'Icon-Transition', 'P-BG-Info P-Pointer', 'P-Text-White', 'P-MR-5' ]" @click="IsShowTreeLeft"/>
          </div>
        </Col>
      </Row>
      <Row :class="[{ 'Row-Transition-Fade': ControllViewSpan === 1 },'Row-Transition', 'P-MT-10' ]">
        <div class="Tree-Wrap">
          <Tree :data="Tree" :render="renderContent" class="P-Inline-Block" v-show="ControllViewSpan === 3"></Tree>
        </div>
      </Row>
    </Col>
    <Col :span="24 - ControllViewSpan">
      <Col span="24" class="P-PL-10">
        <Form inline v-model="SearchForm" ref="SearchForm" onsubmit="return false">
          <FormItem class="P-MB-10">
            <Dropdown trigger="custom" :visible="AccurateSearch" placement="bottom-start">
              <Button type="primary" @click="TriggerSearch">
                精准搜索
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <Col span="24" slot="list" class="P-P-10">
              <Select class="P-W-200 P-ML-10" placeholder="岗位" v-model="SearchForm.PositionId" :options="DropPositionList" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="岗位" v-model="SearchForm.PositionId" filterable clearable>
                  <Option v-for="item in DropPositionList" :key="item.Value" :value="item.Value">{{ item.Key }}</Option>
                </Select> -->
                <Select class="P-W-200 P-ML-10" placeholder="在职状态" v-model="SearchForm.Status" :options="DropUserStatus" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="在职状态" v-model="SearchForm.Status" filterable clearable>
                  <Option v-for="(item, index) in DropUserStatus" :key="index" :value="$Enums.User.Status[item]">{{ item }}</Option>
                </Select> -->
                <Select class="P-W-200 P-ML-10" placeholder="仓库" v-model="SearchForm.WarehouseId" :options="DropWarehouseList" />
                <!-- <Select class="P-W-200 P-ML-10" placeholder="仓库" v-model="SearchForm.WarehouseId" filterable clearable>
                  <Option v-for="item in DropWarehouseList" :key="item.Value" :value="item.Value">{{ item.Key }}</Option>
                </Select> -->
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.StartTime" type="date" placeholder="入职开始日期"></DatePicker>
                <DatePicker class="P-W-200 P-ML-10" v-model="SearchForm.EndTime" type="date" placeholder="入职结束日期"></DatePicker>
              </Col>
            </Dropdown>
            <FormItem class="P-ML-10">
              <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey">
              <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchType" :options="SearchKeyTypeDrop" />
                <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchType" filterable clearable>
                  <Option v-for="(item, index) in SearchKeyTypeDrop" :key="index" :value="$Enums.User.SearchType[item]">{{item}}</Option>
                </Select> -->
                <Button slot="append" type="primary" @click="SearchList">搜索</Button>
              </Input>
            </FormItem>
          </FormItem>
          <FormItem class="P-MB-10">
            <Button type="warning" @click="ResetList">重置</Button>
          </FormItem>
        </Form>
      </Col>
      <Col span="24" class="P-PL-10">
        <ModifyOrganization class="P-MB-10 P-VA-T" ref="ModifyOrganization" v-if="Powers.OrgModify || Powers.OrgAdd"  @handle-res-msg="HandleOrganization"  />
        <ModifyUser class="P-MB-10 P-VA-T" ref="ModifyUser" v-if="Powers.UserAdd || Powers.UserModify"  :TreeOrganization="Tree" @handle-res-msg="HandleUser"  />
        <ModifySetting class="P-MB-10 P-VA-T" v-if="IsModifySetting()" ref="ModifySetting" :Powers="Powers" @handle-res-msg="HandleSetting"  />
        <Button v-if="Powers.UserResetPwd" class="P-MB-10" type="primary" @click="HandleResetPassword">重置密码</Button>
      </Col>
      <Col span="24" class="P-MB-10 P-PL-10">
        <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" @on-selection-change="GetSelected" ref="OrganizationTable"></Table>
      </Col>
      <Col span="24" class="P-PL-10">
        <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize"/>
      </Col>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Admin';

@Component({
  name: 'Organization',
  components: {
    ModifyUser: () => import('../../components/Admin/ModifyUser.vue'),
    ModifyOrganization: () => import('../../components/Admin/ModifyOrganization.vue'),
    ModifySetting: () => import('../../components/Admin/ModifyUserSetting.vue'),
	}
})

export default class Organization extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private async GetPoints(): Promise<void> {
    await this.GetTree()
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['OrgAdd','OrgModify','OrgDelete','UserAdd','UserModify','UserSetOrg','UserSetWarehouse','UserSetPosition','UserSetStatus','UserResetPwd']))
    this.$set(this, 'DropWarehouseList', await this.GetDropList<object, PInterface.KV>(this.$Server.Settings, this.$Api.GetWarehouseDropList, { IsEnable: true, Type: [1, 5] }) )
    this.$set(this, 'DropPositionList', await this.GetDropList<boolean, PInterface.KV>(this.$Server.Admin, this.$Api.GetPositionDropList, true ) )
    this.$set(this, 'DropUserList', await this.GetDropList<string, PInterface.KV>(this.$Server.Admin, this.$Api.GetUserDropList, "" ) )
    this.SetOperateDrop()
  }

  private IsModifySetting(): boolean {
    return this.Powers.UserSetOrg || this.Powers.UserSetWarehouse || this.Powers.UserSetPosition || this.Powers.UserSetStatus
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.UserModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.UserResetPwd ? Drops.push({ Key: '重置密码', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

  // 获取 仓库 / 岗位 / 用户 下拉 
  private GetDropList<T, S>(Server: String, Api: String, Data: T ):Promise<S> {
    return new Promise( (resolve: (Val: S)=>void ) => {
      this.$Request.Post({
			  Server: Server,
			  Api: {
				  Address: Api
			  },
			  Data: Data,
	  		Callback: (Res: PInterface.Res): void => {
	  			if (Res.IsSuccess) {
            resolve(Res.Data.DropList)
		  		} else {
           this.$Request.Error(Res);
		  		}
		  	}
	  	})
    })
  }

  // 收缩展示
  private IsShowTreeLeft():void {
    this.ControllViewSpan = this.ControllViewSpan === 1 ? this.ControllViewSpan += 2 :this.ControllViewSpan -= 2;
  }

  // 获取组织架构树
  private GetTree(): void {
    this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.OGetOrganizationTree,
				Login: true
			},
			Data: true,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this, 'Tree', Res.Data.Tree)
          this.IntegratedData(this.Tree)
				} else {
					this.$Request.Error(Res);
				}
			}
		})
  }

  // 整合成树组件、级联菜单需要的数据结构以及默认打开树激活节点
  private IntegratedData(Data: Interface.OrganizationTree[]):void{
    Data.forEach((item: Interface.OrganizationTree) => {
      this.$set(item, 'title', item.Name)
      this.$set(item, 'children', item.ChildNodes)
      this.$set(item, 'value', item.Id.toString())
      this.$set(item, 'label', item.Name)
      if ( item.ChildNodes.length > 0 ) {
        this.IntegratedData(item.ChildNodes)

        for ( let i = 0; i < item.ChildNodes.length; i++ ) {
          if ( this.CurrTreeDomId.length > 0 ) {
            if ( item.ChildNodes[i].Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1]) ) {
              this.$set(item.ChildNodes[i], 'selected', true)
            }else if(item.Id == Number(this.CurrTreeDomId[this.CurrTreeDomId.length-1])){ //第一级激活状态
              this.$set(item, 'selected', true)
            }

            for(let j = 0; j < this.CurrTreeDomId.length; j++){     //展开激活的树节点
              if( item.ChildNodes[i].Id == Number(this.CurrTreeDomId[j] )){
                this.$set(item.ChildNodes[i], 'expand', true)
                this.$set(item, 'expand', true)
              }
            }
          }
        }
      }
    })
  }

  //点击左侧树节点
  private SelectTree(Node: Interface.OrganizationTree, Root: []):void{
    this.$set(this.SearchForm, 'OrganizationId', this.CurTreeId)
    // 判断是否为根 子节点
    if ( Node.ParentId === 0){
      this.$set(this, 'CurrTreeDomId', [this.CurTreeId.toString()])
    } else{
      this.CurrTreeDomId.splice(0, this.CurrTreeDomId.length, ...[])
      this.GetParentId(Root, Node);
    }
    this.GetList()
  }

  // 获取子节点的父节点，递归直至父节点为0，组合为数组
  private GetParentId(Root: any[], Node: Interface.OrganizationTree):void{
    // 插入当前节点Id
    this.CurrTreeDomId.unshift( Node.Id.toString() );

    // 父节点为0结束
    if (Node.ParentId === 0) return

    // 查找父节点
    for (let item in Root ) {
      if(Root[item].node.Id === Node.ParentId) {
        this.GetParentId(Root, Root[item].node)
      }
    }
  }

  // 树结构 Render方法
  private renderContent(h: any, { root, node, data }: any):any {
    // 存储根节点
    if (this.TreeRoot.length === 0) this.$set(this, 'TreeRoot', root);
    return h('span', {
      style: {
        display: 'inline-block'
      },
      class: 'P-ML-10 Tree-BtnGroup P-Pointer'
    }, [
      h('img', {
        attrs: {
          src: `/img/${data.Icon.split("/")[data.Icon.split("/").length - 1]}`
        },
        style: {
          display: ( data.Icon !== "" ? 'inline-block' : 'none' ),
          verticalAlign: 'middle',
          marginRight: '2px'
        }
      }),
      h('span', {  
        attrs: {
          dataKey: `${data.Id}`
        },
        style: { verticalAlign: 'middle' },
        class: 'P-P-5 Tree-Text',
        on: {
          click: () => {
            // 树样式
            document.querySelectorAll(`.Tree-Text`).forEach( (Elem: Element):void => Elem.classList.remove("Tree-Active"));
            if (this.LastActiveNodeKey !== data.Id) {
              (document.querySelector(`span[datakey='${data.Id}']`) as Element).classList.add("Tree-Active");
            }
            this.LastActiveNodeKey = this.LastActiveNodeKey !== data.Id ? data.Id : ""
            this.CurTreeId = this.CurTreeId === data.Id ? 0 : data.Id
            this.SelectTree(data, root)
          },
          mouseenter: () => {
            (document.querySelector(`span[datakey='${data.Id}']`) as Element).classList.add("Tree-Hover");
          },
          mouseleave: () => {
            (document.querySelector(`span[datakey='${data.Id}']`) as Element).classList.remove("Tree-Hover");
          }
      }}, data.title),
      h('span', {
        style: {
          display: 'none',
          float: 'right',
        },
        class: 'P-ML-10 Tree-Btn'
      }, [
        h('Icon', {
          props: { type: 'md-create', size: '12' },
          style: {
            display: ( this.Powers.OrgModify && data.Icon === "" ? 'inline-block' : 'none' )
          },
          class: 'P-MR-5',
          on: {
            click: () => { 
              this.$set(this.SelectedOrgMsg, 'Id', data.Id);
              this.$set(this.SelectedOrgMsg, 'Name', data.Name);
              this.$set(this.SelectedOrgMsg, 'ParentId', data.ParentId);
              this.$set(this.SelectedOrgMsg, 'PrincipalId', data.PrincipalId);
              this.HandleOrganization(2)
            }
          }
        }),
        h('Icon', {
          props: { type: 'ios-trash', size: '12' },
          style: {
            display: ( this.Powers.OrgDelete && data.Icon === "" ? 'inline-block' : 'none' )
          },
          on: {
            click: () => { this.HandleDeleteOrganization(data) }
          }
        })
      ])
    ]);
  }

  // 获取列表数据
  private GetList(): void {

    let PostData: any = JSON.parse(JSON.stringify(this.SearchForm))
    PostData.PositionId = PostData.PositionId === "" ? 0 : PostData.PositionId;
    PostData.OrganizationId = PostData.OrganizationId === "" ? 0 : PostData.OrganizationId;
    PostData.WarehouseId = PostData.WarehouseId === "" ? 0 : PostData.WarehouseId;
    PostData.Status = PostData.Status === "" ? 0 : PostData.Status;
    PostData.SearchType = PostData.SearchType === "" ? 0 : PostData.SearchType;
    PostData.StartTime = PostData.StartTime === "" ? "" : this.$UI.Render.NewDate( PostData.StartTime, true);
    PostData.EndTime = PostData.EndTime === "" ? "" : this.$UI.Render.NewDate( PostData.EndTime, true);

		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.UsersGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: PostData },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
					this.$set(this, 'List', Res.Data.PageModel.Items);
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}

	// 获取列表复选框选中的数据
  private GetSelected(data: Interface.Organization[] ): void{
    this.$set(this, 'Selected', data)
  }

	// 取消全选
  private CancelSelect():void {
    (this.$refs["OrganizationTable"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 搜索
  private SearchList(): void{
    this.AccurateSearch = false;
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	// 重置
	private ResetList(): void{
    this.AccurateSearch = false;
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.SearchOrganization() )
		this.GetList();
	}
	
	//  切换列表条数
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}
	
	//  切换列表页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
  }
  
  //  获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 215;
		for(let item in this.Powers){
			if(this.Powers[item] && !(['OrgModify','OrgDelete','UserModify'].some(Itm => Itm === item))){
				Flag = 255;
			}
		}
		return (window.innerHeight - Flag);
  }	

  // 列表操作列 
  // 1-编辑用户 2-重置密码
  private OperateGroup(Type:number, Idx?:number): void{
    this.CancelSelect()
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : []);
    switch(Type){
      case 1:
        (this.$refs['ModifyUser'] as Vue).Trigger({
          SelectedData: this.Selected,
          DropWarehouseList: this.DropWarehouseList, 
          DropPositionList: this.DropPositionList,
          CurOrganizationId: this.CurrTreeDomId 
        })
        break;
      case 2:
        this.HandleResetPassword()
        break;
    }
  }

  // 按钮操作项
  // 1-添加组织
  private OperateBtnGroup(Type: number, Idx?: number | number[]): void {
    switch(Type) {
      case 1:
        (this.$refs['ModifyOrganization'] as Vue).Trigger({
          SelectedData: this.SelectedOrgMsg,
          UserDropList: this.DropUserList,
          TreeOrganization: this.Tree,
          CurOrganizationId: this.CurrTreeDomId 
        })
        break;
      case 2:
        (this.$refs['ModifySetting'] as Vue).Trigger({
          SelectedData: this.Selected,
          TreeOrganization: this.Tree,
          CurOrganizationId: this.CurrTreeDomId,
          DropWarehouseList: this.DropWarehouseList,
          DropPositionList: this.DropPositionList,
          DropUserStatus: this.DropUserStatus
        });
        break;
    }
  }
 
  // 添加/编辑 用户 模态框 子组件回调
  // 0 - 取消， 1 - 编辑或添加 2 - 触发打开模态框
  private HandleUser(Type: number): void{

    if (Type == 1) {
      this.CancelSelect()
      this.GetList()
    } else if(Type == 2) {
      this.OperateGroup(1)
    } else if(Type == 3) {
      this.CancelSelect()
      this.GetTree()
      this.GetList()
    }
  }
  
  // 添加、编辑组织
  // 0 - 取消， 1 - 编辑或添加 2 - 触发打开模态框
  private HandleOrganization(Type: number): void{
    if (Type === 1) {
      this.GetTree()
      this.GetList()
    } else if(Type === 2) {
      this.OperateBtnGroup(1)
    } else if (Type === 3) {
      this.$set(this, "SelectedOrgMsg", new Interface.ModifyOrganization())
      this.OperateBtnGroup(1)
    }
  }

  // 删除组织
  private HandleDeleteOrganization(Node: Interface.OrganizationTree): void {
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否删除组织${Node.Name}`,
      Callback: (Res: boolean):void => {
        if (Res) {
          this.PostDeleteOrganization([Node.Id]);
        }
      }
    })
  }
  
  // 发送 删除组织 请求
  private PostDeleteOrganization(Ids: number[]): void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.OrganizationDelete,
				Login: true
			},
			Data: Ids,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `删除组织成功`);
          if (this.CurrTreeDomId.length > 0) {
            this.CurrTreeDomId.splice(-1,1)
          }
          this.HandleOrganization(1)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  // 设置组织 设置仓库 设置岗位 设置在职状态
  // 0 - 取消， 1 - 编辑或添加 2 - 触发打开模态框
  private HandleSetting(Type: number): void {
    if (Type === 1) {
      this.CancelSelect()
      this.GetTree()
      this.GetList()
    } else if(Type == 2) {
      this.OperateBtnGroup(2)
    } 
  }

  // 重置密码
  private HandleResetPassword():void {
    if (this.Selected.length === 0 ) {
      this.$UI.Tips.Floating('warning', `请选择用户进行重置密码操作`);
    } else {
      this.$UI.Tips.Modal({
        Type: 'confirm',
        Content: '是否重置选中用户的密码',
        Callback: (Res: boolean):void => {
          if (Res) {
            this.PostResetPassword();
          }
        }
      })
    }
    
  }

  // 发送 重置密码 请求
  private PostResetPassword(): void {
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.UserResetPwd,
				Login: true
			},
			Data: { Id: this.Selected.map( (Item: Interface.Organization): number => Item.Id ) },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `重置密码成功`);
          this.HandleSetting(1)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  // 触发“精准搜索”按钮
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}
  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限
  private AccurateSearch: Boolean = false;

  private DropUserStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.Status); // 用户状态枚举下拉
  private DropWarehouseList: PInterface.KV[] = [];  // 仓库下拉
  private DropPositionList: PInterface.KV[] = [];  // 岗位下拉
  private DropUserList: PInterface.KV[] = []; // 用户下拉
  
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.SearchOrganization = new Interface.SearchOrganization(); //筛选数据
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.SearchType) // 搜索关键词

  private TreeRoot: any[] = []; // 树 根存储 
  private Tree: Interface.OrganizationTree[] = [] //左侧树数据
  private CurrTreeDomId: string[] = []  // 当前编辑数据的父节点Id数组(左侧树激活状态节点Id)
  private CurTreeId: number = 0; // 当前选中树节点ID
  private LastActiveNodeKey: number | "" = ""; // 记录上一位点击的树节点

  private SelectedOrgMsg: Interface.ModifyOrganization = new Interface.ModifyOrganization(); // 修改组织默认值

  private ControllViewSpan: number = 3; //

  private Selected: Interface.Organization[] = []; // 列表选中数据
  private List: Interface.Organization[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '编号', key: 'UserCode', width: 100 },
		{ title: '姓名', key: 'UserName', width: 120 },
		{ title: '性别', key: 'Sex', width: 80, render: (h: any, params: any): string => h('div', {}, params.row.Sex === 1 ? '男' : '女') },
		{ title: '岗位', key: 'PositionName' },
		{ title: '组织', key: 'OrganizationName' },
		{ title: '联系电话', key: 'TelePhone' },
		{ title: '电子邮箱', key: 'Email' },
		{ title: '入职时间', key: 'CreateTime', width: 160, render: (h: any, params: any): string => h('div', {}, this.$UI.Render.Date( params.row.CreateTime, true)) },
		{ title: '仓库', key: 'WarehouseName' },
    { title: '状态', key: 'Status', width: 80,
      render: (h: any, params: any): string => {
			  return h('div', {
          class: ['P-Text-Title', 'P-Text-Warning', 'P-Text-Info', 'P-Text-Success', 'P-Text-Error'][params.row.Status - 1]
        }, this.$Enums.User.Status[params.row.Status] )
      }
    },
    { title: '操作', width: 160, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (item: PInterface.KV    , index: number )=>{
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            class: index == 0 ? 'P-MR-5' : '',
            on: {
              click: () => {
                this.OperateGroup(Number(item.Value), params.row._index)
              }
            }
          }, item.Key )
        }))
      }
    }
  ];
}
</script>

<style lang="less">
@import '../../assets/Theme/Color.less';
.ivu-menu-dark{
  background-color: @primary-color;
}
.Organization-View {
  
  .Row-Transition{
    transition:all 0.2s linear;
  }
  .Row-Transition-Fade{
    opacity: 0;
  }
  .ivu-col-span-1 {
    transition:all 0.2s linear;
  }

  .ivu-col-span-3{
    transition:all 0.2s linear;
  }

  .ivu-col-span-21{
    transition:all 0.2s linear;
  }
  
  .ivu-col-span-23 {
    transition:all 0.2s linear;
  }

  .Tree-Title {
    height: 30px;
    line-height: 30px;
    display: block;
  }
  .Icon-Transition{
    transition:all 0.2s linear;
  }
  .Icon-Transition-Right{
    margin: 0 0 0 85%;
  }
  .Icon-Transition-Center{
    margin: 0 0 0 38%;
  }

  .Tree-Wrap{
    height: calc(100vh - 165px);
    overflow: auto;
  }

  .Tree-BtnGroup:hover {
    & > .Tree-Btn {
      display: inline-block !important;
    }
  }
  .Tree-Hover {
    color: @info-color;
  }
  .Tree-Active {
    background: @primary-color;
    color: @white;
    border-radius: 5px;
  }
}





</style>