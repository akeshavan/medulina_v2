<template>
  <div class="profile">
    <!-- Only show stuff is the user is authenticated -->
    <div v-if="isAuthenticated">
      <!-- userInfo is a prop that was passed in from App -->


      <b-container>
        <div class="row">
          <main>

              <h1><img :src="login.avatar" class="rounded-circle img-thumbnail thumb">{{login.username}}</h1>


            <section class="row text-center placeholders pb-3" >
              <div class="col-6 col-sm-3 placeholder">
                <div class="circle light">
                  <div class="circle__inner">
                    <div class="circle__wrapper">
                      <div class="circle__content">{{login.ave_score | formatNumber}}</div>
                    </div>
                  </div>
                </div>

                <h4 >Average Score</h4>
                <div class="text-muted">Overall average score on training</div>
              </div>


              <div class="col-6 col-sm-3 placeholder">
                <div class="circle purple">
                  <div class="circle__inner">
                    <div class="circle__wrapper">
                      <div class="circle__content">{{login.roll_ave_score | formatNumber}}</div>
                    </div>
                  </div>
                </div>

                <h4 class="">Rolling Average</h4>
                <span class="text-muted ">Average of the past 10 training runs</span>
              </div>


              <div class="col-6 col-sm-3 placeholder">
                <div class="circle bright">
                  <div class="circle__inner">
                    <div class="circle__wrapper">
                      <div class="circle__content">{{login.n_test | formatNumber}}</div>
                    </div>
                  </div>
                </div>

                <h4 class="">Total Points</h4>
                <span class="text-muted">Number of new images you've painted</span>
              </div>


              <div class="col-6 col-sm-3 placeholder">
                <div class="circle dark">
                  <div class="circle__inner">
                    <div class="circle__wrapper">
                      <div class="circle__content"> rank </div>
                    </div>
                  </div>
                </div>

                <h4 class="">Rank</h4>
                <span class="text-muted">Rank based on total points</span>
              </div>

            </section>

            <hr>
            <h2 class="pt-3">Training Scores: {{this.taskInfo.name}}</h2>

            <Scatter id="trainingScores"
              :data="data"
              ref="plot"
              :dotColor="dotColor"
              :onColor="onColor"
              :highlightColor="highlightColor"
              :axisLabels="axisLabels"
              v-on:pointClick="displayImg"
              >
            </Scatter>

            <br>


          <div id="imageLoad">
            <div class="legend2 local" v-if="this.paperSrc">

                <div class="roi">
                    <div id="fn"
                    v-bind:class="{'missed': !feedback.fn, 'missed view': feedback.fn}"
                    v-on:click="toggle('fn')"></div>
                    <span style="line-height:50px;">Truth</span>
                </div>

                <br>
                <div class="roi">
                    <div id="fp"
                    v-bind:class="{'incorrect': !feedback.fp, 'incorrect view': feedback.fp}"
                    v-on:click="toggle('fp')"></div>
                    <span style="line-height:50px;">Your Answer</span>
                </div>

                <br>
                <div class="roi">
                    <div id="tp"
                    v-bind:class="{'correct': !feedback.tp, 'correct view': feedback.tp}"
                    v-on:click="toggle('tp')"></div>
                    <span style="line-height:50px;">Aggregate</span>
                </div>
            </div>

            <Paper  :paper-src="paperSrc"
             ref="paper"
             id="canvas-id"
             :LUT="LUT"
            ></Paper>
          </div>
          <br>

          <div id="test"></div>
          </main>
        </div>
      </b-container>

    </div>

    <div v-else>
      <h1>Error!</h1>
      <p>
        Please log in to see your profile
      </p>
    </div>

  </div>
</template>

<style lang="scss">

@import "../custom-bootstrap.scss";
//@import "../../node_modules/bootstrap/scss/bootstrap.scss";

.profile canvas {
  display: block;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: black;
}


.profile .legend2 {
  z-index:8;
  background:rgba(1,1,1,1);
  position: absolute;
  color:white;
  display: block;
  border-color: black;
  border-style: solid;
  border-radius: 10px;
}

.profile #imageLoad {
  width: 100%;
  height: auto;
  min-height: 200px;
  position: relative;
}

.profile .legend2 .roi {
  display: inline-flex;
  float: left;
  width: unset;
}

.profile {
  margin-top: 20px;
}

.thumb {
  height: 50px;
  width: 50px;
  margin-right: 0.25em;
}

/**
 * Circle Styles
 */

.profile .circle {
  position: relative;
  display: block;
  margin: 2em 0;
  background-color: transparent;
  color: #222;
  text-align: center;
}

