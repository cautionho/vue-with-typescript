<template>
  <Row span="24">
    <Search ref="SearchStore" :Platform="Platform" :Pager="Pager" @emit-list="EmitList" @emit-pager-change="EmitPagerChange" @emit-paypal-drop="EmitPaypalDrop"></Search>
    <Modify v-if="CalculatePower(1)" ref="ModifyStore" :Powers="Powers" :Platform="Platform" :PaypalDrop="PaypalDrop" @emit-modify="EmitModify"></Modify>
    <EnableApi ref="EnableApi" v-if="CalculatePower(2)" :Platform="Platform" :SelectedData="SelectedData" @emit-modify="EmitModify"></EnableApi>
    <EnableStore ref="EnableStore" v-if="CalculatePower(3)" :Platform="Platform" :SelectedData="SelectedData" @emit-modify="EmitModify"></EnableStore>
    <List ref="StoreList" :Platform="Platform" :Powers="Powers" :List="List" @emit-pager-change="EmitPagerChange" @emit-list-selected="EmitListSelected" @emit-list-operations="EmitListOperations"></List>
    <RedisDB ref="RedisDB" @emit-modify="EmitModify"></RedisDB>
    <Location ref="Location" @emit-modify="EmitModify"></Location>
  </Row>
</template>
<script lang="ts" src="./Store.ts"></script>
<style lang="less" scoped></style>