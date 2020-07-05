



document.getElementById('videoBut').addEventListener("click", function() {
  if (!fastBrowser) {
    window.location = "video.html";
  } else {
    delete kaleidoscope
    document.getElementById('kaleidoscope').parentNode.removeChild(document.getElementById('kaleidoscope'));
    document.getElementById('kaleidoscope2').parentNode.removeChild(document.getElementById('kaleidoscope2'));
  }
  document.getElementById('video').style.display = 'block';
  document.getElementById('info').style.display = 'none';
});

document.getElementById('closeBut').addEventListener("click", function() {
  scopes = loadScopes();
  document.getElementById('video').style.display = 'none';
  document.getElementById('info').style.display = 'block';
});

// Detect fast browser
agent = navigator.userAgent;
console.log(agent);
fastBrowser = true;
console.log(fastBrowser);
if (agent.indexOf('Safari') > 0 && agent.indexOf('Chrome') < 0) {
  fastBrowser = false;
}
if (agent.indexOf('Android') > 0) {
  fastBrowser = false;
}
if (agent.indexOf('Firefox') > 0) {
  fastBrowser = false;
}


loadScopes = function() {
  var DragDrop, Kaleidoscope, agent, fastBrowser, image, image2, initDrift, initDriftRotation, initPixelRatio, initRadius, initZoom, kaleidoscope, kaleidoscope2, onChange, onMouseMoved, options, pageX, pageX_last, tr, tx, ty, update, winHeight, winWidth, delta, delta2, theta, theta2;

  // Detect fast browser
  agent = navigator.userAgent;
  console.log(agent);
  fastBrowser = true;
  console.log(fastBrowser);
  if (agent.indexOf('Safari') > 0 && agent.indexOf('Chrome') < 0) {
    fastBrowser = false;
  }
  if (agent.indexOf('Android') > 0) {
    fastBrowser = false;
  }
  if (agent.indexOf('Firefox') > 0) {
    fastBrowser = false;
  }

  Kaleidoscope = (function() {
    class Kaleidoscope {
      constructor(options1 = {}) {
        var key, ref, ref1, val;
        this.options = options1;
        this.defaults = {
          offsetRotation: 3, //helps place interesting devices in view at start for mobile
          pixelRatio: 2, //pixels per point
          zoom: 1, //scale the image
          offsetX: 0.0,
          offsetY: 0.0,
          radius: 400,
          slices: 12,
          alpha: true,
          drift: 0.5,
          driftRotation: 0.005,
        };
        ref = this.defaults;
        for (key in ref) {
          val = ref[key];
          this[key] = val;
        }
        ref1 = this.options;
        for (key in ref1) {
          val = ref1[key];
          this[key] = val;
        }
        if (this.domElement == null) {
          this.domElement = document.createElement('canvas');
          this.domElement.width = this.domElement.height = this.radius * 2 * this.pixelRatio;
        }
        if (this.context == null) {
          this.context = this.domElement.getContext('2d', {
            alpha: this.alpha
          });
        }
        if (this.image == null) {
          this.image = document.createElement('img');
        }
      }


      draw() {
        var cx, i, index, radius, ref, results, scale, step;

        this.domElement.width = this.domElement.height = this.radius * 2 * this.pixelRatio;
        // the line below might be slightly faster than the line above in Safari, but needs to be tested on Android/chrome because it likely produces a black background there
        // this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
        this.context.fillStyle = this.context.createPattern(this.image, 'repeat');
        scale = this.zoom;
        step = this.TWO_PI / this.slices;
        cx = this.image.width / 2;
        radius = this.radius * this.pixelRatio;
        results = [];
        for (index = i = 0, ref = this.slices; (0 <= ref ? i <= ref : i >= ref); index = 0 <= ref ? ++i : --i) {
          this.context.save();
          this.context.translate(radius, radius);
          this.context.rotate(index * step);
          this.context.beginPath();
          this.context.moveTo(-0.5, -0.5);
          this.context.arc(0, 0, radius, step * -0.51, step * 0.51);
          this.context.lineTo(0.5, 0.5);
          this.context.closePath();
          this.context.rotate(this.HALF_PI);
          this.context.scale(scale, scale);
          // console.log(scale)
          this.context.scale([-1, 1][index % 2], 1);
          this.context.translate(this.offsetX - cx, this.offsetY);
          this.context.rotate(this.offsetRotation);
          // @context.scale @offsetScale, @offsetScale
          // console.log(@offsetScale)
          this.context.fill();
          results.push(this.context.restore());
        }
        return results;
      }

    };

    Kaleidoscope.prototype.HALF_PI = Math.PI / 2;
    Kaleidoscope.prototype.TWO_PI = Math.PI * 2;

    return Kaleidoscope;

  }).call(this);

  // Init kaleidoscopes

  // bottom layer - big hedfones
  initRadius = 350; // default for slower browsers
  initPixelRatio = 1.4;
  initZoom = 0.35;
  initDrift = 2;
  initDriftRotation = 0.02;
  image = new Image;

  image.onload = () => {
    return kaleidoscope.draw();
  };

  if (fastBrowser) { // large image for larger kaleidoscope
    image.src = 'img/layer1_fast.jpg';
  } else {
    image.src = 'img/layer1_slow.jpg'; // smaller image that includes all the devices
  }

  if (fastBrowser) {
    // top layer and larger sizefor fast browsers only
    image2 = new Image;
    image2.onload = () => {
      return kaleidoscope2.draw();
    };
    image2.src = 'img/layer2_fast.png';
    initRadius = 800;
    initPixelRatio = 2;
    initZoom = 1;
    initDrift = 0.5;
    initDriftRotation = 0.005;
  }


  kaleidoscope = new Kaleidoscope({
    image: image,
    slices: 12,
    alpha: true,
    radius: initRadius,
    zoom: initZoom,
    pixelRatio: initPixelRatio,
    drift: initDrift,
    driftRotation: initDriftRotation
  });

  kaleidoscope.domElement.style.position = 'absolute';
  kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px';
  kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px';
  kaleidoscope.domElement.style.left = '50%';
  kaleidoscope.domElement.style.top = '50%';
  kaleidoscope.domElement.style.width = kaleidoscope.domElement.style.height = kaleidoscope.radius * 2 + 'px';
  kaleidoscope.domElement.style.background = '#fff';
  kaleidoscope.domElement.id = 'kaleidoscope'; //allows access for removal when video plays
  document.body.appendChild(kaleidoscope.domElement);

  if (fastBrowser) {
    kaleidoscope2 = new Kaleidoscope({
      image: image2,
      slices: 12,
      radius: initRadius,
      zoom: initZoom,
      pixelRatio: initPixelRatio,
      drift: initDrift
    });
    kaleidoscope2.domElement.style.position = 'absolute';
    kaleidoscope2.domElement.style.marginLeft = -kaleidoscope.radius + 'px';
    kaleidoscope2.domElement.style.marginTop = -kaleidoscope.radius + 'px';
    kaleidoscope2.domElement.style.left = '50%';
    kaleidoscope2.domElement.style.top = '50%';
    kaleidoscope2.domElement.style.width = kaleidoscope2.domElement.style.height = kaleidoscope2.radius * 2 + 'px';
    kaleidoscope2.domElement.id = 'kaleidoscope2'; //allows access for removal when video plays
    document.body.appendChild(kaleidoscope2.domElement);
  }

  // Mouse events
  tx = kaleidoscope.offsetX;
  ty = kaleidoscope.offsetY;
  tr = kaleidoscope.offsetRotation;
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  pageX = 0;
  pageX_last = 0;

  onMouseMoved = (event) => {
    pageX = event.pageX;
    dy = event.pageY / winHeight;
    var cx, cy, dx, dy, hx, hy;
    cx = winWidth / 2;
    cy = winHeight / 2;
    dx = pageX / winWidth;
    hx = dx - 0.5;
    hy = dy - 0.5;
    tx = hx * kaleidoscope.radius * -2;
    ty = hy * kaleidoscope.radius * 2;
    tr = (Math.atan2(hy, hx)) * 1;
    return update;
  };

  var onTouch = (event) => {
    var cx, cy, dx, dy, hx, hy;

    event.preventDefault(); // we don't want to scroll
    touch = event.touches[0];
    pageX = touch.clientX;
    dy = touch.clientY / winHeight;

    cx = winWidth / 2;
    cy = winHeight / 2;
    dx = pageX / winWidth;
    hx = dx - 0.5;
    hy = dy - 0.5;
    tx = hx * kaleidoscope.radius * -2;
    ty = hy * kaleidoscope.radius * 2;
    tr = (Math.atan2(hy, hx)) * 1;
    return update;

  };

  window.addEventListener('mousemove', onMouseMoved, false);
  window.addEventListener('touchstart', onTouch, false)


  // Init
  options = {
    interactive: true,
    ease: 0.1
  };

  (update = () => {
    // var delta, delta2, theta, theta2;
    if (options.interactive) {
      //animate when mouse not moving
      if (pageX_last === pageX) {
        tx += kaleidoscope.drift;
        ty += kaleidoscope.drift;
        tr += 0.001 * kaleidoscope.drift;
      }
      pageX_last = pageX;
      delta = tr - kaleidoscope.offsetRotation;
      theta = Math.atan2(Math.sin(delta), Math.cos(delta));
      kaleidoscope.offsetX += (tx - kaleidoscope.offsetX) * options.ease;
      kaleidoscope.offsetY += (ty - kaleidoscope.offsetY) * options.ease;
      kaleidoscope.offsetRotation += (theta - kaleidoscope.offsetRotation) * options.ease;
      kaleidoscope.draw();
      if (fastBrowser) { // second layer
        delta2 = tr + kaleidoscope.offsetRotation;
        theta2 = Math.atan2(Math.sin(delta2), Math.cos(delta2));
        kaleidoscope2.offsetX += (tx - kaleidoscope2.offsetX) * options.ease;
        kaleidoscope2.offsetY += (ty - kaleidoscope2.offsetY) * options.ease;
        kaleidoscope2.offsetRotation += (theta2 - kaleidoscope2.offsetRotation) * options.ease;
        kaleidoscope2.draw();
      }
    }
    return requestAnimationFrame(update);
  })();

  onChange = () => {
    kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px';
    kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px';
    options.interactive = false;
    return kaleidoscope.draw();
  };


}
var scopes = loadScopes();
