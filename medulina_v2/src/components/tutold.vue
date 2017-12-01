<template>
  <div id="tutorial">

    <b-container>
      <b-row style="">
        <div class="jumbotron mt-3 mb-3 w-100">
          <h1>{{taskInfo.name}}</h1>
        </div>
      </b-row>

      <b-row v-for="rowIdx in totImgs/3" class="mt-1">
        <b-col v-for="colIdx in 3" md="12" sm="12" lg="4" class="mt-2 mb-1">
          <ImageCard :id="`a${(rowIdx-1)*3+(colIdx-1)}`" :paperSrc="paperSrc[(rowIdx-1)*3+(colIdx-1)]" :info="imgs[(rowIdx-1)*3+(colIdx-1)]"></ImageCard>
        </b-col>
      <!--<div class="card-deck">
        <div class="paperImg" v-for="(img, index) in totImgs">
          <Card :id="`a${index}`" :paperSrc="paperSrc[index]" :info="imgs[index]"></Card>
        </div>
      </div>-->
      </b-row>

    <b-button @click="addMore" class="mt-3 mb-3">Show More</b-button>



  </b-container>
  </div>
</template>

<script>
/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */

import Paper from '@/components/Paper';
import axios from 'axios';
import chai from 'chai';
import config from '../config';
import ImageCard from './ImageCard';



export default {
  name: 'tutorial',
  data() {
    return {
      brushSize: 1,
      brushColor: 1,
      brightness: 50,
      contrast: 50,
      paperSrc1: null,
      paperSrc2: null,
      paperSrc: [],
      nImgs: 6,
      totImgs: 6,
      page: 1,
      imgs: [],
    };
  },
  components: { Paper, ImageCard },
  props: ['task', 'login', 'isAuthenticated', 'all_tasks'],
  created() {

  },
  mounted() {
    this.$emit('change_task', this.task);
    this.setImages();
  },
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

    imgArr() {
      const d = [];
      for (let i = 0; i < d; i += 1) {
        d.push(i);
      }
      return d;
    },
    image_url() {
      chai.assert.isNotNull(this.login.id);
      chai.assert.isNotNull(this.login.token);
      chai.assert.isNotNull(this.task);
      chai.assert.isNotNull(config.image_url);

      let url = `${config.image_url}?where={"task":"${this.task}"}`;
      url = `${url}&max_results=${this.nImgs}&page=${this.page}&sort=-_created`;
      // url = `${url}&user_id=${this.login.id}&token=${this.login.token}`;
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

    addMore() {
      this.page += 1;
      this.totImgs += this.nImgs;
      this.setImages();
    },

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
        // chai.assert.lengthOf(resp.data._items, 1,
        // 'the response from /image does not have exactly 1 item');

        for (let i = 0; i < resp.data._items.length; i += 1) {
          const data = resp.data._items[i];
          self.paperSrc.push(`data:image/jpeg;base64,${data.pic}`);
          self.imgs.push(data);
        }

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
