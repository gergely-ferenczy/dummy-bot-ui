import React from 'react'
import * as THREE from 'three';

const BodyElement = (props) => {

  const verticalVec = new THREE.Vector3(0,1,0);
  const startVec = new THREE.Vector3(props.start[0], props.start[1], props.start[2]);
  const endVec = new THREE.Vector3(props.end[0], props.end[1], props.end[2]);
  const legVec = endVec.clone().sub(startVec);
  const middleVec = legVec.clone().divideScalar(2).add(startVec);
  const normalVec = verticalVec.clone().cross(legVec).normalize();
  const length = legVec.length();
  const angle = (verticalVec.angleTo(endVec.clone().sub(startVec)))
  const width = props.width || 0.001;

  const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(normalVec, angle);

  let startBump;
  if (props.startBump) {
    startBump = <mesh castShadow position={startVec} >
        <sphereGeometry args={[width * 2]} />
        <meshStandardMaterial color='#008080' />
      </mesh>;
  }
  let endBump;
  if (props.endBump) {
    endBump = <mesh castShadow position={endVec} >
        <sphereGeometry args={[width * 2]} />
        <meshStandardMaterial color='#008080' />
      </mesh>;
  }

  return (
    <group>
      <mesh castShadow position={middleVec} quaternion={quaternion} >
        <cylinderGeometry args={[width, width, length]} />
        <meshStandardMaterial color='#008080' />
      </mesh>
      {startBump}
      {endBump}
    </group>
  )
}

export default BodyElement
