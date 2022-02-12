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
  return <group scale={[1.25, 1.25, 1.25]} dispose="null"></group>;
}
