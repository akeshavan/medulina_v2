<template>
  <div class="play" ref="play">
    <div v-if="isAuthenticated && login.consent" class="isAuth">
      <b-alert :show="fillErr" class="mb-0"
      variant="danger" :dismissible="showDismiss"
      v-on:dismissed="fillErr=false;"
      >
        You are filling too much. Remember to close your loops.
      </b-alert>

      <b-alert :show="login.loginType == 'anon'" class="mb-0"
      variant="danger"
      >
        Your progress will not be saved! Please
        <b-link @click="do_authenticate()"> Log In </b-link>
        to save your scores!

      </b-alert>


      <Paper  :paper-src="paperSrc" :fill-error-start="fillErrorStart"
      :fill-error-end="fillErrorEnd"
      :paint-size="brushSize"
      :paint-val="brushColor" ref="paper"
      :brightness="brightness" :contrast="contrast"
      id="canvas-id" :LUT="LUT"
      ></Paper>

      <canvas class="fireworks" resize :hidden="!doFirework"></canvas>

      <div class="legend" style="" v-if="showLegend">
          <!--<h3 style="text-align: center">{{score.dice | | formatNumber}}</h3>-->
          <div class="roi">
              <div id="fn"
              v-bind:class="{'missed': !feedback.fn, 'missed view': feedback.fn}"
              v-on:click="toggle('fn')"></div>
              <span style="line-height:50px;">Missed</span>
          </div>

          <br>
          <div class="roi">
              <div id="fp"
              v-bind:class="{'incorrect': !feedback.fp, 'incorrect view': feedback.fp}"
              v-on:click="toggle('fp')"></div>
              <span style="line-height:50px;">Incorrect</span>
          </div>

          <br>
          <div class="roi">
              <div id="tp"
              v-bind:class="{'correct': !feedback.tp, 'correct view': feedback.tp}"
              v-on:click="toggle('tp')"></div>
              <span style="line-height:50px;">Correct</span>
          </div>

      </div>


      <b-collapse class="container-fluid menuOpts" id="collapse1" @shown="testShown">
          <div class="row flex-row flex-nowrap cardArea mx-auto">

            <div class="mt-2 ml-2 mb-2">
                <b-card>
                  <p class="card-text">Brush Size</p>
                  <b-form-radio-group id="btnradios2"
                    buttons
                    button-variant="outline-primary"
                    size="md"
                    v-model="brushSize"
                    :options="brushSizeOptions"
                    name="radioBtnOutline" />
                </b-card>
              </div>
              <div  class="mt-2 ml-2 mb-2">
                  <b-card>
                    <p class="card-text">Brush Color</p>
                    <b-form-radio-group id="btnradios2"
                    buttons
                    button-variant="outline-primary"
                    size="md"
                    v-model="brushColor"
                    :options="brushColorOptions"
                    name="radioBtnOutline" />

                  </b-card>
                </div>
                <div  class="mt-2 ml-2 mb-2" >
                    <b-card>
                      <p class="card-text">Brightness</p>
                      <vue-slider ref="slider1" v-model="brightness" v-bind="brightnessOptions">
                      </vue-slider>
                      {{brightness}}
                    </b-card>
                </div>
                <div  class="mt-2 ml-2 mb-2 ">
                    <b-card>
                      <p class="card-text">Contrast</p>
                      <vue-slider ref="slider2" v-model="contrast" v-bind="brightnessOptions">
                      </vue-slider>
                      {{contrast}}
                    </b-card>
                </div>

          </div>
      </b-collapse>

    </div>
    <div v-else>
      <h1>
        Error!
      </h1>
      <p class="lead muted">
        Please <b-link @click="do_authenticate()"> Log In </b-link>
        or sign our <b-link to="/consent"> Research Consent Form </b-link> to continue.
      </p>
    </div>
    <b-navbar v-if="isAuthenticated && login.consent" toggleable="md" type="dark" variant="info"
      class="navbar-fixed-bottom" id="bottonNav"
      style="position: fixed !important; bottom: 0; width: 100%;">


      <!-- Right aligned nav items -->
      <b-navbar-nav>
        <b-nav-form is-nav-bar class="ml-auto">
          <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
          <b-button size="sm" class="my-2 my-sm-0" v-on:click="hide">Hide</b-button>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav is-nav-bar class="ml-auto">
        <b-nav-form>
          <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
          <b-btn v-b-toggle.collapse1 variant="primary">Menu</b-btn>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav is-nav-bar class="ml-auto">
        <b-nav-form>
          <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
          <b-button size="sm" class="my-2 my-sm-0" v-on:click="undo">Undo</b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div> <!-- play -->
