(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2e1fdb78"],{"0329":function(e,t,a){"use strict";var i=a("3be3"),o=a.n(i);o.a},"3be3":function(e,t,a){},"8c92":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Col",[a("Modal",{attrs:{title:"批量上传图片","mask-closable":!1,width:500,id:"PhotoRequestUploadImg"},on:{"on-cancel":function(t){return e.ChangeMsg(!1)}},model:{value:e.IsShowModal,callback:function(t){e.IsShowModal=t},expression:"IsShowModal"}},[a("Form",{attrs:{onsubmit:"return false","label-width":100}},[a("FormItem",{attrs:{label:"图片(仅支持jpg、png格式,大小不超过2M)："}},[e._l(e.FileArr,(function(t,i){return a("div",{staticClass:"demo-upload-list"},[[a("img",{attrs:{src:e.$Server.File+"/"+t}}),a("div",{staticClass:"demo-upload-list-cover"},[a("Icon",{attrs:{type:"ios-eye-outline"},nativeOn:{click:function(a){return e.ShowBigImg(t)}}}),a("Icon",{attrs:{type:"ios-trash-outline"},nativeOn:{click:function(t){return e.RemoveImg(i)}}})],1)]],2)})),a("Upload",{ref:"uploadFile",staticClass:"P-Inline-Block P-VA-T P-Pointer",attrs:{"show-upload-list":!1,action:e.UploadUrl,headers:e.Headers,"max-size":2048,accept:".jpg, .jpge, .png",format:["jpg","jpeg","png"],"on-format-error":e.HandleFormatError,"on-exceeded-size":e.HandleMaxSize,"before-upload":e.UploadBefore,"on-success":e.UploadSuccess}},[a("div",{staticStyle:{width:"60px",height:"60px","line-height":"60px","text-align":"center",border:"1px dashed #dcdee2"}},[a("Icon",{attrs:{type:"ios-camera",size:"20"}})],1)])],2)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"primary"},on:{click:e.PostOpe}},[e._v("提交")]),a("Button",{on:{click:function(t){return e.ChangeMsg(!1)}}},[e._v("取消")])],1)],1),a("ShowBigPic",{ref:"ShowBigPic"})],1)},o=[],s=(a("76bb"),a("cee1"),a("1ff3"),a("6bf8"),a("3231")),r=a("064d"),n=a("46d7"),l=a("631e"),c=a("4a81"),u=a("d11d"),d=function(e){Object(n["a"])(a,e);var t=Object(l["a"])(a);function a(){var e;return Object(s["a"])(this,a),e=t.apply(this,arguments),e.FileArr=[],e.CurrSeleData=[],e.IsShowModal=!1,e.UploadUrl=e.$Server.Settings+e.$Api.UploadImage,e.Headers={userid:JSON.parse(e.$Cookie.Get("frler_user")).UserId},e}return Object(r["a"])(a,[{key:"ChangeMsg",value:function(e){this.FileArr=[],this.$set(this,"IsShowModal",!1)}},{key:"TriggerModal",value:function(e){this.CurrSeleData=e,this.IsShowModal=!0}},{key:"PostOpe",value:function(){var e=this;this.FileArr.length<1?this.$UI.Tips.Floating("warning","请上传图片"):(this.ChangeImg(),this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Purchase,Api:{Address:this.$Api.PhotoRequestChangeStatus,Login:!0},Data:{Id:this.CurrSeleData.map((function(e){return e.Id})),Remark:"",Status:3,Operator:0},Callback:function(t){t.IsSuccess?(e.$UI.Tips.Floating("success","操作成功"),e.ChangeMsg(!0)):(e.$Request.Error(t),e.$UI.Loading.Hide())}}))}},{key:"ChangeImg",value:function(){var e=this;this.$Request.Post({Server:this.$Server.Purchase,Api:{Address:this.$Api.PhotoRequestUpload,Login:!0},Data:{Id:this.CurrSeleData.map((function(e){return e.Id})),Images:this.FileArr},Callback:function(t){t.IsSuccess||e.$Request.Error(t)}})}},{key:"ShowBigImg",value:function(e){this.$refs.ShowBigPic.Trigger(e)}},{key:"RemoveImg",value:function(e){this.FileArr.splice(e,1)}},{key:"UploadBefore",value:function(){this.$UI.Loading.Show()}},{key:"UploadSuccess",value:function(e){e.IsSuccess?(this.FileArr.push(e.Data.Url),this.$UI.Loading.Hide(),this.$refs["uploadFile"].clearFiles()):this.$Request.Error(e)}},{key:"HandleFormatError",value:function(e){this.$UI.Tips.Floating("warning","文件[".concat(e.name,"]格式不为JPG/JPGE/PNG，请检查")),this.$UI.Loading.Hide()}},{key:"HandleMaxSize",value:function(e){this.$UI.Tips.Floating("warning","文件".concat(e.name,"大小超过2M，请检查")),this.$UI.Loading.Hide()}}]),a}(u["d"]);c["a"]([Object(u["b"])()],d.prototype,"ChangeMsg",null),d=c["a"]([Object(u["a"])({name:"PhotoRequestUploadImg",components:{ShowBigPic:function(){return a.e("chunk-c0a1d894").then(a.bind(null,"6156"))}}})],d);var h=d,p=h,g=(a("0329"),a("4023")),f=Object(g["a"])(p,i,o,!1,null,null,null);t["default"]=f.exports}}]);