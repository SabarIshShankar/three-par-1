var mContainer;
var mCamera, mRenderer;
var mControls;

var mScene;

var mParticleCount = 100000;
var mParticleSystem;

var mTime = 0.0;
var mTimeStep = 1 / 60;
var mDuration = 20;

window.onload = function () {
  init();
};

function init() {
  initTHREE();
  initControls();
  initParticleSystem();

  requestAnimationFrame(tick);
  window.addEventListener("resize", resize, false);
}

function initTHREE() {
  mRenderer = new THREE.WebGLRenderer({ antialias: true });
  mRenderer.setSize(window.innerWidth, window.innerHeight);

  mContainer = document.getElementById("three-container");
  mContainer.appendChild(mRenderer.domElement);

  mCamera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  mCamera.position.set(0, 600, 600);

  mScene = new THREE.Scene();

  var light;

  light = new THREE.PointLight(0xffffff, 4, 1000, 2);
  light.position.set(0, 400, 0);
  mScene.add(light);
}

function initControls() {
  mControls = new THREE.OrbitControls(mCamera, mRenderer.domElement);
}

function initParticleSystem() {
  var prefabGeometry = new THREE.PlaneGeometry(4, 4);
  var bufferGeometry = new THREE.BAS.PrefabBufferGeometry(
    prefabGeometry,
    mParticleCount
  );

  bufferGeometry.computeVertexNormals();

  var aOffset = bufferGeometry.createAttribute("aOffset", 1);
  var aStartPosition = bufferGeometry.createAttribute("aStartPosition", 3);
  var aControlPoint1 = bufferGeometry.createAttribute("aControlPoint1", 3);
  var aControlPoint2 = bufferGeometry.createAttribute("aControlPoint2", 3);
  var aEndPosition = bufferGeometry.createAttribute("aEndPosition", 3);
  var aAxisAngle = bufferGeometry.createAttribute("aAxisAngle", 4);
  var aColor = bufferGeometry.createAttribute("color", 3);

  var i, j, offset;
  var delay;

  for (i = 0, offset = 0; i < mParticleCount; i++) {
    delay = (i / mParticleCount) * mDuration;

    for (j = 0; j < prefabGeometry.vertices.length; j++) {
      aOffset.array[offset++] = delay;
    }
  }

  var x, y, z;

  for (i = 0, offset = 0; i < mParticleCount; i++) {
    x = -1000;
    y = 0;
    z = 0;

    for (j = 0; j < prefabGeometry.vertices.length; j++) {
      aStartPosition.array[offset++] = x;
      aStartPosition.array[offset++] = y;
      aStartPosition.array[offset++] = z;
    }
  }

  for (i = 0, offset = 0; i < mParticleCount; i++) {
    x = THREE.Math.randFloat(-400, 400);
    y = THREE.Math.randFloat(400, 600);
    z = THREE.Math.randFloat(-1200, -800);

    for (j = 0; j < prefabGeometry.vertices.length; j++) {
      aControlPoint1.array[offset++] = x;
      aControlPoint1.array[offset++] = y;
      aControlPoint1.array[offset++] = z;
    }
  }

  for (i = 0, offset = 0; i < mParticleCount; i++) {
    x = THREE.Math.randFloat(-400, 400);
    y = THREE.Math.randFloat(-600, -400);
    z = THREE.Math.randFloat(800, 1200);

    for (j = 0; j < prefabGeometry.vertices.length; j++) {
      aControlPoint2.array[offset++] = x;
      aControlPoint2.array[offset++] = y;
      aControlPoint2.array[offset++] = z;
    }
  }

  for (i = 0, offset = 0; i < mParticleCount; i++) {
    x = 1000;
    y = 0;
    z = 0;

    for (j = 0; j < prefabGeometry.vertices.length; j++) {
      aEndPosition.array[offset++] = x;
      aEndPosition.array[offset++] = y;
      aEndPosition.array[offset++] = z;
    }
  }

  var axis = new THREE.Vector3();
  var angle = 0;

  for (i = 0, offset = 0; i < mParticleCount; i++) {
    axis.x = THREE.Math.randFloatSpread(2);
    axis.y = THREE.Math.randFloatSpread(2);
    axis.z = THREE.Math.randFloatSpread(2);
    axis.normalize();

    angle = Math.PI * THREE.Math.randInt(16, 32);

    for (j = 0; j < prefabGeometry.vertices.length; j++) {
      aAxisAngle.array[offset++] = axis.x;
      aAxisAngle.array[offset++] = axis.y;
      aAxisAngle.array[offset++] = axis.z;
      aAxisAngle.array[offset++] = angle;
    }
  }

  var color = new THREE.Color();
  var h, s, l;

  for (i = 0, offset = 0; i < mParticleCount; i++) {
    h = i / mParticleCount;
    s = THREE.Math.randFloat(0.4, 0.6);
    l = THREE.Math.randFloat(0.4, 0.6);

    color.setHSL(h, s, l);

    for (j = 0; j < prefabGeometry.vertices.length; j++) {
      aColor.array[offset++] = color.r;
      aColor.array[offset++] = color.g;
      aColor.array[offset++] = color.b;
    }
  }

  var material = new THREE.BAS.PhongAnimationMaterial(
    {
      vertexColors: THREE.VertexColors,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { type: "f", value: 0 },
        uDuration: { type: "f", value: mDuration }
      },
      shaderFunctions: [
        THREE.BAS.ShaderChunk["quaternion_rotation"],
        THREE.BAS.ShaderChunk["cubic_bezier"]
      ],
      shaderParameters: [
        "uniform float uTime;",
        "uniform float uDuration;",
        "attribute float aOffset;",
        "attribute vec3 aStartPosition;",
        "attribute vec3 aControlPoint1;",
        "attribute vec3 aControlPoint2;",
        "attribute vec3 aEndPosition;",
        "attribute vec4 aAxisAngle;"
      ],
      shaderVertexInit: [
        "float tProgress = mod((uTime + aOffset), uDuration) / uDuration;",

        "float angle = aAxisAngle.w * tProgress;",
        "vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);"
      ],
      shaderTransformNormal: [
        "objectNormal = rotateVector(tQuat, objectNormal);"
      ],
      shaderTransformPosition: [
        "transformed = rotateVector(tQuat, transformed);",
        "transformed += cubicBezier(aStartPosition, aControlPoint1, aControlPoint2, aEndPosition, tProgress);"
      ]
    },

    {
      specular: 0xff0000,
      shininess: 20
    }
  );

  mParticleSystem = new THREE.Mesh(bufferGeometry, material);

  mParticleSystem.frustumCulled = false;

  mScene.add(mParticleSystem);
}

