import deepEqual from 'deep-equal'
import * as THREE from 'three'
import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, GizmoHelper, GizmoViewcube, Plane } from '@react-three/drei'

import './App.css'
import BodyElement from './BodyElement'

const ENV_SIZE = { x: 0.4, y: 0.4, z: 0.4 }


const ControlPacket = {
  speed: 0.2,
  step: [0.04, 0.0, 0.0],
  step_height: 0.3,
  move: false
};
const BackendChannel = new WebSocket("ws://localhost:8080");




const App = () => {
  const [posData, _setPosData] = useState();
  const posDataRef = React.useRef(posData);
  const setPosData = data => {
    posDataRef.current = data;
    _setPosData(data);
  };

  useEffect(() => {
    BackendChannel.onmessage = (event) => {
      const newPosData = JSON.parse(event.data);
      if (!deepEqual(posDataRef.current, newPosData)) {
        setPosData(newPosData);
      }
    }
    return () => { BackendChannel.onmessage == null; };
  }, []);


  let minLegHeightPos;
  let bodyPlaneNormal;
  let bodyPlaneRotation;
  const minLegPositions = [];

  if (posData) {    
    minLegPositions[1] = new THREE.Vector3(posData.legs[0][2][0], posData.legs[0][2][1], posData.legs[0][2][2]);
    minLegPositions[2] = new THREE.Vector3(posData.legs[0][2][0], posData.legs[0][2][1], posData.legs[0][2][2]);
    
    for (var i = 0; i < 6; i++) {
      minLegPositions[i] = new THREE.Vector3(posData.legs[i][2][0], posData.legs[i][2][1], posData.legs[i][2][2]);
    }
    minLegPositions.sort((a,b) => { return a.y - b.y });

    const vec1 = minLegPositions[1].clone().sub(minLegPositions[0]);
    const vec2 = minLegPositions[2].clone().sub(minLegPositions[0]);
    bodyPlaneNormal = vec2.clone().cross(vec1).normalize();
    bodyPlaneRotation = new THREE.Quaternion().identity();// setFromUnitVectors(bodyPlaneNormal, THREE.Object3D.DefaultUp);
    minLegHeightPos = 0;//minLegPositions[0].applyQuaternion(bodyPlaneRotation).y;
  }

  return (
    <div id="canvas-container">
      <Canvas shadows frameloop="demand"  rotation={[0, 0, 0]}
        style={{width: window.innerWidth, height: window.innerHeight}}
        camera={{ fov: 25, near: 0.01, far: 1000, position: [-ENV_SIZE.x, ENV_SIZE.y, -ENV_SIZE.z] }}>

        <ambientLight intensity={0.5} />
        <directionalLight color='white' intensity={1} 
          castShadow
          shadow-mapSize-height={1024} 
          shadow-mapSize-width={1024}>
            <orthographicCamera attach="shadow-camera" args={[-ENV_SIZE.x/2, ENV_SIZE.x/2, ENV_SIZE.y/2, -ENV_SIZE.y/2]} />
        </directionalLight>

        <Grid receiveShadow args={[ENV_SIZE.x, ENV_SIZE.z]} cellSize={0.02} cellThickness={0.6} cellColor={'#6f6f6f'} 
          sectionSize={0.1} sectionThickness={1.5} sectionColor={'#9d4b4b'} fadeStrength={0} />

        <Plane receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -0.001, 0]} args={[ENV_SIZE.x, ENV_SIZE.z]} >
          <meshStandardMaterial attach="material" color="#303035" transparent opacity={0.7} />
        </Plane>
        <OrbitControls enableDamping={false} makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]} >
          <GizmoViewcube />
        </GizmoHelper>

        {posData &&
          <group quaternion={bodyPlaneRotation} position={[0, -minLegHeightPos, 0]} >
            <BodyElement start={ posData.legs[0][0] } end={posData.legs[1][0]} />
            <BodyElement start={ posData.legs[1][0] } end={posData.legs[2][0]} />
            <BodyElement start={ posData.legs[2][0] } end={posData.legs[5][0]} />
            <BodyElement start={ posData.legs[5][0] } end={posData.legs[4][0]} />
            <BodyElement start={ posData.legs[4][0] } end={posData.legs[3][0]} />
            <BodyElement start={ posData.legs[3][0] } end={posData.legs[0][0]}  color="red" />
            <BodyElement start={ posData.legs[0][0] } end={posData.legs[5][0]} />
            <BodyElement start={ posData.legs[2][0] } end={posData.legs[3][0]} />

            <BodyElement start={ posData.legs[0][0] } end={posData.legs[0][1]} startBump />
            <BodyElement start={ posData.legs[0][1] } end={posData.legs[0][2]} startBump endBump />
            <BodyElement start={ posData.legs[1][0] } end={posData.legs[1][1]} startBump />
            <BodyElement start={ posData.legs[1][1] } end={posData.legs[1][2]} startBump endBump />
            <BodyElement start={ posData.legs[2][0] } end={posData.legs[2][1]} startBump />
            <BodyElement start={ posData.legs[2][1] } end={posData.legs[2][2]} startBump endBump />
            <BodyElement start={ posData.legs[3][0] } end={posData.legs[3][1]} startBump />
            <BodyElement start={ posData.legs[3][1] } end={posData.legs[3][2]} startBump endBump />
            <BodyElement start={ posData.legs[4][0] } end={posData.legs[4][1]} startBump />
            <BodyElement start={ posData.legs[4][1] } end={posData.legs[4][2]} startBump endBump />
            <BodyElement start={ posData.legs[5][0] } end={posData.legs[5][1]} startBump />
            <BodyElement start={ posData.legs[5][1] } end={posData.legs[5][2]} startBump endBump />
          </group>
        }

      </Canvas>
    </div>
  )
}

export default App
