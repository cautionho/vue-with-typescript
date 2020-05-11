<template>
	<Row class="Modify-File">
    <Col span="24">
      <h1 class="P-TA-C">弗睿网络科技（广州）有限公司</h1>
      <h2 class="P-TA-C">Frler Network Technology (Guangzhou) Co.,Ltd</h2>
      <h2 class="P-TA-C" v-show="$route.params.IsCreate">{{ JSON.parse(this.$Cookie.Get('frler_user')).UserName }}（{{ JSON.parse(this.$Cookie.Get('frler_user')).UserCode }}）- 员工档案</h2>
      <div class="Info">
        <h2 class="P-TA-C P-MB-20">基本信息</h2>
        <Form onsubmit="return false" ref="PersonalMsg" :model="PersonalMsg" :rules="PostConfirmRule" :label-width="160">
          <Row>
            <Col span="24">
              <Col span="16">
                <Col span="12">
                  <Form-item label="姓名：" prop="Summary.UserName">
                    <Input v-model="PersonalMsg.Summary.UserName" placeholder="请输入姓名"></Input>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="性别：" prop="Summary.Sex">
                    <RadioGroup v-model="PersonalMsg.Summary.Sex">
                      <Radio label="1">男</Radio>
                      <Radio label="2">女</Radio>
                    </RadioGroup>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="出生日期：" prop="DateOfBirth" style="margin-bottom: 0">
                    <Date-picker type="date" placeholder="选择日期" style="width:100%;" v-model="PersonalMsg.DateOfBirth"></Date-picker>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="民族：" prop="Nation">
                    <Select v-model="PersonalMsg.Nation" placeholder="请选择民族" :options="NationList" optionValKey="Key" />
                    <!-- <Select v-model="PersonalMsg.Nation" filterable clearable placeholder="请选择民族">
                      <Option v-for="(item,index) in NationList" :value="item" :key="index">{{item}}</Option>
                    </Select> -->
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="婚姻状况：" prop="MaritalStatus">
                    <Select placeholder="请选择婚姻状况" v-model="PersonalMsg.MaritalStatus" :options="MaritalStatusDrop" />
                    <!-- <Select placeholder="请选择婚姻状况" v-model="PersonalMsg.MaritalStatus" filterable clearable>
                      <Option v-for="(item,index) in MaritalStatusDrop" :value="$Enums.User.MaritalStatus[item]" :key="index">{{ item }}</Option>
                    </Select> -->
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="身份证号：" prop="IdNumber">
                    <Form-item prop="IdNumber" style="margin: 0;width: 100%;">
                      <Input :maxlength="18" v-model="PersonalMsg.IdNumber" placeholder="请输入身份证"></Input>
                    </Form-item>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="毕业院校：" prop="School">
                    <Input v-model="PersonalMsg.School" placeholder="请输入毕业院校"></Input>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="专业：" prop="Profession">
                    <Input v-model="PersonalMsg.Profession" placeholder="请输入专业"></Input>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="户口性质：" prop="AccountNature">
                    <Select placeholder="请选择户口性质" v-model="PersonalMsg.AccountNature" :options="AccountNatureList" />
                    <!-- <Select placeholder="请选择户口性质" v-model="PersonalMsg.AccountNature" filterable clearable>
                      <Option v-for="(item,index) in AccountNatureList" :value="$Enums.User.AccountNature[item]" :key="index">{{ item }}</Option>
                    </Select> -->
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="户口所在地：" prop="LocationProvince" style="width: 70%; display:inline-block">
                    <Select placeholder="请选择省份" v-model="PersonalMsg.LocationProvince" :options="LocationProvinceList" optionValKey="Key" />
                    <!-- <Select placeholder="请选择省份" v-model="PersonalMsg.LocationProvince" :label-in-value="true" filterable clearable>
                      <Option v-for="(item,index) in LocationProvinceList" :value="item.Key" :key="index">{{ item.Key }}</Option>
                    </Select> -->
                  </Form-item>
                  <Form-item label="" prop="LocationCity" style="width: 30%; display:inline-block" class="City">
                    <Select placeholder="请选择市区" v-model="PersonalMsg.LocationCity" ref="locationCitySelc" :options="LocationCityList" optionValKey="Key" />
                    <!-- <Select placeholder="请选择市区" v-model="PersonalMsg.LocationCity" ref="locationCitySelc" :label-in-value="true" filterable clearable>
                      <Option v-for="(item,index) in LocationCityList" :value="item.Key" :key="index">{{ item.Key }}</Option>
                    </Select> -->
                  </Form-item>
                </Col>
              </Col>
              <Col span="8" class="Hear-Photo">
                <div class="demo-upload-list" v-for="(item, index) in UploadList" :key="index">
                  <template v-if="item.status === 'finished'">
                    <img :src="ImageServer+'/'+item.url">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="HandleView(item.url)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="HandleRemove(item)"></Icon>
                    </div>
                  </template>
                  <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
                </div>
                <Upload v-show="!UploadList.length" ref="Upload" :show-upload-list="false" :headers="headers" :default-file-list="DefaultList" :data="{Dir:'userHead'}" :on-success="HandleHeadSucc" :accept="'.jpg, .jpge, .png'" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="HandleFormatError" :on-exceeded-size="HandleMaxSize" :before-upload="HandleBeforeUpload" multiple type="drag" :action="UploadImgServer" style="display: inline-block;width:120px;">
                  <div style="width: 120px;height:120px;line-height: 120px;">
                    <Icon type="ios-camera-outline" size="20"/>
                  </div>
                </Upload>
              </Col>
            </Col>
            <Col span="24">
            <Form-item label="语言：" prop="Language">
              <!-- <Col span="5"> -->
                <CheckboxGroup v-model="Language">
                  <Checkbox label="普通话"></Checkbox>
                  <Checkbox label="粤语"></Checkbox>
                  <Checkbox label="英语"></Checkbox>
                  <Checkbox label="韩语"></Checkbox>
                  <Checkbox label="日语"></Checkbox>
                </CheckboxGroup>
              <!-- </Col>
              <Col span="19"><Input v-model="PersonalMsg.Language" placeholder="其他语言"></Input></Col> -->
            </Form-item>
            </Col>
            <Col span="24">
              <Form-item label="现住地址：" prop="NowAddress">
                <Input v-model="PersonalMsg.NowAddress" placeholder="请输入现住地址"></Input>
              </Form-item>
            </Col>
            <Col span="24">
            <Form-item label="户籍地址：" prop="AccountAddress">
              <Input v-model="PersonalMsg.AccountAddress" placeholder="请输入户籍地址"></Input>
            </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="联系电话：" prop="Summary.TelePhone">
                <Input v-model="PersonalMsg.Summary.TelePhone" placeholder="请输入联系电话"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="家庭电话：" prop="FamilyPhone">
                <Input v-model="PersonalMsg.FamilyPhone" placeholder="请输入家庭电话"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="紧急联系人：" prop="UrgentContact">
                <Input v-model="PersonalMsg.UrgentContact" placeholder="请输入紧急联系人"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="紧急联系人电话：" prop="UrgentContactPhone">
                <Input v-model="PersonalMsg.UrgentContactPhone" placeholder="请输入紧急联系人电话"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="紧急联系人与本人关系：" prop="RelationShip">
                <Input v-model="PersonalMsg.RelationShip" placeholder="请输入紧急联系人与本人关系"></Input>
              </Form-item>
            </Col>
            <Col span="12"><Form-item label="" >
                <Input style="opacity: 0; cursor:context-menu"></Input>
              </Form-item></Col>
            <Col span="12">
              <Form-item label="介绍人" prop="IntroducerId">
                <Select v-model="PersonalMsg.IntroducerId" placeholder="请选择介绍人" :options="IntroducerList" />
                <!-- <Select v-model="PersonalMsg.IntroducerId" placeholder="请选择介绍人" clearable filterable>
                  <Option v-for="(item,index) in IntroducerList" :value="item.Value" :key="index">{{ item.Key }}</Option>
                </Select> -->
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="介绍人与本人关系" prop="IntroducerRelationShip">
                <Input v-model="PersonalMsg.IntroducerRelationShip" placeholder="请输入紧急联系人与本人关系"></Input>
              </Form-item>
            </Col>
            <Col span="24">
              <h2 class="P-TA-C P-MB-10"><span class="P-Required">附件</span></h2>
              <p class="P-TA-C P-MB-20">包括学位证书、身份证、银行卡、合同等，仅支持JPG、PNG格式图片，大小不超过2M</p>
              <div class="File-Wrap">
                <div>
                  <div class="File-Box" v-for="(item,index) in PersonalMsg.Files" :key="index" :data-id="index">
                    <div class="Del-File"><span @click="DeleteLine($event,'Files')">
                        <Icon type="ios-close-circle" size="38" style="color: #f10808;" />
                      </span></div>
                    <div @click="HandleView(item.FileUrl)" class="Img-Name"><img :src="ImageServer+'/'+item.FileUrl" style="width: 100px; height: 100px"></div>
                    <div class="fileName">
                      <Input v-model="item.FileName"></Input>
                    </div>
                  </div>
                </div>
                <div style="width: 130px;">
                  <Upload multiple type="drag" :action="UploadImgServer" :accept="'.jpg, .jpge, .png'" :format="['jpg','jpeg','png']" :max-size="2048" :show-upload-list="false" :on-exceeded-size="HandleMaxSize" :on-format-error="HandleFormatError" :before-upload="HandleFileBefore" :on-success="HandleFilesSucc" :data="{Dir:'userFile'}" style="margin-top: 10px; width: 120px; height: 120px;">
                    <Icon type="md-add" size="52" style=" height: 84px; margin-top: 30px;color: #3399ff"></Icon>
                  </Upload>
                </div>
              </div>
          </Col>

            <Col span="24" class="mt20 Col-Table">
              <h2 class="P-TA-C P-MB-10"><span class="P-Required">教育/培训经历</span></h2>
              <table class="View-Table" cellspacing="0" cellpadding="8" width="100%" style="font-size: 14px;">
                <tr class="P-TA-C">
                  <th><span>起止时间</span></th>
                  <th><span>学校/机构名称</span></th>
                  <th><span>专业</span></th>
                  <th><span>获得学位/证书</span></th>
                  <th style="width: 5%;">
                    操作
                  </th>
                </tr>
                <tr class="P-TA-C" v-if="!PersonalMsg.Educations.length">
                  <td colspan="5">暂无教育经历</td>
                </tr>
                <tr v-for="(item,index) in PersonalMsg.Educations" :data-id="index" :key="index">
                  <td class="P-TA-C">
                    <Date-picker type="date" placement="top" v-model="item.StartTime" placeholder="选择开始日期" style="width: 45%;display: inline-block;"></Date-picker>
                    -
                    <Date-picker type="date" placement="top" v-model="item.EndTime" placeholder="选择结束日期" style="width: 45%;display: inline-block;"></Date-picker>
                  </td>
                  <td>
                    <Input v-model="item.School" placeholder="请输入学校/机构名称"></Input>
                  </td>
                  <td>
                    <Input v-model="item.Profession" placeholder="请输入专业"></Input>
                  </td>
                  <td>
                    <Input v-model="item.Education" placeholder="请输入学位/证书"></Input>
                  </td>
                  <td class="P-TA-C" style="width: 5%;">
                    <span class="Del-Operate" @click="DeleteLine($event,'Educations')">删除</span>
                  </td>
                </tr>
              </table>
              <Col span="24" style="text-align: right;">
                <Button type="primary" class="P-MT-10" @click="AddEducations">添加一行</Button>
              </Col>
            </Col>


            <Col span="24" class="mt20 Col-Table">
              <h2 class="P-TA-C P-MB-10">工作经历</h2>
              <table class="View-Table" cellspacing="0" cellpadding="8" width="100%" style="font-size: 14px;">
                <tr>
                  <th>起止日期</th>
                  <th>单位名称</th>
                  <th>职位</th>
                  <th style="width: 5%;">操作</th>
                </tr>
                <tr class="P-TA-C" v-if="!PersonalMsg.Works.length">
                  <td colspan="4" class="P-TA-C">暂无工作经历</td>
                </tr>
                <tr v-for="(item,index) in PersonalMsg.Works" :data-id="index" :key="index">
                  <td class="P-TA-C">
                    <Date-picker type="date" placement="top" v-model="item.StartTime" placeholder="选择开始日期" style="width: 45%;display: inline-block;"></Date-picker>
                    -
                    <Date-picker type="date" placement="top" v-model="item.EndTime" placeholder="选择结束日期" style="width: 45%;display: inline-block;"></Date-picker>
                  </td>
                  <td>
                    <Input v-model="item.CompanyName" style="border-width: 0px;outline: none;width: 100%;" placeholder="请输入单位名称"></Input>
                  </td>
                  <td>
                    <Input v-model="item.PositionName" style="border-width: 0px;outline: none;width: 100%;" placeholder="请输入职位"></Input>
                  </td>
                  <td class="P-TA-C" style="width: 5%;">
                    <span class="Del-Operate" @click="DeleteLine($event,'Works')">删除</span>
                  </td>
                </tr>
              </table>
              <Col span="24" class="P-TA-R">
                <Button type="primary" class="P-MT-10" @click="AddWorks">添加一行</Button>
              </Col>
            </Col>


            <Col span="24" class="P-TA-C P-MT-20">
              <Button type="primary" class="P-MR-20" @click="SaveFile">保存</Button>
              <Button @click="ConfirmOut">退出系统</Button>
            </Col>
          </Row>
        </Form>
        <Modal v-model="ChangePwdModal" title="修改初始密码" :closable="false" :mask-closable="false">
          <Form onsubmit="return false" ref="ModifyPwdMsg" :model="ModifyPwdMsg" :rules="RuleValidate" :label-width="100">
            <p class="P-MT-10 P-MB-20 P-Text-Error">欢迎使用弗睿网络科技（广州）有限公司- ERP系统！您当前使用的为初始密码，为了您的账号安全，请先修改密码</p>
            <Form-item label="新密码：" prop="NewPwd">
              <Input type="password" v-model="ModifyPwdMsg.NewPwd" placeholder="请输入长度为14~25位新密码" class="P-W-100-Percent" ref="NewPwdInput" @on-enter="ValidateModifyPwd"></Input>
            </Form-item>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="ValidateModifyPwd">提交</Button>
            <Button type="default" @click="ConfirmOut" class="P-ML-10">退出系统</Button>
          </div>
        </Modal>
      </div>
    </Col>
  <ShowBigPic ref="ShowBigPic"></ShowBigPic>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Admin';
