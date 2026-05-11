/** 
 * TREE JS PROJECT 
 * Instalation Tutorial, Addons and Functions listed: https://threejs.org/docs/#ArcballControls
*/
import './style.css'
import * as THREE from 'three' 
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

/** 
 * Creating a Scene
 * A Scene (also referred to as graph) allows you to set up, in 3D coordinates, what is to be rendered by Three.js
 * as color scene.background = new THREE.Color(0xE9ECED)  
 * as image scene.background = new THREE.TextureLoader().load('https://sbcode.net/img/grid.png')
 * as skybox option scene.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
 */
const scene1 = new THREE.Scene()
scene1.background = new THREE.Color(0xE9ECED)
const scene2 = new THREE.Scene()
scene2.background = new THREE.Color(0x10162e)
const scene3 = new THREE.Scene()
scene3.background = new THREE.Color(0x10162e)

/**
 * Creating a Camera
 * There are several types of Cameras in Threejs
 * - PerspectiveCamera( fov, aspect, near, far ) : simulates the way the human eye sees. Objects that are further away appear smaller.
 * - OrthographicCamera( left, right, top, bottom, near, far ) : objects appear the same size regardless of their distance from the camera.
 * - CubeCamera( near, far, renderTarget ) : used for creating environment maps. It renders the scene from six different angles to create a cube map.
 * - ArrayCamera( cameras ) : allows you to use multiple cameras in a single scene, useful for multi-view or VR applications.
 * - StereoCamera() : creates a stereo effect by rendering the scene from two slightly different perspectives, one for each eye.
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1.5


/** Creating a Renderer 
 * The most common Renderer used in Three.js is the WebGLRenderer, but also support a custom canvas as an HTML element.
 * It paints the scene and camera information onto a HTML Canvas Element.
 * WebGL allows GPU-accelerated image processing
 * Will dynamically add a new HTMLCanvasElement to the HTML document for use when rendering.
 * antialias: true handles serrilhado
*/
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // render whenever the screen size changes 
  // renderer.render(scene, camera)
})


/**
 * Performance Monitoring Options Addon
 * https://github.com/mrdoob/stats.js
 */
const stats = new Stats()
document.body.appendChild(stats.dom)
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom


/**
 * Orbit controls
 * allow the camera to orbit around a target.
 */
new OrbitControls(camera, renderer.domElement)


/**
 * Materials
 */
const material = new THREE.MeshNormalMaterial({ wireframe: true })
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// custom material
const map = new THREE.TextureLoader().load('/textures/sprite.png');
const customMaterial = new THREE.MeshBasicMaterial({ map: map });

/**
 * Geometries and shapes 
 */
const BoxGeometry = new THREE.BoxGeometry()

/**
 * Meshs between materials and geometries
 */
const cube = new THREE.Mesh(BoxGeometry, material)
const cubeColored = new THREE.Mesh(BoxGeometry, basicMaterial)
const cubeCustom = new THREE.Mesh(BoxGeometry, customMaterial)

/**
 * Adding meshs to the scene
 */
scene1.add(cube)
scene2.add(cubeColored)
scene3.add(cubeCustom)


/**
 * DAT GUI Screen Options Extension
 * Simple interface to interact with scene, object and camera
 * Auto adapt to int, float, color, boolean and function
 */
const gui = new GUI()
const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
cubeFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 20)
cameraFolder.add(camera.position, 'x', 0, 20)
cameraFolder.add(camera.position, 'y', 0, 20)
cameraFolder.open()
let activeScene = scene1
const setScene = {
   scene1: () => {
     activeScene = scene1
   },
   scene2: () => {
     activeScene = scene2
   },
   scene3: () => {
     activeScene = scene3
   },
}
gui.add(setScene, 'scene1').name('Scene 1')
gui.add(setScene, 'scene2').name('Scene 2')
gui.add(setScene, 'scene3').name('Scene 3')


function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  cubeCustom.rotation.x += 0.01
  cubeCustom.rotation.y += 0.01
  cubeColored.rotation.x += 0.01
  cubeColored.rotation.y += 0.01
  renderer.render(activeScene, camera)
  stats.update()
}

animate()