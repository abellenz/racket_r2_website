(function() {
  // Detect fast browser
  var DragDrop, Kaleidoscope, agent, fastBrowser, image, image2, initDrift, initPixelRatio, initRadius, initZoom, kaleidoscope, kaleidoscope2, onChange, onMouseMoved, options, pageX, pageX_last, tr, tx, ty, update, winHeight, winWidth;

  agent = navigator.userAgent;

  console.log(agent);

  fastBrowser = true;

  if (agent.indexOf('Safari') > 0 && agent.indexOf('Chrome') < 0) {
    fastBrowser = false;
  }

  if (agent.indexOf('Android') > 0) {
    fastBrowser = false;
  }

  Kaleidoscope = (function() {
    class Kaleidoscope {
      constructor(options1 = {}) {
        var key, ref, ref1, val;
        this.options = options1;
        this.defaults = {
          offsetRotation: 0.5, //helps place interesting devices in view at start for mobile
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
        this.context.fillStyle = this.context.createPattern(this.image, 'repeat');
        scale = this.zoom; //@zoom * ( @radius / Math.min @image.width, @image.height )
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

  // Drag & Drop
  DragDrop = class DragDrop {
    constructor(callback, context = document, filter = /^image/i) {
      var disable;
      this.onDrop = this.onDrop.bind(this);
      this.callback = callback;
      this.context = context;
      this.filter = filter;
      disable = function(event) {
        event.stopPropagation();
        return event.preventDefault();
      };
      this.context.addEventListener('dragleave', disable);
      this.context.addEventListener('dragenter', disable);
      this.context.addEventListener('dragover', disable);
      this.context.addEventListener('drop', this.onDrop, false);
    }

    onDrop(event) {
      var file, reader;
      event.stopPropagation();
      event.preventDefault();
      file = event.dataTransfer.files[0];
      if (this.filter.test(file.type)) {
        reader = new FileReader;
        reader.onload = (event) => {
          return typeof this.callback === "function" ? this.callback(event.target.result) : void 0;
        };
        return reader.readAsDataURL(file);
      }
    }

  };

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
    image.src = 'https://share.getcloudapp.com/items/X6uzezGK/download'; // large image that includes all the devices
  } else {
    image.src = 'https://share.getcloudapp.com/items/kpuYKnLZ/download';
  }

  if (fastBrowser) {
    // top layer and larger sizefor fast browsers only
    image2 = new Image;
    image2.onload = () => {
      return kaleidoscope2.draw();
    };
    image2.src = 'https://share.getcloudapp.com/items/Qwu7E5JX/download';
    initRadius = 800;
    initPixelRatio = 2;
    initZoom = 1;
    initDrift = 0.5;
    initDriftRotation = 0.005;
  }

  kaleidoscope = new Kaleidoscope({
    image: image,
    slices: 12,
    alpha: false,
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
  kaleidoscope.domElement.style.backgroundColor = '#fff';
  document.body.appendChild(kaleidoscope.domElement);


  // dpr = window.devicePixelRatio || 1;
  // rect = kal1.getBoundingClientRect();
  // kal1.width = rect.width * dpr;
  // kal1.height = rect.height * dpr;
  // console.log(dpr)

  // ctx = kal1.getContext('2d');
  // ctx.scale(dpr, dpr);
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
    document.body.appendChild(kaleidoscope2.domElement);
  }

  // Init drag & drop of image onto kaleidoscopes
  // dragger = new DragDrop ( data ) -> kaleidoscope.image.src = data
  // dragger2 = new DragDrop ( data ) -> kaleidoscope2.image.src = data

  // Mouse events
  tx = kaleidoscope.offsetX;

  ty = kaleidoscope.offsetY;

  tr = kaleidoscope.offsetRotation;

  winWidth = window.innerWidth;

  winHeight = window.innerHeight;

  pageX = 0;

  pageX_last = 0;

  onMouseMoved = (event) => {
    var cx, cy, dx, dy, hx, hy;
    pageX = event.pageX;
    cx = winWidth / 2;
    cy = winHeight / 2;
    dx = pageX / winWidth;
    dy = event.pageY / winHeight;
    hx = dx - 0.5;
    hy = dy - 0.5;
    tx = hx * kaleidoscope.radius * -2;
    ty = hy * kaleidoscope.radius * 2;
    tr = (Math.atan2(hy, hx)) * 1;
    return update;
  };

  window.addEventListener('mousemove', onMouseMoved, false);


  // Init
  options = {
    interactive: true,
    ease: 0.1
  };

  (update = () => {
    var delta, delta2, theta, theta2;
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
    return setTimeout(update, 1000 / 30);
  })();

  onChange = () => {
    kaleidoscope.domElement.style.marginLeft = -kaleidoscope.radius + 'px';
    kaleidoscope.domElement.style.marginTop = -kaleidoscope.radius + 'px';
    options.interactive = false;
    return kaleidoscope.draw();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsUUFBQSxFQUFBLFlBQUEsRUFBQSxLQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBLGNBQUEsRUFBQSxVQUFBLEVBQUEsUUFBQSxFQUFBLFlBQUEsRUFBQSxhQUFBLEVBQUEsUUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBOztFQUVBLEtBQUEsR0FBUSxTQUFTLENBQUM7O0VBQ2xCLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWjs7RUFDQSxXQUFBLEdBQWM7O0VBQ2QsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLFFBQWQsQ0FBQSxHQUEwQixDQUExQixJQUErQixLQUFLLENBQUMsT0FBTixDQUFjLFFBQWQsQ0FBQSxHQUEwQixDQUE1RDtJQUNFLFdBQUEsR0FBYyxNQURoQjs7O0VBRUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLFNBQWQsQ0FBQSxHQUEyQixDQUE5QjtJQUNFLFdBQUEsR0FBYyxNQURoQjs7O0VBSU07SUFBTixNQUFBLGFBQUE7TUFLRSxXQUFhLFlBQWEsQ0FBQSxDQUFiLENBQUE7QUFFWCxZQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBO1FBRmEsSUFBQyxDQUFBO1FBRWQsSUFBQyxDQUFBLFFBQUQsR0FDRTtVQUFBLGNBQUEsRUFBZ0IsR0FBaEI7VUFDQSxVQUFBLEVBQVksQ0FEWjtVQUVBLElBQUEsRUFBTSxDQUZOO1VBR0EsT0FBQSxFQUFTLEdBSFQ7VUFJQSxPQUFBLEVBQVMsR0FKVDtVQUtBLE1BQUEsRUFBUSxHQUxSO1VBTUEsTUFBQSxFQUFRLEVBTlI7VUFPQSxLQUFBLEVBQU8sSUFQUDtVQVFBLEtB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QUFqQixDQUFBLEVBUkY7T0FuQkY7O1dBNkJBLFVBQUEsQ0FBVyxNQUFYLEVBQW1CLElBQUEsR0FBSyxFQUF4QjtFQTlCVSxDQUFULENBQUgsQ0FBQTs7RUFpQ0EsUUFBQSxHQUFXLENBQUEsQ0FBQSxHQUFBO0lBRVQsWUFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBOUIsR0FBMkMsQ0FBQyxZQUFZLENBQUMsTUFBZCxHQUF1QjtJQUNsRSxZQUFZLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUE5QixHQUEwQyxDQUFDLFlBQVksQ0FBQyxNQUFkLEdBQXVCO0lBRWpFLE9BQU8sQ0FBQyxXQUFSLEdBQXNCO1dBRW5CLFlBQVksQ0FBQyxJQUFoQixDQUFBO0VBUFM7QUFsUFgiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgRGV0ZWN0IGZhc3QgYnJvd3NlclxuYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50XG5jb25zb2xlLmxvZyhhZ2VudClcbmZhc3RCcm93c2VyID0gdHJ1ZVxuaWYgYWdlbnQuaW5kZXhPZignU2FmYXJpJykgPiAwICYmIGFnZW50LmluZGV4T2YoJ0Nocm9tZScpIDwgMFxuICBmYXN0QnJvd3NlciA9IGZhbHNlXG5pZiBhZ2VudC5pbmRleE9mKCdBbmRyb2lkJykgPiAwXG4gIGZhc3RCcm93c2VyID0gZmFsc2VcblxuXG5jbGFzcyBLYWxlaWRvc2NvcGVcbiAgXG4gIEhBTEZfUEk6IE1hdGguUEkgLyAyXG4gIFRXT19QSTogTWF0aC5QSSAqIDJcbiAgXG4gIGNvbnN0cnVjdG9yOiAoIEBvcHRpb25zID0ge30gKSAtPiBcbiAgICBcbiAgICBAZGVmYXVsdHMgPVxuICAgICAgb2Zmc2V0Um90YXRpb246IDAuMFxuICAgICAgcGl4ZWxSYXRpbzogMiAjcGl4ZWxzIHBlciBwb2ludFxuICAgICAgem9vbTogMSAjc2NhbGUgdGhlIGltYWdlXG4gICAgICBvZmZzZXRYOiAwLjBcbiAgICAgIG9mZnNldFk6IDAuMFxuICAgICAgcmFkaXVzOiA0MDBcbiAgICAgIHNsaWNlczogMTJcbiAgICAgIGFscGhhOiB0cnVlXG4gICAgICBkcmlmdDogMC41XG4gICAgICAgIFxuICAgIEBbIGtleSBdID0gdmFsIGZvciBrZXksIHZhbCBvZiBAZGVmYXVsdHNcbiAgICBAWyBrZXkgXSA9IHZhbCBmb3Iga2V5LCB2YWwgb2YgQG9wdGlvbnNcbiAgICAgIFxuICAgIEBkb21FbGVtZW50ID89IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2NhbnZhcydcbiAgICBAY29udGV4dCA/PSBAZG9tRWxlbWVudC5nZXRDb250ZXh0ICcyZCcsIHsgYWxwaGE6IEBhbHBoYSB9XG4gICAgQGltYWdlID89IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2ltZydcbiAgICBcbiAgZHJhdzogLT5cblxuICAgIEBkb21FbGVtZW50LndpZHRoID0gQGRvbUVsZW1lbnQuaGVpZ2h0ID0gQHJhZGl1cyAqIDIgKiBAcGl4ZWxSYXRpb1xuICAgIEBjb250ZXh0LmZpbGxTdHlsZSA9IEBjb250ZXh0LmNyZWF0ZVBhdHRlcm4gQGltYWdlLCAncmVwZWF0J1xuICAgIFxuICAgIHNjYWxlID0gQHpvb20gI0B6b29tICogKCBAcmFkaXVzIC8gTWF0aC5taW4gQGltYWdlLndpZHRoLCBAaW1hZ2UuaGVpZ2h0ICkgXG4gICAgc3RlcCA9IEBUV09fUEkgLyBAc2xpY2VzXG4gICAgY3ggPSBAaW1hZ2Uud2lkdGggLyAyIFxuICAgIHJhZGl1cyA9IEByYWRpdXMgKiBAcGl4ZWxSYXRpb1xuXG4gICAgZm9yIGluZGV4IGluIFsgMC4uQHNsaWNlcyBdXG4gICAgICBcbiAgICAgIEBjb250ZXh0LnNhdmUoKVxuICAgICAgQGNvbnRleHQudHJhbnNsYXRlIHJhZGl1cywgcmFkaXVzXG4gICAgICBAY29udGV4dC5yb3RhdGUgaW5kZXggKiBzdGVwIFxuICAgICAgXG4gICAgICBAY29udGV4dC5iZWdpblBhdGgoKVxuICAgICAgQGNvbnRleHQubW92ZVRvIC0wLjUsIC0wLjVcbiAgICAgIEBjb250ZXh0LmFyYyAwLCAwLCByYWRpdXMsIHN0ZXAgKiAtMC41MSwgc3RlcCAqIDAuNTFcbiAgICAgIEBjb250ZXh0LmxpbmVUbyAwLjUsIDAuNVxuICAgICAgQGNvbnRleHQuY2xvc2VQYXRoKClcbiAgICAgIFxuICAgICAgQGNvbnRleHQucm90YXRlIEBIQUxGX1BJXG4gICAgICBAY29udGV4dC5zY2FsZSBzY2FsZSwgc2NhbGVcbiAgICAgICMgY29uc29sZS5sb2coc2NhbGUpXG4gICAgICBAY29udGV4dC5zY2FsZSAoWy0xLDFdW2luZGV4ICUgMl0pLCAxXG4gICAgICBAY29udGV4dC50cmFuc2xhdGUgQG9mZnNldFggLSBjeCwgQG9mZnNldFlcbiAgICAgIEBjb250ZXh0LnJvdGF0ZSBAb2Zmc2V0Um90YXRpb25cbiAgICAgICMgQGNvbnRleHQuc2NhbGUgQG9mZnNldFNjYWxlLCBAb2Zmc2V0U2NhbGVcbiAgICAgICMgY29uc29sZS5sb2coQG9mZnNldFNjYWxlKVxuICAgICAgXG4gICAgICBAY29udGV4dC5maWxsKClcbiAgICAgIEBjb250ZXh0LnJlc3RvcmUoKVxuXG4jIERyYWcgJiBEcm9wXG4gIFxuY2xhc3MgRHJhZ0Ryb3BcbiAgXG4gIGNvbnN0cnVjdG9yOiAoIEBjYWxsYmFjaywgQGNvbnRleHQgPSBkb2N1bWVudCwgQGZpbHRlciA9IC9eaW1hZ2UvaSApIC0+XG4gICAgXG4gICAgZGlzYWJsZSA9ICggZXZlbnQgKSAtPlxuICAgICAgZG8gZXZlbnQuc3RvcFByb3BhZ2F0aW9uXG4gICAgICBkbyBldmVudC5wcmV2ZW50RGVmYXVsdFxuICAgIFxuICAgIEBjb250ZXh0LmFkZEV2ZW50TGlzdGVuZXIgJ2RyYWdsZWF2ZScsIGRpc2FibGVcbiAgICBAY29udGV4dC5hZGRFdmVudExpc3RlbmVyICdkcmFnZW50ZXInLCBkaXNhYmxlXG4gICAgQGNvbnRleHQuYWRkRXZlbnRMaXN0ZW5lciAnZHJhZ292ZXInLCBkaXNhYmxlXG4gICAgQGNvbnRleHQuYWRkRXZlbnRMaXN0ZW5lciAnZHJvcCcsIEBvbkRyb3AsIG5vXG4gICAgICBcbiAgb25Ecm9wOiAoIGV2ZW50ICkgPT5cbiAgICBcbiAgICBkbyBldmVudC5zdG9wUHJvcGFnYXRpb25cbiAgICBkbyBldmVudC5wcmV2ZW50RGVmYXVsdFxuICAgICAgXG4gICAgZmlsZSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlc1swXVxuICAgIFxuICAgIGlmIEBmaWx0ZXIudGVzdCBmaWxlLnR5cGVcbiAgICAgIFxuICAgICAgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSAoIGV2ZW50ICkgPT4gQGNhbGxiYWNrPyBldmVudC50YXJnZXQucmVzdWx0XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTCBmaWxlXG5cbiMgSW5pdCBrYWxlaWRvc2NvcGVzXG5cbiMgYm90dG9tIGxheWVyIC0gYmlnIGhlZGZvbmVzXG5pbml0UmFkaXVzID0gMzUwICMgZGVmYXVsdCBmb3Igc2xvd2VyIGJyb3dzZXJzXG5pbml0UGl4ZWxSYXRpbyA9IDEuNFxuaW5pdFpvb20gPSAwLjM1IFxuaW5pdERyaWZ0ID0gMVxuaW1hZ2UgPSBuZXcgSW1hZ2VcbmltYWdlLm9ubG9hZCA9ID0+IGRvIGthbGVpZG9zY29wZS5kcmF3XG5cbmlmIGZhc3RCcm93c2VyICMgbGFyZ2UgaW1hZ2UgZm9yIGxhcmdlciBrYWxlaWRvc2NvcGVcbiAgaW1hZ2Uuc3JjID0gJ2h0dHBzOi8vc2hhcmUuZ2V0Y2xvdWRhcHAuY29tL2l0ZW1zL1g2dXplekdLL2Rvd25sb2FkJ1xuZWxzZSAjIGxhcmdlIGltYWdlIHRoYXQgaW5jbHVkZXMgYWxsIHRoZSBkZXZpY2VzXG4gIGltYWdlLnNyYyA9ICdodHRwczovL3NoYXJlLmdldGNsb3VkYXBwLmNvbS9pdGVtcy9rcHVZS25MWi9kb3dubG9hZCdcbiAgXG5pZiBmYXN0QnJvd3NlclxuICAjIHRvcCBsYXllciBhbmQgbGFyZ2VyIHNpemVmb3IgZmFzdCBicm93c2VycyBvbmx5XG4gIGltYWdlMiA9IG5ldyBJbWFnZVxuICBpbWFnZTIub25sb2FkID0gPT4gZG8ga2FsZWlkb3Njb3BlMi5kcmF3XG4gIGltYWdlMi5zcmMgPSAnaHR0cHM6Ly9zaGFyZS5nZXRjbG91ZGFwcC5jb20vaXRlbXMvUXd1N0U1SlgvZG93bmxvYWQnXG4gIGluaXRSYWRpdXMgPSA4MDBcbiAgaW5pdFBpeGVsUmF0aW8gPSAyXG4gIGluaXRab29tID0gMVxuICBpbml0RHJpZnQgPSAwLjVcblxua2FsZWlkb3Njb3BlID0gbmV3IEthbGVpZG9zY29wZVxuICBpbWFnZTogaW1hZ2VcbiAgc2xpY2VzOiAxMlxuICBhbHBoYTogZmFsc2VcbiAgcmFkaXVzOiBpbml0UmFkaXVzXG4gIHpvb206IGluaXRab29tXG4gIHBpeGVsUmF0aW86IGluaXRQaXhlbFJhdGlvXG4gIGRyaWZ0OiBpbml0RHJpZnRcblxua2FsZWlkb3Njb3BlLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG5rYWxlaWRvc2NvcGUuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gLWthbGVpZG9zY29wZS5yYWRpdXMgKyAncHgnXG5rYWxlaWRvc2NvcGUuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW5Ub3AgPSAta2FsZWlkb3Njb3BlLnJhZGl1cyArICdweCdcbmthbGVpZG9zY29wZS5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJ1xua2FsZWlkb3Njb3BlLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzUwJSdcbmthbGVpZG9zY29wZS5kb21FbGVtZW50LnN0eWxlLndpZHRoID0ga2FsZWlkb3Njb3BlLmRvbUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0ga2FsZWlkb3Njb3BlLnJhZGl1cyAqIDIgKyAncHgnXG5rYWxlaWRvc2NvcGUuZG9tRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZidcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQga2FsZWlkb3Njb3BlLmRvbUVsZW1lbnQgXG5cbiMgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiMgcmVjdCA9IGthbDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4jIGthbDEud2lkdGggPSByZWN0LndpZHRoICogZHByO1xuIyBrYWwxLmhlaWdodCA9IHJlY3QuaGVpZ2h0ICogZHByO1xuIyBjb25zb2xlLmxvZyhkcHIpXG5cbiMgY3R4ID0ga2FsMS5nZXRDb250ZXh0KCcyZCcpO1xuIyBjdHguc2NhbGUoZHByLCBkcHIpO1xuIFxuXG5pZiBmYXN0QnJvd3NlclxuICBrYWxlaWRvc2NvcGUyID0gbmV3IEthbGVpZG9zY29wZVxuICAgIGltYWdlOiBpbWFnZTJcbiAgICBzbGljZXM6IDEyXG4gICAgcmFkaXVzOiBpbml0UmFkaXVzXG4gICAgem9vbTogaW5pdFpvb21cbiAgICBwaXhlbFJhdGlvOiBpbml0UGl4ZWxSYXRpb1xuICAgIGRyaWZ0OiBpbml0RHJpZnRcblxuICBrYWxlaWRvc2NvcGUyLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gIGthbGVpZG9zY29wZTIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gLWthbGVpZG9zY29wZS5yYWRpdXMgKyAncHgnXG4gIGthbGVpZG9zY29wZTIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW5Ub3AgPSAta2FsZWlkb3Njb3BlLnJhZGl1cyArICdweCdcbiAga2FsZWlkb3Njb3BlMi5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJ1xuICBrYWxlaWRvc2NvcGUyLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzUwJSdcbiAga2FsZWlkb3Njb3BlMi5kb21FbGVtZW50LnN0eWxlLndpZHRoID0ga2FsZWlkb3Njb3BlMi5kb21FbGVtZW50LnN0eWxlLmhlaWdodCA9IGthbGVpZG9zY29wZTIucmFkaXVzICogMiArICdweCdcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBrYWxlaWRvc2NvcGUyLmRvbUVsZW1lbnRcblxuXG4jIEluaXQgZHJhZyAmIGRyb3Agb2YgaW1hZ2Ugb250byBrYWxlaWRvc2NvcGVzXG4jIGRyYWdnZXIgPSBuZXcgRHJhZ0Ryb3AgKCBkYXRhICkgLT4ga2FsZWlkb3Njb3BlLmltYWdlLnNyYyA9IGRhdGFcbiMgZHJhZ2dlcjIgPSBuZXcgRHJhZ0Ryb3AgKCBkYXRhICkgLT4ga2FsZWlkb3Njb3BlMi5pbWFnZS5zcmMgPSBkYXRhXG4gIFxuIyBNb3VzZSBldmVudHNcbiAgXG50eCA9IGthbGVpZG9zY29wZS5vZmZzZXRYXG50eSA9IGthbGVpZG9zY29wZS5vZmZzZXRZXG50ciA9IGthbGVpZG9zY29wZS5vZmZzZXRSb3RhdGlvblxud2luV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxud2luSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG5wYWdlWCA9IDBcbnBhZ2VYX2xhc3QgPSAwXG5cbm9uTW91c2VNb3ZlZCA9ICggZXZlbnQgKSA9PlxuICBwYWdlWCA9IGV2ZW50LnBhZ2VYXG4gIFxuICBjeCA9IHdpbldpZHRoIC8gMlxuICBjeSA9IHdpbkhlaWdodCAvIDJcbiAgICAgICAgICAgICAgICBcbiAgZHggPSBwYWdlWCAvIHdpbldpZHRoXG4gIGR5ID0gZXZlbnQucGFnZVkgLyB3aW5IZWlnaHRcbiAgICAgICAgICAgICAgICBcbiAgaHggPSBkeCAtIDAuNVxuICBoeSA9IGR5IC0gMC41XG4gICAgICAgICAgICAgICAgXG4gIHR4ID0gaHggKiBrYWxlaWRvc2NvcGUucmFkaXVzICogLTJcbiAgdHkgPSBoeSAqIGthbGVpZG9zY29wZS5yYWRpdXMgKiAyXG4gIHRyID0gKE1hdGguYXRhbjIgaHksIGh4KSAqIDFcblxuICB1cGRhdGVcbiAgIFxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlZCwgbm9cbiAgICAgICAgICAgICAgICBcbiMgSW5pdFxuICBcbm9wdGlvbnMgPVxuICBpbnRlcmFjdGl2ZTogeWVzXG4gIGVhc2U6IDAuMVxuICAgICAgICAgICAgICAgIFxuZG8gdXBkYXRlID0gPT5cbiAgaWYgb3B0aW9ucy5pbnRlcmFjdGl2ZVxuXG4gICAgI2FuaW1hdGUgd2hlbiBtb3VzZSBub3QgbW92aW5nXG4gICAgaWYgcGFnZVhfbGFzdCA9PSBwYWdlWFxuICAgICAgdHggKz0ga2FsZWlkb3Njb3BlLmRyaWZ0XG4gICAgICB0eSArPSBrYWxlaWRvc2NvcGUuZHJpZnRcbiAgICAgIHRyICs9IDAuMDAxICoga2FsZWlkb3Njb3BlLmRyaWZ0XG4gICAgXG4gICAgcGFnZVhfbGFzdCA9IHBhZ2VYXG4gICAgXG4gICAgZGVsdGEgPSB0ciAtIGthbGVpZG9zY29wZS5vZmZzZXRSb3RhdGlvblxuICAgIHRoZXRhID0gTWF0aC5hdGFuMiggTWF0aC5zaW4oIGRlbHRhICksIE1hdGguY29zKCBkZWx0YSApIClcbiAgICAgICAgICAgICAgICBcbiAgICBrYWxlaWRvc2NvcGUub2Zmc2V0WCArPSAoIHR4IC0ga2FsZWlkb3Njb3BlLm9mZnNldFggKSAqIG9wdGlvbnMuZWFzZVxuICAgIGthbGVpZG9zY29wZS5vZmZzZXRZICs9ICggdHkgLSBrYWxlaWRvc2NvcGUub2Zmc2V0WSApICogb3B0aW9ucy5lYXNlXG4gICAga2FsZWlkb3Njb3BlLm9mZnNldFJvdGF0aW9uICs9ICggdGhldGEgLSBrYWxlaWRvc2NvcGUub2Zmc2V0Um90YXRpb24gKSAqIG9wdGlvbnMuZWFzZVxuICAgIFxuICAgIGRvIGthbGVpZG9zY29wZS5kcmF3XG5cbiAgICBpZiBmYXN0QnJvd3NlciAjIHNlY29uZCBsYXllclxuICAgICAgZGVsdGEyID0gdHIgKyBrYWxlaWRvc2NvcGUub2Zmc2V0Um90YXRpb25cbiAgICAgIHRoZXRhMiA9IE1hdGguYXRhbjIoIE1hdGguc2luKCBkZWx0YTIgKSwgTWF0aC5jb3MoIGRlbHRhMiApIClcblxuICAgICAga2FsZWlkb3Njb3BlMi5vZmZzZXRYICs9ICggdHggLSBrYWxlaWRvc2NvcGUyLm9mZnNldFggKSAqIG9wdGlvbnMuZWFzZVxuICAgICAga2FsZWlkb3Njb3BlMi5vZmZzZXRZICs9ICggdHkgLSBrYWxlaWRvc2NvcGUyLm9mZnNldFkgKSAqIG9wdGlvbnMuZWFzZVxuICAgICAga2FsZWlkb3Njb3BlMi5vZmZzZXRSb3RhdGlvbiArPSAoIHRoZXRhMiAtIGthbGVpZG9zY29wZTIub2Zmc2V0Um90YXRpb24gKSAqIG9wdGlvbnMuZWFzZVxuXG4gICAgICBkbyBrYWxlaWRvc2NvcGUyLmRyYXdcblxuICBzZXRUaW1lb3V0IHVwZGF0ZSwgMTAwMC8zMFxuICAgIFxuXG5vbkNoYW5nZSA9ID0+XG4gIFxuICBrYWxlaWRvc2NvcGUuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gLWthbGVpZG9zY29wZS5yYWRpdXMgKyAncHgnXG4gIGthbGVpZG9zY29wZS5kb21FbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IC1rYWxlaWRvc2NvcGUucmFkaXVzICsgJ3B4J1xuICAgIFxuICBvcHRpb25zLmludGVyYWN0aXZlID0gbm9cbiAgICBcbiAgZG8ga2FsZWlkb3Njb3BlLmRyYXdcblxuIl19
//# sourceURL=coffeescript
