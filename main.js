import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

window.onresize = () => {
  location.reload();
};

const startingZ = 5000;
const speed = .5;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(-startingZ);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const gltfLoader = new GLTFLoader();

gltfLoader.load('assets/Hanger.gltf', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.position.set(-50, -4.5, -startingZ)
})

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(-3, -3, -startingZ-50)
pointLight.castShadow = true;
scene.add(pointLight);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color:0x4287f5});
const torus = new THREE.Mesh(geometry, material);
torus.position.set(-40, 0, -3980)
scene.add(torus);

const geometry2 = new THREE.BoxGeometry(10, 10, 20);
const cube = new THREE.Mesh( geometry2, material );
cube.position.set(-40, -20,-4950);
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);

//const gridHelper = new THREE.GridHelper(200, 50)
//scene.add(gridHelper);
const starGeometry = new THREE.SphereGeometry(.75, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({color:0xffffff});

function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(3000));

  star.position.set(x, y, z - 2500);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

const galleryButton = document.getElementById("galleryButton");
var galleryEnd = -6269; 
var galleryButtonClicked = false;
galleryButton.onclick = () => {
  const galleryViewport = document.getElementById("galleryViewport");
  if (!galleryButtonClicked) {
    galleryButtonClicked = true;
    galleryButton.innerHTML = "TERMINATE CONNECTION:";

    galleryViewport.style.height = "280vh";
    galleryEnd = -7731;

    const images = document.getElementsByClassName("gallery-image");
    for (var i = 0; i < images.length; i++) {
      images[i].style.opacity = '1';
    }
  } else {
    galleryButtonClicked = false;
    galleryButton.innerHTML = "INITIALIZE CONNECTION:";

    galleryViewport.style.height = "100vh";
    galleryEnd = -6269;
    
    const images = document.getElementsByClassName("gallery-image");
    for (var i = 0; i < images.length; i++) {
      images[i].style.opacity = '0';
    }
  }
}

function scrollAnimation() {
  const t = document.body.getBoundingClientRect().top;
  console.log(t);

  camera.position.z = t * -speed - startingZ;
  cube.position.z = t * -speed - (startingZ - 50);

  const overlay = document.getElementById("overlay");
  if (t < -179) {
    overlay.style.filter = "invert(100%)";
    if (t < -7851) {
      overlay.style.opacity = '0';
    } else {
      overlay.style.opacity = '1';
    }
  } else {
    overlay.style.filter = "invert(0%)";
  }

  const introTitle = document.getElementById("introTitle");
  const introSubtitle = document.getElementById("introSubtitle");
  const introBody = document.getElementById("introBody");
  

  const teamPage = document.getElementById("teamPage");
  const leftBar = document.getElementById("leftBar");
  const rightBar = document.getElementById("rightBar");
  if (t < -3446 && t > -4482) {
    teamPage.style.opacity = '1';
    overlay.style.opacity = '0';
    leftBar.style.left = '-1%'
    rightBar.style.right = '0'
  } else {
    teamPage.style.opacity = '0';
    if (t < -1380 && t > -2000) {
      introTitle.style.opacity = '1';
      introSubtitle.style.opacity = '1';
      introBody.style.opacity = '1';
    } else {
      introTitle.style.opacity = '0';
      introSubtitle.style.opacity = '0';
      introBody.style.opacity = '0';
    }
    leftBar.style.left = '-11%'
    rightBar.style.right = '-11%'
  }

  const galleryTitle = document.getElementById("galleryTitle");
  const galleryText = document.getElementById("galleryText");
  const galleryButton = document.getElementById("galleryButton");
  const galleryImages = document.getElementsByClassName("gallery-image");
  if (t < -5334 && t > galleryEnd) {
    galleryTitle.style.opacity = '1';
    galleryText.style.opacity = '1';
    galleryButton.style.opacity = '1';
    
    if (galleryButtonClicked) {
      for (var i = 0; i < galleryImages.length; i++) {
        galleryImages[i].style.opacity = '1';
      }
    }
  } else {
    galleryTitle.style.opacity = '0';
    galleryText.style.opacity = '0';
    galleryButton.style.opacity = '0';

    if (galleryButtonClicked) {
      for (var i = 0; i < galleryImages.length; i++) {
        galleryImages[i].style.opacity = '0';
      }
    }
  }

  if (t < -250 && t > -1923) {
    cube.position.x = t * -0.04 - 40;
  }
  
  if (t < -2576 && t > -3840) {
    
    cube.position.x = t * 0.04 + 140;
  }

  if (t < -4173 && t > -5000) {
    
    cube.position.x = t * -0.04 - 180;
  }
  //console.log(cube.position.x);
}

document.body.onscroll = scrollAnimation;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();