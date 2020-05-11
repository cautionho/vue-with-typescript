<template>
  <ul class="Tree-Root" ref="Tree">
    <TreeItem v-for="(Item, Index) in TreeData" :key="Index" :Item="Item" :ToggleTreeNode="ToggleTreeNode" :ClickFunc="ClickFunc" :HandleTreeNode="HandleTreeNode"></TreeItem>
  </ul>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Interface from '@/assets/Interface/Tree';

@Component({
  name: 'Tree',
  components:{
    TreeItem: {
      name : 'TreeItem',
      props: {
        Item: {
          type: Object,
          twoWay: true
        },
        ToggleTreeNode: {
          type: Function
        },
        ClickFunc: {
          type: Function
        },
        HandleTreeNode: {
          type: Function
        }
      },
      template: `<li class="Tree-Node-Item">
        <Icon class="P-Pointer" @click="ToggleTreeNode(Item, $event)" :type="'ios-folder' + (Item.IsExpand ? '-open': '-outline')" v-if="Item.Children && Item.Children.length" size="14" color="#39699A"></Icon>
        <Icon v-else type="ios-paper-outline" size="14" color="#39699A"></Icon>
        <span :class="'Tree-Node-Title' + (Item.IsActive ? ' Tree-Active' : '')" @click="ClickFunc(Item, $event)">{{Item.Title || Item.Name}}
          <Icon v-if="Item.IsHandle" type="md-create" @click="HandleTreeNode('modify', Item)"></Icon>
          <Icon v-if="Item.IsHandle" type="md-trash" @click="HandleTreeNode('delete', Item)"></Icon>
        </span>
        <ul :class="'Tree-Node ' + (Item.IsExpand ? 'Tree-Expand' : 'Tree-None')">
          <TreeItem v-for="(Itm, Idx) in Item.Children" :key="Idx" :Item="Itm" :ToggleTreeNode="ToggleTreeNode" :ClickFunc="ClickFunc" :HandleTreeNode="HandleTreeNode"></TreeItem>
        </ul>
      </li>`
    }
  }
})

export default class Tree extends Vue {
  @Prop(Array) Data: Interface.TreeNode[]
  @Prop(Function) ClickFn:(Node: Interface.TreeNode)=>void
  @Prop(Function) TreeNodeFunc:(T:string, N: Interface.TreeNode)=>void

  get TreeData(){
    return this.SetExpand(this.Data);
  }

  private SetExpand(Tree: Interface.TreeNode[]): Interface.TreeNode[] {
    this.$nextTick(()=>{
      let Doms: any = document.getElementsByClassName('Tree-Expand');
      for(let Item of Doms){
        this.SetExpandClass(Item);
      }
    })
    return Tree
  }

  private SetExpandClass(Dom: any): void {
    if(!Dom.classList.value.includes('Tree-Expand')){
      Dom.classList.add('Tree-Expand');
    }
    const Folder:any = Dom.parentNode.getElementsByClassName('ivu-icon-ios-folder-outline')
    if(Folder.length){
      for(let Item of Folder){
        Item.classList.value = Item.classList.value.replace('ivu-icon-ios-folder-outline', 'ivu-icon-ios-folder-open')
      }
    }
    if(Dom.parentNode.parentNode.classList.value.includes('Tree-Node')){
      this.SetExpandClass(Dom.parentNode.parentNode);
    }
  }

  private ToggleTreeNode(Node: Interface.TreeNode, Evt: any): void {
    const IsOpen = Evt.target.classList.value.includes('open')
    Evt.target.classList.value = Evt.target.classList.value.replace(IsOpen ? 'ivu-icon-ios-folder-open' : 'ivu-icon-ios-folder-outline', IsOpen ? 'ivu-icon-ios-folder-outline' : 'ivu-icon-ios-folder-open')
    Node.IsExpand = !IsOpen;
    Evt.target.nextElementSibling.nextElementSibling.classList = `Tree-Node ${(Node.IsExpand ? 'Tree-Expand' : 'Tree-None')}`;
  }

  private ClickFunc(Node: Interface.TreeNode, Evt: any): void {
    if(!Evt.target.classList.value.includes('Tree-Node-Title')){
      return;
    }
    const Flag = !Evt.currentTarget.classList.value.includes('Tree-Active'), N = Array.from(document.getElementsByClassName('Tree-Active'))
    for(let Item of N){
      Item.classList.value = "Tree-Node-Title"
    }
    Node.IsActive = Flag
    Evt.currentTarget.classList = Node.IsActive ? 'Tree-Node-Title Tree-Active' : 'Tree-Node-Title'

    if(this.ClickFn){
      this.ClickFn(Node);
    }
  }

  private HandleTreeNode(T: string, N: Interface.TreeNode): void {
    if(this.TreeNodeFunc){
      this.TreeNodeFunc(T, N);
      return;
    }
  }

  private GetExpands(Tree: Interface.TreeNode[]): Promise<Interface.TreeNode[]> {
    let N: Interface.TreeNode[] = []
    return new Promise((Reslove:(V: Interface.TreeNode[])=>void) => {
      GetExpand(Tree)
      function GetExpand(Node: Interface.TreeNode[]){
        for(let item of Node){
          if(item.IsExpand){
            N.push(item);
          }
          if(item.Children.length){
            GetExpand(item.Children)
          }
        }
      }
      Reslove(N)
    })
  }

  private GetExpandNodes(): Promise<Interface.TreeNode[]> {
    return this.GetExpands(this.TreeData)
  }
}
</script>

<style lang="less">
@import '../../assets/Theme/Color';

.Tree-Root{
  width: 100%;

  & ul.Tree-None {
    height: 0px;
    overflow: hidden;
  }

  & ul.Tree-Node{
    transition: all .3s ease;
    margin-left: 16px;
  }

  & ul.Tree-Expand{
    height: auto;
  }

  & li {
    list-style: none;

    & .Tree-Node-Title{
      cursor: pointer;
      padding: 2px;
      border-radius: 2px;
      transition: all .3s ease;
      width: calc(100% - 20px);
      display: inline-block;

      &.Tree-Active{
        background-color: @primary-color;
        color: #fff;
      }

      &:not(.Tree-Active):hover{
        color: @primary-color + 20;
      }

      &>.ivu-icon {
        display: none;

        &:hover{
          color: red;
        }
      }

      &:hover{
        &>.ivu-icon {
          display: inline-block;
        }
      }
    }
  }
}

</style>