//引入库
import * as THREE from "three";
//引入渲染器
import { AnimationClip, DoubleSide, MeshDepthMaterial, WebGLRenderer } from "three";
//引入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Stats from "three/examples/jsm/libs/stats.module.js"
//添加场景
const scene=new THREE.Scene();
//创建透视相机
const camera=new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 2000);
camera.position.set( -8,3,-7 );
camera.lookAt( 0,3,0 );
let mixer,clock,modal,idleaction,walkaction,runaction,Tposeaction;
let settings,skeleton,actions;
clock = new THREE.Clock();
let singleStepMode = false;
let sizeOfNextStep = 0;
//将相机加入场景
scene.add(camera);
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
scene.color="#00ff00"
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 0, 10, - 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 5;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 59;
scene.add( dirLight );
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(- 3, 10, - 10 );
scene.add(light);
//设置平面
const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false ,side:DoubleSide} ) );
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );
const gui=new dat.GUI();
const loader=new FBXLoader();
//const draco=new DRACOLoader();
//draco.setDecoderPath('draco/');
//loader.setDRACOLoader(draco);
loader.load("model/Catwalk.fbx",function (object){
    mixer =new THREE.AnimationMixer(object);
    
    object.scale.set(.02,.02,.02);
    object.traverse( function ( child ) {

        if ( child.isMesh ) {

            child.castShadow = true;
            child.receiveShadow = true;

        }

    } );
    const action =mixer.clipAction(object.animations[0]);
   action.play();
   console.log(object);
   scene.add(object);

    //skeleton = new THREE.SkeletonHelper( modal );
    //skeleton.visible = false;
    //scene.add( skeleton );
    //CreatePanel();
    //const animations =gltf.animations;
    //console.log(animations[0]);
    // mixer=new THREE.AnimationMixer(modal);
    // runaction=mixer.clipAction(animations[1])
    // walkaction =mixer.clipAction(animations[3]);
    // idleaction=mixer.clipAction(animations[0]);
    // Tposeaction=mixer.clipAction(animations[2]);
    // actions=[idleaction,walkaction,runaction]
    // walkaction.play();
    animate();

})
function CreatePanel()
{
    const panel = new dat.GUI( { width: 310 } );

	const folder1 = panel.addFolder( 'Visibility' );
	const folder2 = panel.addFolder( 'Activation/Deactivation' );
	const folder4 = panel.addFolder( 'Crossfading' );
	const folder5 = panel.addFolder( 'Blend Weights' );
	const folder6 = panel.addFolder( 'General Speed' );
    settings={
        'show modal':true,
        'show skeleton':false,
        'deactivations':deactivateActions,
        'activations':activations,
        'modify idle weight': 0.0,
		'modify walk weight': 1.0,
		'modify run weight': 0.0,
		'modify time scale': 1.0
    }
    folder1.add(settings,'show modal').onChange((value)=>{
        modal.visible = value;
    })
    folder1.add(settings,'show skeleton').onChange((value1)=>{
        skeleton.visible=value1;
    })
    folder2.add(settings,'deactivations')
    folder2.add(settings,'activations')
    folder5.add(settings,'modify idle weight', 0.0, 1.0, 0.01).listen().onChange(function (weight){
        setWeight( idleaction, weight );
    })
    folder5.add(settings,'modify walk weight', 0.0, 1.0, 0.01).listen().onChange(function (weight){
        setWeight( walkaction, weight );
    })
    folder5.add(settings,'modify run weight', 0.0, 1.0, 0.01).listen().onChange(function (weight){
        setWeight( runaction, weight );
    })
    
}
function deactivateActions() {

    actions.forEach( function ( action ) {

        action.stop();

    } );

}
function activations(){
    setWeight( idleaction, 0.0 );
    setWeight( runaction, 0.0 );
    setWeight( walkaction, 5.0 );
    actions.forEach( function ( action ) {

        action.play();

    } );

}
function setWeight( action, weight ) {

    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );

}
//初始化渲染器
const renderer = new WebGLRenderer();
//设置渲染尺寸大小
renderer.setSize(window.innerWidth,window.innerHeight);
//将渲染的内容添加到布局对象
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement)
//renderer.render(scene,camera)


//添加坐标轴辅助器
//const Axehelper= new THREE.AxesHelper(5);
//scene.add(Axehelper)

//创建轨道控制器，相机围绕物体旋转
const controls= new OrbitControls(camera,renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

function animate() 
{
    controls.update();
    let mixerUpdateDelta = clock.getDelta();
    mixer.update(mixerUpdateDelta);
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
};

//animate();
window.addEventListener("resize", () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });