(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d22e158"],{f9f5:function(t,a,e){"use strict";e.r(a);var o=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"P-Inline-Block "},[e("Col",[e("Button",{staticClass:"P-MR-10 P-MB-10",attrs:{type:"primary"},on:{click:function(a){return t.ChangeRes(!0)}}},[t._v("下载产品模板")]),e("Modal",{attrs:{title:"下载产品模板","mask-closable":!1},on:{"on-cancel":function(a){return t.ChangeRes(!1)}},model:{value:t.DownloadPro,callback:function(a){t.DownloadPro=a},expression:"DownloadPro"}},[e("Form",{attrs:{onsubmit:"return false",name:"downloadProForm","label-width":100}},[e("Form-item",{attrs:{label:"选择类目：",prop:"BrandUrl"}},[e("Cascader",{attrs:{transfer:"",placeholder:"请选择类目",clearable:"",data:t.CategoryList,"load-data":t.LoadData,"change-on-select":"",filterable:""},model:{value:t.DownCategoryIds,callback:function(a){t.DownCategoryIds=a},expression:"DownCategoryIds"}}),e("p",{staticClass:"mt10"},[t._v("说明：每次只能上传同一个类目的产品")])],1)],1),e("div",{attrs:{slot:"footer"},slot:"footer"},[e("Button",{attrs:{type:"primary"},on:{click:t.PostDownload}},[t._v("下载")]),e("Button",{on:{click:function(a){return t.ChangeRes(!1)}}},[t._v("取消")])],1)],1)],1)],1)},n=[],r=(e("d9b9"),e("76bb"),e("6bf8"),e("eb83"),e("5c62")),s=e("3231"),l=e("064d"),i=e("46d7"),c=e("631e"),d=e("4a81"),u=e("d11d"),g=function(t){Object(i["a"])(e,t);var a=Object(c["a"])(e);function e(){var t;return Object(s["a"])(this,e),t=a.apply(this,arguments),t.DownloadPro=!1,t.DownCategoryIds=[],t.CategoryList=[],t}return Object(l["a"])(e,[{key:"ChangeRes",value:function(t){this.DownloadPro=!1}},{key:"TriggerModal",value:function(t){this.CategoryList=t,this.DownCategoryIds=[],this.DownloadPro=!0}},{key:"LoadData",value:function(t,a){var e=this;t.loading=!0,this.$Request.Post({Server:this.$Server.Sales,Api:{Address:this.$Api.AllegroStoreCategoryDropList,Login:!0},Data:t.value,Callback:function(o){o.IsSuccess?(t.loading=!1,o.Data.Data.length<1?e.$nextTick((function(){e.$delete(t,"loading"),e.$set(e,"DownCategoryIds",t.arr)})):(e.$set(t,"children",o.Data.Data.map((function(a){var e=JSON.parse(JSON.stringify(t.arr));return e.push(a.Key.toString()),{value:a.Key.toString(),label:a.Value,children:[],loading:!1,arr:e}}))),e.$nextTick((function(){var a;e.$set(e,"DownCategoryIds",[]),(a=e.DownCategoryIds).push.apply(a,Object(r["a"])(t.arr))})),t.loading=!1),a()):(t.loading=!1,e.$Request.Error(o))}})}},{key:"PostDownload",value:function(){var t=this;this.DownCategoryIds.length<1?this.$UI.Tips.Floating("warning","请选择类目"):(this.$UI.Loading.Show(),this.$Request.Post({Server:this.$Server.Sales,Api:{Address:this.$Api.AllegroStoreExcelTemplate,Login:!0},Data:this.DownCategoryIds[this.DownCategoryIds.length-1],Callback:function(a){a.IsSuccess?(t.ChangeRes(!1),window.open("".concat(t.$Server.Sales,"/").concat(a.Data.Data),"_blank")):t.$Request.Error(a),t.$UI.Loading.Hide()}}))}}]),e}(u["d"]);d["a"]([Object(u["b"])()],g.prototype,"ChangeRes",null),g=d["a"]([Object(u["a"])({name:"AllegroDownloadPro"})],g);var h=g,p=h,w=e("4023"),D=Object(w["a"])(p,o,n,!1,null,null,null);a["default"]=D.exports}}]);