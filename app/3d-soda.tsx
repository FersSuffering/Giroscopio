import React, { useRef, useMemo, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Pressable,
  StyleSheet,
  StatusBar,
  Text,
  LogBox,
  Platform,
} from "react-native";
import { Canvas, useFrame, extend } from "@react-three/fiber/native";
import * as THREE from "three";
import { Gyroscope } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

LogBox.ignoreLogs([
  "THREE.WARNING",
  "EXGL",
  "THREE.WebGLRenderer",
  "EXT_color_buffer_float",
]);

const ow = console.warn;
const ol = console.log;
console.warn = (...a: unknown[]) => {
  const m = typeof a[0] === "string" ? a[0] : "";
  if (m.includes("THREE") || m.includes("EXT_color")) return;
  ow(...a);
};
console.log = (...a: unknown[]) => {
  const m = typeof a[0] === "string" ? a[0] : "";
  if (m.includes("EXGL") || m.includes("pixelStorei")) return;
  ol(...a);
};

extend({
  AmbientLight: THREE.AmbientLight,
  DirectionalLight: THREE.DirectionalLight,
  SpotLight: THREE.SpotLight,
  PointLight: THREE.PointLight,
  HemisphereLight: THREE.HemisphereLight,
  Mesh: THREE.Mesh,
  Group: THREE.Group,
  LatheGeometry: THREE.LatheGeometry,
  CircleGeometry: THREE.CircleGeometry,
  TorusGeometry: THREE.TorusGeometry,
  CylinderGeometry: THREE.CylinderGeometry,
  BoxGeometry: THREE.BoxGeometry,
  PlaneGeometry: THREE.PlaneGeometry,
  SphereGeometry: THREE.SphereGeometry,
  InstancedMesh: THREE.InstancedMesh,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshPhysicalMaterial: THREE.MeshPhysicalMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  ShadowMaterial: THREE.ShadowMaterial,
  Color: THREE.Color,
  Fog: THREE.Fog,
});

const T = {
  bgGradient: ["#e2e2e2", "#b6b4b4"] as const,
  brand: "#E8102E",
  brandBright: "#FF1744",
  accent: "#FF5252",
  accentGlow: "#FF8A80",
  aluminum: "#E8E8EC",
  alumDark: "#B0B0B8",
  tab: "#D0D0D5",
  text: "#ffffff",
  textDim: "rgba(0, 0, 0, 0.55)",
  coldBlue: "#88E0F0",
  warmHighlight: "#FFEDE8",
};

function WaterDroplets() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 400;

  useEffect(() => {
    if (!ref.current) return;
    const tmp = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const y = Math.random() * 1.9 + 0.15;
      const r = 0.655 + Math.random() * 0.008;

      tmp.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);

      const isLarge = Math.random() < 0.12;
      const isDrip = Math.random() < 0.06;

      let sx: number, sy: number, sz: number;
      if (isDrip) {
        const w = Math.random() * 0.012 + 0.006;
        sx = w;
        sy = Math.random() * 0.04 + 0.02;
        sz = w;
      } else if (isLarge) {
        const s = Math.random() * 0.018 + 0.012;
        sx = s * 1.1;
        sy = s * 0.7;
        sz = s * 1.1;
      } else {
        const s = Math.random() * 0.01 + 0.003;
        sx = s;
        sy = s * 0.75;
        sz = s;
      }

      tmp.scale.set(sx, sy, sz);

      tmp.lookAt(
        Math.cos(angle) * (r + 1),
        tmp.position.y,
        Math.sin(angle) * (r + 1),
      );

      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[
        undefined as unknown as THREE.BufferGeometry,
        undefined as unknown as THREE.Material,
        count,
      ]}
      position={[0, -1.1, 0]}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshPhysicalMaterial
        color="#ffffff"
        opacity={0.7}
        transparent
        roughness={0.02}
        metalness={0.4}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
        envMapIntensity={2.0}
      />
    </instancedMesh>
  );
}

function CondensationRing() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 120;

  useEffect(() => {
    if (!ref.current) return;
    const tmp = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const band = Math.floor(Math.random() * 3);
      const baseY = band === 0 ? 0.3 : band === 1 ? 1.0 : 1.7;
      const y = baseY + (Math.random() - 0.5) * 0.2;
      const r = 0.66;

      tmp.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      const s = Math.random() * 0.006 + 0.002;
      tmp.scale.set(s, s * 0.6, s);
      tmp.lookAt(
        Math.cos(angle) * (r + 1),
        tmp.position.y,
        Math.sin(angle) * (r + 1),
      );
      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[
        undefined as unknown as THREE.BufferGeometry,
        undefined as unknown as THREE.Material,
        count,
      ]}
      position={[0, -1.1, 0]}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshPhysicalMaterial
        color="#e0f0ff"
        opacity={0.4}
        transparent
        roughness={0.05}
        metalness={0.2}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
      />
    </instancedMesh>
  );
}

