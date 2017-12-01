<template>
  <div class="card" :key="key">
    <Paper
    :paper-src="paperSrc"
    :ref="key"
    :id="id"
    ></Paper>
    <div class="card-body">
      <h4 class="card-title">Title</h4>
      <p class="card-text">hi</p>

    </div>
    <div class="card-footer">
      <div>
        <small class="text-muted"></small>
      </div>
    </div>
  </div>
</template>
<style></style>
<script>
import Paper from './Paper';

export default {
  name: 'cardo',
  data() {
    return {

    };
  },
  components: { Paper },
  props: ['paperSrc', 'key', 'id'],
};
</script>
