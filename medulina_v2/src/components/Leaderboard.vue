<template>
  <div id="leaderboard">
    Leaderboard: {{task}}
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'Leaderboard',
  data() {
    return {

    };
  },
  methods: {

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