function CanBody() {
  const { geo, mat } = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const r = 0.65;
    const h = 2.2;
    const rim = 0.04;

    pts.push(new THREE.Vector2(0, 0));
    pts.push(new THREE.Vector2(r * 0.3, 0.005));
    pts.push(new THREE.Vector2(r * 0.6, 0.01));
    pts.push(new THREE.Vector2(r * 0.85, 0.02));
    pts.push(new THREE.Vector2(r * 0.95, 0.05));
    pts.push(new THREE.Vector2(r, 0.1));
    pts.push(new THREE.Vector2(r, h * 0.5));
    pts.push(new THREE.Vector2(r, h * 0.85));
    pts.push(new THREE.Vector2(r * 0.92, h * 0.9));
    pts.push(new THREE.Vector2(r * 0.88, h * 0.93));
    pts.push(new THREE.Vector2(r * 0.9, h * 0.96));
    pts.push(new THREE.Vector2(r * 0.94, h - rim));
    pts.push(new THREE.Vector2(r * 0.93, h - 0.01));
    pts.push(new THREE.Vector2(r * 0.88, h));
    pts.push(new THREE.Vector2(r * 0.85, h - 0.015));

    const geometry = new THREE.LatheGeometry(pts, 80);
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhysicalMaterial({
      color: T.brand,
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 1.5,
    });

    return { geo: geometry, mat: material };
  }, []);

  return (
    <mesh
      geometry={geo}
      material={mat}
      castShadow
      receiveShadow
      position={[0, -1.1, 0]}
    />
  );
}

function LabelBand() {
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.652, 0.652, 0.8, 64, 1, true);
    return g;
  }, []);

  return (
    <mesh geometry={geo} position={[0, -0.05, 0]}>
      <meshPhysicalMaterial
        color="#CC0018"
        metalness={0.6}
        roughness={0.25}
        clearcoat={0.8}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

function LabelStripe() {
  const geoTop = useMemo(() => {
    return new THREE.CylinderGeometry(0.654, 0.654, 0.015, 64, 1, true);
  }, []);

  const geoBot = useMemo(() => {
    return new THREE.CylinderGeometry(0.654, 0.654, 0.015, 64, 1, true);
  }, []);

  return (
    <>
      <mesh geometry={geoTop} position={[0, 0.35, 0]}>
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <mesh geometry={geoBot} position={[0, -0.45, 0]}>
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </>
  );
}

function CanTop() {
  return (
    <group position={[0, 1.08, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[0.58, 48]} />
        <meshPhysicalMaterial
          color={T.aluminum}
          metalness={0.95}
          roughness={0.08}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <torusGeometry args={[0.52, 0.02, 12, 48]} />
        <meshStandardMaterial
          color={T.alumDark}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.12, -0.02, 0]}>
        <torusGeometry args={[0.14, 0.012, 12, 32]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, -0.015, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
        <meshStandardMaterial
          color="#999999"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function PullTab() {
  const tabGroup = useMemo(() => {
    const g = new THREE.Group();

    const rivetGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.025, 16);
    const rivetMat = new THREE.MeshPhysicalMaterial({
      color: T.tab,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });
    const rivet = new THREE.Mesh(rivetGeo, rivetMat);
    rivet.position.set(0, 0.012, 0);

    const leverGeo = new THREE.BoxGeometry(0.15, 0.015, 0.28);
    leverGeo.translate(0, 0.01, 0.1);
    const leverMat = new THREE.MeshPhysicalMaterial({
      color: T.tab,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });
    const lever = new THREE.Mesh(leverGeo, leverMat);
    lever.rotation.x = -0.08;

    const holeGeo = new THREE.TorusGeometry(0.035, 0.012, 8, 16);
    const holeMat = new THREE.MeshStandardMaterial({
      color: T.alumDark,
      metalness: 0.8,
      roughness: 0.3,
    });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.x = -Math.PI / 2;
    hole.position.set(0, 0.02, 0.22);

    g.add(rivet);
    g.add(lever);
    g.add(hole);
    g.position.set(0, 1.06, 0);
    return g;
  }, []);

  return <primitive object={tabGroup} />;
}

function BottomRim() {
  const geo = useMemo(() => {
    return new THREE.TorusGeometry(0.55, 0.025, 12, 48);
  }, []);

  return (
    <mesh
      geometry={geo}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, -1.08, 0]}
    >
      <meshPhysicalMaterial
        color={T.aluminum}
        metalness={0.95}
        roughness={0.1}
        clearcoat={0.8}
        clearcoatRoughness={0.05}
      />
    </mesh>
  );
}

