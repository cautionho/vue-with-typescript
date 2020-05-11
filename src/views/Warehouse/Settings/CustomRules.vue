<template>
<Row>
  <Col span="24">
    <Tabs :value="CustomRulesTabs" name="CustomRulesTabs" @on-click="ChangeTabs" :animated="false">
      <TabPane label="匹配仓库" name="Warehouse" tab="CustomRulesTabs">
        <CustomRulesList ref="Warehouse" :Type="1" :WarehouseDrop="WarehouseDrop" :Powers="Powers" @emit-operate="EmitOperate"></CustomRulesList>
      </TabPane>
      <TabPane label="匹配物流" name="Logistics" tab="CustomRulesTabs">
        <CustomRulesList ref="Logistics" :Type="2" :Powers="Powers" @emit-operate="EmitOperate"></CustomRulesList>
      </TabPane>
      <TabPane label="人工审核" name="ManMade" tab="CustomRulesTabs">
        <CustomRulesList ref="ManMade" :Type="3" :Powers="Powers" @emit-operate="EmitOperate"></CustomRulesList>
      </TabPane>
    </Tabs>
  </Col>
  <ModifyCustomRules ref="ModifyCustomRules" :Type="CustomRulesTabs" :WarehouseDrop="WarehouseDrop" :MethodDrop="MethodDrop" :Conditions="Conditions" @emit-custom-rules="EmitCustomRules"></ModifyCustomRules>
  <Sort ref="Sort" @emit-custom-rules="EmitCustomRules"></Sort>
</Row>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Warehouse';

@Component({
  name: 'CustomRules',
  components: {
    CustomRulesList:() => import('@/components/Warehouse/CustomRules/CustomRulesList.vue'),
    ModifyCustomRules: () => import('@/components/Warehouse/CustomRules/ModifyCustomRules.vue'),
    Sort: () => import('@/components/Warehouse/CustomRules/Sort.vue')
  }
})

export default class CustomRules extends Vue {
  private async mounted(): Promise<void> {
    this.$set(this, 'Powers', this.$Utils.GetUserResource.call(this, ['MatchRuleCreate', 'MatchRuleModify', 'MatchRuleSort', 'MatchRuleChangeStatus']))
    this.$set(this,'WarehouseDrop',await this.GetDropList<boolean,PInterface.KV[]>(this.$Server.Settings, this.$Api.GetWarehouseDropList, true))
    if(this.Powers.MethodDrop || this.Powers.MatchRuleModify){
      this.$set(this,'MethodDrop',await this.GetDropList<number,PInterface.IdName[]>(this.$Server.Logistics, this.$Api.ChannelDropList, 0))
    }
    this.$nextTick(()=>{
      (this as any).$refs[this.CustomRulesTabs] ? (this as any).$refs[this.CustomRulesTabs].TriggerChange() : null
    })
  }

  private ChangeTabs(N:string): void {
    this.$set(this, 'CustomRulesTabs', N);
    (this as any).$refs.Warehouse.CloseSearch();
    (this as any).$refs.Logistics.CloseSearch();
    (this as any).$refs.ManMade.CloseSearch();
    (this as any).$refs[N].TriggerChange();
  }

  private GetDropList<T,S>(Server:string, Api:string, Data: T): Promise<S | []> {
    return new Promise((Resolve:(Val:S | [])=>void) => {
      this.$Request.Post({
        Server: Server,
        Api: {
          Address: Api
        },
        Data: Data,
        Callback:(Res:PInterface.Res):void => {
          if(Res.IsSuccess){
            Resolve(Res.Data.DropList);
          }else{
            Resolve([])
            this.$Request.Error(Res)
          }
        }
      })
    })
  }

  private GetConditions(): Promise<boolean> {
    return new Promise((Resolve:(Val:boolean)=>void)=>{
      if(!this.Conditions.length){
        this.$UI.Loading.Show()
        this.$Request.Post({
          Server: this.$Server.Warehouse,
          Api: {
            Address: this.$Api.BaseDataConditions
          },
          Data: "",
          Callback: (Res: PInterface.Res): void => {
            this.$UI.Loading.Hide()
            if(Res.IsSuccess) {
              this.Conditions.push(...Res.Data.Data)
            }else {
              this.$Request.Error(Res);
            }
            Resolve(Res.IsSuccess)
          }
        })
      }else {
        Resolve(true)
      }
    })
    
  }

  private async EmitOperate(Type:number, Data:Interface.CustomRulesList[]): Promise<void> {
    switch(Type) {
      case 1:
        await this.GetConditions();
        (this as any).$refs.ModifyCustomRules.Trigger();
        break;
      case 2:
        await this.GetConditions();
        (this as any).$refs.ModifyCustomRules.Trigger(Data[0]);
        break;
      case 3:
        (this as any).$refs.Sort.Trigger(Data[0]);
        break;
    }
  }

  private EmitCustomRules():void {
    (this as any).$refs[this.CustomRulesTabs].GetList();
  }

  private CustomRulesTabs:string = 'Warehouse'
  private Powers: PInterface.Power = {}
  private Conditions: Interface.CustomRulesConditionList[] = []
  private WarehouseDrop: PInterface.KV[] = []
  private MethodDrop: PInterface.KV[] = []
}
</script>
<style lang="less"></style>