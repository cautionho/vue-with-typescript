<!--
  查看档案组件
-->
<template>
  <Row class="View-Record P-MB-10">
  	<div class="Warp">
  		<!--头部信息-->
	  	<Col span="24">
	  		<h2 class="P-Inline-Block">弗睿网络科技（广州）有限公司 - 员工档案</h2>
	  		<h2 class="P-Inline-Block P-Float-Right">编号：{{BaseMsg.Summary.UserCode}}</h2>
	  	</Col>
	  	<!--个人基本信息-->
	  	<Col span="24" class="P-MT-20">
	  		<!--个人头像-->
	  		<div id="Head" class="P-Inline-Block" @click="ShowFileImg(BaseMsg.HeaderImage)" :style="{'background-image': 'url('+ImageServer+'/'+BaseMsg.HeaderImage+')'}">
	  		</div>
	  		<!--右侧基本信息-->
	  		<div class="Right_Info" style="width:calc(100% - 136px);">
	  			<div class="Operator P-TA-R">
            <Icon type="ios-open-outline" />
    				<Icon class="Ic" type="ios-open-outline" @click.native="EditRecord" v-if="Editable&&Powers.DocumentModify" color="#fff" size="18"></Icon>
    				<Icon class="Ic" type="ios-print-outline" @click.native="print" color="#fff" size="18"></Icon>

	  			</div>
	  			<div class="Info">
	  				<h2 class="P-Inline-Block">{{BaseMsg.Summary.UserName}}</h2> <span class="P-ML-20">{{new Date(BaseMsg.DateOfBirth).toLocaleDateString()}}</span><br />
	  				<p class="P-MT-10 P-Inline-Block">{{BaseMsg.NowAddress}}</p><h2 style="float:right">{{OtherMsg.PositionName}}</h2>
	  				<p class="P-MT-10">移：{{BaseMsg.Summary.TelePhone}}  家：{{BaseMsg.FamilyPhone}}</p>
	  			</div>
	  		</div>
	  	</Col>
	  	<Col span="24">
	  		<div class="Base-Msg OH">
	  		<Col span="10">
	  			<div class="P-PT-10 P-PB-10">
		  			<span class="P-Inline-Block W40" >性别：{{BaseMsg.Summary.Sex == 1 ? '男' : '女'}}</span>
		  			<span class="P-Inline-Block W40">婚姻状况：{{BaseMsg.MaritalStatus == 1 ? '未婚' : BaseMsg.MaritalStatus == 2 ? '已婚未育' : BaseMsg.MaritalStatus == 3 ? '已婚已育' : BaseMsg.MaritalStatus == 4 ? '离异' :BaseMsg.MaritalStatus == 5 ? '丧偶' : '未婚'}}</span>
		  			<span class="P-Inline-Block W40" >民族：{{BaseMsg.Nation}}</span>
		  			<span class="P-Inline-Block P-MT-20 W50" >身份证号：{{BaseMsg.IdNumber}}</span>
		  			<span class="P-Inline-Block W40" >专业：{{BaseMsg.Profession}}</span>
		  			<span class="P-Inline-Block P-MT-20 W50" >毕业院校：{{BaseMsg.School}}</span>
		  			<span class="P-Inline-Block W40" >户口性质：{{BaseMsg.AccountNature == 1 ? '本地农村' : BaseMsg.AccountNature == 2 ? '本地城镇' : BaseMsg.AccountNature == 3 ? '外地农村' : '外地城镇'}}</span>
		  			<span class="P-Inline-Block P-MT-20 W50">户口所在地：{{BaseMsg.LocationProvince}}{{BaseMsg.LocationCity}}</span>
		  			<span class="P-Inline-Block P-MT-20 P-W-100-Percent" >户籍地址：{{BaseMsg.AccountAddress}}</span>
		  			<span class="P-Inline-Block W40" >紧急联系人：{{BaseMsg.UrgentContact}}</span>
		  			<span class="P-Inline-Block P-MT-20 W50" >联系人电话：{{BaseMsg.UrgentContactPhone}}</span>
		  			<span class="P-Inline-Block P-W-100-Percent P-MT-20" >紧急联系人与本人关系：{{BaseMsg.RelationShip}}</span>
		  			<span class="P-Inline-Block W40 P-MT-20 P-VA-T" >介绍人：{{BaseMsg.Introducer.UserName==""?'-':BaseMsg.Introducer.UserName}}</span>
		  			<span class="P-Inline-Block W50 P-MT-20 P-VA-T" >介绍人职位：{{BaseMsg.Introducer.PositionName==""?'-':BaseMsg.Introducer.PositionName}}</span>
		  			<span class="P-Inline-Block P-W-100-Percent P-MT-20" >介绍人与本人关系：{{BaseMsg.IntroducerRelationShip==""?'-':BaseMsg.IntroducerRelationShip}}</span>
		  			<span class="P-Inline-Block P-MT-20" >语言：{{BaseMsg.Language}}</span>
	  			</div>
	  			<div class="Left-Line"></div>
	        <div class="File-Box" v-for="(item,index) in BaseMsg.Files" :key="index" @click="ShowFileImg(item.FileUrl)">
	          <Icon class="textInfo" type="ios-paper" size="70" color="#2d6c9e"></Icon>
	          <p :title="item.FileName">{{item.FileName}}</p>
	        </div>
	  		</Col>
	  		<Col span="14">
	  			<div class="Base-Msg-Right">
	  				<h2>工作经历</h2>
	  				<Timeline class="P-MT-10">
			        <TimelineItem v-for="(item,index) in BaseMsg.Works" :key="index">
		            <p class="P-FW-Bold P-Inline-Block">{{item.CompanyName}}</p><p class="P-Inline-Block Timeline-Time">{{new Date(item.StartTime).toLocaleDateString().replace(/\//g,'.')}} - {{new Date(item.EndTime).toLocaleDateString().replace(/\//g,'.')}}</p>
		            <p class="content">{{item.PositionName}}</p>
			        </TimelineItem>
			        <p v-if="BaseMsg.Works.length==0" class="P-MT-10" style="text-indent: 24px;">暂无工作经历</p>
			    	</Timeline>
	  			</div>
  				<div class="Right-Inline"></div>
	  			<div class="Col-Pd">
	  				<h2>教育/培训经历</h2>
	  				<Timeline class="P-MT-10">
			        <TimelineItem v-for="(item,index) in BaseMsg.Educations" :key="index">
		            <p class="P-FW-Bold P-Inline-Block">{{item.School}}</p><p class="P-Inline-Block Timeline-Time">{{new Date(item.StartTime).toLocaleDateString().replace(/\//g,'.')}} - {{new Date(item.EndTime).toLocaleDateString().replace(/\//g,'.')}}</p>
		            <p class="content">专业：{{item.Profession}}</p>
		            <p class="content" style="margin-top: 6px;">学位/证书：{{item.Education}}</p>
			        </TimelineItem>
			        <p v-if="BaseMsg.Educations.length==0" class="P-MT-10" style="text-indent: 24px;">暂无教育/培训经历</p>
			    </Timeline>
	  			</div>
	  			<div class="Right-Inline"></div>
	  			<div class="Col-Pd" >
	  				<h2>入职信息</h2>
		  			<span class="P-Inline-Block P-W-100-Percent P-MT-20" >部门：{{ OtherMsg.OrganizationName}}</span>
		  			<span class="P-Inline-Block W40 P-MT-20" >入职时间：{{new Date(OtherMsg.CreateTime).toLocaleDateString().replace(/\//g,'.')}}</span>
		  			<span class="P-Inline-Block W40 P-MT-20" >转正时间：{{BaseMsg.Salary.TryOutTime.indexOf('1900') > -1 ? '-' : new Date(BaseMsg.Salary.TryOutTime).toLocaleDateString().replace(/\//g,'.')}}</span>
		  			<span class="P-Inline-Block W40 P-MT-20">试用薪资：{{SetSecret(BaseMsg.Salary.TrialSalary)}}</span>
		  			<span class="P-Inline-Block W40 P-MT-20" >人事部审核人：{{BaseMsg.ConfirmName === "" ? '-' : BaseMsg.ConfirmName}}</span>
		  			<span class="P-Inline-Block W40 P-MT-20" >主管：{{BaseMsg.SReviewName === "" ? '-' : BaseMsg.SReviewName}}</span>
		  			<span class="P-Inline-Block W40 P-MT-20" >经理：{{BaseMsg.MReviewName === "" ? '-' : BaseMsg.MReviewName}}</span>
	  			</div>
	  			<div class="Right-Inline"></div>
	  			<div class="Col-Pd" v-if="(UserStatus && JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.SReviewId)||(JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.MReviewId)||(JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.ConfirmId)">
	  				<h2>审核记录</h2>
	  				<Timeline class="P-MT-10">
			        <TimelineItem v-for="(item,index) in BaseMsg.ReviewHistory" :key="index">
		            <p class="P-FW-Bold P-Inline-Block">{{item.PositionName}}</p><p class="P-Inline-Block Timeline-Time">{{new Date(item.ReviewTime).toLocaleDateString().replace(/\//g,'.')}}</p><br />
		            <p class="content P-Inline-Block">审核人：{{item.ReviewName}}</p><p class="P-Inline-Block" style="margin-left: 20px;">审核结果：{{item.ReviewStatus == 1 ? '通过' : '不通过'}}</p>
		            <p class="content" style="margin-top: 6px;">审核备注：{{item.Remark}}</p>
			        </TimelineItem>
			        <p v-if="BaseMsg.ReviewHistory.length==0" class="P-MT-10" style="text-indent: 24px;">暂无审核记录</p>
			    </Timeline>
	  			</div>
	  		</Col>
	  		<div class="Mid_Line"></div>
	  		</div>
	  	</Col>
      <ShowBigPic ref="ShowBigPic"></ShowBigPic>
  	</div>
    <Col span="24" class="P-TA-R P-MT-10" style="padding: 0px 214px;">
	    <!-- <Button @click="GoRecordList" v-if="JSON.parse($Cookie.Get('frler_user')).Status > 2">返回员工档案列表</Button> -->
	    <Button v-if="JSON.parse($Cookie.Get('frler_user')).Status < 3" @click="$Log.Out()">返回登录</Button>
    </Col>
    
    <Input class="P-MT-20" placeholder="请在此输入备注" :rows="5" type="textarea" v-model="Remark" v-if="IsAudit && UserStatus && ((Powers.DocumentSReview && JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.SReviewId)||(Powers.DocumentMReview && JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.MReviewId))"></Input>
    <Form class="P-TA-C P-MT-20" onsubmit="return false" v-if="IsAudit">
      <Button type="primary" class="P-MR-20" @click="Pass(true, 'S')" v-if="Powers.DocumentSReview && UserStatus && JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.SReviewId">通过</Button>
      <Button type="warning" @click="Pass(false, 'S')" v-if="Powers.DocumentSReview && UserStatus && JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.SReviewId">退回修改</Button>
    </Form>
    <Form class="P-TA-C P-MT-20" v-if="IsAudit">
      <Button type="primary" class="P-MR-20" @click="Pass(true, 'M')" v-if="Powers.DocumentMReview && UserStatus && JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.MReviewId">通过</Button>
      <Button type="warning" @click="Pass(false, 'M')" v-if="Powers.DocumentMReview &&UserStatus && JSON.parse($Cookie.Get('frler_user')).UserId==BaseMsg.MReviewId">退回修改</Button>
    </Form>

    </Col>
    <!---------------------------------------打印版本---------------------------------------------->
    <Col span="24" style="display: none;" id="record">
    <Col span="24">
    <h1 style="text-align: center;margin-bottom: -6px;">弗睿网络科技（广州）有限公司</h1>
    <h2 style="text-align: center;">员工入职登记表</h2>
    </Col>
    <Col span="24" style="margin-top:20px;padding: 0 10px;">
    <!--表格-->
    <Col span="24">
    <span style="font-size: 14px;font-family:'宋体'">职位：{{OtherMsg.PositionName}}</span>
    <span style="font-size: 14px;float: right;font-family:'宋体'">编号：{{BaseMsg.Summary.UserCode}}</span>
    </Col>
    </Col>
    <Col span="24" style="margin-top: 5px;padding: 0 10px;">
    <!--基本信息表格-->
    <table class="View-Table" border="1" cellspacing="0" cellpadding="14" width="100%" style="font-size: 16px;font-family:'宋体';">
      <tr>
        <th colspan="5">基本信息</th>
      </tr>
      <tr>
        <th>姓名</th>
        <td>{{BaseMsg.Summary.UserName}}</td>
        <th>性别</th>
        <td>{{BaseMsg.Summary.Sex == 1 ? '男' : '女'}}</td>
        <th rowspan="6" style="width:180px;">
          <!-- <img :src="Head" width="120" height="150" /> -->
        </th>
      </tr>
      <tr>
        <th>出生日期</th>
        <td>{{new Date(BaseMsg.DateOfBirth).toLocaleDateString()}}</td>
        <th>民族</th>
        <td>{{BaseMsg.Nation}}</td>
      </tr>
      <tr>
        <th>婚姻状态</th>
        <td>{{BaseMsg.MaritalStatus == 1 ? '未婚' : BaseMsg.MaritalStatus == 2 ? '已婚' : BaseMsg.MaritalStatus == 3 ? '离异' : '丧偶'}}</td>
        <th>身份证号</th>
        <td>{{BaseMsg.IdNumber}}</td>
      </tr>
      <tr>
        <th>毕业院校</th>
        <td>{{BaseMsg.School}}</td>
        <th>专业</th>
        <td>{{BaseMsg.Profession}}</td>
      </tr>
      <tr>
        <th>户口性质</th>
        <td>{{BaseMsg.AccountNature == 1 ? '本地农村' : BaseMsg.AccountNature == 2 ? '本地城镇' : BaseMsg.AccountNature == 3 ? '外地农村' : '外地城镇'}}</td>
        <th>户口所在地</th>
        <td>{{BaseMsg.LocationProvince}}{{BaseMsg.LocationCity}}</td>
      </tr>
      <tr>
        <th>语言</th>
        <td colspan="3">{{BaseMsg.Language}}</td>
      </tr>
      <tr>
        <th>现住地址</th>
        <td colspan="2" style="word-break: break-all;max-width: 200px;">{{BaseMsg.NowAddress}}</td>
        <th>联系电话</th>
        <td>{{BaseMsg.Summary.TelePhone}}</td>
      </tr>
      <tr>
        <th>户籍地址</th>
        <td colspan="2" style="word-break: break-all;max-width: 200px;">{{BaseMsg.AccountAddress}}</td>
        <th>家庭电话</th>
        <td>{{BaseMsg.FamilyPhone}}</td>
      </tr>
      <tr>
        <th>紧急联系人</th>
        <td colspan="2">{{BaseMsg.UrgentContact}}</td>
        <th>联系电话</th>
        <td>{{BaseMsg.UrgentContactPhone}}</td>
      </tr>
      <tr>
        <th>紧急联系人与本人关系</th>
        <td colspan="2">{{BaseMsg.RelationShip}}</td>
        <th>介绍人</th>
        <td>{{BaseMsg.Introducer.UserName}}</td>
      </tr>
      <tr>
        <th>介绍人与本人关系</th>
        <td colspan="2">{{BaseMsg.IntroducerRelationShip}}</td>
        <th>介绍人职位</th>
        <td>{{BaseMsg.Introducer.PositionName}}</td>
      </tr>
      <tr>
        <th>介绍人签名</th>
        <td colspan="4"></td>
      </tr>
    </table>
    <!--工作经历表格-->
    <table class="View-Table" border="1" cellspacing="0" cellpadding="8" width="100%" style="margin-top: 20px;font-family:'宋体'">
      <tr>
        <th colspan="5">工作经历</th>
      </tr>
      <tr v-if="!BaseMsg.Works.length" style="text-align: center;">
        <td colspan="5">暂无工作经历</td>
      </tr>
      <tr v-if="BaseMsg.Works.length">
        <th>起止日期</th>
        <th style="word-break: break-all;max-width: 200px;">单位名称</th>
        <th style="word-break: break-all;max-width: 200px;">职位</th>
      </tr>
      <tr class="P-TA-C" v-for="(item,index) in BaseMsg.Works" :key="index" style="text-align: center;">
        <td>{{new Date(item.StartTime).toLocaleDateString()}} - {{new Date(item.EndTime).toLocaleDateString()}}</td>
        <td>{{item.CompanyName}}</td>
        <td>{{item.PositionName}}</td>
      </tr>
    </table>
    <!--教育、培训经历表格-->
    <table class="View-Table" border="1" cellspacing="0" cellpadding="8" width="100%" style="margin-top: 20px;font-family:'宋体'">
      <tr>
        <th colspan="5">教育/培训经历</th>
      </tr>
      <tr v-if="!BaseMsg.Educations.length" class="P-TA-C">
        <td colspan="5">暂无教育/培训经历</td>
      </tr>
      <tr v-else>
        <th>起止日期</th>
        <th style="word-break: break-all;max-width: 200px;">学校/机构名称</th>
        <th style="word-break: break-all;max-width: 200px;">专业</th>
        <th>获得学位/证书</th>
      </tr>
      <tr class="P-TA-C" v-for="(item,index) in BaseMsg.Educations" :key="index">
        <td>{{new Date(item.StartTime).toLocaleDateString()}} - {{new Date(item.EndTime).toLocaleDateString()}}</td>
        <td>{{item.School}}</td>
        <td>{{item.Profession}}</td>
        <td>{{item.Education}}</td>
      </tr>
    </table>
    <p>声明：本人保证以上资料全部属实。如有虚假，接受公司无偿解雇处分，并承担相应法律责任。</p>
    <p style="text-align: right;">员工签名：__________________</p>
    <p style="text-align: right;">日期：______年___月___日</p>
    </Col>
    </Col>
  </Row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Admin';
import getLodop from '@/assets/LODOP/LodopFuncs';

@Component({
  name: 'ViewFile',
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue')
  }
})
export default class ViewFile extends Vue {
  // @Watch('ShowBigPic')
  // private ShowChange(val: boolean):void{
  //   if (!val) {
  //     this.ImgSrc = "";
  //   }
  // }

  private mounted() {
    this.GetData();
    this.GetDocument();
    this.IsAudit = sessionStorage.getItem('AuditFile') === 'true' ? true : false;
  }

  //获取信息展示
  private GetData():void{
    this.$set(this.OtherMsg, 'CreateTime', sessionStorage.getItem('CreateTime'))
    this.$set(this.OtherMsg, 'OrganizationName', sessionStorage.getItem('OrganizationName'))
    this.$set(this.OtherMsg, 'PositionName', sessionStorage.getItem('PositionName'))
    let power = JSON.parse(sessionStorage.getItem('TreeResource') as string).Point
    power.forEach( (item:any) => { this["Powers"][item.ElementId] = true })
  }

  //获取基本信息展示
  private GetDocument():void{
    this.$Request.Post({
      Server: this.$Server.Admin,
      Api: {
        Address: this.$Api.UserDocumentInfo,
        Login: true
      },
      Data: sessionStorage.getItem('Id'),
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.BaseMsg = Res.Data.Data;
          this.IsItself = JSON.parse(this.$Cookie.Get('frler_user')).UserId == this.BaseMsg.Id ? true: false;
          
        } else {
          this.$Request.Error(Res);
        }
      }
    })
  }
  
  // 设置保密显示
  private SetSecret(arg: any):string|number {
    let userid = JSON.parse(this.$Cookie.Get('frler_user')).UserId;
    if (userid == this.BaseMsg.SReviewId || userid == this.BaseMsg.MReviewId || userid == this.BaseMsg.ConfirmId || userid == this.BaseMsg.Id) {
      return arg;
    } else {
      return '****';
    }
  }
  private ShowFileImg(Url: string):void {
    // this.ShowBigPic = true;
    // this.ImgSrc = obj;
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }

  //审核
  private Pass(bool: boolean, flag:string):void {
    const PostData = {
      UserId: sessionStorage.getItem('Id'),
      Id: JSON.parse(this.$Cookie.Get('frler_user')).UserId,
      IsPass: bool,
      Remark: this.Remark
    }
    this.$UI.Loading.Show();
    this.$Request.Post({
			Server: this.$Server.Admin,
			Api: {
				Address: flag === 'M' ? this.$Api.UserDocumentMReview : this.$Api.UserDocumentSReview,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          if (bool) {
            this.$UI.Tips.Floating('success', `审核员工档案成功`);
          } else {
            this.$UI.Tips.Floating('success', `操作成功`);
          }
          sessionStorage.setItem('AuditFile', 'false');
          this.$set(this,'IsAudit', false)
          this.GetData();
          this.GetDocument();
				} else {
					this.$Request.Error(Res);
				}
				this.$UI.Loading.Hide();
			}
		})
  }
  
  //修改
  private EditRecord():void {
    let To:any = {
      name: 'ModifyFile',
      query: { IsCreate: false }
    }
    this.$router.replace(To);
  }

  //关闭返回列表
  // private GoRecordList() {
  //   window.close();
  // }

  private IsItself: boolean = false; //当前是否查看自己
  private Editable:boolean = sessionStorage.getItem('Id') == JSON.parse(this.$Cookie.Get('frler_user')).UserId && (Number(sessionStorage.getItem('Status')) < 3);
  private Head: string = '';
  private ImageServer: string = this.$Server.File;
  private UserStatus:boolean = Number(sessionStorage.getItem('Status')) === 3; //状态为试用期
  // private ShowBigPic: boolean = false; //查看大图片标识
  // private ImgSrc:string = ''; //模态框图片链接

  /* 基本信息  */
  private BaseMsg: Interface.PersonalMs = new Interface.PersonalMs() 
  private OtherMsg: Interface.EmployeeFile = new Interface.EmployeeFile()
  private Remark: string = ""
  private Powers: PInterface.Power = {}
  private IsAudit: boolean = false; //标识是否审核页

  private print() {
    if (getLodop(this) == undefined) {
      return;
    }

    var LODOP; //声明为全局变量
    LODOP = getLodop();

    var that = this;
    try {
      if (LODOP.VERSION) {
        prn1_preview();

      };
    } catch (err) {}

    function prn1_preview() {

      LODOP = getLodop();
      LODOP.PRINT_INIT("");
      LODOP.SET_PRINT_MODE("FULL_HEIGHT_FOR_OVERFLOW", true);
      LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW", true);
      LODOP.ADD_PRINT_HTML(20, 0, '100%', '100%', (document as any).getElementById("record").innerHTML);
      LODOP.ADD_PRINT_BARCODE(28, '79%', 160, 30, "128b", that.BaseMsg.Summary.UserCode);
      LODOP.PRINT_DESIGN();
      LODOP.PRINT();
    };
  }

}

</script>
<style lang="less">
.View-Record{
  text-align: left;
  padding: 0px 250px;

  #Head{
    width:136px;
    height:136px;
    cursor:pointer;
    background-size: cover;
    background-position: center;
  }

  .Warp{
    margin: 0 auto;
    width: 1200px;
    min-height: 800px;
    border: 1px solid #f1f1f1;
    padding: 20px;
    border-radius: 4px;
    overflow: hidden;
    .Operator{
      .Ic{
        margin: 8px 5px 0px 0px;
      }
    }
    .Right_Info{
      height: 136px;
      background: #4180b1;
      float:right;

      .Info{
        color:#fff;
        padding: 0 40px;
        margin-top: -4px;
      }
    }
    .Base-Msg{
      min-height: 570px;
      position: relative;

      .Left-Line{
        width: 96%;
        height:4px;
        background: #4180b1;
        border-radius: 4px;
      }
      .Base-Msg-Right{
        padding: 10px 30px;
      }
      .Mid_Line{
        width: 4px;
        height:100%;
        background: #4180b1;
        border-radius: 4px;
        margin-left: 42%;
        position: absolute;
      }
    }
  }

  .Timeline-Time{
    color: #4180b1;
    margin-left: 10px;
  }
  .Right-Inline{
    width: 94%;
    height:4px;
    background: #4180b1;
    border-radius: 4px;
    margin-left: 30px;
  }
  .Col-Pd{
    padding: 10px 30px;
  }

  .View-Table {
    width: 100%;
    color: #666;
    border-radius: 5px;
    border-color: transparent;
    border-bottom: 1px solid #BCBCBC;
    border-right: 1px solid #BCBCBC;
  }

  .View-Table tr {
    border-color: transparent;
  }

  .View-Table td,
  .View-Table th {
    border: 1px solid #BCBCBC;
    border-bottom-color: transparent;
    border-right-color: transparent;
    padding: 12px 6px;
    font-size: 14px;
    overflow: hidden;
    white-space: normal;
    word-break: break-all;
    max-width: 200px;
  }

  .View-Table th {
    text-align: center;
  }

  .File-Box {
    width: 70px;
    display: inline-block;
    margin-right: 20px;
    height: 70px;
    text-align: center;
    cursor: pointer;
  }

  .File-Box p {
    cursor: default;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .W40{
    width: 40%;
  }
  .W50{
    width: 50%;
  }
  .OH{
    overflow: hidden;
  }
}

</style>
