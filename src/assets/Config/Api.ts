import SalesApi from './SalesApi'

export default {
  Login: '/api/User/Login', //登录
  Logout: '/api/User/LogOut', //登出
  TrackGetTrack: '/api/Track/GetTrack', // 获取国内快递跟踪信息

  //控制面板
  GetSummaryReport: '/api/ShipOrder/GetSummaryReport', //销售统计报表
  ShipOrderGetDaySaleReport: '/api/ShipOrder/GetDaySaleReport', //平台店铺日销量
  UserGetUserToDoTree: '/api/User/GetUserToDoTree', //代办事项

  /* 系统配置 start */
  UploadImage: '/api/file/UploadImage', //上传图片
  UploadDocFile: '/api/file/UploadDocFile', //上传文件
  ProvincialAreasGetTree: '/api/ProvincialAreas/GetTree', //省市区树
  ProvincesDropList: '/api/ProvincialAreas/ProvincesDropList', //获取省列表
  CityAreaDropList: '/api/ProvincialAreas/CityAreaDropList', //获取市列表
  CountryList: '/api/Country/GetDropList', //国家下拉

  ERDropList: '/api/ExchangeRate/DropList', //获取币种下拉列表
  ERList: '/api/ExchangeRate/List', //获取汇率列表
  ERExchangeRate: '/api/ExchangeRate/ExchangeRate', //汇率转换
  ERUpdateRate: '/api/ExchangeRate/UpdateRate', //更新汇率

  GetUserResource: '/api/User/GetUserResource', //获取用户资源权限
  UserChangePwd: '/api/User/ChangePwd', //修改密码
  GetCountryPageData: '/api/country/GetCountryPageData', //获取国家简码列表
  GetCurrencyList: '/api/ExchangeRate/List', // 获取汇率列表
  UpdateCurrencyData: '/api/ExchangeRate/UpdateRate', // 获取汇率列表
  CountrySearch: '/api/Country/Search', //国家简码搜索

  GetWarehouseList: '/api/Warehouse/List', //获取仓库列表
  CreateWarehouse: '/api/Warehouse/Create', //添加仓库
  ModifyWarehouse: '/api/Warehouse/Modify', //编辑仓库
  ChangeStatusWarehouse: '/api/Warehouse/ChangeStatus', //启停仓库
  GetWarehouseDropList: '/api/Warehouse/DropList', // 获取仓库下拉

  ToDoTree: '/api/ToDo/ToDoTree', //获取待办事务类目树
  ToDoCategory: '/api/ToDo/ToDoCategory', //获取待办事务类目
  ToDoItems: '/api/ToDo/ToDoItems', //获取待办事务类目事项
  ToDoCreate: '/api/ToDo/Create', //添加待办事务类目
  ToDoModify: '/api/ToDo/Modify', //编辑待办事务类目
  ToDoCreateItem: '/api/ToDo/CreateItem', //添加待办事务类目事项
  ToDoModifyItem: '/api/ToDo/ModifyItem', //编辑待办事务类目事项

  MenuTree: '/api/Menu/MenuTree', //获取全部菜单树
  MenuGetChilds: '/api/Menu/GetChilds', //获取子级菜单列表
  MenuCreate: '/api/Menu/Create', //添加菜单栏目
  MenuModify: '/api/Menu/Modify', //编辑菜单栏目
  MenuChangeStatus: '/api/Menu/ChangeStatus', //启停菜单栏目
  /* 系统配置 end */


  /* 人事 start*/
  PositionList: '/api/Position/List', //获取岗位职务分页列表
  PositionChangeStatus: '/api/Position/ChangeStatus', //修改岗位状态
  PositionCreate: '/api/Position/Create', //添加职位
  PositionModify: '/api/Position/Modify', //编辑职位
  PositionSetRole: '/api/Position/SetRole', //绑定角色
  RDropList: '/api/Role/DropList', //获取角色下拉列表

  UsersGetList: '/api/User/List', // 获取组织架构列表
  GetPositionDropList: '/api/Position/DropList', // 获取岗位下拉
  OGetOrganizationTree: '/api/Organization/GetOrganizationTree', //获取组织架构及成员树结构
  OrganizationCreate: '/api/Organization/Create', //添加组织架构
  OrganizationModify: '/api/Organization/Modify', //编辑组织架构
  OrganizationDelete: '/api/Organization/Delete', //删除组织架构
  GetUserDropList: '/api/User/DropList', // 员工下拉
  UserList: '/api/User/List', //获取员工账号分页列表
  UserCreate: '/api/User/Create', //添加员工账号
  UserModify: '/api/User/Modify', //编辑员工账号
  UserSetOrganization: '/api/User/SetOrganization', //设置所属组织
  UserSetWarehouse: '/api/User/SetWarehouse', //设置所属仓库
  UserSetPosition: '/api/User/SetPosition', //设置所属岗位
  UserChangeStatus: '/api/User/ChangeStatus', //设置在职状态
  UserResetPwd: '/api/User/ResetPwd', // 重置密码
  GetUserInfo: '/api/User/GetUserInfo', //获取当前用户资料

  GetContactBookList: '/api/ContactBook/List',	//获取员工通讯录分页列表
  ContactBookExport: '/api/ContactBook/Export', //导出下载员工通讯录

  GetUserDocumentList: '/api/UserDocument/List', //获取员工档案分页列表
  UserDocumentCreate: '/api/UserDocument/Create', //录入档案资料
  UserDocumentInfo: '/api/UserDocument/GetUserDocument', //获取员工档案
  UserDocumentModify: '/api/UserDocument/Modify', //编辑档案资料
  UserDocumentConfirm: '/api/UserDocument/Confirm', //档案资料人事核实
  UserDocumentSReview: '/api/UserDocument/SReview', //档案资料主管审核
  UserDocumentMReview: '/api/UserDocument/MReview', //1.4.7.档案资料经理审核

  // 角色权限
  RoleGetList: '/api/Role/List', // 获取角色权限列表
  RoleChangeStatus: '/api/Role/ChangeStatus', // 启停角色
  RoleCreate: '/api/Role/Create', //添加角色
  RoleModify: '/api/Role/Modify', //编辑角色

  /* 人事 end*/

  /* 采购 start */

  // 供应商管理
  SupplyGetList: '/api/Supply/GetList', //获取供应商分页列表
  SupplyDropList: '/api/Supply/DropList', //获取供应商下拉列表
  SupplyGetSupplyInfo: '/api/Supply/GetSupplyInfo', //获取供应商详情
  SupplyCreate: '/api/Supply/Create', //添加供应商
  SupplyModify: '/api/Supply/Modify', //编辑供应商
  SupplyChangeStatus: '/api/Supply/ChangeStatus', //启停供应商
  SupplySetAccountPeriod: '/api/Supply/SetAccountPeriod', //设置账期
  SupplySendPMSMessage: '/api/Supply/SendPMSMessage', //发送PMS系统站内信

  //采购申请
  PurchaseApplyGetList: '/api/PurchaseApply/GetList', //获取采购申请分页列表
  PurchaseApplyChangeStatus: '/api/PurchaseApply/ChangeStatus', //审核采购申请
  PurchaseApplyCreate: '/api/PurchaseApply/Create', //添加采购申请
  PurchaseApplyModify: '/api/PurchaseApply/Modify', //编辑采购申请
  PurchaseApplyGetApplyInfo: '/api/PurchaseApply/GetApplyInfo', //获取采购申请详情
  PurchaseApplyGetHistory: '/api/PurchaseApply/GetHistory', //获取采购申请操作历史
  PurchaseApplyGetToReviewCount: '/api/PurchaseApply/GetToReviewCount', //获取待审核采购申请条数
  InventoryGetSkuInventory: '/api/Inventory/GetSkuInventory', //获取SKU库存
  PurchaseApplyGetAvgSaleQuantity: '/api/PurchaseApply/GetAvgSaleQuantity', //获取SKU平均销量
  PurchaseApplyCreateAndAudit: '/api//PurchaseApply/CreateAndAudit', //生成采购单(直接通过审核)

  //采购建议
  GetDomesticWarehouseSuggestList: '/api/Suggest/GetDomesticWarehouseSuggestList', //获取国内仓采购建议列表
  GetSKUSaleQuantity: '/api/SkuStatistics/SingleSaleQuantity', //获取单个sku销量
  UpdDefaultSupply: '/api/Sku/UpdDefaultSupply', //修改默认供应商
  SuggestExport: '/api/Suggest/Export', //导出采购建议

  InStoragePerformance: '/api/Statistics/InStoragePerformance', //入库员绩效
  StatisticsQaPerformance: '/api/Statistics/QaPerformance', //质检员绩效

  PurchaseOrderGetList: '/api/PurchaseOrder/GetList', //获取采购单分页列表
  PurchaseOrderGetInfo: '/api/PurchaseOrder/GetPurchaseOrder', //获取采购单基本信息
  PurchaseOrderGetByCode: '/api/PurchaseOrder/GetPurchaseOrderByCode', //获取采购单基本信息（按编号）
  PurchaseOrderGetItem: '/api/PurchaseOrder/GetPurchaseItem', //获取采购单明细信息
  PurchaseOrderHistory: '/api/PurchaseOrder/GetHistory', //获取采购单操作记录
  PurchaseArrivalOrder: '/api/PurchaseOrder/GetArrivalOrder', //获取采购单到货记录
  PurchaseOrderToReview: '/api/PurchaseOrder/ToReview', //提交审核
  PurchaseOrderModify: '/api/PurchaseOrder/Modify', //编辑采购单
  PurchaseOrderPMReview: '/api/PurchaseOrder/PMReview', //采购主管审核
  PurchaseOrderSMReview: '/api/PurchaseOrder/SMReview', //销售主管审核
  PurchaseInputThirdCode: '/api/PurchaseOrder/InputThirdCode', //录入第三方单号
  PurchaseCreateArrivalOrder: '/api/PurchaseOrder/CreateArrivalOrder', //添加发货生成到货单
  PurchaseOrderStop: '/api/PurchaseOrder/Stop', //终止采购
  PurchaseOrderNoWait: '/api/PurchaseOrder/NoWait', //不等余货
  PurchaseOrderPmsReissueDetail: '/api/PurchaseOrder/PmsReissueDetail', //获取设置补发详情
  PurchaseOrderSendPmsReissue: '/api/PurchaseOrder/SendPmsReissue', //发送设置补发
  PurchaseOrderGMReview: '/api/PurchaseOrder/GMReview', //总经理审核
  PurchaseOrderForbidReissue: '/api/PurchaseOrder/ForbidReissue', //禁止补发
  PurchaseOrderOrderItemExport: '/api/PurchaseOrder/OrderItemExport', // 导出采购单明细

  // 到货单管理
  PurchaseArrivalOrderGetList: '/api/PurchaseArrivalOrder/GetList', //获取分页列表
  GetPAOInfo: '/api/PurchaseArrivalOrder/GetPAOInfo', //获取到货单信息
  GetPAOInfoByCode: '/api/PurchaseArrivalOrder/GetPAOInfoByCode', //获取到货单信息（按编号）
  GetPAOImage: '/api/PurchaseArrivalOrder/GetPAOImage', //获取质检图片
  GetPAOImageByCode: '/api/PurchaseArrivalOrder/GetPAOImageByCode', //获取质检图片 按编号
  PrintPAO: '/api/PurchaseArrivalOrder/PrintPAO', //打印到货单
  PrintSKU: '/api/PurchaseArrivalOrder/PrintSKU', //打印SKU标签
  PurchaseArrivalOrderSign: '/api/PurchaseArrivalOrder/Sign', //签收
  PurchaseArrivalOrderQA: '/api/PurchaseArrivalOrder/QA', //质检
  PurchaseArrivalOrderInStorage: '/api/PurchaseArrivalOrder/InStorage', //入库
  PurchaseArrivalOrderHandleExcept: '/api/PurchaseArrivalOrder/HandleExcept', //异常
  PurchaseArrivalOrderRefund: '/api/PurchaseArrivalOrder/Refund', //退货
  PurchaseOrderGetWaitExceptPaoList: '/api/PurchaseArrivalOrder/GetWaitHandleExceptArrivalOrderList', //获取异常待处理采购单列表
  PurchaseOrderGetWaitStoragePaoList: '/api/PurchaseArrivalOrder/GetWaitInStorageArrivalOrderList', //获取待入库到货单列表
  PurchaseModifyShippingMethod: '/api/PurchaseArrivalOrder/ModifyShippingMethod', //修改物流信息
  PurchaseArrivalOrderCancel: '/api/PurchaseArrivalOrder/Cancel', //作废到货单
  PurchaseArrivalOrderMulitQA: '/api/PurchaseArrivalOrder/MulitQA', //批量质检到货单
  PurchaseArrivalOrderExport: '/api/PurchaseArrivalOrder/Export', //导出采购产品入库记录


  //采购进度
  GeSuggestProcess: '/api/SuggestProcess/GeSuggestProcessList', //获取采购进度列表

  /* 采购 end */


  /*财务 start */
  PaypalDropList: '/api/Paypal/DropList', // 获取Paypal下拉列表
  //付款单管理
  PayOrderGetList: '/api/PayOrder/GetList', //1.1.1.获取付款单分页列表
  PayOrderCreate: '/api/PayOrder/Create', //1.1.2.添加付款单
  PayOrderModify: '/api/PayOrder/Modify', //1.1.4.编辑付款单
  PayOrderChangeStatus: '/api/PayOrder/ChangeStatus', //1.1.6.状态变更
  PayOrderExport: '/api/Payorder/Export', //1.1.8.导出付款单
  PayOrderOpenPayPage: '/api/PayOrder/OpenPayPage', //1.1.9.打开付款页面-返回批量付款链接
  PayOrderGetOrderLog: '/api/PayOrder/GetOrderLog',  //1.1.7.获取付款单操作历史

  //退款单管理
  RefundOrderGetList: '/api/RefundOrder/GetList', //1.2.1.获取退款单分页列表
  RefundOrderCreate: '/api/RefundOrder/Create', //1.2.2.添加退款单
  RefundOrderModify: '/api/RefundOrder/Modify', //1.2.4.编辑退款单
  RefundOrderChangeStatus: '/api/RefundOrder/ChangeStatus', //1.2.6.状态变更
  RefundOrderExport: '/api/RefundOrder/Export', //1.2.7.导出退款单

  PaypalGetList: '/api/Paypal/GetList', //1.3.1.获取PayPal账号分页列表
  PaypalChangeStatus: '/api/Paypal/ChangeStatus', //1.3.5.状态变更
  PaypalGetAccountBalance: '/api/Paypal/GetAccountBalance', //1.3.6.获得PayPal 账号余额
  PaypalAuthorizationVerify: '/api/Paypal/AuthorizationVerify', //验证授权
  ExportAccountBalance: '/api/Paypal/ExportAccountBalance', //1.3.7.导出PayPal 账号余额
  PaypalCreate: '/api/Paypal/Create', //1.3.3.添加Paypal账号
  PaypalModify: '/api/Paypal/Modify', //1.3.4.编辑Paypal账号
  
  /*财务 end */

  /* 产品 start */
  //新品开发
  ProductGetList: '/api/Product/GetList', //获取新品开发分页列表
  ProductGetProductInfo: '/api/Product/GetProductInfo', //获取新品信息
  ProductGetProAttribute: '/api/Product/GetProAttribute', //获取新品特性
  ProductGetProSupply: '/api/Product/GetProSupply', //获取新品供应商
  ProductGetProMatch: '/api/Product/GetProMatch', //获取新品竞品信息
  ProductGetProperty: '/api/Product/GetProperty', //获取新品属性
  ProductGetProReviewHistory: '/api/Product/GetProReviewHistory', //获取新品审核历史
  ProductToReview: '/api/Product/ToReview', //提交审核
  ProductProReview: '/api/Product/ProReview', //审核新品
  ProductCreate: '/api/Product/Create', //添加新品
  ProductModify: '/api/Product/Modify', //编辑新品

  //品牌管理
  GetBrandList: '/api/Brand/GetBrandList', //获取品牌分页列表
  BrandDropList: '/api/Brand/DropList', //获取品牌下拉列表
  BrandModify: '/api/Brand/Modify', //编辑品牌
  BrandCreate: '/api/Brand/Create', //添加品牌

  //类目管理
  CategoryGetCategoryTree: '/api/Category/GetCategoryTree', //获取所有类目树菜单
  CategoryGetCategoryList: '/api/Category/GetCategoryList', //获取子级类目分页列表
  CategoryChangeStatus: '/api/Category/ChangeStatus', //启停类目
  CategoryCreate: '/api/Category/Create', //添加类目
  CategoryModify: '/api/Category/Modify', //编辑类目

  //申报敏感词
  SensitiveGetlist: '/api/SensitiveWord/GetList', //获取申报敏感词列表
  SensitiveAdd: '/api/SensitiveWord/Add', //添加申报敏感词
  SensitiveModify: '/api/SensitiveWord/Modify', //修改申报敏感词
  SensitiveChangeStatus: '/api/SensitiveWord/ChangeStatus', //启禁用敏感词

  // SKU管理
  SkuGetList: '/api/Sku/GetList', //获取SKU分页列表
  GetCategoryTree: '/Category/GetCategoryTree', //获取SKU树菜单
  GetSkuProperty: '/api/Sku/GetSkuProperty', //获取SKU变体
  GetSkuInfo: '/api/Sku/GetSkuInfo', //获取SKU详细信息
  GetSkuInfoByCode: '/api/Sku/GetSkuInfoByCode', //获取SKU详细信息 按编号
  GetSkuAttribute: '/api/Sku/GetSkuAttribute', //获取SKU特性标签
  GetSkuDeclare: '/api/Sku/GetSkuDeclare', //获取SKU申报信息
  GetSkuImages: '/api/Sku/GetSkuImages', //获取SKU图片
  SkuModify: '/api/Sku/Modify', //编辑SKU
  GetSkuMap: '/api/Sku/GetSkuMap', //获取SKU别名
  SkuSetBrand: '/api/Sku/SetBrand', //设置品牌
  SkuSetStatus: '/api/Sku/SetStatus', //设置状态
  SkuSetCategory: '/api/Sku/SetCategory', //设置品类
  SkuSetPurchaser: '/api/Sku/SetPurchaser', //设置采购员
  SkuSetSaleManager: '/api/Sku/SetSaleManager', //设置销售主管
  SkuSetDevManager: '/api/Sku/SetDevManager', //设置产品经理
  SkuExport: '/api/Sku/Export', //导出SKU
  SkuImport: '/api/Sku/Import', // 导入SKU
  SkuStatusImport: '/api/Sku/SkuStatusImport', // 导入SKU状态
  SkuGetEnableList: '/api/Sku/GetEnableList',
  GetSkuBind: '/api/Sku/GetSkuBind', //获取SKU的捆绑组合明细
  SkuCreate: '/api/Sku/Create', //添加SKU
  SkuUpdGrossWeight: '/api/Sku/UpdGrossWeight', //修改sku的毛重
  EditAttributes: '/api/Sku/EditAttributes ', //2.2.37.批量编辑SKU标签

  //SKU别名管理
  SkuMapGetList: '/api/SkuMap/GetList', //获取SKU别名分页列表
  SkuMapCreate: '/api/SkuMap/Create', //添加SKU别名
  SkuMapModify: '/api/SkuMap/Modify', //编辑SKU别名
  SkuMapImport: '/api/SkuMap/Import', //导入SKU别名
  SkuMapMigration: '/api/SkuMap/Migration', //SKU别名迁移
  SkuMapExport: '/api/SkuMap/Export', //导出SKU别名
  SkuMapBatchRemove: '/api/SkuMap/BatchRemove', // 批量删除SKU别名

  //拍摄需求
  PhotoRequestGetList: '/api/PhotoRequest/GetList',  //拍摄需求分页列表
  PhotoRequestGetHistory: '/api/PhotoRequest/GetHistory', //拍摄需求审核记录
  PhotoRequestChangeStatus: '/api/PhotoRequest/ChangeStatus', //2.4.4.变更需求状态
  PhotoRequestUpload: '/api/PhotoRequest/Upload', //2.4.5.上传图片
  PhotoRequestCreate: '/api/PhotoRequest/Create', //2.4.2.添加拍摄需求
  PhotoRequestModify: '/api/PhotoRequest/Modify', //2.4.3.编辑拍摄需求

  //海外仓产品管理
  OverseaSkuGetList: '/api/OverseaSku/GetList',//2.6.1.海外仓产品分页列表
  OverseaSkuChangeEnable: '/api/OverseaSku/ChangeEnable',  //2.6.6.启用/禁用海外仓产品
  OverseaSkuAuditPass: '/api/OverseaSku/AuditPass',  //2.6.5.审核通过/审核不通过海外仓产品
  OverseaSkuExport: '/api/OverseaSku/Export', //2.6.4.导出海外仓产品
  OverseaSkuImport: '/api/OverseaSku/Import', //2.6.3.导入海外仓产品
  OverseaSkuDetails: '/api/OverseaSku/Details',  //2.6.2.获取海外仓产品详情

  //特性标签
  GetAttributeList: '/api/Attribute/GetAttributeList', //获取标签特性管理分页列表
  AttributeDropList: '/api/Attribute/DropList', //获取特性标签下拉列表
  AttributeChangeStatus: '/api/Attribute/ChangeStatus', //启停特性标签
  AttributeCreate: '/api/Attribute/Create', //添加特性标签
  AttributeModify: '/api/Attribute/Modify', //编辑特性标签

  //作图需求
  GetDrawList: '/api/PhotoProcessRequest/GetList', //2.5.1.作图需求分页列表
  AddOrEditDrawing: '/api/PhotoProcessRequest/Save', //2.5.2.添加、编辑作图需求
  GetRequestDetail: '/api/PhotoProcessRequest/Detail', //2.5.3.作图需求详情
  ArtistUploadImages: '/api/PhotoProcessRequest/ArtistUploadImages', //2.5.4.美工提交审核
  DemandReturn: '/api/PhotoProcessRequest/DemandReturn', //2.5.5.需求退回修改
  ToArtistProcess: '/api/PhotoProcessRequest/ToArtistProcess', //2.5.6.提交美工处理
  AuditDrawRequset: '/api/PhotoProcessRequest/Audit', //2.5.7.审核
  DownloadArtistImage: '/api/PhotoProcessRequest/DownloadArtistImage', //2.5.8.下载美工作图
  DownloadSkuImage: '/api/PhotoProcessRequest/DownloadSkuImage', //2.5.9.下载素材作图
  GetHomeData: '/api/PhotoProcessRequest/GetHomeData', //2.5.10.控制面板设置新待办事项
  ImportDrawRequset: '/api/PhotoProcessRequest/Import', //2.5.11.批量导入作图需求
  StatisticsExport: '/api/PhotoProcessRequest/StatisticsExport', //2.5.12.统计数据导出
  ChangeArtist: '/api/PhotoProcessRequest/ChangeArtist', //2.5.13.更换美工
  DeleteDrawing: '/api/PhotoProcessRequest/Delete', // 2.5.14 删除作图需求
  /* 产品 end */

  /**销售 start */
  Sales: SalesApi,

  // ebay 刊登风格
  GetEbayTempDescriptionList: '/api/ShelvesEBayListings/GetEbayTempDescriptionList', // 获取ebay刊登风格分页列表
  GetEbayTempDescriptionById: '/api/ShelvesEBayListings/GetEbayTempDescriptionById', // 获取ebay刊登风格详情
  CreateEBayTempDescription: '/api/ShelvesEBayListings/CreateEBayTempDescription', // 新增eBay刊登风格
  UpdateEBayTempDescription: '/api/ShelvesEBayListings/UpdateEBayTempDescription', // 编辑eBay刊登风格
  UpdateIsEnableEbayTempDescription: '/api/ShelvesEBayListings/UpdateIsEnableEbayTempDescription', // 批量禁用/启用 ebay刊登风格
  // ebay 刊登新产品
  EbaySites: '/api/EbayData/EbaySites', //获取ebay站点下拉列表,
  EbayCategoryFeaturesGetSiteList: '/api/EbayData/GetSiteList',// 根据站点一些信息
  EbayCategoriesGetCategoryBySite: '/api/EbayCategories/GetCategoryBySite', // 根据站点获取分类
  EbayTempPublishRelatedList: '/api/EbayTempPublishRelated/DropList', // 获得模板下拉
  EbayCategoriesGetCategoriesByParentId: '/api/EbayCategories/GetCategoriesByParentId', // 分类查询接口父级
  EbayCategoriesGetCategory: '/api/EbayCategories/GetCategory', // 分类查询接口
  EbayCategoryFeaturesGettDataBySite: '/api/EbayCategoryFeatures/GetDataBySite', // 根据站点分类获取基础数据
  SaleDisableKeywordsGetDisableKeywords: '/api/SaleDisableKeywords/GetDisableKeywords', // 根据平台类型查询禁用关键词
  ShelvesEBayListingsVerifyShelvesListingTitle:'/api/ShelvesEBayListings/VerifyShelvesListingTitle', // 检查刊登产品标题是否存在重复
  
  // ebay 刊登模板
  EbayGetTempPublishList: '/api/EbayTempPublishRelated/GetTempPublishList', // ebay公共模板
  GetEbayExcludeShippingLocations: '/api/EbayCategoryFeatures/GetEbayExcludeShippingLocations', // 获取可屏蔽国家
  EbayGetTempInfo: '/api/EbayTempPublishRelated/GetTempInfo', // 获取刊登模板详情
  EbayDeleteTempPublish: '/api/EbayTempPublishRelated/DeleteTempPublish', // 删除公共模板

  // ebay 自定义店铺分类
  EbayStoreInSalerDropList: '/api/EbayStoreCategory/StoreInSalerDropList', //当前用户下授权的店铺
  GetStoreCategoryList: '/api/EbayStoreCategory/GetStoreCategoryList', //1.3.1.获取店铺自定义分类分页列表
  GetStoreCategoryDropList: '/api/EbayStoreCategory/GetStoreCategoryDropList', //1.3.4.获取店铺自定义分类下拉数据
  SetStoreCategories: '/api/EbayStoreCategory/SetStoreCategories', //1.3.2.添加,删除, 编辑, 移动 自定义分类设置
  GetStoreCategoryHistoryList: '/api/EbayStoreCategory/GetStoreCategoryHistoryList', //1.3.3.获取店铺自定义分类操作分页列表

  // ebay 刊登列表
  EbayStoreDropList: '/api/EbayStore/DropList', //获取ebay可用店铺下拉列表
  ShelvesEbayListingsGetList: '/api/ShelvesEbayListings/GetList', //13.3.12.eBay刊登列表分页列表
  GetShelvesListingHistory: '/api/ShelvesEBayListings/GetShelvesListingHistory', //13.3.13.获取刊登操作历史
  ShelvesEBayVerifyListing: '/api/ShelvesEBayListings/SubmitVerifyListing', //13.3.16.批量提交验证
  ShelvesEBayShelvesListing: '/api/ShelvesEBayListings/SubmitShelvesListing', //13.3.15.批量提交刊登
  ShelvesEBayCancelListing: '/api/ShelvesEBayListings/SubmitCancelListing', //13.3.17.批量取消刊登
  GetShelvesEBayListingError: '/api/ShelvesEBayListings/GetShelvesEBayListingError', //13.3.14.获取刊登错误信息

  //Listing更新记录
  ListinReviseGetList: '/api/ListingReviseRecord/GetList', //Listing更新记录分页列表
  ListinReviseResend: '/api/ListingReviseRecord/Resend', //Listing更新记录重发接口
  ListinReviseIgnore: '/api/ListingReviseRecord/Ignore', //Listing更新记录忽略接口

  // 设置 => 店铺授权
  AuthorizationUserList: '/api/Authorization/UserList', //1.6.1.  获取授权用户列表
  AuthorizationStorePermissionTree: '/api/Authorization/StorePermissionTree', //1.6.2.  获取树形菜单
  AuthorizationSaveStorePermission: '/api/Authorization/SaveStorePermission', //1.6.3.  保存用户店铺权限（针对变更的）
  AuthorizationOneClickSync: '/api/Authorization/OneClickSync', //1.6.4.  一键同步店铺权限数据

  //allegro上传产品
  AllegroStoreUploadProductList: '/api/AllegroStore/GetUploadProductList', //15.1.9.上传产品分页列表
  AllegroStoreCategoryDropList: '/api/AllegroStore/CategoryDropList', //15.1.10.类目下拉获取
  AllegroStoreExcelTemplate: '/api/AllegroStore/ExcelTemplate', //15.1.11.动态模板下载
  AllegroStoreImportProduct: '/api/AllegroStore/ImportProduct', //15.1.12.上传产品
  AllegroStoreFailedTemplate: '/api/AllegroStore/UploadFailedTemplate', //下载上传失败产品

  /**销售 end */

  /* 仓储 start */
  // 仓储 库存管理
  InventoryGetList: '/api/Inventory/GetList', // 获取库存分页列表
  InventoryUpdateQuantity: '/api/Inventory/UpdateQuantity', //更新库存
  InventoryExport: '/api/Inventory/Export', // 导出库存
  PDACheckOut: '/api/PDA/CheckOut', //1.4.1.盘点

  GetShipOrderInfo: '/api/ShipOrder/GetShipOrderInfo',
  GetBaseShipOrder: '/api/ShipOrder/GetBaseShipOrder', //获取发货订单基础信息
  ShipOrderGetList: '/api/ShipOrder/GetList ',
  ShipOrderGetRemarks: '/api/ShipOrder/GetRemarks',
  GetShipOrderItem: '/api/ShipOrder/GetShipOrderItem', // 获取订单明细
  ShipOrderCreate: '/api/ShipOrder/Create',// 添加订单
  ShipOrderModify: '/api/ShipOrder/Modify',// 编辑订单
  ShipOrderAddRemark: '/api/ShipOrder/AddRemark', // 添加备注
  ShipOrderDelRemark: '/api/ShipOrder/DelRemark', // 删除备注
  ShipOrderChangeStatus: '/api/ShipOrder/ChangeStatus', //变更订单状态
  ShipOrderSetHolUp: '/api/ShipOrder/SetHolUp', //申请拦截
  ResendOrder: '/api/ShipOrder/ResendOrder', //重发订单
  MergeOrder: '/api/ShipOrder/MergeOrder', //合并订单
  ReCreateShipOrder: '/api/ShipOrder/ReCreateShipMethodOrder', //异常单重新下单
  CancelLMAShipOrder: '/api/ShipOrder/CancelWinItLMAShipOrder', //取消LMA包裹
  CancelFlsShipOrder: '/api/ShipOrder/CancelFlsShipOrder', // 取消FLS包裹
  ShipOrderRevertPack: '/api/ShipOrder/RevertPack', // 还原打包
  ShipOrderSetWarehouse: '/api/ShipOrder/SetWarehouse', // 设置发货仓
  ShipOrderSetShippingMethod: '/api/ShipOrder/SetShippingMethod', // 设置渠道
  ShipOrderSignShiped: '/api/ShipOrder/FulFillOrders', //标记发货
  ReSendEdisLogisticsOrder: '/api/ShipOrder/ReSendEdisLogisticsOrder', // 更新Edis包裹单
  ShipOrderImport: '/api/ShipOrder/Import', // 导入发货单
  ExportHasConfirmShipOrders: '/api/ShipOrder/ExportHasConfirmShipOrders', // 导出已发货订单
  ExportHasOperationShipOrders: '/api/ShipOrder/ExportHasOperationShipOrders', // 导出待拣货已拣货已打包订单
  SetTrackNumber: '/api/ShipOrder/SetTrackNumber', //录入跟踪号
  SetTrackNumberByCode: '/api/ShipOrder/SetPackedOrderTrackNumber', //录入跟踪号（按发货订单号）
  GetWaitSplitOrderDetail: '/api/ShipOrder/GetWaitSplitOrderDetail', // 一键拆分
  CreatSplitOrder: '/api/ShipOrder/CreatSplitOrder', // 提交拆分订单
  BatchOrderReturnGoods: '/api/BatchOrder/ReturnGoods', // 释放订单到已确认.
  CreateBatchOrder: '/api/ShipOrder/CreateBatchOrder', //生成拣货批次
  QuickCreateBatchOrder: '/api/BatchOrder/QuickCreateBatchOrder', // 批量生成拣货批次
  ShipOrderPrintPms: '/api/ShipOrder/PrintPms', //打印pms面单
  ShipOrderGetPrintData: '/api/ShipOrder/GetPrintData',  //打印面单
  PackOrder: '/api/ShipOrder/PackOrder', //打包订单 
  CleanAutoMatchRemark: '/api/ShipOrder/CleanAutoMatchRemark', //审核通过（ebay账号异常或wish风控）

  NoTrackingList: '/api/ShipOrder/GetExceedOneDayNoTrackingList', // 获取24小时无跟踪号订单列表
  GetTwoDaysNotYetShipped: '/api/ShipOrder/GetTwoDaysNotYetShipped', //获取48小时未发货订单列表
  GetFiveDaysNotYetShipped: '/api/ShipOrder/GetFiveDaysNotYetShipped', //获取5天未发货订单列表
  GetShipOrderSkuErrorList: '/api/ShipOrder/GetShipOrderSkuErrorList', //获取详单商品错误订单列表
  ShipOrderSkuErrorExport: '/api/ShipOrder/ShipOrderSkuErrorExport', // 导出详单商品错误订单
  GetUnmatchWareHouseList: '/api/ShipOrder/GetUnmatchWareHouseList', // 获取无法匹配仓库订单列表
  GetExistClearStockoutList: '/api/ShipOrder/GetExistClearStockoutList', //存在清货产品的缺货订单
  ExportTwoDays: '/api/ShipOrder/TwoDaysNotYetShippedExport',//导出48小时未发货订单
  ExportFiveDays: '/api/ShipOrder/FiveDaysNotYetShippedExport',//导出5天未发货单订单
  GetWaitHoldUpOrderList: '/api/ShipOrder/GetWaitHoldUpOrderList', //获取待拦截订单列表
  GetWaitAuditList: '/api/ShipOrder/GetWaitAuditList', // 获取待人工审核订单列表

  //海外多仓规则
  OverseawhDropList: '/api/Warehouse/OverseawhDropList', //1.14.1.获取可用海外仓下拉列表
  GetProductRuleList: '/api/Overseawh/GetProductRuleListt', //1.14.2.获取产品规则设置分页列表
  AddProductRule: '/api/Overseawh/AddProductRule', //1.14.3.添加产品规则
  ModifyProductRule: '/api/Overseawh/ModifyProductRule', //1.14.4.编辑产品规则
  SetProductRuleIsEnable: '/api/Overseawh/SetProductRuleIsEnable', //1.14.5.启停产品规则
  GetStockUpRuleList: '/api/Overseawh/GetStockUpRuleListt', //1.14.6.获取备货规则设置分页列表
  AddStockUpRule: '/api/Overseawh/AddStockUpRule', //1.14.7.添加备货规则
  ModifyStockUpRule: '/api/Overseawh/ModifyStockUpRule', //1.14.8.编辑备货规则
  SetStockUpRuleIsEnable: '/api/Overseawh/SetStockUpRuleIsEnable', //1.14.9.启停备货规则

  // 仓储 库存盘亏盘盈记录
  GetInventoryCheckLogList: '/api/InventoryCheckLog/GetList', //1.13.1.库存盘盈盘亏记录分页列表
  ExportInventoryCheckLog: '/api/InventoryCheckLog/Export', //1.13.2.库存盘盈盘亏记录导出

  // 买家黑名单
  BlackListGetList: '/api/BlackList/GetList', //获取买家黑名单分页列表
  BlackListCreate: '/api/BlackList/Create', //添加黑名单
  BlackListModify: '/api/BlackList/Modify', //编辑黑名单
  BlackListChangeStatus: '/api/BlackList/ChangeStatus', // 启停黑名单

  // 自定义规则
  MatchRuleGetList: '/api/MatchRule/GetList', // 获取规则列表
  BaseDataConditions: '/api/BaseData/Conditions', // 获取规则的条件
  MatchRuleCreate: '/api/MatchRule/Create', //添加自定义规则
  MatchRuleModify: '/api/MatchRule/Modify', //编辑自定义规则
  MatchRuleUpdatePriority: '/api/MatchRule/UpdatePriority', //规则排序
  MatchRuleChangeStatus: '/api/MatchRule/ChangeStatus', //启停规则
  AuditRulesDropList: '/api/MatchRule/DropList', // 获取人工审核规则下拉列表

  //拣货批次规则
  BatchOrderRuleGetList: '/api/BatchOrderRule/GetList',//1.7.1.获取拣货批次规则分页列表
  BatchOrderRuleGetRuleDetails: '/api/BatchOrderRule/GetRuleDetails', //1.7.2.获取拣货批次规则详情
  BatchOrderRuleAdd: '/api/BatchOrderRule/Add', //1.7.3.新增
  BatchOrderRuleModify: '/api/BatchOrderRule/Modify', //1.7.4.编辑
  BatchOrderRuleSetIsEnable: '/api/BatchOrderRule/SetIsEnable', //1.7.5.修改状态
  BatchOrderRuleSetPriority: '/api/BatchOrderRule/SetPriority', //1.7.6.修改排序

  // 仓储 拣货批次
  BatchOrderGetList: '/api/BatchOrder/GetList', //获取批次分页列表
  BatchOrderGetBatchOrderItem: '/api/BatchOrder/GetBatchOrderItem', //获取批次SKU明细
  BatchOrderGetBatchOrderInfo: '/api/BatchOrder/GetBatchOrderInfo', //获取批次订单
  BatchOrderGetNoPickItem: '/api/BatchOrder/GetNoPickItem', //获取待拣SKU
  BatchOrderGetNoPickItemArray: '/api/BatchOrder/GetNoPickItemArray', // 批量获取待拣SKU
  BatchOrderGetNoPackOrderInfo: '/api/BatchOrder/GetNoPackOrderInfo', //获取待打包订单
  BatchOrderReCreateBatchOrder: '/api/BatchOrder/ReCreateBatchOrder', //重新生成批次

  //调拨需求
  TransferRequireGetList: '/api/TransferRequire/GetList', //1.2.1.调拨需求分页列表
  TransferRequireDetail: '/api/TransferRequire/Detail', //1.2.2.调拨需求详情
  TransferRequireSetInvalid: '/api/TransferRequire/SetInvalid', //1.2.3.调拨需求作废
  TransferRequireModify: '/api/TransferRequire/ModifyQuantity', //1.2.4.调拨需求编辑数量
  TransferRequireCreateBatch: '/api/TransferRequire/CreateBatch', //1.2.5.调拨需求生成拣货批次

  //调拨拣货批次
  TransferBatchGetList: '/api/TransferBatch/GetList', //1.2.6.调拨拣货批次分页列表
  TransferBatchDetail: '/api/TransferBatch/Detail', //1.2.7.调拨拣货批次详情
  TransferBatchBoxDetail: '/api/TransferBatch/TransferRequireBoxDetail', //1.2.8.调拨需求箱号详情
  TransferBatchPrint: '/api/TransferBatch/Print', //1.2.9.调拨拣货批次打印数据查询
  TransferBatchForceComplete: '/api/TransferBatch/ForceComplete', //1.2.10.强制完成批次
  TransferBatchBatchReturn: '/api/TransferBatch/BatchReturn', //1.2.11.批次还货
  TransferInBoxDetail: '/api/TransferInBox/Detail', //1.2.17.获取调拨箱单明细
  TransferInBoxSkuDetail: '/api/TransferInBox/SkuDetail', //1.2.16.获取箱号对应Sku明细

  //调拨箱列表
  TransferInBoxPrint: '/api/TransferInBox/Print', //1.2.20.获取打印箱号数据
  TransferInBoxInputCharge: '/api/TransferInBox/InputCharge', //1.2.19.录入费用
  InBoxInputTrackingNumber: '/api/TransferInBox/InputTrackingNumber', //1.2.18.录入跟踪号

  // 统计
  UpPackUserPerformance: '/api/Statistics/UpPackUserPerformance', //打包员绩效
  ShipUserPerformance: '/api/Statistics/ShipUserPerformance', //发货员绩效
  PickerPerformance: '/api/Statistics/PickerPerformance', //拣货员绩效
  MethodShipedPerfomance: '/api/Statistics/ShippingMethodShiped', //渠道出库汇总
  OosStatistics: '/api/Statistics/OutOfStockSkus', //缺货产品汇总
  QaPerformance: '/api/Statistics/QaPerformance', //质检员绩效
  CountryShipedSummary: '/api/Statistics/CountryShipedSummary', //国家出库汇总
  GetShipedAgingList: '/api/Statistics/GetShipedAgingList', //发货时效列表
  GetLogisticsAgingList: '/api/LogisticsAging/List', //物流时效列表
  ExportLogisticsAging: '/api/LogisticsAging/Export', //导出列表数据
  ExportNotQualified: '/api/LogisticsAging/NotQualifiedExport', //导出未达标数据

  // 仓储 库存流水
  InventoryLogGetList: '/api/InventoryLog/GetList', //获取分页列表
  ExportReportRecordAdd: '/api/ExportReportRecord/Add', // 导出

  // 补货需求
  SkuReplenishList: '/api/SkuReplenish/List', //获取补货列表
  SkuReplenishPdaOutStore: '/api/SkuReplenish/PdaOutStore', // 获取补货出库明细
  SkuReplenishCancel: '/api/SkuReplenish/Cancel', //取消补货单
  SkuReplenishDetail: '/api/SkuReplenish/Detail', // 查看补货单
  SkuReplenishAdd: '/api/SkuReplenish/Add', //添加补货需求
  SkuReplenishEdit: '/api/SkuReplenish/Edit', //编辑补货单
  SkuReplenishPrint: '/api/SkuReplenish/Print', //打印补货需求

  //调拨箱列表
  TransferInBoxList: '/api/TransferInBox/List', //1.2.15.调拨箱列表

  // 仓储 调拨装箱
  TransferBatchPdaDetail: '/api/TransferBatch/PdaDetail', // 调拨装箱获取批次详情(PDA)
  TransferInBoxFinishInBox: '/api/TransferInBox/FinishInBox', // 调拨装箱完成装箱

  // 仓储 发货批次
  DeliveryBatchGetList: '/api/DeliveryBatch/List', // 获取发货批次列表
  GetEdisHandoverSheet: '/api/DeliveryBatch/GetEdisHandoverSheet', //获取发货批次对应的Edis渠道交接单图片地址

  // 仓储 15天库存盘盈盘亏库存统计报表
  GetInventoryCheckLogListChart: '/api/Statistics/GetInventoryCheckLogList', // 1.13.3.15天库存盘亏盘盈统计报表
  ExportInventoryCheckLogList: '/api/Statistics/ExportInventoryCheckLogList', // 1.13.4. 15天库存盘亏盘盈统计报表导出

  //仓储 缺货产品汇总
  StatisticsOutOfStockSkus: '/api/Statistics/OutOfStockSkus', //缺货产品汇总分页列表
  OutOfStockSkusExport: '/api/ShipOrder/OutOfStockSkusExport', //导出缺货产品

  //仓储 发货时效
  StatisticsGetShipedAgingList: '/api/Statistics/GetShipedAgingList', //1.10.27.发货时效列表

  //仓储 设置发货
  CheckPackedOrderByTrackCode: '/api/ShipOrder/CheckPackedOrderByTrackCode', // 按跟踪号获取已打包订单信息（设置发货用）
  ShipOrderSetSend: '/api/ShipOrder/SetSend', //设置发货
  SetSendByTort: '/api/ShipOrder/SetSendByTort', //侵权订单设置发货

  //仓储 盘点需求
  CheckOutDemandGetList: '/api/CheckOutDemand/GetList', //1.17.1.获得盘点需求记录
  CheckOutDemandSetStatus: '/api/CheckOutDemand/SetStatus', //1.17.3.变更盘点需求状态
  CheckOutGetOutStockOrder: '/api/CheckOutDemand/GetOutStockOrder', //1.17.2.获得设置缺货订单

  // 仓储 装箱出库记录
  BoxGetList: '/api/Box/GetList', // 装箱出库记录列表
  BoxGetBoxItemList: '/api/Box/GetBoxItemList', // 查看装箱出库明细列表
  BoxExport: '/api/Box/Export', // 装箱导出数据
  BoxBatchInputGrossWeight: '/api/Box/BatchInputGrossWeight', // 批量录入毛重/批量修改毛重
  BoxBatchInputFirstShippingInfo: '/api/Box/BatchInputFirstShippingInfo', // 批量录入头程原单信息

  // 物料申请
  MaterialApplyGetList: '/api/MaterialApply/GetList',// 物料申请分页列表
  MaterialApplyGeDetail: '/api/MaterialApply/GeDetail', // 物料申请详情
  MaterialApplyGeHistorys: '/api/MaterialApply/GeHistorys', // 物料申请操作记录
  MaterialApplySave: '/api/MaterialApply/Save', // 物流申请添加修改、提交审核
  MaterialApplySubmitApply: '/api/MaterialApply/SubmitApply', // 物流申请提交审核
  MaterialApplyAudit: '/api/MaterialApply/Audit', // 物流申请-通过/不通过
  MaterialApplyReturnModify: '/api/MaterialApply/ReturnModify', // 物流申请-返回修改
  MaterialApplyCancel: '/api/MaterialApply/Cancel', // 物流申请-作废
  MaterialApplyExport: '/api/MaterialApply/Export', // 物流申请-导出

  // 仓储 lazada发票打印
  PrintLazadaInvoice: '/api/ShipOrder/PrintLazadaInvoice', // lazada打印面单

  // 物流退件工单
  ReturnLogisticsGetList: '/api/ReturnLogistics/GetList', // 物流退件分页列表
  ReturnLogisticsGeDetail: '/api/ReturnLogistics/GeDetail', // 物流退件查看详情
  ReturnLogisticsGeHistorys: '/api/ReturnLogistics/GeHistorys', // 物流退件操作记录
  ReturnLogisticsSave: '/api/ReturnLogistics/Save', // 物流退件添加修改、提交完成
  ReturnLogisticsCommitOperation: '/api/ReturnLogistics/CommitOperation', // 物流退件提交当前操作
  ReturnLogisticsSetProcessingStatus: '/api/ReturnLogistics/SetProcessingStatus', // 物流退件更改客服处理状态
  ReturnLogisticsExport: '/api/ReturnLogistics/Export', // 物流退件订单导出
  InventoryGetInventorys: '/api/Inventory/GetInventorys', // 检查库存接口
  InventorySkuInto: '/api/Inventory/SkuInto', // Sku入库
  GetShipOrderByTrackCode: '/api/ShipOrder/GetShipOrderByTrackCode', //获取发货单基础信息（按跟踪号）


  /* 仓储 end */

  /**物流 start */
  ChannelDropList: '/api/Channel/DropList', // 获取渠道下拉
  CustomerGetList: '/api/Customer/GetList', //1.2.1.获取客户分页列表数据
  CustomerUpdCreditsBalance: '/api/Customer/UpdCreditsBalance', //1.2.8.信用调额
  CustomerRecharge: '/api/Customer/Recharge', //1.2.7.余额充值
  CustomerChangeStatus: '/api/Customer/ChangeStatus', //1.2.9.启停客户
  GetCustomerDiscount: '/api/Customer/GetCustomerDiscount', //1.2.3.获取客户渠道折扣
  CustomerCreate: '/api/Customer/Create', //1.2.4.添加客户资料
  CustomerModify: '/api/Customer/Modify', //1.2.5.编辑客户资料

  // 物流 渠道管理
  GetLogisticsChannelList: '/api/Channel/GetList', //获取渠道分页列表
  GetCarrierList: '/api/Channel/CarrierList', // 获取渠道各平台承运商
  ChannelImport: '/api/Channel/Import', //导入物流渠道
  ShippingMethodChangStatus: '/api/Channel/ChangeStatus', // 启停渠道
  ChannelBindCarrier: '/api/Channel/BindCarrier', // 绑定承运商
  ChannelCaculate: '/api/Channel/Caculate', // 渠道运费预算
  ChannelBindAddress: '/api/Channel/BindAddress', // 绑定地址
  GetChannelAddressList: '/api/Channel/GetAddressList', // 根据获取物流渠道对应绑定地址列表
  BindTrackingmoreCode: '/api/Channel/BindTrackingmoreCode', // 绑定查询走件记录跟踪码
  GetTrackingmoreList: '/api/Channel/TrackingmoreList', // 绑定查询走件记录跟踪码
  GetTrackingmoreDetail: '/api/Channel/TrackingmoreDetail', //查看Trackingmore物流详情
  ExportTrackingmore: '/api/Channel/TrackingmoreExport', //查看Trackingmore物流详情

  //虚拟渠道
  VirtualChannelGetList: '/api/VirtualChannel/GetList', //1.8.1.获取虚拟渠道分页列表
  VirtualChannelChangeStatus: '/api/VirtualChannel/ChangeStatus', //1.8.5.启停虚拟渠道状态
  VirtualChannelCreate: '/api/VirtualChannel/Create', //1.8.3.添加虚拟渠道
  VirtualChannelModify: '/api/VirtualChannel/Modify', //1.8.4.编辑虚拟渠道

  //地址管理
  AddressGetList: '/api/Address/GetList', //1.7.1.获取地址分页列表
  AddressDropList: '/api/Address/DropList', //1.7.2.获取可用地址下拉列表
  AddressCreate: '/api/Address/Create', //1.7.3.添加地址
  AddressModify: '/api/Address/Modify', //1.7.4.编辑地址
  AddressChangeStatus: '/api/Address/ChangeStatus', //1.7.5.启停地址状态

  //物流 客户交易流水
  TransactionGetList: '/api/Transaction/GetList', //  获取交易流水分页列表
  TransactionExport: '/api/Transaction/Export', //  导出交易流水
  TransactionRefund: '/api/Transaction/Refund', //  退回费用

  //wish邮授权
  WishPostGetList: '/api/WishPost/GetList', //1.4.1.wish获取授权账号列表
  WishPostChangeStatus: '/api/WishPost/ChangeStatus', //1.4.4.启停授权
  WishPostChangeUseApi: '/api/WishPost/ChangeUseApi', //1.4.5.启停API
  WishPostCreate: '/api/WishPost/Create', //1.4.2.添加授权
  WishPostModify: '/api/WishPost/Modify', //1.4.3.编辑授权

  //Fpx授权
  FpxPostGetList: '/api/FpxPost/GetList', //1.4.1.Fpx获取授权账号列表
  FpxPostChangeStatus: '/api/FpxPost/ChangeStatus', //1.4.4.启停授权
  FpxPostChangeUseApi: '/api/FpxPost/ChangeUseApi', //1.4.5.启停API
  FpxPostCreate: '/api/FpxPost/Create', //1.4.2.添加授权
  FpxPostModify: '/api/FpxPost/Modify', //1.4.3.编辑授权

  //万邑通授权
  WinitPostGetList: '/api/WinitPost/GetList', //1.4.1.万邑通获取授权账号列表
  WinitPostChangeStatus: '/api/WinitPost/ChangeStatus', //1.4.4.启停授权
  WinitPostChangeUseApi: '/api/WinitPost/ChangeUseApi', //1.4.5.启停API
  WinitPostCreate: '/api/WinitPost/Create', //1.4.2.添加授权
  WinitPostModify: '/api/WinitPost/Modify', //1.4.3.编辑授权

  /**物流 end */

  /** 报表 start **/
  GetPurchaserPerformanceList: '/api/Statistics/GetPurchaserPerformanceList', //采购员绩效
  ExportPurchaserPerformance: '/api/Statistics/ExportPurchaserPerformance', //导出采购员绩效

  //退付款金额报表
  StatisticalStatementRefundAmount: '/api/ShipOrderSummaryOfDay/StatisticalStatementRefundAmount', //退付款金额报表

  //销售报表
  SkuStatisticsAvgSaleQuantity: '/api/SkuStatistics/AvgSaleQuantity', //销售报表
  ExportAvgSaleQuantity: '/api/SkuStatistics/ExportAvgSaleQuantity', //导出报表

  //昨日销量报表
  YesterdaySaleQuantity: '/api/SkuStatistics/YesterdaySaleQuantity', //昨日销量列表

  //预算毛利报表
  StatisticsSalesTradingProfit: '/api/Statistics/SalesTradingProfit', //1.10.17.销售毛利报表
  ExportSalesTradingProfit: '/api/Statistics/ExportSalesTradingProfit', //1.10.18.导出销售毛利报表
  ReCalculateTradingProfit: '/api/Statistics/ReCalculateTradingProfit', //重算毛利
  SalesTradingProfitHistoryList: '/api/SalesTradingProfitHistory/GetList', //1.10.21.毛利操作日志列表
  ImportTwoStageFreight: '/api/SalesTradingProfit/ImportTwoStageFreight', //1.10.20.导入头尾程运费

  //毛利汇总报表
  SummarySalesTradingProfit: '/api/Statistics/SummarySalesTradingProfit', //1.10.22.毛利报表汇总
  ExportSummarySalesProfit: '/api/Statistics/ExportSummarySalesProfit', //导出毛利报表

  //商品售出率报表
  ProductSoldRateList: '/api/ProductSoldRate/GetList', //1.12.1.获取商品售出率分页列表
  ProductSoldRateExport: '/api/ProductSoldRate/Export',  //导出商品售出率

  //EbayInvoice报表
  EbayDataGetEbayInvoice: '/api/EbayData/GetEbayInvoice', //EbayInvoice分页列表
  ExportEbayInvoice: '/api/EbayData/ExportEbayInvoice',  //导出EbayInvoice

  //订单销量报表
  ShipOrderSummaryOfDayList: '/api/ShipOrderSummaryOfDay/GetList', //订单销量分页列表
  ShipOrderSummaryOfDayExport: '/api/ShipOrderSummaryOfDay/ShipOrderSummaryOfDayExport', //导出订单销量分页列表

  //wish pb数据报表
  WishStoreGetCampaignList: '/api/WishStore/GetCampaignList', //wish pb分页列表
  WishStoreExportSummaryCampaign: '/api/WishStore/ExportSummaryCampaign', //导出PB汇总数据
  WishStoreExportCampaign: '/api/WishStore/ExportCampaign',  //导出PB原始数据

  //库存金额报表
  GetInventoryAmountList: '/api/Statistics/GetInventoryAmountList', //库存金额分页列表
  ExportInventoryAmount: '/api/Statistics/ExportInventoryAmount',  //导出库存金额统计报表

  //导出管理
  ExportReportRecordGetList: '/api/ExportReportRecord/GetList',  //导出管理分页列表
  ExportAddUserRemark: '/api/ExportReportRecord/AddUserRemark',  //添加备注

  //货运退款率统计报表
  StatisticsShippedRefund: '/api/LogisticsSummaryReport/StatisticsShippedRefund', //货运退款率分页列表


  /** 报表 end **/

  /* 客服 start */

  // 售后原因
  GetSaleReasonList: '/api/Reason/List', //获取原因管理列表
  SaleReasonAdd: '/api/Reason/Add', //添加原因
  SaleReasonEdit: '/api/Reason/Edit', //编辑原因
  SaleReasonEnable: '/api/Reason/Enable', //启禁用
  SaleReasonDropList: '/api/Reason/DropList', //获取原因下拉列表

  // 售后单管理
  AfterSaleList: '/api/AfterSale/List', //获取售后单列表
  AfterSaleDetail: '/api/AfterSale/Detail', //获取售后单详情
  AfterSaleAdd: '/api/AfterSale/Add', //新增售后工单
  AfterSaleEdit: '/api/AfterSale/Edit', //编辑售后工单
  AfterSaleSubmitAudit: '/api/AfterSale/SubmitAudit', //提交审核
  AfterSaleConfirmAudit: '/AfterSale/ConfirmAudit', //审核
  AfterSalePass: '/api/AfterSale/Pass', //审核售后单通过
  AfterSaleNoPass: '/api/AfterSale/NoPass', //审核售后单不通过
  AfterSaleReturnToModify: '/api/AfterSale/ReturnToModify', //审核售后单退回修改
  AfterSaleCustomerList: '/api/AfterSale/CustomerList', //获取客服/客服主管下拉列表
  AfterSaleOriginalShipOrder: '/api/AfterSale/OriginalShipOrder', //原始发货单数据
  AfterSaleHistoryRefund: '/api/AfterSale/HistoryRefund', //获取已退金额
  AfterSaleExport: '/api/AfterSale/Export', // 导出eBay售后单
  AfterSaleWalmartExport: '/api/AfterSale/AfrerOrderExport', // 导出售后单
  AfterSaleCroppings: '/api/AfterSale/Croppings', // 作废新建售后单

  //客服 售后 物流异常订单列表
  LogisticsAnomalyRecordList: '/api/LogisticsAnomalyRecord/GetList', //获取物流异常单列表
  ImportLogisticsAnomalyRecord: '/api/LogisticsAnomalyRecord/Import', //导入发货单
  ReplyLogisticsAnomalyRecord: '/api/LogisticsAnomalyRecord/Reply', //发送站内信
  AddRemarkBatch: '/api/ShipOrder/AddRemarkBatch', //添加备注  
  ChangeLogisticsCustomerStatus: '/api/LogisticsAnomalyRecord/CustomerStatusEdit', //修改客服状态
  BatchSendEmail: '/api/LogisticsAnomalyRecord/SendEmail', // 批量发送邮件

  // 客服 ebay 站内信模板管理
  GetTemplateTypeTree: '/api/Template/GetTypeList', // 获取站内信模板类型列表
  GetTemplateList: '/api/Template/GetList', // 获取模板列表
  TemplateTypeAdd: '/api/Template/AddType', // 新增模板类型
  TemplateTypeEdit: '/api/Template/EditType', //  编辑模板类型
  TemplateTypeDel: '/api/Template/DelType', // 删除模板类型
  TemplateAdd: '/api/Template/Add', // 新增模板
  TemplateEdit: '/api/Template/Edit', // 编辑模板
  TemplateDel: '/api/Template/Del', // 删除模板

  // 客服 ebay 站内信规则
  GetStationMailRuleList: '/api/MessageRule/BoxRuleList', // 获取站内信规则列表
  StationMailRuleEnable: '/api/MessageRule/EnableBoxRule', // 禁用、启用规则
  StationMailRuleAdd: '/api/MessageRule/AddBoxRule', // 添加规则
  StationMailRuleEdit: '/api/MessageRule/EditBoxRule', //  编辑规则
  GetSMRFolderTree: '/api/MessageRule/TreeFolder', // 获取文件夹树形列表
  GetSMRConditions: '/api/MessageRule/BoxRuleConditions', // 获取可选条件列表
  SMRSortNumEdit: '/api/MessageRule/EditSortNum', // 修改序号

  // 客服 ebay 站内信
  EbayMessageTreeFolder: '/api/EbayMessage/TreeFolder', //获取站内信文件夹树
  EbayMessageList: '/api/EbayMessage/List', //获取指定文件夹站内信列表
  EbayMessageDetail: '/api/EbayMessage/Detail', // 获取聊天记录\备注\发货单记录
  EbayMessageAddFolder: '/api/EbayMessage/AddFolder', //添加文件夹
  EbayMessageDelFolder: '/api/EbayMessage/DelFolder', //删除文件夹
  EbayMessageEditFolder: '/api/EbayMessage/EditFolder', //编辑文件夹名称
  EbayMessageMove: '/api/EbayMessage/Move', //移动站内信
  EbayMessageIgnore: '/api/EbayMessage/Ignore', //忽略站内信
  EbayMessageReply: '/api/EbayMessage/Reply', //回复站内信
  EbayMessageAddRemark: '/api/EbayMessage/AddRemark', //添加站内信备注
  EbayMessageDelRemark: '/api/EbayMessage/DelRemark', //删除站内信备注
  EbayMessageGetList: '/api/EbayMessage/GetSstatisticsList', //获取站内信回复数量列表
  EbayMessageImage: '/api/file/UploadEbayMessageImage', //ebay站内信上传图片
  EbayMessageSend: '/api/EbayMessage/Send', //发送站内信

  // ebay 取消交易
  CancelList: '/api/Cancel/List', //取消交易主列表
  CancelSubmitCancel: '/api/Cancel/SubmitCancel', //取消纠纷单
  CancelProcessEnd: '/api/Cancel/ProcessEnd', //处理纠纷单
  CancelDetail: '/api/Cancel/Detail', //获取取消单详情

  // eBay 未收到货
  GetNotReceiveGoodsList: '/api/NotReceive/List', // 获取未到货列表
  GetNotReceiveGoodsDetail: '/api/NotReceive/Detail', // 未到货订单详情
  GetShipMethod: '/api/NotReceive/ShipMethod', // 提供物流信息
  NRGReplyMessage: '/api/NotReceive/ReplyMessage', //  普通回复
  NRGFullRefund: '/api/NotReceive/FullRefund', //  全额退款
  NRGReSendOrPartRefund: '/api/NotReceive/ReSendOrPartRefund', //  重发或者部分退款
  NRGUpgradeCase: '/api/NotReceive/UpgradeCase', //  升级为纠纷
  NRGSetSelectNoRefund: '/api/NotReceive/SetSelectNoRefund', //  买家升级后，系统不自动退款

  // 退款退货
  ReturnList: '/api/Return/List', //退款退货列表查询
  ReturnDetail: '/api/Return/Detail', //退款退货订单详情
  ReturnFullRefund: '/api/Return/FullRefund', //全额退款
  ReturnReplyMessage: '/api/Return/ReplyMessage', //普通回复
  ReturnPartRefund: '/api/Return/PartRefund', //部分退款
  ReturnReSend: '/api/Return/ReSend', //重发
  ReturnRefuse: '/api/Return/Refuse', //拒绝退款退货
  ReturnUpgradeCase: '/api/Return/UpgradeCase', //升级纠纷
  ReSetSelectNoRefund: '/api/Return/SetSelectNoRefund',

  // 升级纠纷
  GetCaseList: '/api/CaseIssue/List', // 获取纠纷列表
  GetCaseDetail: '/api/CaseIssue/Detail', // 纠纷列表详情
  CaseRefund: '/api/CaseIssue/Refund', // 退款
  CaseAppeal: '/api/CaseIssue/Appeal', //  申诉

  // Wish工单
  WishTicketOrderList: '/api/WishTicketOrder/List', //获取Wish工单列表
  WishTicketOrderDetai: '/api/WishTicketOrder/Detail', //获取Wish工单详情
  WishTicketOrderReply: '/api/WishTicketOrder/Reply', //回复
  WishTicketOrderClose: '/api/WishTicketOrder/Close', //关闭
  WishTicketOrderReOpen: '/api/WishTicketOrder/ReOpen', //重开
  WishTicketOrderWishSupport: '/api/WishTicketOrder/WishSupport', //wish客服协助

  // shopee 退货退款
  ShopeeReturnGetList: '/api/ShopeeReturn/GetList', // 退货退款
  ShopeeReturnDetail: '/api/ShopeeReturn/Detail', // 退款退货订单详情
  ShopeeReturnSubmitOperation: '/api/ShopeeReturn/SubmitOperation', // 退款退货处理
  ShopeeReturnReturnExport: '/api/ShopeeReturn/ReturnExport', // 退款退货导出

  // 客服 shopee 取消订单
  ShopeeCancellationGetList: '/api/ShopeeCancellation/GetList', // 取消订单列表查询
  ShopeeCancellationDetail: '/api/ShopeeCancellation/Detail', // 取消订单订单详情
  ShopeeCancellationSubmitOperation: '/api/ShopeeCancellation/SubmitOperation', // 取消订单处理
  ShopeeCancellationCancelOrder: '/api/ShopeeCancellation/CancelOrder', // 取消Shopee后台订单

  // 售后 Cancel Request
  AfterSaleGetEbayPlatformOrderId: '/api/AfterSale/GetEbayPlatformOrderId', // 获取订单平台单号
  AfterSaleSubmitCancel: '/api/AfterSale/SubmitCancel', // 发送Cancel 请求

  // 取消后台单
  AfterSaleGetListByShipOrderCode: '/api/WalmartOrderItem/GetListByShipOrderCode', // 1.2.1.获取沃尔玛原始订单明细列表
  AfterSaleCancellingOrderLines: '/api/WalmartOrderItem/CancellingOrderLines', // 发送取消请求

  // 邮箱账号管理
  GetEmailAccountList: '/api/EmailAccount/List', //获取邮箱账号管理列表
  EmailAccountAdd: '/api/EmailAccount/Add', //添加邮箱
  EmailAccountEdit: '/api/EmailAccount/Edit', //编辑邮箱
  EmailAccountEnable: '/api/EmailAccount/Enable', //启禁用邮箱
  EmailAccountBindUser: '/api/EmailAccount/BindUser', //授权用户
  EmailAccountDropList: '/api/EmailAccount/UserBindAccounts', //获取用户所绑定的邮箱集合
  BindingStore: '/api/EmailAccount/BindingStore', //5.1.7.邮箱绑定平台店铺
  GetBindingStore: '/api/EmailAccount/GetBindingStore', //5.1.8.获取邮箱绑定平台店铺列表

  // 邮件管理
  GetEmailAccountsByStore: '/api/EmailRecord/GeAccountsByStore',  //获取登录用户授权邮箱账号列表且该邮箱账号已绑定订单对应的店铺
  GetEmailRecordAccounts: '/api/EmailRecord/Accounts', // 获取登录用户授权邮箱账号列表
  GetEmailRecordList: '/api/EmailRecord/List', // 获取指定邮箱不同类型对应的邮件列表
  EmailRecordDetail: '/api/EmailRecord/Detail', // 获取邮件详情页面
  EmailRecordWrite: '/api/EmailRecord/Write', // 写邮件
  EmailRecordSign: '/api/EmailRecord/Sign', //  标记已读与未读
  EmailRecordDel: '/api/EmailRecord/Del', // 删除邮件
  EmailRecordReply: '/api/EmailRecord/Reply', //  回复邮件
  EmailRecordReplyAll: '/api/EmailRecord/ReplyAll', //  回复全部
  EmailRecordForward: '/api/EmailRecord/Forward', // 转发邮件

  // 邮件模板管理
  GetEmailTemplateTypeDrop: '/api/EmailTemplate/TypeDropList', // 获取模板类型下拉列表
  GetEmailTemplateList: '/api/EmailTemplate/List', // 获取邮件模板管理列表
  EmailTemplateTypeAdd: '/api/EmailTemplate/AddType', // 新增模板类型
  EmailTemplateTypeEdit: '/api/EmailTemplate/EditType', //  编辑模板类型
  EmailTemplateTypeDel: '/api/EmailTemplate/DelType', // 删除模板类型
  EmailTemplateAdd: '/api/EmailTemplate/Add', // 新增模板
  EmailTemplateEdit: '/api/EmailTemplate/Edit', // 编辑模板
  EmailTemplateDel: '/api/EmailTemplate/Del', // 删除模板
  EmailTemplateDropList: '/api/EmailTemplate/DropList', // 获取指定类型的邮件模板下拉列表

  //allegro 订单纠纷
  AllegroDisputesOrderList: '/api/AllegroDisputesOrder/GetList',  //获取allegro订单纠纷列表
  AllegroDisputesOrderDetail: '/api/AllegroDisputesOrder/GetDetail', //获取allegro订单纠纷详情
  AllegroDisputesOrderProcess: '/api/AllegroDisputesOrder/Process',  //8.2.3.处理纠纷

  //allegro 客户评价
  AllegroRatingsGetList: '/api/AllegroRatings/GetList', //评价列表
  AllegroRatingsReply: '/api/AllegroRatings/Reply', //回复评价
  AllegroRatingsDelete: '/api/AllegroRatings/Delete', //删除评价
  AllegroRatingsSetRemark: '/api/AllegroRatings/SetRemark', //设置备注
  AllegroRatingsUpdateState: '/api/AllegroRatings/UpdateState', //设置状态
  AllegroRatingsDetail: '/api/AllegroRatings/Detail', //详情
  AllegroRatingsHistory: '/api/AllegroRatings/History', //操作记录

  //trackmoce物流跟踪
  ChannelTrackingmoreList: '/api/Channel/TrackingmoreList', //1.1.11.Trackingmore物流查询列表
  ChannelTrackingmoreDetail: '/api/Channel/TrackingmoreDetail', //1.1.13.查看Trackingmore物流详情
  ChannelTrackingmoreExport: '/api/Channel/TrackingmoreExport', //1.1.12.Trackingmore物流记录导出
  /* 客服 end */
}
