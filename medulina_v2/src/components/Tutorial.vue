<template>
  <div class="tutorial" ref="tutorial">
    <div class="all">
    <!-- STEP 1-->
    <transition name="fade" appear>
      <div v-if="currentStep('step1')" class="step1 next pb-2">
        <b-container>
          <h3 class="pt-4 pb-3">{{taskInfo.tutorial_title}}</h3>
          <p class="lead"> {{taskInfo.desc}}</p>

          <div class="mt-2">
            <b-button variant="info"  @click="incrementStep(0)">
              Show {{taskInfo.name}}
            </b-button>
          </div>
        </b-container>
      </div>
    </transition>

    <!-- NEXT -->
      <div class="step1 next pt-2 pb-2" v-if="currentStep('start')">
        <transition name="fade">
          <b-button variant="info" @click="incrementStep(1)" size="lg">
            Next
          </b-button>
        </transition>
      </div>

      <!-- STEP 2-->
      <transition name="fade">
        <div v-if="currentStep('step2') || currentStep('step3') || currentStep('submit')" class="next">
          <b-alert show variant="light" class="mb-0">
            <b-progress :value="stepIdx" :max="steps.length-1" class="mb-3"></b-progress>
            <strong>
              <h5> {{step.title}} </h5>
            </strong>

              {{step.description}}
          </b-alert>


        </div>
      </transition>

      <b-alert :show="currentStep('step2')" dismissible variant="warning" class="fixed-bottom">
        <strong>To Zoom</strong>: Scroll or Pinch
        <br>
        <strong>To Pan</strong>: Right-Click & Drag or Two Finger Drag
      </b-alert>

      <b-alert :show="currentStep('step3')" dismissible variant="danger" class="mt-0 mb-0 fixed-bottom">
        <strong>Warning</strong>: Make sure your shape is closed before filling
      </b-alert>



      <!-- STEP 5 -->
      <transition name="fade">
        <div v-if="currentStep('step5')" class="next">
          <b-alert show variant="light" class="mb-0 fixed-bottom">
            <b-progress :value="stepIdx" :max="steps.length-1" class="mb-3"></b-progress>
            <strong>
              <h5> {{step.title}} </h5>
            </strong>
              {{step.description}}
              <hr v-if="showNext">
              <b-button variant="outline-secondary" v-if="showNext" @click="incrementStep(1)">
                Next
              </b-button>
          </b-alert>
        </div>
      </transition>

      <!-- STEP 6-9 -->
      <transition name="fade">
        <div v-if="currentStep('step6') || currentStep('step7') || currentStep('step8') || currentStep('step9')"
          class="next ">
          <b-alert show variant="light" class="">
            <b-progress :value="stepIdx" :max="steps.length-1" class="mb-3"></b-progress>
            <strong>
              <h5> {{step.title}} </h5>
            </strong>
              {{step.description}}
              <hr v-if="showNext">
              <b-button variant="outline-secondary" v-if="showNext" @click="incrementStep(1)">
                Next
              </b-button>
          </b-alert>
        </div>
      </transition>



      <!-- STEP 10 -->
      <transition name="fade">
        <div v-if="currentStep('step10')" class="next ">
          <b-alert show variant="light" class="">
            <b-progress :value="stepIdx" :max="steps.length-1" class="mb-3"></b-progress>
            <strong>
              <h5> {{step.title}} </h5>
            </strong>
              {{step.description}}
              <hr>
              <b-button v-if="login.consent" variant="primary" :to="'/play/'+this.task">
                Start Playing
              </b-button>
              <b-button v-else variant="primary" :to="'/consent/'">
                Start Playing
              </b-button>
          </b-alert>
        </div>
      </transition>

      <Paper  :paper-src="paperSrc" :fill-error-start="fillErrorStart"
      :fill-error-end="fillErrorEnd"
      :paint-size="brushSize"
      :paint-val="brushColor" ref="paper"
      :brightness="brightness" :contrast="contrast"
      v-on:draw="doMouseUp"
      v-on:fillSuccess="doDblClick"
      :LUT="LUT"
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

            <div class="mt-2 ml-2 mb-2" v-if="currentStep('brushSize')">
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
              <div  class="mt-2 ml-2 mb-2" v-if="currentStep('brushColor')">
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
                <div  class="mt-2 ml-2 mb-2" v-if="currentStep('brightness')">
                    <b-card>
                      <p class="card-text">Brightness</p>
                      <vue-slider ref="slider1" v-model="brightness" v-bind="brightnessOptions">
                      </vue-slider>
                      {{brightness}}
                    </b-card>
                </div>
                <div  class="mt-2 ml-2 mb-2 " v-if="currentStep('contrast')">
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
      <b-navbar  toggleable="md" type="dark"
      variant="info" class="navbar-fixed-bottom"
      id="bottonNav" style="position: absolute; bottom: 0; width: 100%;"
      v-if="currentStep('bottomNav')">


        <!-- Right aligned nav items -->
        <b-nav v-if="currentStep('hide')">
          <b-nav-form is-nav-bar class="ml-auto">
            <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
            <b-button size="sm" class="my-2 my-sm-0" v-on:click="hide">Hide</b-button>
          </b-nav-form>
        </b-nav>

        <b-nav is-nav-bar class="ml-auto" v-if="currentStep('menu')">
          <b-nav-form>
            <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
            <b-btn v-b-toggle.collapse1 variant="primary">Menu</b-btn>
          </b-nav-form>
        </b-nav>

        <b-nav is-nav-bar class="ml-auto" v-if="currentStep('undo')">
          <b-nav-form>
            <!--<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>-->
            <b-button size="sm" class="my-2 my-sm-0" v-on:click="undo">Undo</b-button>
          </b-nav-form>
        </b-nav>
      </b-navbar>

  </div>
