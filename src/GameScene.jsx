
// File: GameScene.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function GameScene({ character }) {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} castShadow />
      <Sky sunPosition={[100, 20, 100]} />
      <CharacterController character={character} />
      <Ground />
      <OrbitControls />
    </Canvas>
  );
}

function CharacterModel({ character }) {
  const { scene } = useGLTF(`/models/${character.id}.glb`);
  return <primitive object={scene} scale={1.5} />;
}

function SkillEffect({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="cyan" emissive="blue" emissiveIntensity={0.8} transparent opacity={0.5} />
    </mesh>
  );
}

function CharacterController({ character }) {
  const ref = useRef();
  const speed = 0.1;
  const keys = useRef({});
  const [skills, setSkills] = useState([]);

  const skillHandler = (key) => {
    const charPos = ref.current.position.clone();
    switch (key) {
      case "q":
        console.log(`${character.name} dùng kỹ năng Q`);
        setSkills((prev) => [...prev, { id: Date.now(), position: charPos }]);
        break;
      case "w":
        console.log(`${character.name} dùng kỹ năng W`);
        break;
      case "e":
        console.log(`${character.name} dùng kỹ năng E`);
        break;
      case "r":
        console.log(`${character.name} dùng kỹ năng R`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const down = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      skillHandler(e.key.toLowerCase());
    };
    const up = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    let dx = 0;
    let dz = 0;
    if (keys.current["w"]) dz -= speed;
    if (keys.current["s"]) dz += speed;
    if (keys.current["a"]) dx -= speed;
    if (keys.current["d"]) dx += speed;
    ref.current.position.x += dx;
    ref.current.position.z += dz;

    socket.emit("move", {
      id: character.id,
      x: ref.current.position.x,
      z: ref.current.position.z,
    });
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <CharacterModel character={character} />
      {skills.map((s) => (
        <SkillEffect key={s.id} position={s.position} />
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}
