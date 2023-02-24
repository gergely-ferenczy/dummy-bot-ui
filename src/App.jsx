import React from 'react'
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, GizmoHelper, GizmoViewport, Plane } from '@react-three/drei'

import BodyElement from './BodyElement'

const envSize = { x: 0.4, y: 0.4, z: 0.4 }


const hexaData = [
  [ [ 0.07,   0.03,  -0.04], [0.1, 0.078, -0.07], [0.14, 0.014, -0.11] ],
  [ [ 0.0,    0.03,  -0.05], [], [] ],
  [ [-0.07,   0.03,  -0.04], [], [] ],
  [ [ 0.07,   0.03,   0.04], [], [] ],
  [ [ 0.0,    0.03,   0.05], [], [] ],
  [ [-0.07,   0.03,   0.04], [], [] ]
];

console.log(new THREE.Vector3(0, -0.08, 0).applyAxisAngle(
            new THREE.Vector3(1, 0, 1), Math.PI / 6).add(
            new THREE.Vector3(0.1, 0.078, -0.07)));


const App = () => {
  return (
    <div id="canvas-container">
      <Canvas shadows
        style={{width: window.innerWidth, height: window.innerHeight}}
        camera={{ fov: 25, near: 0.01, far: 1000, position: [-envSize.x, envSize.y, -envSize.z] }}>

        <ambientLight intensity={0.3} />
        <directionalLight color='white' intensity={1} position={[0, 1, 0]} 
          castShadow
          shadow-mapSize-height={1024} 
          shadow-mapSize-width={1024}>
            <orthographicCamera attach="shadow-camera" args={[-envSize.x/2, envSize.x/2, envSize.z/2, -envSize.z/2]} />
        </directionalLight>

        <Grid receiveShadow position={[0, 0, 0]} args={[envSize.x, envSize.z]} cellSize={0.02} cellThickness={0.6} cellColor={'#6f6f6f'} 
          sectionSize={0.1} sectionThickness={1.5} sectionColor={'#9d4b4b'} fadeStrength={0} />

        <Plane receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -0.001, 0]} args={[envSize.x, envSize.z]} >
          <shadowMaterial attach="material" />
        </Plane>
        <OrbitControls /*autoRotate={true} autoRotateSpeed={0.5}*/ enableDamping={false} makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>

        <BodyElement start={ hexaData[0][0] } end={hexaData[1][0]} />
        <BodyElement start={ hexaData[1][0] } end={hexaData[2][0]} />
        <BodyElement start={ hexaData[2][0] } end={hexaData[5][0]} />
        <BodyElement start={ hexaData[5][0] } end={hexaData[4][0]} />
        <BodyElement start={ hexaData[4][0] } end={hexaData[3][0]} />
        <BodyElement start={ hexaData[3][0] } end={hexaData[0][0]} />
        <BodyElement start={ hexaData[0][0] } end={hexaData[5][0]} />
        <BodyElement start={ hexaData[2][0] } end={hexaData[3][0]} />

        <BodyElement start={ hexaData[0][0] } end={hexaData[0][1]} startBump />
        <BodyElement start={ hexaData[0][1] } end={hexaData[0][2]} startBump />

      </Canvas>
    </div>
  )
}

export default App
