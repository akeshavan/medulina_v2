<template>
  <div class="paper">
      <resize-observer @notify="onresize" />
      <canvas :id="id" resize v-on:click="activate"></canvas>
  </div>

</template>

<script>
import chai from 'chai';
import Hammer from 'hammerjs';
import paper from '../../node_modules/paper/dist/paper-core.min';

paper.install(window);

paper.Raster.prototype.getNonZeroPixels = function getNonZeroPixels() {
  const output = {};
  for (let ii = 0; ii < this.width; ii += 1) {
    for (let jj = 0; jj < this.height; jj += 1) {
      if (this.pixelLog[ii][jj]) {
        if (output[ii] === undefined) {
          output[ii] = {};
        }
        output[ii][jj] = parseInt(this.pixelLog[ii][jj], 10);
      }
    }
  }
  return output;
};

paper.Raster.prototype.initPixelLog = function initPixelLog() {
  /*
    Adds the pixelLog attribute to the raster. Pixel log is a dictionary with
    index keys (0-width) and each value is another dictionary w/ keys (0-height)
    The values are initialized to null.
  */
  this.pixelLog = {};
  for (let ii = 0; ii < this.width; ii += 1) {
    this.pixelLog[ii] = {};
    for (let jj = 0; jj < this.height; jj += 1) {
      this.pixelLog[ii][jj] = 0;
    }
  }
};

