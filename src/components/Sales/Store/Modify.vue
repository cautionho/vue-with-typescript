<template>
  <div  class="P-Inline-Block">
    <Button class="P-MB-10  P-MR-5" type="primary" v-if="CalculateCreate()" @click="TriggerAccount(AccountsInfo[String(Platform)])">添加账号</Button>
    <Modal v-model="AccountModal" :title="Store.length&&Store[0].Id ? '编辑账号' : '添加账号'" :width="800" @on-cancel="CancelAccount(false)">
      <Row>
        <!-- eBay -->
        <Col span="24" v-if="Platform === 1">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="EbayRules" :label-width="90">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="Paypal：" prop="PaypalAccountId">
            <Select placeholder="Paypal账号" v-model="AccountsInfo[String(Platform)].PaypalAccountId" :options="PaypalDrop" />
            <!-- <Select placeholder="Paypal账号" v-model="AccountsInfo[String(Platform)].PaypalAccountId" filterable clearable>
              <Option v-for="(item,index) in PaypalDrop" :value="item.Value" :key="index">{{item.Key}}</Option>
            </Select> -->
          </FormItem>
          <FormItem label="API状态：" prop="IsUseApi">
            <Select placeholder="API状态" v-model="AccountsInfo[String(Platform)].IsUseApi" :options="EnableDrop" />
             <!-- <Select placeholder="API状态" v-model="AccountsInfo[String(Platform)].IsUseApi" filterable clearable>
              <Option v-for="(item,index) in EnableDrop" :value="$Enums.Public.Enable[item]" :key="index">{{item}}</Option>
            </Select> -->
          </FormItem>
          <FormItem label="账单币种：" prop="InvoiceCurrency">
             <Select placeholder="账单币种" v-model="AccountsInfo[String(Platform)].InvoiceCurrency" :options="CURRENCY_DROP" />
            <!-- <Select placeholder="账单币种" v-model="AccountsInfo[String(Platform)].InvoiceCurrency" filterable clearable>
              <Option v-for="(item,index) in CURRENCY_DROP" :value="item.Value" :key="index">{{item.Key}}</Option>
            </Select> -->
          </FormItem>
          <FormItem label="登录IP：" prop="LoginIp">
            <Input placeholder="登录IP" v-model="AccountsInfo[String(Platform)].LoginIp"></Input>
          </FormItem>
          <FormItem label="密码：" prop="Password">
            <Input :placeholder="Store.length ? '不填写则默认不修改密码' : '登录密码'" v-model="AccountsInfo[String(Platform)].Password"></Input>
          </FormItem>
          <FormItem label="站点：" prop="JumpAddr">
            <CheckboxGroup v-model="AccountsInfo[String(Platform)].JumpAddr">
              <Checkbox v-for="(item,index) in EabyLoginSite" :label="item.Value" :key="index">{{item.Key}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
        </Col>
        <!-- Wish -->
        <Col span="24" v-if="Platform === 2">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="WishRules" :label-width="90">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Amazon -->
        <Col span="24" v-if="Platform === 3">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="AmazonRules" :label-width="90">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="卖家ID：" prop="SellerId">
            <Input placeholder="卖家ID" v-model="AccountsInfo[String(Platform)].SellerId"></Input>
          </FormItem>
          <FormItem label="MWS授权令牌：" prop="MWSAuthToken">
            <Input placeholder="MWS授权令牌" v-model="AccountsInfo[String(Platform)].MWSAuthToken"></Input>
          </FormItem>
          <FormItem label="站点：" prop="SiteCode">
            <CheckboxGroup v-model="AccountsInfo[String(Platform)].SiteCode">
              <Checkbox v-for="(item,index) in AmazonSiteDrop" :label="item.Value" :key="index">{{item.Key}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
        </Col>
        <!-- Shopee -->
        <Col span="24" v-if="Platform === 4">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="ShopeeRules" :label-width="90">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="ShopId：" prop="ShopId">
            <Input placeholder="ShopId" v-model="AccountsInfo[String(Platform)].ShopId" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="站点：" prop="Site">
            <Select placeholder="站点" v-model="AccountsInfo[String(Platform)].Site" :options="ShopeeSiteDrop" />
            <!-- <Select placeholder="站点" v-model="AccountsInfo[String(Platform)].Site" filterable clearable>
              <Option v-for="(item,index) in ShopeeSiteDrop" :value="item" :key="index">{{item}}</Option>
            </Select> -->
          </FormItem>
        </Form>
        </Col>
        <!-- Walmart FactoryMarket Allegro -->
        <Col span="24" v-if="Platform === 5 || Platform === 12 || Platform === 17">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="WalmartRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="ClientId：" prop="ClientId">
            <Input placeholder="ClientId" v-model="AccountsInfo[String(Platform)].ClientId" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="Client Secret：" prop="ClientSecret">
            <Input placeholder="Client Secret" v-model="AccountsInfo[String(Platform)].ClientSecret" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Cdiscount -->
        <Col span="24" v-if="Platform === 6">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="CdiscountRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="Api Login：" prop="ApiLogin">
            <Input placeholder="Api Login" v-model="AccountsInfo[String(Platform)].ApiLogin"></Input>
          </FormItem>
          <FormItem label="Api Password：" prop="ApiPassword">
            <Input placeholder="Api Password" v-model="AccountsInfo[String(Platform)].ApiPassword" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Joom-->
        <Col span="24" v-if="Platform === 8">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="JoomRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="Client Id：" prop="ClientId">
            <Input placeholder="Client Id" v-model="AccountsInfo[String(Platform)].ClientId" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="Client Secret：" prop="ClientSecret">
            <Input placeholder="Client Secret" v-model="AccountsInfo[String(Platform)].ClientSecret" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="Warehouse Id：" prop="WarehouseId">
            <Input placeholder="Warehouse Id" v-model="AccountsInfo[String(Platform)].WarehouseId"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Fyndiq -->
        <Col span="24" v-if="Platform === 9">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="FyndiqRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="Merchant Id：" prop="MerchantId">
            <Input placeholder="Merchant Id" v-model="AccountsInfo[String(Platform)].MerchantId" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="Token：" prop="Token">
            <Input placeholder="Token" v-model="AccountsInfo[String(Platform)].Token" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Tophatter -->
        <Col span="24" v-if="Platform === 11">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="TophatterRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="Access Token：" prop="AccessToken">
            <Input placeholder="Access Token" v-model="AccountsInfo[String(Platform)].AccessToken" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- <Col span="24" v-if="Platform === 12"></Col> -->
        <!-- Vova -->
        <Col span="24" v-if="Platform === 13">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="VovaRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="Token：" prop="Token">
            <Input placeholder="Token" v-model="AccountsInfo[String(Platform)].Token" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="Platform Id：" prop="PlatformId">
            <Input placeholder="Platform Id" v-model="AccountsInfo[String(Platform)].PlatformId"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Mymall -->
        <Col span="24" v-if="Platform === 14">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="MyMallRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
           <FormItem label="UserName：" prop="UserName">
            <Input placeholder="UserName" v-model="AccountsInfo[String(Platform)].UserName"></Input>
          </FormItem>
          <FormItem label="Password：" prop="Passwords">
            <Input placeholder="Password" v-model="AccountsInfo[String(Platform)].Passwords" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
         <FormItem label="Client Id：" prop="ClientId">
            <Input placeholder="Client Id" v-model="AccountsInfo[String(Platform)].ClientId" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="Client Secret：" prop="ClientSecret">
            <Input placeholder="Client Secret" v-model="AccountsInfo[String(Platform)].ClientSecret" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Jumia -->
        <Col span="24" v-if="Platform === 16">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="JumiaRules" :label-width="90">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="UserId：" prop="UserId">
            <Input placeholder="UserId" v-model="AccountsInfo[String(Platform)].UserId" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="APIKey：" prop="APIKey">
            <Input placeholder="APIKey" v-model="AccountsInfo[String(Platform)].APIKey" :type="Store.length ? 'password' : 'text'"></Input>
          </FormItem>
          <FormItem label="站点：" prop="SiteType">
            <Select placeholder="站点" v-model="AccountsInfo[String(Platform)].SiteType" :options="JumiaSiteDrop" />
            <!-- <Select placeholder="站点" v-model="AccountsInfo[String(Platform)].SiteType" filterable clearable>
              <Option v-for="(item,index) in JumiaSiteDrop" :value="$Enums.Sales.JumiaSiteType[item]" :key="index">{{item}}</Option>
            </Select> -->
          </FormItem>
        </Form>
        </Col>
        <!-- Lazada -->
        <Col span="24" v-if="Platform === 18">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="LazadaRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
           <FormItem label="站点：" prop="LazadaSiteType">
            {{$Enums.Sales.LazadaSiteType[AccountsInfo[String(Platform)].LazadaSiteType]}}
          </FormItem>
        </Form>
        </Col>
        <!-- Groupon -->
        <Col span="24" v-if="Platform === 19">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="GrouponRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
           <FormItem label="Supplier ID：" prop="SupplierId">
            <Input placeholder="SupplierId" v-model="AccountsInfo[String(Platform)].SupplierId"></Input>
          </FormItem>
          <FormItem label="Token：" prop="Token">
            <Input placeholder="Token" v-model="AccountsInfo[String(Platform)].Token"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Real.de -->
        <Col span="24" v-if="Platform === 20">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="RealDeRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
           <FormItem label="Client Key：" prop="ClientId">
            <Input placeholder="Client Key" v-model="AccountsInfo[String(Platform)].ClientId" :type="this.Store.length&&this.Store[0].Id?'password':'text'"></Input>
          </FormItem>
          <FormItem label="Secret Key：" prop="ClientSecret">
            <Input placeholder="Secret Key" v-model="AccountsInfo[String(Platform)].ClientSecret" :type="this.Store.length&&this.Store[0].Id?'password':'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Rakuten -->
        <Col span="24" v-if="Platform === 21">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="RakutenRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
           <FormItem label="Key：" prop="Key">
            <Input placeholder="Key" v-model="AccountsInfo[String(Platform)].Key" :type="this.Store.length&&this.Store[0].Id?'password':'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <!-- Newegg -->
        <Col span="24" v-if="Platform === 22">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="NeweggRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
          <FormItem label="Seller Id：" prop="SellerId">
            <Input placeholder="Seller Id" v-model="AccountsInfo[String(Platform)].SellerId" :type="this.Store.length&&this.Store[0].Id?'password':'text'"></Input>
          </FormItem>
          <FormItem label="Secret Key：" prop="SecretKey">
            <Input placeholder="Secret Key" v-model="AccountsInfo[String(Platform)].SecretKey" :type="this.Store.length&&this.Store[0].Id?'password':'text'"></Input>
          </FormItem>
        </Form>
        </Col>
        <Col span="24" v-if="Platform === 99">
        <Form :model="AccountsInfo[String(Platform)]" :ref="`Store${Platform}`" :rules="OtherRules" :label-width="110">
          <FormItem label="账号：" prop="StoreName">
            <Input placeholder="账号名称" v-model="AccountsInfo[String(Platform)].StoreName"></Input>
          </FormItem>
          <FormItem label="别名：" prop="Alias">
            <Input placeholder="账号别名" v-model="AccountsInfo[String(Platform)].Alias"></Input>
          </FormItem>
           <FormItem label="佣金比例(%)：" prop="CommissionRate">
            <Input placeholder="佣金比例(%)" v-model="AccountsInfo[String(Platform)].CommissionRate"></Input>
          </FormItem>
        </Form>
        </Col>
      </Row>
      <Row slot="footer">
        <Button type="primary" @click="Validate">提交</Button>
        <Button @click="CancelAccount(false)">取消</Button>
      </Row>
    </Modal>
  </div>
</template>
<script lang="ts">
import {Component,Vue,Prop,Emit} from 'vue-property-decorator';
import {Getter, Action} from 'vuex-class';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Sales';

@Component({
  name:'ModifyStore'
})

export default class ModifyStore extends Vue{
  @Action private "Base/UPDATE_BASE_INFO": any
  @Getter private "Base/CURRENCY_DROP": PInterface.KV[];

  get CURRENCY_DROP() {
    return this["Base/CURRENCY_DROP"];
  }

  @Prop() private Powers:PInterface.Power
  @Prop(Number) private Platform:number
  // @Prop(Array) private Store:Interface.StoreList[]
  @Prop(Array) private PaypalDrop?: PInterface.KV[]

  @Emit() EmitModify(G?:boolean):void { }

  private CalculateCreate():boolean{
    return [this.Powers.EbayStoreAdd,this.Powers.WishStoreAdd,this.Powers.AmazonStoreCreate,this.Powers.ShopeeStoreAdd,this.Powers.walmartStoreCreate,this.Powers.CdiscountStoreCreate,this.Powers.JoomStoreAdd,this.Powers.FyndiqStoreCreate,this.Powers.TopBuyCreate,this.Powers.TophatterStoreCreate,this.Powers.FactoryMarketStoreCreate,this.Powers.vovaStoreCreate,this.Powers.MymallStoreCreate,this.Powers.JumiaStoreAdd,this.Powers.AllegroStoreSave,this.Powers.LazadaStoreSave,this.Powers.GrouponStoreInsert,this.Powers.SaveRealDeStore,this.Powers.SaveRakutenStore,this.Powers.SaveNeweggStore,this.Powers.OtherStoreCreate].some(Item => Item === true)
  }

  private TriggerAccount(D:Interface.StoreList):void {
    this.$set(this,'Store',[D])
    if(!this.CURRENCY_DROP.length && this.Platform === 1){
      this['Base/UPDATE_BASE_INFO']('CURRENCY','');
    }
    if(this.Store[0].Id){
      this.$set(this.AccountsInfo,String(this.Platform),this.Store[0])
      if(this.Platform === 1){
        this.$set((this.AccountsInfo as any)[String(this.Platform)],'IsUseApi',(this.AccountsInfo as any)[String(this.Platform)].IsUseApi ? 1 : 0);
        this.$set((this.AccountsInfo as any)[String(this.Platform)],'JumpAddr',(this.AccountsInfo as any)[String(this.Platform)].JumpAddr.split(','));
        this.$set(this,'EbayLoginPwd',(this.AccountsInfo as any)[String(this.Platform)].Password)
        this.$set((this.AccountsInfo as any)[String(this.Platform)],'Password','');
        this.$set((this.EbayRules as any).Password[0],'required',false)
      }
      if(this.Platform === 3){
        this.$set((this.AccountsInfo as any)[String(this.Platform)],'SiteCode',(this.AccountsInfo as any)[String(this.Platform)].SiteCode.split(','));
      }
    }else{
       // Lazada 新增时不打开模态框，直接授权
      if(this.Platform === 18){
        this.LazadaAuthorization()
        return;
      }
    }
    this.$set(this,'AccountModal', true);
  }

  private Validate():void {
    (this as any).$refs[`Store${this.Platform}`].validate((Valid:boolean)=>{
      if(Valid){
        this.$UI.Loading.Show();
        let PostData = this.GetStorePostData();
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api:{
            Address: PostData.Id !== 0 ? this.$Api.Sales[this.Platform].StoreModify : this.$Api.Sales[this.Platform].StoreCreate,
            Login:true
          },
          Data:PostData,
          Callback:(Res:PInterface.Res):void => {
            if(Res.IsSuccess){
              this.$UI.Tips.Floating('success', PostData.Id !== 0 ? '编辑账号成功' : '添加账号成功');
              if(Res.Data.Url){
                window.open(Res.Data.Url, "_blank")
              }
              this.CancelAccount(true);
            }else{
              this.$UI.Loading.Hide();
              this.$Request.Error(Res);
            }
          }
        })
      }
    })
  }

  private GetStorePostData():any {
    let PostData = JSON.parse(JSON.stringify((this.AccountsInfo as any)[String(this.Platform)]))
    if(this.Platform === 1){
      PostData.Password = PostData.Password === '' ? this.EbayLoginPwd : this.$Utils.Encrypt(PostData.Password);
      PostData.JumpAddr = PostData.JumpAddr.join(',');
      PostData.IsUseApi = Boolean(PostData.IsUseApi)
    }
    if(this.Platform === 3){
      PostData.SiteName = '';
      for(let Item of this.AmazonSiteDrop){
        if(PostData.SiteCode.some((Im:string) =>{ return Im === Item.Value})){
          PostData.SiteName += (`${Item.Key},`)
        }
      }
      PostData.SiteCode = PostData.SiteCode.join(',')
      PostData.SiteName = PostData.SiteName.slice(0,-1);
    }
    delete PostData._index;
    delete PostData._rowKey;

    return PostData;
  }

  private LazadaAuthorization():void {
    this.$UI.Loading.Show();
    this.$Request.Post({
      Server: this.$Server.Sales,
      Api:{
        Address: this.$Api.Sales['18'].Authorization,
        Login:true
      },
      Data:'',
      Callback:(Res:PInterface.Res):void => {
        this.$UI.Loading.Hide();
        if(Res.IsSuccess){
           window.open(Res.Data.Url, "_blank")
        }else{
          this.$Request.Error(Res)
        }
      }
    })
  }

  private CancelAccount(G:boolean):void {
    this.AccountsInfo = new Interface.AllStore();
    this.EbayLoginPwd = ''
    this.$nextTick(()=>{
      (this as any).$refs[`Store${this.Platform}`].resetFields();
      this.$set(this,'AccountModal', false);
      if(G){
        this.EmitModify(G);
      }
    })
  }

  private AccountModal:boolean = false;
  private AccountsInfo:Interface.AllStore = new Interface.AllStore()
  private Store:any[] = []
  private EnableDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Public.Enable)

  private EabyLoginSite:PInterface.KV[] = [{Key: '美国',Value: 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn'}, {Key: '英国',Value: 'https://signin.ebay.co.uk/ws/eBayISAPI.dll?SignIn'}, {Key: '德国',Value: 'https://signin.eBay.de/ws/eBayISAPI.dll?SignIn' }, {Key: '澳大利亚',Value: 'https://signin.ebay.com.au/ws/eBayISAPI.dll?SignIn'}, { Key: '加拿大', Value: 'https://signin.ebay.ca/ws/eBayISAPI.dll?SignIn'}, { Key: '意大利', Value: 'https://signin.ebay.it/ws/eBayISAPI.dll?SignIn'}, { Key: '法国', Value: 'https://signin.ebay.fr/ws/eBayISAPI.dll?SignIn'}, { Key: '西班牙', Value: 'https://signin.ebay.es/ws/eBayISAPI.dll?SignIn'}, {Key: '香港', Value: 'https://signin.ebay.com.hk/ws/eBayISAPI.dll'}, {Key: '新加坡',Value: 'https://signin.ebay.com.sg/ws/eBayISAPI.dll'}]
  private EbayRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    PaypalAccountId: [{required:true,message:'请选择Paypal账号',trigger:'change',type:'number'}],
    IsUseApi: [{required:true,message:'请选择API状态',trigger:'change',type:'number'}],
    InvoiceCurrency: [{required:true,message:'请选择账单币种',trigger:'change'}],
    Password: [{required:true,message:'请输入登录密码'}],
    JumpAddr: [{required:true,message:'请选择登录站点',trigger:'change',type:'array'}]
  }
  private EbayLoginPwd:string = ''
  
  private WishRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}]
  }

  private AmazonSiteDrop:PInterface.KV[] = [{Value: 'ATVPDKIKX0DER',Key: '美国'}, {Value: 'A1F83G8C2ARO7P',Key: '英国'}, {Value: 'A1PA6795UKMFR9', Key: '德国'}, {Value: 'A13V1IB3VIYZZH',Key: '法国'}, {Value: 'APJ6JRA9NG5V4',Key: '意大利'}, {Value: 'A1RKKUPIHCS9HS',Key: '西班牙'}, {Value: 'A2EUQ1WTGCTBG2', Key: '加拿大' }, { Value: 'A1VC38T7YXB528', Key: '日本'}, {Value: 'A1AM78C64UM0Y8', Key: '墨西哥'}, {Value: 'A39IBJ37TRP1C6',Key: '澳大利亚'}]
  private AmazonRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    SellerId: [{required:true,message:'请输入卖家ID'}],
    MWSAuthToken: [{required:true,message:'请输入MWS授权令牌'}],
    SiteCode: [{required:true,message:'请选择站点',trigger:'change',type:'array'}],
  }

  private ShopeeSiteDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.ShopeeSiteType)
  private ShopeeRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    ShopId: [{required:true,message:'请输入ShopId'}],
    Site: [{required:true,message:'请选择站点',trigger:'change'}],
  }

  private WalmartRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    ClientId: [{required:true,message:'请输入ClientId'}],
    ClientSecret: [{required:true,message:'请输入Client Secret'}]
  }

  private CdiscountRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    ApiLogin: [{required:true,message:'请输入Api Login'}],
    ApiPassword: [{required:true,message:'请输入Api Password'}]
  }

  private JoomRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    ClientId: [{required:true,message:'请输入ClientId'}],
    ClientSecret: [{required:true,message:'请输入Client Secret'}],
    WarehouseId: [{required:true,message:'请输入WarehouseId'}]
  }

  private FyndiqRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    MerchantId: [{required:true,message:'请输入Merchant Id'}],
    Token: [{required:true,message:'请输入Token'}]
  }

  private TophatterRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    AccessToken: [{required:true,message:'请输入Access Token'}]
  }

  private VovaRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    Token: [{required:true,message:'请输入Token'}]
  }

  private MyMallRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    Passwords: [{required:true,message:'请输入Password'}],
    ClientId: [{required:true,message:'请输入ClientId'}],
    ClientSecret: [{required:true,message:'请输入Client Secret'}]
  }

  private JumiaSiteDrop:PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.JumiaSiteType)
  private JumiaRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    UserId: [{required:true,message:'请输入UserId'}],
    APIKey: [{required:true,message:'请输入APIKey'}],
    SiteType: [{required:true,message:'请选择站点',type:'number',trigger:'change'}]
  }

  private LazadaRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}]
  }

  private GrouponRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    SupplierId: [{required:true,message:'请输入SupplierId'}],
    Token: [{required:true,message:'请输入Token'}]
  }

  private RealDeRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    ClientId: [{ required: true, message: '请输入Client Key' }],
    ClientSecret: [{ required: true, message: '请输入Secret Key' }]
  }

  private RakutenRules:any = {
    StoreName: [{ required: true, message: '请输入账号名称' }],
    Alias: [{ required: true, message: '请输入别名' }],
    Key: [{ required: true, message: '请输入Key' }],
  }

  private NeweggRules:any = {
    StoreName: [{ required: true, message: '请输入账号名称' }],
    Alias: [{ required: true, message: '请输入别名' }],
    SellerId: [{ required: true, message: '请输入Seller Id' }],
    SecretKey: [{ required: true, message: '请输入Secret Key' }]
  }

  private OtherRules:any = {
    StoreName: [{required:true,message:'请输入账号名称'}],
    Alias: [{required:true,message:'请输入账号别名'}],
    CommissionRate: [{required:true,message:'请输入佣金比例'}]
  }
}
</script>
<style lang="less"></style>