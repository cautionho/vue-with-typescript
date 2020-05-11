<template>
  <Row>
    <Tree ref="PlatformStoreTree" :data="PlatformStoreTree" show-checkbox></Tree>
  </Row>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import PInterface from '@/assets/Interface/Public';

@Component

export default class PlatformStoreTree extends Vue {
  private Trigger(V: string): void {
    this.$UI.Loading.Show()
    setTimeout(()=>{
      if(!this.PlatformStoreTree.length){
        this.GetStoreTree(V)
      }else {
        this.SetDefaultSelected(V);
      }
    },100);
  }

  private async GetStoreTree(V: string): Promise<void> {
    this.PlatformDrop.map((Item: PInterface.KV, Index:number) => {
      this.PlatformStoreTree.push({
        title: Item.Key,
        value: Item.Value,
        index: Index,
        children: [],
        loading: false,
        disableCheckbox: true
      })
    })

    for(let Item of this.PlatformStoreTree){
      this.$set(Item, 'children', await this.GetStoreDrops(Item.value))
    }
    this.SetDefaultSelected(V)
    this.$UI.Loading.Hide();
  }

  private GetStoreDrops(E: number): Promise<PInterface.Tree[] | []> {
    return new Promise((Resolve:(V: PInterface.Tree[] | []) => void) => {
      if(this.$Api.Sales[String(E)].StoreDrop){
        this.$Request.Post({
          Server: this.$Server.Sales,
          Api: {
            Address: this.$Api.Sales[String(E)].StoreDrop,
          },
          Data: true,
          Callback: (Res: PInterface.Res): void => {
            if(Res.IsSuccess){
              let Drops: PInterface.Tree[] = []
              for(let Item of Res.Data.DropList){
                Drops.push({
                  title: Item.Key,
                  value: Item.Value,
                  platform: E
                })
              }
              Resolve(Drops);
            }else{
              Resolve([])
              this.$Request.Error(Res);
            }
          }
        })
      }else {
        Resolve([])
      }
    })
  }

  private SetDefaultSelected(V: string): void {
    const Tree = JSON.parse(JSON.stringify(this.PlatformStoreTree));
    const SelcVal = V.split(',') || [];
    for(let P of Tree){
      P.expand = false;
      P.checked = false;
      P.indeterminate = false;
      for(let S of P.children){
        if(SelcVal.some((Itm:string ):boolean => { return (Itm.split('-')[1] == S.value && Itm.split('-')[0] == P.value) })){
          P.expand = true;
          S.checked = true;
        }else{
          S.checked = false;
        }
      }
    }

    this.$set(this, 'PlatformStoreTree', Tree);
    (this as any).$refs.PlatformStoreTree.rebuildTree();
    this.$nextTick(()=>{
      this.$UI.Loading.Hide();
    })
  }

  private GetSelected(): void {
    return (this as any).$refs.PlatformStoreTree.getCheckedNodes();
  }

  private PlatformStoreTree: any[] = []
  private PlatformDrop: PInterface.KV[] = this.$Utils.GetEnumArr(this.$Enums.Sales.Platform);
  
}
</script>
<style lang="less"></style>