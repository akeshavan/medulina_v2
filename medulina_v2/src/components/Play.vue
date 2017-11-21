<template>
  <div class="about" ref="about">
    <div v-if="isAuthenticated" class="isAuth">
      <Paper  :paper-src="paperSrc" :fill-error-start="fillErrorStart"
      :fill-error-end="fillErrorEnd"
      :paint-size="brushSize"
      :paint-val="brushColor" ref="paper"
      :brightness="brightness" :contrast="contrast"
      id="canvas-id"
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

      <!-- Modal Component for fill error -->
      <b-modal id="fillErr" ref="fillErr" title="Fill Error" ok-only header-bg-variant="info"
           header-text-variant="light">
        <p clas="my-4">You are filling too much. </p>
        <p clas="my-4"> <strong> Close your loops! </strong> </p>
      </b-modal>

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

      <b-navbar  toggleable="md" type="dark" variant="info" class="navbar-fixed-bottom" id="bottonNav" style="position: absolute; bottom: 0; width: 100%;">


        <!-- Right aligned nav items -->
        <b-nav>
          <b-nav-form is-nav-bar class="ml-auto">
            <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
            <b-button size="sm" class="my-2 my-sm-0" v-on:click="hide">Hide</b-button>
          </b-nav-form>
        </b-nav>

        <b-nav is-nav-bar class="ml-auto">
          <b-nav-form>
            <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
            <b-btn v-b-toggle.collapse1 variant="primary">Menu</b-btn>
          </b-nav-form>
        </b-nav>

        <b-nav is-nav-bar class="ml-auto">
          <b-nav-form>
            <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
            <b-button size="sm" class="my-2 my-sm-0" v-on:click="undo">Undo</b-button>
          </b-nav-form>
        </b-nav>





      </b-navbar>
    </div>
  </div>
</template>

<style>
  .about {
    width: inherit;
    height: calc(100vh - 56px);
    overflow-y: hidden;
  }

  .menuOpts {
    margin: auto;
    text-align: center;
    position: absolute;
    bottom: 0px;
    height: 195px;
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
    height: 100%;
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
    z-index:99;
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

  .missed {
    cursor: pointer;
    width: 45px;
    height: 45px;
    margin-right: 5px;
    background-color: black;
    border-color: #FF595E;
    border-style: solid;
    border-radius: 10px;
  }

  .missed.view {
    background-color: #FF595E;
  }

  .incorrect {
    cursor: pointer;
    width: 45px;
    height: 45px;
    margin-right: 5px;
    background-color: black;
    border-color: #87BCDE;
    border-style: solid;
    border-radius: 10px;
  }

  .incorrect.view {
    background-color: #87BCDE;
  }

  .correct {
    cursor: pointer;
    width: 45px;
    height: 45px;
    margin-right: 5px;
    background-color: black;
    border-color: darkviolet;
    border-style: solid;
    border-radius: 10px;
  }

  .correct.view {
    background-color: darkviolet;
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


Vue.filter('formatNumber', value =>
    numeral(value).format('0.0[0]'), // displaying other groupings/separators is possible, look at the docs
);


export default {
  name: 'About',
  data() {
    return {
      overlay: true,
      paperSrc: null,
      brushSize: '1',
      brushSizeOptions: [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
      ],
      brushColor: '1',
      brushColorOptions: [
        { text: 'Erase', value: '0' },
        { text: 'Paint', value: '1' },
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
        processStyle: null,
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
    };
  },
  components: { Paper, vueSlider },

  computed: {
    image_url() {
      chai.assert.isNotNull(this.login.id);
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
      this.$refs.fillErr.show();
    },

    testShown() {
      this.$refs.slider1.refresh();
      this.$refs.slider2.refresh();
    },

    fillErrorEnd() {

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

  mounted() {
    this.$emit('change_task', this.task);
    if (this.paperSrc == null && this.isAuthenticated) {
      this.changeImg();
    }
  },

  props: ['login', 'isAuthenticated', 'task'], // login comes from parent element

};
</script>