@Component({
  name: 'ModifyFile',
  components: {
    ShowBigPic: () => import ('@/components/Public/ShowBigPic.vue')
  }
})
export default class ModifyFile extends Vue {
  @Watch('PersonalMsg.LocationProvince')
  private GetLocation(Val: string):void { //监听获取市区下拉数据
    
    if (this.LocationCityList.length != 0) { 
      (this.$refs.locationCitySelc as any).clearSingleSelect(); 
    }
    this.LocationCityList = [];
    if (Val !== undefined && Val !== "" && this.LocationProvinceList.length) { 
      this.ChangePro(Val); 
    }
  }

  private mounted():void{
    this.ProDropList();
    this.GetIntroducer();
    if(typeof this.$route.query.IsCreate == 'undefined'){ //request请求
      this.$Log.Out()
      return;
    }
    if(!this.$route.query.IsCreate){  //编辑
      this.GetDocument()
    }
    this.$set(this.PersonalMsg.Summary, 'Id', JSON.parse(this.$Cookie.Get('frler_user')).UserId)
    this.$set(this.PersonalMsg.Summary, 'UserName', JSON.parse(this.$Cookie.Get('frler_user')).UserName)
    this.$set(this.PersonalMsg.Summary, 'UserCode', JSON.parse(this.$Cookie.Get('frler_user')).UserCode)
    this.$set(this.PersonalMsg.Summary, 'WarehouseId', JSON.parse(this.$Cookie.Get('frler_user')).WarehouseId)
    this.$set(this.PersonalMsg.Summary, 'Status', JSON.parse(this.$Cookie.Get('frler_user')).Status)

    if(this.$route.query.IsChange){
      this.$set(this,'ChangePwdModal', true)
      this.$nextTick(()=>{ (this as any).$refs.NewPwdInput.focus(); })
    }
  }

