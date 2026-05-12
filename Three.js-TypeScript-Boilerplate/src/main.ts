/** 
 * TREE JS PROJECT 
 * Instalation Tutorial, Addons and Functions listed: https://threejs.org/docs/#ArcballControls
*/
import './style.css'
import * as THREE from 'three' 
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

/** 
 * Creating a Scene
 * A Scene (also referred to as graph) allows you to set up, in 3D coordinates, what is to be rendered by Three.js. It can also contain objects, cameras and lights.
 */
const scene1 = new THREE.Scene()
const scene2 = new THREE.Scene()
const scene3 = new THREE.Scene()
const scene4 = new THREE.Scene()


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
renderer.shadowMap.enabled = true


/**
 * Scene background options
 * as color scene.background = new THREE.Color(0xE9ECED)  
 * as image scene.background = new THREE.TextureLoader().load('https://sbcode.net/img/grid.png')
 * as skybox option scene.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']) 
 */
scene1.background = new THREE.Color(0xE9ECED)
scene3.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
scene3.environment = scene3.background
// can use many loader for many img types, such as TextureLoader, CubeTextureLoader, HDRCubeTextureLoader, RGBELoader, EXRLoader, etc
new HDRLoader().load('/imgs/beach.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene4.environment = texture
  scene4.background = texture
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
 * Orbit controls rendering options
 * optional: render whenever the camera moves, must add a first render before animation, and remove other render
 */
// controls.addEventListener('change', () => {
//   renderer.render(scene, camera)
// })


/**
 * Materials
 */
const material = new THREE.MeshNormalMaterial({ wireframe: true })
// In the case of PBR materials, such as MeshStandardMaterial and MeshPhysicalMaterial,
//  we have the choice of setting the scene environment map, rather than placing multiple lights.
const basicMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// Reflective material
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1,     // totalmente metálico
  roughness: 0.05   // bem reflexivo (quase espelho)
})


/**
 * CustomMaterials
 */
const map = new THREE.TextureLoader().load('/textures/sprite.png');
const customMaterial = new THREE.MeshStandardMaterial({ map: map });


/**
 * Geometries and shapes 
 */
const BoxGeometry = new THREE.BoxGeometry()
const SmallBoxGeometry = new THREE.BoxGeometry(.5, .5, .5)


/**
 * Grid Plane
 */
const grid = new THREE.GridHelper(100, 200, 0x444444, 0x2a2a2a)
grid.material.opacity = 0.1
grid.material.transparent = true
grid.position.set(0, -.5, 0)
scene1.add(grid)


/**
 * Normal Plane
 */
const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xffffff }))
plane.rotation.x = -Math.PI / 2
plane.position.set(0, -.5, 0)
scene2.add(plane)


/**
 * Meshs between materials and geometries
 */
const cube = new THREE.Mesh(BoxGeometry, material)
const cubeColored = new THREE.Mesh(BoxGeometry, basicMaterial)
const cubeCustom = new THREE.Mesh(BoxGeometry, customMaterial)
const smallCube = new THREE.Mesh(SmallBoxGeometry, material)
const metalCube = new THREE.Mesh(BoxGeometry, metalMaterial)

/**
 * Adding meshs to the scene
 */
scene1.add(cube)
scene2.add(cubeColored)
scene3.add(cubeCustom)
scene4.add(metalCube)

/**
 * Adding object hierarchy to the scene
 */
cube.add(smallCube)


/**
 *  Object position (in this case relative to cube)
 */
smallCube.position.set(0, 0, 0)

/**
 *  Liighting
 * AmbientLight illuminates the whole scene in all directions.
 * DirectionalLight illuminates the whole scene in 1 direction.
 * PointLight illuminates in all directions from a 3D position. Distance and decay can be managed.
 * SpotLight illuminates in 1 direction from a 3D position. Distance, decay, angle, penumbra and target can be managed.
 */
// Luz tipo farol (SpotLight)
const light = new THREE.SpotLight(0xffffff, Math.PI)
light.position.set(3, 2, 3)
light.target.position.set(0, 0, 0)
light.angle = Math.PI * 0.09     // abertura do feixe
light.penumbra = 0.1            // suavidade nas bordas
light.decay = 1                // queda da luz
light.distance = 20            // alcance
scene2.add(light)
scene2.add(light.target)
//Luz Ambiente Iluminando o cubo
const ambientLight = new THREE.AmbientLight(0xebfeff, Math.PI / 16)
ambientLight.intensity = 1.5
scene3.add(ambientLight)
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Shadows
 */
plane.receiveShadow = true
plane.castShadow = true
cubeColored.castShadow = true
light.castShadow = true
cubeCustom.castShadow = true
ambientLight.castShadow = true

/**
 * DAT GUI Screen Options Extension
 * Simple interface to interact with scene, object and camera
 * Auto adapt to int, float, color, boolean and function
 * dat.GUI still works very well, but it is no longer maintained, in case of errors migration to LIL-GUI can be performed.
 */
const gui = new GUI()
const cubeFolder = gui.addFolder('Visibility')
cubeFolder.add(cube, 'visible')
const rotationFolder = gui.addFolder('Rotation')
rotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
rotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
rotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
const positionFolder = gui.addFolder('Position')
positionFolder.add(cube.position, 'x', -5, 5)
positionFolder.add(cube.position, 'y', -5, 5)
positionFolder.add(cube.position, 'z', -5, 5)
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 20)
cameraFolder.add(camera.position, 'x', 0, 20)
cameraFolder.add(camera.position, 'y', 0, 20)
const scaleFolder = gui.addFolder('Scale')
scaleFolder.add(cube.scale, 'x', -5, 5)
scaleFolder.add(cube.scale, 'y', -5, 5)
scaleFolder.add(cube.scale, 'z', -5, 5)
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
   scene4: () => {
     activeScene = scene4
   }
}
gui.add(setScene, 'scene1').name('Cube')
gui.add(setScene, 'scene2').name('Cube Colored')
gui.add(setScene, 'scene3').name('Cube Custom')
gui.add(setScene, 'scene4').name('Metal Cube')

/**
 * Frame rate independence
 * allows animation to run at same speed regardless of the frame rate
 * THREE.Clock deprecated, use THREE.Timer instead
 */
const timer = new THREE.Timer();
let delta


/**
 * Animation loop
 * requestAnimationFrame() tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint.
 * The method takes a callback as an argument to be invoked before the repaint.
 * The callback is passed a single argument, a DOMHighResTimeStamp, which indicates the current time when requestAnimationFrame() starts to execute callback functions.
 */
function animate() {
  timer.update()
  delta = timer.getDelta()
  requestAnimationFrame(animate)
  // cube.rotation.x += delta
  // cube.rotation.y += delta
  // cubeCustom.rotation.x += delta
  // cubeCustom.rotation.y += delta
  // cubeColored.rotation.x += delta
  // cubeColored.rotation.y += delta
  renderer.render(activeScene, camera)
  stats.update()
}

animate()