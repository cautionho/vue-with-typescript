(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d228c26"],{db0b:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Row",[a("Modal",{attrs:{title:e.TabTitle,"mask-closable":!1,width:e.IsBatch?600:1200},on:{"on-cancel":function(t){return e.EmitPurchase(!1)}},model:{value:e.OpenReviewModal,callback:function(t){e.OpenReviewModal=t},expression:"OpenReviewModal"}},[a("PonDetails",{directives:[{name:"show",rawName:"v-show",value:!e.IsBatch,expression:"!IsBatch"}],ref:"PonDetails",attrs:{HideArrival:!0,IsBatch:e.IsBatch,CurrOperatPon:e.CurrentPon,PurchaserList:e.PurchaserList}}),e.IsBatch?e._e():a("footer",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.PostReview(1)}}},[e._v("通过")]),a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.PostReview(2)}}},[e._v("退回修改")]),a("Button",{attrs:{type:"error"},on:{click:function(t){return e.PostReview(3)}}},[e._v("不通过")]),a("Button",{attrs:{type:"default"},on:{click:function(t){return e.EmitPurchase(!1)}}},[e._v("返回")])],1),e.IsBatch?a("Form",{ref:"BatchReviewForm",attrs:{"label-width":100,model:e.BatchReviewForm}},[a("FormItem",{attrs:{label:"审核结果："}},[a("RadioGroup",{model:{value:e.BatchReviewForm.Status,callback:function(t){e.$set(e.BatchReviewForm,"Status",t)},expression:"BatchReviewForm.Status"}},[a("Radio",{attrs:{label:"1"}},[e._v("通过")]),a("Radio",{attrs:{label:"2"}},[e._v("不通过")]),a("Radio",{attrs:{label:"3"}},[e._v("退回修改")])],1)],1),1===e.CurrentPon?a("FormItem",{attrs:{label:"更换采购员："}},[a("Select",{attrs:{placeholder:"请选择采购员",onChange:e.OnClearSelect.bind(this,"Purchaser"),options:e.PurchaserList},model:{value:e.BatchReviewForm.Purchaser,callback:function(t){e.$set(e.BatchReviewForm,"Purchaser",t)},expression:"BatchReviewForm.Purchaser"}})],1):e._e(),a("FormItem",{attrs:{label:"备注："}},[a("Input",{attrs:{placeholder:"请输入备注",type:"textarea",autosize:{minRows:4,maxRows:4}},model:{value:e.BatchReviewForm.Remark,callback:function(t){e.$set(e.BatchReviewForm,"Remark",t)},expression:"BatchReviewForm.Remark"}})],1)],1):e._e(),e.IsBatch?a("footer",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.PostReview(0)}}},[e._v("提交")]),a("Button",{attrs:{type:"default"},on:{click:function(t){return e.EmitPurchase(!1)}}},[e._v("取消")])],1):e._e()],1)],1)},i=[],s=(a("6412"),a("76bb"),a("e8f2"),a("6bf8"),a("3231")),n=a("064d"),o=a("46d7"),c=a("631e"),u=a("4a81"),l=a("d11d"),h=a("c638"),v=function(e){Object(o["a"])(a,e);var t=Object(c["a"])(a);function a(){var e;return Object(s["a"])(this,a),e=t.apply(this,arguments),e.OpenReviewModal=!1,e.PurchaserList=[],e.CurrentPon=0,e.IsBatch=!1,e.TabTitle="",e.SelecData=[],e.BatchReviewForm=new h["a"].ReviewPostData,e}return Object(n["a"])(a,[{key:"EmitPurchase",value:function(e){this.OpenReviewModal=!1,this.$set(this,"BatchReviewForm",new h["a"].ReviewPostData)}},{key:"TriggerModal",value:function(e,t,a,r){1!==r||e.every((function(e){return 2==e.Status}))?2!==r||e.every((function(e){return 3==e.Status}))?3!==r||e.every((function(e){return 10==e.Status}))?(this.CurrentPon=r,this.IsBatch=t,this.SelecData=e,this.PurchaserList=a,this.TabTitle=1===r?"采购主管审核":2===r?"销售主管确认":3===r?"总经理审核":"",this.IsBatch&&(this.BatchReviewForm.Status="1"),this.OpenReviewModal=!0,this.$refs.PonDetails.TriggerModal(this.SelecData)):this.$UI.Tips.Floating("warning","请选择状态为待总经理审核的采购单进行操作"):this.$UI.Tips.Floating("warning","请选择状态为待销售确认的采购单进行操作"):this.$UI.Tips.Floating("warning","请选择状态为待采购主管审核的采购单进行操作")}},{key:"OnClearSelect",value:function(e){void 0==this.BatchReviewForm[e]&&this.$set(this.BatchReviewForm,e,"")}},{key:"PostReview",value:function(e){var t=null;0!==e?(t=JSON.parse(JSON.stringify(this.$refs["PonDetails"].ReviewForm)),t.Id=[this.SelecData[0].Id],t.Status=e):(t=JSON.parse(JSON.stringify(this.BatchReviewForm)),t.Id=this.SelecData.map((function(e){return e.Id})),t.Status=Number(t.Status)),1!==this.CurrentPon?delete t.Purchaser:t.Purchaser=""===t.Purchaser?0:t.Purchaser,this.PostReviewReq(t)}},{key:"PostReviewReq",value:function(e){var t=this;this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Purchase,Api:{Address:1===this.CurrentPon?this.$Api.PurchaseOrderPMReview:2===this.CurrentPon?this.$Api.PurchaseOrderSMReview:3===this.CurrentPon?this.$Api.PurchaseOrderGMReview:"",Login:!0},Data:e,Callback:function(e){e.IsSuccess?(t.$UI.Tips.Floating("success","审核成功"),t.EmitPurchase(!0)):(t.$Request.Error(e),t.$UI.Loading.Hide())}})}}]),a}(l["d"]);u["a"]([Object(l["b"])()],v.prototype,"EmitPurchase",null),v=u["a"]([Object(l["a"])({name:"ReviewPon",components:{PonDetails:function(){return a.e("chunk-2d0e6500").then(a.bind(null,"97e1"))}}})],v);var w=v,d=w,m=a("4023"),R=Object(m["a"])(d,r,i,!1,null,null,null);t["default"]=R.exports}}]);