</template>

<style>

  .step1 {
    position: absolute;
    top: 56px;
    background-color: rgba(255,255,255,0.75);
    width: 100%;
  }

  .step1.next {
    position: absolute;
    top: 56px;
    background-color: rgba(255,255,255,0.75);
    width: 100%;
  }

  .next {
    position: fixed;
    top: 56px;
    background-color: rgba(255,255,255,0);
    width: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }

  .tutorial {
    width: inherit;
    height: calc(100vh - 56px);
    overflow-y: hidden;
    background-color: black;
  }

  .menuOpts {
    margin: auto;
    text-align: center;
    position: fixed;
    bottom: 80px;
    height: 120px;
  }

  #bottonNav {
    position: fixed !important;
    bottom: 0;
    width: 100%;
    height: 56px;
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

  .all {
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
import style from '../custom-bootstrap.scss';


Vue.filter('formatNumber', value =>
    numeral(value).format('0.0[0]'), // displaying other groupings/separators is possible, look at the docs
);


export default {
  name: 'Tutorial',
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
      stepIdx: 0,
      showNext: false,
      n_hide: 0,
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
  components: { Paper, vueSlider },

  computed: {
    step() {
      return this.steps[this.stepIdx];
    },

    taskInfo() {
      let taskInfo = null;
      this.all_tasks.forEach((val) => {
        if (val.task === this.task) {
          taskInfo = val;
        }
      });
      return taskInfo;
    },

    steps() {
      const self = this;
      const steps = [
        { name: 'Step 1',
          title: `Finding ${this.taskInfo.name}`,
          description: this.taskInfo.desc,
          init() {

          },
          elements: ['step1'] },
        { name: 'Step 1',
          title: `Finding ${this.taskInfo.name}`,
          description: this.taskInfo.desc,
          init() {
            self.showROI('paper');
            self.showNext = false;
          },
          elements: ['start'],
        },
        { name: 'Step 2',
          title: `Outline the ${this.taskInfo.name}`,
          description: 'Click + Drag to draw an outline',
          elements: ['step2'] },
        { name: 'Step 3',
          title: `Fill the ${this.taskInfo.name}`,
          description: 'Double tap to fill the shape',
          elements: ['step3'] },
        { name: 'Step 4',
          title: 'Submit your drawing',
          description: 'Click the Submit button on the top left',
          elements: ['submit'] },
        { name: 'Step 5',
          title: 'Inspect your Results',
          description: 'Click on the legend colors to see where you went wrong',
          init() {
            // comment
          },
          elements: ['step5'] },
        { name: 'Step 6',
          title: 'Hide/Show your drawing',
          description: `You can hide your drawing to see borders more clearly.
          Click the hide button on the bottom right`,
          init() {
            console.log('init');
            self.showROI('paper');
            self.showNext = false;
          },
          elements: ['bottomNav', 'hide', 'step6'],
        },
        { name: 'Step 7',
          title: 'Undo',
          description: `Try drawing something, then click Undo.
          Be careful, you can't redo!`,
          init() {
            self.showNext = false;
          },
          elements: ['bottomNav', 'hide', 'undo', 'step7'],
        },
        { name: 'Step 8',
          title: 'Menu',
          description: 'Open the menu to see more options',
          init() {
            self.showNext = false;
          },
          elements: ['bottomNav', 'hide', 'undo', 'step8', 'menu', 'brushSize', 'brushColor', 'brightness', 'contrast'],
        },
        { name: 'Step 9',
          title: 'Brush Size, Erase/Paint, Brightness, and Contrast',
          description: `Try changing your brush size and using an eraser.
          Changing the brightness and contrast can help better define the borders of your target structure.`,
          init() {
            self.showNext = true;
          },
          elements: ['bottomNav', 'hide', 'undo', 'step9', 'menu', 'brushSize', 'brushColor', 'brightness', 'contrast'],
        },
        { name: 'Step 10',
          title: 'Scoring Points',
          description: `
            Once you're done training, you'll get new images.
            You get a point for each new image you submit.
          `,
          init() {
            self.doFirework = true;
            self.playFirework();
          },
          elements: ['bottomNav', 'hide', 'undo', 'step10', 'menu', 'brushSize', 'brushColor', 'brightness', 'contrast'],
        },
      ];
      return steps;
    },

    image_url() {
      chai.assert.isNotNull(this.login.id);
      chai.assert.isNotNull(this.login.token);
      chai.assert.isNotNull(this.task);
      chai.assert.isNotNull(config.image_url);

      let url = `${config.image_url}?where={"task":"${this.task}", "mode": "train"}`;
      url = `${url}&max_results=1`;
      // url = `${url}&user_id=${this.login.id}&token=${this.login.token}`;
      console.log('URL FOR GET IMAGES IS', url);
      return url;
    },
  },

  created() {

  },


  watch: {
    task() {
      this.stepIdx = 0;
      this.changeImg();
    },

    isAuthenticated() {
      this.changeImg();
    },
  },

  methods: {

    doMouseUp() {
      console.log(this.stepIdx)
      if (this.stepIdx === 2){
        this.incrementStep(0);
      }
    },

    doDblClick() {
      if (this.stepIdx === 3){
        this.incrementStep(0);
      }
      console.log(this.step);
    },

    currentStep(name) {
      return this.step.elements.indexOf(name) >= 0;
    },

    fillErrorStart() {
      // console.log("starting to revert...", this.$refs.fillErr.show())
      this.$refs.fillErr.show();
    },

    testShown() {
      if (this.stepIdx === 8) {
        this.incrementStep(0);
      }
      if (this.$refs.slider1) {
        this.$refs.slider1.refresh();
        this.$refs.slider2.refresh();
      }
    },

    fillErrorEnd() {

    },

    incrementStep(change) {
      this.stepIdx += 1;
      this.showNext = false;
      console.log('stepIdx is', this.stepIdx);
      if (change) {
        this.changeImg().then(() => {
          if (this.step.init) {
            this.step.init();
          }
        });
      } else {
        if (this.step.init) {
          console.log('running init')
          this.step.init();
        }
      }


    },

    showROI(paperRef) {
      // TODO: show the ROI for this one.
      const url = `${config.edit_url}/?where={"image_id":"${this.image_id}","mode":"truth"}`;
      console.log('url is', url, 'showROI');
      axios.get(url).then((resp) => {
        const data = resp.data;
        chai.assert.isNotEmpty(data._items);
        const pic = data._items[0].pic;
        // const LUT = this.$refs[paperRef].draw.LUT;
        this.$refs[paperRef].roi.fillPixelLog(pic, this.LUT);
        //this.showNext = true;

      }).catch((e) => {
        // comment
      });
    },

    hide() {
      if (this.stepIdx === 6 && this.n_hide === 1) {
        this.incrementStep(0);
      }
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
      this.n_hide += 1;
    },

    undo() {
      if (this.$refs.paper.draw.history.length > 1){
        this.incrementStep(0);
      }
      this.$refs.paper.draw_revert();
    },

    toggle(roi) {
      console.log('stepIdx', this.stepIdx);
      if (this.stepIdx === 5){
        this.showNext = true;
      }
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
      console.log('changing image');
      return axios.get(url, { params: { _: Math.random() } }).then((resp) => {
        chai.assert.lengthOf(resp.data._items, 1, 'the response from /image does not have exactly 1 item');
        const data = resp.data._items[0];
        self.$refs.paper.clearImg();
        self.paperSrc = `data:image/jpeg;base64,${data.pic}`;
        self.$refs.paper.initImg();
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
      return firework.playFirework(500).then(() => {
        this.doFirework = false;
      });
    },

    submitImg() {
      this.incrementStep(0);
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

  props: ['login', 'isAuthenticated', 'task', 'all_tasks'], // login comes from parent element

};
</script>
