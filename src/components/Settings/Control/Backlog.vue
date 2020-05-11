<!-- 待办事务组件-->
<template>
  <div class="Control-Backlog">
    <Collapse v-model="Active">
      <Panel name="DailyStoreSales" hide-arrow class="Box-Shadow">
        <span class="P-Text-Info P-FZ-16 P-FW-Bold">待办事务</span>
        <div slot="content">
          <ul v-for="Item in UserCategory" class="categoryList P-MB-10">
            <li class="categoryName P-MB-20"><Icon type="md-notifications" size="16" />{{Item.CategoryName}}</li>
            <li class="categoryContent P-ML-20">
              <ul class="categoryItem" v-if="Item.CategoryName!=='作图需求'">
                <li v-for="X in Item.ChildNods" class="P-MB-10"><em class="P-MR-10">{{X.ItemName}}</em><a :href="X.HrefUrl"><span>{{' ' + (X.RequestData == undefined ? '' : X.RequestData) + ' '}}</span>
                  </a></li>
              </ul>
              <ul class="categoryItem" v-else>
                <li v-for="X in Item.ChildNods" class="P-MB-10">
                  <em class="P-MR-10">{{X.ItemName}}</em>
                    <a :href="X.HrefUrl">
                    <span v-if="X.HrefUrl.slice(-1) === '2'">{{' ' + (Item.ChildNods[0].RequestData == undefined ? '' : Item.ChildNods[0].RequestData.NeedProcessDemandAmount) + ' '}}</span>
                    <span v-if="X.HrefUrl.slice(-1) === '3'">{{' ' + (Item.ChildNods[0].RequestData == undefined ? '' : Item.ChildNods[0].RequestData.NeedAuditDemandAmount) + ' '}}</span>
                    <span v-if="X.HrefUrl.slice(-1) === '1'">{{' ' + (Item.ChildNods[0].RequestData == undefined ? '' : X.RequestData.NewDemandAmount) + ' '}}</span>
                  </a></li>
              </ul>
            </li>
          </ul>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';
import Interface from '@/assets/Interface/Setting';

@Component({
  name: 'Backlog',
  components: {
  }
})
export default class Backlog extends Vue {
  @Prop() UserCategory: Interface.BackLogData[]

  private Active: string = 'DailyStoreSales'
}
</script>
<style lang="less">
.Control-Backlog{
  font-size: 14px !important;
  ul{
    list-style: none;
  }
  
  & .categoryName{
    font-size: 14px;
    color: rgba(240, 164, 82, 1);
    font-weight:bold;

    &>i{
      margin-right: 4px;
    }
  }

  & .categoryItem{
    & > li{
      display: inline-block;
      width: 200px;
      margin-right: 20px;

      & em{
        font-style: normal;
        color: #2B2B2B;
      }

      & span{
        color: #F0A452;
        font-weight: bold;
      }
    }
  }
}
</style>