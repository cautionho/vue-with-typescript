<template>
  <div class="ivu-checkbox-group ivu-checkbox-default">
    <label class="P-MB-5" v-for="(Item, Index) in options" :key="Index" :style="{width: width ? `${width}px` : 'auto'}" :class="`ivu-checkbox-wrapper ivu-checkbox-group-item ivu-checkbox-default ${Model.includes(Item.Value) ? 'ivu-checkbox-wrapper-checked ' : ''} ${disabled || Item.Disabled ? 'ivu-checkbox-wrapper-disabled' : ''}`" @click.prevent="OnChecked(Item)">
      <span :class="`ivu-checkbox ${Model.includes(Item.Value) ? 'ivu-checkbox-checked' : ''} ${disabled || Item.Disabled ? 'ivu-checkbox-disabled' : ''}`">
        <span class="ivu-checkbox-inner"></span>
        <input type="checkbox" class="ivu-checkbox-input" :disabled="disabled || Item.Disabled" :value="Item.Value" />
      </span>
      <span class="P-ML-5">{{Item.Key}}</span>
    </label>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import PInterface from '@/assets/Interface/Public';

@Component({
  name: "F-CheckboxGroup"
})
export default class FCheckboxGroup extends Vue {
  @Prop() private options: (PInterface.KV & PInterface.Disabled)[] // 数据源
  @Prop({default: () => []}) private value: (string|number)[] // 双向绑定值
  @Prop() private onChange?: (Val :(number | string)[]) => void // 数据变更时回调
  @Prop({default: 0}) private width: number // 单项宽度
  @Prop({default : false}) private disabled: boolean // 是否可用

  @Watch("value")
  ValueWatcher(V: (string|number)[]): void {
    this.Model = []
    this.Model.push(...V);
  }

  private mounted(): void {
    this.Model.push(...this.value);
  }

  private OnChecked(Val: PInterface.KV & PInterface.Disabled): void {
    if(this.disabled || Val.Disabled){
      return
    }
    const Idx = this.Model.indexOf(Val.Value)
    Idx < 0 ? this.Model.push(Val.Value) : this.Model.splice(Idx, 1)
    this.$emit('input', this.Model);
    this.onChange ? this.onChange(this.Model) : null;
  }

  private Model: (string|number)[] = []
}
</script>
<style lang="less" scoped>
.ivu-checkbox-wrapper + span, .ivu-checkbox + span{
  user-select: none;
}
</style>