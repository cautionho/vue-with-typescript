<template>
  <div :ref="`Sel-${Ref}`" :class="`Fr-Select ivu-select ivu-select-${IsMulti ? 'multiple' : 'single'} ${IsDisabled() ? 'ivu-select-disabled' : ''} ivu-select-default`" @click.stop="FocusSelect" >
    <div tabindex="-1" class="ivu-select-selection">
      <input type="hidden" value />
      <!-- 多选 -->
      <Row class="P-Inline-Block" v-if="IsMulti && Key.length">
        <div class="ivu-tag ivu-tag-checked" v-for="(Item, Index) in Key" :key="Index">
          <span class="ivu-tag-text">{{Item}}</span> <i class="ivu-icon ivu-icon-ios-close" @click.stop="DelVal(Index)"></i>
        </div>
      </Row>
      <!-- 兼容多选 多选时输入框宽度需改变，有值时，placeholder为空；多选时，不需要展示清空图标 -->
      <div :class="IsMulti ? 'P-Inline-Block' : ''">
        <input :ref="`Sel-Ipt-${Ref}`" type="text" :style="{width: IsMulti && Key.length ? '20px' : '100%'}" :disabled="IsDisabled()" :placeholder="IsMulti && Key.length ? '' : placeholder" autocomplete="off" spellcheck="false" class="ivu-select-input" :value="IsMulti ? MultiKey : Key" @blur="BlurSelect"  @keyup="FilterSelect" />
        <i v-if="IsHiddenDropdown" class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
        <i v-else class="ivu-icon ivu-icon-ios-arrow-up ivu-select-arrow"></i>
        <i v-if="IsClear() && !IsMulti && !IsDisabled()" class="ivu-icon ivu-icon-ios-close-circle ivu-select-arrow" @click.stop="ClearVal"></i>
      </div>
    </div>
    <div :ref="Ref" class="Fr-Select-Dropdown ivu-select-dropdown" :style="{zIndex: 1299, height: IsHiddenDropdown ? '0px' : Options.length ? (Options.length * 30 > 190 ? '200px' : `${Options.length * 30 + 12}px`) : '30px', overflow: (Options.length * 30 > 190 ? 'auto' : 'hidden'), opacity: IsHiddenDropdown ? 0 : 1}">
      <ul v-if="!Options.length" class="ivu-select-not-found">
        <li>无匹配数据</li>
      </ul>
      <ul v-else class="ivu-select-dropdown-list">
        <li :class="`ivu-select-item ${IsSelectedItem(Item)}`"  v-for="(Item, Index) in Options"  :key="Index"  @click.stop="OnSelected(Item[optionValKey || 'Value'])" >{{Item[optionKey || 'Key']}}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "Select"
})
export default class Select extends Vue {
  @Prop({default: '请选择…'}) private placeholder: string; // 占位提示文字
  @Prop() private value?: string | number | (string | number)[]; // 双向绑定值
  @Prop() private options: any[]; // 数据源
  @Prop() private onChange?: (Val: (string | number) | (string|number)[]) => void; // 变更值时调用的方法
  @Prop() private optionKey?: string; // key值属性名
  @Prop() private optionValKey?: string; // value值属性名
  @Prop() private multiple?: boolean; // 是否多选
  @Prop() private transfer?: boolean; // 父级是否含有transform
  @Prop({default: false}) private disabled: boolean | string | undefined; // 是否禁用
  @Prop() private default?: string | number | (string|number)[] // 默认值
  @Prop() private noclearable: boolean | string | undefined // 是否无清空功能

  @Watch("value")
  ModelWatcher(Val: string | number | (string | number)[]): void {
    this.SetVal(Val);
  }

  @Watch("options")
  OptionsWatcher(Val: any[]): void {
    this.$set(this, "Options", Val);
    this.SetVal(this.Val);
  }

  private mounted(): void {
    this.SetDefault();
  }

  /* 调整弹出位置 */
  private SetDropdownPosition(): void {
    const Dropdown = (this as any).$refs[this.Ref],
      Offset = (this as any).$refs[`Sel-${this.Ref}`].getBoundingClientRect();
    Dropdown.style.width = `${(this as any).$refs[`Sel-${this.Ref}`].offsetWidth}px`;
    /* 非transfer 父级无transform属性 */
    if (typeof this.transfer === "undefined"){
      Dropdown.style.left = `${Offset.left}px`;
      Dropdown.style.top = `${Offset.top + (Offset.height || 32)}px`;
    }
  }

  private SetDefault(): void {
    this.Options = this.options;
    const Type = typeof(this.value);
    this.DefaultVal = this.default || ( Type === 'string' ? '' : Type === 'number' ? 0 : [])

    if (typeof this.multiple !== "undefined") {
      this.IsMulti = true;
      this.Key = [];
      window.removeEventListener('click', this.HandleWindowClick)
      window.addEventListener('click', this.HandleWindowClick, false)
    }
    this.SetVal(this.value)
  }

  private HandleWindowClick(Evt: any): void {
    const Cls: string[] = Evt.target.classList.value
    if(Cls.includes('ivu-select-input') || Cls.includes('ivu-select-selection')){
      return
    }else{
      this.IsHiddenDropdown = true
    }
  }