.profile .circle:after {
  display: block;
  padding-bottom: 100%;
  width: 100%;
  height: 0;
  border-radius: 50%;
  background-color: #ddd;
  content: "";
}


.profile .circle__inner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;

  height: 100%;

}

.profile .circle__wrapper {
  display: table;
  width: 100%;
  height: 100%;
}

.profile .circle__content {
  display: table-cell;
  /*padding: 1em;*/
  color: white;
  font-size: 2em;
  vertical-align: middle;
}

@media (min-width: 480px) {
    .profile .circle__content {
      font-size: 3em;
  }
}

@media (min-width: 576px) {
    .profile .circle__content {
      font-size: 2em;
  }
}

@media (min-width: 768px) {
    .profile .circle__content {
      font-size: 2.5em;
  }
}

.profile .bright:after {
  background-color: $brand-danger;
}

.profile .purple:after{
  background-color: $brand-primary;
}

.profile .light:after{
  background-color: $brand-warning;
}

.profile .dark:after{
  background-color: $brand-info;
}


</style>

<script>
/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */

import Vue from 'vue';
import numeral from 'numeral';
import axios from 'axios';
import Scatter from './Scatter';
import Paper from './Paper';
import config from '../config';
import chai from 'chai';
import style from '../custom-bootstrap.scss';

const d3 = require('d3');

Vue.filter('formatNumber', value => numeral(value).format('0.0[0]')); // displaying other groupings/separators is possible, look at the docs


export default {
  name: 'profile',
  data() {
    return {
      data: [],
      axisLabels: {
        y: 'score',
        x: 'idx',
      },
      dotColor: style.locals.primary,
      highlightColor: style.locals.warning,
      onColor: style.locals.danger,
      selectedMask: {},
      paperSrc: '',
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
      feedback: {
        fp: 1,
        fn: 1,
        tp: 1,
      },
    };
  },
  components: { Scatter, Paper },
  computed: {
    taskInfo() {
      let taskInfo = null;
      this.all_tasks.forEach((val) => {
        if (val.task === this.task) {
          taskInfo = val;
        }
      });
      return taskInfo;
    },
    trainingUrl() {
      return `${config.edit_url}?where={"mode":"try","task":"${this.task}","user_id":"${this.login.id}"}&max_results=100&sort=-_created`;
    },
    truthUrl() {
      return `${config.edit_url}?where={"mode":"truth","image_id":"${this.selectedMask.image_id}"}`
    },
  },
  methods: {
    toggle(roi) {

    },

    fetchData() {
      console.log('trainingURL', this.trainingUrl);
      axios.get(this.trainingUrl).then((resp) => {
        console.log('response is', resp);
        const data = resp.data._items;
        data.forEach((v, i) => {
          data[i].idx = i;
        });
        this.data = data;
        console.log('fetch data is', data);
        this.$refs.plot.populate();
      }).catch((e) => {
        console.log('error is', e);
      });
    },

    displayImg(d) {
      this.selectedMask = d.d;
      const self = this;
      const userPic = d.d.pic;
      let truthPic = {};

      axios.get(`${config.image_url}${d.d.image_id}`).then((resp) => {
        self.paperSrc = `data:image/jpeg;base64,${resp.data.pic}`;
      }).then(() => {
        axios.get(this.truthUrl).then((res) => {
          console.log('got truth mask for selected point', res);
          truthPic = res.data._items[0].pic;
          self.$refs.paper.add_roi(userPic, 'fp', 0);
          self.$refs.paper.add_roi(truthPic, 'fn', 1);
        });
      }).then(() => {
        const agg = `${config.apiHome}/api/v1/maskagg?aggregate={"$image_search":"${this.selectedMask.image_id}"}`;
        console.log('agg URL is', agg);
        axios.get(agg).then((resp) => {
          console.log('resp.data ag', resp.data);
          const LUT = {
            0: this.$refs.paper.LUT[0],
          };
          const maxVote = resp.data._items[0].nattempts;
          for (let i = 1; i < maxVote + 1; i += 1) {
            LUT[i] = d3.interpolateCool(i / maxVote);
          }
          self.$refs.paper.add_roi(resp.data.mask_sum, 'tp', 1, LUT);
        });
      })
      .catch((e) => {
        console.log('displayImg error', e);
      });

      console.log('data clicked is', d);
    },
  },
  mounted() {
    this.fetchData();
  },
  // the parent component feeds these vars to this component
  props: ['isAuthenticated', 'userInfo', 'login', 'task', 'all_tasks'],
};
</script>
