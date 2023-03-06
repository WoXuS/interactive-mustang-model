import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  leftPointLight,
  rightPointLight,
  frontPointLight,
  backPointLight,
  topDirectionalLight,
  directionalLight,
  hemisphereLight,
} from "./lights";
import { colors } from "./colors";

const tray = document.getElementById("js-tray-slide");
let activeOption = "wheels";

const scene = new THREE.Scene();

//Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });

// Floor
const floorGeometry = new THREE.CylinderGeometry(12, 12, 0.5, 64, 64);
const floorNormal = new THREE.TextureLoader().load("./images/floor-normal4.jpg");
const floorTexture = new THREE.TextureLoader().load("./images/floor4.jpg");
const floorMaterial = new THREE.MeshPhongMaterial({
  // color: 0x212121,
  map: floorTexture,
  shininess: 0,
  normalMap: floorNormal,
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
floor.position.y = -2.55;
scene.add(floor);

//Mustang
//Initial material
const initialMtl = new THREE.MeshPhongMaterial({
  color: 0xc0c0c0,
  shininess: 10,
});
const initialMap = [
  { childID: "Object_23", mtl: initialMtl, rename: "calipers" }, //calipers
  { childID: "Object_37", mtl: initialMtl, rename: "wheels" }, //wheels
];

function initColor(parent, type, mtl, rename) {
  parent.traverse((o) => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = rename; // Set a new property to identify this object
      }
    }
  });
}
const loader = new GLTFLoader();
let mustang;
loader.load(
  "./mustang/scene.gltf",
  function (gltf) {
    mustang = gltf.scene;
    mustang.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
      }
    });
    mustang.position.set(0, 0, 0);
    tl.fromTo(floor.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
    tl.fromTo(mustang.position, { z: 0, x: 0, y: 20 }, { z: 0, x: 0, y: 0 });
    tl.fromTo(".controls", { y: "-100%" }, { y: "0%" });
    tl.fromTo(".options", { opacity: "0" }, { opacity: "1" });
    for (let object of initialMap) {
      initColor(mustang, object.childID, object.mtl, object.rename);
    }
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {}
);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Lights
scene.add(
  leftPointLight,
  rightPointLight,
  frontPointLight,
  backPointLight,
  hemisphereLight,
  directionalLight,
  topDirectionalLight
);

//Helpers
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight
// );
// scene.add(directionalLightHelper);

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(11, 3, 25);
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 2;
controls.maxPolarAngle = Math.PI / 2;

//Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Function - Build Colors
function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement("div");
    swatch.classList.add("tray-swatch");

    if (color.texture) {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else {
      swatch.style.background = "#" + color.color;
    }
    swatch.style.width = "50px";
    swatch.style.height = "50px";

    swatch.setAttribute("data-key", i);
    tray.append(swatch);
  }
}
buildColors(colors);

// Select Option
const options = document.querySelectorAll(".option");

for (const option of options) {
  option.addEventListener("click", selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove("--is-active");
  }
  option.classList.add("--is-active");
}

const swatches = document.querySelectorAll(".tray-swatch");

for (const swatch of swatches) {
  swatch.addEventListener("click", selectSwatch);
}

function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

  if (color.texture) {
    let txt = new THREE.TextureLoader().load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;

    new_mtl = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10,
    });
  } else {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt("0x" + color.color),
      shininess: color.shininess ? color.shininess : 10,
    });
  }

  setMaterial(mustang, activeOption, new_mtl);
}

function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}