  private IsSelectedItem(Item: any): string {
    if(this.IsMulti){
      return (this.Val as (number | string)[]).includes(Item[this.optionValKey || "Value"]) ? 'ivu-select-item-selected' : ''
    }else{
      return Item[this.optionValKey || "Value"] === this.Val ? 'ivu-select-item-selected' : ''
    }
  }

  private FocusSelect(Evt: any): void {
    if(this.IsDisabled()) return;
    /* 防止搜索过数据后，数据展示异常 */
    if(this.Options.length !== this.options.length){
      this.$set(this, 'Options', this.options);
    }
    // const ClsV = (this as any).$refs[this.Ref].classList.value, IsPosition = ClsV.includes("Hidden");
    // if(IsPosition){
    //   this.IsHiddenDropdown = false;
    //   this.SetDropdownPosition()
    // }
    this.IsHiddenDropdown = false;
      this.SetDropdownPosition()
    if(this.IsMulti){
      (this as any).$refs[`Sel-Ipt-${this.Ref}`].focus();
    }
  }

  private BlurSelect(Evt: any): void {
    if(this.IsMulti && Evt.target.classList.value.includes('ivu-select-input')) return;
    this.SetVal(this.Val)
    setTimeout(() => {
      this.IsHiddenDropdown = true;
    }, 200);
  }

  private FilterSelect(Evt: any): void {
    clearTimeout(this.KeyupTimer);
    this.KeyupTimer = setTimeout(() => {
      const Key = Evt.target.value;
      this.Options = this.options.filter(Item =>
        String(Item[this.optionKey || "Key"]).toLowerCase().includes(Key.toLowerCase())
      );
      this.IsMulti ? this.MultiKey = Key : this.Key = Key;
    }, 300);
  }

  private OnSelected(Val: number | string = ""): void {
    if(this.IsMulti){
      const V: (number | string)[] = this.Val as (number | string)[], Idx = (this.Val as (number | string)[]).indexOf(Val);
      Idx < 0 ? V.push(Val) : V.splice(Idx, 1)
      this.SetVal(V)
      this.MultiKey = ''
      this.$nextTick(()=>{
        this.SetDropdownPosition()
      })
    }else{
      this.SetVal(Val)
      this.IsHiddenDropdown = true
    }
    this.$emit("input", this.Val);
    this.Options = this.options;
    this.TriggerOnChange(this.Val);
  }

  /* 1.有可能为布尔  2.有可能为空字符串  3.有可能为undefined */
  private IsDisabled(): boolean {
    return this.disabled === "" ? true : this.disabled === undefined ? false : this.disabled as boolean
  }

  private IsClear(): boolean {
    return this.noclearable === undefined && (this.Val !== this.DefaultVal)
  }

  private ClearVal(): void {
    this.SetVal(this.DefaultVal);
    this.$emit("input", this.DefaultVal);
    this.TriggerOnChange(this.DefaultVal);
  }

  private DelVal(Idx: number): void {
    (this.Val as (number | string)[]).splice(Idx, 1);
    (this.Key as string[]).splice(Idx, 1)
    this.$emit('input', this.Val)
    this.$nextTick(()=>{
      this.SetDropdownPosition()
    })
  }

  private clearSingleSelect(): void {
    this.SetVal(this.DefaultVal);
    this.$emit("input", this.DefaultVal);
  }

  private SetVal(Val: (number | string) | (number | string)[] = ""): void {
    this.Val = Val;
    const F = this.options.filter(
      Item => this.IsMulti ? (this.Val as (number|string)[]).includes(Item[this.optionValKey || "Value"]) : Item[this.optionValKey || "Value"] === this.Val
    );
    if(this.IsMulti){
      this.Key = F.length ? F.map(Item => Item[this.optionKey || "Key"]) : [];
    }else{
      this.Key = F.length ? F[0][this.optionKey || "Key"] : "";
    }
  }

  private TriggerOnChange(Val: (number | string) | (number | string)[] = ""): void {
    this.onChange ? this.onChange(Val) : null;
  }

  private IsHiddenDropdown: boolean = true; // 是否展开选择项
  private Ref: number = +new Date(); // 时间戳
  private Options: any[] = []; // 下拉项数据
  private DefaultVal: string | number | (number | string)[] = "" // 默认值
  private Val: (number | string) | (number | string)[] = ""; // 当前值
  private Key: string | string[] = ""; // 当前值展示内容
  private MultiKey: string = '' // 多选时，过渡value（多选时不需要展示value）
  private IsMulti: boolean = false; // 是否多选框

  private KeyupTimer: any = null;
}
</script>
<style lang="less" scoped>
.Hidden {
  // display: none;
  // height: 0;
}

.Fr-Select {
  position: relative;
  vertical-align: top;
}

.Fr-Select-Dropdown {
  position: fixed !important;
  transition: all .1s;
}

.ivu-select-item-selected {
  background-color: #f3f3f3;
}

.ivu-select-multiple:not(.multipe) > .ivu-select-selection{
  height: auto;
  max-height: unset;
}
</style>