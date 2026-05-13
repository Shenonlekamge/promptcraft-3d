import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, TransformControls } from '@react-three/drei';
import type { RoomData } from '../pages/Home'; 
import FurnitureModel from './FurnitureModel'; 
import { Geometry, Base, Subtraction } from '@react-three/csg';

interface PreviewPanelProps {
  data: RoomData;
  onUpdatePosition: (id: string, position: [number, number, number]) => void;
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  activeTool: 'translate' | 'rotate';
  activeFloor?: 1 | 2;
}

const PreviewPanel = ({ data, onUpdatePosition, selectedId, onSelectItem, activeTool, activeFloor = 1 }: PreviewPanelProps) => {
  const wallHeight = data.hasSecondStory ? data.height * 2 : data.height;
  const wallCenterY = wallHeight / 2;
  return (
    <div className="w-full h-full bg-zinc-100 relative">
      <Canvas 
        shadows={{ type: THREE.PCFShadowMap }} 
        camera={{ position: [12, 10, 12], fov: 45 }} 
        className="w-full h-full outline-none"
      >
        <ambientLight intensity={0.6} />
        {!data.hasCeiling && (
          <directionalLight position={data.sunPosition || [10, 15, 10]} intensity={1.5} castShadow shadow-bias={-0.0001} />
        )}
        <Environment preset="city" />
        <Grid infiniteGrid fadeDistance={40} sectionColor="#161B22" cellColor="#C9D1D9" position={[0, -0.01, 0]} />

        <group>
          {/* Dynamic Floor */}
          <mesh position={[0, -0.05, 0]} receiveShadow onPointerMissed={() => onSelectItem(null)}>
            <boxGeometry args={[data.width, 0.1, data.depth]} />
            <meshStandardMaterial color={data.floorColor} roughness={0.8} />
          </mesh>

          {/* Dynamic Walls with CSG for Windows/Doors */}
          <group>
            {/* Back Wall */}
            <mesh position={[0, wallCenterY, -data.depth / 2]} castShadow receiveShadow>
              <Geometry>
                <Base>
                  <boxGeometry args={[data.width, wallHeight, 0.2]} />
                </Base>
                {data.furniture.map(item => {
                  if (item.type === 'window' && Math.abs(item.position[2] - (-data.depth / 2)) < 1) {
                    return (
                      <Subtraction key={`cut-${item.id}`} position={[item.position[0], item.position[1] - wallCenterY, 0]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[1.5, 1.5, 2]} />
                      </Subtraction>
                    );
                  }
                  if (item.type === 'door' && Math.abs(item.position[2] - (-data.depth / 2)) < 1) {
                    return (
                      <Subtraction key={`cut-${item.id}`} position={[item.position[0], item.position[1] - wallCenterY, 0]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[1.2, 2.2, 2]} />
                      </Subtraction>
                    );
                  }
                  return null;
                })}
              </Geometry>
              <meshStandardMaterial color={data.wallColor} />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-data.width / 2, wallCenterY, 0]} castShadow receiveShadow>
              <Geometry>
                <Base>
                  <boxGeometry args={[0.2, wallHeight, data.depth]} />
                </Base>
                {data.furniture.map(item => {
                  if (item.type === 'window' && Math.abs(item.position[0] - (-data.width / 2)) < 1) {
                    return (
                      <Subtraction key={`cut-${item.id}`} position={[0, item.position[1] - wallCenterY, item.position[2]]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[2, 1.5, 1.5]} />
                      </Subtraction>
                    );
                  }
                  if (item.type === 'door' && Math.abs(item.position[0] - (-data.width / 2)) < 1) {
                    return (
                      <Subtraction key={`cut-${item.id}`} position={[0, item.position[1] - wallCenterY, item.position[2]]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[2, 2.2, 1.2]} />
                      </Subtraction>
                    );
                  }
                  return null;
                })}
              </Geometry>
              <meshStandardMaterial color={data.wallColor} />
            </mesh>

            {/* Right Wall */}
            <mesh position={[data.width / 2, wallCenterY, 0]} castShadow receiveShadow>
              <Geometry>
                <Base>
                  <boxGeometry args={[0.2, wallHeight, data.depth]} />
                </Base>
                {data.furniture.map(item => {
                  if (item.type === 'window' && Math.abs(item.position[0] - (data.width / 2)) < 1) {
                    return (
                      <Subtraction key={`cut-${item.id}`} position={[0, item.position[1] - wallCenterY, item.position[2]]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[2, 1.5, 1.5]} />
                      </Subtraction>
                    );
                  }
                  if (item.type === 'door' && Math.abs(item.position[0] - (data.width / 2)) < 1) {
                    return (
                      <Subtraction key={`cut-${item.id}`} position={[0, item.position[1] - wallCenterY, item.position[2]]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[2, 2.2, 1.2]} />
                      </Subtraction>
                    );
                  }
                  return null;
                })}
              </Geometry>
              <meshStandardMaterial color={data.wallColor} />
            </mesh>
          </group>

            {/* First Story Ceiling / Second Story Floor */}
            {(data.hasSecondStory || data.hasCeiling) && (
              <group>
                <mesh position={[0, data.height, 0]} castShadow receiveShadow>
                  <Geometry>
                    <Base>
                      <boxGeometry args={[data.width + 0.4, 0.2, data.depth + 0.4]} />
                    </Base>
                    {/* Cutout for stairs */}
                    {data.furniture.map(item => {
                      if (item.type === 'stairs') {
                        return (
                          <Subtraction key={`cut-${item.id}`} position={[item.position[0], 0, item.position[2]]} rotation={[0, THREE.MathUtils.degToRad(item.rotation || 0), 0]}>
                            <boxGeometry args={[3, 2, 3]} />
                          </Subtraction>
                        );
                      }
                      return null;
                    })}
                  </Geometry>
                  <meshStandardMaterial color={data.ceilingColor || "#ffffff"} />
                </mesh>
                
                {/* Indoor Ceiling Light for First Story */}
                <pointLight 
                  position={[0, data.height - 0.2, 0]} 
                  intensity={1.5} 
                  distance={Math.max(data.width, data.depth) * 1.5}
                  decay={1.5}
                  castShadow 
                  shadow-bias={-0.0002}
                />
                <mesh position={[0, data.height - 0.05, 0]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
                </mesh>
              </group>
            )}

            {/* Second Story Ceiling / Roof */}
            {data.hasSecondStory && data.hasCeiling && (
              <group>
                <mesh position={[0, data.height * 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[data.width + 0.4, 0.2, data.depth + 0.4]} />
                  <meshStandardMaterial color={data.ceilingColor || "#ffffff"} />
                </mesh>
                
                {/* Indoor Ceiling Light for Second Story */}
                <pointLight 
                  position={[0, data.height * 2 - 0.2, 0]} 
                  intensity={1.5} 
                  distance={Math.max(data.width, data.depth) * 1.5}
                  decay={1.5}
                  castShadow 
                  shadow-bias={-0.0002}
                />
                <mesh position={[0, data.height * 2 - 0.05, 0]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
                </mesh>
              </group>
            )}

          {/* Dynamic Furniture Rendering */}
          {data.furniture.map((item) => {
            if (item.type === 'window' || item.type === 'door') {
              // We render a simple frame for window/door so user can click and move it
              const isSelected = selectedId === item.id;
              const w = item.type === 'window' ? 1.5 : 1.2;
              const h = item.type === 'window' ? 1.5 : 2.2;
              const d = 0.3; // depth
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
                  {/* Glass pane for window */}
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
                    key={item.id} mode={activeTool} position={item.position}
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

            // Convert rotation degrees to radians for Three.js
            const rotationY = THREE.MathUtils.degToRad(item.rotation || 0);

            const furnitureContent = (
              <group 
                onClick={(e) => { e.stopPropagation(); onSelectItem(item.id); }}
                rotation={[0, rotationY, 0]}
              >
                <FurnitureModel modelPath={modelPath} />
              </group>
            );

            if (isSelected) {
              return (
                <TransformControls 
                  key={item.id} 
                  mode={activeTool} 
                  showY={activeTool === 'rotate'} 
                  position={item.position}
                  onMouseUp={(e: any) => {
                    if (e?.target?.object) {
                      const pos = e.target.object.position;
                      const buffer = 0.5; 
                      const safeX = Math.max(-(data.width / 2) + buffer, Math.min((data.width / 2) - buffer, pos.x));
                      const safeZ = Math.max(-(data.depth / 2) + buffer, Math.min((data.depth / 2) - buffer, pos.z));
                      const floorY = activeFloor === 2 ? data.height : 0;
                      e.target.object.position.set(safeX, floorY, safeZ);
                      onUpdatePosition(item.id, [safeX, floorY, safeZ]);
                    }
                  }}
                >
                  {furnitureContent}
                </TransformControls>
              );
            }

            return <group key={item.id} position={item.position}>{furnitureContent}</group>;
          })}

          {/* Sun Object */}
          {!data.hasCeiling && (() => {
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
                      // Pass sun position as an update. Since PreviewPanel doesn't have onUpdateRoom directly,
                      // we can call a custom prop or we can just add it to onUpdatePosition if it supports it?
                      // Wait, onUpdatePosition takes an ID. If ID is 'sun', we can handle it in Home.tsx.
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

        <OrbitControls makeDefault enabled={selectedId === null} />
      </Canvas>

      <div className="absolute bottom-6 right-6 text-pc-surface text-xs font-mono font-bold pointer-events-none tracking-[0.3em] bg-pc-bg/20 px-4 py-2 rounded-md backdrop-blur-md border border-white/10 uppercase">
        {selectedId ? `[ ${activeTool.toUpperCase()}_MODE ]` : "[ ENGINE_IDLE ]"}
      </div>
    </div>
  );
};

export default PreviewPanel;