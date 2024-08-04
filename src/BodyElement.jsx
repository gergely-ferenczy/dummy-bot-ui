import React from 'react';
import * as THREE from 'three';

import { useTheme } from '@mui/material/styles';

const BodyElement = (props) => {
  const theme = useTheme();

  const verticalVec = THREE.Object3D.DefaultUp;
  const startVec = new THREE.Vector3(
    props.start[0],
    props.start[1],
    props.start[2]
  );
  const endVec = new THREE.Vector3(props.end[0], props.end[1], props.end[2]);
  const legVec = endVec.clone().sub(startVec);
  const middleVec = legVec.clone().divideScalar(2).add(startVec);
  const normalVec = verticalVec.clone().cross(legVec).normalize();
  const length = legVec.length();
  const angle = verticalVec.angleTo(endVec.clone().sub(startVec));
  const width = props.width || 0.001;

  const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(normalVec, angle);

  let material;
  let materialHighlight;
  if (theme.palette.mode == 'dark') {
    material = (
      <meshStandardMaterial color={props.color || theme.palette.primary.main} />
    );
    materialHighlight = (
      <meshStandardMaterial color={theme.palette.secondary.main} />
    );
  } else {
    material = (
      <meshStandardMaterial color={props.color || theme.palette.primary.main} />
    );
    materialHighlight = (
      <meshStandardMaterial color={theme.palette.secondary.main} />
    );
  }

  let startBump;
  if (props.startBump) {
    startBump = (
      <mesh castShadow position={startVec}>
        <sphereGeometry args={[width * 2]} />
        {material}
      </mesh>
    );
  }
  let endBump;
  if (props.endBump) {
    endBump = (
      <mesh castShadow position={endVec}>
        <sphereGeometry args={[width * 2]} />
        {!props.highlight && material}
        {props.highlight && materialHighlight}
      </mesh>
    );
  }

  return (
    <group>
      <mesh castShadow position={middleVec} quaternion={quaternion}>
        <cylinderGeometry args={[width, width, length]} />
        {material}
      </mesh>
      {startBump}
      {endBump}
    </group>
  );
};

export default BodyElement;
