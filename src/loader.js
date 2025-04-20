import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export const loadModel = (
  scene,
  path,
  { position = [0, 0, 0], scale = [1, 1, 1] } = {}
) => {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(...position);
        model.scale.set(...scale);
        scene.add(model);
        resolve(model);
      },
      undefined,
      (error) => reject(error)
    );
  });
};
