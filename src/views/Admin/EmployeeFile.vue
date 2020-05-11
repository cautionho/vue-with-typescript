<template>
	<Row class="Employee-File">
		<Col span="24">
		<Row class="P-Search-Group">
			<Form inline ref="SearchForm" v-model="SearchForm" onsubmit="return false">
				<Dropdown trigger="custom" :visible="AccurateSearch">
					<Button type="primary" @click="TriggerSearch">
						精准搜索
						<Icon type="ios-arrow-down"></Icon>
					</Button>
					<Col span="24" slot="list" class="P-PL-10 P-PB-10 P-PR-10">
          <Select class="P-W-200 P-ML-10" placeholder="筛选岗位" v-model="SearchForm.PositionId" :options="PositionDrop" />
					<!-- <Select class="P-W-200 P-ML-10" placeholder="筛选岗位" @on-change="OnClearSelect('PositionId')" v-model="SearchForm.PositionId" filterable clearable>
						<Option v-for="(item,index) in PositionDrop" :value="item.Value" :key="index">{{ item.Key }}</Option>
					</Select> -->
          <div class="P-W-200 P-ML-10 P-MT-10 P-Inline-Block">
					  <Cascader placeholder="筛选组织" :data="OrganizationDrop" change-on-select filterable clearable v-model="SearchForm.OrganizationId"></Cascader>
          </div>
          <div class="P-W-200 P-ML-10 P-MT-10 P-Inline-Block">
					  <Cascader placeholder="筛选地区" :data="CityList" change-on-select filterable clearable v-model="SearchForm.LocationProvince"></Cascader>
          </div>
          <Select class="P-W-200 P-ML-10 P-MT-10 P-VA-T" placeholder="筛选状态" v-model="SearchForm.Status" :options="DocStatusDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MT-10 P-VA-T" placeholder="筛选状态" @on-change="OnClearSelect('Status')" v-model="SearchForm.Status" filterable clearable>
						<Option v-for="(item,index) in DocStatusDrop" :value="$Enums.User.DocStatus[item]" :key="index">{{ item }}</Option>
					</Select> -->
          <Select class="P-W-200 P-ML-10 P-MT-10 P-VA-T" placeholder="筛选婚姻状态" v-model="SearchForm.MaritalStatus" :options="MaritalStatusDrop" />
          <!-- <Select class="P-W-200 P-ML-10 P-MT-10 P-VA-T" placeholder="筛选婚姻状态" @on-change="OnClearSelect('MaritalStatus')" v-model="SearchForm.MaritalStatus" filterable clearable>
						<Option v-for="(item,index) in MaritalStatusDrop" :value="$Enums.User.MaritalStatus[item]" :key="index">{{ item }}</Option>
					</Select> -->
          <DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.StartTime" type="date" placeholder="入职开始日期"></DatePicker>
          <DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.EndTime" type="date" placeholder="入职结束日期"></DatePicker>
          <DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.BirthSatrtTime" type="date" placeholder="出生开始日期"></DatePicker>
          <DatePicker class="P-W-200 P-ML-10 P-MT-10" v-model="SearchForm.BirthEndTime" type="date" placeholder="出生结束日期"></DatePicker>
          </Col>
				</Dropdown>
				<FormItem class="P-MB-10 P-ML-10">
          <Input placeholder="搜索关键字" class="P-W-400" v-model="SearchForm.SearchKey" @on-enter="SearchList">
          <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" v-model="SearchForm.SearchType" :options="SearchKeyTypeDrop" />
            <!-- <Select slot="prepend" class="P-W-100 P-TA-L" placeholder="搜索关键词" @on-change="OnClearSelect('SearchType')" v-model="SearchForm.SearchType" filterable clearable>
              <Option v-for="(item,index) in SearchKeyTypeDrop" :value="$Enums.User.EmployeeSearchType[item]" :key="index">{{item}}</Option>
            </Select> -->
            <Button slot="append" type="primary" @click="SearchList">搜索</Button>
					</Input>
				</FormItem>
				<FormItem class="P-ML-10 P-MB-10">
					<Button type="warning" @click="ResetList">重置</Button>
				</FormItem>
			</Form>
		</Row>
		</Col>
		<Col span="24">
		<Table :columns="Cols" :data="List" size="small" stripe :height="CalculateTbHeight()"></Table>
		</Col>
		<Col span="24" class="P-MT-10">
		<Page :current="Pager.PageIndex" :total="Pager.TotalItems" :page-size="Pager.PageSize" :page-size-opts="Pager.PageOpt" show-total show-sizer show-elevator @on-change="ChangePage" @on-page-size-change="ChangePageSize" />
		</Col>

    <!--核实模态框-->
    <Modal v-model="ConfirmRecord" title="核实档案" :mask-closable="false" :width="600" @on-cancel="CancelConfirmMsg">
      <h3 class="P-TA-C P-MB-10">入职信息</h3>
      <Form onsubmit="return false" ref="PostConfirmMsg" :model="PostConfirmMsg" :rules="PostConfirmRule" :label-width="110">
        <Row>
          <Col span="12">
            <Form-item label="姓名">
              <span v-if="ConfirmRecord">{{CurrSelectData.UserName}}</span>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="到职日期：">
              <span v-if="ConfirmRecord">{{CurrSelectData.CreateTime.split('T')[0]}}</span>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="部门：">
              <span v-if="ConfirmRecord">{{CurrSelectData.OrganizationName}}</span>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="职位：">
              <span v-if="ConfirmRecord">{{CurrSelectData.PositionName}}</span>
            </Form-item>
          </Col>
        </Row> 
        <Row>
          <Col span="12">
            <Form-item label="试用薪资：" prop="Salary.TrialSalary">
              <Input v-model="PostConfirmMsg.Salary.TrialSalary" placeholder="请输入试用薪资"></Input>
            </Form-item>
          </Col>
          <Col span="12">  
            <Form-item label="转正薪资：" prop="Salary.ToTurnSalary">
              <Input v-model="PostConfirmMsg.Salary.ToTurnSalary" placeholder="请输入转正薪资"></Input>
            </Form-item>
          </Col>
        </Row>   
        <Form-item label="转正日期：" prop="Salary.TryOutTime">
          <Date-picker v-model="PostConfirmMsg.Salary.TryOutTime" type="date" placeholder="选择转正日期" style="width: 100%"></Date-picker>
        </Form-item>
        <Form-item label="人事审核：" prop="ConfirmId">
          <Select v-model="PostConfirmMsg.ConfirmId" placeholder="请选择人事部审核人" :options="AdminList" />
          <!-- <Select v-model="PostConfirmMsg.ConfirmId" filterable clearable placeholder="请选择人事部审核人">
            <Option v-for="(item,index) in AdminList" :value="item.Value" :key="index">{{item.Key}}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="主管：" prop="SReviewId">
          <Select v-model="PostConfirmMsg.SReviewId" placeholder="请选择主管" :options="ReviewList" />
          <!-- <Select v-model="PostConfirmMsg.SReviewId" filterable clearable placeholder="请选择主管">
            <Option v-for="(item,index) in ReviewList" :value="item.Value" :key="index">{{item.Key}}</Option>
          </Select> -->
        </Form-item>
        <Form-item label="经理：" prop="MReviewId">
          <Select v-model="PostConfirmMsg.MReviewId" placeholder="请选择经理" :options="ManagerList" />
          <!-- <Select v-model="PostConfirmMsg.MReviewId" filterable clearable placeholder="请选择经理">
            <Option v-for="(item,index) in ManagerList" :value="item.Value" :key="index">{{item.Key}}</Option>
          </Select> -->
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="SubmitCheck">提审</Button>
        <Button @click="CancelConfirmMsg">取消</Button>
      </div>
    </Modal>
	</Row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Admin';
