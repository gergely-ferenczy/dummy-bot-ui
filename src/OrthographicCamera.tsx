import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react';

type Props = Omit<JSX.IntrinsicElements['orthographicCamera'], 'children'> & {
  /** Registers the camera as the system default, fiber will start rendering with it */
  makeDefault?: boolean;
  /** Making it manual will stop responsiveness and you have to calculate aspect ratio yourself. */
  manual?: boolean;
  /** The contents will either follow the camera, or be hidden when filming if you pass a function */
  children?: ReactNode | ((texture: THREE.Texture) => ReactNode);
  /** Number of frames to render, Infinity */
  frames?: number;
  /** Resolution of the FBO, 256 */
  resolution?: number;
  /** Optional environment map for functional use */
  envMap?: THREE.Texture;
};

export const OrthographicCamera = forwardRef<THREE.OrthographicCamera, Props>(
  ({ children, ...props }: Props, ref) => {
    const set = useThree(({ set }) => set);
    const camera = useThree(({ camera }) => camera);
    const size = useThree(({ size }) => size);
    const cameraRef = useRef<THREE.OrthographicCamera>(null!);
    useImperativeHandle(ref, () => cameraRef.current, []);

    const aspect = size.width / size.height;

    useLayoutEffect(() => {
      const camera = cameraRef.current;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      console.log('useLayoutEffect [aspect, set]');
    }, [aspect, set]);

    // useLayoutEffect(() => {
    //   cameraRef.current.updateProjectionMatrix()
    //   console.log("useLayoutEffect 2")
    // })

    useLayoutEffect(() => {
      const oldCam = camera;
      set({ camera: cameraRef.current });

      console.log('useLayoutEffect 3');
      return () => set(() => ({ camera: oldCam }));
    }, [camera, cameraRef, set]);

    console.log('render');

    return (
      <orthographicCamera
        left={size.width / -2}
        right={size.width / 2}
        top={size.height / 2}
        bottom={size.height / -2}
        ref={cameraRef}
        {...props}
      />
    );
  }
);
