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

  window.addEventListenet("resize", resize, false);
}

function initTHREE() {
  mRenderer = new THREE.WebGLRenderer({ antialias: true });

  mRenderer.setSize(window.innerWidth, window.innerHeight);
  mContainer = document.getElementById("container");
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
  var bufferGeometry = new THREE.BAS.PrefabBufferGeomtry(
    prefabGeometry,
    mParticleCount
  );

  bufferGeometry.computeVertexNormals();
}
