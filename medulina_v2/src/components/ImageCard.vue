<template>
  <div class="card">
    <Paper
    :paper-src="paperSrc"
    :ref="id"
    :id="id"
    :LUT="LUT"
    v-on:loaded_image="logLoad"
    ></Paper>
    <div class="card-body">
      <h4 class="card-title">{{aggStats.avescore | formatNumber}}</h4>
      <p class="card-text"><strong>N:</strong>{{aggStats.nattempts}}, <strong>U:</strong>{{aggStats.nusers}}</p>

    </div>
    <div class="card-footer">
      <div>
        <small class="text-muted" v-if="this.loaded">slice: {{info.slice}}</small>
      </div>
    </div>
  </div>
</template>
<style></style>
<script>
import axios from 'axios';
import Vue from 'vue';
import numeral from 'numeral';
import Paper from './Paper';
import config from '../config';
import style from '../custom-bootstrap.scss';

const d3 = require('d3');

Vue.filter('formatNumber', value => numeral(value).format('0.0[0]')); // displaying other groupings/separators is possible, look at the docs

export default {
  name: 'cardo',
  data() {
    return {
      loaded: false,
      r: '',
      aggStats: {},
      LUT: {
        0: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 0,
        },
        1: style.locals.warning,
        2: style.locals.success,
        3: style.locals.danger,
      },
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
      this.r = i;
      this.loaded = true;
      this.getTruth(i);
      this.getAgg(i);
    },

    getCmap(maxVote) {
      const LUT = {
        0: this.$refs[this.id].LUT[0],
      };

      const colorscale = d3.scaleLinear()
        .domain([0, 1])
        .range([style.locals.primary, style.locals.warning])
        .interpolate(d3.interpolateLab);
      for (let i = 1; i < maxVote + 1; i += 1) {
        LUT[i] = colorscale(i / maxVote);
      }
      return LUT;
    },

    getTruth(ref) {
      return axios.get(this.truthUrl).then((resp) => {
        this.$refs[this.r].add_roi(resp.data._items[0].pic, 'fn', 1);
      });
    },
    getAgg(ref) {
      return axios.get(this.aggUrl).then((resp) => {
        console.log(resp.data);
        const maxVote = resp.data._items[0].nattempts;
        this.aggStats = resp.data._items[0];
        const LUT = this.getCmap(maxVote);
        this.$refs[this.r].add_roi(resp.data.mask_sum, 'fp', 1, LUT);
      });
    }

  },
  components: { Paper },
  props: ['paperSrc', 'id', 'info'],
};
</script>