function SodaCan() {
  return (
    <group rotation={[0.08, 0.3, 0]}>
      <CanBody />
      <LabelBand />
      <LabelStripe />
      <CanTop />
      <PullTab />
      <BottomRim />
      <WaterDroplets />
      <CondensationRing />
    </group>
  );
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={3} color="#f8f0ff" />

      <spotLight
        position={[5, 7, 6]}
        intensity={3.5}
        angle={0.45}
        penumbra={0.35}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#fff5f0"
      />

      <spotLight
        position={[-6, 5, -5]}
        intensity={5.0}
        angle={0.55}
        penumbra={0.8}
        color={T.coldBlue}
      />

      <pointLight
        position={[0, -3, 3]}
        intensity={2.0}
        color={T.brand}
        distance={10}
      />

      <pointLight
        position={[3, 2, 3]}
        intensity={1.0}
        color="#ffffff"
        distance={8}
      />

      <pointLight
        position={[-3, 0, 4]}
        intensity={0.8}
        color={T.warmHighlight}
        distance={8}
      />

      <hemisphereLight args={["#f0e8ff", "#ffffff", 0.3]} />
    </>
  );
}




// // FUNCIÓN DE GIROSCOPIO //  //

function Giroscopio({ children }: { children: React.ReactNode }) {
  // Referencia al grupo 3D que contiene los objetos que conforman el modelo a girar
  const groupRef = useRef<THREE.Group>(null);

  // Almacena los valores recibidos directamente del giroscopio
  const rotation = useRef({
    x: 0, // Velocidad angular del eje X en radianes por segundo
    y: 0, // Velocidad angular del eje Y en radianes por segundo
    z: 0, // Velocidad angular del eje Z en radianes por segundo
  });

  // Almacena los valores suavizados que controlarán el modelo
  const smooth = useRef({
    x: 0, // Rotación suavizada del eje X
    y: 0, // Rotación suavizada del eje Y
  });

  // Ejecuta la configuración del giroscopio cuando se monta el componente
  useEffect(() => {
    // Establece la frecuencia de actualización del giroscopio a 16 ms
    Gyroscope.setUpdateInterval(16);

    // Se suscribe a los datos que proporciona el giroscopio
    const subscription = Gyroscope.addListener((data) => {
      rotation.current.x = data.x; // Guarda la velocidad angular recibida en el eje X
      rotation.current.y = data.y; // Guarda la velocidad angular recibida en el eje Y
      rotation.current.z = data.z; // Guarda la velocidad angular recibida en el eje Z
    });

    // Elimina la suscripción cuando se desmonta el componente
    return () => subscription.remove();
  }, []);

  // Se ejecuta en cada frame de animación de React Three Fiber
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calcula el factor de interpolación exponencial usando 2.5 como velocidad
    const smoothing = 1 - Math.exp(-2.5 * delta);

    // Acerca progresivamente la rotación suavizada X al valor del giroscopio
    smooth.current.x += (rotation.current.x - smooth.current.x) * smoothing;

    // Acerca progresivamente la rotación suavizada Y al valor del giroscopio
    smooth.current.y += (rotation.current.y - smooth.current.y) * smoothing;

    // Aplica la rotación suavizada al eje X con una sensibilidad del 50%
    // Se agrega 0.08 radianes como inclinación inicial
    groupRef.current.rotation.x = smooth.current.x * 0.5 + 0.08;

    // Aplica la rotación suavizada al eje Y con una sensibilidad del 50%.
    // Se agrega 0.3 radianes como orientación inicial
    groupRef.current.rotation.y = smooth.current.y * 0.5 + 0.3;

    // Posiciona de forma independiente del giroscopio
    // La frecuencia 0.5 controla la velocidad de oscilación
    // La amplitud 0.05 controla la distancia del movimiento
    groupRef.current.position.y =
      -0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  // Renderiza el grupo 3D y todos sus elementos que conforman el modelo
  return <group ref={groupRef}>{children}</group>;
}




export default function Object3DView() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={T.bgGradient as unknown as string[]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <Canvas
        shadows
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#FFFFFF", 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <StudioLighting />

        <Giroscopio>
          <SodaCan />
        </Giroscopio>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.9, 0]}
          receiveShadow
        >
          <planeGeometry args={[12, 12]} />
          <shadowMaterial transparent opacity={0.6} color="#000000" />
        </mesh>
      </Canvas>

      <View style={s.header}>
        <Pressable style={s.iconButton} onPress={() => router.push("/prueba")}>
          <Ionicons name="move-outline" size={32} color={T.textDim} />
        </Pressable>

        <View style={s.headerPill}>
          <Text style={s.headerDot}>●</Text>
          <Text style={s.headerText}>GIRA EL TELÉFONO</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 80 : 44,
    width: "100%",
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    gap: 8,
  },
  headerDot: {
    color: T.accent,
    fontSize: 8,
  },
  headerText: {
    color: T.textDim,
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: "600",
  },
});
