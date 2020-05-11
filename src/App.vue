<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class App extends Vue {

}

</script>
<style lang="less">
body,
html {
	height: 100vh;
	overflow: hidden;
}

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	height: 100vh;
	overflow: auto;
}

</style>
