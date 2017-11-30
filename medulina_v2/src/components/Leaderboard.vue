<template>
  <div id="leaderboard">
    <b-container class="mt-5">
      <div class="jumbotron">
        <h1>
          <img src="../assets/noun_155903_cc.svg" style="width:2em;"/>

          <b-dropdown id="ddown1" :text="taskInfo.name" class="m-md-2" size="lg" variant="light">
            <b-dropdown-item v-for="task in all_tasks"
              v-if="task.name != taskInfo.name"
              :to="'/leaderboard/'+task.task">
              {{task.name}}
            </b-dropdown-item>
          </b-dropdown>

        </h1>
        <p class="lead muted">
          Leaderboard
        </p>
      </div>
      <b-row>
        <b-pagination align="center" :total-rows="total" v-model="page" :per-page="25">
        </b-pagination>
        <br>
      </b-row>
      <b-row>
        <transition name="fade" appear>
          <b-table striped hover :items="allUsers" :fields="fields" :key="task">
            <template slot="username" scope="row">
              <b-link :to="'/profile/'+row.item.user_project_id.split('__')[0]">{{row.item.username}}</b-link>
            </template>
          </b-table>
        </transition>

      </b-row>

    </b-container>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>

<script>
import axios from 'axios';
import config from '../config';

export default {
  name: 'Leaderboard',
  data() {
    return {
      allUsers: [],
      next: null,
      total: 0,
      page: 0,
      fields: ['rank', 'username', 'n_try', 'n_test'],
    };
  },
  methods: {
    filterData(data) {
      let i = (this.page - 1)*25 + 1;
      const newData = [];
      data.forEach((val) => {
        const v = val;
        if (val.n_try + val.n_test) {
          v.rank = i;
          newData.push(v);
          i += 1;
        }
      });
      console.log(newData);
      return newData;
    },
    get_leaderboard() {
      axios.get(this.scoreUrl).then((resp) => {
        console.log(resp);
        let data = resp.data._items;
        data = this.filterData(data);
        this.allUsers = data;
        this.next = resp.data._links.next;
        this.total = resp.data._meta.total;
        this.page = resp.data._meta.page;
      });
    },
  },

  computed: {
    scoreUrl() {
      let url = `?where={"task": "${this.task}"}&sort=-n_test,-n_try&page=${this.page}`;
      url = `${config.score_url}${url}`;
      // 'score?where={"task":"' +task+ '", "username":{"$exists": true}}&sort=-n_test'
      return url;
    },
    taskInfo() {
      let taskInfo = null;
      this.all_tasks.forEach((val) => {
        if (val.task === this.task) {
          taskInfo = val;
        }
      });
      return taskInfo;
    },
  },

  created() {
    this.get_leaderboard();
  },

  mounted() {
    // this.$emit('change_task', this.task);
    this.get_leaderboard();
  },
  props: ['task', 'login', 'isAuthenticated', 'all_tasks'],
  watch: {
    task() {
      // console.log('task changed, getting leaderboard');
      this.get_leaderboard();
    },
    page() {
      this.get_leaderboard();
    }
  },
};
</script>
