import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface FurnitureModelProps {
  modelPath: string;
}

const FurnitureModel = ({ modelPath }: FurnitureModelProps) => {
  const { scene } = useGLTF(modelPath);
  
  const { clonedScene, offset } = useMemo(() => {
    const c = scene.clone();
    
    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    return {
      clonedScene: c,
      offset: [-center.x, 0, -center.z] as [number, number, number]
    };
  }, [scene]);

  return (
    <group position={offset}>
      <primitive object={clonedScene} scale={[1.5, 1.5, 1.5]} castShadow receiveShadow />
    </group>
  );
};

export default FurnitureModel;