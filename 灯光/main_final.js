import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { MeshBasicMaterial } from "three";

// const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true;

scene.add(sphere);

// // 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
scene.add(plane);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.1); // soft white light
scene.add(light);

//点光源
const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
smallBall.position.set(2, 2, 2);
const pointLight = new THREE.PointLight(0xff0000, 5);
pointLight.castShadow = true;
pointLight.shadow.radius = 20;
pointLight.shadow.mapSize.set(512, 512);
pointLight.decay = 0;
smallBall.add(pointLight);
scene.add(smallBall);

//聚光灯
const smallLight = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  smallLight.position.set(2, 2, 2);
  const spotLight = new THREE.SpotLight(0x0000ff, 5);
  spotLight.castShadow = true;
  spotLight.shadow.radius = 20;
  spotLight.shadow.mapSize.set(512, 512);
  spotLight.decay = 0;
  smallLight.add(spotLight);
  scene.add(smallLight);

//平行光
const smallDirect = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  smallDirect.position.set(2, 2, 2);
  const directLight = new THREE.DirectionalLight(0x00ff00, 5);
  directLight.castShadow = true;
  directLight.shadow.radius = 20;
  directLight.shadow.mapSize.set(512, 512);
  directLight.decay = 0;
  smallDirect.add(directLight);
  scene.add(smallDirect);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  let time = clock.getElapsedTime();
  smallBall.position.x = -Math.sin(time) * 3;
  smallBall.position.z = -Math.cos(time) * 3;
  smallBall.position.y = 2 ;//+ Math.sin(time * 10) / 2;
  smallLight.position.x = Math.sin(time) * 8;
  smallLight.position.z = Math.cos(time) * 8;
  smallLight.position.y = 2 ;//+ Math.sin(time * 10) / 2;
  smallDirect.position.x = Math.sin(time) * 3 + 3;
  smallDirect.position.z = Math.cos(time) * 3 + 3;
  smallDirect.position.y = 2 ;//+ Math.sin(time * 10) / 2;
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
