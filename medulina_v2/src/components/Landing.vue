<template>
  <div class="hello">
    <div class='jumbotron'>
      <h1>
        <img src="../assets/logo.svg" class="logo landing-logo"/>
        {{ msg }}
      </h1>
      <p class="lead text-muted"> Help us teach computers to read medical images </p>
    </div>
    <div class="container">
      <div class="row">
        <div v-for="t in all_tasks" class="task_section">
          <div>
              <b-card :title="t.name"
                      :sub-title="t.level">
                  <p class="card-text">
                      {{t.text}}
                  </p>
                  <router-link v-if="login.consent" :to="{ name: 'Play', params: {task: t.task} }"
                  :class="{'btn btn-primary': t.task == task, 'btn btn-secondary': t.task != task}"
                  >
                      Play
                  </router-link>
                  <router-link v-else :to="{ name: 'Consent', params: {task: t.task} }"
                  :class="{'btn btn-primary': t.task == task, 'btn btn-secondary': t.task != task}"
                  >
                      Play
                  </router-link>
                  <router-link :to="{ name: 'Tutorial', params: {task: t.task} }"
                  :class="{'btn btn-warning': t.task == task, 'btn btn-secondary': t.task != task}"
                  >
                      Tutorial
                  </router-link>
                  <router-link :to="{ name: 'Leaderboard', params: {task: t.task} }"
                  :class="{'btn btn-danger': t.task == task, 'btn btn-secondary': t.task != task}"
                  >
                      Leaderboard
                  </router-link>
                  <router-link :to="{ name: 'Project', params: {task: t.task} }"
                  :class="{'btn btn-success': t.task == task, 'btn btn-secondary': t.task != task}"
                  >
                      View Project
                  </router-link>

              </b-card>
          </div>


        </div>




      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Landing',
    data() {
      return {
        msg: 'Welcome to Medulina',
      };
    },
    methods: {

    },
    props: ['task', 'all_tasks', 'login'],
  };
</script>

<style>
.task_section {
  text-align: left;
  margin: 10px;

}

.hello {
  margin-top: 20px;
}

.landing-logo {
    background: #024b70;
    padding: 10px;
    width: 55px;
    height: 55px;
    border-style: solid;
    border-color: #0093d2;
    border-radius: 50px;
}
</style>
