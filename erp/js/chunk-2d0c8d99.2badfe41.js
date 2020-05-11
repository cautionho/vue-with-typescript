(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c8d99"],{5745:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Row",{staticClass:"P-Inline-Block"},[a("Button",{staticClass:"P-Inline-Block",attrs:{type:"primary"},on:{click:function(t){return e.OpenModal()}}},[e._v("添加物料申请")]),a("Modal",{attrs:{title:["添加物料申请","修改物料申请"][e.ModalType],"mask-closable":!1,width:1e3},on:{"on-cancel":function(t){return e.CancelModal(!1)}},model:{value:e.IsShowModal,callback:function(t){e.IsShowModal=t},expression:"IsShowModal"}},[a("Row",[a("Col",{attrs:{span:24}},[a("Form",{ref:"OperateForm",attrs:{model:e.OperateForm,rules:e.OperateFormRules,"label-width":120,onsubmit:"return false"}},[a("Form-item",{attrs:{label:"发货仓库：",prop:"WarehouseId"}},[a("Select",{attrs:{placeholder:"请选择发货仓库",options:e.PropWarehouseDrop},model:{value:e.OperateForm.WarehouseId,callback:function(t){e.$set(e.OperateForm,"WarehouseId",t)},expression:"OperateForm.WarehouseId"}})],1),a("Form-item",{attrs:{label:"备注：",prop:"Remark"}},[a("Input",{attrs:{autosize:{minRows:3,maxRows:3},placeholder:"请输入备注",type:"textarea"},model:{value:e.OperateForm.Remark,callback:function(t){e.$set(e.OperateForm,"Remark",t)},expression:"OperateForm.Remark"}})],1)],1)],1),a("Col",{attrs:{span:24}},[a("Table",{ref:"TableList",attrs:{height:400,columns:e.TableRowHead,data:e.TableList,size:"small",stripe:""}})],1),a("Col",{staticClass:"P-TA-R P-MT-10",attrs:{span:24}},[a("Button",{attrs:{type:"primary"},on:{click:e.$TriggerEnableSku}},[e._v("选择SKU")])],1)],1),a("footer",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.SubModal(1)}}},[e._v(e._s(["添加","修改"][e.ModalType]))]),a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.SubModal(2)}}},[e._v("提交审核")]),a("Button",{on:{click:function(t){return e.CancelModal(!1)}}},[e._v("取消")])],1)],1),a("EnableSku",{ref:"EnableSku",on:{"handle-res-msg":e.HandleSkuRes}})],1)},o=[],n=(a("6ed5"),a("cee1"),a("e8f2"),a("6bf8"),a("e24e")),l=a("3231"),i=a("064d"),s=a("46d7"),u=a("631e"),d=a("4a81"),c=a("d11d"),p=a("1f41"),m=function(e){Object(s["a"])(a,e);var t=Object(u["a"])(a);function a(){var e;return Object(l["a"])(this,a),e=t.apply(this,arguments),e.OperateForm=new p["a"].ReplenishDemandModifyForm,e.OperateFormRules={WarehouseId:[{required:!0,message:"请选择仓库",trigger:"change",type:"number"}]},e.IsShowModal=!1,e.ModalType=0,e.ModifyId=0,e.TableList=[],e.TableRowHead=[{title:"SKU编号",key:"SkuCode",width:200},{title:"产品名",key:"SkuName"},{title:"数量",width:200,render:function(t,a){return t("InputNumber",{class:"P-W-100-Percent",props:{value:a.row.Quantity,precision:0,min:1,step:1},attrs:{placeholder:"请输入数量"},on:{input:function(t){e.SetSelectedSkuNum(a.index,t)}}})}},{title:"操作",width:100,render:function(t,a){return t("Button",{props:{type:"error",size:"small"},on:{click:function(){e.TableList.splice(a.index,1)}}},"删除")}}],e}return Object(i["a"])(a,[{key:"EmitChange",value:function(e,t){}},{key:"$Trigger",value:function(e){var t=e.SelectedDetail;this.ModalType=1,this.ModifyId=t.Id,this.$set(this,"OperateForm",new p["a"].ReplenishDemandModifyForm(t.WarehouseId,t.Remark));var a,r=Object(n["a"])(t.MaterialApplyItems);try{for(r.s();!(a=r.n()).done;){var o=a.value;this.TableList.push(new p["a"].MaterielApplyModifyTable(o.SkuId,o.SkuCode,o.SkuName,o.Image,o.Quantity))}}catch(l){r.e(l)}finally{r.f()}this.IsShowModal=!0}},{key:"OpenModal",value:function(){this.ModalType=0,this.ModifyId=0,this.IsShowModal=!0}},{key:"$TriggerEnableSku",value:function(){this.$refs["EnableSku"].Trigger(!1)}},{key:"HandleSkuRes",value:function(e){var t,a=this,r=Object(n["a"])(e);try{var o=function(){var e=t.value;if(a.TableList.some((function(t){return t.SkuId==e.Id})))return"continue";a.TableList.push(new p["a"].MaterielApplyModifyTable(e.Id,e.SkuCode,e.SkuName,e.DefaultImage))};for(r.s();!(t=r.n()).done;)o()}catch(l){r.e(l)}finally{r.f()}}},{key:"SetSelectedSkuNum",value:function(e,t){this.$set(this.TableList[e],"Quantity",Number(t))}},{key:"SubModal",value:function(e){var t=this;this.$refs["OperateForm"].validate((function(a){if(a){if(0==t.TableList.length)return void t.$UI.Tips.Floating("warning","请添加SKU后进行操作");var r={Id:t.ModifyId,Status:e,WarehouseId:t.OperateForm.WarehouseId,Remark:t.OperateForm.Remark,MaterialApplyItems:t.TableList};t.$UI.Loading.Show(),t.$Request.Post({Server:t.$Server.Warehouse,Api:{Address:t.$Api.MaterialApplySave,Login:!0},Data:r,Callback:function(a){t.$UI.Loading.Hide(),a.IsSuccess?(t.$UI.Tips.Floating("success",1==e?["添加物料申请成功","修改物料申请成功"][t.ModalType]:"提交审核物料申请成功"),t.CancelModal(!0)):t.$Request.Error(a),t.$UI.Loading.Hide()}})}}))}},{key:"CancelModal",value:function(e){this.IsShowModal=!1,this.TableList.splice(0),this.$refs["OperateForm"].resetFields(),this.EmitChange(e)}}]),a}(c["d"]);d["a"]([Object(c["c"])()],m.prototype,"PropWarehouseDrop",void 0),d["a"]([Object(c["b"])()],m.prototype,"EmitChange",null),m=d["a"]([Object(c["a"])({name:"MaterielApplyModify",components:{EnableSku:function(){return a.e("chunk-2d0dd9de").then(a.bind(null,"81c2"))}}})],m);var h=m,f=h,b=a("4023"),k=Object(b["a"])(f,r,o,!1,null,"67f39e07",null);t["default"]=k.exports}}]);