<template>
  <div class="P-Inline-Block">
    <Col>
    <Button type="primary" class="P-MR-10" @click="EmitChange(false, 1)">启用</Button>
    <Button type="error" class="" @click="EmitChange(false, 0)">禁用</Button>
    </Col>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import PInterface from '../../assets/Interface/Public';
import Interface from '../../assets/Interface/Setting';

@Component({
  name: 'ChangeStatus'
})
export default class ChangeStatus extends Vue {
  //Type 1-批量启用 0-批量禁用
  @Emit() EmitChange(Res: boolean, Type?: number): void {}
  

  //打开确认框  
  private TriggerModal(SelectedData:PInterface.PostChange[], ChangeStatusObj:PInterface.ChangeStatus): void{
    if (SelectedData.length < 1) {
      this.$UI.Tips.Floating('warning', `请选择${ChangeStatusObj.TipsKey}进行操作`);
      return;
    }else{
      this.OperaData = SelectedData.filter( (Item: PInterface.PostChange):boolean => Item.IsEnable != ChangeStatusObj.ToTarget)  //过滤已经是当前操作状态的数据

      if(this.OperaData.length < 1){
        this.$UI.Tips.Floating('warning', `当前选中${ChangeStatusObj.TipsKey}均为${ChangeStatusObj.ToTarget? '启用': '禁用'}状态`);
        return;
      }
      this.ConfirmChangeStatus(ChangeStatusObj)
    }
  }

  //确认提交请求
  private ConfirmChangeStatus(ChangeStatusObj:PInterface.ChangeStatus) :void{
    this.$UI.Tips.Modal({
    	Type:'confirm',
    	Content: `是否将${ChangeStatusObj.TipsKey}状态变更为${ChangeStatusObj.ToTarget ? '启用' : '禁用'}`,
    	Enter:false,
    	Callback:(Bool:boolean):void=>{
    		if(Bool){
    			this.PostChangeStatus(ChangeStatusObj.ToTarget, ChangeStatusObj);
    		}
    	}
    })
  }
  
  //提交请求
  private PostChangeStatus(Bool: boolean, ChangeStatusObj:PInterface.ChangeStatus){
    this.$UI.Loading.Show();
    let Ids:number[] = this.OperaData.map( (item: PInterface.PostChange):number => { 
      return ChangeStatusObj.IdKey === 'WarehouseIds' ? Number(item.WarehouseId) : Number(item.Id)
    })

    
    let PostData: PInterface.PostChange = {
      [ChangeStatusObj.IdKey]: Ids,
      [ChangeStatusObj.StatusKey]: ChangeStatusObj.ToTarget
    }

    this.$Request.Post({
			Server: ChangeStatusObj.Server,
			Api: {
				Address: ChangeStatusObj.Api,
				Login: true
			},
			Data: PostData,
			Callback: (Res: PInterface.Res): void => {
				if (Res.IsSuccess) {
          this.$UI.Tips.Floating('success', `${Bool ? '启用' : '禁用'}${ChangeStatusObj.TipsKey}成功`);
          this.$set(this, 'OperaData', [])
          this.EmitChange(true)
				} else {
          this.$Request.Error(Res);
				  this.$UI.Loading.Hide();
				}
			}
		})
  }

  private OperaData:PInterface.PostChange[] = [];
}

</script>
<style lang="less"></style>