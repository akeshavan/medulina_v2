<template>
  <div id="tutorial">



        <div class="landing gray empty first" id="step1">
          <div class="caption">
            <h1>Find Meningiomas</h1>
            <button class="btn btn-primary" @click="scroll">Start</button>
          </div>
        </div>

        <div class="landing design blue" >
          <div class="caption">
            <h1 id="step2">What are meningiomas?</h1>
            They are bad
          </div>
        </div>

        <div class="landing design gray empty" >
          <div class="caption">
            <h1 id="step3">What do meningiomas look like? </h1>
            bright blobs
          </div>
        </div>

        <div class="landing design blue empty" >
          <div class="row caption ">
            <div class="col-md-6">
              <h1 id="step4">Step 1: Draw</h1>
              Outline the meningioma by clicking and dragging
            </div>
            <div class="col-md-6">

              <div class="paperImg">
                <Paper
                :paper-src="paperSrc"
                :fill-error-start="fillErrorStart"
                :fill-error-end="fillErrorEnd"
                :paint-size="brushSize"
                :paint-val="brushColor"
                :brightness="brightness" :contrast="contrast"
                v-on:mouseup="applyDrawing"
                v-on:dblclick="applyDrawing"
                ref="draw"
                id="draw"
                ></Paper>
              </div>

            </div>
          </div>
        </div>

        <div class="landing design gray" >
          <div class="row caption ">

            <div class="col-md-6">
                <div class="paperImg mx-auto">
                  <Paper
                  :paper-src="paperSrc"
                  :fill-error-start="fillErrorStart"
                  :fill-error-end="fillErrorEnd"
                  :paint-size="brushSize"
                  :paint-val="brushColor"
                  :brightness="brightness" :contrast="contrast"

                  ref="fill"
                  id="fill"
                  ></Paper>
                </div>
              </div>

              <div class="col-md-6">
                <h1 id="step4">Step 2: Fill</h1>
                Fill the meningioma by double clicking
              </div>


          </div>
        </div>


      <!--<div class="row">

          <h3>Click and Drag to draw</h3>

          <Paper
          :paper-src="paperSrc"
          :fill-error-start="fillErrorStart"
          :fill-error-end="fillErrorEnd"
          :paint-size="brushSize"
          :paint-val="brushColor"
          :brightness="brightness" :contrast="contrast"
          v-on:mouseup="applyDrawing"
          v-on:dblclick="applyDrawing"
          ref="draw"
          id="draw"
          ></Paper>

      </div>
      <div class="row">

          <h3>Double Click to Fill</h3>


          <Paper
          :paper-src="paperSrc"
          :fill-error-start="fillErrorStart"
          :fill-error-end="fillErrorEnd"
          :paint-size="brushSize"
          :paint-val="brushColor"
          :brightness="brightness" :contrast="contrast"
          ref="fill"
          id="fill"
          ></Paper>


      </div>-->




  </div>
</template>

<script>
/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */

import Paper from '@/components/Paper';
import axios from 'axios';
import chai from 'chai';
import config from '../config';


export default {
  name: 'tutorial',
  data() {
    return {
      brushSize: 1,
      brushColor: 1,
      brightness: 50,
      contrast: 50,
      paperSrc: null,
    };
  },
  components: { Paper },
  props: ['task', 'login', 'isAuthenticated'],
  created() {

  },
  mounted() {
    this.$emit('change_task', this.task);
    this.setImages();
  },
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

  watch: {

    isAuthenticated() {
      this.setImages();
    },

    task() {
      this.setImages();
    },
  },
  methods: {

    applyDrawing(pixelLog) {
      this.$refs.fill.roi.fillPixelLog(pixelLog, this.$refs.fill.draw.LUT);
    },

    fillErrorStart() {},

    fillErrorEnd() {},

    scroll() {

    },

    setImages() {
      const self = this;
      const url = this.image_url;
      console.log(url);

      axios.get(url, { params: { _: Math.random() } }).then((resp) => {
        chai.assert.lengthOf(resp.data._items, 1,
        'the response from /image does not have exactly 1 item');
        const data = resp.data._items[0];
        self.paperSrc = `data:image/jpeg;base64,${data.pic}`;
      }).catch(() => {
        // empty
      });
    },

  },
};
</script>

<style>

#tutorial {
  width: inherit;
  height: inherit;
  /*margin-top: 20px;*/
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.paper {
  background-color: black;
  width: 100%;
  height: 100%;
  }

/*.row {
  margin-bottom: 20px;
  min-height: 100%;
}*/

.landing {
  height: 100vh;
  width: 100%;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.first {
  height: calc(100vh - 56px);
}

.design {
    background-image: url("../assets/banner.svg");
}

.landing::before {
  content: '';
    display: block;
    width: 90px;
    height: 66px;
    position: absolute;
    left: 50%;
    top: -4.5em;
    margin-left: -45px;
    margin-top: -33px;
    background-image: url("../assets/arrow.svg");
}

.empty {
    background-image: url("../assets/empty.svg");
}

.gray {
  background-color: gray;
  color: white;
}

.blue {
  background-color: #313E50;
  color: white;
}

.caption {
  position: relative;
  left: 0;
  top: 45%;
  width: 100%;
  text-align: center;
}

.paperImg {
  width: 300px;
  height: 300px;
  position: relative;
  top: -100px;
}


</style>