function tick() {
  update();
  render();

  mTime += mTimeStep;
  mTime %= mDuration;

  requestAnimationFrame(tick);
}

function update() {
  mControls.update();

  mParticleSystem.material.uniforms["uTime"].value = mTime;
}

function render() {
  mRenderer.render(mScene, mCamera);
}

function resize() {
  mCamera.aspect = window.innerWidth / window.innerHeight;
  mCamera.updateProjectionMatrix();

  mRenderer.setSize(window.innerWidth, window.innerHeight);
}

THREE.BAS = {};

THREE.BAS.ShaderChunk = {};

THREE.BAS.ShaderChunk["animation_time"] =
  "float tDelay = aAnimation.x;\nfloat tDuration = aAnimation.y;\nfloat tTime = clamp(uTime - tDelay, 0.0, tDuration);\nfloat tProgress = ease(tTime, 0.0, 1.0, tDuration);\n";

THREE.BAS.ShaderChunk["cubic_bezier"] =
  "vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t)\n{\n    vec3 tp;\n    float tn = 1.0 - t;\n\n    tp.xyz = tn * tn * tn * p0.xyz + 3.0 * tn * tn * t * c0.xyz + 3.0 * tn * t * t * c1.xyz + t * t * t * p1.xyz;\n\n    return tp;\n}\n";

THREE.BAS.ShaderChunk["ease_in_cubic"] =
  "float ease(float t, float b, float c, float d) {\n  return c*(t/=d)*t*t + b;\n}\n";

THREE.BAS.ShaderChunk["ease_in_quad"] =
  "float ease(float t, float b, float c, float d) {\n  return c*(t/=d)*t + b;\n}\n";

THREE.BAS.ShaderChunk["ease_out_cubic"] =
  "float ease(float t, float b, float c, float d) {\n  return c*((t=t/d - 1.0)*t*t + 1.0) + b;\n}\n";

THREE.BAS.ShaderChunk["quaternion_rotation"] =
  "vec3 rotateVector(vec4 q, vec3 v)\n{\n    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n\nvec4 quatFromAxisAngle(vec3 axis, float angle)\n{\n    float halfAngle = angle * 0.5;\n    return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));\n}\n";

THREE.BAS.PrefabBufferGeometry = function (prefab, count) {
  THREE.BufferGeometry.call(this);

  this.prefabGeometry = prefab;
  this.prefabCount = count;
  this.prefabVertexCount = prefab.vertices.length;
  this.bufferDefaults();
};

THREE.BAS.PrefabBufferGeometry.prototype = Object.create(
  THREE.BufferGeometry.prototype
);
THREE.BAS.PrefabBufferGeometry.prototype.constructor =
  THREE.BAS.PrefabBufferGeometry;

THREE.BAS.PrefabBufferGeometry.prototype.bufferDefaults = function () {
  var prefabFaceCount = this.prefabGeometry.faces.length;
  var prefabIndexCount = this.prefabGeometry.face.length * 3;
  var prefabVertexCount = (this.prefabVertexCount = this.prefabGeometry.vertices.length);
  var prefabIndices = [];

  for (var h = 0; h < prefabFaceCount; h++) {
    var face = this.prefabGeometry.faces[h];
    prefabIndices.push(face.a, face.b, face.c);
  }

  var indexBuffer = new Uint32Array(this.prefabCount * prefabIndexCount);
  var positionBuffer = new Float32Array(
    this.prefabCount * prefabVertexCount * 3
  );

  this.setIndex(new THREE.BufferAttribute(indexBuffer, 1));
  this.addAttribute("position", new THREE.BufferAttribute(positionBuffer, 3));

  for (var i = 0, offset; i < this.prefabCount; i++) {
    for (var j = 0; j < prefabVertexCount; j++, offset += 3) {
      var prefabVertex = this.prefabGeometry.vertices[j];

      positionBuffer[offset] = prefabVertex.x;
      positionBuffer[offset + 1] = prefabVertex.y;
      positionBuffer[offset + 2] = prefabVertex.z;
    }

    for (var k = 0; k < prefabIndexCount; k++) {
      indexBuffer[i * prefabIndexCount + k] =
        prefabIndices[k] + i * prefabVertexCount;
    }
  }
};
