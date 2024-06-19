import { CubeTextureLoader, type Group, type Object3DEventMap, Scene, TextureLoader } from "three";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export const loadCar = (): Promise<Group<Object3DEventMap>> => {
  const fbxLoader = new FBXLoader();
  return new Promise<Group>((resolve, reject) => {
    fbxLoader.load(
      "./assets/3d-model/911-turbo.fbx",
      (object) => {
        const car = object;
        car.scale.set(0.01, 0.01, 0.01); // Scale the car if necessary
        resolve(car);
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error("An error happened", error);
        reject(error);
      },
    );
  });
};

export function loadScene(): Scene {
  // Basic setup
  const scene = new Scene();

  // Load the skybox
  const loader = new CubeTextureLoader();
  const skyboxTexture = loader.load([
    "./assets/textures/px.jpg",
    "./assets/textures/nx.jpg",
    "./assets/textures/py.jpg",
    "./assets/textures/ny.jpg",
    "./assets/textures/pz.jpg",
    "./assets/textures/nz.jpg",
  ]);
  scene.background = skyboxTexture;

  const textureLoader = new TextureLoader();

  // Creating the track with texture and normal map
  const groundTexture = textureLoader.load("./assets/textures/ground2.png");
  const groundNormalMap = textureLoader.load("./assets/textures/groundNormalMap.jpg");
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(100, 100);
  groundNormalMap.wrapS = THREE.RepeatWrapping;
  groundNormalMap.wrapT = THREE.RepeatWrapping;
  groundNormalMap.repeat.set(10, 10);

  const trackGeometry = new THREE.PlaneGeometry(200, 200);
  const trackMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    normalMap: groundNormalMap,
  });
  const track = new THREE.Mesh(trackGeometry, trackMaterial);
  track.rotation.x = -Math.PI / 2;
  scene.add(track);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(50, 50, 50);
  scene.add(directionalLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);
  return scene;
}
