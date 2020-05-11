<template>
  <Select :placeholder="placeholder" :multiple="multiple" v-model="Model" @on-change="ChangeModel">
    <OptionGroup v-for="(Item,Index) in options" :label="Item[optionTitleKey || 'Title']" :key="Index">
      <Option v-for="(Val,Idx) in Item[optionChildKey || 'ChildNodes']" :value="Val[optionValKey || 'Value']" :key="Idx">{{ Val[optionKey || 'Key'] }}</Option>
    </OptionGroup>
  </Select>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'F-SelectGroup',
  components: {
    Select: () => import('view-design/src/components/select/select.vue')
  }
})

export default class FSelectGroup extends Vue {
  @Prop() private options: any[] // 数据源
  @Prop({default: '请选择'}) private placeholder: string // 占位提示文字
  @Prop() optionTitleKey?: string // 组标题属性名
  @Prop() optionChildKey?: string // 子数据属性名
  @Prop() optionValKey?: string // value值属性名
  @Prop() optionKey?: string // key值属性名
  @Prop({default: false}) private multiple: boolean // 是否多选，默认为false
  @Prop() private value: any // 双向绑定值
  @Prop() private onChange?: (Val: any) => void // 数据变更时回调

  @Watch('value')
  ValueWatcher(Val: any): void {
    this.Model = Val
  }

  private mounted(): void {
    this.Model = this.value
  }

  private ChangeModel(Val: any): void {
    this.$emit('input', this.Model)
    this.onChange ? this.onChange(this.Model) : null;
  }

  private Model: any = ""
}

</script>
<style lang="less" scoped>

</style>