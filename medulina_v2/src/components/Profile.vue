<template>
  <div class="profile">
    <!-- Only show stuff is the user is authenticated -->
    <div v-if="isAuthenticated">
      <!-- userInfo is a prop that was passed in from App -->

      <h1><img :src="login.avatar" class="rounded-circle img-thumbnail thumb">{{login.username}}</h1>
      <p>
        You are logged in. Try logging out to see what happens to this page.
      </p>

    </div>

    <div v-else>
      <h1>Error!</h1>
      <p>
        Please log in to see your profile
      </p>
    </div>

  </div>
</template>

<style>

.profile {
  margin-top: 20px;
}

.thumb {
  height: 50px;
  width: 50px;
  margin-right: 0.25em;
}

</style>

<script>
export default {
  name: 'profile',
  data() {
    return {

    };
  },
  // the parent component feeds these vars to this component
  props: ['isAuthenticated', 'userInfo', 'login'],
};
</script>
