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

const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

const flagTexture = textureLoader.load('./assets/textures/flags/estonia.png');
flagTexture.encoding = THREE.sRGBEncoding;
flagTexture.minFilter = THREE.NearestFilter;

const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTexture: {
      value: flagTexture,
    },
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
  },
});

gui
  .add(material.uniforms.uFrequency.value, 'x')
  .min(0)
  .max(20)
  .step(0.01)
  .name('X Frequency');

gui
  .add(material.uniforms.uFrequency.value, 'y')
  .min(0)
  .max(20)
  .step(0.01)
  .name('Y Frequency');

const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
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

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
