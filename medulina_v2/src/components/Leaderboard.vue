<template>
  <div id="leaderboard">
    <b-container class="mt-5">
      <div class="jumbotron">
        <h1><img src="../assets/noun_155903_cc.svg" style="width:2em;"/> {{taskInfo.name}} </h1>
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
        <b-table striped hover :items="allUsers" :fields="fields"></b-table>
      </b-row>

    </b-container>
  </div>
</template>

<style>

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
      let i = 0;
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
      let url = `?where={"task": "${this.task}"}&sort=-n_test,-n_try`;
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

  mounted() {
    this.$emit('change_task', this.task);
    this.get_leaderboard();
  },
  props: ['task', 'login', 'isAuthenticated', 'all_tasks'],
  watch: {
    task() {

    },
  },
};
</script>
