<template>
  <div class="ivu-radio-group ivu-radio-group-default ivu-radio-default">
    <label v-for="(Item, Index) in options" :key="Index" :style="{width: width ? `${width}px` : 'auto'}" :class="`P-MR-10 ivu-radio-wrapper ivu-radio-group-item ivu-radio-default ${Item.Value === Model ? 'ivu-radio-wrapper-checked' :''} ${disabled || Item.Disabled ? 'ivu-radio-wrapper-disabled' : ''}`" @click="OnChecked(Item)" >
      <span :class="`ivu-radio ${Item.Value === Model ? 'ivu-radio-checked' : ''} ${disabled || Item.Disabled ? 'ivu-radio-disabled' : ''}`">
        <span class="ivu-radio-inner"></span>
        <input type="radio" :disabled="disabled || Item.Disabled" class="ivu-radio-input"/>
      </span>
      <span>{{Item.Key}}</span>
    </label>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import PInterface from "@/assets/Interface/Public";

@Component({
  name: "F-RadioGroup"
})
export default class FRadioGroup extends Vue {
  @Prop({ default: () => [] }) private options: (PInterface.KV & PInterface.Disabled)[]; // 数据源
  @Prop() private value: number | string; // 双向绑定值
  @Prop() private onChange?: (Val: number | string) => void; // 数据变更回调
  @Prop({default: 0}) private width: number // 单项宽度
  @Prop({default: false}) private disabled: boolean

  @Watch("value")
  ValueWatcher(V: number | string): void {
    this.Model = V;
  }

  private mounted(): void {
    this.Model = this.value;
  }

  private OnChecked(V: PInterface.KV & PInterface.Disabled): void {
    if(this.disabled || V.Disabled){
      return
    }
    this.Model = V.Value;
    this.$emit('input', this.Model)
    this.onChange ? this.onChange(this.Model) : null
  }

  private Model: number | string = ''
}
</script>
<style lang="less" scoped>
</style>