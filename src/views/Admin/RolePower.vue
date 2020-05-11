<!-- 角色权限 -->
<template>
  <Row class="Role-View">
    <Col span="24">
      <Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
        <FormItem class="P-MB-10">
          <Input placeholder="搜索关键字" class="P-W-300" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Button slot="append" type="primary" @click="SearchList">搜索</Button>
          </Input>
        </FormItem>
        <FormItem class="P-ML-10 P-MB-10">
          <Button type="warning" @click="ResetList">重置</Button>
        </FormItem>
      </Form>
		</Col>
    <Col span="24">
      <ModifyRole class="P-MB-10" v-if="Powers.RoleModify || Powers.RoleAdd" :SelectedData="Selected" :ShowModal="ShowRoleModal" @handle-res-msg="HandleResMsg"></ModifyRole>
      <ChangeStatus class="P-MB-10" ref="ChangeStatus" v-if="Powers.RoleStatus" @emit-change="EmitChange"></ChangeStatus>
    </col>
		<Col span="24">
		  <Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()" ref="RoleTable" @on-selection-change="GetSelected"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		  <Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Admin';

@Component({
  name: 'RolePower',
  components: {
    ChangeStatus: () => import('../../components/Public/ChangeStatus.vue'),
    ModifyRole: () => import('../../components/Admin/ModifyRole.vue'),
	}
})

export default class RolePower extends Vue {
  private mounted() :void {
    this.GetPoints()
  }

