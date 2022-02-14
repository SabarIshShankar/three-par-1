import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture, Shadow, meshBounds } from "@react-three/drei";
import { a } from "@react-spring/three";

function Switch({ x, set }) {
  const { nodes, materials } = useGLTF("/switch.glb");
  const texture = useTexture("/cross.jpg");

  const [hovered, setHover] = useState(false);
  useEffect(
    () => void (document.body.style.cursor = hovered ? "pointer" : "auto"),
    [hovered]
  );
  const onClick = useCallback(() => set((toggle) => Number(!toggle)), [set]);
  const onPointerOver = useCallback(() => setHover(true), []);
  const onPointerOut = useCallback(() => setHover(false), []);

  //interpolations
  const pZ = x.to([0, 1], [-1.2, 1.2]);
  const rX = x.to([0, 1], [0, Math.PI * 1.3]);
  const color = x.to([0, 1], ["#888", "#2a2a2a"]);
  return (
  <group scale={[1.25, 1.25, 1.25]} dispose={null}>
    <a.mesh receiveShadow castShadow material={materials.track} geometry={nodes.Cube.geometry} material-color={color} material-roughness={0.5} material-metalness={0.8}/>
    <a.group position-y={0.85} position-z={pZ}>
      <a.mesh receiveShadow castShadow raycast={meshBounds} rotation-x={rX} onClick={onClick} onPointerOver={onPointerOver} onPointerOut = {onPointerOut}>
        <sphereGeometry args={[0.8, 64, 64]}/>
        <a.meshStandardMaterial roughness={0.5} map={texture}/>
      </a.mesh>
      <a.pointLight intensity={100} distance={1.4} color={color}/>
      <Shadow renderOrder={-1000} position={[0, -1, 0]} rotation={[-Math.PI/2, 0, 0]} scale={1.5}/>
    </a.group>
  </group>
  );
}
