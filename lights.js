import * as THREE from "three";

export const leftPointLight = new THREE.PointLight(0xc4c4c4);
leftPointLight.position.set(-20, 0, 0);

export const rightPointLight = new THREE.PointLight(0xc4c4c4);
rightPointLight.position.set(20, 0, 0);

export const frontPointLight = new THREE.PointLight(0xc4c4c4);
frontPointLight.position.set(0, 0, 30);

export const backPointLight = new THREE.PointLight(0xc4c4c4);
backPointLight.position.set(0, 0, -30);

export const topDirectionalLight = new THREE.PointLight(0xc4c4c4, 0);
topDirectionalLight.position.set(0, 3, 0);

export const directionalLight = new THREE.DirectionalLight(0xc4c4c4, 1);
directionalLight.castShadow = true;
directionalLight.position.set(4, 12, -10);
directionalLight.shadow.mapSize = new THREE.Vector2(512, 512);

export const hemisphereLight = new THREE.HemisphereLight(
  0xc4c4c4,
  0xc4c4c4,
  0.4
);
