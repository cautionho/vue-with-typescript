import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [{
	path: '/',
	name: 'Login',
	component: () => import('../views/Login.vue'),
}, {
	path: '/Index',
	name: 'Index',
	component: () => import('../views/Index.vue'),
},{
	path: '/Control',
	name: 'Control',
	component: () => import('../views/Settings/Control.vue'),
}, {
	path: '/ModifyFile',
	name: 'ModifyFile',
	component: () => import('../components/Admin/ModifyFile.vue'),
}, {
	path: '/ViewFile',
	name: 'ViewFile',
	component: () => import('../components/Admin/ViewFile.vue'),
}];

const router = new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
