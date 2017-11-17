import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import Play from '@/components/Play';
import Coins from '@/components/Coins';
import BootstrapVue from 'bootstrap-vue';
import Tutorial from '@/components/Tutorial';
import Leaderboard from '@/components/Leaderboard';
import Profile from '@/components/Profile';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing,
    },
    {
      path: '/play/:task',
      name: 'Play',
      props: true,
      component: Play,
    },
    {
      path: '/coins/:id',
      name: 'Coins',
      component: Coins,
    },
    {
      path: '/tutorial/:task',
      name: 'Tutorial',
      props: true,
      component: Tutorial,
    },
    {
      path: '/leaderboard/:task',
      name: 'Leaderboard',
      props: true,
      component: Leaderboard,
    },
    {
      path: '/profile',
      name: 'Profile',
      props: true,
      component: Profile,
    },
  ],
});
