(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d224590"],{e06e:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Modal",{attrs:{title:e.Title,"mask-closable":!1,width:1200},on:{"on-cancel":e.CancelSupplier},model:{value:e.EnableSupplierModal,callback:function(t){e.EnableSupplierModal=t},expression:"EnableSupplierModal"}},[a("Row",[a("Col",{attrs:{span:"24"}},[a("Row",{staticClass:"P-Search-Group"},[a("Form",{ref:"SearchFilter",attrs:{inline:""},model:{value:e.SearchFilter,callback:function(t){e.SearchFilter=t},expression:"SearchFilter"}},[a("FormItem",{staticClass:"P-MB-10"},[a("Select",{staticClass:"P-W-200 P-ML-10",attrs:{placeholder:"筛选省份",options:e.AddCityList,optionValKey:"Id",optionKey:"Name"},model:{value:e.SearchFilter.Province,callback:function(t){e.$set(e.SearchFilter,"Province",t)},expression:"SearchFilter.Province"}}),a("Select",{staticClass:"P-W-200 P-ML-10",attrs:{placeholder:"筛选城市",options:e.CList,optionValKey:"Id",optionKey:"Name"},model:{value:e.SearchFilter.City,callback:function(t){e.$set(e.SearchFilter,"City",t)},expression:"SearchFilter.City"}}),a("Select",{staticClass:"P-W-200 P-ML-10",attrs:{placeholder:"筛选区域",options:e.AList,optionValKey:"Id",optionKey:"Name"},model:{value:e.SearchFilter.Area,callback:function(t){e.$set(e.SearchFilter,"Area",t)},expression:"SearchFilter.Area"}})],1),a("FormItem",{staticClass:"P-ML-10 P-MB-10"},[a("Input",{staticClass:"P-W-400",attrs:{placeholder:"搜索关键字"},model:{value:e.SearchFilter.SearchKey,callback:function(t){e.$set(e.SearchFilter,"SearchKey",t)},expression:"SearchFilter.SearchKey"}},[a("Select",{staticClass:"P-W-100 P-TA-L",attrs:{slot:"prepend",placeholder:"搜索关键词",onChange:e.OnClearSelect.bind(this,"SearchKeyType"),options:e.SearchKeyTypeDrop},slot:"prepend",model:{value:e.SearchFilter.SearchKeyType,callback:function(t){e.$set(e.SearchFilter,"SearchKeyType",t)},expression:"SearchFilter.SearchKeyType"}}),a("Button",{attrs:{slot:"append",type:"primary"},on:{click:e.SearchList},slot:"append"},[e._v("搜索")])],1)],1),a("FormItem",{staticClass:"P-ML-10 P-MB-10"},[a("Button",{attrs:{type:"warning"},on:{click:e.ResetList}},[e._v("重置")])],1)],1)],1)],1),a("Col",{attrs:{span:"24"}},[a("Table",{ref:"Supplier",attrs:{columns:e.TableCols,data:e.AddSupplierList,size:"small",stripe:"",height:e.CalculateTbHeight()},on:{"on-selection-change":e.SelectedData}})],1),a("Col",{staticClass:"P-MT-10",attrs:{span:"24"}},[a("Page",{attrs:{current:e.Pager.PageIndex,total:e.Pager.TotalItems,"page-size":e.Pager.PageSize,"page-size-opts":e.Pager.PageOpt,"show-total":"","show-sizer":"","show-elevator":""},on:{"on-change":e.ChangePage,"on-page-size-change":e.ChangePageSize}})],1)],1),a("footer",{attrs:{slot:"footer"},slot:"footer"},[e.IsMultiSelect?a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.SelectedSupplierModal()}}},[e._v("提交")]):e._e(),a("Button",{on:{click:e.CancelSupplier}},[e._v("取消")])],1)],1)},l=[],s=(a("d9b9"),a("3fa9"),a("cee1"),a("5c62")),r=a("3231"),n=a("064d"),c=a("46d7"),o=a("631e"),h=a("4a81"),p=a("d11d"),u=a("db83"),S=a("c638"),d=function(e){Object(c["a"])(a,e);var t=Object(o["a"])(a);function a(){var e;return Object(r["a"])(this,a),e=t.apply(this,arguments),e.EnableSupplierModal=!1,e.IsPeriod=!1,e.LoadingEnableTab=!0,e.IsMultiSelect=!1,e.CList=[],e.AList=[],e.SearchKeyTypeDrop=e.$Utils.GetEnumArr(e.$Enums.Purchase.SupplySearchType),e.OperateDrop=[],e.SearchFilter=new S["a"].SupplierSearch,e.Pager=new u["a"].Pager,e.SelectedSupplier=[],e.AddSupplierList=[],e.IsChangeSearchTable=!1,e.Title="",e.Cols=[{type:"selection",width:60,align:"center"},{title:"供应商名称",key:"SupplyName"},{title:"联系人",key:"Contact"},{title:"联系电话",key:"Phone"},{title:"地址",width:500,render:function(e,t){return e("p","".concat(t.row.ProvinceName).concat(t.row.CityName).concat(t.row.AreaName).concat(t.row.Street))}},{title:"操作",width:100,render:function(t,a){return t("div",[t("Button",{props:{type:"primary",size:"small"},on:{click:function(){e.SelcSingle(a.index)}}},"选择")])}}],e.TableCols=e.Cols,e}return Object(n["a"])(a,[{key:"EmitEableSupplier",value:function(e,t,a){this.EnableSupplierModal=!1}},{key:"ChangeProvince",value:function(e){this.CList=[],this.AList=[],this.SearchFilter.City=0,this.SearchFilter.Area=0,0!==e&&(this.CList=this.AddCityList.find((function(t){return t.Id===e})).ChildNodes)}},{key:"ChangeCity",value:function(e){this.AList=[],this.SearchFilter.Area=0,0!==e&&(this.AList=this.CList.find((function(t){return t.Id===e})).ChildNodes)}},{key:"TriggerModal",value:function(e,t,a){var i=this;this.IsPeriod=e,this.LoadingEnableTab=t,this.IsMultiSelect=a,this.LoadingEnableTab&&this.ResetList(),this.IsMultiSelect&&6==this.TableCols.length?this.TableCols.pop():this.IsMultiSelect||6!=this.TableCols.length||this.TableCols.splice(0,1),this.Title=this.IsMultiSelect?"添加供应商":"选择供应商",this.CancelSelect(),this.$nextTick((function(){i.$set(i,"EnableSupplierModal",!0)}))}},{key:"OnClearSelect",value:function(e){void 0==this.SearchFilter[e]&&this.$set(this.SearchFilter,e,"")}},{key:"GetList",value:function(){var e=this;this.$UI.Loading.Show(),this.$set(this,"AddSupplierList",[]);var t=JSON.parse(JSON.stringify(this.SearchFilter));t.Status=""===t.Status?"":Boolean(t.Status),t.IsPeriod=this.IsPeriod,delete t.LocationArea,this.$Request.Post({Server:this.$Server.Purchase,Api:{Address:this.$Api.SupplyGetList,Login:!0},Data:{PageIndex:this.Pager.PageIndex,PageSize:this.Pager.PageSize,Conditions:t},Callback:function(t){var a;t.IsSuccess?(e.ChangeTable(),e.Pager.TotalItems=t.Data.PageModel.TotalItems,(a=e.AddSupplierList).push.apply(a,Object(s["a"])(t.Data.PageModel.Items))):e.$Request.Error(t);e.$UI.Loading.Hide()}})}},{key:"ChangeTable",value:function(){0==this.SearchFilter.Province&&0==this.SearchFilter.Area&&0==this.SearchFilter.City&&0==this.SearchFilter.SearchKeyType&&""==this.SearchFilter.SearchKey&&1==this.Pager.PageIndex?this.IsChangeSearchTable=!1:this.IsChangeSearchTable=!0}},{key:"CancelSupplier",value:function(){this.EmitEableSupplier(!1,this.IsChangeSearchTable)}},{key:"SelectedSupplierModal",value:function(){this.SelectedSupplier.length<1?this.$UI.Tips.Floating("warning","请选择供应商"):this.EmitEableSupplier(!0,this.IsChangeSearchTable,this.SelectedSupplier)}},{key:"CalculateTbHeight",value:function(){return 500}},{key:"SelectedData",value:function(e){this.$set(this,"SelectedSupplier",e)}},{key:"CancelSelect",value:function(){this.$refs["Supplier"].selectAll(!1),this.$set(this,"SelectedSupplier",[])}},{key:"SearchList",value:function(){this.$set(this.Pager,"PageIndex",1),this.GetList()}},{key:"ResetList",value:function(){this.$set(this,"Pager",new u["a"].Pager),this.$set(this,"SearchFilter",new S["a"].SupplierSearch),this.GetList()}},{key:"ChangePage",value:function(e){this.$set(this.Pager,"PageIndex",e),this.GetList()}},{key:"ChangePageSize",value:function(e){this.$set(this.Pager,"PageSize",e),this.GetList()}},{key:"SelcSingle",value:function(e){this.EmitEableSupplier(!0,this.IsChangeSearchTable,[this.AddSupplierList[e]])}}]),a}(p["d"]);h["a"]([Object(p["c"])()],d.prototype,"AddCityList",void 0),h["a"]([Object(p["b"])()],d.prototype,"EmitEableSupplier",null),h["a"]([Object(p["e"])("SearchFilter.Province")],d.prototype,"ChangeProvince",null),h["a"]([Object(p["e"])("SearchFilter.City")],d.prototype,"ChangeCity",null),d=h["a"]([Object(p["a"])({name:"EnableSupplier"})],d);var g=d,y=g,C=a("4023"),P=Object(C["a"])(y,i,l,!1,null,null,null);t["default"]=P.exports}}]);