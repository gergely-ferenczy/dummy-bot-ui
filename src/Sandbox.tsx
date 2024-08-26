import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react';
import {
  Canvas,
  OrthographicCameraProps,
  useFrame,
  useThree
} from '@react-three/fiber';
import * as THREE from 'three';
// import { OrthographicCamera } from '@react-three/drei';

function RotatingCube() {
  const cubeRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    cubeRef.current.rotation.x += 0.01;
    cubeRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

const OrthographicCamera = forwardRef<
  THREE.OrthographicCamera,
  OrthographicCameraProps
>(function (props, ref) {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  const camera = useThree(({ camera }) => camera);
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);
  const aspect = size.width / size.height;

  useImperativeHandle(ref, () => cameraRef.current!, []);

  useLayoutEffect(() => {
    const camera = cameraRef.current!;
    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    console.log('camera', camera.top, camera.bottom, camera.left, camera.right);
    camera.updateProjectionMatrix();
    // set({ camera });
    console.log('useLayoutEffect [aspect, set]');
  }, [aspect, set]);

  useLayoutEffect(() => {
    const oldCam = camera;
    set(() => ({ camera: cameraRef.current! }));
    return () => set(() => ({ camera: oldCam }));
  }, [camera, cameraRef, set]);

  useLayoutEffect(() => {
    cameraRef.current!.updateProjectionMatrix();
    console.log('useLayoutEffect []');
  }, []);

  return <orthographicCamera ref={cameraRef} {...props} />;
});

function Scene() {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);

  useEffect(() => {
    console.log('Scene', cameraRef);
    if (cameraRef.current) {
      cameraRef.current.lookAt(1, 0, 0);
    }
  });

  console.log('Scene render');
  return (
    <Canvas>
      <OrthographicCamera
        position={[0, 0, 10]}
        zoom={0.5}
        near={0.1}
        far={1000}
        ref={cameraRef}
      />
      <ambientLight />
      <RotatingCube />
    </Canvas>
  );
}

export default function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Scene />
    </div>
  );
}
