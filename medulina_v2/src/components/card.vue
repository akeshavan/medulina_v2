<template>
  <div class="card">
    <Paper
    :paper-src="paperSrc"
    :ref="id"
    :id="id"
    v-on:loaded_image="logLoad"
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
import axios from 'axios';
import Paper from './Paper';
import config from '../config';

export default {
  name: 'cardo',
  data() {
    return {

    };
  },
  computed: {
    aggUrl() {
      return `${config.apiHome}/api/v1/maskagg?aggregate={"$image_search":"${this.info._id}"}`;
    },
    truthUrl() {
      return `${config.edit_url}?where={"mode":"truth","image_id":"${this.info._id}"}`;
    },
  },
  methods: {
    logLoad(i) {
      console.log(i);
      this.getTruth(i);
    },
    getTruth(ref) {
      return axios.get(this.truthUrl).then((resp) => {
        this.$refs[ref].add_roi(resp.data._items[0].pic, 'fn', 1);
      });
    },

  },
  components: { Paper },
  props: ['paperSrc', 'id', 'info'],
};
</script>