  /* methods Start */
	//获取权限
  private GetPoints(): void {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['RoleView', 'RoleAdd', 'RoleModify', 'RoleStatus']))
    this.SetOperateDrop()
  }
  
  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.RoleModify ? Drops.push({ Key: '编辑', Value: 1 }) : null;
		this.Powers.RoleStatus ? Drops.push({ Key: '启禁用', Value: 2 }) : null;
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

  // 获取列表数据
  private GetList(): void {
		this.$UI.Loading.Show();
		this.$set(this, 'List', []);
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.RoleGetList,
				Login: true
			},
			Data: { PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize, Conditions: this.SearchForm },
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
  private GetSelected(data: Interface.Role[] ): void{
    this.$set(this, 'Selected', data)
  }

	// 取消全选
  private CancelSelect():void {
    (this.$refs["RoleTable"] as any).selectAll(false);
    this.$set(this, 'Selected', [])
  }

	// 搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	// 重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
		this.$set(this, 'SearchForm', new Interface.RoleSearch());
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
  
  // 计算表格高度
	private CalculateTbHeight(): number {
		return window.innerHeight - 250;
	}

  // 列表操作列 
  // 1-编辑角色 2-启禁用
  private OperateGroup(Type:number, Idx?:number): void{ 
    this.CancelSelect()
    this.$set(this, 'Selected', typeof Idx === 'number' ? [JSON.parse(JSON.stringify(this.List[Idx]))] : [])
    switch(Type){
      case 1:
        this.$set(this, 'ShowRoleModal', true)
        break;
      case 2:
				this.ChangeStatusObj.ToTarget= !this.Selected[0].IsEnable;
        (this.$refs["ChangeStatus"] as any).TriggerModal(this.Selected, this.ChangeStatusObj);
        break;
    }
  }

  // 按钮操作项
  // 1-添加组织
  private OperateBtnGroup(Type: number, Idx?: number | number[]): void {
    switch(Type) {
      case 1:
        this.$set(this, 'ShowOrganizationModal', true);
        break;
      case 2:
        this.$set(this, 'ShowUserSettingModal', true);
    }
  }

  //子组件回调  0-不操作 1-启禁用操作成功 2-添加菜单模态框 3-添加/编辑操作成功
  private HandleResMsg(Type: number){
    this.CancelSelect()
    this.$set(this, 'ShowRoleModal', false)
    this.$set(this, 'SingleChange', false)

    if(Type == 1){
      this.GetList()
    }else if(Type == 2){
      this.OperateGroup(1)
    }else if(Type == 3){
      this.GetList()
    }
  }

  /*
	批量禁启用组件回调
		Res true-操作成功
		Target  1-启用 0-禁用
	*/
	private EmitChange(Res: boolean, Target?: number){

		if(Target !== undefined){
			this.ChangeStatusObj.ToTarget = Target === 1 ? true : false;
			(this.$refs["ChangeStatus"] as any).TriggerModal(this.Selected, this.ChangeStatusObj);
		}else{
			this.CancelSelect()
		}

		if(Res){
      this.GetList()
		}
	}
  
  /* methods End */
  
  private Powers: PInterface.Power = {} // 权限
  private ChangeStatusObj: PInterface.ChangeStatus = { Server: this.$Server.Admin, Api: this.$Api.RoleChangeStatus, IdKey: 'Id', StatusKey: 'Status', ToTarget: false, TipsKey: '角色' };  //禁启用
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private SearchForm: Interface.RoleSearch = new Interface.RoleSearch(); //筛选数据

  private ShowRoleModal: boolean = false; // 模态框 - 添加/编辑 角色权限

  private Selected: Interface.Role[] = []; // 列表选中数据
  private List: Interface.Role[] = []; // 列表数据源
  private Cols: PInterface.TableCol[] = [
    { type: 'selection', width: 60, align: 'center' },
		{ title: '序号', key: 'Id', width: 80 },
    { title: '角色', key: 'RoleName', width: 200 },
    { title: '角色描述', key: 'Description', className: 'Copy-Url', width: 400, 
      render: (h: any, params: any): string => {
        return h('Tooltip', {
          props: {
            'content': (params.row as any).Description,
            'maxWidth': 600
          },
          class: 'P-W-100-Percent'
        }, [
          h('p', {
            class: 'P-LINE-1 P-Copy-Content P-MT-5'
          }, (params.row as any).Description === "" ? '-' : (params.row as any).Description ),
          h('Icon', {
            props: {
              type: 'md-copy',
              size: 16
            },
            class: 'P-Copy-Icon',
            style: 'display: none',
            on: {
              click: ():void => {
                this.Copy((params.row as any).Description === "" ? '-' : (params.row as any).Description);
              }
            }
          })
        ])
      }},
    { title: '权限', key: 'Resources', className: 'Copy-Url',
      render: (h: any, params: any): string => {
        return h('Tooltip', {
          props: {
            'content': (params.row as any).Resources,
            'maxWidth': 600
          },
          class: 'P-W-100-Percent'
        }, [
          h('p', {
            class: 'P-LINE-3 P-Copy-Content P-MT-5'
          }, (params.row as any).Resources === "" ? '-' : (params.row as any).Resources ),
          h('Icon', {
            props: {
              type: 'md-copy',
              size: 16
            },
            class: 'P-Copy-Icon',
            style: 'display: none',
            on: {
              click: ():void => {
                this.Copy((params.row as any).Resources === "" ? '-' : (params.row as any).Resources);
              }
            }
          })
        ])
      }
    },
    { title: '状态', key: 'IsEnable', width: 80,
      render: (h: any, params: any): string => {
				return h('Icon', {
          props: { 
            type: params.row.IsEnable ? 'md-checkmark' : 'md-close',
            size: '18'
          },
					class: params.row.IsEnable ? 'P-Text-Success' : 'P-Text-Error'
				})
      }
    },
    { title: '操作', width: 140, render: (h: any, params: any): string => {
        return h('div', this.OperateDrop.map( (item:PInterface.KV, index: number )=>{
          return h('Button', {
            props: {
              type: (item.Value === 2 && params.row.IsEnable) ? 'error' : 'primary',
              size: 'small'
            },
            class: index === 0 ? 'P-MR-5' : '',
            on: {
              click: () => {
                this.OperateGroup(Number(item.Value), params.row._index)
              }
            }
          }, item.Value == 2 ? (params.row.IsEnable ? '禁用' : '启用') : item.Key )
        }))
      }
    }
  ];
}
</script>

<style lang="less">

</style>