@Component({
  name: 'EmployeeFile'
})
export default class EmployeeFile extends Vue {
	private mounted() :void {
		this.GetPoints()
		this.GetPositionDrop()
    this.GetOrganizationDrop()
    this.GetCountry()
  }

  //获取权限
  private GetPoints(): void {
		this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['DocumentAdd', 'DocumentModify', 'DocumentConfirm', 'DocumentSReview', 'DocumentMReview', 'DocumentToReview', 'GetUserInfo']))
    this.SetOperateDrop()
  }

  //清空下拉选项时值为undefined 重新赋值为空
  // private OnClearSelect(S: string):void{
  //   if( (this as any).SearchForm[S] == undefined ){
  //     this.$set(this.SearchForm, S, '');
  //   }
  // }

  //列表操作列增加权限
  private SetOperateDrop(): void {
		let Drops: PInterface.KV[] = [];
		this.Powers.DocumentToReview ? Drops.push({ Key: '查看', Value: 1 }) : null;
		this.Powers.DocumentModify ? Drops.push({ Key: '编辑', Value: 2 }) : null;
		this.Powers.DocumentConfirm ? Drops.push({ Key: '核实', Value: 3 }) : null;
		this.Powers.DocumentSReview ? Drops.push({ Key: '审核', Value: 4 }) : null; //主管审核
		this.Powers.DocumentMReview ? Drops.push({ Key: '审核', Value: 5 }) : null; //经理审核
		this.OperateDrop.push(...Drops);
		this.GetList();
	}

	//切换精准搜索下拉菜单
	private TriggerSearch(): void {
		this.$set(this, 'AccurateSearch', !this.AccurateSearch);
	}

	// 获取岗位下拉
	private GetPositionDrop(): void {
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetPositionDropList,
				Login: true
			},
			Data: true,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'PositionDrop', Res.Data.DropList);
				} else {
					this.$Request.Error(Res);
				}
			}
		})
	}

	// 获取组织下拉
	private GetOrganizationDrop(): void {
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.OGetOrganizationTree,
				Login: true
			},
			Data: false,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.$set(this, 'OrganizationDrop', Res.Data.Tree);
					this.SetOrganizationMenu(this.OrganizationDrop)
				} else {
					this.$Request.Error(Res);
				}
			}
		})
	}

	//组装成级联菜单所要的数据结构
	private SetOrganizationMenu(Data: Interface.OrganizationTree[]): void{
		for (let Item in Data) {
			this.$set(Data[Item], 'title', Data[Item].Name);
			this.$set(Data[Item], 'label', Data[Item].Name);
			this.$set(Data[Item], 'value', Data[Item].Id.toString());
			if (Data[Item].ChildNodes.length != 0) {
				Data[Item]['children'] = Data[Item].ChildNodes;
				this.SetOrganizationMenu(Data[Item].children);
			}
		}
  }
  
  //获取地区下拉列表
  private GetCountry() :void{
    this.$Request.Post({
      Server: this.$Server.Settings,
      Api: {
        Address: this.$Api.ProvincialAreasGetTree,
        Login: false
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          let Data = Res.Data.Tree;
          for (let Item = 0; Item < Data.length; Item++) {
            this.CityList.push({
              value: Data[Item].Name,
              label: Data[Item].Name,
              children: [],
              ChildNodes: Data[Item].ChildNodes
            });
            for(let Itm in Data[Item].ChildNodes){
              this.CityList[Item].children.push({
                value: Data[Item].ChildNodes[Itm].Name,
                label: Data[Item].ChildNodes[Itm].Name,
                ChildNodes: Data[Item].ChildNodes[Itm].ChildNodes,
                children: []
              });
            }
          }
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //获取用户下拉
  private GetUserDropList(UserName:string, List:string) :void{
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.GetUserDropList,
        Login: true
      },
      Data: UserName,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this[List] = Res.Data.DropList;
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

	//获取列表
  private GetList(): void{
    let StartStamp = new Date(this.SearchForm.StartTime).getTime()
    let EndStamp = new Date(this.SearchForm.EndTime).getTime()
    if(StartStamp>EndStamp){
      this.$UI.Tips.Floating('warning', `入职时间区间中的开始时间不能晚于结束时间`);
      return;
    }

    let BirStartStamp = new Date(this.SearchForm.BirthSatrtTime).getTime()
    let BirEndStamp = new Date(this.SearchForm.BirthEndTime).getTime()
    if(BirStartStamp>BirEndStamp){
      this.$UI.Tips.Floating('warning', `出生日期区间中的开始时间不能晚于结束时间`);
      return;
    }
		this.$set(this, 'AccurateSearch', false);
		this.$set(this, 'List', [])
    let PostData = JSON.parse(JSON.stringify(this.SearchForm))
    PostData.StartTime = PostData.StartTime === "" ? "" : this.$UI["Render"].NewDate(PostData.StartTime, true)
    PostData.EndTime = PostData.EndTime === "" ? "" : this.$UI["Render"].NewDate(PostData.EndTime, true)
    PostData.BirthSatrtTime = PostData.BirthSatrtTime === "" ? "" : this.$UI["Render"].NewDate(PostData.BirthSatrtTime, true)
    PostData.BirthEndTime = PostData.BirthEndTime === "" ? "" : this.$UI["Render"].NewDate(PostData.BirthEndTime, true)
		PostData.OrganizationId = PostData.OrganizationId.length > 0 ? Number(PostData.OrganizationId.pop()) : 0
    PostData.LocationProvince = this.SearchForm.LocationProvince.length > 0 ? this.SearchForm.LocationProvince[0] : ""
    PostData.LocationCity = this.SearchForm.LocationProvince.length > 1 ? this.SearchForm.LocationProvince[1] : ""
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.GetUserDocumentList,
				Login: true
			},
			Data: { Conditions: PostData, PageIndex: this.Pager.PageIndex, PageSize: this.Pager.PageSize },
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
					this.Pager.TotalItems = Res.Data.PageModel.TotalItems;
          this.$set(this, 'List', Res.Data.PageModel.Items)
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
	}
	
	//搜索
  private SearchList(): void{
		this.$set(this.Pager, 'PageIndex', 1);
		this.GetList();
	}
	
	//重置
	private ResetList(): void{
		this.$set(this, 'Pager', new PInterface.Pager());
    this.$set(this, 'SearchForm', new Interface.FileSearchGroup())
		this.GetList();
	}
	
	//切换列表条数
	private ChangePageSize(n: number): void {
		this.$set(this.Pager, 'PageSize', n);
		this.GetList();
	}
	
	//切换列表页码
	private ChangePage(n: number): void {
		this.$set(this.Pager, 'PageIndex', n);
		this.GetList();
	}
	
	//获取列表高度
	private CalculateTbHeight(): number {
		let Flag: number = 210;
		return (window.innerHeight - Flag);
  }

  //提交核实操作
  private SubmitCheck():void{
    (this.$refs["PostConfirmMsg"] as any).validate((valid: boolean) => {
      if (valid) {
      	this.PostConfirm();
      }
    })
  }

  //提交核实操作请求
  private PostConfirm(): void{
    if(new Date(this.PostConfirmMsg.Salary.TryOutTime).getTime() < new Date(this.CurrSelectData.CreateTime.split('T')[0]).getTime()){
      this.$UI.Tips.Floating('warning', `转正日期必须大于入职日期`);
      return;
    }
    this.PostConfirmMsg.Salary.UserId =  this.CurrSelectData.Id
    
    this.$UI.Loading.Show();
		this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.UserDocumentConfirm,
				Login: true
			},
			Data: this.PostConfirmMsg,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `提审员工档案成功`);
          this.GetList()
					this.CancelConfirmMsg()
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }

  //取消核实
  private CancelConfirmMsg():void{
    (this.$refs["PostConfirmMsg"] as any).resetFields();
    this.$set(this, 'ConfirmRecord', false)
  }
  
  //控制列表操作列按钮显示隐藏
  private ControlOpera(OpeIndex:number, RowData: Interface.EmployeeFile): string{
    if(OpeIndex == 1){
      return 'inline-block'
    }
    if( OpeIndex == 2 && (RowData.Status <= 2 && RowData.Id == JSON.parse(this.$Cookie.Get('frler_user')).UserId) ){
      return 'inline-block'
    }
    if( OpeIndex == 3 && RowData.Status == 2 ){
      return 'inline-block'
    }
    if( OpeIndex == 4 && (JSON.parse(this.$Cookie.Get('frler_user')).UserId == RowData.SReviewId) && RowData.Status == 3 ){
      return 'inline-block'
    }
    if( OpeIndex == 5 && (JSON.parse(this.$Cookie.Get('frler_user')).UserId == RowData.MReviewId) && RowData.Status == 3 ){
      return 'inline-block'
    }
    
    return 'none'
  }

  private OperateGroup(Type:number, Idx:number): void{
    this.CurrSelectData = JSON.parse(JSON.stringify(this.List[Idx]))
    sessionStorage.setItem('TreeResource', JSON.stringify(this.$Resource))
    switch(Type){
      case 1:
        if (this.CurrSelectData.Status == 0 || this.CurrSelectData.Status == 1) {
          this.$UI.Tips.Floating('warning', `该员工档案不存在`);
          return;
        }
        for (let Item in this.CurrSelectData) {
          sessionStorage.setItem(Item, (this.CurrSelectData as any)[Item]);
        }
        sessionStorage.setItem('AuditFile', 'false');
        window.open(window.location.origin + '#/ViewFile', '_blank');
        break;
      case 2:
        let Obj:any = {
          name: 'ModifyFile',
          query: { IsCreate: false }
        }
        this.$router.replace(Obj);

        break;
      case 3:
        if (this.ManagerList.length <= 0) {
          this.GetUserDropList("经理", 'ManagerList');
        }
        if (this.ReviewList.length <= 0) {
          this.GetUserDropList("主管", 'ReviewList');
        }
        if (this.AdminList.length <= 0) {
          this.GetUserDropList("", 'AdminList')
        }
        this.$set(this, 'ConfirmRecord', true)
        break;
      case 4:
      case 5: 
        for (let Item in this.CurrSelectData) {
          sessionStorage.setItem(Item, (this.CurrSelectData as any)[Item]);
        }
        sessionStorage.setItem('AuditFile', 'true');
        window.open(window.location.origin + '/#/ViewFile', '_blank');
        // const childWindow = 
        // childWindow.document.addEventListener('visibilitychange', function () {
        // // 用户离开了当前页面
        //   if (childWindow.document.visibilityState === 'hidden') {
        //     console.log(1)
        //   }
        // })
        break;
    }
  }
	
	private PositionDrop: PInterface.KV[] = [];	//岗位下拉数据
  private OrganizationDrop: Interface.OrganizationTree[] = [];	//组织下拉数据
  private CityList: PInterface.AreaTree[] = [];	//地区下拉数据
  private DocStatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.DocStatus); // 状态枚举下拉
  private SearchKeyTypeDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.EmployeeSearchType);  //关键字下拉
  private MaritalStatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.MaritalStatus); // 婚姻状态枚举下拉
  private AdminList: PInterface.KV[] = [] //人事下拉
  private ReviewList: PInterface.KV[] = []  //主管下拉
  private ManagerList: PInterface.KV[] = [] //经理下拉
  private ConfirmRecord: boolean = false; //核实档案模态框标识
  private PostConfirmMsg: Interface.VerifyEmployee = new Interface.VerifyEmployee();
	private AccurateSearch: boolean = false; // 控制“精准搜索”下拉菜单展示
  private Powers: PInterface.Power = {}; // 权限
  private CurrSelectData: Interface.EmployeeFile = new Interface.EmployeeFile();  //当前选中操作数据
	private SearchForm : Interface.FileSearchGroup = new Interface.FileSearchGroup();  //筛选数据
  private Pager: PInterface.Pager = new PInterface.Pager(); // 分页数据
  private OperateDrop: PInterface.KV[] = []; // 下拉操作项
	private List: Interface.EmployeeFile[] = []; //列表数据
	private Cols: PInterface.TableCol[] = [
		{ title: '编号', key: 'UserCode' },
		{ title: '姓名', key: 'UserName' },
		{ title: '职务', key: 'PositionName' },
		{ title: '组织', key: 'OrganizationName' },
		{ title: '联系电话', key: 'TelePhone' },
		{ title: '邮箱', key: 'Email' },
		{ title: '婚姻状态', key: 'MaritalStatus', render: (h: any, params: any): string => {
				return h('span', {
					class: 'P-Text-Title'
				}, params.row.MaritalStatus == 0 ? '未婚': this.$Enums.User.MaritalStatus[params.row.MaritalStatus])
			} },
		{ title: '入职时间', width: 160, key: 'CreateTime', render: (h: any, params: any): string => h('div', {}, this.$UI.Render.Date( params.row.CreateTime)) },
		{ title: '状态', width: 80, key: 'Status', render: (h: any, params: any): string => {
				return h('span', {
					class: ['P-Text-Title', 'P-Text-Warning', 'P-Text-Info', 'P-Text-Success'][params.row.Status -1]
				}, params.row.Status == 0 ? '待录入': this.$Enums.User.DocStatus[params.row.Status])
			} },
		{ title: '操作', width: 140, className: 'Ope-Row', render: (h: any, params: any): string => {
        return h('div', {
          class: "P-MT-5"
        }, this.OperateDrop.map( (item: PInterface.KV, index: number )=>{
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: { display: this.ControlOpera(Number(item.Value), params.row) },
            class: 'P-MB-5 P-MR-5',
            on: {
              click: () => {
                this.OperateGroup(Number(item.Value), params.row._index)
              }
            }
          }, item.Key )
        }))
      }
    }
  ]
  private PostConfirmRule: any = {
    'Salary.TrialSalary': [{ required: true, message: '请输入试用期工资', trigger: 'blur' }, { pattern: /^[1-9]\d*\.{0,1}\d*$/, message: '请输入正确格式的工资' }],
    'Salary.ToTurnSalary': [{ required: true, message: '请输入转正工资', trigger: 'blur' }, { pattern: /^[1-9]\d*\.{0,1}\d*$/, message: '请输入正确格式的工资' }],
    'Salary.TryOutTime': [{ type: 'date', required: true, message: '请选择转正日期', trigger: 'change' }],
    ConfirmId: [{ type: 'number', required: true, message: '请选择人事审核人', trigger: 'change' }],
    SReviewId: [{ type: 'number', required: true, message: '请选择主管', trigger: 'change' }],
    MReviewId: [{ type: 'number', required: true, message: '请选择经理', trigger: 'change' }]
  }
}

</script>
<style lang="less">
  .Employee-File{
    .Ope-Row{
      padding: 3px;
    }
  }
</style>
