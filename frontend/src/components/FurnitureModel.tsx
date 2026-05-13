import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface FurnitureModelProps {
  modelPath: string;
}

const FurnitureModel = ({ modelPath }: FurnitureModelProps) => {
  const { scene } = useGLTF(modelPath);
  
  // Memoize the math so it only runs once per model
  const { clonedScene, offset } = useMemo(() => {
    const c = scene.clone();
    
    // 1. Calculate the bounding box of the WHOLE bed
    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // 2. Create an offset that pulls that center to the middle (0,0)
    // We leave Y alone so the feet stay on the floor
    return {
      clonedScene: c,
      offset: [-center.x, 0, -center.z] as [number, number, number]
    };
  }, [scene]);

  return (
    // This group acts as the "anchor" that holds the bed together
    <group position={offset}>
      <primitive object={clonedScene} scale={[1.5, 1.5, 1.5]} castShadow receiveShadow />
    </group>
  );
};

export default FurnitureModel;