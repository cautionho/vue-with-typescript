<template>
  <Col class="P-Inline-Block" id="Template">
    <Modal v-model="ShowModal" title="作图需求详情" @on-cancel="ClearModal(0)" :mask-closable="false" width='1000' class="Container-Tabs">
      <Form inline :label-width="120" :model="OperateForm" ref="OperateForm"  onsubmit="return false;" name="OperateForm">
        <Tabs name="Detail" type="card" :closable="false" :value="ActiveTab" @on-click="ChangeTabs" >
          <TabPane label="基本信息" name="Base" tab="Detail">
            <Row>
              <Col span="24" >
                <Form-item label="发布人：" class="P-W-49-Percent P-MB-10" >
                  {{ OperateForm.CreateUserName }}
                </Form-item>
                <Form-item label="申请时间：" class="P-W-49-Percent P-MB-10">
                  {{ OperateForm.CreateTime ? $UI.Render.Date( OperateForm.CreateTime, true) : '-' }}
                </Form-item>
                <Form-item label="美工：" class="P-W-49-Percent P-MB-10">
                  {{ OperateForm.OperateUserName }}
                </Form-item>
                <Form-item label="品牌：" class="P-W-49-Percent P-MB-10">
                  {{ $Enums.Product.PhotoStatus[OperateForm.ProcessStatus - 1] }}
                </Form-item>
              </Col>
              <Col span="24" class="P-MT-10">
              </Col>
            </Row>
            <Row>
              <h2 class="P-TA-C">SPU列表</h2>
              <Col span="24" class="P-MT-10">
                <Table :columns="SpuCol" :data="OperateForm.SpuList" size="small" stripe :height="140" />
              </Col>
            </Row>
            <Row class="P-MT-10">
              <h2 class="P-TA-C">凸显SKU列表</h2>
              <Col span="24" class="P-MT-10">
                <Table :columns="SkuCol" :data="OperateForm.SkuList" size="small" stripe :height="140" />
              </Col>
            </Row>
            <Row>
              <Form-item label="描述：" class="P-W-100-Percent P-MB-10" >
                {{ OperateForm.CreateUserName }}
              </Form-item>
              <Form-item label="图片：" class="P-W-100-Percent P-MB-10" >
                <Col span="24" class="Max-Height">
                  <div class="demo-upload-list Cover-Picture P-MR-5" v-for="Item in OperateForm.Images" style="width: 200px;display:inline-block;position: relative;">
                    <img :src="`${$Server.File}/${Item}`" height="200" width="200">
                    <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="ShowPic(Item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="HandleRemove(Item)"  v-if="IsHandle"></Icon>
                    </div>
                  </div>
                  <Upload ref="Upload" 
                    v-if="IsHandle"
                    :show-upload-list="false" 
                    :on-success="HandleSuccessImages" 
                    :format="['jpg','jpeg','png']" 
                    :max-size="2048" 
                    :on-format-error="HandleFormatError" 
                    :on-exceeded-size="HandleMaxSize" 
                    type="drag" 
                    :action="UploadImgServer" 
                    style="display: inline-block; width: 200px;height:200px;">
                    <div style="height: 200px;width: 200px;">
                      <Icon type="camera" size="20" style="margin-top: 55px; color: #fff;"></Icon>
                      <p>上传图片</p>
                      <span style="padding-bottom: 12px;">仅支持jpg、png图片格式，大小不超过2M</span>
                    </div>
                  </Upload>
                </Col>
              </Form-item>
            </Row>
          </TabPane>
          <Tab-pane label="审核记录" name="Histroy" tab="Detail">
            <Table :columns="HistoryCol" :data="OperateForm.ProcessHistorys" size="small" stripe :height="600" ref="ProcessHistorys" />
          </Tab-pane>
        </Tabs>
      </Form>
      <!-- 放大图片 -->
      <ShowBigPic ref="ShowBigPic" />
      <!-- 添加SKU -->
      <footer slot="footer">
        <Button type="primary" @click="HandleOperator('HandleDownloadSkuImages')" v-if="IsHandle">下载素材图片</Button>
        <Button type="primary" @click="HandleSubmit" v-if="IsHandle">提交销售审核</Button>
        <Button type="primary" @click="HandleOperator('DrawingRequirementsOperator')" v-if="IsHandle">需求退回修改</Button>
        <Button @click="ClearModal(0)">返回</Button>
      </footer>
    </Modal>
  </Col>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Interface from "@/assets/Interface/Product";
import PInterface from "@/assets/Interface/Public";
@Component({
  name: "SkuDetail",
  components: {
    ShowBigPic: () => import('@/components/Public/ShowBigPic.vue'),
  }
})
export default class SkuDetail extends Vue {
  @Emit() HandleResMsg(Type: number, Handle?: string, Target?: Interface.DrawingRequirementsList): void {};

  // 编辑模态框
  private Trigger(Selected: Interface.DrawingRequirementsList[], IsHandle: boolean):void {

    this.IsHandle = IsHandle

    this.Target = Selected[0]

    if (Selected.length > 0) {
      this.GetSkuDetails(Selected[0].Id)
    }
  }

  // 打开模态框
  private OpenModal():void {
    this.ShowModal = true;
  }

  // 切换tab页
  private ChangeTabs(Val: string) {
    this.ActiveTab = Val;
  }