</template>

<style>
  .play {
    width: inherit;
    height: calc(100vh - 56px);
    overflow-y: hidden;
  }

  .menuOpts {
    margin: auto;
    text-align: center;
    position: absolute;
    bottom: 0px;
    height: 200px;
  }

  .cardArea {
    overflow-x: scroll;
    overflow-y: hidden !important;
    max-width: 100%;
    width: fit-content;
    /*overflow: hidden;*/
    white-space: nowrap !important;
  }

  .card-body {
    white-space: normal;
    min-width: 200px;
  }

  .isAuth {
    height: calc(100vh - 56px - 54px);
  }

  canvas {

    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .paper {
    min-height: 100%;
    max-height: 100%;
    height: 100%;
    min-width: 100%;
    max-width: 100%;
    background-color: black;
  }

  .legend {
    z-index:8;
    background:rgba(1,1,1,1);
    position: fixed;
    right:3px;
    top:65px;
    color:white;
    display: block;
    border-color: black;
    border-style: solid;
    border-radius: 10px;
  }



  .roi {
    display: inline-flex;
    text-align: center;
    width: 120px;
  }

  .fireworks {
    position: absolute;
    top: 0;
  }

</style>



<script>
/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */

import Paper from '@/components/Paper';
import vueSlider from 'vue-slider-component';
import axios from 'axios';
import chai from 'chai';
import numeral from 'numeral';
import Vue from 'vue';
import config from '../config';
import firework from '../lib/firework';
import Consent from './Consent';

import style from '../custom-bootstrap.scss';


Vue.filter('formatNumber', value =>
    numeral(value).format('0.0[0]'), // displaying other groupings/separators is possible, look at the docs
);


export default {
  name: 'Play',
  data() {
    return {
      overlay: true,
      paperSrc: null,
      brushSize: 1,
      brushSizeOptions: [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
      ],
      brushColor: 1,
      brushColorOptions: [
        { text: 'Erase', value: 0 },
        { text: 'Paint', value: 1 },
      ],
      brightness: 50,
      contrast: 50,
      brightnessOptions: {
        eventType: 'auto',
        width: 'auto',
        height: 6,
        dotSize: 16,
        dotHeight: null,
        dotWidth: null,
        min: 0,
        max: 100,
        interval: 1,
        show: true,
        speed: 0.5,
        disabled: false,
        piecewise: false,
        piecewiseStyle: {},
        piecewiseLabel: false,
        tooltip: false,
        tooltipDir: 'top',
        reverse: false,
        data: null,
        clickable: true,
        realTime: true,
        lazy: true,
        formatter: null,
        bgStyle: null,
        sliderStyle: null,
        processStyle: {
          'background-color': style.locals.primary,
        },
        piecewiseActiveStyle: null,
        tooltipStyle: null,
        labelStyle: null,
        labelActiveStyle: null,
      },
      mode: null,
      image_id: null,
      user_agent: null,
      startTime: null,
      score: {
        dice: null,
      },
      showLegend: false,
      feedback: {
        fp: true,
        fn: true,
        tp: true,
      },
      doFirework: false,
      fillErr: false,
      showDismiss: false,
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
  components: { Paper, vueSlider, Consent },

  computed: {
    image_url() {
      chai.assert.isNotNull(this.login.id, 'user needs an id!');
      chai.assert.isNotNull(this.login.token);
      chai.assert.isNotNull(this.task);
      chai.assert.isNotNull(config.image_url);

      let url = `${config.image_url}?where={"task":"${this.task}"}`;
      url = `${url}&max_results=1`;
      url = `${url}&user_id=${this.login.id}&token=${this.login.token}`;
      // console.log("URL FOR GET IMAGES IS", url)
      return url;
    },
  },

  created() {

  },


  watch: {
    task() {
      this.changeImg();
    },

    isAuthenticated() {
      this.changeImg();
    },
  },

  methods: {
    fillErrorStart() {
      // console.log("starting to revert...", this.$refs.fillErr.show())
      // this.$refs.fillErr.show();
      console.log('starting the fill error thing');
      this.fillErr = true;
    },

    testShown() {
      this.$refs.slider1.refresh();
      this.$refs.slider2.refresh();
    },

    fillErrorEnd() {
      // this.fillErr = false;
      this.showDismiss = true;
    },

    hide() {
      this.overlay = !this.overlay;
      this.$refs.paper.roi.visible = this.overlay;
      if (this.$refs.paper.fp) {
        this.$refs.paper.fp.visible = this.overlay;
        this.feedback.fp = this.overlay;
        this.$refs.paper.tp.visible = this.overlay;
        this.feedback.tp = this.overlay;
        this.$refs.paper.fn.visible = this.overlay;
        this.feedback.fn = this.overlay;
      }
    },

    undo() {
      this.$refs.paper.draw_revert();
    },

    toggle(roi) {
      this.$refs.paper[roi].visible = !this.$refs.paper[roi].visible;
      this.feedback[roi] = !this.feedback[roi];
    },

    do_authenticate() {
      this.$emit('needs_authentication');
    },

    changeImg() {
      this.$emit('change_status', null);
      const self = this;
      const url = this.image_url;
      this.overlay = true;
      this.feedback.fp = true;
      this.feedback.fn = true;
      this.feedback.tp = true;
      axios.get(url, { params: { _: Math.random() } }).then((resp) => {
        chai.assert.lengthOf(resp.data._items, 1, 'the response from /image does not have exactly 1 item');
        const data = resp.data._items[0];
        self.paperSrc = `data:image/jpeg;base64,${data.pic}`;
        self.mode = data.mode;
        self.image_id = data._id;
        self.user_agent = navigator.userAgent;
        self.startTime = new Date();
        console.log(data);
        this.$emit('change_status', 'Submit');
        this.showLegend = false;
      }).catch((e) => {
        console.log('error', e);
      });
    },

    playFirework() {
      this.doFirework = true;
      firework.playFirework(500).then(() => {
        this.doFirework = false;
      });
    },

    submitImg() {
      const imgbody = {
        image_id: this.image_id,
        pic: JSON.stringify(this.$refs.paper.roi.getNonZeroPixels()),
        mode: this.mode,
        task: this.task,
        user_id: this.login.id,
        user_agent: this.user_agent,
        resolution: [window.innerWidth, window.innerHeight],
      };
      const timeDiff = new Date() - this.startTime; // in miliseconds
      imgbody.time = timeDiff;

      if (this.mode === 'train') {
        imgbody.mode = 'try';
      }
      this.$emit('change_status', null);

      axios({
        method: 'POST',
        url: config.edit_url,
        crossDomain: true,
        processData: false,
        headers: {
          authorization: config.edit_token,
          'content-type': 'application/json',
        },
        data: JSON.stringify(imgbody),
      }).then((response) => {
        console.log('response is', response);
        if (this.mode === 'train') {
          const data = response.data;
          console.log(data.fp);
          this.overlay = true;
          this.$refs.paper.add_roi(data.fp, 'fp', 0);
          this.$refs.paper.add_roi(data.tp, 'tp', 0);
          this.$refs.paper.add_roi(data.fn, 'fn', 1);
          this.$refs.paper.roi.remove();
          this.score.dice = data.score;
          this.showLegend = true;
          this.$emit('change_status', 'Next');
        } else {
          // fireworks!
          this.playFirework();
          this.changeImg();
          this.$emit('change_status', 'Submit');
        }
      });
    },

  },

  beforeRouteLeave(from, to, next) {
    console.log('leaving', this.id);
    // document.body.removeEventListener('touchmove', stopBounce);
    // this.$refs.paper.removeEvents();
    next();
  },

  beforeRouteEnter(from, to, next) {
    console.log('entering');
    // document.body.addEventListener('touchmove', stopBounce);
    next((vm) => {
      // vm.$refs.paper.onresize();
      console.log('resized on enter', vm);
    });
  },

  mounted() {
    this.$emit('change_task', this.task);
    if (this.paperSrc == null && this.isAuthenticated) {
      this.changeImg();
    }

    /* This part for no touch scrolling  */
  },

  props: ['login', 'isAuthenticated', 'task'], // login comes from parent element

};
</script>
