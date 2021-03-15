import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap, Power0, Power1, Power2, Power3, Circ, SteppedEase } from "gsap";
import * as dat from "dat.gui";

const gui = new dat.GUI();

let debugObj = {
  rotationDuration: 1,
  easing: Power2,
};

// Textures

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {};
loadingManager.onLoad = () => {};
loadingManager.onProgress = () => {};
loadingManager.onError = () => {};

const textureLoader = new THREE.CubeTextureLoader();

// const colorTexture = textureLoader.load("/textures/space.jpg");
const envMap = textureLoader.load([
  "/textures/environmentMaps/1/1024/px.png",
  "/textures/environmentMaps/1/1024/nx.png",
  "/textures/environmentMaps/1/1024/py.png",
  "/textures/environmentMaps/1/1024/ny.png",
  "/textures/environmentMaps/1/1024/pz.png",
  "/textures/environmentMaps/1/1024/nz.png",
]);
envMap.encoding = THREE.sRGBEncoding;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

scene.background = envMap;
scene.environment = envMap;
/**
 * Object
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1;

scene.rotation.x = -2.02;
// scene.rotation.y = 0;
// scene.rotation.z = 0;

scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/* 
  Cursor
*/
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
  gsap.to(camera.rotation, {
    x: -cursor.y * 0.1,
    y: cursor.x * 0.1,
    ease: Power0.easeIn,
    duration: debugObj.rotationDuration,
  });
});
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// gui.add(scene.rotation, 'x').min(-10).max(10).step(0.01)
// gui.add(scene.rotation, 'y').min(-10).max(10).step(0.01)
// gui.add(scene.rotation, 'z').min(-10).max(10).step(0.01)
// console.log(camera.rotation);

gui.add(debugObj, "rotationDuration").min(0).max(3).step(0.01);
// gui
//   .add(debugObj, "easing", {
//     "Power0":Power0,
//     "Power1":Power1,
//     "Power2":Power2,
//     "Power3":Power3,
//     "Circ":Circ,
//     "SteppedEase":SteppedEase
//   }).onFinishChange(obj => {
//     debugObj.easing = obj
//     console.log(obj);
//   })
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
