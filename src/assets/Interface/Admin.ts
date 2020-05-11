namespace Interface {
	export class Login {
		Email: string
		Password: string
	}
	
	export class ReqPwd {
		OldPwd: string
    NewPwd: string
	}
}

//通讯录
namespace Interface {
	export class AddressBookSearch {
		PositionId: number = 0
		OrganizationId: string[] = []
		SearchKey: string = ""
	}

	export class AddressBook {
		Id: number
		UserCode: string
		UserName: string
		TelePhone: string
		Email: string
		OrganizationName: string
		PositionName: string
	}
}

//组织架构
namespace Interface {
	export class OrganizationTree{
    Id: number = 0
    Name: string
		ParentId: number = 0
    Icon?: string
    PrincipalId: number
    ChildNodes: OrganizationTree[]
    title?: string
		expand?: boolean
		children: OrganizationTree[] = []
		label?: string
		value: string = "0"
	}

	export class SearchOrganization{
		PositionId: string | number = ""
		OrganizationId: string | number = ""
    WarehouseId: string | number = ""
    Status: number = 0
    StartTime: string = ""
    EndTime: string = ""
    SearchType: string | number = ""
    SearchKey: string = ""
  }
  
  export class Organization {
    Id: number = 0
    UserName: string = ""
    UserCode: string = ""
    Sex: number = 1
    Email: string = ""
    TelePhone: string = ""
    PositionId:  string | number = ""
    OrganizationId:  string[] | string | number = []
    WarehouseId:  string | number = ""
    WarehouseName: string = ""
    Status: number = 0
    CreateTime: string | Date= new Date()
  }

  export class ModifyOrganization {
    Id: number = 0
    Name: string = ""
    ParentId?: number = 0
    PrincipalId?: number = 0
	}
	
	export class ModifyUserSetting {
		Id: number[] = []
		WarehouseId?: number | "" = ""
		OrganizationId?: string[] | string | number = []
		PositionId?: number | "" = ""
		Status?: number | "" = ""
	}
}

// 员工档案
namespace Interface {
  export class FileSearchGroup {
		PositionId: number = 0
		OrganizationId: string[] = []
		LocationProvince: string[] = []
		LocationCity: string = ""
		Status: number = 0
		MaritalStatus: number = 0
		StartTime: string = ""
		EndTime: string = ""
		BirthSatrtTime: string = ""
		BirthEndTime: string = ""
		SearchType: number = 0
		SearchKey: string = ""
	}

	export class EmployeeFile {
		Id: number
		UserName: string
		UserCode: string
		Sex: number
		Email: string
		TelePhone: string
		PositionName: string
		OrganizationName: string
		Status: number
		CreateTime: string
		MaritalStatus: number
		ConfirmId: number
		MReviewId: number
		SReviewId: number
	}

	export class UserSalary{
		UserId: number = 0
		TrialSalary: number | string = ""
		ToTurnSalary: number | string = ""
		TryOutTime: string = ""
		School: string = ""
		Profession: string = ""
		Education: string = ""
	}

	export class VerifyEmployee{
		ConfirmId: number | string = ""
		SReviewId: number | string = ""
		MReviewId: number | string = ""
		Salary: Interface.UserSalary
		constructor(){
			this.Salary = new Interface.UserSalary()
		}
	}

	export class EmployeeEducation{
		Id: number = 0
		StartTime: string = ""
		EndTime: string = ""
		School: string = ""
		Profession: string = ""
		Education: string = ""
	}

	export class EmployeeSummary{
		Id: string | number = ""
		UserName: string =  ""
		Sex: string = "1"
		Email: string = ""
		TelePhone: string = ""
		PositionId: string | number = ""
		OrganizationId:string | number = ""
		WarehouseId: string | number = ""
		Status: string | number = ""
		CreateTime: string = ""
		UserCode: string = ""
	}

	export class EmployeeIntroducer{
		Id: number = 0
		UserName: string = ""
		Sex: string = "1"
		Email: string = ""
		TelePhone: string = ""
		PositionId: string = ""
		OrganizationId: string = ""
		WarehouseId: string = ""
		Status: string = ""
		CreateTime: string = ""
	}

	export class EmployeeFiles{
		Id: number = 0
		FileUrl: string = ""
		FileName: string = ""
	}

	export class EmployeeWorks{
		Id:number = 0
		StartTime: string = ''
		EndTime: string = ''
		CompanyName: string = ''
		PositionName: string = ''
	}

	export class ReviewHistory{
		Id: number = 0
		ReviewName: string = ""
		PositionName: string = ""
		ReviewStatus: string = ""
		Remark: string = ""
		ReviewTime: string = ""
	}

	export class PersonalMs{
		Summary: Interface.EmployeeSummary
		Introducer: Interface.EmployeeIntroducer //介绍人信息
		Files: Interface.EmployeeFiles[] = []	//上传附件
		Works: Interface.EmployeeWorks[] = [] //工作经历
		Educations: Interface.EmployeeEducation[] = [new Interface.EmployeeEducation()] //教育经历
		Salary: Interface.UserSalary = new Interface.UserSalary()	////薪资
		ReviewHistory: Interface.ReviewHistory[]
		ConfirmName: string = ""
		HeaderImage: string = "" //头像
		DateOfBirth: string = "" //生日
		Nation: string = "" //民族
		MaritalStatus: string = "" //婚姻状态
		IdNumber: string = "" //身份证
		School: string = "" //毕业院校
		Profession: string = "" //专业
		AccountNature: string = "" //户口性质
		LocationProvince: string = '' //户口所在省份
		LocationCity: string = "" //户口所在城市
		Language: string = '' //需要转成字符串
		NowAddress: string = "" //现住址
		AccountAddress: string = "" //户籍地址
		FamilyPhone: string = "" //家庭电话
		UrgentContact: string = "" //紧急联系人
		UrgentContactPhone: string = "" //紧急联系人电话
		RelationShip: string = "" //与紧急联系人关系
		IntroducerId: string = "" //介绍人id
		SReviewId: number = 0
		MReviewId: number = 0
		ConfirmId: number = 0
		Id: number = 0

		constructor(){
			this.Summary = new Interface.EmployeeSummary()
			this.Introducer = new Interface.EmployeeIntroducer()
		}
	}
}

// 岗位职务
namespace Interface {
  export class PositionSearchGroup {
    SearchKey: string = ''
    IsEnable: number|'' = ''
  }
  export class PositionRoleId {
    RoleId: number[] = []
  }
  export class PositionTableList extends PositionRoleId{
    constructor(){
      super()
    }
    Id: number = 0
    Name: string = ''
    Remark: string = ''
    RoleName: string = ''
    ToDoId: number[] = []
    ToDoName: string = ''
    CreateTime: string = ''
    IsEnable: boolean|'' = ''
  }
  export class PositionToDoTree {
    Id: number
    CategoryName: string
    ChildNods: PositionToDoTree[]
  }
}

// 角色权限
namespace Interface {
  export class RoleSearch {
    SearchKey: string = ""
  }

  export class Role {
    Id: number = 0
    RoleName: string = ""
    Description: string = ""
    ResourceId: number[] = []
    Resources: string = ""
    IsEnable: boolean = true
  }

  export class RoleResources{
		ActionUrl: string = ""
		ChildNods: RoleResources[] = []
		ElementId: string
		Id: number
		ResourceName: string
		ParentId: number = 0
		title?: string
		checked?: boolean
		children: RoleResources[] = []
		label?: string
		value: string = "0"
	}

  export class SelectedTree {
    [Key: string]: string[]
  }

}

export default Interface
