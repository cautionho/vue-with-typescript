class Pattern {
	public Mobile: RegExp = /^1[\d]{10}$/ // 手机号码
	public Tel: RegExp = /^1[\d]{10}$/ // 固定电话
	public Email: RegExp = /^[\w.]+@[\w.]+.[\w.]+$/ // 邮箱（可输入中文）
	public Chinese: RegExp = /[\u4e00-\u9fa5]/ // 中文

	public Int: RegExp = /^-?[0-9]{1,}$/ // 整数(包括正负)
  public PositiveInt: RegExp = /^\+?[0-9]{1,}$/ // 正整数(包括0)
  public PositiveNotZeroInt: RegExp = /^\+?[1-9]{1}[0-9]{0,}$/ // 正整数(不包括0)
  public Positive: RegExp = /^([+]?[0-9]+[.]?[0-9]*)$/ // 正数(包括0)
  public PositiveNotZero = /^([+]{0,1}[1-9]{1,}[\d]*[.]{0,1}[\d]{0,})$/ // 正数（不包括0） 

	public LocationCode: RegExp = /^((1[0-5])|[1-9])(\-)((0[1-9])|[1-9][\d]{1,2})(\-)([A-Z])(\-)(0[1-9]|[1-9][0-9]|1[\d]{2}|200)$/ // 货架号
}

export default Pattern
