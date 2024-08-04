import React from 'react';
import { render, useFrame } from '@react-three/fiber';

const Box = (props) => {
  const meshRef = React.useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta;
  });

  return (
    <mesh ref={meshRef} position={[0, 2, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 1]} />
      <meshStandardMaterial color="#008080" />
    </mesh>
  );
};

export default Box;
