import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import Play from '@/components/Play';
import BootstrapVue from 'bootstrap-vue';
import Tutorial from '@/components/Tutorial';
import Leaderboard from '@/components/Leaderboard';
import Profile from '@/components/Profile';
import About from '@/components/About';
import Consent from '@/components/Consent';
import Project from '@/components/Project';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';

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
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/play/:task',
      name: 'Play',
      props: true,
      component: Play,
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
      path: '/project/:task',
      name: 'Project',
      props: true,
      component: Project,
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      props: true,
      component: Profile,
    },
    {
      path: '/consent',
      name: 'Consent',
      props: true,
      component: Consent,
    },
  ],
});
