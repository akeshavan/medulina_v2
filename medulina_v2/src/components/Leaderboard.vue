<template>
  <div id="leaderboard">
    Leaderboard: {{task}}
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

    };
  },
  methods: {
    get_leaderboard() {
      axios.get(this.scoreUrl).then((resp) => {
        console.log(resp);
      });
    },
  },

  computed: {
    scoreUrl() {
      let url = `?where={"task": "${this.task}"}&sort=-n_test`;
      url = `${config.score_url}{$url}`;
      // 'score?where={"task":"' +task+ '", "username":{"$exists": true}}&sort=-n_test'
      return url;
    },
  },

  mounted() {
    this.$emit('change_task', this.task);
  },
  props: ['task', 'login', 'isAuthenticated'],
  watch: {
    task() {

    },
  },
};
</script>
