import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, TransformControls, PointerLockControls } from '@react-three/drei';
import { useEffect, useState } from 'react';
import type { RoomData } from '../pages/Home'; 
import FurnitureModel from './FurnitureModel'; 
import { Geometry, Base, Subtraction } from '@react-three/csg';

interface PreviewPanelProps {
  data: RoomData;
  onUpdatePosition: (id: string, position: [number, number, number]) => void;
  onUpdateRotation: (id: string, rotationDeg: number) => void;
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  activeTool: 'translate' | 'rotate' | 'tour';
  activeFloor?: 1 | 2;
  sceneRef?: React.MutableRefObject<THREE.Scene | null>;
  onSetTool?: (tool: 'translate' | 'rotate' | 'tour') => void;
}

const SceneExporter = ({ sceneRef }: { sceneRef: React.MutableRefObject<THREE.Scene | null> }) => {
  const { scene } = useThree();
  sceneRef.current = scene;
  return null;
};

const PlayerControls = ({ floorY, onExit }: { floorY: number, onExit?: () => void }) => {
  const { camera } = useThree();
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: true })); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: false })); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const speed = 5 * delta;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0));
    const sideVector = new THREE.Vector3((movement.left ? 1 : 0) - (movement.right ? 1 : 0), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    camera.position.add(direction);
    camera.position.y = floorY + 1.6; 
  });

  return <PointerLockControls onUnlock={onExit} />;
};

