<template>

    <div class="card">

      <div class="paperthumb" v-if="image">
        <Paper :paper-src="image.pic"
        :id="`id${id}`"
        :ref="`ref${id}`"
        :key="`key${id}`"></Paper>
      </div>
      <div class="card-body">
        <h4 class="card-title">{{ aggStats.avescore | formatNumber }}</h4>
        <p class="card-text">
              <p>n attempts: {{aggStats.nattempts}}</p>
              <p>n users: {{aggStats.nusers}}</p>
          </p>
      </div>
      <div class="card-footer">
        <div>
          <small class="text-muted">slice: {{image.slice}}</small>
        </div>
      </div>
    </div>



</template>

<style>
.paperthumb {

  min-height: 200px;
}

.paperthumb canvas {
  min-height: 200px;
  width: 100%;
  height: 100%;
  background: black;
}
</style>

<script>
/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */
import Vue from 'vue';
import numeral from 'numeral';
import axios from 'axios';
import Paper from './Paper';
import config from '../config';
import style from '../custom-bootstrap.scss';

Vue.filter('formatNumber', value => numeral(value).format('0.0[0]')); // displaying other groupings/separators is possible, look at the docs


const d3 = require('d3');

export default {
  name: 'imageCard',
  data() {
    return {
      truth: {},
      aggStats: {},
      aggRoi: {},
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
      return `${config.apiHome}/api/v1/maskagg?aggregate={"$image_search":"${this.image._id}"}`;
    },
    truthUrl() {
      return `${config.edit_url}?where={"mode":"truth","image_id":"${this.image._id}"}`;
    },
  },
  methods: {

    getCmap() {
      const LUT = {
        0: this.$refs[this.id].LUT[0],
      };
      const maxVote = this.aggStats.nattempts;
      const colorscale = d3.scaleLinear()
        .domain([0, 1])
        .range(['white', style.locals.warning])
        .interpolate(d3.interpolateLab);
      for (let i = 1; i < maxVote + 1; i += 1) {
        LUT[i] = colorscale(i / maxVote);
      }
      return LUT;
    },

    fetchAgg() {
      return axios.get(this.aggUrl).then((resp) => {
        console.log('agg response is', resp);
        this.aggStats = resp.data._items[0];
        this.aggRoi = resp.data.mask_sum;
        const LUT = this.getCmap();
        this.$refs[this.id].add_roi(this.aggRoi, 'tp', 1, LUT);
      });
    },
    fetchTruth() {
      return axios.get(this.truthUrl).then((resp) => {
        console.log('truth response is', resp);
        this.truth = resp.data._items[0];
        if (this.truth.pic) {
          this.$refs[this.id].add_roi(this.truth.pic, 'fn', 1);
        }
      });
    },
    fetchData() {
      this.fetchAgg().then(this.fetchTruth);
    },
  },
  mounted() {
    console.log('imagecard mounted', this.id);
    if (this.image) {
      // this.fetchData();
    }
    //
  },
  created() {

  },
  watch: {
    image() {
      console.log('image changed', this.image);
      if (this.image) {
        // this.fetchData();
      }
    },
  },
  props: ['image', 'id'],
  components: { Paper },
};
</script>
