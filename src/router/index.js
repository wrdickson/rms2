import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/logoff/',
    name: 'logoff',
    component: () => import(/* webpackChunkName: "logoff" */ '../views/Logoff.vue')
  },
  {
    path: '/res-table/',
    name: 'res-table',
    component: () => import(/* webpackChunkName: "res-view" */ '../views/Res-Table.vue')
  },
  {
    path: '/res-view/',
    name: 'res-view',
    component: () => import(/* webpackChunkName: "res-view" */ '../views/Res-View.vue')
  },
  {
    path: '/ag-grid/',
    name: 'ag-grid',
    component: () => import(/* webpackChunkName: "res-view" */ '../views/Ag-Grid.vue')
  },
  {
    path: '/dhtmlx/',
    name: 'dhtmlx',
    component: () => import(/* webpackChunkName: "res-view" */ '../views/dhcmlxGrid.vue')
  },
  {
    path: '/resview/',
    name: 'resview',
    component: () => import(/* webpackChunkName: "res-view" */ '../views/ResView.vue')
  },
  {
    path: '/rootspaceedit/',
    name: 'rootspaceedit',
    component: () => import(/* webpackChunkName: "res-view" */ '../views/rootSpaceEdit.vue')
  },
  {
    path: '/tapechart/',
    name: 'tapechart',
    component: () => import(/* webpackChunkName: "tape-chart" */ '../views/TapeChart.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
