import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { loadModel } from './loader';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const TXloader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.85 // threshold
);
composer.addPass(bloomPass);

TXloader.load('/envs/space.jpg', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  scene.background = texture;
  scene.environment = texture;
});
let star;
let planet1;
let sun;
Promise.all([
  loadModel(scene, '/models/Star.glb', {
    position: [6, 2, -1],
    scale: [1.5, 1.5, 1.5],
  }),
  loadModel(scene, '/models/Planet.glb', {
    position: [-5, -1, 0],
    scale: [0.7, 0.7, 0.7],
  }),
  loadModel(scene, '/models/Sun.glb', {
    position: [0, -5, 0],
    scale: [6, 6, 6],
  }),
]).then(([loadedStar, loadedPlanet1, loadedSun]) => {
  star = loadedStar;
  planet1 = loadedPlanet1;
  sun = loadedSun;

  const light = new THREE.PointLight(0xffcc66, 80, 300);
  sun.add(light);
  sun.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color(0xffcc66);
      child.material.emissiveIntensity = 1.5;
      child.material.toneMapped = true;
    }
  });
});

camera.position.z = 5;

function animate() {
  if (star) {
    star.rotation.y += 0.02;
    star;
  }
  if (planet1) {
    planet1.rotation.y += 0.005;
  }
  if (sun) {
    sun.rotation.y += 0.001;
  }
  composer.render();
}
renderer.setAnimationLoop(animate);
