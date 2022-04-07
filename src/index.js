import './styles.css';

import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import fragmentShader from './shaders/test/fragment.frag';
import vertexShader from './shaders/test/vertex.vert';

const { body } = document;
const canvas = document.createElement('canvas');
canvas.classList.add('webgl');
body.appendChild(canvas);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();

const scene = new THREE.Scene();

const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.5, 0, 1);
camera.lookAt(mesh.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.render(scene, camera);

const updateRendererSizeAndPixelRatio = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

updateRendererSizeAndPixelRatio();

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () => {
  const updateSizes = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  };

  const updateCameraAspectRatio = () => {
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  };

  updateSizes();
  updateCameraAspectRatio();
  updateRendererSizeAndPixelRatio();
});

const tick = () => {
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
