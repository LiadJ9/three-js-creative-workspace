import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './loader';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
const TXloader = new THREE.TextureLoader();
const baseUrl = import.meta.env.BASE_URL;
// ORBIT CONTROLS ////

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // optional: adds smooth motion
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0); // focus point (optional)
//////////////////////

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.6, // strength
  0.7, // radius
  0.8 // threshold
);
composer.addPass(bloomPass);

// ### SETUP PIVOTS //
const sunPivot = new THREE.Object3D();
const sunPivot2 = new THREE.Object3D();
const jupiterPivot = new THREE.Object3D();
jupiterPivot.position.set(18, 0, 0);

scene.add(sunPivot, sunPivot2, jupiterPivot);
///////////////////////

TXloader.load(`${baseUrl}envs/space.jpg`, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  scene.background = texture;
  scene.backgroundBlurriness = 0.02;
  scene.environment = texture;
});
let cd;
let jupiter;
let sun;
let donut;
let eightBall;
Promise.all([
  loadModel(scene, `${baseUrl}models/CD.glb`, {
    position: [12, 0.5, 8],
    scale: [0.4, 0.4, 0.4],
  }),
  loadModel(scene, `${baseUrl}models/Jupiter.glb`, {
    position: [18, 0, 0],
    scale: [0.02, 0.02, 0.02],
  }),
  loadModel(scene, `${baseUrl}models/Sun.glb`, {
    position: [0, 0, 0],
    scale: [6, 6, 6],
  }),
  loadModel(scene, `${baseUrl}models/Moon.glb`, {
    position: [3.5, 2, 0],
  }),
  loadModel(scene, `${baseUrl}models/Donut.glb`, {
    position: [0, 0, 8],
    scale: [0.7, 0.7, 0.7],
  }),
  loadModel(scene, `${baseUrl}models/Eight_ball.glb`, {
    position: [20, 0, 20],
    scale: [2, 2, 2],
  }),
]).then(
  ([loadedCd, Ljupiter, loadedSun, loadedMoon, loadedDonut, loadedEight]) => {
    cd = loadedCd;
    jupiter = Ljupiter;
    sun = loadedSun;
    donut = loadedDonut;
    eightBall = loadedEight;
    sunPivot.add(jupiter, jupiterPivot, loadedEight);
    sunPivot2.add(donut, cd);
    jupiterPivot.add(loadedMoon);

    const light = new THREE.PointLight(0xffe0b3, 1500, 6000);
    sun.add(light);
    sun.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffe0b3);
        child.material.emissiveIntensity = 1.5;
        child.material.toneMapped = true;
      }
    });
  }
);

camera.position.z = 15;

function animate() {
  if (cd) {
    cd.rotation.x += 0.02;
    cd.rotation.y += 0.02;
  }
  if (sun) {
    sun.rotation.y += 0.001;
  }
  if (jupiter) {
    jupiter.rotation.y -= 0.02;
  }
  if (donut) {
    donut.rotation.x += 0.018;
    donut.rotation.y += 0.02;
  }
  if (eightBall) {
    eightBall.rotation.y += 0.03;
  }
  sunPivot.rotation.y += 0.001;
  jupiterPivot.rotation.y += 0.01;
  sunPivot2.rotation.y += 0.012;

  controls.update();
  composer.render();
}
renderer.setAnimationLoop(animate);
