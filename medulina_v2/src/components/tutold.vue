<template>
  <div id="tutorial">

    <div class="paperImg" v-for="(idx, index) in [1,2]">
      <Paper
      :paper-src="paperSrc[index]"

      :ref="`a${index}`"
      :id="`b${index}`"
      ></Paper>
    </div>




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
      imgs: [],
    };
  },
  components: { Paper, ImageCard },
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
      url = `${url}&max_results=2`;
      //url = `${url}&user_id=${this.login.id}&token=${this.login.token}`;
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

      /*axios.get(url, { params: { _: Math.random() } }).then((resp) => {
        //chai.assert.lengthOf(resp.data._items, 1,
        //'the response from /image does not have exactly 1 item');
        const data = resp.data._items[0];
        self.imgs.push(data);
        self.paperSrc1 = `data:image/jpeg;base64,${data.pic}`;
        self.paperSrc.push(self.paperSrc1)

        const data2 = resp.data._items[1];
        self.imgs.push(data2);
        self.paperSrc2 = `data:image/jpeg;base64,${data2.pic}`;
        self.paperSrc.push(self.paperSrc2);

      }).catch(() => {
        // empty
      });*/

      axios.get(url, { params: { _: Math.random() } }).then((resp) => {
        //chai.assert.lengthOf(resp.data._items, 1,
        //'the response from /image does not have exactly 1 item');

        for (let i=0; i<resp.data._items.length; i += 1){
          const data = resp.data._items[i];
          self.paperSrc.push(`data:image/jpeg;base64,${data.pic}`)
        }

        /*const data = resp.data._items[0];
        self.imgs.push(data);
        self.paperSrc1 = `data:image/jpeg;base64,${data.pic}`;
        self.paperSrc.push(self.paperSrc1)

        const data2 = resp.data._items[1];
        self.imgs.push(data2);
        self.paperSrc2 = `data:image/jpeg;base64,${data2.pic}`;
        self.paperSrc.push(self.paperSrc2);*/

      }).catch(() => {
        // empty
      });

      /*axios.get(url, { params: { _: Math.random() } }).then((resp) => {
        //chai.assert.lengthOf(resp.data._items, 1,
        //'the response from /image does not have exactly 1 item');
        const data = resp.data._items[0];
        self.paperSrc2 = `data:image/jpeg;base64,${data.pic}`;
        self.paperSrc.push(self.paperSrc2)
        self.imgs.push(data);
      }).catch(() => {
        // empty
      });*/
    },

  },
};
</script>

<style>

#tutorial {
  width: inherit;
  height: inherit;
  margin-top: 120px;
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
