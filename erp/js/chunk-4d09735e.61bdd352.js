(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4d09735e"],{3697:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"P-Inline-Block P-MR-10"},[a("Col",[a("Button",{attrs:{type:"primary"},on:{click:e.OpenModifyRoleModal}},[e._v("添加角色")]),a("Modal",{attrs:{title:0===e.OperateForm.Id?"添加角色":"编辑角色","mask-closable":!1,width:800},on:{"on-cancel":function(t){return e.ClearModal(0)}},model:{value:e.ModifyRoleModal,callback:function(t){e.ModifyRoleModal=t},expression:"ModifyRoleModal"}},[a("Row",{staticClass:"Row-Tree"},[a("Tree",{ref:"TargetTree",staticClass:"P-ML-20",attrs:{data:e.TargetTree,"show-checkbox":""},on:{"on-check-change":e.HandleSelectedRole}})],1),a("Row",[a("Col",{staticClass:"Row-Role",attrs:{span:"3"}},[e._v("已选择权限 ")]),a("Col",{staticClass:"Row-Role-Selected",attrs:{span:"21"}},[a("Tooltip",{attrs:{content:e.SelectedRole(),maxWidth:"600"}},[a("p",{staticClass:"P-LINE-3 P-Inline-Block"},[e._v(e._s(e.SelectedRole()))])])],1)],1),a("Row",{staticClass:"P-MT-10"},[a("Form",{ref:"OperateForm",attrs:{model:e.OperateForm,rules:e.OperateFormRule,name:"OperateForm",onsubmit:"return false","label-width":110}},[a("Form-item",{attrs:{label:"角色名称：",prop:"RoleName"}},[a("Input",{ref:"OperateFormName",attrs:{placeholder:"角色名称",name:"RoleName"},model:{value:e.OperateForm.RoleName,callback:function(t){e.$set(e.OperateForm,"RoleName",t)},expression:"OperateForm.RoleName"}})],1),a("Form-item",{attrs:{label:"角色描述：",prop:"Description"}},[a("Input",{attrs:{type:"textarea",autosize:{minRows:6,maxRows:6},placeholder:"角色描述",name:"Description"},model:{value:e.OperateForm.Description,callback:function(t){e.$set(e.OperateForm,"Description",t)},expression:"OperateForm.Description"}})],1)],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"primary"},on:{click:e.SubModal}},[e._v("提交")]),a("Button",{on:{click:function(t){return e.ClearModal(0)}}},[e._v("取消")])],1)],1)],1)],1)},o=[],s=(a("d9b9"),a("9660"),a("0a9c"),a("76bb"),a("6ed5"),a("6bf8"),a("eb83"),a("0b78"),a("3231")),l=a("064d"),i=a("46d7"),n=a("631e"),c=a("4a81"),d=a("d11d"),u=a("398e"),p=function(e){Object(i["a"])(a,e);var t=Object(n["a"])(a);function a(){var e;return Object(s["a"])(this,a),e=t.apply(this,arguments),e.Tree=[],e.TargetTree=[],e.TargetTreeSelectedName={},e.ModifyRoleModal=!1,e.OperateForm=new u["a"].Role,e.OperateFormRule={RoleName:[{required:!0,message:"请输入角色名字"}]},e}return Object(l["a"])(a,[{key:"HandleResMsg",value:function(e){}},{key:"IsShowModal",value:function(e){e&&(this.$set(this,"OperateForm",this.SelectedData.length>0?this.SelectedData[0]:new u["a"].Role),this.$set(this,"TargetTree",JSON.parse(JSON.stringify(this.Tree))),this.$set(this,"TargetTreeSelectedName",{}),this.DefaultCheckedTree(this.TargetTree),this.$nextTick((function(){this.$set(this,"ModifyRoleModal",!0),this.$refs["OperateFormName"].focus()})))}},{key:"mounted",value:function(){this.GetTree()}},{key:"SelectedRole",value:function(){var e=[];for(var t in this.TargetTreeSelectedName)e.push("【".concat(t,"】").concat(this.TargetTreeSelectedName[t].join("，")));return e.join("；")}},{key:"GetTree",value:function(){var e=this;this.$Request.Post({Server:this.$Server.Settings,Api:{Address:this.$Api.MenuTree,Login:!0},Data:"",Callback:function(t){t.IsSuccess?(e.$set(e,"Tree",t.Data.Tree),e.IntegratedData(e.Tree)):e.$Request.Error(t)}})}},{key:"HandleSelectedRole",value:function(){var e=this.$refs["TargetTree"].getCheckedAndIndeterminateNodes();this.OperateForm.ResourceId=e.map((function(e){return e.Id})),this.$set(this,"TargetTreeSelectedName",{}),this.DefaultCheckedTree(this.TargetTree)}},{key:"IntegratedData",value:function(e){var t=this;e.forEach((function(e){t.$set(e,"title",e.ResourceName),t.$set(e,"children",e.ChildNods),t.$set(e,"value",e.Id.toString()),t.$set(e,"label",e.ResourceName),t.$set(e,"checked",!1),e.ChildNods.length>0&&t.IntegratedData(e.ChildNods)}))}},{key:"DefaultCheckedTree",value:function(e,t){var a=this;e.forEach((function(e,r){if(e.children.length>0)a.DefaultCheckedTree(e.children,e.ResourceName);else if(a.OperateForm.ResourceId.length>0&&a.OperateForm.ResourceId.some((function(t){return t===e.Id}))){a.$set(e,"checked",!0);var o=void 0===t?e.ResourceName:t;void 0===a.TargetTreeSelectedName[o]&&(a.TargetTreeSelectedName[o]=[]),a.TargetTreeSelectedName[o].push(e.ResourceName)}}))}},{key:"OpenModifyRoleModal",value:function(){this.HandleResMsg(2)}},{key:"ClearModal",value:function(e){this.$set(this,"ModifyRoleModal",!1),this.$refs["OperateForm"].resetFields(),this.HandleResMsg(e)}},{key:"SubModal",value:function(){var e=this;this.$refs["OperateForm"].validate((function(t){if(t){if(0===e.OperateForm.ResourceId.length)return void e.$UI.Tips.Floating("warning","请选择权限");e.$UI.Loading.Show(),e.$Request.Post({Server:e.$Server.Admin,Api:{Address:0===e.OperateForm.Id?e.$Api.RoleCreate:e.$Api.RoleModify,Login:!0},Data:e.OperateForm,Callback:function(t){t.IsSuccess?(e.$UI.Tips.Floating("success",0===e.OperateForm.Id?"添加角色成功":"编辑角色成功"),e.ClearModal(1)):(e.$UI.Loading.Hide(),e.$Request.Error(t))}})}}))}}]),a}(d["d"]);c["a"]([Object(d["c"])()],p.prototype,"SelectedData",void 0),c["a"]([Object(d["c"])()],p.prototype,"ShowModal",void 0),c["a"]([Object(d["b"])()],p.prototype,"HandleResMsg",null),c["a"]([Object(d["e"])("ShowModal")],p.prototype,"IsShowModal",null),p=c["a"]([Object(d["a"])({name:"ModifyRole"})],p);var h=p,m=h,f=(a("4ddf"),a("4023")),R=Object(f["a"])(m,r,o,!1,null,null,null);t["default"]=R.exports},"4ddf":function(e,t,a){"use strict";var r=a("814c"),o=a.n(r);o.a},"814c":function(e,t,a){}}]);