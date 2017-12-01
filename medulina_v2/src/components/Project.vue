<template>
  <div class="project">
    <b-container>

        <div class="jumbotron mt-3">
          <h1>{{taskInfo.name}}</h1>
        </div>

        <b-row>
            <b-card-group deck>

              <ImageCard v-for="(image, index) in [1,2,3]"
              :image="allImages[index]" :id="`pic${index}`"
              :ref="`pic${index}`"
              :key="`pic${index}`"
              ></ImageCard>


            </b-card-group>
        </b-row>

    </b-container>
  </div>

</template>

<style>

</style>

<script>
/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */

import axios from 'axios';
import chai from 'chai';
import config from '../config';
import ImageCard from './ImageCard';
import Paper from './Paper';

export default {
  name: 'Project',
  data() {
    return {
      allImages: [],
    };
  },
  methods: {

    fetchData() {
      axios.get(this.taskImagesUrl).then((resp) => {
        console.log('fetched data', resp.data);
        const data = resp.data._items;
        //data.forEach((val, idx) => {
        //  data[idx].pic = `data:image/jpeg;base64,${val.pic}`;
        //});

        for (let i = 0; i < data.length; i += 1) {
          data[i].pic = `data:image/jpeg;base64,${data[i].pic}`;
        }

        this.allImages = data;
      });
    },
  },
  computed: {
    taskImagesUrl() {
      chai.assert.isNotNull(this.task);
      chai.assert.isNotNull(config.image_url);
      return `${config.image_url}?where={"task":"${this.task}"}&max_results=3&sort=-_created`;
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
  },
  mounted() {
    this.fetchData();
  },
  components: { ImageCard, Paper },
  watch: {
    $route() {
      //this.fetchData();
    },
  },
  props: ['task', 'all_tasks', 'login', 'isAuthenticated'],
};
</script>