  private ProDropList():void{
    this.$Request.Post({
			Server: this.$Server.Settings,
			Api: {
				Address: this.$Api.ProvincesDropList,
				Login: true
			},
			Data: "",
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$set(this, 'LocationProvinceList', Res.Data.DropList);
          this.ChangePro(this.PersonalMsg.LocationProvince, true)
				} else {
					this.$Request.Error(Res);
				}
			}
		})
  }

  //选择省份
  private ChangePro(val: string, isInit?: boolean) {
    if (val === "") return
    let valueId: number | string = "";
    this.LocationCityList = []
    if (isInit == undefined) {
      (this.$refs.locationCitySelc as any).clearSingleSelect()
    }
    this.$nextTick(function() {
      // for (let item in this.LocationProvinceList) {
      //   if (val == this.LocationProvinceList[item].Key) {
      //     valueId = this.LocationProvinceList[item].Value;
      //   }
      // }
      this.$Request.Post({
        Server: this.$Server.Settings,
        Api: {
          Address: this.$Api.CityAreaDropList,
          Login: true
        },
        Data: this.LocationProvinceList.filter(Item => Item.Key === val)[0].Value,
        Callback: (Res: PInterface.Res): void => {
          if (Res.IsSuccess) {
            this.$set(this, 'LocationCityList', Res.Data.DropList);
            if(this.RenderCity){
              this.$set(this.PersonalMsg, 'LocationCity', this.RenderCity)
              this.RenderCity = ""
            }
          } else {
            this.$Request.Error(Res);
          }
        }
      })
      
    })
  }

  //获取介绍人列表
  private GetIntroducer():void{
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.GetUserDropList,
        Login: true
      },
      Data: "",
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'IntroducerList', Res.Data.DropList);
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  //获取用户档案
  private GetDocument():void{
    this.$UI.Loading.Show();
    let UserId = JSON.parse(this.$Cookie.Get('frler_user')).UserId;
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.UserDocumentInfo,
        Login: true
      },
      Data: UserId,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$nextTick(()=>{
            this.PersonalMsg = Res.Data.Data
            this.$set(this, 'RenderCity', this.PersonalMsg.LocationCity)
            this.$set(this.PersonalMsg.Summary, 'Sex', this.PersonalMsg.Summary.Sex.toString())
            this.$set(this.PersonalMsg, 'DateOfBirth', new Date(this.PersonalMsg.DateOfBirth))
            this.$set(this, 'Language', this.PersonalMsg.Language.split(","))
            if (this.PersonalMsg.HeaderImage != "") {
              this.DefaultList.push({
                name: 'head',
                url: this.PersonalMsg.HeaderImage
              });
              this.UploadList = this.DefaultList;
            }
          })
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private HandleHeadSucc(Res: any, File:any) {
    if(Res.IsSuccess){
      this.$UI.Loading.Hide();
      // 因为上传过程为实例，这里模拟添加 url
      File.url = Res.Data.Url;
      this.PersonalMsg.HeaderImage = Res.Data.Url;
      this.UploadList = [];
      this.UploadList.push(File)
    }else{
      this.$Request.Error(Res);
    }
  }

  private HandleFilesSucc(Res: any, file:any):void {
    this.$UI.Loading.Hide();
    if(Res.IsSuccess){
      this.PersonalMsg.Files.push({
        Id: 0,
        FileUrl: file.response.Data.Url,
        FileName: file.name
      })
    }else{
      this.$Request.Error(Res);
    }
  }
  private HandleFormatError(File:any):void {
    this.$UI.Tips.Floating('warning', `文件[${File.name}]格式不为JPG/JPGE/PNG，请检查`);
  }
  private HandleMaxSize(File:any):void {
    this.$UI.Tips.Floating('warning', `文件${File.name}大小超过2M，请检查`);
  }
  private HandleBeforeUpload(File: any): boolean {
    const check = this.UploadList.length < 1;
    if (!check) {
      this.$UI.Tips.Floating('warning', `最多只能上传 1 张图片`);
    }else{
      this.$UI.Loading.Show();
    }
    return check;
  }
  private HandleFileBefore(File: any): boolean {
    const check = this.PersonalMsg.Files.length < 8;
    if (!check) {
      this.$UI.Tips.Floating('warning', `最多只能上传 8 个附件。`);
    }else{
      this.$UI.Loading.Show();
    }
    return check;
  }

  //查看大图
  private HandleView(Url: string):void {
    // this.BigPicSrc = name;
    // this.ShowBigPic = true;
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }

  private HandleRemove(file:any):void {
    // 从 upload 实例删除数据
    const fileList = (this.$refs.Upload as any).fileList;
    (this.$refs.Upload as any).fileList.splice(fileList.indexOf(file), 1);
    this.UploadList = [];
    this.PersonalMsg.HeaderImage = "";
    
  }

  //添加工作经历
  private AddWorks():void{
    let obj = new Interface.EmployeeWorks()
    this.PersonalMsg.Works.push(obj)
  }

  //添加教育经历
  private AddEducations():void{
    let obj = new Interface.EmployeeEducation()
    this.PersonalMsg.Educations.push(obj)
  }

  //删除
  private DeleteLine(El:any, Obj: string):void{
    if(Obj === 'Educations' && this.PersonalMsg.Educations.length == 1){
      this.$UI.Tips.Floating('warning', '至少填写一次教育/培训经历')
      return;
    }
    let index = El.currentTarget.parentElement.parentElement.getAttribute('data-id');
    (this.PersonalMsg as any)[Obj].splice(index, 1);
  }

  //保存
  private SaveFile():void{
    (this as any).$refs['PersonalMsg'].validate((valid:boolean) => {
      if(valid){
        this.ValidePost()
      }else{
        this.$UI.Tips.Floating('warning', '请检查必填项')
      }
    })
  }

  //验证必填项
  private ValidePost():void{
    let SendPersonalMsg = JSON.parse(JSON.stringify(this.PersonalMsg));
    //判断是否上传了头像
    if (SendPersonalMsg.HeaderImage == "") {
      this.$UI.Tips.Floating('warning', '请上传头像')
      return;
    }
    //判断是否上传了附件
    if (SendPersonalMsg.Files.length == 0) {
      this.$UI.Tips.Floating('warning', '请上传附件')
      return;
    }
    
    // 判断是否填写图片名称
    for (let items in SendPersonalMsg.Files) {
      if (SendPersonalMsg.Files[items].FileName == "") {
        this.$UI.Tips.Floating('warning', '请输入附件名称')
        return;
      }
    }

    let flag: boolean = true;
    if (SendPersonalMsg.Educations.length != 0) {
      SendPersonalMsg.Educations.forEach((obj: Interface.EmployeeEducation | any)=>{
        for(let item in obj){
          if(!obj[item]){
            if (item == 'Id') {
              continue;
            } else {
              flag = false;
            }
          }
        }
      })
    } else {
      this.$UI.Tips.Floating('warning', `请填写教育/培训经历`);
      return;
    };

    if(!flag){
      this.$UI.Tips.Floating('warning', '请完善教育/培训经历！')
      return;
    }

    //判断是否给了介绍人
    if (SendPersonalMsg.IntroducerId == "") {
      SendPersonalMsg.Introducer = null;
    } else {
      SendPersonalMsg.Introducer.Id = SendPersonalMsg.IntroducerId;
    };

    // 整理所有日期
    SendPersonalMsg.DateOfBirth = this.$UI.Render.Date(SendPersonalMsg.DateOfBirth);

    for (let item in SendPersonalMsg.Works) {
      SendPersonalMsg.Works[item].StartTime = this.$UI.Render.Date(SendPersonalMsg.Works[item].StartTime);
      SendPersonalMsg.Works[item].EndTime = this.$UI.Render.Date(SendPersonalMsg.Works[item].EndTime);
    }

    for (let item in SendPersonalMsg.Educations) {
      SendPersonalMsg.Educations[item].StartTime = this.$UI.Render.Date(SendPersonalMsg.Educations[item].StartTime);
      SendPersonalMsg.Educations[item].EndTime = this.$UI.Render.Date(SendPersonalMsg.Educations[item].EndTime);
    }

    SendPersonalMsg.Language = this.Language.join(",")

    this.$UI.Tips.Modal({
      Type:'confirm',
      Content:'是否确认无误并保存员工档案',
      Enter:false,
      Callback:(bool:boolean):void=>{
        if(bool){
          this.PostFile()
        }
      }
    })
  }

  private PostFile():void{
    let PersonalMsg = JSON.parse(JSON.stringify(this.PersonalMsg))
    PersonalMsg.DateOfBirth = this.$UI.Render.NewDate(this.PersonalMsg.DateOfBirth)
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$route.query.IsCreate ? this.$Api.UserDocumentCreate : this.$Api.UserDocumentModify, 
        Login: true
      },
      Data: PersonalMsg,
      Callback: (Res: PInterface.Res): void => {
        this.$UI.Loading.Hide();
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `保存成功`);
          sessionStorage.setItem('Id', JSON.parse(this.$Cookie.Get('frler_user')).UserId);
          sessionStorage.setItem('AuditFile', 'false');
          this.$router.replace({name: 'ViewFile', query: {}})
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }

  private ValidateModifyPwd():void{
    (this.$refs["ModifyPwdMsg"] as any).validate((Valid: boolean):void => {
      if (Valid) {
      	this.PostModifyPwd();
      }else{
        (this.$refs["NewPwdInput"] as any).focus();
      }
    })
  }

  private PostModifyPwd(): void {
		this.$UI.Loading.Show();
  	this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: this.$Api.UserChangePwd,
				Login: true
			},
			Data: this.ModifyPwdMsg,
			Callback: (res: PInterface.Res): void => {
				if (res.IsSuccess) {
          this.$UI.Tips.Floating('success', '修改密码成功');
          // let obj:any = {
          //   name: 'ModifyFile',
          //   query: { IsCreate: true, IsChange: false }
          // }
          // this.$router.replace(obj);
          this.$set(this,'ChangePwdModal', false)
				} else {
					this.$Request.Error(res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  private ConfirmOut(): void{
    this.$UI.Tips.Modal({
      Type: 'confirm',
      Content: `是否确定退出系统`,
      Callback: (Confirm: boolean) => {
        if (Confirm) {
          this.$Log.Out();
        }
      }
    })
  }

  private UploadImgServer:string = this.$Server.Settings + this.$Api.UploadImage //上传图片服务器 接口
  private headers = {}
  private RenderCity:string = ""; 
  private fileName:string = "" //附件文档名
  private ImageServer: string = this.$Server.File  //文件服务器
  private MaritalStatusDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.MaritalStatus); // 婚姻状态枚举下拉
  private AccountNatureList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.AccountNature); // 户口性质枚举下拉
  private NationList: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.User.Nation); //民族下拉
  private IntroducerList: PInterface.KV[] = [] //介绍人下拉
  private LocationProvinceList:  PInterface.KV[] = [] //省市下拉
  private LocationCityList:  PInterface.KV[] = [] //市区下拉
  private UploadList: string[] = []
  private DefaultList: any = []
  private Language: string[] = [] //语言复选框数据
  private PersonalMsg = new Interface.PersonalMs()
  private ChangePwdModal: boolean = false;
  private ModifyPwdMsg: Interface.ReqPwd = { OldPwd: 'abc123456', NewPwd: '' }
  private RuleValidate: any = {
    NewPwd: [{ required: true, message: '请填写新密码', trigger: 'blur' }, { type: 'string', min: 14, message: '密码长度不能小于14位' }, { type: 'string', max: 25, message: '密码长度不能大于25位' }]
  }
  private PostConfirmRule:any = {
    'Summary.UserName': [{ required: true, message: '请输入姓名' }],
    'DateOfBirth': [{ type: 'date', required: true, message: '请选择出生日期', trigger: 'change' }],
    'Nation': [{ required: true, message: '请选择民族', trigger: 'change' }],
    'MaritalStatus': [{ type: 'number', required: true, message: '请选择婚姻状态', trigger: 'change' }],
    'IdNumber': [{ required: true, message: '请填写身份证号码' }, { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请填写正确的身份证号码' }],
    'School': [{ required: true, message: '请输入毕业院校' }],
    'Profession': [{  required: true, message: '请输入专业' }],
    'AccountNature': [{ type: 'number', required: true, message: '请选择户口性质', trigger: 'change' }],
    'LocationProvince': [{ required: true, message: '请选择户口所在省份', trigger: 'change' }],
    'LocationCity': [{ required: true, message: '请选择户口所在市', trigger: 'change' }],
    'NowAddress': [{ required: true, message: '请输入现住址' }],
    'Summary.TelePhone': [{ required: true, message: '请输入联系电话' }, { pattern: this.$Pattern.Mobile, message: '请填写正确的手机号码' }],
    'FamilyPhone': [{ required: true, message: '请输入家庭电话' }, { pattern: this.$Pattern.Tel, message: '请填写正确的家庭电话' }],
    'AccountAddress': [{ required: true, message: '请输入户籍地址' }],
    'UrgentContact': [{ required: true, message: '请输入紧急联系人' }],
    'UrgentContactPhone': [{ required: true, message: '请输入紧急联系人电话号码' }, { pattern: this.$Pattern.Mobile, message: '请填写正确的手机号码' }],
    'RelationShip': [{ required: true, message: '请输入与紧急联系人的关系' }]
  }
}

</script>
<style lang="less">
.Modify-File{
  width: 1200px;
  margin: 0 auto;

  .Info{
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 5px #ccc;

    .City{
      &>.ivu-form-item-content{
        margin-left: 10px !important;
        width: 100px !important;
      }
    }

    .Hear-Photo{
      text-align: center;
      margin-top: 35px;
    }

    .demo-upload-list{
        display: inline-block;
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 120px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .File-Wrap{
      text-align: left;
      display: inline-flex;
      width: 100%; 
      padding: 0 50px;
    }
    .File-Box {
      display: inline-block;
      width: 100px;
      margin: -29px 30px 10px 0px;
    }

    .Img-Name {
      cursor: pointer;
      color: rgb(0, 132, 232)
    }
    .Del-File {
      cursor: pointer;
      text-align: right;
      position: relative;
      top: 21px;
      left: 15px;
    }
  }

  .Col-Table{
    padding: 0 50px;

    .View-Table{
      border-collapse: collapse;
      margin: 0 auto;
      border: 1px solid #dcdee2;
      & td,
      & th {
        border: 1px solid #dcdee2;
        padding: 12px 6px;
        font-size: 14px;
        width: 20%;
        white-space: normal;
      }
    }
    .Del-Operate{
      cursor: pointer;
      color: #2BAEE9;
    }
  }
}  
</style>