paper.Raster.prototype.diff = function diff(data) {
  const score = {
    tp: 0,
    fn: 0,
    fp: 0,
  };
  const difflog = {};
  for (let ii = 0; ii < this.width; ii += 1) {
    difflog[ii] = {};
    for (let jj = 0; jj < this.height; jj += 1) {
      const current = this.pixelLog[ii][jj];
      if (data[ii]) {
        const truth = data[ii][jj];
        if (truth === 1 && current === 1) {
          // true positive
          score.tp += 1;
          // turn green 195 192 170
          // this.setPixel(ii,jj,{red:195/255,blue:192/255,green:170/255, alpha:0.2})
        } else if (truth === 1 && current === 0) {
          // false negative
          score.fn += 1;
          // turn red
          this.setPixel(ii, jj, '#FF595E');
          difflog[ii][jj] = current; // .push([ii,jj,current])
        } else if (!truth && current === 1) {
          // false positive
          score.fp += 1;

          // turn blue
          this.setPixel(ii, jj, '#87BCDE');
          // difflog.push([ii,jj,current])
          difflog[ii][jj] = current;
        }
      } else if (current) {
        // the x coordinate isn't there, so the x,y is a 0. if current is a 1
        // here, its a false positive
        score.fp += 1;
        // turn blue
        this.setPixel(ii, jj, '#87BCDE');
        // difflog.push([ii,jj,current])
        difflog[ii][jj] = current;
      }
    }
  }
  this.opacity = 0.35;
  return [score, difflog];
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

paper.Raster.prototype.setPixelLog = function setPixelLog(X, Y, color, paintVal) {
  /*
    Sets the pixel and pixelLog at coordinate x,y to val. Val should be a color.
  */

  let x = X;
  let y = Y;
  x = Math.floor(x);
  y = Math.floor(y);
  this.setPixel(x, y, color);
  if (!isNumeric(paintVal)) {
    console.log(`Error ${x} ${y} ${paintVal} is not a number`);
  }
  try {
    this.pixelLog[x][y] = paintVal; // || val
    return 0;
  } catch (err) {
    // console.log(x,y,"out of bounds")
    return 1;
  }
};

paper.Raster.prototype.setPixelLogNoColor = function setPixelLogNoColor(X, Y, color, paintVal) {
  /*
    Sets the pixel and pixelLog at coordinate x,y to val. Val should be a color.
  */
  let x = X;
  let y = Y;
  x = Math.floor(x);
  y = Math.floor(y);
  // this.setPixel(x,y,val)
  if (!isNumeric(paintVal)) {
    console.log(`Error ${paintVal} is not a number`);
  }
  try {
    this.pixelLog[x][y] = paintVal; // || val
    return 0;
  } catch (err) {
    // console.log(x,y,"out of bounds")
    return 1;
  }
};

paper.Raster.prototype.fillPixelLog = function fillPixelLog(obj, colorMapper) {
  const ikeys = Object.keys(obj);
  for (let idx = 0; idx < ikeys.length; idx += 1) {
    const ii = ikeys[idx];
    const jkeys = Object.keys(obj[ii]);
    for (let jdx = 0; jdx < jkeys.length; jdx += 1) {
      const jj = jkeys[jdx];
      const val = obj[ii][jj];
      const color = colorMapper[val];
      this.setPixelLog(ii, jj, color, val);
    }
  }
};

paper.Raster.prototype.fillPixelLogFlat = function fillPixelLogFlat(obj, val, colorMapper) {
  const me = this;
  obj.forEach((v) => {
    // var val = obj[ii][jj]
    const color = colorMapper[val];
    me.setPixelLog(v.x, v.y, color, val);
  });
};

// Thanks https://github.com/licson0729/CanvasEffects

function copyImageData(ctx, src) {
  const dst = ctx.createImageData(src.width, src.height);
  dst.data.set(src.data);
  return dst;
}

paper.Raster.prototype.process = function process(func) {
  const pix = copyImageData(this.getContext('2d'), this.origImg);

  // Loop through the pixels
  for (let x = 0; x < this.width; x += 1) {
    for (let y = 0; y < this.height; y += 1) {
      const i = ((y * this.width) + x) * 4;
      const r = pix.data[i];
      const g = pix.data[i + 1];
      const b = pix.data[i + 2];
      const a = pix.data[i + 3];
      const ret = func(r, g, b, a, x, y);
      pix.data[i] = ret[0];
      pix.data[i + 1] = ret[1];
      pix.data[i + 2] = ret[2];
      pix.data[i + 3] = ret[3];
    }
  }

  this.setImageData(pix);
};


paper.Raster.prototype.contrast = function contrast(L) {
  let level = L;
  level = ((level + 100) / 100) ** 2;
  return this.process((r, g, b, a) =>
    [((((r / 255) - 0.5) * level) + 0.5) * 255,
      ((((g / 255) - 0.5) * level) + 0.5) * 255,
      ((((b / 255) - 0.5) * level) + 0.5) * 255, a,
    ],
  );
};

paper.Raster.prototype.brightness = function brightness(bright) {
  return this.process((r, g, b, a) =>
    [r * bright,
      g * bright,
      b * bright, a,
    ],
  );
};

paper.Raster.prototype.brightness_contrast = function brightnessContrast(bright, L) {
  let level = L;
  level = ((level + 100) / 100) ** 2;
  return this.process((r, g, b, a) =>
    [((((r / 255) - 0.5) * level) + 0.5) * 255 * bright,
      ((((g / 255) - 0.5) * level) + 0.5) * 255 * bright,
      ((((b / 255) - 0.5) * level) + 0.5) * 255 * bright, a,
    ],
  );
};


function initializeBaseRaster(raster, scope) {
  /*
    Initialize the base image raster so that its visible, centered, and takes up
    the width of the window.

    Also make a copy of it to save as the original image so we can manipulate
    brightness and contrast
  */

  /* eslint no-param-reassign: ["error", { "props": false }] */

  raster.visible = true;
  raster.position = scope.view.center;
  raster.fitBounds(scope.view.bounds);

  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = raster.width;
  tmpCanvas.height = raster.height;
  const tmpCtx = tmpCanvas.getContext('2d');

  // TODO: uncomment this for brightness/contrast!
  raster.origImg = copyImageData(tmpCtx,
  raster.canvas.getContext('2d').getImageData(0, 0, raster.width, raster.height));
}

function initializeRoiRaster(baseRaster, roiRaster, scope, Alpha) {
  /*
    Initialize the roi image so that its the same size and position of the
    base image, and also set the opacity to alpha (0.25 by default)
  */
  const alpha = Alpha || 0.25;
  roiRaster.setSize(baseRaster.size);
  initializeBaseRaster(roiRaster, scope);
  roiRaster.opacity = alpha; // 0.25
  roiRaster.initPixelLog();
}

/* =============================================================================
                          TRANSFORMATION FUNCTIONS
============================================================================= */

const xfm = {};

xfm.clamp = function clamp(number, Min, Max) {
  /*
    returns the number if number is between min or max. If number is > max,
    returns max. If number < min, returns min
  */
  const max = Max || 0;
  const min = Min || 0;
  return Math.max(min, Math.min(number, max));
};

xfm.clampPoint = function clampPoint(point, Min, Max, minh, maxh) {
  /*
    returns a Point w/ point.x and point.y clamped between min,max
  */
  const min = Min || 0;
  const max = Max || 0;
  return new paper.Point({
    x: xfm.clamp(point.x, min, max),
    y: xfm.clamp(point.y, minh, maxh),
  });
};

xfm.get_local = function getLocal(e, baseRaster) {
  /*
    super weird coordinate transform. Make the center of the image 0,0 (because
    that is how the local coordinate system is referenced), then
    clamp the point, and then move 0,0 back to the top left for raster pixel
    refence space.
  */
  const width = baseRaster.size.width;
  const height = baseRaster.size.height;
  const halfW = width / 2;
  const halfH = height / 2;
  let local = baseRaster.globalToLocal(e.point);
  local = xfm.clampPoint(local, 0 - halfW, halfW, 0 - halfH, halfH);
  local.x = Math.floor(local.x + halfW);
  local.y = Math.floor(local.y + halfH);
  return local;
};

/* =============================================================================
                              DRAWING FUNCTIONS
============================================================================= */

function Queue(item) {
  let inbox = [];
  let outbox = [item];
  this.push = function push(I) {
    inbox.push(I);
  };
  this.pop = function pop() {
    if (outbox.length === 0) {
      inbox.reverse();
      // swap the inbox and outbox
      const oldOutbox = outbox;
      outbox = inbox;
      inbox = oldOutbox;
    }
    return outbox.pop();
  };
  Object.defineProperty(this, 'length', {
    get: function get() {
      return inbox.length + outbox.length;
    },
  });
}

/* =============================================================================
                          Filling and Painting FUNCTIONS
============================================================================= */

const sizeMapper = {
  2: [{
    x: -1,
    y: 0,
  },
  {
    x: 0,
    y: -1,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 1,
    y: -1,
  },
  {
    x: -1,
    y: 1,
  },
  {
    x: 1,
    y: -1,
  },
  ],
  3: [{
    x: -1,
    y: 0,
  },
  {
    x: 0,
    y: -1,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 1,
    y: -1,
  },
  {
    x: -1,
    y: 1,
  },
  {
    x: 1,
    y: -1,
  },
  {
    x: 2,
    y: 0,
  },
  {
    x: -2,
    y: 0,
  },
  {
    x: 0,
    y: 2,
  },
  {
    x: 0,
    y: -2,
  },
  ],
};


/* =============================================================================
                              MAIN APP
============================================================================= */

export default {
  name: 'Paper',
  data() {
    return {
      base: null,
      roi: null,
      tp: null,
      fp: null,
      fn: null,
      view: null,
      zoomFactor: 1,
      touch: {
        startScale: null,
        mode: null,
      },
      // paintVal: 1,
      // paintSize: 1,
      scope: null,
      panFactor: { x: 0, y: 0 },
      panMouseDown: null,
      draw: {
        last: null,
        counter: 0,
        history: [
          [],
        ],
        LUT: {
          0: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
          },
          1: 'darkviolet',
          2: 'cyan',
          3: 'gold',
          4: 'plum',
          5: 'goldenrod',
        },

      },
    };
  },
  methods: {
    activate() {
      this.scope.activate();
    },
    doZoom(e) {
      e.preventDefault();
      /* console.log("zooming") */
      const zoomFactor = this.zoomFactor + (e.deltaY / 200);
      this.zoomFactor = xfm.clamp(zoomFactor, 0.3, 3);
      this.view.setZoom(this.zoomFactor);
    },

    doPan(e) {
      if (this.panMouseDown == null) {
        this.panMouseDown = e;
      }
      // console.log('panMouseDown', this.panMouseDown);

      this.panFactor.x = e.point.x - this.panMouseDown.point.x;
      this.panFactor.y = e.point.y - this.panMouseDown.point.y;
      // console.log("panning?", this.panFactor.x, this.panFactor.y)
      this.view.translate(this.panFactor.x, this.panFactor.y);
    },

    add_roi(data, type, doDrag) {
      chai.assert.oneOf(type, ['fp', 'tp', 'fn']);
      this[type] = new paper.Raster({});
      this[type].setSize(this.base.size);

      this[type].opacity = 0.5;
      this[type].position = this.view.center;
      this[type].initPixelLog();

      const colors = {
        fp: '#87BCDE',
        tp: this.draw.LUT[1],
        fn: '#FF595E',
      };
      const LUT = {
        0: this.draw.LUT[0],
        1: colors[type],
      };
      this[type].fillPixelLog(data, LUT);
      this[type].fitBounds(this.base.bounds);
      const self = this;
      if (doDrag) {
        // TODO: this[type].onMouseDrag =
        this[type].onMouseDrag = function onMouseDrag(e) {
          if (e.event.buttons === 2 || self.touch.mode) {
            // right click and drag
            console.log('mousedrag?')
            self.doPan(e);
          }
        };
        this[type].onMouseUp = function onMouseUp(e) {
          self.reset_draw(e);
        };
      }
      // fp.onMouseDrag = dragHandlerPan
    },

    onresize() {
      /*
        When the window size changes, change the bounds of all rasters
      */

      // allRasters.map(function(r){r.fitBounds(view.bounds)})
      // console.log("resizing")
      console.log('resizing', this.id);
      if (this.base && this.roi) {
        this.view.setZoom(1);
        this.base.fitBounds(this.view.bounds);
        this.roi.fitBounds(this.view.bounds);
        this.zoomFactor = 1;
      }

      try {
        this.fp.fitBounds(this.view.bounds);
        this.tp.fitBounds(this.view.bounds);
        this.fn.fitBounds(this.view.bounds);
      } catch (e) {
        // empty
      } finally {
        // empty
      }
    },

    reset_draw(e) {
      // console.log("resetting draw");
      this.draw.last = null;
      this.draw.counter = 0;
      this.panFactor.x = 0;
      this.panFactor.y = 0;
      if (this.draw.history[this.draw.history.length - 1].length) {
        this.draw.history.push([]);
      }
      // console.log("e is", e)
      if (e) {
        if (e.event.button === 2) {
          this.panMouseDown = null;
        }
      }
    },

    draw_addHistory(x0, y0, oldval, newval) {
      /*
        Add an item to history so we can revert. Save coordinates x0, y0,
        and the oldval. Only save to history if there is a change (oldval != newval)
      */
      if (oldval !== newval) {
        this.draw.history[this.draw.history.length - 1].push({
          x: x0,
          y: y0,
          prev: oldval,
        });
      }
    },

    draw_line(X0, Y0, x1, y1, val, roi, paintVal) {
      /*
        Algorithm to connect two points with a line
      */
      let x0 = X0;
      let y0 = Y0;
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = (x0 < x1) ? 1 : -1;
      const sy = (y0 < y1) ? 1 : -1;
      let err = dx - dy;
      // const new_arr = [];

      while (true) {
        this.draw_addHistory(x0, y0, roi.pixelLog[x0][y0], paintVal);
        roi.setPixelLog(x0, y0, val, paintVal); // Do what you need to for this

        if (Math.abs(x0 - x1) < 0.25 && Math.abs(y0 - y1) < 0.25) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }
    },

    draw_revert(Roi, InitPop) {
      /*
        Revert based on history. if init_pop is 0 then it undos a bad floodFill
      */
      console.log('in draw_revert');
      let roi = Roi;
      roi = roi || this.roi;
      let initPop = InitPop;
      if (initPop === undefined) {
        initPop = 1;
      }
      if (this.draw.history.length > 1) {
        if (initPop) {
          this.draw.history.pop(); // this one is always empty
        }
        const values = this.draw.history.pop();
        if (initPop) {
          const self = this;
          values.forEach((val) => {
            roi.setPixelLog(val.x, val.y, self.draw.LUT[val.prev], val.prev);
          });
        } else {
          console.log('reverting w/ no color');
          const self = this;
          values.forEach((val) => {
            if (isNumeric(val.prev)) {
              roi.setPixelLogNoColor(val.x, val.y, self.draw.LUT[val.prev], val.prev);
            } else {
              console.log(val.prev);
            }
          });
        }
        this.draw.history.push([]);
        // console.log(draw.history)
      }
    },

    drawLine(e, me, paintVal, paintSize) {
      /*
        Draws a line from e.point to the previous point
      */
      const local = xfm.get_local(e, me);

      this.draw_addHistory(local.x, local.y,
        me.pixelLog[local.x][local.y],
        paintVal);
      me.setPixelLog(local.x, local.y, this.draw.LUT[paintVal], paintVal);
      // console.log("draw.last is", draw.last)
      if (this.draw.last != null) {
        this.draw_line(local.x,
          local.y,
          this.draw.last.x,
          this.draw.last.y, this.draw.LUT[paintVal], me, paintVal);
      }

      if (paintSize > 1) {
        this.drawLineRad(local, me, paintSize, paintVal);
      }

      this.draw.last = local;
    },

    drawLineRad(local, me, rad, paintVal) {
      const self = this;
      sizeMapper[parseInt(rad, 10)].forEach((val) => {
        self.draw_addHistory(local.x + val.x, local.y + val.y,
          me.pixelLog[local.x + val.x][local.y + val.y],
          paintVal);
        me.setPixelLog(local.x + val.x, local.y + val.y, self.draw.LUT[paintVal], paintVal);

        if (self.draw.last != null) {
          self.draw_line(local.x + val.x,
            local.y + val.y,
            self.draw.last.x + val.x,
            self.draw.last.y + val.y,
            self.draw.LUT[paintVal], me, paintVal);
        }
      });
    },

    draw_floodFill(roi, N, targetVal, replacementVal) {
      /*
        flood fill algorithm. roi = roi raster object, node is an object
        with keys x,y that refer to the raster-space pixels
      */
      let node = N;
      if (targetVal === replacementVal) {
        return;
      }
      if (roi.pixelLog[node.x][node.y] !== targetVal) {
        return;
      }

      function neighboors(y) {
        const nei = [];
        if (y > 0) {
          nei.push(y - 1);
        }
        if (y < roi.height - 1) {
          nei.push(y + 1);
        }
        return nei;
      }

      let queue = new Queue(node);
      let numFill = 0;
      while (queue.length > 0) {
        node = queue.pop();
        let x = node.x;
        const y = node.y;
        /* eslint no-continue: 1 */
        if (roi.pixelLog[x][y] !== targetVal) {
          continue;
        }

        while (x > 0 && roi.pixelLog[x - 1][y] === targetVal) {
          x -= 1;
        }

        const nei = neighboors(y);
        while (x < (roi.width - 1) && roi.pixelLog[x][y] === targetVal) {
          this.draw_addHistory(x, y, roi.pixelLog[x][y], replacementVal);
          roi.setPixelLogNoColor(x, y, this.draw.LUT[replacementVal], replacementVal);
          numFill += 1;
          if (numFill > 20000) {
            console.log('BREAKING')
            queue = [];
            this.fillErrorStart();
            break;
          }
          for (let i = 0; i < nei.length; i += 1) {
            const yNei = nei[i];
            if (roi.pixelLog[x][yNei] === targetVal) {
              queue.push({
                x,
                y: yNei,
              });
            }
          }
          x += 1;
        }
      } // end while loop

      console.log(numFill);
      if (numFill < 20000) {
        roi.fillPixelLogFlat(this.draw.history[this.draw.history.length - 1],
          replacementVal, this.draw.LUT);
        this.$emit('fillSuccess');
      } else {

        console.log('starting revert', numFill, this.draw.history);
        // ui.startProgress()
        if (this.draw.history.length === 1) {
          // omg WHY anisha this is so hacky. write better
          this.draw.history.push([]);
          this.draw_revert(roi, 1);
        } else {
          this.draw_revert(roi, 0);
        }
        this.$nextTick(() => {
          console.log('ending revert', this.draw.history);
          this.fillErrorEnd();
        });
      }
    },

    doFloodFill(e, me, paintVal) {
      /*
        Starts the recursive flood fill on the raster starting from e.point
      */
      const local = xfm.get_local(e, me);
      console.log(local.x, local.y);
      console.log('targetVal', me.pixelLog[local.x][local.y]);
      console.log('replacementVal', paintVal);
      if (!isNumeric(me.pixelLog[local.x][local.y])) {
        console.log('is not a number!!');
        return;
      }
      this.draw_floodFill(me, local, me.pixelLog[local.x][local.y], paintVal);
    },

    dblClickHandler(e) {
      this.doFloodFill(e, this.roi, this.paintVal, this);
      this.reset_draw();
    },

    dragHandler(e) {
      if (e.event.buttons === 2 || this.touch.mode) {
        // right click and drag
        this.doPan(e);
      } else {
        this.drawLine(e, this.roi, this.paintVal, this.paintSize);
      }
    },

    brightcont() {
      const bright = ((parseInt(this.brightness, 10) - 50) / 50) + 1;
      const cont = (parseInt(this.contrast, 10) * 2) - 100;
      this.base.brightness_contrast(bright, cont);
    },

    removeEvents() {
      const el = document.getElementById(this.id);
      if (el) {
        console.log('removing events');
        el.removeEventListener('resize', this.onresize);
        el.removeEventListener('mousewheel', this.doZoom);
      }
    },


    initImg() {
      this.scope.activate();
      this.base = new this.scope.paper.Raster(this.paperSrc);

      this.base.visible = true;
      this.view = this.scope.view;
      // console.log("center is", view.center)
      const self = this;
      this.base.onLoad = function onLoad() {
        this.visible = true;
        // console.log("mounted canvas")
        initializeBaseRaster(this, self.scope);
        self.roi = new self.scope.paper.Raster({});
        initializeRoiRaster(this, self.roi, self.scope, 0.35);
        // console.log("roi??")
        // ROI events
        self.roi.onDoubleClick = (e) => {
          self.dblClickHandler(e);
          // self.$emit('dblclick', self.roi.getNonZeroPixels());
        };
        self.roi.onMouseDrag = self.dragHandler;
        self.roi.onMouseUp = (e) => {
          self.reset_draw(e);
          console.log('touchmode', self.touch.mode);
          self.$emit('draw', self.roi.getNonZeroPixels());
        };
        self.brightcont();
      };
    },
  },

  watch: {
    paperSrc() {
      // console.log("paper source changed")
      this.scope.paper.project.clear();
      // console.log(paper.projects)
      this.draw.history = [
        [],
      ];
      this.zoomFactor = 1;

      this.view.setZoom(1);
      this.panFactor = {
        x: 0,
        y: 0,
      };
      this.initImg();
    },
    brightness() {
      this.brightcont();
    },
    contrast() {
      this.brightcont();
    },
  },
  props: ['paperSrc', 'fillErrorStart', 'fillErrorEnd',
    'paintSize', 'paintVal', 'brightness',
    'contrast', 'id', 'mouseUp'],

  beforeDestroy: function beforeDestroy(to, from, next) {
    console.log('destroying', this.id);
    this.removeEvents();
    next();
  },

  mounted() {
    console.log('mounting canvas');
    const scope = new paper.PaperScope();
    scope.setup(document.getElementById(this.id));
    // console.log("scope is", scope, "id is", this.id)
    this.scope = scope;
    this.initImg();

    const el = document.getElementById(this.id);
    console.log(el);
    el.addEventListener('resize', this.onresize);
    el.addEventListener('mousewheel', this.doZoom);

    const self = this;

    const mc = new Hammer.Manager(el, {
      stopPropagation: true,
      preventDefault: true,
    });
    const Pinch = new Hammer.Pinch();

    // add the recognizer
    mc.add(Pinch);

    let tmpzoom = 1;

    // subscribe to events
    mc.on('pinch', (e) => {
        // do something cool

      if (e) {
        e.preventDefault();
        tmpzoom = xfm.clamp((e.scale / self.touch.startScale) * self.zoomFactor, 1, 5);
        self.view.setZoom(tmpzoom);
      }
    });

    mc.on('pinchend', (e) => {
        // do something cool
        // console.log("pinchend", window.mode)
      console.log('ending pinch');
      self.touch.mode = false;
      if (e) {
        e.preventDefault();

        self.zoomFactor = tmpzoom;
        self.panMouseDown = null;
      }
    });

    mc.on('pinchstart', (e) => {
      // do something cool
      console.log('starting pinch');
      if (e) {
        self.touch.mode = true;
        e.preventDefault();
        self.touch.startScale = e.scale;
      }
    });
  },
};

</script>

<style>



</style>
