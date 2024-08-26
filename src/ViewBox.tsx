import deepEqual from 'deep-equal';
import * as THREE from 'three';
import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import BodyElement from './BodyElement';
import { OrbitControls } from '@react-three/drei';

const ENV_SIZE = { x: 0.4, y: 0.4, z: 0.4 };

interface ViewBoxProps {
  backendChannel: WebSocket;
  speed: number[];
  turn: number;
}

interface PositionData {
  legs: number[][][];
}

const ViewBox = (props: ViewBoxProps) => {
  const [posData, _setPosData] = useState<PositionData | null>(null);
  const posDataRef = useRef<PositionData | null>(posData);
  const setPosData = (data: PositionData) => {
    posDataRef.current = data;
    _setPosData(data);
  };

  useEffect(() => {
    props.backendChannel.onmessage = (event: MessageEvent<string>) => {
      const newPosData = JSON.parse(event.data) as PositionData;
      if (!deepEqual(posDataRef.current, newPosData)) {
        setPosData(newPosData);
      }
    };
    return () => {
      props.backendChannel.onmessage = null;
    };
  }, [props.backendChannel]);

  let bodyPlaneRotation = new THREE.Quaternion().identity();
  const minLegPositions = [];

  if (posData) {
    minLegPositions[1] = new THREE.Vector3(
      posData.legs[0][2][0],
      posData.legs[0][2][1],
      posData.legs[0][2][2]
    );
    minLegPositions[2] = new THREE.Vector3(
      posData.legs[0][2][0],
      posData.legs[0][2][1],
      posData.legs[0][2][2]
    );

    for (let i = 0; i < 6; i++) {
      minLegPositions[i] = new THREE.Vector3(
        posData.legs[i][2][0],
        posData.legs[i][2][1],
        posData.legs[i][2][2]
      );
    }
    minLegPositions.sort((a, b) => {
      return a.y - b.y;
    });

    bodyPlaneRotation = new THREE.Quaternion().identity();
  }

  return (
    <Canvas
      shadows
      orthographic
      camera={{ zoom: 3000, near: 0.1, far: 1000, position: [-1, 1, -1] }}
      frameloop="always"
    >
      <fog attach="fog" color="hotpink" near={1} far={10} />
      <ambientLight intensity={0.6} />
      <directionalLight
        intensity={1.4}
        castShadow
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[
            -ENV_SIZE.x / 2,
            ENV_SIZE.x / 2,
            ENV_SIZE.z / 2,
            -ENV_SIZE.z / 2
          ]}
        />
      </directionalLight>

      <polarGridHelper args={[ENV_SIZE.x / 2, 36, ENV_SIZE.x * 100]} />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[ENV_SIZE.x, ENV_SIZE.z]} />
        <shadowMaterial attach="material" transparent opacity={0.6} />
      </mesh>

      <OrbitControls enableDamping={false} makeDefault />

      {posData && (
        <group quaternion={bodyPlaneRotation}>
          <BodyElement start={posData.legs[0][0]} end={posData.legs[1][0]} />
          <BodyElement start={posData.legs[1][0]} end={posData.legs[2][0]} />
          <BodyElement start={posData.legs[2][0]} end={posData.legs[5][0]} />
          <BodyElement start={posData.legs[5][0]} end={posData.legs[4][0]} />
          <BodyElement start={posData.legs[4][0]} end={posData.legs[3][0]} />
          <BodyElement
            start={posData.legs[3][0]}
            end={posData.legs[0][0]}
            color="red"
          />
          <BodyElement start={posData.legs[0][0]} end={posData.legs[5][0]} />
          <BodyElement start={posData.legs[2][0]} end={posData.legs[3][0]} />

          <BodyElement
            start={posData.legs[0][0]}
            end={posData.legs[0][1]}
            startBump
          />
          <BodyElement
            start={posData.legs[0][1]}
            end={posData.legs[0][2]}
            startBump
          />
          <BodyElement
            start={posData.legs[0][2]}
            end={posData.legs[0][3]}
            startBump
            endBump
            highlight={posData.legs[0][3][1] == 0.0}
          />
          <BodyElement
            start={posData.legs[1][0]}
            end={posData.legs[1][1]}
            startBump
          />
          <BodyElement
            start={posData.legs[1][1]}
            end={posData.legs[1][2]}
            startBump
          />
          <BodyElement
            start={posData.legs[1][2]}
            end={posData.legs[1][3]}
            startBump
            endBump
            highlight={posData.legs[1][3][1] == 0.0}
          />
          <BodyElement
            start={posData.legs[2][0]}
            end={posData.legs[2][1]}
            startBump
          />
          <BodyElement
            start={posData.legs[2][1]}
            end={posData.legs[2][2]}
            startBump
          />
          <BodyElement
            start={posData.legs[2][2]}
            end={posData.legs[2][3]}
            startBump
            endBump
            highlight={posData.legs[2][3][1] == 0.0}
          />
          <BodyElement
            start={posData.legs[3][0]}
            end={posData.legs[3][1]}
            startBump
          />
          <BodyElement
            start={posData.legs[3][1]}
            end={posData.legs[3][2]}
            startBump
          />
          <BodyElement
            start={posData.legs[3][2]}
            end={posData.legs[3][3]}
            startBump
            endBump
            highlight={posData.legs[3][3][1] == 0.0}
          />
          <BodyElement
            start={posData.legs[4][0]}
            end={posData.legs[4][1]}
            startBump
          />
          <BodyElement
            start={posData.legs[4][1]}
            end={posData.legs[4][2]}
            startBump
          />
          <BodyElement
            start={posData.legs[4][2]}
            end={posData.legs[4][3]}
            startBump
            endBump
            highlight={posData.legs[4][3][1] == 0.0}
          />
          <BodyElement
            start={posData.legs[5][0]}
            end={posData.legs[5][1]}
            startBump
          />
          <BodyElement
            start={posData.legs[5][1]}
            end={posData.legs[5][2]}
            startBump
          />
          <BodyElement
            start={posData.legs[5][2]}
            end={posData.legs[5][3]}
            startBump
            endBump
            highlight={posData.legs[5][3][1] == 0.0}
          />
        </group>
      )}
    </Canvas>
  );
};

export default ViewBox;