const PreviewPanel = ({ data, onUpdatePosition, onUpdateRotation: _onUpdateRotation, selectedId, onSelectItem, activeTool, activeFloor = 1, sceneRef, onSetTool }: PreviewPanelProps) => {
  const wallHeight = data.hasSecondStory ? data.height * 2 : data.height;
  const wallCenterY = wallHeight / 2;

  return (
    <div className={`w-full h-full relative transition-colors duration-1000 ${data.isNight ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
      <Canvas 
        shadows={{ type: THREE.PCFShadowMap }} 
        camera={{ position: [12, 10, 12], fov: 45 }} 
        gl={{ preserveDrawingBuffer: true }}
        className="w-full h-full outline-none"
      >
        {sceneRef && <SceneExporter sceneRef={sceneRef} />}
        <ambientLight intensity={data.isNight ? 0.15 : (data.hasCeiling ? 0.9 : 0.6)} />
        {!data.hasCeiling && (
          <directionalLight 
            position={data.sunPosition || [10, 15, 10]} 
            intensity={data.isNight ? 0.2 : 1.5} 
            color={data.isNight ? "#88aaff" : "#ffffff"} 
            castShadow 
            shadow-bias={-0.0001} 
          />
        )}
        {/* Indoor fill lights — keep the room visible when ceiling blocks the sun */}
        {data.hasCeiling && (
          <>
            <pointLight position={[0, data.height - 0.3, 0]} intensity={data.isNight ? (data.indoorLightOn ? 2.5 : 0) : 1.8} distance={Math.max(data.width, data.depth) * 2} decay={1.2} color={data.isNight ? "#ffe8c0" : "#ffffff"} />
            <pointLight position={[-(data.width / 4), data.height - 0.3, -(data.depth / 4)]} intensity={data.isNight ? (data.indoorLightOn ? 1.5 : 0) : 1.0} distance={Math.max(data.width, data.depth) * 1.5} decay={1.5} color={data.isNight ? "#ffe8c0" : "#ffffff"} />
            <pointLight position={[(data.width / 4), data.height - 0.3, (data.depth / 4)]} intensity={data.isNight ? (data.indoorLightOn ? 1.5 : 0) : 1.0} distance={Math.max(data.width, data.depth) * 1.5} decay={1.5} color={data.isNight ? "#ffe8c0" : "#ffffff"} />
          </>
        )}
        <Environment preset={data.isNight ? "night" : "city"} />
        <Grid infiniteGrid fadeDistance={40} sectionColor={data.isNight ? "#444" : "#161B22"} cellColor={data.isNight ? "#222" : "#C9D1D9"} position={[0, -0.01, 0]} />

        <group>
          <mesh position={[0, -0.05, 0]} receiveShadow onPointerMissed={() => onSelectItem(null)}>
            <boxGeometry args={[data.width, 0.1, data.depth]} />
            <meshStandardMaterial color={data.floorColor} roughness={0.8} />
          </mesh>
          <group>
            {/* Back wall (−Z) */}
            <mesh position={[0, wallCenterY, -data.depth / 2]} castShadow receiveShadow>
              <boxGeometry args={[data.width, wallHeight, 0.2]} />
              <meshStandardMaterial color={data.wallColor} />
            </mesh>

            {/* Left wall (−X) */}
            <mesh position={[-data.width / 2, wallCenterY, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.2, wallHeight, data.depth]} />
              <meshStandardMaterial color={data.wallColor} />
            </mesh>

            {/* Right wall (+X) */}
            <mesh position={[data.width / 2, wallCenterY, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.2, wallHeight, data.depth]} />
              <meshStandardMaterial color={data.wallColor} />
            </mesh>

            {/* Ceiling slab — with stair opening cut via CSG when stairs are present */}
            {(data.hasSecondStory || data.hasCeiling) && (() => {
              const stairs = data.furniture.filter(f => f.type === 'stairs');
              const ceilColor = data.ceilingColor || '#f5f5f5';
              if (stairs.length === 0) {
                // No stairs — plain mesh always renders reliably
                return (
                  <mesh key="ceiling-plain" position={[0, data.height, 0]} castShadow receiveShadow>
                    <boxGeometry args={[data.width + 0.4, 0.2, data.depth + 0.4]} />
                    <meshStandardMaterial color={ceilColor} />
                  </mesh>
                );
              }
              // Stairs present — use CSG to cut openings
              return (
                <mesh key="ceiling-csg" position={[0, data.height, 0]} castShadow receiveShadow>
                  <Geometry>
                    <Base>
                      <boxGeometry args={[data.width + 0.4, 0.3, data.depth + 0.4]} />
                    </Base>
                    {stairs.map(stair => (
                      <Subtraction
                        key={`stair-cut-${stair.id}`}
                        position={[stair.position[0], 0, stair.position[2]]}
                        rotation={[0, THREE.MathUtils.degToRad(stair.rotation || 0), 0]}
                      >
                        <boxGeometry args={[3.2, 1, 3.2]} />
                      </Subtraction>
                    ))}
                  </Geometry>
                  <meshStandardMaterial color={ceilColor} />
                </mesh>
              );
            })()}

            {/* Top ceiling when both second story and ceiling are enabled */}
            {data.hasSecondStory && data.hasCeiling && (
              <mesh position={[0, data.height * 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[data.width + 0.4, 0.2, data.depth + 0.4]} />
                <meshStandardMaterial color={data.ceilingColor || '#f5f5f5'} />
              </mesh>
            )}

          </group>


          {data.furniture.map((item) => {
            if (item.type === 'window' || item.type === 'door') {
              const isSelected = selectedId === item.id;
              const w = item.type === 'window' ? 1.5 : 1.2;
              const h = item.type === 'window' ? 1.5 : 2.2;
              const d = 0.3; 
              const rotationY = THREE.MathUtils.degToRad(item.rotation || 0);
              
              const content = (
                <group 
                  onClick={(e) => { e.stopPropagation(); onSelectItem(item.id); }}
                  rotation={[0, rotationY, 0]}
                >
                  <mesh>
                    <boxGeometry args={[w, h, d]} />
                    <meshStandardMaterial color={item.color} wireframe={true} />
                  </mesh>
                  {item.type === 'window' && (
                    <mesh>
                      <planeGeometry args={[w, h]} />
                      <meshStandardMaterial color="#88ccff" transparent opacity={0.3} />
                    </mesh>
                  )}
                </group>
              );

              if (isSelected) {
                return (
                  <TransformControls 
                    key={item.id} mode="translate" position={item.position}
                    onMouseUp={(e: any) => {
                      if (e?.target?.object) {
                        const pos = e.target.object.position;
                        onUpdatePosition(item.id, [pos.x, pos.y, pos.z]);
                      }
                    }}
                  >
                    {content}
                  </TransformControls>
                );
              }
              return <group key={item.id} position={item.position}>{content}</group>;
            }

            if (item.type === 'light') {
              const isSelected = selectedId === item.id;
              const content = (
                <group onClick={(e) => { e.stopPropagation(); onSelectItem(item.id); }}>
                  <pointLight 
                    intensity={1.5} 
                    distance={Math.max(data.width, data.depth) * 1.5}
                    decay={1.5}
                    castShadow 
                    shadow-bias={-0.0002}
                  />
                  <mesh>
                    <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
                  </mesh>
                </group>
              );

              if (isSelected) {
                return (
                  <TransformControls 
                    key={item.id} mode="translate" position={item.position}
                    onMouseUp={(e: any) => {
                      if (e?.target?.object) {
                        const pos = e.target.object.position;
                        onUpdatePosition(item.id, [pos.x, pos.y, pos.z]);
                      }
                    }}
                  >
                    {content}
                  </TransformControls>
                );
              }
              return <group key={item.id} position={item.position}>{content}</group>;
            }

            const isSelected = selectedId === item.id;
            const modelPath = `/models/${item.type}.glb`;

            const rotationY = THREE.MathUtils.degToRad(item.rotation || 0);
            const uniformScale = item.scale ?? 1;

            const furnitureContent = (
              <group 
                onClick={(e) => { e.stopPropagation(); onSelectItem(item.id); }}
                rotation={[0, rotationY, 0]}
                scale={[uniformScale, uniformScale, uniformScale]}
              >
                <FurnitureModel modelPath={modelPath} />
              </group>
            );

            if (isSelected) {
              return (
                <TransformControls 
                  key={item.id} 
                  mode="translate"
                  position={item.position}
                  onMouseUp={(e: any) => {
                    if (e?.target?.object) {
                      const pos = e.target.object.position;
                      const buffer = 0.5;
                      const safeX = Math.max(-(data.width / 2) + buffer, Math.min((data.width / 2) - buffer, pos.x));
                      const safeZ = Math.max(-(data.depth / 2) + buffer, Math.min((data.depth / 2) - buffer, pos.z));
                      const floorY = activeFloor === 2 ? data.height : 0;
                      const safeY = Math.max(floorY, pos.y);
                      e.target.object.position.set(safeX, safeY, safeZ);
                      onUpdatePosition(item.id, [safeX, safeY, safeZ]);
                    }
                  }}
                >
                  {furnitureContent}
                </TransformControls>
              );
            }

            return <group key={item.id} position={item.position}>{furnitureContent}</group>;
          })}
          {!data.hasCeiling && !data.isNight && (() => {
            const sunPos = data.sunPosition || [10, 15, 10];
            const sunContent = (
              <mesh onClick={(e) => { e.stopPropagation(); onSelectItem('sun'); }}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={2} />
              </mesh>
            );

            if (selectedId === 'sun') {
              return (
                <TransformControls 
                  key="sun-transform"
                  mode="translate" 
                  position={sunPos}
                  onMouseUp={(e: any) => {
                    if (e?.target?.object) {
                      const pos = e.target.object.position;
                      onUpdatePosition('sun', [pos.x, pos.y, pos.z]);
                    }
                  }}
                >
                  {sunContent}
                </TransformControls>
              );
            }
            return <group key="sun-group" position={sunPos}>{sunContent}</group>;
          })()}
        </group>

        <OrbitControls makeDefault enabled={activeTool !== 'tour' && selectedId === null} />
        {activeTool === 'tour' && <PlayerControls floorY={activeFloor === 2 ? data.height : 0} onExit={() => onSetTool && onSetTool('translate')} />}
      </Canvas>

      {activeTool === 'tour' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-6 py-3 rounded-full backdrop-blur-md font-bold text-sm z-10 animate-in slide-in-from-top-4">
          Click to look around • Use W, A, S, D to walk
        </div>
      )}

      <div className="absolute bottom-6 right-6 text-pc-surface text-xs font-mono font-bold pointer-events-none tracking-[0.3em] bg-pc-bg/20 px-4 py-2 rounded-md backdrop-blur-md border border-white/10 uppercase">
        {selectedId ? `[ ${activeTool.toUpperCase()}_MODE ]` : (activeTool === 'tour' ? '[ TOUR_MODE ]' : "[ ENGINE_IDLE ]")}
      </div>
    </div>
  );
};

export default PreviewPanel;