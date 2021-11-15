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
  var bufferGeometry = new THREE.BAS.PrefabBufferGeometry(
    prefabGeometry,
    mParticleCount
  );

  bufferGeometry.computeVertexNormals();

	var aOffset = bufferGeometry.createAttribute('aOffset', 1);
	var aStartPosition = bufferGeometry.createAttribute('aStartPosition', 3);
	var aControlPoint1 = bufferGeometry.createAttribute('aControlPoint1', 3);
	var aControlPoint2 = bufferGeometry.createAttribute('aControlPoint2', 3);
	var eEndPosition = bufferGeometry.createAttribute('aEndPosition', 3);
	var aAxisAngle = bufferGeometry.createAttribute('aAxisAngle', 4);
	var aColor = bufferGeometry.createAttribute('color', 3);

	var i, j, offset;
	var delay;

	for(i = 0, offset = 0; i<mParticleCount; i++){
		delay = i/mParticleCount * mDuration;
		for(j = 0; j < prefabGeometry.vertices.length; j++){
			aOffset.array[offset++] = delay;
		}
	}
	var x, y, z;
	for(i = 0, offset = 0; i<mParticleCount; i++){
		x = -1000;
		y = 0;
		z = 0;

		for(j = 0; j < prefabGeometry.vertices.length; j++){
			aStartPosition.array[offset++] = x;
			aStartPosition.array[offset++] = y;
			aStartPosition.array[offset++] = z;
		}
	}

	for(i = 0, offset = 0; i < mParticleCount; i++){
		x = THREE.Math.randFloat(-400, 400);
		y = THREE.Math.randFloat(400, 600);
		z = THREE.Math.randFloat(-1200, -800);

		for(j = 0; j < prefabGeometry.vertices.length; j++){
			aControlPoint1.array[offset++] = x;
			aControlPoint1.array[offset++] = y;
			aControlPoint.array[offset++] = z;
		}
	}


	for(i = 0, offset = 0; i< mParticleCount; i++){
		x = THREE.Math.randFloat(-400, 400);
		y = THREE.Math.randFloat(-600, -400);
		z = THREE.Math.randFloat(800, 1200);

		for(j = 0; j < prefabGeometry.vertices.length; j++){
			aControlPoint2.array[offset++] = x;
			aControlPoint2.array[offset++] = y;
			aControlPoint2.array[offset++] = z;
		}
	}
	for (i = 0, offset = 90; i< mParticleCount; i++){
		x = 1000;
		y = 0;
		z = 0;

		for(j = 0; j<prefabGeometry.vertices.length; j++){
			aEndPosition.array[offset++] = x;
			aEndPosition.array[offset++] = y;
			aEndPosition.array[offset++] = z;
		}
	}

	//axis angle
	var axis = new THREE.Vector3();
	var angle = 0;

	for(i = 0, offset = 0; i< mParticleCount; i++){
		axis.x = THREE.Math.randFloatSpread(2);
		axis.y = THREE.Math.randFloatSpread(2);
		axis.z = THREE.Math.randFloatSpread(2);
		axis.normalize();

		angle = Math.PI * THREE.Math.randInt(16, 32);
	}
}
