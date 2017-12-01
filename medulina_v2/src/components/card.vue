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
        <small class="text-muted" v-if="this.loaded">{{info.slice}}</small>
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
      loaded: false,
      r: '',
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
      this.r = i;
      this.loaded = true;
      this.getTruth(i);
      this.getAgg(i);
    },
    getTruth(ref) {
      return axios.get(this.truthUrl).then((resp) => {
        this.$refs[this.r].add_roi(resp.data._items[0].pic, 'fn', 1);
      });
    },
    getAgg(ref) {
      return axios.get(this.aggUrl).then((resp) => {
        console.log(resp.data);
        this.$refs[this.r].add_roi(resp.data.mask_sum, 'fp', 1);
      });
    }

  },
  components: { Paper },
  props: ['paperSrc', 'id', 'info'],
};
</script>