  // 获取SKU信息
  private GetSkuDetails(Id: number): void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.GetRequestDetail,
        Login: true
      },
      Data: Id,
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$set(this, 'OperateForm', Res.Data.Data);

          this.ShowModal = true; 
        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  // 关闭模态框
  private ClearModal(Val:number):void {
    this.ShowModal = false;
    this.OperateForm = new Interface.DrawingRequirementsDetail();
    ( this.$refs['OperateForm'] as Vue ).resetFields();
    this.ActiveTab = "Base";
    this.IsHandle = false;
    this.HandleResMsg(Val)
  }

  // 打开大图
  private ShowPic(Url: string): void {
    (this as any).$refs.ShowBigPic.Trigger(Url)
  }

  // 上传图片成功 - 上架图片
  private HandleSuccessImages(Res: any, File: any) {
    if (Res.IsSuccess == true) {
	    File.url = Res.Data.Url;
	    this.OperateForm.Images.push(Res.Data.Url);
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
  private HandleRemove(Url: string):void {
    this.OperateForm.Images.splice( this.OperateForm.Images.indexOf(Url), 1 );
  }

  // 调用方法
  private HandleOperator(Handle: string): void {
    this.ShowModal = false;
    this.HandleResMsg(2, Handle, this.Target);
  }

  // 提交销售审核
  private HandleSubmit(): void {

    if (this.OperateForm.Images.length === 0 ){
      this.$UI.Tips.Floating('warning', `请上传图片`);
      return;
    }

    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Purchase,
      Api: {
        Address: this.$Api.ArtistUploadImages,
        Login: true
      },
      Data: {
        PhotoProcessRequestId: this.OperateForm.Id,
        Urls: this.OperateForm.Images
      },
      Callback: (Res: PInterface.Res): void => {
        if (Res.IsSuccess) {
          this.$UI.Tips.Floating('warning', `提交销售审核成功`);
          this.ClearModal(1)
        } else {
          this.$Request.Error(Res);
        }
        this.$UI.Loading.Hide();
      }
    })
  }

  private ShowModal: boolean = false;  //模态框

  private Target: Interface.DrawingRequirementsList = new Interface.DrawingRequirementsList(); // 当前属性
  private IsHandle: boolean = false; // 区分处理

  private ActiveTab: string = "Base"; //tab索引值
  private UploadImgServer:string = this.$Server.Settings + this.$Api.UploadImage //上传图片服务器 接口

  private DropStatus: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Product.PhotoStatus); // 状态枚举下拉
 
  private OperateForm: Interface.DrawingRequirementsDetail = new Interface.DrawingRequirementsDetail() // SKU详情

  private SpuCol: PInterface.TableCol[] = [  //  SPU
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + params.row.Image + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              (this.$refs['ShowBigPic'] as any).Trigger(params.row.Image)
            }
          }
        })
      }
    },
    { title: 'SPU编号', key: 'SkuCode'},
    { title: 'SPU名称', key: 'SkuName', render: (h: any, params: any): string => {
			return h('div', [
				h('Tooltip', {
					props: {
						'content': params.row.SkuName,
						'maxWidth': 500
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: 'P-LINE-1' }, params.row.SkuName === "" ? '-' : params.row.SkuName)
				])
			])
		}},
  ]

  private SkuCol: PInterface.TableCol[] = [      // SKU
    { title: '图片', key: 'DefaultImage', width: 80, align: 'center', render: (h, params) => {
        return h('div', {
          style: {
            width: '45px',
            height: '45px',
            background: 'url(' + this.$Server.File + '/' + params.row.Image + ') no-repeat',
            backgroundSize: 'cover',
            margin: '0 auto',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              (this.$refs['ShowBigPic'] as any).Trigger(params.row.Image)
            }
          }
        })
      }
    },
    { title: 'SKU编号', key: 'SkuCode'},
    { title: 'SKU名称', key: 'SkuName', render: (h: any, params: any): string => {
			return h('div', [
				h('Tooltip', {
					props: {
						'content': params.row.SkuName,
						'maxWidth': 500
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: 'P-LINE-1' }, params.row.SkuName === "" ? '-' : params.row.SkuName)
				])
			])
		}},
  ]

  private HistoryCol: PInterface.TableCol[] = [ // 审核记录
    { title: '编号', key: 'Id', width: 100},
    { title: '审核人', key: 'AuditorName', width: 120},
    { title: '审核时间', key: '', width: 160, render: (h: any, params: any): string => h('div', this.$UI.Render.Date(params.row.AuditTime, true)) },
    { title: '审核记录', key: 'OperateLog', render: (h: any, params: any): string => {
			return h('div', [
				h('Tooltip', {
					props: {
						'content': params.row.OperateLog,
						'maxWidth': 500
					},
					class: 'P-W-100-Percent'
				}, [
					h('p', { class: 'P-LINE-1' }, params.row.OperateLog === "" ? '-' : params.row.OperateLog)
				])
			])
		}},
  ]
}
</script>

<style lang="less">
#Template{
  .Max-Height {
    max-height: 200px;
    overflow: auto;
  }
  .Cover-Picture{
    width: 200px;
    height: 200px;
    display: inline-block;
    position: relative;
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
}

</style>
