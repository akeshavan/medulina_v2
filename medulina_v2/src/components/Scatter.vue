<template>

  <div class="scatterPlot" style="width:100%; height:200px;">
    <resize-observer @notify="onresize" />
    <svg :id="id" :ref="id"></svg>
  </div>

</template>

<style>
  svg {
    width: 100%;
    height: 100%;
  }

  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }

  .dot {
    stroke: #313E50;
  }

  .tooltip {
    position: absolute;
    width: 200px;
    height: 28px;
    pointer-events: none;
  }

</style>

<script>
const d3 = require('d3');


export default {
  name: 'Scatter',

  data() {
    return {
      prep: {},
      currentClicked: null,
    };
  },

  props: {
    dotColor: {
      type: String,
      default: '#87BCDE',
    },
    id: {
      type: String,
      default: 'plot',
    },
    onColor: {
      type: String,
      default: '#FF595E',
    },
    highlightColor: {
      type: String,
      default: '#0E7C7B',
    },
    data: {

    },
    axisLabels: {
      default() {
        return {
          x: 'x',
          y: 'y',
        };
      },
    },
  },

  computed: {
    width() {
      return this.$refs[this.id].clientWidth;
    },
    height() {
      return this.$refs[this.id].clientHeight;
    },
  },

  methods: {

    onresize() {
      console.log('resize', this.$refs[this.id].clientWidth);
      const width = this.$refs[this.id].clientWidth - this.prep.margin.left - this.prep.margin.right;
      const height = this.$refs[this.id].clientHeight - this.prep.margin.top - this.prep.margin.bottom;

      const svg = d3.select(`#${this.id}`)
        .attr('width', width + this.prep.margin.left + this.prep.margin.right)
        .attr('height', height + this.prep.margin.top + this.prep.margin.bottom);

      this.prep.xScale.range([0, width]).nice();
      this.prep.yScale.range([height, 0]).nice();

      this.prep.yAxis.ticks(Math.max(height / 50, 2));
      this.prep.xAxis.ticks(Math.max(width / 50, 2));

      svg.select('.x.axis')
        .attr('transform', `translate(0,${height})`)
        .call(this.prep.xAxis);

      svg.select('.x.axis')
        .selectAll('.label')
        .attr('x', width);

      svg.select('.y.axis')
        /* .attr("transform", "rotate(-90)") */
        .call(this.prep.yAxis);

      svg.selectAll('.dot')
        .attr('cx', this.prep.xMap)
        .attr('cy', this.prep.yMap);
    },

    removeEvents() {
      const el = document.getElementById(this.id);
      if (el) {
        console.log('removing events');
        el.removeEventListener('resize', this.onresize);
      }
    },

    highlighterOn(d) {
      const self = this;
      return function hlight(dat) {
        if (dat === d) {
          return self.highlightColor;
        }

        return dat === self.currentClicked ? self.onColor : self.dotColor;
      };
    },

    highlighterOff() {
      const self = this;
      return function hlight(dat) {
        return dat === self.currentClicked ? self.onColor : self.dotColor;
      };
    },
    /*
      Populate the prepared SVG with data
    */
    populate() {
      // update dots (i.e add new ones)
      console.log('POPULATING', this.data.length);
      const data = this.data;
      const self = this;
      const foo = this.prep.svg.selectAll('.dot')
        .data(data);

      foo.enter().append('circle')
        .attr('class', 'dot')
        .merge(foo)
        .style('fill', () => self.dotColor)
        .attr('cx', this.prep.xMap)
        .attr('r', 1) // Change size
        .transition()
        .duration(1000)
        .attr('r', 7)
        // .ease(d3.easeBounce)
        .attr('cx', this.prep.xMap)
        .attr('cy', this.prep.yMap);


      this.prep.svg.selectAll('.dot')
        .on('mouseover', (d) => {
          self.prep.svg.selectAll('.dot').style('fill', self.highlighterOn(d));
        })
        .on('mouseout', () => {
          self.prep.svg.selectAll('.dot').style('fill', self.highlighterOff());
        });
        // TODO: .on('click', onClick);


      // remove dots
      this.prep.svg.selectAll('.dot')
        .data(data)
        .exit()
        .transition()
        .duration(1000)
        .style('opacity', 1e-6)
        .attr('cy', () => 0)
        .remove();
    },
    /*
      Prepare the D3 SVG and axis
    */
    prepare() {
      console.log('preparing', d3);
      const axisLabels = this.axisLabels;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = this.width - margin.left - margin.right;
      const height = this.height - margin.top - margin.bottom;

      /*
       * value accessor - returns the value to encode for a given data object.
       * scale - maps value to a visual display encoding, such as a pixel position.
       * map function - maps from data value to display value
       * axis - sets up axis
       */

      // setup x
      const xValue = function xValue(d) {
        return d[axisLabels.x];
      }; // data -> value

      const xScale = d3.scaleLinear().range([0, width]); // value -> display
      const xMap = function xMap(d) {
        return xScale(xValue(d));
      }; // data -> display
      const xAxis = d3.axisBottom(xScale);

      // setup y
      const yValue = function yValue(d) {
        return d[axisLabels.y];
      }; // data -> value
      const yScale = d3.scaleLinear().range([height, 0]);
      // value -> display Note order swap (bottom is higher)
      const yMap = function yMap(d) {
        return yScale(yValue(d));
      }; // data -> display
      const yAxis = d3.axisLeft(yScale);

      // setup fill color
      // var cValue = function(d) { return d.Manufacturer;},
      //    color = d3.scale.category10();

      xScale.range([0, width]).nice();
      yScale.range([height, 0]).nice();

      yAxis.ticks(Math.max(height / 50, 2));
      xAxis.ticks(Math.max(width / 50, 2));

      xScale.domain([0, 50]); // d3.max(data, prep.xValue)]);
      yScale.domain([0, 1]);

      // add the graph canvas to the body of the webpage
      const svg = d3.select(`#${this.id}`)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`) // take X to bottom of SVG
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', -6)
        .style('text-anchor', 'end')
        .style('fill', 'black')
        .text(axisLabels.x);

      // y-axis
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('fill', 'black')
        .text(axisLabels.y);

      this.prep = {
        xValue,
        yValue,
        xScale,
        yScale,
        xMap,
        yMap,
        xAxis,
        yAxis,
        svg,
        margin,
        width,
        height,
      };
    },
  },

  watch: {
    data() {
      console.log('DATA CHANGED');
      this.populate();
    },
  },

  beforeDestroy: function beforeDestroy(to, from, next) {
    console.log('destroying', this.id);
    this.removeEvents();
    if (next) {
      next();
    }
  },

  mounted() {
    const el = document.getElementById(this.id);
    console.log(el);
    el.addEventListener('resize', this.onresize);
    this.prepare();
    // this.populate();
  },

};
</script>
